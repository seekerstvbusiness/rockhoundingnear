# /find-images

Finds, verifies, and stores images for a rockhounding location. Uploads accepted images to Supabase Storage and updates the enriched JSON with URLs.

**Usage:** `/find-images [slug]`  
**Example:** `/find-images crystal-peak-mine-az`

## Arguments

`$ARGUMENTS` — the location slug

## Steps

1. Read `scripts/data/enriched/{slug}.json` for location context (name, state, gem_types, lat, lng).
2. Read `.env.local` for the Supabase URL and service role key.

## Image Search Strategy

Search these sources in order. Stop when you have 1 cover photo + up to 4 gallery images.

### Source 1: Wikimedia Commons
- Search: `https://commons.wikimedia.org/w/index.php?search={name}+{state}&ns6=1`
- Also try: `https://commons.wikimedia.org/w/index.php?search={primary_gem_type}+{state}+rockhounding`
- Only CC-licensed images (CC-BY, CC-BY-SA, Public Domain)
- Extract direct image URLs (not thumbnail URLs)

### Source 2: Flickr Creative Commons
- Search: `https://www.flickr.com/search/?text={name}+{state}&license=1,2,3,4,5,6,9,10`
- License param covers all CC licenses
- Extract full-size image URLs

### Source 3: rockhounding.org
- Check `scripts/data/raw/{slug}.json` — `merged.images_found` for any images already scraped
- Also browse the location page via browser agent for embedded photos

### Source 4: mindat.org locality photos
- Check mindat locality page for user-submitted photos
- These are typically CC-licensed for non-commercial use

## Vision Verification (REQUIRED for every candidate image)

Before accepting any image, analyze it with Claude Vision:

**Prompt:** "Does this image show: (a) an outdoor natural landscape or rockhounding site, OR (b) a close-up of a mineral/gem/crystal specimen? Answer YES if either. Answer NO if the image shows: logos, text overlays, buildings as the main subject, people as the main subject, stock illustration graphics, maps, or generic unrelated scenery. Be strict."

- Accept only images that get YES
- Reject everything else — do not use it even as a fallback

## Upload to Supabase Storage

For each accepted image:
1. Download to a temp buffer
2. Upload to Supabase Storage bucket `location-images` at path `{state_slug}/{slug}/{index}.jpg`
3. Get the public URL via `supabase.storage.from('location-images').getPublicUrl(...)`
4. Collect the public URLs

## Update Enriched JSON

- Set `cover_photo` to the first accepted landscape/site image URL
- Set `images` array to all remaining accepted image URLs (max 5 total including cover)
- If only mineral/specimen photos found (no site photo), use the best mineral photo as `cover_photo`
- Save updated `scripts/data/enriched/{slug}.json`

## Output

Print: `✓ {name} — {N} images found — cover: {yes|no}`

If no images found at all, print: `⚠ {name} — no images found — manual search needed`
Add slug to `scripts/data/no-images.log` (one slug per line, append mode).

## Notes

- Never use Google Images screenshots — check usage rights explicitly
- If Supabase Storage bucket `location-images` doesn't exist, it needs to be created first in the Supabase dashboard
- Max image size: 5MB per image. Skip larger files.
- Prefer landscape/horizontal images for cover_photo (better card thumbnail)
