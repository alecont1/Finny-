import { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { useProfile } from './hooks/useProfile';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Pages
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Onboarding } from './pages/Onboarding';
import { Dashboard } from './pages/Dashboard';
import { ExpenseHistory } from './pages/ExpenseHistory';
import { AnnualView } from './pages/AnnualView';
import { Settings } from './pages/Settings';
import { Checkout } from './pages/Checkout';

// Components
import { AddExpenseModal } from './components/expenses/AddExpenseModal';
import { BottomNav } from './components/ui';

function AppContent() {
  const { profile, loading: profileLoading } = useProfile();
  const [showAddExpense, setShowAddExpense] = useState(false);
  const location = useLocation();

  // Verificar se completou onboarding
  const hasCompletedOnboarding = profile?.has_completed_onboarding ?? false;

  // Páginas sem bottom nav
  const pagesWithoutNav = ['/onboarding', '/checkout'];
  const showBottomNav = hasCompletedOnboarding && !pagesWithoutNav.includes(location.pathname);

  // Loading do profile
  if (profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
          <p className="text-text-muted">Carregando...</p>
        </div>
      </div>
    );
  }

  // Redirecionar para onboarding se não completou
  if (!hasCompletedOnboarding && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

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
          element={<Dashboard onOpenAddExpense={() => setShowAddExpense(true)} />}
        />
        <Route path="/annual" element={<AnnualView />} />
        <Route
          path="/expenses"
          element={<ExpenseHistory onOpenAddExpense={() => setShowAddExpense(true)} />}
        />
        <Route path="/settings" element={<Settings />} />
        <Route path="/checkout" element={<Checkout />} />
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

function App() {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Loading do auth
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="text-5xl mb-2">💰</div>
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
        </div>
      </div>
    );
  }

  // Rotas públicas
  const publicPaths = ['/', '/login', '/signup'];
  const isPublicPath = publicPaths.includes(location.pathname);

  // Se não autenticado e em rota pública, mostrar rotas públicas
  if (!user && isPublicPath) {
    return (
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    );
  }

  // Se não autenticado e tentando acessar rota privada
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Se autenticado e tentando acessar login/signup, redirecionar
  if (user && (location.pathname === '/login' || location.pathname === '/signup')) {
    return <Navigate to="/dashboard" replace />;
  }

  // Usuário autenticado - mostrar app
  return (
    <ProtectedRoute>
      <AppContent />
    </ProtectedRoute>
  );
}

export default App;
