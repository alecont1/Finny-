export const PLAN_LIMITS = {
  free: {
    transactionsPerMonth: 30,
    fixedExpenses: 5,
    temporaryExpenses: 3,
    historyMonths: 3,
  },
  premium: {
    transactionsPerMonth: Infinity,
    fixedExpenses: Infinity,
    temporaryExpenses: Infinity,
    historyMonths: Infinity,
  }
} as const

export type PlanType = keyof typeof PLAN_LIMITS

export function canAddTransaction(plan: PlanType, count: number): boolean {
  return count < PLAN_LIMITS[plan].transactionsPerMonth
}

export function canAddFixedExpense(plan: PlanType, count: number): boolean {
  return count < PLAN_LIMITS[plan].fixedExpenses
}

export function canAddTemporaryExpense(plan: PlanType, count: number): boolean {
  return count < PLAN_LIMITS[plan].temporaryExpenses
}

export function getUsagePercentage(used: number, limit: number): number {
  if (limit === Infinity) return 0
  return Math.min(Math.round((used / limit) * 100), 100)
}

export function isNearLimit(used: number, limit: number): boolean {
  if (limit === Infinity) return false
  return getUsagePercentage(used, limit) >= 80
}

export function hasReachedLimit(used: number, limit: number): boolean {
  if (limit === Infinity) return false
  return used >= limit
}
