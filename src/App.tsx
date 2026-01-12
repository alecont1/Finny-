import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { useProfile } from './hooks/useProfile';
import { useSubscription } from './hooks/useSubscription';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { supabase } from './lib/supabase';

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

function TrialBanner({ daysRemaining }: { daysRemaining: number | null }) {
  if (daysRemaining === null || daysRemaining > 3) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-yellow-500 to-orange-500 text-black text-center py-2 text-sm font-medium">
      {daysRemaining <= 0 ? (
        <span>Seu trial expirou! <a href="/checkout" className="underline font-bold">Assine agora</a></span>
      ) : daysRemaining === 1 ? (
        <span>Último dia do trial! <a href="/checkout" className="underline font-bold">Assine agora</a></span>
      ) : (
        <span>{daysRemaining} dias restantes no trial. <a href="/checkout" className="underline font-bold">Assinar</a></span>
      )}
    </div>
  );
}

function AppContent() {
  const { profile, loading: profileLoading, error: profileError, refetch: refetchProfile } = useProfile();
  const { subscription } = useSubscription();
  const [showAddExpense, setShowAddExpense] = useState(false);
  const location = useLocation();

  // Verificar se completou onboarding - só considera false se profile foi carregado com sucesso
  const hasCompletedOnboarding = profile?.has_completed_onboarding ?? false;

  // Páginas sem bottom nav
  const pagesWithoutNav = ['/onboarding', '/checkout'];
  const showBottomNav = hasCompletedOnboarding && !pagesWithoutNav.includes(location.pathname);

  // Show trial banner
  const showTrialBanner = subscription?.subscriptionStatus === 'trialing' &&
                          subscription.daysRemaining !== null &&
                          subscription.daysRemaining <= 3;

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

  // Se houve erro ao carregar profile, mostrar tela de erro com retry
  if (profileError || (!profile && !profileLoading)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 p-6 text-center">
          <div className="text-4xl">⚠️</div>
          <h2 className="text-xl font-semibold text-text">Erro ao carregar perfil</h2>
          <p className="text-text-muted">Não foi possível carregar seus dados. Tente novamente.</p>
          <button
            onClick={() => refetchProfile()}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  // Redirecionar para onboarding se não completou (exceto se estiver no checkout)
  // Só redireciona se profile foi carregado com sucesso
  if (profile && !hasCompletedOnboarding && location.pathname !== '/onboarding' && location.pathname !== '/checkout') {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <div className={`min-h-screen bg-background ${showTrialBanner ? 'pt-10' : ''}`}>
      {showTrialBanner && <TrialBanner daysRemaining={subscription?.daysRemaining ?? null} />}

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
  const { subscription, loading: subscriptionLoading, needsSubscription, refetch } = useSubscription();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [checkoutCompleted, setCheckoutCompleted] = useState(false);

  // Verificar se voltou do checkout com sucesso
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId && user && !checkoutCompleted) {
      // Marcar como checkout completado para evitar loops
      setCheckoutCompleted(true);

      // Atualizar status da assinatura no banco
      const updateSubscription = async () => {
        try {
          await supabase
            .from('profiles')
            .update({
              subscription_status: 'trialing',
              plan: 'premium',
              trial_ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
            })
            .eq('id', user.id);

          // Refetch subscription data
          refetch();
        } catch (error) {
          console.error('Error updating subscription:', error);
        }
      };

      updateSubscription();
    }
  }, [sessionId, user, checkoutCompleted, refetch]);

  // Loading do auth
  if (loading || (user && subscriptionLoading)) {
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

  // Se autenticado mas sem assinatura, redirecionar para checkout
  // Exceto se já estiver na página de checkout ou se voltou do checkout com session_id
  if (user && needsSubscription() && location.pathname !== '/checkout' && !sessionId && !checkoutCompleted) {
    return <Navigate to="/checkout?new=true" replace />;
  }

  // Se autenticado e tentando acessar login/signup, redirecionar
  if (user && (location.pathname === '/login' || location.pathname === '/signup')) {
    return <Navigate to="/dashboard" replace />;
  }

  // Se trial expirou e não está ativo, redirecionar para checkout
  if (user && subscription && !subscription.isActive && subscription.subscriptionStatus !== 'none' && location.pathname !== '/checkout') {
    return <Navigate to="/checkout" replace />;
  }

  // Usuário autenticado com assinatura ativa - mostrar app
  return (
    <ProtectedRoute>
      <AppContent />
    </ProtectedRoute>
  );
}

export default App;
