export type Difficulty = 'easy' | 'moderate' | 'hard' | 'expert'
export type AccessType = 'public' | 'private' | 'fee' | 'permit'

export interface Location {
  id: string
  name: string
  slug: string
  state: string
  state_slug: string
  city: string | null
  city_slug: string | null
  short_description: string | null
  description: string | null
  latitude: number | null
  longitude: number | null
  gem_types: string[]
  difficulty: Difficulty | null
  access_type: AccessType | null
  fee_amount: number | null
  best_season: string | null
  images: string[]
  featured: boolean
  published: boolean
  meta_title: string | null
  meta_description: string | null
  address: string | null
  directions: string | null
  tips: string | null
  rules: string | null
  created_at: string
  updated_at: string
}

export interface StateData {
  id: string
  name: string
  slug: string
  abbreviation: string
  short_description: string | null
  description: string | null
  location_count: number
  image_url: string | null
  meta_title: string | null
  meta_description: string | null
  featured_gems: string[]
}

export interface CityData {
  city: string
  city_slug: string
  state: string
  state_slug: string
  location_count: number
}
