import type { RepoResult } from './search'

export type SummarizeRequest = {
  repositories: [RepoResult, ...RepoResult[]]
}

export type SummaryResponse = {
  summary_id: string
  summary: string
  created_at: string
  selected_repo: RepoResult | null
}
