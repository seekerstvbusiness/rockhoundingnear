'use client'

import { useState } from 'react'
import { ChevronDown, List } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TocEntry {
  citySlug: string
  city: string
  count: number
}

interface StateTOCProps {
  entries: TocEntry[]
  stateName: string
}

export function StateTOC({ entries, stateName }: StateTOCProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  if (entries.length <= 1) return null

  const links = entries.map((e) => (
    <a
      key={e.citySlug}
      href={`#rockhounding-in-${e.citySlug}`}
      className="flex items-center justify-between gap-2 py-1.5 px-2 rounded-md text-sm text-foreground/80 hover:text-primary hover:bg-ruby-50 transition-colors group"
      onClick={() => setMobileOpen(false)}
    >
      <span className="truncate group-hover:text-primary">Rockhounding in {e.city}</span>
      <span className="shrink-0 text-xs text-muted-foreground tabular-nums">{e.count}</span>
    </a>
  ))

  return (
    <>
      {/* Mobile: collapsible bar */}
      <div className="lg:hidden border border-border rounded-xl bg-card mb-6">
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-foreground"
        >
          <span className="flex items-center gap-2">
            <List className="w-4 h-4 text-primary" />
            Table of Contents: {entries.length} cities
          </span>
          <ChevronDown className={cn('w-4 h-4 transition-transform text-muted-foreground', mobileOpen && 'rotate-180')} />
        </button>
        {mobileOpen && (
          <div className="px-3 pb-3 border-t border-border pt-2 max-h-64 overflow-y-auto">
            {links}
          </div>
        )}
      </div>

      {/* Desktop: sticky sidebar */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-20 border border-border rounded-xl bg-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-ruby-50/60 flex items-center gap-2">
            <List className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">Table of Contents</span>
          </div>
          <nav className="p-2 max-h-[calc(100vh-8rem)] overflow-y-auto">
            {links}
          </nav>
        </div>
      </aside>
    </>
  )
}
