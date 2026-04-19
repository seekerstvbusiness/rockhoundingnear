import Link from 'next/link'
import { MapPin, Mountain, Gem } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { DIFFICULTY_LABELS, ACCESS_LABELS } from '@/lib/constants'
import type { Location } from '@/lib/types'

interface LocationCardProps {
  location: Location
  className?: string
}

const difficultyColor: Record<string, string> = {
  easy: 'bg-emerald-100 text-emerald-700',
  moderate: 'bg-amber-100 text-amber-700',
  hard: 'bg-orange-100 text-orange-700',
  expert: 'bg-red-100 text-red-700',
}

export function LocationCard({ location, className }: LocationCardProps) {
  const href = `/locations/${location.state_slug}/${location.city_slug ?? 'unknown'}/${location.slug}`

  return (
    <Link href={href} className={cn('group block', className)}>
      <Card className="h-full overflow-hidden border border-border hover:border-ruby-300 hover:shadow-lg transition-all duration-200 bg-card">
        {/* Image placeholder */}
        <div className="relative h-44 bg-gradient-to-br from-ruby-100 to-cream-100 overflow-hidden">
          {(location.cover_photo ?? location.images?.[0]) ? (
            <img
              src={location.cover_photo ?? location.images[0]}
              alt={location.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Mountain className="w-12 h-12 text-ruby-200" />
            </div>
          )}
          {location.featured && (
            <div className="absolute top-2 left-2">
              <Badge className="bg-primary text-white text-xs">Featured</Badge>
            </div>
          )}
          {location.difficulty && (
            <div className="absolute top-2 right-2">
              <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', difficultyColor[location.difficulty])}>
                {DIFFICULTY_LABELS[location.difficulty]}
              </span>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-heading font-semibold text-base text-foreground group-hover:text-primary transition-colors leading-tight line-clamp-2">
              {location.name}
            </h3>
          </div>

          <div className="flex items-center gap-1 text-muted-foreground text-xs mb-3">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="line-clamp-1">
              {location.city ? `${location.city}, ` : ''}{location.state}
            </span>
          </div>

          {location.short_description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
              {location.short_description}
            </p>
          )}

          {location.gem_types?.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {location.gem_types.slice(0, 3).map((gem) => (
                <Badge
                  key={gem}
                  variant="secondary"
                  className="text-xs bg-ruby-50 text-ruby-700 border-ruby-100 hover:bg-ruby-100"
                >
                  <Gem className="w-2.5 h-2.5 mr-1" />
                  {gem}
                </Badge>
              ))}
              {location.gem_types.length > 3 && (
                <Badge variant="secondary" className="text-xs text-muted-foreground">
                  +{location.gem_types.length - 3} more
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
