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
  console.error("Application crashed:", error);
  root.render(
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Something went wrong.</h1>
      <p>Please check the console for more details.</p>
    </div>
  );
}