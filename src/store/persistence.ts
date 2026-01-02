import { STORAGE_KEY } from '../utils/constants';
import type { UserProfile, FixedExpense, TemporaryExpense, Expense, MonthlyGoal } from '../types';

export interface PersistedState {
  profile: UserProfile | null;
  fixedExpenses: FixedExpense[];
  temporaryExpenses: TemporaryExpense[];
  expenses: Expense[];
  monthlyGoals: MonthlyGoal[];
}

const defaultState: PersistedState = {
  profile: null,
  fixedExpenses: [],
  temporaryExpenses: [],
  expenses: [],
  monthlyGoals: [],
};

/**
 * Carrega o estado do localStorage
 */
export function loadState(): PersistedState {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (serializedState === null) {
      return defaultState;
    }
    const parsed = JSON.parse(serializedState);
    return {
      ...defaultState,
      ...parsed,
    };
  } catch (error) {
    console.error('Erro ao carregar estado:', error);
    return defaultState;
  }
}

/**
 * Salva o estado no localStorage
 */
export function saveState(state: PersistedState): void {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serializedState);
  } catch (error) {
    console.error('Erro ao salvar estado:', error);
  }
}

/**
 * Limpa todos os dados do localStorage
 */
export function clearState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Erro ao limpar estado:', error);
  }
}

/**
 * Exporta os dados como JSON
 */
export function exportData(): string {
  const state = loadState();
  return JSON.stringify(state, null, 2);
}

/**
 * Importa dados de um JSON
 */
export function importData(jsonString: string): PersistedState {
  try {
    const parsed = JSON.parse(jsonString);
    const state: PersistedState = {
      profile: parsed.profile || null,
      fixedExpenses: parsed.fixedExpenses || [],
      temporaryExpenses: parsed.temporaryExpenses || [],
      expenses: parsed.expenses || [],
      monthlyGoals: parsed.monthlyGoals || [],
    };
    saveState(state);
    return state;
  } catch (error) {
    console.error('Erro ao importar dados:', error);
    throw new Error('Formato de dados inválido');
  }
}
