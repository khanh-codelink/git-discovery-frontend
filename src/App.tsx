import { useEffect, useState } from 'react'
import { supabase } from '../supabase'

export default function App() {
  const [session, setSession] = useState<any>(null)
  const [backendData, setBackendData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // 1. Listen for Google OAuth login state
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  // 2. Trigger Google OAuth
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // Redirect back to this page after Google auth
        redirectTo: window.location.origin
      }
    })
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setBackendData(null)
  }

  // 3. Fetch data from your FastAPI Backend securely
  const fetchProfileFromBackend = async () => {
    if (!session) return
    
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/profile`, {
        method: 'GET',
        headers: {
          // Pass the JWT to FastAPI
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) throw new Error('Failed to fetch from backend')
      
      const data = await response.json()
      setBackendData(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // UI Render
  if (!session) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <h1>Welcome to the App</h1>
        <button onClick={handleGoogleLogin} style={{ padding: '10px 20px', cursor: 'pointer' }}>
          Login with Google
        </button>
      </div>
    )
  }

  return (
    <div style={{ padding: '50px' }}>
      <h1>Dashboard</h1>
      <p>Logged in as: {session.user.email}</p>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button onClick={fetchProfileFromBackend}>
          Fetch Data from FastAPI
        </button>
        <button onClick={handleLogout}>
          Logout
        </button>
      </div>

      {loading && <p>Loading backend data...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      
      {backendData && (
        <div style={{ background: '#f4f4f4', padding: '20px', borderRadius: '8px' }}>
          <h3>Data from Python Backend:</h3>
          <pre>{JSON.stringify(backendData, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}