import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MapPin, ChevronRight } from 'lucide-react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { LocationCard } from '@/components/locations/LocationCard'
import { StatePageSchema, BreadcrumbSchema } from '@/components/seo/JsonLd'
import { getLocationsByState, getStateData, getCitiesInState } from '@/lib/supabase'
import { US_STATES, SITE_NAME, SITE_URL } from '@/lib/constants'

type Props = { params: Promise<{ state: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state: stateSlug } = await params
  const stateInfo = US_STATES.find((s) => s.slug === stateSlug)
  if (!stateInfo) return {}

  const title = `Rockhounding in ${stateInfo.name} — Sites, Maps & Tips`
  const description = `Discover the best rockhounding sites in ${stateInfo.name}. Browse verified locations with GPS coordinates, gem types, difficulty ratings, and access information.`

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/locations/${stateSlug}` },
    openGraph: { title, description, url: `${SITE_URL}/locations/${stateSlug}` },
  }
}

export default async function StatePage({ params }: Props) {
  const { state: stateSlug } = await params
  const stateInfo = US_STATES.find((s) => s.slug === stateSlug)
  if (!stateInfo) notFound()

  const [locations, cities] = await Promise.all([
    getLocationsByState(stateSlug),
    getCitiesInState(stateSlug),
  ])

  const description = `Discover the best rockhounding sites in ${stateInfo.name} with GPS coordinates, difficulty ratings, and detailed guides.`

  return (
    <>
      <StatePageSchema stateName={stateInfo.name} stateSlug={stateSlug} description={description} />
      <BreadcrumbSchema items={[
        { name: 'Home', url: SITE_URL },
        { name: 'Locations', url: `${SITE_URL}/locations` },
        { name: stateInfo.name, url: `${SITE_URL}/locations/${stateSlug}` },
      ]} />

      {/* Hero */}
      <section className="bg-ruby-gradient py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb className="mb-6">
            <BreadcrumbList className="text-white/70">
              <BreadcrumbItem><BreadcrumbLink href="/" className="hover:text-white">Home</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator className="text-white/40"><ChevronRight className="w-4 h-4" /></BreadcrumbSeparator>
              <BreadcrumbItem><BreadcrumbLink href="/locations" className="hover:text-white">Locations</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator className="text-white/40"><ChevronRight className="w-4 h-4" /></BreadcrumbSeparator>
              <BreadcrumbItem><BreadcrumbPage className="text-white">{stateInfo.name}</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-3">
            Rockhounding in {stateInfo.name}
          </h1>
          <p className="text-white/75 text-lg max-w-2xl mb-4">
            {description}
          </p>
          <div className="flex items-center gap-2 text-white/70 text-sm">
            <MapPin className="w-4 h-4" />
            <span>{locations.length} verified location{locations.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Cities nav */}
        {cities.length > 0 && (
          <div className="mb-10">
            <h2 className="font-heading text-xl font-semibold text-foreground mb-4">Browse by City</h2>
            <div className="flex flex-wrap gap-2">
              {cities.map((c) => (
                <Link
                  key={c.city_slug}
                  href={`/locations/${stateSlug}/${c.city_slug}`}
                  className="text-sm px-4 py-2 rounded-full border border-border hover:border-ruby-300 hover:bg-ruby-50 hover:text-primary transition-all"
                >
                  {c.city}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Locations grid */}
        <h2 className="font-heading text-2xl font-bold text-foreground mb-6">
          All Rockhounding Sites in {stateInfo.name}
        </h2>

        {locations.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <MapPin className="w-10 h-10 mx-auto mb-3 text-ruby-200" />
            <p className="text-lg font-medium mb-1">Coming Soon</p>
            <p className="text-sm">We&apos;re adding locations for {stateInfo.name}. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {locations.map((location) => (
              <LocationCard key={location.id} location={location} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
