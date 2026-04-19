export const US_STATES = [
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

export const GEM_TYPES = [
  'Agate', 'Amethyst', 'Beryl', 'Calcite', 'Chalcedony',
  'Chert', 'Chrysocolla', 'Citrine', 'Diamond', 'Emerald',
  'Feldspar', 'Fluorite', 'Garnet', 'Gold', 'Jade',
  'Jasper', 'Labradorite', 'Lapis Lazuli', 'Malachite', 'Mica',
  'Moonstone', 'Obsidian', 'Onyx', 'Opal', 'Peridot',
  'Petrified Wood', 'Quartz', 'Rose Quartz', 'Ruby', 'Sapphire',
  'Serpentine', 'Silver', 'Smoky Quartz', 'Sunstone', 'Tanzanite',
  'Tiger Eye', 'Topaz', 'Tourmaline', 'Turquoise', 'Zircon',
]

export const DIFFICULTY_LABELS: Record<string, string> = {
  easy: 'Easy',
  moderate: 'Moderate',
  hard: 'Hard',
  expert: 'Expert Only',
}

export const ACCESS_LABELS: Record<string, string> = {
  public: 'Public Land',
  private: 'Private Land',
  fee: 'Fee to Enter',
  permit: 'Permit Required',
}

export const CATEGORY_LABELS: Record<string, string> = {
  public_blm: 'Public BLM Land',
  national_forest: 'National Forest',
  fee_dig: 'Fee Dig Site',
  private: 'Private Land',
  state_park: 'State Park',
  closed: 'Closed / No Collecting',
  other: 'Other',
}

export const CATEGORY_COLORS: Record<string, string> = {
  public_blm: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  national_forest: 'bg-green-100 text-green-800 border-green-200',
  fee_dig: 'bg-amber-100 text-amber-800 border-amber-200',
  private: 'bg-orange-100 text-orange-800 border-orange-200',
  state_park: 'bg-blue-100 text-blue-800 border-blue-200',
  closed: 'bg-red-100 text-red-800 border-red-200',
  other: 'bg-gray-100 text-gray-800 border-gray-200',
}

export const VEHICLE_LABELS: Record<string, string> = {
  passenger: 'Passenger Car',
  awd: 'AWD / SUV Recommended',
  '4x4': '4x4 Required',
  atv: 'ATV / OHV Only',
  hiking: 'Hiking Only (No Vehicle)',
}

export const CELL_LABELS: Record<string, string> = {
  none: 'No Cell Service',
  spotty: 'Spotty Service',
  reliable: 'Reliable Service',
}

export const HAZARD_LABELS: Record<string, string> = {
  snakes: 'Rattlesnakes',
  cliffs: 'Cliffs / Drop-offs',
  abandoned_mines: 'Abandoned Mine Shafts',
  heat: 'Extreme Heat',
  cold: 'Extreme Cold',
  flash_floods: 'Flash Flood Risk',
  sharp_material: 'Sharp Rock Material',
  loose_rock: 'Loose / Unstable Rock',
  wildlife: 'Wildlife (Bears, Mountain Lions)',
  remote: 'Very Remote — No Cell Service',
}

export const SITE_NAME = 'RockhoundingNear.com'
export const SITE_URL = 'https://www.rockhoundingnear.com'
export const SITE_DESCRIPTION =
  'Find the best rockhounding sites near you across all 50 US states. Discover locations for agates, fossils, crystals, gems, and minerals with maps, tips, and directions.'
