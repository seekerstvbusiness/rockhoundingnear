import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { LocationCard } from '@/components/locations/LocationCard'
import { getFeaturedLocations } from '@/lib/supabase'

export async function FeaturedLocations() {
  const locations = await getFeaturedLocations()

  if (locations.length === 0) return null

  return (
    <section className="py-16 md:py-20 section-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-primary font-medium text-sm uppercase tracking-widest mb-2">
              Staff Picks
            </p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">
              Featured Locations
            </h2>
            <p className="text-muted-foreground max-w-lg">
              Hand-picked sites with exceptional access, scenery, and finds.
            </p>
          </div>
          <Link
            href="/locations"
            className="hidden sm:flex items-center gap-1.5 text-primary font-medium text-sm hover:underline"
          >
            View all
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {locations.map((location) => (
            <LocationCard key={location.id} location={location} />
          ))}
        </div>

        <div className="sm:hidden text-center mt-8">
          <Link
            href="/locations"
            className="inline-flex items-center gap-1.5 text-primary font-medium text-sm"
          >
            View all locations
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
