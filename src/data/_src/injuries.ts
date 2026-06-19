// @ts-nocheck
/* Ported verbatim from source injuries.js — data fidelity, do not hand-edit. */
/* CasePort /injuries — INJURY CONTENT LAYER (the MD-credentialed moat)
   12 injury types. Each carries: overview, symptoms (immediate/delayed/emergency),
   treatment, recovery timeline, and settlement factors — feeding the per-type spokes. */
import { CP } from "../_cp";
CP.injuries = CP.injuries || {};

/* Named medical reviewer entity (E-E-A-T for medical AEO — distinct from the legal reviewer) */
CP.medReviewer = {
  name: 'Dr. Elena Ramos, MD',
  title: 'Board-Certified Physical Medicine & Rehabilitation',
  creds: 'Residency-trained in PM&R · 12 years treating post-collision trauma · Independent medical reviewer',
  org: 'CasePort Medical Review'
};

Object.assign(CP.injuries, {
  'whiplash': {
    name:'Whiplash', slug:'whiplash', category:'Neck & Soft Tissue', icon:'steth', sceneImg:'clinical',
    directAnswer:'Whiplash is a neck injury caused by the rapid back-and-forth motion of the head in a collision, straining the muscles, ligaments, and discs of the cervical spine. Symptoms often appear 6 to 48 hours after the crash, not immediately. Most cases resolve in a few weeks to three months with treatment, but a significant minority develop chronic pain. Average whiplash settlements range from $10,000 to $100,000+ depending on severity, treatment duration, and whether the pain becomes chronic.',
    stats:[{label:'Symptom Onset',value:'6–48 hrs'},{label:'Typical Recovery',value:'3 mo'},{label:'Chronic Risk',value:'~30%'},{label:'Avg Settlement',value:'$25K'}],
    keyFacts:[
      'Whiplash symptoms commonly appear 6–48 hours after the crash, not at the scene',
      'A normal X-ray does not rule out whiplash — soft-tissue injury does not show on X-ray',
      'Early treatment and consistent documentation are the biggest drivers of claim value',
      'Roughly 1 in 3 whiplash patients develop some chronic symptoms',
      'Gaps in treatment are the #1 way insurers reduce whiplash claims'
    ],
    sections:[
      {title:'What Whiplash Actually Is', content:[
        'Whiplash is a soft-tissue injury to the cervical spine caused by rapid acceleration-deceleration forces — the head is thrown backward then forward, stretching and tearing the muscles, tendons, and ligaments of the neck beyond their normal range.',
        'Because the damage is to soft tissue rather than bone, whiplash does not appear on a standard X-ray. This is why insurers often dispute it — and why thorough clinical documentation (range-of-motion testing, MRI when indicated, and a consistent treatment record) is essential to proving the injury is real.'
      ]},
      {title:'Why Symptoms Are Delayed', content:[
        'Adrenaline and shock at the scene mask pain. As those wear off over the next 6 to 48 hours, inflammation builds and the neck stiffens — which is why many people feel fine at the crash and wake up the next morning barely able to turn their head.',
        'This delay is medically normal, but it creates a legal trap: anything you said at the scene ("I\'m fine") and any gap before you sought care will be used to argue you were not really injured. Seeking prompt evaluation protects both your health and your claim.'
      ]},
      {title:'When Whiplash Becomes Chronic', content:[
        'Most whiplash resolves within weeks to three months. But about a third of patients develop chronic symptoms — persistent neck pain, headaches, and reduced mobility lasting six months or longer, sometimes called "whiplash-associated disorder."',
        'Chronic cases substantially increase claim value because they involve ongoing treatment, lasting impairment, and a documented impact on daily life and work. Risk factors include high initial pain, pre-existing neck issues, and early-onset headaches.'
      ]}
    ],
    symptoms:{ immediate:['Neck pain and stiffness','Reduced range of motion','Headache at the base of the skull','Shoulder or upper-back tightness'], delayed:['Worsening stiffness the next morning','Tingling or numbness in the arms','Dizziness or fatigue','Difficulty concentrating ("brain fog")'], emergency:['Severe headache that keeps worsening','Numbness or weakness spreading down an arm','Loss of bladder or bowel control'] },
    treatment:[{name:'Early evaluation & imaging',desc:'A physician rules out fracture and documents range-of-motion loss; MRI is ordered if neurological symptoms are present.'},{name:'Physical therapy',desc:'The cornerstone of recovery — guided mobilization, strengthening, and posture work restore function and prevent chronic stiffening.'},{name:'Pain management',desc:'NSAIDs, muscle relaxants, and in some cases trigger-point or facet injections control pain during healing.'},{name:'Activity modification',desc:'Brief rest followed by gradual return to motion; prolonged immobilization is now known to slow recovery.'}],
    recovery:[{phase:'Acute',time:'Week 1–2',desc:'Peak pain and inflammation; focus on controlling symptoms and gentle movement.'},{phase:'Subacute',time:'Week 2–6',desc:'Physical therapy ramps up; mobility and strength steadily improve.'},{phase:'Recovery',time:'Month 2–3',desc:'Most patients return to near-normal function; therapy tapers.'},{phase:'Chronic (if it occurs)',time:'6 months+',desc:'Persistent pain requires ongoing management and substantially affects claim value.'}],
    settlement:[{factor:'Treatment duration & consistency',desc:'A continuous, well-documented treatment record is the single biggest value driver.'},{factor:'Chronic vs. resolved',desc:'Lasting symptoms multiply value because they involve future care and impairment.'},{factor:'Objective findings',desc:'MRI findings, neurological signs, and specialist notes counter the "soft-tissue" discount.'},{factor:'Impact on work & life',desc:'Documented missed work and lost daily function raise non-economic damages.'},{factor:'Pre-existing conditions',desc:'How clearly the new injury is distinguished from prior neck issues affects value.'}]
  },
  'traumatic-brain-injury': {
    name:'Traumatic Brain Injury (TBI)', slug:'traumatic-brain-injury', category:'Head & Brain', icon:'alert', sceneImg:'scan',
    directAnswer:'A traumatic brain injury (TBI) is damage to the brain caused by a blow, jolt, or violent movement of the head — including concussions, which are mild TBIs. Symptoms can be immediate or emerge over hours to days, and even "mild" TBIs can cause lasting cognitive and emotional changes. TBIs are among the highest-value injury claims because of the cost of care and the lifelong impact. Average TBI settlements range from $100,000 to well over $1,000,000 depending on severity.',
    stats:[{label:'Severity Range',value:'Mild–Severe'},{label:'Symptom Onset',value:'Mins–Days'},{label:'Avg Settlement',value:'$250K+'},{label:'Lasting Effects',value:'Common'}],
    keyFacts:[
      'A concussion is a mild TBI — "mild" describes the initial injury, not the long-term impact',
      'You can sustain a TBI without ever losing consciousness',
      'Symptoms can emerge hours or days later as bleeding or swelling develops',
      'Standard CT scans can miss the diffuse damage of a mild TBI',
      'TBIs are high-value claims because of long-term care costs and lasting impairment'
    ],
    sections:[
      {title:'Understanding TBI Severity', content:[
        'TBIs range from mild (concussion) to severe. Severity is graded at the time of injury by factors like loss of consciousness and the Glasgow Coma Scale — but the initial grade does not predict the long-term outcome. Many "mild" TBIs produce persistent cognitive and emotional symptoms.',
        'A TBI does not require a direct blow to the head. The rapid acceleration-deceleration of a crash can cause the brain to move within the skull, shearing nerve fibers — an injury that may not appear on a standard CT scan.'
      ]},
      {title:'The Danger of Delayed Symptoms', content:[
        'Some of the most dangerous TBIs worsen over hours or days as bleeding or swelling builds inside the skull. A person who walks away from a crash can deteriorate that night — which is why any head impact warrants prompt evaluation and clear instructions on red-flag symptoms.',
        'Cognitive and emotional symptoms — memory problems, irritability, difficulty concentrating — often emerge gradually and may be attributed to stress. Documenting them early, ideally with neuropsychological testing, is critical to both treatment and the claim.'
      ]},
      {title:'Why TBI Claims Are High-Value', content:[
        'TBI claims are among the most valuable in personal injury because the consequences can be lifelong: ongoing medical care, cognitive rehabilitation, lost earning capacity, and a profound impact on relationships and independence.',
        'Proving the full extent of a TBI requires specialists — neurologists, neuropsychologists, and life-care planners — who can document current deficits and project future needs. This is where rigorous medical evidence directly translates into claim value.'
      ]}
    ],
    symptoms:{ immediate:['Confusion or disorientation','Headache','Dizziness or balance problems','Nausea or vomiting'], delayed:['Memory and concentration problems','Mood changes and irritability','Sensitivity to light or noise','Sleep disturbances'], emergency:['Worsening or "worst-ever" headache','Repeated vomiting or seizures','One pupil larger than the other','Increasing confusion, slurred speech, or weakness'] },
    treatment:[{name:'Emergency evaluation & imaging',desc:'CT or MRI rules out bleeding and swelling; severe TBIs may require neurosurgical intervention.'},{name:'Cognitive rest, then rehabilitation',desc:'Initial rest followed by a structured return to activity and cognitive rehab guided by specialists.'},{name:'Neuropsychological testing',desc:'Baseline and follow-up testing documents cognitive deficits objectively — vital for treatment and the claim.'},{name:'Multidisciplinary care',desc:'Neurology, physical and occupational therapy, speech therapy, and mental-health support as needed.'}],
    recovery:[{phase:'Acute / stabilization',time:'Day 0–7',desc:'Rule out bleeding; manage symptoms; cognitive and physical rest.'},{phase:'Early recovery',time:'Week 1–6',desc:'Gradual, monitored return to activity; rehabilitation begins.'},{phase:'Rehabilitation',time:'Month 2–12',desc:'Cognitive and physical rehab; many mild TBIs improve substantially.'},{phase:'Long-term / permanent',time:'1 year+',desc:'Some deficits persist and require lifelong care — a major claim component.'}],
    settlement:[{factor:'Severity & permanence',desc:'Documented permanent cognitive or physical deficits dramatically increase value.'},{factor:'Specialist documentation',desc:'Neurology and neuropsychology findings overcome the "they look fine" defense.'},{factor:'Lost earning capacity',desc:'Reduced ability to work — current and future — is often the largest economic component.'},{factor:'Life-care needs',desc:'Projected future treatment and support costs, documented by a life-care planner.'},{factor:'Impact on independence',desc:'Effects on daily living and relationships drive substantial non-economic damages.'}]
  },
  'herniated-disc': {
    name:'Herniated Disc', slug:'herniated-disc', category:'Spine & Back', icon:'scan', sceneImg:'scan',
    directAnswer:'A herniated disc occurs when the soft center of a spinal disc pushes through its tougher outer layer, often pressing on nearby nerves and causing pain, numbness, or weakness that can radiate into the arms or legs. Collisions frequently cause or aggravate disc herniations. Many improve with conservative care over weeks to months, but some require injections or surgery. Average herniated-disc settlements range from $40,000 to $300,000+, and far higher when surgery is required.',
    stats:[{label:'Common Sites',value:'Neck/Low Back'},{label:'Conservative Care',value:'6–12 wk'},{label:'Surgery Rate',value:'~10%'},{label:'Avg Settlement',value:'$80K'}],
    keyFacts:[
      'A herniated disc can press on nerves, causing pain that radiates into an arm or leg',
      'MRI — not X-ray — is the imaging that confirms a disc herniation',
      'Collisions can both cause new herniations and aggravate pre-existing ones',
      'Most cases improve with conservative care, but surgical cases are high-value',
      'The "aggravation of a pre-existing condition" is a compensable injury'
    ],
    sections:[
      {title:'How a Disc Herniates in a Crash', content:[
        'Spinal discs act as cushions between the vertebrae. The sudden compressive and shearing forces of a collision can rupture a disc\'s outer wall, allowing the inner material to bulge out and press on adjacent nerve roots or the spinal cord.',
        'When the herniation compresses a nerve, the result is radiculopathy — pain, tingling, numbness, or weakness that travels along the nerve\'s path, such as sciatica down the leg or radiating pain down the arm.'
      ]},
      {title:'Diagnosis and the MRI Question', content:[
        'A herniated disc is confirmed by MRI, which shows soft tissue an X-ray cannot. Because insurers know many adults have some disc changes, the key evidence is correlation: matching the imaging findings to the patient\'s specific symptoms and the timing of the crash.',
        'This is also why the "pre-existing condition" argument is so common — and why it usually fails. Under the law, aggravating a pre-existing condition is a compensable injury. If the crash made a quiet disc symptomatic, the at-fault party is responsible for that change.'
      ]},
      {title:'From Conservative Care to Surgery', content:[
        'Most herniated discs improve with conservative treatment — physical therapy, anti-inflammatories, and epidural steroid injections — over six to twelve weeks. The goal is to reduce nerve inflammation while the disc heals.',
        'When conservative care fails or there is progressive weakness, surgery (such as a microdiscectomy or fusion) may be necessary. Surgical cases are substantially higher in value because of the cost, the permanence, and the lasting restrictions that often follow.'
      ]}
    ],
    symptoms:{ immediate:['Sharp or burning back/neck pain','Pain radiating into an arm or leg','Muscle spasm','Stiffness and reduced motion'], delayed:['Numbness or tingling along a nerve path','Weakness in a hand, arm, or leg','Worsening pain with sitting or bending','Sciatica (pain down the leg)'], emergency:['Loss of bladder or bowel control','Progressive or severe leg weakness','Numbness in the saddle/groin area (cauda equina)'] },
    treatment:[{name:'MRI & specialist evaluation',desc:'MRI confirms the herniation and a spine specialist correlates findings to symptoms.'},{name:'Physical therapy',desc:'Targeted strengthening, traction, and mobility work reduce nerve pressure and rebuild support.'},{name:'Epidural steroid injections',desc:'Image-guided injections reduce nerve-root inflammation and can confirm the pain source.'},{name:'Surgery (when indicated)',desc:'Microdiscectomy or fusion for cases with persistent symptoms or progressive weakness.'}],
    recovery:[{phase:'Acute',time:'Week 1–3',desc:'Pain control and inflammation management; activity modification.'},{phase:'Conservative care',time:'Week 3–12',desc:'Physical therapy and injections; most patients improve in this window.'},{phase:'Decision point',time:'Month 3–6',desc:'If symptoms persist, surgery is considered; recovery resets post-op.'},{phase:'Post-surgical / long-term',time:'6–12 months+',desc:'Surgical recovery and possible permanent restrictions — a major value factor.'}],
    settlement:[{factor:'Surgery vs. conservative',desc:'Surgical cases are dramatically higher in value than those resolved conservatively.'},{factor:'MRI–symptom correlation',desc:'Clear matching of imaging to symptoms defeats the "pre-existing" discount.'},{factor:'Radiculopathy & nerve damage',desc:'Documented nerve involvement (EMG/nerve studies) raises value.'},{factor:'Permanent restrictions',desc:'Lasting limits on lifting, sitting, or working drive economic and non-economic damages.'},{factor:'Injection records',desc:'A documented progression through conservative care strengthens the claim.'}]
  },
  'spinal-cord-injury': {
    name:'Spinal Cord Injury', slug:'spinal-cord-injury', category:'Spine & Back', icon:'alert', sceneImg:'scan',
    directAnswer:'A spinal cord injury (SCI) is damage to the spinal cord that disrupts the signals between the brain and the body, potentially causing partial or complete loss of movement and sensation below the level of injury. SCIs are catastrophic, often permanent, and among the most serious outcomes of a collision. Lifetime costs routinely reach into the millions, and settlements reflect that — frequently $1,000,000 and well beyond for severe cases.',
    stats:[{label:'Severity',value:'Catastrophic'},{label:'Permanence',value:'Often Lifelong'},{label:'Lifetime Cost',value:'$1M–$5M+'},{label:'Avg Settlement',value:'$1M+'}],
    keyFacts:[
      'A complete SCI causes total loss of function below the injury; incomplete SCIs vary',
      'The injury level (cervical, thoracic, lumbar) determines which functions are affected',
      'Lifetime care costs for severe SCIs routinely exceed several million dollars',
      'Early stabilization is critical to preserving remaining function',
      'These claims require life-care planners and economists to capture full value'
    ],
    sections:[
      {title:'Complete vs. Incomplete Injuries', content:[
        'A spinal cord injury is classified as complete (total loss of motor and sensory function below the injury) or incomplete (some function remains). The level of the injury — cervical (neck), thoracic, or lumbar — determines which parts of the body are affected.',
        'Cervical injuries can affect all four limbs (tetraplegia/quadriplegia), while lower injuries may affect the legs and lower body (paraplegia). Even "incomplete" injuries can cause profound, permanent disability.'
      ]},
      {title:'The Lifetime Cost of an SCI', content:[
        'Spinal cord injuries carry some of the highest lifetime costs in medicine — for hospitalization, surgery, rehabilitation, home modification, adaptive equipment, personal care, and ongoing complications. These costs routinely total in the millions.',
        'Capturing the full value of an SCI claim requires a life-care planner to project decades of need and an economist to calculate lost earning capacity and the present value of future costs. Under-documenting future needs is the most common way these claims are undervalued.'
      ]},
      {title:'Why Early Action Matters', content:[
        'Rapid stabilization after an SCI can preserve remaining function and prevent secondary damage. The acute phase is medically intense and sets the trajectory for everything that follows.',
        'On the legal side, preserving evidence and engaging experts early is essential. These cases turn on demonstrating both the mechanism of injury and the full scope of lifelong impact — work that begins long before any settlement discussion.'
      ]}
    ],
    symptoms:{ immediate:['Loss of movement below the injury','Loss or change of sensation','Intense back or neck pain','Difficulty breathing (high injuries)'], delayed:['Spasticity or muscle tightness','Loss of bladder or bowel control','Pressure-sore and infection risk','Neuropathic (nerve) pain'], emergency:['Any loss of movement or sensation after a crash','Inability to feel the limbs','Difficulty breathing or staying alert'] },
    treatment:[{name:'Emergency stabilization & surgery',desc:'Immobilization and surgery to decompress and stabilize the spine, preserving remaining function.'},{name:'Intensive rehabilitation',desc:'Months of physical and occupational therapy to maximize independence and adapt to changes.'},{name:'Adaptive equipment & home modification',desc:'Wheelchairs, assistive technology, and accessibility changes — major, ongoing cost components.'},{name:'Lifelong care management',desc:'Coordinated care to manage complications, with personal-care support as needed.'}],
    recovery:[{phase:'Acute',time:'Day 0–14',desc:'Stabilization, surgery, and intensive medical management.'},{phase:'Rehabilitation',time:'Month 1–6',desc:'Inpatient and outpatient rehab to maximize function and independence.'},{phase:'Adaptation',time:'6–18 months',desc:'Adjusting to lasting changes; equipment and home modifications.'},{phase:'Lifelong',time:'Ongoing',desc:'Permanent care needs — the core of the claim\'s value.'}],
    settlement:[{factor:'Level & completeness',desc:'Higher and complete injuries mean greater impairment and higher value.'},{factor:'Life-care plan',desc:'A detailed projection of decades of care is the backbone of the economic claim.'},{factor:'Lost earning capacity',desc:'Often total and permanent — a major economic component.'},{factor:'Home & vehicle modifications',desc:'Accessibility costs are substantial and recoverable.'},{factor:'Quality-of-life impact',desc:'Profound effects on independence drive the largest non-economic awards.'}]
  },
  'soft-tissue-injury': {
    name:'Soft-Tissue Injury', slug:'soft-tissue-injury', category:'Muscles & Ligaments', icon:'steth', sceneImg:'clinical',
    directAnswer:'Soft-tissue injuries are damage to the muscles, tendons, and ligaments — sprains, strains, and contusions — and they are the most common injuries in collisions. They do not show on X-rays, which leads insurers to undervalue them, yet they can cause significant, lasting pain. Most resolve in weeks to a few months with treatment. Average soft-tissue settlements range from $5,000 to $50,000+ depending on severity, treatment, and any lasting symptoms.',
    stats:[{label:'Frequency',value:'Most Common'},{label:'Typical Recovery',value:'2–12 wk'},{label:'X-Ray Visible',value:'No'},{label:'Avg Settlement',value:'$15K'}],
    keyFacts:[
      'Soft-tissue injuries (sprains, strains, contusions) are the most common crash injuries',
      'They do not appear on X-rays, which insurers exploit to dispute them',
      'Consistent treatment and documentation are essential to proving the injury',
      'Severe sprains and tears can require months of care or surgery',
      'Untreated soft-tissue injuries can develop into chronic pain'
    ],
    sections:[
      {title:'What Counts as a Soft-Tissue Injury', content:[
        'Soft-tissue injuries affect the body\'s connective structures rather than bone. Sprains stretch or tear ligaments (which connect bone to bone), strains affect muscles or tendons (which connect muscle to bone), and contusions are deep bruises to muscle.',
        'They range from mild to severe. A complete ligament tear can be as disabling as a fracture and may require surgery — yet because none of it shows on an X-ray, these injuries are routinely under-treated by patients and undervalued by insurers.'
      ]},
      {title:'Why Insurers Discount Them', content:[
        'Because soft-tissue damage is invisible on X-ray, insurers label these "minor" and apply a low settlement multiplier. The defense is built on the absence of imaging — so the response is a complete, consistent treatment record that documents the injury\'s real impact.',
        'MRI or ultrasound can visualize significant soft-tissue tears, and a physician\'s objective findings — swelling, bruising, range-of-motion loss, and a clear treatment course — counter the "it doesn\'t show on a scan" argument.'
      ]},
      {title:'Preventing Chronic Pain', content:[
        'Most soft-tissue injuries heal within weeks to a few months. But inadequate treatment, or returning to full activity too soon, can lead to chronic pain and recurring injury that lasts far longer.',
        'Following the full course of treatment — rather than stopping when the acute pain fades — protects both recovery and claim value, since a documented, completed treatment plan is far more persuasive than a few early visits.'
      ]}
    ],
    symptoms:{ immediate:['Pain and tenderness','Swelling and bruising','Stiffness and reduced motion','Muscle spasm'], delayed:['Pain that worsens over 24–72 hours','Lingering weakness','Recurring stiffness with activity','Knots or trigger points'], emergency:['Inability to bear weight or use a limb','Severe swelling with numbness','A "pop" with immediate loss of function'] },
    treatment:[{name:'RICE & early care',desc:'Rest, ice, compression, and elevation in the acute phase, guided by a physician evaluation.'},{name:'Physical therapy',desc:'Progressive stretching and strengthening restore function and prevent chronic pain.'},{name:'Anti-inflammatory management',desc:'NSAIDs and, in some cases, injections control pain and swelling during healing.'},{name:'Imaging for severe cases',desc:'MRI or ultrasound when a significant tear is suspected; surgery for complete tears.'}],
    recovery:[{phase:'Acute',time:'Day 1–7',desc:'Peak swelling and pain; protect the injury and control inflammation.'},{phase:'Subacute',time:'Week 2–6',desc:'Physical therapy restores motion and strength.'},{phase:'Recovery',time:'Week 6–12',desc:'Return to full activity for most patients.'},{phase:'Chronic (if untreated)',time:'3 months+',desc:'Persistent pain from inadequate care — affects both health and claim value.'}],
    settlement:[{factor:'Severity grade',desc:'A complete tear is worth far more than a mild strain.'},{factor:'Treatment record',desc:'Consistent, completed treatment is the strongest evidence of a real injury.'},{factor:'Objective imaging',desc:'MRI/ultrasound findings counter the "no X-ray finding" discount.'},{factor:'Chronic symptoms',desc:'Lasting pain increases value through ongoing care and impairment.'},{factor:'Functional impact',desc:'Documented limits on work and daily activity raise non-economic damages.'}]
  },
  'broken-bones': {
    name:'Broken Bones (Fractures)', slug:'broken-bones', category:'Fractures', icon:'shield', sceneImg:'scan',
    directAnswer:'Broken bones (fractures) are among the most common serious collision injuries, ranging from simple hairline cracks to complex breaks requiring surgery and hardware. Unlike soft-tissue injuries, fractures show clearly on X-ray, making liability for the injury hard to dispute. Recovery ranges from six weeks to many months. Average fracture settlements range from $25,000 to $200,000+ depending on the bone, whether surgery was required, and any permanent impairment.',
    stats:[{label:'X-Ray Visible',value:'Yes'},{label:'Basic Healing',value:'6–8 wk'},{label:'Surgery Common',value:'Complex breaks'},{label:'Avg Settlement',value:'$60K'}],
    keyFacts:[
      'Fractures show clearly on X-ray, so the injury itself is rarely disputed',
      'Breaks requiring surgery and hardware are substantially higher in value',
      'Some fractures cause permanent impairment, arthritis, or chronic pain',
      'Recovery ranges from weeks for simple breaks to many months for complex ones',
      'Compound (open) and comminuted (shattered) fractures are the most serious'
    ],
    sections:[
      {title:'Types of Fractures', content:[
        'Fractures range widely: a simple hairline crack, a clean break, a comminuted fracture (bone shattered into pieces), and a compound or open fracture (bone breaks the skin). The type drives both the treatment and the value of the claim.',
        'Location matters too. Weight-bearing bones, joints, and the spine carry higher stakes because of their role in movement and the risk of lasting impairment or post-traumatic arthritis.'
      ]},
      {title:'Surgery, Hardware, and Recovery', content:[
        'Simple fractures may heal in a cast in six to eight weeks. Complex breaks often require surgery to realign the bone, with plates, screws, or rods (open reduction and internal fixation) — and a much longer, more involved recovery.',
        'Hardware can be permanent, and some patients require a second surgery to remove it. Each surgery, each month of restricted activity, and any lasting limitation adds documented value to the claim.'
      ]},
      {title:'Long-Term Complications', content:[
        'Even after a fracture heals, complications can persist: reduced range of motion, chronic pain, nerve damage, and post-traumatic arthritis — especially with fractures that involve a joint.',
        'These lasting effects, documented by an orthopedic specialist, are a central part of the claim\'s value because they represent ongoing care and permanent impact rather than a one-time injury.'
      ]}
    ],
    symptoms:{ immediate:['Intense pain at the injury site','Visible deformity or swelling','Inability to bear weight or move the part','Bruising'], delayed:['Persistent swelling and stiffness','Reduced range of motion','Nerve tingling near the injury','Pain with weather or activity changes'], emergency:['Bone visible through the skin (open fracture)','Numbness or no pulse beyond the injury','Severe deformity or uncontrolled bleeding'] },
    treatment:[{name:'Imaging & reduction',desc:'X-ray (or CT) confirms the break; the bone is realigned by casting or surgery.'},{name:'Surgical fixation',desc:'Complex breaks need plates, screws, or rods to hold the bone while it heals.'},{name:'Immobilization',desc:'Casts, splints, or boots protect the healing bone for six weeks or longer.'},{name:'Rehabilitation',desc:'Physical therapy after immobilization restores strength and range of motion.'}],
    recovery:[{phase:'Immobilization',time:'Week 1–8',desc:'Bone heals in a cast or after surgical fixation; activity is restricted.'},{phase:'Early rehab',time:'Week 6–12',desc:'Hardware or cast removed as appropriate; therapy begins.'},{phase:'Strengthening',time:'Month 3–6',desc:'Rebuilding strength and motion; gradual return to activity.'},{phase:'Long-term',time:'6 months+',desc:'Possible permanent impairment or arthritis — a key value factor.'}],
    settlement:[{factor:'Surgery & hardware',desc:'Surgical fractures with permanent hardware are far higher in value.'},{factor:'Permanent impairment',desc:'Lasting loss of motion, strength, or function raises damages substantially.'},{factor:'Bone & joint involved',desc:'Weight-bearing and joint fractures carry higher stakes and value.'},{factor:'Number of surgeries',desc:'Each procedure (including hardware removal) adds documented cost and value.'},{factor:'Scarring & disfigurement',desc:'Visible scarring from surgery contributes to non-economic damages.'}]
  },
  'burn-injury': {
    name:'Burn Injuries', slug:'burn-injury', category:'Burns & Disfigurement', icon:'alert', sceneImg:'clinical',
    directAnswer:'Burn injuries from vehicle fires, chemical exposure, or contact with hot surfaces are among the most painful and disfiguring crash injuries. They are graded first through fourth degree by depth, and serious burns often require multiple surgeries, skin grafts, and long-term scar management. Because of the pain, scarring, and psychological impact, burn claims carry high non-economic value. Settlements range from $50,000 to well over $1,000,000 for severe, disfiguring burns.',
    stats:[{label:'Grading',value:'1st–4th degree'},{label:'Surgeries',value:'Often Multiple'},{label:'Scarring',value:'Common'},{label:'Avg Settlement',value:'$200K+'}],
    keyFacts:[
      'Burns are graded first through fourth degree by how deep the tissue damage goes',
      'Serious burns require skin grafts and multiple reconstructive surgeries',
      'Permanent scarring and disfigurement drive high non-economic damages',
      'Burn injuries carry a significant risk of infection and psychological trauma',
      'Scar revision and care can continue for years after the initial injury'
    ],
    sections:[
      {title:'Burn Severity and Treatment', content:[
        'Burns are graded by depth: first-degree (surface), second-degree (blistering), third-degree (full-thickness, destroying the skin layer), and fourth-degree (extending into muscle or bone). Deeper burns are more disfiguring and far harder to treat.',
        'Serious burns require specialized burn-center care: debridement, skin grafts, and reconstructive surgery, often over many months. Infection control is critical, because burns destroy the skin\'s protective barrier.'
      ]},
      {title:'Scarring, Disfigurement, and Psychological Impact', content:[
        'Even after the wound heals, burns frequently leave permanent scarring and disfigurement, particularly on visible areas like the face, neck, and hands. Scar tissue can also restrict movement when it crosses a joint.',
        'The psychological toll is substantial — anxiety, depression, and post-traumatic stress are common after disfiguring burns. These effects, properly documented, are a major component of the claim\'s value.'
      ]},
      {title:'Why Burn Claims Are High-Value', content:[
        'Burn claims combine high economic costs (extended hospitalization, multiple surgeries, years of scar management) with exceptionally high non-economic damages for pain, suffering, and disfigurement.',
        'Capturing full value requires documentation from burn specialists, plastic surgeons, and mental-health professionals, plus a life-care plan for ongoing scar-revision and reconstructive needs.'
      ]}
    ],
    symptoms:{ immediate:['Severe pain or, in deep burns, numbness','Redness, blistering, or charring','Swelling','Peeling or weeping skin'], delayed:['Infection (increasing redness, fever, pus)','Tightening scar tissue','Restricted movement near joints','Anxiety, depression, or PTSD'], emergency:['Burns to the face, hands, or airway','Difficulty breathing','Large or deep (third/fourth-degree) burns','Signs of severe infection or shock'] },
    treatment:[{name:'Burn-center stabilization',desc:'Fluid resuscitation, wound care, and infection control in a specialized unit.'},{name:'Skin grafts & surgery',desc:'Grafting and reconstructive surgery to close deep wounds and restore function.'},{name:'Scar management',desc:'Pressure garments, laser therapy, and scar-revision surgery over months to years.'},{name:'Psychological support',desc:'Counseling and mental-health care for the trauma and adjustment to disfigurement.'}],
    recovery:[{phase:'Acute',time:'Week 1–4',desc:'Stabilization, wound care, and initial grafting; high infection risk.'},{phase:'Reconstruction',time:'Month 1–12',desc:'Multiple surgeries and grafts; intensive wound and scar care.'},{phase:'Scar maturation',time:'1–2 years',desc:'Scars mature; revision surgeries and therapy continue.'},{phase:'Long-term',time:'Ongoing',desc:'Lasting disfigurement and psychological impact — central to the claim.'}],
    settlement:[{factor:'Burn depth & size',desc:'Deeper, larger burns mean more surgery and far higher value.'},{factor:'Location & visibility',desc:'Facial and hand burns carry higher non-economic damages.'},{factor:'Number of surgeries',desc:'Each graft and revision adds documented cost and value.'},{factor:'Disfigurement',desc:'Permanent visible scarring is a major non-economic driver.'},{factor:'Psychological impact',desc:'Documented PTSD, anxiety, or depression increases value.'}]
  },
  'ptsd': {
    name:'PTSD & Emotional Trauma', slug:'ptsd', category:'Psychological', icon:'heart', sceneImg:'recovery',
    directAnswer:'Post-traumatic stress disorder (PTSD) and emotional trauma are real, compensable injuries after a serious collision — even when there is no visible physical wound. Symptoms include flashbacks, anxiety, nightmares, and avoidance of driving, and they can be as disabling as a physical injury. Because they are invisible, documentation by a mental-health professional is essential. Settlements for psychological injuries vary widely and are highest when the trauma is well-documented and disabling.',
    stats:[{label:'Type',value:'Psychological'},{label:'Onset',value:'Days–Weeks'},{label:'Often Paired',value:'With injury'},{label:'Documentation',value:'Essential'}],
    keyFacts:[
      'PTSD and emotional trauma are legitimate, compensable injuries',
      'Symptoms can be as disabling as a physical injury',
      'Mental-health documentation is essential because the injury is invisible',
      'PTSD often accompanies — and compounds — physical injuries',
      'Avoidance of driving can have a real economic impact on work and life'
    ],
    sections:[
      {title:'How Trauma Follows a Crash', content:[
        'A serious collision is a life-threatening event, and the mind can be injured along with the body. PTSD develops when the nervous system stays locked in a threat response — re-experiencing the crash through flashbacks and nightmares, and avoiding anything that recalls it.',
        'Common after-crash symptoms include driving anxiety or an inability to drive at all, hypervigilance, irritability, insomnia, and difficulty concentrating. These can persist long after physical injuries heal.'
      ]},
      {title:'Why Documentation Is Everything', content:[
        'Because psychological injuries are invisible, they are the easiest for insurers to dismiss. The counter is professional documentation: evaluation and treatment by a psychologist or psychiatrist, a formal diagnosis, and a consistent record of symptoms and their impact.',
        'Early mental-health treatment serves two purposes — it helps recovery, and it creates the contemporaneous record that proves the injury is real and connected to the crash.'
      ]},
      {title:'The Real-World Impact', content:[
        'Emotional trauma is not abstract. Driving avoidance can cost a job or limit income. Anxiety and sleep loss impair work and relationships. These concrete effects translate the injury into both economic and non-economic damages.',
        'When PTSD accompanies a physical injury, it compounds the overall claim — the combined impact on a person\'s life is greater than either injury alone, and the documentation of both strengthens the case.'
      ]}
    ],
    symptoms:{ immediate:['Shock and disbelief','Heightened anxiety','Trouble sleeping','Replaying the crash'], delayed:['Flashbacks and nightmares','Avoidance of driving or the crash site','Irritability and hypervigilance','Depression and withdrawal'], emergency:['Thoughts of self-harm','Inability to function day-to-day','Severe panic attacks'] },
    treatment:[{name:'Professional evaluation',desc:'Assessment and diagnosis by a psychologist or psychiatrist establishes the injury.'},{name:'Trauma-focused therapy',desc:'Evidence-based treatments like CBT and EMDR address the trauma directly.'},{name:'Medication (when indicated)',desc:'Medication can manage anxiety, depression, and sleep during recovery.'},{name:'Ongoing support',desc:'Continued therapy documents progress and the lasting impact of the trauma.'}],
    recovery:[{phase:'Acute stress',time:'Week 1–4',desc:'Initial shock and acute symptoms; early evaluation matters.'},{phase:'Diagnosis & treatment',time:'Month 1–3',desc:'Formal diagnosis and start of trauma-focused therapy.'},{phase:'Active treatment',time:'Month 3–12',desc:'Therapy reduces symptoms for many; progress is documented.'},{phase:'Chronic (if it persists)',time:'1 year+',desc:'Lasting PTSD requires ongoing care and significantly affects the claim.'}],
    settlement:[{factor:'Professional diagnosis',desc:'A formal mental-health diagnosis is the foundation of the claim.'},{factor:'Treatment consistency',desc:'A continuous therapy record proves the injury is real and serious.'},{factor:'Functional impact',desc:'Documented effects on work, driving, and relationships drive value.'},{factor:'Paired physical injury',desc:'PTSD alongside a physical injury compounds the overall claim.'},{factor:'Severity & duration',desc:'Disabling, long-lasting symptoms substantially raise value.'}]
  },
  'back-injury': {
    name:'Back Injuries', slug:'back-injury', category:'Spine & Back', icon:'scan', sceneImg:'scan',
    directAnswer:'Back injuries from collisions range from muscle strains to herniated discs and vertebral fractures, and they are among the most commonly reported crash injuries. Because the back is central to nearly all movement, even a "minor" back injury can be debilitating. Many improve with conservative care, but some require injections or surgery. Average back-injury settlements range from $25,000 to $200,000+, and far higher when surgery or permanent impairment is involved.',
    stats:[{label:'Range',value:'Strain–Fracture'},{label:'Conservative Care',value:'6–12 wk'},{label:'Surgery',value:'Severe cases'},{label:'Avg Settlement',value:'$70K'}],
    keyFacts:[
      'Back injuries range from muscle strain to disc herniation and vertebral fracture',
      'The back is central to movement, so even "minor" injuries can be disabling',
      'MRI is often needed to reveal disc and soft-tissue damage',
      'Aggravation of a pre-existing back condition is compensable',
      'Chronic back pain is one of the most common lasting crash injuries'
    ],
    sections:[
      {title:'The Range of Back Injuries', content:[
        'A collision can injure the back in many ways: lumbar and thoracic strains, herniated or bulging discs, facet-joint injuries, and vertebral fractures. The lower back (lumbar spine) is especially vulnerable because it bears the body\'s weight and absorbs crash forces.',
        'Identifying the precise injury requires the right imaging. Strains may show nothing on a scan, while discs and fractures appear on MRI or CT — making a thorough specialist evaluation essential.'
      ]},
      {title:'Conservative Care vs. Surgery', content:[
        'Most back injuries are first treated conservatively — physical therapy, anti-inflammatories, and injections — over several weeks to months. The goal is to control pain and restore function while the tissue heals.',
        'When conservative care fails, or there is nerve compression or instability, surgery such as a discectomy or fusion may be required. Surgical cases and those with permanent restrictions are substantially higher in value.'
      ]},
      {title:'The Pre-Existing Condition Defense', content:[
        'Back problems are common, so insurers routinely argue a back injury was pre-existing. But the law is clear: if a crash aggravated a prior condition or made a quiet one symptomatic, the at-fault party is responsible for that change.',
        'Defeating this argument depends on documentation — prior records, the timing of new symptoms, and a physician\'s opinion connecting the current condition to the crash.'
      ]}
    ],
    symptoms:{ immediate:['Lower or mid-back pain','Stiffness and muscle spasm','Reduced range of motion','Pain with movement'], delayed:['Pain radiating into the legs (sciatica)','Numbness or tingling','Weakness in the legs','Worsening pain with sitting'], emergency:['Loss of bladder or bowel control','Progressive leg weakness or numbness','Saddle-area numbness (cauda equina)'] },
    treatment:[{name:'Imaging & evaluation',desc:'MRI or CT identifies disc, joint, or fracture injury; a specialist directs care.'},{name:'Physical therapy',desc:'Core strengthening and mobility work are the foundation of recovery.'},{name:'Injections',desc:'Epidural or facet injections reduce inflammation and can pinpoint the pain source.'},{name:'Surgery (when needed)',desc:'Discectomy, fusion, or decompression for nerve compression or instability.'}],
    recovery:[{phase:'Acute',time:'Week 1–3',desc:'Pain control and activity modification.'},{phase:'Conservative care',time:'Week 3–12',desc:'Physical therapy and injections; most improve here.'},{phase:'Decision point',time:'Month 3–6',desc:'Surgery considered if symptoms persist; recovery resets post-op.'},{phase:'Long-term',time:'6 months+',desc:'Chronic pain or permanent restrictions — a key value factor.'}],
    settlement:[{factor:'Injury severity',desc:'A fracture or surgical disc is worth far more than a strain.'},{factor:'Surgery & restrictions',desc:'Surgical cases and permanent limits drive the highest value.'},{factor:'Imaging correlation',desc:'MRI findings matched to symptoms defeat the pre-existing defense.'},{factor:'Chronic pain',desc:'Lasting back pain increases value through ongoing care.'},{factor:'Work impact',desc:'Lost ability to lift, sit, or perform a job raises economic damages.'}]
  },
  'neck-injury': {
    name:'Neck Injuries', slug:'neck-injury', category:'Neck & Soft Tissue', icon:'steth', sceneImg:'clinical',
    directAnswer:'Neck injuries from collisions range from whiplash and muscle strains to cervical disc herniations and, in severe cases, fractures. The neck is highly vulnerable in a crash because the head\'s momentum strains the cervical spine. Symptoms can be delayed, and severity varies widely. Average neck-injury settlements range from $15,000 to $150,000+ depending on whether discs or nerves are involved and whether symptoms become chronic.',
    stats:[{label:'Range',value:'Strain–Fracture'},{label:'Symptom Onset',value:'Hours–Days'},{label:'Chronic Risk',value:'Significant'},{label:'Avg Settlement',value:'$45K'}],
    keyFacts:[
      'Neck injuries range from whiplash to cervical disc herniation and fracture',
      'The head\'s momentum makes the neck especially vulnerable in a crash',
      'Symptoms are frequently delayed by hours to days',
      'Cervical disc and nerve involvement substantially raise claim value',
      'Chronic neck pain and headaches are common lasting effects'
    ],
    sections:[
      {title:'Why the Neck Is So Vulnerable', content:[
        'The cervical spine supports the head and allows its wide range of motion, but that flexibility is also a weakness. In a collision, the head\'s momentum whips the neck beyond its normal limits, straining or tearing the muscles, ligaments, and discs.',
        'Injuries range from soft-tissue whiplash to cervical disc herniation, nerve compression, and — in high-force crashes — fracture. Each requires different evaluation and carries different stakes.'
      ]},
      {title:'Delayed Symptoms and Documentation', content:[
        'Like whiplash, many neck injuries do not announce themselves at the scene. Adrenaline masks the pain, and stiffness and radiating symptoms build over the following hours to days.',
        'Prompt evaluation protects both health and the claim. When neurological symptoms — numbness, tingling, or arm weakness — are present, an MRI is needed to identify disc or nerve involvement that an X-ray cannot show.'
      ]},
      {title:'When Nerves Are Involved', content:[
        'Cervical disc herniations can compress nerve roots, causing radiculopathy — pain, numbness, or weakness radiating into the shoulder, arm, or hand. This nerve involvement is both more serious and more valuable in a claim.',
        'Documented nerve damage, confirmed by MRI and nerve studies, defeats the "minor soft-tissue" discount and supports the need for injections, ongoing care, or surgery.'
      ]}
    ],
    symptoms:{ immediate:['Neck pain and stiffness','Reduced range of motion','Headache','Muscle spasm'], delayed:['Pain radiating into the shoulder or arm','Numbness or tingling in the hands','Arm weakness','Persistent headaches'], emergency:['Numbness or weakness spreading down an arm','Loss of coordination','Severe neck pain after a high-speed crash'] },
    treatment:[{name:'Evaluation & imaging',desc:'X-ray rules out fracture; MRI identifies disc or nerve involvement.'},{name:'Physical therapy',desc:'Mobilization and strengthening restore motion and reduce pain.'},{name:'Pain management',desc:'Medication and cervical injections control pain and nerve inflammation.'},{name:'Surgery (severe cases)',desc:'Cervical discectomy or fusion for significant disc or nerve injury.'}],
    recovery:[{phase:'Acute',time:'Week 1–2',desc:'Peak pain and stiffness; symptom control and gentle motion.'},{phase:'Subacute',time:'Week 2–8',desc:'Physical therapy restores function for most patients.'},{phase:'Recovery / decision',time:'Month 2–6',desc:'Most recover; persistent nerve symptoms may lead to injections or surgery.'},{phase:'Chronic',time:'6 months+',desc:'Lasting pain or nerve symptoms — a major value factor.'}],
    settlement:[{factor:'Disc & nerve involvement',desc:'Cervical disc and nerve damage are worth far more than a simple strain.'},{factor:'Surgery',desc:'Cervical surgery dramatically raises claim value.'},{factor:'Chronic symptoms',desc:'Lasting pain and headaches increase value through ongoing care.'},{factor:'Objective findings',desc:'MRI and nerve studies counter the soft-tissue discount.'},{factor:'Functional impact',desc:'Effects on work and daily motion raise non-economic damages.'}]
  },
  'internal-injuries': {
    name:'Internal Injuries', slug:'internal-injuries', category:'Internal & Organ', icon:'alert', sceneImg:'scan',
    directAnswer:'Internal injuries — damage to organs and internal bleeding — are among the most dangerous crash injuries because they can be life-threatening yet invisible from the outside. The blunt force of a collision or a seatbelt can injure the spleen, liver, kidneys, lungs, or bowel. Symptoms may be delayed as bleeding builds, making any significant crash a reason for prompt evaluation. Settlements are high because of the severity, surgery, and risk involved — frequently $100,000 to $500,000+.',
    stats:[{label:'Danger',value:'Life-Threatening'},{label:'Onset',value:'Can Be Delayed'},{label:'Surgery',value:'Often Required'},{label:'Avg Settlement',value:'$175K+'}],
    keyFacts:[
      'Internal injuries can be life-threatening yet show no external signs',
      'Symptoms may be delayed as internal bleeding gradually builds',
      'Seatbelts save lives but can cause abdominal and chest injuries',
      'Any significant crash warrants prompt evaluation for internal injury',
      'These claims are high-value due to surgery, ICU care, and risk to life'
    ],
    sections:[
      {title:'The Hidden Danger', content:[
        'Internal injuries are uniquely dangerous because the damage is hidden. The blunt force of a collision — or the very seatbelt that saves a life — can rupture or bruise the spleen, liver, kidneys, lungs, intestines, or major blood vessels.',
        'Internal bleeding can build slowly, so a person may feel "okay" at the scene and deteriorate hours later. This is why any high-force crash, abdominal pain, or seatbelt bruising warrants immediate medical evaluation.'
      ]},
      {title:'Diagnosis and Emergency Treatment', content:[
        'Internal injuries are diagnosed with imaging (CT and ultrasound) and blood work. Significant organ damage or internal bleeding often requires emergency surgery and intensive-care monitoring.',
        'The stakes are immediate and high. Rapid diagnosis and treatment can be the difference between a full recovery and a fatal outcome — which is also why these injuries generate substantial medical records and claim value.'
      ]},
      {title:'Why These Claims Are High-Value', content:[
        'Internal-injury claims combine emergency surgery, ICU stays, extended recovery, and a genuine threat to life. The medical costs are high and the severity is undeniable, which insurers cannot easily discount.',
        'Some internal injuries lead to lasting consequences — organ removal (such as the spleen), ongoing complications, or permanent dietary and activity restrictions — that add long-term value to the claim.'
      ]}
    ],
    symptoms:{ immediate:['Abdominal or chest pain','Seatbelt bruising across the chest/abdomen','Dizziness or lightheadedness','Shortness of breath'], delayed:['Worsening abdominal pain or swelling','Deepening bruising','Blood in urine or stool','Fainting, rapid heartbeat, or pale clammy skin'], emergency:['Severe or spreading abdominal pain','Signs of shock (rapid pulse, confusion, pale skin)','Coughing or vomiting blood','Difficulty breathing'] },
    treatment:[{name:'Emergency imaging & diagnosis',desc:'CT, ultrasound, and blood work identify organ damage and internal bleeding.'},{name:'Emergency surgery',desc:'Surgery to repair organs or stop internal bleeding when needed.'},{name:'Intensive monitoring',desc:'ICU observation for bleeding, organ function, and complications.'},{name:'Recovery & follow-up',desc:'Extended recovery with monitoring for long-term organ effects.'}],
    recovery:[{phase:'Emergency',time:'Day 0–7',desc:'Diagnosis, surgery, and intensive-care stabilization.'},{phase:'Hospital recovery',time:'Week 1–4',desc:'Healing from surgery; monitoring for complications.'},{phase:'Recovery',time:'Month 1–6',desc:'Gradual return to activity; follow-up imaging and care.'},{phase:'Long-term',time:'6 months+',desc:'Possible permanent effects (e.g., organ loss) — a key value factor.'}],
    settlement:[{factor:'Severity & risk to life',desc:'The life-threatening nature of internal injuries supports high value.'},{factor:'Surgery & ICU care',desc:'Emergency surgery and intensive care generate substantial documented costs.'},{factor:'Organ loss',desc:'Removal of an organ (e.g., spleen) means permanent impact and higher value.'},{factor:'Lasting restrictions',desc:'Permanent dietary, activity, or health limits raise damages.'},{factor:'Complications',desc:'Infections or ongoing complications add to the claim.'}]
  },
  'shoulder-injury': {
    name:'Shoulder Injuries', slug:'shoulder-injury', category:'Joints & Extremities', icon:'shield', sceneImg:'clinical',
    directAnswer:'Shoulder injuries — rotator-cuff tears, labral tears, dislocations, and fractures — are common in collisions because the shoulder absorbs force from seatbelts, airbags, and bracing against the wheel. Many require physical therapy, and significant tears often need surgery followed by months of rehabilitation. Average shoulder-injury settlements range from $25,000 to $150,000+, with surgical cases at the higher end due to the long recovery and lasting restrictions.',
    stats:[{label:'Common Type',value:'Rotator Cuff'},{label:'Surgery',value:'Tears often need it'},{label:'Rehab',value:'4–6 mo'},{label:'Avg Settlement',value:'$55K'}],
    keyFacts:[
      'Rotator-cuff and labral tears are common shoulder injuries in collisions',
      'Seatbelts and bracing against the wheel transmit force to the shoulder',
      'MRI is usually required to diagnose tears, which X-rays miss',
      'Surgical repair is followed by months of rehabilitation',
      'Lasting loss of strength and motion increases claim value'
    ],
    sections:[
      {title:'How Shoulders Get Injured in Crashes', content:[
        'The shoulder is vulnerable in a collision from several directions: the seatbelt restrains the upper body, the arm braces against the wheel, and side impacts drive force directly into the joint. The result can be a rotator-cuff tear, labral tear, dislocation, or fracture.',
        'Because tears involve soft tissue, they do not appear on X-ray — MRI is required to diagnose them. As with other soft-tissue injuries, this gives insurers room to dispute the injury without proper imaging.'
      ]},
      {title:'Treatment and the Surgical Path', content:[
        'Minor shoulder injuries respond to physical therapy and anti-inflammatory care. But significant rotator-cuff and labral tears often require arthroscopic surgery to repair, followed by a lengthy rehabilitation.',
        'Shoulder rehabilitation is notably slow — full recovery from a surgical repair commonly takes four to six months or longer, with a gradual return of strength and range of motion.'
      ]},
      {title:'Lasting Impact', content:[
        'Shoulder injuries frequently leave lasting effects: reduced range of motion, weakness, and difficulty with overhead activities. For people whose work or daily life depends on shoulder function, this impact is significant.',
        'Documented permanent restrictions — by an orthopedic specialist — are central to the claim, representing both ongoing limitation and, often, an effect on the ability to work.'
      ]}
    ],
    symptoms:{ immediate:['Shoulder pain and weakness','Limited range of motion','Swelling or bruising','Pain with lifting or reaching'], delayed:['Worsening weakness over days','Pain at night or when lying on the shoulder','Clicking or catching in the joint','Difficulty with overhead motion'], emergency:['Visible deformity or dislocation','Numbness or no pulse in the arm','Complete inability to move the arm'] },
    treatment:[{name:'MRI & evaluation',desc:'MRI confirms rotator-cuff or labral tears that X-rays miss.'},{name:'Physical therapy',desc:'Strengthening and mobility work; the first line for many injuries.'},{name:'Arthroscopic surgery',desc:'Minimally invasive repair of significant tears.'},{name:'Post-surgical rehab',desc:'Months of structured therapy to restore strength and motion.'}],
    recovery:[{phase:'Acute',time:'Week 1–2',desc:'Pain and swelling control; protect the joint.'},{phase:'Conservative / pre-op',time:'Week 2–8',desc:'Physical therapy; surgery scheduled if a significant tear is confirmed.'},{phase:'Post-surgical rehab',time:'Month 1–6',desc:'Gradual, monitored return of motion and strength.'},{phase:'Long-term',time:'6 months+',desc:'Possible permanent weakness or restriction — a key value factor.'}],
    settlement:[{factor:'Tear severity & surgery',desc:'Surgical tears are far higher in value than minor strains.'},{factor:'Permanent restriction',desc:'Lasting loss of strength or overhead motion raises damages.'},{factor:'MRI documentation',desc:'Imaging of the tear counters the soft-tissue discount.'},{factor:'Rehab duration',desc:'A long, documented rehabilitation supports claim value.'},{factor:'Work impact',desc:'Effects on jobs requiring lifting or reaching raise economic damages.'}]
  }
});

CP.injuryOrder = ['whiplash','traumatic-brain-injury','herniated-disc','spinal-cord-injury','soft-tissue-injury','broken-bones','burn-injury','ptsd','back-injury','neck-injury','internal-injuries','shoulder-injury'];

/* per-type spoke registry */
CP.injurySpokes = [
  { slug:'symptoms', key:'symptoms', label:'Symptoms', tags:['AEO','VOICE'] },
  { slug:'treatment', key:'treatment', label:'Treatment', tags:['SEO','AEO'] },
  { slug:'recovery-timeline', key:'recovery', label:'Recovery Timeline', tags:['AEO','VOICE'] },
  { slug:'settlement-factors', key:'settlement', label:'Settlement Factors', tags:['AEO','COMPLY'] },
];

/* body-region map for the Symptom Matcher widget */
CP.bodyRegions = [
  { id:'head', label:'Head & Brain', injuries:['traumatic-brain-injury'] },
  { id:'neck', label:'Neck', injuries:['whiplash','neck-injury'] },
  { id:'spine', label:'Spine & Back', injuries:['herniated-disc','back-injury','spinal-cord-injury'] },
  { id:'shoulder', label:'Shoulders & Joints', injuries:['shoulder-injury'] },
  { id:'soft', label:'Muscles & Soft Tissue', injuries:['soft-tissue-injury'] },
  { id:'bones', label:'Bones / Fractures', injuries:['broken-bones'] },
  { id:'internal', label:'Chest & Abdomen', injuries:['internal-injuries'] },
  { id:'burns', label:'Skin / Burns', injuries:['burn-injury'] },
  { id:'mind', label:'Emotional / Mental', injuries:['ptsd'] },
];

