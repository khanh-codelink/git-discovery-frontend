import type { RepoResult } from '../../types/search'

type SavedRepositoriesPanelProps = {
  repositories: RepoResult[]
  selectedIds: string[]
  onToggle: (repository: RepoResult) => void
}

export function SavedRepositoriesPanel({ repositories, selectedIds, onToggle }: SavedRepositoriesPanelProps) {
  return (
    <section className="saved-repositories-panel" aria-label="Saved repositories">
      <h2 className="saved-repositories-title">Saved repositories</h2>
      {repositories.length === 0 ? (
        <p className="saved-repositories-empty">No saved repositories yet.</p>
      ) : (
        <div className="saved-repositories-list">
          {repositories.map((repository) => {
            const isSelected = selectedIds.includes(repository.repo_id)
            return (
              <button
                key={repository.repo_id}
                type="button"
                className="saved-repository-toggle"
                aria-pressed={isSelected}
                onClick={() => onToggle(repository)}
              >
                {repository.name}
              </button>
            )
          })}
        </div>
      )}
    </section>
  )
}
