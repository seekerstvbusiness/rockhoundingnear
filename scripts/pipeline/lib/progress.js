// Per-state progress tracking with crash recovery
const fs = require('fs')
const path = require('path')

const PROGRESS_DIR = path.join(__dirname, '../../data/progress')
fs.mkdirSync(PROGRESS_DIR, { recursive: true })

const STAGES = ['scrape', 'enrich', 'images', 'validate', 'import']

class Progress {
  constructor(stateSlug, total) {
    this.stateSlug = stateSlug
    this.file = path.join(PROGRESS_DIR, `${stateSlug}.json`)
    this._data = this._load(total)
  }

  _load(total) {
    if (fs.existsSync(this.file)) {
      try { return JSON.parse(fs.readFileSync(this.file, 'utf8')) } catch {}
    }
    const stages = {}
    for (const s of STAGES) stages[s] = { done: [], failed: [] }
    return { state_slug: this.stateSlug, total, stages, started_at: new Date().toISOString(), updated_at: new Date().toISOString() }
  }

  _save() {
    this._data.updated_at = new Date().toISOString()
    fs.writeFileSync(this.file, JSON.stringify(this._data, null, 2))
  }

  markDone(stage, slug) {
    const s = this._data.stages[stage]
    if (!s.done.includes(slug)) s.done.push(slug)
    s.failed = s.failed.filter(f => f.slug !== slug)
    this._save()
  }

  markFailed(stage, slug, error) {
    const s = this._data.stages[stage]
    const existing = s.failed.find(f => f.slug === slug)
    if (existing) existing.attempts = (existing.attempts || 1) + 1
    else s.failed.push({ slug, error: String(error).slice(0, 200), attempts: 1 })
    this._save()
  }

  // Returns slugs from allSlugs that haven't been successfully done in this stage
  getPending(stage, allSlugs) {
    const done = new Set(this._data.stages[stage].done)
    return allSlugs.filter(s => !done.has(s))
  }

  // Returns slugs that failed and haven't exceeded maxAttempts
  getRetryable(stage, maxAttempts = 2) {
    return this._data.stages[stage].failed
      .filter(f => (f.attempts || 1) < maxAttempts)
      .map(f => f.slug)
  }

  summary(stage) {
    const s = this._data.stages[stage]
    return {
      done: s.done.length,
      failed: s.failed.length,
      total: this._data.total,
    }
  }

  failedList(stage) {
    return this._data.stages[stage].failed
  }

  reset(stage) {
    this._data.stages[stage] = { done: [], failed: [] }
    this._save()
  }
}

module.exports = { Progress }
