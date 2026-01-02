import { Card } from '../ui';
import { CATEGORIES } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';
import type { Category } from '../../types';

interface CategoryBreakdownProps {
  expensesByCategory: Record<string, number>;
}

export function CategoryBreakdown({ expensesByCategory }: CategoryBreakdownProps) {
  // Ordenar por valor e pegar top 5
  const sortedCategories = Object.entries(expensesByCategory)
    .filter(([, amount]) => amount > 0)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const total = Object.values(expensesByCategory).reduce((sum, val) => sum + val, 0);

  if (sortedCategories.length === 0) {
    return (
      <Card className="mb-4">
        <h3 className="text-white font-semibold mb-4">Gastos por categoria</h3>
        <div className="text-center py-8">
          <span className="text-4xl mb-3 block">📊</span>
          <p className="text-text-muted">Nenhum gasto registrado</p>
          <p className="text-sm text-text-muted mt-1">
            Registre seus gastos para ver a análise
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="mb-4">
      <h3 className="text-white font-semibold mb-4">Gastos por categoria</h3>

      <div className="space-y-3">
        {sortedCategories.map(([categoryId, amount]) => {
          const category = CATEGORIES[categoryId as Category];
          const percentage = total > 0 ? (amount / total) * 100 : 0;

          return (
            <div key={categoryId}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{category?.icon || '📦'}</span>
                  <span className="text-sm text-white">{category?.name || categoryId}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm text-white font-medium">
                    {formatCurrency(amount)}
                  </span>
                  <span className="text-xs text-text-muted ml-2">
                    {percentage.toFixed(0)}%
                  </span>
                </div>
              </div>

              {/* Mini bar */}
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: category?.color || '#94a3b8',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Total */}
      <div className="flex justify-between mt-4 pt-3 border-t border-white/10">
        <span className="text-text-muted">Total</span>
        <span className="text-white font-bold">{formatCurrency(total)}</span>
      </div>
    </Card>
  );
}
