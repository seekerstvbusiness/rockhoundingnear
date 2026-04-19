import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MapPin, Mountain, Gem, Clock, ChevronRight, AlertTriangle, Navigation } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { LocationCard } from '@/components/locations/LocationCard'
import { LocationSchema, BreadcrumbSchema } from '@/components/seo/JsonLd'
import { getLocationBySlug, getNearbyLocations } from '@/lib/supabase'
import { DIFFICULTY_LABELS, ACCESS_LABELS, SITE_NAME, SITE_URL } from '@/lib/constants'

type Props = { params: Promise<{ state: string; city: string; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state, city, slug } = await params
  const location = await getLocationBySlug(state, city, slug)
  if (!location) return {}

  const title = location.meta_title ?? `${location.name} — Rockhounding in ${location.state}`
  const description = location.meta_description ?? location.short_description ?? `Rockhound at ${location.name} in ${location.state}. Find ${location.gem_types?.join(', ')} and more.`
  const url = `${SITE_URL}/locations/${state}/${city}/${slug}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      ...(location.images?.[0] && { images: [{ url: location.images[0] }] }),
    },
  }
}

const difficultyColor: Record<string, string> = {
  easy: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  moderate: 'bg-amber-100 text-amber-700 border-amber-200',
  hard: 'bg-orange-100 text-orange-700 border-orange-200',
  expert: 'bg-red-100 text-red-700 border-red-200',
}

export default async function LocationPage({ params }: Props) {
  const { state: stateSlug, city: citySlug, slug } = await params
  const [location, nearby] = await Promise.all([
    getLocationBySlug(stateSlug, citySlug, slug),
    getNearbyLocations(stateSlug, slug, 4),
  ])

  if (!location) notFound()

  const pageUrl = `${SITE_URL}/locations/${stateSlug}/${citySlug}/${slug}`

  return (
    <>
      <LocationSchema location={location} />
      <BreadcrumbSchema items={[
        { name: 'Home', url: SITE_URL },
        { name: 'Locations', url: `${SITE_URL}/locations` },
        { name: location.state, url: `${SITE_URL}/locations/${stateSlug}` },
        ...(location.city ? [{ name: location.city, url: `${SITE_URL}/locations/${stateSlug}/${citySlug}` }] : []),
        { name: location.name, url: pageUrl },
      ]} />

      {/* Hero image or gradient */}
      <section className="relative bg-ruby-gradient py-14 overflow-hidden">
        {location.images?.[0] && (
          <div className="absolute inset-0">
            <img src={location.images[0]} alt={location.name} className="w-full h-full object-cover opacity-25" />
          </div>
        )}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb className="mb-6">
            <BreadcrumbList className="text-white/70">
              <BreadcrumbItem><BreadcrumbLink href="/" className="hover:text-white">Home</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator><ChevronRight className="w-4 h-4" /></BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink href={`/locations/${stateSlug}`} className="hover:text-white">
                  {location.state}
                </BreadcrumbLink>
              </BreadcrumbItem>
              {location.city && (
                <>
                  <BreadcrumbSeparator><ChevronRight className="w-4 h-4" /></BreadcrumbSeparator>
                  <BreadcrumbItem>
                    <BreadcrumbLink href={`/locations/${stateSlug}/${citySlug}`} className="hover:text-white">
                      {location.city}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </>
              )}
              <BreadcrumbSeparator><ChevronRight className="w-4 h-4" /></BreadcrumbSeparator>
              <BreadcrumbItem><BreadcrumbPage className="text-white">{location.name}</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex flex-wrap gap-2 mb-4">
            {location.difficulty && (
              <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${difficultyColor[location.difficulty]}`}>
                {DIFFICULTY_LABELS[location.difficulty]}
              </span>
            )}
            {location.access_type && (
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/15 border border-white/30 text-white">
                {ACCESS_LABELS[location.access_type]}
              </span>
            )}
          </div>

          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-3">
            {location.name}
          </h1>

          <div className="flex items-center gap-1.5 text-white/75 text-base">
            <MapPin className="w-4 h-4" />
            <span>
              {location.city ? `${location.city}, ` : ''}{location.state}
            </span>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            {location.description && (
              <div>
                <h2 className="font-heading text-2xl font-bold text-foreground mb-4">About This Location</h2>
                <div className="prose prose-stone max-w-none text-foreground/80 leading-relaxed">
                  {location.description.split('\n').map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </div>
            )}

            {/* What to find */}
            {location.gem_types?.length > 0 && (
              <div>
                <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
                  What You Can Find Here
                </h2>
                <div className="flex flex-wrap gap-2">
                  {location.gem_types.map((gem) => (
                    <Link
                      key={gem}
                      href={`/gem-types/${gem.toLowerCase().replace(/\s+/g, '-')}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-ruby-50 border border-ruby-100 text-ruby-700 hover:bg-ruby-100 text-sm font-medium transition-colors"
                    >
                      <Gem className="w-3.5 h-3.5" />
                      {gem}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Directions */}
            {location.directions && (
              <div>
                <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
                  Getting There
                </h2>
                <div className="bg-cream-100 rounded-xl p-5 border border-border">
                  <div className="flex items-start gap-3">
                    <Navigation className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <p className="text-foreground/80 leading-relaxed text-sm">{location.directions}</p>
                  </div>
                  {location.latitude && location.longitude && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <p className="text-xs text-muted-foreground">
                        GPS: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tips */}
            {location.tips && (
              <div>
                <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
                  Rockhounding Tips
                </h2>
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-5">
                  <p className="text-foreground/80 leading-relaxed text-sm">{location.tips}</p>
                </div>
              </div>
            )}

            {/* Rules */}
            {location.rules && (
              <div>
                <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
                  Rules & Regulations
                </h2>
                <div className="flex items-start gap-3 bg-ruby-50 border border-ruby-100 rounded-xl p-5">
                  <AlertTriangle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <p className="text-foreground/80 leading-relaxed text-sm">{location.rules}</p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Quick facts */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-heading font-semibold text-foreground mb-4">Quick Facts</h3>
              <dl className="space-y-3">
                {location.difficulty && (
                  <div className="flex justify-between text-sm">
                    <dt className="text-muted-foreground flex items-center gap-1.5"><Mountain className="w-3.5 h-3.5" /> Difficulty</dt>
                    <dd className="font-medium text-foreground">{DIFFICULTY_LABELS[location.difficulty]}</dd>
                  </div>
                )}
                {location.access_type && (
                  <div className="flex justify-between text-sm">
                    <dt className="text-muted-foreground flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Access</dt>
                    <dd className="font-medium text-foreground">{ACCESS_LABELS[location.access_type]}</dd>
                  </div>
                )}
                {location.fee_amount && (
                  <div className="flex justify-between text-sm">
                    <dt className="text-muted-foreground">Entry Fee</dt>
                    <dd className="font-medium text-foreground">${location.fee_amount}/person</dd>
                  </div>
                )}
                {location.best_season && (
                  <div className="flex justify-between text-sm">
                    <dt className="text-muted-foreground flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Best Season</dt>
                    <dd className="font-medium text-foreground">{location.best_season}</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* State link */}
            <div className="rounded-xl border border-border bg-ruby-50 p-5 text-center">
              <p className="text-sm text-muted-foreground mb-3">
                Explore more sites in {location.state}
              </p>
              <Link
                href={`/locations/${stateSlug}`}
                className="inline-flex items-center gap-2 bg-primary text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-ruby-700 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5" />
                View {location.state} Locations
              </Link>
            </div>
          </div>
        </div>

        {/* Nearby locations */}
        {nearby.length > 0 && (
          <div className="mt-14">
            <Separator className="mb-10" />
            <h2 className="font-heading text-2xl font-bold text-foreground mb-6">
              More Rockhounding in {location.state}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {nearby.map((loc) => (
                <LocationCard key={loc.id} location={loc} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
