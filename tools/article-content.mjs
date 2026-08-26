/**
 * Full article bodies for /blog/<slug>.
 *
 * The originals in blog.html ran 76–311 words, which is too thin to rank and
 * risks a thin-content classification. These are expanded to genuine depth
 * with the specifications, comparisons and Q&A that both search engines and
 * AI answer engines reward.
 *
 * Block types: p | h2 | h3 | ul | ol | table | callout | faq
 */

export const articles = {
  'abrasive-removal-brush-segments-guide': {
    tldr: 'Abrasive removal brush segments use flexible nylon filaments impregnated with silicon carbide or ceramic grit to deburr, descale and finish metal without altering dimensional tolerance. Selection comes down to three variables: filament grit, trim length and surface speed. Get those right and the brush cuts consistently; get them wrong and it either smears or wears out in hours.',
    blocks: [
      ['h2', 'What are abrasive removal brush segments?'],
      ['p', 'Abrasive removal brush segments are modular surface-finishing tools built from polymer or steel filaments infused with industrial abrasive grit. They are designed to remove burrs, edge fractures and thermal oxides from machined parts without the dimensional risk that comes with rigid grinding media.'],
      ['p', 'The word <strong>segment</strong> matters. Rather than replacing an entire brush head when the filaments wear, individual blocks are unclipped and swapped. On a production line running two shifts, that difference alone typically halves consumable spend over a year.'],

      ['h2', 'Why brush finishing beats rigid abrasives for deburring'],
      ['p', 'In high-production machine shops across Dubai and Abu Dhabi, post-machining edge finishing can absorb up to a quarter of total component processing time. Three approaches compete for that work, and they are not equivalent.'],
      ['p', 'Rigid grinding wheels cut fast but do not conform. On a component with tight-tolerance features, a wheel will gouge an edge before the operator sees it happening. Manual deburring with hand files conforms perfectly but introduces operator-to-operator inconsistency that shows up in inspection.'],
      ['p', 'Abrasive brush segments sit between the two. The filaments flex around complex geometry while the embedded grit does the cutting, which produces a repeatable micro-radius rather than a variable chamfer. For any part where the edge condition is specified on the drawing, that repeatability is the whole argument.'],

      ['h2', 'Filament material: silicon carbide, ceramic or steel'],
      ['p', 'Fill choice is driven by the workpiece material and the finish you need, not by the machine. These are the three we supply most.'],
      ['table', {
        head: ['Fill type', 'Best suited to', 'Typical grit range', 'Watch out for'],
        rows: [
          ['Silicon carbide nylon', 'Aluminium, brass, copper, plastics', '120 – 500', 'Loads and smears if run too slow or too hard'],
          ['Ceramic nylon', 'Hardened steel, stainless, cast iron', '80 – 320', 'More aggressive — verify edge tolerance first'],
          ['Crimped steel wire', 'Heavy scale, weld spatter, structural steel', 'n/a (mechanical)', 'Will mark soft substrate; not for finishing passes'],
        ],
      }],
      ['p', 'A practical rule: if the part is non-ferrous or pre-coated, start with silicon carbide. If it is hardened steel or stainless and the brush seems to be polishing rather than cutting, move to ceramic.'],

      ['h2', 'Getting the cutting parameters right'],
      ['p', 'More brush failures come from wrong parameters than from wrong product. Four numbers matter.'],
      ['ul', [
        '<strong>Surface speed.</strong> Abrasive nylon works between roughly 8 and 20 m/s. Below that the filament flexes instead of cutting; above it the nylon softens and glazes.',
        '<strong>Interference (depth of engagement).</strong> Typically 2 – 5 mm of filament compression. More pressure does not cut faster — it bends the filament so the grit stops presenting to the work.',
        '<strong>Direction.</strong> Reversing rotation periodically evens out the wear taper and can extend usable life by 20 – 30 percent.',
        '<strong>Coolant.</strong> Wet running on aluminium prevents the smearing that otherwise welds swarf into the filament tips.',
      ]],
      ['callout', 'The single most common mistake we see is running the brush too slowly with too much pressure. It feels like it should cut more. It does the opposite — the abrasive stops contacting the work, the filament does the rubbing, and life collapses.'],

      ['h2', 'Brush segments on blast machines'],
      ['p', 'A distinct application worth separating out: shot blast and wheel blast machines use brush segments at the cabinet exit for <strong>blow-off</strong>, sweeping residual steel shot and grit off the workpiece before it leaves the machine.'],
      ['p', 'These are almost never catalogue items, because every blast machine manufacturer uses its own backing profile and mounting centres. We cover the selection and replacement process in detail on our dedicated page for <a href="/abrasive-brushes-for-shot-blast-machines">abrasive brushes for shot blast machines</a>.'],

      ['h2', 'Estimating replacement intervals'],
      ['p', 'Filament life depends on contact pressure, surface speed and workpiece material, so any number is indicative. As a planning figure, abrasive nylon segments in continuous deburring service run 80 – 200 operating hours before trim length falls below effective contact.'],
      ['p', 'The practical method is to measure trim height at each shift change against the original dimension. Once you have two or three data points you have a wear rate, and replacement becomes a scheduled item rather than a line stoppage.'],

      ['h2', 'Common questions'],
      ['faq', [
        ['What grit should I use for deburring aluminium?', 'Silicon carbide abrasive nylon in the 120 – 320 grit range. Coarser grit loads and smears on soft non-ferrous metal. Keep surface speed below roughly 12 m/s and run wet where the machine allows.'],
        ['Can abrasive brush segments be customised for a specific spindle mount?', 'Yes. Provide the arbor diameter, backing profile and mounting centres — or send a sample of the worn segment — and we build to that drawing. Custom mounts are routine rather than exceptional in this product group.'],
        ['How do I prevent filament smearing on aluminium parts?', 'Smearing means the nylon is softening before the grit cuts. Reduce interference to 2 – 3 mm, raise surface speed into the 12 – 18 m/s band, and introduce coolant. If it persists, the grit is too fine for the stock removal you are asking for.'],
        ['Do brush segments alter part dimensions?', 'Correctly specified, no. The filaments conform and produce a controlled micro-radius on the edge rather than removing material from the face. This is precisely why brush finishing is preferred over rigid abrasives on tight-tolerance components.'],
      ]],
    ],
  },

  'hydraulic-hose-failure-prevention': {
    tldr: 'Most hydraulic hose failures in the Gulf trace back to four causes: thermal hardening of the inner tube, bend radius below the manufacturer minimum, pressure surge beyond the rated impulse cycles, and UV plus abrasive sand attacking the cover. Correct construction choice and a date-based replacement policy prevent nearly all of them.',
    blocks: [
      ['h2', 'What a certified high-pressure hydraulic hose actually is'],
      ['p', 'A hydraulic hose is a layered assembly, and each layer has one job. The inner tube contains the fluid and must be chemically compatible with it. The reinforcement — wire braid or spiral wound — carries the pressure. The outer cover protects the reinforcement from abrasion, ozone and UV.'],
      ['p', 'Certification means the assembly has been manufactured and tested to a published standard: EN 853 for braided, EN 856 for spiral, or the SAE 100R series. The standard fixes minimum burst pressure at four times working pressure and specifies an impulse cycle count the construction must survive.'],

      ['h2', 'Wire-braided versus spiral-reinforced'],
      ['p', 'This is the decision that determines whether an assembly lasts years or months, and it is frequently made on price instead of duty cycle.'],
      ['table', {
        head: ['Property', 'Wire braided (1SN / 2SN)', 'Spiral reinforced (4SP / 4SH / R12)'],
        rows: [
          ['Reinforcement', 'One or two crossed braid layers', 'Four or six alternating wound layers'],
          ['Working pressure', 'Up to ~400 bar (small bore)', 'Up to 420 bar sustained at larger bore'],
          ['Impulse resistance', 'Moderate', 'High — designed for surge cycling'],
          ['Flexibility', 'More flexible, tighter bend radius', 'Stiffer, larger minimum bend radius'],
          ['Best for', 'Steady pressure, frequent flexing', 'Shock loading, high-cycle impulse duty'],
        ],
      }],
      ['p', 'The short version: if the circuit sees pressure spikes or reversing loads, specify spiral. If it flexes constantly at steady pressure, braided will outlast spiral because it tolerates the movement.'],

      ['h2', 'Why hoses fail early in UAE conditions'],
      ['p', 'Gulf operating conditions attack hydraulic hose in ways temperate-climate design assumptions do not anticipate.'],
      ['ol', [
        '<strong>Thermal hardening.</strong> Sustained ambient above 45 °C, combined with fluid temperature, drives the inner tube past its design range. The elastomer hardens, loses elasticity and cracks at the next pressure cycle.',
        '<strong>Bend radius violation.</strong> Routing a hose tighter than its minimum radius concentrates stress on the outer reinforcement wires. This is the most common installation error and it is entirely avoidable.',
        '<strong>Pressure surge.</strong> Rapid valve closure generates spikes well above nominal working pressure. Rated impulse cycles are consumed far faster than the operator realises.',
        '<strong>UV and sand abrasion.</strong> Exposed runs lose cover integrity, wire begins to corrode, and burst follows. Spiral guard or sleeving on exposed sections is cheap insurance.',
      ]],

      ['h2', 'A replacement policy that works'],
      ['p', 'Most manufacturers recommend replacing hydraulic hose every five to seven years from the date of manufacture regardless of visual condition — the layline carries that date, and it is worth recording at installation.'],
      ['p', 'Replace immediately, without waiting for a scheduled interval, on any of the following: cover cracking or blistering, any wire visible through the cover, weeping or seepage at the ferrule, kinking or crushing, or a fitting that has begun to corrode.'],
      ['callout', 'A hose that is weeping at the ferrule is not a slow leak to monitor. It is a burst that has not happened yet. At 350 bar, the fluid jet from a pinhole will penetrate skin — treat it as an immediate change-out.'],

      ['h2', 'Specifying a replacement assembly'],
      ['p', 'To build a correct replacement we need bore size, overall length, both fitting types and their orientation relative to each other, and the working pressure. If you have the failed assembly, bring it — we take the dimensions directly and remove the guesswork.'],
      ['p', 'Assemblies are crimped and proof-tested in house, with test certificates supplied on request. Standard configurations are generally ready the same working day. See our <a href="/products/hydraulic-hoses">hydraulic hoses and fittings</a> page for the full range.'],

      ['h2', 'Common questions'],
      ['faq', [
        ['How often should hydraulic hoses be replaced?', 'Every five to seven years from the manufacture date printed on the layline, regardless of appearance — and immediately on any sign of cover cracking, wire exposure, blistering or ferrule weeping.'],
        ['What causes thermal hardening of a hydraulic hose?', 'Sustained operation above the inner tube temperature rating. In the Gulf, high ambient plus fluid temperature routinely exceeds standard ratings. Specifying a higher-temperature construction addresses it directly.'],
        ['Can I use a 2SN hose to replace a 4SP hose?', 'Not as a like-for-like substitution. 4SP is specified where impulse cycling or shock load is present, and a braided hose will not survive the same duty. Match or exceed the original construction.'],
        ['Do you supply test certificates with hose assemblies?', 'Yes, on request. Assemblies are crimped and proof-tested in house, and we can provide documented test results for assemblies going into certified or audited installations.'],
      ]],
    ],
  },

  'elevator-spares-inspection-checklist': {
    tldr: 'Lift wear parts follow predictable replacement cycles: guide shoe inserts every 12–24 months, door rollers on condition, governor and safety gear on annual test. Door faults cause the majority of entrapment call-outs, so door-system components deserve the closest inspection attention.',
    blocks: [
      ['h2', 'What counts as an elevator wear part'],
      ['p', 'Elevator accessories are the consumable and safety-critical components of a lift installation: the guide rails and shoes that locate the car in the shaft, the door operator and its rollers, the overspeed governor and safety gear, and the buffers in the pit.'],
      ['p', 'They are not permanent fixtures. Each has a defined inspection interval and a replacement cycle, and treating them as run-to-failure items is the root cause of most unplanned lift downtime in commercial buildings.'],

      ['h2', 'The quarterly inspection checklist'],
      ['ol', [
        '<strong>Guide shoe liners.</strong> Check for lateral play in the car. Excess play means the liner has worn and the car is beginning to rock — replace before it damages the rail face.',
        '<strong>Door rollers.</strong> Look for flat spots, radial play and audible noise on operation. Door faults account for the largest share of entrapment call-outs.',
        '<strong>Door skates and locks.</strong> Verify engagement depth and that the lock circuit breaks correctly. Any lock fault is an immediate out-of-service condition.',
        '<strong>Governor switch.</strong> Confirm operation and that the trip speed setting matches the rated speed on the installation certificate.',
        '<strong>Buffers.</strong> Inspect polyurethane buffers for compression set and cracking; check oil level on hydraulic buffers.',
        '<strong>Traction ropes.</strong> Check for broken wires, diameter reduction and uneven tension between ropes.',
      ]],

      ['h2', 'Replacement intervals worth planning around'],
      ['table', {
        head: ['Component', 'Inspection interval', 'Typical replacement'],
        rows: [
          ['Guide shoe inserts', 'Quarterly', '12 – 24 months by traffic intensity'],
          ['Door rollers', 'Quarterly', 'On condition — flat spots or play'],
          ['Door operator belt', 'Six-monthly', '3 – 5 years'],
          ['Overspeed governor', 'Annual test', 'On test failure or 10 – 15 years'],
          ['Safety gear', 'Annual test', 'On test failure'],
          ['Polyurethane buffers', 'Quarterly visual', '8 – 12 years or on compression set'],
        ],
      }],
      ['p', 'High-traffic residential towers and buildings with heavy goods-lift use sit at the short end of every range in that table. Low-rise offices with light duty sit at the long end.'],

      ['h2', 'Compliance in the UAE'],
      ['p', 'Components supplied for UAE installations should be manufactured to EN 81-20 and EN 81-50, the standards referenced by UAE Civil Defence and municipality lift requirements. For safety-critical parts — safety gear, governors, locks — declarations of conformity and test certificates should be obtained and retained with the maintenance record.'],
      ['callout', 'When a lift is inspected and a component cannot be evidenced as conforming, the practical outcome is the same as if it were non-conforming. Keep the certificates with the log book, not in a supplier email.'],

      ['h2', 'Sourcing spares for older installations'],
      ['p', 'The hardest part of lift maintenance in a mature building stock is obsolete spares. Original manufacturers discontinue parts, and building managers are told the only option is full modernisation.'],
      ['p', 'That is often not true. Most wear parts are dimensionally standard even when the part number is dead. Send the make, model and a photograph or the worn component, and a dimensional equivalent can usually be identified. See our <a href="/products/elevator-accessories">elevator accessories and spares</a> range.'],

      ['h2', 'Common questions'],
      ['faq', [
        ['How frequently should elevator guide shoes and door rollers be replaced?', 'Guide shoe inserts should be inspected quarterly and replaced every 12 to 24 months depending on traffic intensity. Door rollers are replaced on condition — immediately if radial play, flat spots or noise develop.'],
        ['What is the difference between progressive and instantaneous safety gear?', 'Instantaneous gear grips the rail abruptly and is only permitted on lower-speed lifts. Progressive gear brakes over a controlled distance to limit deceleration, and is required above roughly 1 m/s rated speed. The lift design determines which is fitted.'],
        ['Can spares be supplied for a discontinued lift model?', 'Usually yes. Most wear parts are dimensionally standard even when the original part number is obsolete. Provide the make, model and a photograph or sample and a dimensional equivalent can generally be sourced.'],
        ['Are EN 81-20 components accepted in the UAE?', 'Yes. EN 81-20 and EN 81-50 are the component standards referenced by UAE Civil Defence and municipality lift requirements. Conformity declarations should be retained with the maintenance record.'],
      ]],
    ],
  },

  'precision-vs-standard-bearings': {
    tldr: 'Precision bearings (ISO tolerance class P5 or P4) offer tighter runout and more predictable clearance than standard P0. They are worth the cost where spindle accuracy, high speed or low vibration is critical — and a waste of money on general conveyor and motor duty, where P0 is the correct engineering choice.',
    blocks: [
      ['h2', 'What "precision" means in a bearing specification'],
      ['p', 'Precision is not a marketing word here — it refers to a specific ISO 492 tolerance class. Standard bearings are class P0 (also written Normal). Precision grades run P6, P5, P4 and P2, each tightening the permitted deviation on bore, outside diameter, width and running accuracy.'],
      ['p', 'The practical consequence is runout. A P4 bearing holds the shaft closer to true rotation than a P0 bearing, which matters enormously on a grinding spindle and not at all on a conveyor idler.'],

      ['h2', 'Precision versus standard: where the difference shows'],
      ['table', {
        head: ['Factor', 'Standard (P0)', 'Precision (P5 / P4)'],
        rows: [
          ['Radial runout', 'Higher permitted deviation', 'Substantially tighter'],
          ['Speed capability', 'Adequate for general duty', 'Higher — less heat from imbalance'],
          ['Vibration', 'Acceptable for most machinery', 'Markedly lower'],
          ['Cost', 'Baseline', 'Typically 2 – 5× baseline'],
          ['Correct application', 'Motors, conveyors, pumps, fans', 'Machine tool spindles, high-speed rotors, metrology'],
        ],
      }],
      ['callout', 'Fitting a precision bearing into a housing machined to standard tolerance gains you nothing. The bearing class has to be matched by the shaft and housing tolerance, or the accuracy is lost before the assembly turns.'],

      ['h2', 'Choosing bearing type by load condition'],
      ['p', 'Tolerance class is one axis of the decision. Bearing type is the other, and it is driven by the load and alignment condition.'],
      ['ul', [
        '<strong>Deep groove ball.</strong> Moderate radial load with some axial capacity. The default for electric motors and general machinery.',
        '<strong>Angular contact.</strong> Combined radial and one-directional axial load. Used in pairs for spindles.',
        '<strong>Spherical roller.</strong> Very high radial load with several degrees of static misalignment tolerance. The standard choice for crushers, screens and long conveyor shafts.',
        '<strong>Tapered roller.</strong> Heavy combined radial and axial load. Common in wheel hubs and gearboxes.',
        '<strong>Needle roller.</strong> High radial load in a restricted radial envelope.',
        '<strong>Thrust.</strong> Pure axial load.',
      ]],

      ['h2', 'Sand ingress: the dominant failure mode in the Gulf'],
      ['p', 'Across the customers we supply in the UAE, abrasive dust contamination causes more premature bearing failure than overloading, misalignment and lubrication faults combined.'],
      ['p', 'Fine silica passes shields readily, scores the raceway and contaminates the grease into a lapping compound. The bearing then destroys itself through a wear mechanism that has nothing to do with its load rating.'],
      ['p', 'Two countermeasures matter more than any bearing upgrade: specify 2RS contact seals rather than ZZ shields on exposed positions, and shorten regreasing intervals in dusty environments. Both are cheap relative to an unplanned shutdown.'],

      ['h2', 'Clearance selection'],
      ['p', 'Internal clearance is specified separately from tolerance class. CN (normal) suits most applications. C3 — greater than normal — is specified where the inner ring runs hot relative to the outer, because thermal expansion consumes clearance in service. Bearings in hot applications fitted with CN clearance can preload themselves to failure.'],
      ['p', 'Our full range and interchange lookup is on the <a href="/products/industrial-bearings">industrial bearings</a> page.'],

      ['h2', 'Common questions'],
      ['faq', [
        ['Is a precision bearing always better than a standard one?', 'No. Precision classes cost several times more and deliver benefit only where runout, speed or vibration is critical. On conveyors, fans, pumps and standard motors, P0 is the correct engineering choice, not a compromise.'],
        ['Which bearing suits high radial load with shaft misalignment?', 'A spherical roller bearing. Two rows of barrel rollers run on a common spherical raceway, accommodating several degrees of static misalignment while carrying very high radial load.'],
        ['What does C3 clearance mean and when do I need it?', 'C3 is greater-than-normal internal clearance. Specify it where the inner ring runs significantly hotter than the outer, since thermal expansion consumes clearance in service. Using CN in a hot application risks self-preloading.'],
        ['Do you cross-reference SKF, FAG and NSK part numbers?', 'Yes. Provide your existing part number and we return the genuine item where available plus dimensional equivalents across the major manufacturers, with clearance and cage type stated so the comparison is like for like.'],
      ]],
    ],
  },

  'bimetal-vs-carbide-bandsaw-blades': {
    tldr: 'Bi-metal M42 covers most general fabrication at the lowest cost per cut. Carbide-tipped becomes cheaper per cut on hardened steel, thick stainless, nickel alloys and titanium. Tooth pitch should keep three to six teeth engaged in the cut at all times — get that wrong and teeth strip regardless of blade grade.',
    blocks: [
      ['h2', 'How a bandsaw blade is constructed'],
      ['p', 'A bandsaw blade is a continuous toothed band running between two wheels. In metal cutting, the useful designs are composites: a hard cutting edge bonded to a flexible backing, so the teeth resist wear while the band survives millions of flex cycles around the wheels.'],
      ['p', 'Bi-metal blades electron-beam weld an M42 or M51 high-speed-steel wire to an alloy steel backing, then form the teeth from the HSS edge. Carbide-tipped blades braze individual tungsten carbide tips to the backing instead.'],

      ['h2', 'Bi-metal versus carbide: the real comparison'],
      ['table', {
        head: ['Factor', 'Bi-metal M42 / M51', 'Carbide tipped'],
        rows: [
          ['Blade cost', 'Baseline', '3 – 6× baseline'],
          ['Mild / structural steel', 'Excellent — lowest cost per cut', 'Overspecified'],
          ['Stainless above 40 mm', 'Teeth dull quickly', 'Substantially better life'],
          ['Nickel alloys, titanium', 'Poor', 'The only practical choice'],
          ['Cutting speed', 'Moderate', 'Higher surface speed sustainable'],
          ['Shock tolerance', 'Better — more forgiving of interrupted cut', 'Tips chip on impact or vibration'],
        ],
      }],
      ['p', 'The decision is cost per cut, not cost per blade. On mild steel, bi-metal wins comfortably. On a production run of 60 mm stainless bar, a carbide blade costing five times more can still halve the cost per piece.'],

      ['h2', 'Tooth pitch selection'],
      ['p', 'This is where most blade problems originate. The governing rule is simple: aim for <strong>three to six teeth engaged in the cut at all times</strong>.'],
      ['ul', [
        '<strong>Too few teeth engaged</strong> and each tooth takes an excessive bite. Teeth strip, usually catastrophically and early in blade life.',
        '<strong>Too many teeth engaged</strong> and the gullets cannot clear the chip. Chips pack, heat builds, and the blade work-hardens the cut surface.',
      ]],
      ['table', {
        head: ['Material section', 'Suggested pitch', 'Notes'],
        rows: [
          ['Thin wall tube (&lt; 3 mm)', '10/14 TPI', 'Fine pitch essential to avoid stripping'],
          ['Tube and profile bundles', '6/10 or 8/12 TPI', 'Variable pitch reduces harmonic vibration'],
          ['Solid bar 25 – 75 mm', '4/6 or 5/8 TPI', 'Most common general fabrication range'],
          ['Heavy solid &gt; 150 mm', '2/3 or 3/4 TPI', 'Coarse gullets needed for chip clearance'],
        ],
      }],
      ['p', 'Variable-pitch designations such as 4/6 mean the pitch alternates between those values along the band. This breaks up the harmonic vibration that causes chatter, giving cleaner cut squareness and quieter operation.'],

      ['h2', 'Why blades strip teeth'],
      ['p', 'When a blade fails early, work through these in order — the cause is nearly always in this list.'],
      ['ol', [
        'Pitch too coarse for the wall thickness or section being cut.',
        'Feed rate too high for the material — the blade is being forced rather than cutting.',
        'Insufficient blade tension, allowing the band to wander and twist in the cut.',
        'Inadequate coolant flow or wrong coolant concentration.',
        'No break-in period on a new blade.',
      ]],
      ['callout', 'Break-in is the step most shops skip. A new blade needs the first 50 to 100 cm² of cut area run at roughly half normal feed. This hones the microscopically sharp tooth tips to a stable edge. Skipping it can cut blade life by half.'],

      ['h2', 'Blade tension and coolant'],
      ['p', 'Tension should be set with a tension gauge, not by feel — typically 250 to 300 N/mm² for bi-metal. Under-tensioned blades wander and produce out-of-square cuts; over-tensioned blades fatigue and crack at the weld.'],
      ['p', 'Coolant does two jobs: it carries heat out of the cut and flushes chips from the gullets. In Gulf ambient conditions, check concentration weekly — evaporation concentrates the mix and changes its behaviour. We weld blades to length in house; see our <a href="/products/bandsaw-blades">bandsaw blades</a> range.'],

      ['h2', 'Common questions'],
      ['faq', [
        ['Should I use a bi-metal or carbide bandsaw blade?', 'Bi-metal M42 for general fabrication on mild and structural steel — it delivers the lowest cost per cut. Move to carbide tipped for hardened steel, stainless above roughly 40 mm section, nickel alloys and titanium.'],
        ['How do I choose the right tooth pitch?', 'Keep three to six teeth engaged in the cut at all times. Thin wall tube needs fine pitch such as 10/14 TPI; heavy solid section needs coarse pitch such as 2/3 TPI to clear the chip.'],
        ['Why do my bandsaw blades keep stripping teeth?', 'In order of likelihood: pitch too coarse for the section, feed rate too high, insufficient blade tension, inadequate coolant, or no break-in on the new blade.'],
        ['Can you weld blades to a non-standard length?', 'Yes. We weld to length in house from stock coil, covering roughly 1 000 to 8 000 mm. Provide the machine make and model, or the length, width and gauge of the existing blade.'],
      ]],
    ],
  },

  'industrial-air-filters-arid-climates': {
    tldr: 'In Gulf conditions, replace air filter elements on differential pressure rather than calendar hours — dust loading routinely shortens real intervals to a third of the manufacturer default. Fit a differential pressure gauge on every primary intake and change at the stated restriction threshold, typically 20 to 25 inches water gauge.',
    blocks: [
      ['h2', 'Why arid-climate filtration is a different problem'],
      ['p', 'Filter specifications are usually written against temperate-climate dust loading. Gulf conditions invalidate that assumption. Airborne particulate here is finer, more abrasive and present in far higher concentration, particularly during shamal wind events.'],
      ['p', 'The consequence is not simply faster clogging. Fine silica that passes a coarse element reaches compressor screws, cylinder bores and turbine blades, where it acts as a lapping compound. The wear it causes is usually attributed to age rather than to filtration.'],

      ['h2', 'Filter types and what each one does'],
      ['table', {
        head: ['Type', 'Removes', 'Typical position'],
        rows: [
          ['Depth / pleated', 'Solid particulate through media thickness', 'Primary intake'],
          ['Wire mesh', 'Coarse debris, insects, large particles', 'Pre-filter stage'],
          ['Coalescer', 'Liquid aerosols — oil mist, water', 'Downstream of compression'],
          ['Separator', 'Bulk liquid from air stream', 'Compressor discharge'],
          ['Adsorption (carbon)', 'Vapour, odour, hydrocarbon', 'Final polish stage'],
          ['Spin-on', 'Combined particulate and moisture', 'Compact inline installations'],
        ],
      }],
      ['p', 'Compressed air systems typically need several of these in sequence. Fitting a coalescer where a depth filter belongs, or vice versa, is a common and expensive specification error.'],

      ['h2', 'Understanding efficiency ratings'],
      ['p', 'Two rating systems matter. ISO 16890 and the older EN 779 classes (G4 through F9) cover general ventilation. EN 1822 covers HEPA and ULPA classes (H13, H14) where fine particulate capture is critical.'],
      ['p', 'For most industrial machine protection in the Gulf, a G4 pre-filter followed by an F7 to F9 primary gives the right balance. Jumping straight to a high-efficiency element without a pre-filter simply blinds the expensive stage quickly.'],
      ['callout', 'Beta ratio is the number worth asking for. A beta ratio of 200 at 10 microns means 199 of every 200 particles at that size are captured — 99.5 percent efficiency. It is far more informative than a nominal micron rating, which is not standardised between manufacturers.'],

      ['h2', 'Setting replacement intervals correctly'],
      ['p', 'Replace on differential pressure, not on hours. This is the single highest-value change most operations in this region can make to their filtration practice.'],
      ['ol', [
        'Fit a differential pressure gauge across every primary intake filter.',
        'Record the clean-element pressure drop at commissioning as your baseline.',
        'Change the element when restriction reaches the manufacturer threshold — commonly 20 to 25 inches water gauge.',
        'Log the hours between changes. After three cycles you have a real interval for your site, not a generic one.',
      ]],
      ['p', 'Operations that make this change typically find their genuine interval is two to three times shorter than the manufacturer default during dusty months, and roughly matches it in winter.'],

      ['h2', 'The cost of running a blinded filter'],
      ['p', 'A restricted intake filter forces the machine to work against the restriction. On a rotary screw compressor, every additional inch of water gauge restriction costs measurable energy, and the pressure differential eventually collapses the element — at which point unfiltered air passes directly into the machine.'],
      ['p', 'Element cost is trivial relative to a compressor airend rebuild. The economics of over-servicing filtration in this climate are not close. Our range and OEM cross-reference is on the <a href="/products/industrial-air-filters">industrial air filters</a> page.'],

      ['h2', 'Common questions'],
      ['faq', [
        ['How often should industrial air filters be replaced in the UAE?', 'Replace on differential pressure rather than calendar hours. Fit a gauge and change when restriction reaches the manufacturer threshold, typically 20 to 25 inches water gauge. In Gulf dust this often means intervals two to three times shorter than the default.'],
        ['What is the difference between a depth filter and a coalescer?', 'A depth filter captures solid particulate through the thickness of its media. A coalescer merges liquid aerosols — oil mist or water — into droplets that drain out. Compressed air systems usually need both, in sequence.'],
        ['Does sand ingress justify upgrading filtration grade?', 'In most Gulf installations, yes. Fine silica passes standard coarse elements and reaches compressor screws, cylinder bores and turbine blades. Upgrading the primary stage and adding a pre-filter is almost always cheaper than the wear it prevents.'],
        ['Can you cross-reference an element from an OEM part number?', 'Yes. Provide the OEM element number or the housing make and model and we return a matching element with dimensions, micron rating and gasket type stated so you can confirm fit before ordering.'],
      ]],
    ],
  },
};
