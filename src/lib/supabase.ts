import { createClient } from '@supabase/supabase-js'
import type { Location, StateData, Review } from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function getLocations(limit = 12): Promise<Location[]> {
  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .eq('published', true)
    .order('featured', { ascending: false })
    .order('name')
    .limit(limit)
  if (error) { console.error(error); return [] }
  return data ?? []
}

export async function getFeaturedLocations(): Promise<Location[]> {
  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .eq('published', true)
    .eq('featured', true)
    .limit(6)
  if (error) { console.error(error); return [] }
  return data ?? []
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
    .select('*')
    .eq('state_slug', stateSlug)
    .eq('published', true)
    .order('featured', { ascending: false })
    .order('name')
  if (error) { console.error(error); return [] }
  return data ?? []
}

export async function getLocationsByCity(
  stateSlug: string,
  citySlug: string
): Promise<Location[]> {
  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .eq('state_slug', stateSlug)
    .eq('city_slug', citySlug)
    .eq('published', true)
    .order('name')
  if (error) { console.error(error); return [] }
  return data ?? []
}

export async function getNearbyLocations(
  stateSlug: string,
  excludeSlug: string,
  limit = 4
): Promise<Location[]> {
  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .eq('state_slug', stateSlug)
    .neq('slug', excludeSlug)
    .eq('published', true)
    .limit(limit)
  if (error) { console.error(error); return [] }
  return data ?? []
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

export async function getCitiesInState(stateSlug: string) {
  const { data, error } = await supabase
    .from('locations')
    .select('city, city_slug')
    .eq('state_slug', stateSlug)
    .eq('published', true)
    .not('city', 'is', null)
  if (error) { console.error(error); return [] }
  const seen = new Set<string>()
  return (data ?? []).filter((r) => {
    if (!r.city_slug || seen.has(r.city_slug)) return false
    seen.add(r.city_slug)
    return true
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
    .select('*')
    .contains('gem_types', [gemType])
    .eq('published', true)
    .order('featured', { ascending: false })
    .order('name')
    .limit(limit)
  if (error) { console.error(error); return [] }
  return data ?? []
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
