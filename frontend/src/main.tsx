import React from 'react';
import ReactDOM from 'react-dom/client';
import { MsalProvider } from '@msal/react';
import App from './App';
import './styles/globals.css';
import { msalConfig } from './config/msalConfig';
import { PublicClientApplication } from '@msal/browser';

const msalInstance = new PublicClientApplication(msalConfig);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MsalProvider instance={msalInstance}>
      <App />
    </MsalProvider>
  </React.StrictMode>
);
