#!/usr/bin/env node
// Stage 4: Find, verify, and upload images for an enriched location
//
// Strategy:
//   Cover photo  → location-specific outdoor photo from scrape (rockhounding.org)
//   Gallery      → mineral specimen photos from Wikimedia Commons categories per gem type
//   All images verified with Claude vision before upload
//
// Usage:
//   node scripts/pipeline/04-find-images.js --slug foothills-of-sunset-peak-az
//   node scripts/pipeline/04-find-images.js --state arizona
//   node scripts/pipeline/04-find-images.js --state arizona --force

const fs = require('fs')
const path = require('path')
const https = require('https')
const http = require('http')
const { wikimediaLimiter, claudeLimiter } = require('./lib/pool')

const ENRICHED_DIR = path.join(__dirname, '../data/enriched')
const RAW_DIR = path.join(__dirname, '../data/raw')
const SEED_FILE = path.join(__dirname, '../data/seed-clean.json')

const ENV_PATH = path.join(__dirname, '../../.env.local')
const env = Object.fromEntries(
  fs.readFileSync(ENV_PATH, 'utf8').split('\n')
    .filter(l => l.includes('='))
    .map(l => { const [k, ...v] = l.split('='); return [k.trim(), v.join('=').trim()] })
)

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY
const ANTHROPIC_KEY = env.ANTHROPIC_API_KEY

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}
if (!ANTHROPIC_KEY) {
  console.error('Missing ANTHROPIC_API_KEY in .env.local')
  process.exit(1)
}

// Wikimedia Commons category name for each canonical gem type
const GEM_COMMONS_CATEGORY = {
  'Agate': 'Agate',
  'Amethyst': 'Amethyst',
  'Beryl': 'Beryl',
  'Calcite': 'Calcite',
  'Chalcedony': 'Chalcedony',
  'Chert': 'Chert',
  'Chrysocolla': 'Chrysocolla',
  'Citrine': 'Citrine',
  'Diamond': 'Diamond_(mineral)',
  'Emerald': 'Emerald',
  'Feldspar': 'Feldspar',
  'Fluorite': 'Fluorite',
  'Garnet': 'Garnet',
  'Gold': 'Native_gold',
  'Jade': 'Jade',
  'Jasper': 'Jasper',
  'Labradorite': 'Labradorite',
  'Lapis Lazuli': 'Lapis_lazuli',
  'Malachite': 'Malachite',
  'Mica': 'Mica',
  'Moonstone': 'Moonstone_(gemstone)',
  'Obsidian': 'Obsidian',
  'Onyx': 'Onyx',
  'Opal': 'Opal',
  'Peridot': 'Peridot',
  'Petrified Wood': 'Petrified_wood',
  'Quartz': 'Quartz',
  'Rose Quartz': 'Rose_quartz',
  'Ruby': 'Ruby',
  'Sapphire': 'Sapphire',
  'Serpentine': 'Serpentine_subgroup',
  'Silver': 'Native_silver',
  'Smoky Quartz': 'Smoky_quartz',
  'Sunstone': 'Sunstone',
  'Tanzanite': 'Tanzanite',
  'Tiger Eye': "Tiger's_eye_(mineral)",
  'Topaz': 'Topaz',
  'Tourmaline': 'Tourmaline',
  'Turquoise': 'Turquoise',
  'Zircon': 'Zircon',
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

// ── HTTP helpers ──────────────────────────────────────────────────────────────

function fetchBuffer(url, timeoutMs = 25000) {
  try { new URL(url) } catch { return Promise.resolve(null) }
  return new Promise((resolve) => {
    const mod = url.startsWith('https') ? https : http
    const req = mod.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; RockhoundingNear/1.0)' },
      timeout: timeoutMs,
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        resolve(fetchBuffer(res.headers.location, timeoutMs))
        return
      }
      if (res.statusCode !== 200) { resolve(null); return }
      const chunks = []
      res.on('data', c => chunks.push(c))
      res.on('end', () => resolve({
        buffer: Buffer.concat(chunks),
        contentType: (res.headers['content-type'] || 'image/jpeg').split(';')[0].trim(),
      }))
    })
    req.on('error', () => resolve(null))
    req.on('timeout', () => { req.destroy(); resolve(null) })
  })
}

function fetchText(url, timeoutMs = 15000) {
  return new Promise((resolve) => {
    const mod = url.startsWith('https') ? https : http
    const req = mod.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; RockhoundingNear/1.0)' },
      timeout: timeoutMs,
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        resolve(fetchText(res.headers.location, timeoutMs))
        return
      }
      if (res.statusCode !== 200) { resolve(null); return }
      let data = ''
      res.on('data', c => data += c)
      res.on('end', () => resolve(data))
    })
    req.on('error', () => resolve(null))
    req.on('timeout', () => { req.destroy(); resolve(null) })
  })
}

// ── Source 1: Location photos from raw scrape (rockhounding.org) ──────────────

function getScrapedLocationImages(slug) {
  const rawFile = path.join(RAW_DIR, `${slug}.json`)
  if (!fs.existsSync(rawFile)) return []
  const raw = JSON.parse(fs.readFileSync(rawFile, 'utf8'))
  return (raw.merged?.images_found || []).map(url => ({
    url,
    source: 'scrape',
    type: 'location',
    label: 'location photo',
  }))
}

// ── Source 2: Mineral specimen photos from Wikimedia Commons categories ───────

async function getWikimediaMineralPhotos(gemType, limit = 3) {
  // Search for actual specimen photos — more accurate than category browsing
  const query = encodeURIComponent(`${gemType} mineral specimen filetype:bitmap`)
  const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${query}&gsrnamespace=6&gsrlimit=${limit + 5}&prop=imageinfo&iiprop=url|extmetadata|size&iiurlwidth=1200&format=json`

  const text = await fetchText(url)
  if (!text) return []

  try {
    const data = JSON.parse(text)
    const pages = data.query?.pages || {}
    return Object.values(pages)
      .filter(p => {
        const info = p.imageinfo?.[0]
        if (!info?.url) return false
        // Only raster images
        const u = info.url.toLowerCase().split('?')[0]
        if (!u.match(/\.(jpg|jpeg|png|webp)(%[0-9a-f]{2})*$/i) && !u.match(/\.(jpg|jpeg|png|webp)$/)) {
          // Allow URLs with encoded extension
          if (!u.includes('.jpg') && !u.includes('.jpeg') && !u.includes('.png')) return false
        }
        // Only CC or public domain
        const license = info.extmetadata?.LicenseShortName?.value || ''
        return license.includes('CC') || license.toLowerCase().includes('public domain')
      })
      .slice(0, limit)
      .map(p => ({
        url: p.imageinfo[0].url,
        source: 'wikimedia',
        type: 'mineral',
        label: gemType,
        license: p.imageinfo[0].extmetadata?.LicenseShortName?.value || 'CC',
      }))
  } catch { return [] }
}

// ── Source 3: Bing Image Search via HTML scraping ─────────────────────────────
// Bing returns actual source image URLs (murl field) in its HTML response

async function getBingImages(loc, gemTypes) {
  const queries = [
    `${loc.name} ${loc.state} rockhounding site`,
    `${loc.name} ${loc.state} minerals rocks`,
    `${gemTypes.slice(0, 2).join(' ')} ${loc.nearest_city || loc.city || loc.state}`,
  ]

  const allUrls = []
  for (const query of queries) {
    await sleep(500)
    const url = `https://www.bing.com/images/search?q=${encodeURIComponent(query)}&form=HDRSC2&first=1`
    const html = await fetchText(url)
    if (!html) continue

    // Bing embeds source image URLs as URL-encoded "mediaurl=" query params
    const murlPattern = /mediaurl=(https?%3[aA]%2[fF]%2[fF][^&"]+)/g
    let m
    while ((m = murlPattern.exec(html)) !== null && allUrls.length < 15) {
      try {
        const decoded = decodeURIComponent(m[1])
        new URL(decoded)
        if (/\.(jpg|jpeg|png|webp)/i.test(decoded)) allUrls.push(decoded)
      } catch {}
    }
    if (allUrls.length >= 10) break
  }

  return [...new Set(allUrls)].slice(0, 12).map(url => ({
    url,
    source: 'bing',
    type: 'location',
    label: 'bing image',
  }))
}

// ── Source 5: Wikimedia Commons geosearch — photos taken near GPS coordinates ──
// This is the most relevant source: finds actual photos taken at/near the site

async function getWikimediaGeoPhotos(lat, lng, radiusMeters = 10000, limit = 8) {
  await wikimediaLimiter.wait()
  const url = `https://commons.wikimedia.org/w/api.php?action=query&list=geosearch&gscoord=${lat}|${lng}&gsradius=${radiusMeters}&gslimit=${limit}&gsnamespace=6&prop=imageinfo&iiprop=url|extmetadata|size&iiurlwidth=1200&format=json`
  const text = await fetchText(url)
  if (!text) return []
  try {
    const data = JSON.parse(text)
    const items = data.query?.geosearch || []
    if (!items.length) return []

    // Fetch imageinfo for the found pages
    const pageIds = items.map(i => i.pageid).join('|')
    await wikimediaLimiter.wait()
    const infoUrl = `https://commons.wikimedia.org/w/api.php?action=query&pageids=${pageIds}&prop=imageinfo&iiprop=url|extmetadata|size&iiurlwidth=1200&format=json`
    const infoText = await fetchText(infoUrl)
    if (!infoText) return []
    const infoData = JSON.parse(infoText)
    const pages = infoData.query?.pages || {}

    return Object.values(pages)
      .filter(p => {
        const info = p.imageinfo?.[0]
        if (!info?.url) return false
        const u = info.url.toLowerCase()
        if (!u.includes('.jpg') && !u.includes('.jpeg') && !u.includes('.png')) return false
        const license = info.extmetadata?.LicenseShortName?.value || ''
        return license.includes('CC') || license.toLowerCase().includes('public domain')
      })
      .slice(0, limit)
      .map(p => ({
        url: p.imageinfo[0].url,
        source: 'wikimedia_geo',
        type: 'location',
        label: 'nearby photo',
        license: p.imageinfo[0].extmetadata?.LicenseShortName?.value || 'CC',
      }))
  } catch { return [] }
}

// ── Source 6: iNaturalist — geotagged nature/geology observations near site ───
// iNaturalist has many rockhounders posting mineral finds with GPS coordinates

async function getINaturalistPhotos(lat, lng, gemTypes, radiusKm = 50) {
  // Search for rock/mineral observations near the coordinates
  // taxon_id 52950 = Minerals, 48460 = Plants (skip), 47126 = Animalia (skip)
  // We use a broad search with quality_grade=research and iconic_taxon_name filtering
  const taxonQuery = 'Minerals'
  const url = `https://api.inaturalist.org/v1/observations?lat=${lat}&lng=${lng}&radius=${radiusKm}&quality_grade=research&order_by=votes&per_page=15&photos=true&license=cc-by,cc-by-sa,cc-by-nc,cc0`
  const text = await fetchText(url)
  if (!text) return []
  try {
    const data = JSON.parse(text)
    const results = data.results || []
    const photos = []
    for (const obs of results) {
      const photo = obs.photos?.[0]
      if (!photo) continue
      const url = (photo.url || '').replace('square', 'large')
      if (!url.includes('http')) continue
      photos.push({
        url,
        source: 'inaturalist',
        type: 'location',
        label: obs.taxon?.name || 'nature observation',
        license: photo.license_code || 'cc',
      })
    }
    return photos.slice(0, 5)
  } catch { return [] }
}

// ── Claude vision verification ────────────────────────────────────────────────

async function callClaudeVision(imageBase64, contentType, prompt) {
  await claudeLimiter.wait()
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 50,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: contentType, data: imageBase64 },
          },
          { type: 'text', text: prompt },
        ],
      }],
    })
    const req = https.request({
      hostname: 'api.anthropic.com',
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
        'content-length': Buffer.byteLength(body),
      },
    }, (res) => {
      let data = ''
      res.on('data', c => data += c)
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data)
          resolve(parsed.content?.[0]?.text?.trim().toUpperCase() || 'REJECT')
        } catch { resolve('REJECT') }
      })
    })
    req.on('error', () => resolve('REJECT'))
    req.write(body)
    req.end()
  })
}

async function verifyLocationPhoto(buffer, contentType, locationName, state, terrain) {
  const base64 = buffer.toString('base64')
  const prompt = `Look at this image. Is it an outdoor photograph of a natural landscape, rocky terrain, desert, canyon, hillside, riverbed, or geological feature that could reasonably be a rockhounding location in ${state}?

ACCEPT only if: clearly an outdoor natural landscape/terrain photo (rocks, desert, forest, mountains, dry wash, cliff face, open field).
REJECT if: mineral specimen closeup, logo, text overlay, indoor photo, stock illustration, screenshot, portrait, unrelated scenery (beach, city, garden).

Reply with exactly one word: ACCEPT or REJECT`
  const result = await callClaudeVision(base64, contentType, prompt)
  return result.startsWith('ACCEPT')
}

async function verifyMineralPhoto(buffer, contentType, gemType) {
  const base64 = buffer.toString('base64')
  const prompt = `Look at this image. Is this a clear photograph of a ${gemType} mineral specimen, crystal, or rock sample?

ACCEPT only if: clearly shows ${gemType} (correct color, form, texture for this mineral). The specimen should be recognizable as ${gemType}.
REJECT if: wrong mineral, outdoor landscape, logo, text overlay, stock illustration, blurry, or unrelated.

Reply with exactly one word: ACCEPT or REJECT`
  const result = await callClaudeVision(base64, contentType, prompt)
  return result.startsWith('ACCEPT')
}

// ── Upload to Supabase Storage ────────────────────────────────────────────────

async function uploadToSupabase(buffer, contentType, stateSlug, slug, filename) {
  const storagePath = `${stateSlug}/${slug}/${filename}`
  const hostname = SUPABASE_URL.replace(/^https?:\/\//, '')

  return new Promise((resolve) => {
    const req = https.request({
      hostname,
      path: `/storage/v1/object/location-images/${storagePath}`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Content-Type': contentType,
        'Content-Length': buffer.length,
        'x-upsert': 'true',
      },
    }, (res) => {
      let data = ''
      res.on('data', c => data += c)
      res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          resolve(`${SUPABASE_URL}/storage/v1/object/public/location-images/${storagePath}`)
        } else {
          console.error(`    ! upload failed ${res.statusCode}: ${data.slice(0, 100)}`)
          resolve(null)
        }
      })
    })
    req.on('error', () => resolve(null))
    req.write(buffer)
    req.end()
  })
}

// ── Update enriched JSON ──────────────────────────────────────────────────────

function updateEnrichedFile(slug, coverPhoto, images) {
  const outFile = path.join(ENRICHED_DIR, `${slug}.json`)
  if (!fs.existsSync(outFile)) return
  const data = JSON.parse(fs.readFileSync(outFile, 'utf8'))
  if (coverPhoto) data.cover_photo = coverPhoto
  if (images.length > 0) {
    data.images = [...new Set([...(data.images || []), ...images])]
  }
  data.images_processed_at = new Date().toISOString()
  fs.writeFileSync(outFile, JSON.stringify(data, null, 2))
}

// ── Main per-location function ────────────────────────────────────────────────

async function findImages(loc, forceOrOpts = false) {
  const opts = typeof forceOrOpts === 'object' ? forceOrOpts : { force: forceOrOpts }
  const force = opts.force || false
  const enrichedFile = path.join(ENRICHED_DIR, `${loc.slug}.json`)
  if (!fs.existsSync(enrichedFile)) {
    console.log(`  ↩ skip (not enriched): ${loc.slug}`)
    return
  }

  const enriched = JSON.parse(fs.readFileSync(enrichedFile, 'utf8'))

  if (!force && enriched.images_processed_at && (enriched.cover_photo || enriched.images?.length > 0)) {
    console.log(`  ↩ skip (images exist): ${loc.slug}`)
    return
  }

  const gemTypes = enriched.gem_types || []
  const terrain = enriched.terrain_notes || ''
  console.log(`  → finding images: ${loc.name} [${gemTypes.slice(0, 3).join(', ')}]`)

  let coverPhoto = null
  const locationImages = [] // outdoor/site photos
  const mineralImages = []  // specimen photos

  async function tryLocationPhoto(candidate, label) {
    if (coverPhoto) return
    const result = await fetchBuffer(candidate.url)
    if (!result || result.buffer.length < 30000) return
    if (!result.contentType.startsWith('image/')) return
    const accepted = await verifyLocationPhoto(result.buffer, result.contentType, loc.name, loc.state, terrain)
    if (accepted) {
      const ext = result.contentType.includes('png') ? 'png' : 'jpg'
      const publicUrl = await uploadToSupabase(result.buffer, result.contentType, loc.state_slug, loc.slug, `cover.${ext}`)
      if (publicUrl) {
        coverPhoto = publicUrl
        console.log(`    + cover [${label}] (${Math.round(result.buffer.length / 1024)}KB)`)
      }
    }
  }

  // ── Pass 1: Bing Image Search — finds real location + mineral photos ─────────
  console.log(`    searching Bing Images...`)
  const bingPhotos = await getBingImages(loc, gemTypes)
  console.log(`    found ${bingPhotos.length} Bing image candidates`)
  for (const candidate of bingPhotos) {
    await tryLocationPhoto(candidate, 'bing')
    if (coverPhoto) break
  }

  // ── Pass 2: Wikimedia geosearch — photos actually taken near these coordinates
  if (!coverPhoto) {
    console.log(`    searching Wikimedia geosearch near ${loc.lat},${loc.lng}...`)
    const geoPhotos = await getWikimediaGeoPhotos(loc.lat, loc.lng, 15000, 8)
    console.log(`    found ${geoPhotos.length} geo photos`)
    for (const candidate of geoPhotos) {
      await tryLocationPhoto(candidate, 'wikimedia_geo')
      if (coverPhoto) break
    }
  }

  // ── Pass 3: iNaturalist observations near coordinates ─────────────────────
  if (!coverPhoto) {
    console.log(`    searching iNaturalist near ${loc.lat},${loc.lng}...`)
    const inatPhotos = await getINaturalistPhotos(loc.lat, loc.lng, gemTypes)
    console.log(`    found ${inatPhotos.length} iNaturalist photos`)
    for (const candidate of inatPhotos) {
      await tryLocationPhoto(candidate, 'inaturalist')
      if (coverPhoto) break
    }
  }

  // ── Pass 4: Location photos from scrape sources ───────────────────────────
  if (!coverPhoto) {
    const scrapedImages = getScrapedLocationImages(loc.slug)
    for (const candidate of scrapedImages.slice(0, 4)) {
      await tryLocationPhoto(candidate, 'scrape')
      if (coverPhoto) break
    }
  }

  // ── Pass 5: Mineral specimen photos from Wikimedia Commons ───────────────
  for (const gemType of gemTypes.slice(0, 3)) {
    if (mineralImages.length >= 3) break
    await wikimediaLimiter.wait()
    const candidates = await getWikimediaMineralPhotos(gemType, 5)

    for (const candidate of candidates) {
      if (mineralImages.length >= 3) break

      const result = await fetchBuffer(candidate.url)
      if (!result || result.buffer.length < 20000) continue
      if (!result.contentType.startsWith('image/')) continue

      const accepted = await verifyMineralPhoto(result.buffer, result.contentType, gemType)

      if (accepted) {
        const idx = mineralImages.length + 1
        const ext = result.contentType.includes('png') ? 'png' : 'jpg'
        const publicUrl = await uploadToSupabase(result.buffer, result.contentType, loc.state_slug, loc.slug, `mineral-${idx}-${gemType.toLowerCase().replace(/\s+/g, '-')}.${ext}`)
        if (publicUrl) {
          mineralImages.push(publicUrl)
          console.log(`    + mineral: ${gemType} (${Math.round(result.buffer.length / 1024)}KB)`)
        }
      }
    }
  }

  // Promote first mineral photo as cover if no location photo found
  if (!coverPhoto && mineralImages.length > 0) {
    coverPhoto = mineralImages.shift()
    console.log(`    ~ using mineral photo as cover (no location photo found)`)
  }

  updateEnrichedFile(loc.slug, coverPhoto, mineralImages)

  const total = (coverPhoto ? 1 : 0) + mineralImages.length
  console.log(`  ✓ ${loc.name} — ${total} image(s) saved`)
}

// ── CLI entry ─────────────────────────────────────────────────────────────────

async function main() {
  const seed = JSON.parse(fs.readFileSync(SEED_FILE, 'utf8'))
  const locations = seed.locations || seed
  const args = process.argv.slice(2)
  const force = args.includes('--force')
  const slugIdx = args.indexOf('--slug')
  const stateIdx = args.indexOf('--state')

  let toProcess = []

  if (slugIdx >= 0) {
    const slug = args[slugIdx + 1]
    const loc = locations.find(l => l.slug === slug)
    if (!loc) { console.error(`Slug not found: ${slug}`); process.exit(1) }
    toProcess = [loc]
  } else if (stateIdx >= 0) {
    const stateSlug = args[stateIdx + 1]
    toProcess = locations.filter(l => l.state_slug === stateSlug)
    console.log(`Finding images for ${toProcess.length} locations in ${stateSlug}`)
  } else {
    console.log('Usage:')
    console.log('  node 04-find-images.js --slug <slug>')
    console.log('  node 04-find-images.js --state <state-slug>')
    process.exit(1)
  }

  for (const loc of toProcess) {
    await findImages(loc, force)
  }

  console.log(`\nDone. ${toProcess.length} location(s) processed.`)
}

if (require.main === module) main().catch(err => { console.error(err); process.exit(1) })
module.exports = { findImages }
