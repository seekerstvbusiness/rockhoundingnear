'use client'

import dynamic from 'next/dynamic'
import type { MapLocation } from './StateMap'

const StateMapNoSSR = dynamic(
  () => import('./StateMap').then((m) => ({ default: m.StateMap })),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full bg-stone-100 animate-pulse flex items-center justify-center rounded-xl">
        <span className="text-sm text-muted-foreground">Loading map...</span>
      </div>
    ),
  }
)

interface Props {
  locations: MapLocation[]
}

export function StateMapLoader({ locations }: Props) {
  return <StateMapNoSSR locations={locations} />
}
