import { useNavigate } from 'react-router-dom';
import { useFinancials } from '../hooks/useFinancials';
import { Card } from '../components/ui';
import { formatCurrency, formatMonth, getCurrentYear } from '../utils/formatters';

export function AnnualView() {
  const navigate = useNavigate();
  const { getAnnualSummary } = useFinancials();

  const currentYear = getCurrentYear();
  const annualData = getAnnualSummary(currentYear);

  const goToMonth = (month: number) => {
    navigate(`/dashboard?month=${month}`);
  };

  const getMonthStatus = (monthData: { balance: number; goal: number }) => {
    if (monthData.balance >= monthData.goal) {
      return { color: 'bg-primary/20 border-primary/30', text: 'text-primary' };
    }
    if (monthData.balance >= 0) {
      return { color: 'bg-warning/20 border-warning/30', text: 'text-warning' };
    }
    return { color: 'bg-danger/20 border-danger/30', text: 'text-danger' };
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-surface/50 border-b border-white/10 px-4 py-4 sticky top-0 z-30 backdrop-blur-sm">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 -ml-2 text-text-muted hover:text-white hover:bg-white/10 rounded-full transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-xl font-bold text-white">Visão Anual {currentYear}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-4">
        {/* Summary card */}
        <Card gradient className="mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-text-muted mb-1">Renda total (ano)</p>
              <p className="text-xl font-bold text-white">{formatCurrency(annualData.totalIncome)}</p>
            </div>
            <div>
              <p className="text-sm text-text-muted mb-1">Despesas (ano)</p>
              <p className="text-xl font-bold text-danger">{formatCurrency(annualData.totalExpenses)}</p>
            </div>
            <div>
              <p className="text-sm text-text-muted mb-1">Economia esperada</p>
              <p className="text-xl font-bold text-primary">{formatCurrency(annualData.totalSaved)}</p>
            </div>
            <div>
              <p className="text-sm text-text-muted mb-1">Média mensal</p>
              <p className="text-xl font-bold text-white">{formatCurrency(annualData.averageMonthlyExpenses)}</p>
            </div>
          </div>
        </Card>

        {/* Monthly breakdown */}
        <h2 className="text-lg font-semibold text-white mb-3">Meses</h2>
        <div className="grid grid-cols-2 gap-3">
          {annualData.monthlyData.map((monthData) => {
            const status = getMonthStatus(monthData);
            const currentMonth = new Date().getMonth() + 1;
            const isFuture = monthData.month > currentMonth;

            return (
              <button
                key={monthData.month}
                onClick={() => !isFuture && goToMonth(monthData.month)}
                disabled={isFuture}
                className={`
                  p-4 rounded-xl border text-left transition-all
                  ${isFuture
                    ? 'bg-white/5 border-white/5 opacity-50 cursor-not-allowed'
                    : `${status.color} hover:scale-[1.02]`
                  }
                `}
              >
                <p className="text-white font-medium mb-1">
                  {formatMonth(monthData.month)}
                </p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-muted">Renda</span>
                    <span className="text-white">{formatCurrency(monthData.income)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Gastos</span>
                    <span className="text-danger">{formatCurrency(monthData.expenses)}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-white/10">
                    <span className="text-text-muted">Sobra</span>
                    <span className={status.text}>{formatCurrency(monthData.balance)}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Projection */}
        <Card className="mt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-muted mb-1">Projeção de economia</p>
              <p className="text-2xl font-bold text-primary">
                {formatCurrency(annualData.averageMonthlySaved * 12)}
              </p>
              <p className="text-xs text-text-muted mt-1">
                Baseado na média mensal de {formatCurrency(annualData.averageMonthlySaved)}
              </p>
            </div>
            <span className="text-4xl">📈</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
