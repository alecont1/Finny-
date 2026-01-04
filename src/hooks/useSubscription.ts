import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'

interface Subscription {
  plan: 'free' | 'premium' | 'trial'
  subscriptionStatus: 'none' | 'trialing' | 'active' | 'canceled' | 'past_due'
  trialEndsAt: Date | null
  planExpiresAt: Date | null
  isActive: boolean
  daysRemaining: number | null
}

export function useSubscription() {
  const { user } = useAuth()
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchSubscription = useCallback(async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('plan, subscription_status, trial_ends_at, plan_expires_at')
        .eq('id', user.id)
        .single()

      if (error) throw error

      const now = new Date()
      const trialEndsAt = data.trial_ends_at ? new Date(data.trial_ends_at) : null
      const planExpiresAt = data.plan_expires_at ? new Date(data.plan_expires_at) : null

      // Check if subscription is active
      let isActive = false
      let daysRemaining: number | null = null

      if (data.subscription_status === 'active') {
        isActive = true
      } else if (data.subscription_status === 'trialing' && trialEndsAt) {
        isActive = trialEndsAt > now
        daysRemaining = Math.ceil((trialEndsAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      }

      setSubscription({
        plan: data.plan,
        subscriptionStatus: data.subscription_status || 'none',
        trialEndsAt,
        planExpiresAt,
        isActive,
        daysRemaining
      })
    } catch (error) {
      console.error('Error fetching subscription:', error)
      setSubscription({
        plan: 'free',
        subscriptionStatus: 'none',
        trialEndsAt: null,
        planExpiresAt: null,
        isActive: false,
        daysRemaining: null
      })
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (!user) {
      setSubscription(null)
      setLoading(false)
      return
    }

    fetchSubscription()
  }, [user, fetchSubscription])

  const hasActiveSubscription = () => {
    return subscription?.isActive ?? false
  }

  const needsSubscription = () => {
    return subscription?.subscriptionStatus === 'none'
  }

  return {
    subscription,
    loading,
    hasActiveSubscription,
    needsSubscription,
    refetch: fetchSubscription
  }
}
