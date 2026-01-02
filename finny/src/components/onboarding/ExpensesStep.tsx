import { useState } from 'react';
import { Button, CurrencyInput, Input } from '../ui';
import { DEFAULT_FIXED_EXPENSES, CATEGORIES } from '../../utils/constants';
import { parseInputToNumber, formatCurrency } from '../../utils/formatters';
import type { Category } from '../../types';

interface ExpenseItem {
  name: string;
  amount: number;
  category: Category;
  isActive: boolean;
}

interface ExpensesStepProps {
  expenses: ExpenseItem[];
  onAddExpense: (expense: { name: string; amount: number; category: Category }) => void;
  onRemoveExpense: (index: number) => void;
  onUpdateExpense: (index: number, updates: Partial<ExpenseItem>) => void;
  totalIncome: number;
}

export function ExpensesStep({
  expenses,
  onAddExpense,
  onRemoveExpense,
  onUpdateExpense,
  totalIncome,
}: ExpensesStepProps) {
  const [showAddNew, setShowAddNew] = useState(false);
  const [newExpense, setNewExpense] = useState({ name: '', amount: '', category: 'outros' as Category });

  const totalExpenses = expenses
    .filter((e) => e.isActive)
    .reduce((sum, e) => sum + e.amount, 0);

  const remaining = totalIncome - totalExpenses;

  const handleAddSuggested = (suggested: typeof DEFAULT_FIXED_EXPENSES[0]) => {
    const exists = expenses.some((e) => e.name.toLowerCase() === suggested.name.toLowerCase());
    if (!exists) {
      onAddExpense({
        name: suggested.name,
        amount: suggested.suggested,
        category: suggested.category,
      });
    }
  };

  const handleAddCustom = () => {
    if (newExpense.name && newExpense.amount) {
      onAddExpense({
        name: newExpense.name,
        amount: parseInputToNumber(newExpense.amount),
        category: newExpense.category,
      });
      setNewExpense({ name: '', amount: '', category: 'outros' });
      setShowAddNew(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="text-5xl mb-4">📋</div>
        <h2 className="text-2xl font-bold text-white mb-2">Despesas fixas</h2>
        <p className="text-text-muted">
          Gastos que se repetem todo mês
        </p>
      </div>

      {/* Suggestions */}
      <div>
        <p className="text-sm text-text-muted mb-3">Sugestões (clique para adicionar):</p>
        <div className="flex flex-wrap gap-2">
          {DEFAULT_FIXED_EXPENSES.map((suggested) => {
            const isAdded = expenses.some((e) => e.name.toLowerCase() === suggested.name.toLowerCase());
            return (
              <button
                key={suggested.name}
                onClick={() => handleAddSuggested(suggested)}
                disabled={isAdded}
                className={`
                  px-3 py-1.5 rounded-full text-sm transition-all
                  ${isAdded
                    ? 'bg-primary/20 text-primary cursor-default'
                    : 'bg-white/10 text-text-muted hover:bg-white/20 hover:text-white'
                  }
                `}
              >
                {CATEGORIES[suggested.category].icon} {suggested.name}
                {isAdded && ' ✓'}
              </button>
            );
          })}
        </div>
      </div>

      {/* Expense list */}
      {expenses.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm text-text-muted">Suas despesas:</p>
          {expenses.map((expense, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-white/5 rounded-xl"
            >
              <span className="text-xl">{CATEGORIES[expense.category].icon}</span>
              <div className="flex-1">
                <p className="text-white font-medium">{expense.name}</p>
              </div>
              <input
                type="text"
                inputMode="decimal"
                value={expense.amount > 0 ? expense.amount.toString().replace('.', ',') : ''}
                onChange={(e) => {
                  const value = parseInputToNumber(e.target.value);
                  onUpdateExpense(index, { amount: value });
                }}
                className="w-24 bg-surface border border-white/10 rounded-lg px-3 py-1.5 text-white text-right focus:outline-none focus:border-primary"
                placeholder="0,00"
              />
              <button
                onClick={() => onRemoveExpense(index)}
                className="p-2 text-text-muted hover:text-danger transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add new */}
      {showAddNew ? (
        <div className="p-4 bg-white/5 rounded-xl space-y-3 slide-up">
          <Input
            label="Nome da despesa"
            placeholder="Ex: Netflix"
            value={newExpense.name}
            onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
            autoFocus
          />
          <CurrencyInput
            label="Valor"
            placeholder="0,00"
            value={newExpense.amount}
            onValueChange={(value) => setNewExpense({ ...newExpense, amount: value })}
          />
          <div>
            <label className="block text-sm font-medium text-white mb-2">Categoria</label>
            <div className="grid grid-cols-5 gap-2">
              {Object.values(CATEGORIES).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setNewExpense({ ...newExpense, category: cat.id })}
                  className={`
                    p-2 rounded-lg text-center transition-all
                    ${newExpense.category === cat.id
                      ? 'bg-primary/20 border-2 border-primary'
                      : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
                    }
                  `}
                >
                  <span className="text-xl">{cat.icon}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button variant="ghost" onClick={() => setShowAddNew(false)} fullWidth>
              Cancelar
            </Button>
            <Button onClick={handleAddCustom} fullWidth disabled={!newExpense.name || !newExpense.amount}>
              Adicionar
            </Button>
          </div>
        </div>
      ) : (
        <Button variant="outline" onClick={() => setShowAddNew(true)} fullWidth>
          + Adicionar outra despesa
        </Button>
      )}

      {/* Summary */}
      <div className="mt-6 p-4 bg-surface border border-white/10 rounded-xl">
        <div className="flex justify-between mb-2">
          <span className="text-text-muted">Total despesas fixas</span>
          <span className="text-white font-medium">{formatCurrency(totalExpenses)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-muted">Sobra da renda</span>
          <span className={`font-bold ${remaining >= 0 ? 'text-primary' : 'text-danger'}`}>
            {formatCurrency(remaining)}
          </span>
        </div>
      </div>
    </div>
  );
}
