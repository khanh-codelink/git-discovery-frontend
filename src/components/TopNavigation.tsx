import type { Session } from '@supabase/supabase-js'

type TopNavigationProps = {
  session: Session | null
  isSessionLoading: boolean
  isAuthActionPending: boolean
  onSignIn: () => void
  onSignOut: () => void
}

export function TopNavigation({
  session,
  isSessionLoading,
  isAuthActionPending,
  onSignIn,
  onSignOut,
}: TopNavigationProps) {
  if (!session) {
    return (
      <button
        className="sign-in-button"
        type="button"
        onClick={onSignIn}
        disabled={isSessionLoading || isAuthActionPending}
      >
        <span aria-hidden="true">G</span>
        {isSessionLoading ? 'Checking session...' : isAuthActionPending ? 'Connecting...' : 'Sign in'}
      </button>
    )
  }

  return (
    <div className="account-control">
      <span className="account-avatar" aria-hidden="true">
        {(session.user.email?.[0] ?? 'U').toUpperCase()}
      </span>
      <span className="account-email">{session.user.email ?? 'Signed in'}</span>
      <button className="account-button" type="button" onClick={onSignOut} disabled={isAuthActionPending}>
        {isAuthActionPending ? 'Signing out...' : 'Sign out'}
      </button>
    </div>
  )
}