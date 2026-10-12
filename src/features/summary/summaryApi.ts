import type { RepoResult } from '../../types/search'
import type { SummaryQuery, SummaryResponse } from '../../types/summary'
import { isRecord, isRepoResult } from '../discover/searchApi'

function isSummaryResponse(value: unknown): value is SummaryResponse {
  return (
    isRecord(value) &&
    typeof value.summary_id === 'string' &&
    typeof value.summary === 'string' &&
    typeof value.created_at === 'string' &&
    (value.selected_repo === null || value.selected_repo === undefined || isRepoResult(value.selected_repo))
  )
}

export function createSummaryQuery(repository: RepoResult): string {
  return `Summarize the repository ${repository.full_name} (ID: ${repository.repo_id}) at ${repository.html_url}.`
}

function createMockSummary(repository: RepoResult): SummaryResponse {
  return {
    summary_id: `mock-summary-${repository.repo_id}-${Date.now()}`,
    summary:
      `**${repository.full_name}**\n\n` +
      `${repository.description ?? 'No description is available for this repository.'}\n\n` +
      `- Stars: ${new Intl.NumberFormat().format(repository.stargazers_count)}\n` +
      `- Source: ${repository.html_url}`,
    created_at: new Date().toISOString(),
    selected_repo: repository,
  }
}

export async function summarizeRepository(repository: RepoResult): Promise<SummaryResponse> {
  if (import.meta.env.VITE_USE_MOCK_SEARCH !== 'false') {
    await new Promise<void>((resolve) => window.setTimeout(resolve, 300))
    return createMockSummary(repository)
  }

  const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/+$/, '')
  if (!apiUrl) throw new Error('VITE_API_URL is not configured.')

  const request: SummaryQuery = { query: createSummaryQuery(repository) }
  const response = await fetch(`${apiUrl}/summarize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  })

  if (!response.ok) throw new Error(`Summary request failed (${response.status}).`)

  const data: unknown = await response.json()
  if (!isSummaryResponse(data)) throw new Error('The summary API returned an invalid response.')
  return data
}
