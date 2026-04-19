'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { US_STATES } from '@/lib/constants'

export function SearchBar() {
  const router = useRouter()
  const [query, setQuery] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = query.trim().toLowerCase()
    if (!trimmed) return

    const matchedState = US_STATES.find(
      (s) => s.name.toLowerCase() === trimmed || s.slug === trimmed || s.abbreviation.toLowerCase() === trimmed
    )
    if (matchedState) {
      router.push(`/locations/${matchedState.slug}`)
    } else {
      router.push(`/locations?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 max-w-xl mx-auto">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <Input
          type="text"
          placeholder="Search by state, city, or gem type…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 h-12 bg-white border-white/30 text-foreground placeholder:text-muted-foreground shadow-lg rounded-lg text-sm"
          aria-label="Search rockhounding locations"
        />
      </div>
      <Button
        type="submit"
        size="lg"
        className="h-12 px-6 bg-ruby-900 hover:bg-ruby-950 text-white shadow-lg font-semibold"
      >
        Search
      </Button>
    </form>
  )
}
