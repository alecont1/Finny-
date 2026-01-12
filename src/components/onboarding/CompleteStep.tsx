import { Button } from '../ui';
import { formatCurrency } from '../../utils/formatters';

interface CompleteStepProps {
  data: {
    salary: number;
    otherIncome: number;
    savingsGoal: number;
    leisureBudget: number;
  };
  totalFixedExpenses: number;
  onComplete: () => void;
  isLoading?: boolean;
}

export function CompleteStep({ data, totalFixedExpenses, onComplete, isLoading = false }: CompleteStepProps) {
  const totalIncome = data.salary + data.otherIncome;
  const available = totalIncome - totalFixedExpenses;
  const afterSavings = available - data.savingsGoal;
  const afterLeisure = afterSavings - data.leisureBudget;

  return (
    <div className="space-y-6">
      {/* Celebration */}
      <div className="text-center mb-8">
        <div className="text-7xl mb-4 animate-bounce">🎉</div>
        <h2 className="text-3xl font-bold text-white mb-2">Tudo pronto!</h2>
        <p className="text-text-muted">
          Seu perfil financeiro foi configurado
        </p>
      </div>

      {/* Summary card */}
      <div className="p-6 bg-surface border border-white/10 rounded-2xl space-y-4">
        <h3 className="text-lg font-semibold text-white mb-4">Resumo mensal</h3>

        {/* Income */}
        <div className="flex justify-between items-center py-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">💵</span>
            <span className="text-text-muted">Renda total</span>
          </div>
          <span className="text-white font-medium">{formatCurrency(totalIncome)}</span>
        </div>

        {/* Fixed expenses */}
        <div className="flex justify-between items-center py-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">📋</span>
            <span className="text-text-muted">Despesas fixas</span>
          </div>
          <span className="text-danger font-medium">- {formatCurrency(totalFixedExpenses)}</span>
        </div>

        <div className="border-t border-white/10 my-2" />

        {/* Available */}
        <div className="flex justify-between items-center py-2">
          <span className="text-text-muted">Disponível</span>
          <span className="text-white font-medium">{formatCurrency(available)}</span>
        </div>

        {/* Savings goal */}
        <div className="flex justify-between items-center py-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎯</span>
            <span className="text-text-muted">Meta de economia</span>
          </div>
          <span className="text-primary font-medium">- {formatCurrency(data.savingsGoal)}</span>
        </div>

        {/* Leisure budget */}
        <div className="flex justify-between items-center py-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎉</span>
            <span className="text-text-muted">Orçamento lazer</span>
          </div>
          <span className="text-pink-400 font-medium">- {formatCurrency(data.leisureBudget)}</span>
        </div>

        <div className="border-t border-white/10 my-2" />

        {/* Remaining */}
        <div className="flex justify-between items-center py-2">
          <span className="text-white font-medium">Reserva / Emergências</span>
          <span className={`text-lg font-bold ${afterLeisure >= 0 ? 'text-primary' : 'text-danger'}`}>
            {formatCurrency(afterLeisure)}
          </span>
        </div>
      </div>

      {/* Annual projection */}
      <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-text-muted">Projeção anual de economia</p>
            <p className="text-2xl font-bold text-primary">{formatCurrency(data.savingsGoal * 12)}</p>
          </div>
          <span className="text-4xl">📈</span>
        </div>
      </div>

      {/* Tips */}
      <div className="p-4 bg-white/5 rounded-xl">
        <p className="text-sm text-text-muted mb-2">💡 Dica:</p>
        <p className="text-sm text-white">
          Registre seus gastos diariamente para manter o controle. É rápido e faz toda a diferença!
        </p>
      </div>

      {/* CTA */}
      <Button size="lg" onClick={onComplete} fullWidth className="mt-8" disabled={isLoading}>
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white" />
            Salvando...
          </span>
        ) : (
          'Começar a usar o Finny'
        )}
      </Button>
    </div>
  );
}
