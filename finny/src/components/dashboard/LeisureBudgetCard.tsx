import { Card, ProgressBar } from '../ui';
import { formatCurrency } from '../../utils/formatters';

interface LeisureBudgetCardProps {
  spent: number;
  budget: number;
}

export function LeisureBudgetCard({ spent, budget }: LeisureBudgetCardProps) {
  const remaining = budget - spent;
  const percentage = budget > 0 ? (spent / budget) * 100 : 0;
  const isOverBudget = spent > budget;

  const getStatusMessage = () => {
    if (isOverBudget) {
      return { text: 'Orçamento excedido!', color: 'text-danger' };
    }
    if (percentage >= 80) {
      return { text: 'Quase no limite', color: 'text-warning' };
    }
    if (percentage >= 50) {
      return { text: 'Metade do orçamento', color: 'text-text-muted' };
    }
    return { text: 'Orçamento saudável', color: 'text-primary' };
  };

  const status = getStatusMessage();

  const getProgressColor = () => {
    if (isOverBudget) return '#ef4444';
    if (percentage >= 80) return '#f59e0b';
    return '#f472b6';
  };

  return (
    <Card className="mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎉</span>
          <div>
            <h3 className="text-white font-semibold">Orçamento Lazer</h3>
            <p className={`text-xs ${status.color}`}>{status.text}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-white">
            {formatCurrency(remaining)}
          </p>
          <p className="text-xs text-text-muted">restante</p>
        </div>
      </div>

      {/* Progress bar */}
      <ProgressBar
        value={spent}
        max={budget}
        height="lg"
        color={getProgressColor()}
      />

      {/* Details */}
      <div className="flex justify-between mt-3 text-sm">
        <div>
          <span className="text-text-muted">Gasto: </span>
          <span className="text-white font-medium">{formatCurrency(spent)}</span>
        </div>
        <div>
          <span className="text-text-muted">Limite: </span>
          <span className="text-white font-medium">{formatCurrency(budget)}</span>
        </div>
      </div>

      {/* Weekly breakdown */}
      <div className="mt-4 pt-3 border-t border-white/10">
        <div className="flex justify-between text-sm">
          <span className="text-text-muted">Restante por semana</span>
          <span className="text-white font-medium">
            {formatCurrency(Math.max(remaining / 4, 0))}
          </span>
        </div>
      </div>
    </Card>
  );
}
