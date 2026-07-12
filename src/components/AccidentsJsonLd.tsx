/**
 * Emits one or more JSON-LD blocks. This is the ONLY sanctioned use of
 * dangerouslySetInnerHTML in the app (per the build brief — script tags only).
 * Schema is additive: pass the full combined array so all types coexist.
 */
export function JsonLd({ data }: { data: object | object[] }) {
  const arr = Array.isArray(data) ? data : [data];
  return (
    <>
      {arr.map((s, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
        />
      ))}
    </>
  );
}
