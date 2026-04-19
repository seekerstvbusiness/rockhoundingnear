import type { Metadata } from 'next'
import { Gem, Shield, MapPin, Heart } from 'lucide-react'
import { SITE_NAME, SITE_URL } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'About Us',
  description: `Learn about ${SITE_NAME}  -  our mission to help rockhounds find the best gem hunting locations across all 50 US states.`,
  alternates: { canonical: `${SITE_URL}/about` },
}

const values = [
  {
    icon: Gem,
    title: 'Accuracy Over Quantity',
    desc: 'Every location is verified with real coordinates, honest access info, and what you can actually expect to find  -  not exaggerated listings.',
  },
  {
    icon: Shield,
    title: 'Safety First',
    desc: 'We always include difficulty ratings, permit requirements, and safety notes because rockhounding should be rewarding, not risky.',
  },
  {
    icon: MapPin,
    title: 'Genuinely Useful Data',
    desc: 'GPS coordinates, seasonal access windows, fee amounts, nearby facilities  -  the details that make the difference between a great trip and a wasted one.',
  },
  {
    icon: Heart,
    title: 'Built for the Community',
    desc: 'We are rockhounds ourselves. This site exists because we wished something like it existed when we were starting out.',
  },
]

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-ruby-gradient py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">
            About {SITE_NAME}
          </h1>
          <p className="text-white/75 text-xl max-w-2xl mx-auto leading-relaxed">
            We built the rockhounding directory we always wished existed  -  honest, detailed, and genuinely useful.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Mission */}
        <section className="mb-16">
          <h2 className="font-heading text-3xl font-bold text-foreground mb-5">Our Mission</h2>
          <div className="prose prose-stone max-w-none text-foreground/80 text-lg leading-relaxed space-y-4">
            <p>
              Rockhounding is one of America&apos;s most accessible and rewarding outdoor hobbies  -  yet finding
              reliable, specific information about where to go has always been frustratingly difficult. Forums
              are scattered, guidebooks go out of date, and generic lists rarely tell you what you actually need to know.
            </p>
            <p>
              {SITE_NAME} was created to solve that. We&apos;ve spent thousands of hours researching, verifying,
              and documenting rockhounding sites across all 50 states. Our goal is simple: give rockhounds  - 
              whether complete beginners or seasoned collectors  -  the most useful directory available anywhere.
            </p>
            <p>
              We are not a content farm. We don&apos;t generate pages to game search engines. Every location
              on this site represents a real place where real people have found real gems and minerals.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="mb-16">
          <h2 className="font-heading text-3xl font-bold text-foreground mb-8">What We Stand For</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4 p-6 rounded-xl border border-border bg-card hover:border-ruby-200 transition-colors">
                <div className="shrink-0 w-10 h-10 rounded-lg bg-ruby-100 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-foreground mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Disclaimer */}
        <section className="bg-amber-50 border border-amber-100 rounded-xl p-6">
          <h2 className="font-heading text-lg font-semibold text-foreground mb-2">A Note on Accuracy</h2>
          <p className="text-sm text-foreground/75 leading-relaxed">
            Rockhounding regulations, land access, and site conditions can change. Always verify current
            access rules and permit requirements with the relevant land management agency (BLM, USFS, State Parks)
            before visiting. We update our listings regularly but cannot guarantee real-time accuracy. Always
            practice Leave No Trace and collect responsibly.
          </p>
        </section>
      </div>
    </div>
  )
}
