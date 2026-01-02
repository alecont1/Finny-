import { useState, useEffect } from 'react';
import { Button, CurrencyInput, Input } from '../ui';
import { useStore } from '../../store/useStore';
import { parseInputToNumber, formatNumberForInput } from '../../utils/formatters';

export function ProfileSettings() {
  const profile = useStore((state) => state.profile);
  const updateProfile = useStore((state) => state.updateProfile);

  const [salary, setSalary] = useState('');
  const [otherIncome, setOtherIncome] = useState('');
  const [payDay, setPayDay] = useState('');
  const [hasAdvance, setHasAdvance] = useState(false);
  const [advanceDay, setAdvanceDay] = useState('');
  const [savingsGoal, setSavingsGoal] = useState('');
  const [leisureBudget, setLeisureBudget] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) {
      setSalary(formatNumberForInput(profile.salary));
      setOtherIncome(formatNumberForInput(profile.otherIncome));
      setPayDay(profile.payDay.toString());
      setHasAdvance(profile.hasAdvance);
      setAdvanceDay(profile.advanceDay.toString());
      setSavingsGoal(formatNumberForInput(profile.savingsGoal));
      setLeisureBudget(formatNumberForInput(profile.leisureBudget));
    }
  }, [profile]);

  const handleSave = () => {
    updateProfile({
      salary: parseInputToNumber(salary),
      otherIncome: parseInputToNumber(otherIncome),
      payDay: parseInt(payDay) || 5,
      hasAdvance,
      advanceDay: parseInt(advanceDay) || 20,
      savingsGoal: parseInputToNumber(savingsGoal),
      leisureBudget: parseInputToNumber(leisureBudget),
    });

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white mb-4">Renda e Metas</h2>

      <CurrencyInput
        label="Salário líquido"
        value={salary}
        onValueChange={setSalary}
      />

      <CurrencyInput
        label="Outras rendas"
        value={otherIncome}
        onValueChange={setOtherIncome}
      />

      <Input
        type="number"
        label="Dia do pagamento"
        value={payDay}
        onChange={(e) => setPayDay(e.target.value)}
        min={1}
        max={31}
      />

      <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
        <div>
          <p className="text-white font-medium">Recebo adiantamento</p>
          <p className="text-sm text-text-muted">Metade do salário antecipado</p>
        </div>
        <button
          type="button"
          onClick={() => setHasAdvance(!hasAdvance)}
          className={`
            relative w-12 h-6 rounded-full transition-colors duration-200
            ${hasAdvance ? 'bg-primary' : 'bg-white/20'}
          `}
        >
          <span
            className={`
              absolute top-1 left-1 w-4 h-4 rounded-full bg-white
              transition-transform duration-200
              ${hasAdvance ? 'translate-x-6' : 'translate-x-0'}
            `}
          />
        </button>
      </div>

      {hasAdvance && (
        <Input
          type="number"
          label="Dia do adiantamento"
          value={advanceDay}
          onChange={(e) => setAdvanceDay(e.target.value)}
          min={1}
          max={31}
        />
      )}

      <div className="border-t border-white/10 pt-4 mt-4">
        <h3 className="text-md font-medium text-white mb-3">Metas</h3>

        <CurrencyInput
          label="Meta de economia mensal"
          value={savingsGoal}
          onValueChange={setSavingsGoal}
        />

        <div className="mt-4">
          <CurrencyInput
            label="Orçamento de lazer"
            value={leisureBudget}
            onValueChange={setLeisureBudget}
          />
        </div>
      </div>

      <Button onClick={handleSave} fullWidth className="mt-6">
        {saved ? '✓ Salvo!' : 'Salvar alterações'}
      </Button>
    </div>
  );
}
