import { useState } from 'react';
import { CurrencyInput, ProgressBar } from '../ui';
import { formatCurrency, parseInputToNumber, formatNumberForInput } from '../../utils/formatters';

interface LeisureStepProps {
  availableAfterSavings: number;
  leisureBudget: number;
  onUpdate: (leisureBudget: number) => void;
}

export function LeisureStep({ availableAfterSavings, leisureBudget, onUpdate }: LeisureStepProps) {
  const [inputValue, setInputValue] = useState(formatNumberForInput(leisureBudget));

  const weeklyBudget = leisureBudget / 4;
  const dailyBudget = leisureBudget / 30;
  const percentage = availableAfterSavings > 0 ? (leisureBudget / availableAfterSavings) * 100 : 0;

  const handleInputChange = (value: string) => {
    setInputValue(value);
    onUpdate(parseInputToNumber(value));
  };

  const handleSuggestionClick = (value: number) => {
    const rounded = Math.round(value);
    setInputValue(formatNumberForInput(rounded));
    onUpdate(rounded);
  };

  // Sugestões
  const suggestions = [
    { label: '25%', value: availableAfterSavings * 0.25 },
    { label: '50%', value: availableAfterSavings * 0.5 },
    { label: '75%', value: availableAfterSavings * 0.75 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-white mb-2">Orçamento de lazer</h2>
        <p className="text-text-muted">
          Quanto você quer gastar com diversão?
        </p>
      </div>

      {/* Explanation card */}
      <div className="p-4 bg-secondary/10 border border-secondary/20 rounded-xl">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <p className="text-white font-medium mb-1">O que é orçamento de lazer?</p>
            <p className="text-sm text-text-muted">
              É o valor que você define para gastar em coisas prazerosas: restaurantes,
              cinema, viagens, compras não essenciais. Ter um limite ajuda você a
              aproveitar sem culpa!
            </p>
          </div>
        </div>
      </div>

      {/* Available amount */}
      <div className="p-4 bg-white/5 rounded-xl">
        <p className="text-sm text-text-muted mb-1">Disponível após meta de economia</p>
        <p className="text-2xl font-bold text-white">{formatCurrency(availableAfterSavings)}</p>
      </div>

      {/* Budget input */}
      <CurrencyInput
        label="Orçamento mensal de lazer"
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
              onClick={() => handleSuggestionClick(suggestion.value)}
              className={`
                flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all
                ${Math.abs(leisureBudget - suggestion.value) < 1
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

      {/* Breakdown */}
      {leisureBudget > 0 && (
        <div className="space-y-4 slide-up">
          {/* Progress */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-text-muted">Porcentagem do disponível</span>
              <span className="text-white font-medium">{percentage.toFixed(0)}%</span>
            </div>
            <ProgressBar
              value={leisureBudget}
              max={availableAfterSavings}
              color="#f472b6"
              height="lg"
            />
          </div>

          {/* Weekly/Daily breakdown */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 bg-white/5 rounded-xl text-center">
              <p className="text-sm text-text-muted mb-1">Por semana</p>
              <p className="text-xl font-bold text-white">{formatCurrency(weeklyBudget)}</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl text-center">
              <p className="text-sm text-text-muted mb-1">Por dia</p>
              <p className="text-xl font-bold text-white">{formatCurrency(dailyBudget)}</p>
            </div>
          </div>

          {/* Examples */}
          <div className="p-4 bg-pink-500/10 border border-pink-500/20 rounded-xl">
            <p className="text-sm text-text-muted mb-2">Isso equivale a aproximadamente:</p>
            <ul className="text-sm text-white space-y-1">
              <li>🍕 {Math.floor(leisureBudget / 50)} pizzas por mês</li>
              <li>🎬 {Math.floor(leisureBudget / 30)} ingressos de cinema</li>
              <li>☕ {Math.floor(leisureBudget / 15)} cafés especiais</li>
            </ul>
          </div>

          {/* Remaining */}
          <div className="flex justify-between p-3 bg-white/5 rounded-xl">
            <span className="text-text-muted">Para emergências</span>
            <span className={`font-medium ${availableAfterSavings - leisureBudget >= 0 ? 'text-white' : 'text-danger'}`}>
              {formatCurrency(availableAfterSavings - leisureBudget)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
