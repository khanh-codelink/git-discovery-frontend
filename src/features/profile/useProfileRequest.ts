import { useState } from 'react'

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Something went wrong. Please try again.'
}

export function useProfileRequest(accessToken: string | undefined) {
  const [result, setResult] = useState<unknown>()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchProfile = async () => {
    if (!accessToken) return

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/profile`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })

      if (!response.ok) throw new Error(`Profile request failed (${response.status}).`)

      const data: unknown = await response.json()
      setResult(data)
    } catch (requestError: unknown) {
      setError(getErrorMessage(requestError))
    } finally {
      setIsLoading(false)
    }
  }

  return { result, isLoading, error, fetchProfile }
}