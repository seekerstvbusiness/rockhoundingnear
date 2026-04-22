import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight, Gem } from 'lucide-react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { BreadcrumbSchema } from '@/components/seo/JsonLd'
import { GEM_TYPES, SITE_URL, SITE_NAME } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Browse Gems & Minerals',
  description: 'Find rockhounding locations by gem type. Search for agate, amethyst, gold, garnet, turquoise, and 35+ more minerals across the US.',
  alternates: { canonical: `${SITE_URL}/gem-types` },
}

const GEM_DESCRIPTIONS: Record<string, string> = {
  Agate: 'One of the most common and beloved finds. bands of chalcedony in every color.',
  Amethyst: 'Purple variety of quartz found in geodes and volcanic rock across the US.',
  Beryl: 'Mineral family that includes emerald, aquamarine, and morganite. found in pegmatites in Colorado, Connecticut, and North Carolina.',
  Calcite: 'Extremely common carbonate mineral forming rhombohedral crystals, massive deposits, and cave formations across limestone regions of the US.',
  Chalcedony: 'Microcrystalline quartz including agate, jasper, and chert. found in virtually every US state.',
  Chert: 'Dense microcrystalline silica used by Native Americans for arrowheads for thousands of years; found in sedimentary layers across the Great Plains.',
  Chrysocolla: 'Vivid teal-blue copper silicate often found alongside malachite and turquoise. major deposits in Arizona, New Mexico, and Nevada.',
  Citrine: 'Yellow to orange quartz named for its lemon color; natural specimens are rare and prized, found in pegmatites in North Carolina and California.',
  Diamond: 'Crater of Diamonds State Park in Arkansas is the only diamond-producing site in the world open to the public. visitors keep what they find.',
  Emerald: 'Green beryl; found in North Carolina\'s Hiddenite area. one of the few domestic emerald sources.',
  Feldspar: 'Most abundant mineral group in Earth\'s crust; gem varieties include moonstone and labradorite, found in granites and pegmatites nationwide.',
  Fluorite: 'Colorful cubic mineral in purples, greens, yellows. found in veins across Illinois, Kentucky, and the western states.',
  Garnet: 'Deep red crystals common in metamorphic rock; several varieties found in mountain states from Alaska to North Carolina.',
  Gold: 'Placer gold in riverbeds and lode deposits. still found in many western states including California, Oregon, and Montana.',
  Jade: 'Two distinct minerals. nephrite and jadeite. both prized for toughness and beauty; nephrite found in California\'s coast ranges and Wyoming.',
  Jasper: 'Opaque variety of chalcedony found in vivid reds, yellows, and greens. one of the most widespread collectibles in the American West.',
  Labradorite: 'Feldspar gem famous for its iridescent play of color that shifts from blue to gold. found in Oregon and parts of the Northeast.',
  'Lapis Lazuli': 'Deep blue metamorphic rock prized since ancient times; one of the few US sources is in Colorado\'s Ruby Mountains.',
  Malachite: 'Vivid green copper carbonate with distinctive swirling banded patterns. a hallmark of copper oxidation zones in Arizona and Nevada.',
  Mica: 'Sheet silicate that splits into thin reflective flakes; large "books" of muscovite mica are striking collectibles from South Dakota and North Carolina.',
  Moonstone: 'Feldspar gem with a blue-white inner glow that seems to float beneath the surface. found in pegmatites in Virginia and North Carolina.',
  Obsidian: 'Volcanic glass formed from rapid lava cooling. razor-sharp edges, glassy luster, and deposits across the Pacific Northwest.',
  Onyx: 'Banded chalcedony with parallel layers, typically black and white. found in arid regions of California, Arizona, and Nevada.',
  Opal: 'Fire opal, common opal, and precious opal found in western volcanic deposits in Nevada, Oregon, and Idaho.',
  Peridot: 'Vivid lime-green olivine gem found at the San Carlos Apache Reservation in Arizona. one of the world\'s major sources.',
  'Petrified Wood': 'Ancient trees replaced by silica over millions of years. spectacular specimens found in Arizona, Oregon, and Wyoming.',
  Quartz: 'The most abundant mineral on Earth. clear, rose, smoky, citrine, and amethyst varieties found in every US state.',
  'Rose Quartz': 'Pink quartz common in pegmatite deposits; major US sources in South Dakota\'s Black Hills and North Carolina.',
  Ruby: 'Red corundum. North Carolina\'s Cowee Valley is a famous US source with fee-dig mines open to collectors.',
  Sapphire: 'Blue corundum from Montana\'s Yogo Gulch and alluvial deposits. some of the finest sapphires in the world come from Montana.',
  Serpentine: 'Group of green metamorphic minerals, often mottled. the state rock of California, found throughout the Coast Ranges and in Oregon.',
  Silver: 'Native silver forms branching wire-like crystals in hydrothermal veins. prized specimens found in Nevada, Colorado, and Montana mine dumps.',
  'Smoky Quartz': 'Brownish-gray quartz from granite pegmatites. large crystals found in Colorado\'s Pike\'s Peak region and the Black Hills.',
  Sunstone: 'Oregon\'s state gem. a feldspar with a copper-schiller sparkle ranging from pale yellow to deep red, collectible on public lands near Plush.',
  Tanzanite: 'Deep blue-violet zoisite found only near Mount Kilimanjaro, Tanzania. not found in the US but prized by collectors worldwide.',
  'Tiger Eye': 'Chatoyant quartz with a golden silky luster from fibrous mineral replacement. the shimmering cat\'s-eye effect makes it instantly recognizable.',
  Topaz: 'Hard silicate mineral; blue topaz known from Utah\'s Thomas Range and the Guadalupe Mountains of Texas.',
  Tourmaline: 'Colorful crystals ranging from pink to green. gem-quality tourmaline found in Maine, California, and Connecticut pegmatites.',
  Turquoise: 'Sky-blue copper mineral prized for jewelry. major deposits in Arizona, Nevada, and New Mexico with a rich collecting tradition.',
  Zircon: 'One of Earth\'s oldest minerals. some crystals exceed 4 billion years old; gem-quality specimens found in Idaho, Colorado, and North Carolina.',
}

const GEM_COLORS: Record<string, string> = {
  Agate: 'from-orange-100 to-red-100',
  Amethyst: 'from-purple-100 to-violet-100',
  Beryl: 'from-cyan-100 to-blue-100',
  Calcite: 'from-gray-50 to-stone-100',
  Chalcedony: 'from-blue-50 to-indigo-100',
  Chert: 'from-stone-100 to-gray-200',
  Chrysocolla: 'from-teal-100 to-sky-100',
  Citrine: 'from-yellow-100 to-amber-100',
  Diamond: 'from-gray-50 to-blue-50',
  Emerald: 'from-emerald-100 to-green-100',
  Feldspar: 'from-gray-100 to-pink-50',
  Fluorite: 'from-purple-100 to-green-100',
  Garnet: 'from-red-100 to-rose-100',
  Gold: 'from-yellow-100 to-amber-100',
  Jade: 'from-green-100 to-emerald-100',
  Jasper: 'from-orange-100 to-amber-100',
  Labradorite: 'from-blue-100 to-teal-100',
  'Lapis Lazuli': 'from-blue-200 to-indigo-100',
  Malachite: 'from-green-100 to-teal-100',
  Mica: 'from-gray-50 to-yellow-50',
  Moonstone: 'from-blue-50 to-gray-50',
  Obsidian: 'from-gray-100 to-slate-200',
  Onyx: 'from-gray-200 to-slate-300',
  Opal: 'from-sky-100 to-cyan-100',
  Peridot: 'from-lime-100 to-green-100',
  'Petrified Wood': 'from-stone-100 to-amber-100',
  Quartz: 'from-gray-50 to-blue-50',
  'Rose Quartz': 'from-pink-100 to-rose-100',
  Ruby: 'from-red-100 to-rose-100',
  Sapphire: 'from-blue-100 to-indigo-100',
  Serpentine: 'from-green-50 to-stone-100',
  Silver: 'from-gray-100 to-slate-200',
  'Smoky Quartz': 'from-stone-100 to-gray-200',
  Sunstone: 'from-orange-100 to-amber-100',
  Tanzanite: 'from-violet-100 to-blue-100',
  'Tiger Eye': 'from-amber-100 to-yellow-100',
  Topaz: 'from-blue-100 to-sky-100',
  Tourmaline: 'from-pink-100 to-green-100',
  Turquoise: 'from-teal-100 to-cyan-100',
  Zircon: 'from-blue-50 to-indigo-50',
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
                <div className="mt-3 text-xs text-primary font-medium flex items-center gap-0.5">
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
