import { useState, useEffect } from 'react';
import { CurrencyInput, ProgressBar } from '../ui';
import { formatCurrency, parseInputToNumber, formatNumberForInput } from '../../utils/formatters';

interface GoalStepProps {
  available: number;
  savingsGoal: number;
  onUpdate: (savingsGoal: number) => void;
}

export function GoalStep({ available, savingsGoal, onUpdate }: GoalStepProps) {
  const [inputValue, setInputValue] = useState(formatNumberForInput(savingsGoal));

  // Sugestões de porcentagem
  const suggestions = [
    { label: '10%', value: available * 0.1 },
    { label: '20%', value: available * 0.2 },
    { label: '30%', value: available * 0.3 },
  ];

  const annualProjection = savingsGoal * 12;
  const percentage = available > 0 ? (savingsGoal / available) * 100 : 0;

  const handleInputChange = (value: string) => {
    setInputValue(value);
    onUpdate(parseInputToNumber(value));
  };

  useEffect(() => {
    setInputValue(formatNumberForInput(savingsGoal));
  }, [savingsGoal]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="text-5xl mb-4">🎯</div>
        <h2 className="text-2xl font-bold text-white mb-2">Meta de economia</h2>
        <p className="text-text-muted">
          Quanto você quer guardar por mês?
        </p>
      </div>

      {/* Available amount */}
      <div className="p-4 bg-white/5 rounded-xl">
        <p className="text-sm text-text-muted mb-1">Disponível após despesas fixas</p>
        <p className="text-2xl font-bold text-white">{formatCurrency(available)}</p>
      </div>

      {/* Goal input */}
      <CurrencyInput
        label="Meta mensal de economia"
        placeholder="500,00"
        value={inputValue}
        onValueChange={handleInputChange}
      />

      {/* Quick suggestions */}
      <div>
        <p className="text-sm text-text-muted mb-3">Sugestões:</p>
        <div className="flex gap-2">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.label}
              onClick={() => onUpdate(Math.round(suggestion.value))}
              className={`
                flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all
                ${Math.abs(savingsGoal - suggestion.value) < 1
                  ? 'bg-primary text-white'
                  : 'bg-white/10 text-text-muted hover:bg-white/20 hover:text-white'
                }
              `}
            >
              {suggestion.label}
              <br />
              <span className="text-xs opacity-75">{formatCurrency(suggestion.value)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Progress visualization */}
      {savingsGoal > 0 && (
        <div className="space-y-4 slide-up">
          {/* Progress bar */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-text-muted">Porcentagem da sobra</span>
              <span className="text-white font-medium">{percentage.toFixed(0)}%</span>
            </div>
            <ProgressBar
              value={savingsGoal}
              max={available}
              height="lg"
            />
          </div>

          {/* Annual projection */}
          <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-muted mb-1">Projeção anual</p>
                <p className="text-2xl font-bold text-primary">{formatCurrency(annualProjection)}</p>
              </div>
              <div className="text-4xl">📈</div>
            </div>
            <p className="text-sm text-text-muted mt-2">
              Em 12 meses você pode ter guardado esse valor!
            </p>
          </div>

          {/* Remaining after goal */}
          <div className="flex justify-between p-3 bg-white/5 rounded-xl">
            <span className="text-text-muted">Sobra para gastar</span>
            <span className={`font-medium ${available - savingsGoal >= 0 ? 'text-white' : 'text-danger'}`}>
              {formatCurrency(available - savingsGoal)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
