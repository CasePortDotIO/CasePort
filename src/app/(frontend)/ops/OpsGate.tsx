import Link from 'next/link'

/**
 * The access gate for the internal operations cockpit. Shown when no CasePort
 * operator is authenticated. Internal only: this surface never reveals engine
 * state to an unauthenticated visitor. It points to the admin sign in and says
 * nothing more.
 */
export function OpsGate() {
  return (
    <div className="ops-root flex min-h-screen items-center justify-center px-6">
      <div className="ops-card w-full max-w-md p-8 text-center">
        <div className="mb-6 flex items-center justify-center gap-2">
          <span className="lane-demand lane-dot" aria-hidden />
          <span className="ops-mono text-xs uppercase tracking-[0.2em] text-[color:var(--muted-foreground)]">
            CasePort Internal Operations
          </span>
        </div>
        <h1 className="mb-2 text-lg font-semibold">Operator sign in required</h1>
        <p className="mb-6 text-sm text-[color:var(--secondary-foreground)]">
          This console is restricted to authenticated CasePort operators. Sign in to continue.
        </p>
        <Link
          href="/admin"
          className="inline-flex items-center justify-center rounded-md bg-[color:var(--primary)] px-4 py-2 text-sm font-medium text-[color:var(--primary-foreground)]"
        >
          Sign in
        </Link>
      </div>
    </div>
  )
}
