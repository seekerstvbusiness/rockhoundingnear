#!/usr/bin/env node
// Stage 5: Validate enriched locations before import
//
// Usage:
//   node scripts/pipeline/05-validate-location.js --slug crystal-peak-mine-az
//   node scripts/pipeline/05-validate-location.js --state arizona
//   node scripts/pipeline/05-validate-location.js --all

const fs = require('fs')
const path = require('path')
const { STATE_BY_SLUG, GEM_TYPES, HAZARDS } = require('./lib/canonical.js')

const ENRICHED_DIR = path.join(__dirname, '../data/enriched')
const VALIDATED_DIR = path.join(__dirname, '../data/validated')

const VALID_DIFFICULTY = ['easy', 'moderate', 'hard', 'expert']
const VALID_ACCESS = ['public', 'private', 'fee', 'permit']
const VALID_CATEGORY = ['public_blm', 'national_forest', 'fee_dig', 'private', 'state_park', 'closed', 'other']
const VALID_VEHICLE = ['passenger', 'awd', '4x4', 'atv', 'hiking']
const VALID_CELL = ['none', 'spotty', 'reliable']

const BAD_CHARS = /[\u2014\u2013\u201C\u201D\u2018\u2019\u2026\u2022\uFFFD]/

function validate(loc) {
  const errors = []
  const warnings = []

  // Required fields
  if (!loc.name?.trim()) errors.push('name is empty')
  if (!loc.slug?.match(/^[a-z0-9-]+$/)) errors.push(`slug invalid: "${loc.slug}"`)
  if (!STATE_BY_SLUG[loc.state_slug]) errors.push(`state_slug not found: "${loc.state_slug}"`)
  // city is a warning (not error) — many remote BLM sites have no nearby municipality
  if (!loc.city && !loc.nearest_city) warnings.push('no city or nearest_city — consider adding')
  else if (!loc.city && loc.nearest_city) { /* ok — terrain data covers it */ }

  const lat = parseFloat(loc.lat)
  const lng = parseFloat(loc.lng)
  if (isNaN(lat) || lat < 18 || lat > 72) errors.push(`lat out of US range: ${loc.lat}`)
  if (isNaN(lng) || lng < -180 || lng > -65) errors.push(`lng out of US range: ${loc.lng}`)

  if (!loc.gem_types?.length) errors.push('gem_types is empty')
  else {
    const bad = loc.gem_types.filter(g => !GEM_TYPES.includes(g))
    if (bad.length) errors.push(`non-canonical gem_types: ${bad.join(', ')}`)
  }

  if (!loc.short_description) errors.push('short_description missing')
  else if (loc.short_description.length > 200) errors.push(`short_description too long: ${loc.short_description.length} chars`)

  if (!loc.description || loc.description.length < 100) errors.push('description missing or too short')
  if (!loc.tips) warnings.push('tips missing')
  if (!loc.best_season) warnings.push('best_season missing')
  if (!VALID_DIFFICULTY.includes(loc.difficulty)) errors.push(`difficulty invalid: "${loc.difficulty}"`)
  if (!VALID_CATEGORY.includes(loc.primary_category)) errors.push(`primary_category invalid: "${loc.primary_category}"`)
  if (!VALID_VEHICLE.includes(loc.vehicle_required)) errors.push(`vehicle_required invalid: "${loc.vehicle_required}"`)
  if (loc.permit_required == null) loc.permit_required = false
  if (typeof loc.permit_required !== 'boolean') errors.push('permit_required must be boolean')

  // Data quality
  const textFields = ['name', 'description', 'short_description', 'tips', 'terrain_notes', 'history', 'best_season', 'written_directions', 'collection_rules', 'rules']
  for (const f of textFields) {
    if (loc[f] && BAD_CHARS.test(loc[f])) errors.push(`bad chars in ${f}`)
  }

  if (loc.remoteness_rating !== null && loc.remoteness_rating !== undefined) {
    if (loc.remoteness_rating < 1 || loc.remoteness_rating > 5) errors.push(`remoteness_rating out of range: ${loc.remoteness_rating}`)
  }

  if (loc.primary_category === 'fee_dig' && loc.fee_amount === null) {
    warnings.push('fee_dig site but fee_amount is null')
  }

  if (loc.hazards?.length) {
    const badH = loc.hazards.filter(h => !HAZARDS.includes(h))
    if (badH.length) errors.push(`non-canonical hazards: ${badH.join(', ')}`)
  }

  if (!loc.faq?.length || loc.faq.length < 3) warnings.push('faq has fewer than 3 items')

  // Warnings
  if (!loc.cover_photo) warnings.push('no cover_photo')
  if (!loc.written_directions) warnings.push('written_directions missing')
  if (loc.needs_review_fields?.length) warnings.push(`needs_review: ${loc.needs_review_fields.join(', ')}`)

  return { errors, warnings }
}

function processLocation(slug) {
  const file = path.join(ENRICHED_DIR, `${slug}.json`)
  if (!fs.existsSync(file)) {
    console.error(`✗ ${slug} — file not found: ${file}`)
    return false
  }

  const loc = JSON.parse(fs.readFileSync(file, 'utf8'))
  const { errors, warnings } = validate(loc)

  if (errors.length === 0) {
    console.log(`✓ PASS — ${slug}`)
    if (warnings.length) warnings.forEach(w => console.log(`  ⚠ ${w}`))
    fs.mkdirSync(VALIDATED_DIR, { recursive: true })
    fs.copyFileSync(file, path.join(VALIDATED_DIR, `${slug}.json`))
    return true
  } else {
    console.log(`✗ FAIL — ${slug} — ${errors.length} issue(s)`)
    errors.forEach(e => console.log(`  ✗ ${e}`))
    if (warnings.length) warnings.forEach(w => console.log(`  ⚠ ${w}`))
    return false
  }
}

function copyToValidated(slug) {
  const src = path.join(ENRICHED_DIR, `${slug}.json`)
  if (fs.existsSync(src)) {
    fs.mkdirSync(VALIDATED_DIR, { recursive: true })
    fs.copyFileSync(src, path.join(VALIDATED_DIR, `${slug}.json`))
  }
}

if (require.main === module) {
  const args = process.argv.slice(2)
const slugIdx = args.indexOf('--slug')
const stateIdx = args.indexOf('--state')
const allFlag = args.includes('--all')

if (slugIdx >= 0) {
  processLocation(args[slugIdx + 1])
} else if (stateIdx >= 0) {
  const stateSlug = args[stateIdx + 1]
  const files = fs.readdirSync(ENRICHED_DIR).filter(f => f.endsWith('.json'))
  let pass = 0, fail = 0
  for (const f of files) {
    const loc = JSON.parse(fs.readFileSync(path.join(ENRICHED_DIR, f), 'utf8'))
    if (loc.state_slug !== stateSlug) continue
    if (processLocation(loc.slug)) pass++; else fail++
  }
  console.log(`\nSummary: ${pass} passed / ${fail} failed`)
} else if (allFlag) {
  const files = fs.readdirSync(ENRICHED_DIR).filter(f => f.endsWith('.json'))
  let pass = 0, fail = 0
  for (const f of files) {
    const loc = JSON.parse(fs.readFileSync(path.join(ENRICHED_DIR, f), 'utf8'))
    if (processLocation(loc.slug)) pass++; else fail++
  }
  console.log(`\nSummary: ${pass} passed / ${fail} failed`)
  } else {
    console.log('Usage:')
    console.log('  node 05-validate-location.js --slug <slug>')
    console.log('  node 05-validate-location.js --state <state-slug>')
    console.log('  node 05-validate-location.js --all')
  }
}

module.exports = { validate, copyToValidated, processLocation }
