import { useId, useState } from 'react'

type ChatComposerProps = {
  onSend: (content: string) => void
  disabled?: boolean
}

export function ChatComposer({ onSend, disabled = false }: ChatComposerProps) {
  const promptId = useId()
  const [prompt, setPrompt] = useState('')

  const handleSubmit = () => {
    const content = prompt.trim()
    if (!content) return
    onSend(content)
    setPrompt('')
  }

  return (
    <section className="chat-panel" aria-label="AI chat input">
      <div className="composer">
        <label className="visually-hidden" htmlFor={promptId}>Message the AI assistant</label>
        <textarea
          id={promptId}
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          placeholder="Describe a requirement for the git repository"
          rows={2}
          disabled={disabled}
        />
        <div className="composer-footer">
          <span className="composer-hint">Enter a prompt to get started</span>
          <button className="send-button" type="button" onClick={handleSubmit} disabled={disabled || !prompt.trim()}>
            Send <span aria-hidden="true">↗</span>
          </button>
        </div>
      </div>
    </section>
  )
}