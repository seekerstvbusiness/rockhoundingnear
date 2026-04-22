// Concurrency utilities for the pipeline orchestrator

// Run asyncFn on every item, at most `concurrency` in-flight at once.
// Returns array of {item, result} for successes and {item, error} for failures.
async function concurrentMap(items, asyncFn, concurrency) {
  const results = []
  const queue = [...items]
  let active = 0

  return new Promise((resolve) => {
    function next() {
      while (active < concurrency && queue.length > 0) {
        const item = queue.shift()
        active++
        asyncFn(item)
          .then(result => results.push({ item, result, ok: true }))
          .catch(error => results.push({ item, error, ok: false }))
          .finally(() => {
            active--
            if (queue.length === 0 && active === 0) resolve(results)
            else next()
          })
      }
    }
    if (items.length === 0) { resolve([]); return }
    next()
  })
}

// Enforces a minimum interval between calls globally across all callers.
class RateLimiter {
  constructor(minIntervalMs) {
    this.minInterval = minIntervalMs
    this.lastCall = 0
    this._queue = Promise.resolve()
  }

  wait() {
    this._queue = this._queue.then(() => {
      const now = Date.now()
      const wait = Math.max(0, this.lastCall + this.minInterval - now)
      this.lastCall = now + wait
      if (wait > 0) return new Promise(r => setTimeout(r, wait))
    })
    return this._queue
  }
}

// Global rate limiters — import these in stage scripts instead of local sleeps
const overpassLimiter  = new RateLimiter(700)   // Overpass fair-use: 1 req/sec
const wikimediaLimiter = new RateLimiter(200)    // Wikimedia: polite pacing
const claudeLimiter    = new RateLimiter(250)    // Haiku: back off gently

module.exports = { concurrentMap, RateLimiter, overpassLimiter, wikimediaLimiter, claudeLimiter }
