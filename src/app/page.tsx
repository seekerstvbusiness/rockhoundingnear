import { HeroSection } from '@/components/home/HeroSection'
import { StateGrid } from '@/components/home/StateGrid'
import { WhySection } from '@/components/home/WhySection'
import { WebsiteSchema, OrganizationSchema } from '@/components/seo/JsonLd'

export default function HomePage() {
  return (
    <>
      <WebsiteSchema />
      <OrganizationSchema />
      <HeroSection />
      <StateGrid />
      <WhySection />
    </>
  )
}
