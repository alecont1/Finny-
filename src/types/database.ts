// Tipos do banco de dados Supabase

export interface Profile {
  id: string
  name: string | null
  created_at: string
  salary: number
  other_income: number
  pay_day: number
  has_advance: boolean
  advance_day: number | null
  savings_goal: number
  leisure_budget: number
  plan: 'free' | 'premium'
  plan_expires_at: string | null
  stripe_customer_id: string | null
  has_completed_onboarding: boolean
}

export interface FixedExpense {
  id: string
  user_id: string
  name: string
  amount: number
  category: string
  is_active: boolean
  created_at: string
}

export interface TemporaryExpense {
  id: string
  user_id: string
  name: string
  amount: number
  category: string
  start_month: number
  start_year: number
  end_month: number
  end_year: number
  created_at: string
}

export interface Transaction {
  id: string
  user_id: string
  description: string | null
  amount: number
  category: string
  date: string
  month: number
  year: number
  created_at: string
}

// Tipos para inserção (sem campos auto-gerados)
export type ProfileInsert = Omit<Profile, 'created_at'>
export type ProfileUpdate = Partial<Omit<Profile, 'id' | 'created_at'>>

export type FixedExpenseInsert = Omit<FixedExpense, 'id' | 'created_at'>
export type FixedExpenseUpdate = Partial<Omit<FixedExpense, 'id' | 'user_id' | 'created_at'>>

export type TemporaryExpenseInsert = Omit<TemporaryExpense, 'id' | 'created_at'>
export type TemporaryExpenseUpdate = Partial<Omit<TemporaryExpense, 'id' | 'user_id' | 'created_at'>>

export type TransactionInsert = Omit<Transaction, 'id' | 'created_at'>
export type TransactionUpdate = Partial<Omit<Transaction, 'id' | 'user_id' | 'created_at'>>
