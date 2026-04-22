import { buildSitemap, toW3CDate, XML_HEADERS } from '@/lib/sitemap-builder'
import { SITE_URL, GEM_TYPES } from '@/lib/constants'

export const revalidate = 86400

export async function GET() {
  const today = toW3CDate(new Date())

  const xml = buildSitemap(
    GEM_TYPES.map((gem) => ({
      loc: `${SITE_URL}/gem-types/${gem.toLowerCase().replace(/\s+/g, '-')}`,
      lastmod: today,
      changefreq: 'weekly' as const,
      priority: 0.7,
    }))
  )

  return new Response(xml, { headers: XML_HEADERS })
}
