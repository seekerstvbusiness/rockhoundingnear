import { buildSitemap, toW3CDate, XML_HEADERS } from '@/lib/sitemap-builder'
import { SITE_URL } from '@/lib/constants'

export const revalidate = 86400

export async function GET() {
  const today = toW3CDate(new Date())

  const xml = buildSitemap([
    { loc: SITE_URL,                        lastmod: today },
    { loc: `${SITE_URL}/locations`,         lastmod: today },
    { loc: `${SITE_URL}/blog`,              lastmod: today },
    { loc: `${SITE_URL}/about`,             lastmod: today },
    { loc: `${SITE_URL}/contact`,           lastmod: today },
    { loc: `${SITE_URL}/privacy-policy`,    lastmod: today },
    { loc: `${SITE_URL}/terms`,             lastmod: today },
  ])

  return new Response(xml, { headers: XML_HEADERS })
}
