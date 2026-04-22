import { buildSitemapIndex, toW3CDate, XML_HEADERS } from '@/lib/sitemap-builder'
import { SITE_URL } from '@/lib/constants'

export const revalidate = 3600

export async function GET() {
  const today = toW3CDate(new Date())

  const xml = buildSitemapIndex([
    { loc: `${SITE_URL}/sitemap-pages.xml`, lastmod: today },
    { loc: `${SITE_URL}/sitemap-states.xml`, lastmod: today },
    { loc: `${SITE_URL}/sitemap-locations.xml`, lastmod: today },
  ])

  return new Response(xml, { headers: XML_HEADERS })
}
