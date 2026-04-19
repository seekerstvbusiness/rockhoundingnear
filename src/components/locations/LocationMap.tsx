import { Navigation, ExternalLink } from 'lucide-react'

interface LocationMapProps {
  lat: number
  lon: number
  name: string
}

export function LocationMap({ lat, lon, name }: LocationMapProps) {
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`
  const osmEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.08}%2C${lat - 0.06}%2C${lon + 0.08}%2C${lat + 0.06}&layer=mapnik&marker=${lat}%2C${lon}`
  const osmUrl = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}&zoom=13`

  return (
    <div className="rounded-xl overflow-hidden border border-border">
      {/* Map embed */}
      <div className="relative h-64 md:h-80 bg-muted">
        <iframe
          src={osmEmbedUrl}
          className="w-full h-full border-0"
          title={`Map showing location of ${name}`}
          loading="lazy"
          aria-label={`Interactive map of ${name}`}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 p-3 bg-card border-t border-border">
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-2 bg-primary text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-ruby-700 transition-colors"
        >
          <Navigation className="w-4 h-4" />
          Get Directions
        </a>
        <a
          href={osmUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground border border-border rounded-lg px-3 py-2.5 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Larger Map
        </a>
        <div className="text-xs text-muted-foreground hidden sm:block">
          {lat.toFixed(5)}, {lon.toFixed(5)}
        </div>
      </div>
    </div>
  )
}
