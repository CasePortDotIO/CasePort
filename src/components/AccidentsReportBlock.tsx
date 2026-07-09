import { Icon } from "./AccidentsIcon";

/** Per-state "Get your crash report" + filing block. Fully CMS-driven. */
export function ReportBlock({
  stateName,
  requestFrom,
  requestHow,
  whenToAct,
  statuteYears,
  note,
  bg = "bg-white",
}: {
  stateName?: string;
  requestFrom?: string;
  requestHow?: string;
  whenToAct?: string;
  statuteYears?: number;
  note?: string;
  bg?: string;
}) {
  return (
    <section className={"section " + bg} style={{ paddingTop: "3rem", paddingBottom: "3rem" }}>
      <div className="container-4">
        <div className="section-head">
          <h2 className="section-h">Exactly how to get your {stateName} crash report</h2>
        </div>
        <div className="report-grid">
          <div className="report-box">
            <div className="report-k">
              <Icon name="file" />
              Where to request it
            </div>
            {requestFrom && <p className="report-src">{requestFrom}</p>}
            {requestHow && <p className="report-how">{requestHow}</p>}
          </div>
          <div className="report-box">
            <div className="report-k">
              <Icon name="clock" />
              When to act
            </div>
            {whenToAct && (
              <p className="report-how">{whenToAct}</p>
            )}
          </div>
        </div>
        {note && (
          <p className="note" style={{ marginTop: "1rem" }}>
            <Icon name="alertC" />
            <span>{note}</span>
          </p>
        )}
      </div>
    </section>
  );
}
