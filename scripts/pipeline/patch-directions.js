#!/usr/bin/env node
// Patch directions field for all records that have null directions but have lat/lng

const fs = require('fs')
const path = require('path')
const https = require('https')

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

function supabaseRequest(url, key, method, urlPath, body) {
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
    const req = https.request(`${url}${urlPath}`, opts, (res) => {
      let data = ''
      res.on('data', c => data += c)
      res.on('end', () => resolve({ status: res.statusCode, body: data }))
    })
    req.on('error', reject)
    if (bodyStr) req.write(bodyStr)
    req.end()
  })
}

async function main() {
  const env = loadEnv()
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY

  // Fetch all records with null directions but non-null lat/lng
  console.log('Fetching records with null directions...')
  const res = await supabaseRequest(supabaseUrl, serviceKey, 'GET',
    '/rest/v1/locations?directions=is.null&latitude=not.is.null&select=id,slug,latitude,longitude', null)

  const records = JSON.parse(res.body)
  console.log(`Found ${records.length} records to patch`)

  let updated = 0, failed = 0
  for (const rec of records) {
    const mapsUrl = `https://maps.google.com/?q=${rec.latitude},${rec.longitude}`
    const patch = await supabaseRequest(supabaseUrl, serviceKey, 'PATCH',
      `/rest/v1/locations?id=eq.${rec.id}`, { directions: mapsUrl })
    if (patch.status >= 200 && patch.status < 300) {
      updated++
      process.stdout.write(`\r  Patched ${updated}/${records.length}`)
    } else {
      failed++
      console.log(`\n  ✗ ${rec.slug}: ${patch.status} ${patch.body.slice(0, 100)}`)
    }
  }

  console.log(`\n\nDone: ${updated} patched, ${failed} failed`)
}

main().catch(err => { console.error(err); process.exit(1) })
