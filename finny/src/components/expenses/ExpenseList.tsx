import { useMemo } from 'react';
import { ExpenseItem } from './ExpenseItem';
import { useStore } from '../../store/useStore';
import { CATEGORIES } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';
import type { Category, Expense } from '../../types';

interface ExpenseListProps {
  month?: number;
  year?: number;
  categoryFilter?: Category | null;
}

export function ExpenseList({ month, year, categoryFilter }: ExpenseListProps) {
  const expenses = useStore((state) => state.expenses);
  const removeExpense = useStore((state) => state.removeExpense);

  const filteredExpenses = useMemo(() => {
    let filtered = [...expenses];

    if (month && year) {
      filtered = filtered.filter((e) => e.month === month && e.year === year);
    }

    if (categoryFilter) {
      filtered = filtered.filter((e) => e.category === categoryFilter);
    }

    // Ordenar por data (mais recente primeiro)
    filtered.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      if (dateA !== dateB) return dateB - dateA;
      // Se mesma data, ordenar por createdAt
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return filtered;
  }, [expenses, month, year, categoryFilter]);

  const total = useMemo(() => {
    return filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  }, [filteredExpenses]);

  // Agrupar por data
  const groupedByDate = useMemo(() => {
    const groups: Record<string, Expense[]> = {};

    filteredExpenses.forEach((expense) => {
      if (!groups[expense.date]) {
        groups[expense.date] = [];
      }
      groups[expense.date].push(expense);
    });

    return groups;
  }, [filteredExpenses]);

  if (filteredExpenses.length === 0) {
    return (
      <div className="text-center py-12">
        <span className="text-5xl mb-4 block">📝</span>
        <p className="text-white font-medium mb-2">Nenhum gasto encontrado</p>
        <p className="text-sm text-text-muted">
          {categoryFilter
            ? `Sem gastos em ${CATEGORIES[categoryFilter].name}`
            : 'Comece registrando seu primeiro gasto!'
          }
        </p>
      </div>
    );
  }

  const formatGroupDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hoje';
    }
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Ontem';
    }

    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  };

  return (
    <div className="space-y-6">
      {Object.entries(groupedByDate).map(([date, dateExpenses]) => (
        <div key={date}>
          <p className="text-sm text-text-muted mb-2 capitalize">
            {formatGroupDate(date)}
          </p>
          <div className="space-y-2">
            {dateExpenses.map((expense) => (
              <ExpenseItem
                key={expense.id}
                expense={expense}
                onDelete={removeExpense}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Total */}
      <div className="flex justify-between p-4 bg-surface border border-white/10 rounded-xl">
        <span className="text-text-muted">Total do período</span>
        <span className="text-white font-bold">{formatCurrency(total)}</span>
      </div>
    </div>
  );
}
