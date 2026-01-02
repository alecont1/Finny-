import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'
import { useProfile } from './useProfile'
import { canAddTransaction, PLAN_LIMITS } from '../utils/limits'
import type { Transaction, TransactionInsert } from '../types/database'

export function useTransactions() {
  const { user } = useAuth()
  const { profile } = useProfile()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTransactions = useCallback(async () => {
    if (!user) {
      setTransactions([])
      setLoading(false)
      return
    }

    try {
      // Limitar histórico baseado no plano
      const plan = profile?.plan || 'free'
      const historyMonths = PLAN_LIMITS[plan].historyMonths

      let query = supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })

      // Se não for premium, limitar histórico
      if (historyMonths !== Infinity) {
        const limitDate = new Date()
        limitDate.setMonth(limitDate.getMonth() - historyMonths)
        query = query.gte('date', limitDate.toISOString().split('T')[0])
      }

      const { data, error } = await query

      if (error) throw error
      setTransactions(data || [])
    } catch (err) {
      console.error('Error fetching transactions:', err)
      setError(err instanceof Error ? err.message : 'Erro ao carregar transações')
    } finally {
      setLoading(false)
    }
  }, [user, profile?.plan])

  useEffect(() => {
    if (profile !== null) {
      fetchTransactions()
    }
  }, [fetchTransactions, profile])

  const addTransaction = async (
    transaction: Omit<TransactionInsert, 'user_id'>
  ): Promise<{ error: string | null; limitReached?: boolean; data?: Transaction }> => {
    if (!user || !profile) return { error: 'Usuário não autenticado' }

    // Verificar limite
    const currentMonth = new Date().getMonth() + 1
    const currentYear = new Date().getFullYear()
    const monthCount = transactions.filter(
      t => t.month === currentMonth && t.year === currentYear
    ).length

    if (!canAddTransaction(profile.plan, monthCount)) {
      return { error: 'LIMIT_REACHED', limitReached: true }
    }

    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert({ ...transaction, user_id: user.id })
        .select()
        .single()

      if (error) throw error

      setTransactions(prev => [data, ...prev])
      return { error: null, data }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao adicionar transação'
      return { error: message }
    }
  }

  const updateTransaction = async (
    id: string,
    updates: Partial<Omit<Transaction, 'id' | 'user_id' | 'created_at'>>
  ) => {
    if (!user) return { error: 'Usuário não autenticado' }

    try {
      const { error } = await supabase
        .from('transactions')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) throw error

      setTransactions(prev =>
        prev.map(t => (t.id === id ? { ...t, ...updates } : t))
      )
      return { error: null }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao atualizar transação'
      return { error: message }
    }
  }

  const deleteTransaction = async (id: string) => {
    if (!user) return { error: 'Usuário não autenticado' }

    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) throw error

      setTransactions(prev => prev.filter(t => t.id !== id))
      return { error: null }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao deletar transação'
      return { error: message }
    }
  }

  // Helpers
  const getMonthlyTotal = useCallback((month: number, year: number) => {
    return transactions
      .filter(t => t.month === month && t.year === year)
      .reduce((sum, t) => sum + t.amount, 0)
  }, [transactions])

  const getMonthlyByCategory = useCallback((month: number, year: number) => {
    const filtered = transactions.filter(t => t.month === month && t.year === year)
    return filtered.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount
      return acc
    }, {} as Record<string, number>)
  }, [transactions])

  const getLeisureTotal = useCallback((month: number, year: number) => {
    return transactions
      .filter(t => t.month === month && t.year === year && t.category === 'lazer')
      .reduce((sum, t) => sum + t.amount, 0)
  }, [transactions])

  const getMonthlyCount = useCallback((month: number, year: number) => {
    return transactions.filter(t => t.month === month && t.year === year).length
  }, [transactions])

  return {
    transactions,
    loading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getMonthlyTotal,
    getMonthlyByCategory,
    getLeisureTotal,
    getMonthlyCount,
    refetch: fetchTransactions
  }
}
