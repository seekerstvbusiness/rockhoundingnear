import Link from 'next/link'
import { Gem, Layers, Circle, Zap, Diamond, Leaf, Coins } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface GemEntry {
  name: string
  desc: string
  icon: LucideIcon
  bg: string
  text: string
}

const gems: GemEntry[] = [
  { name: 'Agate', desc: 'Colorful banded chalcedony found across the West', icon: Layers, bg: 'bg-amber-100', text: 'text-amber-700' },
  { name: 'Jasper', desc: 'Opaque quartz in rich red, yellow, and green hues', icon: Circle, bg: 'bg-orange-100', text: 'text-orange-700' },
  { name: 'Obsidian', desc: 'Volcanic glass prized by rockhounds in the Pacific Northwest', icon: Zap, bg: 'bg-slate-200', text: 'text-slate-700' },
  { name: 'Quartz', desc: 'The most abundant mineral. from clear to rose to smoky', icon: Gem, bg: 'bg-violet-100', text: 'text-violet-700' },
  { name: 'Garnet', desc: 'Deep red crystals found in schist and metamorphic rock', icon: Diamond, bg: 'bg-ruby-100', text: 'text-ruby-700' },
  { name: 'Turquoise', desc: 'Iconic blue-green gem of the American Southwest', icon: Circle, bg: 'bg-teal-100', text: 'text-teal-700' },
  { name: 'Petrified Wood', desc: 'Ancient trees preserved as mineral in spectacular detail', icon: Leaf, bg: 'bg-lime-100', text: 'text-lime-700' },
  { name: 'Gold', desc: 'Placer gold still found in streams across many states', icon: Coins, bg: 'bg-yellow-100', text: 'text-yellow-700' },
]

export function GemTypesSection() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-primary font-medium text-sm uppercase tracking-widest mb-2">
            What You Can Find
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">
            Popular Gem & Mineral Types
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Filter locations by the specific gems and minerals you&apos;re after.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {gems.map(({ name, desc, icon: Icon, bg, text }) => (
            <Link
              key={name}
              href={`/gem-types/${name.toLowerCase().replace(/\s+/g, '-')}`}
              className="group flex items-start gap-4 p-5 rounded-xl border border-border hover:border-ruby-300 hover:bg-ruby-50/40 bg-card transition-all duration-200"
            >
              <div className={`shrink-0 mt-0.5 w-9 h-9 rounded-lg ${bg} flex items-center justify-center`}>
                <Icon className={`w-4.5 h-4.5 ${text}`} />
              </div>
              <div>
                <div className="font-heading font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                  {name}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/gem-types"
            className="inline-flex items-center gap-2 text-primary font-medium text-sm hover:underline"
          >
            <Gem className="w-4 h-4" />
            Browse all 40+ gem types
          </Link>
        </div>
      </div>
    </section>
  )
}
