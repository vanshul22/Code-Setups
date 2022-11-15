import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// Importing context here...
import HomeContextState from './Context/HomeContext/HomeContextState';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HomeContextState>
      <App />
    </HomeContextState>
  </React.StrictMode>
);