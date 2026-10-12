export type WorkspaceTab = 'discover' | 'summary' | 'compare'

type WorkspaceHeadingProps = {
  activeTab: WorkspaceTab
  onTabChange: (tab: WorkspaceTab) => void
}

const workspaceTabs: { id: WorkspaceTab; label: string }[] = [
  { id: 'discover', label: 'DISCOVER' },
  { id: 'summary', label: 'SUMMARY' },
  { id: 'compare', label: 'COMPARE' },
]

export function WorkspaceHeading({ activeTab, onTabChange }: WorkspaceHeadingProps) {
  const handleTabKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = workspaceTabs.findIndex((tab) => tab.id === activeTab)
    let nextIndex: number

    if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % workspaceTabs.length
    else if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + workspaceTabs.length) % workspaceTabs.length
    else if (event.key === 'Home') nextIndex = 0
    else if (event.key === 'End') nextIndex = workspaceTabs.length - 1
    else return

    event.preventDefault()
    onTabChange(workspaceTabs[nextIndex].id)
    event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]')[nextIndex].focus()
  }

  return (
    <div className="workspace-heading">
      <div>
        <h1 className="visually-hidden">{workspaceTabs.find((tab) => tab.id === activeTab)?.label} repositories</h1>
        <div className="workspace-tabs" role="tablist" aria-label="Workspace views" onKeyDown={handleTabKeyDown}>
          {workspaceTabs.map((tab) => (
            <button
              key={tab.id}
              id={`${tab.id}-tab`}
              className="workspace-tab"
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`${tab.id}-panel`}
              tabIndex={activeTab === tab.id ? 0 : -1}
              onClick={() => onTabChange(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}