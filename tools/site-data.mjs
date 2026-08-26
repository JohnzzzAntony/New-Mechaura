/**
 * Single source of truth for generated pages (products, pillar, locations).
 * Edit here, then run: node tools/build-pages.mjs
 */

export const SITE = 'https://mechaurainternational.com';
export const BRAND = 'Mechaura International';
export const LEGAL = 'Mechaura International FZE LLC';
export const PHONE = '+971 56 620 2517';
export const PHONE_RAW = '+971566202517';
export const EMAIL = 'info@mechaurainternational.com';
export const GTM = 'GTM-PSF2HX47';
export const GOOGLE_TAG = 'AW-18410739502';

export const AUTHOR = {
  name: 'Mechaura Technical Desk',
  role: 'Application Engineering & Product Selection',
  bio: 'Mechaura International’s technical desk specifies industrial consumables for manufacturing, fabrication, oil &amp; gas and facility-management operations across the UAE and GCC. Product recommendations on this page are based on the operating conditions our team encounters on customer sites in the region.',
};

/* ------------------------------------------------------------------ */
/* Products — each becomes /products/<slug>                            */
/* ------------------------------------------------------------------ */

export const products = [
  {
    slug: 'abrasive-brushes',
    legacyId: 'brushes',
    name: 'Abrasive Removal Brush Segments',
    short: 'Specialized Brushes',
    category: 'Surface Treatment',
    title: 'Abrasive Brush Segments UAE | Deburring Brushes',
    metaDesc:
      'Abrasive removal brush segments in Dubai & UAE — silicon carbide, ceramic and wire fill for deburring, descaling and weld polishing. Custom trim and backing built to drawing. Fast quotes.',
    keywords:
      'Abrasive Removal Brush Segment UAE, Industrial Brushes Dubai, Deburring Brush UAE, Strip Brush Dubai, Wheel Brush UAE, Blast Machine Brush',
    hero: '/images/sp.png',
    photos: ['/images/brush.png', '/images/brush-product.png', '/assets/specialized_brushes.png'],
    lead:
      'Expertly engineered industrial brushes for deburring, descaling, surface preparation and precision finishing — supplied across the UAE in standard profiles and built to drawing where the catalogue does not fit.',
    definition:
      'An abrasive removal brush segment is a replaceable brush block whose filaments are loaded with abrasive grit — typically silicon carbide or ceramic — so that the brush cuts rather than simply wipes. Segments mount into a rotating head or blast-machine frame and are replaced individually as they wear, rather than replacing the whole assembly.',
    specs: [
      ['Fill material', 'Abrasive nylon (SiC / ceramic), crimped steel, knotted steel, brass, Tampico'],
      ['Grit range', '46 – 600 grit abrasive nylon'],
      ['Profiles', 'Strip / channel, cylinder, wheel, cup, end, honing'],
      ['Backing', 'Galvanised, stainless or polypropylene channel, 6 – 30 mm'],
      ['Wheel diameter', 'Ø 75 – 350 mm standard, larger to order'],
      ['Trim length', '15 – 150 mm, cut to requirement'],
      ['Mounting', 'Arbor, flange, quick-change segment holder'],
      ['Lead time', 'Stock profiles same/next day; custom builds 2 – 4 weeks'],
    ],
    applications: [
      'Weld seam cleaning and oxide removal before coating',
      'Deburring machined components without altering dimension',
      'Blast machine blow-off and abrasive carry-over removal',
      'Surface keying prior to paint or galvanising',
      'Descaling of hot-rolled plate and structural section',
    ],
    faqs: [
      [
        'What grit abrasive brush should I use for deburring aluminium?',
        'For aluminium, use a silicon carbide abrasive nylon in the 120 – 320 grit range. Coarser grits load and smear on soft non-ferrous metal. Keep surface speed below roughly 12 m/s and run the brush wet where possible to stop filament smearing and heat build-up.',
      ],
      [
        'Can abrasive brush segments be made for a specific blast machine frame?',
        'Yes. Send the segment dimensions, backing type and mounting centres — or a sample of the worn segment — and we build to that drawing. Most blast-machine blow-off and carry-over brushes are non-standard, so custom manufacture is the norm rather than the exception.',
      ],
      [
        'How long do abrasive brush segments last?',
        'Filament life depends on contact pressure, surface speed and the material being worked. As a guide, abrasive nylon segments in continuous deburring service typically run 80 – 200 operating hours. Running at lower pressure and higher speed extends life, because the abrasive cuts rather than the filament flexing.',
      ],
      [
        'Do you supply brushes to match Osborn or Weiler part numbers?',
        'We supply both genuine brand stock and dimensional equivalents. Provide the existing part number and we will quote the original alongside a like-for-like alternative, with the fill, trim and backing stated so you can compare properly.',
      ],
    ],
  },
  {
    slug: 'hydraulic-hoses',
    legacyId: 'hose',
    name: 'Hydraulic Hoses & Fittings',
    short: 'Hydraulic Hose',
    category: 'Fluid Conveyance',
    title: 'Hydraulic Hoses UAE | High-Pressure Hose Assemblies Dubai',
    metaDesc:
      'High-pressure hydraulic hoses and fittings in Dubai & UAE. EN 853 1SN/2SN, EN 856 4SP/4SH, SAE 100R. Crimped and pressure-tested in house with certificates. Same-day assembly.',
    keywords:
      'Hydraulic Hose Dubai, Hydraulic Hose UAE, High Pressure Hose Assembly Dubai, 4SP Hose UAE, Hydraulic Fittings Dubai, Hose Crimping UAE',
    hero: '/images/hydraulic-hose.png',
    photos: ['/images/hy%20hose%20pro%20detail.png'],
    lead:
      'High-pressure hydraulic hoses engineered for durability and flexibility in extreme conditions — assembled, crimped and pressure-tested in house, with test certificates supplied on request.',
    definition:
      'A hydraulic hose is a flexible, reinforced conduit that carries pressurised fluid between components of a hydraulic system. Construction is layered: a synthetic rubber inner tube, one or more wire braid or spiral reinforcement layers that carry the pressure, and an abrasion-resistant outer cover.',
    specs: [
      ['Standards', 'EN 853 1SN / 2SN, EN 856 4SP / 4SH / R12 / R15, SAE 100R series'],
      ['Working pressure', 'Up to 420 bar depending on construction and bore'],
      ['Bore range', 'DN 5 – DN 51 (1/4" – 2")'],
      ['Temperature range', '−40 °C to +100 °C (+120 °C intermittent)'],
      ['Reinforcement', 'Wire braid, spiral wound, textile braid, thermoplastic'],
      ['Fittings', 'JIC, BSP, NPT, ORFS, DIN metric, SAE flange'],
      ['Testing', 'Crimped and proof-tested in house; certificates on request'],
      ['Lead time', 'Standard assemblies same day; specials 3 – 5 days'],
    ],
    applications: [
      'Excavator, loader and crane hydraulic circuits',
      'Injection moulding and press hydraulics',
      'Oil and gas rig equipment and pressure lines',
      'Marine deck machinery and steering gear',
      'Workshop power packs and test rigs',
    ],
    faqs: [
      [
        'What is the difference between wire-braided and spiral-reinforced hydraulic hose?',
        'Wire-braided hose (1SN/2SN) uses one or two crossed braid layers and suits steady pressure with moderate flexing. Spiral hose (4SP/4SH) uses four or six wound layers and handles higher pressure and heavy impulse cycling. Choose spiral where pressure surges or shock loads are frequent.',
      ],
      [
        'Why do hydraulic hoses fail early in UAE conditions?',
        'The dominant causes in the Gulf are thermal hardening of the inner tube from sustained high ambient temperature, bend radius below the manufacturer minimum, pressure surge spikes, and UV plus abrasive sand attack on the outer cover. Specifying a higher temperature rating and fitting sleeving on exposed runs addresses most of it.',
      ],
      [
        'Can you make hose assemblies to a sample?',
        'Yes. Bring or send the failed assembly and we will match bore, length, fitting type and orientation, then crimp and pressure-test the replacement. Most standard assemblies are ready the same day.',
      ],
      [
        'How often should hydraulic hoses be replaced?',
        'Most manufacturers recommend replacement every five to seven years from the date of manufacture regardless of appearance, and immediately on any sign of cover cracking, wire exposure, blistering or weeping at the ferrule.',
      ],
    ],
  },
  {
    slug: 'industrial-bearings',
    legacyId: 'bearings',
    name: 'Industrial Bearings',
    short: 'Bearings',
    category: 'Motion Control',
    title: 'Industrial Bearings UAE | Ball & Roller Bearings',
    metaDesc:
      'Precision industrial bearings in Dubai & UAE — deep groove ball, spherical roller, tapered roller, needle and thrust. Genuine brand stock with batch traceability. Interchange lookup available.',
    keywords:
      'Bearings UAE, Industrial Bearings Dubai, SKF Bearings UAE, Spherical Roller Bearing Dubai, Tapered Roller Bearing UAE, Bearing Supplier Dubai',
    hero: '/images/bear.png',
    photos: ['/images/bearings.png'],
    lead:
      'Precision bearings for industrial applications — reducing friction, carrying load and keeping production running. Genuine brand stock with traceable batch numbers, plus interchange lookup across the major manufacturers.',
    definition:
      'An industrial bearing is a machine element that constrains relative motion between rotating parts and reduces friction between them. It transfers load from a rotating shaft to a housing through rolling elements — balls, cylindrical rollers, tapered rollers or needles — held in position by a cage between an inner and outer ring.',
    specs: [
      ['Types', 'Deep groove ball, angular contact, spherical roller, tapered roller, needle, thrust'],
      ['Bore range', 'Ø 8 – 400 mm standard, larger to order'],
      ['Tolerance class', 'P0, P6, P5, P4 (ISO 492)'],
      ['Clearance', 'C2, CN, C3, C4 internal clearance'],
      ['Cage material', 'Pressed steel, brass, polyamide PA66'],
      ['Sealing', 'Open, 2RS rubber sealed, ZZ shielded'],
      ['Lubrication', 'Pre-greased or supplied dry for customer lubricant'],
      ['Traceability', 'Batch numbers recorded and supplied with delivery'],
    ],
    applications: [
      'Electric motor and gearbox shafts',
      'Conveyor rollers and idler assemblies',
      'Pump and compressor rotating assemblies',
      'Crusher and vibrating screen bearings under shock load',
      'Fan and blower assemblies in high-temperature service',
    ],
    faqs: [
      [
        'What is the difference between a precision bearing and a standard bearing?',
        'Precision bearings are manufactured to a tighter tolerance class — P5 or P4 rather than P0 — which means less runout and more predictable clearance under load. They matter where spindle accuracy, high speed or low vibration is critical. For general conveyor and motor duty, standard P0 is usually the correct and more economical choice.',
      ],
      [
        'Which bearing type is best for high radial load with shaft misalignment?',
        'A spherical roller bearing. Its two rows of barrel rollers run on a common spherical raceway, so it accommodates several degrees of static misalignment while carrying very high radial load. It is the standard choice for crushers, screens and long conveyor shafts.',
      ],
      [
        'Do you supply bearings that cross-reference to SKF, FAG or NSK numbers?',
        'Yes. Provide the part number you currently use and we will return the genuine item where available plus dimensional equivalents across SKF, FAG, NSK, NTN and Timken numbering, with clearance and cage type stated so the substitution is a like-for-like comparison.',
      ],
      [
        'How does sand ingress affect bearing life in the Gulf?',
        'Abrasive dust is the single largest cause of premature bearing failure in this region. Silica particles score raceways and contaminate grease, accelerating wear dramatically. Specify 2RS contact seals rather than shields for exposed positions, and shorten regreasing intervals in dusty environments.',
      ],
    ],
  },
  {
    slug: 'bandsaw-blades',
    legacyId: 'blades',
    name: 'Bandsaw Blades',
    short: 'Bandsaw Blades',
    category: 'Precision Cutting',
    title: 'Bandsaw Blades UAE | Bi-Metal & Carbide Blades',
    metaDesc:
      'Bandsaw blades in Dubai & UAE — bi-metal M42/M51, carbide tipped and carbon steel. Welded to length in house, 13–80 mm width, 2/3 to 10/14 TPI. Blade selection advice included.',
    keywords:
      'Bandsaw Blades UAE, Bandsaw Blade Dubai, Bi-Metal Bandsaw Blade UAE, Carbide Bandsaw Blade Dubai, M42 Blade UAE, Saw Blade Supplier Dubai',
    hero: '/images/bandsaw.png',
    photos: ['/images/bandsaw-blades.png'],
    lead:
      'High-performance bandsaw blades for metal, wood and plastic cutting — welded to length in house, with selection advice based on your material, section size and machine.',
    definition:
      'A bandsaw blade is a continuous toothed steel band that runs between two wheels to make a cut. In metal cutting, bi-metal blades bond a high-speed-steel tooth edge to a flexible alloy backing, giving hard, wear-resistant teeth without making the whole blade brittle.',
    specs: [
      ['Blade types', 'Bi-metal M42 / M51, carbide tipped, carbon steel'],
      ['Width range', '13 – 80 mm'],
      ['Gauge', '0.65 – 1.60 mm'],
      ['Tooth pitch', '2/3, 3/4, 4/6, 5/8, 6/10, 8/12, 10/14 TPI variable'],
      ['Tooth set', 'Raker, wavy, alternate'],
      ['Band length', '1 000 – 8 000 mm, welded to requirement'],
      ['Materials cut', 'Structural steel, stainless, exotic alloys, aluminium, wood, plastics'],
      ['Lead time', 'Welded to length same/next day from stock coil'],
    ],
    applications: [
      'Structural steel and beam cutting in fabrication shops',
      'Solid bar and billet cut-off',
      'Tube and profile bundle cutting',
      'Stainless and exotic alloy sawing',
      'Pallet dismantling and timber processing',
    ],
    faqs: [
      [
        'Should I use a bi-metal or carbide bandsaw blade?',
        'Bi-metal M42 covers most general fabrication on mild and structural steel at the lowest cost per cut. Move to carbide tipped for hardened steel, stainless above roughly 40 mm section, nickel alloys and titanium, where bi-metal teeth dull quickly. Carbide costs more per blade but usually reduces cost per cut on those materials.',
      ],
      [
        'How do I choose the right tooth pitch (TPI)?',
        'Aim for three to six teeth engaged in the cut at all times. Thin wall tube needs a fine pitch such as 10/14 TPI to stop teeth stripping; heavy solid section needs a coarse pitch such as 2/3 or 3/4 TPI to clear the chip. Variable pitch blades reduce harmonic vibration and give a cleaner cut.',
      ],
      [
        'Why do my bandsaw blades keep stripping teeth?',
        'The usual causes are too coarse a pitch for the wall thickness, feed rate too high for the material, insufficient blade tension, or inadequate coolant flow. A new blade also needs breaking in at reduced feed for the first 50 to 100 cm² of cut area to hone the tooth tips.',
      ],
      [
        'Can you weld blades to a non-standard length?',
        'Yes. We weld to length in house from stock coil, so any band length between roughly 1 000 and 8 000 mm is available. Provide the machine make and model, or the length, width and gauge of the existing blade.',
      ],
    ],
  },
  {
    slug: 'cutting-tools',
    legacyId: 'cutting-tools',
    name: 'Cutting Tools & CNC Tooling',
    short: 'Cutting Tools',
    category: 'Machining & Tooling',
    title: 'Cutting Tools UAE | CNC End Mills, Drills & Inserts Dubai',
    metaDesc:
      'CNC cutting tools in Dubai & UAE — solid carbide end mills, drills, taps, reamers, inserts and tool holders. TiN, TiAlN and DLC coatings. Cutting-data sheets with every package.',
    keywords:
      'Cutting Tools Dubai, CNC Tooling UAE, End Mill Dubai, Carbide Insert UAE, Drill Bits Dubai, Tool Holder UAE, Machining Tools Dubai',
    hero: '/images/cut.png',
    photos: ['/assets/ind_tools.png'],
    lead:
      'Advanced CNC cutting tools and manual instruments for precision manufacturing — supplied with the cutting data you need to run them properly, not just a part number.',
    definition:
      'A cutting tool is a hardened tool that removes material from a workpiece by shear. In CNC machining the tool is usually solid carbide or an indexable insert in a steel body, and its performance depends as much on the coating and cutting data as on the geometry itself.',
    specs: [
      ['Tool types', 'End mills, drills, taps, reamers, indexable inserts, tool holders'],
      ['Substrate', 'Micro-grain solid carbide, HSS-Co (M35 / M42)'],
      ['Coatings', 'TiN, TiCN, TiAlN, AlTiN, DLC, uncoated'],
      ['Diameter range', 'Ø 1 – 25 mm solid carbide; larger indexable'],
      ['Flute counts', '2, 3, 4, 6 flute; roughing and finishing geometry'],
      ['Shank', 'h6 ground, Weldon, ER collet, HSK, BT / CAT'],
      ['Materials cut', 'Steel, stainless, cast iron, aluminium, titanium, composites'],
      ['Included', 'Cutting-data sheet supplied with every tooling package'],
    ],
    applications: [
      'CNC milling and turning of production components',
      'Die and mould cavity machining',
      'Aerospace component finishing in titanium and Inconel',
      'General workshop drilling, tapping and reaming',
      'Aluminium high-speed machining',
    ],
    faqs: [
      [
        'Which coating should I choose for machining stainless steel?',
        'TiAlN or AlTiN. Both form an aluminium-oxide layer at cutting temperature that insulates the carbide substrate, which suits the high heat and work hardening of stainless. Avoid uncoated carbide on stainless except at very low speed, and avoid TiN, which is better suited to mild steel.',
      ],
      [
        'How many flutes should an end mill have?',
        'Two or three flutes for aluminium and soft non-ferrous, because chip clearance matters more than edge count. Four or more for steel and stainless, where the extra edges spread wear and improve finish. Six flute and higher are finishing tools taking light radial cuts.',
      ],
      [
        'Do you supply cutting data with the tools?',
        'Yes. Every tooling package ships with recommended surface speed, feed per tooth, depth of cut and coolant guidance for the material you specified. Getting the data right typically matters more to tool life than the choice of brand.',
      ],
      [
        'Can you supply tool holders to match our machine spindles?',
        'Yes — tell us the spindle taper (BT30, BT40, HSK63, CAT40 and so on) and pull-stud type, and we will supply holders, collets and pull studs that match. We can also supply presetting and balancing to order.',
      ],
    ],
  },
  {
    slug: 'elevator-accessories',
    legacyId: 'elevator',
    name: 'Elevator Accessories & Spares',
    short: 'Elevator Accessories',
    category: 'Vertical Transport',
    title: 'Elevator Accessories & Spares UAE | Lift Parts Dubai',
    metaDesc:
      'Elevator accessories and spares in Dubai & UAE — guide rails, door operators, safety gears, buffers, guide shoes and traction spares. EN 81-20/50 compliant. Model-matched to major lift brands.',
    keywords:
      'Elevator Accessories Dubai, Lift Spares UAE, Elevator Spare Parts Dubai, Guide Shoe UAE, Door Roller Dubai, Elevator Safety Gear UAE',
    hero: '/images/elevator.png',
    photos: ['/images/elevator-accessories.png'],
    lead:
      'A comprehensive range of components for elevators and escalators, ensuring safety and smooth operation — model-matched to the major lift brands installed across the UAE.',
    definition:
      'Elevator accessories are the wear parts and safety components of a lift installation: the guide rails and shoes that locate the car in the shaft, the door operator and rollers, the safety gear and overspeed governor, and the buffers at the pit. They are consumable items on a defined inspection and replacement cycle.',
    specs: [
      ['Guide rails', 'T70, T89, T127 machined and drawn profiles'],
      ['Compliance', 'EN 81-20 / EN 81-50 component standards'],
      ['Door systems', 'Operators, rollers, skates, locks, safety edges'],
      ['Safety components', 'Progressive and instantaneous safety gears, overspeed governors'],
      ['Buffers', 'Polyurethane and oil hydraulic buffer systems'],
      ['Guide shoes', 'Sliding shoes, roller guides, replaceable liners'],
      ['Traction', 'Machines, sheaves, ropes, brake components'],
      ['Sourcing', 'OEM and compatible equivalents, model matched'],
    ],
    applications: [
      'Scheduled preventive maintenance in commercial towers',
      'Emergency breakdown spares for building management teams',
      'Modernisation of ageing lift installations',
      'Escalator step chain and comb plate replacement',
      'Compliance remediation following inspection findings',
    ],
    faqs: [
      [
        'How often should elevator guide shoes and door rollers be replaced?',
        'Guide shoe inserts should be inspected quarterly and replaced every 12 to 24 months depending on traffic intensity. Door rollers should be replaced immediately if radial play, flat spots or noise develop, since door faults are the most common cause of entrapment call-outs.',
      ],
      [
        'Can you supply spares for a specific lift brand?',
        'Yes. Provide the make, model and where possible the component part number or a photograph, and we will match either the genuine OEM item or a dimensionally equivalent alternative. Most common brands installed in the UAE are covered.',
      ],
      [
        'Are your elevator components compliant with UAE regulations?',
        'We supply components manufactured to EN 81-20 and EN 81-50, which are the standards referenced by UAE Civil Defence and municipality lift requirements. Declarations of conformity and test certificates are available on request for safety-critical components.',
      ],
      [
        'What is the difference between progressive and instantaneous safety gear?',
        'Instantaneous safety gear grips the rail abruptly and is only permitted on lower-speed lifts. Progressive safety gear brakes over a controlled distance, limiting deceleration to safe limits, and is required above roughly 1 m/s rated speed. The choice is set by the lift design, not preference.',
      ],
    ],
  },
  {
    slug: 'industrial-air-filters',
    legacyId: 'air-filter',
    name: 'Industrial Air Filters',
    short: 'Industrial Air Filter',
    category: 'Filtration Systems',
    title: 'Industrial Air Filters UAE | Compressor Filters',
    metaDesc:
      'Industrial air filters in Dubai & UAE — depth, coalescer, separator, adsorption and spin-on elements. G4 to H14 efficiency. Engineered for high-dust desert conditions. OEM cross-reference.',
    keywords:
      'Industrial Air Filters UAE, Air Filter Dubai, Compressor Filter UAE, Coalescer Filter Dubai, Filter Element UAE, Dust Filter Dubai',
    hero: '/images/industrial_air_filters.png',
    photos: [],
    lead:
      'Filtration elements for mission-critical industrial machines, protecting internal components from the abrasive dust loading that defines Gulf operating conditions.',
    definition:
      'An industrial air filter is a replaceable element that removes particulate, moisture or oil aerosol from an air stream before it reaches machinery. Depth filters trap particles through the thickness of the media; coalescer filters merge fine liquid aerosols into droplets that drain away.',
    specs: [
      ['Element types', 'Wire mesh, depth, adsorption, coalescer, separator, spin-on'],
      ['Efficiency ratings', 'G4 to H14 (EN 1822 / ISO 16890)'],
      ['Media', 'Cellulose, glass fibre, synthetic, activated carbon'],
      ['Construction', 'Pleated pack with anti-collapse core and sealed end caps'],
      ['Diameter range', 'Ø 90 – 450 mm'],
      ['Sealing', 'Nitrile, silicone and fluorocarbon gaskets'],
      ['Documentation', 'Beta ratio and efficiency data documented per batch'],
      ['Cross-reference', 'Element lookup for all major OEM housings'],
    ],
    applications: [
      'Rotary screw and reciprocating compressor intakes',
      'Gas turbine and generator air inlet filtration',
      'Paint booth and spray extraction systems',
      'HVAC plant in high-dust industrial areas',
      'Hydraulic reservoir breathers and vacuum pumps',
    ],
    faqs: [
      [
        'How often should industrial air filters be replaced in the UAE?',
        'Replace on differential pressure rather than calendar hours. Fit a gauge on the intake and change the element when restriction reaches the manufacturer threshold, typically 20 to 25 inches water gauge. In Gulf dust loading this often means intervals two to three times shorter than the manufacturer default.',
      ],
      [
        'What is the difference between a depth filter and a coalescer?',
        'A depth filter captures solid particulate through the thickness of its media. A coalescer is designed for liquid aerosols — oil mist or water — which it merges into larger droplets that drain out of the air stream. Compressed air systems usually need both, in sequence.',
      ],
      [
        'Can you cross-reference a filter element from an OEM part number?',
        'Yes. Provide the OEM element number or the housing make and model and we will return a matching element with the dimensions, micron rating and gasket type stated, so you can confirm the fit before ordering.',
      ],
      [
        'Does sand ingress really justify a higher filtration grade?',
        'In most Gulf installations, yes. Fine silica is abrasive and passes standard coarse elements readily, reaching compressor screws, cylinder bores and turbine blades. Upgrading the primary stage and adding a pre-filter is almost always cheaper than the wear it prevents.',
      ],
    ],
  },
  {
    slug: 'hydraulic-pumps',
    legacyId: 'hydraulic-pumps',
    name: 'Industrial Hydraulic Pumps',
    short: 'Hydraulic Pumps',
    category: 'Hydraulic Power',
    title: 'Hydraulic Pumps UAE | Gear, Vane & Piston Pumps',
    metaDesc:
      'Industrial hydraulic pumps in Dubai & UAE — gear, vane, axial and radial piston, variable displacement. Up to 350 bar. Bench-tested before dispatch with a printed performance curve.',
    keywords:
      'Hydraulic Pumps UAE, Hydraulic Pump Dubai, Gear Pump UAE, Piston Pump Dubai, Vane Pump UAE, Hydraulic Power Unit Dubai',
    hero: '/images/industrial_hydraulic_pumps.png',
    photos: [],
    lead:
      'Heavy-duty pumps engineered for continuous operation in complex manufacturing systems — bench-tested before dispatch and supplied with a printed performance curve.',
    definition:
      'A hydraulic pump converts mechanical rotation into fluid flow, creating the pressure that drives a hydraulic system. Gear pumps are simple and tolerant of contamination; vane pumps run quieter at moderate pressure; piston pumps deliver the highest pressure and can vary displacement on demand.',
    specs: [
      ['Pump types', 'External gear, internal gear, vane, axial piston, radial piston'],
      ['Displacement', '0.5 – 250 cc/rev'],
      ['Pressure rating', 'Up to 350 bar continuous depending on type'],
      ['Control', 'Fixed and variable displacement, pressure-compensated'],
      ['Body diameter', 'Ø 120 – 320 mm'],
      ['Porting', 'SAE flange, BSP, metric threaded'],
      ['Mounting', 'SAE A/B/C/D, ISO flange, foot mount'],
      ['Testing', 'Bench-tested with printed performance curve before dispatch'],
    ],
    applications: [
      'Press and injection moulding power packs',
      'Mobile plant and construction machinery',
      'Marine deck equipment and hatch systems',
      'Steel mill and heavy manufacturing hydraulics',
      'Test rigs and workshop power units',
    ],
    faqs: [
      [
        'Which hydraulic pump type should I choose?',
        'Gear pumps for simple, contamination-tolerant duty up to roughly 250 bar. Vane pumps where noise matters at moderate pressure. Axial piston pumps where you need high pressure, high efficiency or variable displacement — they cost more but pay back in energy on continuously running systems.',
      ],
      [
        'What causes hydraulic pump failure?',
        'Contaminated fluid is the leading cause by a wide margin, followed by cavitation from a restricted suction line, incorrect fluid viscosity for the operating temperature, and misalignment of the drive coupling. Most pump failures are really system failures that show up at the pump.',
      ],
      [
        'Do you test pumps before delivery?',
        'Yes. Pumps are bench-tested and dispatched with a printed performance curve showing flow against pressure, so you can verify the unit before it goes into service rather than discovering a problem during commissioning.',
      ],
      [
        'Can you supply a complete hydraulic power unit?',
        'Yes. Provide the required flow, pressure, duty cycle and available electrical supply and we can specify or build a complete unit including reservoir, motor, valving, cooling and filtration.',
      ],
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Locations — each becomes /industrial-supplies-<slug>                */
/* ------------------------------------------------------------------ */

export const locations = [
  {
    slug: 'dubai',
    city: 'Dubai',
    region: 'Dubai',
    title: 'Industrial Supplier in Dubai | Tools, Brushes & Hydraulics',
    metaDesc:
      'Industrial supplier in Dubai delivering abrasive brushes, hydraulic hoses, bearings, bandsaw blades and cutting tools. Same-day dispatch to Al Quoz, DIP, Jebel Ali and Ras Al Khor.',
    keywords: 'Industrial Supplier Dubai, Industrial Supplies Dubai, Tools Supplier Dubai, Industrial Trading Dubai',
    areas: ['Al Quoz Industrial', 'Dubai Investments Park', 'Jebel Ali Free Zone', 'Ras Al Khor Industrial', 'Al Qusais Industrial', 'Dubai Industrial City'],
    intro:
      'Dubai is our home market and the base from which we dispatch across the Emirates. The industrial belt running from Al Quoz through Ras Al Khor to Jebel Ali contains the fabrication shops, machine shops and facility-management contractors that make up the majority of our day-to-day supply.',
    focus:
      'For Dubai customers the practical advantage is speed: stock lines ordered before midday are typically on site the same working day, and hose assemblies can be crimped and tested while you wait.',
    sectors: 'Fabrication workshops, CNC machine shops, facility management contractors, marine and logistics operators around Jebel Ali.',
  },
  {
    slug: 'abu-dhabi',
    city: 'Abu Dhabi',
    region: 'Abu Dhabi',
    title: 'Industrial Supplier in Abu Dhabi | Plant Supplies',
    metaDesc:
      'Industrial supplier serving Abu Dhabi — hydraulic hoses, bearings, filtration and abrasive brushes for oil, gas and heavy plant. Delivery to Mussafah, ICAD and Ruwais.',
    keywords: 'Industrial Supplier Abu Dhabi, Industrial Supplies Abu Dhabi, Oil and Gas Supplies Abu Dhabi, Mussafah Industrial Supplier',
    areas: ['Mussafah Industrial', 'ICAD I, II & III', 'Ruwais Industrial City', 'Al Markaz', 'Khalifa Industrial Zone (KIZAD)'],
    intro:
      'Abu Dhabi’s demand profile is different from Dubai’s. The emirate’s oil, gas and petrochemical operations drive requirements for higher-specification hose, filtration rated for continuous duty, and bearings that survive shock loading and abrasive ingress.',
    focus:
      'We supply Mussafah and ICAD on a scheduled delivery basis, and handle Ruwais and remote site deliveries by arrangement with documentation and certificates prepared in advance to suit site entry requirements.',
    sectors: 'Oil, gas and petrochemical operations, heavy plant maintenance, EPC contractors, industrial services companies.',
  },
  {
    slug: 'sharjah',
    city: 'Sharjah',
    region: 'Sharjah',
    title: 'Industrial Supplier in Sharjah | Fabrication',
    metaDesc:
      'Industrial supplier serving Sharjah — bandsaw blades, abrasive brushes, cutting tools and bearings for fabrication and manufacturing. Delivery across the industrial areas and SAIF Zone.',
    keywords: 'Industrial Supplier Sharjah, Industrial Supplies Sharjah, Bandsaw Blades Sharjah, Fabrication Supplies Sharjah',
    areas: ['Industrial Areas 1–18', 'SAIF Zone', 'Hamriyah Free Zone', 'Al Sajaa Industrial'],
    intro:
      'Sharjah carries a dense concentration of metal fabrication and general manufacturing. That shapes what moves here: bandsaw blades welded to length, abrasive brush segments for deburring and weld cleaning, and cutting tools with the data to run them correctly.',
    focus:
      'Sharjah fabricators tend to buy on cut quality and consumable life rather than headline price, so our approach is to specify the correct pitch, grade and coating first, then quote — which usually lowers cost per cut even when the item costs more.',
    sectors: 'Metal fabrication, structural steel, general manufacturing, joinery and timber processing.',
  },
];

export const gccMarkets = ['Saudi Arabia', 'Oman', 'Qatar', 'Kuwait', 'Bahrain'];
