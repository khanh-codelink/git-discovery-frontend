type ProfileResultPanelProps = {
  result: unknown
  isAuthenticated: boolean
  isLoading: boolean
  error: string
  onFetch: () => void
}

export function ProfileResultPanel({
  result,
  isAuthenticated,
  isLoading,
  error,
  onFetch,
}: ProfileResultPanelProps) {
  return (
    <section className="result-panel" aria-label="Result output">
      <div className="result-toolbar">
        <div className="result-tab">
          <span className="tab-indicator" />
          <span className="tab-suffix">OUTPUT</span>
        </div>
        <div className="result-actions">
          <button
            className="run-button"
            type="button"
            onClick={onFetch}
            disabled={!isAuthenticated || isLoading}
            title={!isAuthenticated ? 'Sign in to load your profile' : 'Load profile from the backend'}
          >
            {isLoading ? 'Loading...' : 'Load profile'}
            {!isLoading && <span aria-hidden="true">↗</span>}
          </button>
        </div>
      </div>

      <div className="result-canvas" aria-live="polite">
        {result !== undefined ? (
          <pre className="result-json">{JSON.stringify(result, null, 2) ?? String(result)}</pre>
        ) : (
          <div className="empty-result">
            <div className="empty-result-icon" aria-hidden="true"><span /><span /><span /></div>
            <p className="empty-result-title">Your result will appear here</p>
            <p className="empty-result-copy">Load your profile for saved repositories or describe your requirements for the git repository.</p>
            {!isAuthenticated && <span className="auth-hint">Sign in to enable full features</span>}
          </div>
        )}
      </div>

      <div className="result-statusbar">
        <span>
          <span className="status-dot status-dot-muted" />
          {error ? 'REQUEST FAILED' : isLoading ? 'FETCHING' : 'STANDING BY'}
        </span>
      </div>
    </section>
  )
}