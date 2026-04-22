# /enrich-location

AI-enriches a single location using its scraped raw data, generating all prose and classification fields. Saves output to `scripts/data/enriched/{slug}.json`.

**Usage:** `/enrich-location [slug]`  
**Example:** `/enrich-location crystal-peak-mine-az`

## Arguments

`$ARGUMENTS` — the location slug

## Steps

1. Read `scripts/data/raw/{slug}.json`. If not found, suggest running `/scrape-location {slug}` first.
2. Read `scripts/data/seed-clean.json` for the base location data.
3. Using all available facts from the raw scrape, generate the enriched JSON below.

## Field Generation Rules

### Text content (WRITE from facts — never invent permits/fees/rules)

- **`description`** — 3-5 paragraphs. Cover: what the site is, geological context, what makes it unique for rockhounds, what to expect when visiting. Use plain hyphens not em dashes. No smart quotes.
- **`short_description`** — 1-2 sentences, max 200 chars. Focus on the #1 thing to find there.
- **`tips`** — 2-5 sentences. Practical: where to search, what tools help, what to look for.
- **`terrain_notes`** — 1-3 sentences. Physical terrain: rocky/sandy/desert/forest, elevation, walking distance.
- **`history`** — 1-3 paragraphs IF geological or mining history is available from sources. Leave null if no info.
- **`best_season`** — Plain English. e.g. "March - November", "Year-round", "Spring and Fall only". No em dashes.
- **`written_directions`** — If directions were found in sources, clean them up. Otherwise null.

### Classification (CLASSIFY from facts)

- **`difficulty`** — `easy` | `moderate` | `hard` | `expert`. Base on terrain, walking distance, elevation.
- **`primary_category`** — `public_blm` | `national_forest` | `fee_dig` | `private` | `state_park` | `other`. Must have source evidence.
- **`access_type`** — `public` | `private` | `fee` | `permit`.
- **`vehicle_required`** — `passenger` | `awd` | `4x4` | `atv` | `hiking`.
- **`cell_service`** — `none` | `spotty` | `reliable`. Default `spotty` if unknown.
- **`remoteness_rating`** — 1-5 only. 1=roadside, 5=very remote.
- **`beginner_friendly`** — `true` if easy terrain + surface collecting + no dangerous cliffs/mines.
- **`family_friendly`** — `true` if easy + safe for kids.
- **`dog_friendly`** — `true` if explicitly allowed or open BLM land with no restrictions noted.

### Arrays

- **`gem_types`** — Map found minerals to the canonical list exactly. Only use: Agate, Amethyst, Beryl, Calcite, Chalcedony, Chert, Chrysocolla, Citrine, Diamond, Emerald, Feldspar, Fluorite, Garnet, Gold, Jade, Jasper, Labradorite, Lapis Lazuli, Malachite, Mica, Moonstone, Obsidian, Onyx, Opal, Peridot, Petrified Wood, Quartz, Rose Quartz, Ruby, Sapphire, Serpentine, Silver, Smoky Quartz, Sunstone, Tanzanite, Tiger Eye, Topaz, Tourmaline, Turquoise, Zircon.
- **`hazards`** — From canonical list only: snakes, cliffs, abandoned_mines, heat, cold, flash_floods, sharp_material, loose_rock, wildlife, remote.

### Requires source URL — leave null if not sourced

- **`permit_required`** — ONLY set `true` if a source page explicitly says a government permit is required.
- **`permit_link`** — URL to permit info page.
- **`fee_amount`** — USD decimal. `0` for confirmed free. `null` if unknown.
- **`commercial_use_allowed`** — Only `true` if explicitly stated.
- **`collection_rules`** — Only from official source. Never invent.
- **`quantity_limits`** — Only from official source.

### SEO (generate these)

- **`meta_title`** — "{Name} - Rockhounding in {State}". Max 60 chars. Leave null if it would be too long (page auto-generates).
- **`meta_description`** — 120-155 chars. What you'll find, location, why visit.

### FAQ (generate 5-6 items)

Use these question templates:
- "What can I find at {name}?"
- "Is {name} free to visit?"
- "Do I need a permit to collect at {name}?"
- "What is the best time of year to visit {name}?"
- "What tools do I need for {name}?"
- "How difficult is {name} to access?"
- "Is {name} good for beginners?"
- "Are dogs allowed at {name}?"

## Output Format

```json
{
  "slug": "...",
  "name": "...",
  "state": "...",
  "state_slug": "...",
  "city": "...",
  "city_slug": "...",
  "county": "...",
  "county_slug": "...",
  "lat": 0.0,
  "lng": 0.0,
  "gem_types": [],
  "short_description": "...",
  "description": "...",
  "history": null,
  "tips": "...",
  "terrain_notes": "...",
  "best_season": "...",
  "written_directions": null,
  "directions": null,
  "difficulty": "moderate",
  "access_type": "public",
  "primary_category": "public_blm",
  "vehicle_required": "passenger",
  "road_conditions": null,
  "parking_notes": null,
  "cell_service": "spotty",
  "remoteness_rating": 3,
  "permit_required": false,
  "permit_link": null,
  "fee_amount": null,
  "commercial_use_allowed": false,
  "collection_rules": null,
  "quantity_limits": null,
  "rules": null,
  "beginner_friendly": null,
  "family_friendly": null,
  "dog_friendly": null,
  "kid_age_range": null,
  "hazards": [],
  "nearest_services": null,
  "accessibility_notes": null,
  "faq": [{ "question": "...", "answer": "..." }],
  "meta_title": null,
  "meta_description": null,
  "alternative_names": [],
  "nearest_city": null,
  "nearest_city_distance": null,
  "cover_photo": null,
  "images": [],
  "featured": false,
  "published": false,
  "needs_review_fields": [],
  "enriched_at": "ISO timestamp"
}
```

`needs_review_fields` — list field names where the value was inferred from weak evidence (e.g. `["permit_required", "fee_amount"]`). Empty array if all fields are well-sourced.

4. Save to `scripts/data/enriched/{slug}.json`.
5. Print: `✓ {name} — {N} gem types — needs_review: {N} fields`
