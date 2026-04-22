# /scrape-state

Runs the full scrape + enrich + find-images pipeline for every location in a given state. Uses parallel subagents for speed.

**Usage:** `/scrape-state [state-slug]`  
**Example:** `/scrape-state arizona`

## Arguments

`$ARGUMENTS` — the state slug (e.g. `arizona`, `north-carolina`, `new-mexico`)

## Steps

1. Read `scripts/data/seed-clean.json`. Filter to locations where `state_slug === "$ARGUMENTS"`.
2. Print: `Starting pipeline for {state} — {N} locations`
3. Check `scripts/data/imported.log` — skip any slugs already imported to Supabase.
4. Check `scripts/data/enriched/` — skip any slugs that already have a completed enriched JSON.

5. **Process in parallel batches of 5:**
   - Divide remaining locations into groups of 5
   - For each group, spawn a subagent that runs:
     1. `/scrape-location {slug}` for each location in the group
     2. `/enrich-location {slug}` for each location in the group
     3. `/find-images {slug}` for each location in the group
   - Wait for all batches to complete before proceeding

6. After all batches done, run validation:
   - Execute `node scripts/pipeline/05-validate-location.js --state $ARGUMENTS`
   - Print validation summary: `{N} passed / {N} failed`

7. Print final summary:
   ```
   ✓ {state} pipeline complete
   - {N} locations scraped
   - {N} locations enriched
   - {N} locations with images
   - {N} locations passed validation
   - {N} locations need review (check scripts/data/enriched/ for needs_review_fields)
   ```

8. Suggest next step: `/import-batch $ARGUMENTS`

## Notes

- If a subagent fails on a location, log the slug to `scripts/data/errors.log` and continue with the rest
- Do not import to Supabase automatically — always run `/import-batch` manually after reviewing
- For large states (Utah, California with 200+ locations), consider running in smaller batches: `/scrape-state utah --limit 50`
