import { formatCurrency } from '../../utils/formatters';

interface QuickStatsProps {
  daysInMonth: number;
  daysElapsed: number;
  averageDaily: number;
  projectedMonthly: number;
}

export function QuickStats({
  daysInMonth,
  daysElapsed,
  averageDaily,
  projectedMonthly,
}: QuickStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 mb-4">
      <div className="p-4 bg-surface border border-white/10 rounded-xl">
        <p className="text-xs text-text-muted mb-1">Média diária</p>
        <p className="text-lg font-bold text-white">{formatCurrency(averageDaily)}</p>
        <p className="text-xs text-text-muted mt-1">
          {daysElapsed} de {daysInMonth} dias
        </p>
      </div>

      <div className="p-4 bg-surface border border-white/10 rounded-xl">
        <p className="text-xs text-text-muted mb-1">Projeção mensal</p>
        <p className="text-lg font-bold text-white">{formatCurrency(projectedMonthly)}</p>
        <p className="text-xs text-text-muted mt-1">Se manter ritmo</p>
      </div>
    </div>
  );
}
