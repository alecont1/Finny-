import { useEffect, useState, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'
import type { Profile, ProfileUpdate } from '../types/database'

// Retry configuration
const MAX_RETRIES = 3
const INITIAL_RETRY_DELAY = 500 // ms
const MAX_RETRY_DELAY = 4000 // ms

type FetchStatus = 'idle' | 'loading' | 'success' | 'error'

export function useProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fetchStatus, setFetchStatus] = useState<FetchStatus>('idle')

  // Track if component is mounted to avoid state updates after unmount
  const isMountedRef = useRef(true)
  // Track retry attempts
  const retryCountRef = useRef(0)
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  // Track if we already have a valid profile to avoid resetting on auth oscillation
  const hasValidProfileRef = useRef(false)
  const lastUserIdRef = useRef<string | null>(null)

  const fetchProfile = useCallback(async (isRetry = false) => {
    // CRITICAL: Only fetch if user.id is available
    if (!user?.id) {
      console.log('[Finny] fetchProfile: No user.id available, skipping fetch')
      setProfile(null)
      setLoading(false)
      setFetchStatus('idle')
      return
    }

    // Reset retry count if this is a fresh fetch (not a retry)
    if (!isRetry) {
      retryCountRef.current = 0
    }

    console.log(`[Finny] fetchProfile: Starting fetch for user ${user.id} (attempt ${retryCountRef.current + 1}/${MAX_RETRIES + 1})`)

    setLoading(true)
    setError(null)
    setFetchStatus('loading')

    try {
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (!isMountedRef.current) {
        console.log('[Finny] fetchProfile: Component unmounted, ignoring result')
        return
      }

      if (fetchError) {
        throw fetchError
      }

      console.log('[Finny] fetchProfile: Success!', {
        has_completed_onboarding: data?.has_completed_onboarding,
        id: data?.id
      })

      setProfile(data)
      setError(null)
      setFetchStatus('success')
      setLoading(false)
      retryCountRef.current = 0 // Reset on success
      hasValidProfileRef.current = true // Mark that we have a valid profile
    } catch (err) {
      if (!isMountedRef.current) return

      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar perfil'
      console.error(`[Finny] fetchProfile: Error (attempt ${retryCountRef.current + 1})`, err)

      // Check if we should retry
      if (retryCountRef.current < MAX_RETRIES) {
        retryCountRef.current += 1
        const delay = Math.min(
          INITIAL_RETRY_DELAY * Math.pow(2, retryCountRef.current - 1),
          MAX_RETRY_DELAY
        )

        console.log(`[Finny] fetchProfile: Scheduling retry in ${delay}ms`)

        retryTimeoutRef.current = setTimeout(() => {
          if (isMountedRef.current) {
            fetchProfile(true)
          }
        }, delay)
        return
      }

      // Max retries reached - set error state
      console.error('[Finny] fetchProfile: Max retries reached, giving up')
      setError(errorMessage)
      setFetchStatus('error')
      setLoading(false)
    }
  }, [user?.id]) // IMPORTANT: Depend on user.id, not user object

  // Cleanup function for retry timeout
  useEffect(() => {
    return () => {
      isMountedRef.current = false
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current)
      }
    }
  }, [])

  // Reset mounted ref when component remounts
  useEffect(() => {
    isMountedRef.current = true
  }, [])

  // Fetch profile when user.id changes
  useEffect(() => {
    console.log('[Finny] useProfile: user.id changed', {
      userId: user?.id,
      hasValidProfile: hasValidProfileRef.current,
      lastUserId: lastUserIdRef.current
    })

    // Clear any pending retry
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current)
      retryTimeoutRef.current = null
    }

    // If user.id is undefined but we already have a valid profile, DON'T reset
    // This handles Supabase auth oscillation during token refresh
    if (!user?.id) {
      if (hasValidProfileRef.current && lastUserIdRef.current) {
        console.log('[Finny] useProfile: Ignoring undefined user.id - keeping valid profile')
        return // Keep the existing profile
      }
      // Only reset if we never had a valid profile
      setProfile(null)
      setLoading(false)
      setError(null)
      setFetchStatus('idle')
      return
    }

    // If same user, don't refetch if we already have a valid profile
    if (user.id === lastUserIdRef.current && hasValidProfileRef.current && profile) {
      console.log('[Finny] useProfile: Same user, keeping existing profile')
      return
    }

    lastUserIdRef.current = user.id
    fetchProfile()
  }, [user?.id, fetchProfile, profile])

  const updateProfile = async (updates: ProfileUpdate) => {
    if (!user?.id) {
      console.error('[Finny] updateProfile: No user.id available')
      return { error: 'Usuario nao autenticado' }
    }

    console.log('[Finny] updateProfile: Updating profile', updates)

    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)

      if (updateError) throw updateError

      setProfile(prev => prev ? { ...prev, ...updates } : null)
      console.log('[Finny] updateProfile: Success')
      return { error: null }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao atualizar perfil'
      console.error('[Finny] updateProfile: Error', err)
      return { error: message }
    }
  }

  const completeOnboarding = async (data: {
    salary: number
    otherIncome: number
    payDay: number
    hasAdvance: boolean
    advanceDay: number
    savingsGoal: number
    leisureBudget: number
    fixedExpenses: Array<{ name: string; amount: number; category: string }>
  }) => {
    if (!user?.id) {
      console.error('[Finny] completeOnboarding: No user.id available')
      return { error: 'Usuario nao autenticado' }
    }

    console.log('[Finny] completeOnboarding: Starting...', { userId: user.id })

    try {
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          salary: data.salary,
          other_income: data.otherIncome,
          pay_day: data.payDay,
          has_advance: data.hasAdvance,
          advance_day: data.advanceDay,
          savings_goal: data.savingsGoal,
          leisure_budget: data.leisureBudget,
          has_completed_onboarding: true
        })
        .eq('id', user.id)

      if (profileError) {
        console.error('[Finny] completeOnboarding: Profile update failed', profileError)
        throw profileError
      }

      console.log('[Finny] completeOnboarding: Profile updated successfully')

      // Insert fixed expenses
      if (data.fixedExpenses.length > 0) {
        const { error: expensesError } = await supabase
          .from('fixed_expenses')
          .insert(
            data.fixedExpenses.map(exp => ({
              user_id: user.id,
              name: exp.name,
              amount: exp.amount,
              category: exp.category,
              is_active: true
            }))
          )

        if (expensesError) {
          console.error('[Finny] completeOnboarding: Expenses insert failed', expensesError)
          throw expensesError
        }

        console.log('[Finny] completeOnboarding: Fixed expenses inserted')
      }

      // Refetch profile to update local state
      await fetchProfile()
      console.log('[Finny] completeOnboarding: Complete!')
      return { error: null }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao completar onboarding'
      console.error('[Finny] completeOnboarding: Error', err)
      return { error: message }
    }
  }

  return {
    profile,
    loading,
    error,
    fetchStatus,
    updateProfile,
    completeOnboarding,
    refetch: fetchProfile
  }
}
