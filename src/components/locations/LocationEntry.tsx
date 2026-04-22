import Image from 'next/image'
import {
  Mountain, Gem, MapPin, Calendar, Car, DollarSign, ShieldAlert,
  Wifi, Star, Navigation, History, Layers, ParkingCircle,
  Wrench, Info, AlertTriangle, Users, Baby, Dog, Compass,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import {
  DIFFICULTY_LABELS, ACCESS_LABELS, VEHICLE_LABELS, CELL_LABELS, HAZARD_LABELS,
} from '@/lib/constants'
import type { Location } from '@/lib/types'

const difficultyColor: Record<string, string> = {
  easy: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  moderate: 'bg-amber-100 text-amber-700 border-amber-200',
  hard: 'bg-orange-100 text-orange-700 border-orange-200',
  expert: 'bg-red-100 text-red-700 border-red-200',
}

function remotenessLabel(rating: number): string {
  if (rating <= 1) return 'Near Town'
  if (rating <= 2) return 'Accessible'
  if (rating <= 3) return 'Moderate Drive'
  if (rating <= 4) return 'Remote'
  return 'Very Remote'
}

interface LocationEntryProps {
  location: Location
}

export function LocationEntry({ location }: LocationEntryProps) {
  const coverImage = location.cover_photo ?? location.images?.[0] ?? null
  const allGems = location.gem_types ?? []

  return (
    <article
      id={location.slug}
      className="border border-border rounded-2xl bg-card overflow-hidden scroll-mt-6"
    >
      {/* Cover photo or gradient header */}
      {coverImage ? (
        <div className="relative h-64 sm:h-72 w-full">
          <Image
            src={coverImage}
            alt={location.name}
            fill
            loading="lazy"
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 900px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <TitleBlock location={location} dark />
          </div>
        </div>
      ) : (
        <div className="h-28 bg-gradient-to-br from-ruby-100 to-cream-100 flex items-center justify-center relative">
          <Mountain className="w-10 h-10 text-ruby-200" />
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <TitleBlock location={location} dark={false} />
          </div>
        </div>
      )}

      <div className="p-5 sm:p-6 space-y-5">
        {/* Alternative names */}
        {location.alternative_names?.length > 0 && (
          <p className="text-xs text-muted-foreground italic">
            Also known as: {location.alternative_names.join(', ')}
          </p>
        )}

        {/* Gem types + rating */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            {allGems.map((gem) => (
              <Badge key={gem} variant="secondary" className="text-xs bg-ruby-50 text-ruby-700 border-ruby-100">
                <Gem className="w-2.5 h-2.5 mr-1 shrink-0" />
                {gem}
              </Badge>
            ))}
          </div>
          {location.rating_count > 0 && (
            <RatingDisplay average={location.rating_average} count={location.rating_count} />
          )}
        </div>

        {/* Key facts grid (vehicle, cell, remoteness, fee, permit) */}
        <KeyFacts location={location} />

        {/* Audience tags */}
        <AudienceTags location={location} />

        {/* Hazards */}
        {location.hazards?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 items-center">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="text-xs text-muted-foreground font-medium">Hazards:</span>
            {location.hazards.map((h) => (
              <span key={h} className="text-xs bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-2 py-0.5">
                {HAZARD_LABELS[h] ?? h}
              </span>
            ))}
          </div>
        )}

        {/* Short description */}
        {location.short_description && (
          <p className="text-foreground/90 font-medium leading-relaxed">
            {location.short_description}
          </p>
        )}

        {/* Full description */}
        {location.description && (
          <div className="prose prose-sm max-w-none text-foreground/80 leading-relaxed space-y-3">
            {location.description.split('\n\n').map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        )}

        {/* Historical background */}
        {location.history && (
          <InfoBlock icon={<History className="w-4 h-4 text-primary" />} label="Historical Background">
            {location.history}
          </InfoBlock>
        )}

        {/* Terrain & Geology */}
        {location.terrain_notes && (
          <InfoBlock icon={<Layers className="w-4 h-4 text-primary" />} label="Terrain and Geology">
            {location.terrain_notes}
          </InfoBlock>
        )}

        {/* Rockhounding tips */}
        {location.tips && (
          <InfoBlock icon={<Wrench className="w-4 h-4 text-primary" />} label="Rockhounding Tips">
            {location.tips}
          </InfoBlock>
        )}

        {/* Directions */}
        {(location.written_directions || location.directions) && (
          <InfoBlock icon={<Navigation className="w-4 h-4 text-primary" />} label="How to Get There">
            {location.written_directions ?? location.directions!}
          </InfoBlock>
        )}

        {/* Best season */}
        {location.best_season && (
          <InfoBlock icon={<Calendar className="w-4 h-4 text-primary" />} label="Best Season to Visit">
            {location.best_season}
          </InfoBlock>
        )}

        {/* Road conditions */}
        {location.road_conditions && (
          <InfoBlock icon={<Car className="w-4 h-4 text-primary" />} label="Road Conditions">
            {location.road_conditions}
          </InfoBlock>
        )}

        {/* Parking */}
        {location.parking_notes && (
          <InfoBlock icon={<ParkingCircle className="w-4 h-4 text-primary" />} label="Parking">
            {location.parking_notes}
          </InfoBlock>
        )}

        {/* Nearest services */}
        {location.nearest_services && (
          <InfoBlock icon={<Info className="w-4 h-4 text-primary" />} label="Nearest Services">
            {location.nearest_services}
          </InfoBlock>
        )}

        {/* Accessibility */}
        {location.accessibility_notes && (
          <InfoBlock icon={<Users className="w-4 h-4 text-primary" />} label="Accessibility">
            {location.accessibility_notes}
          </InfoBlock>
        )}

        {/* Collection rules */}
        {(location.collection_rules || location.quantity_limits) && (
          <InfoBlock icon={<ShieldAlert className="w-4 h-4 text-primary" />} label="Collection Rules">
            {[location.collection_rules, location.quantity_limits].filter(Boolean).join(' ')}
          </InfoBlock>
        )}

        {/* Rules & regulations */}
        {location.rules && (
          <InfoBlock icon={<ShieldAlert className="w-4 h-4 text-primary" />} label="Rules and Regulations">
            {location.rules}
          </InfoBlock>
        )}
      </div>
    </article>
  )
}

function TitleBlock({ location, dark }: { location: Location; dark: boolean }) {
  const textBase = dark ? 'text-white' : 'text-foreground'
  const textMuted = dark ? 'text-white/70' : 'text-muted-foreground'

  const locationLine = [
    location.city,
    location.county ? `${location.county} County` : null,
    location.nearest_city && location.nearest_city_distance != null
      ? `${location.nearest_city_distance} mi from ${location.nearest_city}`
      : null,
  ].filter(Boolean).join(' · ')

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-1">
        <h3 className={cn('font-heading font-bold text-xl sm:text-2xl leading-snug', textBase)}>
          {location.name}
        </h3>
        {location.featured && (
          <Badge className="bg-primary text-white text-xs shrink-0">Featured</Badge>
        )}
        {location.difficulty && (
          <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full border shrink-0', difficultyColor[location.difficulty])}>
            {DIFFICULTY_LABELS[location.difficulty]}
          </span>
        )}
        {location.access_type && (
          <span className={cn(
            'text-xs px-2 py-0.5 rounded-full border shrink-0',
            dark ? 'bg-white/15 border-white/25 text-white/90' : 'bg-muted border-border text-muted-foreground'
          )}>
            {ACCESS_LABELS[location.access_type]}
          </span>
        )}
      </div>
      {locationLine && (
        <p className={cn('text-sm flex items-center gap-1 mb-0.5', textMuted)}>
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          {locationLine}
        </p>
      )}
      {location.latitude != null && location.longitude != null && (
        <p className={cn('text-xs flex items-center gap-1', dark ? 'text-white/50' : 'text-muted-foreground/60')}>
          <Compass className="w-3 h-3 shrink-0" />
          {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
        </p>
      )}
    </div>
  )
}

function KeyFacts({ location }: { location: Location }) {
  const facts: { icon: React.ReactNode; label: string; value: string }[] = []

  if (location.vehicle_required) {
    facts.push({ icon: <Car className="w-4 h-4" />, label: 'Vehicle', value: VEHICLE_LABELS[location.vehicle_required] ?? location.vehicle_required })
  }
  if (location.cell_service) {
    facts.push({ icon: <Wifi className="w-4 h-4" />, label: 'Cell Service', value: CELL_LABELS[location.cell_service] ?? location.cell_service })
  }
  if (location.remoteness_rating != null) {
    facts.push({ icon: <MapPin className="w-4 h-4" />, label: 'Remoteness', value: remotenessLabel(location.remoteness_rating) })
  }
  if (location.fee_amount != null) {
    facts.push({ icon: <DollarSign className="w-4 h-4" />, label: 'Fee', value: `$${location.fee_amount} per person` })
  } else if (location.access_type === 'fee') {
    facts.push({ icon: <DollarSign className="w-4 h-4" />, label: 'Fee', value: 'Fee required (see site)' })
  }
  if (location.permit_required) {
    facts.push({
      icon: <ShieldAlert className="w-4 h-4" />,
      label: 'Permit',
      value: 'Required',
    })
  }

  if (facts.length === 0) return null

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {facts.map((f) => (
        <div
          key={f.label}
          className="flex flex-col gap-1 px-3 py-2.5 bg-muted/40 rounded-xl border border-border"
        >
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <span className="text-primary/70">{f.icon}</span>
            <span className="text-xs font-medium uppercase tracking-wide">{f.label}</span>
          </div>
          <span className="text-sm font-semibold text-foreground leading-snug">{f.value}</span>
        </div>
      ))}
    </div>
  )
}

function AudienceTags({ location }: { location: Location }) {
  const tags: { icon: React.ReactNode; label: string }[] = []

  if (location.beginner_friendly) tags.push({ icon: <Star className="w-3 h-3" />, label: 'Beginner Friendly' })
  if (location.family_friendly) tags.push({ icon: <Users className="w-3 h-3" />, label: 'Family Friendly' })
  if (location.dog_friendly) tags.push({ icon: <Dog className="w-3 h-3" />, label: 'Dog Friendly' })
  if (location.kid_age_range) tags.push({ icon: <Baby className="w-3 h-3" />, label: `Ages ${location.kid_age_range}` })

  if (tags.length === 0) return null

  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((t) => (
        <span
          key={t.label}
          className="inline-flex items-center gap-1 text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-2.5 py-1"
        >
          {t.icon}
          {t.label}
        </span>
      ))}
    </div>
  )
}

function RatingDisplay({ average, count }: { average: number; count: number }) {
  const stars = Math.round(average)
  return (
    <div className="flex items-center gap-1.5 shrink-0">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((n) => (
          <Star
            key={n}
            className={cn('w-3.5 h-3.5', n <= stars ? 'text-amber-400 fill-amber-400' : 'text-muted-foreground/30')}
          />
        ))}
      </div>
      <span className="text-xs text-muted-foreground">
        {average.toFixed(1)} ({count})
      </span>
    </div>
  )
}

function InfoBlock({ icon, label, children }: { icon: React.ReactNode; label: string; children: string }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5">
        {icon}
        <span className="font-semibold text-sm text-foreground">{label}</span>
      </div>
      <p className="text-sm text-foreground/75 leading-relaxed pl-5">{children}</p>
    </div>
  )
}
