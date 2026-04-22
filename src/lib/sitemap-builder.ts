import { SITE_URL } from './constants'

export { SITE_URL }

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export function toW3CDate(date: Date | string): string {
  return new Date(date).toISOString().split('T')[0]
}

export interface SitemapImage {
  loc: string
  title?: string
  caption?: string
}

export interface SitemapUrl {
  loc: string
  lastmod?: string
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority?: number
  images?: SitemapImage[]
}

export function buildSitemapIndex(sitemaps: Array<{ loc: string; lastmod: string }>): string {
  const entries = sitemaps
    .map(
      (s) => `  <sitemap>\n    <loc>${escapeXml(s.loc)}</loc>\n    <lastmod>${s.lastmod}</lastmod>\n  </sitemap>`
    )
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>\n<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</sitemapindex>`
}

export function buildSitemap(urls: SitemapUrl[]): string {
  const entries = urls
    .map((u) => {
      const imgTags = (u.images ?? [])
        .filter((img) => img.loc)
        .map((img) => {
          const titleTag = img.title ? `\n      <image:title>${escapeXml(img.title)}</image:title>` : ''
          const captionTag = img.caption ? `\n      <image:caption>${escapeXml(img.caption)}</image:caption>` : ''
          return `\n    <image:image>\n      <image:loc>${escapeXml(img.loc)}</image:loc>${titleTag}${captionTag}\n    </image:image>`
        })
        .join('')

      return [
        '  <url>',
        `    <loc>${escapeXml(u.loc)}</loc>`,
        u.lastmod ? `    <lastmod>${u.lastmod}</lastmod>` : '',
        u.changefreq ? `    <changefreq>${u.changefreq}</changefreq>` : '',
        u.priority !== undefined ? `    <priority>${u.priority.toFixed(1)}</priority>` : '',
        imgTags,
        '  </url>',
      ]
        .filter(Boolean)
        .join('\n')
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>\n<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>\n<urlset\n  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${entries}\n</urlset>`
}

export const XML_HEADERS = {
  'Content-Type': 'application/xml; charset=utf-8',
  'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
} as const
