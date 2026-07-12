import { Icon } from "./Icon";
import type { Faq } from "@/lib/schema";

/** FAQ accordion (native <details>; first item open). Mirrors `CP.ui.faqBlock()`. */
export function FAQ({
  faqs,
  bg = "bg-cream",
  container = "container-3",
  title = "Frequently Asked Questions",
}: {
  faqs: Faq[];
  bg?: string;
  container?: string;
  title?: string;
}) {
  return (
    <section className={"section " + bg}>
      <div className={container}>
        <div className="section-head">
          <h2 className="section-h">{title}</h2>
        </div>
        <div className="faq-list">
          {faqs.map((f, i) => (
            <details className="faq-item r" key={i} open={i === 0}>
              <summary className="faq-summary">
                <span className="q">{f.q}</span>
                <span className="faq-ic">
                  <Icon name="chev" />
                </span>
              </summary>
              <div className="faq-answer">{f.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
