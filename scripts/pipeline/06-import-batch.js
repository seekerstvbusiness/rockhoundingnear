#!/usr/bin/env node
// Stage 6: Import validated locations to Supabase
//
// Usage:
//   node scripts/pipeline/06-import-batch.js --state arizona
//   node scripts/pipeline/06-import-batch.js --file scripts/data/validated/my-batch.json
//   node scripts/pipeline/06-import-batch.js --state arizona --dry-run

const fs = require('fs')
const path = require('path')
const https = require('https')

const VALIDATED_DIR = path.join(__dirname, '../data/validated')
const IMPORTED_LOG = path.join(__dirname, '../data/imported.log')

// Load env
function loadEnv() {
  const envPath = path.join(__dirname, '../../.env.local')
  const lines = fs.readFileSync(envPath, 'utf8').split('\n')
  const env = {}
  for (const line of lines) {
    const [key, ...rest] = line.split('=')
    if (key?.trim()) env[key.trim()] = rest.join('=').trim()
  }
  return env
}

function getImportedSlugs() {
  if (!fs.existsSync(IMPORTED_LOG)) return new Set()
  return new Set(fs.readFileSync(IMPORTED_LOG, 'utf8').split('\n').filter(Boolean))
}

function appendImported(slugs) {
  fs.appendFileSync(IMPORTED_LOG, slugs.join('\n') + '\n')
}

function supabaseRequest(url, key, method, path, body) {
  return new Promise((resolve, reject) => {
    const bodyStr = body ? JSON.stringify(body) : null
    const opts = {
      method,
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
        ...(bodyStr ? { 'Content-Length': Buffer.byteLength(bodyStr) } : {}),
      },
    }
    const req = https.request(`${url}${path}`, opts, (res) => {
      let data = ''
      res.on('data', c => data += c)
      res.on('end', () => resolve({ status: res.statusCode, body: data }))
    })
    req.on('error', reject)
    if (bodyStr) req.write(bodyStr)
    req.end()
  })
}

// Single-record upsert: check if slug exists → PATCH to update, else POST to insert
// Called by the pipeline immediately after each location passes validation
async function importOne(loc) {
  const env = loadEnv()
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceKey) throw new Error('Missing Supabase env vars')
  const record = toDbRecord(loc)

  // Check if record with this slug already exists
  const check = await supabaseRequest(supabaseUrl, serviceKey, 'GET',
    `/rest/v1/locations?slug=eq.${encodeURIComponent(loc.slug)}&select=id`, null)

  let existingId = null
  try {
    const rows = JSON.parse(check.body)
    if (Array.isArray(rows) && rows.length > 0) existingId = rows[0].id
  } catch {}

  let res
  if (existingId) {
    // PATCH existing record (update all fields, preserve published status)
    res = await supabaseRequest(supabaseUrl, serviceKey, 'PATCH',
      `/rest/v1/locations?id=eq.${existingId}`, record)
  } else {
    // POST new record
    res = await supabaseRequest(supabaseUrl, serviceKey, 'POST',
      '/rest/v1/locations', [record])
  }

  if (res.status < 200 || res.status >= 300) {
    throw new Error(`Supabase ${existingId ? 'PATCH' : 'POST'} error ${res.status}: ${res.body.slice(0, 200)}`)
  }
  appendImported([loc.slug])
}

function supabaseUpsert(url, key, records) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(records)
    const opts = {
      method: 'POST',
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      },
    }
    const req = https.request(`${url}/rest/v1/locations`, opts, (res) => {
      let data = ''
      res.on('data', c => data += c)
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) resolve({ ok: true })
        else reject(new Error(`Supabase error ${res.statusCode}: ${data.slice(0, 300)}`))
      })
    })
    req.on('error', reject)
    req.write(body)
    req.end()
  })
}

function buildAddress(loc) {
  // Build a human-readable address from available data
  // e.g. "US 191, Clifton, AZ" or "Near Wickenburg, AZ"
  const parts = []
  if (loc.road_name) parts.push(loc.road_name)
  if (loc.city && !loc.city.toLowerCase().includes('county') && !loc.city.toLowerCase().includes('area')) parts.push(loc.city)
  else if (loc.nearest_city) parts.push(loc.nearest_city)
  if (loc.state) {
    // Get state abbreviation from state name
    const stateAbbr = { 'Alabama':'AL','Alaska':'AK','Arizona':'AZ','Arkansas':'AR','California':'CA','Colorado':'CO','Connecticut':'CT','Delaware':'DE','Florida':'FL','Georgia':'GA','Hawaii':'HI','Idaho':'ID','Illinois':'IL','Indiana':'IN','Iowa':'IA','Kansas':'KS','Kentucky':'KY','Louisiana':'LA','Maine':'ME','Maryland':'MD','Massachusetts':'MA','Michigan':'MI','Minnesota':'MN','Mississippi':'MS','Missouri':'MO','Montana':'MT','Nebraska':'NE','Nevada':'NV','New Hampshire':'NH','New Jersey':'NJ','New Mexico':'NM','New York':'NY','North Carolina':'NC','North Dakota':'ND','Ohio':'OH','Oklahoma':'OK','Oregon':'OR','Pennsylvania':'PA','Rhode Island':'RI','South Carolina':'SC','South Dakota':'SD','Tennessee':'TN','Texas':'TX','Utah':'UT','Vermont':'VT','Virginia':'VA','Washington':'WA','West Virginia':'WV','Wisconsin':'WI','Wyoming':'WY' }
    parts.push(stateAbbr[loc.state] || loc.state)
  }
  return parts.length > 0 ? parts.join(', ') : null
}

function toDbRecord(loc) {
  // Map enriched JSON fields → DB column names
  // Note: seed uses lat/lng, DB uses latitude/longitude
  return {
    name: loc.name,
    slug: loc.slug,
    state: loc.state,
    state_slug: loc.state_slug,
    city: loc.city,
    city_slug: loc.city_slug,
    county: loc.county || null,
    county_slug: loc.county_slug || null,
    latitude: loc.lat ?? loc.latitude,
    longitude: loc.lng ?? loc.longitude,
    address: loc.address || buildAddress(loc),
    nearest_city: loc.nearest_city || null,
    nearest_city_distance: loc.nearest_city_distance || null,
    alternative_names: loc.alternative_names || [],
    short_description: loc.short_description || null,
    description: loc.description || null,
    history: loc.history || null,
    tips: loc.tips || null,
    terrain_notes: loc.terrain_notes || null,
    accessibility_notes: loc.accessibility_notes || null,
    best_season: loc.best_season || null,
    gem_types: loc.gem_types || [],
    difficulty: loc.difficulty || null,
    access_type: loc.access_type || null,
    primary_category: loc.primary_category || null,
    vehicle_required: loc.vehicle_required || null,
    road_conditions: loc.road_conditions || null,
    parking_notes: loc.parking_notes || null,
    written_directions: loc.written_directions || null,
    directions: loc.directions || (
      (loc.lat ?? loc.latitude) && (loc.lng ?? loc.longitude)
        ? `https://maps.google.com/?q=${loc.lat ?? loc.latitude},${loc.lng ?? loc.longitude}`
        : null
    ),
    cell_service: loc.cell_service || null,
    remoteness_rating: loc.remoteness_rating || null,
    permit_required: loc.permit_required ?? false,
    permit_link: loc.permit_link || null,
    fee_amount: loc.fee_amount ?? null,
    commercial_use_allowed: loc.commercial_use_allowed ?? false,
    collection_rules: loc.collection_rules || null,
    quantity_limits: loc.quantity_limits || null,
    rules: loc.rules || null,
    beginner_friendly: loc.beginner_friendly ?? null,
    family_friendly: loc.family_friendly ?? null,
    dog_friendly: loc.dog_friendly ?? null,
    kid_age_range: loc.kid_age_range || null,
    hazards: loc.hazards || [],
    nearest_services: loc.nearest_services || null,
    cover_photo: loc.cover_photo || null,
    images: loc.images || [],
    faq: loc.faq || [],
    meta_title: loc.meta_title || null,
    meta_description: loc.meta_description || null,
    featured: false,
    published: false, // always false — flip manually after review
  }
}

async function main() {
  const args = process.argv.slice(2)
  const stateIdx = args.indexOf('--state')
  const fileIdx = args.indexOf('--file')
  const dryRun = args.includes('--dry-run')

  let records = []

  if (stateIdx >= 0) {
    const stateSlug = args[stateIdx + 1]
    const files = fs.readdirSync(VALIDATED_DIR).filter(f => f.endsWith('.json'))
    for (const f of files) {
      const loc = JSON.parse(fs.readFileSync(path.join(VALIDATED_DIR, f), 'utf8'))
      if (loc.state_slug === stateSlug) records.push(loc)
    }
    console.log(`Found ${records.length} validated locations for ${stateSlug}`)
  } else if (fileIdx >= 0) {
    const filePath = args[fileIdx + 1]
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    records = Array.isArray(data) ? data : data.locations
    console.log(`Loaded ${records.length} locations from ${filePath}`)
  } else {
    console.log('Usage:')
    console.log('  node 06-import-batch.js --state <state-slug> [--dry-run]')
    console.log('  node 06-import-batch.js --file <path> [--dry-run]')
    process.exit(1)
  }

  // Filter already imported
  const imported = getImportedSlugs()
  const toImport = records.filter(r => !imported.has(r.slug))
  const skipped = records.length - toImport.length
  if (skipped > 0) console.log(`Skipping ${skipped} already imported`)
  if (toImport.length === 0) { console.log('Nothing to import.'); return }

  if (dryRun) {
    console.log(`[DRY RUN] Would import ${toImport.length} locations:`)
    toImport.forEach(r => console.log(`  - ${r.slug}`))
    return
  }

  const env = loadEnv()
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceKey) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
    process.exit(1)
  }

  // Batch insert 50 at a time
  const BATCH = 50
  let totalImported = 0
  for (let i = 0; i < toImport.length; i += BATCH) {
    const batch = toImport.slice(i, i + BATCH)
    const dbRecords = batch.map(toDbRecord)
    try {
      await supabaseUpsert(supabaseUrl, serviceKey, dbRecords)
      appendImported(batch.map(r => r.slug))
      totalImported += batch.length
      console.log(`Batch ${Math.floor(i/BATCH)+1}: imported ${batch.length} records (total: ${totalImported})`)
    } catch (err) {
      console.error(`Batch ${Math.floor(i/BATCH)+1} FAILED: ${err.message}`)
      console.error('Slugs in this batch:', batch.map(r => r.slug).join(', '))
    }
  }

  console.log(`\n✓ Import complete — ${totalImported} locations imported`)
  console.log(`\nTo publish after reviewing, run in Supabase SQL editor:`)
  console.log(`  UPDATE locations SET published = true`)
  console.log(`  WHERE state_slug = '...' AND published = false`)
  console.log(`  AND created_at > NOW() - INTERVAL '2 hours';`)
}

if (require.main === module) {
  main().catch(err => {
    console.error('Fatal:', err)
    process.exit(1)
  })
}

module.exports = { toDbRecord, importOne }
