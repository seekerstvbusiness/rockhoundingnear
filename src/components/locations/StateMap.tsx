'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'

export interface MapLocation {
  id: string
  name: string
  slug: string
  latitude: number
  longitude: number
}

const rubyMarker = L.divIcon({
  className: '',
  html: `<div style="width:10px;height:10px;border-radius:50%;background:#b91c1c;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,0.35)"></div>`,
  iconSize: [10, 10],
  iconAnchor: [5, 5],
  popupAnchor: [0, -8],
})

function FitBounds({ locations }: { locations: MapLocation[] }) {
  const map = useMap()
  useEffect(() => {
    if (locations.length === 0) return
    const bounds = L.latLngBounds(locations.map((l) => [l.latitude, l.longitude]))
    map.fitBounds(bounds, { padding: [48, 48], maxZoom: 10 })
  }, [map, locations])
  return null
}

export function StateMap({ locations }: { locations: MapLocation[] }) {
  const valid = locations.filter((l) => l.latitude != null && l.longitude != null)
  if (valid.length === 0) return null

  const centerLat = valid.reduce((s, l) => s + l.latitude, 0) / valid.length
  const centerLng = valid.reduce((s, l) => s + l.longitude, 0) / valid.length

  return (
    <MapContainer
      center={[centerLat, centerLng]}
      zoom={6}
      scrollWheelZoom={true}
      touchZoom={true}
      zoomControl={true}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds locations={valid} />
      {valid.map((loc) => (
        <Marker key={loc.id} position={[loc.latitude, loc.longitude]} icon={rubyMarker}>
          <Popup>
            <div className="min-w-[140px]">
              <p className="font-semibold text-sm leading-snug mb-1">{loc.name}</p>
              <a
                href={`#${loc.slug}`}
                className="text-xs text-blue-600 hover:underline"
              >
                Jump to location
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
