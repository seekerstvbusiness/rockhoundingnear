import { Suspense } from 'react'
import { HeroSection } from '@/components/home/HeroSection'
import { StateGrid } from '@/components/home/StateGrid'
import { FeaturedLocations } from '@/components/home/FeaturedLocations'
import { WhySection } from '@/components/home/WhySection'
import { WebsiteSchema, OrganizationSchema } from '@/components/seo/JsonLd'

export default function HomePage() {
  return (
    <>
      <WebsiteSchema />
      <OrganizationSchema />
      <HeroSection />
      <StateGrid />
      <Suspense fallback={
        <section className="py-16 md:py-20 section-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="h-8 w-48 bg-muted rounded mb-3 animate-pulse" />
            <div className="h-6 w-36 bg-muted rounded mb-10 animate-pulse" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-xl border border-border overflow-hidden bg-card">
                  <div className="h-44 bg-muted animate-pulse" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                    <div className="h-3 w-1/2 bg-muted rounded animate-pulse" />
                    <div className="h-3 w-full bg-muted rounded animate-pulse" />
                    <div className="h-3 w-5/6 bg-muted rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      }>
        <FeaturedLocations />
      </Suspense>
      <WhySection />
    </>
  )
}
