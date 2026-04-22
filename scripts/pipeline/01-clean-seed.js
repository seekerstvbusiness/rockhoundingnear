#!/usr/bin/env node
// Stage 1: Clean the raw seed JSON → scripts/data/seed-clean.json
//
// Usage: node scripts/pipeline/01-clean-seed.js [--skip-geocode] [--state AZ]
//
// --skip-geocode  Skip Nominatim reverse geocoding (fast, city/county will be null)
// --state XX      Only process a specific state code (for testing)

const fs = require('fs')
const path = require('path')
const { STATE_BY_CODE, isVagueName, toSlug } = require('./lib/canonical.js')
const { reverseGeocode } = require('./lib/geocode.js')

const INPUT = path.join(__dirname, '../../rockhounding locations.json')
const OUTPUT = path.join(__dirname, '../data/seed-clean.json')
const FLAGGED = path.join(__dirname, '../data/seed-flagged.json')

const args = process.argv.slice(2)
const skipGeocode = args.includes('--skip-geocode')
const filterState = (() => {
  const idx = args.indexOf('--state')
  return idx >= 0 ? args[idx + 1]?.toUpperCase() : null
})()

async function main() {
  console.log('Reading seed JSON...')
  const raw = JSON.parse(fs.readFileSync(INPUT, 'utf8'))
  const all = raw.locations || raw

  // Step 1: Filter to US only
  let locations = all.filter(l => l.country_code === 'US')
  console.log(`US locations: ${locations.length} of ${all.length} total`)

  // Step 2: Optional state filter (for testing)
  if (filterState) {
    locations = locations.filter(l => l.state_code === filterState)
    console.log(`Filtered to ${filterState}: ${locations.length} locations`)
  }

  // Step 3: Map state_code → state info
  const valid = []
  const flagged = []

  for (const loc of locations) {
    const stateInfo = STATE_BY_CODE[loc.state_code]
    if (!stateInfo) {
      flagged.push({ ...loc, flag: 'unknown_state_code' })
      continue
    }

    // Step 4: Remove vague names
    if (isVagueName(loc.name)) {
      flagged.push({ ...loc, state: stateInfo.name, state_slug: stateInfo.slug, flag: 'vague_name' })
      continue
    }

    // Step 5: Validate coordinates (continental US + AK/HI rough bounds)
    const lat = parseFloat(loc.lat)
    const lng = parseFloat(loc.lng)
    if (isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) {
      flagged.push({ ...loc, flag: 'invalid_coords' })
      continue
    }
    if (lat < 18 || lat > 72 || lng < -180 || lng > -65) {
      flagged.push({ ...loc, flag: 'out_of_bounds_coords', lat, lng })
      continue
    }

    // Build clean slug (ensure no state suffix clash)
    const baseSlug = toSlug(loc.name)
    const slug = baseSlug + '-' + stateInfo.abbreviation.toLowerCase()

    valid.push({
      id: loc.id,
      slug,
      name: loc.name,
      lat,
      lng,
      state: stateInfo.name,
      state_slug: stateInfo.slug,
      state_code: stateInfo.abbreviation,
      city: null,
      city_slug: null,
      county: null,
      county_slug: null,
    })
  }

  console.log(`\nValid: ${valid.length} | Flagged: ${flagged.length}`)

  // Step 6: Deduplicate by proximity (0.001 degree ≈ 100m)
  const deduped = []
  const seen = []
  for (const loc of valid) {
    const isDupe = seen.some(s =>
      Math.abs(s.lat - loc.lat) < 0.001 && Math.abs(s.lng - loc.lng) < 0.001
    )
    if (isDupe) {
      flagged.push({ ...loc, flag: 'duplicate_coords' })
    } else {
      seen.push(loc)
      deduped.push(loc)
    }
  }
  console.log(`After dedup: ${deduped.length}`)

  // Step 7: Reverse geocode (rate limited, slow — skip with --skip-geocode)
  if (!skipGeocode) {
    console.log(`\nReverse geocoding ${deduped.length} locations (${Math.ceil(deduped.length * 1.1 / 60)} min est.)...`)
    for (let i = 0; i < deduped.length; i++) {
      const loc = deduped[i]
      if (i % 50 === 0) console.log(`  ${i}/${deduped.length}...`)
      const geo = await reverseGeocode(loc.lat, loc.lng)
      if (geo) {
        loc.city = geo.city
        loc.city_slug = geo.city ? toSlug(geo.city) : null
        loc.county = geo.county
        loc.county_slug = geo.county ? toSlug(geo.county) : null
      }
    }
  } else {
    console.log('Skipping geocoding (--skip-geocode)')
  }

  // Step 8: State breakdown
  const byState = {}
  for (const loc of deduped) {
    byState[loc.state_slug] = (byState[loc.state_slug] || 0) + 1
  }
  const stateBreakdown = Object.entries(byState)
    .sort((a, b) => b[1] - a[1])
    .map(([slug, count]) => ({ state_slug: slug, count }))

  // Write outputs
  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true })
  fs.writeFileSync(OUTPUT, JSON.stringify({ locations: deduped, generated_at: new Date().toISOString() }, null, 2))
  fs.writeFileSync(FLAGGED, JSON.stringify({ locations: flagged, generated_at: new Date().toISOString() }, null, 2))

  console.log(`\n✓ seed-clean.json written — ${deduped.length} locations`)
  console.log(`✓ seed-flagged.json written — ${flagged.length} flagged\n`)
  console.log('State breakdown (top 15):')
  stateBreakdown.slice(0, 15).forEach(s => console.log(`  ${s.state_slug}: ${s.count}`))
  console.log(`\nNext step: /scrape-state arizona  (or whichever state you want to start with)`)
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
