import Link from 'next/link'
import { MapPin } from 'lucide-react'
import { US_STATES } from '@/lib/constants'
import { getBestCities } from '@/lib/supabase'

export async function StateGrid() {
  const cities = await getBestCities(12)

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <p className="text-primary font-medium text-sm uppercase tracking-widest mb-2">Top Destinations</p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">
            Best Cities to Rockhound
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Cities with the highest concentration of verified rockhounding sites. Each packed with gems, minerals, and fossil hunting spots.
          </p>
        </div>

        {/* Best cities grid */}
        {cities.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-12">
            {cities.map((city) => (
              <Link
                key={`${city.city_slug}-${city.state_slug}`}
                href={`/locations/${city.state_slug}#rockhounding-in-${city.city_slug}`}
                className="group flex flex-col items-center gap-2 p-4 rounded-xl border border-border hover:border-ruby-300 bg-card hover:bg-ruby-50/50 transition-all duration-200 text-center"
              >
                <div className="w-10 h-10 rounded-full bg-ruby-100 group-hover:bg-ruby-200 flex items-center justify-center transition-colors">
                  <MapPin className="w-4 h-4 text-ruby-700" />
                </div>
                <div>
                  <span className="block text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-tight">
                    {city.city}
                  </span>
                  <span className="block text-xs text-muted-foreground mt-0.5">
                    {city.state}
                  </span>
                  <span className="block text-xs text-ruby-500 font-medium mt-0.5">
                    {city.count} {city.count === 1 ? 'site' : 'sites'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* All states compact list */}
        <div className="border-t border-border pt-8">
          <h3 className="font-heading text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-5 text-center">
            Browse All 50 States
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
      </div>
    </section>
  )
}
