import { Suspense } from 'react'
import { HeroSection } from '@/components/home/HeroSection'
import { StateGrid } from '@/components/home/StateGrid'
import { FeaturedLocations } from '@/components/home/FeaturedLocations'
import { GemTypesSection } from '@/components/home/GemTypesSection'
import { WhySection } from '@/components/home/WhySection'
import { WebsiteSchema, OrganizationSchema } from '@/components/seo/JsonLd'

export default function HomePage() {
  return (
    <>
      <WebsiteSchema />
      <OrganizationSchema />
      <HeroSection />
      <StateGrid />
      <Suspense fallback={<div className="py-20 text-center text-muted-foreground">Loading locations…</div>}>
        <FeaturedLocations />
      </Suspense>
      <GemTypesSection />
      <WhySection />
    </>
  )
}
