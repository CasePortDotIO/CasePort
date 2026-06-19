/** Recovery timeline visual. Mirrors source `CP.ui.recoveryViz()`. */
export function RecoveryViz({
  phases,
}: {
  phases: { phase: string; time: string; desc: string }[];
}) {
  return (
    <div className="rv-track">
      {phases.map((p, i) => (
        <div className="rv-step r" key={i}>
          <div className="rv-dot"></div>
          <div className="rv-content">
            <div className="rv-time">{p.time}</div>
            <div className="rv-phase">{p.phase}</div>
            <p className="rv-desc">{p.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
