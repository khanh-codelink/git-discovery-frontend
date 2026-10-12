import { useState } from 'react'
import { useSupabaseAuth } from './hooks/useSupabaseAuth'
import type { ChatItem } from './features/chat/ChatPanel'
import { DiscoverTab } from './features/discover/DiscoverTab'
import { SummaryTab } from './features/summary/SummaryTab'
import { CompareTab } from './features/compare/CompareTab'
import { useSavedRepositories } from './features/repositories/useSavedRepositories'
import { TopNavigation } from './components/TopNavigation'
import { WorkspaceHeading, type WorkspaceTab } from './components/WorkspaceHeading'
import { WorkspaceLayout } from './layouts/WorkspaceLayout'
import './App.css'

const compareChatItems: ChatItem[] = [
  { type: 'string', content: 'Tell me which repositories you want to compare.', owner: 'chatbot' },
]

type ConversationTab = Exclude<WorkspaceTab, 'discover' | 'summary'>

export default function App() {
  const { session, isSessionLoading, isAuthActionPending, authError, signIn, signOut } =
    useSupabaseAuth()
  const { savedRepositories, savingRepositoryIds, saveError, saveRepository } = useSavedRepositories()
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('discover')
  const [conversations, setConversations] = useState<Record<ConversationTab, ChatItem[]>>({
    compare: compareChatItems,
  })

  const sendMessage = (tab: ConversationTab, content: string) => {
    setConversations((previous) => ({
      ...previous,
      [tab]: [
        ...previous[tab],
        { type: 'string', content, owner: 'user' },
      ],
    }))
  }

  const compareInput = conversations.compare

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
            <SummaryTab savedRepositories={savedRepositories} />
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
              input={compareInput}
              onSend={(content) => sendMessage('compare', content)}
              savedRepositories={savedRepositories}
            />
          </div>
        </div>
      </section>
    </WorkspaceLayout>
  )
}
