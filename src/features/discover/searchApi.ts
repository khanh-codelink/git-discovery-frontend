import type { RepoResult, SearchQuery, SearchResponse } from '../../types/search'

const mockRepositories: RepoResult[] = [
  {
    repo_id: 'vitejs-vite',
    name: 'vite',
    full_name: 'vitejs/vite',
    description: 'Next generation frontend tooling.',
    html_url: 'https://github.com/vitejs/vite',
    stargazers_count: 72000,
  },
  {
    repo_id: 'facebook-react',
    name: 'react',
    full_name: 'facebook/react',
    description: 'The library for web and native user interfaces.',
    html_url: 'https://github.com/facebook/react',
    stargazers_count: 240000,
  },
  {
    repo_id: 'microsoft-typescript',
    name: 'TypeScript',
    full_name: 'microsoft/TypeScript',
    description: 'TypeScript is a language for application-scale JavaScript.',
    html_url: 'https://github.com/microsoft/TypeScript',
    stargazers_count: 105000,
  },
]

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function isRepoResult(value: unknown): value is RepoResult {
  return (
    isRecord(value) &&
    typeof value.repo_id === 'string' &&
    typeof value.name === 'string' &&
    typeof value.full_name === 'string' &&
    (typeof value.description === 'string' || value.description === null) &&
    typeof value.html_url === 'string' &&
    typeof value.stargazers_count === 'number'
  )
}

function isSearchResponse(value: unknown): value is SearchResponse {
  return (
    isRecord(value) &&
    typeof value.search_id === 'string' &&
    typeof value.search_query === 'string' &&
    typeof value.analyzed_query === 'string' &&
    typeof value.text_response === 'string' &&
    (value.search_results === null ||
      (Array.isArray(value.search_results) && value.search_results.every(isRepoResult))) &&
    typeof value.created_at === 'string'
  )
}

function createMockResponse(query: string): SearchResponse {
  return {
    search_id: `mock-${Date.now()}`,
    search_query: query,
    analyzed_query: query,
    text_response: `Here are a few popular repositories to start exploring for "${query}".`,
    search_results: mockRepositories.map((repository) => ({ ...repository })),
    created_at: new Date().toISOString(),
  }
}

export async function searchRepositories(query: string): Promise<SearchResponse> {
  if (import.meta.env.VITE_USE_MOCK_SEARCH !== 'false') {
    await new Promise<void>((resolve) => window.setTimeout(resolve, 300))
    return createMockResponse(query)
  }

  const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/+$/, '')
  if (!apiUrl) throw new Error('VITE_API_URL is not configured.')

  const request: SearchQuery = { query, limit: 10 }
  const response = await fetch(`${apiUrl}/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  })

  if (!response.ok) throw new Error(`Search request failed (${response.status}).`)

  const data: unknown = await response.json()
  if (!isSearchResponse(data)) throw new Error('The search API returned an invalid response.')
  return data
}