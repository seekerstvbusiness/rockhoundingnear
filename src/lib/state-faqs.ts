import type { FaqItem, Location } from './types'

export function generateStateFaqs(stateName: string, locations: Location[]): FaqItem[] {
  const total = locations.length
  if (total === 0) return []

  const gemCounts = new Map<string, number>()
  for (const loc of locations) {
    for (const gem of loc.gem_types ?? []) {
      gemCounts.set(gem, (gemCounts.get(gem) ?? 0) + 1)
    }
  }
  const topGems = [...gemCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([gem]) => gem)

  const featured = locations.filter((l) => l.featured).slice(0, 5)
  const topLocations = featured.length >= 3 ? featured : locations.slice(0, 5)
  const topLocationNames = topLocations.map((l) => l.name)

  const freeCount = locations.filter((l) => l.access_type === 'public' || l.primary_category === 'public_blm' || l.primary_category === 'national_forest').length
  const feeCount = locations.filter((l) => l.access_type === 'fee' || l.primary_category === 'fee_dig').length
  const permitCount = locations.filter((l) => l.permit_required === true).length
  const easyCount = locations.filter((l) => l.difficulty === 'easy').length
  const hardCount = locations.filter((l) => l.difficulty === 'hard' || l.difficulty === 'expert').length

  const seasonCounts = new Map<string, number>()
  for (const loc of locations) {
    if (loc.best_season) seasonCounts.set(loc.best_season, (seasonCounts.get(loc.best_season) ?? 0) + 1)
  }
  const topSeason = [...seasonCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'spring and fall'

  const faqs: FaqItem[] = [
    {
      question: `What are the best rockhounding sites in ${stateName}?`,
      answer: `${stateName} has ${total} verified rockhounding locations. Some of the most popular sites include ${topLocationNames.slice(0, 3).join(', ')}${topLocationNames.length > 3 ? `, and ${topLocationNames.length - 3} more` : ''}. Each site is documented with GPS coordinates, difficulty ratings, and gem type information so you can plan your trip with confidence.`,
    },
    {
      question: `What gems and minerals can you find rockhounding in ${stateName}?`,
      answer: topGems.length > 0
        ? `${stateName} is known for a wide variety of minerals. Rockhounders commonly find ${topGems.slice(0, 5).join(', ')}${topGems.length > 5 ? `, and ${topGems.slice(5).join(', ')}` : ''} across the state. The specific minerals available vary by location, so check each site listing before visiting.`
        : `${stateName} offers diverse rockhounding opportunities with minerals varying by region. Check individual site listings for specific gem types available at each location.`,
    },
    {
      question: `Are there free rockhounding sites in ${stateName}?`,
      answer: freeCount > 0
        ? `Yes, ${freeCount} of ${total} rockhounding sites in ${stateName} are on public land (BLM, National Forest, or state-managed land) and are free to visit. ${feeCount > 0 ? `There are also ${feeCount} fee-based dig sites, which typically provide tools, buckets, and guided access to concentrated mineral deposits.` : ''} Always verify current access status before visiting, as land management policies can change.`
        : `Most rockhounding sites in ${stateName} require a fee or permit. ${feeCount > 0 ? `There are ${feeCount} fee-dig sites that offer guided access with tools and equipment provided.` : ''} Check each site listing for current pricing and access requirements.`,
    },
    {
      question: `Do I need a permit to rockhound in ${stateName}?`,
      answer: permitCount > 0
        ? `Some sites in ${stateName} require permits. Specifically, ${permitCount} out of ${total} locations listed here have permit requirements. On most public BLM and National Forest land, casual rockhounding for personal use (typically up to 25 lbs per day) does not require a permit. Always check the specific rules for each site you plan to visit, especially on state parks and private land.`
        : `Most rockhounding sites in ${stateName} do not require permits for casual collecting. On BLM and National Forest land, personal-use collection (up to 25 lbs per day, non-commercial) is generally allowed without a permit. Always verify the rules for each specific location before collecting.`,
    },
    {
      question: `What is the best time of year to go rockhounding in ${stateName}?`,
      answer: `The most popular season for rockhounding in ${stateName} is ${topSeason}. ${easyCount > 0 ? `With ${easyCount} beginner-friendly sites available, ${stateName} is accessible year-round for those willing to plan around weather conditions.` : ''} Spring and fall generally offer the most comfortable temperatures for outdoor collecting. Avoid summer heat at desert locations and winter snow at high-elevation sites. Check the best season notes on each individual location listing for site-specific guidance.`,
    },
    {
      question: `What tools do I need for rockhounding in ${stateName}?`,
      answer: `Basic rockhounding gear for ${stateName} includes a rock hammer and chisel for extracting specimens, a hand lens (10x loupe) for field identification, sturdy gloves, safety glasses, a backpack or bucket, and a field guide to ${stateName} minerals. ${hardCount > 0 ? `For the ${hardCount} more technical sites, a digging bar and knee pads are also useful.` : ''} Always bring plenty of water, sun protection, and a first aid kit. For fee-dig sites, tools and buckets are usually provided.`,
    },
  ]

  return faqs
}
