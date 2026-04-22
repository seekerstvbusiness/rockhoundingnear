#!/usr/bin/env node
// Pipeline orchestrator — runs stages 2-6 in parallel workers per location
//
// Usage:
//   node run-pipeline.js --state arizona
//   node run-pipeline.js --states arizona,utah,nevada
//   node run-pipeline.js --all
//   node run-pipeline.js --state arizona --resume          (skip already-done locations)
//   node run-pipeline.js --state arizona --from-stage 3   (jump to enrichment)
//   node run-pipeline.js --state arizona --stages 2,3     (run only specific stages)
//   node run-pipeline.js --state arizona --dry-run        (show plan, no execution)
//   node run-pipeline.js --state arizona --force          (re-process all locations)

const fs = require('fs')
const path = require('path')

const SEED_FILE = path.join(__dirname, '../data/seed-clean.json')

const { concurrentMap } = require('./lib/pool')
const { Progress } = require('./lib/progress')
const { scrapeLocation } = require('./02-scrape-location')
const { enrichLocation } = require('./03-enrich-location')
const { findImages } = require('./04-find-images')

// ── Validate stage 5 inline (no import needed — tiny) ────────────────────────
const { validate, copyToValidated } = (() => {
  try { return require('./05-validate-location') } catch {
    // If stage 5 doesn't export functions, inline a minimal version
    const { STATE_BY_SLUG, GEM_TYPES } = require('./lib/canonical')
    const ENRICHED_DIR = path.join(__dirname, '../data/enriched')
    const VALIDATED_DIR = path.join(__dirname, '../data/validated')
    fs.mkdirSync(VALIDATED_DIR, { recursive: true })
    function validate(loc) {
      const errors = []
      if (!loc.name?.trim()) errors.push('name is empty')
      if (!STATE_BY_SLUG[loc.state_slug]) errors.push(`state_slug invalid: ${loc.state_slug}`)
      if (!loc.gem_types?.length) errors.push('gem_types empty')
      if (!loc.short_description) errors.push('short_description missing')
      if (!loc.description || loc.description.length < 100) errors.push('description too short')
      const lat = parseFloat(loc.lat), lng = parseFloat(loc.lng)
      if (isNaN(lat) || lat < 18 || lat > 72) errors.push('lat out of range')
      if (isNaN(lng) || lng < -180 || lng > -65) errors.push('lng out of range')
      return errors
    }
    function copyToValidated(slug) {
      const src = path.join(ENRICHED_DIR, `${slug}.json`)
      const dst = path.join(VALIDATED_DIR, `${slug}.json`)
      if (fs.existsSync(src)) fs.copyFileSync(src, dst)
    }
    return { validate, copyToValidated }
  }
})()

// ── Import stage ──────────────────────────────────────────────────────────────
let _importOne = null
function getImportOne() {
  if (!_importOne) {
    try { _importOne = require('./06-import-batch').importOne } catch {}
  }
  return _importOne
}

async function runImport(stateSlug, dryRun) {
  if (dryRun) return
  // Stage 6 is now a no-op when called at end — locations are already imported one-by-one during validate
  // This is kept for backwards-compat if run directly
  const { execSync } = require('child_process')
  execSync(`node ${path.join(__dirname, '06-import-batch.js')} --state ${stateSlug}`, { stdio: 'inherit' })
}

// ── Progress bar ──────────────────────────────────────────────────────────────

function renderBar(done, total, width = 30) {
  const pct = total === 0 ? 1 : done / total
  const filled = Math.round(pct * width)
  return '[' + '█'.repeat(filled) + '░'.repeat(width - filled) + ']'
}

function formatETA(startMs, done, total) {
  if (done === 0) return 'calculating...'
  const elapsed = (Date.now() - startMs) / 1000
  const rate = done / elapsed
  const remaining = (total - done) / rate
  if (remaining < 60) return `${Math.round(remaining)}s`
  if (remaining < 3600) return `${Math.round(remaining / 60)}m`
  return `${(remaining / 3600).toFixed(1)}h`
}

// ── Stage runner with parallelism + retry ─────────────────────────────────────

async function runStage(stageName, locs, fn, concurrency, progress, opts = {}) {
  const { resume, force } = opts
  const allSlugs = locs.map(l => l.slug)

  // For enrich stage: also re-queue any slugs marked done but missing their output file
  const ENRICHED_DIR = path.join(__dirname, '../data/enriched')
  if (resume && stageName === 'enrich') {
    const ghostDone = allSlugs.filter(slug =>
      !progress.getPending('enrich', allSlugs).includes(slug) &&
      !fs.existsSync(path.join(ENRICHED_DIR, `${slug}.json`))
    )
    if (ghostDone.length > 0) {
      console.log(`  [warn] ${ghostDone.length} slugs marked done but enriched file missing — re-queuing`)
      ghostDone.forEach(slug => {
        progress._data.stages.enrich.done = progress._data.stages.enrich.done.filter(s => s !== slug)
      })
      progress._save()
    }
  }

  const pending = resume
    ? locs.filter(l => progress.getPending(stageName, allSlugs).includes(l.slug))
    : locs

  if (pending.length === 0) {
    console.log(`  Stage ${stageName}: all ${locs.length} already done — skipping`)
    return []
  }

  const label = stageName.charAt(0).toUpperCase() + stageName.slice(1)
  const startMs = Date.now()
  let done = locs.length - pending.length
  const failures = []

  console.log(`\n${'─'.repeat(60)}`)
  console.log(`Stage: ${label}  (${pending.length} locations, ${concurrency} workers)`)

  async function runOne(loc, attempt = 1) {
    try {
      const sessionName = `worker-${Math.floor(Math.random() * concurrency)}`
      await fn(loc, { force, sessionName })
      progress.markDone(stageName, loc.slug)
      done++
      const bar = renderBar(done, locs.length)
      const eta = formatETA(startMs, done - (locs.length - pending.length), pending.length)
      process.stdout.write(`\r  ${bar} ${done}/${locs.length}  ETA ${eta}  `)
    } catch (err) {
      if (attempt < 3) {
        await new Promise(r => setTimeout(r, 5000 * attempt))
        return runOne(loc, attempt + 1)
      }
      progress.markFailed(stageName, loc.slug, err.message)
      failures.push({ slug: loc.slug, error: err.message })
      done++
      process.stdout.write(`\r  ✗ ${loc.slug} failed after ${attempt} attempts\n`)
    }
  }

  await concurrentMap(pending, runOne, concurrency)

  console.log(`\n  ✓ ${label}: ${locs.length - failures.length}/${locs.length} done  (${((Date.now() - startMs) / 1000).toFixed(0)}s)`)
  if (failures.length) {
    console.log(`  ✗ Failed (${failures.length}):`)
    failures.forEach(f => console.log(`     ${f.slug}: ${f.error?.slice(0, 80)}`))
  }

  return failures
}

// ── Validate all enriched for a state + immediately import each passing record ─

async function runValidate(locs, progress, opts) {
  const ENRICHED_DIR = path.join(__dirname, '../data/enriched')
  const importOne = getImportOne()
  console.log(`\n${'─'.repeat(60)}`)
  console.log(`Stage: Validate + Import  (${locs.length} locations)`)

  let passed = 0, failed = 0, imported = 0
  for (const loc of locs) {
    const enrichedFile = path.join(ENRICHED_DIR, `${loc.slug}.json`)
    if (!fs.existsSync(enrichedFile)) {
      progress.markFailed('validate', loc.slug, 'enriched file missing')
      failed++
      continue
    }
    try {
      const data = JSON.parse(fs.readFileSync(enrichedFile, 'utf8'))
      const result = validate(data)
      // validate() may return an array (fallback) or { errors, warnings } (full module)
      const errors = Array.isArray(result) ? result : (result.errors || [])
      if (errors.length === 0) {
        copyToValidated(loc.slug)
        progress.markDone('validate', loc.slug)
        passed++

        // Immediately upsert to Supabase so it appears in the dashboard right away
        if (importOne && !opts.dryRun) {
          try {
            await importOne(data)
            progress.markDone('import', loc.slug)
            imported++
            process.stdout.write(`\r  ✓ ${loc.slug} — validated + imported (${imported} to Supabase)          \n`)
          } catch (importErr) {
            progress.markFailed('import', loc.slug, importErr.message)
            console.log(`  ! import failed for ${loc.slug}: ${importErr.message.slice(0, 80)}`)
          }
        }
      } else {
        progress.markFailed('validate', loc.slug, errors.join('; '))
        failed++
        console.log(`  ✗ ${loc.slug}: ${errors.join(', ')}`)
      }
    } catch (err) {
      progress.markFailed('validate', loc.slug, err.message)
      failed++
    }
  }
  console.log(`  ✓ Validate: ${passed} passed, ${failed} failed  |  Supabase: ${imported} upserted`)
}

// ── Main orchestrator ─────────────────────────────────────────────────────────

async function runState(stateSlug, locs, opts) {
  const { stages, resume, force, dryRun } = opts
  const progress = new Progress(stateSlug, locs.length)

  console.log(`\n${'═'.repeat(60)}`)
  console.log(`State: ${stateSlug}  (${locs.length} locations)`)
  if (dryRun) {
    console.log(`  DRY RUN — would process:`)
    locs.forEach(l => console.log(`    ${l.slug}  ${l.lat},${l.lng}`))
    return
  }

  const stageOpts = { resume, force, dryRun }

  if (stages.includes(2)) {
    await runStage('scrape', locs, (loc, o) => scrapeLocation(loc, o), 10, progress, stageOpts)
  }

  if (stages.includes(3)) {
    await runStage('enrich', locs, (loc, o) => enrichLocation(loc, o.force), 15, progress, stageOpts)
  }

  if (stages.includes(4)) {
    await runStage('images', locs, (loc, o) => findImages(loc, o), 5, progress, stageOpts)
  }

  if (stages.includes(5)) {
    // Stage 5 now also imports each passing record immediately to Supabase
    await runValidate(locs, progress, stageOpts)
  }

  // Always show validate + import in summary (import is inline with validate now)
  const summary = ['scrape', 'enrich', 'images', 'validate', 'import']
    .filter((s, i) => stages.includes(i + 2) || (s === 'import' && stages.includes(5)))
    .map(s => {
      const { done, failed, total } = progress.summary(s)
      return `${s}: ${done}/${total}`
    })
    .join('  |  ')

  console.log(`\n${'═'.repeat(60)}`)
  console.log(`${stateSlug} complete — ${summary}`)
}

async function main() {
  const seed = JSON.parse(fs.readFileSync(SEED_FILE, 'utf8'))
  const allLocations = seed.locations || seed

  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run')
  const resume = args.includes('--resume')
  const force = args.includes('--force')

  // Determine which stages to run
  const fromStageIdx = args.indexOf('--from-stage')
  const stagesIdx = args.indexOf('--stages')
  let stages = [2, 3, 4, 5, 6]
  if (fromStageIdx >= 0) {
    const from = parseInt(args[fromStageIdx + 1])
    stages = stages.filter(s => s >= from)
  }
  if (stagesIdx >= 0) {
    stages = args[stagesIdx + 1].split(',').map(Number)
  }

  // Determine which states to process
  let stateGroups = []
  const stateIdx = args.indexOf('--state')
  const statesIdx = args.indexOf('--states')

  if (stateIdx >= 0) {
    const slug = args[stateIdx + 1]
    const locs = allLocations.filter(l => l.state_slug === slug)
    if (!locs.length) { console.error(`No locations found for state: ${slug}`); process.exit(1) }
    stateGroups = [{ slug, locs }]
  } else if (statesIdx >= 0) {
    const slugs = args[statesIdx + 1].split(',')
    stateGroups = slugs.map(slug => ({
      slug,
      locs: allLocations.filter(l => l.state_slug === slug),
    })).filter(g => g.locs.length > 0)
  } else if (args.includes('--all')) {
    const byState = {}
    for (const loc of allLocations) {
      if (!byState[loc.state_slug]) byState[loc.state_slug] = []
      byState[loc.state_slug].push(loc)
    }
    // Sort by location count ascending (smaller states first to validate pipeline early)
    stateGroups = Object.entries(byState)
      .sort((a, b) => a[1].length - b[1].length)
      .map(([slug, locs]) => ({ slug, locs }))
  } else {
    console.log('Usage:')
    console.log('  node run-pipeline.js --state <state-slug>')
    console.log('  node run-pipeline.js --states <slug1,slug2,...>')
    console.log('  node run-pipeline.js --all')
    console.log('  node run-pipeline.js --state arizona --resume')
    console.log('  node run-pipeline.js --state arizona --from-stage 3')
    console.log('  node run-pipeline.js --state arizona --stages 2,3')
    console.log('  node run-pipeline.js --state arizona --dry-run')
    console.log('  node run-pipeline.js --state arizona --force')
    console.log('  node run-pipeline.js --states utah,nevada,idaho --parallel 3')
    console.log('  node run-pipeline.js --all --parallel 3')
    process.exit(1)
  }

  const parallelIdx = args.indexOf('--parallel')
  const parallelCount = parallelIdx >= 0 ? parseInt(args[parallelIdx + 1]) || 3 : 1

  const totalLocs = stateGroups.reduce((s, g) => s + g.locs.length, 0)
  console.log(`Pipeline starting: ${stateGroups.length} state(s), ${totalLocs} locations, stages [${stages.join(',')}], parallel states: ${parallelCount}`)
  if (resume) console.log('Resume mode: skipping already-completed locations')
  if (force) console.log('Force mode: re-processing all locations')

  if (parallelCount <= 1) {
    for (const { slug, locs } of stateGroups) {
      await runState(slug, locs, { stages, resume, force, dryRun })
    }
  } else {
    // Run up to parallelCount states concurrently
    const queue = [...stateGroups]
    const running = new Set()
    while (queue.length > 0 || running.size > 0) {
      while (running.size < parallelCount && queue.length > 0) {
        const { slug, locs } = queue.shift()
        const p = runState(slug, locs, { stages, resume, force, dryRun }).finally(() => running.delete(p))
        running.add(p)
      }
      if (running.size > 0) await Promise.race(running)
    }
  }

  console.log('\nAll done.')
}

main().catch(err => { console.error(err); process.exit(1) })
