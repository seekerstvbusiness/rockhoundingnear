import type { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'
import { US_STATES, SITE_URL } from '@/lib/constants'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${SITE_URL}/locations`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/states`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
  ]

  const stateRoutes: MetadataRoute.Sitemap = US_STATES.map((state) => ({
    url: `${SITE_URL}/locations/${state.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  // Fetch published locations for dynamic routes
  const { data: locations } = await supabase
    .from('locations')
    .select('slug, state_slug, city_slug, updated_at')
    .eq('published', true)

  const locationRoutes: MetadataRoute.Sitemap = (locations ?? []).map((loc) => ({
    url: `${SITE_URL}/locations/${loc.state_slug}/${loc.city_slug}/${loc.slug}`,
    lastModified: new Date(loc.updated_at),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [...staticRoutes, ...stateRoutes, ...locationRoutes]
}
