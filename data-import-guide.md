# RockhoundingNear.com — Data Import & Enrichment Guide

Reference for scraping, enriching, and importing location data into Supabase.
Check this document before every bulk import session.

---

## Page Sections & Their Source Fields

Every location page renders these sections in this fixed order. All sections always render — missing data shows a placeholder, not a hidden section.

| # | Page Section | DB Fields Used |
|---|---|---|
| 1 | About | `description` |
| 2 | What You'll Find | `gem_types[]`, `short_description` |
| 3 | How to Get There | `latitude`, `longitude`, `written_directions`, `directions`, `vehicle_required`, `road_conditions`, `parking_notes` |
| 4 | Rules & Access | `primary_category`, `permit_required`, `permit_link`, `fee_amount`, `collection_rules`, `quantity_limits`, `commercial_use_allowed`, `rules` |
| 5 | Tips | `tips` |
| 6 | Terrain & Conditions | `terrain_notes` |
| 7 | History | `history` |
| 8 | Accessibility | `accessibility_notes` (only shown if present) |
| 9 | Photo Gallery | `cover_photo`, `images[]` (only shown if >1 image) |
| 10 | FAQ | `faq[]` (only shown if items exist) |
| 11 | Reviews | auto from `reviews` table |
| 12 | Nearby Locations | auto by state |
| Sidebar | Quick Facts | `difficulty`, `primary_category`, `best_season`, `vehicle_required`, `cell_service`, `fee_amount`, `permit_required`, `beginner_friendly`, `family_friendly`, `dog_friendly`, `hazards[]`, `latitude`, `longitude`, `nearest_services` |

---

## Complete Field Reference

### Identity / Routing (REQUIRED — row won't be routable without these)

| Field | Type | Notes |
|---|---|---|
| `name` | text | Official name of the site. Title case. No trademark symbols. |
| `slug` | text | URL-safe version of name. Lowercase, hyphens only. e.g. `crystal-peak-mine`. Must be unique within state+city. |
| `state` | text | Full state name. e.g. `Arizona`. Must match `US_STATES[].name` exactly. |
| `state_slug` | text | e.g. `arizona`. Must match `US_STATES[].slug` exactly. |
| `city` | text | Nearest city or town. Used for URL + browse page. |
| `city_slug` | text | Lowercase, hyphens. e.g. `tucson`. |
| `county` | text | County name without "County". e.g. `Pima`. |
| `county_slug` | text | Lowercase, hyphens. e.g. `pima`. |
| `published` | boolean | Set `false` while data is incomplete. Flip to `true` when ready to go live. |
| `featured` | boolean | Set `true` for top-quality, well-documented locations only. Appears on homepage. |

### Location / Geography

| Field | Type | Notes |
|---|---|---|
| `latitude` | decimal | Decimal degrees. e.g. `34.052235`. 6 decimal places ideal. Verify on Google Maps. |
| `longitude` | decimal | Decimal degrees. e.g. `-111.023456`. Always negative for US (West). |
| `address` | text | Physical address if one exists. Many sites have no address — leave null. |
| `nearest_city` | text | Closest town with services. May differ from `city`. e.g. `"Kingman"`. |
| `nearest_city_distance` | integer | Driving miles to `nearest_city`. Round to whole number. |
| `alternative_names` | text[] | Other known names: old names, nicknames, local names. e.g. `["Rainbow Ridge", "Virgin Valley Opal Mines"]`. |

### Content / Description

| Field | Type | Required | Notes |
|---|---|---|---|
| `short_description` | text | Yes | 1–2 sentences for card previews and "What You'll Find" intro. Max ~200 chars. No special characters. |
| `description` | text | Yes | 3–6 paragraphs. What the site is, what to expect, what makes it unique. Use `\n` between paragraphs. No em dashes — use regular hyphens. |
| `history` | text | If known | Origin of the site, mining history, geological formation, famous finds. |
| `tips` | text | Yes | Practical advice: best areas to search, what tools help, what to look for. 2–5 sentences. |
| `terrain_notes` | text | Yes | What the ground/access is like. Rocky, sandy, desert scrub, elevation, etc. |
| `accessibility_notes` | text | If relevant | Wheelchair access, stroller access, physical limitations. Leave null if fully inaccessible/standard. |
| `best_season` | text | Yes | Plain English. e.g. `"March - November"`, `"Year-round"`, `"Spring and Fall only"`. No em dashes. |

### Gem Types

| Field | Type | Notes |
|---|---|---|
| `gem_types` | text[] | Must use exact strings from the canonical list below. Case-sensitive. |

**Canonical gem type values** (must match exactly):
`Agate`, `Amethyst`, `Beryl`, `Calcite`, `Chalcedony`, `Chert`, `Chrysocolla`, `Citrine`, `Diamond`, `Emerald`, `Feldspar`, `Fluorite`, `Garnet`, `Gold`, `Jade`, `Jasper`, `Labradorite`, `Lapis Lazuli`, `Malachite`, `Mica`, `Moonstone`, `Obsidian`, `Onyx`, `Opal`, `Peridot`, `Petrified Wood`, `Quartz`, `Rose Quartz`, `Ruby`, `Sapphire`, `Serpentine`, `Silver`, `Smoky Quartz`, `Sunstone`, `Tanzanite`, `Tiger Eye`, `Topaz`, `Tourmaline`, `Turquoise`, `Zircon`

If a gem found at a site isn't in this list, add it to the list in `src/lib/constants.ts` first, then use it.

### Difficulty & Access

| Field | Type | Valid Values | Notes |
|---|---|---|---|
| `difficulty` | enum | `easy`, `moderate`, `hard`, `expert` | `easy` = flat, short walk. `moderate` = some climbing/distance. `hard` = significant effort. `expert` = technical, dangerous. |
| `access_type` | enum | `public`, `private`, `fee`, `permit` | High-level access classification. |
| `primary_category` | enum | `public_blm`, `national_forest`, `fee_dig`, `private`, `state_park`, `closed`, `other` | Most important field for filtering. See details below. |

**primary_category guide:**
- `public_blm` — Bureau of Land Management land. Free, open access. Most SW desert sites.
- `national_forest` — US Forest Service land. Usually free, check for permit zones.
- `fee_dig` — Commercial dig site. Pay to collect. Always set `fee_amount`.
- `private` — Private land. Must have explicit permission or it's trespassing.
- `state_park` — State park or state forest. Check collection rules — many prohibit collecting.
- `closed` — Actively closed, posted no trespassing, or collecting banned. Still list it with `published: false` so we don't create it later.
- `other` — County land, tribal land, reclamation sites, unclear ownership.

### Access Details

| Field | Type | Valid Values | Notes |
|---|---|---|---|
| `vehicle_required` | enum | `passenger`, `awd`, `4x4`, `atv`, `hiking` | Most conservative vehicle needed. If 4x4 in wet season but passable in dry, use `awd`. |
| `road_conditions` | text | — | Plain English. e.g. `"Paved to trailhead, 2-mile dirt road"`, `"Rough dirt road, passable year-round"`. |
| `parking_notes` | text | — | Where to park. Room for how many vehicles. Any restrictions. |
| `written_directions` | text | — | Turn-by-turn from nearest highway or town. This is the primary directions field shown on page. |
| `directions` | text | — | Secondary/supplemental directions. If same as `written_directions`, leave null. |
| `cell_service` | enum | `none`, `spotty`, `reliable` | At the collecting site, not in town. |
| `remoteness_rating` | integer | 1–5 | 1 = roadside. 5 = very remote, days from help. **Max value is 5.** |

### Fees & Permits

| Field | Type | Notes |
|---|---|---|
| `permit_required` | boolean | Default `false`. `true` only if a government permit is actually required. Fee dig tickets are NOT permits. |
| `permit_link` | text | URL to get the permit if `permit_required` is true. |
| `fee_amount` | decimal | In USD. `0` = explicitly free. `null` = unknown/not applicable. `25.00` = $25. |
| `commercial_use_allowed` | boolean | Default `false`. `true` only if site explicitly allows selling collected material. |

### Rules & Restrictions

| Field | Type | Notes |
|---|---|---|
| `collection_rules` | text | What collecting IS allowed. e.g. `"Personal use only, hand tools only"`. |
| `quantity_limits` | text | Weight or count limits. e.g. `"10 lbs per day per person"`, `"No limits on personal use quantities"`. |
| `rules` | text | Any additional site rules: no fires, no overnight camping, check-in required, etc. |

### Visitor Info

| Field | Type | Notes |
|---|---|---|
| `beginner_friendly` | boolean | `true` if surface collecting, easy walk, safe for new rockhounds. |
| `family_friendly` | boolean | `true` if suitable for kids. Easy terrain, no dangerous cliffs/mines. |
| `dog_friendly` | boolean | `true` if dogs are permitted AND terrain is reasonably safe for them. |
| `kid_age_range` | text | e.g. `"Ages 5+"`. Only set if family_friendly is true. |
| `hazards` | text[] | Use canonical values below only. |
| `nearest_services` | text | Comma-separated list of what's available nearby. e.g. `"Gas, Food, Lodging"`. |

**Canonical hazard values:**
`snakes`, `cliffs`, `abandoned_mines`, `heat`, `cold`, `flash_floods`, `sharp_material`, `loose_rock`, `wildlife`, `remote`

### SEO

| Field | Type | Notes |
|---|---|---|
| `meta_title` | text | If null, page auto-generates one. Only set to override the default. Max 60 chars. |
| `meta_description` | text | If null, page auto-generates one. Only set to override. Max 160 chars. |

### Media

| Field | Type | Notes |
|---|---|---|
| `cover_photo` | text | Public URL. Used as hero image and card thumbnail. Landscape ratio preferred. Must be a working URL. |
| `images` | text[] | Additional photo URLs. Used in the photo gallery. |

### FAQ

| Field | Type | Notes |
|---|---|---|
| `faq` | jsonb[] | Array of `{question: string, answer: string}` objects. 3–6 items ideal. Questions should be things people actually search. |

**Good FAQ questions to generate:**
- "What can I find at [name]?"
- "Is [name] free to visit?"
- "Do I need a permit to collect at [name]?"
- "What is the best time of year to visit [name]?"
- "What tools do I need for [name]?"
- "How do I get to [name]?"
- "Is [name] good for beginners?"
- "Are dogs allowed at [name]?"

---

## Slugging Rules

All slugs must be:
- Lowercase only
- Hyphens instead of spaces
- No special characters, apostrophes, or accents
- No trailing or leading hyphens

Examples:
- `Crystal Peak Mine` → `crystal-peak-mine`
- `Crater of Diamonds` → `crater-of-diamonds`
- `St. Mary's River` → `st-marys-river`
- `O'Brien Creek` → `obrien-creek`

`slug` must be **unique within the same `state_slug` + `city_slug` combination.** Two different states can share the same slug.

---

## Special Character Rules

**Never use these in any text field:**
- Em dash `—` → use ` - ` (space-hyphen-space)
- En dash `–` → use `-`
- Curly/smart quotes `" " ' '` → use straight quotes `"` and `'`
- Ellipsis `…` → use `...`
- Bullet `•` → use `-`

A Postgres trigger automatically sanitizes these on insert/update, but it's better to never introduce them.

---

## Data Quality Checklist (per location before import)

- [ ] GPS coordinates verified in Google Maps (drop a pin, confirm the pin lands at the actual site)
- [ ] `state_slug` and `city_slug` match exactly to `US_STATES` constants
- [ ] `slug` is unique (query Supabase first: `SELECT slug FROM locations WHERE state_slug = '...' AND city_slug = '...'`)
- [ ] All `gem_types` values are from the canonical list
- [ ] No em dashes or smart quotes in any text field
- [ ] `fee_amount` set to `0` if free, not null
- [ ] `permit_required` is actually `true` only if a government permit is needed (not just a fee ticket)
- [ ] `remoteness_rating` is 1–5 (not 1–10)
- [ ] `primary_category` matches actual land management status
- [ ] `description`, `tips`, `terrain_notes`, `best_season` all filled in (minimum viable content)
- [ ] `short_description` under 200 characters
- [ ] `published` set to `false` if content is incomplete

---

## Minimum Viable Location (fields needed before publishing)

These are the minimum fields to set `published: true`:

```
name, slug, state, state_slug, city, city_slug,
latitude, longitude,
gem_types (at least 1),
primary_category, difficulty,
short_description, description,
tips, best_season,
permit_required, fee_amount,
vehicle_required
```

All other fields enrich the page but are optional for go-live.

---

## Import SQL Pattern

```sql
INSERT INTO locations (
  name, slug, state, state_slug, city, city_slug, county, county_slug,
  latitude, longitude,
  nearest_city, nearest_city_distance,
  alternative_names,
  short_description, description, history, tips, terrain_notes,
  gem_types,
  difficulty, access_type, primary_category,
  vehicle_required, road_conditions, parking_notes,
  written_directions, directions, cell_service, remoteness_rating,
  permit_required, permit_link, fee_amount, commercial_use_allowed,
  collection_rules, quantity_limits, rules,
  best_season,
  beginner_friendly, family_friendly, dog_friendly, kid_age_range,
  hazards, nearest_services, accessibility_notes,
  cover_photo, images,
  faq,
  meta_title, meta_description,
  featured, published
) VALUES (
  ...
);
```

---

## Common Scraping Sources

- **iRockhound** — Good GPS coords and gem type data. Rules/permits often outdated.
- **Mindat.org** — Best for mineral species accuracy and geological context.
- **BLM.gov** — Authoritative for BLM land status and permit requirements.
- **Recreation.gov** — Fee dig sites and permit booking links.
- **AllTrails** — Useful for trail difficulty and terrain descriptions.
- **Google Maps Street View** — Verify road conditions and access.
- **State geological survey sites** — Best for history and geological context.
- **Rockhounding forums (Mindat, Tnet, Reddit r/rockhounds)** — Recent firsthand reports on road conditions, access changes, closures.

**Always cross-reference at least 2 sources before publishing GPS coordinates.**

---

## Notes on AI-Enriched Content

When using AI to write descriptions, tips, and history:
- Feed it factual data first (gem types, GPS, land type, access notes) — let it write prose from facts
- Always review for hallucinated permit requirements or fake regulations
- Never publish AI-generated `collection_rules` or `permit_required` without verifying against an official source
- `fee_amount` must always come from the operator's own website or a direct phone call — never from AI

---

*Last updated: 2026-04-19*
