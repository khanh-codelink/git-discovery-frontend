import type { RepoResult } from '../../types/search'

export async function saveRepository(repository: RepoResult, accessToken: string | undefined): Promise<void> {
  if (import.meta.env.VITE_USE_MOCK_SAVE === 'true') {
    await new Promise<void>((resolve) => window.setTimeout(resolve, 300))
    return
  }

  if (!accessToken) throw new Error('Please sign in to save repositories.')

  const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/+$/, '')
  if (!apiUrl) throw new Error('VITE_API_URL is not configured.')

  const response = await fetch(`${apiUrl}/save-repositories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      repositories: [repository]
    }),
  })

  if (!response.ok) throw new Error(`Save repository request failed (${response.status}).`)
}

export async function getSavedRepositories(accessToken: string | undefined): Promise<{items: RepoResult[]}> {
  if (import.meta.env.VITE_USE_MOCK_SAVE === 'true') {
    await new Promise<void>((resolve) => window.setTimeout(resolve, 300))
    return {items: []}
  }

  if (!accessToken) throw new Error('Please sign in to get saved repositories.')

  const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/+$/, '')
  if (!apiUrl) throw new Error('VITE_API_URL is not configured.')

  const response = await fetch(`${apiUrl}/repositories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      page: 1,
      per_page: 50
    }),
  })

  if (!response.ok) throw new Error(`Get saved repositories request failed (${response.status}).`)
  return response.json() as Promise<{items: RepoResult[]}>
}

export async function deleteRepositoryRequest(repositoryId: string, accessToken: string | undefined): Promise<void> {
  if (!accessToken) throw new Error('Please sign in to delete repositories.')

  const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/+$/, '')
  if (!apiUrl) throw new Error('VITE_API_URL is not configured.')

  const response = await fetch(`${apiUrl}/repositories/${repositoryId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) throw new Error(`Delete repository request failed (${response.status}).`)
}