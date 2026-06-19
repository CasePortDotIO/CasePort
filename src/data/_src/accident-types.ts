// @ts-nocheck
/* Ported verbatim from source accident-types.js — data fidelity, do not hand-edit. */
/* CasePort /accidents — ACCIDENT TYPE CONTENT
   AEO-optimized long-form for each category. */
import { CP } from "../_cp";

CP.accidentTypes = {
  'car-accident': {
    title: 'Car Accident Claims: Your Complete Guide to Maximum Recovery',
    category: 'Car Accident', icon: 'car', scene: 'Two-lane intersection, post-collision documentation',
    subtitle: 'Expert guidance on car accident claims, settlement values, and your legal rights.',
    directAnswer: "Car accidents are the most common personal injury claims. Average car accident settlements range from $15,000 to $100,000+ depending on injury severity, liability clarity, and your state's negligence rule. In contributory negligence states (VA, MD, DC), even 1% fault eliminates your entire recovery. The first 72 hours after a car accident are critical for evidence preservation and claim value protection.",
    stats: [ {label:'Avg Settlement',value:'$47K'}, {label:'Statute (Years)',value:'2–3'}, {label:'Success Rate',value:'85%+'}, {label:'Time to Resolve',value:'6–12mo'} ],
    keyFacts: [
      'Car accident settlements are calculated using the multiplier method: economic damages × 1.5x to 5x',
      'Insurance adjusters make first offers 40–60% below final value to test your knowledge',
      'Contributory negligence states (VA, MD, DC) bar 100% of recovery if you are found any % at fault',
      'Surveillance footage is overwritten within 72 hours — preserve it immediately',
      'Medical documentation is the primary driver of settlement value'
    ],
    sections: [
      { title:'How Car Accident Settlements Are Calculated', content:[
        'Car accident settlements use the multiplier method. Insurance adjusters calculate your economic damages (medical bills, lost wages, property damage) and multiply by a factor of 1.5x to 5x depending on injury severity. A $30,000 medical bill with a 2.5x multiplier results in a $75,000 settlement offer.',
        'The multiplier depends on injury severity. Minor injuries (soft tissue, full recovery in weeks) receive 1.5x to 2x. Moderate injuries (fractures, ongoing treatment) receive 2x to 3.5x. Severe injuries (permanent disability, chronic pain) receive 3.5x to 5x or higher.',
        "However, your state's negligence rule is applied first. In contributory negligence states, any fault eliminates your entire recovery. In comparative negligence states, your recovery is reduced by your percentage of fault. This is why understanding your state's negligence rule is critical."
      ]},
      { title:'Why First Settlement Offers Are Always Low', content:[
        'Insurance companies expect negotiation. First settlement offers are intentionally low, typically 40–60% below final value. Accepting the first offer means leaving significant money on the table.',
        'Insurance adjusters use psychological tactics to pressure you into accepting low offers: "This is our best offer," "Other claimants accepted less," "You\'ll have to wait 2 years for trial." These are negotiation tactics, not facts.',
        'Do not accept the first offer. Negotiate. If negotiations stall, consider litigation. Juries often award higher verdicts than insurance adjusters offer, especially in clear-liability cases.'
      ]},
      { title:'Evidence Preservation in Car Accidents', content:[
        'Surveillance footage is overwritten within 72 hours. After 72 hours, the footage is gone forever. If an accident occurred on Monday, the surveillance footage from nearby businesses, traffic cameras, and ATMs will be overwritten by Thursday. Contact these businesses immediately and request that they preserve the footage.',
        'Witness information is time-sensitive. Witness memory is most reliable immediately after an incident. Within days, witnesses forget details. Within weeks, they forget the incident entirely. Get names, phone numbers, email addresses, and written statements from all witnesses while memory is fresh.',
        'Physical evidence disappears quickly. Skid marks fade within hours. Debris is cleared by road maintenance crews. Vehicle damage patterns change as vehicles are moved or repaired. Take photographs from multiple angles immediately after the accident.'
      ]},
      { title:'Medical Documentation and Claim Value', content:[
        'Your medical records document your injuries and recovery trajectory. Gaps in treatment allow insurance adjusters to argue that your injuries were minor or resolved quickly. Seek medical attention immediately after the accident, even if you feel fine.',
        'Some injuries (concussions, internal injuries, soft tissue damage) do not appear immediately. Comprehensive medical documentation is the foundation of your claim. Follow your doctor\'s treatment recommendations exactly. Do not skip appointments or treatments.',
        'Insurance adjusters scrutinize medical bills and treatment decisions. They argue that certain treatments were unnecessary, that you recovered too quickly, or that your injuries were minor. Detailed medical records protect your claim from these arguments.'
      ]}
    ]
  },
  'truck-accident': {
    title: 'Truck Accident Claims: Why These Cases Are Worth More',
    category: 'Truck Accident', icon: 'truck', scene: 'Commercial freight collision, federal evidence scene',
    subtitle: 'Truck accident claims involve higher damages, complex liability, and federal regulations.',
    directAnswer: 'Truck accidents result in more severe injuries and higher settlements than car accidents because trucks weigh 20–30 times more than cars. Average truck accident settlements range from $75,000 to $500,000+ depending on injury severity and liability. Truck companies carry higher insurance limits ($1M+) and are held to higher safety standards. Federal trucking regulations create additional liability exposure and evidence for your claim.',
    stats: [ {label:'Avg Settlement',value:'$185K'}, {label:'Injury Severity',value:'High'}, {label:'Insurance Limits',value:'$1M+'}, {label:'Liability',value:'Complex'} ],
    keyFacts: [
      'Truck accidents result in more severe injuries because trucks weigh 20–30 times more than cars',
      'Federal trucking regulations (HOS, maintenance, inspection) create additional liability exposure',
      'Truck companies carry higher insurance limits ($1M+) and are more likely to settle',
      'Black box data from trucks provides objective evidence of speed, braking, and driver behavior',
      'Trucking companies often carry multiple insurance policies, increasing available recovery'
    ],
    sections: [
      { title:'Why Truck Accidents Result in Higher Settlements', content:[
        'Truck accidents result in more severe injuries because trucks weigh 20–30 times more than cars. The physics of collision are simple: heavier vehicles cause more damage. A truck traveling at 55 mph has the same kinetic energy as a car traveling at 200+ mph.',
        'Truck accident injuries are typically catastrophic: multiple fractures, internal injuries, spinal cord damage, traumatic brain injury, amputation, and death. These severe injuries justify higher settlements.',
        'Truck companies carry higher insurance limits ($1M+) and are more likely to settle because they face significant liability exposure. They also employ risk management teams that understand the cost of litigation and jury trials.'
      ]},
      { title:'Federal Trucking Regulations Create Additional Liability', content:[
        'Federal trucking regulations (Hours of Service, vehicle maintenance, driver qualifications, inspection requirements) create additional liability exposure. Violations of these regulations are evidence of negligence.',
        'Hours of Service violations are particularly damaging. Truck drivers are limited to 11 hours of driving per 14-hour work day. Violations indicate driver fatigue, which is a major cause of truck accidents. Logbook data proving HOS violations is powerful evidence.',
        'Vehicle maintenance violations are also damaging. Trucks must be inspected regularly and maintained to federal standards. Brake failures, tire blowouts, and other mechanical failures caused by negligent maintenance are evidence of liability.'
      ]},
      { title:'Black Box Data and Objective Evidence', content:[
        'Modern trucks are equipped with electronic data recorders (black boxes) that record speed, braking, acceleration, and other vehicle data. This data is objective evidence of driver behavior and vehicle condition.',
        'Black box data can prove that the truck driver was speeding, failed to brake, or was distracted. This data is admissible in court and is extremely persuasive to juries.',
        'Trucking companies often try to destroy or hide black box data. Early legal action is critical to preserve this evidence. An attorney can issue a preservation letter to the trucking company requiring that all black box data be preserved.'
      ]},
      { title:'Multiple Insurance Policies Increase Available Recovery', content:[
        'Trucking companies often carry multiple insurance policies: primary liability, excess liability, umbrella coverage, and cargo insurance. Each policy has separate limits, increasing the total available recovery.',
        'A truck accident might have $1M in primary liability, $2M in excess liability, and $5M in umbrella coverage, for a total of $8M in available insurance. Your claim value is limited only by the severity of your injuries and the available insurance.',
        'Insurance companies often fight over which policy applies, but this is their problem, not yours. Your attorney coordinates with all insurers to maximize your recovery.'
      ]}
    ]
  },
  'motorcycle-accident': {
    title: 'Motorcycle Accident Claims: Overcoming Bias and Maximizing Recovery',
    category: 'Motorcycle Accident', icon: 'bike', scene: 'Rider down, intersection left-turn collision',
    subtitle: 'Motorcycle accident claims require overcoming bias and proving liability clearly.',
    directAnswer: 'Motorcycle accidents result in severe injuries and death at rates 28 times higher than car accidents. Average motorcycle accident settlements range from $50,000 to $300,000+ depending on injury severity. Insurance companies and juries often apply bias against motorcycle riders, assuming they were reckless or at fault. Overcoming this bias requires clear evidence of the other party\'s liability and comprehensive medical documentation of your injuries.',
    stats: [ {label:'Avg Settlement',value:'$125K'}, {label:'Injury Severity',value:'Severe'}, {label:'Fatality Rate',value:'28× Higher'}, {label:'Bias Factor',value:'High'} ],
    keyFacts: [
      'Motorcycle accidents result in severe injuries and death at rates 28 times higher than car accidents',
      'Insurance companies and juries apply bias against motorcycle riders, assuming they were reckless',
      'Overcoming bias requires clear evidence of the other party\'s liability',
      'Motorcycle riders have limited protection, resulting in catastrophic injuries',
      'Comprehensive medical documentation is critical to overcome bias'
    ],
    sections: [
      { title:'Understanding Bias Against Motorcycle Riders', content:[
        'Insurance companies and juries often apply bias against motorcycle riders, assuming they were reckless or at fault. This bias is unfair and illegal, but it exists. Overcoming this bias requires clear evidence of the other party\'s liability.',
        'Insurance adjusters use this bias to argue that you were speeding, weaving through traffic, or riding recklessly. They use this narrative to reduce your settlement offer or deny your claim entirely.',
        'Juries also apply this bias. Some jurors believe that motorcycle riders accept the risk of injury by choosing to ride. This bias can reduce jury verdicts significantly.'
      ]},
      { title:'Why Motorcycle Accidents Result in Severe Injuries', content:[
        'Motorcycle riders have no protection from impact. Cars have airbags, crumple zones, and steel frames. Motorcycles have only the rider\'s body. When a motorcycle collides with a car, the rider absorbs all the impact energy.',
        'Motorcycle accident injuries are typically catastrophic: multiple fractures, road rash (severe abrasions), spinal cord damage, traumatic brain injury, amputation, and death. These severe injuries justify higher settlements.',
        'Helmet use reduces head injury risk but does not prevent other injuries. Road rash, fractures, and spinal cord injuries are common even with helmet use.'
      ]},
      { title:'Proving Liability in Motorcycle Accidents', content:[
        'Proving liability in motorcycle accidents requires clear evidence of the other party\'s negligence. Witness testimony, surveillance footage, police reports, and accident reconstruction are critical.',
        'Insurance companies often argue that the motorcycle rider was speeding or weaving through traffic. Objective evidence (surveillance footage, witness testimony, police investigation) is critical to counter these arguments.',
        'Accident reconstruction experts can analyze the accident scene, vehicle damage, and road conditions to determine what happened. This objective analysis overcomes bias and proves liability.'
      ]},
      { title:'Medical Documentation and Overcoming Bias', content:[
        'Comprehensive medical documentation is critical to overcome bias and prove the severity of your injuries. Detailed medical records show the extent of your injuries and the long-term impact on your life.',
        'Insurance companies often argue that motorcycle riders exaggerate their injuries or recover quickly. Detailed medical records counter these arguments and prove the severity of your injuries.',
        'Follow your doctor\'s treatment recommendations exactly. Do not skip appointments or treatments. Gaps in treatment allow insurance adjusters to argue that your injuries were minor.'
      ]}
    ]
  },
  'pedestrian-accident': {
    title: 'Pedestrian Accident Claims: Vulnerable Road User Protection',
    category: 'Pedestrian Accident', icon: 'walk', scene: 'Marked crosswalk, urban arterial road',
    subtitle: 'Pedestrian accident claims often involve clear liability and vulnerable user protections.',
    directAnswer: 'Pedestrian accidents result in severe injuries and death because pedestrians have no protection from vehicle impact. Average pedestrian accident settlements range from $50,000 to $400,000+ depending on injury severity and liability. Many jurisdictions apply different negligence standards to vulnerable road users (pedestrians, cyclists), providing additional protection. Pedestrian accidents are often clear liability cases because drivers have a duty to avoid hitting pedestrians.',
    stats: [ {label:'Avg Settlement',value:'$145K'}, {label:'Injury Severity',value:'Severe'}, {label:'Clear Liability',value:'70%+'}, {label:'Vulnerable User',value:'Protected'} ],
    keyFacts: [
      'Pedestrians have no protection from vehicle impact, resulting in severe injuries',
      'Many jurisdictions apply vulnerable user standards to pedestrians',
      'Drivers have a duty to avoid hitting pedestrians, even if pedestrians are partially at fault',
      'Pedestrian accident liability is often clear because drivers should see and avoid pedestrians',
      'Surveillance footage from nearby businesses and traffic cameras is often available'
    ],
    sections: [
      { title:'Vulnerable User Standards Protect Pedestrians', content:[
        'Many jurisdictions apply vulnerable user standards to pedestrians, cyclists, and motorcyclists. These standards recognize that vulnerable road users deserve additional protection because they have no vehicle protection.',
        'Under vulnerable user standards, drivers must exercise extra care to avoid hitting vulnerable road users. Even if the pedestrian is partially at fault, the driver may still be liable if they failed to exercise reasonable care.',
        'Vulnerable user standards shift the burden of care to drivers. Drivers must anticipate pedestrian behavior and take steps to avoid collision, even if the pedestrian is jaywalking or distracted.'
      ]},
      { title:'Why Pedestrian Accidents Result in Severe Injuries', content:[
        'Pedestrians have no protection from vehicle impact. When a vehicle hits a pedestrian, the pedestrian absorbs all the impact energy. Pedestrian accident injuries are typically catastrophic: multiple fractures, internal injuries, spinal cord damage, traumatic brain injury, and death.',
        'Pedestrian accident injuries depend on vehicle speed. A pedestrian struck at 20 mph has a 90% survival rate. A pedestrian struck at 40 mph has only a 10% survival rate. Speed is the primary factor in pedestrian accident severity.',
        'Pedestrian accident injuries also depend on which part of the body is hit. Head injuries are most severe and often fatal. Leg injuries are common but less severe. Torso injuries often involve internal damage and are frequently fatal.'
      ]},
      { title:'Proving Liability in Pedestrian Accidents', content:[
        'Pedestrian accident liability is often clear because drivers have a duty to avoid hitting pedestrians. Even if the pedestrian is jaywalking or distracted, the driver should see the pedestrian and take steps to avoid collision.',
        'Surveillance footage from nearby businesses, traffic cameras, and ATMs is often available in pedestrian accidents. This footage is objective evidence of what happened and who was at fault.',
        'Witness testimony is also valuable. Pedestrians often have witnesses who saw the accident. These witnesses can testify about the driver\'s speed, attention, and actions immediately before the accident.'
      ]},
      { title:'Medical Documentation and Long-Term Impact', content:[
        'Pedestrian accident injuries often result in permanent disability, chronic pain, and reduced quality of life. Comprehensive medical documentation is critical to prove the long-term impact of your injuries.',
        'Pedestrian accidents often result in multiple surgeries, extended hospitalization, and long-term rehabilitation. These medical records prove the severity of your injuries and justify higher settlements.',
        'Follow your doctor\'s treatment recommendations exactly. Pedestrian accident injuries often require ongoing treatment and rehabilitation. Consistent medical documentation proves the long-term impact of your injuries.'
      ]}
    ]
  },
  'wrongful-death': {
    title: 'Wrongful Death Claims: Seeking Justice and Maximum Recovery',
    category: 'Wrongful Death', icon: 'heart', scene: 'Memorial — family compensation case',
    subtitle: 'Wrongful death claims seek justice and maximum recovery for your family.',
    directAnswer: 'Wrongful death claims allow family members to recover damages when a loved one dies due to another party\'s negligence. Average wrongful death settlements range from $100,000 to $1,000,000+ depending on the deceased\'s age, earning potential, and relationship to the family. Wrongful death claims are emotionally complex but legally straightforward: if negligence caused death, the responsible party is liable for all damages including lost income, funeral expenses, and pain and suffering of surviving family members.',
    stats: [ {label:'Avg Settlement',value:'$350K'}, {label:'High-Value',value:'$1M+'}, {label:'Punitive',value:'Available'}, {label:'Filing Window',value:'2–3yr'} ],
    keyFacts: [
      'Wrongful death claims allow family members to recover damages when a loved one dies due to negligence',
      'Damages include lost income, funeral expenses, and pain and suffering of surviving family members',
      'The deceased\'s age and earning potential are primary factors in settlement value',
      'Wrongful death claims are emotionally complex but legally straightforward',
      'Early legal action is critical to preserve evidence and protect family interests'
    ],
    sections: [
      { title:'What Constitutes Wrongful Death', content:[
        'Wrongful death occurs when a person dies as a result of another party\'s negligence, recklessness, or intentional conduct. The responsible party is liable for all damages resulting from the death.',
        'Wrongful death claims can arise from car accidents, truck accidents, pedestrian accidents, medical malpractice, workplace accidents, and other incidents involving negligence.',
        'To prove wrongful death, you must show that the responsible party owed a duty of care, breached that duty, and the breach caused the death. This is the same standard as proving negligence in any other personal injury case.'
      ]},
      { title:'Who Can File a Wrongful Death Claim', content:[
        'Wrongful death claims are filed by the deceased\'s estate or by surviving family members. The specific family members who can file depend on state law, but typically include spouse, children, and parents.',
        'In some states, only the estate can file a wrongful death claim. In other states, surviving family members can file directly. An attorney can explain the specific rules in your state.',
        'If the deceased had no surviving family members, the claim may be filed by the estate for the benefit of creditors and other parties with financial interests in the estate.'
      ]},
      { title:'Calculating Wrongful Death Damages', content:[
        'Wrongful death damages include economic damages (lost income, lost benefits, funeral expenses) and non-economic damages (pain and suffering of surviving family members, loss of companionship).',
        'Lost income is calculated based on the deceased\'s age, earning potential, and life expectancy. A 35-year-old earning $60,000 per year with 30 years of earning potential has $1.8M in lost income (before discounting for present value).',
        'Non-economic damages depend on the relationship between the deceased and surviving family members. Spouses and minor children typically recover higher non-economic damages than adult children or parents.'
      ]},
      { title:'The Emotional and Legal Process', content:[
        'Wrongful death claims are emotionally complex. Families are grieving while also pursuing legal action. An experienced attorney handles the legal process while allowing families to focus on grief and healing.',
        'The legal process includes investigation, evidence preservation, negotiation, and potentially litigation. Early legal action is critical to preserve evidence and protect family interests.',
        'Settlement negotiations in wrongful death cases are often more complex because multiple family members may have different interests. An attorney ensures that all family members\' interests are protected and that the settlement is fair.'
      ]}
    ]
  },
  'rideshare-accident': {
    title: 'Rideshare Accident Claims: Navigating Complex Liability',
    category: 'Rideshare Accident', icon: 'nav', scene: 'Uber/Lyft collision, app-status evidence',
    subtitle: 'Rideshare accident claims involve complex liability and insurance coverage disputes.',
    directAnswer: 'Rideshare accidents involve complex liability because multiple parties may be responsible: the rideshare driver, the rideshare company, other drivers, and vehicle manufacturers. Average rideshare accident settlements range from $30,000 to $200,000+ depending on injury severity and liability. Rideshare companies carry insurance that covers accidents during rides, but they often dispute coverage and liability. Early legal action is critical to preserve evidence and protect your rights against the rideshare company.',
    stats: [ {label:'Avg Settlement',value:'$85K'}, {label:'Liable Parties',value:'Multiple'}, {label:'Insurance Limits',value:'$1M+'}, {label:'Coverage Disputes',value:'Common'} ],
    keyFacts: [
      'Rideshare accidents involve complex liability because multiple parties may be responsible',
      'Rideshare companies carry insurance that covers accidents during rides',
      'Rideshare companies often dispute coverage and liability to reduce their exposure',
      'The rideshare driver may be personally liable in addition to the rideshare company',
      'Early legal action is critical to preserve evidence and protect your rights'
    ],
    sections: [
      { title:'Understanding Rideshare Liability', content:[
        'Rideshare accidents involve complex liability because multiple parties may be responsible: the rideshare driver, the rideshare company, other drivers, and vehicle manufacturers.',
        'The rideshare driver is responsible for operating the vehicle safely. If the driver was negligent (speeding, distracted driving, reckless driving), the driver is liable for your injuries.',
        'The rideshare company is also liable for the driver\'s negligence under the doctrine of vicarious liability. The rideshare company is responsible for hiring safe drivers and maintaining safe vehicles.'
      ]},
      { title:'Rideshare Insurance Coverage', content:[
        'Rideshare companies carry insurance that covers accidents during rides. The insurance limits are typically $1M+ for bodily injury liability. However, rideshare companies often dispute coverage and liability to reduce their exposure.',
        'Rideshare insurance coverage depends on the driver\'s status at the time of the accident. If the driver was actively transporting a passenger, the rideshare company\'s insurance applies. If the driver was offline or waiting for a ride request, the driver\'s personal insurance applies.',
        'Rideshare companies often argue that the driver was offline or waiting for a ride request to avoid coverage. Early legal action is critical to preserve evidence (GPS data, app records) that proves the driver was actively transporting a passenger.'
      ]},
      { title:'Investigating Rideshare Accidents', content:[
        'Rideshare accidents require investigation into the driver\'s background, training, and history. Rideshare companies are required to conduct background checks and maintain driver records.',
        'Driver records may show prior accidents, traffic violations, or complaints about the driver\'s safety. This evidence shows that the rideshare company knew or should have known that the driver was unsafe.',
        'GPS data, app records, and telematics data from the vehicle can prove the driver\'s location, speed, and actions immediately before the accident. This objective evidence is critical to proving liability.'
      ]},
      { title:'Negotiating with Rideshare Companies', content:[
        'Rideshare companies employ sophisticated legal teams that aggressively defend claims and dispute liability. Negotiating with rideshare companies requires an experienced attorney who understands rideshare liability and insurance.',
        'Rideshare companies often make low settlement offers to test your knowledge and pressure you into accepting less than your claim is worth. Do not accept the first offer. Negotiate.',
        'If negotiations stall, litigation may be necessary. Rideshare companies often settle cases to avoid trial because juries are sympathetic to injured passengers and skeptical of rideshare company defenses.'
      ]}
    ]
  },
  'slip-and-fall': {
    title: 'Slip and Fall Claims: Proving Premises Liability',
    category: 'Slip and Fall', icon: 'alert', scene: 'Wet-floor hazard, commercial premises',
    subtitle: 'Slip and fall claims require proving the property owner\'s negligence.',
    directAnswer: 'Slip and fall claims are premises liability cases where a property owner or manager is responsible for injuries caused by unsafe conditions on their property. Average slip and fall settlements range from $10,000 to $100,000+ depending on injury severity and the property owner\'s negligence. Proving premises liability requires showing that the property owner knew or should have known about the unsafe condition and failed to fix it or warn visitors. Property owners often dispute liability, making early evidence preservation critical.',
    stats: [ {label:'Avg Settlement',value:'$35K'}, {label:'Liability',value:'Premises'}, {label:'Dispute Rate',value:'High'}, {label:'Evidence',value:'Critical'} ],
    keyFacts: [
      'Slip and fall claims are premises liability cases where property owners are responsible for unsafe conditions',
      'Property owners must maintain safe conditions and warn visitors of known hazards',
      'Proving premises liability requires showing the property owner knew or should have known about the unsafe condition',
      'Property owners often dispute liability and argue that the visitor was careless',
      'Early evidence preservation (photographs, witness statements, maintenance records) is critical'
    ],
    sections: [
      { title:'Understanding Premises Liability', content:[
        'Premises liability is the legal doctrine that property owners are responsible for injuries caused by unsafe conditions on their property. Property owners must maintain safe conditions and warn visitors of known hazards.',
        'Property owners have a duty to inspect their property regularly and identify unsafe conditions. They also have a duty to fix unsafe conditions or warn visitors of the hazards.',
        'Property owners are liable for injuries caused by unsafe conditions only if they knew or should have known about the condition. This is called "constructive notice." If a hazard existed for a long time, the property owner should have known about it.'
      ]},
      { title:'Proving the Property Owner Knew or Should Have Known', content:[
        'Proving that the property owner knew or should have known about the unsafe condition is critical to premises liability claims. This requires evidence that the condition existed for a long time or that the property owner should have discovered it through regular inspection.',
        'Maintenance records are critical evidence. If the property owner failed to inspect or maintain the property, this shows constructive notice. Witness testimony about how long the hazard existed is also valuable.',
        'Photographs of the unsafe condition are critical. Take photographs immediately after the accident showing the exact condition that caused your injury. These photographs are objective evidence of the hazard.'
      ]},
      { title:'Common Slip and Fall Hazards', content:[
        'Common slip and fall hazards include wet floors, ice, debris, uneven surfaces, poor lighting, and broken stairs. Each hazard requires different evidence to prove premises liability.',
        'Wet floor hazards require evidence that the property owner failed to dry the floor or warn visitors. Ice hazards require evidence that the property owner failed to salt or sand the surface. Debris hazards require evidence that the property owner failed to clean the property.',
        'Uneven surface and broken stair hazards require evidence that the property owner knew about the condition and failed to fix it. Poor lighting hazards require evidence that the property owner failed to maintain adequate lighting.'
      ]},
      { title:'Property Owner Defenses and How to Counter Them', content:[
        'Property owners often argue that the visitor was careless and should have seen the hazard. This is called "assumption of risk" or "comparative negligence." However, property owners cannot escape liability by arguing that visitors should have been more careful.',
        'Property owners also argue that the hazard was "open and obvious" and therefore they had no duty to warn. However, even obvious hazards require warning if they pose a serious risk of injury.',
        'Property owners may also argue that they did not have constructive notice of the hazard because they inspected the property regularly. However, if the hazard existed for a long time, regular inspection should have discovered it.'
      ]}
    ]
  },
  'dog-bite': {
    title: 'Dog Bite Claims: Holding Negligent Dog Owners Accountable',
    category: 'Dog Bite', icon: 'dog', scene: 'Strict-liability injury, owner negligence case',
    subtitle: 'Dog bite claims hold dog owners accountable for injuries caused by their dogs.',
    directAnswer: 'Dog bite claims hold dog owners responsible for injuries caused by their dogs. Average dog bite settlements range from $15,000 to $100,000+ depending on injury severity and the dog owner\'s negligence. Most states apply strict liability for dog bites, meaning the dog owner is liable even if the dog had no history of aggression. Dog bite injuries often require multiple surgeries, result in permanent scarring, and cause psychological trauma. Early medical documentation and evidence preservation are critical.',
    stats: [ {label:'Avg Settlement',value:'$42K'}, {label:'Strict Liability',value:'35 States'}, {label:'Scarring',value:'Common'}, {label:'Insurance Cover',value:'Usually'} ],
    keyFacts: [
      'Most states apply strict liability for dog bites, meaning the dog owner is liable even if the dog had no history of aggression',
      'Dog bite injuries often require multiple surgeries and result in permanent scarring',
      'Psychological trauma (fear of dogs, anxiety) is a valid claim in dog bite cases',
      'Dog owners have a duty to control their dogs and prevent them from injuring others',
      'Early medical documentation and evidence preservation are critical to maximize recovery'
    ],
    sections: [
      { title:'Strict Liability vs. Negligence in Dog Bite Cases', content:[
        'Most states (35+) apply strict liability for dog bites, meaning the dog owner is liable for injuries caused by their dog even if the dog had no history of aggression and the owner took reasonable precautions.',
        'Strict liability removes the need to prove that the dog owner was negligent. You only need to prove that the dog bit you and caused injury. The dog owner is automatically liable.',
        'A few states apply a "one bite rule" where the dog owner is liable only if they knew the dog was dangerous. However, even in these states, evidence that the dog had previously bitten someone or shown aggression is powerful evidence of liability.'
      ]},
      { title:'Dog Bite Injuries and Medical Treatment', content:[
        'Dog bite injuries range from minor puncture wounds to severe lacerations requiring multiple surgeries. Severe bites often cause permanent scarring, disfigurement, and loss of function.',
        'Dog bite injuries often become infected because dog mouths contain bacteria. Infections can lead to serious complications including sepsis and death. Immediate medical treatment is critical.',
        'Dog bite injuries often require multiple surgeries to repair tissue damage, reduce scarring, and restore function. Plastic surgery may be necessary to minimize visible scarring. These surgeries are expensive and justify higher settlements.'
      ]},
      { title:'Psychological Trauma and Emotional Damages', content:[
        'Dog bite injuries often cause psychological trauma including fear of dogs, anxiety, and post-traumatic stress disorder (PTSD). These psychological injuries are valid claims in dog bite cases.',
        'Children are particularly vulnerable to psychological trauma from dog bites. A child bitten by a dog may develop lifelong fear of dogs and anxiety in situations where dogs are present.',
        'Psychological trauma is documented through mental health treatment records. Therapy, counseling, and psychiatric treatment prove the psychological impact of the dog bite and justify higher settlements.'
      ]},
      { title:'Holding Dog Owners Accountable', content:[
        'Dog owners have a duty to control their dogs and prevent them from injuring others. This includes keeping dogs on leashes, maintaining fences, and preventing dogs from roaming free.',
        'Dog owners who violate local leash laws or allow dogs to roam free are negligent and liable for injuries caused by their dogs. Evidence of leash law violations is powerful evidence of liability.',
        'If the dog owner knew the dog was dangerous and failed to take precautions, this is evidence of recklessness and may justify punitive damages in addition to compensatory damages.'
      ]}
    ]
  },
  'bicycle-accident': {
    title: 'Bicycle Accident Claims: Protecting Vulnerable Riders',
    category: 'Bicycle Accident', icon: 'bike', scene: 'Cyclist down, urban bike-lane collision',
    subtitle: 'Bicycle accident claims hinge on driver negligence and vulnerable-user protections.',
    directAnswer: 'Bicycle accidents cause severe injuries because riders have no protection from a multi-ton vehicle. Average bicycle accident settlements range from $30,000 to $250,000+ depending on injury severity and liability. Most collisions are caused by drivers failing to yield, opening doors into bike lanes, or making right hooks. Many jurisdictions apply vulnerable-road-user standards that hold drivers to a heightened duty of care around cyclists, and a helmet does not bar recovery.',
    stats: [ {label:'Avg Settlement',value:'$95K'}, {label:'Injury Severity',value:'Severe'}, {label:'Driver Fault',value:'70%+'}, {label:'Vulnerable User',value:'Protected'} ],
    keyFacts: [
      'Most bike collisions are caused by drivers failing to yield, "dooring," or right-hook turns',
      'Vulnerable-road-user laws hold drivers to a heightened duty of care around cyclists',
      'Not wearing a helmet does not bar recovery in most states',
      'Head and spinal injuries make bicycle claims high-value despite the small vehicle',
      'Surveillance and traffic-camera footage is critical and overwritten within 72 hours'
    ],
    sections: [
      { title:'Why Drivers Are Usually at Fault in Bicycle Accidents', content:[
        'Most bicycle accidents are caused by driver negligence, not cyclist error. The most common causes are drivers failing to yield at intersections, opening a car door into a bike lane ("dooring"), and making a right turn across a cyclist\'s path (the "right hook").',
        'Drivers frequently claim they "never saw" the cyclist. This is not a defense — it is an admission of inattention. Drivers have a duty to look for and yield to cyclists, who are legal users of the road.',
        'Objective evidence — traffic-camera footage, witness testimony, and the physical damage pattern — usually establishes the driver\'s fault clearly when properly preserved.'
      ]},
      { title:'Vulnerable Road User Protections', content:[
        'Many states and cities apply vulnerable-road-user standards that hold drivers to a heightened duty of care around cyclists, pedestrians, and other unprotected users. Some jurisdictions impose enhanced penalties when a driver injures a vulnerable user.',
        'These standards recognize the vast disparity between a cyclist and a motor vehicle. Even where a cyclist made a minor error, the driver\'s failure to exercise reasonable care can establish liability.',
        'In contributory-negligence jurisdictions, however, cyclist fault can still bar recovery — which makes careful documentation and legal guidance especially important.'
      ]},
      { title:'The Helmet Question', content:[
        'Not wearing a helmet does not bar your recovery in most states. Insurance adjusters will raise it to argue comparative fault, but helmet non-use is generally inadmissible or irrelevant to liability for the collision itself.',
        'For head injuries, an insurer may argue a helmet would have reduced the harm. The strength of that argument varies by state, and medical evidence about the specific injury mechanism usually rebuts it.',
        'Wearing a helmet is always safer — but its absence should never stop an injured cyclist from pursuing a valid claim.'
      ]},
      { title:'Documenting a Bicycle Accident Claim', content:[
        'Bicycle accident injuries are often catastrophic — traumatic brain injury, spinal damage, and multiple fractures — which makes thorough medical documentation essential to capturing the claim\'s full value.',
        'Preserve the bicycle in its damaged condition, photograph the scene and bike-lane markings, and request nearby surveillance footage immediately, before it is overwritten within 72 hours.',
        'Witness statements are especially valuable in bicycle cases because they counter the common driver narrative that the cyclist "came out of nowhere."'
      ]}
    ]
  },
  'drunk-driving-accident': {
    title: 'Drunk Driving Accident Claims: Holding Impaired Drivers Accountable',
    category: 'Drunk Driving Accident', icon: 'alert', scene: 'Late-night impaired-driver collision scene',
    subtitle: 'Drunk driving accident claims often support punitive damages and dram-shop liability.',
    directAnswer: 'Drunk driving accidents are among the clearest liability cases in personal injury law, and they often support punitive damages on top of compensatory damages. Average drunk driving accident settlements range from $75,000 to $500,000+ depending on injury severity. A drunk driver\'s criminal conviction is powerful civil evidence, and many states impose dram-shop liability on the bar or host that over-served the driver — adding a second source of recovery.',
    stats: [ {label:'Avg Settlement',value:'$165K'}, {label:'Punitive Damages',value:'Likely'}, {label:'Liability',value:'Clear'}, {label:'Dram-Shop',value:'Many States'} ],
    keyFacts: [
      'A drunk driver\'s criminal conviction is strong evidence of civil liability',
      'Punitive damages are frequently available because impaired driving is reckless',
      'Dram-shop laws can hold a bar or host liable for over-serving the driver',
      'A second defendant (the establishment) often means more available insurance',
      'Victim-side claims should be coordinated with the criminal case timeline'
    ],
    sections: [
      { title:'Why Drunk Driving Cases Have Clear Liability', content:[
        'Drunk driving accidents are among the clearest liability cases in personal injury law. Driving while impaired is negligence per se — the violation of a safety law that, by itself, establishes the driver\'s fault.',
        'A criminal DUI conviction is powerful evidence in your civil case. While the criminal and civil cases are separate, the conviction strongly supports the civil claim and often pressures the insurer to settle.',
        'Even without a conviction, evidence of impairment — field sobriety results, BAC readings, and witness observations — establishes liability in the civil claim, which has a lower burden of proof than the criminal case.'
      ]},
      { title:'Punitive Damages in Drunk Driving Cases', content:[
        'Punitive damages are frequently available in drunk driving cases because impaired driving is considered reckless or wanton conduct — not mere negligence. Punitive damages punish the driver and deter similar conduct.',
        'Unlike compensatory damages, which reimburse your losses, punitive damages can substantially increase the total recovery. Many states cap punitive damages, but drunk driving is one of the strongest fact patterns for awarding them.',
        'The availability and size of punitive damages depend on your state\'s law and the egregiousness of the conduct, such as an extremely high BAC or a repeat offense.'
      ]},
      { title:'Dram-Shop and Social-Host Liability', content:[
        'Many states impose dram-shop liability on bars, restaurants, and sometimes social hosts that serve alcohol to a visibly intoxicated person or a minor who then causes a crash. This creates a second defendant — and a second insurance policy.',
        'Dram-shop claims require evidence that the establishment over-served: server testimony, receipts showing the number of drinks, and surveillance footage. This evidence must be preserved quickly.',
        'A commercial establishment typically carries far higher insurance limits than an individual driver, which can be decisive when the driver is underinsured.'
      ]},
      { title:'Coordinating With the Criminal Case', content:[
        'A drunk driving crash usually generates a parallel criminal prosecution. Your civil claim should be coordinated with that timeline — the criminal case can produce evidence (BAC, police findings) useful to the civil claim.',
        'You do not need to wait for the criminal case to conclude to pursue your civil claim, but the statute of limitations on the civil side runs independently and must be protected.',
        'Restitution ordered in the criminal case is separate from, and usually far smaller than, the compensation available through a civil claim.'
      ]}
    ]
  },
  'hit-and-run': {
    title: 'Hit and Run Accident Claims: Recovering When the Driver Flees',
    category: 'Hit and Run', icon: 'car', scene: 'Fled-scene collision, uninsured-motorist case',
    subtitle: 'Hit and run claims turn on uninsured-motorist coverage and fast evidence work.',
    directAnswer: 'You can still recover after a hit and run even if the driver is never found, primarily through your own uninsured-motorist (UM) coverage. Average hit and run settlements range from $25,000 to $200,000+ depending on injury severity and available coverage. The keys are reporting the crash to police immediately, preserving every shred of evidence, and filing a UM claim with your own insurer — which then steps into the role of the absent at-fault driver.',
    stats: [ {label:'Avg Settlement',value:'$75K'}, {label:'Recovery Path',value:'UM Coverage'}, {label:'Report Window',value:'24 hrs'}, {label:'Driver Found',value:'Often Not'} ],
    keyFacts: [
      'Uninsured-motorist (UM) coverage usually pays even when the driver is never identified',
      'Report the crash to police immediately — UM claims often require a prompt report',
      'Surveillance and traffic-camera footage is the best chance to identify the driver',
      'Your own insurer becomes the adversary in a UM claim and will still minimize it',
      'Anxious searchers convert quickly — speed and documentation are everything'
    ],
    sections: [
      { title:'How You Recover When the Driver Flees', content:[
        'The most common path to recovery after a hit and run is your own uninsured-motorist (UM) coverage. UM coverage exists precisely for situations where the at-fault driver is unidentified or uninsured.',
        'When you file a UM claim, your own insurer effectively steps into the shoes of the absent driver. You pursue compensation from your policy, up to your UM limits.',
        'This is why reviewing your own coverage immediately matters — many drivers do not realize they carry UM protection that applies even though they did nothing wrong.'
      ]},
      { title:'The Critical First Steps', content:[
        'Report the crash to police immediately. Most UM policies require prompt reporting — often within 24 hours — and a police report is frequently a condition of coverage in hit-and-run claims.',
        'Write down everything you remember about the fleeing vehicle: make, model, color, partial plate, direction of travel, and any distinguishing damage. Even a partial plate can lead to identification.',
        'Canvass for witnesses and request surveillance footage from nearby businesses and traffic cameras immediately — this is the single best chance of identifying the driver before footage is overwritten within 72 hours.'
      ]},
      { title:'Your Own Insurer Is Now the Adversary', content:[
        'In a UM claim, your own insurance company becomes the party trying to minimize your payout. Despite paying your premiums, the insurer will scrutinize your injuries and may dispute that a phantom vehicle caused the crash.',
        'Insurers sometimes argue that a single-vehicle crash was the driver\'s own fault rather than the result of an unidentified vehicle forcing them off the road. Independent evidence — witnesses, road debris, camera footage — rebuts this.',
        'You are entitled to the same careful claim handling against your own insurer as against any other. The "no recorded statement" rules still apply.'
      ]},
      { title:'If the Driver Is Later Identified', content:[
        'If police or your investigation later identify the fleeing driver, you may pursue a claim directly against that driver and their insurer, in addition to or instead of the UM claim.',
        'A driver who fled the scene faces criminal charges, and that flight is itself evidence of consciousness of fault — strengthening the civil claim and sometimes supporting punitive damages.',
        'Acting quickly preserves both paths: the UM claim protects you if the driver is never found, while fast evidence work maximizes the chance the driver is identified.'
      ]}
    ]
  },
  'workplace-injury': {
    title: 'Workplace Injury Claims: Beyond Workers\u2019 Compensation',
    category: 'Workplace Injury', icon: 'bldg', scene: 'Job-site incident, third-party liability case',
    subtitle: 'Workplace injury claims may include third-party liability beyond workers\u2019 comp.',
    directAnswer: 'Most workplace injuries are covered by workers\u2019 compensation, which pays medical bills and partial lost wages regardless of fault — but bars you from suing your employer. The larger recovery often comes from a third-party claim against a negligent party who is not your employer: an equipment manufacturer, a subcontractor, a property owner, or a driver in a work-related crash. Average third-party workplace settlements range from $50,000 to $500,000+ and, unlike workers\u2019 comp, can include full pain-and-suffering damages.',
    stats: [ {label:'Avg Settlement',value:'$120K'}, {label:'Workers\u2019 Comp',value:'No-Fault'}, {label:'Third-Party',value:'Full Damages'}, {label:'Pain & Suffering',value:'3rd-Party Only'} ],
    keyFacts: [
      'Workers\u2019 comp pays medical bills and partial wages regardless of fault, but bars pain-and-suffering',
      'A third-party claim against a non-employer can recover full damages, including pain and suffering',
      'Common third parties: equipment makers, subcontractors, property owners, and other drivers',
      'You can usually pursue workers\u2019 comp and a third-party claim at the same time',
      'Workers\u2019 comp deadlines are short — report the injury to your employer immediately'
    ],
    sections: [
      { title:'Workers\u2019 Compensation: What It Covers and Its Limits', content:[
        'Workers\u2019 compensation is a no-fault system: it pays your medical bills and a portion of your lost wages regardless of who caused the injury. In exchange, you generally cannot sue your employer for negligence.',
        'The trade-off is significant. Workers\u2019 comp does not pay for pain and suffering, and it replaces only part of your wages. For a serious injury, the difference between comp benefits and full damages can be enormous.',
        'Workers\u2019 comp deadlines are strict. Report the injury to your employer immediately and in writing — late reporting is a common reason valid claims are denied.'
      ]},
      { title:'The Third-Party Claim: Where the Real Value Often Is', content:[
        'A third-party claim is a separate lawsuit against a negligent party who is not your employer. Unlike workers\u2019 comp, a third-party claim can recover full damages — including pain and suffering, full lost wages, and loss of future earning capacity.',
        'Common third parties include the manufacturer of defective equipment, a subcontractor or general contractor on a job site, the owner of the property where you were injured, and the at-fault driver in a work-related vehicle crash.',
        'You can usually pursue both at once: workers\u2019 comp covers immediate medical and wage needs while the third-party claim pursues the full value of your injury.'
      ]},
      { title:'Common Third-Party Workplace Scenarios', content:[
        'Defective machinery and tools: when equipment lacks proper guards or fails due to a design or manufacturing defect, the manufacturer may be liable in a product-liability claim.',
        'Construction sites: with multiple companies on one site, a subcontractor or general contractor whose negligence injured you can be a third-party defendant separate from your direct employer.',
        'Work-related vehicle crashes: if you are injured driving for work by another negligent driver, that driver (and their insurer) is a third party — in addition to any workers\u2019 comp benefits.'
      ]},
      { title:'Coordinating Comp and Third-Party Recovery', content:[
        'When you recover from both workers\u2019 comp and a third-party claim, your employer\u2019s comp insurer typically has a lien — a right to be reimbursed from the third-party recovery for what it paid. This must be negotiated carefully.',
        'Skilled handling of the comp lien can substantially increase your net recovery, sometimes reducing or waiving the reimbursement owed.',
        'Because the two systems interact in complex ways, workplace injuries with a potential third party benefit most from early, coordinated legal guidance.'
      ]}
    ]
  }
};

CP.accidentTypeOrder = ['car-accident','truck-accident','motorcycle-accident','pedestrian-accident','wrongful-death','rideshare-accident','bicycle-accident','drunk-driving-accident','hit-and-run','slip-and-fall','dog-bite','workplace-injury'];
