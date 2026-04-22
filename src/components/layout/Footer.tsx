import Link from 'next/link'
import { Gem } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { SITE_NAME, SITE_DESCRIPTION, US_STATES } from '@/lib/constants'

const featuredStates = [
  'california', 'arizona', 'oregon', 'colorado', 'montana',
  'nevada', 'new-mexico', 'utah', 'wyoming', 'idaho',
]

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-ruby-950 text-white/80">
      {/* Top CTA strip */}
      <div className="bg-primary py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-2xl font-bold text-white mb-2">
            Ready to Start Your Hunt?
          </h2>
          <p className="text-white/80 mb-5 text-sm max-w-xl mx-auto">
            Browse over 1,000 rockhounding locations across all 50 states. Free, curated, and detailed.
          </p>
          <Link
            href="/locations"
            className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-6 py-2.5 rounded-lg hover:bg-ruby-50 transition-colors text-sm"
          >
            <Gem className="w-4 h-4" />
            Browse All Locations
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 group mb-4">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/80 text-white">
                <Gem className="w-5 h-5" />
              </div>
              <span className="font-heading font-bold text-lg text-white">{SITE_NAME}</span>
            </Link>
            <p className="text-sm text-white/60 leading-relaxed">{SITE_DESCRIPTION}</p>
          </div>

          {/* Top States */}
          <div>
            <h3 className="font-heading font-semibold text-white text-sm uppercase tracking-widest mb-4">
              Top States
            </h3>
            <ul className="space-y-2">
              {featuredStates.map((slug) => {
                const state = US_STATES.find((s) => s.slug === slug)
                if (!state) return null
                return (
                  <li key={slug}>
                    <Link
                      href={`/locations/${slug}`}
                      className="text-sm text-white/60 hover:text-white transition-colors"
                    >
                      {state.name}
                    </Link>
                  </li>
                )
              })}
              <li>
                <Link href="/states" className="text-sm text-ruby-300 hover:text-ruby-200 font-medium transition-colors">
                  View All States →
                </Link>
              </li>
            </ul>
          </div>

          {/* Site */}
          <div>
            <h3 className="font-heading font-semibold text-white text-sm uppercase tracking-widest mb-4">
              Site
            </h3>
            <ul className="space-y-2">
              {[
                { href: '/about', label: 'About Us' },
                { href: '/contact', label: 'Contact' },
                { href: '/blog', label: 'Blog & Tips' },
                { href: '/sitemap', label: 'Sitemap' },
                { href: '/privacy-policy', label: 'Privacy Policy' },
                { href: '/terms', label: 'Terms of Use' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-10 bg-white/10" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <p>&copy; {year} {SITE_NAME}. All rights reserved.</p>
          <p>Made for rockhounds, by rockhounds.</p>
        </div>
      </div>
    </footer>
  )
}
