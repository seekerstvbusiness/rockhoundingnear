#!/usr/bin/env node
// Stage 2: Scrape raw data for a single location from multiple sources
//
// Usage:
//   node scripts/pipeline/02-scrape-location.js --slug foothills-of-sunset-peak-az
//   node scripts/pipeline/02-scrape-location.js --state arizona

const fs = require('fs')
const path = require('path')
const https = require('https')
const http = require('http')
const { execSync } = require('child_process')
const { analyzeTerrainFull } = require('./lib/terrain')

const SEED_FILE = path.join(__dirname, '../data/seed-clean.json')
const RAW_DIR = path.join(__dirname, '../data/raw')

fs.mkdirSync(RAW_DIR, { recursive: true })

// ── HTTP helpers ──────────────────────────────────────────────────────────────

function fetchText(url, timeoutMs = 15000) {
  return new Promise((resolve) => {
    const mod = url.startsWith('https') ? https : http
    const req = mod.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; RockhoundingNear/1.0; +https://rockhoundingnear.com)',
        'Accept': 'text/html,application/xhtml+xml',
      },
      timeout: timeoutMs,
    }, (res) => {
      // follow one redirect
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

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

// ── agent-browser helper ──────────────────────────────────────────────────────
// Returns text snapshot of a JS-rendered page, or null on failure

function browserSnapshot(url, sessionName = 'default') {
  const sess = `--session ${sessionName}`
  try {
    execSync(`agent-browser ${sess} open "${url}"`, { timeout: 20000, stdio: 'pipe' })
    const out = execSync(`agent-browser ${sess} snapshot`, { timeout: 15000 }).toString()
    execSync(`agent-browser ${sess} close`, { timeout: 5000, stdio: 'pipe' })
    return out
  } catch {
    try { execSync(`agent-browser ${sess} close`, { stdio: 'pipe' }) } catch {}
    return null
  }
}

// ── Text extraction helpers ───────────────────────────────────────────────────

function sanitize(text) {
  return text
    .replace(/\uFFFD/g, '')
    .replace(/[—–]/g, '-')
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'")
    .replace(/…/g, '...')
}

function stripTags(html) {
  return sanitize(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .trim()
  )
}

function extractBetween(text, start, end) {
  const i = text.toLowerCase().indexOf(start.toLowerCase())
  if (i === -1) return null
  const j = text.toLowerCase().indexOf(end.toLowerCase(), i + start.length)
  if (j === -1) return text.slice(i + start.length, i + start.length + 500)
  return text.slice(i + start.length, j)
}

function extractImages(html, baseUrl) {
  const imgs = []
  const re = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi
  let m
  while ((m = re.exec(html)) !== null) {
    let src = m[1]
    if (src.startsWith('//')) src = 'https:' + src
    else if (src.startsWith('/')) {
      try { src = new URL(src, baseUrl).href } catch { continue }
    }
    if (!src.startsWith('http')) continue
    // skip tiny icons and logos
    const lower = src.toLowerCase()
    if (lower.includes('logo') || lower.includes('icon') || lower.includes('banner')) continue
    imgs.push(src)
  }
  return [...new Set(imgs)]
}

// ── Source scrapers ───────────────────────────────────────────────────────────

async function scrapeRockhoundingOrg(loc) {
  // Try the state-level guide which often contains specific location mentions
  const stateNameSlug = loc.state.toLowerCase().replace(/\s+/g, '-')
  const url = `https://rockhounding.org/gem-and-mineral-hunting/rockhounding-in-${stateNameSlug}.html`
  const html = await fetchText(url)
  if (!html) return { found: false, url }

  const text = stripTags(html)
  const nameWords = loc.name.toLowerCase().split(' ').filter(w => w.length > 3)
  const hasMatch = nameWords.some(w => text.toLowerCase().includes(w))
  if (!hasMatch) return { found: false, url }

  // Extract the relevant section around the location name match
  const idx = text.toLowerCase().indexOf(nameWords[0])
  const snippet = text.slice(Math.max(0, idx - 100), idx + 1000)

  return {
    found: true,
    url,
    description_snippet: snippet,
    images_found: extractImages(html, url).slice(0, 3),
  }
}

async function scrapeRockhoundResource(loc) {
  const stateUrl = `https://rockhoundresource.com/state-by-state-rockhounding-location-guides-maps/`
  const snap = browserSnapshot(stateUrl)
  if (!snap) return { found: false }

  const nameNorm = loc.name.toLowerCase()
  if (!snap.toLowerCase().includes(nameNorm.split(' ')[0])) return { found: false }

  return {
    found: true,
    url: stateUrl,
    description_snippet: snap.slice(0, 1000),
  }
}

async function scrapeMindat(loc) {
  // Search mindat via their text search endpoint
  const query = encodeURIComponent(`${loc.name} ${loc.state}`)
  const url = `https://www.mindat.org/search.php?q=${query}`
  const html = await fetchText(url)
  if (!html) return { found: false, url }

  const text = stripTags(html)
  const nameWords = loc.name.toLowerCase().split(' ').filter(w => w.length > 3)
  const hasMatch = nameWords.some(w => text.toLowerCase().includes(w))
  if (!hasMatch) return { found: false, url }

  return {
    found: true,
    url,
    description_snippet: text.slice(0, 1500),
  }
}

async function scrapeWebSearch(loc) {
  // DuckDuckGo HTML search — no API key needed
  const query = encodeURIComponent(`"${loc.name}" ${loc.state} rockhounding minerals`)
  const url = `https://html.duckduckgo.com/html/?q=${query}`
  const html = await fetchText(url)
  if (!html) return { found: false }

  const text = stripTags(html)
  const nameWords = loc.name.toLowerCase().split(' ').filter(w => w.length > 3)
  const hasMatch = nameWords.some(w => text.toLowerCase().includes(w))

  return {
    found: hasMatch,
    url: `https://duckduckgo.com/?q=${query}`,
    description_snippet: hasMatch ? text.slice(0, 2000) : null,
  }
}

async function scrapeBLM(loc) {
  // Try BLM state office page
  const url = `https://www.blm.gov/programs/recreation/permits-and-fees`
  // Light check — just note BLM land types commonly associated with this state
  const blmStates = ['arizona', 'nevada', 'utah', 'new-mexico', 'california', 'oregon', 'wyoming', 'idaho', 'colorado', 'montana']
  if (!blmStates.includes(loc.state_slug)) return { found: false }

  return {
    found: true,
    url,
    land_type_hint: 'public_blm',
    description_snippet: `${loc.state} BLM land — typical rules: personal use only, no permit required for recreational collecting, 25 lb/day limit per FLPMA.`,
  }
}

async function scrapeAllTrails(loc) {
  const query = encodeURIComponent(`${loc.name} ${loc.state}`)
  const url = `https://www.alltrails.com/search?q=${query}`
  const html = await fetchText(url)
  if (!html) return { found: false, url }

  const text = stripTags(html)
  const nameWords = loc.name.toLowerCase().split(' ').filter(w => w.length > 3)
  const hasMatch = nameWords.some(w => text.toLowerCase().includes(w))
  if (!hasMatch) return { found: false, url }

  return {
    found: true,
    url,
    description_snippet: text.slice(0, 800),
  }
}

async function scrapeRockhoundingMap(loc) {
  // rockhoundingmap.com has a search API
  const query = encodeURIComponent(loc.name)
  const url = `https://rockhoundingmap.com/?s=${query}`
  const html = await fetchText(url)
  if (!html) return { found: false, url }

  const text = stripTags(html)
  const nameWords = loc.name.toLowerCase().split(' ').filter(w => w.length > 3)
  const hasMatch = nameWords.some(w => text.toLowerCase().includes(w))

  return {
    found: hasMatch,
    url,
    description_snippet: hasMatch ? text.slice(0, 800) : null,
  }
}

// ── Merge extracted data ──────────────────────────────────────────────────────

function mergeData(results) {
  const snippets = []
  const images = []
  let land_type = null
  let quality = 'minimal'

  for (const [source, data] of Object.entries(results)) {
    if (!data.found) continue
    if (data.description_snippet) snippets.push(`[${source}] ${data.description_snippet}`)
    if (data.images_found) images.push(...data.images_found)
    if (data.land_type_hint) land_type = data.land_type_hint
  }

  const sourcesFound = Object.values(results).filter(d => d.found).length
  if (sourcesFound >= 3) quality = 'rich'
  else if (sourcesFound >= 1) quality = 'partial'

  return {
    description_snippets: snippets,
    images_found: [...new Set(images)].slice(0, 8),
    land_type,
    scrape_quality: quality,
    sources_found: sourcesFound,
  }
}

// ── Reverse geocoding (fill null city/address from lat/lng) ───────────────────

async function reverseGeocode(lat, lng) {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`
  const text = await fetchText(url)
  if (!text) return null
  try {
    const geo = JSON.parse(text)
    const a = geo.address || {}
    const city = a.city || a.town || a.village || a.hamlet || a.suburb || null
    const county = a.county || null
    // Avoid using just county as city — use "X County Area" if nothing better
    const cityResolved = city || (county ? `${county} Area` : null)
    return {
      city: cityResolved,
      county: county,
      state: a.state || null,
      zip: a.postcode || null,
      road: a.road || a.track || null,
      display: geo.display_name || null,
    }
  } catch { return null }
}

// ── Main scrape function ──────────────────────────────────────────────────────

async function scrapeLocation(loc, opts = {}) {
  const force = opts.force || false
  const sessionName = opts.sessionName || 'default'
  const outFile = path.join(RAW_DIR, `${loc.slug}.json`)

  // Skip if already scraped (unless --force)
  if (!force && fs.existsSync(outFile)) {
    const existing = JSON.parse(fs.readFileSync(outFile, 'utf8'))
    if (existing.scrape_quality !== 'minimal') {
      console.log(`  ↩ skip (already scraped: ${existing.scrape_quality}): ${loc.slug}`)
      return { skipped: true }
    }
  }

  console.log(`  → scraping: ${loc.name} (${loc.state}) [${sessionName}]`)

  const results = {}

  // Reverse geocode to fill missing city/address data before scraping
  let geocodedCity = loc.city || null
  if (!loc.city || loc.city.toLowerCase().includes('county')) {
    const geo = await reverseGeocode(loc.lat, loc.lng)
    if (geo) {
      geocodedCity = geo.city
      if (!loc.city && geo.city) loc = { ...loc, city: geo.city, city_slug: geo.city.toLowerCase().replace(/[^a-z0-9]+/g, '-') }
      if (!loc.county && geo.county) loc = { ...loc, county: geo.county }
    }
    await sleep(1100) // Nominatim 1 req/sec policy
  }

  // Run scrapers
  results.rockhounding_org = await scrapeRockhoundingOrg(loc)
  await sleep(300)

  results.mindat = await scrapeMindat(loc)
  await sleep(300)

  results.blm = await scrapeBLM(loc)

  results.rockhounding_map = await scrapeRockhoundingMap(loc)
  await sleep(300)

  results.alltrails = await scrapeAllTrails(loc)
  await sleep(300)

  // Web search fallback — always run to capture any remaining context
  results.web_search = await scrapeWebSearch(loc)
  await sleep(300)

  const merged = mergeData(results)

  // Terrain analysis via USGS elevation + OpenStreetMap
  console.log(`    analyzing terrain...`)
  let terrain = null
  try {
    terrain = await analyzeTerrainFull(loc.lat, loc.lng)
    const elevStr = terrain.elevation ? `${terrain.elevation.feet}ft` : '?'
    const cityStr = terrain.nearest_city ? `${terrain.nearest_city.name} (${terrain.nearest_city.distance_mi}mi)` : 'unknown'
    console.log(`    terrain: ${elevStr} | city: ${cityStr} | slope: ${terrain.slope || '?'}`)
  } catch (err) {
    console.error(`    terrain error: ${err.message}`)
  }

  const output = {
    slug: loc.slug,
    name: loc.name,
    lat: loc.lat,
    lng: loc.lng,
    state: loc.state,
    state_slug: loc.state_slug,
    state_code: loc.state_code,
    city: loc.city,
    city_slug: loc.city_slug,
    county: loc.county,
    county_slug: loc.county_slug,
    geocoded_city: geocodedCity,
    sources: results,
    merged,
    terrain,
    scraped_at: new Date().toISOString(),
    scrape_quality: merged.scrape_quality,
  }

  fs.writeFileSync(outFile, JSON.stringify(output, null, 2))
  console.log(`  ✓ ${loc.name} — quality: ${merged.scrape_quality} — sources: ${merged.sources_found}`)
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
    console.log(`Scraping ${toProcess.length} locations in ${stateSlug}`)
  } else {
    console.log('Usage:')
    console.log('  node 02-scrape-location.js --slug <slug>')
    console.log('  node 02-scrape-location.js --state <state-slug>')
    process.exit(1)
  }

  for (const loc of toProcess) {
    await scrapeLocation(loc, { force })
    await sleep(200)
  }

  console.log(`\nDone. ${toProcess.length} location(s) processed.`)
}

if (require.main === module) main().catch(err => { console.error(err); process.exit(1) })
module.exports = { scrapeLocation }
