import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../../supabase'

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback
}

export function useSupabaseAuth() {
  const [session, setSession] = useState<Session | null>(null)
  const [isSessionLoading, setIsSessionLoading] = useState(true)
  const [isAuthActionPending, setIsAuthActionPending] = useState(false)
  const [authError, setAuthError] = useState('')

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setIsSessionLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async () => {
    setIsAuthActionPending(true)
    setAuthError('')

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin },
      })

      if (error) throw error
    } catch (error: unknown) {
      setAuthError(getErrorMessage(error, 'Unable to sign in. Please try again.'))
    } finally {
      setIsAuthActionPending(false)
    }
  }

  const signOut = async () => {
    setIsAuthActionPending(true)
    setAuthError('')

    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error: unknown) {
      setAuthError(getErrorMessage(error, 'Unable to sign out. Please try again.'))
    } finally {
      setIsAuthActionPending(false)
    }
  }

  return { session, isSessionLoading, isAuthActionPending, authError, signIn, signOut }
}