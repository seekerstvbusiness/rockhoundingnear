import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight, Gem } from 'lucide-react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { BreadcrumbSchema } from '@/components/seo/JsonLd'
import { GEM_TYPES, SITE_URL, SITE_NAME } from '@/lib/constants'

export const metadata: Metadata = {
  title: `Browse Gems & Minerals | ${SITE_NAME}`,
  description: 'Find rockhounding locations by gem type. Search for agate, amethyst, gold, garnet, turquoise, and 35+ more minerals across the US.',
  alternates: { canonical: `${SITE_URL}/gem-types` },
}

const GEM_DESCRIPTIONS: Record<string, string> = {
  Agate: 'One of the most common and beloved finds  -  bands of chalcedony in every color.',
  Amethyst: 'Purple variety of quartz found in geodes and volcanic rock across the US.',
  Gold: 'Placer gold in riverbeds and lode deposits  -  still found in many western states.',
  Garnet: 'Deep red crystals common in metamorphic rock; several varieties in mountain states.',
  Jasper: 'Opaque variety of chalcedony found in vivid reds, yellows, and greens.',
  Obsidian: 'Volcanic glass formed from rapid lava cooling  -  razor-sharp edges, glassy luster.',
  Opal: 'Fire opal, common opal, and precious opal found in western volcanic deposits.',
  Turquoise: 'Sky-blue copper mineral prized for jewelry; major deposits in Arizona and Nevada.',
  Quartz: 'The most abundant mineral on Earth  -  clear, rose, smoky, and more varieties.',
  'Petrified Wood': 'Ancient trees replaced by silica over millions of years  -  often agate-filled.',
  Tourmaline: 'Colorful crystals ranging from pink to green found in pegmatites.',
  Topaz: 'Hard silicate mineral; blue topaz known from Utah\'s Thomas Range.',
  Sapphire: 'Blue corundum from Montana\'s Yogo Gulch and other western deposits.',
  Ruby: 'Red corundum  -  North Carolina\'s Cowee Valley is a famous US source.',
  Emerald: 'Green beryl; found in North Carolina\'s Hiddenite area.',
  'Rose Quartz': 'Pink quartz common in pegmatite deposits and riverbeds.',
  'Smoky Quartz': 'Brownish-gray quartz from granite pegmatites and mountain areas.',
  Fluorite: 'Colorful cubic mineral in purples, greens, yellows  -  found in veins.',
  Chalcedony: 'Microcrystalline quartz including agate, jasper, and chert.',
}

const GEM_COLORS: Record<string, string> = {
  Agate: 'from-orange-100 to-red-100',
  Amethyst: 'from-purple-100 to-violet-100',
  Gold: 'from-yellow-100 to-amber-100',
  Garnet: 'from-red-100 to-rose-100',
  Jasper: 'from-orange-100 to-amber-100',
  Obsidian: 'from-gray-100 to-slate-200',
  Opal: 'from-sky-100 to-cyan-100',
  Turquoise: 'from-teal-100 to-cyan-100',
  Quartz: 'from-gray-50 to-blue-50',
  'Petrified Wood': 'from-stone-100 to-amber-100',
  Tourmaline: 'from-pink-100 to-green-100',
  Topaz: 'from-blue-100 to-sky-100',
  Sapphire: 'from-blue-100 to-indigo-100',
  Ruby: 'from-red-100 to-rose-100',
  Emerald: 'from-emerald-100 to-green-100',
  'Rose Quartz': 'from-pink-100 to-rose-100',
  'Smoky Quartz': 'from-stone-100 to-gray-200',
  Fluorite: 'from-purple-100 to-green-100',
  Chalcedony: 'from-blue-50 to-indigo-100',
}

function gemSlug(name: string) {
  return name.toLowerCase().replace(/\s+/g, '-')
}

export default function GemTypesPage() {
  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'Home', url: SITE_URL },
        { name: 'Gem Types', url: `${SITE_URL}/gem-types` },
      ]} />

      {/* Hero */}
      <section className="bg-ruby-gradient py-14">
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
                <BreadcrumbPage className="text-white">Gem Types</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-3">
            Browse by Gem & Mineral Type
          </h1>
          <p className="text-white/75 text-lg max-w-2xl">
            Looking for a specific mineral? Find every rockhounding location where it&apos;s been reported across all 50 states.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {GEM_TYPES.map((gem) => (
            <Link
              key={gem}
              href={`/gem-types/${gemSlug(gem)}`}
              className="group border border-border rounded-xl overflow-hidden hover:border-ruby-300 hover:shadow-md transition-all bg-card"
            >
              <div className={`h-2 bg-gradient-to-r ${GEM_COLORS[gem] ?? 'from-ruby-100 to-amber-100'}`} />
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Gem className="w-4 h-4 text-ruby-400" />
                  <span className="font-heading font-semibold text-base text-foreground group-hover:text-primary transition-colors">
                    {gem}
                  </span>
                </div>
                {GEM_DESCRIPTIONS[gem] && (
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                    {GEM_DESCRIPTIONS[gem]}
                  </p>
                )}
                <div className="mt-3 text-xs text-primary font-medium flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  Find locations <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
