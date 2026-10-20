import type { RepoResult } from '../../types/search'

type SavedRepositoriesPanelProps = {
  repositories: RepoResult[]
  selectedIds: string[]
  onToggle: (repository: RepoResult) => void
  onDelete: (repositoryId: string) => void
  deletingRepositoryIds: string[]
}

export function SavedRepositoriesPanel({ repositories, selectedIds, onToggle, onDelete, deletingRepositoryIds }: SavedRepositoriesPanelProps) {
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
              <div key={repository.repo_id} className="saved-repository-item">
                <button
                  type="button"
                  className="saved-repository-toggle"
                  aria-pressed={isSelected}
                  onClick={() => onToggle(repository)}
                >
                  {repository.name}
                </button>
                <button
                  type="button"
                  className="saved-repository-delete"
                  aria-label={`Delete ${repository.name}`}
                  title={`Delete ${repository.name}`}
                  disabled={deletingRepositoryIds.includes(repository.repo_id)}
                  onClick={() => onDelete(repository.repo_id)}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
