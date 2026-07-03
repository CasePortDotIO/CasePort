import type { AccidentType } from "@/data";

/** Table rows are [label, description, value]. */
export interface CapsuleTable {
  label: string;
  head: string[];
  rows: string[][];
}

/** Settlement-range-by-severity table (illustrative, derived from the type's avg).
 *  Mirrors source `CP._severityTable()`. */
export function severityTable(t: AccidentType): CapsuleTable {
  const m = t.stats?.[0]?.value ? /(\d+)/.exec(t.stats[0].value) : null;
  const avg = m ? parseInt(m[1], 10) : 50;
  const rng = (a: number, b: number) =>
    "$" + Math.round(avg * a) + "K – $" + Math.round(avg * b) + "K";
  return {
    label: "Typical " + t.category.toLowerCase() + " settlement range by injury severity",
    head: ["Injury severity", "What it looks like", "Illustrative range"],
    rows: [
      ["Minor", "Soft-tissue, full recovery in weeks", rng(0.2, 0.5)],
      ["Moderate", "Fractures, ongoing treatment", rng(0.6, 1.3)],
      ["Severe", "Permanent impairment, surgery", rng(1.6, 3.2)],
      ["Catastrophic", "Disability, lifelong care", rng(3.5, 8)],
    ],
  };
}
