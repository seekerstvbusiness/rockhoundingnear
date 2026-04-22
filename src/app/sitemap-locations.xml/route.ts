import { buildSitemap, toW3CDate, XML_HEADERS } from '@/lib/sitemap-builder'
import { supabase } from '@/lib/supabase'
import { SITE_URL, US_STATES } from '@/lib/constants'

export const revalidate = 3600

// This sitemap lists all 50 state pillar pages with their location images.
// Individual location pages no longer exist; all content is on the state page.
export async function GET() {
  const today = toW3CDate(new Date())

  const { data: locations, error } = await supabase
    .from('locations')
    .select('state_slug, name, cover_photo, images, updated_at')
    .eq('published', true)
    .not('cover_photo', 'is', null)

  if (error || !locations) {
    return new Response(
      '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>',
      { headers: XML_HEADERS }
    )
  }

  // Group images by state, cap at 50 per Google's sitemap image limit
  const stateImages = new Map<string, { loc: string; title: string }[]>()
  for (const loc of locations) {
    const imgs = stateImages.get(loc.state_slug) ?? []
    if (imgs.length >= 50) continue
    const allImgs: string[] = [
      ...(loc.cover_photo ? [loc.cover_photo] : []),
      ...((loc.images as string[] | null) ?? []),
    ].filter(Boolean)
    for (const imgUrl of allImgs) {
      if (imgs.length >= 50) break
      imgs.push({ loc: imgUrl, title: loc.name })
    }
    stateImages.set(loc.state_slug, imgs)
  }

  const xml = buildSitemap(
    US_STATES.map((state) => ({
      loc: `${SITE_URL}/locations/${state.slug}`,
      lastmod: today,
      changefreq: 'weekly' as const,
      priority: 0.9,
      images: stateImages.get(state.slug) ?? [],
    })).filter((entry) => entry.images.length > 0)
  )

  return new Response(xml, { headers: XML_HEADERS })
}
