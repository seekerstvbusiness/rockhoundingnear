// Terrain analysis helpers using free public APIs
// - USGS EPQS: elevation in feet (US only, no rate limit)
// - Overpass API (OpenStreetMap): nearby cities, roads, water, land use

const https = require('https')
const http = require('http')
const { overpassLimiter } = require('./pool')

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

// ── Haversine distance (miles) ────────────────────────────────────────────────

function haversine(lat1, lng1, lat2, lng2) {
  const R = 3958.8
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

// ── USGS Elevation Point Query Service ───────────────────────────────────────

function getElevation(lat, lng) {
  return new Promise((resolve) => {
    const url = `https://epqs.nationalmap.gov/v1/json?x=${lng}&y=${lat}&units=Feet&wkid=4326&includeDate=false`
    https.get(url, { headers: { 'User-Agent': 'RockhoundingNear/1.0' }, timeout: 10000 }, (res) => {
      let d = ''; res.on('data', c => d += c)
      res.on('end', () => {
        try {
          const j = JSON.parse(d)
          const feet = j.value
          if (!feet || feet < 0 || feet > 30000) { resolve(null); return }
          resolve({
            feet: Math.round(feet),
            meters: Math.round(feet * 0.3048),
          })
        } catch { resolve(null) }
      })
    }).on('error', () => resolve(null)).on('timeout', function() { this.destroy(); resolve(null) })
  })
}

// Estimate slope by sampling 4 points ~200m away
async function getSlopeEstimate(lat, lng) {
  const offset = 0.002 // ~200m
  const points = [
    [lat + offset, lng],
    [lat - offset, lng],
    [lat, lng + offset],
    [lat, lng - offset],
  ]
  const elevations = await Promise.all(points.map(([la, lo]) => getElevation(la, lo)))
  const valid = elevations.filter(Boolean).map(e => e.feet)
  if (valid.length < 2) return null
  const range = Math.max(...valid) - Math.min(...valid)
  // range over ~400m: < 50ft = flat, 50-200 = gentle, 200-500 = moderate, > 500 = steep
  if (range < 50) return 'flat'
  if (range < 200) return 'gentle slope'
  if (range < 500) return 'moderate slope'
  return 'steep terrain'
}

// ── Overpass API query ────────────────────────────────────────────────────────

function overpassQuery(query) {
  return new Promise((resolve) => {
    const body = 'data=' + encodeURIComponent(query)
    const req = https.request({
      hostname: 'overpass-api.de',
      path: '/api/interpreter',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(body),
        'User-Agent': 'RockhoundingNear/1.0',
      },
      timeout: 25000,
    }, (res) => {
      let d = ''; res.on('data', c => d += c)
      res.on('end', () => {
        try { resolve(JSON.parse(d)) } catch { resolve(null) }
      })
    })
    req.on('error', () => resolve(null))
    req.on('timeout', () => { req.destroy(); resolve(null) })
    req.write(body)
    req.end()
  })
}

// ── Nearest named city / town ─────────────────────────────────────────────────

async function getNearestCity(lat, lng) {
  const data = await overpassQuery(
    `[out:json][timeout:20];(node["place"~"city|town"](around:150000,${lat},${lng}););out 15;`
  )
  if (!data?.elements?.length) return null

  // Sort by population-weighted distance (prefer larger cities that are reasonably close)
  const ranked = data.elements
    .filter(e => e.tags?.name)
    .map(e => {
      const dist = haversine(lat, lng, e.lat, e.lon)
      const pop = parseInt(e.tags?.population) || 1000
      // Score: distance penalized, population rewarded — prefer a city of 20k at 25mi over a village of 500 at 5mi
      const score = dist / Math.log10(Math.max(pop, 100))
      return { name: e.tags.name, dist: Math.round(dist), pop, score }
    })
    .sort((a, b) => a.score - b.score)

  return ranked[0] || null
}

// ── Nearest major roads ───────────────────────────────────────────────────────

async function getNearestRoads(lat, lng) {
  const data = await overpassQuery(
    `[out:json][timeout:20];way["highway"~"motorway|trunk|primary|secondary"]["name"](around:25000,${lat},${lng});out center 8;`
  )
  if (!data?.elements?.length) return []

  return data.elements
    .filter(e => e.tags?.name || e.tags?.ref)
    .map(e => {
      const clat = e.center?.lat || lat
      const clng = e.center?.lon || lng
      return {
        name: e.tags.name || null,
        ref: e.tags.ref || null,
        type: e.tags.highway,
        dist: Math.round(haversine(lat, lng, clat, clng) * 10) / 10,
      }
    })
    .sort((a, b) => a.dist - b.dist)
    .slice(0, 4)
}

// ── Nearby water features ─────────────────────────────────────────────────────

async function getNearbyWater(lat, lng) {
  const data = await overpassQuery(
    `[out:json][timeout:15];(way["waterway"~"river|stream|creek"](around:8000,${lat},${lng});relation["natural"="water"](around:5000,${lat},${lng}););out center 5;`
  )
  if (!data?.elements?.length) return []

  return data.elements
    .filter(e => e.tags?.name)
    .map(e => {
      const clat = e.center?.lat || lat
      const clng = e.center?.lon || lng
      return {
        name: e.tags.name,
        type: e.tags.waterway || e.tags.natural,
        dist: Math.round(haversine(lat, lng, clat, clng) * 10) / 10,
      }
    })
    .sort((a, b) => a.dist - b.dist)
    .slice(0, 3)
}

// ── Land use / protected areas ────────────────────────────────────────────────

async function getLandUse(lat, lng) {
  const data = await overpassQuery(
    `[out:json][timeout:15];(way["leisure"="nature_reserve"](around:3000,${lat},${lng});way["boundary"="national_park"](around:3000,${lat},${lng});relation["boundary"~"national_park|protected_area"](around:3000,${lat},${lng});way["landuse"~"forest|conservation"](around:1000,${lat},${lng}););out center 5;`
  )
  if (!data?.elements?.length) return null

  const areas = data.elements
    .filter(e => e.tags?.name)
    .map(e => ({ name: e.tags.name, type: e.tags.boundary || e.tags.leisure || e.tags.landuse }))
    .slice(0, 2)

  return areas.length ? areas : null
}

// ── Main: analyze all terrain data for a location ─────────────────────────────

async function analyzeTerrainFull(lat, lng) {
  // Elevation first (USGS — no rate limit), then Overpass via global limiter
  let elevation = await getElevation(lat, lng)
  if (!elevation) {
    await sleep(1500)
    elevation = await getElevation(lat, lng) // one retry
  }
  const slope = await getSlopeEstimate(lat, lng)
  // Overpass queries go through the shared global rate limiter
  await overpassLimiter.wait()
  const nearestCity = await getNearestCity(lat, lng)
  await overpassLimiter.wait()
  const roads = await getNearestRoads(lat, lng)
  await overpassLimiter.wait()
  const water = await getNearbyWater(lat, lng)
  await overpassLimiter.wait()
  const landUse = await getLandUse(lat, lng)

  return {
    elevation,
    slope,
    nearest_city: nearestCity ? { name: nearestCity.name, distance_mi: nearestCity.dist, population: nearestCity.pop } : null,
    roads: roads.length ? roads : null,
    water_features: water.length ? water : null,
    protected_areas: landUse,
    analyzed_at: new Date().toISOString(),
  }
}

module.exports = { analyzeTerrainFull, getElevation, getNearestCity, getNearestRoads, haversine, sleep }
