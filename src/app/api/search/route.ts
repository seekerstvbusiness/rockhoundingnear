import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim() ?? ''
  if (q.length < 2) return NextResponse.json({ locations: [] })

  const { data } = await supabase
    .from('locations')
    .select('name, state, state_slug, city, city_slug, slug')
    .ilike('name', `%${q}%`)
    .eq('published', true)
    .limit(5)

  const locations = (data ?? []).map((loc) => ({
    ...loc,
    url: `/locations/${loc.state_slug}${loc.city_slug ? `#rockhounding-in-${loc.city_slug}` : ''}`,
  }))

  return NextResponse.json({ locations })
}
