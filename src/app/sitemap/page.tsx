import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { BreadcrumbSchema } from '@/components/seo/JsonLd'
import { SITE_NAME, SITE_URL, US_STATES, GEM_TYPES } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Sitemap',
  description: `Full sitemap for ${SITE_NAME} : browse all states, gem types, and pages.`,
  alternates: { canonical: `${SITE_URL}/sitemap` },
}

const sitePages = [
  { href: '/', label: 'Home' },
  { href: '/locations', label: 'Browse All Locations' },
  { href: '/states', label: 'Locations by State' },
  { href: '/gem-types', label: 'Browse by Gem Type' },
  { href: '/blog', label: 'Blog & Guides' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
]

export default function SitemapPage() {
  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'Home', url: SITE_URL },
        { name: 'Sitemap', url: `${SITE_URL}/sitemap` },
      ]} />

      <section className="bg-ruby-gradient py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb className="mb-6">
            <BreadcrumbList className="text-white/70">
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="hover:text-white">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-white/40">
                <ChevronRight className="w-4 h-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage className="text-white">Sitemap</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-3">Sitemap</h1>
          <p className="text-white/70 text-lg">Every page on {SITE_NAME} : states, gem types, and more.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">

        {/* Main pages */}
        <section>
          <h2 className="font-heading text-xl font-bold text-foreground mb-4">Main Pages</h2>
          <ul className="space-y-1.5">
            {sitePages.map((p) => (
              <li key={p.href} className="flex items-center gap-2 text-sm">
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <Link href={p.href} className="text-primary hover:underline">{p.label}</Link>
              </li>
            ))}
          </ul>
        </section>

        {/* States */}
        <section>
          <h2 className="font-heading text-xl font-bold text-foreground mb-4">Locations by State</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1.5">
            {US_STATES.map((s) => (
              <Link
                key={s.slug}
                href={`/locations/${s.slug}`}
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                <ChevronRight className="w-3 h-3 text-muted-foreground shrink-0" />
                {s.name}
              </Link>
            ))}
          </div>
        </section>

        {/* Gem types */}
        <section>
          <h2 className="font-heading text-xl font-bold text-foreground mb-4">Locations by Gem Type</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1.5">
            {GEM_TYPES.map((g) => (
              <Link
                key={g}
                href={`/gem-types/${g.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                <ChevronRight className="w-3 h-3 text-muted-foreground shrink-0" />
                {g}
              </Link>
            ))}
          </div>
        </section>

      </div>
    </>
  )
}
