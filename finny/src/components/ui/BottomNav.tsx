import { useNavigate, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/dashboard', label: 'Início', icon: '🏠' },
  { path: '/expenses', label: 'Gastos', icon: '📜' },
  { path: '/annual', label: 'Anual', icon: '📊' },
  { path: '/settings', label: 'Config', icon: '⚙️' },
];

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface/95 backdrop-blur-md border-t border-white/10 safe-area-bottom z-40">
      <div className="max-w-lg mx-auto flex justify-around">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`
                flex flex-col items-center py-2 px-4 transition-colors
                ${isActive ? 'text-primary' : 'text-text-muted hover:text-white'}
              `}
            >
              <span className="text-xl mb-0.5">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
