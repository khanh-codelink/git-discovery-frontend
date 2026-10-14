import { useState } from 'react'
import { ChatPanel, type ChatItem } from '../chat/ChatPanel'
import { ChatComposer } from '../chat/ChatComposer'
import { SavedRepositoriesPanel } from '../repositories/SavedRepositoriesPanel'
import type { RepoResult } from '../../types/search'
import { compareRepositories } from './compareApi'

const initialMessages: ChatItem[] = [
  {
    type: 'string',
    content: 'Select at least two saved repositories, then tell me the criteria to compare them by.',
    owner: 'chatbot',
  },
]

type CompareTabProps = {
  savedRepositories: RepoResult[]
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Comparison failed. Please try again.'
}

export function CompareTab({ savedRepositories }: CompareTabProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [messages, setMessages] = useState<ChatItem[]>(initialMessages)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const toggleRepository = (repository: RepoResult) => {
    setSelectedIds((previous) =>
      previous.includes(repository.repo_id)
        ? previous.filter((id) => id !== repository.repo_id)
        : [...previous, repository.repo_id],
    )
  }

  const sendMessage = async (criteria: string) => {
    const selectedRepositories = savedRepositories.filter((repository) => selectedIds.includes(repository.repo_id))
    if (selectedRepositories.length < 2) {
      setError('Select at least two saved repositories to compare.')
      return
    }

    setMessages((previous) => [...previous, { type: 'string', content: criteria, owner: 'user' }])
    setIsLoading(true)
    setError('')

    try {
      const result = await compareRepositories(criteria, selectedRepositories)
      const criteriaList = result.criteria?.length
        ? result.criteria.map((item) => `- ${item}`).join('\n')
        : '- No criteria returned.'
      setMessages((previous) => [
        ...previous,
        { type: 'markup', content: `**Comparison criteria**\n\n${criteriaList}`, owner: 'chatbot' },
        ...(result.selected_repos ?? []).map((repository) => ({
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
      <p className="workspace-description">Select multiple repositories to compare.</p>
      <SavedRepositoriesPanel
        repositories={savedRepositories}
        selectedIds={selectedIds}
        onToggle={toggleRepository}
      />
      <ChatPanel input={messages} isLoading={isLoading} loadingText="Comparing repositories..." error={error} />
      <ChatComposer onSend={sendMessage} disabled={isLoading} />
    </>
  )
}
