import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/constants'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/_next/',
          '/admin/',
        ],
      },
    ],
    // Sitemap index: Googlebot, Bingbot etc. will discover all sub-sitemaps from here
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
