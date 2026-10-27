import type { RepoResult } from './search'

export type ComparisonQuery = {
  query: string
  repositories: [RepoResult, ...RepoResult[]]
}

export type ComparisonReportRepository = {
  full_name: string
  summary: string
  key_features: string[]
  tech_stack: string[]
  use_cases: string[]
  strengths: string[]
  limitations: string[]
}

export type ComparisonAssessment = {
  full_name: string
  assessment: string
}

export type ComparisonReportSection = {
  criterion: string
  assessments: ComparisonAssessment[]
  best_fit: string
}

export type ComparisonReport = {
  overview: string
  repositories: ComparisonReportRepository[]
  comparison: ComparisonReportSection[]
  recommendation: string
}

export type ComparisonResponse = {
  comparison_id: string
  comparison: string
  selected_repos: RepoResult[]
  missing_readme: string[]
  report: ComparisonReport
  report_type: 'compare'
  created_at: string
}
