import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'
import { useProfile } from './useProfile'
import { canAddTemporaryExpense } from '../utils/limits'
import type { TemporaryExpense, TemporaryExpenseInsert } from '../types/database'

export function useTemporaryExpenses() {
  const { user } = useAuth()
  const { profile } = useProfile()
  const [temporaryExpenses, setTemporaryExpenses] = useState<TemporaryExpense[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTemporaryExpenses = useCallback(async () => {
    if (!user) {
      setTemporaryExpenses([])
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('temporary_expenses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setTemporaryExpenses(data || [])
    } catch (err) {
      console.error('Error fetching temporary expenses:', err)
      setError(err instanceof Error ? err.message : 'Erro ao carregar despesas temporárias')
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchTemporaryExpenses()
  }, [fetchTemporaryExpenses])

  const addTemporaryExpense = async (
    expense: Omit<TemporaryExpenseInsert, 'user_id'>
  ): Promise<{ error: string | null; limitReached?: boolean; data?: TemporaryExpense }> => {
    if (!user || !profile) return { error: 'Usuário não autenticado' }

    // Verificar limite
    if (!canAddTemporaryExpense(profile.plan, temporaryExpenses.length)) {
      return { error: 'LIMIT_REACHED', limitReached: true }
    }

    try {
      const { data, error } = await supabase
        .from('temporary_expenses')
        .insert({ ...expense, user_id: user.id })
        .select()
        .single()

      if (error) throw error

      setTemporaryExpenses(prev => [data, ...prev])
      return { error: null, data }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao adicionar despesa temporária'
      return { error: message }
    }
  }

  const updateTemporaryExpense = async (
    id: string,
    updates: Partial<Omit<TemporaryExpense, 'id' | 'user_id' | 'created_at'>>
  ) => {
    if (!user) return { error: 'Usuário não autenticado' }

    try {
      const { error } = await supabase
        .from('temporary_expenses')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) throw error

      setTemporaryExpenses(prev =>
        prev.map(e => (e.id === id ? { ...e, ...updates } : e))
      )
      return { error: null }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao atualizar despesa temporária'
      return { error: message }
    }
  }

  const deleteTemporaryExpense = async (id: string) => {
    if (!user) return { error: 'Usuário não autenticado' }

    try {
      const { error } = await supabase
        .from('temporary_expenses')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) throw error

      setTemporaryExpenses(prev => prev.filter(e => e.id !== id))
      return { error: null }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao deletar despesa temporária'
      return { error: message }
    }
  }

  // Helpers
  const isActiveInMonth = useCallback((expense: TemporaryExpense, month: number, year: number) => {
    const startDate = expense.start_year * 12 + expense.start_month
    const endDate = expense.end_year * 12 + expense.end_month
    const checkDate = year * 12 + month
    return checkDate >= startDate && checkDate <= endDate
  }, [])

  const getActiveForMonth = useCallback((month: number, year: number) => {
    return temporaryExpenses.filter(e => isActiveInMonth(e, month, year))
  }, [temporaryExpenses, isActiveInMonth])

  const getMonthlyTotal = useCallback((month: number, year: number) => {
    return getActiveForMonth(month, year).reduce((sum, e) => sum + e.amount, 0)
  }, [getActiveForMonth])

  return {
    temporaryExpenses,
    loading,
    error,
    addTemporaryExpense,
    updateTemporaryExpense,
    deleteTemporaryExpense,
    isActiveInMonth,
    getActiveForMonth,
    getMonthlyTotal,
    refetch: fetchTemporaryExpenses
  }
}
