import { buildSitemap, toW3CDate, XML_HEADERS } from '@/lib/sitemap-builder'
import { supabase } from '@/lib/supabase'
import { SITE_URL, US_STATES } from '@/lib/constants'

export const revalidate = 3600

export async function GET() {
  const today = toW3CDate(new Date())

  const { data: locations } = await supabase
    .from('locations')
    .select('state_slug, name, cover_photo, images')
    .eq('published', true)
    .not('cover_photo', 'is', null)

  // Group images by state, cap at 50 per Google's sitemap image limit
  const stateImages = new Map<string, { loc: string; title: string }[]>()
  for (const loc of locations ?? []) {
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

  // All 50 state pages — include image data where available
  const xml = buildSitemap(
    US_STATES.map((state) => ({
      loc: `${SITE_URL}/locations/${state.slug}`,
      lastmod: today,
      images: stateImages.get(state.slug) ?? [],
    }))
  )

  return new Response(xml, { headers: XML_HEADERS })
}
