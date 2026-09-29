export function WorkspaceHeading() {
  return (
    <div className="workspace-heading">
      <div>
        <h1 className="visually-hidden">Discover repositories</h1>
        <p className="eyebrow">
          <span>DISCOVER</span><span className="eyebrow-slash">|</span>
          <span>SUMMARY</span><span className="eyebrow-slash">|</span>
          <span>COMPARE</span>
        </p>
        <p className="workspace-description">
          A space to find git repositories and libraries for your projects.
        </p>
      </div>
      <div className="session-status"><span className="status-dot" /> Ready for input</div>
    </div>
  )
}