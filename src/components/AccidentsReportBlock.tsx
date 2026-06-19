import { Icon } from "./AccidentsIcon";
import { crashFor } from "@/data";

/** Per-state "Get your crash report" + filing block. Mirrors `CP.ui.reportBlock()`. */
export function ReportBlock({
  state,
  name,
  statuteYears,
  bg = "bg-white",
}: {
  state: string;
  name: string;
  statuteYears: number;
  bg?: string;
}) {
  const cr = crashFor(state);
  return (
    <section className={"section " + bg} style={{ paddingTop: "3rem", paddingBottom: "3rem" }}>
      <div className="container-4">
        <div className="section-head">
          <h2 className="section-h">Exactly how to get your {name} crash report</h2>
        </div>
        <div className="report-grid">
          <div className="report-box">
            <div className="report-k">
              <Icon name="file" />
              Where to request it
            </div>
            <p className="report-src">{cr.a}</p>
            <p className="report-how">{cr.h}</p>
          </div>
          <div className="report-box">
            <div className="report-k">
              <Icon name="clock" />
              When to act
            </div>
            <p className="report-how">
              Reports are typically available 3–10 business days after the crash.
              Request yours early — and remember your {name} filing deadline is{" "}
              <b>
                {statuteYears} year{statuteYears > 1 ? "s" : ""}
              </b>{" "}
              from the date of injury.
            </p>
          </div>
        </div>
        <p className="note" style={{ marginTop: "1rem" }}>
          <Icon name="alertC" />
          <span>
            Agencies and online portals change. Confirm the current request method
            and fee before relying on it. This is general information, not legal
            advice.
          </span>
        </p>
      </div>
    </section>
  );
}
