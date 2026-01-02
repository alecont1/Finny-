import { Link } from 'react-router-dom'
import { usePremium } from '../../hooks/usePremium'

export function LimitBanner() {
  const { limits, isPremium, anyLimitNear, anyLimitReached } = usePremium()

  // Não mostrar para premium ou se não estiver perto do limite
  if (isPremium || !anyLimitNear) return null

  const { transactions } = limits

  // Cores baseadas no status
  const isRed = anyLimitReached
  const bgColor = isRed ? 'bg-danger/10 border-danger/30' : 'bg-warning/10 border-warning/30'
  const textColor = isRed ? 'text-danger' : 'text-warning'
  const buttonColor = isRed ? 'bg-danger hover:bg-danger/90' : 'bg-warning hover:bg-warning/90'

  return (
    <div className={`rounded-xl p-4 border ${bgColor} mb-4`}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{isRed ? '⚠️' : '📊'}</span>
          <div>
            <p className={`font-semibold ${textColor}`}>
              {isRed ? 'Limite atingido!' : `${transactions.used}/${transactions.limit} transações`}
            </p>
            <p className={`text-sm ${isRed ? 'text-danger/70' : 'text-warning/70'}`}>
              {isRed
                ? 'Faça upgrade para continuar registrando'
                : 'Você está chegando no limite mensal'
              }
            </p>
          </div>
        </div>
        <Link
          to="/checkout"
          className={`${buttonColor} text-white px-4 py-2 rounded-lg text-sm font-semibold transition whitespace-nowrap`}
        >
          Upgrade
        </Link>
      </div>

      {/* Progress bar */}
      {!isRed && (
        <div className="mt-3 h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-warning rounded-full transition-all duration-500"
            style={{ width: `${transactions.percentage}%` }}
          />
        </div>
      )}
    </div>
  )
}
