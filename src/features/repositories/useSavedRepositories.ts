import { useEffect, useState } from 'react'
import type { RepoResult } from '../../types/search'
import { saveRepository, getSavedRepositories, deleteRepositoryRequest } from './repositoryApi'

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Could not save the repository. Please try again.'
}

export function useSavedRepositories(accessToken: string | undefined) {
  const [savedRepositories, setSavedRepositories] = useState<RepoResult[]>([])
  const [savingRepositoryIds, setSavingRepositoryIds] = useState<string[]>([])
  const [deletingRepositoryIds, setDeletingRepositoryIds] = useState<string[]>([])
  const [saveError, setSaveError] = useState('')

  useEffect(() => {
    let isActive = true

    const fetchSavedRepositories = async () => {
      setSavedRepositories([])
      setSaveError('')
      if (!accessToken) return

      try {
        const repositories = await getSavedRepositories(accessToken)
        if (isActive) setSavedRepositories(repositories)
      } catch (error: unknown) {
        if (isActive) setSaveError(getErrorMessage(error))
      }
    }

    void fetchSavedRepositories()

    return () => {
      isActive = false
    }
  }, [accessToken])

  const save = async (repository: RepoResult) => {
    if (
      savingRepositoryIds.includes(repository.repo_id) ||
      savedRepositories.some((saved) => saved.repo_id === repository.repo_id)
    ) return

    setSavingRepositoryIds((previous) => [...previous, repository.repo_id])
    setSaveError('')

    try {
      await saveRepository(repository, accessToken)
      setSavedRepositories((previous) =>
        previous.some((saved) => saved.repo_id === repository.repo_id) ? previous : [...previous, repository],
      )
    } catch (error: unknown) {
      setSaveError(getErrorMessage(error))
    } finally {
      setSavingRepositoryIds((previous) => previous.filter((id) => id !== repository.repo_id))
    }
  }

  const deleteRepository = async (repositoryId: string) => {
    if (deletingRepositoryIds.includes(repositoryId)) return

    setDeletingRepositoryIds((previous) => [...previous, repositoryId])
    setSaveError('')
    try {
      await deleteRepositoryRequest(repositoryId, accessToken)
      setSavedRepositories((previous) => previous.filter((repo) => repo.repo_id !== repositoryId))
    } catch (error: unknown) {
      setSaveError(getErrorMessage(error))
    } finally {
      setDeletingRepositoryIds((previous) => previous.filter((id) => id !== repositoryId))
    }
  }

  return { savedRepositories, savingRepositoryIds, deletingRepositoryIds, saveError, saveRepository: save, deleteRepository }
}
