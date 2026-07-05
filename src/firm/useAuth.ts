// Stub auth for the ported firm dashboard. Real firm-session auth binds later.
export function useAuth() {
  return {
    user: { name: 'Michael', firmName: 'Peachtree Injury Partners', email: 'partner@peachtreeinjury.example' },
    isAuthenticated: true,
    logout: () => {},
  }
}
export default useAuth
