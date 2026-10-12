import { useState } from 'react'
import { ChatPanel, type ChatItem } from '../chat/ChatPanel'
import { ChatComposer } from '../chat/ChatComposer'
import { SavedRepositoriesPanel } from '../repositories/SavedRepositoriesPanel'
import type { RepoResult } from '../../types/search'

type CompareTabProps = {
  input: ChatItem[]
  onSend: (content: string) => void
  savedRepositories: RepoResult[]
}

export function CompareTab({ input, onSend, savedRepositories }: CompareTabProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const toggleRepository = (repository: RepoResult) => {
    setSelectedIds((previous) =>
      previous.includes(repository.repo_id)
        ? previous.filter((id) => id !== repository.repo_id)
        : [...previous, repository.repo_id],
    )
  }

  return (
    <>
      <p className="workspace-description">Select multiple repositories to compare.</p>
      <SavedRepositoriesPanel
        repositories={savedRepositories}
        selectedIds={selectedIds}
        onToggle={toggleRepository}
      />
      <ChatPanel input={input} />
      <ChatComposer onSend={onSend} />
    </>
  )
}