#!/usr/bin/env node
// Re-enrich all locations already in Supabase and PATCH them with improved data
//
// Usage:
//   node scripts/pipeline/update-existing.js
//   node scripts/pipeline/update-existing.js --dry-run

const fs = require('fs')
const path = require('path')
const https = require('https')

const ENV_PATH = path.join(__dirname, '../../.env.local')
const env = Object.fromEntries(
  fs.readFileSync(ENV_PATH, 'utf8').split('\n')
    .filter(l => l.includes('='))
    .map(l => { const [k, ...v] = l.split('='); return [k.trim(), v.join('=').trim()] })
)
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY

const RAW_DIR = path.join(__dirname, '../data/raw')
const ENRICHED_DIR = path.join(__dirname, '../data/enriched')
fs.mkdirSync(RAW_DIR, { recursive: true })
fs.mkdirSync(ENRICHED_DIR, { recursive: true })

const { scrapeLocation } = require('./02-scrape-location')
const { enrichLocation } = require('./03-enrich-location')
const { STATE_BY_SLUG } = require('./lib/canonical')
const { toDbRecord } = (() => {
  try { return require('./06-import-batch') } catch {}
  // inline fallback
  return {
    toDbRecord(loc) {
      return {
        name: loc.name, slug: loc.slug, state: loc.state, state_slug: loc.state_slug,
        city: loc.city || null, city_slug: loc.city_slug || null,
        county: loc.county || null, county_slug: loc.county_slug || null,
        latitude: loc.lat ?? loc.latitude, longitude: loc.lng ?? loc.longitude,
        nearest_city: loc.nearest_city || null, nearest_city_distance: loc.nearest_city_distance || null,
        short_description: loc.short_description || null, description: loc.description || null,
        history: loc.history || null, tips: loc.tips || null, terrain_notes: loc.terrain_notes || null,
        best_season: loc.best_season || null, gem_types: loc.gem_types || [],
        difficulty: loc.difficulty || null, access_type: loc.access_type || null,
        primary_category: loc.primary_category || null, vehicle_required: loc.vehicle_required || null,
        road_conditions: loc.road_conditions || null, parking_notes: loc.parking_notes || null,
        written_directions: loc.written_directions || null, cell_service: loc.cell_service || null,
        remoteness_rating: loc.remoteness_rating || null,
        permit_required: loc.permit_required ?? false, permit_link: loc.permit_link || null,
        fee_amount: loc.fee_amount ?? null, commercial_use_allowed: loc.commercial_use_allowed ?? false,
        collection_rules: loc.collection_rules || null, quantity_limits: loc.quantity_limits || null,
        rules: loc.rules || null, beginner_friendly: loc.beginner_friendly ?? null,
        family_friendly: loc.family_friendly ?? null, dog_friendly: loc.dog_friendly ?? null,
        kid_age_range: loc.kid_age_range || null, hazards: loc.hazards || [],
        nearest_services: loc.nearest_services || null, alternative_names: loc.alternative_names || [],
        accessibility_notes: loc.accessibility_notes || null,
        cover_photo: loc.cover_photo || null, images: loc.images || [],
        faq: loc.faq || [], meta_title: loc.meta_title || null, meta_description: loc.meta_description || null,
      }
    }
  }
})()

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

// ── Fetch all locations from Supabase ─────────────────────────────────────────

function fetchSupabase(path, method = 'GET', body = null, extraHeaders = {}) {
  return new Promise((resolve, reject) => {
    const hostname = SUPABASE_URL.replace(/^https?:\/\//, '')
    const bodyStr = body ? JSON.stringify(body) : null
    const req = https.request({
      hostname,
      path,
      method,
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json',
        ...(bodyStr ? { 'Content-Length': Buffer.byteLength(bodyStr) } : {}),
        ...extraHeaders,
      },
    }, (res) => {
      let d = ''
      res.on('data', c => d += c)
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: d ? JSON.parse(d) : null }) }
        catch { resolve({ status: res.statusCode, data: d }) }
      })
    })
    req.on('error', reject)
    if (bodyStr) req.write(bodyStr)
    req.end()
  })
}

async function getAllLocations() {
  const res = await fetchSupabase(
    '/rest/v1/locations?select=slug,name,state,state_slug,latitude,longitude,city,city_slug,county,county_slug,cover_photo,images&order=created_at',
    'GET', null, { 'Accept': 'application/json' }
  )
  if (res.status !== 200) throw new Error(`Supabase fetch failed: ${res.status} ${JSON.stringify(res.data).slice(0,200)}`)
  return res.data
}

async function patchLocation(slug, updates) {
  const res = await fetchSupabase(
    `/rest/v1/locations?slug=eq.${encodeURIComponent(slug)}`,
    'PATCH',
    updates,
    { 'Prefer': 'return=minimal' }
  )
  if (res.status < 200 || res.status >= 300) {
    throw new Error(`PATCH failed ${res.status}: ${JSON.stringify(res.data).slice(0,200)}`)
  }
  return true
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const dryRun = process.argv.includes('--dry-run')

  console.log('Fetching existing locations from Supabase...')
  const locations = await getAllLocations()
  console.log(`Found ${locations.length} locations to update\n`)

  let updated = 0, failed = 0

  for (const loc of locations) {
    // Normalize: DB uses latitude/longitude, pipeline uses lat/lng
    const stateInfo = STATE_BY_SLUG[loc.state_slug] || {}
    const seed = {
      ...loc,
      lat: parseFloat(loc.latitude),
      lng: parseFloat(loc.longitude),
      state_code: stateInfo.abbreviation || loc.state_slug.toUpperCase().slice(0, 2),
      state: stateInfo.name || loc.state || loc.state_slug,
    }

    console.log(`\n[${updated + failed + 1}/${locations.length}] ${loc.name} (${loc.state_slug})`)

    try {
      // Stage 2: Re-scrape with terrain data (force to get terrain)
      console.log('  scraping + terrain...')
      await scrapeLocation(seed, { force: true })
      await sleep(500)

      // Stage 3: Re-enrich with improved prompt
      console.log('  enriching...')
      await enrichLocation(seed, true)
      await sleep(300)

      // Read the freshly enriched file
      const enrichedFile = path.join(ENRICHED_DIR, `${loc.slug}.json`)
      if (!fs.existsSync(enrichedFile)) {
        console.error('  ✗ enriched file not found after enrichment')
        failed++
        continue
      }

      const enriched = JSON.parse(fs.readFileSync(enrichedFile, 'utf8'))

      // Preserve existing images (don't overwrite with null)
      if (loc.cover_photo && !enriched.cover_photo) enriched.cover_photo = loc.cover_photo
      if (loc.images?.length && !enriched.images?.length) enriched.images = loc.images

      const dbRecord = toDbRecord({ ...enriched, lat: seed.lat, lng: seed.lng })

      // Remove fields that should not be patched (keep published status as-is)
      delete dbRecord.featured
      delete dbRecord.published

      if (dryRun) {
        console.log(`  DRY RUN — would patch: directions=${dbRecord.written_directions?.slice(0,60) || 'null'} nearest_city=${dbRecord.nearest_city}`)
        updated++
        continue
      }

      await patchLocation(loc.slug, dbRecord)
      console.log(`  ✓ patched — nearest_city: ${dbRecord.nearest_city || 'null'} | directions: ${dbRecord.written_directions ? 'yes' : 'null'}`)
      updated++

    } catch (err) {
      console.error(`  ✗ failed: ${err.message}`)
      failed++
    }

    await sleep(400)
  }

  console.log(`\n${'═'.repeat(50)}`)
  console.log(`Done — ${updated} updated, ${failed} failed`)
  if (!dryRun) console.log('All locations patched in Supabase. Review in dashboard before publishing.')
}

main().catch(err => { console.error(err); process.exit(1) })
