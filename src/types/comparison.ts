import type { RepoResult } from './search'

export type ComparisonQuery = {
  query: string
}

export type ComparisonResponse = {
  comparison_id: string
  created_at: string
  selected_repos: RepoResult[] | null
  criteria: string[] | null
}
