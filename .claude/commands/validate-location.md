# /validate-location

Runs the quality checklist on a single enriched location and prints a pass/fail report.

**Usage:** `/validate-location [slug]`  
**Example:** `/validate-location crystal-peak-mine-az`

## Arguments

`$ARGUMENTS` — the location slug

## Steps

1. Read `scripts/data/enriched/{slug}.json`.
2. Run each check below. Print ✓ or ✗ for each.

## Quality Checks

### Required Fields (must be present and non-null)
- [ ] `name` — non-empty string
- [ ] `slug` — lowercase, hyphens only, no special chars
- [ ] `state` + `state_slug` — must be in the canonical US_STATES list
- [ ] `city` + `city_slug` — non-null
- [ ] `lat` — between 24.0 and 49.5 (continental US + Alaska/Hawaii range)
- [ ] `lng` — between -179.0 and -66.0
- [ ] `gem_types` — array with at least 1 item, all from canonical list
- [ ] `short_description` — present, under 200 chars
- [ ] `description` — present, at least 100 chars
- [ ] `tips` — present
- [ ] `best_season` — present
- [ ] `primary_category` — valid enum value
- [ ] `difficulty` — valid enum value
- [ ] `vehicle_required` — valid enum value
- [ ] `permit_required` — boolean (not null)

### Data Quality Checks
- [ ] No em dashes `—` in any text field
- [ ] No smart quotes `"` `"` `'` `'` in any text field
- [ ] `remoteness_rating` — 1 to 5 (not 0, not null, not >5)
- [ ] `fee_amount` — if `primary_category === 'fee_dig'`, fee_amount should not be null
- [ ] `hazards` — all items from canonical list: snakes, cliffs, abandoned_mines, heat, cold, flash_floods, sharp_material, loose_rock, wildlife, remote
- [ ] `faq` — array of `{question, answer}` objects, 3-6 items

### Warnings (not blocking but print anyway)
- `needs_review_fields` — list if non-empty
- `cover_photo` — warn if null
- `written_directions` — warn if null

3. Print final verdict:
   - `✓ PASS — {slug}` if all required checks pass
   - `✗ FAIL — {slug} — {N} issues` and list the failed checks

4. If PASS, copy file to `scripts/data/validated/{slug}.json`.
