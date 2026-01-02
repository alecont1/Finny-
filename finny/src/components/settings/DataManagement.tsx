import { useState, useRef } from 'react';
import { Button, ConfirmDialog } from '../ui';
import { useStore } from '../../store/useStore';
import { exportData, importData } from '../../store/persistence';

export function DataManagement() {
  const resetAllData = useStore((state) => state.resetAllData);
  const [showConfirm, setShowConfirm] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `finny-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        importData(content);
        setImportStatus('success');
        setTimeout(() => {
          setImportStatus('idle');
          window.location.reload();
        }, 1500);
      } catch {
        setImportStatus('error');
        setTimeout(() => setImportStatus('idle'), 3000);
      }
    };
    reader.readAsText(file);

    // Reset input
    e.target.value = '';
  };

  const handleReset = () => {
    resetAllData();
    window.location.href = '/onboarding';
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white mb-4">Dados</h2>

      {/* Export */}
      <div className="p-4 bg-surface border border-white/10 rounded-xl">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💾</span>
          <div className="flex-1">
            <p className="text-white font-medium">Exportar dados</p>
            <p className="text-sm text-text-muted mt-1">
              Baixe um backup dos seus dados em formato JSON
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={handleExport} fullWidth className="mt-3">
          Exportar JSON
        </Button>
      </div>

      {/* Import */}
      <div className="p-4 bg-surface border border-white/10 rounded-xl">
        <div className="flex items-start gap-3">
          <span className="text-2xl">📤</span>
          <div className="flex-1">
            <p className="text-white font-medium">Importar dados</p>
            <p className="text-sm text-text-muted mt-1">
              Restaure um backup anterior. Isso substituirá todos os dados atuais.
            </p>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="hidden"
        />
        <Button
          variant="outline"
          onClick={handleImport}
          fullWidth
          className="mt-3"
        >
          {importStatus === 'success'
            ? '✓ Importado com sucesso!'
            : importStatus === 'error'
              ? '✗ Erro ao importar'
              : 'Importar JSON'
          }
        </Button>
      </div>

      {/* Reset */}
      <div className="p-4 bg-danger/10 border border-danger/30 rounded-xl">
        <div className="flex items-start gap-3">
          <span className="text-2xl">⚠️</span>
          <div className="flex-1">
            <p className="text-white font-medium">Limpar todos os dados</p>
            <p className="text-sm text-text-muted mt-1">
              Remove permanentemente todos os seus dados. Esta ação não pode ser desfeita.
            </p>
          </div>
        </div>
        <Button
          variant="danger"
          onClick={() => setShowConfirm(true)}
          fullWidth
          className="mt-3"
        >
          Limpar dados
        </Button>
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleReset}
        title="Limpar todos os dados?"
        message="Todos os seus dados serão apagados permanentemente. Você voltará para a tela inicial."
        confirmText="Sim, limpar tudo"
        cancelText="Cancelar"
        variant="danger"
      />
    </div>
  );
}
