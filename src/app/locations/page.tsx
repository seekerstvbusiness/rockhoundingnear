import type { Metadata } from 'next'
import Link from 'next/link'
import { MapPin, ChevronRight, Gem, SlidersHorizontal } from 'lucide-react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { LocationCard } from '@/components/locations/LocationCard'
import { BreadcrumbSchema } from '@/components/seo/JsonLd'
import { getLocations } from '@/lib/supabase'
import { US_STATES, GEM_TYPES, SITE_URL, SITE_NAME } from '@/lib/constants'

export const metadata: Metadata = {
  title: `All Rockhounding Locations — ${SITE_NAME}`,
  description: 'Browse rockhounding sites across all 50 US states. Filter by state, gem type, difficulty, or access. Find your next adventure with maps, GPS, and tips.',
  alternates: { canonical: `${SITE_URL}/locations` },
  openGraph: {
    title: `All Rockhounding Locations — ${SITE_NAME}`,
    description: 'Browse rockhounding sites across all 50 US states.',
    url: `${SITE_URL}/locations`,
  },
}

const FEATURED_GEM_TYPES = [
  'Agate', 'Amethyst', 'Garnet', 'Gold', 'Jasper',
  'Obsidian', 'Opal', 'Petrified Wood', 'Quartz', 'Turquoise',
]

const STATE_REGIONS: { label: string; states: string[] }[] = [
  { label: 'Southwest', states: ['arizona', 'new-mexico', 'nevada', 'utah', 'colorado'] },
  { label: 'Pacific Northwest', states: ['oregon', 'washington', 'idaho', 'montana'] },
  { label: 'California', states: ['california'] },
  { label: 'Southeast', states: ['georgia', 'north-carolina', 'tennessee', 'arkansas', 'alabama'] },
  { label: 'Rocky Mountains', states: ['wyoming', 'south-dakota', 'north-dakota'] },
  { label: 'Midwest & Plains', states: ['michigan', 'iowa', 'kansas', 'nebraska', 'minnesota'] },
  { label: 'Northeast', states: ['maine', 'vermont', 'new-york', 'pennsylvania', 'connecticut'] },
  { label: 'Texas & South', states: ['texas', 'oklahoma', 'louisiana', 'mississippi'] },
]

export default async function LocationsPage() {
  const locations = await getLocations(12)

  const breadcrumbItems = [
    { name: 'Home', url: SITE_URL },
    { name: 'Locations', url: `${SITE_URL}/locations` },
  ]

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />

      {/* Hero */}
      <section className="bg-ruby-gradient py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb className="mb-6">
            <BreadcrumbList className="text-white/70">
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="hover:text-white">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-white/40">
                <ChevronRight className="w-4 h-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage className="text-white">Locations</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-3">
            Rockhounding Locations
          </h1>
          <p className="text-white/75 text-lg max-w-2xl">
            Verified gem hunting, mineral collecting, and fossil sites across every US state — with GPS, access details, and rockhound-reviewed tips.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Browse by gem type */}
        <section className="mb-14">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading text-2xl font-bold text-foreground">Browse by Gem Type</h2>
            <Link href="/gem-types" className="text-sm text-primary hover:underline flex items-center gap-1">
              All gem types <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {FEATURED_GEM_TYPES.map((gem) => (
              <Link
                key={gem}
                href={`/gem-types/${gem.toLowerCase().replace(/\s+/g, '-')}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-border bg-card hover:border-ruby-300 hover:bg-ruby-50 hover:text-primary text-sm font-medium transition-all"
              >
                <Gem className="w-3.5 h-3.5 text-ruby-400" />
                {gem}
              </Link>
            ))}
            <Link
              href="/gem-types"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-dashed border-border text-muted-foreground hover:border-ruby-300 hover:text-primary text-sm transition-all"
            >
              +{GEM_TYPES.length - FEATURED_GEM_TYPES.length} more →
            </Link>
          </div>
        </section>

        {/* Browse by region / state */}
        <section className="mb-14">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading text-2xl font-bold text-foreground">Browse by State</h2>
            <Link href="/states" className="text-sm text-primary hover:underline flex items-center gap-1">
              All 50 states <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {STATE_REGIONS.map((region) => (
              <div key={region.label} className="border border-border rounded-xl p-4 bg-card">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  {region.label}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {region.states.map((slug) => {
                    const state = US_STATES.find((s) => s.slug === slug)
                    if (!state) return null
                    return (
                      <Link
                        key={slug}
                        href={`/locations/${slug}`}
                        className="text-sm text-foreground hover:text-primary hover:underline"
                      >
                        {state.name}
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Alphabetical quick links */}
          <div className="mt-5 p-4 rounded-xl border border-border bg-muted/40">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              All States A–Z
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              {US_STATES.map((state) => (
                <Link
                  key={state.slug}
                  href={`/locations/${state.slug}`}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {state.abbreviation}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured locations */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading text-2xl font-bold text-foreground">Featured Locations</h2>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              More locations added weekly
            </div>
          </div>

          {locations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {locations.map((location) => (
                <LocationCard key={location.id} location={location} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border border-dashed border-border rounded-xl text-muted-foreground">
              <MapPin className="w-10 h-10 mx-auto mb-3 text-ruby-200" />
              <p className="text-lg font-medium mb-1">Locations coming soon</p>
              <p className="text-sm">We&apos;re verifying our first batch of rockhounding sites. Check back shortly!</p>
            </div>
          )}
        </section>

        {/* CTA strip */}
        <div className="mt-16 rounded-2xl bg-ruby-gradient p-10 text-center text-white">
          <h2 className="font-heading text-2xl font-bold mb-3">Know a great spot?</h2>
          <p className="text-white/75 mb-6 max-w-md mx-auto text-sm">
            Help the community by suggesting a rockhounding location. We verify every submission before publishing.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-white text-ruby-700 font-semibold px-6 py-2.5 rounded-lg hover:bg-ruby-50 transition-colors text-sm"
          >
            Suggest a Location
          </Link>
        </div>
      </div>
    </>
  )
}
