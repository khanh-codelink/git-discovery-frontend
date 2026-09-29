import { useSupabaseAuth } from './hooks/useSupabaseAuth'
import { ChatComposer } from './features/chat/ChatComposer'
import { ProfileResultPanel } from './features/profile/ProfileResultPanel'
import { useProfileRequest } from './features/profile/useProfileRequest'
import { TopNavigation } from './components/TopNavigation'
import { WorkspaceHeading } from './components/WorkspaceHeading'
import { WorkspaceLayout } from './layouts/WorkspaceLayout'
import './App.css'

export default function App() {
  const { session, isSessionLoading, isAuthActionPending, authError, signIn, signOut } =
    useSupabaseAuth()
  const profile = useProfileRequest(session?.access_token)

  return (
    <WorkspaceLayout
      topbarActions={
        <TopNavigation
          session={session}
          isSessionLoading={isSessionLoading}
          isAuthActionPending={isAuthActionPending}
          onSignIn={signIn}
          onSignOut={signOut}
        />
      }
    >
      <WorkspaceHeading />
      {(authError || profile.error) && (
        <div className="alert-message" role="alert">
          {authError || profile.error}
        </div>
      )}
      <ProfileResultPanel
        result={profile.result}
        isAuthenticated={Boolean(session)}
        isLoading={profile.isLoading}
        error={profile.error}
        onFetch={profile.fetchProfile}
      />
      <ChatComposer />
    </WorkspaceLayout>
  )
}
