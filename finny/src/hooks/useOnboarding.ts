import { useState, useCallback } from 'react';
import { useStore } from '../store/useStore';
import { generateId } from '../utils/formatters';
import type { UserProfile, Category } from '../types';

export interface OnboardingData {
  // Step 2: Income
  salary: number;
  otherIncome: number;
  payDay: number;
  hasAdvance: boolean;
  advanceDay: number;

  // Step 3: Fixed Expenses
  fixedExpenses: Array<{
    name: string;
    amount: number;
    category: Category;
    isActive: boolean;
  }>;

  // Step 4: Savings Goal
  savingsGoal: number;

  // Step 5: Leisure Budget
  leisureBudget: number;
}

const initialData: OnboardingData = {
  salary: 0,
  otherIncome: 0,
  payDay: 5,
  hasAdvance: false,
  advanceDay: 20,
  fixedExpenses: [],
  savingsGoal: 0,
  leisureBudget: 0,
};

export function useOnboarding() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>(initialData);

  const setProfile = useStore((state) => state.setProfile);
  const addFixedExpense = useStore((state) => state.addFixedExpense);

  const totalSteps = 6;

  const nextStep = useCallback(() => {
    setStep((prev) => Math.min(prev + 1, totalSteps));
  }, []);

  const prevStep = useCallback(() => {
    setStep((prev) => Math.max(prev - 1, 1));
  }, []);

  const goToStep = useCallback((newStep: number) => {
    if (newStep >= 1 && newStep <= totalSteps) {
      setStep(newStep);
    }
  }, []);

  const updateData = useCallback((updates: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  }, []);

  const addExpense = useCallback(
    (expense: { name: string; amount: number; category: Category }) => {
      setData((prev) => ({
        ...prev,
        fixedExpenses: [
          ...prev.fixedExpenses,
          { ...expense, isActive: true },
        ],
      }));
    },
    []
  );

  const removeExpense = useCallback((index: number) => {
    setData((prev) => ({
      ...prev,
      fixedExpenses: prev.fixedExpenses.filter((_, i) => i !== index),
    }));
  }, []);

  const updateExpense = useCallback(
    (index: number, updates: Partial<{ name: string; amount: number; category: Category }>) => {
      setData((prev) => ({
        ...prev,
        fixedExpenses: prev.fixedExpenses.map((expense, i) =>
          i === index ? { ...expense, ...updates } : expense
        ),
      }));
    },
    []
  );

  const getTotalFixedExpenses = useCallback(() => {
    return data.fixedExpenses
      .filter((e) => e.isActive)
      .reduce((sum, e) => sum + e.amount, 0);
  }, [data.fixedExpenses]);

  const getTotalIncome = useCallback(() => {
    return data.salary + data.otherIncome;
  }, [data.salary, data.otherIncome]);

  const getAvailableAfterFixed = useCallback(() => {
    return getTotalIncome() - getTotalFixedExpenses();
  }, [getTotalIncome, getTotalFixedExpenses]);

  const getAvailableAfterSavings = useCallback(() => {
    return getAvailableAfterFixed() - data.savingsGoal;
  }, [getAvailableAfterFixed, data.savingsGoal]);

  const completeOnboarding = useCallback(() => {
    // Cria o perfil do usuário
    const profile: UserProfile = {
      id: generateId(),
      name: 'Usuário',
      createdAt: new Date().toISOString(),
      hasCompletedOnboarding: true,
      salary: data.salary,
      otherIncome: data.otherIncome,
      payDay: data.payDay,
      hasAdvance: data.hasAdvance,
      advanceDay: data.advanceDay,
      savingsGoal: data.savingsGoal,
      leisureBudget: data.leisureBudget,
    };

    setProfile(profile);

    // Adiciona as despesas fixas
    data.fixedExpenses.forEach((expense) => {
      addFixedExpense({
        name: expense.name,
        amount: expense.amount,
        category: expense.category,
        isActive: expense.isActive,
      });
    });
  }, [data, setProfile, addFixedExpense]);

  return {
    step,
    totalSteps,
    data,
    nextStep,
    prevStep,
    goToStep,
    updateData,
    addExpense,
    removeExpense,
    updateExpense,
    getTotalFixedExpenses,
    getTotalIncome,
    getAvailableAfterFixed,
    getAvailableAfterSavings,
    completeOnboarding,
  };
}
