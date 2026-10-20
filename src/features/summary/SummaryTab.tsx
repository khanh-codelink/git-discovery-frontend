import { useState } from 'react'
import { ChatPanel, type ChatItem } from '../chat/ChatPanel'
import { SavedRepositoriesPanel } from '../repositories/SavedRepositoriesPanel'
import type { RepoResult } from '../../types/search'
import type { SummaryResponse } from '../../types/summary'
import { summarizeRepository } from './summaryApi'

type SummaryTabProps = {
  savedRepositories: RepoResult[]
  onDeleteRepository: (repositoryId: string) => void
  deletingRepositoryIds: string[]
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Could not summarize the repository. Please try again.'
}

export function SummaryTab({ savedRepositories, onDeleteRepository, deletingRepositoryIds }: SummaryTabProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [summaries, setSummaries] = useState<Record<string, SummaryResponse>>({})
  const [loadingIds, setLoadingIds] = useState<string[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  const toggleRepository = async (repository: RepoResult) => {
    const repoId = repository.repo_id
    if (selectedId === repoId) {
      setSelectedId(null)
      return
    }

    setSelectedId(repoId)
    if (summaries[repoId] || loadingIds.includes(repoId)) return

    setLoadingIds((previous) => [...previous, repoId])
    setErrors((previous) => {
      const next = { ...previous }
      delete next[repoId]
      return next
    })

    try {
      const result = await summarizeRepository(repository)
      setSummaries((previous) => ({ ...previous, [repoId]: result }))
    } catch (error: unknown) {
      setErrors((previous) => ({ ...previous, [repoId]: getErrorMessage(error) }))
    } finally {
      setLoadingIds((previous) => previous.filter((id) => id !== repoId))
    }
  }

  const selectedRepository = savedRepositories.find((repository) => repository.repo_id === selectedId)
  const selectedSummary = selectedId ? summaries[selectedId] : undefined
  const input: ChatItem[] = selectedRepository
    ? [
        { type: 'string', content: `Summarize ${selectedRepository.full_name}`, owner: 'user' },
        ...(selectedSummary
          ? [{ type: 'markup' as const, content: selectedSummary.summary, owner: 'chatbot' as const }]
          : []),
      ]
    : []

  return (
    <>
      <p className="workspace-description">Select a saved repository to view its summary.</p>
      <SavedRepositoriesPanel
        repositories={savedRepositories}
        selectedIds={selectedId ? [selectedId] : []}
        onToggle={toggleRepository}
        onDelete={onDeleteRepository}
        deletingRepositoryIds={deletingRepositoryIds}
      />
      <ChatPanel
        input={input}
        isLoading={selectedId !== null && loadingIds.includes(selectedId)}
        loadingText="Summarizing repository..."
        error={selectedId ? errors[selectedId] : ''}
      />
    </>
  )
}