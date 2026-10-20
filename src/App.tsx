import { useState } from 'react'
import { useSupabaseAuth } from './hooks/useSupabaseAuth'
import { DiscoverTab } from './features/discover/DiscoverTab'
import { SummaryTab } from './features/summary/SummaryTab'
import { CompareTab } from './features/compare/CompareTab'
import { useSavedRepositories } from './features/repositories/useSavedRepositories'
import { TopNavigation } from './components/TopNavigation'
import { WorkspaceHeading, type WorkspaceTab } from './components/WorkspaceHeading'
import { WorkspaceLayout } from './layouts/WorkspaceLayout'
import './App.css'

export default function App() {
  const { session, isSessionLoading, isAuthActionPending, authError, signIn, signOut } =
    useSupabaseAuth()
  const {
    savedRepositories,
    savingRepositoryIds,
    deletingRepositoryIds,
    saveError,
    saveRepository,
    deleteRepository,
  } = useSavedRepositories(session?.access_token)
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('discover')

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
      <section className="workspace-section" aria-label="Repository workspace">
        {authError && (
          <div className="alert-message" role="alert">
            {authError}
          </div>
        )}
        <div className="workspace-frame">
          <WorkspaceHeading activeTab={activeTab} onTabChange={setActiveTab} />
          {saveError && activeTab !== 'discover' && (
            <div className="alert-message" role="alert">{saveError}</div>
          )}
          <div
            id="discover-panel"
            className="workspace-content"
            role="tabpanel"
            aria-labelledby="discover-tab"
            tabIndex={0}
            hidden={activeTab !== 'discover'}
          >
            <DiscoverTab
              onSaveRepository={saveRepository}
              savedRepositoryIds={savedRepositories.map((repository) => repository.repo_id)}
              savingRepositoryIds={savingRepositoryIds}
              saveError={saveError}
            />
          </div>
          <div
            id="summary-panel"
            className="workspace-content"
            role="tabpanel"
            aria-labelledby="summary-tab"
            tabIndex={0}
            hidden={activeTab !== 'summary'}
          >
            <SummaryTab
              savedRepositories={savedRepositories}
              onDeleteRepository={deleteRepository}
              deletingRepositoryIds={deletingRepositoryIds}
            />
          </div>
          <div
            id="compare-panel"
            className="workspace-content"
            role="tabpanel"
            aria-labelledby="compare-tab"
            tabIndex={0}
            hidden={activeTab !== 'compare'}
          >
            <CompareTab
              savedRepositories={savedRepositories}
              onDeleteRepository={deleteRepository}
              deletingRepositoryIds={deletingRepositoryIds}
            />
          </div>
        </div>
      </section>
    </WorkspaceLayout>
  )
}
