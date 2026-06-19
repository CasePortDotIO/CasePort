import { Fragment } from "react";
import Link from "next/link";

export interface Crumb {
  label: string;
  href?: string;
}

/** Breadcrumb trail. Mirrors source `CP.ui.crumbs()`. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      {items.map((it, i) => {
        const last = i === items.length - 1;
        return (
          <Fragment key={i}>
            {i > 0 && <span className="sep">/</span>}
            {last || !it.href ? (
              <span className="here">{it.label}</span>
            ) : (
              <Link href={it.href}>{it.label}</Link>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}
