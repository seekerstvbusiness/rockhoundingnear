import type { Metadata } from 'next'
import { BookOpen, Gem, MapPin, Compass } from 'lucide-react'
import Link from 'next/link'
import { SITE_NAME, SITE_URL } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Rockhounding Blog & Tips',
  description: `Guides, tips, and news for rockhounds. Learn where to find gems, how to identify minerals, and get the most out of your rockhounding trips.`,
  alternates: { canonical: `${SITE_URL}/blog` },
}

const comingSoon = [
  {
    icon: MapPin,
    title: 'State-by-State Rockhounding Guides',
    desc: 'Deep dives into the best regions, seasons, and gems for every US state.',
  },
  {
    icon: Gem,
    title: 'Mineral Identification Guides',
    desc: 'How to tell agate from jasper, sapphire from tourmaline, and more.',
  },
  {
    icon: Compass,
    title: 'Beginner Rockhounding Series',
    desc: 'Everything you need to start: tools, etiquette, land rules, and what to look for.',
  },
  {
    icon: BookOpen,
    title: 'Land Access & Legal Collecting',
    desc: 'BLM rules, national forest permits, private land etiquette, and quantity limits explained.',
  },
]

export default function BlogPage() {
  return (
    <div>
      <section className="bg-ruby-gradient py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">
            Blog &amp; Guides
          </h1>
          <p className="text-white/75 text-xl max-w-2xl mx-auto leading-relaxed">
            Tips, guides, and field notes for rockhounds at every level. Coming soon.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-ruby-100 mb-5">
            <BookOpen className="w-8 h-8 text-primary" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-foreground mb-3">
            Articles Are on the Way
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            We&apos;re writing in-depth guides for rockhounds. Here&apos;s what&apos;s coming first:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-14">
          {comingSoon.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex gap-4 p-6 rounded-xl border border-border bg-card">
              <div className="shrink-0 w-10 h-10 rounded-lg bg-ruby-100 flex items-center justify-center">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-foreground mb-1">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center border-t border-border pt-10">
          <p className="text-muted-foreground mb-5">
            In the meantime, browse our verified location database:
          </p>
          <Link
            href="/locations"
            className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-ruby-700 transition-colors text-sm"
          >
            <Gem className="w-4 h-4" />
            Browse Rockhounding Locations
          </Link>
        </div>
      </div>
    </div>
  )
}
