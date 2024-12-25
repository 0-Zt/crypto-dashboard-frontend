import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

// Cargar la aplicación de manera diferida
const App = React.lazy(() => import('./App'));

// Agregar un componente de carga
const LoadingFallback = () => (
  <div style={{
    height: '100vh',
    background: 'linear-gradient(110deg, #0f172a 0%, #1e293b 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }}>
    <div style={{
      background: 'linear-gradient(to right, #818cf8, #c084fc)',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      color: 'transparent',
      fontSize: '1.5rem',
      fontWeight: 600
    }}>
      Crypto Analytics
    </div>
  </div>
);

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <React.Suspense fallback={<LoadingFallback />}>
      <App />
    </React.Suspense>
  </React.StrictMode>
);
