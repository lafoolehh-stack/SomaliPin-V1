import * as React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = createRoot(rootElement);

try {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error("Application crashed during mount:", error);
  root.render(
    <div style={{ padding: '40px', fontFamily: 'sans-serif', color: '#333' }}>
      <h1 style={{color: '#8B0000'}}>System Error</h1>
      <p>The application encountered a critical error during startup.</p>
      <pre style={{background: '#f4f4f4', padding: '10px', borderRadius: '4px', overflow: 'auto'}}>
        {error instanceof Error ? error.message : String(error)}
      </pre>
      <button onclick="window.location.reload()" style={{padding: '10px 20px', marginTop: '10px', cursor: 'pointer'}}>
        Reload Page
      </button>
    </div>
  );
}