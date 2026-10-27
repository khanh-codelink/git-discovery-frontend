import { useState } from 'react'
import { ChatPanel, type ChatItem } from '../chat/ChatPanel'
import { ChatComposer } from '../chat/ChatComposer'
import { SavedRepositoriesPanel } from '../repositories/SavedRepositoriesPanel'
import type { RepoResult } from '../../types/search'
import type { ComparisonReport } from '../../types/comparison'
import { compareRepositories } from './compareApi'

const initialMessages: ChatItem[] = [
  {
    type: 'string',
    content: 'Select at least two saved repositories, then tell me the criteria to compare them by.',
    owner: 'chatbot',
  },
]

function formatReportList(title: string, values: string[]) {
  return values.length ? `**${title}**\n\n${values.map((value) => `- ${value}`).join('\n')}` : ''
}

function formatComparisonReport(report: ComparisonReport) {
  const repositoryDetails = report.repositories
    .map((repository) =>
      [
        `### ${repository.full_name}`,
        repository.summary,
        formatReportList('Key features', repository.key_features),
        formatReportList('Tech stack', repository.tech_stack),
        formatReportList('Use cases', repository.use_cases),
        formatReportList('Strengths', repository.strengths),
        formatReportList('Limitations', repository.limitations),
      ]
        .filter(Boolean)
        .join('\n\n'),
    )
    .join('\n\n')
  const comparisonDetails = report.comparison
    .map((section) =>
      [
        `### ${section.criterion}`,
        section.assessments.map((assessment) => `- **${assessment.full_name}:** ${assessment.assessment}`).join('\n'),
        `Best fit: **${section.best_fit}**`,
      ].join('\n\n'),
    )
    .join('\n\n')

  return [
    `## Overview\n\n${report.overview}`,
    `## Repositories\n\n${repositoryDetails}`,
    `## Comparison\n\n${comparisonDetails}`,
    `## Recommendation\n\n${report.recommendation}`,
  ].join('\n\n')
}

type CompareTabProps = {
  savedRepositories: RepoResult[]
  accessToken: string | undefined
  onDeleteRepository: (repositoryId: string) => void
  deletingRepositoryIds: string[]
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Comparison failed. Please try again.'
}

function hasAtLeastTwoRepositories(
  repositories: RepoResult[],
): repositories is [RepoResult, RepoResult, ...RepoResult[]] {
  return repositories.length >= 2
}

export function CompareTab({
  savedRepositories,
  accessToken,
  onDeleteRepository,
  deletingRepositoryIds,
}: CompareTabProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [messages, setMessages] = useState<ChatItem[]>(initialMessages)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const toggleRepository = (repository: RepoResult) => {
    setSelectedIds((previous) =>
      previous.includes(repository.repo_id)
        ? previous.filter((id) => id !== repository.repo_id)
        : [...previous, repository.repo_id],
    )
  }

  const sendMessage = async (criteria: string) => {
    const selectedRepositories = savedRepositories.filter((repository) => selectedIds.includes(repository.repo_id))
    if (!hasAtLeastTwoRepositories(selectedRepositories)) {
      setError('Select at least two saved repositories to compare.')
      return
    }

    setMessages((previous) => [...previous, { type: 'string', content: criteria, owner: 'user' }])
    setIsLoading(true)
    setError('')

    try {
      const result = await compareRepositories(criteria, selectedRepositories, accessToken)
      setMessages((previous) => [
        ...previous,
        { type: 'markup', content: formatComparisonReport(result.report), owner: 'chatbot' },
        ...(result.selected_repos ?? []).map((repository) => ({
          type: 'repository' as const,
          content: repository,
          owner: 'chatbot' as const,
        })),
      ])
    } catch (requestError: unknown) {
      setError(getErrorMessage(requestError))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <p className="workspace-description">Select multiple repositories to compare.</p>
      <SavedRepositoriesPanel
        repositories={savedRepositories}
        selectedIds={selectedIds}
        onToggle={toggleRepository}
        onDelete={onDeleteRepository}
        deletingRepositoryIds={deletingRepositoryIds}
      />
      <ChatPanel input={messages} isLoading={isLoading} loadingText="Comparing repositories..." error={error} />
      <ChatComposer onSend={sendMessage} disabled={isLoading} />
    </>
  )
}
