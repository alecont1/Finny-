import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'
import { useProfile } from './useProfile'
import { canAddFixedExpense } from '../utils/limits'
import type { FixedExpense, FixedExpenseInsert } from '../types/database'

export function useFixedExpenses() {
  const { user } = useAuth()
  const { profile } = useProfile()
  const [fixedExpenses, setFixedExpenses] = useState<FixedExpense[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchFixedExpenses = useCallback(async () => {
    if (!user) {
      setFixedExpenses([])
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('fixed_expenses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setFixedExpenses(data || [])
    } catch (err) {
      console.error('Error fetching fixed expenses:', err)
      setError(err instanceof Error ? err.message : 'Erro ao carregar despesas fixas')
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchFixedExpenses()
  }, [fetchFixedExpenses])

  const addFixedExpense = async (
    expense: Omit<FixedExpenseInsert, 'user_id'>
  ): Promise<{ error: string | null; limitReached?: boolean; data?: FixedExpense }> => {
    if (!user || !profile) return { error: 'Usuário não autenticado' }

    // Verificar limite
    const activeCount = fixedExpenses.filter(e => e.is_active).length
    if (!canAddFixedExpense(profile.plan, activeCount)) {
      return { error: 'LIMIT_REACHED', limitReached: true }
    }

    try {
      const { data, error } = await supabase
        .from('fixed_expenses')
        .insert({ ...expense, user_id: user.id })
        .select()
        .single()

      if (error) throw error

      setFixedExpenses(prev => [data, ...prev])
      return { error: null, data }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao adicionar despesa fixa'
      return { error: message }
    }
  }

  const updateFixedExpense = async (
    id: string,
    updates: Partial<Omit<FixedExpense, 'id' | 'user_id' | 'created_at'>>
  ) => {
    if (!user) return { error: 'Usuário não autenticado' }

    try {
      const { error } = await supabase
        .from('fixed_expenses')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) throw error

      setFixedExpenses(prev =>
        prev.map(e => (e.id === id ? { ...e, ...updates } : e))
      )
      return { error: null }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao atualizar despesa fixa'
      return { error: message }
    }
  }

  const deleteFixedExpense = async (id: string) => {
    if (!user) return { error: 'Usuário não autenticado' }

    try {
      const { error } = await supabase
        .from('fixed_expenses')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) throw error

      setFixedExpenses(prev => prev.filter(e => e.id !== id))
      return { error: null }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao deletar despesa fixa'
      return { error: message }
    }
  }

  const toggleActive = async (id: string) => {
    const expense = fixedExpenses.find(e => e.id === id)
    if (!expense) return { error: 'Despesa não encontrada' }

    return updateFixedExpense(id, { is_active: !expense.is_active })
  }

  // Helpers
  const getActiveExpenses = useCallback(() => {
    return fixedExpenses.filter(e => e.is_active)
  }, [fixedExpenses])

  const getMonthlyTotal = useCallback(() => {
    return fixedExpenses
      .filter(e => e.is_active)
      .reduce((sum, e) => sum + e.amount, 0)
  }, [fixedExpenses])

  const getByCategory = useCallback(() => {
    const active = fixedExpenses.filter(e => e.is_active)
    return active.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount
      return acc
    }, {} as Record<string, number>)
  }, [fixedExpenses])

  return {
    fixedExpenses,
    loading,
    error,
    addFixedExpense,
    updateFixedExpense,
    deleteFixedExpense,
    toggleActive,
    getActiveExpenses,
    getMonthlyTotal,
    getByCategory,
    refetch: fetchFixedExpenses
  }
}
