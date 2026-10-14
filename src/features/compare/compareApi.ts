import type { RepoResult } from '../../types/search'
import type { ComparisonQuery, ComparisonResponse } from '../../types/comparison'
import { isRecord, isRepoResult } from '../discover/searchApi'

function isComparisonResponse(value: unknown): value is ComparisonResponse {
  return (
    isRecord(value) &&
    typeof value.comparison_id === 'string' &&
    typeof value.created_at === 'string' &&
    (value.selected_repos === null ||
      value.selected_repos === undefined ||
      (Array.isArray(value.selected_repos) && value.selected_repos.every(isRepoResult))) &&
    (value.criteria === null ||
      value.criteria === undefined ||
      (Array.isArray(value.criteria) && value.criteria.every((item) => typeof item === 'string')))
  )
}

export function createComparisonQuery(criteria: string, repositories: RepoResult[]): string {
  const repositoryList = repositories
    .map((repository) => `- ${repository.full_name} (ID: ${repository.repo_id}) at ${repository.html_url}`)
    .join('\n')
  return `Compare the following repositories based on these criteria: ${criteria}\n\nRepositories:\n${repositoryList}`
}

function createMockComparison(criteria: string, repositories: RepoResult[]): ComparisonResponse {
  return {
    comparison_id: `mock-comparison-${Date.now()}`,
    created_at: new Date().toISOString(),
    selected_repos: repositories.map((repository) => ({ ...repository })),
    criteria: criteria
      .split(/,|\band\b/i)
      .map((item) => item.trim())
      .filter(Boolean),
  }
}

export async function compareRepositories(
  criteria: string,
  repositories: RepoResult[],
): Promise<ComparisonResponse> {
  if (import.meta.env.VITE_USE_MOCK_SEARCH !== 'false') {
    await new Promise<void>((resolve) => window.setTimeout(resolve, 300))
    return createMockComparison(criteria, repositories)
  }

  const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/+$/, '')
  if (!apiUrl) throw new Error('VITE_API_URL is not configured.')

  const request: ComparisonQuery = { query: createComparisonQuery(criteria, repositories) }
  const response = await fetch(`${apiUrl}/compare`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  })

  if (!response.ok) throw new Error(`Comparison request failed (${response.status}).`)

  const data: unknown = await response.json()
  if (!isComparisonResponse(data)) throw new Error('The comparison API returned an invalid response.')
  return data
}
