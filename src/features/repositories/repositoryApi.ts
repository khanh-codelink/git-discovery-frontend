import type { RepoResult } from '../../types/search'

export async function saveRepository(repository: RepoResult): Promise<void> {
  if (import.meta.env.VITE_USE_MOCK_SEARCH !== 'false') {
    await new Promise<void>((resolve) => window.setTimeout(resolve, 300))
    return
  }

  const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/+$/, '')
  if (!apiUrl) throw new Error('VITE_API_URL is not configured.')

  const response = await fetch(`${apiUrl}/save-repo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(repository),
  })

  if (!response.ok) throw new Error(`Save repository request failed (${response.status}).`)
}
