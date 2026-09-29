import { useState, type FormEvent } from 'react'

export function ChatComposer() {
  const [prompt, setPrompt] = useState('')
  const [notice, setNotice] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!prompt.trim()) return
    setNotice('The chat service is not connected yet.')
  }

  return (
    <section className="chat-panel" aria-label="AI chat input">
      <form className="composer" onSubmit={handleSubmit}>
        <label className="visually-hidden" htmlFor="prompt-input">Message the AI assistant</label>
        <textarea
          id="prompt-input"
          value={prompt}
          onChange={(event) => {
            setPrompt(event.target.value)
            setNotice('')
          }}
          placeholder="Describe a requirement for the git repository"
          rows={2}
        />
        <div className="composer-footer">
          <span className="composer-hint">Enter a prompt to get started</span>
          <button className="send-button" type="submit" disabled={!prompt.trim()}>
            Send <span aria-hidden="true">↗</span>
          </button>
        </div>
      </form>
      {notice && <p className="chat-notice" role="status">{notice}</p>}
    </section>
  )
}