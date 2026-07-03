// Typed facade over the verbatim source data (see ./load.ts and ./_src/*).
// Interfaces describe the shapes; the underlying data is byte-identical to the
// approved source. Looser shapes are refined as each page type is built.
import { CP } from "./load";

/* ---------- shared shapes ---------- */
export interface StatLabelValue {
  label: string;
  value: string;
}

/* ---------- states ---------- */
export type NegligenceRule =
  | "pure-contributory"
  | "modified-50"
  | "modified-51"
  | "pure-comparative";

export interface StateData {
  abbr: string;
  name: string;
  rule: NegligenceRule;
  label: string;
  desc: string;
  statuteYears: number;
  statuteNote: string;
  faultThreshold: string;
  avgSettlement: number;
  damageCap: string;
  medianJuryVerdict: number;
  uninsuredRate: number;
  fatalCrashRate: number;
  topCause: string;
}

export interface NationalAverages {
  avgSettlement: number;
  medianVerdict: number;
  uninsuredRate: number;
  fatalCrashRate: number;
}

export interface StateGridCell {
  abbr: string;
  row: number;
  col: number;
}

export interface AdjusterPlay {
  id: string;
  whatTheySay: string;
  whatItMeans: string;
  whatYouSay: string;
  danger: "critical" | "high" | "moderate";
  context: string;
}

export const NATIONAL = CP.NATIONAL as NationalAverages;
export const stateData = CP.stateData as Record<string, StateData>;
export const stateGrid = CP.stateGrid as StateGridCell[];
export const adjusterPlaybook = CP.adjusterPlaybook as AdjusterPlay[];

export const negColor = CP.negColor as (rule: string) => string;
export const negSeverity = CP.negSeverity as (rule: string) => number;
export const slugToAbbr = CP.slugToAbbr as (slug: string) => string | null;
export const statesSorted = CP.statesSorted as () => StateData[];

/* ---------- accident types ---------- */
export interface AccidentType {
  title: string;
  category: string;
  icon: string;
  scene: string;
  subtitle: string;
  directAnswer: string;
  stats: StatLabelValue[];
  keyFacts: string[];
  sections: { title: string; content: string[] }[];
}
export const accidentTypes = CP.accidentTypes as Record<string, AccidentType>;
export const accidentTypeOrder = CP.accidentTypeOrder as string[];

/* ---------- quick answers ---------- */
export interface QuickAnswer {
  question: string;
  title: string;
  eyebrow: string;
  visual: string;
  directAnswer: string;
  keyFacts: string[];
  sources: string[];
  sections: { title: string; content: string }[];
}
export const quickAnswers = CP.quickAnswers as Record<string, QuickAnswer>;
export const quickAnswerOrder = CP.quickAnswerOrder as string[];
export const qaAlias = CP.qaAlias as Record<string, string>;

/* ---------- cities ---------- */
export interface City {
  name: string;
  slug: string;
  population: string;
  accidentRate: string;
  description: string;
  keyFacts: string[];
}
export interface StateCities {
  name: string;
  abbr: string;
  cities: City[];
}
export interface CityAccidentType {
  slug: string;
  name: string;
  icon: string;
}
export const cityData = CP.cityData as Record<string, StateCities>;
export const cityAccidentTypes = CP.cityAccidentTypes as CityAccidentType[];
export const citySpecials = CP.citySpecials as string[] | undefined;

/* ---------- state law (hand-authored + topics) ---------- */
export interface StateLawSection {
  title: string;
  content: string;
}
export interface StateLawTopicContent {
  title: string;
  subtitle: string;
  direct_answer: string;
  key_facts: { label: string; value: string }[];
  sections?: StateLawSection[];
}
export type StateLaw = Record<string, StateLawTopicContent>;
export const stateLaw = CP.stateLaw as Record<string, StateLaw>;
export interface StateLawTopic {
  slug: string;
  key: string;
  label: string;
  tags: string[];
}
export const stateLawTopics = CP.stateLawTopics as StateLawTopic[];
export const genStateLaw = CP.genStateLaw as (abbr: string) => StateLaw;
export const stateLawFor = CP.stateLawFor as (abbr: string) => StateLaw;

/* ---------- resources ---------- */
export interface EmailScript {
  id: string;
  icon: string;
  title: string;
  to: string;
  why: string;
  subject?: string;
  body: string;
}
export const emailScripts = CP.emailScripts as EmailScript[];
export const crashReport = CP.crashReport as Record<string, { a: string; h: string }>;
export const crashFor = CP.crashFor as (abbr: string) => { a: string; h: string };

/* ---------- injuries ---------- */
export interface InjurySymptoms {
  immediate: string[];
  delayed: string[];
  emergency: string[];
}
export interface InjuryTreatment {
  name: string;
  desc: string;
}
export interface InjuryRecoveryPhase {
  phase: string;
  time: string;
  desc: string;
}
export interface InjurySettlementFactor {
  factor: string;
  desc: string;
}
export interface Injury {
  name: string;
  slug: string;
  category: string;
  icon: string;
  sceneImg?: string;
  directAnswer: string;
  stats: StatLabelValue[];
  keyFacts: string[];
  sections: { title: string; content: string[] }[];
  symptoms: InjurySymptoms;
  treatment: InjuryTreatment[];
  recovery: InjuryRecoveryPhase[];
  settlement: InjurySettlementFactor[];
  healVerb?: string;
}
export const injuries = CP.injuries as Record<string, Injury>;
export const injuryOrder = CP.injuryOrder as string[];
export interface InjurySpoke {
  slug: string;
  key: string;
  label: string;
  tags: string[];
}
export const injurySpokes = CP.injurySpokes as InjurySpoke[];
export const medReviewer = CP.medReviewer as {
  name: string;
  title: string;
  creds: string;
  org: string;
};
export interface BodyRegion {
  id: string;
  label: string;
  injuries: string[];
}
export const bodyRegions = CP.bodyRegions as BodyRegion[];

/* ---------- guides ---------- */
export interface GuidePillar {
  slug: string;
  name: string;
  short: string;
  icon: string;
  kind: "accident" | "guide" | "faq";
  tags: string[];
  scene: string;
}
export const guidePillars = CP.guidePillars as GuidePillar[];
export const guideSceneImg = CP.guideSceneImg as Record<string, string>;
export interface GuideSpokeDef {
  slug: string;
  label: string;
  tags: string[];
  note: string;
}
export const guideSpokeDefs = CP.guideSpokeDefs as GuideSpokeDef[];
export const guideSpokePillars = CP.guideSpokePillars as string[];
export const hasGuideSpokes = CP.hasGuideSpokes as (slug: string) => boolean;
export const guides = CP.guides as Record<string, any>;
export interface GuideFaqGroup {
  title: string;
  items: { q: string; a: string }[];
}
export const guideFAQ = CP.guideFAQ as {
  name: string;
  category: string;
  subtitle: string;
  intro: string;
  groups: GuideFaqGroup[];
};
export const guidePillar = (slug: string) =>
  guidePillars.find((p) => p.slug === slug);

/* ---------- glossary ---------- */
export interface GlossaryTerm {
  term: string;
  cat: string;
  def: string;
  links?: [string, string][];
}
export const glossary = CP.glossary as GlossaryTerm[];
export const glossaryCats = CP.glossaryCats as string[];

/* raw namespace escape hatch (rarely needed) */
export { CP };
