import Link from 'next/link'
import { MapPin } from 'lucide-react'
import { US_STATES } from '@/lib/constants'

const HIGHLIGHTED = [
  'california', 'arizona', 'oregon', 'colorado', 'montana', 'nevada',
  'new-mexico', 'utah', 'wyoming', 'idaho', 'washington', 'texas',
]

export function StateGrid() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <p className="text-primary font-medium text-sm uppercase tracking-widest mb-2">Explore by Region</p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">
            Rockhounding Across America
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Every state has hidden gems waiting to be found. Browse by state to discover locations,
            difficulty levels, and what minerals you can expect to find.
          </p>
        </div>

        {/* Top states featured */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">
          {HIGHLIGHTED.map((slug) => {
            const state = US_STATES.find((s) => s.slug === slug)
            if (!state) return null
            return (
              <Link
                key={slug}
                href={`/locations/${slug}`}
                className="group flex flex-col items-center gap-2 p-4 rounded-xl border border-border hover:border-ruby-300 bg-card hover:bg-ruby-50/50 transition-all duration-200 text-center"
              >
                <div className="w-10 h-10 rounded-full bg-ruby-100 group-hover:bg-ruby-200 flex items-center justify-center transition-colors">
                  <span className="text-ruby-700 font-bold text-sm font-heading">
                    {state.abbreviation}
                  </span>
                </div>
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors leading-tight">
                  {state.name}
                </span>
              </Link>
            )
          })}
        </div>

        {/* All states compact list */}
        <div className="border-t border-border pt-8">
          <h3 className="font-heading text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-5 text-center">
            All 50 States
          </h3>
          <div className="flex flex-wrap justify-center gap-2">
            {US_STATES.map((state) => (
              <Link
                key={state.slug}
                href={`/locations/${state.slug}`}
                className="text-sm text-muted-foreground hover:text-primary hover:bg-ruby-50 border border-transparent hover:border-ruby-200 px-3 py-1.5 rounded-full transition-all"
              >
                {state.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="text-center mt-8">
          <Link
            href="/states"
            className="inline-flex items-center gap-2 text-primary font-medium text-sm hover:underline"
          >
            <MapPin className="w-4 h-4" />
            View detailed state guides
          </Link>
        </div>
      </div>
    </section>
  )
}
