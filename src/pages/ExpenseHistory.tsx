import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExpenseList } from '../components/expenses/ExpenseList';
import { CATEGORIES, MONTHS } from '../utils/constants';
import { getCurrentMonth, getCurrentYear } from '../utils/formatters';
import type { Category } from '../types';

interface ExpenseHistoryProps {
  onOpenAddExpense: () => void;
}

export function ExpenseHistory({ onOpenAddExpense }: ExpenseHistoryProps) {
  const navigate = useNavigate();

  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [selectedYear] = useState(getCurrentYear());
  const [categoryFilter, setCategoryFilter] = useState<Category | null>(null);

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
            <h1 className="text-xl font-bold text-white">Histórico de Gastos</h1>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-lg mx-auto px-4 pt-4">
        {/* Month filter */}
        <div className="flex gap-2 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-hide">
          {MONTHS.slice(1).map((monthName, index) => {
            const month = index + 1;
            const isSelected = month === selectedMonth;
            const isFuture = month > getCurrentMonth() && selectedYear >= getCurrentYear();

            return (
              <button
                key={month}
                onClick={() => setSelectedMonth(month)}
                disabled={isFuture}
                className={`
                  flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all
                  ${isSelected
                    ? 'bg-primary text-white'
                    : isFuture
                      ? 'bg-white/5 text-text-muted/50 cursor-not-allowed'
                      : 'bg-white/5 text-text-muted hover:bg-white/10 hover:text-white'
                  }
                `}
              >
                {monthName.slice(0, 3)}
              </button>
            );
          })}
        </div>

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
          <button
            onClick={() => setCategoryFilter(null)}
            className={`
              flex-shrink-0 px-3 py-1.5 rounded-full text-sm transition-all
              ${categoryFilter === null
                ? 'bg-primary text-white'
                : 'bg-white/10 text-text-muted hover:text-white'
              }
            `}
          >
            Todas
          </button>
          {Object.values(CATEGORIES).map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`
                flex-shrink-0 px-3 py-1.5 rounded-full text-sm transition-all flex items-center gap-1
                ${categoryFilter === cat.id
                  ? 'bg-primary text-white'
                  : 'bg-white/10 text-text-muted hover:text-white'
                }
              `}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Expense list */}
        <ExpenseList
          month={selectedMonth}
          year={selectedYear}
          categoryFilter={categoryFilter}
        />
      </div>

      {/* Floating button */}
      <button
        onClick={onOpenAddExpense}
        className="btn-floating"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
}
