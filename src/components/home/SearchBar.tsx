'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin, Mountain, Building2 } from 'lucide-react'
import { US_STATES } from '@/lib/constants'

interface LocationResult {
  name: string
  state: string
  state_slug: string
  city: string | null
  city_slug: string | null
  slug: string
  url?: string
}

interface CityResult {
  city: string
  state: string
  state_slug: string
  city_slug: string
}

interface SuggestionItem {
  type: 'state' | 'city' | 'location'
  label: string
  sublabel?: string
  href: string
}

function buildSuggestions(query: string, locations: LocationResult[], cities: CityResult[]): SuggestionItem[] {
  const q = query.toLowerCase()
  const items: SuggestionItem[] = []

  const matchedStates = US_STATES
    .filter((s) => s.name.toLowerCase().startsWith(q) || s.abbreviation.toLowerCase() === q)
    .slice(0, 3)
    .map((s): SuggestionItem => ({
      type: 'state',
      label: s.name,
      sublabel: 'State',
      href: `/locations/${s.slug}`,
    }))

  const matchedCities = cities.map((c): SuggestionItem => ({
    type: 'city',
    label: c.city,
    sublabel: c.state,
    href: `/locations/${c.state_slug}#rockhounding-in-${c.city_slug}`,
  }))

  const matchedLocations = locations.map((l): SuggestionItem => ({
    type: 'location',
    label: l.name,
    sublabel: l.city ? `${l.city}, ${l.state}` : l.state,
    href: l.url ?? `/locations/${l.state_slug}${l.city_slug ? `#rockhounding-in-${l.city_slug}` : ''}`,
  }))

  items.push(...matchedStates, ...matchedCities, ...matchedLocations)
  return items
}

interface SearchBarProps {
  compact?: boolean
}

export function SearchBar({ compact = false }: SearchBarProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [locations, setLocations] = useState<LocationResult[]>([])
  const [cities, setCities] = useState<CityResult[]>([])
  const [open, setOpen] = useState(false)
  const [focusedIdx, setFocusedIdx] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const suggestions = query.trim().length >= 1 ? buildSuggestions(query.trim(), locations, cities) : []

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (query.trim().length < 2) { setLocations([]); setCities([]); return }

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`)
        const data = await res.json()
        setLocations(data.locations ?? [])
        setCities(data.cities ?? [])
      } catch {
        setLocations([])
        setCities([])
      }
    }, 250)

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [query])

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
        setFocusedIdx(-1)
      }
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [])

  const navigate = useCallback((href: string) => {
    setOpen(false)
    setFocusedIdx(-1)
    setQuery('')
    router.push(href)
  }, [router])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (focusedIdx >= 0 && suggestions[focusedIdx]) {
      navigate(suggestions[focusedIdx].href)
      return
    }
    const trimmed = query.trim().toLowerCase()
    if (!trimmed) return
    const matchedState = US_STATES.find(
      (s) => s.name.toLowerCase() === trimmed || s.slug === trimmed || s.abbreviation.toLowerCase() === trimmed
    )
    if (matchedState) {
      navigate(`/locations/${matchedState.slug}`)
    } else {
      navigate(`/locations?q=${encodeURIComponent(query.trim())}`)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open || suggestions.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setFocusedIdx((i) => (i + 1) % suggestions.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setFocusedIdx((i) => (i <= 0 ? suggestions.length - 1 : i - 1))
    } else if (e.key === 'Escape') {
      setOpen(false)
      setFocusedIdx(-1)
      inputRef.current?.blur()
    }
  }

  const iconFor = (type: SuggestionItem['type']) => {
    if (type === 'state') return <MapPin className="w-3.5 h-3.5 text-ruby-400 shrink-0" />
    if (type === 'city') return <Building2 className="w-3.5 h-3.5 text-ruby-300 shrink-0" />
    return <Mountain className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
  }

  const inputH = compact ? 'h-9' : 'h-12'
  const btnH = compact ? 'h-9 px-4' : 'h-12 px-6'

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search states, cities, locations..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setOpen(true); setFocusedIdx(-1) }}
            onFocus={() => { if (query.trim().length >= 1) setOpen(true) }}
            onKeyDown={handleKeyDown}
            aria-label="Search rockhounding locations"
            aria-autocomplete="list"
            aria-expanded={open && suggestions.length > 0}
            className={`w-full pl-10 pr-4 ${inputH} bg-white border border-border text-foreground placeholder:text-muted-foreground rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors ${compact ? '' : 'shadow-lg border-white/30'}`}
          />
        </div>
        {!compact && (
          <button
            type="submit"
            className={`${btnH} bg-primary hover:bg-ruby-700 text-white shadow-lg font-semibold rounded-lg text-sm transition-colors`}
          >
            Search
          </button>
        )}
        {compact && (
          <button
            type="submit"
            className={`${btnH} bg-primary hover:bg-ruby-700 text-white font-semibold rounded-lg text-sm transition-colors`}
          >
            <Search className="w-4 h-4" />
          </button>
        )}
      </form>

      {open && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-[calc(100%+6px)] bg-white rounded-xl border border-border shadow-xl z-50 overflow-hidden">
          {suggestions.map((item, idx) => (
            <button
              key={`${item.type}-${item.href}`}
              type="button"
              onMouseDown={(e) => { e.preventDefault(); navigate(item.href) }}
              onMouseEnter={() => setFocusedIdx(idx)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                idx === focusedIdx ? 'bg-ruby-50' : 'hover:bg-muted/50'
              }`}
            >
              {iconFor(item.type)}
              <span className="flex-1 min-w-0">
                <span className="block text-sm font-medium text-foreground truncate">{item.label}</span>
                {item.sublabel && (
                  <span className="block text-xs text-muted-foreground">{item.sublabel}</span>
                )}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
