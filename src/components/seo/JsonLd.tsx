import { SITE_NAME, SITE_URL } from '@/lib/constants'
import type { Location } from '@/lib/types'

export function WebsiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: 'Find rockhounding sites across all 50 US states.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/locations?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Support',
      email: 'hello@rockhoundingnear.com',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function LocationSchema({ location }: { location: Location }) {
  const url = `${SITE_URL}/locations/${location.state_slug}/${location.city_slug}/${location.slug}`

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name: location.name,
    url,
    description: location.description ?? location.short_description,
    touristType: 'Rockhounding',
    address: {
      '@type': 'PostalAddress',
      addressRegion: location.state,
      addressCountry: 'US',
      ...(location.city && { addressLocality: location.city }),
      ...(location.address && { streetAddress: location.address }),
    },
  }

  if (location.latitude && location.longitude) {
    schema['geo'] = {
      '@type': 'GeoCoordinates',
      latitude: location.latitude,
      longitude: location.longitude,
    }
  }

  if (location.images?.[0]) {
    schema['image'] = location.images[0]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
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

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function StatePageSchema({
  stateName,
  stateSlug,
  description,
}: {
  stateName: string
  stateSlug: string
  description: string
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Rockhounding in ${stateName}`,
    url: `${SITE_URL}/locations/${stateSlug}`,
    description,
    about: {
      '@type': 'Place',
      name: stateName,
      address: { '@type': 'PostalAddress', addressRegion: stateName, addressCountry: 'US' },
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
