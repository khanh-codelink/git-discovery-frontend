import type { ReactNode } from 'react'

type WorkspaceLayoutProps = {
  topbarActions: ReactNode
  children: ReactNode
}

export function WorkspaceLayout({ topbarActions, children }: WorkspaceLayoutProps) {
  return (
    <div className="app-frame">
      <header className="topbar">
        <a className="brand" href="#workspace" aria-label="Git Discovery workspace">
          <span className="brand-mark" aria-hidden="true">&lt;/&gt;</span>
          <span className="brand-name">Git Discovery</span>
          <span className="brand-divider" aria-hidden="true" />
          <span className="workspace-label">WORKSPACE</span>
        </a>
        <div className="topbar-actions">{topbarActions}</div>
      </header>
      <main className="workspace-shell" id="workspace">{children}</main>
    </div>
  )
}