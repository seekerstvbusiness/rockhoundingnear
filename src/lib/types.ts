export type Difficulty = 'easy' | 'moderate' | 'hard' | 'expert'
export type AccessType = 'public' | 'private' | 'fee' | 'permit'
export type PrimaryCategory = 'public_blm' | 'national_forest' | 'fee_dig' | 'private' | 'state_park' | 'closed' | 'other'
export type VehicleRequired = 'passenger' | 'awd' | '4x4' | 'atv' | 'hiking'
export type CellService = 'none' | 'spotty' | 'reliable'

export interface FaqItem {
  question: string
  answer: string
}

export interface Location {
  id: string
  name: string
  slug: string
  state: string
  state_slug: string
  city: string | null
  city_slug: string | null
  county: string | null
  county_slug: string | null
  nearest_city: string | null
  nearest_city_distance: number | null
  alternative_names: string[]
  short_description: string | null
  description: string | null
  history: string | null
  latitude: number | null
  longitude: number | null
  gem_types: string[]
  difficulty: Difficulty | null
  access_type: AccessType | null
  primary_category: PrimaryCategory | null
  collection_rules: string | null
  quantity_limits: string | null
  permit_required: boolean
  permit_link: string | null
  commercial_use_allowed: boolean
  fee_amount: number | null
  best_season: string | null
  cover_photo: string | null
  images: string[]
  featured: boolean
  published: boolean
  meta_title: string | null
  meta_description: string | null
  address: string | null
  directions: string | null
  written_directions: string | null
  vehicle_required: VehicleRequired | null
  road_conditions: string | null
  parking_notes: string | null
  terrain_notes: string | null
  tips: string | null
  rules: string | null
  beginner_friendly: boolean | null
  family_friendly: boolean | null
  kid_age_range: string | null
  accessibility_notes: string | null
  dog_friendly: boolean | null
  hazards: string[]
  cell_service: CellService | null
  nearest_services: string | null
  remoteness_rating: number | null
  faq: FaqItem[]
  rating_average: number
  rating_count: number
  created_at: string
  updated_at: string
}

export interface Review {
  id: string
  location_id: string
  author_name: string
  rating: number
  comment: string | null
  visit_date: string | null
  gem_found: string | null
  photo_urls: string[]
  verified: boolean
  created_at: string
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
