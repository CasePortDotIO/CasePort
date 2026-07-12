import { Icon } from "@/components/Icon";
import { reviewer as legalReviewer } from "@/lib/constants";
import { medReviewer } from "@/data";

/** Expert / methodology E-E-A-T panel. Mirrors `CP.ui.expert()`. */
export function Expert({ medical = false, bg = "bg-white" }: { medical?: boolean; bg?: string }) {
  const rev = medical ? medReviewer : legalReviewer;
  const label = medical ? "How we keep this medically accurate" : "How we keep this accurate";
  const sources = medical
    ? "Every statement on this page is reviewed against current medical literature and clinical guidelines, and re-verified each quarter. This is general medical and legal information for education — not a diagnosis, medical advice, or a treatment plan. Always seek care from a qualified clinician."
    : "Every figure on this page is drawn from primary sources — state statutes and case law, NHTSA crash data, and the Insurance Research Council — and re-verified each quarter. CasePort is editorially independent: our guidance is not influenced by any law firm. This is general legal information, not legal advice.";
  return (
    <section className={"section " + bg} style={{ paddingTop: "3rem", paddingBottom: "3rem" }}>
      <div className="container-4">
        <div className="expert-card r">
          <div className="expert-mark">
            <Icon name={medical ? "steth" : "shield"} />
          </div>
          <div className="expert-body">
            <div className="expert-label">{label}</div>
            <p className="expert-lead">
              {medical ? "Medically reviewed" : "Reviewed"} by <b>{rev.name}</b>,{" "}
              {rev.title}. {rev.creds}.
            </p>
            <p className="expert-note">{sources}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
