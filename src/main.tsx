import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/globals.css';

// Global error handler
window.onerror = function(message, source, lineno, colno, error) {
  console.error('Global error:', message, source, lineno, colno, error);
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="color: white; padding: 20px; text-align: center; background: #0f0f1a; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <h1 style="color: #ef4444;">Erro ao carregar</h1>
        <p style="color: #94a3b8; margin-top: 10px;">${message}</p>
        <p style="color: #64748b; font-size: 12px; margin-top: 10px;">Linha: ${lineno}, Coluna: ${colno}</p>
      </div>
    `;
  }
  return true;
};

// Unhandled promise rejection handler
window.onunhandledrejection = function(event) {
  console.error('Unhandled promise rejection:', event.reason);
};

// Debug logging
console.log('Finny app starting...');
console.log('Environment:', {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL ? 'configured' : 'NOT SET',
  mode: import.meta.env.MODE
});

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error('Root element not found!');
} else {
  try {
    createRoot(rootElement).render(
      <StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </StrictMode>
    );
    console.log('Finny app rendered successfully');
  } catch (error) {
    console.error('Error rendering app:', error);
    rootElement.innerHTML = `
      <div style="color: white; padding: 20px; text-align: center; background: #0f0f1a; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <h1 style="color: #ef4444;">Erro ao carregar</h1>
        <p style="color: #94a3b8; margin-top: 10px;">${error instanceof Error ? error.message : 'Erro desconhecido'}</p>
      </div>
    `;
  }
}
