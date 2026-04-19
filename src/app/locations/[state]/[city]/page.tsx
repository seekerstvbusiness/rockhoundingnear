import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MapPin, ChevronRight } from 'lucide-react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { LocationCard } from '@/components/locations/LocationCard'
import { BreadcrumbSchema } from '@/components/seo/JsonLd'
import { getLocationsByCity } from '@/lib/supabase'
import { US_STATES, SITE_URL } from '@/lib/constants'

type Props = { params: Promise<{ state: string; city: string }> }

function toTitleCase(slug: string) {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state: stateSlug, city: citySlug } = await params
  const stateInfo = US_STATES.find((s) => s.slug === stateSlug)
  if (!stateInfo) return {}

  const cityName = toTitleCase(citySlug)
  const title = `Rockhounding near ${cityName}, ${stateInfo.name} — Sites & Locations`
  const description = `Find rockhounding sites near ${cityName}, ${stateInfo.name}. Verified gem hunting locations with GPS coordinates, directions, and what to find.`

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/locations/${stateSlug}/${citySlug}` },
    openGraph: { title, description, url: `${SITE_URL}/locations/${stateSlug}/${citySlug}` },
  }
}

export default async function CityPage({ params }: Props) {
  const { state: stateSlug, city: citySlug } = await params
  const stateInfo = US_STATES.find((s) => s.slug === stateSlug)
  if (!stateInfo) notFound()

  const locations = await getLocationsByCity(stateSlug, citySlug)
  const cityName = locations[0]?.city ?? toTitleCase(citySlug)

  if (locations.length === 0) notFound()

  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'Home', url: SITE_URL },
        { name: 'Locations', url: `${SITE_URL}/locations` },
        { name: stateInfo.name, url: `${SITE_URL}/locations/${stateSlug}` },
        { name: cityName, url: `${SITE_URL}/locations/${stateSlug}/${citySlug}` },
      ]} />

      {/* Hero */}
      <section className="bg-ruby-gradient py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb className="mb-6">
            <BreadcrumbList className="text-white/70">
              <BreadcrumbItem><BreadcrumbLink href="/" className="hover:text-white">Home</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator><ChevronRight className="w-4 h-4" /></BreadcrumbSeparator>
              <BreadcrumbItem><BreadcrumbLink href="/locations" className="hover:text-white">Locations</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator><ChevronRight className="w-4 h-4" /></BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink href={`/locations/${stateSlug}`} className="hover:text-white">
                  {stateInfo.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator><ChevronRight className="w-4 h-4" /></BreadcrumbSeparator>
              <BreadcrumbItem><BreadcrumbPage className="text-white">{cityName}</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-3">
            Rockhounding near {cityName}, {stateInfo.name}
          </h1>
          <p className="text-white/75 text-lg max-w-2xl mb-4">
            Verified rockhounding sites near {cityName} with GPS coordinates, gem types, and access details.
          </p>
          <div className="flex items-center gap-2 text-white/70 text-sm">
            <MapPin className="w-4 h-4" />
            <span>{locations.length} location{locations.length !== 1 ? 's' : ''} found</span>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-2xl font-bold text-foreground">
            Sites near {cityName}
          </h2>
          <Link href={`/locations/${stateSlug}`} className="text-sm text-primary hover:underline">
            All {stateInfo.name} locations →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {locations.map((location) => (
            <LocationCard key={location.id} location={location} />
          ))}
        </div>
      </div>
    </>
  )
}
