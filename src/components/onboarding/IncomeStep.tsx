import { useState } from 'react';
import { CurrencyInput, DayPicker } from '../ui';
import { parseInputToNumber, formatNumberForInput } from '../../utils/formatters';

interface IncomeStepProps {
  data: {
    salary: number;
    otherIncome: number;
    payDay: number;
    hasAdvance: boolean;
    advanceDay: number;
  };
  onUpdate: (updates: Partial<IncomeStepProps['data']>) => void;
}

export function IncomeStep({ data, onUpdate }: IncomeStepProps) {
  const [salaryInput, setSalaryInput] = useState(formatNumberForInput(data.salary));
  const [otherIncomeInput, setOtherIncomeInput] = useState(formatNumberForInput(data.otherIncome));

  const handleSalaryChange = (value: string) => {
    setSalaryInput(value);
    onUpdate({ salary: parseInputToNumber(value) });
  };

  const handleOtherIncomeChange = (value: string) => {
    setOtherIncomeInput(value);
    onUpdate({ otherIncome: parseInputToNumber(value) });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-5xl mb-4">💵</div>
        <h2 className="text-2xl font-bold text-white mb-2">Sua renda</h2>
        <p className="text-text-muted">
          Quanto você recebe por mês?
        </p>
      </div>

      {/* Salary */}
      <CurrencyInput
        label="Salário líquido"
        placeholder="5.000,00"
        value={salaryInput}
        onValueChange={handleSalaryChange}
        autoFocus
      />

      {/* Other income */}
      <CurrencyInput
        label="Outras rendas (opcional)"
        placeholder="0,00"
        value={otherIncomeInput}
        onValueChange={handleOtherIncomeChange}
      />

      {/* Pay day */}
      <DayPicker
        label="Dia do pagamento"
        value={data.payDay || 5}
        onChange={(day) => onUpdate({ payDay: day })}
      />

      {/* Advance toggle */}
      <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
        <div>
          <p className="text-white font-medium">Recebo adiantamento</p>
          <p className="text-sm text-text-muted">Metade do salário antecipado</p>
        </div>
        <button
          type="button"
          onClick={() => onUpdate({ hasAdvance: !data.hasAdvance })}
          className={`
            relative w-12 h-6 rounded-full transition-colors duration-200
            ${data.hasAdvance ? 'bg-primary' : 'bg-white/20'}
          `}
        >
          <span
            className={`
              absolute top-1 left-1 w-4 h-4 rounded-full bg-white
              transition-transform duration-200
              ${data.hasAdvance ? 'translate-x-6' : 'translate-x-0'}
            `}
          />
        </button>
      </div>

      {/* Advance day */}
      {data.hasAdvance && (
        <div className="slide-up">
          <DayPicker
            label="Dia do adiantamento"
            value={data.advanceDay || 20}
            onChange={(day) => onUpdate({ advanceDay: day })}
          />
        </div>
      )}

      {/* Summary */}
      {data.salary > 0 && (
        <div className="mt-8 p-4 bg-primary/10 border border-primary/20 rounded-xl">
          <p className="text-sm text-text-muted mb-1">Renda total mensal</p>
          <p className="text-2xl font-bold text-primary">
            R$ {(data.salary + data.otherIncome).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
      )}
    </div>
  );
}
