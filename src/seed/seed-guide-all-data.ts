/**
 * Comprehensive seed — all pillar categories + spoke articles.
 * Run: npx tsx seed-guide-all-data.ts
 *
 * Covers every pillar and spoke from the static /guide data system,
 * ready to seed into guideNewCategories + guideNew for production.
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'

// ─── Block factory helpers ─────────────────────────────────────────────────────

const makeDirectAnswer = (heading: string, text: string, authorId: number) => ({
  blockType: 'articleDirectAnswer',
  heading,
  text,
  author: authorId,
})

const makeKeyTakeaways = (facts: string[]) => ({
  blockType: 'articleKeyTakeaways',
  items: facts.map((f) => ({ fact: f })),
})

const makeFAQ = (items: { q: string; a: string }[]) => ({
  blockType: 'articleFAQ',
  items: items.map((i) => ({ question: i.q, answerText: i.a })),
})

const makeSources = (citeTitle: string, sources: { name: string; url: string }[]) => ({
  blockType: 'articleSources',
  citeTitle,
  sources,
})

const makeCTA = (title: string, subtitle: string) => ({
  blockType: 'articleCTA',
  title,
  subtitle,
  buttonLabel: 'Get Free Case Review',
})

const makeExpert = (quote: string, name: string, creds: string) => ({
  blockType: 'articleExpert',
  quote,
  reviewerName: name,
  credentials: creds,
})

// ─── Shared articles per spoke ────────────────────────────────────────────────

const ATTORNEY = 'J.M.'
const ATTORNEY_CREDENTIALS = 'Personal Injury Attorney (20+ years)'
const ATTORNEY_BARRED = 'Barred in California, Texas, and New York'
const SOURCES_BASE = [
  { name: 'National Highway Traffic Safety Administration (NHTSA)', url: 'https://www.nhtsa.gov' },
  { name: 'Insurance Research Council', url: 'https://www.insurance.org' },
  {
    name: 'American Bar Association — Motor Vehicle Accidents',
    url: 'https://www.americanbar.org',
  },
]

// ─── Spoke generators per accident type ───────────────────────────────────────

function whatToDoBlocks(authorId: number) {
  const data = {
    'car-accident': {
      heading: 'What you need to know after a car accident',
      text: "After a car accident, call 911 and get medical care even if you feel fine. Document the scene with photos, exchange insurance information, and avoid giving recorded statements to any insurer before consulting a personal injury attorney. Car accident settlements average $15,000 to $100,000+ depending on injury severity, liability clarity, and your state's negligence rule.",
      steps: [
        {
          stepName: 'Check for Injuries',
          stepDescription:
            'Ensure everyone is safe. Call 911 if anyone needs medical attention — and request police even for minor accidents.',
        },
        {
          stepName: 'Move to Safety',
          stepDescription:
            'If it is safe to do so, move vehicles out of active traffic to prevent a second collision.',
        },
        {
          stepName: 'Document Everything',
          stepDescription:
            'Photograph vehicle damage, the scene, road conditions, traffic signals, skid marks, and your injuries from multiple angles.',
        },
        {
          stepName: 'Collect Information',
          stepDescription:
            "Get names, phone numbers, and insurance details from all parties — and the other driver's license plate.",
        },
        {
          stepName: 'Get Witness Statements',
          stepDescription:
            'Ask witnesses for contact information and a brief account of what they saw while memory is fresh.',
        },
        {
          stepName: 'Report to Police',
          stepDescription:
            'File a police report and record the report number. Then contact a representative within 24 hours.',
        },
      ],
      facts: [
        'Call 911 & get a report — The police report anchors the entire claim.',
        "Document everything — Photos, video, witnesses, and the other party's info.",
        'Guard your words — No fault admissions, no recorded statement to the insurer.',
        'Act within 72 hours — Surveillance footage is often overwritten by then.',
      ],
    },
    'truck-accident': {
      heading: 'What you need to know after a truck accident',
      text: 'Truck accidents cause severe injuries and involve federal trucking regulations, multiple insurance policies, and black box data. Preserve evidence immediately, avoid recorded statements to any insurer, and consult a personal injury attorney who understands federal trucking law. Average truck accident settlements range from $75,000 to $500,000+ due to higher damages and insurance limits.',
      steps: [
        {
          stepName: 'Call 911 & Get Medical Help',
          stepDescription:
            'Truck accidents cause severe injuries. Request emergency medical care and police at the scene.',
        },
        {
          stepName: 'Document the Scene',
          stepDescription:
            "Photograph all vehicles, cargo, skid marks, road conditions, and your injuries. Capture the truck's DOT number and carrier info.",
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
      facts: [
        'Federal trucking regulations create additional liability exposure.',
        'Black box data can prove driver fatigue or negligence — preserve it immediately.',
        'Multiple insurance policies may apply — increasing available recovery.',
        'Trucking companies send investigators to the scene — protect your rights first.',
      ],
    },
    'motorcycle-accident': {
      heading: 'What you need to know after a motorcycle accident',
      text: "Motorcycle accidents result in severe injuries at 28 times the rate of car accidents. Get medical care immediately — even minor motorcycle accidents can cause serious injuries. Document the scene carefully, overcome bias by proving the other driver's fault, and avoid recorded statements until you understand your rights. Average settlements range from $50,000 to $300,000+.",
      steps: [
        {
          stepName: 'Get Medical Care',
          stepDescription:
            'Motorcycle injuries are often catastrophic. Seek emergency medical care immediately, even if you feel fine.',
        },
        {
          stepName: 'Document the Scene',
          stepDescription:
            'Photograph vehicle damage, the road, skid marks, traffic signals, and your injuries from multiple angles.',
        },
        {
          stepName: 'Identify the Other Driver',
          stepDescription:
            "Get the other driver's license, insurance, and vehicle registration. Note any violations you observed.",
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
      facts: [
        'Motorcycle injuries are catastrophic — comprehensive medical documentation is essential.',
        "Bias against riders is real — clear evidence of the other driver's fault is critical.",
        'Head and spinal injuries make these claims high-value despite the small vehicles involved.',
        'Surveillance footage is often overwritten within 72 hours — act immediately.',
      ],
    },
    'pedestrian-accident': {
      heading: 'What you need to know after a pedestrian accident',
      text: 'Pedestrian accidents cause severe injuries because pedestrians have no protection from vehicles. Get immediate medical care, document the scene thoroughly, and preserve surveillance footage from nearby cameras. Vulnerable road user protections in many jurisdictions strengthen your claim. Average settlements range from $50,000 to $400,000+.',
      steps: [
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
            "Get the driver's license, insurance, and vehicle plate. Note the driver\'s behavior at the scene.",
        },
        {
          stepName: 'Preserve Surveillance Footage',
          stepDescription:
            'Nearby cameras may have captured the accident. Request preservation immediately before overwrite.',
        },
        {
          stepName: 'Collect Witness Information',
          stepDescription:
            'Get names and contact details from all witnesses who saw the collision.',
        },
        {
          stepName: 'Consult an Attorney',
          stepDescription:
            'Pedestrian accidents often involve clear liability — an attorney maximizes your recovery.',
        },
      ],
      facts: [
        'Pedestrians have no protection — injuries are almost always severe.',
        'Vulnerable road user standards in many states strengthen your claim.',
        'Surveillance footage from nearby cameras is often available and critical.',
        '70%+ of pedestrian accidents involve clear driver fault.',
      ],
    },
    'bicycle-accident': {
      heading: 'What you need to know after a bicycle accident',
      text: 'Bicycle accidents cause severe injuries because riders have no vehicle protection. Get medical care immediately, document the scene and vehicle damage, preserve surveillance footage, and collect witness contacts. Driver negligence — not cyclist error — causes most collisions. Average settlements range from $30,000 to $250,000+.',
      steps: [
        {
          stepName: 'Get Medical Care',
          stepDescription:
            'Bicycle injuries are often catastrophic — traumatic brain injury, spinal damage, fractures. Seek immediate care.',
        },
        {
          stepName: 'Document the Scene',
          stepDescription:
            'Photograph the vehicle damage, bike, road markings, traffic signals, and your injuries.',
        },
        {
          stepName: 'Identify the Driver',
          stepDescription:
            "Get the driver's license, insurance, and vehicle plate. Note what the driver did before impact.",
        },
        {
          stepName: 'Preserve the Bicycle',
          stepDescription:
            'Do not repair the bike — its damage pattern proves how the collision occurred.',
        },
        {
          stepName: 'Collect Witnesses',
          stepDescription:
            'Witnesses can counter the driver\'s narrative that the cyclist "came out of nowhere."',
        },
        {
          stepName: 'Consult an Attorney',
          stepDescription:
            "A lawyer who understands bicycle claims proves the driver's fault and maximizes recovery.",
        },
      ],
      facts: [
        'Most bike collisions are caused by driver negligence — failing to yield, dooring, right hooks.',
        'Vulnerable road user laws hold drivers to a heightened duty around cyclists.',
        'Not wearing a helmet does not bar your recovery in most states.',
        'Surveillance footage is critical and overwritten within 72 hours.',
      ],
    },
    'rideshare-accident': {
      heading: 'What you need to know after a rideshare accident',
      text: "Rideshare accidents involve complex liability — the driver, Uber or Lyft, and possibly other parties. The rideshare company's insurance may apply if the driver was transporting a passenger. Preserve app records and GPS data immediately, and consult an attorney who understands rideshare liability. Average settlements range from $30,000 to $200,000+.",
      steps: [
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
      facts: [
        'Rideshare insurance may cover accidents during active rides — up to $1M+ in liability limits.',
        "The driver's app status at the time of the crash determines which insurance applies.",
        'GPS and app records are critical evidence — preserve them immediately.',
        'Multiple parties may be liable — the driver, Uber/Lyft, and other drivers.',
      ],
    },
    'slip-and-fall': {
      heading: 'What you need to know after a slip and fall',
      text: 'Slip and fall claims require proving the property owner knew or should have known about the unsafe condition. Document the hazard immediately with photos, preserve surveillance footage from the premises, and get medical care for your injuries. Property owners often dispute liability — early evidence is critical. Average settlements range from $10,000 to $100,000+.',
      steps: [
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
            'Notify the property owner or manager immediately. Get a copy of any incident report they create.',
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
      facts: [
        'Property owners must maintain safe conditions and warn of known hazards.',
        'Proving the owner knew or should have known about the hazard is critical.',
        'Photographs of the exact hazard are the most powerful evidence.',
        'Maintenance and inspection records can prove constructive notice.',
      ],
    },
    'dog-bite': {
      heading: 'What you need to know after a dog bite',
      text: "Dog bite injuries require immediate medical care — infections are common and serious. Document your injuries with photos, get the dog owner's information, and report the incident to animal control. Most states apply strict liability for dog bites. Dog bite injuries often require multiple surgeries and cause permanent scarring and psychological trauma. Average settlements range from $15,000 to $100,000+.",
      steps: [
        {
          stepName: 'Get Medical Care',
          stepDescription:
            'Dog bites cause serious infections and require immediate medical treatment. Clean wounds thoroughly and seek care.',
        },
        {
          stepName: 'Identify the Dog & Owner',
          stepDescription:
            "Get the owner's name, address, and dog's vaccination records. Note the dog's behavior.",
        },
        {
          stepName: 'Report to Animal Control',
          stepDescription:
            'Report the bite to local animal control. This creates an official record of the incident.',
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
      facts: [
        'Most states apply strict liability — the owner is liable even without prior aggression.',
        'Dog bites cause serious infections and require immediate medical treatment.',
        'Injuries often require multiple surgeries and cause permanent scarring.',
        'Psychological trauma — fear of dogs, anxiety, PTSD — is a valid claim component.',
      ],
    },
    'workplace-injury': {
      heading: 'What you need to know after a workplace injury',
      text: "Most workplace injuries are covered by workers' compensation — but third-party claims against negligent parties can recover full damages including pain and suffering. Report your injury to your employer immediately and in writing. Preserve evidence of the defective equipment, unsafe conditions, or negligent driver that caused your injury. Average third-party settlements range from $50,000 to $500,000+.",
      steps: [
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
            'Defective equipment, maintenance records, and surveillance footage are critical. Preserve everything.',
        },
        {
          stepName: 'Consult an Attorney',
          stepDescription:
            "Workers' comp and third-party claims require different strategies. An attorney coordinates both.",
        },
      ],
      facts: [
        "Workers' comp covers medical bills and partial wages — but no pain and suffering.",
        'A third-party claim can recover full damages, including pain and suffering.',
        'Common third parties: equipment manufacturers, subcontractors, property owners.',
        "Workers' comp deadlines are strict — report your injury immediately and in writing.",
      ],
    },
    'wrongful-death': {
      heading: 'What you need to know after a wrongful death',
      text: "A wrongful death occurs when someone dies due to another party's negligence. If you have lost a loved one, consult an attorney immediately — statutes of limitations apply and evidence must be preserved. Damages include lost income, funeral expenses, and pain and suffering of surviving family members. Average settlements range from $100,000 to $1,000,000+.",
      steps: [
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
      facts: [
        'Wrongful death allows family members to recover for lost income, funeral expenses, and suffering.',
        "The deceased's age and earning potential are primary factors in settlement value.",
        "Early legal action preserves evidence and protects the family's interests.",
        'Punitive damages may be available if the conduct was egregious.',
      ],
    },
  }

  const key = Object.keys(data)[0] // fallback to car-accident for types not yet mapped
  const d = data[key as keyof typeof data] || data['car-accident']

  return [
    makeDirectAnswer(d.heading, d.text, authorId),
    makeKeyTakeaways(d.facts),
    {
      blockType: 'articleTimelineSteps',
      heading: `The first hour after a ${key.replace('-', ' ')} — step by step`,
      steps: d.steps,
      note: 'If anyone is seriously hurt, call 911 first. This is general guidance, not legal or medical advice.',
    },
    makeFAQ([
      {
        q: `What is the first thing to do after a ${key.replace('-', ' ')}?`,
        a: 'Ensure everyone is safe and call 911 — request police even for a minor incident. The official report is the single most important document in your claim.',
      },
      {
        q: `Should I see a doctor after a ${key.replace('-', ' ')} even if I feel fine?`,
        a: 'Yes. Adrenaline masks injuries, and some conditions take hours or days to appear. A same-day medical record also connects your injuries to the event, which protects a claim.',
      },
      {
        q: `What should I not do after a ${key.replace('-', ' ')}?`,
        a: "Do not admit fault, apologize, or say you are fine; do not give the other side's insurer a recorded statement; and do not accept a quick settlement before you know the full extent of your injuries.",
      },
    ]),
    makeSources(`What To Do After a ${key.replace('-', ' ')}: Complete Guide`, SOURCES_BASE),
    makeExpert(
      "The first 72 hours after an accident are critical. What you do — or don't do — during that window can dramatically affect the outcome of your claim.",
      ATTORNEY,
      ATTORNEY_CREDENTIALS,
    ),
    makeCTA(
      `Just Had a ${key.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}?`,
      'See a doctor first. Then get a free, confidential case review to protect your rights — at no cost.',
    ),
  ]
}

function settlementBlocks(authorId: number) {
  return [
    makeDirectAnswer(
      'How settlements are calculated',
      "There is no flat settlement figure — value is driven by injury severity, clear liability, and your state's negligence rule. Adjusters multiply economic damages by roughly 1.5x–5x for severity, then your state's fault rule adjusts the result. First offers commonly arrive 40–60% below real value.",
      authorId,
    ),
    makeKeyTakeaways([
      'Severity drives value — Minor strains and catastrophic injuries are worlds apart.',
      'The multiplier method — Economic damages × 1.5x–5x estimates pain and suffering.',
      "Your state's rule applies — Fault reduces — or in some states bars — recovery.",
      'Net ≠ gross — Fees and liens come out; use the calculator below.',
    ]),
    makeFAQ([
      {
        q: 'How much is the average settlement?',
        a: 'There is no reliable "average" because value depends on severity, liability, and state law. Minor injuries may settle in the low five figures; severe and catastrophic cases reach six and seven figures.',
      },
      {
        q: 'How is a settlement calculated?',
        a: "Adjusters total economic damages (medical bills, lost wages) and multiply by roughly 1.5x to 5x based on severity. Your state's negligence rule is then applied.",
      },
      {
        q: 'Why is the first settlement offer so low?',
        a: 'Insurers expect negotiation, so first offers commonly come in 40–60% below real value. Accepting ends the claim permanently.',
      },
    ]),
    makeSources('Settlement Guide', SOURCES_BASE),
    makeExpert(
      'First offers are designed to test whether you know what your claim is worth. Never accept the first offer without understanding the full value of your case.',
      ATTORNEY,
      ATTORNEY_CREDENTIALS,
    ),
    makeCTA(
      'What Is Your Claim Worth?',
      'No one can value a claim without the records. Get a free, confidential review to find out.',
    ),
  ]
}

function doINeedLawyerBlocks(authorId: number) {
  return [
    makeDirectAnswer(
      'An honest answer about needing a lawyer',
      "You are not required to hire a lawyer, but representation usually increases outcomes when injuries are serious, liability is disputed, or your state's fault rule is harsh. Because personal-injury lawyers work on contingency (no upfront cost, no fee unless they win), a free consultation lets you find out where your case stands at no risk.",
      authorId,
    ),
    makeKeyTakeaways([
      'Serious or lasting injury — Representation strongly recommended.',
      'Disputed liability — A lawyer protects you from a shifted-fault denial.',
      'Contingency = no upfront cost — You pay a fee only from a recovery.',
      'Free to ask — A consultation costs nothing and carries no obligation.',
    ]),
    {
      blockType: 'articleProseContent',
      sections: [
        {
          heading: 'When you likely do',
          body: 'Representation tends to pay for itself when injuries are serious or lasting, when liability is disputed, when multiple parties or insurers are involved, or when you are in a harsh-fault state. Studies consistently show represented claimants net more even after fees, because insurers value unrepresented claims lower and use tactics that counsel neutralizes.',
        },
        {
          heading: 'When you might not',
          body: 'For a truly minor incident with no injuries, a clear-liability property-damage-only claim, and a fair early offer, you may be able to handle it yourself. The honest test: if there is any injury, any treatment, or any fault dispute, a free consultation costs nothing and clarifies the stakes.',
        },
        {
          heading: 'It costs nothing to ask',
          body: 'Personal-injury lawyers work on contingency — no upfront fee, and no attorney fee unless they recover for you. A consultation is free and carries no obligation.',
        },
      ],
    },
    makeFAQ([
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
    makeSources('Do I Need a Lawyer Guide', SOURCES_BASE),
    makeExpert(
      'The statistic that claimants with attorney representation recover 3.5x more than those without is one of the most consistent findings in personal injury law.',
      ATTORNEY,
      ATTORNEY_CREDENTIALS,
    ),
    makeCTA(
      'Not Sure If You Need a Lawyer?',
      'Find out in minutes. A free, confidential case review tells you exactly where your claim stands.',
    ),
  ]
}

function statuteBlocks(authorId: number) {
  return [
    makeDirectAnswer(
      'Your filing deadline',
      'The deadline to file — the statute of limitations — is set by each state and typically runs 1 to 6 years from the date of injury (most commonly 2–3). Miss it and your claim is permanently barred, no matter how strong. But evidence disappears far sooner: surveillance footage within 72 hours, witness memory within weeks.',
      authorId,
    ),
    makeKeyTakeaways([
      '1–6 years by state — Most are 2–3 years from the date of injury.',
      'Hard cutoff — Miss it and the claim is barred permanently.',
      'Evidence expires first — Footage and witnesses fade within days to weeks.',
      'Government claims differ — Short notice windows — sometimes months.',
    ]),
    makeFAQ([
      {
        q: 'How long do I have to file?',
        a: 'It depends on your state — typically 1 to 6 years from the date of injury, most commonly 2 to 3. The deadline is a hard cutoff: miss it and the claim is permanently barred.',
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
    makeSources('Statute of Limitations Guide', SOURCES_BASE),
    makeExpert(
      'I have seen clients lose claims worth hundreds of thousands of dollars because they waited too long to act. The statute of limitations is not a suggestion — it is a wall.',
      ATTORNEY,
      ATTORNEY_CREDENTIALS,
    ),
    makeCTA(
      'Worried About Your Filing Deadline?',
      "Don't risk it. A free, confidential case review confirms your deadline and what to do now.",
    ),
  ]
}

// ─── Category + spokes registry ───────────────────────────────────────────────

const PILLARS = [
  {
    slug: 'car-accidents',
    dataKey: 'car-accident',
    title: 'Car Accidents',
    heroTitle: 'Your Complete Guide to Car Accident Claims',
    heroSubtitle:
      'From the first 72 hours after your accident to the moment you receive your settlement — everything you need to know.',
    metaTitle: 'Car Accident Claims Guide | Car Accident Settlement Help',
    metaDescription:
      'Complete guide to car accident claims: settlements, deadlines, attorney selection, and what your claim is really worth.',
  },
  {
    slug: 'truck-accidents',
    dataKey: 'truck-accident',
    title: 'Truck Accidents',
    heroTitle: 'Truck Accident Claims: Why These Cases Are Worth More',
    heroSubtitle:
      'Federal regulations, black box data, and higher insurance limits — what you need to know after a truck accident.',
    metaTitle: 'Truck Accident Claims Guide | Settlements & Legal Help',
    metaDescription:
      'Complete guide to truck accident claims: higher settlements, federal trucking regulations, and why truck cases are worth more.',
  },
  {
    slug: 'motorcycle-accidents',
    dataKey: 'motorcycle-accident',
    title: 'Motorcycle Accidents',
    heroTitle: 'Motorcycle Accident Claims: Overcoming Bias and Maximizing Recovery',
    heroSubtitle:
      'Severe injuries, insurance bias, and clear liability — what every motorcyclist needs to know after a crash.',
    metaTitle: 'Motorcycle Accident Claims Guide | Settlements & Legal Help',
    metaDescription:
      'Complete guide to motorcycle accident claims: overcoming bias, proving liability, and maximizing your recovery.',
  },
  {
    slug: 'pedestrian-accidents',
    dataKey: 'pedestrian-accident',
    title: 'Pedestrian Accidents',
    heroTitle: 'Pedestrian Accident Claims: Vulnerable Road User Protection',
    heroSubtitle:
      'Clear liability, severe injuries, and vulnerable road user protections — what you need to know after a pedestrian accident.',
    metaTitle: 'Pedestrian Accident Claims Guide | Settlements & Legal Help',
    metaDescription:
      'Complete guide to pedestrian accident claims: liability, vulnerable road user protections, and settlements.',
  },
  {
    slug: 'bicycle-accidents',
    dataKey: 'bicycle-accident',
    title: 'Bicycle Accidents',
    heroTitle: 'Bicycle Accident Claims: Protecting Vulnerable Riders',
    heroSubtitle:
      'Severe injuries, driver negligence, and vulnerable road user protections — what every cyclist needs to know.',
    metaTitle: 'Bicycle Accident Claims Guide | Settlements & Legal Help',
    metaDescription:
      'Complete guide to bicycle accident claims: proving driver fault, vulnerable road user laws, and settlements.',
  },
  {
    slug: 'rideshare-accidents',
    dataKey: 'rideshare-accident',
    title: 'Rideshare Accidents',
    heroTitle: 'Rideshare Accident Claims: Navigating Complex Liability',
    heroSubtitle:
      'Uber, Lyft, and complex liability — what you need to know after a rideshare accident.',
    metaTitle: 'Rideshare Accident Claims Guide | Uber & Lyft Settlements',
    metaDescription:
      'Complete guide to rideshare accident claims: complex liability, insurance coverage, and settlements.',
  },
  {
    slug: 'slip-and-fall',
    dataKey: 'slip-and-fall',
    title: 'Slip & Fall',
    heroTitle: 'Slip and Fall Claims: Proving Premises Liability',
    heroSubtitle:
      'Property owner negligence, evidence preservation, and what it takes to win a slip and fall claim.',
    metaTitle: 'Slip and Fall Claims Guide | Premises Liability Help',
    metaDescription:
      'Complete guide to slip and fall claims: proving premises liability, evidence preservation, and settlements.',
  },
  {
    slug: 'dog-bites',
    dataKey: 'dog-bite',
    title: 'Dog Bites',
    heroTitle: 'Dog Bite Claims: Holding Negligent Dog Owners Accountable',
    heroSubtitle:
      'Strict liability, severe injuries, and permanent scarring — what you need to know after a dog bite.',
    metaTitle: 'Dog Bite Claims Guide | Settlements & Legal Help',
    metaDescription:
      'Complete guide to dog bite claims: strict liability, injury documentation, and settlements.',
  },
  {
    slug: 'workplace-injuries',
    dataKey: 'workplace-injury',
    title: 'Workplace Injuries',
    heroTitle: "Workplace Injury Claims: Beyond Workers' Compensation",
    heroSubtitle: "Third-party claims, full damages, and why workers' comp is only half the story.",
    metaTitle: 'Workplace Injury Claims Guide | Third-Party & Workers Comp',
    metaDescription:
      "Complete guide to workplace injury claims: workers' comp limits, third-party claims, and full damages.",
  },
  {
    slug: 'wrongful-death',
    dataKey: 'wrongful-death',
    title: 'Wrongful Death',
    heroTitle: 'Wrongful Death Claims: Seeking Justice and Maximum Recovery',
    heroSubtitle:
      'When negligence takes a life — seeking justice and maximum recovery for your family.',
    metaTitle: 'Wrongful Death Claims Guide | Family Compensation Help',
    metaDescription:
      'Complete guide to wrongful death claims: damages, filing deadlines, and seeking justice for your family.',
  },
  {
    slug: 'medical-malpractice',
    dataKey: 'medical-malpractice',
    title: 'Medical Malpractice',
    heroTitle: 'Medical Malpractice: Proving Negligence in Healthcare',
    heroSubtitle:
      "When a healthcare provider's negligence causes harm — what counts, what it takes to prove, and why these cases are different.",
    metaTitle: 'Medical Malpractice Claims Guide | Proving Negligence',
    metaDescription:
      'Complete guide to medical malpractice claims: standard of care, expert testimony, and damage caps.',
  },
]

// Spokes that exist on every accident pillar
const SPOKE_DEFS = [
  {
    slug: 'what-to-do-after',
    label: 'What To Do After',
    titlePrefix: 'What To Do After a',
    focusKeywordPrefix: 'what to do after a',
    metaTitleSuffix: '| What To Do Guide',
    metaDescSuffix:
      'Step-by-step guide to the first 72 hours after your accident: medical care, evidence, insurance, and legal deadlines.',
    schemaType: 'HowTo',
    voiceAnswerPrefix: 'After a',
  },
  {
    slug: 'settlement-amounts',
    label: 'Settlement Amounts',
    titlePrefix: '',
    focusKeywordPrefix: '',
    metaTitleSuffix: ' Settlement Amounts | What Claims Are Worth',
    metaDescSuffix:
      'How settlements are calculated: multiplier method, severity ranges, and what reduces your final payout.',
    schemaType: 'GuidePage',
    voiceAnswerPrefix: '',
  },
  {
    slug: 'do-i-need-a-lawyer',
    label: 'Do I Need a Lawyer',
    titlePrefix: 'Do I Need a',
    focusKeywordPrefix: 'do i need a',
    metaTitleSuffix: '| Do I Need a Lawyer Guide',
    metaDescSuffix:
      'When you need a lawyer and when you might not: injury severity, liability disputes, contingency fees, and free consultations.',
    schemaType: 'FAQPage',
    voiceAnswerPrefix: '',
  },
  {
    slug: 'statute-of-limitations',
    label: 'How Long to File',
    titlePrefix: '',
    focusKeywordPrefix: '',
    metaTitleSuffix: ' Statute of Limitations | Filing Deadlines',
    metaDescSuffix:
      'Filing deadlines for claims — typically 1 to 6 years. Missing the deadline permanently bars your claim.',
    schemaType: 'FAQPage',
    voiceAnswerPrefix: '',
  },
]

// ─── Seed logic ────────────────────────────────────────────────────────────────

const run = async () => {
  const payload = await getPayload({ config })

  // ─── Author ─────────────────────────────────────────────────────────────────
  const authorsResult = await payload.find({ collection: 'authors', limit: 1 })
  const author = authorsResult.docs[0]
  if (!author) throw new Error('No author found. Run the main seed first.')
  const authorId = author.id as unknown as number

  // ─── Upsert category ────────────────────────────────────────────────────────
  const upsertCategory = async (pillar: (typeof PILLARS)[0]) => {
    const existing = await payload
      .find({
        collection: 'guideCategories',
        where: { slug: { equals: pillar.slug } },
        limit: 1,
      })
      .then((r) => r.docs[0])

    const data = {
      title: pillar.title,
      slug: pillar.slug,
      dataKey: pillar.dataKey,
      heroTitle: pillar.heroTitle,
      heroSubtitle: pillar.heroSubtitle,
      metaTitle: pillar.metaTitle,
      metaDescription: pillar.metaDescription,
      schemaType: 'GuidePage',
      _isSeeding: true,
    }

    if (existing) {
      await payload.update({
        collection: 'guideCategories',
        id: existing.id,
        data: data as any,
      })
      // eslint-disable-next-line no-console
      console.log(`Updated category: ${pillar.slug}`)
      return existing
    } else {
      const created = await payload.create({
        collection: 'guideCategories',
        data: data as any,
      })
      // eslint-disable-next-line no-console
      console.log(`Created category: ${pillar.slug}`)
      return created
    }
  }

  // ─── Upsert article ─────────────────────────────────────────────────────────
  const upsertArticle = async (data: any) => {
    const existing = await payload
      .find({
        collection: 'guideArticles',
        where: { slug: { equals: data.slug } },
        limit: 1,
      })
      .then((r) => r.docs[0])

    if (existing) {
      await payload.update({
        collection: 'guideArticles',
        id: existing.id,
        data: { ...data, _isSeeding: true } as any,
      })
      // eslint-disable-next-line no-console
      console.log(`  Updated: ${data.slug}`)
    } else {
      await payload.create({
        collection: 'guideArticles',
        data: data as any,
      })
      // eslint-disable-next-line no-console
      console.log(`  Created: ${data.slug}`)
    }
  }

  // ─── Seed each pillar + its spokes ──────────────────────────────────────────
  for (const pillar of PILLARS) {
    // eslint-disable-next-line no-console
    console.log(`\nProcessing: ${pillar.title}`)
    const category = await upsertCategory(pillar)

    for (const spoke of SPOKE_DEFS) {
      const titleSlug = spoke.slug.replace(/-/g, '-')
      const articleSlug = `${pillar.dataKey}-${spoke.slug}`

      // Build spoke-specific content
      const articleTitle = spoke.titlePrefix
        ? `${spoke.titlePrefix} ${pillar.title.replace(/s$/, '')}`
        : `${pillar.title.replace(/s$/, '')} ${spoke.label}`

      const focusKeyword = spoke.focusKeywordPrefix
        ? `${spoke.focusKeywordPrefix} ${pillar.title.replace(/s$/, '').toLowerCase()}`
        : `${pillar.dataKey.replace('-', ' ')} ${spoke.slug.replace(/-/g, ' ')}`.toLowerCase()

      // Select block set
      let blocks: any[]
      if (spoke.slug === 'what-to-do-after') {
        blocks = whatToDoBlocks(authorId)
      } else if (spoke.slug === 'settlement-amounts') {
        blocks = settlementBlocks(authorId)
      } else if (spoke.slug === 'do-i-need-a-lawyer') {
        blocks = doINeedLawyerBlocks(authorId)
      } else if (spoke.slug === 'statute-of-limitations') {
        blocks = statuteBlocks(authorId)
      } else {
        blocks = [
          makeDirectAnswer(
            `${pillar.title} — Key Information`,
            `Everything you need to know about ${pillar.title.toLowerCase()} and how to protect your rights.`,
            authorId,
          ),
          makeKeyTakeaways([
            `Understand your ${pillar.dataKey.replace('-', ' ')} claim.`,
            'Document everything immediately.',
            'Avoid common mistakes that reduce your recovery.',
            'Consult a personal injury attorney for a free case review.',
          ]),
          makeCTA(
            'Get a Free Case Review',
            'Find out what your claim is worth — at no cost, with no obligation.',
          ),
        ]
      }

      await upsertArticle({
        _status: 'published',
        _isSeeding: true,
        title: articleTitle,
        slug: articleSlug,
        author: authorId,
        guideCategory: category.id,
        excerpt: `A complete guide to ${articleTitle.toLowerCase()}: key facts, settlement information, and what you need to know.`,
        subtitle: `What every ${pillar.title.replace(/s$/, '').toLowerCase()} victim needs to know — explained plainly.`,
        focusKeyword,
        secondaryKeywords: [
          { keyword: `${pillar.dataKey.replace('-', ' ')} lawyer` },
          { keyword: `${pillar.dataKey.replace('-', ' ')} settlement` },
        ],
        metaTitle: `${articleTitle} ${spoke.metaTitleSuffix}`,
        metaDescription: `${articleTitle} guide: ${spoke.metaDescSuffix}`,
        schemaType: spoke.schemaType,
        voiceAnswer: spoke.voiceAnswerPrefix
          ? `${spoke.voiceAnswerPrefix} ${pillar.title.replace(/s$/, '').toLowerCase()} ${spoke.label.toLowerCase()}: consult a personal injury attorney.`
          : `For ${pillar.title.toLowerCase()} claims, settlement value depends on injury severity and state law. Consult a personal injury attorney for a free case review.`,
        sgeOptimizedAnswer: `This guide covers ${articleTitle.toLowerCase()}: key facts, legal deadlines, and settlement information for ${pillar.dataKey.replace('-', ' ')} victims.`,
        difficultyLevel: 'beginner',
        freshnessSignal: 'evergreen',
        legalDisclaimer: 'Standard',
        expertReviewer: ATTORNEY,
        expertCredentials: ATTORNEY_BARRED,
        blocks,
      })
    }
  }

  // eslint-disable-next-line no-console
  console.log('\n✅ All pillars and spokes seeded successfully!')
  process.exit(0)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
