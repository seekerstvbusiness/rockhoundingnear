# /scrape-location

Scrapes raw data for a single rockhounding location from multiple web sources and saves it to `scripts/data/raw/{slug}.json`.

**Usage:** `/scrape-location [slug]`  
**Example:** `/scrape-location crystal-peak-mine-az`

## Arguments

`$ARGUMENTS` — the location slug (from `scripts/data/seed-clean.json`)

## Steps

1. Read `scripts/data/seed-clean.json` and find the entry where `slug === "$ARGUMENTS"`. If not found, exit with an error.

2. For each source below, attempt to fetch content using the browser agent. If a source fails or 404s, log it and continue — don't abort.

3. **Sources to try (in order):**

   a. **rockhounding.org** — Try `https://rockhounding.org/us/{state_slug}/{slug}` and `https://rockhounding.org/us/{state_slug}/`. Look for: gem types, directions, rules, permit info, fee info, GPS confirmation.

   b. **mindat.org** — Search `https://www.mindat.org/locsearch.php?q={name}&country=US`. Look for: mineral species, geological context, locality description.

   c. **rockhoundresource.com** — Browse the state page. Look for any mention of the location name.

   d. **rockhoundingmap.com** — Use browser agent to check if location appears on the map.

   e. **BLM/USFS** — If state is in the western US, try `https://www.blm.gov/` site search for the location name. Capture land type, permit requirements.

   f. **recreation.gov** — Search for the location name. Capture fees, permit booking links.

   g. **AllTrails** — Search `https://www.alltrails.com/search?q={name}+{state}`. Capture trail difficulty, terrain, distance if matching trail found.

   h. **Google Search** — Use browser agent to search `"{name}" rockhounding {state} site:rockhounding.org OR site:mindat.org OR site:blm.gov`. Extract any additional snippets.

4. **Compile all found data** into a single JSON object with this structure:
   ```json
   {
     "slug": "...",
     "name": "...",
     "lat": 0.0,
     "lng": 0.0,
     "state": "...",
     "state_slug": "...",
     "city": "...",
     "county": "...",
     "sources": {
       "rockhounding_org": { "found": true/false, "url": "...", "data": {...} },
       "mindat": { "found": true/false, "url": "...", "data": {...} },
       ...
     },
     "merged": {
       "gem_types_raw": ["..."],
       "description_snippets": ["..."],
       "directions_raw": "...",
       "rules_raw": "...",
       "permit_info": "...",
       "fee_info": "...",
       "difficulty_hints": "...",
       "terrain_hints": "...",
       "season_hints": "...",
       "land_type": "...",
       "images_found": ["url1", "url2"]
     },
     "scraped_at": "ISO timestamp",
     "scrape_quality": "rich|partial|minimal"
   }
   ```

5. Save to `scripts/data/raw/{slug}.json`. Overwrite if exists.

6. Print a one-line summary: `✓ {name} — quality: {rich|partial|minimal} — sources: {N} of 8`

## Notes

- Rate-limit requests: 1 second between requests to the same domain
- If ALL sources fail, still save the file with `scrape_quality: "minimal"` and empty merged data
- Never hallucinate content — only record what was actually found on the pages
