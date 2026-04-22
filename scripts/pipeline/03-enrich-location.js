#!/usr/bin/env node
// Stage 3: AI-enrich a scraped location using Claude API
//
// Usage:
//   node scripts/pipeline/03-enrich-location.js --slug foothills-of-sunset-peak-az
//   node scripts/pipeline/03-enrich-location.js --state arizona
//   node scripts/pipeline/03-enrich-location.js --state arizona --force  (re-enrich even if exists)

const fs = require('fs')
const path = require('path')
const https = require('https')
const { claudeLimiter } = require('./lib/pool')

const SEED_FILE = path.join(__dirname, '../data/seed-clean.json')
const RAW_DIR = path.join(__dirname, '../data/raw')
const ENRICHED_DIR = path.join(__dirname, '../data/enriched')

fs.mkdirSync(ENRICHED_DIR, { recursive: true })

const ENV_PATH = path.join(__dirname, '../../.env.local')
const env = Object.fromEntries(
  fs.readFileSync(ENV_PATH, 'utf8').split('\n')
    .filter(l => l.includes('='))
    .map(l => { const [k, ...v] = l.split('='); return [k.trim(), v.join('=').trim()] })
)
const ANTHROPIC_KEY = env.ANTHROPIC_API_KEY
if (!ANTHROPIC_KEY) { console.error('Missing ANTHROPIC_API_KEY in .env.local'); process.exit(1) }

const GEM_TYPES = [
  'Agate','Amethyst','Beryl','Calcite','Chalcedony','Chert','Chrysocolla','Citrine',
  'Diamond','Emerald','Feldspar','Fluorite','Garnet','Gold','Jade','Jasper',
  'Labradorite','Lapis Lazuli','Malachite','Mica','Moonstone','Obsidian','Onyx',
  'Opal','Peridot','Petrified Wood','Quartz','Rose Quartz','Ruby','Sapphire',
  'Serpentine','Silver','Smoky Quartz','Sunstone','Tanzanite','Tiger Eye','Topaz',
  'Tourmaline','Turquoise','Zircon',
]

const HAZARDS = ['snakes','cliffs','abandoned_mines','heat','cold','flash_floods','sharp_material','loose_rock','wildlife','remote']

async function callClaude(messages, systemPrompt) {
  await claudeLimiter.wait()
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 4000,
      system: systemPrompt,
      messages,
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
          if (parsed.error) reject(new Error(parsed.error.message))
          else resolve(parsed.content[0].text)
        } catch (e) { reject(e) }
      })
    })
    req.on('error', reject)
    req.write(body)
    req.end()
  })
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

const SYSTEM_PROMPT = `You are a rockhounding expert and geologist writing location guides for RockhoundingNear.com.
You have deep knowledge of US geology, mineral formations, state land regulations, and rockhounding best practices.
You write accurate, practical, helpful content for rockhounds of all skill levels.

CRITICAL RULES:
- Never invent permit requirements, fees, or collection rules without a source
- Never use em dashes (—), en dashes (–), smart quotes (" " ' '), or ellipsis (…)
- Use plain hyphens ( - ) instead of dashes
- Use straight quotes only
- Always output valid JSON only — no markdown fences, no preamble

ALWAYS GENERATE (never return null for these fields):
- history: Use your expert knowledge of US geology and mining history. Even without a specific source, write 1-2 sentences about the geological formation that created the minerals here, or historical mining/prospecting activity in this region. Example: "This area sits within the Basin and Range province where Miocene volcanic activity deposited silica-rich fluids that formed the agate nodules found here today."
- dog_friendly: Default true for BLM/national forest/public land. Default false for fee dig sites, most state parks, and private land. Only null if access type is genuinely unknown.
- kid_age_range: Always provide: "6+" for easy sites, "8+" for moderate, "12+" for hard, "16+" for expert. Never null.
- accessibility_notes: Always describe terrain and access. For easy: "Relatively flat terrain accessible to most hikers. Unpaved road to parking area." For moderate: "Uneven rocky terrain, no wheelchair access. Sturdy footwear required." For hard/expert: "Rough backcountry terrain, significant hiking required. Not suitable for limited mobility."
- best_season: Always provide specific months or range. Use climate logic: Southwest deserts (AZ,NM,NV,TX,CA low elevation): "October - April". Mountain/high elevation (CO,MT,ID,WY above 6000ft): "June - September". Pacific Northwest: "May - September". Southeast: "March - May, September - November". Great Plains: "April - June, September - October".
- tips: Always generate 2-4 practical tips specific to the gem types found here and the terrain.
- geology_notes: Always write about the geological formation and why this location has the minerals it does. Draw on your knowledge of US state geology.

ONLY use null for: fee_amount (if not a fee site), permit_link (if no permit needed), cover_photo, images, cell_service (if no data).

GEM TYPE CANONICAL LIST (use exact strings only):
${GEM_TYPES.join(', ')}

HAZARD CANONICAL LIST (use exact strings only):
${HAZARDS.join(', ')}

PRIMARY CATEGORY VALUES: public_blm, national_forest, fee_dig, private, state_park, other
DIFFICULTY VALUES: easy, moderate, hard, expert
ACCESS TYPE VALUES: public, private, fee, permit
VEHICLE VALUES: passenger, awd, 4x4, atv, hiking
CELL SERVICE VALUES: none, spotty, reliable`

function buildTerrainContext(terrain) {
  if (!terrain) return '(no terrain data)'
  const lines = []
  if (terrain.elevation) lines.push(`- Elevation: ${terrain.elevation.feet} ft (${terrain.elevation.meters} m)`)
  if (terrain.slope) lines.push(`- Slope: ${terrain.slope}`)
  if (terrain.nearest_city) lines.push(`- Nearest city: ${terrain.nearest_city.name}, ${terrain.nearest_city.distance_mi} miles away (pop. ${terrain.nearest_city.population?.toLocaleString() || 'unknown'})`)
  if (terrain.roads?.length) {
    const road = terrain.roads[0]
    const roadName = [road.name, road.ref].filter(Boolean).join(' / ')
    lines.push(`- Nearest major road: ${roadName} (${road.dist} miles, ${road.type})`)
    if (terrain.roads[1]) {
      const r2 = terrain.roads[1]
      lines.push(`- Also nearby: ${[r2.name, r2.ref].filter(Boolean).join(' / ')} (${r2.dist} mi)`)
    }
  }
  if (terrain.water_features?.length) {
    lines.push(`- Nearby water: ${terrain.water_features.map(w => `${w.name} (${w.type}, ${w.dist} mi)`).join(', ')}`)
  }
  if (terrain.protected_areas?.length) {
    lines.push(`- Protected/managed land: ${terrain.protected_areas.map(a => a.name).join(', ')}`)
  }
  return lines.join('\n')
}

function buildPrompt(loc, raw) {
  const snippets = raw?.merged?.description_snippets?.join('\n\n') || ''
  const landHint = raw?.merged?.land_type || ''
  const terrainContext = buildTerrainContext(raw?.terrain)

  const geocodedCity = raw?.geocoded_city || null
  const isCounty = (c) => c && (c.toLowerCase().includes('county') || c.toLowerCase().includes('parish'))
  const terrainNearestCity = raw?.terrain?.nearest_city
  const promptCity = geocodedCity || (!isCounty(loc.city) ? loc.city : null) || terrainNearestCity?.name || (isCounty(loc.city) ? `near ${loc.city}` : null) || 'unknown'

  return `Generate a complete enriched JSON record for this rockhounding location.

LOCATION FACTS:
- Name: ${loc.name}
- State: ${loc.state}
- City/Nearest Town: ${promptCity}
- County: ${loc.county || 'unknown'}
- GPS: ${loc.lat}, ${loc.lng}
- Land type hint: ${landHint || 'unknown'}

TERRAIN DATA (from USGS elevation + OpenStreetMap — use these facts directly in your content):
${terrainContext}

SCRAPED SOURCE CONTENT:
${snippets || '(no scraped content available - use your knowledge of this region, geology, and common finds)'}

FIELD INSTRUCTIONS:

written_directions: Write specific driving directions using the TERRAIN DATA roads above as your reference. Start from nearest_city, name the actual highway/road from terrain data, and give approximate distances. Example: "From Morenci, take US 191 north for 5 miles. Look for a dirt pullout on the west side of the road near the canyon wash." Use null only if you truly cannot construct plausible directions from the data provided.

nearest_city: The closest named city or town (not just a county or region). Use your geographic knowledge of the state.

nearest_city_distance: Approximate miles from nearest_city to this GPS location. Estimate from your knowledge.

collection_rules: Be specific about what is and is not allowed. For BLM land always include: "Personal use only. Maximum 25 lbs per day per FLPMA. No commercial collection. No motorized excavation." For fee digs, include what the fee covers. For state parks, note the no-collection rule.

rules: Same as collection_rules but phrased as a short bulleted plain text list (use newlines, not actual bullets). Null if no specific rules apply.

quantity_limits: Specific weight or count limit if known. For BLM: "25 lbs per day". For fee digs: "keep what you find". Else null.

faq: Write 6 SEO-optimized questions that rockhounders actually search for. Questions should:
- Be specific to THIS location (mention actual gem types, access type, terrain)
- Include long-tail search phrases people use ("how to find [gem] in [state]", "rockhounding near [city]")
- Cover: what to find, cost/access, permits, best season, tools needed, beginner suitability
- Answers must be specific, not generic — reference actual details of this location
- Vary the question phrasing — never start two questions the same way

meta_title: SEO title under 60 chars. Format: "[Location Name] Rockhounding - [State]" or "Find [Gem] at [Location], [State]"
meta_description: SEO description 140-155 chars. Mention 2-3 gem types, access type, and a call to action.

OUTPUT a single JSON object with ALL of these fields. Use null for unknown values.
Do not include fields not listed here. Output raw JSON only.

{
  "slug": "${loc.slug}",
  "name": "${loc.name}",
  "state": "${loc.state}",
  "state_slug": "${loc.state_slug}",
  "city": ${JSON.stringify(loc.city)},
  "city_slug": ${JSON.stringify(loc.city_slug)},
  "county": ${JSON.stringify(loc.county)},
  "county_slug": ${JSON.stringify(loc.county_slug)},
  "lat": ${loc.lat},
  "lng": ${loc.lng},
  "gem_types": ["use canonical list - at least 1 item, be specific to this location"],
  "short_description": "1-2 sentences max 200 chars - mention specific gem types and what makes this site worth visiting",
  "description": "3-5 paragraphs separated by \\n\\n - site overview, local geology, what to expect, unique qualities, collecting tips integrated naturally",
  "history": "1-2 sentences about geological formation or mining/prospecting history - ALWAYS PROVIDE, use your geology knowledge if no specific source",
  "tips": "2-4 specific practical sentences: WHERE exactly to search (wash, hillside, outcrop), WHAT tools work best here, WHAT to look for (color, shape, size) - ALWAYS PROVIDE",
  "terrain_notes": "specific terrain description - elevation, slope, vegetation, walking distance from parking, footing difficulty",
  "best_season": "specific months or range like 'October - April' or 'Year-round' with brief reason - ALWAYS PROVIDE based on state climate",
  "written_directions": "specific driving directions from nearest town - see instructions above",
  "directions": null,
  "difficulty": "easy|moderate|hard|expert",
  "access_type": "public|private|fee|permit",
  "primary_category": "public_blm|national_forest|fee_dig|private|state_park|other",
  "vehicle_required": "passenger|awd|4x4|atv|hiking",
  "road_conditions": "describe road surface, washboard, clearance needed, or null",
  "parking_notes": "describe parking area - pullout, lot, capacity, or null",
  "cell_service": "none|spotty|reliable",
  "remoteness_rating": 3,  // integer 1 (near town) to 5 (very remote) — never outside 1-5
  "permit_required": false,
  "permit_link": null,
  "fee_amount": null,
  "commercial_use_allowed": false,
  "collection_rules": "specific rules - see instructions above",
  "quantity_limits": "per instructions above",
  "rules": "plain text list - see instructions above",
  "beginner_friendly": true,
  "family_friendly": null,
  "dog_friendly": true,
  "kid_age_range": "8+",
  "hazards": ["ONLY use values from this exact list: snakes, cliffs, abandoned_mines, heat, cold, flash_floods, sharp_material, loose_rock, wildlife, remote"],
  "nearest_services": "nearest town with gas/food/water, approximate distance",
  "accessibility_notes": "describe terrain accessibility - ALWAYS PROVIDE based on difficulty level",
  "alternative_names": [],
  "nearest_city": "closest named city - see instructions",
  "nearest_city_distance": 0,
  "cover_photo": null,
  "images": [],
  "faq": [
    {"question": "SEO question 1 - specific to this location", "answer": "specific answer mentioning actual gem types and access details"},
    {"question": "SEO question 2", "answer": "..."},
    {"question": "SEO question 3", "answer": "..."},
    {"question": "SEO question 4", "answer": "..."},
    {"question": "SEO question 5", "answer": "..."},
    {"question": "SEO question 6", "answer": "..."}
  ],
  "meta_title": "under 60 chars - see instructions",
  "meta_description": "140-155 chars - see instructions",
  "featured": false,
  "published": false,
  "needs_review_fields": ["list fields where value was uncertain or inferred without a source"]
}`
}

function sanitizeStr(s) {
  if (typeof s !== 'string') return s
  return s
    .replace(/\uFFFD/g, '')
    .replace(/[—–]/g, '-')
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'")
    .replace(/…/g, '...')
}

function sanitizeStrings(obj) {
  if (!obj || typeof obj !== 'object') return
  for (const key of Object.keys(obj)) {
    if (typeof obj[key] === 'string') obj[key] = sanitizeStr(obj[key])
    else if (Array.isArray(obj[key])) obj[key] = obj[key].map(v => typeof v === 'string' ? sanitizeStr(v) : (typeof v === 'object' ? (sanitizeStrings(v), v) : v))
    else if (typeof obj[key] === 'object' && obj[key] !== null) sanitizeStrings(obj[key])
  }
}

async function enrichLocation(loc, force = false) {
  const outFile = path.join(ENRICHED_DIR, `${loc.slug}.json`)

  if (!force && fs.existsSync(outFile)) {
    console.log(`  ↩ skip (exists): ${loc.slug}`)
    return
  }

  const rawFile = path.join(RAW_DIR, `${loc.slug}.json`)
  const raw = fs.existsSync(rawFile) ? JSON.parse(fs.readFileSync(rawFile, 'utf8')) : null

  console.log(`  → enriching: ${loc.name} (scrape: ${raw?.scrape_quality || 'none'})`)

  let text
  try {
    text = await callClaude(
      [{ role: 'user', content: buildPrompt(loc, raw) }],
      SYSTEM_PROMPT
    )
  } catch (err) {
    console.error(`  ✗ Claude API error for ${loc.slug}: ${err.message}`)
    return
  }

  // Parse JSON — strip any accidental markdown fences
  let enriched
  try {
    const cleaned = text.replace(/^```json?\s*/i, '').replace(/\s*```$/i, '').trim()
    enriched = JSON.parse(cleaned)
  } catch (e) {
    console.error(`  ✗ JSON parse error for ${loc.slug}`)
    console.error('  Raw response:', text.slice(0, 200))
    return
  }

  // Always enforce the canonical slug (Claude sometimes reformats it)
  enriched.slug = loc.slug

  // Truncate short_description to 200 chars max (validation hard limit)
  if (enriched.short_description && enriched.short_description.length > 200) {
    enriched.short_description = enriched.short_description.slice(0, 197) + '...'
  }

  // Sanitize all string fields — remove replacement chars and normalize dashes/quotes
  sanitizeStrings(enriched)

  // Clamp remoteness_rating to valid 1-5 range
  if (enriched.remoteness_rating != null) {
    enriched.remoteness_rating = Math.min(5, Math.max(1, Math.round(enriched.remoteness_rating)))
  }

  // Filter gem_types to canonical values only (Claude sometimes adds non-canonical ones)
  if (Array.isArray(enriched.gem_types)) {
    const filtered = enriched.gem_types.filter(g => GEM_TYPES.includes(g))
    if (filtered.length === 0 && enriched.gem_types.length > 0) {
      // Log the bad values but keep at least Quartz as a fallback rather than empty
      console.log(`  ! filtered all gem_types (non-canonical: ${enriched.gem_types.join(', ')}) — defaulting to Quartz`)
      enriched.gem_types = ['Quartz']
    } else {
      enriched.gem_types = filtered
    }
  }

  // Filter hazards to canonical values only
  if (Array.isArray(enriched.hazards)) {
    const VALID_HAZARDS = ['snakes','cliffs','abandoned_mines','heat','cold','flash_floods','sharp_material','loose_rock','wildlife','remote']
    enriched.hazards = enriched.hazards.filter(h => VALID_HAZARDS.includes(h))
  }

  // Fallbacks: fill fields Claude left null when we have seed/terrain/geocode data
  const geocodedCity = raw?.geocoded_city || null
  const isCountyAsCity = (name) => name && (name.toLowerCase().includes('county') || name.toLowerCase().includes('parish'))
  const seedCity = isCountyAsCity(loc.city) ? null : (loc.city || null)
  const terrainCity = raw?.terrain?.nearest_city?.name || null
  // Prefer: geocoded > seed (non-county) > terrain nearest > seed county fallback > null
  const resolvedCity = geocodedCity || seedCity || terrainCity || (isCountyAsCity(loc.city) ? `${loc.county || loc.city.replace(/\s+county$/i, '').trim()} Area` : null)
  if (!enriched.city || isCountyAsCity(enriched.city)) enriched.city = resolvedCity
  if (!enriched.city_slug && enriched.city) enriched.city_slug = enriched.city.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  else if (!enriched.city_slug && loc.city_slug && !isCountyAsCity(loc.city)) enriched.city_slug = loc.city_slug
  if (!enriched.county && loc.county) enriched.county = loc.county
  if (!enriched.county_slug && loc.county_slug) enriched.county_slug = loc.county_slug
  const terrainCityObj = raw?.terrain?.nearest_city
  if (!enriched.nearest_city) {
    if (terrainCityObj?.name) {
      enriched.nearest_city = terrainCityObj.name
      enriched.nearest_city_distance = terrainCityObj.distance_mi
    } else if (loc.city && !isCountyAsCity(loc.city)) {
      enriched.nearest_city = loc.city
      enriched.needs_review_fields = [...(enriched.needs_review_fields || []), 'nearest_city_distance']
    }
  }
  if (!enriched.nearest_city_distance && terrainCityObj?.distance_mi) {
    enriched.nearest_city_distance = terrainCityObj.distance_mi
  }

  // Store road name from terrain data so address can be built at import time
  const nearestRoad = raw?.terrain?.roads?.[0]
  if (!enriched.road_name && nearestRoad) {
    enriched.road_name = [nearestRoad.name, nearestRoad.ref].filter(Boolean).join(' / ') || null
  }

  enriched.enriched_at = new Date().toISOString()
  enriched.scrape_quality = raw?.scrape_quality || 'none'

  fs.writeFileSync(outFile, JSON.stringify(enriched, null, 2))
  const gemCount = enriched.gem_types?.length || 0
  const reviewCount = enriched.needs_review_fields?.length || 0
  console.log(`  ✓ ${loc.name} - ${gemCount} gem types - ${reviewCount} needs_review fields`)
}

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
    console.log(`Enriching ${toProcess.length} locations in ${stateSlug}`)
  } else {
    console.log('Usage:')
    console.log('  node 03-enrich-location.js --slug <slug>')
    console.log('  node 03-enrich-location.js --state <state-slug>')
    process.exit(1)
  }

  for (let i = 0; i < toProcess.length; i++) {
    await enrichLocation(toProcess[i], force)
  }

  console.log(`\nDone. ${toProcess.length} location(s) processed.`)
}

if (require.main === module) main().catch(err => { console.error(err); process.exit(1) })
module.exports = { enrichLocation }
