import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import { Button } from '../components/ui'

export function Checkout() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCheckout = async () => {
    if (!user) return

    setIsLoading(true)
    setError('')

    try {
      const session = await supabase.auth.getSession()

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.data.session?.access_token}`
          },
          body: JSON.stringify({
            userId: user.id,
            email: user.email,
            returnUrl: `${window.location.origin}/dashboard`
          })
        }
      )

      if (!response.ok) {
        throw new Error('Erro ao criar sessão de pagamento')
      }

      const { url } = await response.json()

      if (url) {
        window.location.href = url
      } else {
        throw new Error('URL de pagamento não recebida')
      }
    } catch (err) {
      console.error('Checkout error:', err)
      setError(err instanceof Error ? err.message : 'Erro ao processar pagamento')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back button */}
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-text-muted hover:text-white mb-8 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Voltar
        </Link>

        <div className="bg-surface rounded-2xl p-8 border border-white/10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🚀</div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Upgrade para Premium
            </h1>
            <p className="text-text-muted">
              Desbloqueie todo o potencial do Finny
            </p>
          </div>

          {/* Price */}
          <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 mb-8 text-center">
            <div className="text-4xl font-bold text-white mb-1">
              R$ 12,90
              <span className="text-lg text-text-muted font-normal">/mês</span>
            </div>
            <p className="text-text-muted text-sm">Cancele quando quiser</p>
          </div>

          {/* Benefits */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-white">Transações ilimitadas</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-white">Despesas fixas ilimitadas</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-white">Histórico completo</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-white">Exportar para CSV e PDF</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-white">Suporte prioritário</span>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-danger/10 border border-danger/20 rounded-lg p-3 mb-6">
              <p className="text-danger text-sm">{error}</p>
            </div>
          )}

          {/* CTA */}
          <Button
            onClick={handleCheckout}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white" />
                Processando...
              </span>
            ) : (
              'Assinar Premium'
            )}
          </Button>

          {/* Security note */}
          <p className="text-center text-text-muted text-xs mt-6">
            🔒 Pagamento seguro via Stripe
          </p>
        </div>

        {/* FAQ */}
        <div className="mt-8 space-y-4">
          <h3 className="text-white font-semibold">Dúvidas frequentes</h3>

          <details className="bg-surface/50 rounded-lg">
            <summary className="p-4 text-white cursor-pointer hover:bg-white/5 transition rounded-lg">
              Posso cancelar a qualquer momento?
            </summary>
            <p className="px-4 pb-4 text-text-muted text-sm">
              Sim! Você pode cancelar sua assinatura a qualquer momento. O acesso premium continua até o fim do período pago.
            </p>
          </details>

          <details className="bg-surface/50 rounded-lg">
            <summary className="p-4 text-white cursor-pointer hover:bg-white/5 transition rounded-lg">
              Quais formas de pagamento são aceitas?
            </summary>
            <p className="px-4 pb-4 text-text-muted text-sm">
              Aceitamos cartões de crédito (Visa, Mastercard, Amex) e PIX através do Stripe.
            </p>
          </details>

          <details className="bg-surface/50 rounded-lg">
            <summary className="p-4 text-white cursor-pointer hover:bg-white/5 transition rounded-lg">
              Meus dados são perdidos se eu cancelar?
            </summary>
            <p className="px-4 pb-4 text-text-muted text-sm">
              Não! Seus dados são mantidos mesmo no plano gratuito. Apenas os recursos premium ficam indisponíveis.
            </p>
          </details>
        </div>
      </div>
    </div>
  )
}
