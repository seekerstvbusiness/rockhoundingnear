// Nominatim reverse geocoding helper (free, no API key)
// Rate limit: max 1 request per second per Nominatim ToS

const https = require('https')

const DELAY_MS = 1100 // 1.1s between requests to be safe

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'RockhoundingNear.com/1.0 data-pipeline (contact: hello@rockhoundingnear.com)',
        'Accept': 'application/json',
      }
    }
    https.get(url, options, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        try { resolve(JSON.parse(data)) }
        catch (e) { reject(new Error('Invalid JSON: ' + data.slice(0, 100))) }
      })
    }).on('error', reject)
  })
}

let lastRequest = 0

async function reverseGeocode(lat, lng) {
  // Rate limit
  const now = Date.now()
  const wait = DELAY_MS - (now - lastRequest)
  if (wait > 0) await sleep(wait)
  lastRequest = Date.now()

  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&zoom=10`
  try {
    const result = await fetchJson(url)
    if (!result || result.error) return null

    const addr = result.address || {}
    const city =
      addr.city ||
      addr.town ||
      addr.village ||
      addr.hamlet ||
      addr.municipality ||
      addr.county ||
      null

    const county =
      addr.county
        ? addr.county.replace(/ County$/, '').replace(/ Parish$/, '')
        : null

    return { city, county }
  } catch (err) {
    console.warn(`  Geocode failed for (${lat}, ${lng}): ${err.message}`)
    return null
  }
}

module.exports = { reverseGeocode }
