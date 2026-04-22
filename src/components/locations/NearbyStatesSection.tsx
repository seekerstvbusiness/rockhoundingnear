import Image from 'next/image'
import Link from 'next/link'
import { MapPin, ArrowRight } from 'lucide-react'
import type { StateData } from '@/lib/types'

interface NearbyStatesSectionProps {
  currentStateName: string
  nearbyStates: StateData[]
}

export function NearbyStatesSection({ currentStateName, nearbyStates }: NearbyStatesSectionProps) {
  if (nearbyStates.length === 0) return null

  return (
    <section className="py-14 border-t border-border">
      <div className="mb-8">
        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-2">
          Explore Rockhounding in Nearby States
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base">
          Expand your search: these states border {currentStateName} and offer great rockhounding opportunities.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {nearbyStates.map((state) => (
          <Link
            key={state.slug}
            href={`/locations/${state.slug}`}
            className="group block border border-border rounded-xl overflow-hidden hover:border-ruby-300 hover:shadow-lg transition-all duration-200 bg-card"
          >
            {/* State image or gradient placeholder */}
            <div className="relative h-36 bg-gradient-to-br from-ruby-100 to-cream-100 overflow-hidden">
              {state.image_url ? (
                <Image
                  src={state.image_url}
                  alt={`Rockhounding in ${state.name}`}
                  fill
                  loading="lazy"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="font-heading font-bold text-4xl text-ruby-200">{state.abbreviation}</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-3 left-3">
                <span className="text-white font-heading font-bold text-lg leading-tight drop-shadow">{state.name}</span>
              </div>
            </div>

            <div className="p-4">
              {state.location_count > 0 && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span>{state.location_count} rockhounding site{state.location_count !== 1 ? 's' : ''}</span>
                </div>
              )}

              {state.featured_gems?.length > 0 && (
                <p className="text-xs text-muted-foreground mb-3 line-clamp-1">
                  <span className="font-medium text-foreground/70">Find: </span>
                  {state.featured_gems.slice(0, 3).join(', ')}
                </p>
              )}

              <span className="inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
                Explore Rockhounding in {state.name}
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
