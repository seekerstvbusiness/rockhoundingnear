-- ============================================
-- RockhoundingNear.com — Rich Sample Data
-- Run AFTER migration-v2 and migration-v3
-- ============================================

-- ── Location 1: Apache Junction Superstition Mountains, AZ ──────────────────

UPDATE locations SET
  name              = 'Goldfield Ghost Town Mineral Area',
  slug              = 'goldfield-ghost-town-mineral-area',
  state             = 'Arizona',
  state_slug        = 'arizona',
  city              = 'Apache Junction',
  city_slug         = 'apache-junction',
  county            = 'Maricopa',
  county_slug       = 'maricopa',
  nearest_city      = 'Mesa',
  nearest_city_distance = 18,
  latitude          = 33.4656,
  longitude         = -111.4762,

  alternative_names = ARRAY['Superstition Foothills Dig', 'Goldfield Wash Area', 'Lost Dutchman Country'],

  cover_photo       = 'https://images.unsplash.com/photo-1518640467707-6686c9f038f8?auto=format&fit=crop&w=1400&q=85',
  images            = ARRAY[
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1551524164-687a55dd1126?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1569314039022-99fa4b17e7b4?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1605106702842-01a887a31122?auto=format&fit=crop&w=900&q=80'
  ],

  short_description = 'A legendary stretch of desert wash at the base of the Superstition Mountains where Apache Junction rockhounds have pulled gold quartz, chalcedony roses, and Apache tears from the gravel for generations.',

  description       = 'Nestled in the shadow of the Superstition Mountains east of Phoenix, the Goldfield Mineral Area sits along a network of dry washes and alluvial fans that have been slowly concentrating minerals for millions of years. The same volcanic and hydrothermal activity that built the Superstitions deposited a rich variety of collectible material throughout the surrounding desert.

This is a walk-in, find-it-yourself experience. There are no guides, no markers, and no guarantees — which is exactly why rockhounds keep coming back. The thrill of spotting a chalcedony rose half-buried in grit, or the glint of an Apache tear catching the desert sun, is something a fee dig simply cannot replicate.

The washes are most productive after summer monsoon rains, which churn up new material from deeper in the alluvial fans. Winter and early spring are the most comfortable seasons for hunting. Midsummer temperatures regularly exceed 110°F — this is not a summer destination.',

  history           = 'The Superstition Mountains have drawn treasure seekers since the 1840s, most famously in pursuit of the legendary Lost Dutchman''s Gold Mine. But long before Jacob Waltz''s alleged bonanza, the Salado people and later the Apache knew this volcanic range as a source of flint, chalcedony, and other toolmaking materials.

The Goldfield townsite itself boomed briefly in the 1890s when gold-bearing quartz veins were discovered on the eastern flank of the Superstitions. The town had a population of 4,000 at its peak before the ore played out by 1898. Rockhounds today still occasionally find float material in the wash system that drains the old mining district — not gold nuggets, but quartz specimens and occasionally gossanite from the oxidized ore zone.

The area was heavily prospected again during the 1930s Depression when desperate families combed the washes for anything saleable. Their campfire rings are still visible in the boulder fields.',

  gem_types         = ARRAY['Apache Tears', 'Chalcedony', 'Quartz', 'Jasper', 'Obsidian', 'Gold Quartz', 'Chrysocolla', 'Malachite'],

  difficulty        = 'moderate',
  access_type       = 'public',
  primary_category  = 'public_blm',

  collection_rules  = 'This area falls under BLM casual use rules. Collection of rocks, minerals, and invertebrate fossils for personal, non-commercial use is permitted without a permit. Removing vertebrate fossils, cultural artifacts, or anything from within designated wilderness areas is illegal.',
  quantity_limits   = 'BLM personal use limit: 25 lbs per day, maximum 250 lbs per year. No motorized equipment. Hand tools only (rock hammers, chisels, buckets). No digging deeper than 12 inches.',
  permit_required   = false,
  commercial_use_allowed = false,

  fee_amount        = 0,
  best_season       = 'October – April',

  written_directions = 'From Phoenix: Take US-60 east to Idaho Road in Apache Junction. Turn left (north) on Idaho Road and drive 4.2 miles. Turn right on N. Goldfield Road. Continue 1.1 miles past the Goldfield Ghost Town attraction entrance. Park at the unsigned pullout on the right side of the road near the wash crossing. The productive wash system begins immediately east of the road and extends 0.5 miles toward the mountain base.',

  directions        = 'GPS: 33.4656, -111.4762. The unsigned parking area fits 4–6 vehicles. From the pullout, walk east into the wash. Follow the gravel downstream (south) for the most concentrated material, or hike upstream toward the Superstition foothills for larger quartz specimens.',

  vehicle_required  = 'passenger',
  road_conditions   = 'Paved road to parking area. The wash crossing on Goldfield Road is concrete-lined and passable for passenger cars except during active flash flood events. Do not attempt the wash crossing when water is flowing.',
  parking_notes     = 'Small unsigned gravel pullout on the east side of Goldfield Road, just past the wash crossing. No facilities. No fee. Space for 4–6 vehicles. Arrive early on weekends — this spot is known to local rockhounds.',
  terrain_notes     = 'Flat to gently sloping desert wash. Loose gravel, occasional boulders. Some areas require scrambling over small ledges (1–3 feet). Not wheelchair accessible. Watch footing on loose cobbles.',

  beginner_friendly = true,
  family_friendly   = true,
  kid_age_range     = '7+',
  accessibility_notes = 'Not wheelchair accessible. Uneven terrain throughout. The wash entrance from the parking area is flat and suitable for young children with supervision.',
  dog_friendly      = true,

  hazards           = ARRAY['snakes', 'heat', 'flash_floods', 'sharp_material'],
  cell_service      = 'spotty',
  nearest_services  = 'Apache Junction (4 miles): gas, grocery, restaurants. Goldfield Ghost Town (0.3 miles): restrooms, water, snack bar. Nearest hospital: Banner Gateway Medical Center, Gilbert (22 miles).',
  remoteness_rating = 2,

  tips              = 'The best material concentrates on the inside bends of the wash curves — look for darker pockets of heavy gravel. Apache tears (obsidian nodules) are easiest to spot when the morning light catches their translucent edges. Bring a spray bottle of water — chalcedony that looks dull dry reveals its true color when wet. A garden trowel or stiff brush is more useful than a rock hammer at this site. Pack 3x the water you think you need. The desert sun is deceptive even in winter.',

  faq               = '[
    {
      "question": "What is the best thing to find at Goldfield Mineral Area?",
      "answer": "Apache tears (small obsidian nodules) are the most reliable find — the black volcanic glass is scattered throughout the wash gravel. Chalcedony roses and botryoidal chalcedony are rarer but highly rewarding. After monsoon season (August–September), freshly washed quartz specimens sometimes appear in the upper wash."
    },
    {
      "question": "Is collecting allowed in the Superstition Wilderness?",
      "answer": "No. The Superstition Wilderness boundary begins at the mountain base. Collection of any natural materials is prohibited inside wilderness areas. The productive wash area described here is on BLM land outside the wilderness boundary. Stay east of the Goldfield Road corridor and below the mountain base to remain on BLM land."
    },
    {
      "question": "Can I bring my kids?",
      "answer": "Yes, with supervision. The lower wash is flat and suitable for children aged 7 and up. Bring plenty of water and snacks — there are no facilities at the site. Teach children to watch where they step and not reach into crevices or under rocks (rattlesnakes). The Goldfield Ghost Town, 0.3 miles south, has restrooms and a water fountain."
    },
    {
      "question": "When should I avoid visiting?",
      "answer": "June through early September. Daytime temperatures regularly exceed 110°F and the site has zero shade. Flash flood risk is highest during July–September monsoon season — never enter the wash if storms are visible anywhere on the horizon, even if the sky above you is clear. Water can arrive with no warning from storms miles away."
    },
    {
      "question": "Do I need any special tools?",
      "answer": "No power tools or motorized equipment. A rock hammer, cold chisel, garden trowel, and a few buckets or cloth bags are all you need. A spray bottle of water helps identify material. A hand lens or loupe (10x) is great for examining small pieces on the spot."
    }
  ]'::jsonb,

  meta_title        = 'Goldfield Ghost Town Mineral Area — Rockhounding near Apache Junction, AZ',
  meta_description  = 'Hunt Apache tears, chalcedony, and quartz on public BLM land in the shadow of Arizona''s Superstition Mountains. Free access, no permit needed. GPS, directions, and rockhounding tips.',
  published         = true,
  featured          = true

WHERE slug = 'petrified-wood-park';


-- ── Location 2: Central Point / Jackson County, Oregon ──────────────────────

UPDATE locations SET
  name              = 'Dust Devil Mining — Thunderegg Fee Dig',
  slug              = 'dust-devil-mining-thunderegg-fee-dig',
  state             = 'Oregon',
  state_slug        = 'oregon',
  city              = 'Medford',
  city_slug         = 'medford',
  county            = 'Jackson',
  county_slug       = 'jackson',
  nearest_city      = 'Medford',
  nearest_city_distance = 12,
  latitude          = 42.3381,
  longitude         = -122.8755,

  alternative_names = ARRAY['Dust Devil Dig', 'Jackson County Thunderegg Site', 'Agate Flat Dig'],

  cover_photo       = 'https://images.unsplash.com/photo-1605106702842-01a887a31122?auto=format&fit=crop&w=1400&q=85',
  images            = ARRAY[
    'https://images.unsplash.com/photo-1569314039022-99fa4b17e7b4?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1551524164-687a55dd1126?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1518640467707-6686c9f038f8?auto=format&fit=crop&w=900&q=80'
  ],

  short_description = 'One of southern Oregon''s best-kept secrets: a working fee dig where you crack open thundereggs yourself and find agate, jasper, and opalite cores. Family-run, tools provided, all finds yours to keep.',

  description       = 'Southern Oregon''s Rogue Valley sits atop ancient rhyolitic lava flows that are among the most thunderegg-productive geology on the planet. Dust Devil Mining operates a working dig on a private claim that has produced thundereggs for over 30 years, and the seam shows no signs of slowing down.

Unlike display-only mineral shows, this is hands-on. You dig your own thundereggs from the rhyolite matrix, carry them out, and crack them open on-site. Some are hollow with sparkling agate or chalcedony crystal centers. Others are solid jasper or multicolored banded agate. Occasionally a specimen comes out with translucent green or blue opalite — the prized find that keeps diggers coming back.

The host keeps the active dig face freshly exposed with a small excavator, and staff walk new visitors through technique before you start. It''s genuinely approachable for complete beginners — half the visitors on any given weekend have never held a rock hammer.',

  history           = 'The thunderegg deposits of Jackson County have been known since at least the 1930s, when a wave of amateur mineralogists first began systematically working the rhyolite outcrops of the Rogue Valley. Oregon officially designated the thunderegg as its state rock in 1965, a nod to the extraordinary concentrations found in the region.

The specific claim now operated as Dust Devil Mining was first staked in the 1960s by a Medford schoolteacher who sold specimens to rock shops across the Pacific Northwest. The current family purchased the claim in 1989 and opened it to fee diggers in 1992. They have since produced specimens that have appeared in mineral shows from Quartzsite, Arizona to Denver, Colorado.

The name "thunderegg" comes from a Native American legend that the gods dwelling on Mount Hood and Mount Jefferson threw eggs at each other during thunderstorms. When the eggs landed, they cracked open to reveal the beautiful agate interiors.',

  gem_types         = ARRAY['Thunderegg', 'Agate', 'Jasper', 'Chalcedony', 'Opalite', 'Obsidian'],

  difficulty        = 'easy',
  access_type       = 'fee',
  primary_category  = 'fee_dig',

  collection_rules  = 'All material collected at the dig site is yours to keep — no limits on quantity for personal, non-commercial use. Splitting and cutting services available on-site for an additional fee. No collecting outside the designated dig area. Staff must be present when digging.',
  quantity_limits   = 'No weight limit for personal collecting. Commercial resellers please contact the operator in advance for commercial rates.',
  permit_required   = false,
  commercial_use_allowed = true,
  fee_amount        = 18,

  best_season       = 'April – November (open by appointment December–March)',

  written_directions = 'From Interstate 5 in Medford: Take Exit 27 (Central Point / Medford). Head east on East Pine Street for 3.8 miles. Turn right on Table Rock Road. Continue 6.2 miles south. Turn left on Agate Flat Road (unpaved, brown sign for "Dust Devil Mining"). Follow the dirt road 0.8 miles to the staging area. Check in at the white barn on the right.',

  directions        = 'GPS: 42.3381, -122.8755. From the staging area, staff will escort you to the active dig face (a short 200-yard walk). All necessary tools are provided at the staging area.',

  vehicle_required  = 'passenger',
  road_conditions   = 'Paved to Agate Flat Road. Last 0.8 miles is well-graded gravel — passable in any vehicle in dry conditions. After heavy rain, a high-clearance vehicle is recommended for the last stretch.',
  parking_notes     = 'Large gravel parking area at the staging barn — easily fits 30+ vehicles. Handicapped-accessible parking near the barn. Shaded picnic area adjacent to parking.',
  terrain_notes     = 'Flat to gently sloping excavated dig face. Loose rhyolite matrix — wear closed-toe shoes. Kneeling pads or a small camp stool are useful for extended digging sessions. The dig floor is kept reasonably smooth by the operator.',

  beginner_friendly = true,
  family_friendly   = true,
  kid_age_range     = '5+',
  accessibility_notes = 'The staging area and picnic tables are wheelchair accessible. The dig face is a 200-yard walk on packed gravel — manageable for most mobility levels. Contact the operator in advance if you need additional accommodation.',
  dog_friendly      = true,

  hazards           = ARRAY['sharp_material'],
  cell_service      = 'spotty',
  nearest_services  = 'Central Point (8 miles): gas, grocery, restaurants. Medford (12 miles): full services, hospital, Walmart. Water and restrooms available at the dig site staging area.',
  remoteness_rating = 2,

  tips              = 'The freshest material is always nearest the excavated face — ask staff where yesterday''s machine work ended. Thundereggs feel heavier than surrounding rhyolite once you learn the weight difference. If a thunderegg rattles when you shake it, it has an agate interior. Use the flat-faced hammer (not the pick end) to crack thundereggs — one firm strike on the equator is better than many light taps. Wet specimens reveal their true colors: bring a water bottle just to preview your finds before packing them. Arrive early — the dig can fill up on summer weekends.',

  faq               = '[
    {
      "question": "What is a thunderegg and how do I know if mine is good?",
      "answer": "A thunderegg is a roughly spherical nodule of rhyolite that grew around a gas bubble in ancient volcanic lava. Inside, silica-rich fluids crystallized over millions of years into agate, chalcedony, opalite, or crystal quartz. A good one feels noticeably heavier than surrounding rock and may rattle slightly when shaken (indicating an agate-lined hollow). The only way to really know what''s inside is to crack it open — which is half the fun."
    },
    {
      "question": "What''s the entry fee and what does it include?",
      "answer": "The fee is $18 per adult digger, $8 for children 5–12, and free for children under 5. The fee includes site access, all digging tools (hammers, chisels, pry bars), expert guidance, on-site cracking, and all the material you find. Bring a sturdy bag or box for transporting your specimens home."
    },
    {
      "question": "How many thundereggs can I realistically expect to find?",
      "answer": "Most diggers find 5–15 thundereggs in a 2–3 hour session. Experienced diggers who know how to read the matrix can find considerably more. Size varies from golf ball to cantaloupe, with most finds in the softball range. Not every thunderegg has a spectacular interior — roughly 1 in 4 is a keeper, which is why finding many is the strategy."
    },
    {
      "question": "Is this suitable for young children?",
      "answer": "Yes — the site is one of the most family-friendly digs in Oregon. Children as young as 5 enjoy the experience with parental supervision. The terrain is safe and the tools are manageable. The real fun for kids is cracking open a thunderegg and discovering what''s inside. Picnic tables, shade, and restrooms are available at the staging area."
    },
    {
      "question": "Can I cut and polish the thundereggs I find?",
      "answer": "Yes. The operator has a small lapidary shop on-site where specimens can be slabbed (cut in half) for an additional fee of $3–$5 per piece, depending on size. This reveals the interior pattern before you transport them home. If you have your own lapidary equipment, thundereggs respond beautifully to standard slab saws and trim saws."
    }
  ]'::jsonb,

  meta_title        = 'Dust Devil Mining Thunderegg Dig — Rockhounding near Medford, Oregon',
  meta_description  = 'Crack open your own thundereggs at this family-run fee dig in Jackson County, Oregon. Agate, jasper, and opalite cores. $18/adult, tools included. GPS, directions, and tips.',
  published         = true,
  featured          = true

WHERE slug = 'crater-rock-museum-area';
