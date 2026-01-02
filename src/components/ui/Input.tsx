import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  label?: string;
  error?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, prefix, suffix, className = '', type = 'text', ...props }, ref) => {
    const hasError = !!error;

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-white mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {prefix && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
              {prefix}
            </div>
          )}
          <input
            ref={ref}
            type={type}
            className={`
              w-full bg-surface border rounded-xl px-4 py-3
              text-white placeholder:text-text-muted
              focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
              transition-all duration-200
              ${hasError ? 'border-danger focus:ring-danger/50 focus:border-danger' : 'border-white/10'}
              ${prefix ? 'pl-10' : ''}
              ${suffix ? 'pr-10' : ''}
              ${className}
            `}
            {...props}
          />
          {suffix && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
              {suffix}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-danger">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// Input específico para valores monetários
interface CurrencyInputProps extends Omit<InputProps, 'type' | 'prefix'> {
  value: string;
  onValueChange: (value: string) => void;
}

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ value, onValueChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let inputValue = e.target.value;

      // Remove tudo exceto números e vírgula
      inputValue = inputValue.replace(/[^\d,]/g, '');

      // Garante apenas uma vírgula
      const parts = inputValue.split(',');
      if (parts.length > 2) {
        inputValue = parts[0] + ',' + parts.slice(1).join('');
      }

      // Limita casas decimais a 2
      if (parts.length === 2 && parts[1].length > 2) {
        inputValue = parts[0] + ',' + parts[1].slice(0, 2);
      }

      onValueChange(inputValue);
    };

    return (
      <Input
        ref={ref}
        type="text"
        inputMode="decimal"
        value={value}
        onChange={handleChange}
        prefix={<span className="text-lg font-medium">R$</span>}
        {...props}
      />
    );
  }
);

CurrencyInput.displayName = 'CurrencyInput';

// Seletor visual de dia do mês
interface DayPickerProps {
  label?: string;
  value: number;
  onChange: (day: number) => void;
  error?: string;
}

export function DayPicker({ label, value, onChange, error }: DayPickerProps) {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-white mb-3">
          {label}
        </label>
      )}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => (
          <button
            key={day}
            type="button"
            onClick={() => onChange(day)}
            className={`
              w-full aspect-square rounded-lg text-sm font-medium
              transition-all duration-200
              ${value === day
                ? 'bg-primary text-white scale-105 shadow-lg shadow-primary/30'
                : 'bg-white/5 text-text-muted hover:bg-white/10 hover:text-white'
              }
            `}
          >
            {day}
          </button>
        ))}
      </div>
      {error && (
        <p className="mt-2 text-sm text-danger">{error}</p>
      )}
    </div>
  );
}
