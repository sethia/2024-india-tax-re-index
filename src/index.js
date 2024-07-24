import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Suppress specific warnings
const originalError = console.error;
console.error = (...args) => {
  if (args[0].includes('Warning: XAxis:') || 
      args[0].includes('Warning: YAxis:') || 
      args[0].includes('Warning: ReferenceLine:')) {
    return;
  }
  originalError.call(console, ...args);
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);