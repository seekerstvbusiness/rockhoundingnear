import Link from 'next/link'
import { MapPin, Gem, Mountain } from 'lucide-react'
import { SearchBar } from './SearchBar'

const stats = [
  { icon: MapPin, value: '1,000+', label: 'Verified Locations' },
  { icon: Gem, value: '50', label: 'States Covered' },
  { icon: Mountain, value: '40+', label: 'Gem Types' },
]

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-ruby-gradient">
      {/* Texture overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="max-w-3xl mx-auto text-center">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-4 py-1.5 mb-6">
            <Gem className="w-3.5 h-3.5 text-ruby-200" />
            <span className="text-white/90 text-xs font-medium tracking-wide uppercase">
              America&apos;s #1 Rockhounding Directory
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-5 text-balance">
            Find Rockhounding Sites{' '}
            <span className="text-ruby-200 italic">Near You</span>
          </h1>

          {/* Subheading */}
          <p className="text-white/75 text-lg sm:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Discover over 1,000 hand-curated rockhounding locations across all 50 states.
            From agates to amethysts: your next gem hunt starts here.
          </p>

          {/* Search */}
          <div className="mb-8">
            <SearchBar />
          </div>

          {/* Quick links */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {['Arizona', 'California', 'Oregon', 'Colorado', 'Montana'].map((state) => (
              <Link
                key={state}
                href={`/locations/${state.toLowerCase()}`}
                className="text-sm text-white/70 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-full px-3.5 py-1 transition-all"
              >
                {state}
              </Link>
            ))}
            <Link
              href="/states"
              className="text-sm text-ruby-200 hover:text-white border border-ruby-300/40 hover:border-white/30 rounded-full px-3.5 py-1 transition-all"
            >
              All States →
            </Link>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center divide-x divide-white/20 max-w-lg mx-auto">
            {stats.map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex-1 text-center px-4">
                <div className="flex justify-center mb-1.5">
                  <Icon className="w-4 h-4 text-ruby-200" />
                </div>
                <div className="font-heading text-2xl font-bold text-white">{value}</div>
                <div className="text-xs text-white/60 mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 40H1440V20C1200 0 960 40 720 20C480 0 240 40 0 20V40Z" fill="white" />
        </svg>
      </div>
    </section>
  )
}
