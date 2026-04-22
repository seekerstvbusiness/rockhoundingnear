import { buildSitemap, toW3CDate, XML_HEADERS } from '@/lib/sitemap-builder'
import { SITE_URL } from '@/lib/constants'

export const revalidate = 86400 // 24 hours; static pages rarely change

export async function GET() {
  const today = toW3CDate(new Date())

  const xml = buildSitemap([
    { loc: SITE_URL,                        lastmod: today, changefreq: 'daily',   priority: 1.0 },
    { loc: `${SITE_URL}/locations`,         lastmod: today, changefreq: 'daily',   priority: 0.9 },
    { loc: `${SITE_URL}/blog`,              lastmod: today, changefreq: 'weekly',  priority: 0.6 },
    { loc: `${SITE_URL}/about`,             lastmod: today, changefreq: 'monthly', priority: 0.5 },
    { loc: `${SITE_URL}/contact`,           lastmod: today, changefreq: 'monthly', priority: 0.4 },
    { loc: `${SITE_URL}/privacy-policy`,    lastmod: today, changefreq: 'yearly',  priority: 0.2 },
    { loc: `${SITE_URL}/terms`,             lastmod: today, changefreq: 'yearly',  priority: 0.2 },
  ])

  return new Response(xml, { headers: XML_HEADERS })
}
