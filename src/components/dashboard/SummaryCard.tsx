import { Card } from '../ui';
import { formatCurrency } from '../../utils/formatters';

interface SummaryCardProps {
  income: number;
  fixedExpenses: number;
  temporaryExpenses: number;
  variableExpenses: number;
  savingsGoal: number;
}

export function SummaryCard({
  income,
  fixedExpenses,
  temporaryExpenses,
  variableExpenses,
  savingsGoal,
}: SummaryCardProps) {
  const totalExpenses = fixedExpenses + temporaryExpenses + variableExpenses;
  const balance = income - totalExpenses;
  const reachedGoal = balance >= savingsGoal;
  const goalProgress = savingsGoal > 0 ? Math.min((balance / savingsGoal) * 100, 100) : 0;

  return (
    <Card gradient className="mb-4">
      <div className="space-y-3">
        {/* Income */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-lg">💵</span>
            <span className="text-text-muted">Renda</span>
          </div>
          <span className="text-white font-medium">{formatCurrency(income)}</span>
        </div>

        {/* Fixed Expenses */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-lg">📋</span>
            <span className="text-text-muted">Despesas fixas</span>
          </div>
          <span className="text-danger font-medium">- {formatCurrency(fixedExpenses)}</span>
        </div>

        {/* Temporary Expenses */}
        {temporaryExpenses > 0 && (
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-lg">📅</span>
              <span className="text-text-muted">Parcelas</span>
            </div>
            <span className="text-warning font-medium">- {formatCurrency(temporaryExpenses)}</span>
          </div>
        )}

        {/* Variable Expenses */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-lg">🛒</span>
            <span className="text-text-muted">Gastos variáveis</span>
          </div>
          <span className="text-danger font-medium">- {formatCurrency(variableExpenses)}</span>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 my-2" />

        {/* Balance */}
        <div className="flex justify-between items-center">
          <span className="text-white font-medium">Sobra para guardar</span>
          <span className={`text-xl font-bold ${balance >= 0 ? 'text-primary' : 'text-danger'}`}>
            {formatCurrency(balance)}
          </span>
        </div>

        {/* Goal badge */}
        {savingsGoal > 0 && (
          <div className={`
            flex items-center justify-between p-3 rounded-xl mt-2
            ${reachedGoal ? 'bg-primary/20' : 'bg-white/5'}
          `}>
            <div className="flex items-center gap-2">
              <span className="text-lg">{reachedGoal ? '✅' : '🎯'}</span>
              <span className="text-sm text-text-muted">
                Meta: {formatCurrency(savingsGoal)}
              </span>
            </div>
            <span className={`text-sm font-medium ${reachedGoal ? 'text-primary' : 'text-text-muted'}`}>
              {goalProgress.toFixed(0)}%
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}
