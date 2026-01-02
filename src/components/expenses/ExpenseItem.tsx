import { useState } from 'react';
import { CATEGORIES } from '../../utils/constants';
import { formatCurrency, formatDateShort } from '../../utils/formatters';
import type { Expense } from '../../types';

interface ExpenseItemProps {
  expense: Expense;
  onDelete: (id: string) => void;
}

export function ExpenseItem({ expense, onDelete }: ExpenseItemProps) {
  const [showDelete, setShowDelete] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const category = CATEGORIES[expense.category];

  const handleDelete = () => {
    if (confirmDelete) {
      onDelete(expense.id);
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  };

  return (
    <div
      className="flex items-center gap-3 p-3 bg-surface border border-white/10 rounded-xl"
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => {
        setShowDelete(false);
        setConfirmDelete(false);
      }}
      onTouchStart={() => setShowDelete(true)}
    >
      {/* Category icon */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
        style={{ backgroundColor: `${category?.color}20` }}
      >
        {category?.icon || '📦'}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <p className="text-white font-medium truncate">{expense.description}</p>
        <p className="text-xs text-text-muted">
          {category?.name} • {formatDateShort(expense.date)}
        </p>
      </div>

      {/* Amount */}
      <div className="text-right flex-shrink-0">
        <p className="text-white font-medium">{formatCurrency(expense.amount)}</p>
      </div>

      {/* Delete button */}
      <button
        onClick={handleDelete}
        className={`
          p-2 rounded-lg transition-all duration-200 flex-shrink-0
          ${showDelete ? 'opacity-100' : 'opacity-0 sm:opacity-100'}
          ${confirmDelete
            ? 'bg-danger text-white'
            : 'text-text-muted hover:text-danger hover:bg-danger/10'
          }
        `}
      >
        {confirmDelete ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        )}
      </button>
    </div>
  );
}
