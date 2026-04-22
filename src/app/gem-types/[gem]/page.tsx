import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight, Gem, MapPin } from 'lucide-react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { LocationCard } from '@/components/locations/LocationCard'
import { BreadcrumbSchema } from '@/components/seo/JsonLd'
import { getLocationsByGemType } from '@/lib/supabase'
import { GEM_TYPES, US_STATES, SITE_URL, SITE_NAME } from '@/lib/constants'

type Props = { params: Promise<{ gem: string }> }

function slugToGemName(slug: string): string | undefined {
  return GEM_TYPES.find((g) => g.toLowerCase().replace(/\s+/g, '-') === slug)
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { gem: gemSlug } = await params
  const gemName = slugToGemName(gemSlug)
  if (!gemName) return {}

  return {
    title: `Where to Find ${gemName}`,
    description: `Find rockhounding sites where ${gemName} has been reported across the US. Locations include GPS coordinates, access details, and tips from fellow rockhounds.`,
    alternates: { canonical: `${SITE_URL}/gem-types/${gemSlug}` },
    openGraph: {
      title: `Where to Find ${gemName} | Rockhounding Locations`,
      description: `Rockhounding locations where ${gemName} has been found across the US.`,
    },
  }
}

export default async function GemTypePage({ params }: Props) {
  const { gem: gemSlug } = await params
  const gemName = slugToGemName(gemSlug)
  if (!gemName) notFound()

  const locations = await getLocationsByGemType(gemName)

  const statesRepresented = [...new Set(locations.map((l) => l.state))].sort()

  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'Home', url: SITE_URL },
        { name: 'Gem Types', url: `${SITE_URL}/gem-types` },
        { name: gemName, url: `${SITE_URL}/gem-types/${gemSlug}` },
      ]} />

      {/* Hero */}
      <section className="bg-ruby-gradient py-16">
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
                <BreadcrumbLink href="/gem-types" className="hover:text-white">Gem Types</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-white/40">
                <ChevronRight className="w-4 h-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage className="text-white">{gemName}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center">
              <Gem className="w-5 h-5 text-white" />
            </div>
          </div>

          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-3">
            Where to Find {gemName}
          </h1>
          <p className="text-white/75 text-lg max-w-2xl mb-4">
            Verified rockhounding locations where {gemName} has been reported. Each site includes GPS coordinates, access details, and tips.
          </p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-white/65 text-sm">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              {locations.length} location{locations.length !== 1 ? 's' : ''} found
            </span>
            {statesRepresented.length > 0 && (
              <span>{statesRepresented.length} state{statesRepresented.length !== 1 ? 's' : ''}</span>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* States */}
        {statesRepresented.length > 1 && (
          <div className="mb-8">
            <div className="text-sm font-medium text-muted-foreground mb-3">Found in {statesRepresented.length} states:</div>
            <div className="flex flex-wrap gap-2">
              {statesRepresented.map((stateName) => {
                const stateInfo = US_STATES.find((s) => s.name === stateName)
                return stateInfo ? (
                  <Link
                    key={stateName}
                    href={`/locations/${stateInfo.slug}`}
                    className="text-xs px-3 py-1.5 rounded-full border border-border bg-card text-foreground hover:border-ruby-300 hover:bg-ruby-50 hover:text-primary transition-all"
                  >
                    {stateName}
                  </Link>
                ) : (
                  <span key={stateName} className="text-xs px-3 py-1.5 rounded-full border border-border bg-card text-foreground">
                    {stateName}
                  </span>
                )
              })}
            </div>
          </div>
        )}

        {/* Locations grid */}
        {locations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {locations.map((location) => (
              <LocationCard key={location.id} location={location} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 border border-dashed border-border rounded-xl text-muted-foreground">
            <Gem className="w-12 h-12 mx-auto mb-4 text-ruby-200" />
            <p className="text-lg font-medium mb-2">No locations listed yet</p>
            <p className="text-sm max-w-sm mx-auto mb-6">
              We&apos;re building out our database. Know a spot where {gemName} can be found?
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-primary text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-ruby-700 transition-colors"
            >
              Suggest a Location
            </Link>
          </div>
        )}

        {/* Related gems */}
        <div className="mt-14 border-t border-border pt-10">
          <h2 className="font-heading text-xl font-bold text-foreground mb-5">Browse Other Gem Types</h2>
          <div className="flex flex-wrap gap-2">
            {GEM_TYPES.filter((g) => g !== gemName).slice(0, 16).map((g) => (
              <Link
                key={g}
                href={`/gem-types/${g.toLowerCase().replace(/\s+/g, '-')}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-card hover:border-ruby-300 hover:bg-ruby-50 hover:text-primary text-sm transition-all"
              >
                <Gem className="w-3 h-3 text-ruby-300" />
                {g}
              </Link>
            ))}
            <Link
              href="/gem-types"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-dashed border-border text-muted-foreground hover:text-primary text-sm transition-all"
            >
              View all →
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
