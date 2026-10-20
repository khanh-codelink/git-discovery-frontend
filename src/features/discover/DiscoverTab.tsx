import { useState } from 'react'
import { ChatPanel, type ChatItem } from '../chat/ChatPanel'
import { ChatComposer } from '../chat/ChatComposer'
import { searchRepositories } from './searchApi'
import type { RepoResult } from '../../types/search'

const initialMessages: ChatItem[] = [
  { type: 'string', content: 'Please describe what repository you are looking for.', owner: 'chatbot' },
]

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Search failed. Please try again.'
}

type DiscoverTabProps = {
  onSaveRepository: (repository: RepoResult) => void
  savedRepositoryIds: string[]
  savingRepositoryIds: string[]
  saveError: string
}

export function DiscoverTab({
  onSaveRepository,
  savedRepositoryIds,
  savingRepositoryIds,
  saveError,
}: DiscoverTabProps) {
  const [messages, setMessages] = useState<ChatItem[]>(initialMessages)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const sendMessage = async (content: string) => {
    setMessages((previous) => [...previous, { type: 'string', content, owner: 'user' }])
    setIsLoading(true)
    setError('')

    try {
      const result = await searchRepositories(content)
      setMessages((previous) => [
        ...previous,
        { type: 'string', content: result.text_response, owner: 'chatbot' },
        ...(result.search_results ?? []).map((repository) => ({
          type: 'repository' as const,
          content: repository,
          owner: 'chatbot' as const,
        })),
      ])
    } catch (requestError: unknown) {
      setError(getErrorMessage(requestError))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <p className="workspace-description">Enter your requirements to search for Git repositories.</p>
      <ChatPanel
        input={messages}
        isLoading={isLoading}
        error={error || saveError}
        onSaveRepository={onSaveRepository}
        savedRepositoryIds={savedRepositoryIds}
        savingRepositoryIds={savingRepositoryIds}
      />
      <ChatComposer onSend={sendMessage} disabled={isLoading} />
      {import.meta.env.VITE_USE_MOCK_SEARCH === 'true' && (
        <button
          className="send-button"
          type="button"
          onClick={() => sendMessage('test mock')}
          disabled={isLoading}
        >
          TestMock
        </button>
      )}
    </>
  )
}