import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/globals.css';

// Error handling for debugging
console.log('Finny app starting...');

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
    rootElement.innerHTML = '<div style="color: white; padding: 20px; text-align: center;"><h1>Erro ao carregar</h1><p>Verifique o console para mais detalhes.</p></div>';
  }
}
