/**
 * Marker for service methods whose contract is fixed now but whose body is
 * completed in a later phase. Throws a clear, greppable error if called early.
 */
export function notImplemented(service: string, method: string, phase: string): never {
  throw new Error(`${service}.${method} is not implemented yet. Scheduled for ${phase}.`)
}
