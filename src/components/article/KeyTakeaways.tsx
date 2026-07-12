import { Icon } from "@/components/Icon";

/**
 * "Key takeaways" box — the distinct, scannable AEO block placed right after the
 * byline, ABOVE the Direct Answer. It owns the bullets (the capsule keeps only
 * the prose lead). Mirrors the takeaways box built in `enhanceArticle`.
 */
export function KeyTakeaways({ items }: { items: string[] }) {
  if (items.length < 3) return null;
  return (
    <section className="section takeaways-sec">
      <div className="container-4">
        <div className="takeaways r">
          <div className="takeaways-head">
            <Icon name="award" />
            Key takeaways
          </div>
          <ul className="takeaways-list">
            {items.map((t, i) => (
              <li key={i}>
                <Icon name="check2" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
