import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@13.10.0?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') as string, {
  apiVersion: '2023-10-16',
})

const supabaseUrl = Deno.env.get('SUPABASE_URL') as string
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string
const supabase = createClient(supabaseUrl, supabaseServiceKey)

const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') as string

serve(async (req) => {
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return new Response('No signature', { status: 400 })
  }

  try {
    const body = await req.text()
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret)

    console.log(`Processing event: ${event.type}`)

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.supabase_user_id

        if (userId && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          )

          const trialEnd = subscription.trial_end
            ? new Date(subscription.trial_end * 1000).toISOString()
            : null

          await supabase
            .from('profiles')
            .update({
              stripe_subscription_id: subscription.id,
              subscription_status: subscription.status === 'trialing' ? 'trialing' : 'active',
              plan: 'premium',
              trial_ends_at: trialEnd,
              plan_expires_at: new Date(subscription.current_period_end * 1000).toISOString(),
            })
            .eq('id', userId)

          console.log(`Updated subscription for user ${userId}`)
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        // Find user by customer ID
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (profile) {
          let subscriptionStatus: string = 'none'

          switch (subscription.status) {
            case 'trialing':
              subscriptionStatus = 'trialing'
              break
            case 'active':
              subscriptionStatus = 'active'
              break
            case 'canceled':
              subscriptionStatus = 'canceled'
              break
            case 'past_due':
              subscriptionStatus = 'past_due'
              break
            default:
              subscriptionStatus = 'none'
          }

          const trialEnd = subscription.trial_end
            ? new Date(subscription.trial_end * 1000).toISOString()
            : null

          await supabase
            .from('profiles')
            .update({
              subscription_status: subscriptionStatus,
              plan: subscription.status === 'active' || subscription.status === 'trialing' ? 'premium' : 'free',
              trial_ends_at: trialEnd,
              plan_expires_at: new Date(subscription.current_period_end * 1000).toISOString(),
            })
            .eq('id', profile.id)

          console.log(`Updated subscription status for user ${profile.id}: ${subscriptionStatus}`)
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        // Find user by customer ID
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (profile) {
          await supabase
            .from('profiles')
            .update({
              subscription_status: 'canceled',
              plan: 'free',
              stripe_subscription_id: null,
            })
            .eq('id', profile.id)

          console.log(`Subscription canceled for user ${profile.id}`)
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string

        // Find user by customer ID
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (profile) {
          await supabase
            .from('profiles')
            .update({
              subscription_status: 'past_due',
            })
            .eq('id', profile.id)

          console.log(`Payment failed for user ${profile.id}`)
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400 }
    )
  }
})
