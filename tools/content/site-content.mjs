/**
 * Editorial content for the generated pages. Company claims here are carried
 * over from the previous site; anything new is limited to general technical
 * guidance. Do not add customer names, certifications, statistics or delivery
 * promises that the business has not confirmed.
 */

/* ------------------------------------------------------------------ */
/* Articles — metadata for /blog/<slug> (bodies: article-content.mjs)  */
/* ------------------------------------------------------------------ */

export const articleMeta = [
  {
    slug: 'abrasive-removal-brush-segments-guide',
    headline: 'Abrasive Removal Brush Segments: The Ultimate UAE Industrial Guide',
    title: 'Abrasive Brush Segments: UAE Selection Guide',
    desc: 'How to select silicon carbide, ceramic and wire abrasive brush segments for deburring, oxide removal and weld polishing in UAE machine shops.',
    keywords: 'Abrasive Brush Segments UAE, Deburring Brush Dubai, Silicon Carbide Brush UAE, Brush Selection Guide',
    image: '/images/brush-product.png',
    category: 'Surface Treatment',
    products: ['abrasive-brushes', 'cutting-tools'],
    pillar: true,
  },
  {
    slug: 'hydraulic-hose-failure-prevention',
    headline: 'Hydraulic Hose Failure Prevention & Pressure Safety in UAE Heavy Industry',
    title: 'Hydraulic Hose Failure Prevention | UAE',
    desc: 'Wire-braided versus spiral-reinforced hydraulic hose selection to prevent blowouts, thermal hardening and fluid degradation in Middle East heat.',
    keywords: 'Hydraulic Hose Failure UAE, Hose Pressure Safety Dubai, 4SP vs 2SN, Hydraulic Hose Maintenance UAE',
    image: '/images/hydraulic-hose.png',
    category: 'Hydraulics',
    products: ['hydraulic-hoses', 'hydraulic-pumps', 'industrial-air-filters'],
  },
  {
    slug: 'elevator-spares-inspection-checklist',
    headline: 'Elevator Accessories & Spares: Essential Inspection & Safety Checklist in Dubai',
    title: 'Elevator Spares Inspection Checklist | Dubai',
    desc: 'A maintenance engineer’s guide to door rollers, guide shoe liners, governor switches and traction spares for UAE lift compliance.',
    keywords: 'Elevator Spares Dubai, Lift Inspection Checklist UAE, Guide Shoe Liner Dubai, Elevator Maintenance UAE',
    image: '/images/elevator.png',
    category: 'Elevator & Lift',
    products: ['elevator-accessories', 'industrial-bearings'],
  },
  {
    slug: 'precision-vs-standard-bearings',
    headline: 'Precision Bearings vs Standard Bearings: Industrial Performance Comparison',
    title: 'Precision vs Standard Bearings Compared',
    desc: 'Selecting spherical roller, deep groove and angular contact bearings for high radial loads, sand ingress and continuous production duty.',
    keywords: 'Precision Bearings UAE, Bearing Selection Dubai, Spherical Roller Bearing UAE, Bearing Tolerance Class',
    image: '/images/bearings.png',
    category: 'Motion & Power Transmission',
    products: ['industrial-bearings', 'hydraulic-pumps'],
  },
  {
    slug: 'bimetal-vs-carbide-bandsaw-blades',
    headline: 'Bi-Metal vs Carbide Bandsaw Blades: Cutting Speed & Tooth Pitch Guide',
    title: 'Bi-Metal vs Carbide Bandsaw Blades Guide',
    desc: 'How variable tooth geometry, blade tension and coolant flow reduce blade stripping and deliver clean cut squareness on steel and exotic alloys.',
    keywords: 'Bandsaw Blade Selection UAE, Bi-Metal vs Carbide Blade, TPI Guide Dubai, Blade Stripping Causes',
    image: '/images/bandsaw.png',
    category: 'Cutting & Machining',
    products: ['bandsaw-blades', 'cutting-tools'],
  },
  {
    slug: 'industrial-air-filters-arid-climates',
    headline: 'Industrial Air Filters in Arid Climates: Protecting Heavy Machinery from Sand Ingress',
    title: 'Industrial Air Filters for Arid Climates',
    desc: 'Multi-stage coalescence, depth filtration and micron ratings that protect heavy machinery from sand ingress in Gulf operating conditions.',
    keywords: 'Industrial Air Filter UAE, Sand Ingress Protection Dubai, Coalescer Filter UAE, Filter Micron Rating',
    image: '/images/industrial_air_filters.png',
    category: 'Filtration',
    products: ['industrial-air-filters', 'hydraulic-pumps', 'industrial-bearings'],
  },
];

// The previous /blog page opened guides in a modal via ?article=article-N.
export const legacyArticleKeys = Object.fromEntries(articleMeta.map((a, i) => [`article-${i + 1}`, a.slug]));

export const ARTICLE_PUBLISHED = '2026-08-01';
export const ARTICLE_MODIFIED = '2026-08-26';

/* ------------------------------------------------------------------ */
/* Company                                                             */
/* ------------------------------------------------------------------ */

/**
 * Figures shown on the previous site that have not been evidenced. They are
 * kept here, unpublished, so they can be re-enabled once confirmed.
 */
export const unverifiedStats = [
  ['10+', 'Years of industry experience'],
  ['500+', 'Product lines stocked'],
];

export const trust = [
  ['map', 'All seven Emirates', 'Delivery across the UAE'],
  ['globe', 'GCC export', 'Saudi Arabia, Oman, Qatar, Kuwait, Bahrain'],
  ['clock', '24 working hours', 'Typical itemised quote response'],
  ['layers', 'Genuine & equivalent', 'Stated clearly on every quotation'],
  ['wrench', 'Application-led', 'Specified to your operating conditions'],
  ['file', 'Documentation', 'Certificates and datasheets on request'],
];

export const principles = [
  ['Quality-tested inventory', 'Stock is checked against the datasheet on arrival — dimensions, markings and batch traceability — so what you order is what reaches your floor.'],
  ['Transparent pricing', 'Itemised quotations with no hidden handling charges, so procurement teams can compare like for like and budget with confidence.'],
  ['Reliable lead times', 'We commit to a date and hold it. Fast-moving lines are held in stock; indent items are tracked and reported until they land.'],
  ['Application-led advice', 'Tell us the material, duty cycle and environment — we specify the right grade rather than the easiest one to sell.'],
  ['Custom & hard-to-source', 'Brush segments, hose assemblies and obsolete spares built or located to drawing when the standard catalogue does not cover it.'],
  ['After-sales accountability', 'One point of contact stays with the account after dispatch — for documentation, replacements and repeat scheduling.'],
];

export const process = [
  ['Send the requirement', 'Share the part number, drawing, photo or simply the problem. We capture the application, duty cycle and quantity in one conversation.'],
  ['Technical matching', 'We specify the correct grade, size and any equivalent alternatives — with the trade-offs stated plainly so you can choose.'],
  ['Itemised quotation', 'Pricing, lead time and documentation per line, typically back with you within 24 working hours.'],
  ['Delivery & after-sales', 'Dispatch across the UAE and GCC with certificates on request, and a named contact who stays with the account.'],
];

/**
 * Carried over from the previous site, where they were attributed by role and
 * industry only. Confirm each is a genuine, approved customer statement.
 */
export const testimonials = [
  ['Their team specified the right abrasive grade for our deburring line on the first attempt. Rework on finished parts dropped noticeably within the first month.', 'Production Manager', 'Metal fabrication plant', 'Sharjah'],
  ['Hose assemblies arrived crimped, tested and tagged exactly as requested. Having a supplier who holds the promised date is worth more to us than a marginal price difference.', 'Maintenance Engineer', 'Construction contractor', 'Dubai'],
  ['They tracked down an obsolete lift spare we had written off as unavailable, and kept us updated the whole way.', 'Facilities Manager', 'Commercial property group', 'Abu Dhabi'],
];

export const brandList = ['SKF', 'FAG', 'NSK', 'NTN', 'Timken', 'Parker', 'Gates', 'Eaton', 'Bosch Rexroth', 'Sandvik', 'Lenox', 'Osborn', 'Weiler'];

export const BRAND_DISCLAIMER =
  'All trademarks are the property of their respective owners. Mechaura International supplies genuine and compatible equivalent products; we are not an authorised agent for any brand unless stated in writing.';

export const generalFaqs = [
  ['What industrial products does Mechaura International supply?', 'Abrasive removal brush segments and shot blast brushes, hydraulic hoses and fittings, hydraulic pumps, industrial bearings, bandsaw blades, CNC cutting tools, elevator accessories and spares, and industrial air filters. Items outside the standard range can be sourced or built to drawing.'],
  ['Do you deliver across all UAE emirates and the GCC?', 'Yes. We deliver to Dubai, Abu Dhabi, Sharjah, Ajman, Ras Al Khaimah, Fujairah and Umm Al Quwain, and export to Saudi Arabia, Oman, Qatar, Kuwait and Bahrain. Timelines by region are set out in our Delivery Policy.'],
  ['Can you build custom brush segments and hose assemblies?', 'Yes. Brush segments are built to your drawing or worn sample — fill, trim length and backing — and hose assemblies are crimped and pressure-tested in house to the bore, length and fitting orientation you specify.'],
  ['Can you match an OEM or competitor part number?', 'Send the part number and, where possible, a photo or datasheet. We quote the genuine item where available alongside any equivalent, stating clearly which is which. An equivalent is only offered as interchangeable once the dimensions and ratings have been checked.'],
  ['How do I request a quotation or datasheet?', 'Use the Request a Quote form — you can attach drawings, photos and datasheets — or email info@mechaurainternational.com, call +971 56 620 2517 or message us on WhatsApp.'],
];

/* ------------------------------------------------------------------ */
/* Solutions (served at /services)                                     */
/* ------------------------------------------------------------------ */

export const solutions = [
  {
    id: 'technical-sourcing',
    name: 'Technical Sourcing',
    icon: 'search',
    summary: 'Locating the correct component — including non-standard, legacy and hard-to-source items — through our international manufacturing and supply network.',
    points: ['Obsolete and discontinued spares located or rebuilt to sample', 'Non-standard dimensions sourced against drawing', 'Genuine and equivalent options quoted side by side'],
    products: ['elevator-accessories', 'industrial-bearings', 'hydraulic-pumps'],
  },
  {
    id: 'oem-cross-reference',
    name: 'OEM Cross-Reference',
    icon: 'layers',
    summary: 'Send the part number you use today. We return the genuine item where available and any dimensional equivalents, with the differences stated.',
    points: ['Bearing interchange across SKF, FAG, NSK, NTN and Timken numbering', 'Filter element lookup from OEM element or housing number', 'Equivalents flagged as requiring technical verification until checked'],
    products: ['industrial-bearings', 'industrial-air-filters', 'hydraulic-hoses'],
  },
  {
    id: 'custom-manufacturing',
    name: 'Custom Manufacturing',
    icon: 'ruler',
    summary: 'Brush segments, shot blast brushes and blades built to your drawing or worn sample where the catalogue does not fit.',
    points: ['Fill, trim length and backing matched to the machine', 'Bandsaw blades welded to length from stock coil', 'Interim short-run sets quoted when a machine is down'],
    products: ['abrasive-brushes', 'bandsaw-blades'],
  },
  {
    id: 'hose-assembly',
    name: 'Hose Assembly',
    icon: 'hose',
    summary: 'Hydraulic hose assemblies crimped and pressure-tested in house, made to your specification or matched to a failed sample.',
    points: ['Bore, length, fitting type and orientation matched', 'Proof-tested, with certificates on request', 'Standard assemblies typically ready the same day'],
    products: ['hydraulic-hoses', 'hydraulic-pumps'],
  },
  {
    id: 'emergency-supply',
    name: 'Emergency Supply',
    icon: 'bolt',
    summary: 'Breakdown support for plant shutdowns. Urgent express deliveries can be arranged on request.',
    points: ['Tell us the machine is down at the point of enquiry', 'Stock items prioritised for same-day dispatch where possible', 'Express courier arranged for urgent breakdowns'],
    products: ['hydraulic-hoses', 'industrial-bearings', 'elevator-accessories'],
  },
  {
    id: 'scheduled-supply',
    name: 'Scheduled Supply',
    icon: 'calendar',
    summary: 'Recurring deliveries for regular consumables, with agreed stock levels held for call-off on fast-moving lines.',
    points: ['Itemised pricing per line on annual or quarterly volumes', 'Agreed stock levels held for call-off', 'Planned maintenance supply scheduling'],
    products: ['abrasive-brushes', 'industrial-air-filters', 'cutting-tools'],
  },
  {
    id: 'procurement-support',
    name: 'Procurement Support',
    icon: 'file',
    summary: 'Quotations and documentation structured for procurement teams, so lines can be compared and approved quickly.',
    points: ['Itemised quotations with grade, size and standard stated', 'Commercial invoice, packing list, COO and MTC where required', 'One named contact who stays with the account'],
    products: [],
  },
  {
    id: 'technical-consultation',
    name: 'Technical Consultation',
    icon: 'wrench',
    summary: 'Application-led advice on grade, pressure, temperature, duty cycle and material compatibility, to avoid costly mis-specification.',
    points: ['Cutting-data sheets supplied with tooling packages', 'Filtration grade advice for high-dust Gulf conditions', 'Hose and bearing selection for heat, impulse and sand ingress'],
    products: ['cutting-tools', 'industrial-air-filters', 'hydraulic-hoses'],
  },
];

/* ------------------------------------------------------------------ */
/* Industries (served at /sectors and /sectors/<slug>)                 */
/* ------------------------------------------------------------------ */

export const sectors = [
  {
    slug: 'manufacturing',
    name: 'Manufacturing & Production',
    short: 'Manufacturing',
    image: '/images/industries/manufacturing.webp',
    title: 'Manufacturing Supplies UAE | Tooling, Brushes & Bearings',
    metaDesc: 'Industrial supplies for UAE manufacturing plants — abrasive brushes for automated deburring, CNC tooling, bearings with batch traceability and hydraulic pumps for presses.',
    summary: 'Continuous-duty tooling, machinery spares and abrasive brushes that keep production lines running and finish quality consistent.',
    overview: 'Production plants buy on uptime. A worn brush segment, a mis-specified end mill or a bearing that fails early stops a line, and the cost of that stoppage is far larger than the cost of the part. Our role is to specify consumables to the duty cycle so that replacement becomes predictable.',
    requirements: ['Repeatable finish from automated deburring and surface preparation', 'Tooling supplied with cutting data, not just a part number', 'Bearings with recorded batch numbers for maintenance records', 'Hydraulic power for stamping and moulding presses'],
    products: ['abrasive-brushes', 'cutting-tools', 'industrial-bearings', 'hydraulic-pumps', 'industrial-air-filters'],
    applications: ['Automated deburring with silicon carbide and ceramic grit segments', 'CNC milling and turning with micro-grain carbide end mills and indexable inserts', 'Deep groove and cylindrical roller bearings in motors, gearboxes and conveyors', 'Vane and gear pumps for production stamping presses'],
    considerations: [
      ['Replace on condition, not calendar', 'Brush trim height, filter differential pressure and bearing vibration give earlier and more reliable warning than fixed intervals.'],
      ['Specify for the material', 'Grit, coating and pitch should follow the workpiece material. The wrong choice shows up as rework, not as a failed tool.'],
    ],
    guides: ['abrasive-removal-brush-segments-guide', 'precision-vs-standard-bearings'],
  },
  {
    slug: 'oil-and-gas',
    name: 'Oil, Gas & Petrochemicals',
    short: 'Oil & Gas',
    image: '/images/industries/oil-and-gas.webp',
    title: 'Oil & Gas Industrial Supplies UAE | Hoses, Filters, Bearings',
    metaDesc: 'High-pressure hydraulic hose, coalescer and dust filtration, sealed spherical roller bearings and weld cleaning brushes for UAE oil, gas and petrochemical operations.',
    summary: 'High-pressure fluid lines, harsh-duty filtration and traceable spares for upstream, midstream and refinery operations.',
    overview: 'Oil, gas and petrochemical sites combine high pressure, sustained heat and abrasive dust, and most of them run strict documentation and site-entry requirements. We prepare certificates and documentation in advance so that delivery is not held at the gate.',
    requirements: ['Spiral-reinforced hose for high pressure and impulse cycling', 'Coalescer and heavy-dust filtration for desert loading', 'Contact-sealed bearings for dirty, high-load positions', 'Certificates, MTCs and documentation prepared for site entry'],
    products: ['hydraulic-hoses', 'industrial-air-filters', 'industrial-bearings', 'abrasive-brushes'],
    applications: ['4SP / 4SH multi-spiral hose on rig equipment and pressure lines', 'Coalescer and depth filter elements on compressor and turbine intakes', 'Spherical roller bearings with contact seals for pumps and conveyors', 'Stainless steel cup and wheel brushes for weld cleaning before inspection'],
    considerations: [
      ['Heat shortens hose life', 'Sustained high ambient temperature hardens the inner tube. Specify a higher temperature rating and sleeve exposed runs.'],
      ['Filtration grade pays for itself', 'Fine silica passes coarse elements readily. Upgrading the primary stage and adding a pre-filter is usually cheaper than the wear it prevents.'],
    ],
    guides: ['hydraulic-hose-failure-prevention', 'industrial-air-filters-arid-climates'],
  },
  {
    slug: 'construction',
    name: 'Construction & Infrastructure',
    short: 'Construction',
    image: '/images/industries/construction.webp',
    title: 'Construction Industrial Supplies UAE | Hydraulics & Blades',
    metaDesc: 'Hydraulic hose assemblies, excavator pump spares, bandsaw blades and dust filtration for UAE construction and infrastructure contractors.',
    summary: 'Heavy-duty hydraulic assemblies, excavator pump spares and durable cutting consumables for civil and site works.',
    overview: 'On a construction site the critical failures are hydraulic: a burst hose or a tired pump idles a machine and the crew around it. Assemblies made to sample and spares matched by model number shorten that downtime.',
    requirements: ['Replacement hose assemblies matched to a failed sample', 'Pump spares for excavators, loaders and cranes', 'Bandsaw blades for structural steel and rebar processing', 'Air filtration for plant working in heavy dust'],
    products: ['hydraulic-hoses', 'hydraulic-pumps', 'bandsaw-blades', 'industrial-air-filters'],
    applications: ['Excavator, loader and crane hydraulic circuits', 'Mobile plant hydraulic pumps and power units', 'Structural steel and beam cutting', 'Engine and compressor intake filtration on site plant'],
    considerations: [
      ['Respect the bend radius', 'Hose routed tighter than the manufacturer minimum fails early, whatever its pressure rating.'],
      ['Most pump failures are system failures', 'Contaminated fluid and restricted suction lines cause more pump failures than the pump itself.'],
    ],
    guides: ['hydraulic-hose-failure-prevention', 'bimetal-vs-carbide-bandsaw-blades'],
  },
  {
    slug: 'automotive',
    name: 'Automotive & Assembly',
    short: 'Automotive',
    image: '/images/industries/automotive.webp',
    title: 'Automotive Industrial Supplies UAE | Hoses, Bearings, Tools',
    metaDesc: 'Precision bearings, hydraulic hoses, deburring brushes and cutting tools for UAE automotive manufacturing, engine rebuilders and fleet workshops.',
    summary: 'Precision components, hydraulic lines and finishing tooling for automotive manufacturing, engine rebuilders and fleet workshops.',
    overview: 'Automotive work mixes precision machining with heavy workshop duty. Component finish and dimensional accuracy matter on the production side; on the fleet side, the priority is getting a vehicle or lift back into service quickly.',
    requirements: ['Deburring that does not alter dimensional tolerance', 'Precision bearings where runout matters', 'Hydraulic lines for workshop lifts, presses and test rigs', 'Cutting tools matched to the component material'],
    products: ['abrasive-brushes', 'industrial-bearings', 'hydraulic-hoses', 'cutting-tools', 'hydraulic-pumps'],
    applications: ['Edge finishing of machined components with abrasive nylon brushes', 'Bearings for motors, gearboxes and rotating assemblies', 'Workshop power packs, presses and test rigs', 'Aluminium high-speed machining'],
    considerations: [
      ['Match tolerance class to duty', 'P5 or P4 precision bearings matter for spindles and high speed. For general motor duty, standard P0 is usually the right and more economical choice.'],
      ['Grit follows the metal', 'Silicon carbide in the 120 – 320 range suits aluminium; coarser grits load and smear on soft non-ferrous metal.'],
    ],
    guides: ['precision-vs-standard-bearings', 'abrasive-removal-brush-segments-guide'],
  },
  {
    slug: 'engineering-fabrication',
    name: 'Engineering & Fabrication',
    short: 'Engineering & Fabrication',
    image: '/images/industries/engineering-fabrication.webp',
    title: 'Fabrication Supplies UAE | Bandsaw Blades, End Mills, Brushes',
    metaDesc: 'Bandsaw blades welded to length, carbide end mills and taps, and descaling and weld cleaning brushes for UAE metal fabricators and CNC machine shops.',
    summary: 'Bandsaw blades welded to length, carbide tooling and descaling brushes for metal fabricators and machine shops.',
    overview: 'Fabricators buy on cut quality and consumable life rather than headline price. Specifying the correct pitch, grade and coating first usually lowers the cost per cut, even when the item itself costs more.',
    requirements: ['Blades welded to the machine’s band length', 'Tooth pitch matched to section and wall thickness', 'Carbide tooling with cutting data for the material', 'Wheel and cup brushes for descaling and weld cleaning'],
    products: ['bandsaw-blades', 'cutting-tools', 'abrasive-brushes'],
    applications: ['Structural steel, solid bar and tube bundle cutting', 'Stainless and exotic alloy sawing', 'CNC milling, drilling, tapping and reaming', 'Weld seam cleaning and descaling before coating'],
    considerations: [
      ['Three to six teeth in the cut', 'Thin-wall tube needs a fine pitch; heavy solid section needs a coarse pitch to clear the chip.'],
      ['Break new blades in', 'Run the first 50 – 100 cm² of cut at reduced feed to hone the tooth tips. Skipping it can halve blade life.'],
    ],
    guides: ['bimetal-vs-carbide-bandsaw-blades', 'abrasive-removal-brush-segments-guide'],
  },
  {
    slug: 'facility-management',
    name: 'Facility Management & HVAC',
    short: 'Facility Management',
    image: '/images/industries/facility-management.webp',
    title: 'Facility Management Supplies UAE | Elevator Spares & Filters',
    metaDesc: 'Elevator spares, HVAC air filters, guide shoes, door rollers and motor bearings for UAE facility management teams and building maintenance contractors.',
    summary: 'Elevator spares, HVAC filtration and maintenance consumables that keep buildings running.',
    overview: 'Facility teams are judged on uptime and compliance. Door faults are the most common cause of lift entrapment call-outs, and HVAC filters in dusty areas load far faster than manufacturer defaults assume.',
    requirements: ['Lift spares matched by make, model or photograph', 'Components manufactured to EN 81-20 / EN 81-50', 'HVAC filter elements from G4 to H14', 'Breakdown spares for emergency call-outs'],
    products: ['elevator-accessories', 'industrial-air-filters', 'industrial-bearings', 'hydraulic-pumps'],
    applications: ['Scheduled preventive maintenance in commercial towers', 'Door rollers, guide shoes and buffers after inspection findings', 'HVAC plant filtration in high-dust areas', 'Replacement motor and fan bearings'],
    considerations: [
      ['Inspect guide shoes quarterly', 'Liners typically need replacing every 12 to 24 months depending on traffic. Replace door rollers as soon as play, flat spots or noise develop.'],
      ['Change filters on pressure drop', 'Fit a gauge and replace at the manufacturer threshold — in Gulf dust this is often two to three times sooner than the default interval.'],
    ],
    guides: ['elevator-spares-inspection-checklist', 'industrial-air-filters-arid-climates'],
  },
];

/* ------------------------------------------------------------------ */
/* Pillar page: /abrasive-brushes-for-shot-blast-machines              */
/* ------------------------------------------------------------------ */

export const pillar = {
  slug: 'abrasive-brushes-for-shot-blast-machines',
  title: 'Abrasive Brushes for Shot Blast Machines | UAE Supplier',
  desc: 'Replacement brush segments and blow-off brushes for shot blast and wheel blast machines in the UAE. Built to drawing for any frame, with fill, trim and backing matched to your machine.',
  keywords: 'Abrasive Brush Shot Blast Machine, Blast Machine Brush UAE, Shot Blast Machine Brush Dubai, Blow Off Brush UAE, Wheel Blast Machine Brush, Blast Machine Spares UAE, Brush Segment Blast Machine',
  headline: 'Abrasive Brushes for Shot Blast Machines: Selection and Replacement Guide',
  image: '/images/sp.png',
  date: '2026-08-26',
  compare: [
    ['Crimped steel wire', 'Steel plate, structural section, heavy scale', 'Aggressive sweep, dislodges trapped shot', 'Can mark soft or coated substrate'],
    ['Abrasive nylon (SiC)', 'Mixed substrate, light descaling in the same pass', 'Cuts as it sweeps, non-sparking', 'Higher cost per segment'],
    ['Plain nylon', 'Non-ferrous, pre-coated, thin gauge', 'No surface marking, quiet running', 'Less effective on heavy carry-over'],
    ['Tampico / natural', 'Delicate finishes, wet applications', 'Very soft, absorbs fluid', 'Short life in abrasive service'],
  ],
  faqs: [
    ['What does the brush on a shot blast machine actually do?', 'On most wheel blast and plate blast machines the brush sits at the exit and performs blow-off: it sweeps residual steel shot, grit and dust off the workpiece before it leaves the cabinet. Without it, abrasive is carried out of the machine, which loses expensive media, contaminates downstream coating and creates a housekeeping hazard.'],
    ['Can you supply brushes for any make of blast machine?', 'Yes. Blast machine brushes are almost never a catalogue item, because every manufacturer uses its own segment length, backing profile and mounting centres. Send the dimensions, a drawing, or simply the worn segment, and we build a replacement to match.'],
    ['Which fill material is best for blast machine blow-off?', 'For general steel plate and section, crimped steel wire gives the aggressive sweep needed to dislodge trapped shot. Where the substrate must not be marked — non-ferrous, pre-coated or thin gauge material — use nylon or abrasive nylon instead, which clears media without scoring the surface.'],
    ['How do I know when blast machine brushes need replacing?', 'The practical indicator is media carry-over: when you start finding shot on the conveyor beyond the cabinet or in the paint area, the trim has worn past its effective contact length. Measuring trim height against the original dimension at each shift change gives you a predictable replacement interval.'],
    ['Do you supply the abrasive media as well as the brushes?', 'Our focus is the brush consumables and the surrounding wear parts — segments, backing channel, mounting hardware, bearings and drive components. We work alongside your existing media supplier rather than replacing them.'],
    ['How quickly can replacement segments be supplied in the UAE?', 'Where the profile matches a standard backing we can often build within a few working days. Fully bespoke segments, or those needing a non-standard channel, typically run two to four weeks. If the machine is down, tell us — we will quote a short-run interim set alongside the full order.'],
  ],
};

/* ------------------------------------------------------------------ */
/* Legal pages                                                         */
/* ------------------------------------------------------------------ */

export const legalPages = [
  {
    slug: 'delivery-policy',
    eyebrow: 'Logistics & dispatch',
    name: 'Delivery & Shipping Policy',
    intro: 'Standard operating procedures, dispatch lead times and freight terms for domestic UAE deliveries and international GCC shipments.',
    title: 'Delivery & Shipping Policy | Mechaura International UAE',
    desc: 'Review Mechaura International’s delivery policy, UAE express dispatch timelines, GCC freight export terms, heavy machinery handling and order inspection protocols.',
    keywords: 'Mechaura Delivery Policy, Industrial Supplies Shipping UAE, Dubai Machinery Delivery, GCC Industrial Freight, Same Day Tool Delivery Dubai',
  },
  {
    slug: 'privacy-policy',
    eyebrow: 'Data protection & privacy',
    name: 'Privacy Policy',
    intro: 'Our commitment to protecting your enterprise data, personal information and commercial communications in accordance with UAE Federal Data Protection Law.',
    title: 'Privacy Policy | Mechaura International UAE',
    desc: 'Read Mechaura International’s Privacy Policy. Learn how we collect, safeguard and process your business data in compliance with UAE Data Protection Law & international standards.',
    keywords: 'Mechaura Privacy Policy, UAE Data Protection, Industrial Trading Privacy Dubai, Business Information Security UAE',
  },
  {
    slug: 'terms-conditions',
    eyebrow: 'Commercial contract standards',
    name: 'Terms & Conditions',
    intro: 'Legal and commercial conditions governing supply agreements, quotations, product warranties and transactions with Mechaura International.',
    title: 'Terms and Conditions | Mechaura International UAE',
    desc: 'Commercial terms and conditions governing industrial supply contracts, purchase orders, quotations, warranties and jurisdiction with Mechaura International in Dubai, UAE.',
    keywords: 'Mechaura Terms and Conditions, Industrial Procurement Terms Dubai, Commercial Contract Terms UAE, Industrial Equipment Warranty Dubai',
  },
];
