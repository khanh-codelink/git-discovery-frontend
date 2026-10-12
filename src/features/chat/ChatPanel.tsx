import Markdown from 'react-markdown'
import type { RepoResult } from '../../types/search'

export type ChatButton = {
  title: string
  callback: () => void
  color: string
}

export type ChatItem = {
  owner: 'user' | 'chatbot'
} & (
  | { type: 'string' | 'markup'; content: string }
  | { type: 'button'; content: ChatButton[] }
  | { type: 'repository'; content: RepoResult }
)

type ChatPanelProps = {
  input: ChatItem[]
  isLoading?: boolean
  loadingText?: string
  error?: string
  onSaveRepository?: (repository: RepoResult) => void
  savedRepositoryIds?: string[]
  savingRepositoryIds?: string[]
}

export function ChatPanel({
  input,
  isLoading = false,
  loadingText = 'Searching repositories...',
  error = '',
  onSaveRepository,
  savedRepositoryIds = [],
  savingRepositoryIds = [],
}: ChatPanelProps) {
  return (
    <section className="result-panel chat-transcript" aria-label="Chat conversation">
      <div className="result-toolbar">
        <div className="result-tab">
          <span className="tab-indicator" />
          <span className="tab-suffix">CHAT</span>
        </div>
      </div>

      <div className="result-canvas chat-messages" role="log" aria-label="Messages" aria-live="polite">
        {input.length === 0 && <p className="chat-empty">No messages yet.</p>}
        {input.map((item, itemIndex) => (
          <div className={`chat-message chat-message-${item.owner}`} key={itemIndex}>
            <span className="chat-message-owner">{item.owner === 'user' ? 'You' : 'Chatbot'}</span>
            <div className="chat-message-content">
              {item.type === 'button' ? (
                <div className="chat-message-buttons">
                  {item.content.map((button, buttonIndex) => (
                    <button
                      key={buttonIndex}
                      type="button"
                      className="chat-choice-button"
                      onClick={button.callback}
                      style={{ color: button.color, borderColor: button.color }}
                    >
                      {button.title}
                    </button>
                  ))}
                </div>
              ) : item.type === 'repository' ? (
                <article className="chat-repository-card">
                  <a href={item.content.html_url} target="_blank" rel="noreferrer">
                    {item.content.full_name}
                  </a>
                  {item.content.description && <p>{item.content.description}</p>}
                  <span>{new Intl.NumberFormat().format(item.content.stargazers_count)} stars</span>
                  {onSaveRepository && (
                    <button
                      type="button"
                      className="save-repository-button"
                      onClick={() => onSaveRepository(item.content)}
                      disabled={
                        savedRepositoryIds.includes(item.content.repo_id) ||
                        savingRepositoryIds.includes(item.content.repo_id)
                      }
                    >
                      {savedRepositoryIds.includes(item.content.repo_id)
                        ? 'Saved'
                        : savingRepositoryIds.includes(item.content.repo_id)
                          ? 'Saving...'
                          : 'Save Repository'}
                    </button>
                  )}
                </article>
              ) : item.type === 'markup' ? (
                <Markdown skipHtml>{item.content}</Markdown>
              ) : (
                <p className="chat-message-text">{item.content}</p>
              )}
            </div>
          </div>
        ))}
        {isLoading && <p className="chat-search-status" role="status">{loadingText}</p>}
        {error && <p className="chat-search-error" role="alert">{error}</p>}
      </div>
    </section>
  )
}