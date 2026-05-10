import React from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider } from '@clerk/react';
import App from './App.jsx';
import './index.css';

const CLERK_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const root = ReactDOM.createRoot(document.getElementById('root'));

if (!CLERK_KEY) {
  root.render(
    <div style={{ padding: '2rem', color: 'red', background: '#ffebee', fontFamily: 'sans-serif' }}>
      <h1>Configuration Error</h1>
      <p>Missing <code>VITE_CLERK_PUBLISHABLE_KEY</code> in environment variables.</p>
      <p>Please create a <code>.env</code> file in the <code>frontend/</code> directory with your Clerk publishable key and restart the dev server.</p>
    </div>
  );
} else {
  root.render(
    <React.StrictMode>
      <ClerkProvider publishableKey={CLERK_KEY} afterSignOutUrl="/">
        <App />
      </ClerkProvider>
    </React.StrictMode>
  );
}
