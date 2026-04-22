import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim() ?? ''
  if (q.length < 2) return NextResponse.json({ locations: [], cities: [] })

  const [locResult, cityResult] = await Promise.all([
    supabase
      .from('locations')
      .select('name, state, state_slug, city, city_slug, slug')
      .ilike('name', `%${q}%`)
      .eq('published', true)
      .limit(5),
    supabase
      .from('locations')
      .select('city, state, state_slug, city_slug')
      .ilike('city', `%${q}%`)
      .eq('published', true)
      .not('city_slug', 'is', null)
      .not('city', 'is', null)
      .limit(50),
  ])

  const locations = (locResult.data ?? []).map((loc) => ({
    ...loc,
    url: `/locations/${loc.state_slug}${loc.city_slug ? `#rockhounding-in-${loc.city_slug}` : ''}`,
  }))

  // Deduplicate cities by city_slug + state_slug
  const cityMap = new Map<string, { city: string; state: string; state_slug: string; city_slug: string }>()
  for (const r of cityResult.data ?? []) {
    if (!r.city_slug) continue
    const key = `${r.city_slug}_${r.state_slug}`
    if (!cityMap.has(key)) cityMap.set(key, r as { city: string; state: string; state_slug: string; city_slug: string })
  }
  const cities = [...cityMap.values()].slice(0, 4)

  return NextResponse.json({ locations, cities })
}
