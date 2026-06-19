// @ts-nocheck
/* Ported verbatim from source resources.js — data fidelity, do not hand-edit. */
/* CasePort /accidents — ACTIONABLE RESOURCES
   Copy-paste scripts, per-state report agencies, per-city offices.
   The "found-nowhere-else, easy-to-implement" layer. */
import { CP } from "../_cp";

/* ---- Exact copy-paste scripts (universal, safe, precise) ---- */
CP.emailScripts = [
  {
    id:'preserve', icon:'camera', title:'Evidence Preservation Letter',
    why:'Send this within 24 hours to any nearby business, parking garage, or property that may have caught the crash on camera. Most systems overwrite footage in 72 hours.',
    to:'Send to: the business owner or manager (walk in or email)',
    subject:'URGENT: Preserve Video Footage — Incident on [DATE]',
    body:'To Whom It May Concern,\n\nOn [DATE] at approximately [TIME], a motor-vehicle accident occurred at or near [ADDRESS / INTERSECTION], which may have been recorded by your security or surveillance cameras.\n\nI am formally requesting that you preserve — and not delete, overwrite, or destroy — any and all video footage from [DATE] between [TIME RANGE, e.g. 2:00 PM and 3:00 PM]. This footage is material evidence in a personal-injury matter.\n\nPlease confirm in writing that the footage has been preserved, and let me know the process to obtain a copy. Many systems automatically overwrite within 72 hours, so your prompt action is critical.\n\nYou can reach me at [YOUR PHONE] or [YOUR EMAIL].\n\nThank you for your prompt attention.\n\n[YOUR FULL NAME]'
  },
  {
    id:'report', icon:'file', title:'Crash / Police Report Request',
    why:'Use this to obtain the official crash report — the single most important document in your claim. Send it to the records division of the agency that responded.',
    to:'Send to: the responding agency\'s Records Division (see your state\'s source below)',
    subject:'Request for Crash Report — Incident on [DATE]',
    body:'Dear Records Division,\n\nI am requesting a certified copy of the crash/police report for a motor-vehicle accident with the following details:\n\n• Date of accident: [DATE]\n• Location: [ADDRESS / INTERSECTION / HIGHWAY + MILE MARKER]\n• Report or incident number (if known): [NUMBER]\n• Parties involved: [YOUR NAME] and [OTHER DRIVER, if known]\n\nI am a party to this accident. Please advise the fee, accepted payment methods, and how the report will be delivered.\n\nMy contact information: [YOUR NAME], [ADDRESS], [PHONE], [EMAIL].\n\nThank you,\n[YOUR FULL NAME]'
  },
  {
    id:'insurer', icon:'shield', title:'Insurance "No Recorded Statement" Script',
    why:'Read or email this verbatim when the other driver\'s adjuster calls. You are not required to give a recorded statement or sign a blanket medical release — both are used to reduce your claim.',
    to:'Say to: the other driver\'s insurance adjuster',
    subject:'Re: Claim #[CLAIM NUMBER] — Communication Preference',
    body:'Thank you for reaching out. I am not providing a recorded statement at this time, and I do not consent to a blanket medical-records authorization.\n\nI am still under medical care and cannot evaluate any settlement until my treatment is complete. Please direct all further communication regarding this claim to me in writing at [YOUR EMAIL].\n\nI will authorize only the records directly related to injuries from this accident, for the relevant treatment dates.\n\nThank you.'
  },
  {
    id:'records', icon:'steth', title:'Medical Records Request',
    why:'Your medical records are the backbone of your claim value. Request the complete file — notes, imaging, and itemized billing — early.',
    to:'Send to: your treating provider\'s medical-records department',
    subject:'Medical Records Request — [YOUR NAME], DOB [DOB]',
    body:'To the Medical Records Department,\n\nI am requesting a complete copy of my medical records for treatment on and after [ACCIDENT DATE], including:\n\n• Physician and nursing notes\n• Imaging (X-ray, CT, MRI) and radiology reports\n• Test and lab results\n• An itemized billing statement\n\nPatient: [YOUR FULL NAME]\nDate of birth: [DOB]\nDates of service: [START] to [PRESENT]\n\nPlease send the records to [YOUR ADDRESS / EMAIL], or advise your release process and any fee.\n\nThank you,\n[YOUR FULL NAME]'
  }
];

/* ---- Per-state crash-report source (real agencies/systems) ---- */
CP.crashReport = {
  AL:{a:'Alabama Law Enforcement Agency (ALEA) — buycrash.com',h:'Order online via the ALEA crash portal or the responding police department.'},
  AK:{a:'Alaska DMV / Alaska State Troopers',h:'Request from the Alaska DMV or the responding trooper post.'},
  AZ:{a:'Arizona DOT / responding police department',h:'Request from the city police or DPS records unit that worked the crash.'},
  AR:{a:'Arkansas State Police — Crash Records',h:'Order through the Arkansas State Police records system or local PD.'},
  CA:{a:'California Highway Patrol (CHP) — Form CHP 190',h:'File CHP 190 with the CHP area office, or request from the local PD.'},
  CO:{a:'Colorado State Patrol / local police',h:'Order via the CSP or the city police records division.'},
  CT:{a:'Connecticut DOT / State Police (cspro portal)',h:'Use the Connecticut crash data portal or the responding department.'},
  DE:{a:'Delaware State Police — Traffic Records',h:'Request from DSP records or the responding municipal department.'},
  DC:{a:'DC Metropolitan Police Department (MPD) — Records',h:'Request from MPD\'s crash report unit (online or in person).'},
  FL:{a:'Florida DHSMV — Crash Portal',h:'Order from the FLHSMV crash report service or the responding agency.'},
  GA:{a:'Georgia DOT / responding police (GeorgiaCrashReports / BuyCrash)',h:'Order online via BuyCrash or from the responding department.'},
  HI:{a:'Honolulu PD / county police',h:'Request from the county police department\'s records section.'},
  ID:{a:'Idaho Transportation Department / ISP',h:'Request from ITD or the Idaho State Police records unit.'},
  IL:{a:'Illinois State Police / Chicago PD',h:'Order from ISP (out-of-city) or the responding municipal department.'},
  IN:{a:'Indiana State Police — buycrash.com',h:'Order online through the Indiana crash portal or local PD.'},
  IA:{a:'Iowa DOT — Crash Reports',h:'Request from the Iowa DOT or the responding department.'},
  KS:{a:'Kansas DOT / Highway Patrol',h:'Request from KDOT or the Kansas Highway Patrol.'},
  KY:{a:'Kentucky State Police — Open Portal',h:'Order via the KSP collision report portal or local PD.'},
  LA:{a:'Louisiana State Police / local sheriff',h:'Request from LSP records or the responding agency.'},
  ME:{a:'Maine Bureau of Highway Safety / State Police',h:'Request from the Maine State Police records unit.'},
  MD:{a:'Maryland State Police — Central Records',h:'Request from MSP Central Records or the responding department.'},
  MA:{a:'Massachusetts RMV / local police',h:'File the RMV operator report and request the police report locally.'},
  MI:{a:'Michigan State Police — TraCS / clemis',h:'Order via the Michigan crash portal or the responding department.'},
  MN:{a:'Minnesota DPS — Crash Records',h:'Request from MN DPS Driver & Vehicle Services or local PD.'},
  MS:{a:'Mississippi DPS / responding police',h:'Request from the responding department\'s records section.'},
  MO:{a:'Missouri State Highway Patrol — Records',h:'Order from MSHP records or the responding municipal department.'},
  MT:{a:'Montana Highway Patrol / DOJ',h:'Request from the Montana DOJ records or MHP.'},
  NE:{a:'Nebraska DOT — Crash Records',h:'Request from the Nebraska DOT or local police.'},
  NV:{a:'Nevada DPS / Las Vegas Metro PD',h:'Request from the responding agency\'s records bureau.'},
  NH:{a:'New Hampshire DMV / State Police',h:'Request from the NH DMV or State Police records.'},
  NJ:{a:'New Jersey State Police / local PD',h:'Order via the NJSP crash portal or the responding department.'},
  NM:{a:'New Mexico DOT / DPS',h:'Request from the responding department\'s records unit.'},
  NY:{a:'New York DMV — Form MV-198C',h:'Order online via the NY DMV crash report search, or file MV-198C.'},
  NC:{a:'North Carolina DMV — Form TR-67A',h:'Order from the NC DMV (DMV-349 report) or the responding agency.'},
  ND:{a:'North Dakota DOT — Crash Records',h:'Request from the ND DOT or responding police.'},
  OH:{a:'Ohio State Highway Patrol — Crash Retrieval',h:'Download free via the OSHP crash retrieval portal or local PD.'},
  OK:{a:'Oklahoma DPS — Crash Reports',h:'Order from the Oklahoma DPS records management division.'},
  OR:{a:'Oregon DMV — Crash Reporting',h:'Request from the Oregon DMV crash unit or the responding agency.'},
  PA:{a:'Pennsylvania State Police — Form SP 7-0015',h:'Mail Form SP 7-0015 to PSP, or request from the local department.'},
  RI:{a:'Rhode Island DMV / local police',h:'Request from the responding municipal police records division.'},
  SC:{a:'South Carolina DMV — Form FR-50',h:'Request from the SC DMV or the responding department.'},
  SD:{a:'South Dakota DPS — Accident Records',h:'Request from the SD DPS or the responding agency.'},
  TN:{a:'Tennessee DOS / responding police',h:'Order via the Tennessee crash portal or the local department.'},
  TX:{a:'Texas DOT — CRIS (Crash Records Information System)',h:'Order from the TxDOT CRIS portal (cris.dot.state.tx.us) or local PD.'},
  UT:{a:'Utah DPS — Crash Reports',h:'Request from the Utah DPS records division or local police.'},
  VT:{a:'Vermont DMV / State Police',h:'Request from the Vermont DMV or State Police records.'},
  VA:{a:'Virginia DMV — Form CRD 93 / State Police',h:'Order from the Virginia DMV or the responding department.'},
  WA:{a:'Washington State Patrol — Collision Records',h:'Order from the WSP collision records section or local PD.'},
  WV:{a:'West Virginia DMV / State Police',h:'Request from the responding department\'s records unit.'},
  WI:{a:'Wisconsin DOT — Crash Reports',h:'Order from the WisDOT crash report portal or local police.'},
  WY:{a:'Wyoming DOT / Highway Patrol',h:'Request from the WYDOT or the responding agency.'},
  _default:{a:'your state DMV or the responding police department',h:'Contact the records division of the police agency that worked your crash, or your state DMV.'}
};
CP.crashFor = function (abbr) { return CP.crashReport[abbr] || CP.crashReport._default; };
