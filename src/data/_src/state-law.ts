// @ts-nocheck
/* Ported verbatim from source state-law.js — data fidelity, do not hand-edit. */
/* CasePort /accidents — STATE LAW CONTENT (State Law Layer)
   Hand-authored depth for launch states. Other 47 states render from
   CP.stateData via a generator in pages-state.js (no thin pages, no 404s). */
import { CP } from "../_cp";

CP.stateLaw = {
  va: {
    statute_of_limitations: { title:'Time Matters in Virginia', subtitle:'Your claim has a deadline. Miss it and your case is permanently barred.',
      direct_answer:'In Virginia, you have 2 years from the date of your accident to file a personal injury lawsuit. This is the statute of limitations — a hard deadline set by state law. If you miss it, your claim is permanently barred, regardless of the strength of your case.',
      key_facts:[{label:'Deadline',value:'2 Years'},{label:'From Date',value:'Accident occurs'}],
      sections:[
        {title:'Why This Deadline Matters', content:"The statute of limitations is not a suggestion — it's a hard legal deadline. Once it passes, courts dismiss your case automatically, even with overwhelming evidence of negligence. The law values finality, and memories fade, evidence deteriorates, and witnesses become unavailable. It means you must act quickly."},
        {title:'When Does the Clock Start?', content:'The clock typically starts on the date of your accident. Exceptions: the discovery rule may start it when an injury is discovered (e.g., in malpractice); minor plaintiffs may not have the clock begin until they turn 18; and time a defendant spends out of state may not count toward the deadline.'},
        {title:'What Happens If You Miss the Deadline?', content:'If you file after the statute expires, the defendant files a motion to dismiss on statute-of-limitations grounds, and the court grants it. Your case is dismissed and you have no legal recourse, no matter how strong your claim.'}
      ] },
    fault_rules: { title:'Negligence & Fault Rules in Virginia', subtitle:'Understanding contributory negligence and how it affects your recovery.',
      direct_answer:'Virginia follows pure contributory negligence — one of the harshest rules in the country. If you are found even 1% at fault, you are barred from recovering any damages. You must be 0% at fault to recover. This makes early evidence preservation and careful communication critical.',
      key_facts:[{label:'Rule Type',value:'Pure Contributory'},{label:'Recovery Threshold',value:'0% fault only'}],
      sections:[
        {title:'How Contributory Negligence Works', content:'Under contributory negligence, if a jury finds you even 1% responsible for the accident, you recover nothing — even if the other party was 99% at fault. Virginia is one of only five jurisdictions (with MD, DC, NC, AL) that still applies this rule.'},
        {title:'Why This Matters for Your Case', content:'Because any fault eliminates recovery, insurance adjusters aggressively pursue evidence of shared fault — that you were speeding, distracted, or not wearing a seatbelt. This is why you should never admit fault at the scene and should let a representative handle all communications.'}
      ] },
    do_i_need_a_lawyer: { title:'Do You Need a Lawyer in Virginia?', subtitle:'Understanding when legal representation is essential.',
      direct_answer:"Because Virginia uses contributory negligence, legal representation is especially important. Insurance companies will argue you were even slightly at fault to bar your entire claim. Representation levels the playing field. You have the right to represent yourself, but the stakes of Virginia's 0%-fault rule are unusually high.",
      key_facts:[{label:'Complexity',value:'High'},{label:'Recommended',value:'Yes'}] },
    damage_caps: { title:'Damage Caps in Virginia', subtitle:'Understanding limits on compensation.',
      direct_answer:'Virginia has no cap on non-economic damages (pain and suffering) for most personal injury cases, and economic damages (medical bills, lost wages) are not capped. This is favorable to plaintiffs with significant injuries.',
      key_facts:[{label:'Non-Economic Cap',value:'None'},{label:'Economic Cap',value:'None'}] },
    statistics: { title:'Virginia Accident Statistics', subtitle:'Data-driven insights into accidents in Virginia.',
      direct_answer:'Virginia experiences approximately 250,000 motor vehicle accidents annually, resulting in over 3,000 fatalities and 150,000 injuries. These figures underscore the prevalence of accidents and the importance of understanding your legal rights.',
      key_facts:[{label:'Annual Accidents',value:'250,000+'},{label:'Annual Fatalities',value:'3,000+'}] },
  },
  md: {
    statute_of_limitations: { title:'Time Matters in Maryland', subtitle:'Your claim has a deadline. Miss it and your case is permanently barred.',
      direct_answer:'In Maryland, you have 3 years from the date of your accident to file a personal injury lawsuit. This is the statute of limitations — a hard deadline set by state law. If you miss it, your claim is permanently barred, regardless of the strength of your case.',
      key_facts:[{label:'Deadline',value:'3 Years'},{label:'From Date',value:'Accident occurs'}],
      sections:[
        {title:'Why This Deadline Matters', content:'The statute of limitations is a hard legal deadline. Once it passes, courts dismiss your case automatically, even with strong evidence of negligence. Acting early preserves both your legal rights and the evidence your claim depends on.'},
        {title:'When Does the Clock Start?', content:'The clock typically starts on the date of your accident. The discovery rule may delay the start where an injury was not immediately apparent, and claims involving minors may be tolled until the minor reaches the age of majority.'}
      ] },
    fault_rules: { title:'Negligence & Fault Rules in Maryland', subtitle:'Understanding contributory negligence and how it affects your recovery.',
      direct_answer:'Maryland follows contributory negligence with a bar rule. If you are found even 1% at fault, you are barred from recovering any damages. This is one of the harshest negligence rules in the country — you must be 0% at fault to recover.',
      key_facts:[{label:'Rule Type',value:'Contributory (Bar)'},{label:'Recovery Threshold',value:'0% fault only'}],
      sections:[
        {title:'The 1% Rule', content:'In Maryland, any fault on your part — even one percent — eliminates your entire recovery. Maryland is one of only five jurisdictions that still applies this rule, alongside Virginia, DC, North Carolina, and Alabama.'},
        {title:'Why Representation Is Critical Here', content:'Insurance companies in Maryland aggressively argue shared fault because they know even a sliver of fault bars your claim entirely. Never admit fault, and route all communication through a representative.'}
      ] },
    do_i_need_a_lawyer: { title:'Do You Need a Lawyer in Maryland?', subtitle:'Understanding when legal representation is essential.',
      direct_answer:'In Maryland, legal representation is critical. The contributory negligence bar rule means you must prove you were 0% at fault to recover anything. Insurance companies will aggressively argue you were partially at fault to bar your claim entirely. Representation is essential.',
      key_facts:[{label:'Complexity',value:'Very High'},{label:'Recommended',value:'Strongly Yes'}] },
    damage_caps: { title:'Damage Caps in Maryland', subtitle:'Understanding limits on compensation.',
      direct_answer:'Maryland caps non-economic damages (pain and suffering) under a statutory limit that adjusts annually — roughly $920,000 for most injury claims. Economic damages (medical bills, lost wages) are not capped.',
      key_facts:[{label:'Non-Economic Cap',value:'~$920K (adjusts)'},{label:'Economic Cap',value:'None'}] },
    statistics: { title:'Maryland Accident Statistics', subtitle:'Data-driven insights into accidents in Maryland.',
      direct_answer:'Maryland experiences approximately 150,000 motor vehicle accidents annually, resulting in over 1,500 fatalities and 100,000 injuries. These figures underscore the prevalence of accidents and the importance of understanding your legal rights.',
      key_facts:[{label:'Annual Accidents',value:'150,000+'},{label:'Annual Fatalities',value:'1,500+'}] },
  },
  dc: {
    statute_of_limitations: { title:'Time Matters in Washington, D.C.', subtitle:'Your claim has a deadline. Miss it and your case is permanently barred.',
      direct_answer:'In Washington, D.C., you have 3 years from the date of your accident to file a personal injury lawsuit. This is the statute of limitations — a hard deadline set by D.C. law. If you miss it, your claim is permanently barred, regardless of the strength of your case.',
      key_facts:[{label:'Deadline',value:'3 Years'},{label:'From Date',value:'Accident occurs'}],
      sections:[
        {title:'Why This Deadline Matters', content:'The statute of limitations is a hard legal deadline. Once it passes, D.C. courts dismiss your case automatically. Acting early preserves both your legal rights and the time-sensitive evidence your claim depends on.'},
        {title:'Shorter Deadlines for Government Claims', content:'Claims against the District government carry much shorter notice requirements — often a written notice within six months of the injury. Missing that notice window can bar a claim long before the three-year deadline.'}
      ] },
    fault_rules: { title:'Negligence & Fault Rules in Washington, D.C.', subtitle:'Understanding contributory negligence and how it affects your recovery.',
      direct_answer:'Washington, D.C. follows contributory negligence with a bar rule. If you are found even 1% at fault, you are barred from recovering any damages. This is one of the harshest rules in the country — you must be 0% at fault to recover. (D.C. provides limited comparative carve-outs for some pedestrian and cyclist cases.)',
      key_facts:[{label:'Rule Type',value:'Contributory (Bar)'},{label:'Recovery Threshold',value:'0% fault only'}],
      sections:[
        {title:'The 1% Rule in the District', content:'D.C. is one of only five jurisdictions that still applies pure contributory negligence. Even 1% fault eliminates your recovery. The District has carved out partial protections for vulnerable road users, but the default rule remains harsh.'},
        {title:'Vulnerable Road User Carve-Outs', content:'D.C. law provides limited comparative carve-outs for pedestrians and cyclists in collisions with vehicles, recognizing the vulnerability disparity. Whether the carve-out applies to your case depends on specific facts — a reason to seek guidance early.'}
      ] },
    do_i_need_a_lawyer: { title:'Do You Need a Lawyer in Washington, D.C.?', subtitle:'Understanding when legal representation is essential.',
      direct_answer:'In Washington, D.C., legal representation is critical. The contributory negligence bar rule means you must prove you were 0% at fault to recover anything, and government claims carry short notice windows. Insurance companies will aggressively argue partial fault. Representation is essential.',
      key_facts:[{label:'Complexity',value:'Very High'},{label:'Recommended',value:'Strongly Yes'}] },
    damage_caps: { title:'Damage Caps in Washington, D.C.', subtitle:'Understanding limits on compensation.',
      direct_answer:'Washington, D.C. has no cap on non-economic damages (pain and suffering) for most personal injury claims, and economic damages (medical bills, lost wages) are not capped. This is favorable to plaintiffs with significant injuries.',
      key_facts:[{label:'Non-Economic Cap',value:'None'},{label:'Economic Cap',value:'None'}] },
    statistics: { title:'Washington, D.C. Accident Statistics', subtitle:'Data-driven insights into accidents in Washington, D.C.',
      direct_answer:'Washington, D.C. experiences approximately 50,000 motor vehicle accidents annually, resulting in over 400 fatalities and 30,000 injuries. The dense urban environment elevates pedestrian and intersection collision risk.',
      key_facts:[{label:'Annual Accidents',value:'50,000+'},{label:'Annual Fatalities',value:'400+'}] },
  },
  ga: {
    statute_of_limitations: { title:'Time Matters in Georgia', subtitle:'Your claim has a deadline. Miss it and your case is permanently barred.',
      direct_answer:'In Georgia, you have 2 years from the date of your accident to file a personal injury lawsuit. This is the statute of limitations — a hard deadline set by state law. If you miss it, your claim is permanently barred, regardless of the strength of your case.',
      key_facts:[{label:'Deadline',value:'2 Years'},{label:'From Date',value:'Accident occurs'}],
      sections:[
        {title:'Why This Deadline Matters', content:'The statute of limitations is a hard legal deadline. Once it passes, Georgia courts dismiss your case automatically. With a 2-year window, Georgia gives you less time than many people assume — act early.'},
        {title:'When Does the Clock Start?', content:'The clock typically starts on the date of your accident. The discovery rule may delay the start where an injury was not immediately apparent, and claims involving minors may be tolled until the minor reaches the age of majority.'}
      ] },
    fault_rules: { title:'Negligence & Fault Rules in Georgia', subtitle:'Understanding modified comparative negligence and how it affects your recovery.',
      direct_answer:'Georgia follows modified comparative negligence with a 50% bar. You can recover only if you are less than 50% at fault. If you are 50% or more at fault, you recover nothing. Your recovery is reduced by your percentage of fault.',
      key_facts:[{label:'Rule Type',value:'Modified Comparative'},{label:'Recovery Threshold',value:'Less than 50% fault'}],
      sections:[
        {title:'How the 50% Bar Works', content:'A jury assigns each party a percentage of fault. If you are under 50% at fault, you recover, reduced by your share. If you were 30% at fault on a $100,000 claim, you recover $70,000. At 50% or more, you recover nothing.'},
        {title:'Why Adjusters Push You Toward 50%', content:'Because the 50% threshold is a hard cliff, insurance adjusters work to establish that you were at least half responsible. Strong evidence and witness statements are critical to keeping your assigned fault below the bar.'}
      ] },
    do_i_need_a_lawyer: { title:'Do You Need a Lawyer in Georgia?', subtitle:'Understanding when legal representation is essential.',
      direct_answer:'In Georgia, legal representation is important. The modified comparative rule means you must keep your assigned fault below 50% to recover anything, and insurers will argue you crossed that line. Representation significantly increases your chances of recovery.',
      key_facts:[{label:'Complexity',value:'High'},{label:'Recommended',value:'Yes'}] },
    damage_caps: { title:'Damage Caps in Georgia', subtitle:'Understanding limits on compensation.',
      direct_answer:"Georgia's recent tort reform (Senate Bill 68) introduced new limits affecting non-economic damages and trial procedure. Economic damages (medical bills, lost wages) are not capped. Because these rules are newly changed, early legal guidance is especially valuable.",
      key_facts:[{label:'Non-Economic',value:'SB 68 limits'},{label:'Economic Cap',value:'None'}] },
    statistics: { title:'Georgia Accident Statistics', subtitle:'Data-driven insights into accidents in Georgia.',
      direct_answer:'Georgia experiences approximately 350,000 motor vehicle accidents annually, resulting in over 4,000 fatalities and 200,000 injuries. These figures underscore the prevalence of accidents and the importance of understanding your legal rights.',
      key_facts:[{label:'Annual Accidents',value:'350,000+'},{label:'Annual Fatalities',value:'4,000+'}] },
  },
};

/* state-law topic registry */
CP.stateLawTopics = [
  { slug:'statute-of-limitations', key:'statute_of_limitations', label:'Statute of Limitations', tags:['GEO','AEO','COMPLY'] },
  { slug:'fault-rules', key:'fault_rules', label:'Fault Rules', tags:['AEO','SEO'] },
  { slug:'do-i-need-a-lawyer', key:'do_i_need_a_lawyer', label:'Do I Need a Lawyer', tags:['AEO','CONV','COMPLY'] },
  { slug:'damage-caps', key:'damage_caps', label:'Damage Caps', tags:['AEO','COMPLY'] },
  { slug:'statistics', key:'statistics', label:'Accident Statistics', tags:['DATA','AEO','GEO'] },
];
