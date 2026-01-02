import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { useFinancials } from '../hooks/useFinancials';
import { MonthSelector } from '../components/dashboard/MonthSelector';
import { SummaryCard } from '../components/dashboard/SummaryCard';
import { LeisureBudgetCard } from '../components/dashboard/LeisureBudgetCard';
import { CategoryBreakdown } from '../components/dashboard/CategoryBreakdown';
import { QuickStats } from '../components/dashboard/QuickStats';
import { formatMonthYear, getCurrentMonth, getCurrentYear } from '../utils/formatters';

interface DashboardProps {
  onOpenAddExpense: () => void;
}

export function Dashboard({ onOpenAddExpense }: DashboardProps) {
  const navigate = useNavigate();
  const profile = useStore((state) => state.profile);

  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [selectedYear] = useState(getCurrentYear());

  const {
    getTotalIncome,
    getTotalFixedExpenses,
    getTemporaryExpensesForMonth,
    getVariableExpensesForMonth,
    getLeisureExpensesForMonth,
    getExpensesByCategory,
    getMonthlyGoal,
  } = useFinancials();

  // Dados do mês selecionado
  const income = getTotalIncome;
  const fixedExpenses = getTotalFixedExpenses;
  const temporaryExpenses = getTemporaryExpensesForMonth(selectedMonth, selectedYear);
  const variableExpenses = getVariableExpensesForMonth(selectedMonth, selectedYear);
  const leisureExpenses = getLeisureExpensesForMonth(selectedMonth, selectedYear);
  const expensesByCategory = getExpensesByCategory(selectedMonth, selectedYear);
  const savingsGoal = getMonthlyGoal(selectedMonth, selectedYear);
  const leisureBudget = profile?.leisureBudget || 0;

  // Quick stats
  const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
  const today = new Date();
  const daysElapsed = selectedMonth === getCurrentMonth() && selectedYear === getCurrentYear()
    ? today.getDate()
    : daysInMonth;
  const averageDaily = daysElapsed > 0 ? variableExpenses / daysElapsed : 0;
  const projectedMonthly = averageDaily * daysInMonth;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-surface/50 border-b border-white/10 px-4 py-4 sticky top-0 z-30 backdrop-blur-sm">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div>
            <p className="text-sm text-text-muted">Olá, {profile?.name || 'usuário'}!</p>
            <h1 className="text-xl font-bold text-white">
              {formatMonthYear(selectedMonth, selectedYear)}
            </h1>
          </div>
          <button
            onClick={() => navigate('/settings')}
            className="p-2 text-text-muted hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-lg mx-auto px-4 pt-4">
        {/* Month selector */}
        <MonthSelector
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onMonthChange={setSelectedMonth}
        />

        {/* Summary */}
        <SummaryCard
          income={income}
          fixedExpenses={fixedExpenses}
          temporaryExpenses={temporaryExpenses}
          variableExpenses={variableExpenses}
          savingsGoal={savingsGoal}
        />

        {/* Leisure budget */}
        {leisureBudget > 0 && (
          <LeisureBudgetCard
            spent={leisureExpenses}
            budget={leisureBudget}
          />
        )}

        {/* Quick stats */}
        {variableExpenses > 0 && (
          <QuickStats
            daysInMonth={daysInMonth}
            daysElapsed={daysElapsed}
            averageDaily={averageDaily}
            projectedMonthly={projectedMonthly}
          />
        )}

        {/* Category breakdown */}
        <CategoryBreakdown expensesByCategory={expensesByCategory} />

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            onClick={() => navigate('/expenses')}
            className="p-4 bg-surface border border-white/10 rounded-xl text-left hover:bg-surface-hover transition-colors"
          >
            <span className="text-2xl mb-2 block">📜</span>
            <p className="text-white font-medium">Ver histórico</p>
            <p className="text-xs text-text-muted">Todos os gastos</p>
          </button>
          <button
            onClick={() => navigate('/annual')}
            className="p-4 bg-surface border border-white/10 rounded-xl text-left hover:bg-surface-hover transition-colors"
          >
            <span className="text-2xl mb-2 block">📊</span>
            <p className="text-white font-medium">Visão anual</p>
            <p className="text-xs text-text-muted">Projeção {selectedYear}</p>
          </button>
        </div>
      </div>

      {/* Floating button */}
      <button
        onClick={onOpenAddExpense}
        className="btn-floating"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
}
