import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { BreadcrumbSchema } from '@/components/seo/JsonLd'
import { US_STATES, SITE_URL } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'All Rockhounding Locations',
  description: 'Browse rockhounding sites across all 50 US states. Filter by state, gem type, difficulty, or access. Find your next adventure with maps, GPS, and tips.',
  alternates: { canonical: `${SITE_URL}/locations` },
  openGraph: {
    title: 'All Rockhounding Locations',
    description: 'Browse rockhounding sites across all 50 US states.',
    url: `${SITE_URL}/locations`,
  },
}

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
  const breadcrumbItems = [
    { name: 'Home', url: SITE_URL },
    { name: 'Locations', url: `${SITE_URL}/locations` },
  ]

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />

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
                <BreadcrumbPage className="text-white">Locations</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-3">
            Rockhounding Locations
          </h1>
          <p className="text-white/75 text-lg max-w-2xl">
            Verified gem hunting, mineral collecting, and fossil sites across every US state, with GPS, access details, and rockhound-reviewed tips.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Browse by region / state */}
        <section className="mb-14">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading text-2xl font-bold text-foreground">Browse by State</h2>
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
                        className="text-xs font-medium text-foreground bg-muted hover:bg-ruby-50 hover:text-primary hover:border-ruby-200 border border-transparent px-2.5 py-1 rounded-full transition-all"
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
              All States A-Z
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

        {/* CTA strip */}
        <div className="mt-16 rounded-2xl bg-ruby-gradient px-6 py-10 md:p-10 text-center text-white">
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
