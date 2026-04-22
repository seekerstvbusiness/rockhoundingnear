# RockhoundingNear.com — Master To-Do List

Ask me "what should we work on?" and I'll pull from this list and recommend the next best task.
Items are grouped by area and roughly ordered by priority within each group.

---

## UI / UX

- [x] **Full UI/UX audit** — Go through every page template as a UI/UX expert and fix every issue, improve spacing, typography, hierarchy, empty states, loading states, edge cases
  - [x] Homepage
  - [x] /locations (browse index)
  - [x] /locations/[state] (state page)
  - [x] /locations/[state]/[city] (city page)
  - [x] /locations/[state]/[city]/[slug] (location detail)
  - [x] /gem-types (gem index)
  - [x] /gem-types/[gem] (per-gem page)
  - [x] /states (all states)
  - [x] /blog (coming soon page)
  - [x] /about
  - [x] /contact
  - [x] /sitemap (visual HTML sitemap)
  - [x] /privacy-policy
  - [x] /terms
  - [x] 404 not-found page
- [ ] **Create a UI/UX checklist** — Document all standards: spacing scale, typography rules, color usage, icon consistency, mobile breakpoints, empty state patterns, loading skeletons
- [x] **Homepage search autocomplete** — As user types in the search box, show matching locations, states, and gem types as a dropdown so they can select directly (no need to press Enter)
- [x] **Gem types — add missing descriptions** — All 40 gem types have descriptions in the index page

---

## SEO / Technical

- [x] **Sitemap XML styling (XSLT)** — `public/sitemap.xsl` serves a branded HTML view; all 5 sitemaps reference it via the `<?xml-stylesheet?>` PI
- [ ] **Finish technical SEO checklist** — See `technical-seo-checklist.md` for the full list. Key outstanding items:
  - [ ] Verify ownership of rockhoundingnear.com in Google Search Console
  - [ ] Submit sitemap.xml to Google Search Console
  - [ ] Submit sitemap.xml to Bing Webmaster Tools (import from GSC)
  - [ ] Fix www vs non-www redirect in Vercel (must be consistent with SITE_URL)
  - [x] Add default OG image (1200×630px) — `src/app/opengraph-image.tsx` with branded ruby gradient design
  - [ ] Test all JSON-LD schemas with Google Rich Results Test
  - [ ] Run PageSpeed Insights on homepage and a location page
  - [ ] Replace all `<img>` tags with `next/image` for automatic WebP + lazy loading
  - [x] Audit all page titles (under 60 chars) and meta descriptions (under 160 chars) — fixed root title (61→56) and SITE_DESCRIPTION (168→148)
- [ ] **Full site audit after all fixes** — After UI/UX and SEO work is done, audit every page for remaining issues, compile a final bug/improvement list, then implement all fixes

---

## Content / Data

- [ ] **Image compression & optimization** — All images imported (cover photos, gallery images) must be compressed and served optimally. Plan:
  - Compress on upload before storing in Supabase Storage (use Sharp or similar)
  - Serve via `next/image` for automatic WebP conversion and responsive sizing
  - Max file size: 200KB for cover photos, 100KB for gallery images
  - Add width/height metadata to prevent CLS (layout shift)
- [ ] **Gem type descriptions** — Every gem type needs a 2–3 sentence description of what it is, where it's commonly found in the US, and what makes it interesting to rockhounds
- [ ] **Fix null/empty fields on existing locations** — Many imported locations have null directions, empty rules, missing best_season, no tips, etc. Audit the Supabase table and re-enrich or manually fill any critical fields that are blank
- [ ] **Fix image pipeline — use browser-based discovery** — The current Wikimedia text search approach fails to find relevant images. Replace with a browser-driven method: open each location's page (rockhounding.org, mindat.org, Google Images, etc.) and extract actual photos of the site and the specific minerals found there. Verify each image with Claude vision before storing. Must produce real, relevant images — not random stock photos

---

## Admin / Dashboard

- [ ] **Admin dashboard** — Build a password-protected internal dashboard at `/admin` with:
  - [ ] **CSV bulk importer** — Upload a CSV file of locations, preview the parsed data, validate fields, then import to Supabase with one click. Map CSV columns to DB fields
  - [ ] **Analytics view** — Show page views, top locations, top states, top gem types, traffic sources (integrate Vercel Analytics or Google Analytics data)
  - [ ] **Blog CMS** — Create, edit, publish, and delete blog posts with a rich text editor (like WordPress editor experience). Full controls: title, slug, featured image, category, tags, publish date, draft/publish toggle
  - [ ] **Form submissions viewer** — See all contact form submissions in a table with date, subject, name, email, message. Mark as read/resolved
  - [ ] **Location manager** — List all locations, filter by state/published status, quick edit published toggle, click through to edit full location data

---

## Contact Form

- [x] **Expand contact form subject options** — Contact form already has all specific options
- [x] **Store form submissions in Supabase** — `/api/contact` route stores to `contact_submissions` table with success/error feedback
- [ ] **Email notification on submission** — Send an email to `hello@rockhoundingnear.com` when a new submission arrives (use Resend or similar)

---

## Performance

- [ ] **Replace all `<img>` with `next/image`** — Applies to: location cover photos (hero + card), gallery images, any hardcoded images. Gives: automatic WebP, lazy loading, responsive sizes, no CLS
- [ ] **Image upload compression pipeline** — When images are added to locations (via admin or import), compress them before storing: resize to max 1920px wide, convert to WebP, target <200KB
- [ ] **Supabase query optimization** — Most queries use `select('*')`. Change to select only the columns each page actually needs, reducing payload size

---

## Completed

- [x] Built all core page templates (homepage, locations, states, gem-types, location detail)
- [x] Fixed GitHub → Vercel auto-deploy webhook
- [x] Fixed special character (em dash, smart quotes) rendering site-wide
- [x] Created permanent Postgres trigger to sanitize special chars on all future imports
- [x] Fixed Browse by City — only shows cities with 2+ locations, sorted alphabetically
- [x] Fixed bad city assignments (Brothers OR → Bend, Hiddenite NC → Taylorsville, etc.)
- [x] Fixed global 404 — was showing "Location Not Found" for all broken URLs
- [x] Created all missing footer pages: /blog, /sitemap, /privacy-policy, /terms
- [x] Mobile layout — Quick Facts shows above About section on phones
- [x] Standardized location page sections — all sections always render, placeholders when no data
- [x] Built professional sitemap system (index + 4 sub-sitemaps with image support)
- [x] robots.txt points to sitemap index
- [x] Created data-import-guide.md — field reference for bulk import
- [x] Created technical-seo-checklist.md — full SEO audit list

---

*Update this file as items are completed or new tasks are discovered.*
