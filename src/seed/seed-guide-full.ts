/**
 * seed-guide-full.ts
 * Complete reseed of guideCategories + guideArticles.
 * Run: npx tsx seed-guide-full.ts
 *
 * Wipes ALL existing guideCategories + guideArticles first.
 * Seeds 17 categories, each with proper blocks content.
 * Seeds 50 articles (44 spoke articles + 6 resource articles).
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'

// ─── Block helpers ──────────────────────────────────────────────────────────────

const directAnswer = (heading: string, text: string, authorId: number) => ({
  blockType: 'articleDirectAnswer',
  heading,
  text,
  author: authorId,
})

const keyTakeaways = (facts: string[]) => ({
  blockType: 'articleKeyTakeaways',
  items: facts.map((f) => ({ fact: f })),
})

const faq = (items: { q: string; a: string }[]) => ({
  blockType: 'articleFAQ',
  items: items.map((i) => ({ question: i.q, answerText: i.a })),
})

const sources = (citeTitle: string, sourcesArr: { name: string; url: string }[]) => ({
  blockType: 'articleSources',
  citeTitle,
  sources: sourcesArr,
})

const expert = (quote: string, name: string, creds: string) => ({
  blockType: 'articleExpert',
  quote,
  reviewerName: name,
  credentials: creds,
})

const cta = (title: string, subtitle: string) => ({
  blockType: 'articleCTA',
  title,
  subtitle,
  buttonLabel: 'Get Free Case Review',
})

const proseContent = (sections: { heading: string; body: string }[]) => ({
  blockType: 'articleProseContent',
  sections,
})

const timelineSteps = (
  heading: string,
  steps: { stepName: string; stepDescription: string }[],
  note?: string,
) => ({
  blockType: 'articleTimelineSteps',
  heading,
  steps,
  note,
})

// Category-level block helpers
// Splits a directAnswer string into a short heading (first sentence) and body text
function splitDirectAnswer(full: string): { heading: string; text: string } {
  // Find the first sentence-ending period followed by a space (or end of string)
  const m = full.match(/^([^.]+\.)(?:[\s]|$)/)
  if (m) {
    const heading = m[1].trim()
    const text = full.slice(heading.length).trim()
    return { heading, text }
  }
  // Fallback: split at ~200 chars
  const heading = full.slice(0, 200).trim()
  const text = full.slice(200).trim()
  return { heading, text }
}

const catDirectAnswer = (heading: string, text: string) => ({
  blockType: 'categoryDirectAnswer',
  heading,
  text,
})

const catKeyTakeaways = (facts: string[]) => ({
  blockType: 'categoryKeyTakeaways',
  items: facts.map((f) => ({ fact: f })),
})

const catProseSections = (sections: { title: string; content: string[] }[]) => ({
  blockType: 'categoryProseSections',
  sections: sections.map((s) => ({
    title: s.title,
    paras: s.content.map((text) => ({ text })),
  })),
})

const catFAQ = (items: { q: string; a: string }[]) => ({
  blockType: 'categoryFAQ',
  items: items.map((i) => ({ question: i.q, answer: i.a })),
})

const catSources = (citeTitle: string, srcs: { name: string; url: string }[]) => ({
  blockType: 'categorySources',
  citeTitle,
  sources: srcs,
})

const catExploreMore = (categoryIds: { id: number }[]) => ({
  blockType: 'categoryExploreMore',
  categories: categoryIds,
})

const catQuickAnswerStats = (stats: { label: string; value: string }[]) => {
  const find = (labelPrefix: string) => stats.find((s) => s.label.startsWith(labelPrefix))?.value
  return {
    blockType: 'categoryQuickAnswerStats',
    average: find('Avg Settlement') || find('Average') || find('Avg') || '',
    successRate: find('Success Rate') || find('Success') || '',
    timeline: find('Statute') || find('Filing Window') || '',
    upfront:
      find('Time to Resolve') ||
      find('Timeline') ||
      find('Insurance Limits') ||
      find('Coverage Disputes') ||
      '',
  }
}

// ─── Shared constants ───────────────────────────────────────────────────────────

const ATTORNEY = 'J.M.'
const ATTORNEY_CREDENTIALS = 'Personal Injury Attorney (20+ years)'
const ATTORNEY_BARRED = 'Barred in California, Texas, and New York'

const BASE_SOURCES = [
  { name: 'National Highway Traffic Safety Administration (NHTSA)', url: 'https://www.nhtsa.gov' },
  { name: 'Insurance Research Council', url: 'https://www.insurance.org' },
  { name: 'American Bar Association', url: 'https://www.americanbar.org' },
]

// ─── Static accident-type data (from accident-types.ts) ─────────────────────────

type AccidentData = {
  title: string
  category: string
  icon: string
  scene: string
  subtitle: string
  directAnswer: string
  stats: { label: string; value: string }[]
  keyFacts: string[]
  sections: { title: string; content: string[] }[]
}

const ACCIDENT_DATA: Record<string, AccidentData> = {
  'car-accident': {
    title: 'Car Accident Claims: Your Complete Guide to Maximum Recovery',
    category: 'Car Accident',
    icon: 'car',
    scene: 'Two-lane intersection, post-collision documentation',
    subtitle: 'Expert guidance on car accident claims, settlement values, and your legal rights.',
    directAnswer:
      "Car accidents are the most common personal injury claims. Average car accident settlements range from $15,000 to $100,000+ depending on injury severity, liability clarity, and your state's negligence rule. In contributory negligence states (VA, MD, DC), even 1% fault eliminates your entire recovery. The first 72 hours after a car accident are critical for evidence preservation and claim value protection.",
    stats: [
      { label: 'Avg Settlement', value: '$47K' },
      { label: 'Statute (Years)', value: '2–3' },
      { label: 'Success Rate', value: '85%+' },
      { label: 'Time to Resolve', value: '6–12mo' },
    ],
    keyFacts: [
      'Car accident settlements are calculated using the multiplier method: economic damages × 1.5x to 5x',
      'Insurance adjusters make first offers 40–60% below final value to test your knowledge',
      'Contributory negligence states (VA, MD, DC) bar 100% of recovery if you are found any % at fault',
      'Surveillance footage is overwritten within 72 hours — preserve it immediately',
      'Medical documentation is the primary driver of settlement value',
    ],
    sections: [
      {
        title: 'How Car Accident Settlements Are Calculated',
        content: [
          'Car accident settlements use the multiplier method. Insurance adjusters calculate your economic damages (medical bills, lost wages, property damage) and multiply by a factor of 1.5x to 5x depending on injury severity.',
          'The multiplier depends on injury severity. Minor injuries receive 1.5x to 2x. Moderate injuries receive 2x to 3.5x. Severe injuries receive 3.5x to 5x or higher.',
          "However, your state's negligence rule is applied first. In contributory negligence states, any fault eliminates your entire recovery. In comparative negligence states, your recovery is reduced by your percentage of fault.",
        ],
      },
      {
        title: 'Why First Settlement Offers Are Always Low',
        content: [
          'Insurance companies expect negotiation. First settlement offers are intentionally low, typically 40–60% below final value. Accepting the first offer means leaving significant money on the table.',
          'Insurance adjusters use psychological tactics to pressure you into accepting low offers: "This is our best offer," "Other claimants accepted less." These are negotiation tactics, not facts.',
          'Do not accept the first offer. Negotiate. If negotiations stall, consider litigation. Juries often award higher verdicts than insurance adjusters offer, especially in clear-liability cases.',
        ],
      },
      {
        title: 'Evidence Preservation in Car Accidents',
        content: [
          'Surveillance footage is overwritten within 72 hours. After 72 hours, the footage is gone forever. If an accident occurred on Monday, surveillance from nearby businesses will be overwritten by Thursday.',
          'Witness information is time-sensitive. Get names, phone numbers, and written statements from all witnesses while memory is fresh.',
          'Physical evidence disappears quickly. Skid marks fade within hours. Vehicle damage patterns change as vehicles are moved. Photograph everything immediately.',
        ],
      },
      {
        title: 'Medical Documentation and Claim Value',
        content: [
          'Your medical records document your injuries and recovery trajectory. Gaps in treatment allow insurance adjusters to argue your injuries were minor. Seek medical attention immediately.',
          'Some injuries (concussions, internal injuries, soft tissue damage) do not appear immediately. Comprehensive medical documentation is the foundation of your claim.',
          'Insurance adjusters scrutinize medical bills and treatment decisions. Detailed medical records protect your claim from these arguments.',
        ],
      },
    ],
  },
  'truck-accident': {
    title: 'Truck Accident Claims: Why These Cases Are Worth More',
    category: 'Truck Accident',
    icon: 'truck',
    scene: 'Commercial freight collision, federal evidence scene',
    subtitle:
      'Truck accident claims involve higher damages, complex liability, and federal regulations.',
    directAnswer:
      'Truck accidents result in more severe injuries and higher settlements than car accidents because trucks weigh 20–30 times more than cars. Average truck accident settlements range from $75,000 to $500,000+ depending on injury severity and liability. Truck companies carry higher insurance limits ($1M+) and are held to higher safety standards. Federal trucking regulations create additional liability exposure and evidence for your claim.',
    stats: [
      { label: 'Avg Settlement', value: '$185K' },
      { label: 'Injury Severity', value: 'High' },
      { label: 'Insurance Limits', value: '$1M+' },
      { label: 'Liability', value: 'Complex' },
    ],
    keyFacts: [
      'Truck accidents result in more severe injuries because trucks weigh 20–30 times more than cars',
      'Federal trucking regulations (HOS, maintenance, inspection) create additional liability exposure',
      'Truck companies carry higher insurance limits ($1M+) and are more likely to settle',
      'Black box data from trucks provides objective evidence of speed, braking, and driver behavior',
      'Trucking companies often carry multiple insurance policies, increasing available recovery',
    ],
    sections: [
      {
        title: 'Why Truck Accidents Result in Higher Settlements',
        content: [
          'Truck accidents result in more severe injuries because trucks weigh 20–30 times more than cars. The physics of collision are simple: heavier vehicles cause more damage.',
          'Truck accident injuries are typically catastrophic: multiple fractures, internal injuries, spinal cord damage, traumatic brain injury, amputation, and death.',
          'Truck companies carry higher insurance limits ($1M+) and are more likely to settle because they face significant liability exposure.',
        ],
      },
      {
        title: 'Federal Trucking Regulations Create Additional Liability',
        content: [
          'Federal trucking regulations (Hours of Service, vehicle maintenance, driver qualifications) create additional liability exposure. Violations of these regulations are evidence of negligence.',
          'Hours of Service violations are particularly damaging. Truck drivers are limited to 11 hours of driving per 14-hour work day. Violations indicate driver fatigue.',
          'Vehicle maintenance violations are also damaging. Trucks must be inspected regularly and maintained to federal standards.',
        ],
      },
      {
        title: 'Black Box Data and Objective Evidence',
        content: [
          'Modern trucks are equipped with electronic data recorders (black boxes) that record speed, braking, acceleration, and other vehicle data.',
          'Black box data can prove that the truck driver was speeding, failed to brake, or was distracted. This data is admissible in court and is extremely persuasive to juries.',
          'Trucking companies often try to destroy or hide black box data. Early legal action is critical to preserve this evidence.',
        ],
      },
      {
        title: 'Multiple Insurance Policies Increase Available Recovery',
        content: [
          'Trucking companies often carry multiple insurance policies: primary liability, excess liability, umbrella coverage, and cargo insurance. Each policy has separate limits.',
          'A truck accident might have $1M in primary liability, $2M in excess liability, and $5M in umbrella coverage, for a total of $8M in available insurance.',
          'Insurance companies often fight over which policy applies, but this is their problem, not yours. Your attorney coordinates with all insurers to maximize your recovery.',
        ],
      },
    ],
  },
  'motorcycle-accident': {
    title: 'Motorcycle Accident Claims: Overcoming Bias and Maximizing Recovery',
    category: 'Motorcycle Accident',
    icon: 'bike',
    scene: 'Rider down, intersection left-turn collision',
    subtitle: 'Motorcycle accident claims require overcoming bias and proving liability clearly.',
    directAnswer:
      "Motorcycle accidents result in severe injuries and death at rates 28 times higher than car accidents. Average motorcycle accident settlements range from $50,000 to $300,000+ depending on injury severity. Insurance companies and juries often apply bias against motorcycle riders, assuming they were reckless or at fault. Overcoming this bias requires clear evidence of the other party's liability and comprehensive medical documentation of your injuries.",
    stats: [
      { label: 'Avg Settlement', value: '$125K' },
      { label: 'Injury Severity', value: 'Severe' },
      { label: 'Fatality Rate', value: '28× Higher' },
      { label: 'Bias Factor', value: 'High' },
    ],
    keyFacts: [
      'Motorcycle accidents result in severe injuries and death at rates 28 times higher than car accidents',
      'Insurance companies and juries apply bias against motorcycle riders, assuming they were reckless',
      "Overcoming bias requires clear evidence of the other party's liability",
      'Motorcycle riders have limited protection, resulting in catastrophic injuries',
      'Comprehensive medical documentation is critical to overcome bias',
    ],
    sections: [
      {
        title: 'Understanding Bias Against Motorcycle Riders',
        content: [
          "Insurance companies and juries often apply bias against motorcycle riders, assuming they were reckless or at fault. Overcoming this bias requires clear evidence of the other party's negligence.",
          'Insurance adjusters use this bias to argue that you were speeding, weaving through traffic, or riding recklessly. They use this narrative to reduce your settlement or deny your claim entirely.',
          'Juries also apply this bias. Some jurors believe that motorcycle riders accept the risk of injury by choosing to ride.',
        ],
      },
      {
        title: 'Why Motorcycle Accidents Result in Severe Injuries',
        content: [
          "Motorcycle riders have no protection from impact. Cars have airbags, crumple zones, and steel frames. Motorcycles have only the rider's body.",
          'Motorcycle accident injuries are typically catastrophic: multiple fractures, road rash, spinal cord damage, traumatic brain injury, amputation, and death.',
          'Helmet use reduces head injury risk but does not prevent other injuries.',
        ],
      },
      {
        title: 'Proving Liability in Motorcycle Accidents',
        content: [
          "Proving liability in motorcycle accidents requires clear evidence of the other party's negligence. Witness testimony, surveillance footage, police reports, and accident reconstruction are critical.",
          'Insurance companies often argue that the motorcycle rider was speeding or weaving through traffic. Objective evidence counters these arguments.',
          'Accident reconstruction experts can analyze the scene, vehicle damage, and road conditions to determine what happened.',
        ],
      },
      {
        title: 'Medical Documentation and Overcoming Bias',
        content: [
          'Comprehensive medical documentation is critical to overcome bias and prove the severity of your injuries. Detailed medical records show the extent of your injuries and the long-term impact.',
          'Insurance companies often argue that motorcycle riders exaggerate their injuries. Detailed medical records counter these arguments.',
          "Follow your doctor's treatment recommendations exactly. Gaps in treatment allow insurance adjusters to argue your injuries were minor.",
        ],
      },
    ],
  },
  'pedestrian-accident': {
    title: 'Pedestrian Accident Claims: Vulnerable Road User Protection',
    category: 'Pedestrian Accident',
    icon: 'walk',
    scene: 'Marked crosswalk, urban arterial road',
    subtitle:
      'Pedestrian accident claims often involve clear liability and vulnerable user protections.',
    directAnswer:
      'Pedestrian accidents result in severe injuries and death because pedestrians have no protection from vehicle impact. Average pedestrian accident settlements range from $50,000 to $400,000+ depending on injury severity and liability. Many jurisdictions apply different negligence standards to vulnerable road users, providing additional protection. Pedestrian accidents are often clear liability cases because drivers have a duty to avoid hitting pedestrians.',
    stats: [
      { label: 'Avg Settlement', value: '$145K' },
      { label: 'Injury Severity', value: 'Severe' },
      { label: 'Clear Liability', value: '70%+' },
      { label: 'Vulnerable User', value: 'Protected' },
    ],
    keyFacts: [
      'Pedestrians have no protection from vehicle impact, resulting in severe injuries',
      'Many jurisdictions apply vulnerable user standards to pedestrians',
      'Drivers have a duty to avoid hitting pedestrians, even if pedestrians are partially at fault',
      'Pedestrian accident liability is often clear because drivers should see and avoid pedestrians',
      'Surveillance footage from nearby businesses and traffic cameras is often available',
    ],
    sections: [
      {
        title: 'Vulnerable User Standards Protect Pedestrians',
        content: [
          'Many jurisdictions apply vulnerable user standards to pedestrians, cyclists, and motorcyclists. These standards recognize that vulnerable road users deserve additional protection.',
          'Under vulnerable user standards, drivers must exercise extra care to avoid hitting vulnerable road users. Even if the pedestrian is partially at fault, the driver may still be liable.',
          'Vulnerable user standards shift the burden of care to drivers. Drivers must anticipate pedestrian behavior and take steps to avoid collision.',
        ],
      },
      {
        title: 'Why Pedestrian Accidents Result in Severe Injuries',
        content: [
          'Pedestrians have no protection from vehicle impact. When a vehicle hits a pedestrian, the pedestrian absorbs all the impact energy.',
          'Pedestrian accident injuries are typically catastrophic: multiple fractures, internal injuries, spinal cord damage, traumatic brain injury, and death.',
          'Pedestrian accident injuries depend on vehicle speed. A pedestrian struck at 20 mph has a 90% survival rate. At 40 mph, only 10%.',
        ],
      },
      {
        title: 'Proving Liability in Pedestrian Accidents',
        content: [
          'Pedestrian accident liability is often clear because drivers have a duty to avoid hitting pedestrians. Even if the pedestrian is jaywalking, the driver should see the pedestrian and take steps to avoid collision.',
          'Surveillance footage from nearby businesses, traffic cameras, and ATMs is often available in pedestrian accidents. This footage is objective evidence of what happened.',
          'Witness testimony is also valuable. Pedestrians often have witnesses who saw the accident.',
        ],
      },
      {
        title: 'Medical Documentation and Long-Term Impact',
        content: [
          'Pedestrian accident injuries often result in permanent disability, chronic pain, and reduced quality of life. Comprehensive medical documentation is critical to prove the long-term impact.',
          'Pedestrian accidents often result in multiple surgeries, extended hospitalization, and long-term rehabilitation.',
          "Follow your doctor's treatment recommendations exactly. Consistent medical documentation proves the long-term impact of your injuries.",
        ],
      },
    ],
  },
  'bicycle-accident': {
    title: 'Bicycle Accident Claims: Protecting Vulnerable Riders',
    category: 'Bicycle Accident',
    icon: 'bike',
    scene: 'Cyclist down, urban bike-lane collision',
    subtitle: 'Bicycle accident claims hinge on driver negligence and vulnerable-user protections.',
    directAnswer:
      'Bicycle accidents cause severe injuries because riders have no protection from a multi-ton vehicle. Average bicycle accident settlements range from $30,000 to $250,000+ depending on injury severity and liability. Most collisions are caused by drivers failing to yield, opening doors into bike lanes, or making right hooks. Many jurisdictions apply vulnerable-road-user standards, and a helmet does not bar recovery.',
    stats: [
      { label: 'Avg Settlement', value: '$95K' },
      { label: 'Injury Severity', value: 'Severe' },
      { label: 'Driver Fault', value: '70%+' },
      { label: 'Vulnerable User', value: 'Protected' },
    ],
    keyFacts: [
      'Most bike collisions are caused by drivers failing to yield, "dooring," or right-hook turns',
      'Vulnerable-road-user laws hold drivers to a heightened duty of care around cyclists',
      'Not wearing a helmet does not bar recovery in most states',
      'Head and spinal injuries make bicycle claims high-value despite the small vehicle',
      'Surveillance and traffic-camera footage is critical and overwritten within 72 hours',
    ],
    sections: [
      {
        title: 'Why Drivers Are Usually at Fault in Bicycle Accidents',
        content: [
          "Most bicycle accidents are caused by driver negligence, not cyclist error. The most common causes are drivers failing to yield at intersections, opening a car door into a bike lane, and making a right turn across a cyclist's path.",
          'Drivers frequently claim they "never saw" the cyclist. This is not a defense — it is an admission of inattention. Drivers have a duty to look for and yield to cyclists.',
          "Objective evidence — traffic-camera footage, witness testimony, and the physical damage pattern — usually establishes the driver's fault clearly.",
        ],
      },
      {
        title: 'Vulnerable Road User Protections',
        content: [
          'Many states and cities apply vulnerable-road-user standards that hold drivers to a heightened duty of care around cyclists. Some jurisdictions impose enhanced penalties when a driver injures a vulnerable user.',
          "These standards recognize the vast disparity between a cyclist and a motor vehicle. Even where a cyclist made a minor error, the driver's failure to exercise reasonable care can establish liability.",
          'In contributory-negligence jurisdictions, however, cyclist fault can still bar recovery — which makes careful documentation and legal guidance especially important.',
        ],
      },
      {
        title: 'The Helmet Question',
        content: [
          'Not wearing a helmet does not bar your recovery in most states. Insurance adjusters will raise it to argue comparative fault, but helmet non-use is generally inadmissible to liability.',
          'For head injuries, an insurer may argue a helmet would have reduced the harm. Medical evidence about the specific injury mechanism usually rebuts it.',
          'Wearing a helmet is always safer — but its absence should never stop an injured cyclist from pursuing a valid claim.',
        ],
      },
      {
        title: 'Documenting a Bicycle Accident Claim',
        content: [
          "Bicycle accident injuries are often catastrophic — traumatic brain injury, spinal damage, and multiple fractures — which makes thorough medical documentation essential to capturing the claim's full value.",
          'Preserve the bicycle in its damaged condition, photograph the scene and bike-lane markings, and request nearby surveillance footage immediately.',
          'Witness statements are especially valuable in bicycle cases because they counter the common driver narrative that the cyclist "came out of nowhere."',
        ],
      },
    ],
  },
  'rideshare-accident': {
    title: 'Rideshare Accident Claims: Navigating Complex Liability',
    category: 'Rideshare Accident',
    icon: 'nav',
    scene: 'Uber/Lyft collision, app-status evidence',
    subtitle:
      'Rideshare accident claims involve complex liability and insurance coverage disputes.',
    directAnswer:
      "Rideshare accidents involve complex liability because multiple parties may be responsible: the rideshare driver, Uber or Lyft, and possibly other parties. The rideshare company's insurance may apply if the driver was transporting a passenger. Preserve app records and GPS data immediately, and consult an attorney who understands rideshare liability. Average settlements range from $30,000 to $200,000+.",
    stats: [
      { label: 'Avg Settlement', value: '$85K' },
      { label: 'Liable Parties', value: 'Multiple' },
      { label: 'Insurance Limits', value: '$1M+' },
      { label: 'Coverage Disputes', value: 'Common' },
    ],
    keyFacts: [
      'Rideshare accidents involve complex liability because multiple parties may be responsible',
      'Rideshare companies carry insurance that covers accidents during active rides — up to $1M+ in liability limits',
      "The driver's app status at the time of the crash determines which insurance applies",
      'GPS and app records are critical evidence — preserve them immediately',
      'Multiple parties may be liable — the driver, Uber/Lyft, and other drivers',
    ],
    sections: [
      {
        title: 'Understanding Rideshare Liability',
        content: [
          'Rideshare accidents involve complex liability because multiple parties may be responsible: the rideshare driver, the rideshare company, other drivers, and vehicle manufacturers.',
          'The rideshare driver is responsible for operating the vehicle safely. If the driver was negligent, the driver is liable for your injuries.',
          "The rideshare company is also liable for the driver's negligence under the doctrine of vicarious liability.",
        ],
      },
      {
        title: 'Rideshare Insurance Coverage',
        content: [
          'Rideshare companies carry insurance that covers accidents during rides. The insurance limits are typically $1M+ for bodily injury liability. However, rideshare companies often dispute coverage.',
          "Rideshare insurance coverage depends on the driver's status at the time of the accident. If the driver was transporting a passenger, the rideshare company's insurance applies.",
          'Rideshare companies often argue that the driver was offline or waiting for a ride request to avoid coverage. Early legal action is critical to preserve evidence.',
        ],
      },
      {
        title: 'Investigating Rideshare Accidents',
        content: [
          "Rideshare accidents require investigation into the driver's background, training, and history. Rideshare companies are required to conduct background checks and maintain driver records.",
          "GPS data, app records, and telematics data from the vehicle can prove the driver's location, speed, and actions immediately before the accident.",
        ],
      },
      {
        title: 'Negotiating with Rideshare Companies',
        content: [
          'Rideshare companies employ sophisticated legal teams that aggressively defend claims. Negotiating with rideshare companies requires an experienced attorney.',
          'Rideshare companies often make low settlement offers to test your knowledge. Do not accept the first offer. Negotiate.',
          'If negotiations stall, litigation may be necessary. Juries are often sympathetic to injured passengers and skeptical of rideshare company defenses.',
        ],
      },
    ],
  },
  'slip-and-fall': {
    title: 'Slip and Fall Claims: Proving Premises Liability',
    category: 'Slip and Fall',
    icon: 'alert',
    scene: 'Wet-floor hazard, commercial premises',
    subtitle: "Slip and fall claims require proving the property owner's negligence.",
    directAnswer:
      "Slip and fall claims are premises liability cases where a property owner or manager is responsible for injuries caused by unsafe conditions on their property. Average slip and fall settlements range from $10,000 to $100,000+ depending on injury severity and the property owner's negligence. Proving premises liability requires showing that the property owner knew or should have known about the unsafe condition and failed to fix it or warn visitors.",
    stats: [
      { label: 'Avg Settlement', value: '$35K' },
      { label: 'Liability', value: 'Premises' },
      { label: 'Dispute Rate', value: 'High' },
      { label: 'Evidence', value: 'Critical' },
    ],
    keyFacts: [
      'Slip and fall claims are premises liability cases where property owners are responsible for unsafe conditions',
      'Property owners must maintain safe conditions and warn visitors of known hazards',
      'Proving premises liability requires showing the property owner knew or should have known about the unsafe condition',
      'Property owners often dispute liability and argue that the visitor was careless',
      'Early evidence preservation (photographs, witness statements, maintenance records) is critical',
    ],
    sections: [
      {
        title: 'Understanding Premises Liability',
        content: [
          'Premises liability is the legal doctrine that property owners are responsible for injuries caused by unsafe conditions on their property. Property owners must maintain safe conditions and warn visitors of known hazards.',
          'Property owners have a duty to inspect their property regularly and identify unsafe conditions. They also have a duty to fix unsafe conditions or warn visitors of the hazards.',
          'Property owners are liable for injuries caused by unsafe conditions only if they knew or should have known about the condition. This is called "constructive notice."',
        ],
      },
      {
        title: 'Proving the Property Owner Knew or Should Have Known',
        content: [
          'Proving that the property owner knew or should have known about the unsafe condition is critical. This requires evidence that the condition existed for a long time or that the property owner should have discovered it through regular inspection.',
          'Maintenance records are critical evidence. If the property owner failed to inspect or maintain the property, this shows constructive notice.',
          'Photographs of the unsafe condition are critical. Take photographs immediately after the accident showing the exact condition that caused your injury.',
        ],
      },
      {
        title: 'Common Slip and Fall Hazards',
        content: [
          'Common slip and fall hazards include wet floors, ice, debris, uneven surfaces, poor lighting, and broken stairs. Each hazard requires different evidence to prove premises liability.',
          'Wet floor hazards require evidence that the property owner failed to dry the floor or warn visitors. Ice hazards require evidence of failure to salt or sand the surface.',
          'Uneven surface and broken stair hazards require evidence that the property owner knew about the condition and failed to fix it.',
        ],
      },
      {
        title: 'Property Owner Defenses and How to Counter Them',
        content: [
          'Property owners often argue that the visitor was careless. This is called "assumption of risk" or "comparative negligence." However, property owners cannot escape liability by arguing that visitors should have been more careful.',
          'Property owners also argue that the hazard was "open and obvious" and therefore they had no duty to warn. However, even obvious hazards require warning if they pose a serious risk of injury.',
          'Property owners may also argue that they did not have constructive notice. However, if the hazard existed for a long time, regular inspection should have discovered it.',
        ],
      },
    ],
  },
  'dog-bite': {
    title: 'Dog Bite Claims: Holding Negligent Dog Owners Accountable',
    category: 'Dog Bite',
    icon: 'dog',
    scene: 'Strict-liability injury, owner negligence case',
    subtitle: 'Dog bite claims hold dog owners accountable for injuries caused by their dogs.',
    directAnswer:
      "Dog bite claims hold dog owners responsible for injuries caused by their dogs. Average dog bite settlements range from $15,000 to $100,000+ depending on injury severity and the dog owner's negligence. Most states apply strict liability for dog bites, meaning the dog owner is liable even if the dog had no history of aggression. Dog bite injuries often require multiple surgeries, result in permanent scarring, and cause psychological trauma.",
    stats: [
      { label: 'Avg Settlement', value: '$42K' },
      { label: 'Strict Liability', value: '35 States' },
      { label: 'Scarring', value: 'Common' },
      { label: 'Insurance Cover', value: 'Usually' },
    ],
    keyFacts: [
      'Most states apply strict liability for dog bites, meaning the dog owner is liable even if the dog had no history of aggression',
      'Dog bite injuries often require multiple surgeries and result in permanent scarring',
      'Psychological trauma (fear of dogs, anxiety) is a valid claim in dog bite cases',
      'Dog owners have a duty to control their dogs and prevent them from injuring others',
      'Early medical documentation and evidence preservation are critical to maximize recovery',
    ],
    sections: [
      {
        title: 'Strict Liability vs. Negligence in Dog Bite Cases',
        content: [
          'Most states (35+) apply strict liability for dog bites, meaning the dog owner is liable for injuries caused by their dog even if the dog had no history of aggression and the owner took reasonable precautions.',
          'Strict liability removes the need to prove that the dog owner was negligent. You only need to prove that the dog bit you and caused injury.',
          'A few states apply a "one bite rule" where the dog owner is liable only if they knew the dog was dangerous.',
        ],
      },
      {
        title: 'Dog Bite Injuries and Medical Treatment',
        content: [
          'Dog bite injuries range from minor puncture wounds to severe lacerations requiring multiple surgeries. Severe bites often cause permanent scarring, disfigurement, and loss of function.',
          'Dog bite injuries often become infected because dog mouths contain bacteria. Immediate medical treatment is critical.',
          'Dog bite injuries often require multiple surgeries to repair tissue damage, reduce scarring, and restore function.',
        ],
      },
      {
        title: 'Psychological Trauma and Emotional Damages',
        content: [
          'Dog bite injuries often cause psychological trauma including fear of dogs, anxiety, and post-traumatic stress disorder (PTSD). These psychological injuries are valid claims in dog bite cases.',
          'Children are particularly vulnerable to psychological trauma from dog bites.',
          'Psychological trauma is documented through mental health treatment records. Therapy, counseling, and psychiatric treatment prove the psychological impact.',
        ],
      },
      {
        title: 'Holding Dog Owners Accountable',
        content: [
          'Dog owners have a duty to control their dogs and prevent them from injuring others. This includes keeping dogs on leashes, maintaining fences, and preventing dogs from roaming free.',
          'Dog owners who violate local leash laws or allow dogs to roam free are negligent and liable for injuries caused by their dogs.',
          'If the dog owner knew the dog was dangerous and failed to take precautions, this may justify punitive damages in addition to compensatory damages.',
        ],
      },
    ],
  },
  'workplace-injury': {
    title: "Workplace Injury Claims: Beyond Workers' Compensation",
    category: 'Workplace Injury',
    icon: 'bldg',
    scene: 'Job-site incident, third-party liability case',
    subtitle: "Workplace injury claims may include third-party liability beyond workers' comp.",
    directAnswer:
      "Most workplace injuries are covered by workers' compensation, which pays medical bills and partial lost wages regardless of fault — but bars you from suing your employer. The larger recovery often comes from a third-party claim against a negligent party who is not your employer. Average third-party workplace settlements range from $50,000 to $500,000+ and can include full pain-and-suffering damages.",
    stats: [
      { label: 'Avg Settlement', value: '$120K' },
      { label: "Workers' Comp", value: 'No-Fault' },
      { label: 'Third-Party', value: 'Full Damages' },
      { label: 'Pain & Suffering', value: '3rd-Party Only' },
    ],
    keyFacts: [
      "Workers' comp pays medical bills and partial wages regardless of fault, but bars pain-and-suffering",
      'A third-party claim against a non-employer can recover full damages, including pain and suffering',
      'Common third parties: equipment makers, subcontractors, property owners, and other drivers',
      "You can usually pursue workers' comp and a third-party claim at the same time",
      "Workers' comp deadlines are short — report the injury to your employer immediately",
    ],
    sections: [
      {
        title: "Workers' Compensation: What It Covers and Its Limits",
        content: [
          "Workers' compensation is a no-fault system: it pays your medical bills and a portion of your lost wages regardless of who caused the injury. In exchange, you generally cannot sue your employer for negligence.",
          "The trade-off is significant. Workers' comp does not pay for pain and suffering, and it replaces only part of your wages.",
          "Workers' comp deadlines are strict. Report the injury to your employer immediately and in writing — late reporting is a common reason valid claims are denied.",
        ],
      },
      {
        title: 'The Third-Party Claim: Where the Real Value Often Is',
        content: [
          "A third-party claim is a separate lawsuit against a negligent party who is not your employer. Unlike workers' comp, a third-party claim can recover full damages — including pain and suffering.",
          'Common third parties include the manufacturer of defective equipment, a subcontractor or general contractor on a job site, the property owner where you were injured, and the at-fault driver in a work-related vehicle crash.',
          "You can usually pursue both at once: workers' comp covers immediate needs while the third-party claim pursues the full value of your injury.",
        ],
      },
      {
        title: 'Common Third-Party Workplace Scenarios',
        content: [
          'Defective machinery and tools: when equipment lacks proper guards or fails due to a design or manufacturing defect, the manufacturer may be liable in a product-liability claim.',
          'Construction sites: with multiple companies on one site, a subcontractor or general contractor whose negligence injured you can be a third-party defendant.',
          'Work-related vehicle crashes: if you are injured driving for work by another negligent driver, that driver (and their insurer) is a third party.',
        ],
      },
      {
        title: 'Coordinating Comp and Third-Party Recovery',
        content: [
          "When you recover from both workers' comp and a third-party claim, your employer's comp insurer typically has a lien — a right to be reimbursed from the third-party recovery for what it paid.",
          'Skilled handling of the comp lien can substantially increase your net recovery, sometimes reducing or waiving the reimbursement owed.',
        ],
      },
    ],
  },
  'medical-malpractice': {
    title: 'Medical Malpractice: Proving Negligence in Healthcare',
    category: 'Medical Malpractice',
    icon: 'steth',
    scene: 'Clinical setting, medical negligence evidence',
    subtitle:
      "When a healthcare provider's negligence causes harm — what counts, what it takes to prove, and why these cases are different.",
    directAnswer:
      'Medical malpractice occurs when a healthcare provider deviates from the accepted standard of care and that deviation injures the patient. It is one of the most complex and heavily-regulated areas of personal injury: nearly every state requires an expert physician to certify the claim, damage caps often apply, and deadlines are short and unusual. Not every bad outcome is malpractice — medicine carries inherent risk. The question is always whether a competent provider, in the same situation, would have acted differently. Strong cases pair a clear standard-of-care breach with serious, documented harm.',
    stats: [
      { label: 'Proof Standard', value: 'Expert Required' },
      { label: 'Damage Caps', value: 'Many States' },
      { label: 'Deadlines', value: 'Short / Unusual' },
      { label: 'Case Value', value: 'High' },
    ],
    keyFacts: [
      'Malpractice requires a breach of the accepted standard of care — not just a bad outcome',
      'Most states require an expert physician affidavit to even file the case',
      'Many states cap non-economic damages in malpractice specifically',
      'Statutes of limitations are short and often run from discovery of the harm',
      'Common types: misdiagnosis, surgical error, medication error, birth injury',
    ],
    sections: [
      {
        title: 'What Counts as Medical Malpractice',
        content: [
          'Medical malpractice has four elements: a duty of care (a provider-patient relationship), a breach of the accepted standard of care, causation (the breach caused the injury), and damages (real harm resulted). All four must be present — a poor outcome alone is not enough.',
          'The "standard of care" is what a reasonably competent provider in the same specialty would have done in the same circumstances. Establishing it almost always requires testimony from a qualified physician in the same field.',
          'Common malpractice types include misdiagnosis or delayed diagnosis, surgical errors, medication and dosage errors, anesthesia errors, birth injuries, and failure to obtain informed consent.',
        ],
      },
      {
        title: 'Why These Cases Are Different',
        content: [
          'Medical malpractice is procedurally unlike other injury claims. Most states require a "certificate of merit" or expert affidavit — a qualified physician must attest the case has merit — before you can file. This raises the cost and bar to entry.',
          'Many states also impose caps on non-economic damages (pain and suffering) in malpractice cases specifically, even where no cap applies to ordinary injury claims. Economic damages — medical bills and lost earnings — are generally not capped.',
          'Deadlines are short and unusual. Some run from the date of the negligence, others from when the patient discovered (or should have discovered) the harm. Special rules apply to minors and to objects left in the body.',
        ],
      },
      {
        title: 'Proving Causation — the Hard Part',
        content: [
          'The toughest element in most malpractice cases is causation: proving the provider\'s breach — not the underlying illness — caused the harm. A patient who was already seriously ill presents a difficult "but for" question.',
          'This is where expert evidence is decisive. Specialists reconstruct what should have happened, what did happen, and how the difference produced the injury. The quality of that expert testimony often determines the outcome.',
          'Because of the cost and complexity, reputable firms screen malpractice cases rigorously and take only those with both a clear breach and serious, documented damages.',
        ],
      },
    ],
  },
  'wrongful-death': {
    title: 'Wrongful Death Claims: Seeking Justice and Maximum Recovery',
    category: 'Wrongful Death',
    icon: 'heart',
    scene: 'Memorial — family compensation case',
    subtitle:
      'When negligence takes a life — seeking justice and maximum recovery for your family.',
    directAnswer:
      "Wrongful death claims allow family members to recover damages when a loved one dies due to another party's negligence. Average wrongful death settlements range from $100,000 to $1,000,000+ depending on the deceased's age, earning potential, and relationship to the family. Wrongful death claims are emotionally complex but legally straightforward: if negligence caused death, the responsible party is liable for all damages.",
    stats: [
      { label: 'Avg Settlement', value: '$350K' },
      { label: 'High-Value', value: '$1M+' },
      { label: 'Punitive', value: 'Available' },
      { label: 'Filing Window', value: '2–3yr' },
    ],
    keyFacts: [
      'Wrongful death claims allow family members to recover damages when a loved one dies due to negligence',
      'Damages include lost income, funeral expenses, and pain and suffering of surviving family members',
      "The deceased's age and earning potential are primary factors in settlement value",
      'Wrongful death claims are emotionally complex but legally straightforward',
      'Early legal action is critical to preserve evidence and protect family interests',
    ],
    sections: [
      {
        title: 'What Constitutes Wrongful Death',
        content: [
          "Wrongful death occurs when a person dies as a result of another party's negligence, recklessness, or intentional conduct. The responsible party is liable for all damages resulting from the death.",
          'Wrongful death claims can arise from car accidents, truck accidents, pedestrian accidents, medical malpractice, workplace accidents, and other incidents involving negligence.',
          'To prove wrongful death, you must show that the responsible party owed a duty of care, breached that duty, and the breach caused the death.',
        ],
      },
      {
        title: 'Who Can File a Wrongful Death Claim',
        content: [
          "Wrongful death claims are filed by the deceased's estate or by surviving family members. The specific family members who can file depend on state law.",
          'In some states, only the estate can file. In other states, surviving family members can file directly.',
          'If the deceased had no surviving family members, the claim may be filed by the estate for the benefit of creditors.',
        ],
      },
      {
        title: 'Calculating Wrongful Death Damages',
        content: [
          'Wrongful death damages include economic damages (lost income, lost benefits, funeral expenses) and non-economic damages (pain and suffering of surviving family members).',
          "Lost income is calculated based on the deceased's age, earning potential, and life expectancy.",
          'Non-economic damages depend on the relationship between the deceased and surviving family members. Spouses and minor children typically recover higher non-economic damages.',
        ],
      },
      {
        title: 'The Emotional and Legal Process',
        content: [
          'Wrongful death claims are emotionally complex. Families are grieving while also pursuing legal action. An experienced attorney handles the legal process.',
          'Early legal action is critical to preserve evidence and protect family interests.',
        ],
      },
    ],
  },
}

// ─── Category definitions (17 total) ─────────────────────────────────────────

type CategoryDef = {
  slug: string
  dataKey: string
  title: string
  heroTitle: string
  heroSubtitle: string
  metaTitle: string
  metaDescription: string
  kind: 'accident' | 'guide' | 'faq'
}

const CATEGORIES: CategoryDef[] = [
  {
    slug: 'car-accidents',
    dataKey: 'car-accident',
    title: 'Car Accidents',
    heroTitle: 'Your Complete Guide to Car Accident Claims',
    heroSubtitle:
      'From the first 72 hours after your accident to the moment you receive your settlement — everything you need to know.',
    metaTitle: 'Car Accident Claims Guide | CasePort',
    metaDescription:
      'Complete guide to car accident claims: settlements, deadlines, attorney selection, and what your claim is really worth.',
    kind: 'accident',
  },
  {
    slug: 'truck-accidents',
    dataKey: 'truck-accident',
    title: 'Truck Accidents',
    heroTitle: 'Truck Accident Claims: Why These Cases Are Worth More',
    heroSubtitle:
      'Federal regulations, black box data, and higher insurance limits — what you need to know after a truck accident.',
    metaTitle: 'Truck Accident Claims Guide | CasePort',
    metaDescription:
      'Complete guide to truck accident claims: higher settlements, federal trucking regulations, and why truck cases are worth more.',
    kind: 'accident',
  },
  {
    slug: 'motorcycle-accidents',
    dataKey: 'motorcycle-accident',
    title: 'Motorcycle Accidents',
    heroTitle: 'Motorcycle Accident Claims: Overcoming Bias and Maximizing Recovery',
    heroSubtitle:
      'Severe injuries, insurance bias, and clear liability — what every motorcyclist needs to know after a crash.',
    metaTitle: 'Motorcycle Accident Claims Guide | CasePort',
    metaDescription:
      'Complete guide to motorcycle accident claims: overcoming bias, proving liability, and maximizing your recovery.',
    kind: 'accident',
  },
  {
    slug: 'pedestrian-accidents',
    dataKey: 'pedestrian-accident',
    title: 'Pedestrian Accidents',
    heroTitle: 'Pedestrian Accident Claims: Vulnerable Road User Protection',
    heroSubtitle:
      'Clear liability, severe injuries, and vulnerable road user protections — what you need to know after a pedestrian accident.',
    metaTitle: 'Pedestrian Accident Claims Guide | CasePort',
    metaDescription:
      'Complete guide to pedestrian accident claims: liability, vulnerable road user protections, and settlements.',
    kind: 'accident',
  },
  {
    slug: 'bicycle-accidents',
    dataKey: 'bicycle-accident',
    title: 'Bicycle Accidents',
    heroTitle: 'Bicycle Accident Claims: Protecting Vulnerable Riders',
    heroSubtitle:
      'Severe injuries, driver negligence, and vulnerable road user protections — what every cyclist needs to know.',
    metaTitle: 'Bicycle Accident Claims Guide | CasePort',
    metaDescription:
      'Complete guide to bicycle accident claims: proving driver fault, vulnerable road user laws, and settlements.',
    kind: 'accident',
  },
  {
    slug: 'rideshare-accidents',
    dataKey: 'rideshare-accident',
    title: 'Rideshare Accidents',
    heroTitle: 'Rideshare Accident Claims: Navigating Complex Liability',
    heroSubtitle:
      'Uber, Lyft, and complex liability — what you need to know after a rideshare accident.',
    metaTitle: 'Rideshare Accident Claims Guide | CasePort',
    metaDescription:
      'Complete guide to rideshare accident claims: complex liability, insurance coverage, and settlements.',
    kind: 'accident',
  },
  {
    slug: 'slip-and-fall',
    dataKey: 'slip-and-fall',
    title: 'Slip & Fall',
    heroTitle: 'Slip and Fall Claims: Proving Premises Liability',
    heroSubtitle:
      'Property owner negligence, evidence preservation, and what it takes to win a slip and fall claim.',
    metaTitle: 'Slip and Fall Claims Guide | CasePort',
    metaDescription:
      'Complete guide to slip and fall claims: proving premises liability, evidence preservation, and settlements.',
    kind: 'accident',
  },
  {
    slug: 'dog-bites',
    dataKey: 'dog-bite',
    title: 'Dog Bites',
    heroTitle: 'Dog Bite Claims: Holding Negligent Dog Owners Accountable',
    heroSubtitle:
      'Strict liability, severe injuries, and permanent scarring — what you need to know after a dog bite.',
    metaTitle: 'Dog Bite Claims Guide | CasePort',
    metaDescription:
      'Complete guide to dog bite claims: strict liability, injury documentation, and settlements.',
    kind: 'accident',
  },
  {
    slug: 'workplace-injuries',
    dataKey: 'workplace-injury',
    title: 'Workplace Injuries',
    heroTitle: "Workplace Injury Claims: Beyond Workers' Compensation",
    heroSubtitle: "Third-party claims, full damages, and why workers' comp is only half the story.",
    metaTitle: 'Workplace Injury Claims Guide | CasePort',
    metaDescription:
      "Complete guide to workplace injury claims: workers' comp limits, third-party claims, and full damages.",
    kind: 'accident',
  },
  {
    slug: 'medical-malpractice',
    dataKey: 'medical-malpractice',
    title: 'Medical Malpractice',
    heroTitle: 'Medical Malpractice: Proving Negligence in Healthcare',
    heroSubtitle:
      "When a healthcare provider's negligence causes harm — what counts, what it takes to prove, and why these cases are different.",
    metaTitle: 'Medical Malpractice Claims Guide | CasePort',
    metaDescription:
      'Complete guide to medical malpractice claims: standard of care, expert testimony, and damage caps.',
    kind: 'accident',
  },
  {
    slug: 'wrongful-death',
    dataKey: 'wrongful-death',
    title: 'Wrongful Death',
    heroTitle: 'Wrongful Death Claims: Seeking Justice and Maximum Recovery',
    heroSubtitle:
      'When negligence takes a life — seeking justice and maximum recovery for your family.',
    metaTitle: 'Wrongful Death Claims Guide | CasePort',
    metaDescription:
      'Complete guide to wrongful death claims: damages, filing deadlines, and seeking justice for your family.',
    kind: 'accident',
  },
  {
    slug: 'dealing-with-insurance',
    dataKey: 'dealing-with-insurance',
    title: 'Dealing With Insurance',
    heroTitle: 'Dealing With Insurance After an Accident',
    heroSubtitle:
      "What the adjuster is really doing, what you're required to say, and the exact words that protect your claim.",
    metaTitle: 'Dealing With Insurance After an Accident | CasePort',
    metaDescription:
      'What insurance adjusters do, what you are required to say, and the exact tactics that protect your claim.',
    kind: 'guide',
  },
  {
    slug: 'how-to-document-an-accident',
    dataKey: 'how-to-document-an-accident',
    title: 'How To Document An Accident',
    heroTitle: 'How to Document an Accident: Evidence That Protects Your Claim',
    heroSubtitle:
      'The exact evidence to capture — and the order to capture it in — before it disappears.',
    metaTitle: 'How to Document an Accident | CasePort',
    metaDescription:
      'The exact evidence to capture after an accident, and the order to capture it in, before it disappears.',
    kind: 'guide',
  },
  {
    slug: 'how-contingency-fees-work',
    dataKey: 'how-contingency-fees-work',
    title: 'How Contingency Fees Work',
    heroTitle: 'How Contingency Fees Work: What a PI Lawyer Actually Costs',
    heroSubtitle: '"No fee unless you win" — explained plainly, with the actual numbers.',
    metaTitle: 'How Contingency Fees Work | CasePort',
    metaDescription:
      'What personal-injury contingency fees actually cost: the numbers, the structure, and what protects you.',
    kind: 'guide',
  },
  {
    slug: 'medical-liens-subrogation',
    dataKey: 'medical-liens-subrogation',
    title: 'Medical Liens & Subrogation',
    heroTitle: 'Medical Liens & Subrogation: What Reduces Your Settlement Check',
    heroSubtitle:
      'Who gets paid back from your settlement, why your check is smaller than the headline number, and how good negotiation protects your share.',
    metaTitle: 'Medical Liens & Subrogation Guide | CasePort',
    metaDescription:
      'Medical liens and subrogation: who gets paid from your settlement and how to reduce what they take.',
    kind: 'guide',
  },
  {
    slug: 'faq',
    dataKey: 'faq',
    title: 'Injury Claim FAQ',
    heroTitle: 'Injury Claim FAQ: Direct Answers to Common Questions',
    heroSubtitle:
      'Direct, structured answers to the questions people — and AI assistants — ask most about injury claims.',
    metaTitle: 'Injury Claim FAQ | CasePort',
    metaDescription:
      'Direct answers to the most common personal injury questions: settlements, lawyers, deadlines, and process.',
    kind: 'faq',
  },
]

// ─── Spoke article block generators ───────────────────────────────────────────

function whatToDoBlocks(pillarName: string, accidentKey: string, authorId: number) {
  const name = pillarName.replace(/s$/, '')
  const textMap: Record<string, string> = {
    'car-accident': `After a car accident, call 911 and get medical care even if you feel fine. Document the scene with photos, exchange insurance information, and avoid giving recorded statements to any insurer before consulting a personal injury attorney. Car accident settlements average $15,000 to $100,000+ depending on injury severity, liability clarity, and your state's negligence rule.`,
    'truck-accident': `Truck accidents cause severe injuries and involve federal trucking regulations, multiple insurance policies, and black box data. Preserve evidence immediately, avoid recorded statements to any insurer, and consult a personal injury attorney who understands federal trucking law. Average truck accident settlements range from $75,000 to $500,000+.`,
    'motorcycle-accident': `Motorcycle accidents result in severe injuries at 28 times the rate of car accidents. Get medical care immediately — even minor motorcycle accidents can cause serious injuries. Document the scene carefully, overcome bias by proving the other driver's fault, and avoid recorded statements. Average settlements range from $50,000 to $300,000+.`,
    'pedestrian-accident': `Pedestrian accidents cause severe injuries because pedestrians have no protection from vehicles. Get immediate medical care, document the scene thoroughly, and preserve surveillance footage from nearby cameras. Vulnerable road user protections in many jurisdictions strengthen your claim. Average settlements range from $50,000 to $400,000+.`,
    'bicycle-accident': `Bicycle accidents cause severe injuries because riders have no vehicle protection. Get medical care immediately, document the scene and vehicle damage, preserve surveillance footage, and collect witness contacts. Driver negligence — not cyclist error — causes most collisions. Average settlements range from $30,000 to $250,000+.`,
    'rideshare-accident': `Rideshare accidents involve complex liability — the driver, Uber or Lyft, and possibly other parties. The rideshare company's insurance may apply if the driver was transporting a passenger. Preserve app records and GPS data immediately. Average settlements range from $30,000 to $200,000+.`,
    'slip-and-fall': `Slip and fall claims require proving the property owner knew or should have known about the unsafe condition. Document the hazard immediately with photos, preserve surveillance footage from the premises, and get medical care for your injuries. Property owners often dispute liability — early evidence is critical. Average settlements range from $10,000 to $100,000+.`,
    'dog-bite': `Dog bite injuries require immediate medical care — infections are common and serious. Document your injuries with photos, get the dog owner's information, and report the incident to animal control. Most states apply strict liability for dog bites. Average settlements range from $15,000 to $100,000+.`,
    'workplace-injury': `Most workplace injuries are covered by workers' compensation — but third-party claims against negligent parties can recover full damages including pain and suffering. Report your injury to your employer immediately and in writing. Preserve evidence. Average third-party settlements range from $50,000 to $500,000+.`,
    'wrongful-death': `A wrongful death occurs when someone dies due to another party's negligence. Consult an attorney immediately — statutes of limitations apply and evidence must be preserved. Damages include lost income, funeral expenses, and pain and suffering of surviving family members. Average settlements range from $100,000 to $1,000,000+.`,
    'medical-malpractice': `Medical malpractice occurs when a healthcare provider deviates from the accepted standard of care and that deviation injures the patient. Most states require an expert physician to certify the claim, damage caps often apply, and deadlines are short. Not every bad outcome is malpractice. Strong cases pair a clear breach with serious, documented harm.`,
  }
  const factsMap: Record<string, string[]> = {
    'car-accident': [
      'Call 911 & get a report — The police report anchors the entire claim.',
      "Document everything — Photos, video, witnesses, and the other party's info.",
      'Guard your words — No fault admissions, no recorded statement to the insurer.',
      'Act within 72 hours — Surveillance footage is often overwritten by then.',
    ],
    'truck-accident': [
      'Federal trucking regulations create additional liability exposure.',
      'Black box data can prove driver fatigue or negligence — preserve it immediately.',
      'Multiple insurance policies may apply — increasing available recovery.',
      'Trucking companies send investigators to the scene — protect your rights first.',
    ],
    'motorcycle-accident': [
      'Motorcycle injuries are catastrophic — comprehensive medical documentation is essential.',
      "Bias against riders is real — clear evidence of the other driver's fault is critical.",
      'Head and spinal injuries make these claims high-value.',
      'Surveillance footage is often overwritten within 72 hours — act immediately.',
    ],
    'pedestrian-accident': [
      'Pedestrians have no protection — injuries are almost always severe.',
      'Vulnerable road user standards in many states strengthen your claim.',
      'Surveillance footage from nearby cameras is often available and critical.',
      '70%+ of pedestrian accidents involve clear driver fault.',
    ],
    'bicycle-accident': [
      'Most bike collisions are caused by driver negligence — failing to yield, dooring, right hooks.',
      'Vulnerable road user laws hold drivers to a heightened duty around cyclists.',
      'Not wearing a helmet does not bar your recovery in most states.',
      'Surveillance footage is critical and overwritten within 72 hours.',
    ],
    'rideshare-accident': [
      'Rideshare insurance may cover accidents during active rides — up to $1M+ in liability limits.',
      "The driver's app status at the time of the crash determines which insurance applies.",
      'GPS and app records are critical evidence — preserve them immediately.',
      'Multiple parties may be liable — the driver, Uber/Lyft, and other drivers.',
    ],
    'slip-and-fall': [
      'Property owners must maintain safe conditions and warn of known hazards.',
      'Proving the owner knew or should have known about the hazard is critical.',
      'Photographs of the exact hazard are the most powerful evidence.',
      'Maintenance and inspection records can prove constructive notice.',
    ],
    'dog-bite': [
      'Most states apply strict liability — the owner is liable even without prior aggression.',
      'Dog bites cause serious infections and require immediate medical treatment.',
      'Injuries often require multiple surgeries and cause permanent scarring.',
      'Psychological trauma — fear of dogs, anxiety, PTSD — is a valid claim component.',
    ],
    'workplace-injury': [
      "Workers' comp covers medical bills and partial wages — but no pain and suffering.",
      'A third-party claim can recover full damages, including pain and suffering.',
      'Common third parties: equipment manufacturers, subcontractors, property owners.',
      "Workers' comp deadlines are strict — report your injury immediately and in writing.",
    ],
    'wrongful-death': [
      'Wrongful death allows family members to recover for lost income, funeral expenses, and suffering.',
      "The deceased's age and earning potential are primary factors in settlement value.",
      "Early legal action preserves evidence and protects the family's interests.",
      'Punitive damages may be available if the conduct was egregious.',
    ],
    'medical-malpractice': [
      'Malpractice requires a breach of the accepted standard of care — not just a bad outcome.',
      'Most states require an expert physician affidavit to even file the case.',
      'Many states cap non-economic damages in malpractice specifically.',
      'Statutes of limitations are short and often run from discovery of the harm.',
    ],
  }
  const stepsMap: Record<string, { stepName: string; stepDescription: string }[]> = {
    'car-accident': [
      {
        stepName: 'Call 911 & Ensure Safety',
        stepDescription:
          'Move out of traffic if possible. Call 911 even for minor accidents — the police report anchors the entire claim.',
      },
      {
        stepName: 'Document the Scene',
        stepDescription:
          'Photograph all vehicles, damage, road conditions, traffic signals, skid marks, and your injuries from multiple angles before anything moves.',
      },
      {
        stepName: 'Exchange Information',
        stepDescription:
          "Get the other driver's name, license plate, insurance policy number, and contact information.",
      },
      {
        stepName: 'Collect Witnesses',
        stepDescription:
          'Ask witnesses for their name, phone number, and a brief account of what they saw — while memory is fresh.',
      },
      {
        stepName: 'Get Medical Care',
        stepDescription:
          'Seek evaluation the same day, even if you feel fine. Some injuries appear hours or days later. Keep every record.',
      },
      {
        stepName: 'Contact a Representative',
        stepDescription:
          'Before giving any recorded statements or accepting any offers, speak with a personal injury attorney.',
      },
    ],
    'truck-accident': [
      {
        stepName: 'Call 911 & Get Medical Help',
        stepDescription:
          'Truck accidents cause severe injuries. Request emergency medical care and police at the scene.',
      },
      {
        stepName: 'Document the Scene',
        stepDescription:
          'Photograph all vehicles, cargo, skid marks, road conditions. Capture the truck DOT number and carrier info.',
      },
      {
        stepName: 'Preserve Black Box Data',
        stepDescription:
          'Electronic data recorders overwrite quickly. Send a preservation demand to the trucking company immediately.',
      },
      {
        stepName: 'Collect Driver & Carrier Info',
        stepDescription:
          "Get the driver's license, insurance, and carrier details. Note hours-of-service if you observed anything.",
      },
      {
        stepName: 'Get Witness Contacts',
        stepDescription:
          'Collect names and contact information from all witnesses while memory is fresh.',
      },
      {
        stepName: 'Contact an Attorney',
        stepDescription:
          'Trucking companies deploy immediate response teams. Protect your rights before giving any statements.',
      },
    ],
    'motorcycle-accident': [
      {
        stepName: 'Get Medical Care',
        stepDescription:
          'Motorcycle injuries are often catastrophic. Seek emergency medical care immediately.',
      },
      {
        stepName: 'Document the Scene',
        stepDescription:
          'Photograph vehicle damage, the road, skid marks, traffic signals, and your injuries from multiple angles.',
      },
      {
        stepName: 'Identify the Other Driver',
        stepDescription: "Get the other driver's license, insurance, and vehicle registration.",
      },
      {
        stepName: 'Preserve Evidence',
        stepDescription:
          'Surveillance footage and witness information are critical. Act quickly before they disappear.',
      },
      {
        stepName: 'Counter Bias',
        stepDescription:
          'Insurance adjusters apply bias against motorcyclists. Let your attorney handle all communication.',
      },
      {
        stepName: 'Consult an Attorney',
        stepDescription:
          'A lawyer who understands motorcycle claims fights bias and maximizes your recovery.',
      },
    ],
    'pedestrian-accident': [
      {
        stepName: 'Call 911 & Get Medical Help',
        stepDescription:
          'Pedestrian injuries are often severe. Request emergency medical care at the scene.',
      },
      {
        stepName: 'Document the Scene',
        stepDescription:
          'Photograph the vehicle, the crosswalk, traffic signals, road conditions, and your injuries.',
      },
      {
        stepName: 'Identify the Driver',
        stepDescription:
          "Get the driver's license, insurance, and vehicle plate. Note the driver's behavior.",
      },
      {
        stepName: 'Preserve Surveillance Footage',
        stepDescription:
          'Nearby cameras may have captured the accident. Request preservation immediately before overwrite.',
      },
      {
        stepName: 'Collect Witness Information',
        stepDescription: 'Get names and contact details from all witnesses who saw the collision.',
      },
      {
        stepName: 'Consult an Attorney',
        stepDescription:
          'Pedestrian accidents often involve clear liability — an attorney maximizes your recovery.',
      },
    ],
    'bicycle-accident': [
      {
        stepName: 'Get Medical Care',
        stepDescription: 'Bicycle injuries are often catastrophic. Seek immediate care.',
      },
      {
        stepName: 'Document the Scene',
        stepDescription:
          'Photograph the vehicle damage, bike, road markings, traffic signals, and your injuries.',
      },
      {
        stepName: 'Identify the Driver',
        stepDescription: "Get the driver's license, insurance, and vehicle plate.",
      },
      {
        stepName: 'Preserve the Bicycle',
        stepDescription:
          'Do not repair the bike — its damage pattern proves how the collision occurred.',
      },
      {
        stepName: 'Collect Witnesses',
        stepDescription:
          "Witnesses can counter the driver's narrative that the cyclist 'came out of nowhere.'",
      },
      {
        stepName: 'Consult an Attorney',
        stepDescription:
          "A lawyer who understands bicycle claims proves the driver's fault and maximizes recovery.",
      },
    ],
    'rideshare-accident': [
      {
        stepName: 'Get Medical Care',
        stepDescription:
          'Seek medical attention immediately, even for minor injuries. Document all treatment.',
      },
      {
        stepName: 'Identify the Rideshare Status',
        stepDescription:
          'Note whether the driver was offline, waiting for a request, en route, or transporting a passenger.',
      },
      {
        stepName: 'Preserve App & GPS Records',
        stepDescription:
          "Your trip history and GPS data prove the driver's status at the time of the crash. Screenshot and preserve.",
      },
      {
        stepName: 'Document the Scene',
        stepDescription:
          'Photograph all vehicles, damage, road conditions, and injuries at the scene.',
      },
      {
        stepName: "Get the Driver's Info",
        stepDescription: "Collect the driver's name, license, insurance, and vehicle plate.",
      },
      {
        stepName: 'Consult an Attorney',
        stepDescription:
          'Rideshare companies dispute liability aggressively. An attorney preserves evidence and fights for maximum recovery.',
      },
    ],
    'slip-and-fall': [
      {
        stepName: 'Get Medical Care',
        stepDescription:
          'Seek medical attention immediately for your injuries. Document every visit and treatment.',
      },
      {
        stepName: 'Photograph the Hazard',
        stepDescription:
          'Take photos of the exact condition that caused your fall — wet floor, debris, uneven surface, poor lighting.',
      },
      {
        stepName: 'Report the Incident',
        stepDescription:
          'Notify the property owner or manager immediately. Get a copy of any incident report.',
      },
      {
        stepName: 'Preserve Surveillance Footage',
        stepDescription:
          'Request the property preserve surveillance footage before it is overwritten.',
      },
      {
        stepName: 'Collect Witness Information',
        stepDescription:
          'Get names and contact details from anyone who witnessed the fall or the hazardous condition.',
      },
      {
        stepName: 'Consult an Attorney',
        stepDescription:
          'Property owners dispute these claims aggressively. An attorney protects your evidence and builds your case.',
      },
    ],
    'dog-bite': [
      {
        stepName: 'Get Medical Care',
        stepDescription:
          'Dog bites cause serious infections and require immediate medical treatment.',
      },
      {
        stepName: 'Identify the Dog & Owner',
        stepDescription: "Get the owner's name, address, and dog's vaccination records.",
      },
      {
        stepName: 'Report to Animal Control',
        stepDescription:
          'Report the bite to local animal control. This creates an official record.',
      },
      {
        stepName: 'Photograph Your Injuries',
        stepDescription:
          'Document the bite wounds immediately and throughout your treatment and recovery.',
      },
      {
        stepName: 'Preserve Evidence',
        stepDescription: 'Note if the owner violated leash laws or other pet regulations.',
      },
      {
        stepName: 'Consult an Attorney',
        stepDescription:
          'Dog bite claims involve strict liability and complex insurance. An attorney maximizes your recovery.',
      },
    ],
    'workplace-injury': [
      {
        stepName: 'Get Medical Care',
        stepDescription:
          'Seek immediate medical attention. Tell the provider this is a work-related injury.',
      },
      {
        stepName: 'Report to Your Employer',
        stepDescription:
          'Report the injury in writing immediately — delayed reporting is a common reason claims are denied.',
      },
      {
        stepName: 'Document the Scene',
        stepDescription:
          'Photograph the equipment, conditions, or vehicle that caused your injury.',
      },
      {
        stepName: 'Identify Responsible Parties',
        stepDescription:
          'A third party — not your employer — may be liable: equipment manufacturers, subcontractors, property owners, or other drivers.',
      },
      {
        stepName: 'Preserve Evidence',
        stepDescription:
          'Defective equipment, maintenance records, and surveillance footage are critical.',
      },
      {
        stepName: 'Consult an Attorney',
        stepDescription:
          "Workers' comp and third-party claims require different strategies. An attorney coordinates both.",
      },
    ],
    'wrongful-death': [
      {
        stepName: 'Secure the Scene & Evidence',
        stepDescription:
          'If possible, preserve evidence of what caused the death before it is cleaned or repaired.',
      },
      {
        stepName: 'Get a Police Report',
        stepDescription: 'Request the official report documenting the incident and its cause.',
      },
      {
        stepName: 'Preserve Medical Records',
        stepDescription:
          "The deceased's medical records before and after the incident may be relevant to causation.",
      },
      {
        stepName: 'Identify All Potential Defendants',
        stepDescription:
          'Multiple parties may be liable — the driver, employer, property owner, or healthcare provider.',
      },
      {
        stepName: 'Consult an Attorney',
        stepDescription:
          'Wrongful death cases are time-sensitive and emotionally complex. An attorney handles the legal process while you focus on family.',
      },
      {
        stepName: 'Act Within the Statute of Limitations',
        stepDescription:
          'Wrongful death deadlines are typically 2–3 years — but evidence disappears quickly.',
      },
    ],
    'medical-malpractice': [
      {
        stepName: 'Get a Second Medical Opinion',
        stepDescription:
          'If you suspect malpractice, get a second opinion from another qualified provider in the same specialty.',
      },
      {
        stepName: 'Request Your Medical Records',
        stepDescription:
          'Obtain all medical records related to the alleged malpractice — this is your right in every state.',
      },
      {
        stepName: 'Document the Harm',
        stepDescription:
          'Record all injuries, complications, and how the harm has affected your daily life and finances.',
      },
      {
        stepName: 'Identify the Provider & Facility',
        stepDescription:
          'Get the names of all providers involved, the facility, and the dates of treatment.',
      },
      {
        stepName: 'Consult a Malpractice Attorney',
        stepDescription:
          'Malpractice cases require expert physician review. An attorney can obtain the required certificate of merit.',
      },
      {
        stepName: 'Act Before the Deadline',
        stepDescription:
          'Malpractice statutes of limitations are often short and run from discovery of the harm — not the date of the procedure.',
      },
    ],
  }

  const text = textMap[accidentKey] || textMap['car-accident']
  const facts = factsMap[accidentKey] || factsMap['car-accident']
  const steps = stepsMap[accidentKey] || stepsMap['car-accident']

  return [
    directAnswer(`What you need to know after a ${name.toLowerCase()}`, text, authorId),
    keyTakeaways(facts),
    timelineSteps(
      `The first 72 hours after a ${name.toLowerCase()} — step by step`,
      steps,
      'If anyone is seriously hurt, call 911 first. This is general guidance, not legal or medical advice.',
    ),
    faq([
      {
        q: `What is the first thing to do after a ${name.toLowerCase()}?`,
        a: 'Ensure everyone is safe and call 911 — request police even for a minor incident. The official report is the single most important document in your claim.',
      },
      {
        q: `Should I see a doctor after a ${name.toLowerCase()} even if I feel fine?`,
        a: 'Yes. Adrenaline masks injuries, and some conditions take hours or days to appear. A same-day medical record also connects your injuries to the event, which protects a claim.',
      },
      {
        q: `What should I not do after a ${name.toLowerCase()}?`,
        a: "Do not admit fault, apologize, or say you are fine; do not give the other side's insurer a recorded statement; and do not accept a quick settlement before you know the full extent of your injuries.",
      },
    ]),
    sources(`What To Do After a ${name} — Complete Guide`, BASE_SOURCES),
    expert(
      "The first 72 hours after an accident are critical. What you do — or don't do — during that window can dramatically affect the outcome of your claim.",
      ATTORNEY,
      ATTORNEY_CREDENTIALS,
    ),
    cta(
      `Just Had a ${name}?`,
      'See a doctor first. Then get a free, confidential case review to protect your rights — at no cost.',
    ),
  ]
}

function settlementBlocks(pillarName: string, authorId: number) {
  const name = pillarName.replace(/s$/, '')
  return [
    directAnswer(
      'How settlements are calculated',
      "There is no flat settlement figure — value is driven by injury severity, clear liability, and your state's negligence rule. Adjusters multiply economic damages by roughly 1.5x–5x for severity, then your state's fault rule adjusts the result. First offers commonly arrive 40–60% below real value.",
      authorId,
    ),
    keyTakeaways([
      'Severity drives value — Minor strains and catastrophic injuries are worlds apart.',
      'The multiplier method — Economic damages × 1.5x–5x estimates pain and suffering.',
      "Your state's rule applies — Fault reduces — or in some states bars — recovery.",
      'Net ≠ gross — Fees and liens come out; use the calculator below.',
    ]),
    proseContent([
      {
        heading: 'Why First Offers Are Always Low',
        body: 'Insurance companies expect negotiation. First settlement offers are intentionally low, typically 40–60% below final value, to test whether you know what your claim is worth.',
      },
      {
        heading: 'The Multiplier Method',
        body: `Most adjusters calculate non-economic damages by multiplying your economic damages (medical bills and lost wages) by 1.5x to 5x depending on injury severity. Minor injuries receive 1.5x to 2x. Moderate injuries receive 2x to 3.5x. Severe injuries receive 3.5x to 5x or higher.`,
      },
      {
        heading: "Your State's Fault Rule",
        body: "Your state's comparative or contributory negligence rule is applied before the multiplier. In pure comparative states, your recovery is reduced by your fault percentage. In contributory negligence states (VA, MD, DC, NC, AL), any fault bars your entire recovery.",
      },
    ]),
    faq([
      {
        q: 'How much is the average settlement?',
        a: 'There is no reliable "average" because value depends on severity, liability, and state law. Minor injuries may settle in the low five figures; severe and catastrophic cases reach six and seven figures.',
      },
      {
        q: 'How is a settlement calculated?',
        a: "Adjusters total economic damages and multiply by roughly 1.5x to 5x based on severity. Your state's negligence rule is then applied.",
      },
      {
        q: 'Why is the first settlement offer so low?',
        a: 'Insurers expect negotiation, so first offers commonly come in 40–60% below real value. Accepting ends the claim permanently.',
      },
    ]),
    sources(`How ${name} Settlements Are Calculated`, BASE_SOURCES),
    expert(
      'First offers are designed to test whether you know what your claim is worth. Never accept the first offer without understanding the full value of your case.',
      ATTORNEY,
      ATTORNEY_CREDENTIALS,
    ),
    cta(
      'What Is Your Claim Worth?',
      'No one can value a claim without the records. Get a free, confidential review to find out.',
    ),
  ]
}

function doINeedLawyerBlocks(pillarName: string, authorId: number) {
  const name = pillarName.replace(/s$/, '')
  return [
    directAnswer(
      'An honest answer about needing a lawyer',
      `You are not required to hire a lawyer, but representation usually increases outcomes when injuries are serious, liability is disputed, or your state's fault rule is harsh. Because personal-injury lawyers work on contingency (no upfront cost, no fee unless they win), a free consultation lets you find out where your case stands at no risk.`,
      authorId,
    ),
    keyTakeaways([
      'Serious or lasting injury — Representation strongly recommended.',
      'Disputed liability — A lawyer protects you from a shifted-fault denial.',
      'Contingency = no upfront cost — You pay a fee only from a recovery.',
      'Free to ask — A consultation costs nothing and carries no obligation.',
    ]),
    proseContent([
      {
        heading: 'When you likely do',
        body: 'Representation tends to pay for itself when injuries are serious or lasting, when liability is disputed, when multiple parties or insurers are involved, or when you are in a harsh-fault state. Studies consistently show represented claimants net more even after fees.',
      },
      {
        heading: 'When you might not',
        body: 'For a truly minor incident with no injuries, a clear-liability property-damage-only claim, and a fair early offer, you may be able to handle it yourself. The honest test: if there is any injury, any treatment, or any fault dispute, a free consultation costs nothing and clarifies the stakes.',
      },
      {
        heading: 'It costs nothing to ask',
        body: 'Personal-injury lawyers work on contingency — no upfront fee, and no attorney fee unless they recover for you. A consultation is free and carries no obligation.',
      },
    ]),
    faq([
      {
        q: 'Do I need a lawyer?',
        a: 'Not always, but it usually helps when there are injuries, disputed fault, or a harsh state fault rule. Represented claimants often net more even after fees, because insurers value unrepresented claims lower.',
      },
      {
        q: 'How much does a lawyer cost?',
        a: 'Most work on contingency: about one-third (33%) of the recovery, often around 40% if the case goes to trial. You pay no upfront fee, and if there is no recovery you generally owe no attorney fee.',
      },
      {
        q: 'Is it worth getting a lawyer for a minor case?',
        a: 'For a truly minor incident with no injuries, clear liability, and a fair early offer, you may not need one. But if there is any injury, treatment, or fault dispute, a free consultation is worth it.',
      },
    ]),
    sources(`Do I Need a Lawyer for a ${name} Claim?`, BASE_SOURCES),
    expert(
      'The statistic that claimants with attorney representation recover 3.5x more than those without is one of the most consistent findings in personal injury law.',
      ATTORNEY,
      ATTORNEY_CREDENTIALS,
    ),
    cta(
      'Not Sure If You Need a Lawyer?',
      'Find out in minutes. A free, confidential case review tells you exactly where your claim stands.',
    ),
  ]
}

function statuteBlocks(pillarName: string, authorId: number) {
  const name = pillarName.replace(/s$/, '')
  return [
    directAnswer(
      'Your filing deadline',
      'The deadline to file — the statute of limitations — is set by each state and typically runs 1 to 6 years from the date of injury (most commonly 2–3). Miss it and your claim is permanently barred, no matter how strong. But evidence disappears far sooner: surveillance footage within 72 hours, witness memory within weeks.',
      authorId,
    ),
    keyTakeaways([
      '1–6 years by state — Most are 2–3 years from the date of injury.',
      'Hard cutoff — Miss it and the claim is barred permanently.',
      'Evidence expires first — Footage and witnesses fade within days to weeks.',
      'Government claims differ — Short notice windows — sometimes months.',
    ]),
    proseContent([
      {
        heading: 'Why the Deadline Is a Wall',
        body: 'The statute of limitations is not a suggestion — it is a hard legal cutoff. Courts dismiss cases filed even one day late, regardless of how clear the liability or serious the injuries. I have seen clients lose claims worth hundreds of thousands of dollars because they waited too long to act.',
      },
      {
        heading: 'When the Clock Starts',
        body: 'Usually on the date of injury. Some states use a "discovery rule" that starts the clock when you discovered (or should have discovered) the harm. For minors, the clock is often paused until they turn 18.',
      },
      {
        heading: 'Government Claims Are Different',
        body: 'Claims against government entities — a city bus, a postal worker, or a government hospital — typically require notice within 180 days to 1 year, far shorter than the standard civil statute.',
      },
    ]),
    faq([
      {
        q: 'How long do I have to file?',
        a: 'Typically 1 to 6 years from the date of injury, most commonly 2 to 3. The deadline is a hard cutoff: miss it and the claim is permanently barred.',
      },
      {
        q: 'What happens if I miss the deadline?',
        a: 'If you file after the statute of limitations expires, the court will dismiss the case and you lose the right to recover, regardless of how clear the liability is.',
      },
      {
        q: 'When does the filing clock start?',
        a: 'Usually on the date of the injury. Some states use a "discovery rule" that starts it when the harm was discovered. Minors may have the clock paused until adulthood.',
      },
    ]),
    sources(`Statute of Limitations for ${name} Claims`, BASE_SOURCES),
    expert(
      'I have seen clients lose claims worth hundreds of thousands of dollars because they waited too long to act. The statute of limitations is not a suggestion — it is a wall.',
      ATTORNEY,
      ATTORNEY_CREDENTIALS,
    ),
    cta(
      'Worried About Your Filing Deadline?',
      "Don't risk it. A free, confidential case review confirms your deadline and what to do now.",
    ),
  ]
}

// ─── Resource article block generators ─────────────────────────────────────────

function insuranceBlocks(authorId: number) {
  return [
    directAnswer(
      'What the adjuster is really doing',
      "After an accident, the other driver's insurance adjuster is not a neutral party — their job is to resolve your claim for as little as possible. You are not legally required to give a recorded statement, sign a blanket medical authorization, or accept a first offer. The safest approach: report the facts to your own insurer, decline recorded statements from the other side, never speculate about fault or say \"I'm fine,\" and route substantive communication through a representative. First offers commonly come in 40–60% below a claim's real value.",
      authorId,
    ),
    keyTakeaways([
      "You are not required to give the other driver's insurer a recorded statement.",
      'A blanket medical authorization hands over your entire history — limit it.',
      'First settlement offers are typically 40–60% below real value.',
      '"I\'m fine" and fault speculation are used to cut your claim.',
    ]),
    proseContent([
      {
        heading: 'Whose Side the Adjuster Is On',
        body: "An insurance adjuster's role is to protect the insurer's money. Every question is designed to establish shared fault, minimize your injuries, or lock you into an early, low number. Understanding that framing changes how you respond.",
      },
      {
        heading: 'The Tactics — and the Counter to Each',
        body: 'The recorded statement: you can decline. The blanket medical authorization: authorize only records tied to this accident. The quick offer: do not accept before you know the full extent of your injuries.',
      },
    ]),
    faq([
      {
        q: "Do I have to give the other driver's insurance a recorded statement?",
        a: "No. You are not legally required to give the other party's insurer a recorded statement. Adjusters request it because recorded answers can be used against you.",
      },
      {
        q: 'Why is the first insurance settlement offer so low?',
        a: "Insurers expect negotiation, so first offers commonly come in 40–60% below a claim's real value — often before your full injuries are known. Accepting ends the claim permanently.",
      },
      {
        q: 'Should I sign the medical authorization the adjuster sent?',
        a: 'Not a blanket one. A broad authorization gives the insurer your entire medical history to search for pre-existing conditions. Limit any release to records directly related to this accident.',
      },
    ]),
    sources('Dealing With Insurance After an Accident', BASE_SOURCES),
    expert(
      "The first 72 hours after an accident are critical. What you do — or don't do — during that window can dramatically affect the outcome of your claim.",
      ATTORNEY,
      ATTORNEY_CREDENTIALS,
    ),
    cta(
      'Have an Insurance Adjuster Contacting You?',
      'Get a free, confidential case review before you say anything that could hurt your claim.',
    ),
  ]
}

function documentBlocks(authorId: number) {
  return [
    directAnswer(
      'The exact evidence to capture — and the order to capture it in',
      'Documenting an accident well, in the first hours and days, is the single biggest thing you can do to protect a claim. The priority order: ensure safety and call 911, then photograph everything, collect witness names and numbers, exchange information, and request a police report. Within 72 hours, preserve any nearby surveillance footage before it is overwritten. Evidence fades fast — skid marks within hours, footage within days, witness memory within weeks.',
      authorId,
    ),
    keyTakeaways([
      'Call 911 and get a police report — it anchors the entire claim.',
      'Photograph vehicles, positions, the scene, signals, and injuries.',
      'Collect witness names and numbers while memory is fresh.',
      'Preserve nearby surveillance footage within 72 hours.',
      'Keep a daily symptom and treatment log from day one.',
    ]),
    proseContent([
      {
        heading: 'The First Hour: What to Capture',
        body: 'Safety first — move to a safe spot if you can and call 911. Photograph everything before anything moves. Exchange information and collect witness contacts.',
      },
      {
        heading: 'The First 72 Hours: Preserve What Fades',
        body: 'Surveillance footage is typically overwritten within 48–72 hours. Identify cameras that may have caught the crash and request preservation immediately. Start a daily log: your symptoms, pain levels, missed work, and every medical visit.',
      },
    ]),
    faq([
      {
        q: 'What should I photograph after a car accident?',
        a: 'Photograph vehicle damage from multiple angles, the final positions, license plates, the roadway and intersection, traffic signals and signs, skid marks and debris, weather and lighting conditions, and any visible injuries.',
      },
      {
        q: 'How long do I have to get surveillance footage of my accident?',
        a: 'Usually 48–72 hours. Nearby business cameras, traffic cameras, and doorbell cameras typically overwrite within a few days. Identify possible cameras immediately and send a preservation request.',
      },
      {
        q: 'Should I keep a journal after my accident?',
        a: 'Yes. A daily log of your symptoms, pain levels, missed work, and medical visits creates a contemporaneous record that is far more credible than a later reconstruction.',
      },
    ]),
    sources('How to Document an Accident', BASE_SOURCES),
    expert(
      'Evidence disappears fast. Skid marks fade, witnesses forget details, and surveillance footage can be overwritten within days. The moment you delay is the moment you lose leverage.',
      ATTORNEY,
      ATTORNEY_CREDENTIALS,
    ),
    cta(
      'Already Missed the First 72 Hours?',
      "Don't panic — there is still evidence to preserve. Get a free case review to understand your options.",
    ),
  ]
}

function contingencyBlocks(authorId: number) {
  return [
    directAnswer(
      'What "no fee unless you win" actually means',
      'Personal-injury lawyers almost always work on a contingency fee: you pay no upfront fee, and the lawyer is paid a percentage of the recovery only if they win or settle your case. The typical fee is around one-third (33%), often rising to about 40% if the case goes to trial. Case costs (filing fees, expert witnesses, records) are separate and usually advanced by the firm and reimbursed from the recovery. If there is no recovery, you generally owe no attorney fee.',
      authorId,
    ),
    keyTakeaways([
      'No upfront fee — the lawyer is paid only from a successful recovery.',
      'The standard fee is about one-third (33%), often ~40% if it goes to trial.',
      'Case costs are separate and usually advanced by the firm.',
      'If there is no recovery, you generally owe no attorney fee.',
    ]),
    proseContent([
      {
        heading: 'What "Contingency" Actually Means',
        body: "A contingency fee means the lawyer's payment is contingent on winning. You pay nothing up front and nothing out of pocket; the fee is a percentage of whatever the lawyer recovers for you. If there is no recovery, you generally owe no attorney fee at all.",
      },
      {
        heading: 'The Numbers: Fees vs. Costs',
        body: "The fee is the lawyer's percentage — most commonly 33%, often rising to around 40% if the case goes to trial. Costs are different from the fee: filing fees, expert witnesses, medical records, depositions. Most firms advance these and are reimbursed from the recovery.",
      },
      {
        heading: 'Why This Model Protects Claimants',
        body: "Contingency fees align the lawyer's incentive with yours: they are paid more only if they recover more. It also levels the field against insurers. A legitimate firm will explain the fee clearly, put it in writing, and never ask for money up front.",
      },
    ]),
    faq([
      {
        q: 'How much does a personal injury lawyer cost?',
        a: 'Most charge a contingency fee of about one-third (33%) of the recovery, often rising to roughly 40% if the case goes to trial. You pay no upfront fee, and if there is no recovery you generally owe no attorney fee.',
      },
      {
        q: 'What happens to fees if I lose my case?',
        a: 'Under a standard contingency agreement, if there is no recovery you generally owe no attorney fee. Responsibility for case costs varies by firm and is spelled out in the written agreement.',
      },
      {
        q: 'What is the difference between fees and costs?',
        a: "The fee is the lawyer's percentage of the recovery. Costs are case expenses — filing fees, expert witnesses, medical records, depositions. Most firms advance costs and are reimbursed from the recovery.",
      },
    ]),
    sources('How Contingency Fees Work', BASE_SOURCES),
    expert(
      'A legitimate firm will explain the fee clearly, put it in writing, and never ask for money up front in a standard injury case.',
      ATTORNEY,
      ATTORNEY_CREDENTIALS,
    ),
    cta(
      'Wondering What a Lawyer Would Charge for Your Case?',
      'Get a free, confidential case review — at no cost, no obligation.',
    ),
  ]
}

function liensBlocks(authorId: number) {
  return [
    directAnswer(
      'Why your settlement check is smaller than the headline number',
      'A medical lien or subrogation claim is a right to be repaid from your settlement by whoever covered your accident-related care — health insurers, government programs like Medicare and Medicaid, hospitals, or treatment providers who waited to be paid. These claims can take a large bite out of a settlement, which is why the headline number is rarely what you take home. The crucial point: many liens are negotiable. Skilled reduction of liens — challenging unrelated charges, applying made-whole and common-fund doctrines — can meaningfully increase what you actually keep.',
      authorId,
    ),
    keyTakeaways([
      'Liens and subrogation let payers recover accident-related costs from your settlement.',
      'Health insurers, Medicare, Medicaid, hospitals, and providers can all assert claims.',
      'Many liens are negotiable — reductions directly increase your net recovery.',
      'Made-whole and common-fund doctrines can limit what a lienholder collects.',
    ]),
    proseContent([
      {
        heading: 'Liens vs. Subrogation',
        body: "A medical lien is a provider's or program's legal claim to be paid from your settlement for accident-related treatment. Subrogation is a health insurer's right to recover what it paid for your care out of your recovery from the at-fault party.",
      },
      {
        heading: 'Why This Is a Depth Issue Most People Miss',
        body: 'Liens are where settlements are quietly won or lost. Two identical settlements can produce very different take-home amounts depending entirely on how well the liens were handled. Many liens are negotiable or limited by law.',
      },
      {
        heading: 'Protecting Your Net Recovery',
        body: 'The goal is your net — what you keep after fees, costs, and liens. Maximizing the gross settlement is only half the job; reducing the liens is the other half.',
      },
    ]),
    faq([
      {
        q: 'What is a medical lien on a settlement?',
        a: 'A medical lien is a legal right to be repaid from your settlement for accident-related care. Hospitals, treatment providers, health insurers, and government programs can assert one. It is why your net check is smaller than the gross settlement — and many liens can be negotiated down.',
      },
      {
        q: 'What is subrogation in a personal injury case?',
        a: 'Subrogation is a health insurer\'s right to recover what it paid for your accident-related care out of your settlement. Doctrines like "made-whole" and "common-fund" can limit how much the insurer collects.',
      },
      {
        q: 'Can medical liens be reduced?',
        a: 'Often, yes. Many liens are negotiable, and legal doctrines plus challenges to unrelated or inflated charges can reduce what a lienholder collects. Skilled lien reduction directly increases the amount you actually keep from a settlement.',
      },
    ]),
    sources('Medical Liens & Subrogation', BASE_SOURCES),
    expert(
      'Liens are where settlements are quietly won or lost. Two identical settlements can produce very different take-home amounts depending entirely on how well the liens were handled.',
      ATTORNEY,
      ATTORNEY_CREDENTIALS,
    ),
    cta(
      'Have Liens on Your Settlement?',
      'Get a free case review to understand your options for reducing what goes out.',
    ),
  ]
}

function faqBlocks(authorId: number) {
  return [
    directAnswer(
      'Direct answers to the questions people — and AI assistants — ask most',
      'Plain-English answers to the most common personal-injury questions, written to be quoted directly. Always general information, not legal advice.',
      authorId,
    ),
    keyTakeaways([
      'Statutes of limitation vary by state — typically 1 to 6 years, most commonly 2–3.',
      'Representation usually increases outcomes — contingency means no upfront cost.',
      'First settlement offers are typically 40–60% below what a claim is worth.',
      'Medical documentation is the primary driver of settlement value.',
    ]),
    faq([
      {
        q: 'How long do I have to file a personal injury claim?',
        a: 'The statute of limitations varies by state, typically 1 to 6 years from the date of injury (most commonly 2–3). Missing it permanently bars your claim.',
      },
      {
        q: 'Do I need a lawyer for my injury claim?',
        a: "Not always, but representation tends to increase outcomes, especially where liability is disputed, injuries are serious, or the state's fault rule is harsh. Most injury lawyers work on contingency — no upfront fee — so a free consultation costs nothing.",
      },
      {
        q: 'How much does a personal injury lawyer cost?',
        a: 'Most charge a contingency fee of about one-third (33%) of the recovery, often around 40% if the case goes to trial. You pay no upfront fee, and if there is no recovery you generally owe no attorney fee.',
      },
      {
        q: 'How is a personal injury settlement calculated?',
        a: "Adjusters add up economic damages (medical bills, lost wages) and multiply by roughly 1.5x to 5x for severity. Your state's fault rule is then applied. First offers commonly come in 40–60% below real value.",
      },
      {
        q: 'What does "comparative" or "contributory" negligence mean?',
        a: 'Pure comparative reduces your recovery by your fault percentage. Modified comparative bars you at 50% or 51% fault. Contributory negligence (VA, MD, DC, NC, AL) bars recovery if you are even 1% at fault.',
      },
      {
        q: 'What should I do immediately after an accident?',
        a: 'Call 911 and get a police report, photograph everything, collect witness names and numbers, avoid admitting fault or saying "I\'m fine," seek medical care the same day, and preserve nearby surveillance footage within 72 hours.',
      },
    ]),
    sources('Injury Claim FAQ', BASE_SOURCES),
    expert(
      'The statute of limitations is not a suggestion — it is a wall. Evidence disappears fast. The first 72 hours after an accident are critical.',
      ATTORNEY,
      ATTORNEY_CREDENTIALS,
    ),
    cta(
      'Have a Specific Question About Your Case?',
      'Get a free, confidential case review — no cost, no obligation.',
    ),
  ]
}

// ─── Category blocks builders ───────────────────────────────────────────────────

function accidentCategoryBlocks(dataKey: string): any[] {
  const data = ACCIDENT_DATA[dataKey]
  if (!data) return []

  const blocks: any[] = [
    (() => {
      const { heading, text } = splitDirectAnswer(data.directAnswer)
      return catDirectAnswer(heading, text)
    })(),
    catQuickAnswerStats(data.stats),
    catKeyTakeaways(data.keyFacts),
    // All sections in ONE prose block
    catProseSections(data.sections),
  ]

  // FAQ for accident categories
  const faqMap: Record<string, { q: string; a: string }[]> = {
    'car-accident': [
      {
        q: 'How long do I have to file a car accident claim?',
        a: 'Statutes of limitation vary by state from 2 to 4 years. Missing this deadline typically forfeits your right to compensation.',
      },
      {
        q: "Should I accept the insurance company's first settlement offer?",
        a: 'Never accept a first offer without consulting an attorney. Initial offers are typically far below what your claim is worth and accepting locks you out of additional recovery.',
      },
      {
        q: 'What if the accident was partially my fault?',
        a: 'Many states allow comparative fault, meaning you can still recover even if partially at fault — but your compensation is reduced by your percentage of fault.',
      },
    ],
    'truck-accident': [
      {
        q: 'How long do I have to file a truck accident claim?',
        a: 'Statutes of limitation vary by state from 2 to 4 years. Federal regulations may also apply. Consult an attorney to confirm your deadline.',
      },
      {
        q: 'Who can I sue after a truck accident?',
        a: 'You may be able to sue the truck driver, the trucking company, the cargo loader, and the vehicle manufacturer — depending on what caused the crash.',
      },
      {
        q: 'What evidence is most important in a truck accident case?',
        a: 'Black box data, driver logs, and surveillance footage are among the most critical evidence in truck accident cases. Act quickly to preserve them.',
      },
    ],
    'motorcycle-accident': [
      {
        q: 'Will not wearing a helmet affect my motorcycle accident claim?',
        a: 'Not wearing a helmet does not bar your recovery in most states. Insurance adjusters may raise it to argue comparative fault, but it is generally inadmissible to liability.',
      },
      {
        q: 'How is a motorcycle accident claim different from a car accident claim?',
        a: 'Motorcycle accident claims involve bias against riders, higher injury severity, and different liability rules. An attorney who understands motorcycle claims knows how to counter these challenges.',
      },
      {
        q: 'What if the driver claims I was speeding?',
        a: 'Insurance companies often claim the motorcyclist was speeding without evidence. Objective evidence — surveillance footage, witness testimony, skid marks — counters this narrative.',
      },
    ],
    'pedestrian-accident': [
      {
        q: 'What if I was jaywalking when I was hit?',
        a: 'Even if you were jaywalking, the driver may still be liable if they failed to exercise reasonable care. Many states apply vulnerable user standards that strengthen your claim.',
      },
      {
        q: 'What is a vulnerable road user?',
        a: 'Vulnerable road users include pedestrians, cyclists, and motorcyclists — people who have no protection from a motor vehicle. Many jurisdictions apply heightened duty of care standards to protect them.',
      },
      {
        q: 'What compensation can I recover after a pedestrian accident?',
        a: 'Pedestrian accident compensation includes medical bills, lost wages, pain and suffering, and in some cases punitive damages. Severe injuries often result in six and seven figure settlements.',
      },
    ],
    'bicycle-accident': [
      {
        q: 'What if the driver says I rode out in front of them?',
        a: 'Drivers frequently claim they never saw the cyclist. Objective evidence — surveillance footage, witness testimony, and vehicle damage patterns — usually establishes what actually happened.',
      },
      {
        q: 'Do I need a lawyer for a bicycle accident claim?',
        a: 'Yes, especially if injuries are serious, liability is disputed, or the driver is arguing you were at fault. Bicycle cases involve unique challenges around fault and vulnerable user standards.',
      },
      {
        q: 'What证据 is most important after a bicycle accident?',
        a: 'Preserve the bicycle in its damaged condition, photograph the scene and road markings, request nearby surveillance footage immediately, and get witness contact information.',
      },
    ],
    'rideshare-accident': [
      {
        q: 'Which insurance applies after a rideshare accident?',
        a: "It depends on the driver's status at the time of the crash. If transporting a passenger, the rideshare company's $1M+ policy typically applies. If offline, the driver's personal policy applies.",
      },
      {
        q: 'Can I sue Uber or Lyft directly?',
        a: "Yes, in many cases. Uber and Lyft can be held liable for their drivers' negligence under vicarious liability theories and because of their own negligence in hiring and supervision.",
      },
      {
        q: 'What if the rideshare driver was at fault but Uber denies coverage?',
        a: 'Rideshare companies often dispute coverage to reduce their exposure. An attorney can challenge this and pursue all available avenues for compensation.',
      },
    ],
    'slip-and-fall': [
      {
        q: 'What must I prove in a slip and fall case?',
        a: 'You must prove the property owner knew or should have known about the unsafe condition and failed to fix it or warn you. Photographs, witness statements, and maintenance records are critical.',
      },
      {
        q: 'What if I was distracted when I fell?',
        a: 'Property owners often argue the visitor was distracted or careless. However, property owners must maintain safe conditions regardless of visitor attention.',
      },
      {
        q: 'How much is a slip and fall case worth?',
        a: "Slip and fall settlements range from $10,000 to $100,000+ depending on injury severity, the property owner's fault, and the quality of evidence preserved.",
      },
    ],
    'dog-bite': [
      {
        q: 'Can I recover if the dog bite was partly my fault?',
        a: 'In most states under comparative fault, your recovery is reduced by your percentage of fault. In strict liability states, fault is generally not a defense.',
      },
      {
        q: 'What if the dog owner has no insurance?',
        a: "Dog bite injuries may be covered by the homeowner's insurance policy, even if the dog bite happened off the property. An attorney can identify all available coverage.",
      },
      {
        q: 'What injuries are covered in a dog bite claim?',
        a: 'Dog bite claims cover physical injuries, scarring, infections, psychological trauma, and any other damages caused by the bite.',
      },
    ],
    'workplace-injury': [
      {
        q: 'Can I sue my employer after a workplace injury?',
        a: "Generally no — workers' comp provides the exclusive remedy against your employer. However, you can pursue a third-party claim against a non-employer who contributed to your injury.",
      },
      {
        q: 'How do I know if I have a third-party workplace claim?',
        a: 'If someone other than your employer — an equipment manufacturer, subcontractor, property owner, or another driver — contributed to your injury, you may have a third-party claim.',
      },
      {
        q: "What does workers' comp not cover that a third-party claim does?",
        a: "Workers' comp does not cover pain and suffering, and it replaces only part of your wages. A third-party claim can recover full damages including pain and suffering and full lost wages.",
      },
    ],
    'medical-malpractice': [
      {
        q: 'Is a bad medical outcome the same as malpractice?',
        a: 'No. Medicine carries inherent risk. Malpractice requires that the provider breached the accepted standard of care — that a competent provider would have acted differently — and that the breach caused real harm.',
      },
      {
        q: 'How long do I have to file a malpractice claim?',
        a: 'Malpractice statutes of limitations are short and vary by state — and the clock may run from when you discovered the harm, not from when the procedure occurred.',
      },
      {
        q: 'Do I need an expert for a malpractice case?',
        a: 'In most states, yes. A certificate of merit or expert affidavit from a qualified physician is typically required before filing, attesting that the claim has merit.',
      },
    ],
    'wrongful-death': [
      {
        q: 'Who can file a wrongful death claim?',
        a: "Typically the deceased's spouse, children, or parents. The specific rules vary by state. An attorney can explain who is eligible to file in your state.",
      },
      {
        q: 'How are wrongful death damages calculated?',
        a: "Damages include lost income, funeral expenses, and non-economic damages (pain and suffering). The deceased's age and earning potential are primary factors in settlement value.",
      },
      {
        q: 'Can I pursue a wrongful death claim while also dealing with a criminal case?',
        a: 'Yes. The criminal and civil cases are separate. The criminal case can produce evidence useful to the civil claim, but the civil case should not wait for the criminal case to conclude.',
      },
    ],
  }

  const faqs = faqMap[dataKey]
  if (faqs) {
    blocks.push(catFAQ(faqs))
  }

  blocks.push(catSources(data.title, BASE_SOURCES))

  return blocks
}

function resourceCategoryBlocks(dataKey: string, authorId: number): any[] {
  const blocks: any[] = []

  if (dataKey === 'dealing-with-insurance') {
    blocks.push(
      (() => {
        const full =
          "After an accident, the other driver's insurance adjuster is not a neutral party — their job is to resolve your claim for as little as possible. You are not legally required to give a recorded statement, sign a blanket medical authorization, or accept a first offer, and each of those is a tactic used to reduce your claim. The safest approach: report the facts to your own insurer, decline recorded statements from the other side, never speculate about fault or say \"I'm fine,\" and route substantive communication through a representative. First offers commonly come in 40–60% below a claim's real value."
        const { heading, text } = splitDirectAnswer(full)
        return catDirectAnswer(heading, text)
      })(),
      catQuickAnswerStats([
        { label: 'Recorded Statement', value: 'Not Required' },
        { label: 'First Offers', value: '40–60% Low' },
        { label: 'Blanket Release', value: 'Decline It' },
        { label: 'Best Move', value: 'Document' },
      ]),
      catKeyTakeaways([
        "You are not required to give the other driver's insurer a recorded statement",
        'A blanket medical authorization hands over your entire history — limit it',
        'First settlement offers are typically 40–60% below real value',
        '"I\'m fine" and fault speculation are used to cut your claim',
        'Your own insurer still requires prompt, factual cooperation',
      ]),
      catProseSections([
        {
          title: 'Whose Side the Adjuster Is On',
          content: [
            "An insurance adjuster's role is to protect the insurer's money. Friendly or not, every question is designed to establish shared fault, minimize your injuries, or lock you into an early, low number. Understanding that framing changes how you respond.",
            "There is a difference between your own insurer and the other side's. You generally owe your own insurer prompt, truthful cooperation under your policy. You owe the other driver's insurer almost nothing — and certainly not a recorded statement.",
          ],
        },
        {
          title: 'The Tactics — and the Counter to Each',
          content: [
            'The recorded statement: framed as routine, it exists to capture words they can use against you. You can decline. The blanket medical authorization: it opens your entire medical history to hunt for "pre-existing" conditions — authorize only records tied to this accident, for the relevant dates.',
            'The quick offer: a fast check before you know the extent of your injuries, which you cannot reopen once accepted. The friendly check-in: "How are you feeling?" becomes "the claimant said they were fine." Say only that you are still treating and cannot evaluate the claim yet.',
            'For the exact wording to use in each of these moments, see the copy-paste scripts in the Action Kit on our accident pages.',
          ],
        },
        {
          title: 'How to Protect Your Claim From Day One',
          content: [
            'Report the accident to your own insurer promptly and factually. Get medical care the same day, and keep every record. Photograph everything and preserve evidence before it disappears.',
            'Decline recorded statements from the other insurer and do not speculate about fault or your injuries. Keep communication in writing where you can.',
            'Do not accept a first offer without understanding the full value of your claim — including future treatment. When in doubt, get a free review before you sign anything.',
          ],
        },
      ]),
      catFAQ([
        {
          q: "Do I have to give the other driver's insurance a recorded statement?",
          a: "No. You are not legally required to give the other party's insurer a recorded statement. Adjusters request it because recorded answers can be used to establish shared fault or minimize your injuries. You can decline and route communication through a representative.",
        },
        {
          q: 'Why is the first insurance settlement offer so low?',
          a: "Insurers expect negotiation, so first offers commonly come in 40–60% below a claim's real value — often before your full injuries are known. Accepting ends the claim permanently. It is usually wise to understand the complete value, including future care, before responding.",
        },
        {
          q: 'Should I sign the medical authorization the adjuster sent?',
          a: 'Not a blanket one. A broad authorization gives the insurer your entire medical history to search for "pre-existing" conditions. Limit any release to records directly related to this accident, for the relevant treatment dates.',
        },
      ]),
      catSources('Dealing With Insurance After an Accident', BASE_SOURCES),
    )
  } else if (dataKey === 'how-to-document-an-accident') {
    blocks.push(
      (() => {
        const full =
          'Documenting an accident well, in the first hours and days, is the single biggest thing you can do to protect a claim. The priority order: ensure safety and call 911, then photograph everything (vehicles, positions, the scene, road conditions, signals, and your injuries), collect witness names and numbers, exchange information, and request a police report. Within 72 hours, preserve any nearby surveillance footage before it is overwritten, and keep a daily symptom and treatment log. Evidence fades fast — skid marks within hours, footage within days, witness memory within weeks.'
        const { heading, text } = splitDirectAnswer(full)
        return catDirectAnswer(heading, text)
      })(),
      catQuickAnswerStats([
        { label: 'Footage Window', value: '72 Hours' },
        { label: 'First Step', value: 'Call 911' },
        { label: 'Photos', value: 'From Every Angle' },
        { label: 'Log', value: 'Daily' },
      ]),
      catKeyTakeaways([
        'Call 911 and get a police report — it anchors the entire claim',
        'Photograph vehicles, positions, the scene, signals, and injuries',
        'Collect witness names and numbers while memory is fresh',
        'Preserve nearby surveillance footage within 72 hours',
        'Keep a daily symptom and treatment log from day one',
      ]),
      catProseSections([
        {
          title: 'The First Hour: What to Capture',
          content: [
            'Safety first — move to a safe spot if you can and call 911. Request police even for a minor crash; the official report is the most important single document in your claim.',
            'Photograph everything before anything moves: vehicle damage from multiple angles, the vehicles’ final positions, license plates, the intersection or roadway, traffic signals and signs, skid marks and debris, weather and lighting, and your own visible injuries.',
            'Exchange information with the other driver (license, insurance, plate) and collect names and phone numbers from every witness — their accounts are powerful and they become unreachable quickly.',
          ],
        },
        {
          title: 'The First 72 Hours: Preserve What Fades',
          content: [
            'Surveillance footage from nearby businesses, traffic cameras, and doorbells is typically overwritten within 48–72 hours. Identify cameras that may have caught the crash and request preservation immediately — our Action Kit has a copy-paste letter for exactly this.',
            'Skid marks fade within hours and the scene is cleared quickly, so your early photos may be the only permanent record. Save everything in one place and back it up.',
            'Start a daily log: your symptoms, pain levels, missed work, and every medical visit. This contemporaneous record is far more persuasive than a memory reconstructed months later.',
          ],
        },
        {
          title: 'Turning Documentation Into a Strong Claim',
          content: [
            'Good documentation does two things: it protects the truth from fading, and it removes the insurer’s favorite arguments — that you weren’t really hurt, that you waited too long, or that you share fault.',
            'Consistency matters as much as completeness. A clean chain from the crash to same-day care to a finished treatment plan tells a story no adjuster can easily discount.',
            'Once you’ve documented the basics, a free review can tell you what else your specific situation needs before you talk to any insurer.',
          ],
        },
      ]),
      catFAQ([
        {
          q: 'What should I photograph after a car accident?',
          a: 'Photograph vehicle damage from multiple angles, the final positions of the vehicles, license plates, the roadway and intersection, traffic signals and signs, skid marks and debris, weather and lighting conditions, and any visible injuries. More is better — these photos may be the only permanent record of the scene.',
        },
        {
          q: 'How long do I have to get surveillance footage of my accident?',
          a: 'Usually 48–72 hours. Nearby business cameras, traffic cameras, and doorbell cameras typically overwrite footage within a few days. Identify possible cameras immediately and send a preservation request right away, before the footage is gone.',
        },
        {
          q: 'Should I keep a journal after my accident?',
          a: 'Yes. A daily log of your symptoms, pain levels, missed work, and medical visits creates a contemporaneous record that is far more credible than a later reconstruction. It directly supports both the severity and the timeline of your injuries.',
        },
      ]),
      catSources('How to Document an Accident', BASE_SOURCES),
    )
  } else if (dataKey === 'how-contingency-fees-work') {
    blocks.push(
      (() => {
        const full =
          'Personal-injury lawyers almost always work on a contingency fee: you pay no upfront fee, and the lawyer is paid a percentage of the recovery only if they win or settle your case. The typical fee is around one-third (33%), often rising to about 40% if the case goes to trial. Case costs (filing fees, expert witnesses, records) are separate and are usually advanced by the firm and reimbursed from the recovery. If there is no recovery, you generally owe no attorney fee. This structure exists so that injured people can afford representation regardless of their financial situation.'
        const { heading, text } = splitDirectAnswer(full)
        return catDirectAnswer(heading, text)
      })(),
      catKeyTakeaways([
        'No upfront fee — the lawyer is paid only from a successful recovery',
        'The standard fee is about one-third (33%), often ~40% if it goes to trial',
        'Case costs are separate and usually advanced by the firm',
        'If there is no recovery, you generally owe no attorney fee',
        'Always confirm the percentage and cost terms in the written agreement',
      ]),
      catProseSections([
        {
          title: 'What "Contingency" Actually Means',
          content: [
            "A contingency fee means the lawyer's payment is contingent on winning. You pay nothing up front and nothing out of pocket along the way; the fee is a percentage of whatever the lawyer recovers for you by settlement or verdict.",
            'If the case does not result in a recovery, you generally owe no attorney fee at all. The lawyer absorbs the risk and the time. This is why injured people can hire experienced counsel without having any money to start.',
          ],
        },
        {
          title: 'The Numbers: Fees vs. Costs',
          content: [
            "The fee is the lawyer's percentage — most commonly one-third (33%) of the recovery, frequently rising to around 40% if the case is filed in court or goes to trial, because trial work is far more intensive.",
            'Costs are different from the fee. Filing fees, expert witnesses, medical records, depositions, and investigators are case expenses. Most firms advance these and are reimbursed from the recovery; read the agreement to see whether costs come off the top before or after the fee is calculated.',
            'Because the percentage and cost handling are standardized but not identical between firms, the written fee agreement is where you confirm exactly how it works for your case.',
          ],
        },
        {
          title: 'Why This Model Protects Claimants',
          content: [
            "Contingency fees align the lawyer's incentive with yours: they are paid more only if they recover more, and nothing if they recover nothing, so they have every reason to maximize the result and to decline weak cases.",
            'It also levels the field against insurers, who have unlimited resources. An injured person can match that with experienced representation that costs nothing unless it works.',
            'A legitimate firm will explain the fee clearly, put it in writing, and never ask for money up front in a standard injury case.',
          ],
        },
      ]),
      catFAQ([
        {
          q: 'How much does a personal injury lawyer cost?',
          a: 'Most personal-injury lawyers charge a contingency fee of about one-third (33%) of the recovery, often rising to roughly 40% if the case goes to trial. You pay no upfront fee, and if there is no recovery you generally owe no attorney fee. Case costs are separate and usually advanced by the firm.',
        },
        {
          q: 'What happens to fees if I lose my case?',
          a: 'Under a standard contingency agreement, if there is no recovery you generally owe no attorney fee. Responsibility for case costs (filing fees, experts) varies by firm and is spelled out in the written agreement, so confirm that term before signing.',
        },
        {
          q: 'What is the difference between fees and costs?',
          a: "The fee is the lawyer's percentage of the recovery. Costs are case expenses — filing fees, expert witnesses, medical records, depositions. Most firms advance the costs and are reimbursed from the recovery; the agreement specifies whether they come out before or after the fee.",
        },
      ]),
      catSources('How Contingency Fees Work', BASE_SOURCES),
    )
  } else if (dataKey === 'medical-liens-subrogation') {
    blocks.push(
      (() => {
        const full =
          'A medical lien or subrogation claim is a right to be repaid from your settlement by whoever covered your accident-related care — health insurers, government programs like Medicare and Medicaid, hospitals, or treatment providers who waited to be paid. These claims can take a large bite out of a settlement, which is why the headline number is rarely what you take home. The crucial point: many liens are negotiable. Skilled reduction of liens — challenging unrelated charges, applying made-whole and common-fund doctrines, and negotiating with each holder — can meaningfully increase what you actually keep.'
        const { heading, text } = splitDirectAnswer(full)
        return catDirectAnswer(heading, text)
      })(),
      catKeyTakeaways([
        'Liens and subrogation let payers recover accident-related costs from your settlement',
        'Health insurers, Medicare, Medicaid, hospitals, and providers can all assert claims',
        'These claims explain why your net check is smaller than the gross settlement',
        'Many liens are negotiable — reductions directly increase your net recovery',
        'Made-whole and common-fund doctrines can limit what a lienholder collects',
      ]),
      catProseSections([
        {
          title: 'Liens vs. Subrogation — the Same Idea, Two Forms',
          content: [
            "Both are about reimbursement. A medical lien is a provider's or program's legal claim to be paid from your settlement for accident-related treatment. Subrogation is a health insurer's right to recover what it paid for your care out of your recovery from the at-fault party.",
            'The principle is that you should not be "paid twice" for the same medical bills — once by the insurer and again by the settlement. In practice, these claims are why a $100,000 settlement does not mean $100,000 in your pocket.',
            'Holders can include private health insurers, ERISA employer plans, Medicare and Medicaid, hospitals, and providers who treated you on a "letter of protection" while waiting for the case to resolve.',
          ],
        },
        {
          title: 'Why This Is a Depth Issue Most People Miss',
          content: [
            'Liens are where settlements are quietly won or lost. Two identical settlements can produce very different take-home amounts depending entirely on how well the liens were handled.',
            'Many liens are negotiable or limited by law. The "made-whole" doctrine can stop an insurer from collecting until you are fully compensated; the "common-fund" doctrine can require a lienholder to share the cost of obtaining the recovery. Unrelated or inflated charges can be challenged line by line.',
            'Government liens (Medicare/Medicaid) have strict procedures and cannot be ignored, but they too have defined reduction formulas. Getting these right is technical, high-value work.',
          ],
        },
        {
          title: 'Protecting Your Net Recovery',
          content: [
            'The goal is your net — what you keep after fees, costs, and liens. Maximizing the gross settlement is only half the job; reducing the liens is the other half, and it is often where the most money is recovered for the client.',
            "This is detailed work: identifying every lienholder, auditing charges for relevance, applying the doctrines that limit recovery, and negotiating each reduction. Done well, it can add thousands to a claimant's pocket.",
            'Because the rules differ by lien type and state, this is one of the strongest reasons to have experienced help before a settlement is finalized.',
          ],
        },
      ]),
      catFAQ([
        {
          q: 'What is a medical lien on a settlement?',
          a: 'A medical lien is a legal right to be repaid from your settlement for accident-related care. Hospitals, treatment providers, health insurers, and government programs can assert one. It is why your net check is smaller than the gross settlement — and many liens can be negotiated down.',
        },
        {
          q: 'What is subrogation in a personal injury case?',
          a: 'Subrogation is a health insurer\'s right to recover what it paid for your accident-related care out of your settlement from the at-fault party. The idea is to prevent double recovery for the same bills. Doctrines like "made-whole" and "common-fund" can limit how much the insurer collects.',
        },
        {
          q: 'Can medical liens be reduced?',
          a: 'Often, yes. Many liens are negotiable, and legal doctrines (made-whole, common-fund) plus challenges to unrelated or inflated charges can reduce what a lienholder collects. Skilled lien reduction directly increases the amount you actually keep from a settlement.',
        },
      ]),
      catSources('Medical Liens & Subrogation', BASE_SOURCES),
    )
  } else if (dataKey === 'faq') {
    blocks.push(
      catDirectAnswer(
        'Direct answers to the questions people — and AI assistants — ask most',
        'Plain-English answers to the most common personal-injury questions, written to be quoted directly. Always general information, not legal advice.',
      ),
      catKeyTakeaways([
        'Statutes of limitation vary by state — typically 1 to 6 years, most commonly 2–3.',
        'Representation usually increases outcomes — contingency means no upfront cost.',
        'First settlement offers are typically 40–60% below what a claim is worth.',
        'Medical documentation is the primary driver of settlement value.',
      ]),
      catFAQ([
        // Getting Started
        {
          q: 'How long do I have to file a personal injury claim?',
          a: 'The statute of limitations varies by state, typically 1 to 6 years from the date of injury (most commonly 2–3). Missing it permanently bars your claim. Evidence disappears far sooner, so acting early matters even though the legal deadline is later.',
        },
        {
          q: 'Do I need a lawyer for my injury claim?',
          a: "Not always, but representation tends to increase outcomes, especially where liability is disputed, injuries are serious, or the state's fault rule is harsh. Most injury lawyers work on contingency — no upfront fee — so a free consultation costs nothing to find out.",
        },
        {
          q: 'How much does a personal injury lawyer cost?',
          a: 'Most charge a contingency fee of about one-third (33%) of the recovery, often around 40% if the case goes to trial. You pay no upfront fee, and if there is no recovery you generally owe no attorney fee. Case costs are separate.',
        },
        // What My Claim Is Worth
        {
          q: 'How is a personal injury settlement calculated?',
          a: "Adjusters add up economic damages (medical bills, lost wages) and multiply by roughly 1.5x to 5x for severity to estimate non-economic damages like pain and suffering. Your state's fault rule is then applied. First offers commonly come in 40–60% below real value.",
        },
        {
          q: 'Why is my settlement check smaller than the settlement amount?',
          a: 'Three things come out of a gross settlement: the attorney fee, case costs, and medical liens/subrogation (repayment to insurers, Medicare, or providers). Negotiating the liens down is one of the biggest levers on your net recovery.',
        },
        {
          q: 'What does "comparative" or "contributory" negligence mean?',
          a: 'Pure comparative reduces your recovery by your fault percentage. Modified comparative bars you at 50% or 51% fault. Contributory negligence (VA, MD, DC, NC, AL) bars recovery if you are even 1% at fault.',
        },
        // After a Crash
        {
          q: 'What should I do immediately after an accident?',
          a: 'Call 911 and get a police report, photograph everything before it moves, collect witness names and numbers, avoid admitting fault or saying "I\'m fine," seek medical care the same day, and preserve nearby surveillance footage within 72 hours.',
        },
        {
          q: 'Should I see a doctor even if I feel fine?',
          a: 'Yes. Adrenaline masks injuries, and conditions like whiplash, concussion, and internal bleeding can take hours to days to appear. A same-day medical record also connects your injuries to the crash, which protects a claim.',
        },
        {
          q: 'Why do injury symptoms appear days after a crash?',
          a: 'Adrenaline suppresses pain at the scene; as it fades over 6–72 hours, inflammation builds and injuries become apparent. Delayed symptoms are medically normal — which is why prompt evaluation matters even if you initially felt okay.',
        },
      ]),
      catSources('Injury Claim FAQ', BASE_SOURCES),
    )
  }

  return blocks
}

// ─── Main seed ─────────────────────────────────────────────────────────────────

const run = async () => {
  const payload = await getPayload({ config })

  // ─── Author ─────────────────────────────────────────────────────────────────
  const authorsResult = await payload.find({ collection: 'authors', limit: 1 })
  const author = authorsResult.docs[0]
  if (!author) throw new Error('No author found. Run the main seed first.')
  const authorId = author.id as unknown as number

  // ─── Wipe existing data ─────────────────────────────────────────────────────
  // eslint-disable-next-line no-console
  console.log('Deleting all existing guideCategories and guideArticles...')

  let deleted = 0
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let cursor: any = await payload.find({ collection: 'guideArticles', limit: 100, depth: 0 })
  while (cursor.docs.length > 0) {
    for (const doc of cursor.docs) {
      await payload.delete({ collection: 'guideArticles', id: doc.id })
      deleted++
    }
    cursor = await payload.find({ collection: 'guideArticles', limit: 100, depth: 0 })
  }
  // eslint-disable-next-line no-console
  console.log(`Deleted ${deleted} guideArticles.`)

  deleted = 0
  cursor = await payload.find({ collection: 'guideCategories', limit: 100, depth: 0 })
  while (cursor.docs.length > 0) {
    for (const doc of cursor.docs) {
      await payload.delete({ collection: 'guideCategories', id: doc.id })
      deleted++
    }
    cursor = await payload.find({ collection: 'guideCategories', limit: 100, depth: 0 })
  }
  // eslint-disable-next-line no-console
  console.log(`Deleted ${deleted} guideCategories.`)

  // ─── Spoke definitions (for accident pillars) ───────────────────────────────
  const SPOKE_DEFS = [
    {
      slug: 'what-to-do',
      titlePrefix: 'What To Do After a',
      label: 'What To Do',
      metaTitleSuffix: '| What To Do Guide',
      metaDescSuffix:
        'Step-by-step guide to the first 72 hours after your accident: medical care, evidence, insurance, and legal deadlines.',
      schemaType: 'HowTo',
    },
    {
      slug: 'settlement-amounts',
      titlePrefix: '',
      label: 'Settlement Amounts',
      metaTitleSuffix: ' Settlement Amounts | What Claims Are Worth',
      metaDescSuffix:
        'How settlements are calculated: multiplier method, severity ranges, and what reduces your final payout.',
      schemaType: 'GuidePage',
    },
    {
      slug: 'do-i-need-a-lawyer',
      titlePrefix: 'Do I Need a',
      label: 'Do I Need a Lawyer',
      metaTitleSuffix: '| Do I Need a Lawyer Guide',
      metaDescSuffix:
        'When you need a lawyer and when you might not: injury severity, liability disputes, contingency fees, and free consultations.',
      schemaType: 'FAQPage',
    },
    {
      slug: 'statute-of-limitations',
      titlePrefix: '',
      label: 'Statute of Limitations',
      metaTitleSuffix: ' Statute of Limitations | Filing Deadlines',
      metaDescSuffix:
        'Filing deadlines for claims — typically 1 to 6 years. Missing the deadline permanently bars your claim.',
      schemaType: 'FAQPage',
    },
  ]

  const ACCIDENT_SLUGS = [
    'car-accident',
    'truck-accident',
    'motorcycle-accident',
    'pedestrian-accident',
    'bicycle-accident',
    'rideshare-accident',
    'slip-and-fall',
    'dog-bite',
    'workplace-injury',
    'medical-malpractice',
    'wrongful-death',
  ]

  const RESOURCE_SLUGS = [
    'dealing-with-insurance',
    'how-to-document-an-accident',
    'how-contingency-fees-work',
    'medical-liens-subrogation',
    'faq',
  ]

  // ─── Create categories (blocks added later after articles exist) ──────────
  const categoryMap: Record<string, any> = {}

  for (const cat of CATEGORIES) {
    const created = await payload.create({
      collection: 'guideCategories',
      data: {
        title: cat.title,
        slug: cat.slug,
        dataKey: cat.dataKey,
        heroTitle: cat.heroTitle,
        heroSubtitle: cat.heroSubtitle,
        metaTitle: cat.metaTitle,
        metaDescription: cat.metaDescription,
        schemaType: 'GuidePage',
        blocks: [],
        _isSeeding: true,
      } as any,
    })
    categoryMap[cat.slug] = created
    // eslint-disable-next-line no-console
    console.log(`Created category: ${cat.slug}`)
  }

  // ─── Create articles ───────────────────────────────────────────────────────

  for (const cat of CATEGORIES) {
    // eslint-disable-next-line no-console
    console.log(`\nArticles for: ${cat.title}`)
    const category = categoryMap[cat.slug]

    if (ACCIDENT_SLUGS.includes(cat.dataKey)) {
      // Accident pillars: 4 spoke articles each
      for (const spoke of SPOKE_DEFS) {
        const name = cat.title.replace(/s$/, '')

        const articleTitle = spoke.titlePrefix
          ? `${spoke.titlePrefix} ${name}`
          : `${name} ${spoke.label}`

        const focusKw = spoke.titlePrefix
          ? `${spoke.titlePrefix.toLowerCase()} ${name.toLowerCase()}`
          : `${cat.dataKey.replace('-', ' ')} ${spoke.slug.replace('-', ' ')}`

        let blocks: any[]
        if (spoke.slug === 'what-to-do') blocks = whatToDoBlocks(cat.title, cat.dataKey, authorId)
        else if (spoke.slug === 'settlement-amounts') blocks = settlementBlocks(cat.title, authorId)
        else if (spoke.slug === 'do-i-need-a-lawyer')
          blocks = doINeedLawyerBlocks(cat.title, authorId)
        else blocks = statuteBlocks(cat.title, authorId)

        await payload.create({
          collection: 'guideArticles',
          data: {
            _status: 'published',
            _isSeeding: true,
            title: articleTitle,
            slug: `${cat.dataKey}-${spoke.slug}`,
            author: authorId,
            guideCategory: category.id,
            excerpt: `A complete guide to ${articleTitle.toLowerCase()}: key facts, settlement information, and what you need to know.`,
            subtitle: `What every ${name.toLowerCase()} victim needs to know — explained plainly.`,
            focusKeyword: focusKw,
            secondaryKeywords: [
              { keyword: `${cat.dataKey.replace('-', ' ')} lawyer` },
              { keyword: `${cat.dataKey.replace('-', ' ')} settlement` },
            ],
            metaTitle: `${articleTitle} ${spoke.metaTitleSuffix}`,
            metaDescription: `${articleTitle} guide: ${spoke.metaDescSuffix}`,
            schemaType: spoke.schemaType,
            voiceAnswer: `For ${cat.title.toLowerCase()} claims: consult a personal injury attorney for a free case review.`,
            sgeOptimizedAnswer: `This guide covers ${articleTitle.toLowerCase()}: key facts, legal deadlines, and settlement information for ${cat.dataKey.replace('-', ' ')} victims.`,
            difficultyLevel: 'beginner',
            freshnessSignal: 'evergreen',
            legalDisclaimer: 'Standard',
            expertReviewer: ATTORNEY,
            expertCredentials: ATTORNEY_BARRED,
            blocks,
          } as any,
        })
        // eslint-disable-next-line no-console
        console.log(`  Created: ${cat.dataKey}-${spoke.slug}`)
      }
    } else {
      // Resource/guide pillars: 1 article each
      let blocks: any[]
      if (cat.dataKey === 'dealing-with-insurance') blocks = insuranceBlocks(authorId)
      else if (cat.dataKey === 'how-to-document-an-accident') blocks = documentBlocks(authorId)
      else if (cat.dataKey === 'how-contingency-fees-work') blocks = contingencyBlocks(authorId)
      else if (cat.dataKey === 'medical-liens-subrogation') blocks = liensBlocks(authorId)
      else if (cat.dataKey === 'faq') blocks = faqBlocks(authorId)
      else blocks = []

      await payload.create({
        collection: 'guideArticles',
        data: {
          _status: 'published',
          _isSeeding: true,
          title: cat.title,
          slug: cat.dataKey,
          author: authorId,
          guideCategory: category.id,
          excerpt: cat.heroSubtitle,
          subtitle: cat.heroSubtitle,
          focusKeyword: cat.title.toLowerCase(),
          secondaryKeywords: [
            { keyword: `${cat.title.toLowerCase()} guide` },
            { keyword: `${cat.title.toLowerCase()} information` },
          ],
          metaTitle: cat.metaTitle,
          metaDescription: cat.metaDescription,
          schemaType: 'GuidePage',
          voiceAnswer: `${cat.title}: ${cat.heroSubtitle}`,
          sgeOptimizedAnswer: `This guide covers ${cat.title.toLowerCase()}: ${cat.heroSubtitle}`,
          difficultyLevel: 'beginner',
          freshnessSignal: 'evergreen',
          legalDisclaimer: 'Standard',
          expertReviewer: ATTORNEY,
          expertCredentials: ATTORNEY_BARRED,
          blocks,
        } as any,
      })
      // eslint-disable-next-line no-console
      console.log(`  Created: ${cat.dataKey}`)
    }
  }

  // ─── Add category blocks (including related guides) ─────────────────────────
  // eslint-disable-next-line no-console
  console.log('\nAdding blocks to categories...')

  for (const cat of CATEGORIES) {
    const category = categoryMap[cat.slug]

    if (ACCIDENT_SLUGS.includes(cat.dataKey)) {
      // Build full blocks for accident categories
      const blocks = accidentCategoryBlocks(cat.dataKey)

      // Fetch the 4 spoke articles for this category to add as related guides
      const { docs: articles } = await payload.find({
        collection: 'guideArticles',
        where: { guideCategory: { equals: category.id } },
        limit: 4,
      })

      // Append categoryRelatedGuides block with the article IDs
      blocks.push({
        blockType: 'categoryRelatedGuides',
        articles: articles.map((a) => a.id),
      })

      await payload.update({
        collection: 'guideCategories',
        id: category.id,
        data: { blocks },
      })
      // eslint-disable-next-line no-console
      console.log(
        `Updated blocks for accident category: ${cat.slug} (${blocks.length} blocks, ${articles.length} related articles)`,
      )
    } else if (RESOURCE_SLUGS.includes(cat.dataKey)) {
      const blocks = resourceCategoryBlocks(cat.dataKey, authorId)
      await payload.update({
        collection: 'guideCategories',
        id: category.id,
        data: { blocks },
      })
      // eslint-disable-next-line no-console
      console.log(`Updated blocks for guide category: ${cat.slug} (${blocks.length} blocks)`)
    }
  }

  // eslint-disable-next-line no-console
  console.log('\n✅ Full guide seed complete!')
  // eslint-disable-next-line no-console
  console.log('17 categories created (each with pillar blocks)')
  // eslint-disable-next-line no-console
  console.log('11 accident pillars × 4 spokes = 44 articles')
  // eslint-disable-next-line no-console
  console.log('6 resource/guide articles = 6 articles')
  // eslint-disable-next-line no-console
  console.log('Total: 50 articles')
  process.exit(0)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
