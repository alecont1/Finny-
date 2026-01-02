import { useNavigate } from 'react-router-dom'
import { Modal } from '../ui'

interface UpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  reason?: 'transactions' | 'fixedExpenses' | 'temporaryExpenses' | 'export' | 'history'
}

const UPGRADE_MESSAGES = {
  transactions: {
    title: 'Limite de transações atingido',
    description: 'Você atingiu o limite de 30 transações este mês.',
    icon: '📝'
  },
  fixedExpenses: {
    title: 'Limite de despesas fixas atingido',
    description: 'Você atingiu o limite de 5 despesas fixas.',
    icon: '📋'
  },
  temporaryExpenses: {
    title: 'Limite de despesas temporárias atingido',
    description: 'Você atingiu o limite de 3 despesas temporárias.',
    icon: '📅'
  },
  export: {
    title: 'Recurso Premium',
    description: 'Exportar dados para CSV e PDF é um recurso exclusivo do plano Premium.',
    icon: '📊'
  },
  history: {
    title: 'Histórico limitado',
    description: 'No plano gratuito, você só tem acesso aos últimos 3 meses.',
    icon: '📆'
  }
}

export function UpgradeModal({ isOpen, onClose, reason = 'transactions' }: UpgradeModalProps) {
  const navigate = useNavigate()
  const message = UPGRADE_MESSAGES[reason]

  const handleUpgrade = () => {
    onClose()
    navigate('/checkout')
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="">
      <div className="text-center py-4">
        {/* Icon */}
        <div className="text-6xl mb-6">{message.icon}</div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-white mb-3">
          {message.title}
        </h2>

        {/* Description */}
        <p className="text-text-muted mb-8">
          {message.description}
        </p>

        {/* Premium Benefits */}
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 mb-8 text-left">
          <p className="text-primary font-semibold mb-4 text-center">
            Com o Premium você tem:
          </p>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-3 text-white">
              <span className="text-primary">✓</span>
              Transações ilimitadas
            </li>
            <li className="flex items-center gap-3 text-white">
              <span className="text-primary">✓</span>
              Despesas fixas ilimitadas
            </li>
            <li className="flex items-center gap-3 text-white">
              <span className="text-primary">✓</span>
              Histórico completo
            </li>
            <li className="flex items-center gap-3 text-white">
              <span className="text-primary">✓</span>
              Exportar para CSV e PDF
            </li>
          </ul>

          <div className="mt-6 text-center">
            <span className="text-3xl font-bold text-white">R$ 12,90</span>
            <span className="text-text-muted">/mês</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-white/20 text-text-muted hover:text-white py-3 rounded-xl transition"
          >
            Depois
          </button>
          <button
            onClick={handleUpgrade}
            className="flex-1 bg-primary hover:bg-primary/90 text-white py-3 rounded-xl font-semibold transition"
          >
            Fazer Upgrade
          </button>
        </div>
      </div>
    </Modal>
  )
}
