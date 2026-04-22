import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MapPin, ChevronRight, Gem, HelpCircle } from 'lucide-react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { StateTOC } from '@/components/locations/StateTOC'
import { LocationEntry } from '@/components/locations/LocationEntry'
import { NearbyStatesSection } from '@/components/locations/NearbyStatesSection'
import { StatePageSchema, BreadcrumbSchema, StateFaqSchema } from '@/components/seo/JsonLd'
import { getFullLocationsByState, getStateData, getAllStates } from '@/lib/supabase'
import { getNearbyStateInfo } from '@/lib/nearby-states'
import { generateStateFaqs } from '@/lib/state-faqs'
import { US_STATES, SITE_URL } from '@/lib/constants'
import type { Location } from '@/lib/types'
import { StateMapLoader } from '@/components/locations/StateMapLoader'

type Props = { params: Promise<{ state: string }> }

export async function generateStaticParams() {
  return US_STATES.map((s) => ({ state: s.slug }))
}

export const revalidate = 3600

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state: stateSlug } = await params
  const stateInfo = US_STATES.find((s) => s.slug === stateSlug)
  if (!stateInfo) return {}

  const [locations, stateData] = await Promise.all([
    getFullLocationsByState(stateSlug),
    getStateData(stateSlug),
  ])

  const locationCount = locations.length
  const cities = groupByCity(locations)
  const cityCount = cities.length

  const gemCounts = new Map<string, number>()
  for (const loc of locations) {
    for (const gem of loc.gem_types ?? []) {
      gemCounts.set(gem, (gemCounts.get(gem) ?? 0) + 1)
    }
  }
  const topGems = [...gemCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4).map(([g]) => g)

  const title = `Rockhounding in ${stateInfo.name}: ${locationCount} Sites and Locations`
  const description = stateData?.meta_description
    ?? `Find the best rockhounding spots in ${stateInfo.name}. Discover ${locationCount} verified sites across ${cityCount} cities including ${topGems.join(', ')}. Free, fee-dig, and BLM locations with GPS and directions.`

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/locations/${stateSlug}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/locations/${stateSlug}`,
      ...(stateData?.image_url && { images: [{ url: stateData.image_url }] }),
    },
  }
}

function groupByCity(locations: Location[]): { city: string; city_slug: string; locations: Location[] }[] {
  const map = new Map<string, { city: string; city_slug: string; locations: Location[] }>()

  for (const loc of locations) {
    if (!loc.city_slug || !loc.city) continue
    const existing = map.get(loc.city_slug)
    if (existing) {
      existing.locations.push(loc)
    } else {
      map.set(loc.city_slug, { city: loc.city, city_slug: loc.city_slug, locations: [loc] })
    }
  }

  return [...map.values()].sort((a, b) => b.locations.length - a.locations.length || a.city.localeCompare(b.city))
}

export default async function StatePage({ params }: Props) {
  const { state: stateSlug } = await params
  const stateInfo = US_STATES.find((s) => s.slug === stateSlug)
  if (!stateInfo) notFound()

  const [locations, stateData, allStatesData] = await Promise.all([
    getFullLocationsByState(stateSlug),
    getStateData(stateSlug),
    getAllStates(),
  ])

  const citySections = groupByCity(locations)
  const uncategorized = locations.filter((l) => !l.city_slug || !l.city)

  const tocEntries = [
    ...citySections.map((c) => ({ citySlug: c.city_slug, city: c.city, count: c.locations.length })),
    ...(uncategorized.length > 0 ? [{ citySlug: 'other', city: `Other ${stateInfo.name} Locations`, count: uncategorized.length }] : []),
  ]

  const gemCounts = new Map<string, number>()
  for (const loc of locations) {
    for (const gem of loc.gem_types ?? []) {
      gemCounts.set(gem, (gemCounts.get(gem) ?? 0) + 1)
    }
  }
  const topGems = [...gemCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6).map(([g]) => g)

  const featuredLocations = locations.filter((l) => l.featured)
  const introLocations = featuredLocations.length >= 3 ? featuredLocations.slice(0, 5) : locations.slice(0, 5)

  const faqs = generateStateFaqs(stateInfo.name, locations)
  const nearbyStateSlugs = getNearbyStateInfo(stateSlug, 6)
  const nearbyStatesData = nearbyStateSlugs
    .map((si) => allStatesData.find((s) => s.slug === si.slug))
    .filter(Boolean) as typeof allStatesData

  const description = stateData?.description
    ?? stateData?.short_description
    ?? `Discover the best rockhounding sites in ${stateInfo.name} with GPS coordinates, difficulty ratings, and detailed access guides.`

  const metaDesc = stateData?.meta_description
    ?? `Find ${locations.length} verified rockhounding sites in ${stateInfo.name} across ${citySections.length} cities.`

  return (
    <>
      <StatePageSchema
        stateName={stateInfo.name}
        stateSlug={stateSlug}
        description={metaDesc}
        locationCount={locations.length}
        gemTypes={topGems}
        topLocations={locations.filter((l) => l.featured).slice(0, 5).map((l) => l.name)}
      />
      <BreadcrumbSchema items={[
        { name: 'Home', url: SITE_URL },
        { name: 'Locations', url: `${SITE_URL}/locations` },
        { name: stateInfo.name, url: `${SITE_URL}/locations/${stateSlug}` },
      ]} />
      {faqs.length > 0 && <StateFaqSchema faqs={faqs} />}

      {/* Hero */}
      <section className="bg-ruby-gradient py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb className="mb-6">
            <BreadcrumbList className="text-white/70">
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="hover:text-white">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-white/40"><ChevronRight className="w-4 h-4" /></BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink href="/locations" className="hover:text-white">Locations</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-white/40"><ChevronRight className="w-4 h-4" /></BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage className="text-white">{stateInfo.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
            Rockhounding in {stateInfo.name}
          </h1>
          <p className="text-white/80 text-base sm:text-lg max-w-2xl mb-6 leading-relaxed">
            {description}
          </p>

          {/* Stat pills */}
          <div className="flex flex-wrap gap-2">
            <StatPill icon={<MapPin className="w-3.5 h-3.5 text-ruby-200" />}>
              {locations.length} verified location{locations.length !== 1 ? 's' : ''}
            </StatPill>
            {citySections.length > 0 && (
              <StatPill icon={<MapPin className="w-3.5 h-3.5 text-ruby-200" />}>
                {citySections.length} {citySections.length === 1 ? 'city' : 'cities'}
              </StatPill>
            )}
            {topGems.length > 0 && (
              <StatPill icon={<Gem className="w-3.5 h-3.5 text-ruby-200" />}>
                {topGems.slice(0, 3).join(' · ')}
              </StatPill>
            )}
          </div>
        </div>
      </section>

      {/* State map: all published locations */}
      {locations.length > 0 && (() => {
        const mapLocations = locations
          .filter((l) => l.latitude != null && l.longitude != null)
          .map((l) => ({ id: l.id, name: l.name, slug: l.slug, latitude: l.latitude!, longitude: l.longitude! }))
        return mapLocations.length > 0 ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="rounded-2xl overflow-hidden border border-border shadow-sm" style={{ height: '380px' }}>
              <StateMapLoader locations={mapLocations} />
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              {mapLocations.length} rockhounding {mapLocations.length === 1 ? 'site' : 'sites'} in {stateInfo.name} with GPS coordinates. Click a marker to jump to that location.
            </p>
          </div>
        ) : null
      })()}

      {/* Main layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {locations.length === 0 ? (
          <EmptyState stateName={stateInfo.name} nearbyStatesData={nearbyStatesData} />
        ) : (
          <div className="flex gap-10 items-start">
            {/* TOC sidebar (desktop) / bar (mobile) */}
            <StateTOC entries={tocEntries} stateName={stateInfo.name} />

            {/* Content */}
            <div className="flex-1 min-w-0 space-y-16">
              {/* State intro paragraph */}
              <div className="max-w-none">
                <p className="text-foreground/80 leading-relaxed text-sm sm:text-base mb-3">
                  {stateInfo.name} is home to {locations.length} documented rockhounding {locations.length === 1 ? 'site' : 'sites'} spread across {citySections.length} {citySections.length === 1 ? 'region' : 'regions'} of the state.
                  {topGems.length > 0
                    ? ` Collectors regularly find ${topGems.slice(0, 5).join(', ')}, and more, at sites ranging from easy roadside stops to remote backcountry terrain.`
                    : ` Sites range from easy roadside stops to remote backcountry terrain.`}
                  {` Every location includes GPS coordinates, access details, difficulty ratings, and on-the-ground collecting notes so you can plan your trip with confidence.`}
                  {citySections.length > 1 && ` Use the table of contents on the left to jump to any region, or head straight to a standout location using the picks below.`}
                </p>
                {introLocations.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Our Picks</p>
                    <ul className="flex flex-wrap gap-2">
                      {introLocations.map((loc) => (
                        <li key={loc.id}>
                          <a
                            href={`#${loc.slug}`}
                            className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-ruby-700 border border-ruby-200 hover:border-ruby-400 bg-ruby-50 hover:bg-ruby-100 rounded-full px-3 py-1 transition-colors"
                          >
                            <MapPin className="w-3 h-3 shrink-0" />
                            {loc.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {citySections.map((citySection) => (
                <section
                  key={citySection.city_slug}
                  id={`rockhounding-in-${citySection.city_slug}`}
                  className="scroll-mt-6"
                >
                  <div className="mb-8">
                    <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-1">
                      Rockhounding in {citySection.city}
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      {citySection.locations.length} rockhounding {citySection.locations.length === 1 ? 'site' : 'sites'} near {citySection.city}, {stateInfo.abbreviation ?? stateInfo.name}
                    </p>
                  </div>
                  <div className="space-y-0">
                    {citySection.locations.map((loc, idx) => (
                      <div key={loc.id}>
                        {idx > 0 && (
                          <div className="flex items-center gap-3 my-8">
                            <div className="flex-1 h-px bg-border" />
                            <Gem className="w-3.5 h-3.5 text-ruby-300" />
                            <div className="flex-1 h-px bg-border" />
                          </div>
                        )}
                        <LocationEntry location={loc} />
                      </div>
                    ))}
                  </div>
                </section>
              ))}

              {uncategorized.length > 0 && (
                <section id="rockhounding-in-other" className="scroll-mt-6">
                  <div className="mb-8">
                    <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-1">
                      Other Rockhounding Sites in {stateInfo.name}
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      {uncategorized.length} additional {uncategorized.length === 1 ? 'site' : 'sites'} across {stateInfo.name}
                    </p>
                  </div>
                  <div className="space-y-0">
                    {uncategorized.map((loc, idx) => (
                      <div key={loc.id}>
                        {idx > 0 && (
                          <div className="flex items-center gap-3 my-8">
                            <div className="flex-1 h-px bg-border" />
                            <Gem className="w-3.5 h-3.5 text-ruby-300" />
                            <div className="flex-1 h-px bg-border" />
                          </div>
                        )}
                        <LocationEntry location={loc} />
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* FAQ */}
              {faqs.length > 0 && (
                <section className="bg-cream-100 rounded-2xl p-6 sm:p-8 border border-border">
                  <div className="flex items-center gap-2 mb-6">
                    <HelpCircle className="w-5 h-5 text-primary shrink-0" />
                    <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
                      Frequently Asked Questions About Rockhounding in {stateInfo.name}
                    </h2>
                  </div>
                  <div className="space-y-6">
                    {faqs.map((faq, i) => (
                      <div key={i} className="border-b border-border pb-6 last:border-0 last:pb-0">
                        <h3 className="font-heading font-semibold text-base sm:text-lg text-foreground mb-2">
                          {faq.question}
                        </h3>
                        <p className="text-foreground/75 leading-relaxed text-sm sm:text-base">
                          {faq.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Nearby states */}
              {nearbyStatesData.length > 0 && (
                <NearbyStatesSection
                  currentStateName={stateInfo.name}
                  nearbyStates={nearbyStatesData}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

function StatPill({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-3.5 py-1.5 text-white/90 text-sm">
      {icon}
      <span>{children}</span>
    </div>
  )
}

function EmptyState({ stateName, nearbyStatesData }: { stateName: string; nearbyStatesData: { slug: string; name: string }[] }) {
  return (
    <div className="text-center py-20 border border-dashed border-border rounded-xl text-muted-foreground">
      <MapPin className="w-10 h-10 mx-auto mb-3 text-ruby-200" />
      <p className="text-lg font-medium mb-1 text-foreground">Coming Soon</p>
      <p className="text-sm">We&apos;re adding rockhounding sites for {stateName}. Check back soon!</p>
      {nearbyStatesData.length > 0 && (
        <div className="mt-8 text-left max-w-xl mx-auto">
          <p className="text-sm font-medium text-foreground mb-3 text-center">Explore nearby states in the meantime:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {nearbyStatesData.slice(0, 4).map((s) => (
              <Link key={s.slug} href={`/locations/${s.slug}`} className="text-sm px-4 py-2 rounded-full border border-border hover:border-ruby-300 hover:text-primary transition-all">
                Rockhounding in {s.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
