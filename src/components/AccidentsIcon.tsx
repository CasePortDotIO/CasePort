import { createElement, type CSSProperties } from "react";
import { ICONS } from "./icons.generated";

/**
 * Renders one of the brand SVG glyphs as real SVG child elements (no
 * dangerouslySetInnerHTML). Mirrors the source `CP.ico(name, attrs)`:
 * `star` is the only filled glyph; everything else is stroked.
 */
export function Icon({
  name,
  className,
  style,
}: {
  name: string;
  className?: string;
  style?: CSSProperties;
}) {
  const els = ICONS[name] || ICONS.check;
  const fill = name === "star" ? "currentColor" : "none";
  return (
    <svg
      viewBox="0 0 24 24"
      fill={fill}
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {els.map((el, i) => createElement(el.t, { key: i, ...el.a }))}
    </svg>
  );
}
