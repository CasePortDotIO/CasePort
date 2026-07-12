// @ts-nocheck
/* Ported verbatim from source pages-state.js (genStateLaw + stateLawFor) — data fidelity. */
import { CP } from "../_cp";

/* Generate a full state-law content object from raw stateData (for the 47
   states without hand-authored depth). Mirrors CP.stateLaw[key] shape. */
CP.genStateLaw = function (abbr) {
  var s = CP.stateData[abbr];
  var yrs = s.statuteYears, name = s.name;
  var ruleHow = {
    'pure-contributory': name+' follows pure contributory negligence — one of the harshest rules in the country. If you are found even 1% at fault, you are barred from recovering any damages. You must be 0% at fault to recover.',
    'modified-50': name+' follows modified comparative negligence with a 50% bar. You can recover only if you are less than 50% at fault. At 50% or more, you recover nothing, and your recovery is reduced by your percentage of fault.',
    'modified-51': name+' follows modified comparative negligence with a 51% bar. You can recover as long as you are not more than 50% at fault. At 51% or more, you recover nothing, and your recovery is reduced by your share of fault.',
    'pure-comparative': name+' follows pure comparative negligence. You can recover even if you are mostly at fault — your recovery is simply reduced by your percentage of fault. This is the most favorable standard for injured parties.'
  };
  /* worked fault example with this state's actual rule and numbers */
  var ex = (function () {
    var verdict = 100;
    if (s.rule === 'pure-contributory') return 'Suppose a jury values your '+name+' claim at $100,000 but finds you 10% at fault. Under '+name+'\u2019s contributory rule, you recover <b>$0</b> — the same as if you were 99% at fault. Only a finding of 0% fault lets you recover the full $100,000. This all-or-nothing line is why even a small admission ("I looked down for a second") can end a claim.';
    if (s.rule === 'pure-comparative') return 'Suppose a jury values your '+name+' claim at $100,000 and finds you 30% at fault. Under '+name+'\u2019s pure comparative rule, your award is reduced by your share — you recover <b>$70,000</b>. Even at 80% fault you would still recover $20,000. Recovery is reduced, never eliminated.';
    var barText = s.rule === 'modified-50' ? '50% or more' : '51% or more';
    var safe = s.rule === 'modified-50' ? '49%' : '50%';
    return 'Suppose a jury values your '+name+' claim at $100,000 and finds you 20% at fault. Under '+name+'\u2019s modified rule, you recover your share-reduced amount: <b>$80,000</b>. But cross the bar — '+barText+' at fault — and you recover <b>$0</b>. At exactly '+safe+' fault you still recover; one point further and you get nothing. That cliff is what adjusters push you toward.';
  })();
  var capDetail = /no cap/i.test(s.damageCap)
    ? name+' does not cap compensatory damages in typical injury cases. Your economic damages (medical bills, lost wages, future care) and non-economic damages (pain, suffering, loss of enjoyment) are recoverable in full, limited only by the evidence you can document and the available insurance. The practical ceiling is usually the at-fault party\u2019s policy limits plus your own underinsured-motorist coverage.'
    : 'In '+name+', the operative limit is: '+s.damageCap+'. Caps like this apply to non-economic damages (pain and suffering) rather than to economic losses such as medical bills and lost wages, which remain fully recoverable. Because a cap can dramatically change the value of a severe-injury claim, documenting every dollar of economic loss becomes even more important where a cap applies.';
  return {
    statute_of_limitations: { title:'Time Matters in '+name, subtitle:'Your claim has a deadline. Miss it and your case is permanently barred.',
      direct_answer:'In '+name+', you have '+yrs+' year'+(yrs>1?'s':'')+' from the date of your accident to file a personal injury lawsuit. This is the statute of limitations — a hard deadline set by state law. If you miss it, your claim is permanently barred, regardless of the strength of your case.',
      key_facts:[{label:'Deadline',value:yrs+' Year'+(yrs>1?'s':'')},{label:'From Date',value:'Accident occurs'}],
      sections:[
        {title:'Why This Deadline Matters', content:'The statute of limitations is a hard legal deadline. Once it passes, courts in '+name+' dismiss your case automatically, even with overwhelming evidence of negligence — the defendant simply files a motion to dismiss and the court must grant it. The law values finality: memories fade, evidence degrades, and witnesses move away. For you, the practical meaning is simple — the '+yrs+'-year window is the outer limit, not a target. Acting early preserves both your legal rights and the time-sensitive evidence your claim depends on.'},
        {title:'When the Clock Starts — and the Exceptions', content:'The clock typically starts on the date of your accident ('+s.statuteNote+'). Several exceptions can shift that date. The discovery rule may delay the start where an injury was not immediately apparent — for example, an internal injury or a condition diagnosed weeks later. Claims involving minors are often tolled until the child reaches the age of majority. And if the at-fault party leaves the state, that absence may not count against your window. These exceptions are narrow and fact-specific, so you should never assume one applies without confirming it.'},
        {title:'The Shorter Deadlines Most People Miss', content:'The '+yrs+'-year period applies to typical injury claims, but '+name+' imposes far shorter deadlines in specific situations. Claims against a government entity — a city bus, a state-maintained road, a public employee — usually require formal written notice within months, not years, and missing that notice bars the claim entirely. Medical-malpractice and wrongful-death claims can run on different clocks. If any government vehicle or property was involved in your accident, treat the deadline as urgent and confirm it immediately.'}
      ] },
    fault_rules: { title:'Negligence & Fault Rules in '+name, subtitle:'Understanding '+s.label+' and how it affects your recovery.',
      direct_answer:ruleHow[s.rule]+' Your fault threshold: '+s.faultThreshold+'.',
      key_facts:[{label:'Rule Type',value:s.label},{label:'Threshold',value:s.faultThreshold.split('—')[0].trim()}],
      sections:[
        {title:'How '+s.label+' Works in '+name, content:ruleHow[s.rule]+' The key question in every claim is what percentage of fault, if any, gets assigned to you — because that number is applied to your recovery before you ever see a dollar.'},
        {title:'A Worked Example', content:ex},
        {title:'Why Adjusters Fight Over Your Fault Percentage', content:'Because the fault percentage directly controls your payout, the insurance adjuster\u2019s entire strategy is to raise yours. Expect questions designed to manufacture shared fault: whether you were a few miles over the limit, glanced at your phone, could have braked sooner, or weren\u2019t wearing a seatbelt. In '+name+', where the rule is '+s.label.toLowerCase()+', every percentage point matters'+(CP.negSeverity(s.rule)>=4?' — and a single point can erase the entire claim':'')+'. The defenses are predictable, which is exactly why preserved evidence (the police report, photos, witness statements, and camera footage) is decisive: objective proof of how the crash happened is what keeps your assigned fault low.'}
      ] },
    do_i_need_a_lawyer: { title:'Do You Need a Lawyer in '+name+'?', subtitle:'Understanding when legal representation is essential.',
      direct_answer:'You have the right to represent yourself, but legal representation significantly improves outcomes in '+name+'. Insurance companies are sophisticated and use the state\'s '+s.label.toLowerCase()+' rule to minimize your recovery. A representative levels the playing field — especially where the fault rule is unforgiving.',
      key_facts:[{label:'Complexity',value:CP.negSeverity(s.rule)>=3?'Very High':'High'},{label:'Recommended',value:'Yes'}],
      sections:[
        {title:'When You Can Probably Handle It Yourself', content:'Not every accident needs a lawyer. If your '+name+' crash caused only minor vehicle damage, you had no injuries (and none appeared in the days after), and fault is clearly on the other driver, you may be able to resolve a property-damage-only claim directly with the insurer. The threshold question is injury: the moment you have medical treatment, missed work, or any lasting symptom, the stakes and complexity rise sharply.'},
        {title:'When Representation Changes the Outcome', content:'Representation matters most when there are real injuries, disputed or shared fault, or an insurer disputing your claim. In '+name+', the '+s.label.toLowerCase()+' rule means the other side is actively building a case that you were partly to blame'+(CP.negSeverity(s.rule)>=4?', and here even a sliver of fault eliminates everything':'')+'. A representative handles the adjuster, documents your damages fully (including future care and lost earning capacity), and counters the fault narrative with evidence. Studies of injury claims consistently find represented claimants net more even after fees, because first offers run far below true value.'},
        {title:'What It Costs You', content:'Personal-injury representation is typically contingency-based — there is no upfront fee, and the representative is paid a percentage only if you recover. That structure means the cost of asking is essentially zero, while the cost of navigating '+name+'\u2019s fault rule alone, against a trained adjuster, can be your entire claim. A free case review carries no obligation and simply tells you where you stand.'}
      ] },
    damage_caps: { title:'Damage Caps in '+name, subtitle:'Understanding limits on compensation.',
      direct_answer:'In '+name+', the rule on damage caps is: '+s.damageCap+'. Economic damages — medical bills and lost wages — are generally recoverable in full; caps, where they exist, typically apply to non-economic damages.',
      key_facts:[{label:'Cap Rule',value:/no cap/i.test(s.damageCap)?'No cap':'Limited'},{label:'Economic Cap',value:'None'}],
      sections:[
        {title:'Economic vs. Non-Economic Damages', content:'Every injury claim has two kinds of damages. Economic damages are your documented out-of-pocket losses — medical bills, future medical care, lost wages, and lost earning capacity. Non-economic damages compensate the human cost: pain, suffering, disfigurement, and loss of enjoyment of life. '+name+' treats them differently for caps, which is why understanding the split matters for your claim\u2019s value.'},
        {title:'How the Cap Works in '+name, content:capDetail},
        {title:'Why Documentation Is Your Leverage', content:'Whether or not a cap applies, the value you actually recover is driven by what you can prove. Economic damages are anchored by records — bills, pay stubs, and an expert\u2019s projection of future costs. Non-economic damages are harder to quantify, so they are built from the documented story of your injury: treatment notes, a journal of daily limitations, and testimony about how the injury changed your life. In '+name+', thorough documentation is what turns a lowball offer into full value'+(/no cap/i.test(s.damageCap)?', and with no cap to limit it, the ceiling is set by your evidence':'')+'.'}
      ] },
    statistics: { title:name+' Accident Statistics', subtitle:'Data-driven insights into accidents in '+name+'.',
      direct_answer:name+' has an average accident settlement of about $'+s.avgSettlement+'K and a median jury verdict near $'+s.medianJuryVerdict+'K. Roughly '+s.uninsuredRate+'% of drivers are uninsured, and the state\'s fatal crash rate is '+s.fatalCrashRate+' per 100,000 residents. The leading reported cause of accidents is '+s.topCause.toLowerCase()+'.',
      key_facts:[{label:'Avg Settlement',value:'$'+s.avgSettlement+'K'},{label:'Uninsured Rate',value:s.uninsuredRate+'%'}],
      sections:[
        {title:'What the Settlement Numbers Mean', content:'The average '+name+' settlement of roughly $'+s.avgSettlement+'K and median jury verdict near $'+s.medianJuryVerdict+'K are useful reference points, but no average predicts an individual claim. Value is driven by injury severity, the clarity of fault under '+name+'\u2019s '+s.label.toLowerCase()+' rule, the available insurance, and how well the damages are documented. A minor soft-tissue claim and a catastrophic-injury claim both sit inside that "average," which is why the number is a starting point, not an estimate.'},
        {title:'The Uninsured-Driver Problem', content:'About '+s.uninsuredRate+'% of '+name+' drivers carry no insurance — '+(s.uninsuredRate>14?'one of the higher rates in the country':s.uninsuredRate<9?'lower than the national average':'close to the national average')+'. That matters enormously, because if an uninsured driver hits you, your own uninsured/underinsured-motorist (UM/UIM) coverage may be the only source of recovery. Reviewing your own policy for UM/UIM limits is one of the most overlooked protective steps a '+name+' driver can take.'},
        {title:'Road Risk in Context', content:name+'\u2019s fatal crash rate of '+s.fatalCrashRate+' per 100,000 residents, with '+s.topCause.toLowerCase()+' as the leading reported cause, reflects the real-world conditions behind these claims. These figures are drawn from public safety and insurance data and are re-checked each quarter, but they describe populations, not your specific crash. Use them to understand the landscape — then rely on the facts of your own accident, properly documented, to establish your claim.'}
      ] },
  };
};

CP.stateLawFor = function (abbr) {
  var key = abbr.toLowerCase();
  var gen = CP.genStateLaw(abbr);
  var hand = CP.stateLaw[key];
  if (!hand) return gen;
  /* merge: hand-authored wins, but backfill any topic missing rich sections from the generator */
  var merged = {};
  Object.keys(gen).forEach(function (topic) {
    var h = hand[topic];
    if (!h) { merged[topic] = gen[topic]; return; }
    merged[topic] = h;
    if (!h.sections || h.sections.length < 2) { merged[topic] = Object.assign({}, h, { sections: gen[topic].sections }); }
  });
  return merged;
};
