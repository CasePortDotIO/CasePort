"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { guidePillar, injuries } from "@/data";

const QUESTIONS: { id: string; q: string; opts: [string, string, string][] }[] = [
  {
    id: "what",
    q: "What kind of accident was it?",
    opts: [
      ["car", "Car / auto", "car"],
      ["truck", "Truck / commercial", "truck"],
      ["motorcycle", "Motorcycle", "bike"],
      ["pedestrian", "Pedestrian / bicycle", "walk"],
      ["slip", "Slip & fall", "alert"],
      ["work", "Work injury", "bldg"],
      ["medical", "Medical / malpractice", "steth"],
      ["other", "Something else", "alertC"],
    ],
  },
  {
    id: "hurt",
    q: "What was injured?",
    opts: [
      ["head", "Head / brain", "alert"],
      ["neck", "Neck / back", "scan"],
      ["bones", "Broken bones", "shield"],
      ["soft", "Soft tissue / sprains", "steth"],
      ["burns", "Burns", "alert"],
      ["mental", "Emotional / PTSD", "heart"],
      ["unsure", "Not sure yet", "alertC"],
    ],
  },
  {
    id: "when",
    q: "When did it happen?",
    opts: [
      ["today", "In the last few days", "clock"],
      ["weeks", "Weeks ago", "clock"],
      ["months", "Months ago", "cal"],
      ["year", "Close to a year+ ago", "cal"],
    ],
  },
];

const TYPE_MAP: Record<string, string> = {
  car: "car-accident", truck: "truck-accident", motorcycle: "motorcycle-accident",
  pedestrian: "pedestrian-accident", slip: "slip-and-fall", work: "workplace-injury",
  medical: "medical-malpractice", other: "car-accident",
};
const INJ_MAP: Record<string, string> = {
  head: "traumatic-brain-injury", neck: "back-injury", bones: "broken-bones",
  soft: "soft-tissue-injury", burns: "burn-injury", mental: "ptsd", unsure: "whiplash",
};

interface Rec {
  href: string;
  icon: string;
  title: string;
  desc: string;
}

function buildRecs(a: Record<string, string>): { recs: Rec[]; urgent: string } {
  const recs: Rec[] = [];
  const tSlug = TYPE_MAP[a.what] || "car-accident";
  const tName = guidePillar(tSlug)?.name || "Your accident";
  recs.push({ href: `/guide/${tSlug}`, icon: "doc", title: `Read the ${tName} guide`, desc: "The national explainer: how liability works and what your claim involves." });
  if (a.what !== "medical" && a.what !== "slip" && a.what !== "work") {
    recs.push({ href: `/accidents/${tSlug}`, icon: "scale", title: `${tName} law in your state`, desc: "Negligence rules, deadlines, and local guidance for where it happened." });
  }
  const inj = INJ_MAP[a.hurt] || "whiplash";
  if (injuries[inj]) {
    recs.push({ href: `/injuries/${inj}`, icon: "steth", title: `Your injury: ${injuries[inj].name}`, desc: "Symptoms, treatment, recovery timeline, and what drives its value." });
  }
  let urgent = "";
  if (a.when === "today") {
    recs.unshift({ href: "/accidents/first-hour", icon: "clock", title: "Do this now: the first hours", desc: "The immediate steps that protect your claim while evidence is fresh." });
    urgent = "Act fast — evidence like surveillance footage is often gone within 72 hours.";
  } else if (a.when === "year") {
    urgent = "Your filing deadline may be approaching. Check your state’s statute of limitations soon.";
    recs.push({ href: "/accidents/statute-of-limitations", icon: "alert", title: "Check your filing deadline", desc: "Deadlines run 1–6 years by state — confirm yours before it passes." });
  }
  recs.push({ href: "/guide/dealing-with-insurance", icon: "shield", title: "Before you talk to the insurer", desc: "What the adjuster is doing — and the words that protect your claim." });
  recs.push({ href: "/guide/how-contingency-fees-work", icon: "dollar", title: "What a lawyer costs", desc: "Contingency fees explained — and what you’d actually take home." });
  return { recs: recs.slice(0, 6), urgent };
}

export function ClaimRoadmap({ bg = "bg-white" }: { bg?: string }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const reset = () => {
    setStep(0);
    setAnswers({});
  };

  return (
    <section className={"section " + bg} data-widget="roadmap">
      <div className="container-4">
        <div className="section-head center">
          <h2 className="section-h">Build Your Claim Roadmap</h2>
          <p className="section-sub center">
            Three questions. We&rsquo;ll map the exact pages — across accident law, your injury, and
            the claim process — that apply to your situation. No email required.
          </p>
        </div>
        <div className="rm-card" id="rmCard">
          {step < QUESTIONS.length ? (
            <>
              <div className="rm-progress">
                <span className="rm-step">
                  Step {step + 1} of {QUESTIONS.length}
                </span>
                <div className="rm-dots">
                  {QUESTIONS.map((_, i) => (
                    <span key={i} className={"rm-dot" + (i <= step ? " on" : "")}></span>
                  ))}
                </div>
              </div>
              <h3 className="rm-q">{QUESTIONS[step].q}</h3>
              <div className="rm-opts">
                {QUESTIONS[step].opts.map((o) => (
                  <button
                    key={o[0]}
                    className="rm-opt"
                    onClick={() => {
                      setAnswers({ ...answers, [QUESTIONS[step].id]: o[0] });
                      setStep(step + 1);
                    }}
                  >
                    <Icon name={o[2]} />
                    <span>{o[1]}</span>
                  </button>
                ))}
              </div>
              {step > 0 && (
                <button className="rm-back" onClick={() => setStep(step - 1)}>
                  <Icon name="back" />
                  Back
                </button>
              )}
            </>
          ) : (
            <RoadmapResult answers={answers} onRestart={reset} />
          )}
        </div>
      </div>
    </section>
  );
}

function RoadmapResult({ answers, onRestart }: { answers: Record<string, string>; onRestart: () => void }) {
  const { recs, urgent } = buildRecs(answers);
  return (
    <div className="rm-result">
      <div className="rm-result-head">
        <Icon name="check" style={{ width: 30, height: 30, color: "#4a8c7e" }} />
        <h3>Your personalized roadmap</h3>
        <p>Based on your answers, start with these — in order.</p>
      </div>
      {urgent && (
        <div className="rm-urgent">
          <Icon name="alert" />
          <span>{urgent}</span>
        </div>
      )}
      <div className="rm-recs">
        {recs.map((x) => (
          <Link key={x.href} href={x.href} className="rm-rec">
            <span className="rm-rec-ic">
              <Icon name={x.icon} />
            </span>
            <span className="rm-rec-body">
              <span className="rm-rec-title">{x.title}</span>
              <span className="rm-rec-desc">{x.desc}</span>
            </span>
            <Icon name="arrow" className="rm-rec-arrow" />
          </Link>
        ))}
      </div>
      <div className="rm-foot">
        <Link href="/checkmycase" className="btn btn-primary">
          Get a free case review
        </Link>
        <button className="rm-restart" onClick={onRestart}>
          <Icon name="back" />
          Start over
        </button>
      </div>
    </div>
  );
}
