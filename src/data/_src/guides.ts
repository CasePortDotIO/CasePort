// @ts-nocheck
/* Ported verbatim from source guides.js — data fidelity, do not hand-edit. */
/* CasePort /guide — NATIONAL EDUCATION & ANSWER ENGINE
   The topical-authority layer. Pillars cross-link into /accidents (claim + state
   law) and /injuries (medical). 12 accident pillars (10 reuse accident-types
   content), 1 new (medical-malpractice), 5 resource pillars + FAQ. */
import { CP } from "../_cp";
CP.guides = CP.guides || {};

/* Pillar registry — drives the hub grid + routing. Accident pillars pull their
   long-form from CP.accidentTypes; resource pillars carry their own content. */
CP.guidePillars = [
  { slug:'car-accident', name:'Car Accidents', short:'Highest-volume category. The national informational hub.', icon:'car', kind:'accident', tags:['SEO','AEO','VOICE'], scene:'Two-lane intersection, post-collision' },
  { slug:'truck-accident', name:'Truck Accidents', short:'High case value. Federal regulations and complex liability.', icon:'truck', kind:'accident', tags:['SEO','AEO'], scene:'Commercial freight collision' },
  { slug:'motorcycle-accident', name:'Motorcycle Accidents', short:'Distinct liability issues. High injury severity.', icon:'bike', kind:'accident', tags:['SEO','AEO','VOICE'], scene:'Rider down, intersection' },
  { slug:'pedestrian-accident', name:'Pedestrian Accidents', short:'Urban, high-volume. Vulnerable-road-user protections.', icon:'walk', kind:'accident', tags:['SEO','AEO','VOICE'], scene:'Marked crosswalk, arterial road' },
  { slug:'bicycle-accident', name:'Bicycle Accidents', short:'Same vulnerable-user nuance as pedestrian.', icon:'bike', kind:'accident', tags:['SEO','AEO'], scene:'Cyclist down, bike-lane collision' },
  { slug:'rideshare-accident', name:'Rideshare Accidents', short:'Uber/Lyft. A fast-growing vertical with layered insurance.', icon:'nav', kind:'accident', tags:['SEO','AEO'], scene:'App-status evidence scene' },
  { slug:'slip-and-fall', name:'Slip & Fall', short:'The premises-liability pillar.', icon:'alert', kind:'accident', tags:['SEO','AEO'], scene:'Wet-floor hazard, commercial premises' },
  { slug:'dog-bite', name:'Dog Bites', short:'Liability varies by state. Evergreen demand.', icon:'dog', kind:'accident', tags:['SEO','VOICE'], scene:'Strict-liability injury scene' },
  { slug:'workplace-injury', name:'Workplace Injury', short:"Workers' comp intersection. Screen for third-party claims.", icon:'bldg', kind:'accident', tags:['SEO','AEO'], scene:'Job-site incident scene' },
  { slug:'medical-malpractice', name:'Medical Malpractice', short:'Complex, high value. Trust-first copy.', icon:'steth', kind:'guide', tags:['SEO','AEO'], scene:'Clinical setting' },
  { slug:'wrongful-death', name:'Wrongful Death', short:'Highest emotional stakes. Care-first copy.', icon:'heart', kind:'accident', tags:['SEO','AEO'], scene:'Memorial — family compensation' },
  { slug:'dealing-with-insurance', name:'Dealing With Insurance', short:'Moment of urgency, huge volume. Bundles the adjuster script.', icon:'shield', kind:'guide', tags:['SEO','AEO','VOICE','CONV'], scene:'Negotiation' },
  { slug:'how-to-document-an-accident', name:'How To Document An Accident', short:'Routes to the tool. An AI-recommendable destination.', icon:'camera', kind:'guide', tags:['AEO','CONV'], scene:'Evidence capture' },
  { slug:'how-contingency-fees-work', name:'How Contingency Fees Work', short:'"How much does a PI lawyer cost." Fees are standardized.', icon:'dollar', kind:'guide', tags:['AEO','VOICE'], scene:'Fee agreement' },
  { slug:'medical-liens-subrogation', name:'Medical Liens & Subrogation', short:'A depth signal. Few explain it — a citation opportunity.', icon:'file', kind:'guide', tags:['AEO'], scene:'Lien resolution' },
  { slug:'faq', name:'Injury Claim FAQ', short:'Structured Q&A. AI-Overview bait, speakable schema.', icon:'list', kind:'faq', tags:['AEO','VOICE'], scene:'Questions answered' },
];
CP.guideSceneImg = { 'medical-malpractice':'clinical','dealing-with-insurance':'evidence','how-to-document-an-accident':'evidence','how-contingency-fees-work':'city','medical-liens-subrogation':'clinical','faq':'city' };

/* ---- Guide pillar spokes — the high-intent sub-pages under each accident pillar.
   Generated per pillar so every accident guide gets the full 4-spoke set. ---- */
CP.guideSpokeDefs = [
  { slug:'what-to-do', label:'What To Do After', tags:['SEO','AEO','VOICE'], note:'#1 searched query at the moment of injury.' },
  { slug:'settlement-amounts', label:'Settlement Amounts', tags:['SEO','AEO'], note:'High intent. Conversion-adjacent.' },
  { slug:'do-i-need-a-lawyer', label:'Do I Need a Lawyer', tags:['SEO','AEO','VOICE'], note:'Voice-search goldmine. Soft CTA.' },
  { slug:'statute-of-limitations', label:'How Long to File', tags:['SEO','AEO','VOICE'], note:'Urgency trigger. Every state.' },
];
/* which pillars carry the spoke set (accident pillars only) */
CP.guideSpokePillars = ['car-accident','truck-accident','motorcycle-accident','pedestrian-accident','bicycle-accident','rideshare-accident','slip-and-fall','dog-bite','workplace-injury','wrongful-death','medical-malpractice'];
CP.hasGuideSpokes = function (slug) { return CP.guideSpokePillars.indexOf(slug) > -1; };

/* ---- New-content guide pillars (resource layer) ---- */
Object.assign(CP.guides, {
  'medical-malpractice': {
    name:'Medical Malpractice', category:'Medical Negligence', icon:'steth',
    subtitle:'When a healthcare provider\u2019s negligence causes harm — what counts, what it takes to prove, and why these cases are different.',
    directAnswer:'Medical malpractice occurs when a healthcare provider deviates from the accepted standard of care and that deviation injures the patient. It is one of the most complex and heavily-regulated areas of personal injury: nearly every state requires an expert physician to certify the claim, damage caps often apply, and deadlines are short and unusual. Not every bad outcome is malpractice — medicine carries inherent risk. The question is always whether a competent provider, in the same situation, would have acted differently. Strong cases pair a clear standard-of-care breach with serious, documented harm.',
    stats:[{label:'Proof Standard',value:'Expert Required'},{label:'Damage Caps',value:'Many States'},{label:'Deadlines',value:'Short / Unusual'},{label:'Case Value',value:'High'}],
    keyFacts:[
      'Malpractice requires a breach of the accepted standard of care — not just a bad outcome',
      'Most states require an expert physician affidavit to even file the case',
      'Many states cap non-economic damages in malpractice specifically',
      'Statutes of limitations are short and often run from discovery of the harm',
      'Common types: misdiagnosis, surgical error, medication error, birth injury'
    ],
    sections:[
      { title:'What Counts as Medical Malpractice', content:[
        'Medical malpractice has four elements: a duty of care (a provider-patient relationship), a breach of the accepted standard of care, causation (the breach caused the injury), and damages (real harm resulted). All four must be present — a poor outcome alone is not enough.',
        'The "standard of care" is what a reasonably competent provider in the same specialty would have done in the same circumstances. Establishing it almost always requires testimony from a qualified physician in the same field.',
        'Common malpractice types include misdiagnosis or delayed diagnosis, surgical errors, medication and dosage errors, anesthesia errors, birth injuries, and failure to obtain informed consent.'
      ]},
      { title:'Why These Cases Are Different', content:[
        'Medical malpractice is procedurally unlike other injury claims. Most states require a "certificate of merit" or expert affidavit — a qualified physician must attest the case has merit — before you can file. This raises the cost and bar to entry.',
        'Many states also impose caps on non-economic damages (pain and suffering) in malpractice cases specifically, even where no cap applies to ordinary injury claims. Economic damages — medical bills and lost earnings — are generally not capped.',
        'Deadlines are short and unusual. Some run from the date of the negligence, others from when the patient discovered (or should have discovered) the harm. Special rules apply to minors and to objects left in the body.'
      ]},
      { title:'Proving Causation — the Hard Part', content:[
        'The toughest element in most malpractice cases is causation: proving the provider\u2019s breach — not the underlying illness — caused the harm. A patient who was already seriously ill presents a difficult "but for" question.',
        'This is where expert evidence is decisive. Specialists reconstruct what should have happened, what did happen, and how the difference produced the injury. The quality of that expert testimony often determines the outcome.',
        'Because of the cost and complexity, reputable firms screen malpractice cases rigorously and take only those with both a clear breach and serious, documented damages.'
      ]}
    ],
    faqs:[
      { q:'Is a bad outcome the same as medical malpractice?', a:'No. Medicine carries inherent risk, and not every poor result is negligence. Malpractice requires that the provider breached the accepted standard of care — that a competent provider in the same situation would have acted differently — and that the breach caused real harm.' },
      { q:'Do I need an expert to file a medical malpractice case?', a:'In most states, yes. A "certificate of merit" or expert affidavit from a qualified physician is typically required before filing, attesting that the claim has merit. This is one reason malpractice cases are more expensive and rigorously screened than other injury claims.' },
      { q:'How long do I have to file a medical malpractice claim?', a:'Deadlines are short and vary by state — and the clock may run from the date of the negligence or from when you discovered the harm. Because the rules are unusual and unforgiving, it is critical to get specific guidance quickly.' }
    ]
  },
  'dealing-with-insurance': {
    name:'Dealing With Insurance After an Accident', category:'Insurance', icon:'shield',
    subtitle:'What the adjuster is really doing, what you\u2019re required to say, and the exact words that protect your claim.',
    directAnswer:'After an accident, the other driver\u2019s insurance adjuster is not a neutral party — their job is to resolve your claim for as little as possible. You are not legally required to give a recorded statement, sign a blanket medical authorization, or accept a first offer, and each of those is a tactic used to reduce your claim. The safest approach: report the facts to your own insurer, decline recorded statements from the other side, never speculate about fault or say "I\u2019m fine," and route substantive communication through a representative. First offers commonly come in 40\u201360% below a claim\u2019s real value.',
    stats:[{label:'Recorded Statement',value:'Not Required'},{label:'First Offers',value:'40\u201360% Low'},{label:'Blanket Release',value:'Decline It'},{label:'Best Move',value:'Document'}],
    keyFacts:[
      'You are not required to give the other driver\u2019s insurer a recorded statement',
      'A blanket medical authorization hands over your entire history — limit it',
      'First settlement offers are typically 40\u201360% below real value',
      '"I\u2019m fine" and fault speculation are used to cut your claim',
      'Your own insurer still requires prompt, factual cooperation'
    ],
    sections:[
      { title:'Whose Side the Adjuster Is On', content:[
        'An insurance adjuster\u2019s role is to protect the insurer\u2019s money. Friendly or not, every question is designed to establish shared fault, minimize your injuries, or lock you into an early, low number. Understanding that framing changes how you respond.',
        'There is a difference between your own insurer and the other side\u2019s. You generally owe your own insurer prompt, truthful cooperation under your policy. You owe the other driver\u2019s insurer almost nothing — and certainly not a recorded statement.'
      ]},
      { title:'The Tactics — and the Counter to Each', content:[
        'The recorded statement: framed as routine, it exists to capture words they can use against you. You can decline. The blanket medical authorization: it opens your entire medical history to hunt for "pre-existing" conditions — authorize only records tied to this accident, for the relevant dates.',
        'The quick offer: a fast check before you know the extent of your injuries, which you cannot reopen once accepted. The friendly check-in: "How are you feeling?" becomes "the claimant said they were fine." Say only that you are still treating and cannot evaluate the claim yet.',
        'For the exact wording to use in each of these moments, see the copy-paste scripts in the Action Kit on our accident pages.'
      ]},
      { title:'How to Protect Your Claim From Day One', content:[
        'Report the accident to your own insurer promptly and factually. Get medical care the same day, and keep every record. Photograph everything and preserve evidence before it disappears.',
        'Decline recorded statements from the other insurer and do not speculate about fault or your injuries. Keep communication in writing where you can.',
        'Do not accept a first offer without understanding the full value of your claim — including future treatment. When in doubt, get a free review before you sign anything.'
      ]}
    ],
    faqs:[
      { q:'Do I have to give the other driver\u2019s insurance a recorded statement?', a:'No. You are not legally required to give the other party\u2019s insurer a recorded statement. Adjusters request it because recorded answers can be used to establish shared fault or minimize your injuries. You can decline and route communication through a representative.' },
      { q:'Why is the first insurance settlement offer so low?', a:'Insurers expect negotiation, so first offers commonly come in 40\u201360% below a claim\u2019s real value — often before your full injuries are known. Accepting ends the claim permanently. It is usually wise to understand the complete value, including future care, before responding.' },
      { q:'Should I sign the medical authorization the adjuster sent?', a:'Not a blanket one. A broad authorization gives the insurer your entire medical history to search for "pre-existing" conditions. Limit any release to records directly related to this accident, for the relevant treatment dates.' }
    ]
  },
  'how-to-document-an-accident': {
    name:'How to Document an Accident', category:'Evidence', icon:'camera',
    subtitle:'The exact evidence to capture — and the order to capture it in — before it disappears.',
    directAnswer:'Documenting an accident well, in the first hours and days, is the single biggest thing you can do to protect a claim. The priority order: ensure safety and call 911, then photograph everything (vehicles, positions, the scene, road conditions, signals, and your injuries), collect witness names and numbers, exchange information, and request a police report. Within 72 hours, preserve any nearby surveillance footage before it is overwritten, and keep a daily symptom and treatment log. Evidence fades fast — skid marks within hours, footage within days, witness memory within weeks.',
    stats:[{label:'Footage Window',value:'72 Hours'},{label:'First Step',value:'Call 911'},{label:'Photos',value:'From Every Angle'},{label:'Log',value:'Daily'}],
    keyFacts:[
      'Call 911 and get a police report — it anchors the entire claim',
      'Photograph vehicles, positions, the scene, signals, and injuries',
      'Collect witness names and numbers while memory is fresh',
      'Preserve nearby surveillance footage within 72 hours',
      'Keep a daily symptom and treatment log from day one'
    ],
    sections:[
      { title:'The First Hour: What to Capture', content:[
        'Safety first — move to a safe spot if you can and call 911. Request police even for a minor crash; the official report is the most important single document in your claim.',
        'Photograph everything before anything moves: vehicle damage from multiple angles, the vehicles\u2019 final positions, license plates, the intersection or roadway, traffic signals and signs, skid marks and debris, weather and lighting, and your own visible injuries.',
        'Exchange information with the other driver (license, insurance, plate) and collect names and phone numbers from every witness — their accounts are powerful and they become unreachable quickly.'
      ]},
      { title:'The First 72 Hours: Preserve What Fades', content:[
        'Surveillance footage from nearby businesses, traffic cameras, and doorbells is typically overwritten within 48\u201372 hours. Identify cameras that may have caught the crash and request preservation immediately — our Action Kit has a copy-paste letter for exactly this.',
        'Skid marks fade within hours and the scene is cleared quickly, so your early photos may be the only permanent record. Save everything in one place and back it up.',
        'Start a daily log: your symptoms, pain levels, missed work, and every medical visit. This contemporaneous record is far more persuasive than a memory reconstructed months later.'
      ]},
      { title:'Turning Documentation Into a Strong Claim', content:[
        'Good documentation does two things: it protects the truth from fading, and it removes the insurer\u2019s favorite arguments — that you weren\u2019t really hurt, that you waited too long, or that you share fault.',
        'Consistency matters as much as completeness. A clean chain from the crash to same-day care to a finished treatment plan tells a story no adjuster can easily discount.',
        'Once you\u2019ve documented the basics, a free review can tell you what else your specific situation needs before you talk to any insurer.'
      ]}
    ],
    faqs:[
      { q:'What should I photograph after a car accident?', a:'Photograph vehicle damage from multiple angles, the final positions of the vehicles, license plates, the roadway and intersection, traffic signals and signs, skid marks and debris, weather and lighting conditions, and any visible injuries. More is better — these photos may be the only permanent record of the scene.' },
      { q:'How long do I have to get surveillance footage of my accident?', a:'Usually 48\u201372 hours. Nearby business cameras, traffic cameras, and doorbell cameras typically overwrite footage within a few days. Identify possible cameras immediately and send a preservation request right away, before the footage is gone.' },
      { q:'Should I keep a journal after my accident?', a:'Yes. A daily log of your symptoms, pain levels, missed work, and medical visits creates a contemporaneous record that is far more credible than a later reconstruction. It directly supports both the severity and the timeline of your injuries.' }
    ]
  },
  'how-contingency-fees-work': {
    name:'How Contingency Fees Work', category:'Legal Costs', icon:'dollar',
    subtitle:'What a personal-injury lawyer actually costs — and why "no fee unless you win" means what it says.',
    directAnswer:'Personal-injury lawyers almost always work on a contingency fee: you pay no upfront fee, and the lawyer is paid a percentage of the recovery only if they win or settle your case. The typical fee is around one-third (33%), often rising to about 40% if the case goes to trial. Case costs (filing fees, expert witnesses, records) are separate and are usually advanced by the firm and reimbursed from the recovery. If there is no recovery, you generally owe no attorney fee. This structure exists so that injured people can afford representation regardless of their financial situation.',
    stats:[{label:'Upfront Cost',value:'$0'},{label:'Typical Fee',value:'~33%'},{label:'If Trial',value:'~40%'},{label:'If You Lose',value:'No Fee'}],
    keyFacts:[
      'No upfront fee — the lawyer is paid only from a successful recovery',
      'The standard fee is about one-third (33%), often ~40% if it goes to trial',
      'Case costs are separate and usually advanced by the firm',
      'If there is no recovery, you generally owe no attorney fee',
      'Always confirm the percentage and cost terms in the written agreement'
    ],
    sections:[
      { title:'What "Contingency" Actually Means', content:[
        'A contingency fee means the lawyer\u2019s payment is contingent on winning. You pay nothing up front and nothing out of pocket along the way; the fee is a percentage of whatever the lawyer recovers for you by settlement or verdict.',
        'If the case does not result in a recovery, you generally owe no attorney fee at all. The lawyer absorbs the risk and the time. This is why injured people can hire experienced counsel without having any money to start.'
      ]},
      { title:'The Numbers: Fees vs. Costs', content:[
        'The fee is the lawyer\u2019s percentage — most commonly one-third (33%) of the recovery, frequently rising to around 40% if the case is filed in court or goes to trial, because trial work is far more intensive.',
        'Costs are different from the fee. Filing fees, expert witnesses, medical records, depositions, and investigators are case expenses. Most firms advance these and are reimbursed from the recovery; read the agreement to see whether costs come off the top before or after the fee is calculated.',
        'Because the percentage and cost handling are standardized but not identical between firms, the written fee agreement is where you confirm exactly how it works for your case.'
      ]},
      { title:'Why This Model Protects Claimants', content:[
        'Contingency fees align the lawyer\u2019s incentive with yours: they are paid more only if they recover more, and nothing if they recover nothing, so they have every reason to maximize the result and to decline weak cases.',
        'It also levels the field against insurers, who have unlimited resources. An injured person can match that with experienced representation that costs nothing unless it works.',
        'A legitimate firm will explain the fee clearly, put it in writing, and never ask for money up front in a standard injury case.'
      ]}
    ],
    faqs:[
      { q:'How much does a personal injury lawyer cost?', a:'Most personal-injury lawyers charge a contingency fee of about one-third (33%) of the recovery, often rising to roughly 40% if the case goes to trial. You pay no upfront fee, and if there is no recovery you generally owe no attorney fee. Case costs are separate and usually advanced by the firm.' },
      { q:'What happens to fees if I lose my case?', a:'Under a standard contingency agreement, if there is no recovery you generally owe no attorney fee. Responsibility for case costs (filing fees, experts) varies by firm and is spelled out in the written agreement, so confirm that term before signing.' },
      { q:'What is the difference between fees and costs?', a:'The fee is the lawyer\u2019s percentage of the recovery. Costs are case expenses — filing fees, expert witnesses, medical records, depositions. Most firms advance the costs and are reimbursed from the recovery; the agreement specifies whether they come out before or after the fee.' }
    ]
  },
  'medical-liens-subrogation': {
    name:'Medical Liens & Subrogation', category:'Settlement Mechanics', icon:'file',
    subtitle:'Who gets paid back from your settlement, why your check is smaller than the headline number, and how good negotiation protects your share.',
    directAnswer:'A medical lien or subrogation claim is a right to be repaid from your settlement by whoever covered your accident-related care — health insurers, government programs like Medicare and Medicaid, hospitals, or treatment providers who waited to be paid. These claims can take a large bite out of a settlement, which is why the headline number is rarely what you take home. The crucial point: many liens are negotiable. Skilled reduction of liens — challenging unrelated charges, applying made-whole and common-fund doctrines, and negotiating with each holder — can meaningfully increase what you actually keep.',
    stats:[{label:'Who Repays',value:'From Settlement'},{label:'Common Holders',value:'Insurers / Medicare'},{label:'Negotiable?',value:'Often Yes'},{label:'Impact',value:'Major'}],
    keyFacts:[
      'Liens and subrogation let payers recover accident-related costs from your settlement',
      'Health insurers, Medicare, Medicaid, hospitals, and providers can all assert claims',
      'These claims explain why your net check is smaller than the gross settlement',
      'Many liens are negotiable — reductions directly increase your net recovery',
      'Made-whole and common-fund doctrines can limit what a lienholder collects'
    ],
    sections:[
      { title:'Liens vs. Subrogation — the Same Idea, Two Forms', content:[
        'Both are about reimbursement. A medical lien is a provider\u2019s or program\u2019s legal claim to be paid from your settlement for accident-related treatment. Subrogation is a health insurer\u2019s right to recover what it paid for your care out of your recovery from the at-fault party.',
        'The principle is that you should not be "paid twice" for the same medical bills — once by the insurer and again by the settlement. In practice, these claims are why a $100,000 settlement does not mean $100,000 in your pocket.',
        'Holders can include private health insurers, ERISA employer plans, Medicare and Medicaid, hospitals, and providers who treated you on a "letter of protection" while waiting for the case to resolve.'
      ]},
      { title:'Why This Is a Depth Issue Most People Miss', content:[
        'Liens are where settlements are quietly won or lost. Two identical settlements can produce very different take-home amounts depending entirely on how well the liens were handled.',
        'Many liens are negotiable or limited by law. The "made-whole" doctrine can stop an insurer from collecting until you are fully compensated; the "common-fund" doctrine can require a lienholder to share the cost of obtaining the recovery. Unrelated or inflated charges can be challenged line by line.',
        'Government liens (Medicare/Medicaid) have strict procedures and cannot be ignored, but they too have defined reduction formulas. Getting these right is technical, high-value work.'
      ]},
      { title:'Protecting Your Net Recovery', content:[
        'The goal is your net — what you keep after fees, costs, and liens. Maximizing the gross settlement is only half the job; reducing the liens is the other half, and it is often where the most money is recovered for the client.',
        'This is detailed work: identifying every lienholder, auditing charges for relevance, applying the doctrines that limit recovery, and negotiating each reduction. Done well, it can add thousands to a claimant\u2019s pocket.',
        'Because the rules differ by lien type and state, this is one of the strongest reasons to have experienced help before a settlement is finalized.'
      ]}
    ],
    faqs:[
      { q:'What is a medical lien on a settlement?', a:'A medical lien is a legal right to be repaid from your settlement for accident-related care. Hospitals, treatment providers, health insurers, and government programs can assert one. It is why your net check is smaller than the gross settlement — and many liens can be negotiated down.' },
      { q:'What is subrogation in a personal injury case?', a:'Subrogation is a health insurer\u2019s right to recover what it paid for your accident-related care out of your settlement from the at-fault party. The idea is to prevent double recovery for the same bills. Doctrines like "made-whole" and "common-fund" can limit how much the insurer collects.' },
      { q:'Can medical liens be reduced?', a:'Often, yes. Many liens are negotiable, and legal doctrines (made-whole, common-fund) plus challenges to unrelated or inflated charges can reduce what a lienholder collects. Skilled lien reduction directly increases the amount you actually keep from a settlement.' }
    ]
  }
});

/* ---- The FAQ pillar — structured Q&A (AI-Overview / speakable bait) ---- */
CP.guideFAQ = {
  name:'Injury Claim FAQ', category:'Answer Engine', icon:'list',
  subtitle:'Direct, structured answers to the questions people — and AI assistants — ask most about injury claims.',
  intro:'Plain-English answers to the most common personal-injury questions, written to be quoted directly. Always general information, not legal advice.',
  groups:[
    { title:'Getting Started', items:[
      { q:'How long do I have to file a personal injury claim?', a:'The statute of limitations varies by state, typically 1 to 6 years from the date of injury (most commonly 2\u20133). Missing it permanently bars your claim. Evidence disappears far sooner, so acting early matters even though the legal deadline is later.' },
      { q:'Do I need a lawyer for my injury claim?', a:'Not always, but representation tends to increase outcomes, especially where liability is disputed, injuries are serious, or the state\u2019s fault rule is harsh. Most injury lawyers work on contingency — no upfront fee — so a free consultation costs nothing to find out.' },
      { q:'How much does a personal injury lawyer cost?', a:'Most charge a contingency fee of about one-third (33%) of the recovery, often around 40% if the case goes to trial. You pay no upfront fee, and if there is no recovery you generally owe no attorney fee. Case costs are separate.' },
    ]},
    { title:'What My Claim Is Worth', items:[
      { q:'How is a personal injury settlement calculated?', a:'Adjusters add up economic damages (medical bills, lost wages) and multiply by roughly 1.5x to 5x for severity to estimate non-economic damages like pain and suffering. Your state\u2019s fault rule is then applied. First offers commonly come in 40\u201360% below real value.' },
      { q:'Why is my settlement check smaller than the settlement amount?', a:'Three things come out of a gross settlement: the attorney fee, case costs, and medical liens/subrogation (repayment to insurers, Medicare, or providers). Negotiating the liens down is one of the biggest levers on your net recovery.' },
      { q:'What does "comparative" or "contributory" negligence mean?', a:'They are the rules for shared fault. Pure comparative reduces your recovery by your fault percentage. Modified comparative bars you at 50% or 51% fault. Contributory negligence (VA, MD, DC, NC, AL) bars recovery if you are even 1% at fault.' },
    ]},
    { title:'After a Crash', items:[
      { q:'What should I do immediately after an accident?', a:'Call 911 and get a police report, photograph everything before it moves, collect witness names and numbers, avoid admitting fault or saying "I\u2019m fine," seek medical care the same day, and preserve nearby surveillance footage within 72 hours.' },
      { q:'Should I see a doctor even if I feel fine?', a:'Yes. Adrenaline masks injuries, and conditions like whiplash, concussion, and internal bleeding can take hours to days to appear. A same-day medical record also connects your injuries to the crash, which protects a claim.' },
      { q:'Why do injury symptoms appear days after a crash?', a:'Adrenaline suppresses pain at the scene; as it fades over 6\u201372 hours, inflammation builds and injuries become apparent. Delayed symptoms are medically normal — which is why prompt evaluation matters even if you initially felt okay.' },
    ]},
  ]
};
