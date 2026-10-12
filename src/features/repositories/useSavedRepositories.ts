import { useState } from 'react'
import type { RepoResult } from '../../types/search'
import { saveRepository } from './repositoryApi'

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Could not save the repository. Please try again.'
}

export function useSavedRepositories() {
  const [savedRepositories, setSavedRepositories] = useState<RepoResult[]>([])
  const [savingRepositoryIds, setSavingRepositoryIds] = useState<string[]>([])
  const [saveError, setSaveError] = useState('')

  const save = async (repository: RepoResult) => {
    if (
      savingRepositoryIds.includes(repository.repo_id) ||
      savedRepositories.some((saved) => saved.repo_id === repository.repo_id)
    ) return

    setSavingRepositoryIds((previous) => [...previous, repository.repo_id])
    setSaveError('')

    try {
      await saveRepository(repository)
      setSavedRepositories((previous) =>
        previous.some((saved) => saved.repo_id === repository.repo_id) ? previous : [...previous, repository],
      )
    } catch (error: unknown) {
      setSaveError(getErrorMessage(error))
    } finally {
      setSavingRepositoryIds((previous) => previous.filter((id) => id !== repository.repo_id))
    }
  }

  return { savedRepositories, savingRepositoryIds, saveError, saveRepository: save }
}
