import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  MapPin, Mountain, Gem, Clock, ChevronRight, AlertTriangle,
  Car, Signal, Info, FileText, Star, DollarSign, ShieldCheck, Navigation, Wrench
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink,
  BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { LocationCard } from '@/components/locations/LocationCard'
import { PhotoGallery } from '@/components/locations/PhotoGallery'
import { LocationMap } from '@/components/locations/LocationMap'
import { FaqSection } from '@/components/locations/FaqSection'
import { ReviewSection } from '@/components/locations/ReviewSection'
import { LocationSchema, FaqSchema, BreadcrumbSchema } from '@/components/seo/JsonLd'
import { getLocationBySlug, getNearbyLocations, getReviewsForLocation } from '@/lib/supabase'
import {
  DIFFICULTY_LABELS, ACCESS_LABELS, CATEGORY_LABELS, CATEGORY_COLORS,
  VEHICLE_LABELS, CELL_LABELS, HAZARD_LABELS, SITE_NAME, SITE_URL,
} from '@/lib/constants'
import { cn } from '@/lib/utils'

type Props = { params: Promise<{ state: string; city: string; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state, city, slug } = await params
  const location = await getLocationBySlug(state, city, slug)
  if (!location) return {}

  const title = location.meta_title ?? `${location.name} - Rockhounding in ${location.county ? location.county + ' County, ' : ''}${location.state}`
  const description = location.meta_description ?? location.short_description ??
    `Find ${location.gem_types?.join(', ')} at ${location.name} in ${location.state}. Access info, GPS coordinates, directions, and rockhounding tips.`
  const url = `${SITE_URL}/locations/${state}/${city}/${slug}`
  const keywords = [
    location.name,
    ...(location.alternative_names ?? []),
    `rockhounding ${location.state}`,
    location.county ? `rockhounding ${location.county} county` : '',
    location.nearest_city ? `rockhounding near ${location.nearest_city}` : '',
    location.city ? `rockhounding near ${location.city}` : '',
    ...(location.gem_types ?? []),
    location.beginner_friendly ? 'beginner rockhounding' : '',
    location.family_friendly ? 'family rockhounding' : '',
  ].filter(Boolean)

  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      title, description, url,
      ...(location.cover_photo && { images: [{ url: location.cover_photo }] }),
    },
  }
}

const difficultyColor: Record<string, string> = {
  easy: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  moderate: 'bg-amber-100 text-amber-700 border-amber-200',
  hard: 'bg-orange-100 text-orange-700 border-orange-200',
  expert: 'bg-red-100 text-red-700 border-red-200',
}

function BoolBadge({ value, trueLabel, falseLabel }: { value: boolean | null; trueLabel: string; falseLabel?: string }) {
  if (value === null || value === undefined) return null
  return (
    <span className={cn(
      'inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border',
      value ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-50 text-gray-500 border-gray-200'
    )}>
      {value ? '✓' : '✗'} {value ? trueLabel : (falseLabel ?? trueLabel)}
    </span>
  )
}

export default async function LocationPage({ params }: Props) {
  const { state: stateSlug, city: citySlug, slug } = await params
  const [location, nearby, reviews] = await Promise.all([
    getLocationBySlug(stateSlug, citySlug, slug),
    getNearbyLocations(stateSlug, slug, 3),
    getLocationBySlug(stateSlug, citySlug, slug).then((loc) =>
      loc ? getReviewsForLocation(loc.id) : []
    ),
  ])

  if (!location) notFound()

  const pageUrl = `${SITE_URL}/locations/${stateSlug}/${citySlug}/${slug}`
  const allImages = [location.cover_photo, ...(location.images ?? [])].filter(Boolean) as string[]

  const breadcrumbItems = [
    { name: 'Home', url: SITE_URL },
    { name: 'Locations', url: `${SITE_URL}/locations` },
    { name: location.state, url: `${SITE_URL}/locations/${stateSlug}` },
    ...(location.city ? [{ name: location.city, url: `${SITE_URL}/locations/${stateSlug}/${citySlug}` }] : []),
    { name: location.name, url: pageUrl },
  ]

  return (
    <>
      <LocationSchema location={location} />
      <FaqSchema faqs={location.faq ?? []} />
      <BreadcrumbSchema items={breadcrumbItems} />

      {/* ── Cover photo hero ── */}
      <section className="relative bg-ruby-gradient min-h-[380px] flex items-end overflow-hidden">
        {location.cover_photo && (
          <div className="absolute inset-0">
            <img src={location.cover_photo} alt={location.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
          </div>
        )}

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 pt-20">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-5">
            <BreadcrumbList className="text-white/65">
              <BreadcrumbItem><BreadcrumbLink href="/" className="hover:text-white">Home</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator><ChevronRight className="w-3.5 h-3.5" /></BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink href={`/locations/${stateSlug}`} className="hover:text-white">{location.state}</BreadcrumbLink>
              </BreadcrumbItem>
              {location.city && (
                <>
                  <BreadcrumbSeparator><ChevronRight className="w-3.5 h-3.5" /></BreadcrumbSeparator>
                  <BreadcrumbItem>
                    <BreadcrumbLink href={`/locations/${stateSlug}/${citySlug}`} className="hover:text-white">{location.city}</BreadcrumbLink>
                  </BreadcrumbItem>
                </>
              )}
              <BreadcrumbSeparator><ChevronRight className="w-3.5 h-3.5" /></BreadcrumbSeparator>
              <BreadcrumbItem><BreadcrumbPage className="text-white">{location.name}</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Badges row */}
          <div className="flex flex-wrap gap-2 mb-4">
            {location.primary_category && (
              <span className={cn('text-xs font-semibold px-3 py-1 rounded-full border', CATEGORY_COLORS[location.primary_category])}>
                {CATEGORY_LABELS[location.primary_category]}
              </span>
            )}
            {location.difficulty && (
              <span className={cn('text-xs font-semibold px-3 py-1 rounded-full border', difficultyColor[location.difficulty])}>
                {DIFFICULTY_LABELS[location.difficulty]}
              </span>
            )}
            {location.beginner_friendly && (
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-sky-100 text-sky-700 border border-sky-200">
                Beginner Friendly
              </span>
            )}
            {location.family_friendly && (
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-100 text-purple-700 border border-purple-200">
                Family Friendly
              </span>
            )}
          </div>

          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-3 leading-tight">
            {location.name}
          </h1>

          {/* Alt names */}
          {location.alternative_names?.length > 0 && (
            <p className="text-white/60 text-sm mb-2 italic">
              Also known as: {location.alternative_names.join(', ')}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-white/75 text-sm">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              {[location.city, location.county ? location.county + ' County' : null, location.state].filter(Boolean).join(', ')}
            </span>
            {location.nearest_city && (
              <span className="flex items-center gap-1.5">
                <Mountain className="w-3.5 h-3.5" />
                {location.nearest_city_distance ? `${location.nearest_city_distance} mi from ` : 'Near '}{location.nearest_city}
              </span>
            )}
            {location.rating_count > 0 && (
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {location.rating_average.toFixed(1)} ({location.rating_count})
              </span>
            )}
          </div>
        </div>
      </section>

      {/* ── Main body ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* ── Left: main content ── */}
          <div className="lg:col-span-2 space-y-10">

            {/* About */}
            {location.description && (
              <section>
                <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
                  About {location.name}
                </h2>
                <div className="text-foreground/80 leading-relaxed space-y-3">
                  {location.description.split('\n').map((para, i) => <p key={i}>{para}</p>)}
                </div>
              </section>
            )}

            {/* What you'll find */}
            {location.gem_types?.length > 0 && (
              <section>
                <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
                  What You&apos;ll Find at {location.name}
                </h2>
                {location.short_description && (
                  <p className="text-foreground/75 mb-4 leading-relaxed">{location.short_description}</p>
                )}
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
              </section>
            )}

            <Separator />

            {/* Map + How to get there */}
            <section>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-5">
                How to Get to {location.name}
              </h2>

              {location.latitude && location.longitude && (
                <div className="mb-5">
                  <LocationMap lat={location.latitude} lon={location.longitude} name={location.name} />
                </div>
              )}

              {location.written_directions && (
                <div className="bg-muted/40 border border-border rounded-xl p-5 mb-4">
                  <h3 className="font-semibold text-foreground text-sm mb-2 flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-primary" /> Directions from Nearest Highway
                  </h3>
                  <p className="text-sm text-foreground/80 leading-relaxed">{location.written_directions}</p>
                </div>
              )}

              {location.directions && location.written_directions !== location.directions && (
                <div className="bg-muted rounded-xl p-4 mb-4">
                  <p className="text-sm text-foreground/75 leading-relaxed">{location.directions}</p>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {location.vehicle_required && (
                  <div className="flex items-start gap-2 p-3 rounded-lg border border-border bg-card text-sm">
                    <Car className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs text-muted-foreground mb-0.5">Vehicle</div>
                      <div className="font-medium text-foreground">{VEHICLE_LABELS[location.vehicle_required]}</div>
                    </div>
                  </div>
                )}
                {location.road_conditions && (
                  <div className="col-span-2 sm:col-span-2 flex items-start gap-2 p-3 rounded-lg border border-border bg-card text-sm">
                    <Wrench className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs text-muted-foreground mb-0.5">Road Conditions</div>
                      <div className="font-medium text-foreground">{location.road_conditions}</div>
                    </div>
                  </div>
                )}
                {location.parking_notes && (
                  <div className="col-span-full flex items-start gap-2 p-3 rounded-lg border border-border bg-card text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs text-muted-foreground mb-0.5">Parking</div>
                      <div className="text-foreground/80">{location.parking_notes}</div>
                    </div>
                  </div>
                )}
              </div>
            </section>

            <Separator />

            {/* Rules & Access */}
            <section>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-5">
                Rockhounding at {location.name}: Rules &amp; Access
              </h2>

              <div className="space-y-4">
                {location.primary_category && (
                  <div className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card">
                    <FileText className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <div className="text-sm font-semibold text-foreground mb-0.5">Land Type</div>
                      <div className="text-sm text-foreground/75">{CATEGORY_LABELS[location.primary_category]}</div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card">
                    <ShieldCheck className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <div className="text-sm font-semibold text-foreground mb-0.5">Permit</div>
                      <div className="text-sm text-foreground/75">{location.permit_required ? 'Permit required' : 'No permit needed'}</div>
                      {location.permit_link && (
                        <a href={location.permit_link} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline mt-1 block">
                          Get permit
                        </a>
                      )}
                    </div>
                  </div>

                  {location.fee_amount != null && (
                    <div className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card">
                      <DollarSign className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                      <div>
                        <div className="text-sm font-semibold text-foreground mb-0.5">Entry Fee</div>
                        <div className="text-sm text-foreground/75">
                          {location.fee_amount === 0 ? 'Free' : `$${location.fee_amount} per person`}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {location.collection_rules && (
                  <div className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card">
                    <FileText className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <div className="text-sm font-semibold text-foreground mb-1">Collection Rules</div>
                      <p className="text-sm text-foreground/75 leading-relaxed">{location.collection_rules}</p>
                    </div>
                  </div>
                )}

                {location.quantity_limits && (
                  <div className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card">
                    <AlertTriangle className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <div className="text-sm font-semibold text-foreground mb-0.5">Quantity Limits</div>
                      <p className="text-sm text-foreground/75">{location.quantity_limits}</p>
                    </div>
                  </div>
                )}

                {location.commercial_use_allowed && (
                  <div className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card">
                    <Info className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <div className="text-sm font-semibold text-foreground mb-0.5">Commercial Collection</div>
                      <p className="text-sm text-foreground/75">Commercial use and resale are permitted at this location.</p>
                    </div>
                  </div>
                )}

                {location.rules && (
                  <div className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card">
                    <AlertTriangle className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <div className="text-sm font-semibold text-foreground mb-0.5">Additional Rules</div>
                      <p className="text-sm text-foreground/75 leading-relaxed">{location.rules}</p>
                    </div>
                  </div>
                )}
              </div>
            </section>

            <Separator />

            {/* Tips */}
            {location.tips && (
              <section>
                <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
                  Tips for Rockhounding at {location.name}
                </h2>
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-6">
                  <p className="text-foreground/80 leading-relaxed text-sm">{location.tips}</p>
                </div>
              </section>
            )}

            {/* Terrain notes */}
            {location.terrain_notes && (
              <section>
                <h2 className="font-heading text-xl font-bold text-foreground mb-3">Terrain &amp; Conditions</h2>
                <p className="text-foreground/75 leading-relaxed text-sm">{location.terrain_notes}</p>
              </section>
            )}

            {/* History */}
            {location.history && (
              <>
                <Separator />
                <section>
                  <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
                    History of {location.name}
                  </h2>
                  <div className="text-foreground/80 leading-relaxed space-y-3 text-sm">
                    {location.history.split('\n').map((p, i) => <p key={i}>{p}</p>)}
                  </div>
                </section>
              </>
            )}

            <Separator />

            {/* Photo gallery */}
            {allImages.length > 1 && (
              <>
                <PhotoGallery images={allImages} locationName={location.name} />
                <Separator />
              </>
            )}

            {/* FAQ */}
            {location.faq?.length > 0 && (
              <>
                <FaqSection faqs={location.faq} locationName={location.name} />
                <Separator />
              </>
            )}

            {/* Reviews */}
            <ReviewSection
              locationId={location.id}
              locationName={location.name}
              reviews={reviews}
              ratingAverage={location.rating_average}
              ratingCount={location.rating_count}
            />
          </div>

          {/* ── Right: sidebar ── */}
          <div className="space-y-5">

            {/* Quick facts */}
            <div className="rounded-xl border border-border bg-card p-5 sticky top-20">
              <h3 className="font-heading font-semibold text-foreground mb-4 text-base">Quick Facts</h3>
              <dl className="space-y-3 text-sm">
                {location.difficulty && (
                  <div className="flex items-center justify-between gap-2">
                    <dt className="text-muted-foreground flex items-center gap-1.5 shrink-0"><Mountain className="w-3.5 h-3.5" /> Difficulty</dt>
                    <dd className="font-medium text-right">{DIFFICULTY_LABELS[location.difficulty]}</dd>
                  </div>
                )}
                {location.primary_category && (
                  <div className="flex items-center justify-between gap-2">
                    <dt className="text-muted-foreground flex items-center gap-1.5 shrink-0"><MapPin className="w-3.5 h-3.5" /> Land Type</dt>
                    <dd className="font-medium text-right">{CATEGORY_LABELS[location.primary_category]}</dd>
                  </div>
                )}
                {location.best_season && (
                  <div className="flex items-start justify-between gap-2">
                    <dt className="text-muted-foreground flex items-center gap-1.5 shrink-0 pt-0.5"><Clock className="w-3.5 h-3.5" /> Best Season</dt>
                    <dd className="font-medium text-right leading-snug">{location.best_season}</dd>
                  </div>
                )}
                {location.vehicle_required && (
                  <div className="flex items-center justify-between gap-2">
                    <dt className="text-muted-foreground flex items-center gap-1.5 shrink-0"><Car className="w-3.5 h-3.5" /> Vehicle</dt>
                    <dd className="font-medium text-right">{VEHICLE_LABELS[location.vehicle_required]}</dd>
                  </div>
                )}
                {location.cell_service && (
                  <div className="flex items-center justify-between gap-2">
                    <dt className="text-muted-foreground flex items-center gap-1.5 shrink-0"><Signal className="w-3.5 h-3.5" /> Cell</dt>
                    <dd className="font-medium text-right">{CELL_LABELS[location.cell_service]}</dd>
                  </div>
                )}
                {location.fee_amount != null && (
                  <div className="flex items-center justify-between gap-2">
                    <dt className="text-muted-foreground flex items-center gap-1.5 shrink-0"><DollarSign className="w-3.5 h-3.5" /> Entry Fee</dt>
                    <dd className="font-medium text-right">{location.fee_amount === 0 ? 'Free' : `$${location.fee_amount}`}</dd>
                  </div>
                )}
                {location.permit_required != null && (
                  <div className="flex items-center justify-between gap-2">
                    <dt className="text-muted-foreground flex items-center gap-1.5 shrink-0"><ShieldCheck className="w-3.5 h-3.5" /> Permit</dt>
                    <dd className="font-medium text-right">
                      {location.permit_required ? 'Required' : 'Not required'}
                    </dd>
                  </div>
                )}
              </dl>

              {/* Visitor flags */}
              <div className="mt-4 pt-4 border-t border-border flex flex-wrap gap-2">
                <BoolBadge value={location.beginner_friendly} trueLabel="Beginner Friendly" falseLabel="Not for Beginners" />
                <BoolBadge value={location.family_friendly} trueLabel="Family Friendly" />
                <BoolBadge value={location.dog_friendly} trueLabel="Dog Friendly" />
              </div>

              {/* Hazards */}
              {location.hazards?.length > 0 && (
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Hazards
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {location.hazards.map((h) => (
                      <span key={h} className="text-xs bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded-full">
                        {HAZARD_LABELS[h] ?? h}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* GPS */}
              {location.latitude && location.longitude && (
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="text-xs font-semibold text-foreground mb-1">GPS Coordinates</div>
                  <p className="font-mono text-xs text-muted-foreground">{location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}</p>
                </div>
              )}

              {/* Nearest services */}
              {location.nearest_services && (
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="text-xs font-semibold text-foreground mb-2">Nearest Services</div>
                  <div className="flex flex-wrap gap-1.5">
                    {location.nearest_services.split(',').map((s) => s.trim()).filter(Boolean).map((s) => (
                      <span key={s} className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full border border-border">{s}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* State link */}
            <div className="rounded-xl border border-ruby-100 bg-ruby-50 p-5 text-center">
              <p className="text-sm text-muted-foreground mb-3">Explore more sites in {location.state}</p>
              <Link
                href={`/locations/${stateSlug}`}
                className="inline-flex items-center gap-2 bg-primary text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-ruby-700 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5" />
                All {location.state} Locations
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
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
