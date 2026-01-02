import { useState, useEffect, useRef } from 'react';
import { Modal, Button, Input, CurrencyInput } from '../ui';
import { CategoryPicker } from './CategoryPicker';
import { useStore } from '../../store/useStore';
import { parseInputToNumber, getCurrentDateISO } from '../../utils/formatters';
import type { Category } from '../../types';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddExpenseModal({ isOpen, onClose }: AddExpenseModalProps) {
  const addExpense = useStore((state) => state.addExpense);
  const inputRef = useRef<HTMLInputElement>(null);

  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category | null>(null);
  const [date, setDate] = useState(getCurrentDateISO());
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Focus no input quando abre
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Reset form quando fecha
  useEffect(() => {
    if (!isOpen) {
      setAmount('');
      setDescription('');
      setCategory(null);
      setDate(getCurrentDateISO());
      setErrors({});
    }
  }, [isOpen]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    const amountValue = parseInputToNumber(amount);
    if (!amount || amountValue <= 0) {
      newErrors.amount = 'Informe um valor válido';
    }

    if (!description.trim()) {
      newErrors.description = 'Informe uma descrição';
    }

    if (!category) {
      newErrors.category = 'Selecione uma categoria';
    }

    if (!date) {
      newErrors.date = 'Selecione uma data';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const dateObj = new Date(date);

    addExpense({
      description: description.trim(),
      amount: parseInputToNumber(amount),
      category: category!,
      date,
      month: dateObj.getMonth() + 1,
      year: dateObj.getFullYear(),
    });

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Registrar gasto">
      <div className="space-y-4">
        {/* Amount */}
        <CurrencyInput
          ref={inputRef}
          label="Valor"
          placeholder="0,00"
          value={amount}
          onValueChange={setAmount}
          error={errors.amount}
        />

        {/* Description */}
        <Input
          label="Descrição"
          placeholder="Ex: Almoço no restaurante"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          error={errors.description}
        />

        {/* Category */}
        <div>
          <CategoryPicker
            selected={category}
            onSelect={setCategory}
          />
          {errors.category && (
            <p className="mt-1.5 text-sm text-danger">{errors.category}</p>
          )}
        </div>

        {/* Date */}
        <Input
          type="date"
          label="Data"
          value={date}
          max={getCurrentDateISO()}
          onChange={(e) => setDate(e.target.value)}
          error={errors.date}
        />

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button variant="ghost" onClick={onClose} fullWidth>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} fullWidth>
            Salvar
          </Button>
        </div>
      </div>
    </Modal>
  );
}
