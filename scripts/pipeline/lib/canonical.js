// Canonical reference data for validation and enrichment

const US_STATES = [
  { name: 'Alabama', slug: 'alabama', abbreviation: 'AL' },
  { name: 'Alaska', slug: 'alaska', abbreviation: 'AK' },
  { name: 'Arizona', slug: 'arizona', abbreviation: 'AZ' },
  { name: 'Arkansas', slug: 'arkansas', abbreviation: 'AR' },
  { name: 'California', slug: 'california', abbreviation: 'CA' },
  { name: 'Colorado', slug: 'colorado', abbreviation: 'CO' },
  { name: 'Connecticut', slug: 'connecticut', abbreviation: 'CT' },
  { name: 'Delaware', slug: 'delaware', abbreviation: 'DE' },
  { name: 'Florida', slug: 'florida', abbreviation: 'FL' },
  { name: 'Georgia', slug: 'georgia', abbreviation: 'GA' },
  { name: 'Hawaii', slug: 'hawaii', abbreviation: 'HI' },
  { name: 'Idaho', slug: 'idaho', abbreviation: 'ID' },
  { name: 'Illinois', slug: 'illinois', abbreviation: 'IL' },
  { name: 'Indiana', slug: 'indiana', abbreviation: 'IN' },
  { name: 'Iowa', slug: 'iowa', abbreviation: 'IA' },
  { name: 'Kansas', slug: 'kansas', abbreviation: 'KS' },
  { name: 'Kentucky', slug: 'kentucky', abbreviation: 'KY' },
  { name: 'Louisiana', slug: 'louisiana', abbreviation: 'LA' },
  { name: 'Maine', slug: 'maine', abbreviation: 'ME' },
  { name: 'Maryland', slug: 'maryland', abbreviation: 'MD' },
  { name: 'Massachusetts', slug: 'massachusetts', abbreviation: 'MA' },
  { name: 'Michigan', slug: 'michigan', abbreviation: 'MI' },
  { name: 'Minnesota', slug: 'minnesota', abbreviation: 'MN' },
  { name: 'Mississippi', slug: 'mississippi', abbreviation: 'MS' },
  { name: 'Missouri', slug: 'missouri', abbreviation: 'MO' },
  { name: 'Montana', slug: 'montana', abbreviation: 'MT' },
  { name: 'Nebraska', slug: 'nebraska', abbreviation: 'NE' },
  { name: 'Nevada', slug: 'nevada', abbreviation: 'NV' },
  { name: 'New Hampshire', slug: 'new-hampshire', abbreviation: 'NH' },
  { name: 'New Jersey', slug: 'new-jersey', abbreviation: 'NJ' },
  { name: 'New Mexico', slug: 'new-mexico', abbreviation: 'NM' },
  { name: 'New York', slug: 'new-york', abbreviation: 'NY' },
  { name: 'North Carolina', slug: 'north-carolina', abbreviation: 'NC' },
  { name: 'North Dakota', slug: 'north-dakota', abbreviation: 'ND' },
  { name: 'Ohio', slug: 'ohio', abbreviation: 'OH' },
  { name: 'Oklahoma', slug: 'oklahoma', abbreviation: 'OK' },
  { name: 'Oregon', slug: 'oregon', abbreviation: 'OR' },
  { name: 'Pennsylvania', slug: 'pennsylvania', abbreviation: 'PA' },
  { name: 'Rhode Island', slug: 'rhode-island', abbreviation: 'RI' },
  { name: 'South Carolina', slug: 'south-carolina', abbreviation: 'SC' },
  { name: 'South Dakota', slug: 'south-dakota', abbreviation: 'SD' },
  { name: 'Tennessee', slug: 'tennessee', abbreviation: 'TN' },
  { name: 'Texas', slug: 'texas', abbreviation: 'TX' },
  { name: 'Utah', slug: 'utah', abbreviation: 'UT' },
  { name: 'Vermont', slug: 'vermont', abbreviation: 'VT' },
  { name: 'Virginia', slug: 'virginia', abbreviation: 'VA' },
  { name: 'Washington', slug: 'washington', abbreviation: 'WA' },
  { name: 'West Virginia', slug: 'west-virginia', abbreviation: 'WV' },
  { name: 'Wisconsin', slug: 'wisconsin', abbreviation: 'WI' },
  { name: 'Wyoming', slug: 'wyoming', abbreviation: 'WY' },
]

const STATE_BY_CODE = Object.fromEntries(US_STATES.map(s => [s.abbreviation, s]))
const STATE_BY_SLUG = Object.fromEntries(US_STATES.map(s => [s.slug, s]))

const GEM_TYPES = [
  'Agate', 'Amethyst', 'Beryl', 'Calcite', 'Chalcedony',
  'Chert', 'Chrysocolla', 'Citrine', 'Diamond', 'Emerald',
  'Feldspar', 'Fluorite', 'Garnet', 'Gold', 'Jade',
  'Jasper', 'Labradorite', 'Lapis Lazuli', 'Malachite', 'Mica',
  'Moonstone', 'Obsidian', 'Onyx', 'Opal', 'Peridot',
  'Petrified Wood', 'Quartz', 'Rose Quartz', 'Ruby', 'Sapphire',
  'Serpentine', 'Silver', 'Smoky Quartz', 'Sunstone', 'Tanzanite',
  'Tiger Eye', 'Topaz', 'Tourmaline', 'Turquoise', 'Zircon',
]

const HAZARDS = [
  'snakes', 'cliffs', 'abandoned_mines', 'heat', 'cold',
  'flash_floods', 'sharp_material', 'loose_rock', 'wildlife', 'remote',
]

const VAGUE_NAME_PATTERNS = [
  /^general area/i,
  /^county area/i,
  /general area \(/i,
  /^[a-z]+ county$/i,
  /^various sites/i,
  /^multiple locations/i,
  /^unspecified/i,
]

function isVagueName(name) {
  return VAGUE_NAME_PATTERNS.some(p => p.test(name.trim()))
}

function toSlug(str) {
  return str
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

module.exports = {
  US_STATES,
  STATE_BY_CODE,
  STATE_BY_SLUG,
  GEM_TYPES,
  HAZARDS,
  isVagueName,
  toSlug,
}
