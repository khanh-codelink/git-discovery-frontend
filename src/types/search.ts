export type SearchQuery = {
  query: string
  limit?: number | null
}

export type RepoResult = {
  repo_id: string
  name: string
  full_name: string
  description: string | null
  html_url: string
  stargazers_count: number
}

export type SearchResponse = {
  search_id: string
  search_query: string
  analyzed_query: string
  text_response: string
  search_results: RepoResult[] | null
  created_at: string
}