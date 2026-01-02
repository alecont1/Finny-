import { useState } from 'react';
import { Button, Input, CurrencyInput, Modal } from '../ui';
import { useStore } from '../../store/useStore';
import { CATEGORIES } from '../../utils/constants';
import { formatCurrency, parseInputToNumber } from '../../utils/formatters';
import type { Category } from '../../types';

export function FixedExpenses() {
  const fixedExpenses = useStore((state) => state.fixedExpenses);
  const addFixedExpense = useStore((state) => state.addFixedExpense);
  const updateFixedExpense = useStore((state) => state.updateFixedExpense);
  const removeFixedExpense = useStore((state) => state.removeFixedExpense);

  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newCategory, setNewCategory] = useState<Category>('outros');

  const total = fixedExpenses
    .filter((e) => e.isActive)
    .reduce((sum, e) => sum + e.amount, 0);

  const handleAdd = () => {
    if (newName && newAmount) {
      addFixedExpense({
        name: newName,
        amount: parseInputToNumber(newAmount),
        category: newCategory,
        isActive: true,
      });
      setNewName('');
      setNewAmount('');
      setNewCategory('outros');
      setShowAdd(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Despesas Fixas</h2>
        <Button size="sm" onClick={() => setShowAdd(true)}>
          + Adicionar
        </Button>
      </div>

      {/* Total */}
      <div className="p-3 bg-white/5 rounded-xl flex justify-between">
        <span className="text-text-muted">Total mensal</span>
        <span className="text-white font-bold">{formatCurrency(total)}</span>
      </div>

      {/* List */}
      {fixedExpenses.length === 0 ? (
        <div className="text-center py-8">
          <span className="text-4xl mb-2 block">📋</span>
          <p className="text-text-muted">Nenhuma despesa fixa cadastrada</p>
        </div>
      ) : (
        <div className="space-y-2">
          {fixedExpenses.map((expense) => (
            <div
              key={expense.id}
              className={`
                flex items-center gap-3 p-3 rounded-xl border transition-all
                ${expense.isActive
                  ? 'bg-surface border-white/10'
                  : 'bg-white/5 border-transparent opacity-50'
                }
              `}
            >
              <span className="text-xl">{CATEGORIES[expense.category]?.icon || '📦'}</span>
              <div className="flex-1 min-w-0">
                <p className={`font-medium truncate ${expense.isActive ? 'text-white' : 'text-text-muted line-through'}`}>
                  {expense.name}
                </p>
                <p className="text-sm text-text-muted">{CATEGORIES[expense.category]?.name}</p>
              </div>
              <p className="text-white font-medium">{formatCurrency(expense.amount)}</p>

              <button
                onClick={() => updateFixedExpense(expense.id, { isActive: !expense.isActive })}
                className={`
                  w-10 h-6 rounded-full transition-colors
                  ${expense.isActive ? 'bg-primary' : 'bg-white/20'}
                `}
              >
                <span
                  className={`
                    block w-4 h-4 rounded-full bg-white mx-1
                    transition-transform duration-200
                    ${expense.isActive ? 'translate-x-4' : 'translate-x-0'}
                  `}
                />
              </button>

              <button
                onClick={() => removeFixedExpense(expense.id)}
                className="p-1 text-text-muted hover:text-danger transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Nova despesa fixa">
        <div className="space-y-4">
          <Input
            label="Nome"
            placeholder="Ex: Aluguel"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <CurrencyInput
            label="Valor"
            placeholder="0,00"
            value={newAmount}
            onValueChange={setNewAmount}
          />
          <div>
            <label className="block text-sm font-medium text-white mb-2">Categoria</label>
            <div className="grid grid-cols-5 gap-2">
              {Object.values(CATEGORIES).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setNewCategory(cat.id)}
                  className={`
                    p-2 rounded-lg text-center transition-all
                    ${newCategory === cat.id
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
          <div className="flex gap-3 pt-4">
            <Button variant="ghost" onClick={() => setShowAdd(false)} fullWidth>
              Cancelar
            </Button>
            <Button onClick={handleAdd} fullWidth disabled={!newName || !newAmount}>
              Adicionar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
