import { useState } from 'react';
import { Button, Input, CurrencyInput, Modal } from '../ui';
import { useStore } from '../../store/useStore';
import { CATEGORIES, MONTHS } from '../../utils/constants';
import { formatCurrency, parseInputToNumber, getCurrentMonth, getCurrentYear } from '../../utils/formatters';
import type { Category } from '../../types';

export function TemporaryExpenses() {
  const temporaryExpenses = useStore((state) => state.temporaryExpenses);
  const addTemporaryExpense = useStore((state) => state.addTemporaryExpense);
  const removeTemporaryExpense = useStore((state) => state.removeTemporaryExpense);

  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newCategory, setNewCategory] = useState<Category>('outros');
  const [totalParcelas, setTotalParcelas] = useState('12');

  const currentMonth = getCurrentMonth();
  const currentYear = getCurrentYear();

  const handleAdd = () => {
    if (newName && newAmount && totalParcelas) {
      const parcelas = parseInt(totalParcelas);
      let endMonth = currentMonth + parcelas - 1;
      let endYear = currentYear;

      while (endMonth > 12) {
        endMonth -= 12;
        endYear += 1;
      }

      addTemporaryExpense({
        name: newName,
        amount: parseInputToNumber(newAmount),
        category: newCategory,
        startMonth: currentMonth,
        startYear: currentYear,
        endMonth,
        endYear,
      });

      setNewName('');
      setNewAmount('');
      setNewCategory('outros');
      setTotalParcelas('12');
      setShowAdd(false);
    }
  };

  const getRemainingParcelas = (expense: typeof temporaryExpenses[0]) => {
    const currentDate = currentYear * 12 + currentMonth;
    const endDate = expense.endYear * 12 + expense.endMonth;
    return Math.max(endDate - currentDate + 1, 0);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Parcelas</h2>
        <Button size="sm" onClick={() => setShowAdd(true)}>
          + Adicionar
        </Button>
      </div>

      {/* List */}
      {temporaryExpenses.length === 0 ? (
        <div className="text-center py-8">
          <span className="text-4xl mb-2 block">📅</span>
          <p className="text-text-muted">Nenhuma parcela cadastrada</p>
          <p className="text-sm text-text-muted mt-1">
            Adicione compras parceladas para controlar
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {temporaryExpenses.map((expense) => {
            const remaining = getRemainingParcelas(expense);

            return (
              <div
                key={expense.id}
                className="p-4 bg-surface border border-white/10 rounded-xl"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{CATEGORIES[expense.category]?.icon || '📦'}</span>
                    <div>
                      <p className="text-white font-medium">{expense.name}</p>
                      <p className="text-sm text-text-muted">
                        {formatCurrency(expense.amount)}/mês
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeTemporaryExpense(expense.id)}
                    className="p-1 text-text-muted hover:text-danger transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-muted">
                    {MONTHS[expense.startMonth]}/{expense.startYear} até {MONTHS[expense.endMonth]}/{expense.endYear}
                  </span>
                  <span className={remaining > 0 ? 'text-warning' : 'text-primary'}>
                    {remaining > 0 ? `${remaining} parcelas restantes` : 'Finalizado'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Modal */}
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Nova parcela">
        <div className="space-y-4">
          <Input
            label="Descrição"
            placeholder="Ex: TV 55 polegadas"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <CurrencyInput
            label="Valor da parcela"
            placeholder="0,00"
            value={newAmount}
            onValueChange={setNewAmount}
          />
          <Input
            type="number"
            label="Número de parcelas"
            placeholder="12"
            value={totalParcelas}
            onChange={(e) => setTotalParcelas(e.target.value)}
            min={1}
            max={60}
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

          {newAmount && totalParcelas && (
            <div className="p-3 bg-white/5 rounded-xl">
              <p className="text-sm text-text-muted">Total da compra</p>
              <p className="text-lg font-bold text-white">
                {formatCurrency(parseInputToNumber(newAmount) * parseInt(totalParcelas || '0'))}
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button variant="ghost" onClick={() => setShowAdd(false)} fullWidth>
              Cancelar
            </Button>
            <Button onClick={handleAdd} fullWidth disabled={!newName || !newAmount || !totalParcelas}>
              Adicionar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
