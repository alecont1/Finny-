import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

// Use configured APP_URL for OAuth redirects (required for Google OAuth to work)
// Falls back to window.location.origin for local development
const getAppUrl = () => {
  const configuredUrl = import.meta.env.VITE_APP_URL
  if (configuredUrl) {
    // Remove trailing slash if present
    return configuredUrl.replace(/\/$/, '')
  }
  // Fallback for local development
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  return ''
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session with error handling
    supabase.auth.getSession()
      .then(({ data: { session }, error }) => {
        if (error) {
          console.error('Auth error:', error)
        }
        setUser(session?.user ?? null)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Auth failed:', err)
        setLoading(false)
      })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signInWithGoogle = () => {
    const appUrl = getAppUrl()
    console.log('Google OAuth redirect URL:', `${appUrl}/dashboard`)
    return supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${appUrl}/dashboard` }
    })
  }

  const signInWithEmail = (email: string, password: string) =>
    supabase.auth.signInWithPassword({ email, password })

  const signUp = (email: string, password: string, name: string) =>
    supabase.auth.signUp({
      email,
      password,
      options: { data: { name } }
    })

  const signOut = () => supabase.auth.signOut()

  const resetPassword = (email: string) => {
    const appUrl = getAppUrl()
    return supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${appUrl}/reset-password`
    })
  }

  return {
    user,
    loading,
    signInWithGoogle,
    signInWithEmail,
    signUp,
    signOut,
    resetPassword
  }
}
