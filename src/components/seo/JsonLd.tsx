import { SITE_NAME, SITE_URL } from '@/lib/constants'
import type { Location, FaqItem } from '@/lib/types'

export function WebsiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: 'Find rockhounding sites across all 50 US states.',
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/locations?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    contactPoint: { '@type': 'ContactPoint', contactType: 'Customer Support', email: 'hello@rockhoundingnear.com' },
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export function LocationSchema({ location }: { location: Location }) {
  const url = `${SITE_URL}/locations/${location.state_slug}/${location.city_slug}/${location.slug}`

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': ['TouristAttraction', 'Place'],
    name: location.name,
    url,
    description: location.description ?? location.short_description,
    touristType: ['Rockhounding', 'Mineral Collecting', 'Gem Hunting'],
    address: {
      '@type': 'PostalAddress',
      addressRegion: location.state,
      addressCountry: 'US',
      ...(location.city && { addressLocality: location.city }),
      ...(location.county && { addressLocality: location.county + ' County' }),
      ...(location.address && { streetAddress: location.address }),
    },
    ...(location.latitude && location.longitude && {
      geo: { '@type': 'GeoCoordinates', latitude: location.latitude, longitude: location.longitude },
    }),
    ...(location.cover_photo && { image: location.cover_photo }),
    ...(location.images?.length && { photo: location.images }),
    ...(location.rating_count > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: location.rating_average,
        reviewCount: location.rating_count,
        bestRating: 5,
        worstRating: 1,
      },
    }),
    amenityFeature: [
      ...(location.dog_friendly != null ? [{ '@type': 'LocationFeatureSpecification', name: 'Dog Friendly', value: location.dog_friendly }] : []),
      ...(location.family_friendly != null ? [{ '@type': 'LocationFeatureSpecification', name: 'Family Friendly', value: location.family_friendly }] : []),
      ...(location.beginner_friendly != null ? [{ '@type': 'LocationFeatureSpecification', name: 'Beginner Friendly', value: location.beginner_friendly }] : []),
      ...(location.permit_required != null ? [{ '@type': 'LocationFeatureSpecification', name: 'Permit Required', value: location.permit_required }] : []),
    ].filter(Boolean),
    keywords: [
      location.name,
      'rockhounding',
      location.state,
      location.city ?? '',
      location.county ? `${location.county} County` : '',
      ...(location.gem_types ?? []),
      ...(location.alternative_names ?? []),
    ].filter(Boolean).join(', '),
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export function FaqSchema({ faqs }: { faqs: FaqItem[] }) {
  if (!faqs?.length) return null
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export function BreadcrumbSchema({ items }: { items: { name: string; url: string }[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export function StatePageSchema({ stateName, stateSlug, description }: { stateName: string; stateSlug: string; description: string }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Rockhounding in ${stateName}`,
    url: `${SITE_URL}/locations/${stateSlug}`,
    description,
    about: { '@type': 'Place', name: stateName, address: { '@type': 'PostalAddress', addressRegion: stateName, addressCountry: 'US' } },
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}
