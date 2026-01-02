import { useMemo } from 'react';
import { useStore } from '../store/useStore';
import { getCurrentMonth, getCurrentYear } from '../utils/formatters';

export function useFinancials() {
  const profile = useStore((state) => state.profile);
  const fixedExpenses = useStore((state) => state.fixedExpenses);
  const temporaryExpenses = useStore((state) => state.temporaryExpenses);
  const expenses = useStore((state) => state.expenses);
  const monthlyGoals = useStore((state) => state.monthlyGoals);

  /**
   * Retorna a renda total (salário + outras rendas)
   */
  const getTotalIncome = useMemo(() => {
    if (!profile) return 0;
    return profile.salary + (profile.otherIncome || 0);
  }, [profile]);

  /**
   * Retorna o total de despesas fixas ativas
   */
  const getTotalFixedExpenses = useMemo(() => {
    return fixedExpenses
      .filter((expense) => expense.isActive)
      .reduce((total, expense) => total + expense.amount, 0);
  }, [fixedExpenses]);

  /**
   * Retorna despesas temporárias para um mês/ano específico
   */
  const getTemporaryExpensesForMonth = (month: number, year: number): number => {
    return temporaryExpenses
      .filter((expense) => {
        const startDate = expense.startYear * 12 + expense.startMonth;
        const endDate = expense.endYear * 12 + expense.endMonth;
        const currentDate = year * 12 + month;
        return currentDate >= startDate && currentDate <= endDate;
      })
      .reduce((total, expense) => total + expense.amount, 0);
  };

  /**
   * Retorna gastos variáveis para um mês/ano específico
   */
  const getVariableExpensesForMonth = (month: number, year: number): number => {
    return expenses
      .filter((expense) => expense.month === month && expense.year === year)
      .reduce((total, expense) => total + expense.amount, 0);
  };

  /**
   * Retorna gastos de lazer para um mês/ano específico
   */
  const getLeisureExpensesForMonth = (month: number, year: number): number => {
    return expenses
      .filter(
        (expense) =>
          expense.month === month &&
          expense.year === year &&
          expense.category === 'lazer'
      )
      .reduce((total, expense) => total + expense.amount, 0);
  };

  /**
   * Retorna gastos por categoria para um mês/ano específico
   */
  const getExpensesByCategory = (month: number, year: number) => {
    const monthExpenses = expenses.filter(
      (expense) => expense.month === month && expense.year === year
    );

    const byCategory: Record<string, number> = {};
    monthExpenses.forEach((expense) => {
      byCategory[expense.category] = (byCategory[expense.category] || 0) + expense.amount;
    });

    return byCategory;
  };

  /**
   * Retorna o balanço mensal (quanto sobra)
   */
  const getMonthlyBalance = (month: number, year: number): number => {
    const income = getTotalIncome;
    const fixed = getTotalFixedExpenses;
    const temporary = getTemporaryExpensesForMonth(month, year);
    const variable = getVariableExpensesForMonth(month, year);

    return income - fixed - temporary - variable;
  };

  /**
   * Retorna o valor disponível para o mês (antes de gastos variáveis)
   */
  const getAvailableForMonth = (month: number, year: number): number => {
    const income = getTotalIncome;
    const fixed = getTotalFixedExpenses;
    const temporary = getTemporaryExpensesForMonth(month, year);

    return income - fixed - temporary;
  };

  /**
   * Retorna quanto sobra após meta de economia
   */
  const getAfterSavingsGoal = (month: number, year: number): number => {
    const available = getAvailableForMonth(month, year);
    const savingsGoal = profile?.savingsGoal || 0;
    return available - savingsGoal;
  };

  /**
   * Retorna a projeção anual de economia
   */
  const getAnnualProjection = (): number => {
    const savingsGoal = profile?.savingsGoal || 0;
    return savingsGoal * 12;
  };

  /**
   * Retorna a meta do mês ou a meta padrão do perfil
   */
  const getMonthlyGoal = (month: number, year: number): number => {
    const goal = monthlyGoals.find((g) => g.month === month && g.year === year);
    if (goal) return goal.targetAmount;
    return profile?.savingsGoal || 0;
  };

  /**
   * Retorna quanto ainda pode gastar de lazer no mês
   */
  const getRemainingLeisureBudget = (month: number, year: number): number => {
    const budget = profile?.leisureBudget || 0;
    const spent = getLeisureExpensesForMonth(month, year);
    return budget - spent;
  };

  /**
   * Retorna a porcentagem do orçamento de lazer usado
   */
  const getLeisureBudgetPercentage = (month: number, year: number): number => {
    const budget = profile?.leisureBudget || 0;
    if (budget === 0) return 0;
    const spent = getLeisureExpensesForMonth(month, year);
    return Math.min((spent / budget) * 100, 100);
  };

  /**
   * Retorna estatísticas do mês atual
   */
  const getCurrentMonthStats = () => {
    const month = getCurrentMonth();
    const year = getCurrentYear();

    return {
      income: getTotalIncome,
      fixedExpenses: getTotalFixedExpenses,
      temporaryExpenses: getTemporaryExpensesForMonth(month, year),
      variableExpenses: getVariableExpensesForMonth(month, year),
      leisureExpenses: getLeisureExpensesForMonth(month, year),
      balance: getMonthlyBalance(month, year),
      available: getAvailableForMonth(month, year),
      savingsGoal: getMonthlyGoal(month, year),
      leisureBudget: profile?.leisureBudget || 0,
      leisureRemaining: getRemainingLeisureBudget(month, year),
      leisurePercentage: getLeisureBudgetPercentage(month, year),
    };
  };

  /**
   * Retorna resumo anual
   */
  const getAnnualSummary = (year: number) => {
    let totalIncome = 0;
    let totalExpenses = 0;
    let totalSaved = 0;
    const monthlyData = [];

    for (let month = 1; month <= 12; month++) {
      const income = getTotalIncome;
      const fixed = getTotalFixedExpenses;
      const temporary = getTemporaryExpensesForMonth(month, year);
      const variable = getVariableExpensesForMonth(month, year);
      const expenses = fixed + temporary + variable;
      const balance = income - expenses;

      totalIncome += income;
      totalExpenses += expenses;
      totalSaved += balance;

      monthlyData.push({
        month,
        income,
        expenses,
        balance,
        goal: getMonthlyGoal(month, year),
      });
    }

    return {
      year,
      totalIncome,
      totalExpenses,
      totalSaved,
      averageMonthlyExpenses: totalExpenses / 12,
      averageMonthlySaved: totalSaved / 12,
      monthlyData,
    };
  };

  return {
    // Valores básicos
    getTotalIncome,
    getTotalFixedExpenses,

    // Funções para mês específico
    getTemporaryExpensesForMonth,
    getVariableExpensesForMonth,
    getLeisureExpensesForMonth,
    getExpensesByCategory,
    getMonthlyBalance,
    getAvailableForMonth,
    getAfterSavingsGoal,
    getMonthlyGoal,
    getRemainingLeisureBudget,
    getLeisureBudgetPercentage,

    // Estatísticas
    getCurrentMonthStats,
    getAnnualSummary,
    getAnnualProjection,
  };
}
