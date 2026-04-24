import { createClient } from '@supabase/supabase-js'
import type { Location, StateData, Review } from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

const CARD_FIELDS = 'id, name, slug, state, state_slug, city, city_slug, short_description, cover_photo, images, gem_types, featured, difficulty'

export async function getLocations(limit = 12): Promise<Location[]> {
  const { data, error } = await supabase
    .from('locations')
    .select(CARD_FIELDS)
    .eq('published', true)
    .order('featured', { ascending: false })
    .order('name')
    .limit(limit)
  if (error) { console.error(error); return [] }
  return (data ?? []) as unknown as Location[]
}

export async function getFeaturedLocations(): Promise<Location[]> {
  const { data, error } = await supabase
    .from('locations')
    .select(CARD_FIELDS)
    .eq('published', true)
    .eq('featured', true)
    .limit(6)
  if (error) { console.error(error); return [] }
  return (data ?? []) as unknown as Location[]
}

export async function getLocationBySlug(
  stateSlug: string,
  citySlug: string,
  slug: string
): Promise<Location | null> {
  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .eq('state_slug', stateSlug)
    .eq('city_slug', citySlug)
    .eq('slug', slug)
    .eq('published', true)
    .single()
  if (error) { console.error(error); return null }
  return data
}

export async function getLocationsByState(stateSlug: string): Promise<Location[]> {
  const { data, error } = await supabase
    .from('locations')
    .select(CARD_FIELDS)
    .eq('state_slug', stateSlug)
    .eq('published', true)
    .order('featured', { ascending: false })
    .order('name')
  if (error) { console.error(error); return [] }
  return (data ?? []) as unknown as Location[]
}

export async function getFullLocationsByState(stateSlug: string): Promise<Location[]> {
  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .eq('state_slug', stateSlug)
    .eq('published', true)
    .order('featured', { ascending: false })
    .order('name')
  if (error) { console.error(error); return [] }
  return (data ?? []) as Location[]
}

export async function getLocationsByCity(
  stateSlug: string,
  citySlug: string
): Promise<Location[]> {
  const { data, error } = await supabase
    .from('locations')
    .select(CARD_FIELDS)
    .eq('state_slug', stateSlug)
    .eq('city_slug', citySlug)
    .eq('published', true)
    .order('name')
  if (error) { console.error(error); return [] }
  return (data ?? []) as unknown as Location[]
}

export async function getNearbyLocations(
  stateSlug: string,
  excludeSlug: string,
  limit = 4
): Promise<Location[]> {
  const { data, error } = await supabase
    .from('locations')
    .select(CARD_FIELDS)
    .eq('state_slug', stateSlug)
    .neq('slug', excludeSlug)
    .eq('published', true)
    .limit(limit)
  if (error) { console.error(error); return [] }
  return (data ?? []) as unknown as Location[]
}

export async function getStateData(slug: string): Promise<StateData | null> {
  const { data, error } = await supabase
    .from('states')
    .select('*')
    .eq('slug', slug)
    .single()
  if (error) { console.error(error); return null }
  return data
}

export async function getAllStates(): Promise<StateData[]> {
  const { data, error } = await supabase
    .from('states')
    .select('*')
    .order('name')
  if (error) { console.error(error); return [] }
  return data ?? []
}

export async function getBestCities(limit = 12): Promise<{ city: string; state: string; state_slug: string; city_slug: string; count: number }[]> {
  const { data, error } = await supabase
    .from('locations')
    .select('city, state, state_slug, city_slug')
    .eq('published', true)
    .not('city_slug', 'is', null)
  if (error) { console.error(error); return [] }

  const counts = new Map<string, { city: string; state: string; state_slug: string; city_slug: string; count: number }>()
  for (const r of data ?? []) {
    if (!r.city_slug) continue
    const existing = counts.get(r.city_slug + '_' + r.state_slug)
    if (existing) existing.count++
    else counts.set(r.city_slug + '_' + r.state_slug, { city: r.city, state: r.state, state_slug: r.state_slug, city_slug: r.city_slug, count: 1 })
  }

  return [...counts.values()]
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
}

export async function getCitiesInState(stateSlug: string) {
  const { data, error } = await supabase
    .from('locations')
    .select('city, city_slug')
    .eq('state_slug', stateSlug)
    .eq('published', true)
    .not('city', 'is', null)
    .not('city_slug', 'is', null)
  if (error) { console.error(error); return [] }

  // Count locations per city, keep only cities with 2+ locations
  const counts = new Map<string, { city: string; city_slug: string; count: number }>()
  for (const r of data ?? []) {
    if (!r.city_slug) continue
    const existing = counts.get(r.city_slug)
    if (existing) existing.count++
    else counts.set(r.city_slug, { city: r.city, city_slug: r.city_slug, count: 1 })
  }

  return [...counts.values()]
    .sort((a, b) => b.count - a.count || a.city.localeCompare(b.city))
}

export async function getNearbyStatesEnriched(slugs: string[]): Promise<StateData[]> {
  if (slugs.length === 0) return []

  const [{ data: statesRows }, { data: locRows }] = await Promise.all([
    supabase.from('states').select('slug, name, abbreviation, image_url, featured_gems').in('slug', slugs),
    supabase.from('locations').select('state_slug, cover_photo, gem_types').in('state_slug', slugs).eq('published', true),
  ])

  // Compute per-state counts, first cover photo, and top gems from locations
  const computed = new Map<string, { count: number; image: string | null; gemCounts: Map<string, number> }>()
  for (const loc of locRows ?? []) {
    const entry = computed.get(loc.state_slug) ?? { count: 0, image: null, gemCounts: new Map() }
    entry.count++
    if (!entry.image && loc.cover_photo) entry.image = loc.cover_photo
    for (const gem of loc.gem_types ?? []) {
      entry.gemCounts.set(gem, (entry.gemCounts.get(gem) ?? 0) + 1)
    }
    computed.set(loc.state_slug, entry)
  }

  return slugs.map((slug) => {
    const db = statesRows?.find((s) => s.slug === slug)
    const c = computed.get(slug) ?? { count: 0, image: null, gemCounts: new Map() }
    const topGems = [...c.gemCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([g]) => g)

    return {
      id: slug,
      name: db?.name ?? slug,
      slug,
      abbreviation: db?.abbreviation ?? slug.slice(0, 2).toUpperCase(),
      short_description: null,
      description: null,
      location_count: c.count,
      image_url: db?.image_url ?? c.image,
      meta_title: null,
      meta_description: null,
      featured_gems: db?.featured_gems?.length ? db.featured_gems : topGems,
    } satisfies StateData
  })
}

export async function getReviewsForLocation(locationId: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('location_id', locationId)
    .eq('published', true)
    .order('created_at', { ascending: false })
  if (error) { console.error(error); return [] }
  return data ?? []
}

export async function uploadReviewPhoto(
  locationId: string,
  file: File
): Promise<string | null> {
  const ext = file.name.split('.').pop() ?? 'jpg'
  const path = `${locationId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const { data, error } = await supabase.storage
    .from('review-photos')
    .upload(path, file, { contentType: file.type, upsert: false })
  if (error) { console.error(error); return null }
  const { data: { publicUrl } } = supabase.storage
    .from('review-photos')
    .getPublicUrl(data.path)
  return publicUrl
}

export async function getLocationsByGemType(gemType: string, limit = 24): Promise<Location[]> {
  const { data, error } = await supabase
    .from('locations')
    .select(CARD_FIELDS)
    .contains('gem_types', [gemType])
    .eq('published', true)
    .order('featured', { ascending: false })
    .order('name')
    .limit(limit)
  if (error) { console.error(error); return [] }
  return (data ?? []) as unknown as Location[]
}

export async function submitReview(review: {
  location_id: string
  author_name: string
  author_email?: string
  rating: number
  comment?: string
  visit_date?: string
  gem_found?: string
  photo_urls?: string[]
}): Promise<boolean> {
  const { error } = await supabase.from('reviews').insert([review])
  if (error) { console.error(error); return false }
  return true
}
