import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'
import type { Profile, ProfileUpdate } from '../types/database'

export function useProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setProfile(null)
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) throw error
      setProfile(data)
    } catch (err) {
      console.error('Error fetching profile:', err)
      setError(err instanceof Error ? err.message : 'Erro ao carregar perfil')
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  const updateProfile = async (updates: ProfileUpdate) => {
    if (!user) return { error: 'Usuário não autenticado' }

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)

      if (error) throw error

      setProfile(prev => prev ? { ...prev, ...updates } : null)
      return { error: null }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao atualizar perfil'
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
    if (!user) return { error: 'Usuário não autenticado' }

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

      if (profileError) throw profileError

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

        if (expensesError) throw expensesError
      }

      await fetchProfile()
      return { error: null }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao completar onboarding'
      return { error: message }
    }
  }

  return {
    profile,
    loading,
    error,
    updateProfile,
    completeOnboarding,
    refetch: fetchProfile
  }
}
