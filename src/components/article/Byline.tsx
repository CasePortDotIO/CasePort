import { Icon } from "@/components/Icon";

/** Byline under the H1 (or after a dark hero subtitle). Mirrors the source byline. */
export function Byline({
  reviewerName,
  isMedical = false,
  minutes,
  onDark = false,
}: {
  reviewerName: string;
  isMedical?: boolean;
  minutes: number;
  onDark?: boolean;
}) {
  return (
    <div className={"byline" + (onDark ? " on-dark" : "")}>
      <span className="byline-rev">
        <Icon name="shield" />
        {isMedical ? "Medically reviewed" : "Reviewed"} by <b>{reviewerName}</b>
      </span>
      <span className="byline-sep">·</span>
      <span className="byline-meta">
        <Icon name="cal" />
        Updated June 2026
      </span>
      <span className="byline-sep">·</span>
      <span className="byline-meta">
        <Icon name="clock" />
        {minutes} min read
      </span>
    </div>
  );
}
