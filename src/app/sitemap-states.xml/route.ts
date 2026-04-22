import { buildSitemap, toW3CDate, XML_HEADERS } from '@/lib/sitemap-builder'
import { supabase } from '@/lib/supabase'
import { SITE_URL, US_STATES } from '@/lib/constants'

export const revalidate = 3600

export async function GET() {
  const today = toW3CDate(new Date())

  // Fetch one representative image per state for image sitemap
  const { data: stateImages } = await supabase
    .from('states')
    .select('slug, image_url')

  const imageMap = new Map<string, string>()
  for (const row of stateImages ?? []) {
    if (row.image_url) imageMap.set(row.slug, row.image_url)
  }

  const xml = buildSitemap(
    US_STATES.map((state) => ({
      loc: `${SITE_URL}/locations/${state.slug}`,
      lastmod: today,
      changefreq: 'weekly' as const,
      priority: 0.9,
      ...(imageMap.get(state.slug) && {
        images: [{ loc: imageMap.get(state.slug)!, title: `Rockhounding in ${state.name}` }],
      }),
    }))
  )

  return new Response(xml, { headers: XML_HEADERS })
}
