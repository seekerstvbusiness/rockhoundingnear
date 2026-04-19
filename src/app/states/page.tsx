import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight, MapPin } from 'lucide-react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { BreadcrumbSchema } from '@/components/seo/JsonLd'
import { US_STATES, SITE_URL, SITE_NAME } from '@/lib/constants'

export const metadata: Metadata = {
  title: `Rockhounding by State — All 50 States | ${SITE_NAME}`,
  description: 'Find rockhounding locations in every US state. Browse gem hunting sites, mineral collecting spots, and fossil beds by state with maps, GPS, and expert tips.',
  alternates: { canonical: `${SITE_URL}/states` },
}

const BEST_STATES = ['arizona', 'oregon', 'california', 'montana', 'wyoming', 'nevada', 'new-mexico', 'utah', 'colorado', 'georgia', 'north-carolina', 'idaho']

const STATE_GEMS: Record<string, string[]> = {
  arizona: ['Apache Tears', 'Turquoise', 'Petrified Wood'],
  oregon: ['Thundereggs', 'Sunstone', 'Agate'],
  california: ['Gold', 'Jade', 'Tourmaline'],
  montana: ['Sapphire', 'Garnet', 'Quartz'],
  wyoming: ['Jade', 'Petrified Wood', 'Agate'],
  nevada: ['Turquoise', 'Opal', 'Gold'],
  'new-mexico': ['Turquoise', 'Peridot', 'Fluorite'],
  utah: ['Topaz', 'Garnet', 'Petrified Wood'],
  colorado: ['Amazonite', 'Aquamarine', 'Gold'],
  georgia: ['Amethyst', 'Quartz', 'Gold'],
  'north-carolina': ['Emerald', 'Ruby', 'Garnet'],
  idaho: ['Garnet', 'Opal', 'Sapphire'],
}

export default function StatesPage() {
  const topStates = BEST_STATES.map((slug) => US_STATES.find((s) => s.slug === slug)).filter(Boolean) as typeof US_STATES
  const allOtherStates = US_STATES.filter((s) => !BEST_STATES.includes(s.slug))

  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'Home', url: SITE_URL },
        { name: 'States', url: `${SITE_URL}/states` },
      ]} />

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
                <BreadcrumbPage className="text-white">Browse by State</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-3">
            Rockhounding by State
          </h1>
          <p className="text-white/75 text-lg max-w-2xl">
            Explore verified rockhounding locations in all 50 US states. Click any state to see sites, gem types, difficulty ratings, and access details.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Top rockhounding states */}
        <section className="mb-14">
          <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
            Best Rockhounding States
          </h2>
          <p className="text-muted-foreground text-sm mb-6">States known for exceptional gem diversity, accessible public land, and active rockhounding communities.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {topStates.map((state) => (
              <Link
                key={state.slug}
                href={`/locations/${state.slug}`}
                className="group border border-border rounded-xl p-5 bg-card hover:border-ruby-300 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-heading font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                      {state.name}
                    </div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mt-0.5">{state.abbreviation}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors mt-1" />
                </div>
                {STATE_GEMS[state.slug] && (
                  <div className="flex flex-wrap gap-1.5">
                    {STATE_GEMS[state.slug].map((gem) => (
                      <span key={gem} className="text-xs bg-ruby-50 text-ruby-700 border border-ruby-100 px-2 py-0.5 rounded-full">
                        {gem}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </section>

        {/* All states A–Z */}
        <section>
          <h2 className="font-heading text-2xl font-bold text-foreground mb-6">All 50 States</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {US_STATES.map((state) => (
              <Link
                key={state.slug}
                href={`/locations/${state.slug}`}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-border bg-card hover:border-ruby-300 hover:bg-ruby-50 hover:text-primary transition-all text-sm group"
              >
                <MapPin className="w-3.5 h-3.5 text-ruby-300 group-hover:text-primary transition-colors shrink-0" />
                <span className="font-medium text-foreground group-hover:text-primary transition-colors truncate">
                  {state.name}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Info strip */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { label: 'Public BLM Land', desc: 'Millions of acres open for rockhounding in the western US — no permit needed for personal quantities.' },
            { label: 'Fee Dig Sites', desc: 'Pay-to-dig operations let you keep everything you find. Great for beginners and families.' },
            { label: 'National Forests', desc: 'Collection of reasonable quantities for personal use is typically allowed — check local forest rules first.' },
          ].map((item) => (
            <div key={item.label} className="border border-border rounded-xl p-5 bg-card">
              <div className="font-semibold text-foreground text-sm mb-2">{item.label}</div>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
