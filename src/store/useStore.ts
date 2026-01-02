import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type {
  AppState,
  UserProfile,
  FixedExpense,
  TemporaryExpense,
  Expense,
  MonthlyGoal,
} from '../types';
import { loadState, saveState, clearState } from './persistence';
import { generateId } from '../utils/formatters';

// Carrega o estado inicial do localStorage
const persistedState = loadState();

export const useStore = create<AppState>()(
  subscribeWithSelector((set, get) => ({
    // Estado inicial
    profile: persistedState.profile,
    fixedExpenses: persistedState.fixedExpenses,
    temporaryExpenses: persistedState.temporaryExpenses,
    expenses: persistedState.expenses,
    monthlyGoals: persistedState.monthlyGoals,

    // Profile actions
    setProfile: (profile: UserProfile) => {
      set({ profile });
    },

    updateProfile: (updates: Partial<UserProfile>) => {
      const currentProfile = get().profile;
      if (currentProfile) {
        set({ profile: { ...currentProfile, ...updates } });
      }
    },

    // Fixed expenses actions
    addFixedExpense: (expense: Omit<FixedExpense, 'id'>) => {
      const newExpense: FixedExpense = {
        ...expense,
        id: generateId(),
      };
      set((state) => ({
        fixedExpenses: [...state.fixedExpenses, newExpense],
      }));
    },

    updateFixedExpense: (id: string, updates: Partial<FixedExpense>) => {
      set((state) => ({
        fixedExpenses: state.fixedExpenses.map((expense) =>
          expense.id === id ? { ...expense, ...updates } : expense
        ),
      }));
    },

    removeFixedExpense: (id: string) => {
      set((state) => ({
        fixedExpenses: state.fixedExpenses.filter((expense) => expense.id !== id),
      }));
    },

    // Temporary expenses actions
    addTemporaryExpense: (expense: Omit<TemporaryExpense, 'id'>) => {
      const newExpense: TemporaryExpense = {
        ...expense,
        id: generateId(),
      };
      set((state) => ({
        temporaryExpenses: [...state.temporaryExpenses, newExpense],
      }));
    },

    removeTemporaryExpense: (id: string) => {
      set((state) => ({
        temporaryExpenses: state.temporaryExpenses.filter((expense) => expense.id !== id),
      }));
    },

    // Variable expenses actions
    addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => {
      const newExpense: Expense = {
        ...expense,
        id: generateId(),
        createdAt: new Date().toISOString(),
      };
      set((state) => ({
        expenses: [...state.expenses, newExpense],
      }));
    },

    removeExpense: (id: string) => {
      set((state) => ({
        expenses: state.expenses.filter((expense) => expense.id !== id),
      }));
    },

    // Monthly goals actions
    setMonthlyGoal: (goal: MonthlyGoal) => {
      set((state) => {
        const existingIndex = state.monthlyGoals.findIndex(
          (g) => g.month === goal.month && g.year === goal.year
        );
        if (existingIndex >= 0) {
          const newGoals = [...state.monthlyGoals];
          newGoals[existingIndex] = goal;
          return { monthlyGoals: newGoals };
        }
        return { monthlyGoals: [...state.monthlyGoals, goal] };
      });
    },

    // Reset all data
    resetAllData: () => {
      clearState();
      set({
        profile: null,
        fixedExpenses: [],
        temporaryExpenses: [],
        expenses: [],
        monthlyGoals: [],
      });
    },
  }))
);

// Middleware para persistir automaticamente as mudanças
useStore.subscribe((state) => {
  saveState({
    profile: state.profile,
    fixedExpenses: state.fixedExpenses,
    temporaryExpenses: state.temporaryExpenses,
    expenses: state.expenses,
    monthlyGoals: state.monthlyGoals,
  });
});

// Log de desenvolvimento
if (import.meta.env.DEV) {
  useStore.subscribe((state) => {
    console.log('[Finny Store] State updated:', {
      profile: state.profile?.name || 'null',
      fixedExpenses: state.fixedExpenses.length,
      temporaryExpenses: state.temporaryExpenses.length,
      expenses: state.expenses.length,
      monthlyGoals: state.monthlyGoals.length,
    });
  });
}
