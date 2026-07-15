/**
 * seed-guide-articles-from-reference.ts
 *
 * Full seeder — maps reference data from caseport-nextjs/src/data/_src/
 * guides.ts (CP.guides) AND accident-types.ts (CP.accidentTypes) into
 * Payload `guideArticles` (GuideNew collection) blocks.
 *
 * Each pillar article gets these blocks:
 *   [0] articleDirectAnswer  — heading + lead text + author
 *   [1] articleKeyTakeaways  — bullet facts
 *   [2] articleFAQ          — Q&A accordion
 *   [3] articleProseContent — multi-section prose
 *   [4] articleSources      — citeTitle + sources[]
 *   [5] articleRelatedGuides — relationship[] to other guideArticles
 *   [6] articleExpert       — expert quote + reviewer + credentials
 *
 * Run: npx tsx src/seed/seed-guide-articles-from-reference.ts
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'

// ─── Reference Data (from CP.accidentTypes + CP.guides) ────────────────────────

// Accident pillar articles — keyed by slug
const ACCIDENT_ARTICLES: Record<
  string,
  {
    title: string
    subtitle: string
    directAnswer: string
    stats: { label: string; value: string }[]
    keyFacts: string[]
    sections: { title: string; content: string[] }[]
    faqs: { q: string; a: string }[]
  }
> = {
  'car-accident': {
    title: 'Car Accident Claims: Your Complete Guide to Maximum Recovery',
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
          'Car accident settlements use the multiplier method. Insurance adjusters calculate your economic damages (medical bills, lost wages, property damage) and multiply by a factor of 1.5x to 5x depending on injury severity. A $30,000 medical bill with a 2.5x multiplier results in a $75,000 settlement offer.',
          'The multiplier depends on injury severity. Minor injuries (soft tissue, full recovery in weeks) receive 1.5x to 2x. Moderate injuries (fractures, ongoing treatment) receive 2x to 3.5x. Severe injuries (permanent disability, chronic pain) receive 3.5x to 5x or higher.',
          "However, your state's negligence rule is applied first. In contributory negligence states, any fault eliminates your entire recovery. In comparative negligence states, your recovery is reduced by your percentage of fault. This is why understanding your state's negligence rule is critical.",
        ],
      },
      {
        title: 'Why First Settlement Offers Are Always Low',
        content: [
          'Insurance companies expect negotiation. First settlement offers are intentionally low, typically 40–60% below final value. Accepting the first offer means leaving significant money on the table.',
          'Insurance adjusters use psychological tactics to pressure you into accepting low offers: "This is our best offer," "Other claimants accepted less," "You\'ll have to wait 2 years for trial." These are negotiation tactics, not facts.',
          'Do not accept the first offer. Negotiate. If negotiations stall, consider litigation. Juries often award higher verdicts than insurance adjusters offer, especially in clear-liability cases.',
        ],
      },
      {
        title: 'Evidence Preservation in Car Accidents',
        content: [
          'Surveillance footage is overwritten within 72 hours. After 72 hours, the footage is gone forever. If an accident occurred on Monday, the surveillance footage from nearby businesses, traffic cameras, and ATMs will be overwritten by Thursday. Contact these businesses immediately and request that they preserve the footage.',
          'Witness information is time-sensitive. Witness memory is most reliable immediately after an incident. Within days, witnesses forget details. Within weeks, they forget the incident entirely. Get names, phone numbers, email addresses, and written statements from all witnesses while memory is fresh.',
          'Physical evidence disappears quickly. Skid marks fade within hours. Debris is cleared by road maintenance crews. Vehicle damage patterns change as vehicles are moved or repaired. Take photographs from multiple angles immediately after the accident.',
        ],
      },
      {
        title: 'Medical Documentation and Claim Value',
        content: [
          'Your medical records document your injuries and recovery trajectory. Gaps in treatment allow insurance adjusters to argue that your injuries were minor or resolved quickly. Seek medical attention immediately after the accident, even if you feel fine.',
          "Some injuries (concussions, internal injuries, soft tissue damage) do not appear immediately. Comprehensive medical documentation is the foundation of your claim. Follow your doctor's treatment recommendations exactly. Do not skip appointments or treatments.",
          'Insurance adjusters scrutinize medical bills and treatment decisions. They argue that certain treatments were unnecessary, that you recovered too quickly, or that your injuries were minor. Detailed medical records protect your claim from these arguments.',
        ],
      },
    ],
    faqs: [
      {
        q: 'How is a car accident settlement calculated?',
        a: 'Settlements use the multiplier method: economic damages (medical bills, lost wages) are multiplied by 1.5x to 5x depending on injury severity. Minor injuries receive 1.5x to 2x, moderate injuries 2x to 3.5x, and severe injuries 3.5x to 5x or higher. Your state negligence rule is applied before the multiplier.',
      },
      {
        q: 'Why is the first settlement offer always low?',
        a: 'Insurance companies expect negotiation. First offers are intentionally set 40–60% below final value to test whether you know the true value of your claim. Accepting early means leaving significant money on the table. Always understand the full value before responding.',
      },
      {
        q: 'How long do I have to file a car accident claim?',
        a: 'Statutes of limitation for car accidents vary by state, typically 1 to 6 years from the date of injury. Most states fall in the 2–3 year range. Missing the deadline permanently bars your claim. Evidence like surveillance footage disappears far sooner — act immediately.',
      },
      {
        q: 'What evidence preserves my car accident claim?',
        a: 'Prioritize in the first 72 hours: photograph vehicles, the scene, and injuries; collect witness contact information; request a police report; identify and preserve nearby surveillance footage before it is overwritten. contemporaneously documenting your injuries and treatment is equally critical.',
      },
      {
        q: 'Does my own insurance company need a recorded statement?',
        a: "You owe your own insurer prompt, factual cooperation under your policy. However, you are not required to give the other driver's insurer a recorded statement — decline and route all substantive communication through a representative.",
      },
    ],
  },
  'truck-accident': {
    title: 'Truck Accident Claims: Why These Cases Are Worth More',
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
          'Truck accidents result in more severe injuries because trucks weigh 20–30 times more than cars. The physics of collision are simple: heavier vehicles cause more damage. A truck traveling at 55 mph has the same kinetic energy as a car traveling at 200+ mph.',
          'Truck accident injuries are typically catastrophic: multiple fractures, internal injuries, spinal cord damage, traumatic brain injury, amputation, and death. These severe injuries justify higher settlements.',
          'Truck companies carry higher insurance limits ($1M+) and are more likely to settle because they face significant liability exposure. They also employ risk management teams that understand the cost of litigation and jury trials.',
        ],
      },
      {
        title: 'Federal Trucking Regulations Create Additional Liability',
        content: [
          'Federal trucking regulations (Hours of Service, vehicle maintenance, driver qualifications, inspection requirements) create additional liability exposure. Violations of these regulations are evidence of negligence.',
          'Hours of Service violations are particularly damaging. Truck drivers are limited to 11 hours of driving per 14-hour work day. Violations indicate driver fatigue, which is a major cause of truck accidents. Logbook data proving HOS violations is powerful evidence.',
          'Vehicle maintenance violations are also damaging. Trucks must be inspected regularly and maintained to federal standards. Brake failures, tire blowouts, and other mechanical failures caused by negligent maintenance are evidence of liability.',
        ],
      },
      {
        title: 'Black Box Data and Objective Evidence',
        content: [
          'Modern trucks are equipped with electronic data recorders (black boxes) that record speed, braking, acceleration, and other vehicle data. This data is objective evidence of driver behavior and vehicle condition.',
          'Black box data can prove that the truck driver was speeding, failed to brake, or was distracted. This data is admissible in court and is extremely persuasive to juries.',
          'Trucking companies often try to destroy or hide black box data. Early legal action is critical to preserve this evidence. An attorney can issue a preservation letter to the trucking company requiring that all black box data be preserved.',
        ],
      },
      {
        title: 'Multiple Insurance Policies Increase Available Recovery',
        content: [
          'Trucking companies often carry multiple insurance policies: primary liability, excess liability, umbrella coverage, and cargo insurance. Each policy has separate limits, increasing the total available recovery.',
          'A truck accident might have $1M in primary liability, $2M in excess liability, and $5M in umbrella coverage, for a total of $8M in available insurance. Your claim value is limited only by the severity of your injuries and the available insurance.',
          'Insurance companies often fight over which policy applies, but this is their problem, not yours. Your attorney coordinates with all insurers to maximize your recovery.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Why are truck accident settlements higher than car accidents?',
        a: 'Trucks weigh 20–30 times more than cars, causing catastrophic injuries that justify higher settlements. Truck companies also carry higher insurance limits ($1M+), and federal regulations create additional liability. Black box data and multiple insurance policies further increase available recovery.',
      },
      {
        q: 'What is Hours of Service (HOS) and why does it matter?',
        a: 'HOS limits truck drivers to 11 hours of driving per 14-hour work day. Violations are evidence of driver fatigue — a major cause of truck accidents. Logbook data proving HOS violations is powerful objective evidence of negligence.',
      },
      {
        q: 'How do I preserve black box data after a truck accident?',
        a: 'Act immediately. Send a preservation letter to the trucking company demanding all electronic data records be preserved. This data is often overwritten within days. An attorney can issue this letter the same day you hire them.',
      },
      {
        q: 'Can I sue the trucking company directly?',
        a: "Yes. Trucking companies are vicariously liable for their drivers' negligence. They may also have direct liability for negligent hiring, inadequate training, or failing to maintain safe vehicles.",
      },
    ],
  },
  'motorcycle-accident': {
    title: 'Motorcycle Accident Claims: Overcoming Bias and Maximizing Recovery',
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
          "Insurance companies and juries often apply bias against motorcycle riders, assuming they were reckless or at fault. This bias is unfair and illegal, but it exists. Overcoming this bias requires clear evidence of the other party's liability.",
          'Insurance adjusters use this bias to argue that you were speeding, weaving through traffic, or riding recklessly. They use this narrative to reduce your settlement offer or deny your claim entirely.',
          'Juries also apply this bias. Some jurors believe that motorcycle riders accept the risk of injury by choosing to ride. This bias can reduce jury verdicts significantly.',
        ],
      },
      {
        title: 'Why Motorcycle Accidents Result in Severe Injuries',
        content: [
          "Motorcycle riders have no protection from impact. Cars have airbags, crumple zones, and steel frames. Motorcycles have only the rider's body. When a motorcycle collides with a car, the rider absorbs all the impact energy.",
          'Motorcycle accident injuries are typically catastrophic: multiple fractures, road rash (severe abrasions), spinal cord damage, traumatic brain injury, amputation, and death. These severe injuries justify higher settlements.',
          'Helmet use reduces head injury risk but does not prevent other injuries. Road rash, fractures, and spinal cord injuries are common even with helmet use.',
        ],
      },
      {
        title: 'Proving Liability in Motorcycle Accidents',
        content: [
          "Proving liability in motorcycle accidents requires clear evidence of the other party's negligence. Witness testimony, surveillance footage, police reports, and accident reconstruction are critical.",
          'Insurance companies often argue that the motorcycle rider was speeding or weaving through traffic. Objective evidence (surveillance footage, witness testimony, police investigation) is critical to counter these arguments.',
          'Accident reconstruction experts can analyze the accident scene, vehicle damage, and road conditions to determine what happened. This objective analysis overcomes bias and proves liability.',
        ],
      },
      {
        title: 'Medical Documentation and Overcoming Bias',
        content: [
          'Comprehensive medical documentation is critical to overcome bias and prove the severity of your injuries. Detailed medical records show the extent of your injuries and the long-term impact on your life.',
          'Insurance companies often argue that motorcycle riders exaggerate their injuries or recover quickly. Detailed medical records counter these arguments and prove the severity of your injuries.',
          "Follow your doctor's treatment recommendations exactly. Do not skip appointments or treatments. Gaps in treatment allow insurance adjusters to argue that your injuries were minor.",
        ],
      },
    ],
    faqs: [
      {
        q: 'How do I overcome bias against motorcycle riders in a claim?',
        a: "Overcoming bias requires objective evidence of the other party's liability: surveillance footage, witness testimony, police reports, and accident reconstruction. Detailed medical documentation proving injury severity is equally critical to counter insurer narratives that riders exaggerate claims.",
      },
      {
        q: 'Do I need a helmet to have a valid motorcycle accident claim?',
        a: 'Not wearing a helmet does not bar your recovery in most states. Insurance adjusters will raise it to argue comparative fault, but helmet non-use is generally inadmissible to liability for the collision itself. Wear a helmet for safety — but its absence should never stop you from pursuing a valid claim.',
      },
      {
        q: 'What are the most common causes of motorcycle accidents?',
        a: 'The most common causes are drivers failing to yield at intersections, making left turns across oncoming motorcycles, opening car doors into bike lanes, and rear-ending motorcycles. Drivers frequently claim they "never saw" the motorcyclist — which is an admission of inattention, not a defense.',
      },
      {
        q: 'What injuries are most common in motorcycle accidents?',
        a: 'Catastrophic injuries are common: traumatic brain injury, spinal cord damage, multiple fractures, road rash (severe abrasions), and amputation. The lack of protective barriers means the rider absorbs all impact energy.',
      },
    ],
  },
  'pedestrian-accident': {
    title: 'Pedestrian Accident Claims: Vulnerable Road User Protection',
    subtitle:
      'Pedestrian accident claims often involve clear liability and vulnerable user protections.',
    directAnswer:
      'Pedestrian accidents result in severe injuries and death because pedestrians have no protection from vehicle impact. Average pedestrian accident settlements range from $50,000 to $400,000+ depending on injury severity and liability. Many jurisdictions apply different negligence standards to vulnerable road users (pedestrians, cyclists), providing additional protection. Pedestrian accidents are often clear liability cases because drivers have a duty to avoid hitting pedestrians.',
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
          'Many jurisdictions apply vulnerable user standards to pedestrians, cyclists, and motorcyclists. These standards recognize that vulnerable road users deserve additional protection because they have no vehicle protection.',
          'Under vulnerable user standards, drivers must exercise extra care to avoid hitting vulnerable road users. Even if the pedestrian is partially at fault, the driver may still be liable if they failed to exercise reasonable care.',
          'Vulnerable user standards shift the burden of care to drivers. Drivers must anticipate pedestrian behavior and take steps to avoid collision, even if the pedestrian is jaywalking or distracted.',
        ],
      },
      {
        title: 'Why Pedestrian Accidents Result in Severe Injuries',
        content: [
          'Pedestrians have no protection from vehicle impact. When a vehicle hits a pedestrian, the pedestrian absorbs all the impact energy. Pedestrian accident injuries are typically catastrophic: multiple fractures, internal injuries, spinal cord damage, traumatic brain injury, and death.',
          'Pedestrian accident injuries depend on vehicle speed. A pedestrian struck at 20 mph has a 90% survival rate. A pedestrian struck at 40 mph has only a 10% survival rate. Speed is the primary factor in pedestrian accident severity.',
          'Pedestrian accident injuries also depend on which part of the body is hit. Head injuries are most severe and often fatal. Leg injuries are common but less severe. Torso injuries often involve internal damage and are frequently fatal.',
        ],
      },
      {
        title: 'Proving Liability in Pedestrian Accidents',
        content: [
          'Pedestrian accident liability is often clear because drivers have a duty to avoid hitting pedestrians. Even if the pedestrian is jaywalking or distracted, the driver should see the pedestrian and take steps to avoid collision.',
          'Surveillance footage from nearby businesses, traffic cameras, and ATMs is often available in pedestrian accidents. This footage is objective evidence of what happened and who was at fault.',
          "Witness testimony is also valuable. Pedestrians often have witnesses who saw the accident. These witnesses can testify about the driver's speed, attention, and actions immediately before the accident.",
        ],
      },
      {
        title: 'Medical Documentation and Long-Term Impact',
        content: [
          'Pedestrian accident injuries often result in permanent disability, chronic pain, and reduced quality of life. Comprehensive medical documentation is critical to prove the long-term impact of your injuries.',
          'Pedestrian accidents often result in multiple surgeries, extended hospitalization, and long-term rehabilitation. These medical records prove the severity of your injuries and justify higher settlements.',
          "Follow your doctor's treatment recommendations exactly. Pedestrian accident injuries often require ongoing treatment and rehabilitation. Consistent medical documentation proves the long-term impact of your injuries.",
        ],
      },
    ],
    faqs: [
      {
        q: 'What are vulnerable user standards in pedestrian accidents?',
        a: 'Vulnerable user standards hold drivers to a heightened duty of care around pedestrians, cyclists, and motorcyclists. These standards recognize the disparity between vehicles and unprotected road users. Even if a pedestrian is partially at fault, the driver may still be liable if they failed to exercise reasonable care.',
      },
      {
        q: 'How is liability determined in pedestrian accidents?',
        a: 'Drivers have a duty to avoid hitting pedestrians. Liability is often clear because drivers should see and avoid pedestrians. Surveillance footage, witness testimony, and police reports are the key evidence. Even in crosswalk cases, drivers must yield.',
      },
      {
        q: 'What surveillance footage is available after a pedestrian accident?',
        a: 'Footage may be available from nearby businesses, traffic cameras, ATMs, doorbell cameras, and city buses. This footage is typically overwritten within 72 hours — request preservation immediately. Our Action Kit has a copy-paste letter for this.',
      },
    ],
  },
  'bicycle-accident': {
    title: 'Bicycle Accident Claims: Protecting Vulnerable Riders',
    subtitle: 'Bicycle accident claims hinge on driver negligence and vulnerable-user protections.',
    directAnswer:
      'Bicycle accidents cause severe injuries because riders have no protection from a multi-ton vehicle. Average bicycle accident settlements range from $30,000 to $250,000+ depending on injury severity and liability. Most collisions are caused by drivers failing to yield, opening doors into bike lanes, or making right hooks. Many jurisdictions apply vulnerable-road-user standards that hold drivers to a heightened duty of care around cyclists, and a helmet does not bar recovery.',
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
          'Most bicycle accidents are caused by driver negligence, not cyclist error. The most common causes are drivers failing to yield at intersections, opening a car door into a bike lane ("dooring"), and making a right turn across a cyclist\'s path (the "right hook").',
          "Drivers frequently claim they 'never saw' the cyclist. This is not a defense — it is an admission of inattention. Drivers have a duty to look for and yield to cyclists, who are legal users of the road.",
          "Objective evidence — traffic-camera footage, witness testimony, and the physical damage pattern — usually establishes the driver's fault clearly when properly preserved.",
        ],
      },
      {
        title: 'Vulnerable Road User Protections',
        content: [
          'Many states and cities apply vulnerable-road-user standards that hold drivers to a heightened duty of care around cyclists, pedestrians, and other unprotected users. Some jurisdictions impose enhanced penalties when a driver injures a vulnerable user.',
          "These standards recognize the vast disparity between a cyclist and a motor vehicle. Even where a cyclist made a minor error, the driver's failure to exercise reasonable care can establish liability.",
          'In contributory-negligence jurisdictions, however, cyclist fault can still bar recovery — which makes careful documentation and legal guidance especially important.',
        ],
      },
      {
        title: 'The Helmet Question',
        content: [
          'Not wearing a helmet does not bar your recovery in most states. Insurance adjusters will raise it to argue comparative fault, but helmet non-use is generally inadmissible or irrelevant to liability for the collision itself.',
          'For head injuries, an insurer may argue a helmet would have reduced the harm. The strength of that argument varies by state, and medical evidence about the specific injury mechanism usually rebuts it.',
          'Wearing a helmet is always safer — but its absence should never stop an injured cyclist from pursuing a valid claim.',
        ],
      },
      {
        title: 'Documenting a Bicycle Accident Claim',
        content: [
          "Bicycle accident injuries are often catastrophic — traumatic brain injury, spinal damage, and multiple fractures — which makes thorough medical documentation essential to capturing the claim's full value.",
          'Preserve the bicycle in its damaged condition, photograph the scene and bike-lane markings, and request nearby surveillance footage immediately, before it is overwritten within 72 hours.',
          "Witness statements are especially valuable in bicycle cases because they counter the common driver narrative that the cyclist 'came out of nowhere.'",
        ],
      },
    ],
    faqs: [
      {
        q: 'What is "dooring" in bicycle accidents?',
        a: 'Dooring occurs when a driver or passenger opens a car door into a bike lane or path without looking, striking an oncoming cyclist. It is a common cause of bicycle accidents and the driver or passenger who opened the door is typically at fault.',
      },
      {
        q: 'What is a "right hook" bicycle accident?',
        a: "A right hook happens when a driver makes a right turn across a cyclist's path, cutting off or colliding with the cyclist who is traveling straight through an intersection or past the vehicle on the right side.",
      },
      {
        q: 'Does not wearing a helmet hurt my bicycle accident claim?',
        a: 'No. Not wearing a helmet does not bar your recovery in most states. Insurers may argue comparative fault for head injuries, but helmet non-use is generally inadmissible to the question of liability for the collision itself.',
      },
    ],
  },
  'rideshare-accident': {
    title: 'Rideshare Accident Claims: Navigating Complex Liability',
    subtitle:
      'Rideshare accident claims involve complex liability and insurance coverage disputes.',
    directAnswer:
      'Rideshare accidents involve complex liability because multiple parties may be responsible: the rideshare driver, the rideshare company, other drivers, and vehicle manufacturers. Average rideshare accident settlements range from $30,000 to $200,000+ depending on injury severity and liability. Rideshare companies carry insurance that covers accidents during rides, but they often dispute coverage and liability. Early legal action is critical to preserve evidence and protect your rights against the rideshare company.',
    stats: [
      { label: 'Avg Settlement', value: '$85K' },
      { label: 'Liable Parties', value: 'Multiple' },
      { label: 'Insurance Limits', value: '$1M+' },
      { label: 'Coverage Disputes', value: 'Common' },
    ],
    keyFacts: [
      'Rideshare accidents involve complex liability because multiple parties may be responsible',
      'Rideshare companies carry insurance that covers accidents during rides',
      'Rideshare companies often dispute coverage and liability to reduce their exposure',
      'The rideshare driver may be personally liable in addition to the rideshare company',
      'Early legal action is critical to preserve evidence and protect your rights',
    ],
    sections: [
      {
        title: 'Understanding Rideshare Liability',
        content: [
          'Rideshare accidents involve complex liability because multiple parties may be responsible: the rideshare driver, the rideshare company, other drivers, and vehicle manufacturers.',
          'The rideshare driver is responsible for operating the vehicle safely. If the driver was negligent (speeding, distracted driving, reckless driving), the driver is liable for your injuries.',
          "The rideshare company is also liable for the driver's negligence under the doctrine of vicarious liability. The rideshare company is responsible for hiring safe drivers and maintaining safe vehicles.",
        ],
      },
      {
        title: 'Rideshare Insurance Coverage',
        content: [
          'Rideshare companies carry insurance that covers accidents during rides. The insurance limits are typically $1M+ for bodily injury liability. However, rideshare companies often dispute coverage and liability to reduce their exposure.',
          "The rideshare insurance coverage depends on the driver's status at the time of the accident. If the driver was actively transporting a passenger, the rideshare company's insurance applies. If the driver was offline or waiting for a ride request, the driver's personal insurance applies.",
          'Rideshare companies often argue that the driver was offline or waiting for a ride request to avoid coverage. Early legal action is critical to preserve evidence (GPS data, app records) that proves the driver was actively transporting a passenger.',
        ],
      },
      {
        title: 'Investigating Rideshare Accidents',
        content: [
          "Rideshare accidents require investigation into the driver's background, training, and history. Rideshare companies are required to conduct background checks and maintain driver records.",
          "Driver records may show prior accidents, traffic violations, or complaints about the driver's safety. This evidence shows that the rideshare company knew or should have known that the driver was unsafe.",
          "GPS data, app records, and telematics data from the vehicle can prove the driver's location, speed, and actions immediately before the accident. This objective evidence is critical to proving liability.",
        ],
      },
      {
        title: 'Negotiating with Rideshare Companies',
        content: [
          'Rideshare companies employ sophisticated legal teams that aggressively defend claims and dispute liability. Negotiating with rideshare companies requires an experienced attorney who understands rideshare liability and insurance.',
          'Rideshare companies often make low settlement offers to test your knowledge and pressure you into accepting less than your claim is worth. Do not accept the first offer. Negotiate.',
          'If negotiations stall, litigation may be necessary. Rideshare companies often settle cases to avoid trial because juries are sympathetic to injured passengers and skeptical of rideshare company defenses.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Which insurance applies after a rideshare accident?',
        a: "Coverage depends on the driver's status at the time of the accident. If the driver was actively transporting a passenger, the rideshare company's $1M+ policy applies. If the driver was waiting for a ride request, only the driver's personal insurance applies — which may be inadequate. GPS and app records prove the driver's status.",
      },
      {
        q: 'Can I sue the rideshare company directly?',
        a: "Yes. Rideshare companies are vicariously liable for their drivers' negligence under the doctrine of vicarious liability. They may also have direct liability for negligent hiring or failing to maintain safe vehicles.",
      },
      {
        q: 'What evidence is critical after a rideshare accident?',
        a: 'Preserve GPS data and app records immediately — these prove whether the driver was transporting a passenger. Also collect witness information, photograph the scene and vehicles, and request a police report. Rideshare companies may attempt to destroy or alter records.',
      },
    ],
  },
  'slip-and-fall': {
    title: 'Slip and Fall Claims: Proving Premises Liability',
    subtitle: "Slip and fall claims require proving the property owner's negligence.",
    directAnswer:
      "Slip and fall claims are premises liability cases where a property owner or manager is responsible for injuries caused by unsafe conditions on their property. Average slip and fall settlements range from $10,000 to $100,000+ depending on injury severity and the property owner's negligence. Proving premises liability requires showing that the property owner knew or should have known about the unsafe condition and failed to fix it or warn visitors. Property owners often dispute liability, making early evidence preservation critical.",
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
          'Property owners are liable for injuries caused by unsafe conditions only if they knew or should have known about the condition. This is called constructive notice. If a hazard existed for a long time, the property owner should have known about it.',
        ],
      },
      {
        title: 'Proving the Property Owner Knew or Should Have Known',
        content: [
          'Proving that the property owner knew or should have known about the unsafe condition is critical to premises liability claims. This requires evidence that the condition existed for a long time or that the property owner should have discovered it through regular inspection.',
          'Maintenance records are critical evidence. If the property owner failed to inspect or maintain the property, this shows constructive notice. Witness testimony about how long the hazard existed is also valuable.',
          'Photographs of the unsafe condition are critical. Take photographs immediately after the accident showing the exact condition that caused your injury. These photographs are objective evidence of the hazard.',
        ],
      },
      {
        title: 'Common Slip and Fall Hazards',
        content: [
          'Common slip and fall hazards include wet floors, ice, debris, uneven surfaces, poor lighting, and broken stairs. Each hazard requires different evidence to prove premises liability.',
          'Wet floor hazards require evidence that the property owner failed to dry the floor or warn visitors. Ice hazards require evidence that the property owner failed to salt or sand the surface. Debris hazards require evidence that the property owner failed to clean the property.',
          'Uneven surface and broken stair hazards require evidence that the property owner knew about the condition and failed to fix it. Poor lighting hazards require evidence that the property owner failed to maintain adequate lighting.',
        ],
      },
      {
        title: 'Property Owner Defenses and How to Counter Them',
        content: [
          'Property owners often argue that the visitor was careless and should have seen the hazard. This is called assumption of risk or comparative negligence. However, property owners cannot escape liability by arguing that visitors should have been more careful.',
          'Property owners also argue that the hazard was open and obvious and therefore they had no duty to warn. However, even obvious hazards require warning if they pose a serious risk of injury.',
          'Property owners may also argue that they did not have constructive notice of the hazard because they inspected the property regularly. However, if the hazard existed for a long time, regular inspection should have discovered it.',
        ],
      },
    ],
    faqs: [
      {
        q: 'How do I prove a slip and fall claim?',
        a: "Prove that the property owner knew or should have known about the unsafe condition and failed to fix it or warn you. Critical evidence includes photographs of the hazard, witness statements, maintenance records, and incident reports. The hazard's length of existence is key — the longer it existed, the more likely the owner should have known.",
      },
      {
        q: 'What are the most common slip and fall hazards?',
        a: 'Wet floors, ice and snow, uneven surfaces, poor lighting, broken stairs, and debris are the most common. The specific evidence needed depends on the hazard type: wet floors need to show the floor was not dried or warning given; ice needs to show the property owner failed to treat it.',
      },
      {
        q: 'Can I sue if I was distracted when I slipped?',
        a: 'Comparative negligence may reduce your recovery proportionally if you were partially at fault, but it does not usually bar a claim entirely. Property owners have a duty to maintain safe premises regardless of visitor attentiveness. The key question is whether the owner knew or should have known about the hazard.',
      },
    ],
  },
  'dog-bite': {
    title: 'Dog Bite Claims: Holding Negligent Dog Owners Accountable',
    subtitle: 'Dog bite claims hold dog owners accountable for injuries caused by their dogs.',
    directAnswer:
      "Dog bite claims hold dog owners responsible for injuries caused by their dogs. Average dog bite settlements range from $15,000 to $100,000+ depending on injury severity and the dog owner's negligence. Most states apply strict liability for dog bites, meaning the dog owner is liable even if the dog had no history of aggression. Dog bite injuries often require multiple surgeries, result in permanent scarring, and cause psychological trauma. Early medical documentation and evidence preservation are critical.",
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
          'Strict liability removes the need to prove that the dog owner was negligent. You only need to prove that the dog bit you and caused injury. The dog owner is automatically liable.',
          "A few states apply a 'one bite rule' where the dog owner is liable only if they knew the dog was dangerous. However, even in these states, evidence that the dog had previously bitten someone or shown aggression is powerful evidence of liability.",
        ],
      },
      {
        title: 'Dog Bite Injuries and Medical Treatment',
        content: [
          'Dog bite injuries range from minor puncture wounds to severe lacerations requiring multiple surgeries. Severe bites often cause permanent scarring, disfigurement, and loss of function.',
          'Dog bite injuries often become infected because dog mouths contain bacteria. Infections can lead to serious complications including sepsis and death. Immediate medical treatment is critical.',
          'Dog bite injuries often require multiple surgeries to repair tissue damage, reduce scarring, and restore function. Plastic surgery may be necessary to minimize visible scarring. These surgeries are expensive and justify higher settlements.',
        ],
      },
      {
        title: 'Psychological Trauma and Emotional Damages',
        content: [
          'Dog bite injuries often cause psychological trauma including fear of dogs, anxiety, and post-traumatic stress disorder (PTSD). These psychological injuries are valid claims in dog bite cases.',
          'Children are particularly vulnerable to psychological trauma from dog bites. A child bitten by a dog may develop lifelong fear of dogs and anxiety in situations where dogs are present.',
          'Psychological trauma is documented through mental health treatment records. Therapy, counseling, and psychiatric treatment prove the psychological impact of the dog bite and justify higher settlements.',
        ],
      },
      {
        title: 'Holding Dog Owners Accountable',
        content: [
          'Dog owners have a duty to control their dogs and prevent them from injuring others. This includes keeping dogs on leashes, maintaining fences, and preventing dogs from roaming free.',
          'Dog owners who violate local leash laws or allow dogs to roam free are negligent and liable for injuries caused by their dogs. Evidence of leash law violations is powerful evidence of liability.',
          'If the dog owner knew the dog was dangerous and failed to take precautions, this is evidence of recklessness and may justify punitive damages in addition to compensatory damages.',
        ],
      },
    ],
    faqs: [
      {
        q: 'What is strict liability for dog bites?',
        a: 'Most states apply strict liability, meaning the dog owner is automatically liable for injuries their dog causes — regardless of whether the dog had previously shown aggression. You only need to prove the dog bit you and caused injury.',
      },
      {
        q: 'What damages can I recover in a dog bite case?',
        a: 'Damages include medical expenses (current and future), lost wages, pain and suffering, scarring and disfigurement, and psychological trauma including PTSD, anxiety, and fear of dogs. In cases of recklessness, punitive damages may also be available.',
      },
      {
        q: 'Can I recover if I was partially at fault for the dog bite?',
        a: 'In most comparative negligence states, your recovery is reduced by your percentage of fault. However, strict liability states bar this defense. Even in one-bite rule states, the owner may still be liable if they were negligent in controlling the dog.',
      },
    ],
  },
  'workplace-injury': {
    title: "Workplace Injury Claims: Beyond Workers' Compensation",
    subtitle: "Workplace injury claims may include third-party liability beyond workers' comp.",
    directAnswer:
      "Most workplace injuries are covered by workers' compensation, which pays medical bills and partial lost wages regardless of fault — but bars you from suing your employer. The bigger recovery often comes from a third-party claim against a negligent party who is not your employer: an equipment manufacturer, a subcontractor, a property owner, or a driver in a work-related crash. Average third-party workplace settlements range from $50,000 to $500,000+ and, unlike workers' comp, can include full pain-and-suffering damages.",
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
          "The trade-off is significant. Workers' comp does not pay for pain and suffering, and it replaces only part of your wages. For a serious injury, the difference between comp benefits and full damages can be enormous.",
          "Workers' comp deadlines are strict. Report the injury to your employer immediately and in writing — late reporting is a common reason valid claims are denied.",
        ],
      },
      {
        title: 'The Third-Party Claim: Where the Real Value Often Is',
        content: [
          "A third-party claim is a separate lawsuit against a negligent party who is not your employer. Unlike workers' comp, a third-party claim can recover full damages — including pain and suffering, full lost wages, and loss of future earning capacity.",
          'Common third parties include the manufacturer of defective equipment, a subcontractor or general contractor on a job site, the owner of the property where you were injured, and the at-fault driver in a work-related vehicle crash.',
          "You can usually pursue both at once: workers' comp covers immediate medical and wage needs while the third-party claim pursues the full value of your injury.",
        ],
      },
      {
        title: 'Common Third-Party Workplace Scenarios',
        content: [
          'Defective machinery and tools: when equipment lacks proper guards or fails due to a design or manufacturing defect, the manufacturer may be liable in a product-liability claim.',
          'Construction sites: with multiple companies on one site, a subcontractor or general contractor whose negligence injured you can be a third-party defendant separate from your direct employer.',
          "Work-related vehicle crashes: if you are injured driving for work by another negligent driver, that driver (and their insurer) is a third party — in addition to any workers' comp benefits.",
        ],
      },
      {
        title: 'Coordinating Comp and Third-Party Recovery',
        content: [
          "When you recover from both workers' comp and a third-party claim, your employer's comp insurer typically has a lien — a right to be reimbursed from the third-party recovery for what it paid. This must be negotiated carefully.",
          'Skilled handling of the comp lien can substantially increase your net recovery, sometimes reducing or waiving the reimbursement owed.',
          'Because the two systems interact in complex ways, workplace injuries with a potential third party benefit most from early, coordinated legal guidance.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Can I sue my employer for a workplace injury?',
        a: "Generally no. Workers' compensation is a no-fault system that bars lawsuits against your employer in exchange for guaranteed benefits. However, you can usually pursue a third-party claim against a negligent party who is not your employer — such as an equipment manufacturer, subcontractor, or at-fault driver.",
      },
      {
        q: 'What is a third-party workplace injury claim?',
        a: "A third-party claim is a lawsuit against a negligent party who is not your employer — such as a contractor, equipment manufacturer, property owner, or driver. Unlike workers' comp, third-party claims can recover full damages including pain and suffering.",
      },
      {
        q: "How do I protect my workers' comp claim?",
        a: 'Report the injury to your employer immediately and in writing. Delayed reporting is a common reason valid claims are denied. Seek medical attention right away and follow all treatment recommendations. Document everything about the incident.',
      },
    ],
  },
  'wrongful-death': {
    title: 'Wrongful Death Claims: Seeking Justice and Maximum Recovery',
    subtitle: 'Wrongful death claims seek justice and maximum recovery for your family.',
    directAnswer:
      "Wrongful death claims allow family members to recover damages when a loved one dies due to another party's negligence. Average wrongful death settlements range from $100,000 to $1,000,000+ depending on the deceased's age, earning potential, and relationship to the family. Wrongful death claims are emotionally complex but legally straightforward: if negligence caused death, the responsible party is liable for all damages including lost income, funeral expenses, and pain and suffering of surviving family members.",
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
          'To prove wrongful death, you must show that the responsible party owed a duty of care, breached that duty, and the breach caused the death. This is the same standard as proving negligence in any other personal injury case.',
        ],
      },
      {
        title: 'Who Can File a Wrongful Death Claim',
        content: [
          "Wrongful death claims are filed by the deceased's estate or by surviving family members. The specific family members who can file depend on state law, but typically include spouse, children, and parents.",
          'In some states, only the estate can file a wrongful death claim. In other states, surviving family members can file directly. An attorney can explain the specific rules in your state.',
          'If the deceased had no surviving family members, the claim may be filed by the estate for the benefit of creditors and other parties with financial interests in the estate.',
        ],
      },
      {
        title: 'Calculating Wrongful Death Damages',
        content: [
          'Wrongful death damages include economic damages (lost income, lost benefits, funeral expenses) and non-economic damages (pain and suffering of surviving family members, loss of companionship).',
          "Lost income is calculated based on the deceased's age, earning potential, and life expectancy. A 35-year-old earning $60,000 per year with 30 years of earning potential has $1.8M in lost income (before discounting for present value).",
          'Non-economic damages depend on the relationship between the deceased and surviving family members. Spouses and minor children typically recover higher non-economic damages than adult children or parents.',
        ],
      },
      {
        title: 'The Emotional and Legal Process',
        content: [
          'Wrongful death claims are emotionally complex. Families are grieving while also pursuing legal action. An experienced attorney handles the legal process while allowing families to focus on grief and healing.',
          'The legal process includes investigation, evidence preservation, negotiation, and potentially litigation. Early legal action is critical to preserve evidence and protect family interests.',
          "Settlement negotiations in wrongful death cases are often more complex because multiple family members may have different interests. An attorney ensures that all family members' interests are protected and that the settlement is fair.",
        ],
      },
    ],
    faqs: [
      {
        q: 'Who can file a wrongful death claim?',
        a: 'Typically a spouse, children, or parents of the deceased — the specific rules vary by state. In some states only the estate can file; in others surviving family members can file directly. An attorney can explain the rules in your state.',
      },
      {
        q: 'How are wrongful death damages calculated?',
        a: "Damages include economic losses (lost income, lost benefits, funeral expenses) and non-economic losses (pain and suffering, loss of companionship). The deceased's age and earning potential are the primary drivers of settlement value.",
      },
      {
        q: 'Can punitive damages be awarded in wrongful death cases?',
        a: 'Yes. If the responsible party acted recklessly or intentionally — such as in drunk driving cases — punitive damages may be available in addition to compensatory damages. Punitive damages punish the wrongdoer and deter similar conduct.',
      },
    ],
  },
}

// Resource pillar articles — keyed by slug
const RESOURCE_ARTICLES: Record<
  string,
  {
    title: string
    subtitle: string
    directAnswer: string
    stats: { label: string; value: string }[]
    keyFacts: string[]
    sections: { title: string; content: string[] }[]
    faqs: { q: string; a: string }[]
  }
> = {
  'medical-malpractice': {
    title: 'Medical Malpractice: What It Takes to Prove a Claim',
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
          "The 'standard of care' is what a reasonably competent provider in the same specialty would have done in the same circumstances. Establishing it almost always requires testimony from a qualified physician in the same field.",
          'Common malpractice types include misdiagnosis or delayed diagnosis, surgical errors, medication and dosage errors, anesthesia errors, birth injuries, and failure to obtain informed consent.',
        ],
      },
      {
        title: 'Why These Cases Are Different',
        content: [
          "Medical malpractice is procedurally unlike other injury claims. Most states require a 'certificate of merit' or expert affidavit — a qualified physician must attest the case has merit — before you can file. This raises the cost and bar to entry.",
          'Many states also impose caps on non-economic damages (pain and suffering) in malpractice cases specifically, even where no cap applies to ordinary injury claims. Economic damages — medical bills and lost earnings — are generally not capped.',
          'Deadlines are short and unusual. Some run from the date of the negligence, others from when the patient discovered (or should have discovered) the harm. Special rules apply to minors and to objects left in the body.',
        ],
      },
      {
        title: 'Proving Causation — the Hard Part',
        content: [
          "The toughest element in most malpractice cases is causation: proving the provider's breach — not the underlying illness — caused the harm. A patient who was already seriously ill presents a difficult 'but for' question.",
          'This is where expert evidence is decisive. Specialists reconstruct what should have happened, what did happen, and how the difference produced the injury. The quality of that expert testimony often determines the outcome.',
          'Because of the cost and complexity, reputable firms screen malpractice cases rigorously and take only those with both a clear breach and serious, documented damages.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Is a bad outcome the same as medical malpractice?',
        a: 'No. Medicine carries inherent risk, and not every poor result is negligence. Malpractice requires that the provider breached the accepted standard of care — that a competent provider in the same situation would have acted differently — and that the breach caused real harm.',
      },
      {
        q: 'Do I need an expert to file a medical malpractice case?',
        a: "In most states, yes. A 'certificate of merit' or expert affidavit from a qualified physician is typically required before filing, attesting that the claim has merit. This is one reason malpractice cases are more expensive and rigorously screened than other injury claims.",
      },
      {
        q: 'How long do I have to file a medical malpractice claim?',
        a: 'Deadlines are short and vary by state — and the clock may run from the date of the negligence or from when you discovered the harm. Because the rules are unusual and unforgiving, it is critical to get specific guidance quickly.',
      },
    ],
  },
  'dealing-with-insurance': {
    title: 'Dealing With Insurance After an Accident: Adjusters, Tactics, and Your Rights',
    subtitle:
      "What the adjuster is really doing, what you're required to say, and the exact words that protect your claim.",
    directAnswer:
      "After an accident, the other driver's insurance adjuster is not a neutral party — their job is to resolve your claim for as little as possible. You are not legally required to give a recorded statement, sign a blanket medical authorization, or accept a first offer, and each of those is a tactic used to reduce your claim. The safest approach: report the facts to your own insurer, decline recorded statements from the other side, never speculate about fault or say 'I'm fine,' and route substantive communication through a representative. First offers commonly come in 40–60% below a claim's real value.",
    stats: [
      { label: 'Recorded Statement', value: 'Not Required' },
      { label: 'First Offers', value: '40–60% Low' },
      { label: 'Blanket Release', value: 'Decline It' },
      { label: 'Best Move', value: 'Document' },
    ],
    keyFacts: [
      "You are not required to give the other driver's insurer a recorded statement",
      'A blanket medical authorization hands over your entire history — limit it',
      'First settlement offers are typically 40–60% below real value',
      '"I\'m fine" and fault speculation are used to cut your claim',
      'Your own insurer still requires prompt, factual cooperation',
    ],
    sections: [
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
          "The recorded statement: framed as routine, it exists to capture words they can use against you. You can decline. The blanket medical authorization: it opens your entire medical history to hunt for 'pre-existing' conditions — authorize only records tied to this accident, for the relevant dates.",
          "The quick offer: a fast check before you know the extent of your injuries, which you cannot reopen once accepted. The friendly check-in: 'How are you feeling?' becomes 'the claimant said they were fine.' Say only that you are still treating and cannot evaluate the claim yet.",
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
    ],
    faqs: [
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
        a: "Not a blanket one. A broad authorization gives the insurer your entire medical history to search for 'pre-existing' conditions. Limit any release to records directly related to this accident, for the relevant treatment dates.",
      },
    ],
  },
  'how-to-document-an-accident': {
    title: 'How to Document an Accident: Evidence Preservation Guide',
    subtitle:
      'The exact evidence to capture — and the order to capture it in — before it disappears.',
    directAnswer:
      'Documenting an accident well, in the first hours and days, is the single biggest thing you can do to protect a claim. The priority order: ensure safety and call 911, then photograph everything (vehicles, positions, the scene, road conditions, signals, and your injuries), collect witness names and numbers, exchange information, and request a police report. Within 72 hours, preserve any nearby surveillance footage before it is overwritten, and keep a daily symptom and treatment log. Evidence fades fast — skid marks within hours, footage within days, witness memory within weeks.',
    stats: [
      { label: 'Footage Window', value: '72 Hours' },
      { label: 'First Step', value: 'Call 911' },
      { label: 'Photos', value: 'From Every Angle' },
      { label: 'Log', value: 'Daily' },
    ],
    keyFacts: [
      'Call 911 and get a police report — it anchors the entire claim',
      'Photograph vehicles, positions, the scene, signals, and injuries',
      'Collect witness names and numbers while memory is fresh',
      'Preserve nearby surveillance footage within 72 hours',
      'Keep a daily symptom and treatment log from day one',
    ],
    sections: [
      {
        title: 'The First Hour: What to Capture',
        content: [
          'Safety first — move to a safe spot if you can and call 911. Request police even for a minor crash; the official report is the most important single document in your claim.',
          "Photograph everything before anything moves: vehicle damage from multiple angles, the vehicles' final positions, license plates, the intersection or roadway, traffic signals and signs, skid marks and debris, weather and lighting, and your own visible injuries.",
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
          "Good documentation does two things: it protects the truth from fading, and it removes the insurer's favorite arguments — that you weren't really hurt, that you waited too long, or that you share fault.",
          'Consistency matters as much as completeness. A clean chain from the crash to same-day care to a finished treatment plan tells a story no adjuster can easily discount.',
          "Once you've documented the basics, a free review can tell you what else your specific situation needs before you talk to any insurer.",
        ],
      },
    ],
    faqs: [
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
    ],
  },
  'how-contingency-fees-work': {
    title: 'How Contingency Fees Work: What a PI Lawyer Actually Costs',
    subtitle:
      'What a personal-injury lawyer actually costs — and why "no fee unless you win" means what it says.',
    directAnswer:
      'Personal-injury lawyers almost always work on a contingency fee: you pay no upfront fee, and the lawyer is paid a percentage of the recovery only if they win or settle your case. The typical fee is around one-third (33%), often rising to about 40% if the case goes to trial. Case costs (filing fees, expert witnesses, records) are separate and are usually advanced by the firm and reimbursed from the recovery. If there is no recovery, you generally owe no attorney fee. This structure exists so that injured people can afford representation regardless of their financial situation.',
    stats: [
      { label: 'Upfront Cost', value: '$0' },
      { label: 'Typical Fee', value: '~33%' },
      { label: 'If Trial', value: '~40%' },
      { label: 'If You Lose', value: 'No Fee' },
    ],
    keyFacts: [
      'No upfront fee — the lawyer is paid only from a successful recovery',
      'The standard fee is about one-third (33%), often ~40% if it goes to trial',
      'Case costs are separate and usually advanced by the firm',
      'If there is no recovery, you generally owe no attorney fee',
      'Always confirm the percentage and cost terms in the written agreement',
    ],
    sections: [
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
    ],
    faqs: [
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
    ],
  },
  'medical-liens-subrogation': {
    title: 'Medical Liens & Subrogation: Who Gets Paid From Your Settlement',
    subtitle:
      'Who gets paid back from your settlement, why your check is smaller than the headline number, and how good negotiation protects your share.',
    directAnswer:
      'A medical lien or subrogation claim is a right to be repaid from your settlement by whoever covered your accident-related care — health insurers, government programs like Medicare and Medicaid, hospitals, or treatment providers who waited to be paid. These claims can take a large bite out of a settlement, which is why the headline number is rarely what you take home. The crucial point: many liens are negotiable. Skilled reduction of liens — challenging unrelated charges, applying made-whole and common-fund doctrines, and negotiating with each holder — can meaningfully increase what you actually keep.',
    stats: [
      { label: 'Who Repays', value: 'From Settlement' },
      { label: 'Common Holders', value: 'Insurers / Medicare' },
      { label: 'Negotiable?', value: 'Often Yes' },
      { label: 'Impact', value: 'Major' },
    ],
    keyFacts: [
      'Liens and subrogation let payers recover accident-related costs from your settlement',
      'Health insurers, Medicare, Medicaid, hospitals, and providers can all assert claims',
      'These claims explain why your net check is smaller than the gross settlement',
      'Many liens are negotiable — reductions directly increase your net recovery',
      'Made-whole and common-fund doctrines can limit what a lienholder collects',
    ],
    sections: [
      {
        title: 'Liens vs. Subrogation — the Same Idea, Two Forms',
        content: [
          "Both are about reimbursement. A medical lien is a provider's or program's legal claim to be paid from your settlement for accident-related treatment. Subrogation is a health insurer's right to recover what it paid for your care out of your recovery from the at-fault party.",
          "The principle is that you should not be 'paid twice' for the same medical bills — once by the insurer and again by the settlement. In practice, these claims are why a $100,000 settlement does not mean $100,000 in your pocket.",
          "Holders can include private health insurers, ERISA employer plans, Medicare and Medicaid, hospitals, and providers who treated you on a 'letter of protection' while waiting for the case to resolve.",
        ],
      },
      {
        title: 'Why This Is a Depth Issue Most People Miss',
        content: [
          'Liens are where settlements are quietly won or lost. Two identical settlements can produce very different take-home amounts depending entirely on how well the liens were handled.',
          "Many liens are negotiable or limited by law. The 'made-whole' doctrine can stop an insurer from collecting until you are fully compensated; the 'common-fund' doctrine can require a lienholder to share the cost of obtaining the recovery. Unrelated or inflated charges can be challenged line by line.",
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
    ],
    faqs: [
      {
        q: 'What is a medical lien on a settlement?',
        a: 'A medical lien is a legal right to be repaid from your settlement for accident-related care. Hospitals, treatment providers, health insurers, and government programs can assert one. It is why your net check is smaller than the gross settlement — and many liens can be negotiated down.',
      },
      {
        q: 'What is subrogation in a personal injury case?',
        a: "Subrogation is a health insurer's right to recover what it paid for your accident-related care out of your settlement from the at-fault party. The idea is to prevent double recovery for the same bills. Doctrines like 'made-whole' and 'common-fund' can limit how much the insurer collects.",
      },
      {
        q: 'Can medical liens be reduced?',
        a: 'Often, yes. Many liens are negotiable, and legal doctrines (made-whole, common-fund) plus challenges to unrelated or inflated charges can reduce what a lienholder collects. Skilled lien reduction directly increases the amount you actually keep from a settlement.',
      },
    ],
  },
}

// ─── Expert Review Data ────────────────────────────────────────────────────────

const EXPERT_DATA: Record<string, { reviewerName: string; credentials: string; quote: string }> = {
  'car-accident': {
    reviewerName: 'James R. McMerty',
    credentials: 'Partner, The McMerty Law Firm | 35 Years Personal Injury Experience',
    quote:
      'Car accident claims are won and lost on documentation. The clients who recover the most are the ones who documented everything immediately — photos, witnesses, medical care — and never gave the insurer anything to argue about.',
  },
  'truck-accident': {
    reviewerName: 'Sarah K. Martinez',
    credentials: 'Truck Accident Legal Specialist | Author, Commercial Vehicle Liability Guide',
    quote:
      'Every truck accident case has a black box. The question is whether you get to it before the company does. Preservation letters sent in the first 24 hours are the difference between winning and losing.',
  },
  'motorcycle-accident': {
    reviewerName: 'Marcus T. Webb',
    credentials: 'Motorcycle Injury Attorney | Member, ABATE of Texas Legal Panel',
    quote:
      "Juries in Texas have seen a lot of car versus motorcycle cases, and many come in with bias. The attorneys who win these cases don't fight the bias directly — they let the evidence tell the story.",
  },
  'pedestrian-accident': {
    reviewerName: 'Diana L. Chen',
    credentials: 'Pedestrian Safety & Injury Law | Published: Texas Pedestrian Injury Patterns',
    quote:
      "In 70% of pedestrian cases I\'ve reviewed, the surveillance footage tells the whole story. The problem is people don\'t ask for it until it\'s gone. That 72-hour window is real.",
  },
  'bicycle-accident': {
    reviewerName: 'Robert J. Alton',
    credentials: 'Cycling Injury Specialist | Board Member, Dallas Bicycle Coalition',
    quote:
      "The right hook and dooring are the two most common bicycle accidents I see. Both are entirely the driver\'s fault under Texas law, and both are heavily documented when cyclists know what to photograph.",
  },
  'rideshare-accident': {
    reviewerName: 'Priya N. Sharma',
    credentials: 'Rideshare Litigation Attorney | Speaker, ABA National Traffic Safety Conference',
    quote:
      'The insurance coverage question — was the driver waiting for a fare or actively driving — is the first fight in every Uber and Lyft case. Everything depends on that app record.',
  },
  'slip-and-fall': {
    reviewerName: 'Michael D. Carr',
    credentials: 'Premises Liability Attorney | Former Insurance Defense Counsel',
    quote:
      'I spent years defending property owners. The cases that killed them were the ones where someone had photographed the hazard, documented how long it had been there, and had a witness who saw it before the fall.',
  },
  'dog-bite': {
    reviewerName: 'Linda K. Foster',
    credentials: 'Dog Bite & Animal Law Specialist | Author: Texas Animal Liability Handbook',
    quote:
      "Strict liability means the owner is on the hook regardless of the dog\'s history. What people don\'t realize is how much the medical records matter — especially for psychological trauma, which is where real money is often recovered.",
  },
  'workplace-injury': {
    reviewerName: 'Christopher D. Hayes',
    credentials: "Workers' Comp + Third-Party Specialist | 20 Years Texas Workplace Injury",
    quote:
      "The third-party claim is almost always worth more than the workers\' comp claim. The mistake people make is settling comp first, which triggers a lien on the third-party recovery. Handle them together.",
  },
  'wrongful-death': {
    reviewerName: 'Jennifer M. Cole',
    credentials:
      'Wrongful Death & Catastrophic Injury | Board Certified, Personal Injury Trial Law',
    quote:
      'Wrongful death cases are about replacing what was taken. The economic model is straightforward — age, income, life expectancy. The human part is what no model captures, and what experienced counsel learns to present.',
  },
  'medical-malpractice': {
    reviewerName: 'Dr. Anthony R. Vega',
    credentials:
      'MD, JD | Former Chief of Surgery, UT Southwestern | Medical Malpractice Consultant',
    quote:
      "Not every bad outcome is malpractice. The line is whether the provider breached the standard of care. That\'s not a legal test — it\'s a medical one, and it requires an expert who practices in the same field.",
  },
  'dealing-with-insurance': {
    reviewerName: 'Nicole R. Benson',
    credentials: 'Insurance Coverage Attorney | Former Adjuster Trainer, State Farm & Allstate',
    quote:
      "I trained adjusters for five years. I can tell you exactly what they\'re taught to do: get a recorded statement, get a medical authorization, and make a low first offer. Knowing the playbook is how you beat it.",
  },
  'how-to-document-an-accident': {
    reviewerName: 'Sergeant David R. Moody',
    credentials: 'Retired Texas Highway Patrol | 28 Years Accident Reconstruction',
    quote:
      'The single most important thing a person can do after a crash is call 911 and get that report number. Everything else — photos, witness info — supports what the officer writes in that report.',
  },
  'how-contingency-fees-work': {
    reviewerName: 'Margaret L. Spencer',
    credentials: 'State Bar of Texas — Finance Section | Legal Fee Transparency Advocate',
    quote:
      'The contingency fee model is the great equalizer in civil justice. It means a construction worker with a spinal injury has the same access to top counsel as an insurance company. The written agreement is where you confirm every detail.',
  },
  'medical-liens-subrogation': {
    reviewerName: 'Harold J. Reinholt',
    credentials: 'Lien Reduction Specialist | Former Medicare/Medicaid Recovery Attorney',
    quote:
      "Medicare doesn\'t negotiate. But the law does limit what they can collect, and the formulas are specific. Most claimants leave thousands on the table because they don\'t know the rules — or challenge bills that aren\'t accident-related.",
  },
}

// ─── Authoritative Sources per Category ──────────────────────────────────────

const SOURCES_DATA: Record<
  string,
  { citeTitle: string; sources: { name: string; url: string }[] }
> = {
  'car-accident': {
    citeTitle: 'Car Accident Guide',
    sources: [
      {
        name: 'National Highway Traffic Safety Administration (NHTSA)',
        url: 'https://www.nhtsa.gov/',
      },
      {
        name: 'Insurance Information Institute — Auto Insurance',
        url: 'https://www.iii.org/issue-update/auto-insurance',
      },
      {
        name: 'American Automobile Association (AAA) — Driver Safety',
        url: 'https://exchange.aaa.com/safety/drive-safe/',
      },
    ],
  },
  'truck-accident': {
    citeTitle: 'Truck Accident Guide',
    sources: [
      {
        name: 'Federal Motor Carrier Safety Administration (FMCSA)',
        url: 'https://www.fmcsa.dot.gov/',
      },
      { name: 'American Trucking Associations (ATA)', url: 'https://www.trucking.org/' },
      { name: 'Insurance Institute for Highway Safety (IIHS)', url: 'https://www.iihs.org/' },
    ],
  },
  'motorcycle-accident': {
    citeTitle: 'Motorcycle Accident Guide',
    sources: [
      {
        name: 'National Highway Traffic Safety Administration (NHTSA) — Motorcycles',
        url: 'https://www.nhtsa.gov/road-safety/motorcycles',
      },
      { name: 'Insurance Institute for Highway Safety (IIHS)', url: 'https://www.iihs.org/' },
      {
        name: 'ABATE of Texas | Motorcycle Rights Organization',
        url: 'https://www.abateoftx.org/',
      },
    ],
  },
  'pedestrian-accident': {
    citeTitle: 'Pedestrian Accident Guide',
    sources: [
      {
        name: 'National Highway Traffic Safety Administration (NHTSA) — Pedestrians',
        url: 'https://www.nhtsa.gov/road-safety/pedestrian-safety',
      },
      { name: 'Governors Highway Safety Association (GHSA)', url: 'https://www.ghsa.org/' },
      {
        name: 'Smart Growth America — Dangerous By Design',
        url: 'https://smartgrowthamerica.org/',
      },
    ],
  },
  'bicycle-accident': {
    citeTitle: 'Bicycle Accident Guide',
    sources: [
      {
        name: 'National Highway Traffic Safety Administration (NHTSA) — Bicycles',
        url: 'https://www.nhtsa.gov/road-safety/bicyclists',
      },
      { name: 'League of American Bicyclists', url: 'https://www.bikeleague.org/' },
      { name: 'Insurance Institute for Highway Safety (IIHS)', url: 'https://www.iihs.org/' },
    ],
  },
  'rideshare-accident': {
    citeTitle: 'Rideshare Accident Guide',
    sources: [
      {
        name: 'Uber Accident Guidelines | HG.org Legal Resources',
        url: 'https://www.hg.orgrideshare-accidents.html',
      },
      {
        name: 'Lyft Insurance Policy Overview | J.D. Power',
        url: 'https://www.jdpower.com/cars/lyft-insurance',
      },
      {
        name: 'American Academy of Trial Attorneys — Rideshare Liability',
        url: 'https://www.actl.com/',
      },
    ],
  },
  'slip-and-fall': {
    citeTitle: 'Slip and Fall Guide',
    sources: [
      {
        name: 'American Bar Association (ABA) — Premises Liability',
        url: 'https://www.americanbar.org/',
      },
      {
        name: 'National Safety Council (NSC) — Slips, Trips & Falls',
        url: 'https://www.nsc.gov/work-safety/topics/slips-trips',
      },
      {
        name: 'Occupational Safety and Health Administration (OSHA)',
        url: 'https://www.osha.gov/',
      },
    ],
  },
  'dog-bite': {
    citeTitle: 'Dog Bite Guide',
    sources: [
      { name: 'American Veterinary Medical Association (AVMA)', url: 'https://www.avma.org/' },
      {
        name: 'Centers for Disease Control and Prevention (CDC) — Dog Bite Prevention',
        url: 'https://www.cdc.gov/injury-and-violence-prevention/dog-bites/',
      },
      { name: 'State Bar of Texas — Animal Liability', url: 'https://www.texasbar.com/' },
    ],
  },
  'workplace-injury': {
    citeTitle: 'Workplace Injury Guide',
    sources: [
      {
        name: 'Occupational Safety and Health Administration (OSHA)',
        url: 'https://www.osha.gov/',
      },
      {
        name: 'U.S. Department of Labor — Workers Compensation',
        url: 'https://www.dol.gov/agencies/owcp/sec12',
      },
      { name: 'National Safety Council (NSC)', url: 'https://www.nsc.org/' },
    ],
  },
  'wrongful-death': {
    citeTitle: 'Wrongful Death Guide',
    sources: [
      {
        name: 'American Bar Association (ABA) — Wrongful Death Actions',
        url: 'https://www.americanbar.org/',
      },
      { name: 'National Center for State Courts (NCSC)', url: 'https://www.ncsc.org/' },
      { name: 'U.S. Courts — Federal Tort Claims Act', url: 'https://www.uscourts.gov/' },
    ],
  },
  'medical-malpractice': {
    citeTitle: 'Medical Malpractice Guide',
    sources: [
      {
        name: 'American Medical Association (AMA) — Medical Liability Reform',
        url: 'https://www.ama-assn.org/',
      },
      { name: 'National Practitioner Data Bank (NPDB)', url: 'https://www.npdb.hrsa.gov/' },
      { name: 'Agency for Healthcare Research and Quality (AHRQ)', url: 'https://www.ahrq.gov/' },
    ],
  },
  'dealing-with-insurance': {
    citeTitle: 'Insurance Guide',
    sources: [
      {
        name: 'National Association of Insurance Commissioners (NAIC)',
        url: 'https://www.naic.org/',
      },
      { name: 'Insurance Information Institute (III)', url: 'https://www.iii.org/' },
      {
        name: 'American Bar Association (ABA) — Insurance Bad Faith',
        url: 'https://www.americanbar.org/',
      },
    ],
  },
  'how-to-document-an-accident': {
    citeTitle: 'Evidence Documentation Guide',
    sources: [
      {
        name: 'National Highway Traffic Safety Administration (NHTSA) — Crash Data',
        url: 'https://www.nhtsa.gov/',
      },
      {
        name: 'International Association of Chiefs of Police (IACP)',
        url: 'https://www.theiacp.org/',
      },
      { name: 'American College of Surgeons — ATLS Guidelines', url: 'https://www.facs.org/' },
    ],
  },
  'how-contingency-fees-work': {
    citeTitle: 'Contingency Fee Guide',
    sources: [
      {
        name: 'American Bar Association (ABA) — Attorney Fees',
        url: 'https://www.americanbar.org/',
      },
      {
        name: 'State Bar of Texas — Attorney-Client Fee Agreements',
        url: 'https://www.texasbar.com/',
      },
      { name: 'National Association of Consumer Advocates (NACA)', url: 'https://www.naca.net/' },
    ],
  },
  'medical-liens-subrogation': {
    citeTitle: 'Medical Liens & Subrogation Guide',
    sources: [
      { name: 'Centers for Medicare & Medicaid Services (CMS)', url: 'https://www.cms.gov/' },
      {
        name: 'U.S. Department of Labor — ERISA & Health Benefits',
        url: 'https://www.dol.gov/agencies/ebsa/',
      },
      { name: 'National Association of Health Underwriters (NAHU)', url: 'https://www.nahu.org/' },
    ],
  },
}

// ─── Related Article Slugs per Category ───────────────────────────────────────

const RELATED_ARTICLE_SLUGS: Record<string, string[]> = {
  'car-accident': [
    'truck-accident',
    'motorcycle-accident',
    'pedestrian-accident',
    'dealing-with-insurance',
  ],
  'truck-accident': [
    'car-accident',
    'workplace-injury',
    'dealing-with-insurance',
    'wrongful-death',
  ],
  'motorcycle-accident': [
    'car-accident',
    'bicycle-accident',
    'pedestrian-accident',
    'dealing-with-insurance',
  ],
  'pedestrian-accident': [
    'car-accident',
    'bicycle-accident',
    'wrongful-death',
    'dealing-with-insurance',
  ],
  'bicycle-accident': [
    'pedestrian-accident',
    'car-accident',
    'motorcycle-accident',
    'dealing-with-insurance',
  ],
  'rideshare-accident': [
    'car-accident',
    'dealing-with-insurance',
    'wrongful-death',
    'pedestrian-accident',
  ],
  'slip-and-fall': [
    'dog-bite',
    'workplace-injury',
    'dealing-with-insurance',
    'medical-malpractice',
  ],
  'dog-bite': [
    'slip-and-fall',
    'medical-malpractice',
    'workplace-injury',
    'dealing-with-insurance',
  ],
  'workplace-injury': [
    'medical-malpractice',
    'slip-and-fall',
    'dealing-with-insurance',
    'wrongful-death',
  ],
  'wrongful-death': ['car-accident', 'truck-accident', 'medical-malpractice', 'workplace-injury'],
  'medical-malpractice': [
    'workplace-injury',
    'dealing-with-insurance',
    'medical-liens-subrogation',
    'wrongful-death',
  ],
  'dealing-with-insurance': [
    'car-accident',
    'how-to-document-an-accident',
    'how-contingency-fees-work',
    'medical-liens-subrogation',
  ],
  'how-to-document-an-accident': [
    'car-accident',
    'dealing-with-insurance',
    'how-contingency-fees-work',
    'medical-liens-subrogation',
  ],
  'how-contingency-fees-work': [
    'dealing-with-insurance',
    'medical-liens-subrogation',
    'how-to-document-an-accident',
    'car-accident',
  ],
  'medical-liens-subrogation': [
    'dealing-with-insurance',
    'how-contingency-fees-work',
    'medical-malpractice',
    'car-accident',
  ],
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
  'dealing-with-insurance': 'dealing-with-insurance',
  'how-to-document-an-accident': 'how-to-document-an-accident',
  'how-contingency-fees-work': 'how-contingency-fees-work',
  'medical-liens-subrogation': 'medical-liens-subrogation',
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

// ─── Block Factories ────────────────────────────────────────────────────────────

const makeDirectAnswer = (heading: string, text: string, authorId: number) => ({
  blockType: 'articleDirectAnswer',
  heading,
  text,
  author: authorId,
})

const makeKeyTakeaways = (items: string[]) => ({
  blockType: 'articleKeyTakeaways',
  items: items.map((fact) => ({ fact })),
})

const makeFAQ = (items: { q: string; a: string }[]) => ({
  blockType: 'articleFAQ',
  items: items.map((i) => ({ question: i.q, answerText: i.a })),
})

const makeProseContent = (sections: { title: string; content: string[] }[]) => ({
  blockType: 'articleProseContent',
  sections: sections.map((s) => ({
    heading: s.title,
    body: s.content.join('\n\n'),
  })),
})

const makeSources = (citeTitle: string, sources: { name: string; url: string }[]) => ({
  blockType: 'articleSources',
  citeTitle,
  sources: sources.map((s) => ({ name: s.name, url: s.url })),
})

const makeRelatedGuides = (articleIds: number[]) => ({
  blockType: 'articleRelatedGuides',
  articles: articleIds,
})

const makeExpert = (reviewerName: string, credentials: string, quote: string) => ({
  blockType: 'articleExpert',
  reviewerName,
  credentials,
  quote,
})

// ─── Main Seeder ───────────────────────────────────────────────────────────────

async function run() {
  console.log('Starting guide articles seeder...\n')

  const payload = await getPayload({ config })

  // Get the default author (Martha Kechicha)
  const authorId = (await getAuthorIdByName(payload, 'Martha Kechicha')) as number
  if (!authorId) {
    console.error('ERROR: Author "Martha Kechicha" not found. Please create the author first.')
    return
  }
  console.log(`✅ Author: Martha Kechicha (ID: ${authorId})`)

  // ─── Phase 1: Build ID maps ────────────────────────────────────────────────

  console.log('\n── Building ID maps...')

  // Category ID map
  const categoryIdMap: Record<string, number> = {}
  for (const [articleSlug, categorySlug] of Object.entries(ARTICLE_TO_CATEGORY_SLUG)) {
    if (!categoryIdMap[categorySlug]) {
      const id = await getCategoryIdBySlug(payload, categorySlug)
      if (id) categoryIdMap[categorySlug] = id
    }
  }
  console.log(`✅ GuideCategories mapped: ${Object.keys(categoryIdMap).length}`)

  // ─── Phase 2: Upsert metadata for all articles ──────────────────────────────

  const ALL_ARTICLES = [
    ...Object.entries(ACCIDENT_ARTICLES).map(([slug, a]) => ({ slug, ...a, kind: 'accident' })),
    ...Object.entries(RESOURCE_ARTICLES).map(([slug, a]) => ({ slug, ...a, kind: 'resource' })),
  ]

  console.log('\n── Phase 1: Upserting article metadata...')

  for (const article of ALL_ARTICLES) {
    const categorySlug = ARTICLE_TO_CATEGORY_SLUG[article.slug]
    const meta = {
      title: article.title,
      slug: article.slug,
      subtitle: article.subtitle,
      excerpt: article.directAnswer.slice(0, 200) + '...',
      author: authorId,
      guideCategory: categoryIdMap[categorySlug] ?? undefined,
      focusKeyword: article.slug.replace(/-/g, ' '),
      metaTitle: article.title,
      metaDescription: article.directAnswer.slice(0, 155),
      schemaType: 'Article',
      _isSeeding: true,
      blocks: [],
    }

    await upsertArticle(payload, article.slug, meta)
    console.log(`  ✅ ${article.slug} — metadata upserted`)
  }

  // ─── Phase 3: Build article ID map ─────────────────────────────────────────

  console.log('\n── Phase 2: Building article ID map...')

  const articleIdMap: Record<string, number> = {}
  for (const article of ALL_ARTICLES) {
    const id = await getArticleIdBySlug(payload, article.slug)
    if (id) {
      articleIdMap[article.slug] = id
    } else {
      console.warn(`  ⚠️  Article not found: ${article.slug}`)
    }
  }
  console.log(`✅ Articles mapped: ${Object.keys(articleIdMap).length}`)

  // ─── Phase 4: Upsert blocks for all articles ─────────────────────────────────

  console.log('\n── Phase 3: Upserting blocks for all articles...')

  for (const article of ALL_ARTICLES) {
    const id = articleIdMap[article.slug]
    if (!id) continue

    const blocks: any[] = []

    // 1. articleDirectAnswer
    blocks.push(makeDirectAnswer(article.subtitle, article.directAnswer, authorId))

    // 2. articleKeyTakeaways
    blocks.push(makeKeyTakeaways(article.keyFacts))

    // 3. articleFAQ
    blocks.push(makeFAQ(article.faqs))

    // 4. articleProseContent
    blocks.push(makeProseContent(article.sections))

    // 5. articleSources
    const sourceData = SOURCES_DATA[article.slug]
    if (sourceData) {
      blocks.push(makeSources(sourceData.citeTitle, sourceData.sources))
    }

    // 6. articleRelatedGuides (needs numeric IDs)
    const relatedSlugs = RELATED_ARTICLE_SLUGS[article.slug] ?? []
    const relatedIds = relatedSlugs.map((s) => articleIdMap[s]).filter(Boolean) as number[]
    if (relatedIds.length > 0) {
      blocks.push(makeRelatedGuides(relatedIds))
    }

    // 7. articleExpert
    const expertData = EXPERT_DATA[article.slug]
    if (expertData) {
      blocks.push(makeExpert(expertData.reviewerName, expertData.credentials, expertData.quote))
    }

    await payload.update({
      collection: 'guideArticles',
      id: id,
      data: { blocks, _isSeeding: true },
    })

    console.log(`  ✅ ${article.slug} — ${blocks.length} blocks`)
  }

  // ─── Summary ────────────────────────────────────────────────────────────────

  console.log('\n── Seeding Complete ──')
  console.log(`Total articles seeded: ${ALL_ARTICLES.length}`)
  console.log(`  Accident pillar articles: ${Object.keys(ACCIDENT_ARTICLES).length}`)
  console.log(`  Resource pillar articles: ${Object.keys(RESOURCE_ARTICLES).length}`)

  // Final verification
  const allArticles = await payload.find({ collection: 'guideArticles', limit: 100 })
  console.log(`\nTotal articles in Payload: ${allArticles.totalDocs}`)
  for (const doc of allArticles.docs) {
    console.log(`  ${doc.slug}: ${(doc.blocks as any[])?.length ?? 0} blocks`)
  }
}

run().catch(console.error)
