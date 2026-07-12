"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState, useCallback } from "react";
import { CITIES, STATE_SOL, TYPE_ICONS, NATIONWIDE, PROVIDERS, SA, ACTIVE } from "./data";

type FD = Record<string, any>;
type Provider = { n: string; t: string; c: string };

const PM: Record<string, [number, number]> = {
  s1: [1, 1], "s-else": [1, 1], s2: [1, 2], s3: [1, 3], s4: [1, 4], "s-comp-neg": [1, 4],
  s5: [2, 1], "s-med-soft": [2, 1], "s-await": [2, 1], s5b: [2, 2], s5c: [2, 2],
  s6: [2, 3], s7: [2, 3], s8: [2, 4],
  s9: [3, 1], s9b: [3, 1], s10: [3, 2], s11: [3, 3], s12: [3, 4], "s-urgency": [3, 4],
  s13: [4, 1], s14: [4, 2], "s-otp": [4, 2], s14b: [4, 2], s15: [4, 3], s16: [4, 4],
  "s-off-recovery": [0, 0],
};
const TOAST_SKIP = ["s1", "s-confirm", "s-off", "s-off-atty", "s-off-settled", "s-off-recovery", "s-await-thanks", "s-med-soft", "s-await", "s-comp-neg", "s-else"];
const TOAST_MSGS: Record<string, string> = { s2: "Incident noted.", s3: "Date recorded.", s4: "Location confirmed.", s5: "Liability noted.", s5b: "Almost there.", s5c: "Treatment recorded.", s6: "Treatment types noted.", s7: "Recency noted.", s8: "Injuries noted.", s9: "Impact logged.", s9b: "Insurance status noted.", s10: "Coverage noted.", s11: "Report status saved.", s12: "Attorney status confirmed.", "s-urgency": "Urgency noted.", s13: "Situation noted.", s14: "Name saved.", s14b: "Number verified.", s15: "Contact time saved.", s16: "Almost done." };
const TERMINAL = ["s-confirm", "s-off", "s-off-atty", "s-off-settled", "s-off-recovery", "s-await-thanks"];
const NO_BACK = ["s1", ...TERMINAL];
const DRAFT_KEY = "cp_intake_draft";
const DRAFT_TTL = 72 * 60 * 60 * 1000;

const STATES_LIST = ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const initialFd = (): FD => ({
  incidentType: null, specialFlag: null, incidentDate: null, incidentDaysSince: null, solFlag: false, solExpired: false,
  incidentState: null, incidentCity: null, inMarket: null, outOfMarket: false,
  liabilityStatus: null, liabilityFlag: null, compNegFlag: false,
  medicalTreatment: null, treatmentLevel: null, treatmentTypes: [], treatmentSeveritySignal: null,
  providerName: null, providerType: null, providerCity: null, providerUnknown: false, treatmentOngoing: null,
  awaitingTreatment: false, treatmentRecency: null, injuryTypes: [], injurySeverityIndex: 0,
  lifeImpact: null, impactLevel: null, atFaultInsurance: null, ownUMCoverage: null, recoveryRisk: null,
  reportFiled: null, priorAttorney: false, priorSettlement: false, urgencyLevel: null,
  firstName: null, phone: null, email: null, phoneVerified: false,
  preferredContactTime: [], consentGiven: false, hipaaSignature: null, caseScore: 0, routingStatus: null,
  uploadedFiles: [],
});

const fmtSecs = (s: number) =>
  s >= 3600
    ? `${String(Math.floor(s / 3600)).padStart(2, "0")}:${String(Math.floor((s % 3600) / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`
    : `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
const genId = () => { const d = new Date(); return `CP-${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`; };

export function CheckMyCase() {
  const [cur, setCur] = useState("s1");
  const [hist, setHist] = useState<string[]>(["s1"]);
  const [back, setBack] = useState(false);
  const fd = useRef<FD>(initialFd());
  const [, force] = useState(0);
  const rerender = () => force((n) => n + 1);
  const [toast, setToast] = useState<string | null>(null);
  const [draftBanner, setDraftBanner] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ---- draft ----
  const saveDraft = useCallback((c: string, h: string[]) => {
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify({ fd: fd.current, cur: c, hist: h, savedAt: Date.now() })); } catch {}
  }, []);
  const loadDraft = () => {
    try { const raw = localStorage.getItem(DRAFT_KEY); if (!raw) return null; const d = JSON.parse(raw); if (Date.now() - d.savedAt > DRAFT_TTL) { localStorage.removeItem(DRAFT_KEY); return null; } return d; } catch { return null; }
  };
  const clearDraft = () => { try { localStorage.removeItem(DRAFT_KEY); } catch {} };

  const goTo = useCallback((id: string, opts?: { back?: boolean }) => {
    const isBack = !!opts?.back;
    setBack(isBack);
    setCur(id);
    setHist((h) => (isBack ? h : [...h, id]));
    if (!isBack && !TOAST_SKIP.includes(id)) {
      setToast(TOAST_MSGS[id] || "Got it.");
      if (toastTimer.current) clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(() => setToast(null), 1800);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
    const noSave = ["s-confirm", "s-off", "s-off-atty", "s-off-settled", "s-await-thanks"];
    if (!noSave.includes(id)) setHist((h) => { saveDraft(id, isBack ? h : [...h]); return h; });
    rerender();
  }, [saveDraft]);

  const goBack = () => {
    setHist((h) => { if (h.length <= 1) return h; const nh = h.slice(0, -1); goTo(nh[nh.length - 1], { back: true }); return nh; });
  };
  const restart = () => { clearDraft(); fd.current = initialFd(); setHist(["s1"]); setBack(false); setCur("s1"); rerender(); window.scrollTo({ top: 0, behavior: "smooth" }); };

  useEffect(() => {
    const d = loadDraft();
    if (d && d.cur && d.cur !== "s1" && d.cur !== "s-confirm") setDraftBanner(true);
  }, []);

  const resumeDraft = () => { const d = loadDraft(); if (!d) return; fd.current = { ...initialFd(), ...d.fd }; setHist(d.hist || ["s1"]); setDraftBanner(false); setBack(false); setCur(d.cur); rerender(); };
  const discardDraft = () => { clearDraft(); setDraftBanner(false); };

  // ---- progress ----
  const info = PM[cur];
  const done = TERMINAL.includes(cur);
  const segW = (i: number) => (done ? "100%" : !info ? "0%" : i < info[0] ? "100%" : i === info[0] ? `${(info[1] / 4) * 100}%` : "0%");

  // ---- selection helpers ----
  const set = (k: string, v: any) => { fd.current[k] = v; };
  const pick = (field: string, val: any, next: string, dbv?: any) => { set(field, dbv !== undefined ? dbv : val); setTimeout(() => goTo(next), 320); };
  const [, setSelTick] = useState(0);
  const selectNow = (id: string) => { setSel(id); setSelTick((n) => n + 1); };
  const [sel, setSel] = useState<string>("");

  return (
    <>
      {toast && <div className="momentum-toast show" id="momentumToast"><span className="momentum-toast-check">✓</span><span>{toast}</span></div>}
      <div className="progress-rail">
        {[1, 2, 3, 4].map((i) => (<div className="seg" key={i}><div className="seg-fill" style={{ width: segW(i) }}></div></div>))}
      </div>
      <nav className="nav">
        <a href="/" className="nav-brand"><div className="nav-mark">CASEPORT</div><div className="nav-tag">Check My Case</div></a>
        <div className="nav-secure">🔒 Encrypted &amp; private</div>
      </nav>
      <button className={"back-btn" + (NO_BACK.includes(cur) ? "" : " visible")} onClick={goBack} aria-label="Go back">←</button>

      <div className="shell">
        <div className="form-wrap">
          {/* Screens rendered via the Screens map */}
          <Screens cur={cur} back={back} fd={fd} goTo={goTo} pick={pick} sel={sel} selectNow={selectNow} restart={restart} draftBanner={draftBanner} resumeDraft={resumeDraft} discardDraft={discardDraft} clearDraft={clearDraft} rerender={rerender} />
        </div>
      </div>

      {!done && (
        <div className="sticky-phone" id="stickyPhone">
          <div className="sticky-trust"><span>🔒 Private</span><span style={{ color: "var(--border)" }}>·</span><span>No cost to you</span><span style={{ color: "var(--border)" }}>·</span><span>ABA compliant</span></div>
          <div className="sticky-phone-link"><a href="tel:+18002273669">📞 1-800-CASE-NOW</a></div>
        </div>
      )}
    </>
  );
}

/* ============================================================
   SCREENS — all rendered; visibility via .active class
   ============================================================ */
function Screens(props: any) {
  const { cur, back, fd, goTo, pick, sel, selectNow, restart, draftBanner, resumeDraft, discardDraft, clearDraft, rerender } = props;
  const cls = (id: string) => "screen" + (cur === id ? " active" + (back ? " back" : "") : "");

  // local UI state
  const [, force] = useState(0); const tick = () => force((n) => n + 1);
  const f = fd.current as FD;

  const clr = (id: string) => { selectNow(id); };

  // ---------- incident ----------
  const pickIncident = (val: string, special?: string) => { f.incidentType = val; if (special) f.specialFlag = special; selectNow("inc:" + val); setTimeout(() => goTo("s2"), 320); };

  // ---------- date ----------
  const [month, setMonth] = useState(""); const [day, setDay] = useState(""); const [year, setYear] = useState("");
  const [dateErr, setDateErr] = useState(""); const [solCallout, setSolCallout] = useState<React.ReactNode>(null);
  const validateDate = () => {
    if (!month || !year) { setDateErr("Please select at least a month and year."); return; }
    setDateErr("");
    const incDate = new Date(+year, +month - 1, +(day || 1));
    const days = Math.floor((Date.now() - incDate.getTime()) / 86400000);
    f.incidentDate = `${year}-${String(month).padStart(2, "0")}-${String(day || 1).padStart(2, "0")}`;
    f.incidentDaysSince = days;
    const solYears = (STATE_SOL as any)[f.incidentState] || 2;
    const solDays = solYears * 365;
    f.solFlag = days > solDays * 0.75; f.solExpired = days > solDays;
    const deadline = new Date(incDate); deadline.setFullYear(deadline.getFullYear() + solYears);
    const daysLeft = Math.floor((deadline.getTime() - Date.now()) / 86400000);
    if (f.solFlag || f.solExpired) {
      const isExp = f.solExpired;
      setSolCallout(
        <div className={"sol-callout " + (isExp ? "danger" : "warning")}>
          <div className="sol-callout-kicker">{isExp ? "⚠️ Filing deadline concern" : "⏱ Filing window"}</div>
          <div className="sol-callout-title">{isExp ? "Your filing window may have closed." : `Approximately ${Math.max(0, daysLeft)} days remaining to file.`}</div>
          <div className="sol-callout-body">{isExp ? `In most states the limit is ${solYears} year${solYears > 1 ? "s" : ""}. However, exceptions exist — your attorney will confirm whether options remain.` : `Your deadline is approximately ${deadline.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}. Acting now gives your case the strongest position.`}</div>
        </div>
      );
    } else setSolCallout(null);
    goTo("s3");
  };

  // ---------- location ----------
  const [stateVal, setStateVal] = useState(""); const [cityVal, setCityVal] = useState(""); const [stateErr, setStateErr] = useState("");
  const [cityOpen, setCityOpen] = useState(false);
  const cityList: string[] = (CITIES as any)[stateVal] || [];
  const onStateChange = (s: string) => { setStateVal(s); setCityVal(""); f.incidentState = s; };
  const citySugg = (() => { const q = cityVal.toLowerCase(); if (!q) return cityList.slice(0, 6); const sw = cityList.filter((c) => c.toLowerCase().startsWith(q)); const fz = cityList.filter((c) => c.toLowerCase().includes(q) && !sw.includes(c)); return [...sw, ...fz].slice(0, 8); })();
  const validateLocation = () => { if (!stateVal) { setStateErr("Please select a state."); return; } setStateErr(""); f.incidentState = stateVal; f.incidentCity = cityVal.trim() || null; const abbr = (SA as any)[stateVal] || ""; f.inMarket = (ACTIVE as any).includes(abbr); f.outOfMarket = !f.inMarket; goTo("s4"); };

  // ---------- branching pickers ----------
  const pickLiability = (v: string, flag: string) => { f.liabilityStatus = v; f.liabilityFlag = flag; selectNow("liab:" + v); setTimeout(() => goTo(flag === "no" ? "s-comp-neg" : "s5"), 320); };
  const pickCompNeg = (v: string) => { selectNow("cn:" + v); setTimeout(() => { if (v === "no") showRecovery("s-off", "Many people aren't sure who was at fault right after an accident. Even if you think it was your fault, another party may share responsibility. Are you certain no one else played any role in what happened?"); else { f.liabilityFlag = v === "yes" ? "confirmed" : "unsure"; f.compNegFlag = true; goTo("s5"); } }, 320); };
  const pickMedical = (v: string, level: string) => { f.medicalTreatment = v; f.treatmentLevel = level; selectNow("med:" + v); setTimeout(() => goTo(level === "none" ? "s-med-soft" : "s5b"), 320); };
  const noPainPath = () => { f.impactLevel = "minor"; showRecovery("s9", "Personal injury cases can include property damage, future medical costs, and injuries that haven't appeared yet. Some injuries take 24–72 hours to show symptoms. Even without current pain, you may still have a viable case. Would you like to continue to find out?"); };
  const pickImpact = (v: string, level: string) => { f.lifeImpact = v; f.impactLevel = level; selectNow("imp:" + v); setTimeout(() => goTo("s9"), 320); };
  const pickIns = (v: string, type: string) => { f.atFaultInsurance = v; selectNow("ins:" + v); setTimeout(() => goTo(type === "uninsured" ? "s9b" : "s10"), 320); };
  const pickUM = (v: string) => { f.ownUMCoverage = v; if (v === "No") f.recoveryRisk = "high"; selectNow("um:" + v); setTimeout(() => goTo("s10"), 320); };
  const pickAtty = (has: boolean) => { f.priorAttorney = has; selectNow("atty:" + has); setTimeout(() => { if (has) showRecovery("s-off-atty", "If you've spoken with an attorney but haven't officially hired or signed a retainer agreement, you may still be unrepresented. Are you sure you've formally hired an attorney for this specific incident?"); else goTo("s12"); }, 320); };
  const pickSettled = (has: boolean) => { f.priorSettlement = has; selectNow("set:" + has); setTimeout(() => { if (has) showRecovery("s-off-settled", "If you signed a document but aren't sure what it was — such as a medical release or an information form — that's different from a legal settlement. Are you certain the document you signed was a settlement or release of claims?"); else goTo("s-urgency"); }, 320); };
  const pickUrgency = (level: string) => { f.urgencyLevel = level; selectNow("urg:" + level); setTimeout(() => goTo("s13"), 320); };

  // recovery screen
  const recoveryDest = useRef("s-off"); const recoveryReturn = useRef("s1");
  const showRecovery = (dest: string, msg: string) => { recoveryDest.current = dest; recoveryReturn.current = (props.histPrev && props.histPrev()) || cur; setRecoveryMsg(msg); goTo("s-off-recovery"); };
  const [recoveryMsg, setRecoveryMsg] = useState("");

  // multi-select
  const toggleMulti = (field: string, val: string) => { if (!Array.isArray(f[field])) f[field] = []; const arr = f[field] as string[]; if (arr.includes(val)) f[field] = arr.filter((v) => v !== val); else arr.push(val); tick(); };
  const continueMulti = (to: string, field: string) => {
    if (!f[field]?.length) return;
    if (field === "treatmentTypes") { const hv = ["Surgery", "Neurologist or Spine Specialist", "Orthopedic Specialist"]; f.treatmentSeveritySignal = (f[field] as string[]).some((t) => hv.includes(t)) ? "high" : "moderate"; }
    if (field === "injuryTypes") { const sv = ["Head injury, headaches, or concussion", "Broken bones or fractures", "Scarring or visible injury to skin"]; f.injurySeverityIndex = (f[field] as string[]).some((i) => sv.includes(i)) ? 8 : 4; }
    goTo(to);
  };

  // name/phone/email/contact time
  const [firstName, setFirstName] = useState(""); const [nameErr, setNameErr] = useState("");
  const validateName = () => { const v = firstName.trim(); if (!v || v.length < 2) { setNameErr("Please enter your first name."); return; } setNameErr(""); f.firstName = v; goTo("s14"); };
  const [phone, setPhone] = useState(""); const [phoneErr, setPhoneErr] = useState("");
  const fmtPhone = (raw: string) => { let v = raw.replace(/\D/g, "").slice(0, 10); if (v.length >= 6) v = "(" + v.slice(0, 3) + ") " + v.slice(3, 6) + "-" + v.slice(6); else if (v.length >= 3) v = "(" + v.slice(0, 3) + ") " + v.slice(3); return v; };
  const validatePhone = () => { const v = phone.replace(/\D/g, ""); if (v.length !== 10) { setPhoneErr("Please enter a valid 10-digit US phone number."); return; } setPhoneErr(""); f.phone = phone; goTo("s-otp"); };
  const [contactTimes, setContactTimes] = useState<string[]>([]);
  const togglePill = (val: string) => { setContactTimes((arr) => { const next = arr.includes(val) ? arr.filter((v) => v !== val) : [...arr.filter((v) => v !== "Any time"), val]; f.preferredContactTime = next; return next; }); };
  const selectAnyTime = () => { setContactTimes(["Any time"]); f.preferredContactTime = ["Any time"]; };

  return (
    <>
      {/* s1 — incident */}
      <div className={cls("s1")} id="s1">
        {draftBanner && (
          <div className="resume-banner">
            <div className="resume-banner-title">Welcome back — you were mid-way through your case review.</div>
            <div className="resume-banner-sub">Pick up where you left off, or start fresh.</div>
            <div className="resume-banner-btns">
              <button className="resume-btn-primary" onClick={resumeDraft}>Resume →</button>
              <button className="resume-btn-secondary" onClick={discardDraft}>Start fresh</button>
            </div>
          </div>
        )}
        <PhaseLabel name="Your Incident" dots={[1, 0, 0, 0]} />
        <h1 className="q-headline">What happened to you?</h1>
        <p className="q-sub">Select the option that best describes your situation.</p>
        <div className="options">
          {[
            ["🚗", "Car accident"], ["🚛", "Truck or commercial vehicle accident"], ["🏍️", "Motorcycle accident"],
            ["🚖", "Rideshare accident (Uber or Lyft)"], ["🚶", "Pedestrian accident"], ["⚠️", "Slip, trip, or fall"], ["🏗️", "Workplace injury"],
          ].map(([icon, label]) => (<Opt key={label} icon={icon} label={label} selected={sel === "inc:" + label} onClick={() => pickIncident(label)} />))}
          <Opt icon="💔" label={<>Wrongful death or fatal accident<br /><span style={{ fontSize: 12, fontWeight: 300, color: "var(--muted)" }}>For surviving family members</span></>} selected={sel === "inc:Wrongful death or fatal accident"} onClick={() => pickIncident("Wrongful death or fatal accident", "wrongful_death")} />
          <Opt icon="🤔" label="Something else" onClick={() => goTo("s-else")} />
        </div>
      </div>

      {/* s-else */}
      <div className={cls("s-else")} id="s-else">
        <PhaseLabel name="Your Incident" dots={[1, 0, 0, 0]} />
        <h1 className="q-headline">We may still be able to help.</h1>
        <p className="q-sub">Tell us a little more about what happened — we&apos;ll let the facts determine whether a case exists.</p>
        <div className="input-wrap"><label className="input-label">Describe your situation</label><textarea className="form-textarea" id="elseText" placeholder="Briefly describe what happened…" rows={4} /></div>
        <button className="btn-continue" onClick={() => { const t = (document.getElementById("elseText") as HTMLTextAreaElement)?.value.trim(); if (!t) return; f.incidentType = "Other: " + t; goTo("s2"); }}>Continue →</button>
      </div>

      {/* s2 — date */}
      <div className={cls("s2")} id="s2">
        <PhaseLabel name="Your Incident" dots={[2, 1, 0, 0]} />
        <h1 className="q-headline">When did this happen?</h1>
        <p className="q-sub">Approximate date is fine if you&apos;re not sure of the exact day.</p>
        <div className="input-wrap">
          <label className="input-label">Date of incident</label>
          <div className="date-row">
            <select className="form-select" value={month} onChange={(e) => setMonth(e.target.value)}><option value="">Month</option>{MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}</select>
            <select className="form-select" value={day} onChange={(e) => setDay(e.target.value)}><option value="">Day</option>{Array.from({ length: 31 }, (_, i) => <option key={i} value={i + 1}>{i + 1}</option>)}</select>
            <select className="form-select" value={year} onChange={(e) => setYear(e.target.value)}><option value="">Year</option>{Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((y) => <option key={y} value={y}>{y}</option>)}</select>
          </div>
          {dateErr && <div className="field-error" style={{ display: "block" }}>{dateErr}</div>}
        </div>
        {solCallout}
        <button className="btn-continue" onClick={validateDate}>Continue →</button>
      </div>

      {/* s3 — location */}
      <div className={cls("s3")} id="s3">
        <PhaseLabel name="Your Incident" dots={[2, 2, 1, 0]} />
        <h1 className="q-headline">Where did it happen?</h1>
        <p className="q-sub">We need to connect you with an attorney licensed in the right state.</p>
        <div className="input-wrap">
          <label className="input-label">State</label>
          <select className="form-select" value={stateVal} onChange={(e) => onStateChange(e.target.value)}><option value="">Select your state…</option>{STATES_LIST.map((s) => <option key={s}>{s}</option>)}</select>
          {stateErr && <div className="field-error" style={{ display: "block" }}>{stateErr}</div>}
        </div>
        <div className="input-wrap">
          <label className="input-label">City <span style={{ color: "var(--muted)", fontWeight: 300, textTransform: "none", letterSpacing: 0, fontSize: 11 }}>(optional)</span></label>
          {stateVal && cityList.length > 0 && <div className="state-lock visible"><span className="state-lock-dot"></span><span>Cities in {stateVal}</span></div>}
          <div className="city-wrap">
            <div className="city-input-row">
              <input className="form-input" type="text" placeholder={stateVal ? "Start typing…" : "Select a state first…"} autoComplete="off" disabled={!stateVal || !cityList.length} value={cityVal} onChange={(e) => { setCityVal(e.target.value); setCityOpen(true); }} onFocus={() => setCityOpen(true)} onBlur={() => setTimeout(() => setCityOpen(false), 160)} />
              {cityVal && <button className="city-clear visible" type="button" onClick={() => setCityVal("")} aria-label="Clear">✕</button>}
            </div>
            <div className={"city-suggestions" + (cityOpen && stateVal ? " open" : "")}>
              {citySugg.length ? citySugg.map((c) => <div className="city-sugg-item" key={c} onMouseDown={() => { setCityVal(c); setCityOpen(false); }}><span>📍</span>{c}</div>) : <div className="city-sugg-empty">No cities found</div>}
            </div>
          </div>
        </div>
        <button className="btn-continue" onClick={validateLocation}>Continue →</button>
      </div>

      {/* s4 — liability */}
      <div className={cls("s4")} id="s4">
        <PhaseLabel name="Your Incident" dots={[2, 2, 2, 1]} />
        <h1 className="q-headline">Was someone else responsible for what happened?</h1>
        <p className="q-sub">Even if you&apos;re not 100% sure, answer based on what you believe.</p>
        <div className="options">
          <Opt icon="👤" label="Yes, someone else was at fault" selected={sel === "liab:Yes, someone else was at fault"} onClick={() => pickLiability("Yes, someone else was at fault", "confirmed")} />
          <Opt icon="🤔" label="I'm not sure" selected={sel === "liab:I'm not sure"} onClick={() => pickLiability("I'm not sure", "unsure")} />
          <Opt icon="🚫" label="No, it was my fault or an accident" selected={sel === "liab:No, it was my fault or an accident"} onClick={() => pickLiability("No, it was my fault or an accident", "no")} />
        </div>
      </div>

      {/* s-comp-neg */}
      <div className={cls("s-comp-neg")} id="s-comp-neg">
        <PhaseLabel name="Your Incident" dots={[2, 2, 2, 1]} />
        <h1 className="q-headline">Before we close this out — one more thing.</h1>
        <p className="q-sub">This is important. Many people don&apos;t know this rule exists.</p>
        <div className="comp-neg-card">
          <div className="info-card-kicker">The comparative negligence rule</div>
          <h2 className="info-card-headline">Even if you were partly at fault, you may still have a case.</h2>
          <p className="info-card-body">In most U.S. states, fault is shared — not all-or-nothing. If the other party was even <strong>partially responsible</strong>, you may be entitled to compensation proportional to their share of fault.</p>
        </div>
        <p className="q-sub" style={{ marginTop: 0 }}>With that in mind — was anyone else even partially involved?</p>
        <div className="options">
          <Opt icon="👥" label="Yes — the other party played some role" selected={sel === "cn:yes"} onClick={() => pickCompNeg("yes")} />
          <Opt icon="🤔" label="I think so, but I'm not certain" selected={sel === "cn:maybe"} onClick={() => pickCompNeg("maybe")} />
          <Opt icon="🚫" label="No — it was entirely my fault" selected={sel === "cn:no"} onClick={() => pickCompNeg("no")} />
        </div>
      </div>

      {/* s5 — medical */}
      <div className={cls("s5")} id="s5">
        <PhaseLabel name="Your Treatment" dots={[1, 0, 0, 0]} />
        <h1 className="q-headline">Have you seen a doctor or received medical treatment?</h1>
        <p className="q-sub">This includes ER visits, urgent care, your primary care doctor, or any specialist.</p>
        <div className="options">
          <Opt icon="🏥" label="Yes — I went to the ER or hospital" selected={sel === "med:Yes — ER or hospital"} onClick={() => pickMedical("Yes — ER or hospital", "er")} />
          <Opt icon="🩺" label="Yes — I visited urgent care or a doctor" selected={sel === "med:Yes — urgent care or doctor"} onClick={() => pickMedical("Yes — urgent care or doctor", "urgentCare")} />
          <Opt icon="❓" label="No — I haven't seen anyone yet" selected={sel === "med:No — haven't seen anyone yet"} onClick={() => pickMedical("No — haven't seen anyone yet", "none")} />
        </div>
      </div>

      {/* s-med-soft */}
      <div className={cls("s-med-soft")} id="s-med-soft">
        <div className="phase-label"><div className="phase-name">Your Treatment</div></div>
        <span className="screen-icon">⚕️</span>
        <div className="info-card"><div className="info-card-kicker">This matters for your case</div><h2 className="info-card-headline">Getting seen by a doctor is the most important thing you can do right now.</h2><p className="info-card-body">Medical documentation is the foundation of every personal injury case. Symptoms can take 24–72 hours to appear after an accident. If you&apos;re in pain — or even if you think you&apos;re okay — please see a doctor today.</p></div>
        <div className="options">
          <Opt icon="🏥" label="I'll seek treatment and come back" onClick={() => goTo("s-await")} />
          <Opt icon="👍" label="I'm not currently in pain" onClick={noPainPath} />
        </div>
      </div>

      {/* s-await */}
      <div className={cls("s-await")} id="s-await">
        <div className="phase-label"><div className="phase-name">Your Treatment</div></div>
        <span className="screen-icon">📋</span>
        <h1 className="q-headline">Let&apos;s hold your spot.</h1>
        <p className="q-sub">Share your contact info and we&apos;ll send you a reminder once you&apos;ve been seen.</p>
        <div className="input-wrap"><label className="input-label">Your name</label><input className="form-input" type="text" id="awaitName" placeholder="First name" autoComplete="given-name" /></div>
        <div className="input-wrap"><label className="input-label">Phone or email</label><input className="form-input" type="text" id="awaitContact" placeholder="Best way to reach you" /></div>
        <button className="btn-continue" onClick={() => { const n = (document.getElementById("awaitName") as HTMLInputElement)?.value.trim(); if (!n) return; f.awaitingTreatment = true; f.firstName = n; goTo("s-await-thanks"); }}>Save my spot →</button>
      </div>

      {/* s5b — treatment types */}
      <div className={cls("s5b")} id="s5b">
        <PhaseLabel name="Your Treatment" dots={[2, 1, 0, 0]} />
        <h1 className="q-headline">What types of treatment have you received?</h1>
        <p className="q-sub">Select all that apply — this helps match you with the right attorney.</p>
        <div className="options">
          {[["🏥", "Emergency Room or Hospital"], ["🩺", "Urgent Care Center"], ["👨‍⚕️", "Primary Care or Family Doctor"], ["🦴", "Chiropractor"], ["🦵", "Orthopedic Specialist"], ["💪", "Physical Therapy"], ["🧠", "Neurologist or Spine Specialist"], ["🏨", "Surgery"], ["📷", "Imaging — X-ray, MRI, or CT scan"]].map(([icon, label]) => (
            <Opt key={label} multi icon={icon} label={label} selected={(f.treatmentTypes as string[]).includes(label)} onClick={() => toggleMulti("treatmentTypes", label)} />
          ))}
        </div>
        <button className="btn-continue" disabled={!f.treatmentTypes.length} onClick={() => continueMulti("s5c", "treatmentTypes")}>Continue →</button>
      </div>

      {/* s5c — provider */}
      <ProviderScreen className={cls("s5c")} active={cur === "s5c"} fd={fd} goTo={goTo} />

      {/* s6 — recency */}
      <div className={cls("s6")} id="s6">
        <PhaseLabel name="Your Treatment" dots={[2, 2, 1, 0]} />
        <h1 className="q-headline">When did you last receive medical treatment?</h1>
        <p className="q-sub">Approximate is fine.</p>
        <div className="options">
          {[["📅", "Within the last 30 days"], ["🗓️", "1 to 3 months ago"], ["⏳", "More than 3 months ago"]].map(([icon, label]) => (
            <Opt key={label} icon={icon} label={label} selected={sel === "rec:" + label} onClick={() => { f.treatmentRecency = label; selectNow("rec:" + label); setTimeout(() => goTo("s7"), 320); }} />
          ))}
        </div>
      </div>

      {/* s7 — injuries */}
      <div className={cls("s7")} id="s7">
        <PhaseLabel name="Your Treatment" dots={[2, 2, 1, 0]} />
        <h1 className="q-headline">What injuries did you sustain?</h1>
        <p className="q-sub">Select everything that applies.</p>
        <div className="options">
          {[["🦴", "Neck or back pain"], ["🧠", "Head injury, headaches, or concussion"], ["🩻", "Broken bones or fractures"], ["🤕", "Muscle pain, soreness, or stiffness"], ["🦵", "Shoulder, knee, hip, or joint pain"], ["💭", "Anxiety, stress, or emotional distress"], ["⚠️", "Scarring or visible injury to skin"], ["➕", "Something else not listed here"]].map(([icon, label]) => (
            <Opt key={label} multi icon={icon} label={label} selected={(f.injuryTypes as string[]).includes(label)} onClick={() => toggleMulti("injuryTypes", label)} />
          ))}
        </div>
        <button className="btn-continue" disabled={!f.injuryTypes.length} onClick={() => continueMulti("s8", "injuryTypes")}>Continue →</button>
      </div>

      {/* s8 — impact */}
      <div className={cls("s8")} id="s8">
        <PhaseLabel name="Your Treatment" dots={[2, 2, 2, 1]} />
        <h1 className="q-headline">How has this affected your daily life?</h1>
        <p className="q-sub">Select the option that best describes your situation.</p>
        <div className="options">
          <Opt icon="💼" label="I missed work or lost income" selected={sel === "imp:I missed work or lost income"} onClick={() => pickImpact("I missed work or lost income", "serious")} />
          <Opt icon="🚫" label="I can no longer do things I used to do" selected={sel === "imp:I can no longer do things I used to do"} onClick={() => pickImpact("I can no longer do things I used to do", "serious")} />
          <Opt icon="😔" label="I've been in pain and discomfort" selected={sel === "imp:I've been in pain and discomfort"} onClick={() => pickImpact("I've been in pain and discomfort", "moderate")} />
          <Opt icon="👍" label="It was minor — I recovered quickly" selected={sel === "imp:It was minor — I recovered quickly"} onClick={() => pickImpact("It was minor — I recovered quickly", "minor")} />
        </div>
      </div>

      {/* s9 — at-fault insurance */}
      <div className={cls("s9")} id="s9">
        <PhaseLabel name="Your Situation" dots={[1, 0, 0, 0]} />
        <h1 className="q-headline">Do you know if the other party had insurance?</h1>
        <p className="q-sub">This is about the person or company responsible — not your own insurance.</p>
        <div className="options">
          <Opt icon="✅" label="Yes, they had insurance" selected={sel === "ins:Yes, they had insurance"} onClick={() => pickIns("Yes, they had insurance", "standard")} />
          <Opt icon="❌" label="No, I don't think they were insured" selected={sel === "ins:No, I don't think they were insured"} onClick={() => pickIns("No, I don't think they were insured", "uninsured")} />
          <Opt icon="🤔" label="I'm not sure" selected={sel === "ins:I'm not sure"} onClick={() => pickIns("I'm not sure", "unsure")} />
        </div>
      </div>

      {/* s9b — UM */}
      <div className={cls("s9b")} id="s9b">
        <PhaseLabel name="Your Situation" dots={[1, 0, 0, 0]} />
        <h1 className="q-headline">Do you have uninsured motorist coverage on your own policy?</h1>
        <p className="q-sub">This coverage exists specifically for situations like yours.</p>
        <div className="options">
          {["Yes", "No", "Not sure"].map((v, i) => <Opt key={v} icon={["✅", "❌", "🤔"][i]} label={v} selected={sel === "um:" + v} onClick={() => pickUM(v)} />)}
        </div>
      </div>

      {/* s10 — report */}
      <div className={cls("s10")} id="s10">
        <PhaseLabel name="Your Situation" dots={[2, 1, 0, 0]} />
        <h1 className="q-headline">Was a police report or official report filed?</h1>
        <p className="q-sub">This could be a police report, an accident report, or an employer incident report.</p>
        <div className="options">
          <Opt icon="📋" label="Yes — a report was filed" selected={sel === "rep:yes"} onClick={() => { f.reportFiled = true; selectNow("rep:yes"); setTimeout(() => goTo("s11"), 320); }} />
          <Opt icon="📝" label="No — no report was filed" selected={sel === "rep:no"} onClick={() => { f.reportFiled = false; selectNow("rep:no"); setTimeout(() => goTo("s11"), 320); }} />
          <Opt icon="🤔" label="I'm not sure" selected={sel === "rep:ns"} onClick={() => { f.reportFiled = null; selectNow("rep:ns"); setTimeout(() => goTo("s11"), 320); }} />
        </div>
      </div>

      {/* s11 — attorney */}
      <div className={cls("s11")} id="s11">
        <PhaseLabel name="Your Situation" dots={[2, 2, 1, 0]} />
        <h1 className="q-headline">Have you already spoken with or hired an attorney?</h1>
        <p className="q-sub">This helps us make sure we can actually help you.</p>
        <div className="options">
          <Opt icon="🙋" label="No — I don't have an attorney yet" selected={sel === "atty:false"} onClick={() => pickAtty(false)} />
          <Opt icon="⚖️" label="Yes — I already have an attorney" selected={sel === "atty:true"} onClick={() => pickAtty(true)} />
        </div>
      </div>

      {/* s12 — settled */}
      <div className={cls("s12")} id="s12">
        <PhaseLabel name="Your Situation" dots={[2, 2, 2, 1]} />
        <h1 className="q-headline">Have you signed any documents related to this incident?</h1>
        <p className="q-sub">This includes anything from an insurance company — like a release, settlement, or payment agreement.</p>
        <div className="options">
          <Opt icon="🙋" label="No — I haven't signed anything" selected={sel === "set:false"} onClick={() => pickSettled(false)} />
          <Opt icon="📝" label="Yes — I signed something" selected={sel === "set:true"} onClick={() => pickSettled(true)} />
        </div>
      </div>

      {/* s-urgency */}
      <div className={cls("s-urgency")} id="s-urgency">
        <PhaseLabel name="Your Situation" dots={[2, 2, 2, 1]} />
        <h1 className="q-headline">How soon do you need help?</h1>
        <p className="q-sub">This helps us route your case to the attorney most available to respond quickly.</p>
        <div className="options">
          <OptSub icon="⚡" label="Urgently — today if possible" sub="We'll notify a matching attorney immediately" selected={sel === "urg:urgent"} onClick={() => pickUrgency("urgent")} />
          <OptSub icon="📅" label="Soon — within the next few days" sub="Standard routing, 4-hour response window" selected={sel === "urg:soon"} onClick={() => pickUrgency("soon")} />
          <OptSub icon="🔍" label="Still researching — no rush yet" sub="We'll review and follow up within 24 hours" selected={sel === "urg:researching"} onClick={() => pickUrgency("researching")} />
        </div>
      </div>

      {/* s13 — name */}
      <div className={cls("s13")} id="s13">
        <PhaseLabel name="Just You" dots={[1, 0, 0, 0]} />
        <h1 className="q-headline">What&apos;s your name?</h1>
        <p className="q-sub">First name is fine — this is just so we know how to address you.</p>
        <div className="input-wrap"><label className="input-label">First name</label><input className="form-input" type="text" placeholder="First name" autoComplete="given-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />{nameErr && <div className="field-error" style={{ display: "block" }}>{nameErr}</div>}</div>
        <button className="btn-continue" onClick={validateName}>Continue →</button>
      </div>

      {/* s14 — phone */}
      <div className={cls("s14")} id="s14">
        <PhaseLabel name="Just You" dots={[2, 1, 0, 0]} />
        <h1 className="q-headline">What&apos;s the best number to reach you, <em>{f.firstName || "there"}</em>?</h1>
        <p className="q-sub">A vetted attorney will call or text. Your number is never shared or sold.</p>
        <div className="input-wrap"><label className="input-label">Mobile number</label><input className="form-input" type="tel" placeholder="(555) 555-5555" autoComplete="tel" maxLength={14} value={phone} onChange={(e) => setPhone(fmtPhone(e.target.value))} />{phoneErr && <div className="field-error" style={{ display: "block" }}>{phoneErr}</div>}</div>
        <button className="btn-continue" onClick={validatePhone}>Send My Code →</button>
      </div>

      {/* s-otp */}
      <OtpScreen className={cls("s-otp")} active={cur === "s-otp"} fd={fd} goTo={goTo} />

      {/* s14b — email */}
      <div className={cls("s14b")} id="s14b">
        <PhaseLabel name="Just You" dots={[2, 1, 0, 0]} />
        <h1 className="q-headline">Where should we send your <em>case summary</em>?</h1>
        <p className="q-sub">Optional. We&apos;ll email your reference number, what happens next, and the attorney&apos;s name — so you have everything in writing.</p>
        <div className="input-wrap"><label className="input-label">Email address <span style={{ color: "var(--muted)", fontWeight: 300, textTransform: "none", letterSpacing: 0, fontSize: 11 }}>(optional)</span></label><input className="form-input" type="email" id="emailAddr" placeholder="your@email.com" autoComplete="email" /><div style={{ fontSize: 12, color: "var(--muted)", fontWeight: 300, marginTop: 2, lineHeight: 1.5 }}>We never sell or share your email. You can opt out any time.</div></div>
        <div style={{ background: "var(--teal-soft)", border: "1px solid rgba(26,61,64,.12)", borderRadius: "var(--r)", padding: "14px 16px", display: "flex", alignItems: "flex-start", gap: 10 }}><span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>📋</span><div style={{ fontSize: 13, color: "var(--teal-mid)", fontWeight: 500, lineHeight: 1.55 }}>Your case summary includes your reference number, the timeline of what happens next, and instructions for the attorney call — everything you need in one place.</div></div>
        <button className="btn-continue" onClick={() => { f.email = (document.getElementById("emailAddr") as HTMLInputElement)?.value.trim() || null; goTo("s15"); }}>Continue →</button>
        <button className="skip-link" onClick={() => { f.email = (document.getElementById("emailAddr") as HTMLInputElement)?.value.trim() || null; goTo("s15"); }}>Skip — I&apos;ll track my case online</button>
      </div>

      {/* s15 — contact time */}
      <div className={cls("s15")} id="s15">
        <PhaseLabel name="Just You" dots={[2, 2, 1, 0]} />
        <h1 className="q-headline">One last thing, <em>{f.firstName ? f.firstName + "—" : "almost there"}</em>.</h1>
        <p className="q-sub">When is the best time for the attorney to call you?</p>
        <div className="pills-wrap">
          {["Morning (8am–12pm)", "Afternoon (12pm–5pm)", "Evening (5pm–8pm)"].map((t) => <div key={t} className={"pill-opt" + (contactTimes.includes(t) ? " selected" : "")} onClick={() => togglePill(t)}>{t}</div>)}
          <div className={"pill-opt" + (contactTimes.includes("Any time") ? " selected" : "")} onClick={selectAnyTime}>Any time — just call</div>
        </div>
        <button className="btn-continue" disabled={!contactTimes.length} onClick={() => goTo("s16")}>Continue →</button>
      </div>

      {/* s16 — HIPAA + signature */}
      <SignatureScreen className={cls("s16")} active={cur === "s16"} fd={fd} goTo={goTo} />

      {/* confirmation */}
      <ConfirmScreen active={cur === "s-confirm"} fd={fd} />

      {/* recovery */}
      <div className={cls("s-off-recovery")} id="s-off-recovery">
        <span className="screen-icon">🤔</span>
        <h1 className="q-headline">Hold on — before we close your file.</h1>
        <p className="q-sub">Sometimes the details are more complicated than a simple yes or no. We want to make sure you&apos;re not leaving without the help you may deserve.</p>
        <div className="info-card"><p className="info-card-body">{recoveryMsg}</p></div>
        <div className="options">
          <Opt icon="💬" label="Yes — there's more I want to share" onClick={() => goTo(recoveryReturn.current, { back: true } as any)} />
          <Opt icon="➡️" label="No — my answer was correct" onClick={() => goTo(recoveryDest.current)} />
        </div>
      </div>

      {/* off-ramps */}
      <div className={cls("s-off")} id="s-off">
        <span className="screen-icon">🤝</span>
        <h1 className="q-headline">Based on what you&apos;ve shared, we may not be the right fit right now.</h1>
        <p className="q-sub">That doesn&apos;t mean you don&apos;t have options. These CasePort resources may help.</p>
        <div className="resources">
          <a className="cp-resource-link" href="/guide">Do I have a personal injury case? <span>→</span></a>
          <a className="cp-resource-link" href="/accidents/statute-of-limitations">Check your state&apos;s filing deadline <span>→</span></a>
          <a className="cp-resource-link" href="/guide/faq">Personal injury FAQ — your questions answered <span>→</span></a>
        </div>
        <div className="info-card" style={{ marginTop: 0 }}>
          <p className="info-card-body" style={{ marginBottom: 12 }}>Symptoms often appear 24–72 hours after an accident. If your situation changes, enter your email and we&apos;ll send you information on next steps.</p>
          <div className="offramp-email"><input className="form-input" type="email" placeholder="your@email.com" /><button className="btn-continue" style={{ minHeight: 52 }}>Notify me →</button></div>
        </div>
        <p className="micro"><a href="#" onClick={(e) => { e.preventDefault(); restart(); }} style={{ color: "var(--teal)", textDecoration: "underline", textUnderlineOffset: 2 }}>Restart your intake</a> if you believe your situation was mischaracterized.</p>
      </div>

      <div className={cls("s-off-atty")} id="s-off-atty">
        <span className="screen-icon">⚖️</span>
        <div className="info-card"><div className="info-card-kicker">Already represented</div><h2 className="info-card-headline">It sounds like you&apos;re already in good hands.</h2><p className="info-card-body">Since you have legal representation, we&apos;re not able to assist at this stage. Your attorney is the right person to speak with.<br /><br />If you have a <strong>different incident</strong> in the future, or if your representation status changes, CasePort will be here.</p></div>
        <div className="resources"><a className="cp-resource-link" href="/guide/faq">Understanding your PI case — guides &amp; resources <span>→</span></a><a className="cp-resource-link" href="/guide/dealing-with-insurance">How to deal with insurance companies <span>→</span></a></div>
      </div>

      <div className={cls("s-off-settled")} id="s-off-settled">
        <span className="screen-icon">📝</span>
        <div className="info-card"><div className="info-card-kicker">We want to make sure you get the right guidance</div><h2 className="info-card-headline">We recommend speaking with an attorney directly.</h2><p className="info-card-body">If you&apos;ve signed a settlement or release, your claim may have already been resolved. An attorney can confirm whether any options remain — at no cost to you in a free consultation.</p></div>
        <div className="resources"><a className="cp-resource-link" href="/guide">Understand your options after a settlement <span>→</span></a><a className="cp-resource-link" href="/guide/faq">Personal injury FAQ <span>→</span></a></div>
      </div>

      <div className={cls("s-await-thanks")} id="s-await-thanks">
        <div className="gold-badge">📋</div>
        <h1 className="q-headline">We&apos;ve saved your spot.</h1>
        <div className="info-card"><p className="info-card-body">We&apos;ll send you a reminder in 48 hours. When you&apos;ve been seen by a doctor, reply to that message or return to <strong>caseport.io/start</strong> — your answers will be waiting.<br /><br /><strong>Getting medical attention is the most important thing</strong> for your health and your case right now. Even if you feel okay, some injuries take 24–72 hours to appear.</p></div>
        <p className="micro">Don&apos;t wait too long — statutes of limitations are date-specific. The sooner you act, the stronger your position.</p>
      </div>
    </>
  );
}

/* ---- small presentational helpers ---- */
function PhaseLabel({ name, dots }: { name: string; dots: number[] }) {
  return (
    <div className="phase-label">
      <div className="phase-name">{name}</div>
      <div className="phase-dots">{dots.map((d, i) => <div key={i} className={"phase-dot" + (d === 1 ? " active" : d === 2 ? " done" : "")}></div>)}</div>
    </div>
  );
}
function Opt({ icon, label, selected, onClick, multi }: { icon: React.ReactNode; label: React.ReactNode; selected?: boolean; onClick: () => void; multi?: boolean }) {
  return (
    <div className={"opt" + (multi ? " multi" : "") + (selected ? " selected" : "")} onClick={onClick}>
      <span className="opt-icon">{icon}</span><span className="opt-label">{label}</span><span className="opt-check"></span>
    </div>
  );
}
function OptSub({ icon, label, sub, selected, onClick }: { icon: string; label: string; sub: string; selected?: boolean; onClick: () => void }) {
  return (
    <div className={"opt" + (selected ? " selected" : "")} onClick={onClick}>
      <span className="opt-icon">{icon}</span><div style={{ flex: 1 }}><span className="opt-label">{label}</span><div className="opt-sub">{sub}</div></div><span className="opt-check"></span>
    </div>
  );
}

/* ---- Provider screen (autocomplete + quick picks) ---- */
function ProviderScreen({ className, active, fd, goTo }: any) {
  const f = fd.current as FD;
  const [input, setInput] = useState(""); const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Provider | null>(null);
  const [dontRemember, setDontRemember] = useState(false);
  const abbr = (SA as any)[f.incidentState] || ""; const city = f.incidentCity || "";
  const base: Provider[] = (PROVIDERS as any)[abbr] || NATIONWIDE;
  const providerList: Provider[] = city ? [...base.filter((p) => p.c?.toLowerCase() === city.toLowerCase()), ...base.filter((p) => p.c?.toLowerCase() !== city.toLowerCase())] : base;
  const filtered = (() => { if (!input) return providerList.slice(0, 8); const q = input.toLowerCase(); const sw = providerList.filter((p) => p.n.toLowerCase().startsWith(q)); const co = providerList.filter((p) => p.n.toLowerCase().includes(q) && !sw.includes(p)); return [...sw, ...co].slice(0, 8); })();
  const choose = (p: Provider) => { setSelected(p); f.providerName = p.n; f.providerType = p.t; f.providerCity = p.c !== "Nationwide" ? p.c : city || f.incidentState; f.providerUnknown = false; setOpen(false); };
  const meta = (p: Provider) => (p.c && p.c !== "Nationwide" ? p.c + " · " : "") + (p.t === "urgent-care" ? "Urgent Care" : p.t === "hospital" ? "Hospital" : p.t.charAt(0).toUpperCase() + p.t.slice(1));

  return (
    <div className={className} id="s5c">
      <PhaseLabel name="Your Treatment" dots={[2, 1, 0, 0]} />
      <h1 className="q-headline">Where did you receive treatment?</h1>
      <p className="q-sub">This lets your attorney request records immediately — no extra steps for you. Skip if you&apos;re not sure.</p>
      {f.incidentState && <div style={{ display: "flex" }}><div className="state-lock visible" style={{ margin: "0 auto" }}><span className="state-lock-dot"></span><span>{city ? `Showing providers near ${city}` : `Showing providers in ${f.incidentState}`}</span></div></div>}
      {selected ? (
        <div className="provider-selected-card" style={{ display: "flex" }}>
          <span className="provider-selected-icon">{(TYPE_ICONS as any)[selected.t] || "🏥"}</span>
          <div className="provider-selected-info"><div className="provider-selected-name">{selected.n}</div><div className="provider-selected-type">{(selected.c && selected.c !== "Nationwide" ? selected.c + " · " : "") + selected.t}</div></div>
          <button className="provider-change-btn" onClick={() => { setSelected(null); setInput(""); }}>Change</button>
        </div>
      ) : (
        <div id="providerSearchSection">
          <div className="provider-search-wrap">
            <div className="provider-input-row">
              <span className="provider-search-icon">🔍</span>
              <input className="form-input" type="text" placeholder="Search hospital, clinic, urgent care…" autoComplete="off" value={input} onChange={(e) => { setInput(e.target.value); setOpen(e.target.value.length > 0); }} onFocus={() => setOpen(input.length > 0)} onBlur={() => setTimeout(() => setOpen(false), 180)} />
              {input && <button className="provider-clear visible" type="button" onClick={() => setInput("")} aria-label="Clear">✕</button>}
            </div>
            <div className={"provider-suggestions" + (open ? " open" : "")}>
              {filtered.length ? filtered.map((p) => <div className="provider-sugg-item" key={p.n} onMouseDown={() => choose(p)}><span className="provider-sugg-icon">{(TYPE_ICONS as any)[p.t] || "🏥"}</span><div className="provider-sugg-info"><div className="provider-sugg-name">{p.n}</div><div className="provider-sugg-meta">{meta(p)}</div></div></div>)
                : <div className="provider-sugg-item" onMouseDown={() => { f.providerName = input; f.providerType = "unknown"; setSelected({ n: input, t: "unknown", c: "" }); setOpen(false); }} style={{ fontStyle: "italic", color: "var(--muted)" }}><span className="provider-sugg-icon">✏️</span><div className="provider-sugg-info"><div className="provider-sugg-name">Use &quot;{input}&quot;</div><div className="provider-sugg-meta">Type the name as best you remember</div></div></div>}
            </div>
          </div>
          {!input && (
            <div id="quickPicksSection"><p className="quickpick-label">Common in your area</p><div className="quickpicks">{providerList.slice(0, 5).map((p) => <div className="quickpick-item" key={p.n} onClick={() => choose(p)}><span className="quickpick-icon">{(TYPE_ICONS as any)[p.t] || "🏥"}</span><div className="quickpick-info"><div className="quickpick-name">{p.n}</div><div className="quickpick-meta">{meta(p)}</div></div><span className="quickpick-check"></span></div>)}</div></div>
          )}
          <button className="dont-remember-link" onClick={() => setDontRemember((v) => !v)}>{dontRemember ? "I remember the name" : "I don't remember the exact name"}</button>
          <div className={"dont-remember-panel" + (dontRemember ? " visible" : "")}>
            <div><p className="dont-remember-q">What type of facility was it?</p><div className="facility-types">{["🏥 Hospital / ER", "🩺 Urgent Care", "🦴 Chiropractor", "👨‍⚕️ Doctor's Office", "💪 Physical Therapy", "📋 Other"].map((t) => <div className="facility-type-pill" key={t} onClick={(e) => { document.querySelectorAll(".facility-type-pill").forEach((p) => p.classList.remove("selected")); (e.currentTarget as HTMLElement).classList.add("selected"); f.providerUnknown = true; f.providerType = t; }}>{t}</div>)}</div></div>
            <p style={{ fontSize: 13, color: "var(--muted)", fontWeight: 300, lineHeight: 1.6 }}>No problem — your attorney will locate your records with just the facility type and city. That&apos;s enough to get started.</p>
          </div>
        </div>
      )}
      <button className="btn-continue" onClick={() => goTo("s6")}>Continue →</button>
      <button className="skip-link" onClick={() => { f.providerName = null; f.providerType = null; goTo("s6"); }}>Skip for now — my attorney can locate records</button>
    </div>
  );
}

/* ---- OTP screen ---- */
function OtpScreen({ className, active, fd, goTo }: any) {
  const f = fd.current as FD;
  const [boxes, setBoxes] = useState(["", "", "", "", "", ""]);
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  useEffect(() => { if (active) { setBoxes(["", "", "", "", "", ""]); setTimeout(() => refs.current[0]?.focus(), 400); } }, [active]);
  const onInput = (i: number, v: string) => {
    const d = v.replace(/\D/g, "").slice(-1);
    const next = [...boxes]; next[i] = d; setBoxes(next);
    if (d && i < 5) refs.current[i + 1]?.focus();
    const code = next.join("");
    if (code.length === 6) setTimeout(() => { f.phoneVerified = true; goTo("s14b"); }, 600);
  };
  const onKey = (i: number, e: React.KeyboardEvent) => { if (e.key === "Backspace" && !boxes[i] && i > 0) refs.current[i - 1]?.focus(); if (e.key === "ArrowLeft" && i > 0) refs.current[i - 1]?.focus(); if (e.key === "ArrowRight" && i < 5) refs.current[i + 1]?.focus(); };
  return (
    <div className={className} id="s-otp">
      <PhaseLabel name="Just You" dots={[2, 1, 0, 0]} />
      <h1 className="q-headline">We just sent you a code.</h1>
      <p className="q-sub">So the attorney has a confirmed number to reach you on.</p>
      <div className="otp-phone-display">Code sent to {f.phone || "…"}</div>
      <div className="input-wrap">
        <label className="input-label" style={{ textAlign: "center", width: "100%" }}>Enter your 6-digit code</label>
        <div className="otp-boxes">
          {boxes.map((b, i) => <input key={i} ref={(el) => { refs.current[i] = el; }} className={"otp-box" + (b ? " filled" : "")} maxLength={1} type="text" inputMode="numeric" value={b} onChange={(e) => onInput(i, e.target.value)} onKeyDown={(e) => onKey(i, e)} onFocus={(e) => e.target.select()} />)}
        </div>
      </div>
      <p className="otp-hint">For this demo, any 6-digit code will work.</p>
      <div className="otp-resend">Didn&apos;t get it? <a onClick={() => setBoxes(["", "", "", "", "", ""])}>Resend code</a></div>
    </div>
  );
}

/* ---- Signature + HIPAA screen ---- */
function SignatureScreen({ className, active, fd, goTo }: any) {
  const f = fd.current as FD;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const drawing = useRef(false);
  const [hasSig, setHasSig] = useState(false);
  const [mode, setMode] = useState<"draw" | "type">("draw");
  const [typed, setTyped] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sigErr, setSigErr] = useState("");

  const baseline = (ctx: CanvasRenderingContext2D, w: number, h: number) => { ctx.save(); ctx.strokeStyle = "#ddd5c8"; ctx.lineWidth = 1; ctx.setLineDash([5, 5]); ctx.beginPath(); ctx.moveTo(20, h - 26); ctx.lineTo(w - 20, h - 26); ctx.stroke(); ctx.setLineDash([]); ctx.restore(); };

  useEffect(() => {
    if (!active || mode !== "draw") return;
    const canvas = canvasRef.current; if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const cw = Math.max(canvas.parentElement?.offsetWidth || 300, 200); const ch = 140;
    canvas.width = cw * dpr; canvas.height = ch * dpr;
    const ctx = canvas.getContext("2d")!; ctx.scale(dpr, dpr);
    ctx.strokeStyle = "#1c2b32"; ctx.lineWidth = 2.5; ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctxRef.current = ctx; baseline(ctx, cw, ch);
  }, [active, mode]);

  const pos = (e: { clientX: number; clientY: number }) => { const r = canvasRef.current!.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
  const start = (e: { clientX: number; clientY: number }) => { drawing.current = true; const p = pos(e); const ctx = ctxRef.current!; ctx.beginPath(); ctx.moveTo(p.x, p.y); };
  const move = (e: { clientX: number; clientY: number }) => { if (!drawing.current) return; const p = pos(e); const ctx = ctxRef.current!; ctx.lineTo(p.x, p.y); ctx.stroke(); ctx.beginPath(); ctx.moveTo(p.x, p.y); if (!hasSig) { setHasSig(true); setSigErr(""); } };
  const end = () => { drawing.current = false; };
  const clear = () => { const canvas = canvasRef.current!; const ctx = ctxRef.current!; const dpr = window.devicePixelRatio || 1; ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr); baseline(ctx, canvas.width / dpr, canvas.height / dpr); setHasSig(false); };

  const ready = hasSig && consent;
  const submit = async () => {
    if (!hasSig) { setSigErr("Please sign above to continue."); return; }
    setLoading(true);
    f.consentGiven = consent; f.firstName = f.firstName;
    try { f.hipaaSignature = mode === "draw" ? canvasRef.current!.toDataURL("image/png") : typed.trim(); } catch { f.hipaaSignature = "captured"; }
    f.submissionId = genId();
    await new Promise((r) => setTimeout(r, 1600));
    setLoading(false);
    goTo("s-confirm");
  };

  return (
    <div className={className} id="s16">
      <PhaseLabel name="Just You" dots={[2, 2, 2, 1]} />
      <h1 className="q-headline">Almost done, <em>{f.firstName || "one last step"}</em>.</h1>
      <p className="q-sub">Your signature authorizes your attorney to request your medical records immediately — saving weeks of back-and-forth.</p>
      <div className="hipaa-card">
        <div className="hipaa-card-kicker">Medical Records Authorization (HIPAA)</div>
        <p className="hipaa-body">By signing below, you authorize CasePort and any assigned attorney from our network to obtain your medical records related to this injury for the sole purpose of evaluating your personal injury case. This authorization expires 90 days from today or upon case assignment, whichever comes first. You may revoke this in writing at any time.</p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: "rgba(26,61,64,.07)", border: "1px solid rgba(26,61,64,.18)", borderRadius: "var(--r)" }}><span style={{ fontSize: 18, flexShrink: 0 }}>🔐</span><p style={{ fontSize: 13, color: "var(--teal-mid)", fontWeight: 500, lineHeight: 1.5 }}>Every CasePort case file includes this authorization — it&apos;s how your attorney can start immediately, without any extra steps from you.</p></div>
      <div className="sig-section">
        <div className="sig-header"><label className="input-label">Your signature</label><button className="sig-toggle" onClick={() => { setMode((m) => (m === "draw" ? "type" : "draw")); setHasSig(false); }}>{mode === "draw" ? "Type instead" : "Draw instead"}</button></div>
        <div className={"sig-draw-wrap" + (hasSig && mode === "draw" ? " has-sig" : "")} style={{ display: mode === "draw" ? "block" : "none" }}>
          <canvas ref={canvasRef} className="sig-canvas" aria-label="Draw your signature here"
            onMouseDown={start} onMouseMove={move} onMouseUp={end} onMouseLeave={end}
            onTouchStart={(e) => { e.preventDefault(); start(e.touches[0]); }} onTouchMove={(e) => { e.preventDefault(); move(e.touches[0]); }} onTouchEnd={end} />
          <span className={"sig-canvas-hint" + (hasSig ? " hidden" : "")}>Sign here with your finger or mouse</span>
          {hasSig && <button className="sig-clear-btn visible" onClick={clear}>Clear</button>}
        </div>
        <div className="sig-type-wrap" style={{ display: mode === "type" ? "flex" : "none" }}>
          <input className="form-input" type="text" placeholder="Type your full legal name" value={typed} onChange={(e) => { setTyped(e.target.value); setHasSig(e.target.value.trim().length >= 2); }} autoComplete="name" />
          <div className={"sig-typed-preview" + (typed ? " has-content" : "")}>{typed || <span className="sig-placeholder">Your signature will appear here</span>}</div>
        </div>
        <div className={"sig-status" + (hasSig ? " visible" : "")}>✓ Signature captured</div>
        {sigErr && <div className="field-error" style={{ display: "block" }}>{sigErr}</div>}
      </div>
      <div className="consent-block">
        <p className="consent-text">By submitting this form, you understand that CasePort is not a law firm and cannot give you legal advice. You are agreeing to be contacted by a licensed personal injury attorney in our network regarding your case. You consent to receive automated calls, pre-recorded messages, and text messages from CasePort and its network partners at the number provided. Consent is not required as a condition of any service. You have not hired an attorney and have not signed any release related to this incident. Message and data rates may apply. You may opt out at any time by replying STOP.</p>
        <div className="consent-row"><input type="checkbox" id="consentChk" checked={consent} onChange={(e) => setConsent(e.target.checked)} /><label htmlFor="consentChk">I understand and agree to the terms above</label></div>
      </div>
      <button className={"btn-continue" + (loading ? " loading" : "")} disabled={!ready || loading} onClick={submit}>Complete My Case Review →</button>
      <p className="micro">🔒 Your signature and all data are encrypted. We will never sell your information.</p>
    </div>
  );
}

/* ---- Confirmation screen (CIS score, countdown, upload, attribution) ---- */
function ConfirmScreen({ active, fd }: any) {
  const f = fd.current as FD;
  const [cisNum, setCisNum] = useState(0);
  const [timer, setTimer] = useState("30:00");
  const [files, setFiles] = useState<File[]>([]);
  const [attr, setAttr] = useState<string | null>(null);
  const [refCopied, setRefCopied] = useState(false);
  const startedRef = useRef(false);

  const calcScore = useCallback(() => {
    let s = 0;
    if (["Car accident", "Truck or commercial vehicle accident", "Motorcycle accident", "Slip, trip, or fall", "Workplace injury", "Rideshare accident (Uber or Lyft)", "Pedestrian accident", "Wrongful death or fatal accident"].some((t) => f.incidentType?.includes(t))) s += 10;
    if (f.inMarket) s += 15;
    if (f.liabilityFlag === "confirmed") s += 15; else if (f.liabilityFlag === "unsure") s += 7;
    if (["er", "urgentCare"].includes(f.treatmentLevel)) s += 15;
    if (f.treatmentSeveritySignal === "high") s += 15; else if (f.treatmentSeveritySignal === "moderate") s += 8;
    if (f.providerName) s += 10;
    if (f.treatmentRecency === "Within the last 30 days") s += 10; else if (f.treatmentRecency === "1 to 3 months ago") s += 5;
    if (f.injurySeverityIndex >= 7) s += 10; else if (f.injurySeverityIndex >= 3) s += 5;
    if (f.impactLevel === "serious") s += 10; else if (f.impactLevel === "moderate") s += 8;
    if (f.atFaultInsurance === "Yes, they had insurance") s += 10;
    if (f.reportFiled === true) s += 5;
    if (f.phoneVerified) s += 10;
    if (f.hipaaSignature) s += 20;
    if (f.uploadedFiles.length > 0) s += 15;
    return s;
  }, [f]);

  const score = calcScore();
  const displayScore = Math.min(score, 99);
  const factors = [
    { label: "Liability signal", pct: f.liabilityFlag === "confirmed" ? 92 : f.liabilityFlag === "unsure" ? 55 : 20 },
    { label: "Medical documentation", pct: f.treatmentLevel === "er" ? 95 : f.treatmentLevel === "urgentCare" ? 80 : f.providerName ? 65 : 30 },
    { label: "Insurance coverage", pct: f.atFaultInsurance?.includes("Yes") ? 90 : f.ownUMCoverage === "Yes" ? 65 : 35 },
    { label: "Filing window", pct: f.solExpired ? 20 : f.solFlag ? 55 : f.incidentDaysSince < 90 ? 98 : 80 },
  ];
  const tier = score >= 75 ? { label: "Strong Case Signal", color: "#4caf7d", ringClass: "strong" } : score >= 50 ? { label: "Viable Case", color: "#c9a84c", ringClass: "viable" } : { label: "Under Review", color: "#c4663a", ringClass: "" };

  useEffect(() => {
    if (!active || startedRef.current) return;
    startedRef.current = true;
    // count up
    let start: number | null = null;
    const step = (ts: number) => { if (!start) start = ts; const p = Math.min((ts - start) / 1400, 1); setCisNum(Math.floor((1 - Math.pow(1 - p, 3)) * displayScore)); if (p < 1) requestAnimationFrame(step); else setCisNum(displayScore); };
    requestAnimationFrame(step);
    // countdown
    const hour = new Date().getHours(); const biz = hour >= 8 && hour < 20;
    let secs: number | null = null;
    if (f.urgencyLevel === "urgent" && biz) secs = 900;
    else if (f.urgencyLevel === "urgent" && !biz) { setTimer("Tonight"); }
    else if (f.urgencyLevel === "soon") secs = 14400;
    else setTimer("24 hrs");
    if (secs != null) {
      let s = secs; setTimer(fmtSecs(s));
      const iv = setInterval(() => { s--; if (s <= 0) { s = 0; clearInterval(iv); } setTimer(fmtSecs(s)); }, 1000);
      return () => clearInterval(iv);
    }
  }, [active, displayScore, f.urgencyLevel]);

  const badge = f.urgencyLevel === "urgent" ? "Within 15 minutes" : f.urgencyLevel === "soon" ? "Within 4 hours" : "Within 24 hours";
  const onFiles = (list: FileList | null) => { if (!list) return; const next = [...files]; [...list].forEach((fl) => { if (!next.some((u) => u.name === fl.name)) next.push(fl); }); setFiles(next); f.uploadedFiles = next; };

  return (
    <div className={"confirm-screen" + (active ? " active" : "")} id="s-confirm">
      <div className="confirm-hero">
        <div className="radar-wrap"><div className="radar-ring"></div><div className="radar-ring"></div><div className="radar-ring"></div><div className="radar-core">⚡</div></div>
        <h1 className="confirm-headline">Your case is in motion.</h1>
        <p className="confirm-sub"><strong>{f.firstName ? f.firstName + ", your" : "Your"} case is already under review.</strong></p>
        <div className="countdown-wrap">
          <div><div className="countdown-label">{f.urgencyLevel === "urgent" && !(new Date().getHours() >= 8 && new Date().getHours() < 20) ? "Queued for" : "Attorney contact within"}</div><div className="countdown-live"><span className="live-dot"></span> Live</div></div>
          <div className="countdown-timer" style={{ fontSize: timer.length > 6 ? 22 : 32 }}>{timer}</div>
        </div>
      </div>
      <div id="cisScoreBlock">
        <div className="cis-block">
          <div className="cis-ring-wrap">
            <div className={"cis-ring " + tier.ringClass}><span className="cis-score-num">{cisNum}</span><span className="cis-score-denom">/ 100</span></div>
            <div className="cis-tier-label" style={{ color: tier.color }}>{tier.label}</div>
            <div className="cis-tier-desc">Case Intelligence Score</div>
          </div>
          <div className="cis-factors">
            {factors.map((ft, i) => (
              <div className="cis-factor-row" key={i}>
                <span className="cis-factor-label">{ft.label}</span>
                <div className="cis-factor-bar-wrap"><div className="cis-factor-bar" style={{ background: ft.pct > 70 ? "#4a8c7e" : ft.pct > 45 ? "#c9a84c" : "#c4663a", width: active ? ft.pct + "%" : "0%" }}></div></div>
                <span className="cis-factor-val">{ft.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="info-card">
        <div className="info-card-kicker">What happens next</div>
        <div className="timeline">
          <div className="tl-step"><div className="tl-icon done">✓</div><div className="tl-body"><div className="tl-title">Case review submitted</div><div className="tl-desc">Your information is encrypted and your file is open.</div></div></div>
          <div className="tl-step"><div className="tl-icon done">✓</div><div className="tl-body"><div className="tl-title">Medical authorization secured</div><div className="tl-desc">Your attorney can request records immediately — no extra steps from you.</div></div></div>
          <div className="tl-step"><div className="tl-icon active">🔍</div><div className="tl-body"><div className="tl-title">Being matched now</div><div className="tl-desc">We&apos;re identifying the best qualified attorney in your area.</div><div className="tl-badge">⚡ <span>{badge}</span></div></div></div>
          <div className="tl-step"><div className="tl-icon pending">📞</div><div className="tl-body"><div className="tl-title">Attorney contacts you directly</div><div className="tl-desc">They&apos;ll call from a local number — their name will appear in a text message so you know who&apos;s calling. Keep your phone nearby. Free, no obligation.</div></div></div>
        </div>
      </div>
      <div className="ref-block">
        <div className="ref-left"><div className="ref-label">Your reference number</div><div className="ref-num">{f.submissionId || "—"}</div></div>
        <button className={"ref-copy" + (refCopied ? " copied" : "")} onClick={() => { navigator.clipboard?.writeText(f.submissionId || "").then(() => { setRefCopied(true); setTimeout(() => setRefCopied(false), 2000); }); }}>{refCopied ? "Copied ✓" : "Copy"}</button>
      </div>
      <div className="attr-section">
        <div className="attr-kicker">Last thing — totally optional</div>
        <h3 className="attr-headline">How did you find us?</h3>
        <p className="attr-body">One tap helps us reach more people who need this. Skip if you&apos;d rather not.</p>
        <div className="pills-wrap attr-pills">{[["google", "Google search"], ["social", "Social media"], ["referral", "Friend or family"], ["tv-radio", "TV or radio"], ["ad", "Saw an ad"], ["other", "Other"]].map(([v, l]) => <div key={v} className={"pill-opt" + (attr === v ? " selected" : "")} onClick={() => setAttr(v)}>{l}</div>)}</div>
        {attr && attr !== "other" && <div className="attr-thanks" style={{ display: "block" }}>✓ Thank you — that helps.</div>}
        {attr === "other" && <div className="attr-other-wrap" style={{ display: "block", marginTop: 12 }}><input className="form-input" type="text" placeholder="Where did you hear about us?" /></div>}
      </div>
      <div className="upload-section">
        <div className="upload-boost">⬆ Boosts review priority</div>
        <div className="upload-kicker">Optional — but it helps</div>
        <h3 className="upload-headline">Strengthen your file while you wait.</h3>
        <p className="upload-body">Cases with documentation are matched faster. Upload photos, police reports, medical receipts, or insurance letters.</p>
        <label className="upload-zone" htmlFor="cmcFileInput">
          <span className="upload-zone-icon">📁</span>
          <p className="upload-zone-text"><strong>Tap to upload</strong> or drag files here</p>
          <p className="upload-zone-text" style={{ fontSize: 12, marginTop: 4 }}>Photos, PDFs, documents — any format</p>
        </label>
        <input type="file" id="cmcFileInput" className="upload-input" multiple accept="image/*,.pdf,.doc,.docx" onChange={(e) => onFiles(e.target.files)} />
        <div className="upload-files">{files.map((fl, i) => <div className="upload-file-item" key={i}><span className="upload-file-name">📄 {fl.name}</span><button className="upload-file-remove" onClick={() => { const n = files.filter((_, j) => j !== i); setFiles(n); f.uploadedFiles = n; }}>✕</button></div>)}</div>
      </div>
      <div className="wait-section">
        <div className="wait-kicker">While you wait</div>
        <div className="wait-items">
          <div className="wait-item"><div className="wait-num">1</div><div><strong>Keep attending all medical appointments.</strong> Every visit creates documentation that strengthens your case.</div></div>
          <div className="wait-item"><div className="wait-num">2</div><div><strong>Do not speak to the other party&apos;s insurance without legal advice.</strong> Adjusters are trained to minimize your payout. Wait until you&apos;ve spoken to your attorney.</div></div>
          <div className="wait-item"><div className="wait-num">3</div><div><strong>Save everything.</strong> Bills, photos, insurance letters, texts. Anything related to the accident.</div></div>
        </div>
      </div>
      <p className="micro">Symptoms often appear 24–72 hours after an accident. If things change, you can always return and update your file.</p>
    </div>
  );
}
