import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { ModelProvider } from './hooks/modelProvider.tsx';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ModelProvider>
      <App />
    </ModelProvider>
  </React.StrictMode>
);
