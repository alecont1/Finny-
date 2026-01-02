import { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useStore } from './store/useStore';
import { Onboarding } from './pages/Onboarding';
import { Dashboard } from './pages/Dashboard';
import { ExpenseHistory } from './pages/ExpenseHistory';
import { AnnualView } from './pages/AnnualView';
import { Settings } from './pages/Settings';
import { AddExpenseModal } from './components/expenses/AddExpenseModal';
import { BottomNav } from './components/ui';

function App() {
  const profile = useStore((state) => state.profile);
  const hasCompletedOnboarding = profile?.hasCompletedOnboarding ?? false;
  const [showAddExpense, setShowAddExpense] = useState(false);
  const location = useLocation();

  // Mostrar bottom nav em todas as páginas exceto onboarding
  const showBottomNav = hasCompletedOnboarding && location.pathname !== '/onboarding';

  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route
          path="/"
          element={
            hasCompletedOnboarding ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/onboarding" replace />
            )
          }
        />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route
          path="/dashboard"
          element={
            <Dashboard onOpenAddExpense={() => setShowAddExpense(true)} />
          }
        />
        <Route path="/annual" element={<AnnualView />} />
        <Route
          path="/expenses"
          element={
            <ExpenseHistory onOpenAddExpense={() => setShowAddExpense(true)} />
          }
        />
        <Route path="/settings" element={<Settings />} />
      </Routes>

      {/* Bottom Navigation */}
      {showBottomNav && <BottomNav />}

      {/* Add Expense Modal */}
      <AddExpenseModal
        isOpen={showAddExpense}
        onClose={() => setShowAddExpense(false)}
      />
    </div>
  );
}

export default App;
