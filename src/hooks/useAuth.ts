import { useEffect, useState, useRef } from 'react'
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

  // Track if we had a valid user to prevent oscillation during token refresh
  const hadValidUserRef = useRef(false)
  const lastUserIdRef = useRef<string | null>(null)

  useEffect(() => {
    // Get initial session with error handling
    supabase.auth.getSession()
      .then(({ data: { session }, error }) => {
        if (error) {
          console.error('[Finny] Auth error:', error)
        }
        const newUser = session?.user ?? null
        console.log('[Finny] useAuth: Initial session', { userId: newUser?.id })

        if (newUser) {
          hadValidUserRef.current = true
          lastUserIdRef.current = newUser.id
        }
        setUser(newUser)
        setLoading(false)
      })
      .catch((err) => {
        console.error('[Finny] Auth failed:', err)
        setLoading(false)
      })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        const newUser = session?.user ?? null
        console.log('[Finny] useAuth: Auth state changed', {
          event,
          userId: newUser?.id,
          hadValidUser: hadValidUserRef.current,
          lastUserId: lastUserIdRef.current
        })

        // If we get null but previously had a valid user, ignore it
        // This handles Supabase token refresh oscillation
        if (!newUser && hadValidUserRef.current && event !== 'SIGNED_OUT') {
          console.log('[Finny] useAuth: Ignoring null user during token refresh')
          return
        }

        if (newUser) {
          hadValidUserRef.current = true
          lastUserIdRef.current = newUser.id
        } else if (event === 'SIGNED_OUT') {
          // Only reset on explicit sign out
          hadValidUserRef.current = false
          lastUserIdRef.current = null
        }

        setUser(newUser)
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
