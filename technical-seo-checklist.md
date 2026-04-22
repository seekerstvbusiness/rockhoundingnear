# RockhoundingNear.com — Technical SEO Checklist

Reference for every deployment and content milestone. Work through each section systematically.

---

## 1. Sitemaps

| Item | Status | Notes |
|---|---|---|
| Sitemap index at `/sitemap.xml` | ✅ Done | Route handler, lists all sub-sitemaps |
| `/sitemap-pages.xml` — static pages | ✅ Done | 10 pages, proper priority + changefreq |
| `/sitemap-states.xml` — all 50 states | ✅ Done | 50 URLs, revalidates daily |
| `/sitemap-gems.xml` — all gem types | ✅ Done | 40 URLs, auto-updates when GEM_TYPES changes |
| `/sitemap-locations.xml` — all locations | ✅ Done | Live from DB, image:image tags, lastmod from updated_at |
| Sitemaps use W3C date format (YYYY-MM-DD) | ✅ Done | |
| Image sitemap tags on location pages | ✅ Done | cover_photo + images[] included |
| Submit sitemap index to Google Search Console | ⬜ TODO | Submit `https://www.rockhoundingnear.com/sitemap.xml` |
| Submit sitemap to Bing Webmaster Tools | ⬜ TODO | Submit same URL |
| Submit sitemap to Yandex Webmaster | ⬜ TODO | Optional — low priority |
| Sitemap revalidation: pages/states/gems = 24h, locations = 1h | ✅ Done | |

**How to submit:**
- Google: Search Console → Sitemaps → enter `sitemap.xml` → Submit
- Bing: Bing Webmaster Tools → Sitemaps → Submit URL
- After bulk import: use GSC's URL Inspection tool to request indexing on key pages

---

## 2. Robots.txt

| Item | Status | Notes |
|---|---|---|
| `robots.txt` exists and returns valid content | ✅ Done | Next.js `robots.ts` |
| References sitemap index URL | ✅ Done | Points to `/sitemap.xml` |
| `host` directive set | ✅ Done | |
| `/api/` disallowed | ✅ Done | |
| `/_next/` disallowed | ✅ Done | |
| Check with Google's robots.txt tester | ⬜ TODO | GSC → robots.txt tester |

---

## 3. Canonical URLs

| Item | Status | Notes |
|---|---|---|
| All pages have `alternates.canonical` set | ✅ Done | Set in every page's `generateMetadata` |
| Homepage canonical uses `www` | ✅ Done | SITE_URL = `https://www.rockhoundingnear.com` |
| `www` vs non-`www` redirect enforced | ⬜ TODO | Verify in Vercel — should 301 non-www to www |
| No trailing slash inconsistency | ⬜ TODO | All internal links should NOT have trailing slashes |

**How to fix www redirect:** In Vercel project settings → Domains — set `rockhoundingnear.com` to redirect to `www.rockhoundingnear.com` (or vice versa, just be consistent with SITE_URL).

---

## 4. Meta Tags

| Item | Status | Notes |
|---|---|---|
| `<title>` on every page | ✅ Done | Title template in `layout.tsx` |
| `<meta name="description">` on every page | ✅ Done | |
| Open Graph `og:title`, `og:description`, `og:url` | ✅ Done | |
| `og:image` on location pages (uses cover_photo) | ✅ Done | |
| `og:image` on other pages | ⬜ TODO | Need a default OG image (1200×630px) |
| Twitter card tags | ✅ Done | `summary_large_image` type |
| Meta keywords | ✅ Done | On location pages |
| `robots` meta tag | ✅ Done | Via layout |
| Page titles under 60 characters | ⬜ TODO | Audit — some may be too long |
| Meta descriptions under 160 characters | ⬜ TODO | Audit auto-generated ones |

---

## 5. Structured Data (JSON-LD)

| Item | Status | Notes |
|---|---|---|
| `BreadcrumbList` schema on all pages | ✅ Done | `BreadcrumbSchema` component |
| `TouristAttraction` / `Place` schema on location pages | ✅ Done | `LocationSchema` component |
| `FAQPage` schema on location pages | ✅ Done | `FaqSchema` component |
| `WebSite` schema on homepage | ⬜ TODO | Add with `SearchAction` for sitelinks searchbox |
| `Organization` schema on homepage | ⬜ TODO | Helps brand knowledge panel |
| `ItemList` schema on browse pages | ⬜ TODO | For /locations, /states listing pages |
| Test all schemas with Google Rich Results Test | ⬜ TODO | `search.google.com/test/rich-results` |
| Test with Schema.org validator | ⬜ TODO | `validator.schema.org` |

**Add to homepage:**
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "url": "https://www.rockhoundingnear.com",
  "name": "RockhoundingNear.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://www.rockhoundingnear.com/locations?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

---

## 6. Core Web Vitals

| Item | Status | Notes |
|---|---|---|
| LCP (Largest Contentful Paint) < 2.5s | ⬜ TODO | Hero images are the main LCP element |
| FID / INP < 200ms | ⬜ TODO | Limited client JS — should be fine |
| CLS (Cumulative Layout Shift) < 0.1 | ⬜ TODO | Need to add width/height to all images |
| Use `next/image` for all location photos | ⬜ TODO | Currently using raw `<img>` tags |
| Add `width` and `height` to all `<img>` tags | ⬜ TODO | Prevents CLS |
| Preload hero/cover images | ⬜ TODO | Add `priority` prop on above-fold images |
| Check PageSpeed Insights | ⬜ TODO | `pagespeed.web.dev` — test homepage + a location page |
| Check Vercel Speed Insights | ⬜ TODO | Enable in Vercel dashboard |

**Biggest win:** Replace `<img>` with `next/image` on location cover photos. This gives automatic WebP conversion, lazy loading, and size optimization.

---

## 7. Mobile & Accessibility

| Item | Status | Notes |
|---|---|---|
| Responsive design on all pages | ✅ Done | Tailwind responsive classes |
| Mobile-first layout | ✅ Done | |
| Quick Facts above About on mobile | ✅ Done | CSS order classes |
| Touch targets ≥ 48px | ⬜ TODO | Audit nav links and buttons |
| Sufficient color contrast | ⬜ TODO | Test muted-foreground text against backgrounds |
| `alt` text on all images | ⬜ TODO | Audit — cover photos have alt, galleries need check |
| `aria-label` on icon-only buttons | ⬜ TODO | Audit mobile menu and review form |
| Mobile usability test in GSC | ⬜ TODO | GSC → Mobile Usability report |

---

## 8. Internal Linking

| Item | Status | Notes |
|---|---|---|
| Every location links to its state page | ✅ Done | Breadcrumb + sidebar |
| Every location links to gem type pages | ✅ Done | Gem type pills link to /gem-types/[gem] |
| Nearby locations section on each location page | ✅ Done | Up to 5 nearby |
| State pages link to city browse pages | ✅ Done | Browse by City section (2+ locations) |
| Gem type pages link to locations | ✅ Done | Location cards |
| Homepage links to featured locations | ✅ Done | |
| Footer links to 10 top states | ✅ Done | |
| Footer links to 10 popular gem types | ✅ Done | |
| Internal search / filter on /locations | ⬜ TODO | Would significantly improve internal linking depth |
| "Related gems" on each gem type page | ✅ Done | Up to 16 related gems |

---

## 9. URL Structure

| Item | Status | Notes |
|---|---|---|
| Clean, descriptive URLs | ✅ Done | `/locations/[state]/[city]/[slug]` |
| Lowercase URLs only | ✅ Done | All slugs lowercased |
| Hyphens not underscores | ✅ Done | |
| No URL parameters in indexed pages | ✅ Done | |
| Consistent trailing slash behavior | ⬜ TODO | Verify in Vercel config |
| Old URL redirects (e.g. city reassignments) | ⬜ TODO | Set up 301s for any changed URLs |

---

## 10. Page Speed Optimizations

| Item | Status | Notes |
|---|---|---|
| Google Fonts loaded with `display=swap` | ✅ Done | In layout.tsx |
| CSS purged (Tailwind) | ✅ Done | Tailwind v4 tree-shakes automatically |
| JavaScript bundle analyzed | ⬜ TODO | Run `npx @next/bundle-analyzer` |
| Images served in WebP/AVIF | ⬜ TODO | Switch to `next/image` |
| Images properly sized (no 4K images on 400px slots) | ⬜ TODO | |
| Supabase queries use `.select()` with only needed columns | ⬜ TODO | Audit — most use `select('*')` |
| Vercel Edge caching on static pages | ✅ Done | Next.js static generation handles this |

---

## 11. Indexing Control

| Item | Status | Notes |
|---|---|---|
| `published: false` locations excluded from all queries | ✅ Done | All Supabase queries filter `published = true` |
| `published: false` locations excluded from sitemaps | ✅ Done | Sitemap query filters `published = true` |
| API routes not indexed | ✅ Done | robots.txt disallows `/api/` |
| Admin pages not indexed | ✅ Done | robots.txt disallows `/admin/` |
| No `noindex` needed on paginated results (no pagination yet) | ✅ N/A | |
| `noindex` on search/filter result pages | ⬜ TODO | When search is added |

---

## 12. Search Console Setup

| Item | Status | Notes |
|---|---|---|
| Verify ownership of `rockhoundingnear.com` | ⬜ TODO | DNS TXT record or HTML file method |
| Verify `www.rockhoundingnear.com` as separate property | ⬜ TODO | Or use domain property (covers both) |
| Submit sitemap index | ⬜ TODO | After verification |
| Check for crawl errors weekly | ⬜ TODO | GSC → Coverage report |
| Set preferred domain (www vs non-www) | ⬜ TODO | In GSC → Settings |
| Monitor Core Web Vitals in GSC | ⬜ TODO | GSC → Core Web Vitals |
| Monitor mobile usability | ⬜ TODO | GSC → Mobile Usability |

**GSC verification options:**
- Fastest: Add a `<meta name="google-site-verification">` tag to layout.tsx
- Permanent: Add a DNS TXT record in your domain registrar

---

## 13. Bing Webmaster Tools

| Item | Status | Notes |
|---|---|---|
| Create Bing Webmaster Tools account | ⬜ TODO | `bing.com/webmasters` |
| Verify ownership | ⬜ TODO | Import from GSC (fastest) or XML file |
| Submit sitemap | ⬜ TODO | Same `/sitemap.xml` URL |
| Enable Bingbot crawling | ⬜ TODO | Auto-enabled after verification |

---

## 14. Open Graph Images

| Item | Status | Notes |
|---|---|---|
| Default OG image (1200×630px) for pages without photos | ⬜ TODO | Used on /about, /blog, /gem-types etc. |
| Location pages use cover_photo as OG image | ✅ Done | Set in generateMetadata |
| OG image under 1MB | ⬜ TODO | When images are added |
| Test OG tags with opengraph.xyz | ⬜ TODO | `opengraph.xyz` |
| Test Twitter card with Twitter Card Validator | ⬜ TODO | `cards-dev.twitter.com/validator` |

---

## 15. After Bulk Import — Indexing Sprint

Run these steps after every major batch of locations is imported:

1. **Ping Google**: After import, run a fetch on key new pages in GSC (URL Inspection → Request Indexing)
2. **Update sitemap lastmod**: The sitemap auto-updates since it queries live DB
3. **Submit sitemap again** if you add 50+ new locations at once — this signals Google to recrawl
4. **Check coverage**: GSC → Coverage → Valid tab — verify new pages appear within 1–2 weeks
5. **Internal links**: Ensure new locations appear in "Nearby" sections and state/city pages

---

## Priority Order (do these first)

1. **Verify in Google Search Console** — Can't track indexing without this
2. **Submit sitemap** — Accelerates discovery of all pages
3. **Fix www redirect** — Prevents split PageRank between www and non-www
4. **Replace `<img>` with `next/image`** — Biggest Core Web Vitals win
5. **Add default OG image** — Every shared link currently has no preview image
6. **Add WebSite + Organization JSON-LD on homepage** — Helps brand Knowledge Panel

---

*Last updated: 2026-04-19*
