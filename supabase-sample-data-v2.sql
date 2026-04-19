-- ============================================================
-- Sample Data v2: 10 additional locations across AZ, OR, MT, NC, AR
-- All text uses plain ASCII - trigger will handle any future imports
-- ============================================================

INSERT INTO locations (
  name, slug, state, state_slug, city, city_slug, county, county_slug,
  nearest_city, nearest_city_distance,
  alternative_names, short_description, description, history,
  latitude, longitude,
  gem_types, difficulty, access_type, primary_category,
  collection_rules, quantity_limits, permit_required, commercial_use_allowed,
  fee_amount, best_season, cover_photo, images,
  vehicle_required, road_conditions, parking_notes, terrain_notes,
  written_directions, directions, tips, rules,
  beginner_friendly, family_friendly, dog_friendly,
  cell_service, hazards, nearest_services,
  remoteness_rating, faq,
  meta_title, meta_description,
  featured, published
) VALUES

-- ── ARIZONA 1 ──────────────────────────────────────────────
(
  'Vulture Mine Quartz District',
  'vulture-mine-quartz-district',
  'Arizona', 'arizona',
  'Wickenburg', 'wickenburg',
  'Maricopa', 'maricopa',
  'Wickenburg', 3,
  ARRAY['Vulture Mountains Rockhounding', 'Wickenburg Quartz Fields'],
  'Desert quartz fields surrounding the historic Vulture Mine yield gold-bearing quartz specimens, druzy clusters, and occasional chrysocolla in the copper-stained zones.',
  'The Vulture Mine area west of Wickenburg sits in a classic Basin and Range landscape where hydrothermal veins cut through Precambrian granite and schist. The same geological forces that made this one of Arizona''s richest 19th-century gold mines left behind an extensive field of quartz float scattered across the desert pavement.

Rockhounds work the alluvial fans and dry washes surrounding the old mine workings. Gold-bearing quartz is the headline find, but chrysocolla, malachite staining, and occasional turquoise in the copper zones make for a varied hunt. The rocky terrain is moderate - no technical skills needed but sturdy boots are essential.',
  'Henry Wickenburg discovered gold here in 1863, founding what became Arizona Territory''s most productive mine. The Vulture Mine produced over 340,000 ounces of gold before it closed. Today the mine property is a historic site, but the surrounding BLM land remains open to casual rockhounding.',
  33.8734, -112.8901,
  ARRAY['Quartz', 'Gold Quartz', 'Chrysocolla', 'Malachite', 'Turquoise', 'Jasper'],
  'moderate', 'public', 'public_blm',
  'BLM casual use rules apply. Personal use collection of rocks and minerals permitted without a permit. Do not enter the private Vulture Mine historic site property - stay on BLM land.',
  '25 lbs per day, 250 lbs per year personal use limit. Hand tools only.',
  false, false,
  0, 'October - April',
  'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1400&q=85',
  ARRAY[
    'https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1518623489648-a173ef7824f3?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=900&q=80'
  ],
  'passenger', 'Paved to trailhead, some sandy two-track to collecting areas', 'Roadside pullouts and a small gravel lot at the historic site entrance',
  'Open desert pavement and rocky washes. Cacti and loose gravel underfoot. Mostly flat with gentle slopes.',
  'From Wickenburg, take US-60 west 2 miles to Vulture Mine Road. Turn left (south) and drive 12 miles on paved road. BLM collecting areas begin on both sides of the road before reaching the private mine entrance.',
  'GPS: 33.8734, -112.8901. 14 miles southwest of Wickenburg on Vulture Mine Road.',
  'Hunt the dry washes after summer monsoons for freshly exposed material. Look for iron-stained zones where chrysocolla and malachite indicate copper mineralization nearby. Early morning light makes the quartz sparkle and is easier on the eyes. Bring more water than you think you need.',
  'Stay on BLM land. Do not cross fences into the private mine property. Pack out all trash.',
  true, true, true,
  'spotty', ARRAY['heat', 'snakes'], 'Wickenburg: gas, food, lodging, hospital (3 miles)',
  3,
  '[{"question":"Can I find actual gold here?","answer":"Gold-bearing quartz specimens are found occasionally, but do not expect nuggets or visible free gold. Most finds are quartz with minor gold inclusions visible under magnification."},{"question":"Is the Vulture Mine itself open to visit?","answer":"The historic mine site charges a small entry fee for tours. The surrounding BLM land where rockhounding happens is free and separate from the mine property."},{"question":"What tools should I bring?","answer":"Rock hammer, chisels, sturdy gloves, buckets, and safety glasses. A hand lens (loupe) is useful for spotting mineralization."}]',
  'Vulture Mine Quartz District - Rockhounding near Wickenburg, AZ',
  'Find gold-bearing quartz, chrysocolla, and malachite at the Vulture Mine BLM area near Wickenburg, Arizona. Free public access with GPS coordinates and directions.',
  false, true
),

-- ── ARIZONA 2 ──────────────────────────────────────────────
(
  'Kofa National Wildlife Refuge Gem Collecting',
  'kofa-nwr-gem-collecting',
  'Arizona', 'arizona',
  'Yuma', 'yuma',
  'La Paz', 'la-paz',
  'Yuma', 55,
  ARRAY['Kofa Mountains Rockhounding', 'King of Arizona Mine Area'],
  'Remote desert mountains south of Quartzsite where palm canyon draws hikers and rockhounds come for jasper, chalcedony, and rare palm root petrified wood in the bajadas.',
  'The Kofa Mountains rise sharply from the Sonoran Desert between Yuma and Quartzsite, sheltering one of Arizona''s most remote and rewarding rockhounding landscapes. The alluvial fans and rocky bajadas surrounding the range hold a variety of collectable material - banded rhyolite, nodular chalcedony, red and yellow jasper, and occasionally pieces of palm root petrified wood from ancient tropical forests that once covered this region.

The refuge is managed for wildlife, not rockhounding, but casual personal collection is permitted in most areas. Plan for a full-day adventure - distances are significant and cell service is essentially nonexistent.',
  'The Kofa Mountains took their name from the King of Arizona Mine, a late 19th-century gold operation in the range. The area was designated a Wildlife Refuge in 1939, primarily to protect the desert bighorn sheep population. The landscape has changed little since prospectors worked these mountains over a century ago.',
  33.3456, -114.0123,
  ARRAY['Jasper', 'Chalcedony', 'Rhyolite', 'Petrified Wood', 'Agate'],
  'hard', 'public', 'national_forest',
  'Casual personal use collection permitted. No collection within designated wilderness areas. No motorized vehicles off established roads.',
  '25 lbs per day personal use. No commercial collection.',
  false, false,
  0, 'November - March',
  'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1400&q=85',
  ARRAY[
    'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=900&q=80'
  ],
  '4x4', 'Paved highway to refuge boundary, then dirt roads requiring high clearance. Some routes 4x4 only.',
  'Dispersed camping and pullouts throughout the refuge. No developed parking.',
  'Rocky bajada slopes and desert washes. Very remote. Navigation skills essential.',
  'From Yuma, take US-95 north approximately 55 miles to the Kofa National Wildlife Refuge signs. Turn east onto King Valley Road (dirt). Collecting areas begin immediately within the refuge boundary.',
  'GPS: 33.3456, -114.0123. 55 miles north of Yuma via US-95.',
  'This is a remote destination - bring a full-size spare, extra fuel, and at least a gallon of water per person per day. A paper map or downloaded GPS maps are essential since cell service is nonexistent. Hunt the rocky washes and bajada slopes rather than climbing the mountains themselves.',
  'Respect wildlife closures. Stay on established roads. No campfires during dry periods.',
  false, false, false,
  'none', ARRAY['heat', 'remote', 'snakes', 'wildlife'], 'Quartzsite: gas, food (30 miles north). Yuma: full services (55 miles south).',
  8,
  '[{"question":"Do I need a permit to enter the Kofa NWR?","answer":"No permit is required for day use or dispersed camping. Personal rockhounding is allowed without a permit."},{"question":"What is the best time of year to visit?","answer":"November through March. Summer temperatures routinely exceed 115 degrees F and the area is genuinely dangerous in summer without extensive preparation."},{"question":"Can I camp here?","answer":"Yes, dispersed camping is allowed throughout most of the refuge on existing roads. No developed campgrounds or facilities exist."}]',
  'Kofa NWR Rockhounding - Jasper and Chalcedony near Yuma Arizona',
  'Remote rockhounding in the Kofa National Wildlife Refuge near Yuma, AZ. Find jasper, chalcedony, and petrified wood in stunning desert mountain terrain.',
  false, true
),

-- ── ARIZONA 3 ──────────────────────────────────────────────
(
  'Agua Fria River Agate Beds',
  'agua-fria-river-agate-beds',
  'Arizona', 'arizona',
  'Mayer', 'mayer',
  'Yavapai', 'yavapai',
  'Phoenix', 65,
  ARRAY['Agua Fria Agate', 'Mayer Agate Beds', 'Black Canyon City Agates'],
  'The Agua Fria River corridor north of Phoenix is a classic Arizona agate locality producing banded red-orange agate nodules, chalcedony, and occasional petrified wood from Tertiary lake deposits.',
  'The Agua Fria River cuts through a sequence of Tertiary lake beds and volcanic deposits north of Phoenix, creating one of central Arizona''s most accessible agate collecting sites. The river gravels and eroded badlands above the canyon walls both yield banded agate nodules in shades of red, orange, cream, and gray - classic Arizona material that takes a beautiful polish.

The area is spread over several miles of BLM land and the collecting is genuinely good. Nodules range from marble-sized to baseball-sized, with occasional large pieces. The terrain is accessible to most visitors - the riverbanks require only easy walking.',
  'The Agua Fria corridor was a significant travel route for prehistoric peoples moving between the Salt River Valley and the Colorado Plateau. Rockhounds have worked the agate beds here since at least the 1950s, when the area appeared in early rockhounding guidebooks.',
  34.0234, -112.2345,
  ARRAY['Agate', 'Chalcedony', 'Jasper', 'Petrified Wood', 'Quartz'],
  'easy', 'public', 'public_blm',
  'BLM casual use collection. Personal use only. Hand tools only - no motorized equipment.',
  '25 lbs per day, 250 lbs per year.',
  false, false,
  0, 'October - May',
  'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1400&q=85',
  ARRAY[
    'https://images.unsplash.com/photo-1439405326854-014607f694d7?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=900&q=80'
  ],
  'passenger', 'Paved to Black Canyon City, then well-maintained dirt road to river access', 'Small gravel pullouts along the access road. No formal parking area.',
  'River gravel bars and eroded badland slopes. Easy walking on the gravel bars, moderate scrambling on the slopes above.',
  'From Phoenix, take I-17 north to Exit 256 (Mayer/Humboldt). Head east on Antelope Creek Road approximately 8 miles to BLM land along the Agua Fria. Collecting is along the river and in the eroded banks above.',
  'GPS: 34.0234, -112.2345. About 65 miles north of Phoenix via I-17.',
  'Walk the gravel bars first - the river does the work of sorting material and nodules concentrate in the gravels. Then work the eroded slopes above the banks where nodules weather out of the matrix. Bring a bucket and gloves. After rain the freshly exposed material is easiest to spot.',
  'The river can flash flood with little warning during monsoon season (July-September). Do not collect in or near the river channel during storms.',
  true, true, true,
  'spotty', ARRAY['flash_floods', 'snakes', 'heat'], 'Black Canyon City: gas and food (15 miles). Mayer: gas (8 miles).',
  4,
  '[{"question":"What does Agua Fria agate look like?","answer":"Typically banded in shades of red, orange, cream, and gray. Nodular form, ranging from marble to baseball sized. The banding is often tight and intricate."},{"question":"Is the river safe to cross?","answer":"In dry months the river is usually ankle deep or dry. During monsoon season (July-September) do not attempt to cross - flash floods can appear with very little warning."},{"question":"Can I bring kids?","answer":"Yes, the gravel bars are easy walking and kids enjoy searching for nodules. Keep them away from steep eroded banks."}]',
  'Agua Fria River Agate Beds - Free Rockhounding near Phoenix AZ',
  'Find banded agate nodules and chalcedony along the Agua Fria River north of Phoenix. Free BLM access, beginner friendly, great for families.',
  false, true
),

-- ── OREGON 1 ──────────────────────────────────────────────
(
  'Glass Buttes Obsidian Fields',
  'glass-buttes-obsidian-fields',
  'Oregon', 'oregon',
  'Brothers', 'brothers',
  'Lake', 'lake',
  'Bend', 75,
  ARRAY['Glass Butte Obsidian', 'Hampton Butte Obsidian', 'High Desert Glass'],
  'Glass Buttes is one of the world''s most significant obsidian localities - a volcanic mountain in central Oregon''s high desert where the ground glitters with black, mahogany, rainbow, and rare gold-sheen obsidian.',
  'Rising from Oregon''s high desert about 75 miles southeast of Bend, Glass Buttes is simply one of the best rockhounding destinations in North America. The buttes are essentially made of obsidian - volcanic glass formed when lava cooled rapidly without crystallizing. The variety here is exceptional: jet black, mahogany banded, rainbow iridescent, and the extremely rare gold-sheen obsidian that commands serious collector attention.

The BLM designates this as a free collecting area with generous limits. You can fill a five-gallon bucket with exceptional material in a few hours. The landscape is stark high desert beauty - juniper scrub, rimrock, and big sky. The drive on Highway 20 is itself a pleasure.',
  'Obsidian from Glass Buttes has been found in archaeological sites throughout the Pacific Northwest and as far away as California and Alberta, evidence that Indigenous peoples traded this material widely for thousands of years. The buttes were a known geological landmark since early Euro-American settlement of Oregon.',
  43.5678, -120.1234,
  ARRAY['Obsidian', 'Mahogany Obsidian', 'Rainbow Obsidian', 'Gold Sheen Obsidian'],
  'easy', 'public', 'public_blm',
  'BLM free collecting area. Personal use collection allowed without permit. The BLM specifically encourages rockhounding here.',
  '250 lbs per day limit for this designated collecting site (higher than standard BLM limit).',
  false, false,
  0, 'May - October',
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1400&q=85',
  ARRAY[
    'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1482192505345-5852310f208f?auto=format&fit=crop&w=900&q=80'
  ],
  'passenger', 'Paved highway to pullout, short easy dirt tracks to collecting areas', 'Large gravel pullouts along Hwy 20. Easy parking for trucks with trailers.',
  'Gentle volcanic slopes covered with obsidian fragments and larger pieces. Easy walking. Volcanic glass edges are razor sharp - sturdy boots essential.',
  'From Bend, take US-20 east approximately 75 miles. Glass Buttes are visible on the right (south) side of the highway. Turn south onto a BLM dirt road at the Glass Buttes sign. Collecting begins immediately.',
  'GPS: 43.5678, -120.1234. 75 miles east of Bend on US-20.',
  'The obsidian is literally underfoot everywhere - you do not need to dig. Walk the slopes looking for color variation: mahogany banding is most common, but hold pieces up to the sun to check for rainbow iridescence. Gold-sheen pieces are rarer and found mainly on the higher slopes. Wear thick-soled boots - obsidian edges cut leather. Bring leather gloves.',
  'Obsidian edges are extremely sharp. Handle all pieces carefully. Do not collect within any marked archaeological protection areas.',
  true, true, false,
  'none', ARRAY['sharp_material', 'remote'], 'Brothers: basic supplies (5 miles). Bend: full services (75 miles west).',
  5,
  '[{"question":"Is obsidian dangerous to handle?","answer":"The edges of fresh obsidian are sharper than surgical steel. Always handle with gloves and never carry loose pieces in a bag you will reach into without looking. Broken pieces are safe once edges are protected."},{"question":"What makes rainbow obsidian different?","answer":"Rainbow obsidian contains layers of magnetite nanoparticles that diffract light, producing iridescent colors - purple, green, and gold - when viewed at an angle in sunlight. It looks black indoors."},{"question":"Can I take a large amount?","answer":"The BLM allows up to 250 lbs per day at this designated collecting site, which is much more generous than standard BLM rules. Bring sturdy containers."}]',
  'Glass Buttes Obsidian - World Class Rockhounding near Bend Oregon',
  'Collect rainbow, mahogany, and gold-sheen obsidian at Glass Buttes, one of North America best free rockhounding sites. 75 miles east of Bend, Oregon.',
  true, true
),

-- ── OREGON 2 ──────────────────────────────────────────────
(
  'Succor Creek Canyon Agate and Thunderegg Site',
  'succor-creek-canyon-agate-thunderegg',
  'Oregon', 'oregon',
  'Vale', 'vale',
  'Malheur', 'malheur',
  'Ontario', 30,
  ARRAY['Succor Creek Thundereggs', 'Leslie Gulch Agates', 'Owyhee Canyon Rockhounding'],
  'Succor Creek State Natural Area in eastern Oregon''s canyon country offers excellent collecting of agate, jasper, and thundereggs from the canyon walls and gravels of a spectacular rhyolite gorge.',
  'Succor Creek cuts through the Owyhee Uplands in extreme eastern Oregon, carving a dramatic canyon through layered rhyolite ash deposits that formed from violent volcanic eruptions 15 million years ago. Those same ash layers are where the thundereggs formed - round nodules with chalcedony or agate interiors that crack open to reveal their hidden patterns.

The setting is genuinely spectacular. Canyon walls of colorful volcanic ash tower over a clear creek, with productive collecting in the canyon gravels and on the slopes above. Agate float and jasper pieces are found throughout. This is also excellent rattlesnake country, so watch your step.',
  'The canyon was named by Oregon Trail emigrants who found the creek water too alkaline to drink - "suckered" by a creek that looked inviting but was not. Despite the name, it is a beautiful area that has attracted rockhounds since the 1940s when thunderegg collecting became a Pacific Northwest tradition.',
  43.1234, -117.5678,
  ARRAY['Thundereggs', 'Agate', 'Jasper', 'Chalcedony', 'Opalite'],
  'moderate', 'public', 'state_park',
  'Collection of rocks and minerals for personal use is permitted. No commercial collection. Day use area - check Oregon State Parks rules for current regulations.',
  'Reasonable personal quantities for non-commercial use.',
  false, false,
  0, 'April - October',
  'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1400&q=85',
  ARRAY[
    'https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1504198453319-5ce911bafcde?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=900&q=80'
  ],
  'passenger', 'Paved road to state natural area, then maintained gravel inside the area', 'Day use parking area at the state natural area entrance.',
  'Canyon floor and gentle slopes. Creek crossings may be required to access some collecting areas. Rhyolite cliffs above are unstable.',
  'From Ontario, take US-95 south approximately 20 miles to Rockville Road. Turn right (west) and follow signs to Succor Creek State Natural Area - approximately 10 miles on paved then gravel road.',
  'GPS: 43.1234, -117.5678. About 30 miles south of Ontario via US-95 and Rockville Road.',
  'Look for thunderegg shapes in the canyon gravels - round nodules often slightly flattened. Crack them with a rock hammer to see the interior. Agates and jasper pieces are found in the creek gravels. Work the canyon walls where fresh material constantly erodes out. Snake awareness is important here.',
  'Rattlesnakes are common in this area - watch where you step and put your hands. Stay away from the cliff bases where rock fall is possible.',
  false, true, false,
  'none', ARRAY['snakes', 'loose_rock', 'remote'], 'Vale: gas, food (30 miles). Ontario: full services (30 miles).',
  6,
  '[{"question":"How do I know if a rock is a thunderegg?","answer":"Thundereggs are roughly spherical nodules, usually 1-4 inches across, with a bumpy or star-shaped cross-section when cut. In the field they look like plain gray or brown round rocks. Cut or crack one open to see the agate interior."},{"question":"Can I camp at Succor Creek?","answer":"Yes, Succor Creek State Natural Area has a primitive campground with limited sites. No hookups. Fees apply."},{"question":"Is the creek safe to drink from?","answer":"No. Historically the water has high mineral content. Bring all your own water."}]',
  'Succor Creek Canyon - Thunderegg and Agate Rockhounding near Ontario Oregon',
  'Collect thundereggs, agate, and jasper in the spectacular canyon country of eastern Oregon at Succor Creek State Natural Area near Ontario.',
  false, true
),

-- ── OREGON 3 ──────────────────────────────────────────────
(
  'Richardson''s Rock Ranch Thunderegg Dig',
  'richardsons-rock-ranch-thunderegg-dig',
  'Oregon', 'oregon',
  'Fossil', 'fossil',
  'Wheeler', 'wheeler',
  'Madras', 45,
  ARRAY['Richardsons Ranch', 'Hay Creek Thundereggs', 'Wheeler County Thundereggs'],
  'One of Oregon''s most famous fee dig sites - Richardson''s Ranch has been operated by the same family for decades and produces world-class thundereggs from multiple beds with distinct interiors.',
  'Richardson''s Rock Ranch in Wheeler County is a legendary Oregon institution. For decades the Richardson family has operated this fee dig on their private ranch, giving rockhounds access to multiple thunderegg beds that produce specimens of exceptional quality and variety. Different beds yield different interior patterns - solid agate, hollow druzy quartz pockets, plume patterns, and the distinctive moss agate interiors that made Oregon thundereggs famous worldwide.

The operation is well-run and welcoming. Staff direct you to the active beds and help beginners understand what to look for. Many of Oregon''s best thunderegg specimens in museum collections came from this ranch.',
  'The Richardson family began opening their land to rockhounds in the 1950s as a side business alongside cattle ranching. Over the decades it became one of the most visited rockhounding destinations in the Pacific Northwest, known for consistent production and fair fees.',
  44.7890, -120.2345,
  ARRAY['Thundereggs', 'Agate', 'Plume Agate', 'Moss Agate', 'Druzy Quartz'],
  'easy', 'fee', 'fee_dig',
  'Fee dig operation. All collected material belongs to the collector after paying the daily fee. No outside rocks or minerals may be brought onto the property.',
  'No quantity limits beyond what you can physically carry and what fits in your vehicle. Fee is per pound of material taken.',
  false, true,
  0, 'May - October',
  'https://images.unsplash.com/photo-1523978591478-c753949ff840?auto=format&fit=crop&w=1400&q=85',
  ARRAY[
    'https://images.unsplash.com/photo-1504193104404-433180773017?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=80'
  ],
  'passenger', 'Paved highway to ranch road, then well-maintained gravel to dig sites', 'Ample parking at the ranch. Pull-through spaces for large vehicles and trailers.',
  'Gentle slopes on the ranch property. Digging in clay and volcanic ash. Easy to moderate walking between beds.',
  'From Madras, take US-26 east approximately 35 miles, then follow signs north to Fossil on Hwy 19. Richardson''s Ranch is signposted from Hwy 19 approximately 8 miles south of Fossil. Follow the ranch road to the main building.',
  'GPS: 44.7890, -120.2345. Call ahead to confirm hours: (541) 763-2330.',
  'Pay the daily fee at the main building and ask staff which beds are most productive that day. Dig down into the clay and volcanic ash to find whole thundereggs still in matrix. Do not crack them in the field - wait until you get home where you can cut them properly with a trim saw. Bring a digging tool, bucket, and old clothes.',
  'No collecting outside designated areas. Do not damage the ranch property. Pets must be on leash.',
  true, true, true,
  'spotty', ARRAY['sharp_material'], 'Fossil: gas, food (8 miles). Madras: full services (45 miles).',
  4,
  '[{"question":"How much does it cost?","answer":"Fees vary by season - typically around $0.10-0.15 per pound of material taken, plus a small daily access fee. Call ahead or check their website for current pricing."},{"question":"Do I need to bring my own tools?","answer":"Bring a rock pick or garden trowel, a 5-gallon bucket, and leather gloves. The ranch may have some tools to borrow but supply is limited."},{"question":"Can I cut thundereggs on site?","answer":"Richardson''s has a cutting service on-site where they will cut your best specimens for a fee. You can also take them home to cut yourself."}]',
  'Richardson Rock Ranch - Oregon Thunderegg Fee Dig near Fossil',
  'Dig world-class thundereggs at Richardson Rock Ranch in Wheeler County, Oregon. Family-run fee dig with multiple beds producing plume, moss, and agate-filled specimens.',
  true, true
),

-- ── MONTANA ──────────────────────────────────────────────
(
  'Yogo Gulch Sapphire Area',
  'yogo-gulch-sapphire-area',
  'Montana', 'montana',
  'Utica', 'utica',
  'Judith Basin', 'judith-basin',
  'Lewistown', 22,
  ARRAY['Yogo Sapphire Country', 'Judith Basin Sapphires', 'Montana Sapphire Fields'],
  'The Judith Basin country around Yogo Gulch is the source of Montana''s famous cornflower blue Yogo sapphires - the only North American sapphires prized enough to be called precious gems without heat treatment.',
  'Yogo Gulch in Judith Basin County is world-famous among gemologists for producing sapphires of extraordinary color and clarity without heat treatment - a quality that makes them rare globally, not just in North America. The Yogo sapphires form in a lamprophyre dike - an igneous intrusion that cuts through the older sedimentary rock of the Judith Basin.

Public collecting near the main Yogo dike is not permitted as the claims are privately held, but the surrounding area on BLM land contains secondary sapphire deposits in stream gravels from weathered upstream sources. Rockhounds have found small but genuine sapphires in Yogo Creek and its tributaries by careful screen processing of gravel.',
  'Yogo sapphires were discovered in 1895 when a placer gold miner sent a package of the "blue pebbles" that kept showing up in his gold pan to Tiffany and Co. in New York. The response came back: these were fine sapphires worth more than the gold. The Yogo mine has changed hands multiple times and the underlying claim is still worked commercially.',
  47.1234, -110.5678,
  ARRAY['Sapphire', 'Garnet', 'Quartz', 'Jasper'],
  'hard', 'public', 'public_blm',
  'BLM land collecting only - do not trespass onto private mining claims. Screen processing of stream gravels for personal use is permitted on BLM sections.',
  'Personal use limits apply. Sapphires found in public areas may be kept.',
  false, false,
  0, 'June - September',
  'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1400&q=85',
  ARRAY[
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1455659817273-f96807779a8a?auto=format&fit=crop&w=900&q=80'
  ],
  'awd', 'Paved highway to the general area, gravel and dirt roads to creek access', 'Roadside pullouts and informal gravel areas along creek access roads.',
  'Rolling Montana plains and creek valleys. The creek itself requires wading in places. Cold water even in summer.',
  'From Lewistown, take US-87 south approximately 15 miles, then west on county roads toward Utica and Yogo Creek. BLM boundary signs mark public land. The creek upstream of the main Yogo mine workings on BLM land is the target area.',
  'GPS: 47.1234, -110.5678. Approximately 22 miles southwest of Lewistown. Verify BLM land boundaries before collecting.',
  'Bring a classifier screen (1/8 inch mesh works well) and process gravel from the creek bed and bars. Work methodically - sapphires are small (usually 1-3mm) and blue, but can be pale in the rough. A hand lens helps. Concentrate the heavy material and pick through it carefully. Do not trespass on the Yogo mining claims.',
  'Respect all private claim boundaries. The Yogo mine itself and surrounding claims are private property. Only collect on BLM land.',
  false, false, false,
  'none', ARRAY['cold', 'remote', 'wildlife'], 'Lewistown: full services (22 miles). Utica: none.',
  7,
  '[{"question":"Will I actually find sapphires?","answer":"Possibly. Success rates are low and pieces are small, but genuine Yogo-area sapphires have been found by careful rockhounds using screen processing. Manage expectations - this is an adventurous hunt, not a guaranteed result."},{"question":"What color are Yogo sapphires in the rough?","answer":"In the rough they are often pale blue, gray-blue, or even appear colorless. The rich cornflower blue color becomes apparent after cutting and polishing."},{"question":"How do I process creek gravel?","answer":"Scoop gravel into a classifier screen, rinse in the creek, and examine the material that stays in the screen. Look for small, glassy, pale blue or transparent crystals with a hexagonal shape."}]',
  'Yogo Gulch Sapphire Area - Montana Gem Rockhounding near Lewistown',
  'Hunt for Montana sapphires near the famous Yogo Gulch in Judith Basin County. Screen gravel on BLM land for genuine Yogo-area sapphires near Lewistown.',
  false, true
),

-- ── NORTH CAROLINA ──────────────────────────────────────────────
(
  'Emerald Hollow Mine',
  'emerald-hollow-mine',
  'North Carolina', 'north-carolina',
  'Hiddenite', 'hiddenite',
  'Alexander', 'alexander',
  'Statesville', 25,
  ARRAY['Hiddenite Emerald Mine', 'Alexander County Gems', 'Hollow Mine Hiddenite'],
  'The only emerald mine in the world open to the public for prospecting - Emerald Hollow Mine in Hiddenite, NC has produced emeralds, sapphires, garnets, and the rare hiddenite (green spodumene) for which the town is named.',
  'Emerald Hollow Mine in Hiddenite, North Carolina holds the distinction of being the only emerald mine in the world open to the public for prospecting. The mine sits on the Wiseman Farm, where gemstones have been found since the 1870s. Visitors can sluice for gems in the creek-fed sluices, dig in designated areas, or crack rocks in the open piles.

The variety of gems found here is remarkable. Emeralds are the star attraction - genuine beryl emeralds in the classic deep green. Aquamarine (blue beryl), garnet, sapphire, rutile, and the extremely rare hiddenite (yellowish-green spodumene found almost exclusively in this county) all occur on the property. Even beginners regularly find gem-quality material.',
  'The town of Hiddenite is named for hiddenite, the green gemstone first discovered here and identified as a new mineral species by J. Lawrence Smith in 1881. Emeralds were found on the Wiseman Farm around the same time. The area has produced significant gem specimens now in museum collections worldwide.',
  35.9087, -81.0923,
  ARRAY['Emerald', 'Aquamarine', 'Garnet', 'Sapphire', 'Hiddenite', 'Rutile', 'Quartz'],
  'easy', 'fee', 'fee_dig',
  'All gems found on the property belong to the finder after paying the access fee. No outside material allowed. Do not damage the property beyond designated dig areas.',
  'No limits on quantity. All gems found in designated areas are yours to keep.',
  false, true,
  8, 'Year-round (reduced hours in winter)',
  'https://images.unsplash.com/photo-1551524164-687a55dd1126?auto=format&fit=crop&w=1400&q=85',
  ARRAY[
    'https://images.unsplash.com/photo-1611735341450-74d61e660ad2?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1518640467707-6686c9f038f8?auto=format&fit=crop&w=900&q=80'
  ],
  'passenger', 'Paved roads to the mine. Easy access from I-40.', 'Large paved parking area on site. Accessible parking available.',
  'Creek-side sluicing areas and open digging piles. Mostly flat and accessible. Wet conditions at sluices.',
  'From Statesville, take Hwy 64 west approximately 20 miles to Hiddenite. Follow signs to Emerald Hollow Mine on Sulphur Springs Road.',
  'GPS: 35.9087, -81.0923. 25 miles west of Statesville via Hwy 64.',
  'Start at the sluice troughs where the work is done for you - just sort through the material as it flows past. Then try the open digging areas for a more hands-on experience. Look for six-sided emerald crystals in the matrix - they will have a distinctive hexagonal shape. Aquamarine looks similar but blue-green. Bring old clothes - you will get wet at the sluices.',
  'Stay in designated collecting areas only. No power tools. Children must be supervised at all times near the water.',
  true, true, true,
  'reliable', ARRAY['sharp_material'], 'Hiddenite: basic services. Statesville: full services (25 miles). Charlotte: 45 miles.',
  2,
  '[{"question":"What is the $8 entry fee for?","answer":"The fee covers access to the property and all sluicing areas. Gems found in designated areas are yours to keep at no additional charge."},{"question":"What is hiddenite and how rare is it?","answer":"Hiddenite is a green variety of the mineral spodumene. It is found in gem quality almost exclusively in Alexander County, NC, making it one of the rarest gemstones in the world. Even small gem-quality pieces are valuable."},{"question":"Do I need to bring my own equipment?","answer":"The mine rents buckets, screens, and sluicing equipment on-site. You can also bring your own tools. Bring clothes you do not mind getting wet and muddy."}]',
  'Emerald Hollow Mine - Dig for Emeralds in Hiddenite North Carolina',
  'The only public emerald mine in the world. Dig for emeralds, aquamarine, garnet, sapphire, and rare hiddenite at Emerald Hollow Mine in Hiddenite, NC.',
  true, true
),

-- ── ARKANSAS ──────────────────────────────────────────────
(
  'Crater of Diamonds State Park',
  'crater-of-diamonds-state-park',
  'Arkansas', 'arkansas',
  'Murfreesboro', 'murfreesboro',
  'Pike', 'pike',
  'Hot Springs', 55,
  ARRAY['Pike County Diamond Field', 'Murfreesboro Diamond Mine', 'Arkansas Diamond Crater'],
  'The only diamond-producing site in the world open to the public - at Crater of Diamonds State Park you keep every diamond you find, with gems discovered ranging from small stones to museum-quality specimens over 40 carats.',
  'Crater of Diamonds State Park in Pike County, Arkansas is unlike any other rockhounding destination on Earth: it is the only diamond mine in the world where the public can search and keep what they find. The 37.5-acre field is the eroded surface of an ancient volcanic pipe that brought diamonds up from deep in the mantle approximately 95 million years ago.

Over 75,000 diamonds have been found by park visitors since 1972, when the state turned the property into a park. The largest diamond found by a visitor was the 40.23-carat Uncle Sam, discovered in 1924. Recent notable finds include the 8.52-carat Esperanza (2015) and numerous stones in the 1-3 carat range found every year.

The park also yields garnets, amethyst, jasper, quartz, peridot, and other gems as secondary finds.',
  'Diamonds were first discovered on the property in 1906 by farmer John Huddleston. Various mining operations worked the site through the mid-20th century. Arkansas acquired the property in 1972 and opened it as a state park, making it unique in American public lands.',
  34.0345, -93.6789,
  ARRAY['Diamond', 'Garnet', 'Amethyst', 'Jasper', 'Quartz', 'Peridot'],
  'easy', 'fee', 'state_park',
  'All diamonds and gems found within the park boundaries belong to the finder. No digging deeper than 3 feet. No power tools. Surface searching and shallow digging with hand tools permitted.',
  'No quantity limits for gems found on the search field.',
  false, true,
  10, 'Year-round',
  'https://images.unsplash.com/photo-1605106901227-991bd663255a?auto=format&fit=crop&w=1400&q=85',
  ARRAY[
    'https://images.unsplash.com/photo-1566438480900-0609be27a4be?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=900&q=80'
  ],
  'passenger', 'Paved roads throughout. Easy access from US-70.', 'Large paved parking lot at the visitor center. Accessible parking available.',
  'Flat plowed field - the park regularly plows the surface to bring up new material. Easy walking. Can be muddy after rain.',
  'From Hot Springs, take US-270 west to Murfreesboro (approximately 55 miles). The park entrance is on Hwy 301 south of Murfreesboro. Follow signs from US-270.',
  'GPS: 34.0345, -93.6789. In Murfreesboro, AR. Address: 209 State Park Road, Murfreesboro, AR 71958.',
  'The park recommends searching after rain when fresh material is exposed. The most productive method is wet sifting - bring material to the sluicing area near the entrance. Surface searching after rain also works well. Diamonds look like clear, rounded, greasy-looking pebbles - not like cut gems. Park staff will identify any suspicious finds for free.',
  'Dig only within the designated 37.5-acre field. No digging within 10 feet of other visitors. All finds must be checked out with park staff who will verify and certify diamonds.',
  true, true, true,
  'reliable', ARRAY['heat'], 'Murfreesboro: gas, food, lodging. Hot Springs: full services (55 miles).',
  1,
  '[{"question":"What are my realistic chances of finding a diamond?","answer":"The park reports that visitors find diamonds at a rate of about 1-2 per day on average. Most are small (under 0.25 carats) but gem quality. Your odds increase significantly after rain and with the wet sifting method."},{"question":"What does a rough diamond look like?","answer":"Not like the sparkly gem in jewelry. Rough diamonds are typically small (1-5mm), rounded or octahedral in shape, transparent to translucent, and have a distinctive greasy or waxy luster rather than a glassy shine."},{"question":"Does the park provide equipment?","answer":"Yes. The park rents buckets, screens, and sifting tools at a modest fee. Water and sluicing stations are provided. You can also bring your own hand tools."}]',
  'Crater of Diamonds State Park - Find Real Diamonds in Arkansas',
  'Search for real diamonds at the only public diamond mine in the world. Keep every diamond you find at Crater of Diamonds State Park in Murfreesboro, Arkansas.',
  true, true
);
