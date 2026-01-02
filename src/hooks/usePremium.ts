import { useMemo } from 'react'
import { useProfile } from './useProfile'
import { useTransactions } from './useTransactions'
import { useFixedExpenses } from './useFixedExpenses'
import { useTemporaryExpenses } from './useTemporaryExpenses'
import { PLAN_LIMITS, getUsagePercentage, isNearLimit, hasReachedLimit } from '../utils/limits'
import type { PlanType } from '../utils/limits'

interface UsageInfo {
  used: number
  limit: number
  percentage: number
  isNearLimit: boolean
  hasReachedLimit: boolean
}

interface PremiumInfo {
  plan: PlanType
  isPremium: boolean
  limits: {
    transactions: UsageInfo
    fixedExpenses: UsageInfo
    temporaryExpenses: UsageInfo
    historyMonths: number
  }
  anyLimitNear: boolean
  anyLimitReached: boolean
  canExport: boolean
}

export function usePremium(): PremiumInfo {
  const { profile } = useProfile()
  const { transactions } = useTransactions()
  const { fixedExpenses } = useFixedExpenses()
  const { temporaryExpenses } = useTemporaryExpenses()

  return useMemo(() => {
    const plan: PlanType = profile?.plan || 'free'
    const isPremium = plan === 'premium'
    const limits = PLAN_LIMITS[plan]

    // Contagem de transações do mês atual
    const currentMonth = new Date().getMonth() + 1
    const currentYear = new Date().getFullYear()
    const monthlyTransactionCount = transactions.filter(
      t => t.month === currentMonth && t.year === currentYear
    ).length

    // Contagem de despesas fixas ativas
    const activeFixedCount = fixedExpenses.filter(e => e.is_active).length

    // Contagem de despesas temporárias
    const temporaryCount = temporaryExpenses.length

    // Calcular usage info para cada tipo
    const transactionsUsage: UsageInfo = {
      used: monthlyTransactionCount,
      limit: limits.transactionsPerMonth,
      percentage: getUsagePercentage(monthlyTransactionCount, limits.transactionsPerMonth),
      isNearLimit: isNearLimit(monthlyTransactionCount, limits.transactionsPerMonth),
      hasReachedLimit: hasReachedLimit(monthlyTransactionCount, limits.transactionsPerMonth)
    }

    const fixedExpensesUsage: UsageInfo = {
      used: activeFixedCount,
      limit: limits.fixedExpenses,
      percentage: getUsagePercentage(activeFixedCount, limits.fixedExpenses),
      isNearLimit: isNearLimit(activeFixedCount, limits.fixedExpenses),
      hasReachedLimit: hasReachedLimit(activeFixedCount, limits.fixedExpenses)
    }

    const temporaryExpensesUsage: UsageInfo = {
      used: temporaryCount,
      limit: limits.temporaryExpenses,
      percentage: getUsagePercentage(temporaryCount, limits.temporaryExpenses),
      isNearLimit: isNearLimit(temporaryCount, limits.temporaryExpenses),
      hasReachedLimit: hasReachedLimit(temporaryCount, limits.temporaryExpenses)
    }

    return {
      plan,
      isPremium,
      limits: {
        transactions: transactionsUsage,
        fixedExpenses: fixedExpensesUsage,
        temporaryExpenses: temporaryExpensesUsage,
        historyMonths: limits.historyMonths
      },
      anyLimitNear: transactionsUsage.isNearLimit || fixedExpensesUsage.isNearLimit || temporaryExpensesUsage.isNearLimit,
      anyLimitReached: transactionsUsage.hasReachedLimit || fixedExpensesUsage.hasReachedLimit || temporaryExpensesUsage.hasReachedLimit,
      canExport: isPremium
    }
  }, [profile, transactions, fixedExpenses, temporaryExpenses])
}
