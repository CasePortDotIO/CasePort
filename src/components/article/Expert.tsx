import { Icon } from "@/components/Icon";
import { reviewer as legalReviewer } from "@/lib/accidents-constants";
import { medReviewer } from "@/data";

type ExpertAuthor = {
  id?: string
  name?: string
  title?: string
  bio?: string
  credentials?: { value: string; label: string }[]
  badges?: { label: string }[]
  [key: string]: any
}

type ExpertProps = {
  author?: ExpertAuthor | string | null
  reviewType?: 'legal' | 'medical'
  sourceText?: string
  bg?: string
}

/** Expert / methodology E-E-A-T panel. Accepts a CMS author relationship or falls back to static reviewer. */
export function Expert({
  author,
  reviewType,
  sourceText,
  bg = "bg-white",
}: ExpertProps) {
  const isMedical = reviewType === 'medical'
  const staticRev = isMedical ? medReviewer : legalReviewer

  // Resolve author — may be a doc object (populated) or just an ID string
  const authorObj: ExpertAuthor | null =
    !author ? null
    : typeof author === 'object' ? author
    : null

  const name = authorObj?.name || staticRev.name
  const title = authorObj?.title || staticRev.title
  const label = isMedical ? "How we keep this medically accurate" : "How we keep this accurate"
  const defaultText = isMedical
    ? "Every statement on this page is reviewed against current medical literature and clinical guidelines, and re-verified each quarter. This is general medical and legal information for education — not a diagnosis, medical advice, or a treatment plan. Always seek care from a qualified clinician."
    : "Every figure on this page is drawn from primary sources — state statutes and case law, NHTSA crash data, and the Insurance Research Council — and re-verified each quarter. CasePort is editorially independent: our guidance is not influenced by any law firm. This is general legal information, not legal advice."
  const text = sourceText || defaultText

  // Build credential string from author.credentials array
  const credsStr = authorObj?.credentials
    ? authorObj.credentials.map((c) => c.value).join(" · ")
    : staticRev.creds

  return (
    <section className={"section " + bg} style={{ paddingTop: "3rem", paddingBottom: "3rem" }}>
      <div className="container-4">
        <div className="expert-card r">
          <div className="expert-mark">
            <Icon name={isMedical ? "steth" : "shield"} />
          </div>
          <div className="expert-body">
            <div className="expert-label">{label}</div>
            <p className="expert-lead">
              {isMedical ? "Medically reviewed" : "Reviewed"} by <b>{name}</b>, {title}.{credsStr ? ` ${credsStr}.` : ''}
            </p>
            <p className="expert-note">{text}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
