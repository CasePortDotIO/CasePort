import Link from "next/link";
import { Icon } from "@/components/Icon";
import { Breadcrumbs } from "@/components/article/Breadcrumbs";
import { HeroPhoto } from "@/components/article/HeroPhoto";
import { Byline } from "@/components/article/Byline";
import { KeyTakeaways } from "@/components/article/KeyTakeaways";
import { Capsule } from "@/components/article/Capsule";
import { SectionTOC } from "@/components/article/SectionTOC";
import { Expert } from "@/components/article/Expert";
import { Sources } from "@/components/article/Sources";
import { ArticleOverlays } from "@/components/article/ArticleOverlays";
import { RecoveryViz } from "@/components/RecoveryViz";
import { FAQ } from "@/components/FAQ";
import { CTABand } from "@/components/CTABand";
import { JsonLd } from "@/components/JsonLd";
import { medicalWebPage, faqSchema, breadcrumb, speakable, orgGraph, type Faq } from "@/lib/schema";
import { medReviewer } from "@/data";
import { readingMinutes } from "@/lib/article";

/* ---------- Delayed Symptoms ---------- */
export const delayedSymptomsMeta = {
  title: "Delayed Symptoms After a Car Accident — What to Watch For | CasePort",
  description: "Why pain appears 24–72 hours after a crash, and what to do.",
  canonical: "/injuries/delayed-symptoms-after-car-accident",
};

const DS_LEAD =
  'It is completely normal to feel fine at the scene of a car accident and develop pain 24 to 72 hours later. Adrenaline and the body’s stress response mask pain immediately after a crash; as they wear off, inflammation builds and injuries like whiplash, concussions, and soft-tissue damage become apparent. Delayed symptoms are not "fake" — they are a recognized medical phenomenon. Seek evaluation promptly, because some delayed symptoms (from brain injury or internal bleeding) are dangerous.';

const DS_COMMON: [string, string, string][] = [
  ["Neck pain & stiffness", "Hallmark of whiplash — often worst the morning after.", "whiplash"],
  ["Headaches", "Can signal whiplash or a concussion/brain injury.", "traumatic-brain-injury"],
  ["Back pain & numbness", "May indicate a herniated disc or back injury.", "herniated-disc"],
  ["Abdominal pain", "A red flag for internal injuries — seek care immediately.", "internal-injuries"],
  ["Tingling or weakness", "Suggests nerve involvement from a spine injury.", "neck-injury"],
  ["Mood changes & sleep loss", "Early signs of PTSD or emotional trauma.", "ptsd"],
];

const DS_FAQS: Faq[] = [
  { q: "Is it normal to feel pain days after a car accident?", a: "Yes. It is medically normal to develop pain 24 to 72 hours after a crash. Adrenaline masks pain at the scene; as it wears off, inflammation builds and injuries like whiplash and soft-tissue damage become apparent." },
  { q: "How long after a car accident can symptoms appear?", a: "Most delayed symptoms appear within 24 to 72 hours, but some — particularly nerve symptoms and psychological effects like PTSD — can emerge over days to weeks. Brain-injury and internal-bleeding symptoms can appear within hours and are emergencies." },
  { q: "Should I see a doctor if symptoms appear days later?", a: "Yes. See a doctor promptly when delayed symptoms appear. It protects your health — some delays are dangerous — and it creates the medical record that connects your injury to the crash, which is essential to a claim." },
  { q: "Can I still file a claim if my symptoms were delayed?", a: "Absolutely. Delayed symptoms are common and well-recognized. The key is to seek care as soon as symptoms appear and document everything, so the gap between the crash and your symptoms is explained by medical evidence." },
];

export function DelayedSymptomsPage() {
  return (
    <>
      <HeroPhoto
        crumbs={<Breadcrumbs items={[{ label: "Injuries", href: "/injuries" }, { label: "Delayed Symptoms" }]} />}
        eyebrow="After a crash · High intent"
        title="Delayed Symptoms After a Car Accident"
        sub="Feeling pain days later is medically normal — and it matters for your health and your claim."
        scene="Delayed onset"
        img="/accidents/img/clinical.png"
        byline={<Byline reviewerName={medReviewer.name} isMedical minutes={readingMinutes(DS_LEAD)} onDark />}
      />
      <KeyTakeaways items={["Adrenaline masks pain", "Inflammation builds over hours", "Some delays are dangerous", "Gaps hurt your claim"]} />
      <Capsule heading="Why you feel worse days after a crash" lead={DS_LEAD} />
      <SectionTOC />
      <section className="section bg-white">
        <div className="container-5">
          <div className="section-head">
            <h2 className="section-h">Common Delayed Symptoms — and What They Mean</h2>
          </div>
          <div className="grid grid-3">
            {DS_COMMON.map((x) => (
              <Link key={x[2]} href={`/injuries/${x[2]}`} className="card link r">
                <h3>{x[0]}</h3>
                <p style={{ fontSize: ".95rem", marginTop: ".4rem" }}>{x[1]}</p>
                <span className="card-link" style={{ marginTop: ".8rem", fontSize: ".85rem" }}>
                  Learn more <Icon name="arrow" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="section bg-cream">
        <div className="container-4">
          <div className="section-head">
            <h2 className="section-h">The Delayed-Symptom Timeline</h2>
          </div>
          <RecoveryViz
            phases={[
              { time: "At the scene", phase: "Adrenaline peak", desc: 'Pain is suppressed. Many people feel "fine" and decline care — a critical mistake.' },
              { time: "6–24 hours", phase: "Onset", desc: "As adrenaline fades, neck stiffness, headache, and soreness begin to appear." },
              { time: "24–72 hours", phase: "Peak symptoms", desc: "Inflammation peaks. Whiplash, soft-tissue, and concussion symptoms are usually clear by now." },
              { time: "Days–weeks", phase: "Evolving", desc: "Nerve symptoms, mood changes, and deeper injuries can still emerge. Keep documenting." },
            ]}
          />
        </div>
      </section>
      <Expert bg="bg-white" medical />
      <FAQ faqs={DS_FAQS} bg="bg-cream" title="Delayed Symptoms — FAQ" />
      <Sources medical citeTitle="Delayed Symptoms After a Car Accident — What to Watch For" citeUrl="/injuries/delayed-symptoms-after-car-accident" />
      <CTABand title="Symptoms Showing Up Now?" sub="See a doctor first. Then get a free, confidential case review to protect your rights — at no cost." btn="Get Free Case Review" />
      <ArticleOverlays />
      <JsonLd
        data={[
          medicalWebPage({ headline: "Delayed Symptoms After a Car Accident", description: "Why pain appears 24–72 hours after a crash, and what to do." }),
          faqSchema(DS_FAQS),
          breadcrumb([{ name: "Home", url: "/" }, { name: "Injuries", url: "/injuries" }, { name: "Delayed Symptoms", url: "/injuries/delayed-symptoms-after-car-accident" }]),
          speakable("/injuries/delayed-symptoms-after-car-accident"),
          ...orgGraph(),
        ]}
      />
    </>
  );
}

/* ---------- When to See a Doctor ---------- */
export const whenToSeeDoctorMeta = {
  title: "When to See a Doctor After an Accident — Red Flags & Timeline | CasePort",
  description: "Red-flag symptoms and the post-crash care timeline.",
  canonical: "/injuries/when-to-see-doctor-after-accident",
};

const WD_LEAD =
  "You should see a doctor as soon as possible after any accident — ideally the same day — even if you feel fine. Adrenaline masks injuries, and some of the most dangerous conditions (brain injury, internal bleeding) have delayed symptoms. Go to the ER immediately for any red-flag symptom. Even for minor crashes, a prompt evaluation protects your health and creates the medical record your claim depends on; gaps in care are the most common way insurers reduce a claim.";

const WD_REDFLAGS = [
  "Loss of consciousness, confusion, or a worsening headache",
  "Chest or abdominal pain, or bruising from the seatbelt",
  "Numbness, tingling, or weakness in the arms or legs",
  "Difficulty breathing or shortness of breath",
  "Severe or worsening pain anywhere",
  "Loss of bladder or bowel control",
];

const WD_FAQS: Faq[] = [
  { q: "Should I see a doctor after a minor car accident?", a: "Yes. Even after a minor crash, you should be evaluated promptly — ideally the same day. Adrenaline masks injuries, and conditions like whiplash and concussion often have delayed symptoms. A same-day record also protects a potential claim." },
  { q: "How long after an accident can I wait to see a doctor?", a: "Don’t wait. Seek care the same day if possible, and immediately for any red-flag symptom. Beyond the health risk, gaps between the crash and treatment are the most common way insurers argue an injury wasn’t serious." },
  { q: "What are the warning signs I need emergency care?", a: "Go to the ER for loss of consciousness or confusion, a worsening headache, chest or abdominal pain, numbness or weakness, difficulty breathing, or loss of bladder/bowel control. These can signal brain injury, internal bleeding, or spinal injury." },
  { q: "Why does seeing a doctor matter for my claim?", a: "Medical records are the foundation of an injury claim. A prompt, consistent treatment record connects your injuries to the crash and documents their severity. Without it, insurers argue you weren’t really hurt." },
];

export function WhenToSeeDoctorPage() {
  return (
    <>
      <HeroPhoto
        crumbs={<Breadcrumbs items={[{ label: "Injuries", href: "/injuries" }, { label: "When to See a Doctor" }]} />}
        eyebrow="After a crash · High intent"
        title="When to See a Doctor After an Accident"
        sub="The red flags, the timeline, and why a same-day record protects your health and your claim."
        scene="Medical evaluation"
        img="/accidents/img/clinical.png"
        byline={<Byline reviewerName={medReviewer.name} isMedical minutes={readingMinutes(WD_LEAD)} onDark />}
      />
      <KeyTakeaways items={["Go the same day", "ER for red flags", "No gaps in care", "Follow the full plan"]} />
      <Capsule heading="When should you see a doctor after a crash?" lead={WD_LEAD} />
      <SectionTOC />
      <section className="section bg-white">
        <div className="container-4">
          <div className="section-head">
            <h2 className="section-h">Go to the ER Now If You Have Any of These</h2>
          </div>
          <div className="sym-col emergency">
            <div className="sym-col-h">
              <Icon name="alert" />
              Emergency red flags — call 911
            </div>
            <ul>
              {WD_REDFLAGS.map((f, i) => (
                <li key={i}>
                  <Icon name="alert" style={{ color: "#c4714a" }} />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <section className="section bg-cream">
        <div className="container-4">
          <div className="section-head">
            <h2 className="section-h">The Post-Crash Care Timeline</h2>
          </div>
          <RecoveryViz
            phases={[
              { time: "Same day", phase: "Get evaluated", desc: 'See a doctor, urgent care, or the ER — even for a "minor" crash. This is the most important medical and legal step.' },
              { time: "24–72 hours", phase: "Watch for delayed symptoms", desc: "If new pain, headache, numbness, or mood changes appear, seek care again right away." },
              { time: "First 1–2 weeks", phase: "Follow up", desc: "Attend every recommended follow-up and start any prescribed treatment. Consistency matters." },
              { time: "Ongoing", phase: "Complete your treatment", desc: "Finish the full course of care. Gaps and early stops are used to argue you weren’t hurt." },
            ]}
          />
        </div>
      </section>
      <Expert bg="bg-white" medical />
      <FAQ faqs={WD_FAQS} bg="bg-cream" title="When to See a Doctor — FAQ" />
      <Sources medical citeTitle="When to See a Doctor After an Accident — Red Flags & Timeline" citeUrl="/injuries/when-to-see-doctor-after-accident" />
      <CTABand title="Already Seen a Doctor?" sub="Good. Now get a free, confidential case review to understand your rights and what your claim may be worth." btn="Get Free Case Review" />
      <ArticleOverlays />
      <JsonLd
        data={[
          medicalWebPage({ headline: "When to See a Doctor After an Accident", description: "Red-flag symptoms and the post-crash care timeline." }),
          faqSchema(WD_FAQS),
          breadcrumb([{ name: "Home", url: "/" }, { name: "Injuries", url: "/injuries" }, { name: "When to See a Doctor", url: "/injuries/when-to-see-doctor-after-accident" }]),
          speakable("/injuries/when-to-see-doctor-after-accident"),
          ...orgGraph(),
        ]}
      />
    </>
  );
}
