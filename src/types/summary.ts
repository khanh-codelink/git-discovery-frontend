import type { RepoResult } from './search'

export type SummaryQuery = {
  query: string
}

export type SummaryResponse = {
  summary_id: string
  summary: string
  created_at: string
  selected_repo: RepoResult | null
}
