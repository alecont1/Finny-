import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProfileSettings } from '../components/settings/ProfileSettings';
import { FixedExpenses } from '../components/settings/FixedExpenses';
import { TemporaryExpenses } from '../components/settings/TemporaryExpenses';
import { DataManagement } from '../components/settings/DataManagement';

type SettingsTab = 'profile' | 'fixed' | 'temporary' | 'data';

const tabs: { id: SettingsTab; label: string; icon: string }[] = [
  { id: 'profile', label: 'Renda', icon: '💵' },
  { id: 'fixed', label: 'Fixas', icon: '📋' },
  { id: 'temporary', label: 'Parcelas', icon: '📅' },
  { id: 'data', label: 'Dados', icon: '💾' },
];

export function Settings() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileSettings />;
      case 'fixed':
        return <FixedExpenses />;
      case 'temporary':
        return <TemporaryExpenses />;
      case 'data':
        return <DataManagement />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-surface/50 border-b border-white/10 px-4 py-4 sticky top-0 z-30 backdrop-blur-sm">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 -ml-2 text-text-muted hover:text-white hover:bg-white/10 rounded-full transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-xl font-bold text-white">Configurações</h1>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-lg mx-auto px-4 pt-4">
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all
                ${activeTab === tab.id
                  ? 'bg-primary text-white'
                  : 'bg-white/5 text-text-muted hover:bg-white/10 hover:text-white'
                }
              `}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="fade-in">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
