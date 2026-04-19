import Link from 'next/link'
import { Gem } from 'lucide-react'

const gems = [
  { name: 'Agate', emoji: '🪨', desc: 'Colorful banded chalcedony found across the West' },
  { name: 'Jasper', emoji: '🟤', desc: 'Opaque quartz in rich red, yellow, and green hues' },
  { name: 'Obsidian', emoji: '⚫', desc: 'Volcanic glass prized by rockhounds in the Pacific Northwest' },
  { name: 'Quartz', emoji: '💎', desc: 'The most abundant mineral  -  from clear to rose to smoky' },
  { name: 'Garnet', emoji: '🔴', desc: 'Deep red crystals found in schist and metamorphic rock' },
  { name: 'Turquoise', emoji: '🔵', desc: 'Iconic blue-green gem of the American Southwest' },
  { name: 'Petrified Wood', emoji: '🌲', desc: 'Ancient trees preserved as mineral in spectacular detail' },
  { name: 'Gold', emoji: '🥇', desc: 'Placer gold still found in streams across many states' },
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
          {gems.map((gem) => (
            <Link
              key={gem.name}
              href={`/gem-types/${gem.name.toLowerCase().replace(/\s+/g, '-')}`}
              className="group flex items-start gap-4 p-5 rounded-xl border border-border hover:border-ruby-300 hover:bg-ruby-50/40 bg-card transition-all duration-200"
            >
              <span className="text-2xl shrink-0 mt-0.5">{gem.emoji}</span>
              <div>
                <div className="font-heading font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                  {gem.name}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{gem.desc}</p>
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
