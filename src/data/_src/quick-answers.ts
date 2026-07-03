// @ts-nocheck
/* Ported verbatim from source quick-answers.js — data fidelity, do not hand-edit. */
/* CasePort /accidents — QUICK ANSWER PAGES
   8 AEO/GEO answer pages. directAnswer leads (extractable), then sections. */
import { CP } from "../_cp";

CP.quickAnswers = {
  'contributory-negligence': {
    question: 'What is contributory negligence and why does it matter?',
    title: 'Contributory Negligence: How This Rule Can Eliminate Your Entire Claim',
    eyebrow: 'Negligence Rules', visual: 'contributory',
    directAnswer: "Contributory negligence is a legal rule that eliminates your entire recovery if you are found any percentage at fault for the accident. In Virginia, Maryland, Washington DC, North Carolina, and Alabama, you cannot recover anything if you are even 1% at fault. This is the most dangerous rule in personal injury law. In every other state, comparative negligence allows you to recover even if you are partially at fault — your recovery is simply reduced by your percentage of fault.",
    keyFacts: ['Contributory negligence: 1% fault = zero recovery','Only 5 jurisdictions still use it: VA, MD, DC, NC, AL','Modified comparative bars recovery at 50% or 51%','Pure comparative reduces but never bars recovery','Adjusters are trained to establish shared fault'],
    sources: ['State Bar Associations','ABA Guidelines','Case Law'],
    sections: [
      { title:'What Is Contributory Negligence?', content:'Contributory negligence is a legal rule that bars recovery if the injured party is found to be any percentage at fault for their own injury. In contributory negligence states, even 1% fault eliminates 100% of your recovery. This is called "pure contributory negligence" or "strict contributory negligence." It is the harshest negligence rule in America.' },
      { title:'Which States Use Contributory Negligence?', content:'Only five jurisdictions use pure contributory negligence: Virginia, Maryland, Washington DC, North Carolina, and Alabama. These states are outliers. Most states use comparative negligence, which allows recovery even if you are partially at fault. If you were injured in one of these five jurisdictions, you must be extremely careful about liability — even minor fault can eliminate your entire claim.' },
      { title:'Why Contributory Negligence Is Dangerous', content:'Contributory negligence is dangerous because insurance companies and defendants use it aggressively to deny claims. They argue that you were partially at fault — jaywalking, distracted driving, not wearing a seatbelt — to eliminate your entire recovery. Even if the other party was 99% at fault, if you are found 1% at fault, you recover nothing.' },
      { title:'How to Protect Your Claim in Contributory Negligence States', content:'To protect your claim in a contributory negligence state, you must prove that you were not at fault. This requires clear evidence: surveillance footage, witness testimony, police investigation, and accident reconstruction. Do not admit fault at the accident scene. Do not apologize. Do not make statements about what happened. Let your representative handle all communications with insurance companies and defendants.' },
      { title:'Comparative Negligence: The Better Rule', content:'Most states use comparative negligence, which allows you to recover even if you are partially at fault. Your recovery is reduced by your percentage of fault. If you are 30% at fault and your claim is worth $100,000, you recover $70,000. This is much more forgiving than contributory negligence.' }
    ]
  },
  'statute-of-limitations': {
    question: 'How long do I have to file after an accident?',
    title: 'Statute of Limitations: Your Legal Deadline to File a Claim',
    eyebrow: 'Filing Deadlines', visual: 'statute',
    directAnswer: "The statute of limitations is your legal deadline to file a claim. In most states you have 2–3 years from the date of the accident to file a lawsuit. Miss this deadline and your claim is permanently barred, regardless of injury severity or how clear the liability is. Some states have shorter deadlines (1 year) and some have longer (up to 6 years). Government claims and medical malpractice often have different — usually shorter — deadlines.",
    keyFacts: ['Deadlines range from 1 to 6 years by state','Government claims have much shorter notice periods','The discovery rule can move the start date','Evidence disappears in days — long before the deadline','Surveillance footage is overwritten within 72 hours'],
    sources: ['State Statutes','NHTSA Data','Legal Precedent'],
    sections: [
      { title:'What Is the Statute of Limitations?', content:'The statute of limitations is a legal deadline by which you must file a lawsuit. If you miss this deadline, your claim is permanently barred. You cannot recover anything, no matter how clear the liability or severe your injuries. The statute of limitations is a hard deadline with very few exceptions.' },
      { title:'Statute of Limitations by State', content:'The deadline varies by state. Most states have a 2–3 year deadline for personal injury claims. Virginia has a 2-year deadline. Maryland and Washington DC have 3 years. Georgia has 2 years. Kentucky, Louisiana, and Tennessee have just 1 year. Maine and North Dakota allow up to 6 years. Medical malpractice claims often have different deadlines.' },
      { title:'When Does the Clock Start?', content:'The statute of limitations typically starts on the date of the accident. However, in some cases the clock starts on the date the injury was discovered (the "discovery rule"). If you were injured but did not discover the injury until months later, the statute may start on the discovery date. If you were a minor at the time, the clock may not begin until you turn 18.' },
      { title:'Why Early Action Is Critical', content:'Early action is critical to preserve your rights. Evidence disappears long before the legal deadline: surveillance footage is overwritten within 72 hours, witness memory fades within days, and physical evidence is cleared within hours. Acting early preserves evidence and protects your claim. Do not wait until the last minute.' },
      { title:'What Happens If You Miss the Deadline?', content:'If you file after the statute of limitations expires, the defendant will file a motion to dismiss based on the statute of limitations. The court will grant it. Your case will be dismissed and you will have no legal recourse, no matter how strong your claim.' }
    ]
  },
  'evidence-preservation': {
    question: 'How important is evidence preservation after an accident?',
    title: 'Evidence Preservation: Why the First 72 Hours Are Critical',
    eyebrow: 'Evidence', visual: 'evidence',
    directAnswer: "Evidence preservation is critical because evidence disappears quickly after an accident. Surveillance footage is overwritten within 72 hours. Witness memory fades within days. Physical evidence at the scene is cleared or destroyed within hours. The first 72 hours are the most critical window for evidence preservation. If you wait, the evidence is gone forever — and the strength of your entire claim depends on it.",
    keyFacts: ['Surveillance footage: 72-hour overwrite window','Witness memory fades within days','Physical evidence disappears within hours','Medical records must be continuous','Gaps in treatment reduce settlement value'],
    sources: ['NHTSA Data','Insurance Claims Analysis','Evidence Standards'],
    sections: [
      { title:'What Evidence Disappears Quickly?', content:'Surveillance footage is overwritten within 72 hours. Nearby businesses, traffic cameras, ATMs, and parking lots record 24/7, but these systems recycle footage every 48–72 hours. After that, the footage is gone forever. Witness memory also fades quickly — witnesses remember details immediately after an accident, but within days memory becomes fuzzy, and within weeks they may forget the incident entirely.' },
      { title:'Physical Evidence at the Scene', content:'Physical evidence at the scene disappears quickly. Skid marks fade within hours. Debris is cleared by road maintenance crews. Vehicle damage patterns change as vehicles are moved or repaired. Photographs taken immediately after the accident, from multiple angles, are often the only permanent record of the scene.' },
      { title:'How to Preserve Evidence', content:'Preserve evidence immediately. Take photographs and video from multiple angles. Get names, phone numbers, and email addresses from all witnesses. Contact nearby businesses and request that they preserve their surveillance footage. Contact a representative immediately so they can issue a preservation letter to the defendant and relevant third parties.' },
      { title:'Preservation Letters', content:'A preservation letter is a legal document sent to the defendant and relevant third parties (businesses, government agencies) requiring that they preserve all evidence related to the accident — surveillance footage, maintenance records, inspection records, and more. Failure to preserve evidence after receiving a preservation letter can result in court sanctions.' },
      { title:'Why Early Legal Action Is Essential', content:'Early legal action is essential to preserve evidence. A representative can immediately issue preservation letters to lock down surveillance footage, maintenance records, and other evidence. Without early action, critical evidence is lost forever. Do not wait.' }
    ]
  },
  'settlement-calculation': {
    question: 'How is my accident settlement amount calculated?',
    title: 'Settlement Calculation: How Your Claim Value Is Determined',
    eyebrow: 'Case Value', visual: 'settlement',
    directAnswer: "Settlement calculations use the multiplier method: economic damages (medical bills, lost wages, property damage) multiplied by a factor of 1.5x to 5x depending on injury severity. A $30,000 medical bill with a 2.5x multiplier results in a $75,000 settlement. But your state's negligence rule is applied first — in contributory negligence states, any fault eliminates your entire recovery; in comparative negligence states, your recovery is reduced by your percentage of fault.",
    keyFacts: ['Medical specials anchor the non-economic calculation','Multiplier ranges from 1.5x (minor) to 5x+ (severe)','Contributory negligence can bar 100% of recovery','First offers average 40–60% below final value','Treatment gaps reduce settlement value'],
    sources: ['Insurance Industry Data','Settlement Research','State Law Analysis'],
    sections: [
      { title:'The Multiplier Method', content:'The multiplier method is the standard way insurance adjusters calculate settlement value. Economic damages are multiplied by a factor of 1.5x to 5x depending on injury severity. Minor injuries (soft tissue, full recovery in weeks) receive 1.5x to 2x. Moderate injuries (fractures, ongoing treatment) receive 2x to 3.5x. Severe injuries (permanent disability, chronic pain) receive 3.5x to 5x or higher.' },
      { title:'Economic Damages', content:'Economic damages are objective, quantifiable losses: medical bills, lost wages, property damage, transportation costs, and other out-of-pocket expenses. These are documented by receipts, invoices, and financial records. Economic damages are the foundation of your settlement calculation.' },
      { title:'Non-Economic Damages', content:'Non-economic damages are subjective losses: pain and suffering, emotional distress, loss of enjoyment of life, and permanent scarring or disfigurement. These are not documented by receipts. Instead, they are estimated using the multiplier, which reflects the severity of your injuries and the impact on your life.' },
      { title:'Why First Offers Are Always Low', content:'Insurance companies expect negotiation. First settlement offers are intentionally low, typically 40–60% below final value. Accepting the first offer means leaving significant money on the table. Do not accept the first offer. Negotiate. If negotiations stall, consider litigation.' },
      { title:'Factors That Increase Settlement Value', content:'Settlement value increases with injury severity, clear liability, strong evidence, a sympathetic plaintiff, and high insurance limits. It decreases with comparative fault, weak evidence, and low insurance limits. A representative can explain how these factors apply to your specific case.' }
    ]
  },
  'first-hour': {
    question: 'What should I do in the first hour after an accident?',
    title: 'The First Hour: What to Do Immediately After an Accident',
    eyebrow: 'First Steps',
    directAnswer: "The first hour after an accident determines the strength of your case. Call 911 and request police. Photograph everything: license plates, vehicle damage, the intersection, traffic signals, skid marks, and your injuries. Collect witness names and phone numbers. Do not say 'I am fine' or 'I am sorry.' Do not give a recorded statement to any insurance company. Send your information to a representative immediately.",
    keyFacts: ['Call 911 and request a police report','Photograph everything before it moves','Collect witness names and numbers','Never say "I am fine" or "I am sorry"','Contact a representative within 24 hours'],
    sources: ['NHTSA Guidelines','ABA Recommendations','Insurance Best Practices'],
    sections: [
      { title:'Call 911 and Request Police', content:'Call 911 if anyone is injured, and request police response even for minor accidents. The police report is one of the most important pieces of evidence in your claim. It documents the scene, the parties, and the officer\'s initial assessment of fault. Get the report number before you leave.' },
      { title:'Document the Scene Before It Changes', content:'Photograph everything from multiple angles: vehicle damage, license plates, road conditions, traffic signals, skid marks, debris, and the surrounding area. Photograph the other driver\'s license and insurance card. Skid marks fade within hours and vehicles get moved — your photos may be the only permanent record.' },
      { title:'Collect Witnesses While Memory Is Fresh', content:'Get names, phone numbers, and email addresses from anyone who saw the accident. Ask them to briefly describe what they saw. Witness memory is most reliable in the first hours; within days, details fade, and within weeks, witnesses become unreachable.' },
      { title:'Guard Your Words', content:'Do not admit fault. Do not apologize. Do not say "I am fine" — adrenaline masks injuries, and some injuries (concussions, internal injuries, soft tissue damage) do not appear for hours or days. Anything you say at the scene can be used to reduce your claim.' },
      { title:'Seek Medical Care and Contact a Representative', content:'See a doctor even if you feel fine. Medical records create the foundation of your claim. Then contact a personal injury representative within 24 hours so they can preserve evidence and handle all communication with insurance companies on your behalf.' }
    ]
  },
  'insurance-statement': {
    question: "Should I talk to the insurance company after an accident?",
    title: 'Talking to the Insurance Company: Why You Should Not Give a Statement',
    eyebrow: 'Insurance Tactics',
    directAnswer: "No. You are not legally required to give a statement to the other driver's insurance company. Their adjuster is trained to ask questions designed to establish your fault or minimize your injuries. Anything you say is recorded and can be used to reduce or deny your claim. Direct all communication through a personal injury representative.",
    keyFacts: ['You are not required to speak with them','Adjusters are trained to find fault','Statements are recorded and used against you','Direct all communication through a representative','Even casual remarks can reduce your claim'],
    sources: ['ABA Guidelines','Insurance Industry Data','Case Law'],
    sections: [
      { title:'You Are Not Required to Give a Statement', content:'You are not legally obligated to give a recorded statement to the other driver\'s insurance company. Their adjuster may imply that a statement is needed to "process your claim faster," but this is a tactic. Politely decline and direct them to your representative.' },
      { title:'How Adjusters Use Your Words', content:'Adjusters are trained to ask questions designed to establish shared fault or minimize your injuries. A simple "I\'m feeling better" becomes evidence your injuries were minor. "I didn\'t see them coming" becomes evidence of your inattention. Every word is recorded and reviewed for anything that reduces your claim.' },
      { title:'The Medical Authorization Trap', content:'Adjusters often ask you to sign a "medical authorization" so they can process your claim. A blanket authorization gives them access to your entire medical history — not just records from this accident. They use unrelated prior conditions to argue your injuries were pre-existing. Only authorize records directly related to this accident.' },
      { title:'What to Say Instead', content:'You can be brief and polite: "I am not providing a recorded statement at this time. Please direct all communication to my representative." That single sentence protects your claim. A representative handles every conversation with the insurance company so you never have to navigate their tactics alone.' }
    ]
  },
  'georgia-sb68': {
    question: 'How do recent tort reform laws change my accident claim?',
    title: 'Tort Reform 2024–2025: How New Laws Change Your Accident Claim',
    eyebrow: 'Law Changes',
    directAnswer: "Multiple states have enacted tort reform in 2024–2025 that limits damages, changes evidence rules, and raises fault thresholds. Georgia's Senate Bill 68 introduced new limits; Florida changed its comparative-fault standard and shortened its filing deadline to two years in 2024. These changes directly affect settlement values and trial outcomes, making early legal guidance more important than ever.",
    keyFacts: ['Seatbelt evidence rules are changing in multiple states','Phantom damages are increasingly limited','Fault thresholds are being raised','New laws took effect in 2024–2025','Early legal guidance matters more than ever'],
    sources: ['State Legislatures','American Tort Reform Association','Case Law Analysis'],
    sections: [
      { title:'What Tort Reform Changes', content:'Recent tort reform legislation across multiple states has introduced phantom-damages limitations, changed seatbelt-evidence admissibility, and modified comparative-fault thresholds. Each of these changes directly impacts how much a claim is worth and how it is litigated.' },
      { title:'Georgia Senate Bill 68', content:'Georgia\'s SB 68 (2025) is part of a wave of tort reform aimed at limiting non-economic damages and changing trial procedure. Georgia uses a modified comparative negligence rule with a 50% bar — you can recover only if you are less than 50% at fault, and your recovery is reduced by your percentage of fault.' },
      { title:'Florida\'s 2024 Changes', content:'In 2024, Florida shifted from pure comparative negligence to a modified comparative standard (51% bar) and shortened its statute of limitations for negligence from four years to two. If you were injured in Florida, your deadline is now much shorter than many people assume.' },
      { title:'Why Early Guidance Matters More Now', content:'When the rules of fault, evidence, and damages are actively changing, the cost of a wrong assumption is higher. A representative who tracks these changes can protect your claim from being undervalued under a rule you did not know had changed. Get guidance early.' }
    ]
  },
  'pedestrian-dc': {
    question: 'Do pedestrians and cyclists have different fault rules?',
    title: 'Vulnerable Road Users: Different Fault Rules for Pedestrians and Cyclists',
    eyebrow: 'Vulnerable Users',
    directAnswer: "Yes. Many jurisdictions apply different negligence standards to vulnerable road users. Some provide comparative carve-outs that allow pedestrians and cyclists to recover even when partially at fault, while drivers are held to stricter standards. But in contributory negligence jurisdictions like Washington DC, the harsh 1%-fault rule still applies — making early legal guidance critical for urban accident victims.",
    keyFacts: ['Vulnerable road users often get different standards','Comparative carve-outs exist in some jurisdictions','Drivers face a heightened duty of care','Rules vary significantly by jurisdiction','Critical for urban pedestrian and cyclist victims'],
    sources: ['State Traffic Codes','Bar Associations','Legal Precedent'],
    sections: [
      { title:'The Vulnerable Road User Doctrine', content:'Several jurisdictions recognize that pedestrians and cyclists have no protective shell and apply heightened standards of care to drivers around them. Drivers must anticipate vulnerable users and take steps to avoid collision, even when the pedestrian or cyclist is partially at fault.' },
      { title:'Comparative Carve-Outs', content:'Some jurisdictions provide comparative carve-outs that reduce or eliminate a vulnerable user\'s fault in collisions with vehicles. These rules acknowledge the vulnerability disparity between a person on foot and a multi-ton vehicle, and they can allow recovery even where a strict reading of fault would not.' },
      { title:'The Contributory Negligence Exception', content:'Washington DC, Maryland, Virginia, North Carolina, and Alabama still use contributory negligence — where even 1% fault bars all recovery. In these jurisdictions, a pedestrian who steps outside a crosswalk can lose their entire claim. Urban victims in these areas must be especially careful about admissions of fault.' },
      { title:'Why This Matters for Urban Victims', content:'Pedestrian and cyclist collisions cluster in dense urban areas where fault rules vary block by block across jurisdictional lines. Knowing which standard applies — and protecting against fault admissions — is critical. A representative familiar with your jurisdiction can apply the correct standard to your case.' }
    ]
  }
};

CP.quickAnswerOrder = ['contributory-negligence','statute-of-limitations','insurance-statement','first-hour','georgia-sb68','pedestrian-dc','evidence-preservation','settlement-calculation'];
/* hub card "settlement-value" maps to the canonical settlement-calculation page */
CP.qaAlias = { 'settlement-value':'settlement-calculation' };
