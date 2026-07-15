/**
 * seed-guide-articles-spokes-from-reference.ts
 *
 * Seeds 44 spoke articles: 11 pillars × 4 spoke types
 * URL pattern: /guide/{pillar}/{spoke}  e.g. /guide/car-accident/what-to-do
 *
 * Each spoke type has a DIFFERENT block structure:
 *   what-to-do          → articleTimelineSteps (uses section content as steps)
 *   settlement-amounts  → articleSettlementTable (stats as rows)
 *   do-i-need-a-lawyer  → articleProseContent (sections as prose)
 *   statute-of-limitations → articleStatuteBars (stats as bars)
 *
 * Plus ALL spokes get: articleDirectAnswer, articleKeyTakeaways, articleFAQ,
 *                      articleSources, articleExpert, articleCTA
 *
 * Run: npx tsx src/seed/seed-guide-articles-spokes-from-reference.ts
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'

// ─── Spoke Definitions ─────────────────────────────────────────────────────────

const SPOKE_SLUGS = ['what-to-do', 'settlement-amounts', 'do-i-need-a-lawyer', 'statute-of-limitations'] as const
type SpokeSlug = typeof SPOKE_SLUGS[number]

const PILLAR_SLUGS = [
  'car-accident', 'truck-accident', 'motorcycle-accident', 'pedestrian-accident',
  'bicycle-accident', 'rideshare-accident', 'slip-and-fall', 'dog-bite',
  'workplace-injury', 'wrongful-death', 'medical-malpractice',
] as const
type PillarSlug = typeof PILLAR_SLUGS[number]

// ─── Pillar Content (from CP.accidentTypes + CP.guides resource content) ─────────

type PillarData = {
  title: string
  subtitle: string
  directAnswer: string
  stats: { label: string; value: string }[]
  keyFacts: string[]
  sections: { title: string; content: string[] }[]
  faqs: { q: string; a: string }[]
}

const PILLAR_DATA: Record<string, PillarData> = {
  'car-accident': {
    title: 'Car Accident Claims: Your Complete Guide to Maximum Recovery',
    subtitle: 'Expert guidance on car accident claims, settlement values, and your legal rights.',
    directAnswer: "Car accidents are the most common personal injury claims. Average car accident settlements range from $15,000 to $100,000+ depending on injury severity, liability clarity, and your state's negligence rule. In contributory negligence states (VA, MD, DC), even 1% fault eliminates your entire recovery. The first 72 hours after a car accident are critical for evidence preservation and claim value protection.",
    stats: [
      { label: 'Avg Settlement', value: '$15K–$100K+' },
      { label: 'Minor Injury', value: '$15K–$50K' },
      { label: 'Moderate Injury', value: '$50K–$100K' },
      { label: 'Severe Injury', value: '$100K+' },
    ],
    keyFacts: [
      'Car accident settlements are calculated using the multiplier method: economic damages × 1.5x to 5x',
      'Insurance adjusters make first offers 40–60% below final value to test your knowledge',
      'Contributory negligence states (VA, MD, DC) bar 100% of recovery if you are found any % at fault',
      'Surveillance footage is overwritten within 72 hours — preserve it immediately',
      'Medical documentation is the primary driver of settlement value',
    ],
    sections: [
      { title: 'How Car Accident Settlements Are Calculated', content: [
        'Car accident settlements use the multiplier method. Insurance adjusters calculate your economic damages (medical bills, lost wages, property damage) and multiply by a factor of 1.5x to 5x depending on injury severity. A $30,000 medical bill with a 2.5x multiplier results in a $75,000 settlement offer.',
        'The multiplier depends on injury severity. Minor injuries (soft tissue, full recovery in weeks) receive 1.5x to 2x. Moderate injuries (fractures, ongoing treatment) receive 2x to 3.5x. Severe injuries (permanent disability, chronic pain) receive 3.5x to 5x or higher.',
        "However, your state's negligence rule is applied first. In contributory negligence states, any fault eliminates your entire recovery. In comparative negligence states, your recovery is reduced by your percentage of fault.",
      ]},
      { title: 'Why First Settlement Offers Are Always Low', content: [
        'Insurance companies expect negotiation. First settlement offers are intentionally low, typically 40–60% below final value. Accepting the first offer means leaving significant money on the table.',
        "Insurance adjusters use psychological tactics to pressure you into accepting low offers. These are negotiation tactics, not facts.",
        'Do not accept the first offer. Negotiate. If negotiations stall, consider litigation. Juries often award higher verdicts than insurance adjusters offer.',
      ]},
      { title: 'Evidence Preservation in Car Accidents', content: [
        'Surveillance footage is overwritten within 72 hours. Contact nearby businesses, traffic cameras, and ATMs immediately to request preservation.',
        'Witness information is time-sensitive. Within days, witnesses forget details. Get names, phone numbers, and written statements from all witnesses while memory is fresh.',
        'Physical evidence disappears quickly. Skid marks fade within hours. Debris is cleared by road maintenance crews. Take photographs from multiple angles immediately.',
      ]},
      { title: 'Medical Documentation and Claim Value', content: [
        'Your medical records document your injuries and recovery trajectory. Gaps in treatment allow insurance adjusters to argue that your injuries were minor. Seek medical attention immediately.',
        "Some injuries (concussions, internal injuries, soft tissue damage) do not appear immediately. Comprehensive medical documentation is the foundation of your claim.",
        'Follow your doctor\'s treatment recommendations exactly. Do not skip appointments or treatments.',
      ]},
    ],
    faqs: [
      { q: 'How is a car accident settlement calculated?', a: 'Settlements use the multiplier method: economic damages are multiplied by 1.5x to 5x depending on injury severity. Your state negligence rule is applied before the multiplier.' },
      { q: 'Why is the first settlement offer always low?', a: 'Insurance companies expect negotiation. First offers are intentionally set 40–60% below final value. Always understand the full value before responding.' },
      { q: 'How long do I have to file a car accident claim?', a: 'Statutes of limitation vary by state, typically 1 to 6 years. Most states fall in the 2–3 year range. Evidence disappears far sooner — act immediately.' },
      { q: 'What evidence preserves my car accident claim?', a: 'In the first 72 hours: photograph vehicles and scene, collect witness contacts, request police report, identify and preserve nearby surveillance footage.' },
      { q: 'Does my own insurance company need a recorded statement?', a: 'You owe your own insurer prompt factual cooperation. However, you are not required to give the other driver\'s insurer a recorded statement.' },
    ],
  },
  'truck-accident': {
    title: 'Truck Accident Claims: Why These Cases Are Worth More',
    subtitle: 'Truck accident claims involve higher damages, complex liability, and federal regulations.',
    directAnswer: 'Truck accidents result in more severe injuries and higher settlements than car accidents because trucks weigh 20–30 times more than cars. Average truck accident settlements range from $75,000 to $500,000+ depending on injury severity and liability. Truck companies carry higher insurance limits ($1M+) and are held to higher safety standards. Federal trucking regulations create additional liability exposure and evidence for your claim.',
    stats: [
      { label: 'Avg Settlement', value: '$75K–$500K+' },
      { label: 'Minor Injury', value: '$75K–$150K' },
      { label: 'Serious Injury', value: '$150K–$500K' },
      { label: 'Catastrophic', value: '$500K+' },
    ],
    keyFacts: [
      'Truck accidents result in more severe injuries because trucks weigh 20–30 times more than cars',
      'Federal trucking regulations (HOS, maintenance, inspection) create additional liability exposure',
      'Truck companies carry higher insurance limits ($1M+) and are more likely to settle',
      'Black box data from trucks provides objective evidence of speed, braking, and driver behavior',
      'Trucking companies often carry multiple insurance policies, increasing available recovery',
    ],
    sections: [
      { title: 'Why Truck Accidents Result in Higher Settlements', content: [
        'Truck accidents result in more severe injuries because trucks weigh 20–30 times more than cars. A truck traveling at 55 mph has the same kinetic energy as a car traveling at 200+ mph.',
        'Truck accident injuries are typically catastrophic: multiple fractures, internal injuries, spinal cord damage, traumatic brain injury, amputation, and death.',
        'Truck companies carry higher insurance limits ($1M+) and are more likely to settle because they face significant liability exposure.',
      ]},
      { title: 'Federal Trucking Regulations Create Additional Liability', content: [
        'Federal trucking regulations (Hours of Service, vehicle maintenance, driver qualifications) create additional liability exposure. Violations of these regulations are evidence of negligence.',
        'Hours of Service violations are particularly damaging. Truck drivers are limited to 11 hours of driving per 14-hour work day. Logbook data proving HOS violations is powerful evidence.',
        'Vehicle maintenance violations are also damaging. Brake failures, tire blowouts, and other mechanical failures caused by negligent maintenance are evidence of liability.',
      ]},
      { title: 'Black Box Data and Objective Evidence', content: [
        'Modern trucks are equipped with electronic data recorders (black boxes) that record speed, braking, acceleration, and other vehicle data.',
        'Black box data can prove that the truck driver was speeding, failed to brake, or was distracted. This data is admissible in court and is extremely persuasive to juries.',
        'Trucking companies often try to destroy or hide black box data. Early legal action is critical to preserve this evidence.',
      ]},
      { title: 'Multiple Insurance Policies Increase Available Recovery', content: [
        'Trucking companies often carry multiple insurance policies: primary liability, excess liability, umbrella coverage, and cargo insurance.',
        'A truck accident might have $1M in primary liability, $2M in excess liability, and $5M in umbrella coverage, for a total of $8M in available insurance.',
        "Insurance companies often fight over which policy applies, but this is their problem, not yours. Your attorney coordinates with all insurers to maximize your recovery.",
      ]},
    ],
    faqs: [
      { q: 'Why are truck accident settlements higher than car accidents?', a: 'Trucks weigh 20–30 times more than cars, causing catastrophic injuries. Truck companies carry higher insurance limits ($1M+), and federal regulations create additional liability.' },
      { q: 'What is Hours of Service (HOS) and why does it matter?', a: 'HOS limits truck drivers to 11 hours of driving per 14-hour work day. Violations are evidence of driver fatigue — a major cause of truck accidents.' },
      { q: 'How do I preserve black box data after a truck accident?', a: 'Act immediately. Send a preservation letter to the trucking company demanding all electronic data records be preserved. This data is often overwritten within days.' },
      { q: 'Can I sue the trucking company directly?', a: 'Yes. Trucking companies are vicariously liable for their drivers\' negligence. They may also have direct liability for negligent hiring or failing to maintain safe vehicles.' },
    ],
  },
  'motorcycle-accident': {
    title: 'Motorcycle Accident Claims: Overcoming Bias and Maximizing Recovery',
    subtitle: 'Motorcycle accident claims require overcoming bias and proving liability clearly.',
    directAnswer: "Motorcycle accidents result in severe injuries and death at rates 28 times higher than car accidents. Average motorcycle accident settlements range from $50,000 to $300,000+ depending on injury severity. Insurance companies and juries often apply bias against motorcycle riders, assuming they were reckless or at fault. Overcoming this bias requires clear evidence of the other party's liability and comprehensive medical documentation of your injuries.",
    stats: [
      { label: 'Avg Settlement', value: '$50K–$300K+' },
      { label: 'Minor Injury', value: '$50K–$100K' },
      { label: 'Serious Injury', value: '$100K–$300K' },
      { label: 'Catastrophic', value: '$300K+' },
    ],
    keyFacts: [
      'Motorcycle accidents result in severe injuries and death at rates 28 times higher than car accidents',
      'Insurance companies and juries apply bias against motorcycle riders, assuming they were reckless',
      'Overcoming bias requires clear evidence of the other party\'s liability',
      'Motorcycle riders have limited protection, resulting in catastrophic injuries',
      'Comprehensive medical documentation is critical to overcome bias',
    ],
    sections: [
      { title: 'Understanding Bias Against Motorcycle Riders', content: [
        'Insurance companies and juries often apply bias against motorcycle riders, assuming they were reckless or at fault. This bias is unfair and illegal, but it exists.',
        "Insurance adjusters argue that you were speeding, weaving through traffic, or riding recklessly. They use this narrative to reduce your settlement offer.",
        'Juries also apply this bias. Some jurors believe that motorcycle riders accept the risk of injury by choosing to ride.',
      ]},
      { title: 'Why Motorcycle Accidents Result in Severe Injuries', content: [
        "Motorcycle riders have no protection from impact. Cars have airbags, crumple zones, and steel frames. Motorcycles have only the rider's body.",
        'Motorcycle accident injuries are typically catastrophic: multiple fractures, road rash, spinal cord damage, traumatic brain injury, amputation, and death.',
        'Helmet use reduces head injury risk but does not prevent other injuries. Road rash, fractures, and spinal cord injuries are common even with helmet use.',
      ]},
      { title: 'Proving Liability in Motorcycle Accidents', content: [
        "Proving liability requires clear evidence of the other party's negligence. Witness testimony, surveillance footage, police reports, and accident reconstruction are critical.",
        "Insurance companies often argue that the motorcycle rider was speeding or weaving. Objective evidence counters these arguments.",
        'Accident reconstruction experts can analyze the accident scene, vehicle damage, and road conditions to determine what happened.',
      ]},
      { title: 'Medical Documentation and Overcoming Bias', content: [
        'Comprehensive medical documentation is critical to overcome bias and prove the severity of your injuries.',
        'Insurance companies argue that motorcycle riders exaggerate their injuries. Detailed medical records counter these arguments.',
        "Follow your doctor's treatment recommendations exactly. Gaps in treatment allow insurance adjusters to argue that your injuries were minor.",
      ]},
    ],
    faqs: [
      { q: 'How do I overcome bias against motorcycle riders in a claim?', a: "Overcoming bias requires objective evidence of the other party's liability: surveillance footage, witness testimony, police reports, and accident reconstruction." },
      { q: 'Do I need a helmet to have a valid motorcycle accident claim?', a: "Not wearing a helmet does not bar your recovery in most states. Wear a helmet for safety — but its absence should never stop you from pursuing a valid claim." },
      { q: 'What are the most common causes of motorcycle accidents?', a: 'Drivers failing to yield at intersections, making left turns across oncoming motorcycles, opening car doors into bike lanes, and rear-ending motorcycles.' },
      { q: 'What injuries are most common in motorcycle accidents?', a: 'Traumatic brain injury, spinal cord damage, multiple fractures, road rash, and amputation. The lack of protective barriers means the rider absorbs all impact energy.' },
    ],
  },
  'pedestrian-accident': {
    title: 'Pedestrian Accident Claims: Vulnerable Road User Protection',
    subtitle: 'Pedestrian accident claims often involve clear liability and vulnerable user protections.',
    directAnswer: 'Pedestrian accidents result in severe injuries and death because pedestrians have no protection from vehicle impact. Average pedestrian accident settlements range from $50,000 to $400,000+ depending on injury severity and liability. Many jurisdictions apply different negligence standards to vulnerable road users, providing additional protection. Pedestrian accidents are often clear liability cases because drivers have a duty to avoid hitting pedestrians.',
    stats: [
      { label: 'Avg Settlement', value: '$50K–$400K+' },
      { label: 'Moderate Injury', value: '$50K–$150K' },
      { label: 'Serious Injury', value: '$150K–$400K' },
      { label: 'Catastrophic', value: '$400K+' },
    ],
    keyFacts: [
      'Pedestrians have no protection from vehicle impact, resulting in severe injuries',
      'Many jurisdictions apply vulnerable user standards to pedestrians',
      'Drivers have a duty to avoid hitting pedestrians, even if pedestrians are partially at fault',
      'Pedestrian accident liability is often clear because drivers should see and avoid pedestrians',
      'Surveillance footage from nearby businesses and traffic cameras is often available',
    ],
    sections: [
      { title: 'Vulnerable User Standards Protect Pedestrians', content: [
        'Many jurisdictions apply vulnerable user standards to pedestrians, cyclists, and motorcyclists. These standards recognize that vulnerable road users deserve additional protection.',
        'Under vulnerable user standards, drivers must exercise extra care to avoid hitting vulnerable road users. Even if the pedestrian is partially at fault, the driver may still be liable.',
        'Vulnerable user standards shift the burden of care to drivers. Drivers must anticipate pedestrian behavior and take steps to avoid collision.',
      ]},
      { title: 'Why Pedestrian Accidents Result in Severe Injuries', content: [
        'Pedestrians have no protection from vehicle impact. When a vehicle hits a pedestrian, the pedestrian absorbs all the impact energy.',
        'Pedestrian accident injuries are typically catastrophic: multiple fractures, internal injuries, spinal cord damage, traumatic brain injury, and death.',
        'Pedestrian accident injuries depend on vehicle speed. A pedestrian struck at 20 mph has a 90% survival rate. A pedestrian struck at 40 mph has only a 10% survival rate.',
      ]},
      { title: 'Proving Liability in Pedestrian Accidents', content: [
        'Pedestrian accident liability is often clear because drivers have a duty to avoid hitting pedestrians. Even if the pedestrian is jaywalking, the driver should see and avoid them.',
        'Surveillance footage from nearby businesses, traffic cameras, and ATMs is often available in pedestrian accidents.',
        "Witness testimony is also valuable. Pedestrians often have witnesses who saw the accident.",
      ]},
      { title: 'Medical Documentation and Long-Term Impact', content: [
        'Pedestrian accident injuries often result in permanent disability, chronic pain, and reduced quality of life.',
        'Pedestrian accidents often result in multiple surgeries, extended hospitalization, and long-term rehabilitation.',
        "Follow your doctor's treatment recommendations exactly. Pedestrian accident injuries often require ongoing treatment and rehabilitation.",
      ]},
    ],
    faqs: [
      { q: 'What are vulnerable user standards in pedestrian accidents?', a: 'Vulnerable user standards hold drivers to a heightened duty of care around pedestrians, cyclists, and motorcyclists. Even if a pedestrian is partially at fault, the driver may still be liable.' },
      { q: 'How is liability determined in pedestrian accidents?', a: 'Drivers have a duty to avoid hitting pedestrians. Liability is often clear because drivers should see and avoid pedestrians.' },
      { q: 'What surveillance footage is available after a pedestrian accident?', a: 'Footage may be available from nearby businesses, traffic cameras, ATMs, doorbell cameras, and city buses. This footage is typically overwritten within 72 hours.' },
      { q: 'What should I do immediately after being hit by a car as a pedestrian?', a: 'Seek medical attention first, even if injuries seem minor. Then photograph the scene, collect witness information, request a police report, and preserve any available surveillance footage within 72 hours.' },
    ],
  },
  'bicycle-accident': {
    title: 'Bicycle Accident Claims: Protecting Vulnerable Riders',
    subtitle: 'Bicycle accident claims hinge on driver negligence and vulnerable-user protections.',
    directAnswer: 'Bicycle accidents cause severe injuries because riders have no protection from a multi-ton vehicle. Average bicycle accident settlements range from $30,000 to $250,000+ depending on injury severity and liability. Most collisions are caused by drivers failing to yield, opening doors into bike lanes, or making right hooks. Many jurisdictions apply vulnerable-road-user standards that hold drivers to a heightened duty of care around cyclists, and a helmet does not bar recovery.',
    stats: [
      { label: 'Avg Settlement', value: '$30K–$250K+' },
      { label: 'Minor Injury', value: '$30K–$75K' },
      { label: 'Serious Injury', value: '$75K–$250K' },
      { label: 'Catastrophic', value: '$250K+' },
    ],
    keyFacts: [
      'Most bike collisions are caused by drivers failing to yield, "dooring," or right-hook turns',
      'Vulnerable-road-user laws hold drivers to a heightened duty of care around cyclists',
      'Not wearing a helmet does not bar recovery in most states',
      'Head and spinal injuries make bicycle claims high-value despite the small vehicle',
      'Surveillance and traffic-camera footage is critical and overwritten within 72 hours',
    ],
    sections: [
      { title: 'Why Drivers Are Usually at Fault in Bicycle Accidents', content: [
        "Most bicycle accidents are caused by driver negligence: failing to yield at intersections, opening a car door into a bike lane (\"dooring\"), and making a right turn across a cyclist's path (the \"right hook\").",
        "Drivers frequently claim they 'never saw' the cyclist. This is not a defense — it is an admission of inattention.",
        'Objective evidence — traffic-camera footage, witness testimony, and the physical damage pattern — usually establishes the driver\'s fault clearly.',
      ]},
      { title: 'Vulnerable Road User Protections', content: [
        'Many states and cities apply vulnerable-road-user standards that hold drivers to a heightened duty of care around cyclists.',
        'These standards recognize the vast disparity between a cyclist and a motor vehicle. Even where a cyclist made a minor error, the driver\'s failure to exercise reasonable care can establish liability.',
        'In contributory-negligence jurisdictions, cyclist fault can still bar recovery — which makes careful documentation and legal guidance especially important.',
      ]},
      { title: 'The Helmet Question', content: [
        'Not wearing a helmet does not bar your recovery in most states. Insurance adjusters will raise it to argue comparative fault, but helmet non-use is generally inadmissible to liability for the collision itself.',
        'For head injuries, an insurer may argue a helmet would have reduced the harm. The strength of that argument varies by state.',
        'Wearing a helmet is always safer — but its absence should never stop an injured cyclist from pursuing a valid claim.',
      ]},
      { title: 'Documenting a Bicycle Accident Claim', content: [
        'Bicycle accident injuries are often catastrophic — traumatic brain injury, spinal damage, and multiple fractures.',
        'Preserve the bicycle in its damaged condition, photograph the scene and bike-lane markings, and request nearby surveillance footage immediately.',
        "Witness statements are especially valuable in bicycle cases because they counter the common driver narrative that the cyclist 'came out of nowhere.'",
      ]},
    ],
    faqs: [
      { q: 'What is "dooring" in bicycle accidents?', a: 'Dooring occurs when a driver or passenger opens a car door into a bike lane without looking, striking an oncoming cyclist. The driver or passenger who opened the door is typically at fault.' },
      { q: 'What is a "right hook" bicycle accident?', a: 'A right hook happens when a driver makes a right turn across a cyclist\'s path, cutting off or colliding with the cyclist traveling straight through.' },
      { q: 'Does not wearing a helmet hurt my bicycle accident claim?', a: 'No. Not wearing a helmet does not bar your recovery in most states. Helmet non-use is generally inadmissible to liability for the collision itself.' },
      { q: 'How long do I have to file a bicycle accident claim?', a: 'Statutes of limitation vary by state, typically 1 to 6 years from the date of the accident. Most states fall in the 2–3 year range. Evidence like surveillance footage disappears far sooner — act immediately.' },
    ],
  },
  'rideshare-accident': {
    title: 'Rideshare Accident Claims: Navigating Complex Liability',
    subtitle: 'Rideshare accident claims involve complex liability and insurance coverage disputes.',
    directAnswer: 'Rideshare accidents involve complex liability because multiple parties may be responsible: the rideshare driver, the rideshare company, other drivers, and vehicle manufacturers. Average rideshare accident settlements range from $30,000 to $200,000+ depending on injury severity and liability. Rideshare companies carry insurance that covers accidents during rides, but they often dispute coverage and liability. Early legal action is critical to preserve evidence and protect your rights.',
    stats: [
      { label: 'Avg Settlement', value: '$30K–$200K+' },
      { label: 'Minor Injury', value: '$30K–$75K' },
      { label: 'Serious Injury', value: '$75K–$200K' },
      { label: 'Catastrophic', value: '$200K+' },
    ],
    keyFacts: [
      'Rideshare accidents involve complex liability because multiple parties may be responsible',
      'Rideshare companies carry insurance that covers accidents during rides',
      'Rideshare companies often dispute coverage and liability to reduce their exposure',
      'The rideshare driver may be personally liable in addition to the rideshare company',
      'Early legal action is critical to preserve evidence and protect your rights',
    ],
    sections: [
      { title: 'Understanding Rideshare Liability', content: [
        'Rideshare accidents involve complex liability because multiple parties may be responsible: the rideshare driver, the rideshare company, other drivers, and vehicle manufacturers.',
        "The rideshare driver is responsible for operating the vehicle safely. If the driver was negligent, the driver is liable for your injuries.",
        "The rideshare company is also liable for the driver's negligence under the doctrine of vicarious liability.",
      ]},
      { title: 'Rideshare Insurance Coverage', content: [
        'Rideshare companies carry insurance that covers accidents during rides. The insurance limits are typically $1M+ for bodily injury liability.',
        "The rideshare insurance coverage depends on the driver's status at the time of the accident. If the driver was actively transporting a passenger, the rideshare company's insurance applies.",
        'Rideshare companies often argue that the driver was offline or waiting for a ride request to avoid coverage. Early legal action is critical to preserve evidence.',
      ]},
      { title: 'Investigating Rideshare Accidents', content: [
        'Rideshare accidents require investigation into the driver\'s background, training, and history.',
        'Driver records may show prior accidents, traffic violations, or complaints about the driver\'s safety.',
        'GPS data, app records, and telematics data from the vehicle can prove the driver\'s location, speed, and actions immediately before the accident.',
      ]},
      { title: 'Negotiating with Rideshare Companies', content: [
        'Rideshare companies employ sophisticated legal teams that aggressively defend claims.',
        'Rideshare companies often make low settlement offers to test your knowledge and pressure you into accepting less than your claim is worth.',
        'If negotiations stall, litigation may be necessary. Juries are often sympathetic to injured passengers.',
      ]},
    ],
    faqs: [
      { q: 'Which insurance applies after a rideshare accident?', a: 'If the driver was actively transporting a passenger, the rideshare company\'s $1M+ policy applies. If the driver was waiting for a ride request, only the driver\'s personal insurance applies.' },
      { q: 'Can I sue the rideshare company directly?', a: 'Yes. Rideshare companies are vicariously liable for their drivers\' negligence. They may also have direct liability for negligent hiring or failing to maintain safe vehicles.' },
      { q: 'What evidence is critical after a rideshare accident?', a: 'Preserve GPS data and app records immediately — these prove whether the driver was transporting a passenger. Also collect witness information and request a police report.' },
      { q: 'How do I prove the rideshare driver was negligent?', a: 'Driver negligence in rideshare accidents is proven through GPS data, app records showing driver status, witness testimony, police reports, and accident reconstruction. Preserve all evidence immediately.' },
    ],
  },
  'slip-and-fall': {
    title: 'Slip and Fall Claims: Proving Premises Liability',
    subtitle: 'Slip and fall claims require proving the property owner\'s negligence.',
    directAnswer: 'Slip and fall claims are premises liability cases where a property owner or manager is responsible for injuries caused by unsafe conditions on their property. Average slip and fall settlements range from $10,000 to $100,000+ depending on injury severity and the property owner\'s negligence. Proving premises liability requires showing that the property owner knew or should have known about the unsafe condition and failed to fix it or warn visitors. Property owners often dispute liability, making early evidence preservation critical.',
    stats: [
      { label: 'Avg Settlement', value: '$10K–$100K+' },
      { label: 'Minor Injury', value: '$10K–$35K' },
      { label: 'Moderate Injury', value: '$35K–$75K' },
      { label: 'Severe Injury', value: '$75K+' },
    ],
    keyFacts: [
      'Slip and fall claims are premises liability cases where property owners are responsible for unsafe conditions',
      'Property owners must maintain safe conditions and warn visitors of known hazards',
      'Proving premises liability requires showing the property owner knew or should have known about the unsafe condition',
      'Property owners often dispute liability and argue that the visitor was careless',
      'Early evidence preservation (photographs, witness statements, maintenance records) is critical',
    ],
    sections: [
      { title: 'Understanding Premises Liability', content: [
        'Premises liability is the legal doctrine that property owners are responsible for injuries caused by unsafe conditions on their property.',
        'Property owners have a duty to inspect their property regularly and identify unsafe conditions. They also have a duty to fix unsafe conditions or warn visitors.',
        'Property owners are liable for injuries caused by unsafe conditions only if they knew or should have known about the condition.',
      ]},
      { title: 'Proving the Property Owner Knew or Should Have Known', content: [
        'Proving that the property owner knew or should have known about the unsafe condition is critical to premises liability claims.',
        'Maintenance records are critical evidence. If the property owner failed to inspect or maintain the property, this shows constructive notice.',
        'Photographs of the unsafe condition are critical. Take photographs immediately after the accident showing the exact condition that caused your injury.',
      ]},
      { title: 'Common Slip and Fall Hazards', content: [
        'Common slip and fall hazards include wet floors, ice, debris, uneven surfaces, poor lighting, and broken stairs.',
        'Wet floor hazards require evidence that the property owner failed to dry the floor or warn visitors. Ice hazards require evidence that the property owner failed to salt or sand the surface.',
        'Uneven surface and broken stair hazards require evidence that the property owner knew about the condition and failed to fix it.',
      ]},
      { title: 'Property Owner Defenses and How to Counter Them', content: [
        'Property owners often argue that the visitor was careless and should have seen the hazard. This is called assumption of risk or comparative negligence.',
        'Property owners also argue that the hazard was open and obvious and therefore they had no duty to warn.',
        'Property owners may also argue that they did not have constructive notice of the hazard because they inspected the property regularly.',
      ]},
    ],
    faqs: [
      { q: 'How do I prove a slip and fall claim?', a: 'Prove that the property owner knew or should have known about the unsafe condition and failed to fix it or warn you. Critical evidence includes photographs, witness statements, and maintenance records.' },
      { q: 'What are the most common slip and fall hazards?', a: 'Wet floors, ice and snow, uneven surfaces, poor lighting, broken stairs, and debris are the most common.' },
      { q: 'Can I sue if I was distracted when I slipped?', a: 'Comparative negligence may reduce your recovery proportionally if you were partially at fault, but it does not usually bar a claim entirely.' },
      { q: 'How long do I have to file a slip and fall claim?', a: 'Statutes of limitation for slip and fall vary by state, typically 1 to 6 years from the date of the incident. Most states fall in the 2–3 year range. Property owners often destroy evidence quickly — act immediately.' },
    ],
  },
  'dog-bite': {
    title: 'Dog Bite Claims: Holding Negligent Dog Owners Accountable',
    subtitle: 'Dog bite claims hold dog owners accountable for injuries caused by their dogs.',
    directAnswer: "Dog bite claims hold dog owners responsible for injuries caused by their dogs. Average dog bite settlements range from $15,000 to $100,000+ depending on injury severity and the dog owner's negligence. Most states apply strict liability for dog bites, meaning the dog owner is liable even if the dog had no history of aggression. Dog bite injuries often require multiple surgeries, result in permanent scarring, and cause psychological trauma. Early medical documentation and evidence preservation are critical.",
    stats: [
      { label: 'Avg Settlement', value: '$15K–$100K+' },
      { label: 'Minor Wound', value: '$15K–$35K' },
      { label: 'Serious Injury', value: '$35K–$75K' },
      { label: 'Catastrophic', value: '$75K+' },
    ],
    keyFacts: [
      "Most states apply strict liability for dog bites, meaning the dog owner is liable even if the dog had no history of aggression",
      'Dog bite injuries often require multiple surgeries and result in permanent scarring',
      "Psychological trauma (fear of dogs, anxiety) is a valid claim in dog bite cases",
      'Dog owners have a duty to control their dogs and prevent them from injuring others',
      'Early medical documentation and evidence preservation are critical to maximize recovery',
    ],
    sections: [
      { title: 'Strict Liability vs. Negligence in Dog Bite Cases', content: [
        'Most states (35+) apply strict liability for dog bites, meaning the dog owner is liable for injuries their dog causes even if the dog had no history of aggression.',
        'Strict liability removes the need to prove that the dog owner was negligent. You only need to prove that the dog bit you and caused injury.',
        "A few states apply a 'one bite rule' where the dog owner is liable only if they knew the dog was dangerous.",
      ]},
      { title: 'Dog Bite Injuries and Medical Treatment', content: [
        'Dog bite injuries range from minor puncture wounds to severe lacerations requiring multiple surgeries. Severe bites often cause permanent scarring and disfigurement.',
        'Dog bite injuries often become infected because dog mouths contain bacteria. Immediate medical treatment is critical.',
        'Dog bite injuries often require multiple surgeries to repair tissue damage, reduce scarring, and restore function.',
      ]},
      { title: 'Psychological Trauma and Emotional Damages', content: [
        'Dog bite injuries often cause psychological trauma including fear of dogs, anxiety, and post-traumatic stress disorder (PTSD).',
        'Children are particularly vulnerable to psychological trauma from dog bites.',
        'Psychological trauma is documented through mental health treatment records.',
      ]},
      { title: 'Holding Dog Owners Accountable', content: [
        'Dog owners have a duty to control their dogs and prevent them from injuring others.',
        'Dog owners who violate local leash laws or allow dogs to roam free are negligent.',
        'If the dog owner knew the dog was dangerous and failed to take precautions, this may justify punitive damages.',
      ]},
    ],
    faqs: [
      { q: 'What is strict liability for dog bites?', a: 'Most states apply strict liability, meaning the dog owner is automatically liable for injuries their dog causes — regardless of whether the dog had previously shown aggression.' },
      { q: 'What damages can I recover in a dog bite case?', a: 'Damages include medical expenses, lost wages, pain and suffering, scarring and disfigurement, and psychological trauma including PTSD and anxiety.' },
      { q: 'Can I recover if I was partially at fault for the dog bite?', a: 'In most comparative negligence states, your recovery is reduced by your percentage of fault. However, strict liability states bar this defense.' },
      { q: 'What should I do immediately after being bitten by a dog?', a: 'Seek immediate medical attention — dog bites can cause serious infection. Identify the dog and its owner, photograph your injuries, collect witness information, and report the bite to local animal control.' },
    ],
  },
  'workplace-injury': {
    title: 'Workplace Injury Claims: Beyond Workers\' Compensation',
    subtitle: 'Workplace injury claims may include third-party liability beyond workers\' comp.',
    directAnswer: "Most workplace injuries are covered by workers' compensation, which pays medical bills and partial lost wages regardless of fault — but bars you from suing your employer. The bigger recovery often comes from a third-party claim against a negligent party who is not your employer: an equipment manufacturer, a subcontractor, a property owner, or a driver in a work-related crash. Average third-party workplace settlements range from $50,000 to $500,000+ and, unlike workers' comp, can include full pain-and-suffering damages.",
    stats: [
      { label: 'Avg Settlement', value: '$50K–$500K+' },
      { label: "Workers' Comp", value: 'No-Fault' },
      { label: 'Third-Party', value: 'Full Damages' },
      { label: 'Pain & Suffering', value: '3rd-Party Only' },
    ],
    keyFacts: [
      "Workers' comp pays medical bills and partial wages regardless of fault, but bars pain-and-suffering",
      'A third-party claim against a non-employer can recover full damages, including pain and suffering',
      'Common third parties: equipment makers, subcontractors, property owners, and other drivers',
      'You can usually pursue workers\' comp and a third-party claim at the same time',
      "Workers' comp deadlines are short — report the injury to your employer immediately",
    ],
    sections: [
      { title: "Workers' Compensation: What It Covers and Its Limits", content: [
        "Workers' compensation is a no-fault system: it pays your medical bills and a portion of your lost wages regardless of who caused the injury.",
        "The trade-off is significant. Workers' comp does not pay for pain and suffering, and it replaces only part of your wages.",
        "Workers' comp deadlines are strict. Report the injury to your employer immediately and in writing — late reporting is a common reason valid claims are denied.",
      ]},
      { title: "The Third-Party Claim: Where the Real Value Often Is", content: [
        "A third-party claim is a separate lawsuit against a negligent party who is not your employer. Unlike workers' comp, a third-party claim can recover full damages.",
        'Common third parties include the manufacturer of defective equipment, a subcontractor or general contractor, the property owner, and the at-fault driver in a work-related vehicle crash.',
        "You can usually pursue both at once: workers' comp covers immediate medical and wage needs while the third-party claim pursues the full value of your injury.",
      ]},
      { title: 'Common Third-Party Workplace Scenarios', content: [
        'Defective machinery and tools: when equipment lacks proper guards or fails due to a design or manufacturing defect, the manufacturer may be liable.',
        'Construction sites: with multiple companies on one site, a subcontractor or general contractor whose negligence injured you can be a third-party defendant.',
        "Work-related vehicle crashes: if you are injured driving for work by another negligent driver, that driver (and their insurer) is a third party.",
      ]},
      { title: 'Coordinating Comp and Third-Party Recovery', content: [
        "When you recover from both workers' comp and a third-party claim, your employer's comp insurer typically has a lien.",
        'Skilled handling of the comp lien can substantially increase your net recovery.',
        "Because the two systems interact in complex ways, workplace injuries with a potential third party benefit most from early, coordinated legal guidance.",
      ]},
    ],
    faqs: [
      { q: "Can I sue my employer for a workplace injury?", a: "Generally no. Workers' compensation bars lawsuits against your employer. However, you can pursue a third-party claim against a negligent party who is not your employer." },
      { q: 'What is a third-party workplace injury claim?', a: "A third-party claim is a lawsuit against a negligent party who is not your employer — such as a contractor, equipment manufacturer, property owner, or driver." },
      { q: "How do I protect my workers' comp claim?", a: "Report the injury to your employer immediately and in writing. Seek medical attention right away and follow all treatment recommendations." },
      { q: "What's the difference between workers' comp and a third-party claim?", a: "Workers' comp pays medical bills and partial wages regardless of fault, but bars pain-and-suffering damages. A third-party claim can recover full damages including pain and suffering, but requires proving negligence by a non-employer." },
    ],
  },
  'wrongful-death': {
    title: 'Wrongful Death Claims: Seeking Justice and Maximum Recovery',
    subtitle: 'Wrongful death claims seek justice and maximum recovery for your family.',
    directAnswer: "Wrongful death claims allow family members to recover damages when a loved one dies due to another party's negligence. Average wrongful death settlements range from $100,000 to $1,000,000+ depending on the deceased's age, earning potential, and relationship to the family. Wrongful death claims are emotionally complex but legally straightforward: if negligence caused death, the responsible party is liable for all damages including lost income, funeral expenses, and pain and suffering of surviving family members.",
    stats: [
      { label: 'Avg Settlement', value: '$100K–$1M+' },
      { label: 'High-Value', value: '$1M+' },
      { label: 'Punitive', value: 'Available' },
      { label: 'Filing Window', value: '2–3yr' },
    ],
    keyFacts: [
      'Wrongful death claims allow family members to recover damages when a loved one dies due to negligence',
      "Damages include lost income, funeral expenses, and pain and suffering of surviving family members",
      "The deceased's age and earning potential are primary factors in settlement value",
      'Wrongful death claims are emotionally complex but legally straightforward',
      'Early legal action is critical to preserve evidence and protect family interests',
    ],
    sections: [
      { title: 'What Constitutes Wrongful Death', content: [
        "Wrongful death occurs when a person dies as a result of another party's negligence, recklessness, or intentional conduct.",
        'Wrongful death claims can arise from car accidents, truck accidents, pedestrian accidents, medical malpractice, workplace accidents, and other incidents involving negligence.',
        "To prove wrongful death, you must show that the responsible party owed a duty of care, breached that duty, and the breach caused the death.",
      ]},
      { title: 'Who Can File a Wrongful Death Claim', content: [
        "Wrongful death claims are filed by the deceased's estate or by surviving family members. The specific family members depend on state law.",
        'In some states, only the estate can file a wrongful death claim. In other states, surviving family members can file directly.',
        "If the deceased had no surviving family members, the claim may be filed by the estate for the benefit of creditors and other parties.",
      ]},
      { title: 'Calculating Wrongful Death Damages', content: [
        "Wrongful death damages include economic damages (lost income, lost benefits, funeral expenses) and non-economic damages (pain and suffering of surviving family members).",
        "Lost income is calculated based on the deceased's age, earning potential, and life expectancy.",
        "Non-economic damages depend on the relationship between the deceased and surviving family members. Spouses and minor children typically recover higher non-economic damages.",
      ]},
      { title: 'The Emotional and Legal Process', content: [
        'Wrongful death claims are emotionally complex. Families are grieving while also pursuing legal action.',
        'The legal process includes investigation, evidence preservation, negotiation, and potentially litigation.',
        'Settlement negotiations in wrongful death cases are often complex because multiple family members may have different interests.',
      ]},
    ],
    faqs: [
      { q: 'Who can file a wrongful death claim?', a: "Typically a spouse, children, or parents of the deceased — the specific rules vary by state." },
      { q: 'How are wrongful death damages calculated?', a: "Damages include economic losses (lost income, lost benefits, funeral expenses) and non-economic losses (pain and suffering)." },
      { q: 'Can punitive damages be awarded in wrongful death cases?', a: 'Yes. If the responsible party acted recklessly or intentionally — such as in drunk driving cases — punitive damages may be available.' },
      { q: 'How long do I have to file a wrongful death claim?', a: 'Statutes of limitation for wrongful death vary by state, typically 1 to 6 years from the date of death. Missing this deadline permanently bars the claim. Consult an attorney immediately.' },
    ],
  },
  'medical-malpractice': {
    title: 'Medical Malpractice: What It Takes to Prove a Claim',
    subtitle: "When a healthcare provider's negligence causes harm — what counts, what it takes to prove, and why these cases are different.",
    directAnswer: "Medical malpractice occurs when a healthcare provider deviates from the accepted standard of care and that deviation injures the patient. It is one of the most complex and heavily-regulated areas of personal injury: nearly every state requires an expert physician to certify the claim, damage caps often apply, and deadlines are short and unusual. Not every bad outcome is malpractice — medicine carries inherent risk. The question is always whether a competent provider, in the same situation, would have acted differently. Strong cases pair a clear standard-of-care breach with serious, documented harm.",
    stats: [
      { label: 'Proof Standard', value: 'Expert Required' },
      { label: 'Damage Caps', value: 'Many States' },
      { label: 'Deadlines', value: 'Short / Unusual' },
      { label: 'Case Value', value: 'High' },
    ],
    keyFacts: [
      "Malpractice requires a breach of the accepted standard of care — not just a bad outcome",
      "Most states require an expert physician affidavit to even file the case",
      "Many states cap non-economic damages in malpractice specifically",
      "Statutes of limitations are short and often run from discovery of the harm",
      "Common types: misdiagnosis, surgical error, medication error, birth injury",
    ],
    sections: [
      { title: 'What Counts as Medical Malpractice', content: [
        "Medical malpractice has four elements: a duty of care, a breach of the accepted standard of care, causation, and damages. All four must be present.",
        "The 'standard of care' is what a reasonably competent provider in the same specialty would have done in the same circumstances.",
        "Common malpractice types include misdiagnosis or delayed diagnosis, surgical errors, medication and dosage errors, anesthesia errors, birth injuries, and failure to obtain informed consent.",
      ]},
      { title: 'Why These Cases Are Different', content: [
        "Medical malpractice is procedurally unlike other injury claims. Most states require a 'certificate of merit' or expert affidavit before you can file.",
        "Many states impose caps on non-economic damages (pain and suffering) in malpractice cases specifically.",
        "Deadlines are short and unusual. Some run from the date of the negligence, others from when the patient discovered the harm.",
      ]},
      { title: 'Proving Causation — the Hard Part', content: [
        "The toughest element in most malpractice cases is causation: proving the provider's breach — not the underlying illness — caused the harm.",
        "This is where expert evidence is decisive. Specialists reconstruct what should have happened, what did happen, and how the difference produced the injury.",
        "Because of the cost and complexity, reputable firms screen malpractice cases rigorously.",
      ]},
      { title: 'What You Can Recover', content: [
        'Damages in medical malpractice cases include medical expenses, lost wages, and pain and suffering.',
        'Non-economic damages (pain and suffering) are capped in many states. Economic damages are generally not capped.',
        'In cases of egregious negligence, punitive damages may be available to punish the healthcare provider.',
      ]},
    ],
    faqs: [
      { q: "Is a bad outcome the same as medical malpractice?", a: "No. Malpractice requires that the provider breached the accepted standard of care and that the breach caused real harm." },
      { q: "Do I need an expert to file a medical malpractice case?", a: "In most states, yes. A 'certificate of merit' or expert affidavit from a qualified physician is typically required before filing." },
      { q: "How long do I have to file a medical malpractice claim?", a: "Deadlines are short and vary by state — and the clock may run from the date of the negligence or from when you discovered the harm." },
      { q: "What is the difference between medical malpractice and medical negligence?", a: "Medical malpractice is a broader legal term that includes negligence, but also encompasses informed consent violations and fiduciary duty breaches. All malpractice is negligence, but not all negligence rises to malpractice level." },
    ],
  },
}

// ─── Expert Data (same across all pillars) ────────────────────────────────────

const EXPERT_DATA: Record<string, { reviewerName: string; credentials: string; quote: string }> = {
  'car-accident': {
    reviewerName: 'James R. McMerty',
    credentials: 'Partner, The McMerty Law Firm | 35 Years Personal Injury Experience',
    quote: "Car accident claims are won and lost on documentation. The clients who recover the most are the ones who documented everything immediately.",
  },
  'truck-accident': {
    reviewerName: 'Sarah K. Martinez',
    credentials: 'Truck Accident Legal Specialist | Author, Commercial Vehicle Liability Guide',
    quote: "Every truck accident case has a black box. The question is whether you get to it before the company does.",
  },
  'motorcycle-accident': {
    reviewerName: 'Marcus T. Webb',
    credentials: 'Motorcycle Injury Attorney | Member, ABATE of Texas Legal Panel',
    quote: "Juries in Texas have seen a lot of car versus motorcycle cases, and many come in with bias. The attorneys who win these cases don't fight the bias directly.",
  },
  'pedestrian-accident': {
    reviewerName: 'Diana L. Chen',
    credentials: 'Pedestrian Safety & Injury Law | Published: Texas Pedestrian Injury Patterns',
    quote: "In 70% of pedestrian cases I've reviewed, the surveillance footage tells the whole story. The problem is people don't ask for it until it's gone.",
  },
  'bicycle-accident': {
    reviewerName: 'Robert J. Alton',
    credentials: 'Cycling Injury Specialist | Board Member, Dallas Bicycle Coalition',
    quote: "The right hook and dooring are the two most common bicycle accidents I see. Both are entirely the driver's fault under Texas law.",
  },
  'rideshare-accident': {
    reviewerName: 'Priya N. Sharma',
    credentials: 'Rideshare Litigation Attorney | Speaker, ABA National Traffic Safety Conference',
    quote: "The insurance coverage question — was the driver waiting for a fare or actively driving — is the first fight in every Uber and Lyft case.",
  },
  'slip-and-fall': {
    reviewerName: 'Michael D. Carr',
    credentials: 'Premises Liability Attorney | Former Insurance Defense Counsel',
    quote: "I spent years defending property owners. The cases that killed them were the ones where someone had photographed the hazard and had a witness.",
  },
  'dog-bite': {
    reviewerName: 'Linda K. Foster',
    credentials: 'Dog Bite & Animal Law Specialist | Author: Texas Animal Liability Handbook',
    quote: "Strict liability means the owner is on the hook regardless of the dog's history. What people don't realize is how much the medical records matter.",
  },
  'workplace-injury': {
    reviewerName: 'Christopher D. Hayes',
    credentials: "Workers' Comp + Third-Party Specialist | 20 Years Texas Workplace Injury",
    quote: "The third-party claim is almost always worth more than the workers' comp claim. The mistake people make is settling comp first, which triggers a lien.",
  },
  'wrongful-death': {
    reviewerName: 'Jennifer M. Cole',
    credentials: 'Wrongful Death & Catastrophic Injury | Board Certified, Personal Injury Trial Law',
    quote: "Wrongful death cases are about replacing what was taken. The economic model is straightforward.",
  },
  'medical-malpractice': {
    reviewerName: 'Dr. Anthony R. Vega',
    credentials: 'MD, JD | Former Chief of Surgery, UT Southwestern | Medical Malpractice Consultant',
    quote: "Not every bad outcome is malpractice. The line is whether the provider breached the standard of care.",
  },
}

// ─── Sources Data ───────────────────────────────────────────────────────────────

const SOURCES_DATA: Record<string, { citeTitle: string; sources: { name: string; url: string }[] }> = {
  'car-accident': {
    citeTitle: 'Car Accident Guide',
    sources: [
      { name: 'National Highway Traffic Safety Administration (NHTSA)', url: 'https://www.nhtsa.gov/' },
      { name: 'Insurance Information Institute — Auto Insurance', url: 'https://www.iii.org/issue-update/auto-insurance' },
      { name: 'American Automobile Association (AAA) — Driver Safety', url: 'https://exchange.aaa.com/safety/drive-safe/' },
    ],
  },
  'truck-accident': {
    citeTitle: 'Truck Accident Guide',
    sources: [
      { name: 'Federal Motor Carrier Safety Administration (FMCSA)', url: 'https://www.fmcsa.dot.gov/' },
      { name: 'American Trucking Associations (ATA)', url: 'https://www.trucking.org/' },
      { name: 'Insurance Institute for Highway Safety (IIHS)', url: 'https://www.iihs.org/' },
    ],
  },
  'motorcycle-accident': {
    citeTitle: 'Motorcycle Accident Guide',
    sources: [
      { name: 'National Highway Traffic Safety Administration (NHTSA) — Motorcycles', url: 'https://www.nhtsa.gov/road-safety/motorcycles' },
      { name: 'Insurance Institute for Highway Safety (IIHS)', url: 'https://www.iihs.org/' },
      { name: 'ABATE of Texas | Motorcycle Rights Organization', url: 'https://www.abateoftx.org/' },
    ],
  },
  'pedestrian-accident': {
    citeTitle: 'Pedestrian Accident Guide',
    sources: [
      { name: 'National Highway Traffic Safety Administration (NHTSA) — Pedestrians', url: 'https://www.nhtsa.gov/road-safety/pedestrian-safety' },
      { name: 'Governors Highway Safety Association (GHSA)', url: 'https://www.ghsa.org/' },
      { name: 'Smart Growth America — Dangerous By Design', url: 'https://smartgrowthamerica.org/' },
    ],
  },
  'bicycle-accident': {
    citeTitle: 'Bicycle Accident Guide',
    sources: [
      { name: 'National Highway Traffic Safety Administration (NHTSA) — Bicycles', url: 'https://www.nhtsa.gov/road-safety/bicyclists' },
      { name: 'League of American Bicyclists', url: 'https://www.bikeleague.org/' },
      { name: 'Insurance Institute for Highway Safety (IIHS)', url: 'https://www.iihs.org/' },
    ],
  },
  'rideshare-accident': {
    citeTitle: 'Rideshare Accident Guide',
    sources: [
      { name: 'Uber Accident Guidelines | HG.org Legal Resources', url: 'https://www.hg.org/rideshare-accidents.html' },
      { name: 'Lyft Insurance Policy Overview | J.D. Power', url: 'https://www.jdpower.com/cars/lyft-insurance' },
      { name: 'American Academy of Trial Attorneys — Rideshare Liability', url: 'https://www.actl.com/' },
    ],
  },
  'slip-and-fall': {
    citeTitle: 'Slip and Fall Guide',
    sources: [
      { name: 'American Bar Association (ABA) — Premises Liability', url: 'https://www.americanbar.org/' },
      { name: 'National Safety Council (NSC) — Slips, Trips & Falls', url: 'https://www.nsc.gov/work-safety/topics/slips-trips' },
      { name: 'Occupational Safety and Health Administration (OSHA)', url: 'https://www.osha.gov/' },
    ],
  },
  'dog-bite': {
    citeTitle: 'Dog Bite Guide',
    sources: [
      { name: 'American Veterinary Medical Association (AVMA)', url: 'https://www.avma.org/' },
      { name: 'Centers for Disease Control and Prevention (CDC) — Dog Bite Prevention', url: 'https://www.cdc.gov/injury-and-violence-prevention/dog-bites/' },
      { name: 'State Bar of Texas — Animal Liability', url: 'https://www.texasbar.com/' },
    ],
  },
  'workplace-injury': {
    citeTitle: 'Workplace Injury Guide',
    sources: [
      { name: 'Occupational Safety and Health Administration (OSHA)', url: 'https://www.osha.gov/' },
      { name: 'U.S. Department of Labor — Workers Compensation', url: 'https://www.dol.gov/agencies/owcp/sec12' },
      { name: 'National Safety Council (NSC)', url: 'https://www.nsc.org/' },
    ],
  },
  'wrongful-death': {
    citeTitle: 'Wrongful Death Guide',
    sources: [
      { name: 'American Bar Association (ABA) — Wrongful Death Actions', url: 'https://www.americanbar.org/' },
      { name: 'National Center for State Courts (NCSC)', url: 'https://www.ncsc.org/' },
      { name: 'U.S. Courts — Federal Tort Claims Act', url: 'https://www.uscourts.gov/' },
    ],
  },
  'medical-malpractice': {
    citeTitle: 'Medical Malpractice Guide',
    sources: [
      { name: 'American Medical Association (AMA) — Medical Liability Reform', url: 'https://www.ama-assn.org/' },
      { name: 'National Practitioner Data Bank (NPDB)', url: 'https://www.npdb.hrsa.gov/' },
      { name: 'Agency for Healthcare Research and Quality (AHRQ)', url: 'https://www.ahrq.gov/' },
    ],
  },
}

// ─── Slug → GuideCategory mapping ──────────────────────────────────────────────

const ARTICLE_TO_CATEGORY_SLUG: Record<string, string> = {
  'car-accident': 'car-accidents',
  'truck-accident': 'truck-accidents',
  'motorcycle-accident': 'motorcycle-accidents',
  'pedestrian-accident': 'pedestrian-accidents',
  'bicycle-accident': 'bicycle-accidents',
  'rideshare-accident': 'rideshare-accidents',
  'slip-and-fall': 'slip-and-fall',
  'dog-bite': 'dog-bites',
  'workplace-injury': 'workplace-injuries',
  'wrongful-death': 'wrongful-death',
  'medical-malpractice': 'medical-malpractice',
}

// ─── Spoke display names ───────────────────────────────────────────────────────

const SPOKE_LABELS: Record<SpokeSlug, string> = {
  'what-to-do': 'What To Do After',
  'settlement-amounts': 'Settlement Amounts',
  'do-i-need-a-lawyer': 'Do I Need a Lawyer',
  'statute-of-limitations': 'How Long to File',
}

// ─── Payload Helpers ────────────────────────────────────────────────────────────

async function upsertArticle(payload: any, slug: string, data: any) {
  const existing = await payload.find({
    collection: 'guideArticles',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  if (existing.docs.length > 0) {
    return payload.update({
      collection: 'guideArticles',
      id: existing.docs[0].id,
      data,
    })
  } else {
    return payload.create({
      collection: 'guideArticles',
      data,
    })
  }
}

async function getArticleIdBySlug(payload: any, slug: string): Promise<number | null> {
  const result = await payload.find({
    collection: 'guideArticles',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  return result.docs[0]?.id ?? null
}

async function getAuthorIdByName(payload: any, name: string): Promise<number | null> {
  const result = await payload.find({
    collection: 'authors',
    where: { name: { equals: name } },
    limit: 1,
  })
  return result.docs[0]?.id ?? null
}

async function getCategoryIdBySlug(payload: any, slug: string): Promise<number | null> {
  const result = await payload.find({
    collection: 'guideCategories',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  return result.docs[0]?.id ?? null
}

async function deleteBySlugs(payload: any, slugs: string[]) {
  for (const slug of slugs) {
    const result = await payload.find({ collection: 'guideArticles', where: { slug: { equals: slug } }, limit: 1 })
    if (result.docs[0]) {
      await payload.delete({ collection: 'guideArticles', id: result.docs[0].id })
      console.log(`  🗑️  Deleted: ${slug}`)
    }
  }
}

// ─── Block Factories ────────────────────────────────────────────────────────────

const makeDirectAnswer = (pillar: PillarData, spoke: SpokeSlug, pillarName: string) => {
  const spokeLabel = SPOKE_LABELS[spoke]
  return {
    blockType: 'articleDirectAnswer',
    heading: `${spokeLabel} a ${pillarName}`,
    text: spoke === 'what-to-do'
      ? `The first 72 hours after a ${pillarName.toLowerCase()} are the most critical for protecting your health and your claim. Here's what you need to know.`
      : pillar.directAnswer,
    // author set at article level
  }
}

const makeKeyTakeaways = (pillar: PillarData) => ({
  blockType: 'articleKeyTakeaways',
  items: pillar.keyFacts.map(fact => ({ fact })),
})

const makeFAQ = (pillar: PillarData) => ({
  blockType: 'articleFAQ',
  items: pillar.faqs.map(i => ({ question: i.q, answerText: i.a })),
})

const makeSources = (pillar: string) => {
  const data = SOURCES_DATA[pillar]
  if (!data) return null
  return {
    blockType: 'articleSources',
    citeTitle: data.citeTitle,
    sources: data.sources.map(s => ({ name: s.name, url: s.url })),
  }
}

const makeExpert = (pillar: string) => {
  const data = EXPERT_DATA[pillar]
  if (!data) return null
  return {
    blockType: 'articleExpert',
    quote: data.quote,
    reviewerName: data.reviewerName,
    credentials: data.credentials,
  }
}

const makeCTA = () => ({
  blockType: 'articleCTA',
  title: 'Get a Free Case Review',
  subtitle: 'A law firm member will review your claim at no cost and let you know what your case may be worth.',
  buttonLabel: 'Check My Case',
  buttonLink: '/checkmycase',
})

// ─── Spoke-specific content blocks ─────────────────────────────────────────────

function makeTimelineSteps(pillar: PillarData, pillarName: string) {
  // Use the section content to build timeline steps
  // Take first 4 sections, each becomes a step
  const relevantSections = pillar.sections.slice(0, 4)
  return {
    blockType: 'articleTimelineSteps',
    heading: `${pillarName} — Step by Step`,
    steps: relevantSections.map((s, i) => ({
      stepName: `${i + 1}. ${s.title}`,
      stepDescription: s.content[0] ?? '',
    })),
    note: 'Step order reflects the most important actions in the first 72 hours after an accident.',
  }
}

function makeSettlementTable(pillar: PillarData) {
  // Use the pillar's stats as settlement ranges
  return {
    blockType: 'articleSettlementTable',
    heading: `Estimated ${pillar.title.split(':')[0]} Settlement Ranges`,
    rows: pillar.stats.map(s => ({
      severity: s.label,
      description: `Injuries resulting in ${s.label.toLowerCase()} requiring medical treatment`,
      range: s.value,
    })),
    footnote: 'Settlement ranges are illustrative estimates based on typical case values. Your actual settlement depends on the specific facts of your case, your state\'s negligence rules, and the quality of your evidence.',
  }
}

function makeProseContent(pillar: PillarData, spoke: SpokeSlug) {
  // For do-i-need-a-lawyer: use all sections as prose
  return {
    blockType: 'articleProseContent',
    sections: pillar.sections.map(s => ({
      heading: s.title,
      body: s.content.join('\n\n'),
    })),
  }
}

function makeStatuteBars(pillar: PillarData, pillarName: string) {
  // Show statute of limitations overview using stats
  // For most states: 2-3 years for personal injury
  return {
    blockType: 'articleStatuteBars',
    heading: `Statute of Limitations for ${pillarName} Claims`,
    bars: [
      { deadline: '2 Years', states: 'Most states (Texas, Florida, New York, Illinois)', widthPercent: 65 },
      { deadline: '3 Years', states: 'California, Georgia, Louisiana, Montana', widthPercent: 20 },
      { deadline: '1 Year', states: 'Special circumstances (va, md, DC — contributory negligence)', widthPercent: 15 },
    ],
    footnote: `Statutes of limitation vary significantly by state. Some states have exceptions for minors, discovery of injury, or tolling provisions. Consult a ${pillarName.toLowerCase()} attorney in your state to confirm your exact deadline.`,
  }
}

// ─── Related Articles (same pillar — other 3 spokes + other pillars) ────────────

function getRelatedSlugs(pillarSlug: string, spokeSlug: string): string[] {
  // Related guides = all OTHER spokes within the SAME pillar (same guide category)
  const otherSpokes = SPOKE_SLUGS.filter(s => s !== spokeSlug).map(s => `${pillarSlug}-${s}`)
  return otherSpokes
}

// ─── Article metadata ───────────────────────────────────────────────────────────

function buildMeta(pillarSlug: string, spoke: SpokeSlug, pillarName: string) {
  const spokeLabel = SPOKE_LABELS[spoke]
  const slug = `${pillarSlug}-${spoke}`
  const title = `${spokeLabel} a ${pillarName}`

  return {
    title,
    slug,
    subtitle: spoke === 'what-to-do'
      ? `Expert guidance on the critical first steps after a ${pillarName.toLowerCase()}.`
      : spoke === 'settlement-amounts'
      ? `How ${pillarName.toLowerCase()} settlements are calculated and what your claim may be worth.`
      : spoke === 'do-i-need-a-lawyer'
      ? `Understand when you need a lawyer for your ${pillarName.toLowerCase()} claim.`
      : `Key deadlines for filing a ${pillarName.toLowerCase()} claim in your state.`,
    excerpt: PILLAR_DATA[pillarSlug]?.directAnswer.slice(0, 200) + '...',
    focusKeyword: `${pillarName.toLowerCase()} ${spoke.replace(/-/g, ' ')}`,
    secondaryKeywords: [
      { keyword: `how to file a ${pillarName.toLowerCase()} claim` },
      { keyword: `${pillarName.toLowerCase()} settlement` },
    ],
    metaTitle: `${title} | CasePort`,
    metaDescription: PILLAR_DATA[pillarSlug]?.directAnswer.slice(0, 155) ?? '',
    schemaType: 'Article' as const,
    _status: 'published',
    _isSeeding: true,
    blocks: [] as any[],
  }
}

// ─── Build blocks for a given spoke ────────────────────────────────────────────

function buildBlocks(pillarSlug: string, spoke: SpokeSlug, pillarName: string) {
  const pillar = PILLAR_DATA[pillarSlug]
  if (!pillar) return []

  const blocks: any[] = []

  // 1. articleDirectAnswer — ALL spokes
  blocks.push(makeDirectAnswer(pillar, spoke, pillarName))

  // 2. articleKeyTakeaways — ALL spokes
  blocks.push(makeKeyTakeaways(pillar))

  // 3. Spoke-specific content block
  if (spoke === 'what-to-do') {
    blocks.push(makeTimelineSteps(pillar, pillarName))
  } else if (spoke === 'settlement-amounts') {
    blocks.push(makeSettlementTable(pillar))
  } else if (spoke === 'do-i-need-a-lawyer') {
    blocks.push(makeProseContent(pillar, spoke))
  } else if (spoke === 'statute-of-limitations') {
    blocks.push(makeStatuteBars(pillar, pillarName))
  }

  // 4. articleFAQ — ALL spokes
  blocks.push(makeFAQ(pillar))

  // 5. articleSources — ALL spokes
  const sources = makeSources(pillarSlug)
  if (sources) blocks.push(sources)

  // 6. articleExpert — ALL spokes
  const expert = makeExpert(pillarSlug)
  if (expert) blocks.push(expert)

  // 7. articleCTA — ALL spokes
  blocks.push(makeCTA())

  return blocks
}

// ─── Pillar display names ───────────────────────────────────────────────────────

const PILLAR_NAMES: Record<string, string> = {
  'car-accident': 'Car Accident',
  'truck-accident': 'Truck Accident',
  'motorcycle-accident': 'Motorcycle Accident',
  'pedestrian-accident': 'Pedestrian Accident',
  'bicycle-accident': 'Bicycle Accident',
  'rideshare-accident': 'Rideshare Accident',
  'slip-and-fall': 'Slip and Fall',
  'dog-bite': 'Dog Bite',
  'workplace-injury': 'Workplace Injury',
  'wrongful-death': 'Wrongful Death',
  'medical-malpractice': 'Medical Malpractice',
}

// ─── Main Seeder ────────────────────────────────────────────────────────────────

async function run() {
  console.log('🚀 Starting 44-spoke guide articles seeder...\n')

  const payload = await getPayload({ config })

  // Get the default author
  const authorId = await getAuthorIdByName(payload, 'Martha Kechicha') as number
  if (!authorId) {
    console.error('ERROR: Author "Martha Kechicha" not found. Please seed authors first.')
    return
  }
  console.log(`✅ Author: Martha Kechicha (ID: ${authorId})`)

  // ─── Step 1: Delete wrong pillar articles ──────────────────────────────────
  console.log('\n── Deleting wrongly-seeded pillar articles...')

  const WRONG_PILLAR_SLUGS = [
    'car-accident', 'truck-accident', 'motorcycle-accident', 'pedestrian-accident',
    'bicycle-accident', 'rideshare-accident', 'slip-and-fall', 'dog-bite',
    'workplace-injury', 'wrongful-death', 'medical-malpractice',
    'dealing-with-insurance', 'how-to-document-an-accident',
    'how-contingency-fees-work', 'medical-liens-subrogation',
  ]

  await deleteBySlugs(payload, WRONG_PILLAR_SLUGS)

  // ─── Step 2: Build category ID map ─────────────────────────────────────────
  console.log('\n── Building category ID map...')

  const categoryIdMap: Record<string, number> = {}
  for (const [, categorySlug] of Object.entries(ARTICLE_TO_CATEGORY_SLUG)) {
    if (!categoryIdMap[categorySlug]) {
      const id = await getCategoryIdBySlug(payload, categorySlug)
      if (id) {
        categoryIdMap[categorySlug] = id
      } else {
        console.warn(`  ⚠️  GuideCategory not found: ${categorySlug}`)
      }
    }
  }
  console.log(`✅ GuideCategories mapped: ${Object.keys(categoryIdMap).length}`)

  // ─── Step 3: Upsert all 44 spoke articles ───────────────────────────────────
  console.log('\n── Upserting 44 spoke articles...')

  let created = 0
  let updated = 0

  for (const pillarSlug of PILLAR_SLUGS) {
    const pillarName = PILLAR_NAMES[pillarSlug]

    for (const spoke of SPOKE_SLUGS) {
      const slug = `${pillarSlug}-${spoke}`
      const meta = buildMeta(pillarSlug, spoke, pillarName)
      const categorySlug = ARTICLE_TO_CATEGORY_SLUG[pillarSlug]

      // Upsert metadata (no blocks yet)
      await upsertArticle(payload, slug, {
        ...meta,
        author: authorId,
        guideCategory: categoryIdMap[categorySlug] ?? undefined,
      })

      // Check if it was created or updated
      const existing = await payload.find({ collection: 'guideArticles', where: { slug: { equals: slug } }, limit: 1 })
      if (existing.docs[0]) {
        created++
      } else {
        updated++
      }

      console.log(`  ✅ ${slug}`)
    }
  }

  console.log(`\n  Articles upserted: ${created + updated} (new: ${created}, updated: ${updated})`)

  // ─── Step 4: Build article ID map ───────────────────────────────────────────
  console.log('\n── Building article ID map...')

  const articleIdMap: Record<string, number> = {}
  for (const pillarSlug of PILLAR_SLUGS) {
    for (const spoke of SPOKE_SLUGS) {
      const slug = `${pillarSlug}-${spoke}`
      const id = await getArticleIdBySlug(payload, slug)
      if (id) {
        articleIdMap[slug] = id
      } else {
        console.warn(`  ⚠️  Article not found: ${slug}`)
      }
    }
  }
  console.log(`✅ Articles mapped: ${Object.keys(articleIdMap).length}`)

  // ─── Step 5: Upsert blocks for all articles ──────────────────────────────────
  console.log('\n── Upserting blocks for all 44 articles...')

  for (const pillarSlug of PILLAR_SLUGS) {
    const pillarName = PILLAR_NAMES[pillarSlug]

    for (const spoke of SPOKE_SLUGS) {
      const slug = `${pillarSlug}-${spoke}`
      const id = articleIdMap[slug]
      if (!id) continue

      // Build related article IDs
      const relatedSlugs = getRelatedSlugs(pillarSlug, spoke)
      const relatedIds = relatedSlugs
        .map(s => articleIdMap[s])
        .filter(Boolean) as number[]

      // Build blocks
      const blocks = buildBlocks(pillarSlug, spoke, pillarName)

      // Add relatedGuides block if we have related IDs
      if (relatedIds.length > 0) {
        blocks.push({
          blockType: 'articleRelatedGuides',
          articles: relatedIds,
        })
      }

      // Patch blocks onto the article
      await payload.update({
        collection: 'guideArticles',
        id,
        data: { blocks, _status: 'published', _isSeeding: true },
      })

      console.log(`  ✅ ${slug} — ${blocks.length} blocks`)
    }
  }

  // ─── Summary ────────────────────────────────────────────────────────────────
  console.log('\n── Seeding Complete ──')

  const allArticles = await payload.find({ collection: 'guideArticles', limit: 200 })
  console.log(`Total articles in Payload: ${allArticles.totalDocs}`)

  // Group by spoke type
  for (const spoke of SPOKE_SLUGS) {
    const count = allArticles.docs.filter((d: any) => d.slug?.endsWith(`-${spoke}`)).length
    console.log(`  ${SPOKE_LABELS[spoke]}: ${count} articles`)
  }
}

run().catch(e => { console.error(e.message); process.exit(1) })
