import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, ProgressBar } from '../components/ui';
import { useOnboarding } from '../hooks/useOnboarding';
import { useProfile } from '../hooks/useProfile';
import { WelcomeStep } from '../components/onboarding/WelcomeStep';
import { IncomeStep } from '../components/onboarding/IncomeStep';
import { ExpensesStep } from '../components/onboarding/ExpensesStep';
import { GoalStep } from '../components/onboarding/GoalStep';
import { LeisureStep } from '../components/onboarding/LeisureStep';
import { CompleteStep } from '../components/onboarding/CompleteStep';

export function Onboarding() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { completeOnboarding: saveToDatabase } = useProfile();
  const {
    step,
    totalSteps,
    data,
    nextStep,
    prevStep,
    updateData,
    addExpense,
    removeExpense,
    updateExpense,
    getTotalFixedExpenses,
    getTotalIncome,
    getAvailableAfterFixed,
    getAvailableAfterSavings,
  } = useOnboarding();

  const handleComplete = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // Save to Supabase database
      const { error } = await saveToDatabase({
        salary: data.salary,
        otherIncome: data.otherIncome,
        payDay: data.payDay,
        hasAdvance: data.hasAdvance,
        advanceDay: data.advanceDay,
        savingsGoal: data.savingsGoal,
        leisureBudget: data.leisureBudget,
        fixedExpenses: data.fixedExpenses.map(exp => ({
          name: exp.name,
          amount: exp.amount,
          category: exp.category
        }))
      });

      if (error) {
        console.error('Error completing onboarding:', error);
        setIsSubmitting(false);
        return;
      }

      navigate('/dashboard');
    } catch (err) {
      console.error('Error completing onboarding:', err);
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 2:
        return data.salary > 0 && data.payDay > 0;
      case 3:
        return true; // Expenses are optional
      case 4:
        return data.savingsGoal >= 0;
      case 5:
        return data.leisureBudget >= 0;
      default:
        return true;
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <WelcomeStep onNext={nextStep} />;
      case 2:
        return (
          <IncomeStep
            data={data}
            onUpdate={updateData}
          />
        );
      case 3:
        return (
          <ExpensesStep
            expenses={data.fixedExpenses}
            onAddExpense={addExpense}
            onRemoveExpense={removeExpense}
            onUpdateExpense={updateExpense}
            totalIncome={getTotalIncome()}
          />
        );
      case 4:
        return (
          <GoalStep
            available={getAvailableAfterFixed()}
            savingsGoal={data.savingsGoal}
            onUpdate={(savingsGoal) => updateData({ savingsGoal })}
          />
        );
      case 5:
        return (
          <LeisureStep
            availableAfterSavings={getAvailableAfterSavings()}
            leisureBudget={data.leisureBudget}
            onUpdate={(leisureBudget) => updateData({ leisureBudget })}
          />
        );
      case 6:
        return (
          <CompleteStep
            data={data}
            totalFixedExpenses={getTotalFixedExpenses()}
            onComplete={handleComplete}
            isLoading={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress bar */}
      {step > 1 && step < 6 && (
        <div className="fixed top-0 left-0 right-0 z-40 p-4 bg-background/80 backdrop-blur-sm">
          <div className="max-w-lg mx-auto">
            <div className="flex items-center justify-between text-sm text-text-muted mb-2">
              <span>Passo {step - 1} de {totalSteps - 2}</span>
              <span>{Math.round(((step - 1) / (totalSteps - 2)) * 100)}%</span>
            </div>
            <ProgressBar
              value={step - 1}
              max={totalSteps - 2}
              height="sm"
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className={`flex-1 ${step > 1 && step < 6 ? 'pt-20' : ''}`}>
        <div className="max-w-lg mx-auto px-4 py-8">
          <div className="fade-in">
            {renderStep()}
          </div>
        </div>
      </div>

      {/* Navigation buttons */}
      {step > 1 && step < 6 && (
        <div className="sticky bottom-0 bg-background/80 backdrop-blur-sm border-t border-white/10 p-4">
          <div className="max-w-lg mx-auto flex gap-3">
            <Button
              variant="ghost"
              onClick={prevStep}
              className="flex-1"
            >
              Voltar
            </Button>
            <Button
              onClick={nextStep}
              disabled={!canProceed()}
              className="flex-1"
            >
              {step === 5 ? 'Finalizar' : 'Próximo'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
