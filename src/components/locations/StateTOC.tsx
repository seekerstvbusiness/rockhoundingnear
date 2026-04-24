'use client'

import { useState, useEffect, useRef } from 'react'
import { List } from 'lucide-react'
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
  const [activeSlug, setActiveSlug] = useState<string>(entries[0]?.citySlug ?? '')
  const mobileNavRef = useRef<HTMLElement>(null)
  const desktopNavRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ids = entries.map((e) => `rockhounding-in-${e.citySlug}`)
    const elements = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[]

    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (obs) => {
        const visible = obs
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

        if (visible.length > 0) {
          const slug = visible[0].target.id.replace('rockhounding-in-', '')
          setActiveSlug(slug)
        }
      },
      { rootMargin: '-80px 0px -40% 0px', threshold: 0 }
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [entries])

  useEffect(() => {
    if (!activeSlug) return
    for (const ref of [mobileNavRef, desktopNavRef]) {
      const nav = ref.current
      const el = nav?.querySelector(`[data-slug="${activeSlug}"]`) as HTMLElement | null
      // Only scroll within the nav container — never touch the page scroll
      if (nav && el && nav.scrollHeight > nav.clientHeight) {
        const elTop = el.offsetTop
        const elBottom = elTop + el.offsetHeight
        if (elBottom > nav.scrollTop + nav.clientHeight) {
          nav.scrollTop = elBottom - nav.clientHeight + 8
        } else if (elTop < nav.scrollTop) {
          nav.scrollTop = elTop - 8
        }
      }
    }
  }, [activeSlug])

  if (entries.length <= 1) return null

  const links = entries.map((e) => (
    <a
      key={e.citySlug}
      data-slug={e.citySlug}
      href={`#rockhounding-in-${e.citySlug}`}
      onClick={() => setActiveSlug(e.citySlug)}
      className={cn(
        'flex items-center justify-between gap-2 py-1.5 px-2 rounded-md text-sm transition-colors',
        e.citySlug === activeSlug
          ? 'bg-ruby-100 text-primary font-semibold'
          : 'text-foreground/80 hover:text-primary hover:bg-ruby-50'
      )}
    >
      <span className="leading-snug">{e.citySlug === activeSlug ? '▸ ' : ''}{e.city}</span>
      <span className="shrink-0 text-xs text-muted-foreground tabular-nums ml-1">{e.count}</span>
    </a>
  ))

  return (
    <>
      {/* Mobile: always-visible inline list */}
      <div className="lg:hidden border border-border rounded-xl bg-card mb-4 overflow-hidden">
        <div className="px-4 py-3 border-b border-border bg-ruby-50/60 flex items-center gap-2">
          <List className="w-4 h-4 text-primary shrink-0" />
          <span className="text-sm font-semibold text-foreground">Jump to a City</span>
          <span className="ml-auto text-xs text-muted-foreground">{entries.length} cities</span>
        </div>
        <nav ref={mobileNavRef} className="p-2 max-h-56 overflow-y-auto">
          {links}
        </nav>
      </div>

      {/* Desktop: sticky sidebar */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-20 self-start border border-border rounded-xl bg-card">
          <div className="px-4 py-3 border-b border-border bg-ruby-50/60 flex items-center gap-2 rounded-t-xl">
            <List className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">Table of Contents</span>
          </div>
          <nav ref={desktopNavRef} className="p-2 max-h-[56vh] overflow-y-auto rounded-b-xl">
            {links}
          </nav>
        </div>
      </aside>
    </>
  )
}
