import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import { Button } from '../components/ui'

export function Checkout() {
  const { user } = useAuth()
  const [searchParams] = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const isNewUser = searchParams.get('new') === 'true'

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
            returnUrl: `${window.location.origin}/onboarding`,
            trialDays: 7
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
        {/* Back button - only show if not new user */}
        {!isNewUser && (
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-text-muted hover:text-white mb-8 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar
          </Link>
        )}

        <div className="bg-surface rounded-2xl p-8 border border-white/10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🎉</div>
            <h1 className="text-2xl font-bold text-white mb-2">
              {isNewUser ? 'Comece sua jornada!' : 'Upgrade para Premium'}
            </h1>
            <p className="text-text-muted">
              {isNewUser
                ? '7 dias grátis para experimentar tudo'
                : 'Desbloqueie todo o potencial do Finny'
              }
            </p>
          </div>

          {/* Trial Badge */}
          <div className="bg-gradient-to-r from-primary/20 to-emerald-500/20 border border-primary/30 rounded-xl p-4 mb-6 text-center">
            <div className="text-2xl font-bold text-white mb-1">
              7 DIAS GRÁTIS
            </div>
            <p className="text-primary text-sm">Depois apenas R$ 12,90/mês</p>
          </div>

          {/* Price breakdown */}
          <div className="bg-white/5 rounded-xl p-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-text-muted">Hoje você paga:</span>
              <span className="text-2xl font-bold text-white">R$ 0,00</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-text-muted">Após 7 dias:</span>
              <span className="text-text-muted">R$ 12,90/mês</span>
            </div>
          </div>

          {/* Benefits */}
          <div className="space-y-3 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-white text-sm">Transações ilimitadas</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-white text-sm">Despesas fixas ilimitadas</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-white text-sm">Histórico completo</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-white text-sm">Exportar para CSV e PDF</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-white text-sm">Cancele quando quiser</span>
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
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Começar Trial Grátis
              </>
            )}
          </Button>

          {/* Security note */}
          <div className="mt-4 p-3 bg-white/5 rounded-lg">
            <p className="text-text-muted text-xs text-center">
              🔒 Pagamento seguro via Stripe. Você pode cancelar a qualquer momento antes do trial acabar e não será cobrado.
            </p>
          </div>
        </div>

        {/* Info */}
        <div className="mt-6 text-center text-text-muted text-sm">
          <p>Ao continuar, você concorda com nossos</p>
          <p>
            <a href="#" className="text-primary hover:underline">Termos de Uso</a>
            {' '}e{' '}
            <a href="#" className="text-primary hover:underline">Política de Privacidade</a>
          </p>
        </div>
      </div>
    </div>
  )
}
