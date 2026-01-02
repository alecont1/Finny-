// Categorias disponíveis
export type Category =
  | 'lazer'
  | 'alimentacao'
  | 'transporte'
  | 'compras'
  | 'saude'
  | 'educacao'
  | 'moradia'
  | 'veiculo'
  | 'outros';

// Informações de categoria
export interface CategoryInfo {
  id: Category;
  name: string;
  icon: string;
  color: string;
}

// Perfil do usuário
export interface UserProfile {
  id: string;
  name: string;
  createdAt: string;
  hasCompletedOnboarding: boolean;

  // Renda
  salary: number;
  otherIncome: number;
  payDay: number;
  hasAdvance: boolean;
  advanceDay: number;

  // Metas
  savingsGoal: number;
  leisureBudget: number;
}

// Despesa fixa
export interface FixedExpense {
  id: string;
  name: string;
  amount: number;
  category: Category;
  isActive: boolean;
}

// Despesa temporária (parcelas)
export interface TemporaryExpense {
  id: string;
  name: string;
  amount: number;
  startMonth: number;
  startYear: number;
  endMonth: number;
  endYear: number;
  category: Category;
}

// Gasto variável (registro diário)
export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: Category;
  date: string;
  month: number;
  year: number;
  createdAt: string;
}

// Meta mensal
export interface MonthlyGoal {
  month: number;
  year: number;
  targetAmount: number;
}

// Estado global da aplicação
export interface AppState {
  profile: UserProfile | null;
  fixedExpenses: FixedExpense[];
  temporaryExpenses: TemporaryExpense[];
  expenses: Expense[];
  monthlyGoals: MonthlyGoal[];

  // Actions
  setProfile: (profile: UserProfile) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  addFixedExpense: (expense: Omit<FixedExpense, 'id'>) => void;
  updateFixedExpense: (id: string, updates: Partial<FixedExpense>) => void;
  removeFixedExpense: (id: string) => void;
  addTemporaryExpense: (expense: Omit<TemporaryExpense, 'id'>) => void;
  removeTemporaryExpense: (id: string) => void;
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
  removeExpense: (id: string) => void;
  setMonthlyGoal: (goal: MonthlyGoal) => void;
  resetAllData: () => void;
}
