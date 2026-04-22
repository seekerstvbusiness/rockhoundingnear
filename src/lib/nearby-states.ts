import { US_STATES } from './constants'

export const NEARBY_STATES: Record<string, string[]> = {
  'alabama': ['georgia', 'tennessee', 'mississippi', 'florida'],
  'alaska': ['washington', 'oregon', 'montana', 'idaho', 'wyoming', 'california'],
  'arizona': ['california', 'nevada', 'utah', 'colorado', 'new-mexico'],
  'arkansas': ['missouri', 'tennessee', 'mississippi', 'louisiana', 'texas', 'oklahoma'],
  'california': ['oregon', 'nevada', 'arizona'],
  'colorado': ['wyoming', 'utah', 'new-mexico', 'arizona', 'kansas', 'nebraska'],
  'connecticut': ['new-york', 'massachusetts', 'rhode-island'],
  'delaware': ['maryland', 'pennsylvania', 'new-jersey'],
  'florida': ['georgia', 'alabama'],
  'georgia': ['north-carolina', 'south-carolina', 'tennessee', 'alabama', 'florida'],
  'hawaii': ['california', 'oregon', 'washington', 'alaska', 'nevada', 'arizona'],
  'idaho': ['montana', 'wyoming', 'utah', 'nevada', 'oregon', 'washington'],
  'illinois': ['iowa', 'wisconsin', 'indiana', 'kentucky', 'missouri'],
  'indiana': ['michigan', 'ohio', 'kentucky', 'illinois'],
  'iowa': ['minnesota', 'wisconsin', 'illinois', 'missouri', 'nebraska', 'south-dakota'],
  'kansas': ['nebraska', 'colorado', 'oklahoma', 'missouri'],
  'kentucky': ['ohio', 'west-virginia', 'virginia', 'tennessee', 'illinois', 'indiana'],
  'louisiana': ['arkansas', 'mississippi', 'texas'],
  'maine': ['new-hampshire', 'vermont', 'massachusetts'],
  'maryland': ['pennsylvania', 'delaware', 'virginia', 'west-virginia'],
  'massachusetts': ['rhode-island', 'connecticut', 'new-york', 'vermont', 'new-hampshire'],
  'michigan': ['ohio', 'indiana', 'wisconsin'],
  'minnesota': ['north-dakota', 'south-dakota', 'iowa', 'wisconsin'],
  'mississippi': ['tennessee', 'alabama', 'arkansas', 'louisiana'],
  'missouri': ['iowa', 'illinois', 'kentucky', 'tennessee', 'arkansas', 'oklahoma', 'kansas', 'nebraska'],
  'montana': ['north-dakota', 'south-dakota', 'wyoming', 'idaho'],
  'nebraska': ['south-dakota', 'iowa', 'missouri', 'kansas', 'colorado', 'wyoming'],
  'nevada': ['oregon', 'idaho', 'utah', 'arizona', 'california'],
  'new-hampshire': ['vermont', 'maine', 'massachusetts'],
  'new-jersey': ['new-york', 'pennsylvania', 'delaware'],
  'new-mexico': ['colorado', 'oklahoma', 'texas', 'arizona', 'utah'],
  'new-york': ['pennsylvania', 'new-jersey', 'connecticut', 'massachusetts', 'vermont'],
  'north-carolina': ['virginia', 'tennessee', 'georgia', 'south-carolina'],
  'north-dakota': ['minnesota', 'south-dakota', 'montana'],
  'ohio': ['pennsylvania', 'west-virginia', 'kentucky', 'indiana', 'michigan'],
  'oklahoma': ['kansas', 'colorado', 'new-mexico', 'texas', 'arkansas', 'missouri'],
  'oregon': ['washington', 'idaho', 'nevada', 'california'],
  'pennsylvania': ['new-york', 'new-jersey', 'delaware', 'maryland', 'west-virginia', 'ohio'],
  'rhode-island': ['connecticut', 'massachusetts'],
  'south-carolina': ['north-carolina', 'georgia'],
  'south-dakota': ['north-dakota', 'minnesota', 'iowa', 'nebraska', 'wyoming', 'montana'],
  'tennessee': ['kentucky', 'virginia', 'north-carolina', 'georgia', 'alabama', 'mississippi', 'arkansas', 'missouri'],
  'texas': ['new-mexico', 'oklahoma', 'arkansas', 'louisiana'],
  'utah': ['idaho', 'wyoming', 'colorado', 'new-mexico', 'arizona', 'nevada'],
  'vermont': ['new-york', 'massachusetts', 'new-hampshire'],
  'virginia': ['maryland', 'west-virginia', 'kentucky', 'tennessee', 'north-carolina'],
  'washington': ['oregon', 'idaho'],
  'west-virginia': ['ohio', 'pennsylvania', 'maryland', 'virginia', 'kentucky'],
  'wisconsin': ['minnesota', 'iowa', 'illinois', 'michigan'],
  'wyoming': ['montana', 'south-dakota', 'nebraska', 'colorado', 'utah', 'idaho'],
}

export function getNearbyStates(stateSlug: string, count = 6): string[] {
  const neighbors = NEARBY_STATES[stateSlug] ?? []
  return neighbors.slice(0, count)
}

export function getNearbyStateInfo(stateSlug: string, count = 6) {
  const slugs = getNearbyStates(stateSlug, count)
  return slugs
    .map((slug) => US_STATES.find((s) => s.slug === slug))
    .filter(Boolean) as (typeof US_STATES)[number][]
}
