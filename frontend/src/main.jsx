import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

// Remover a importação do index.css caso tenha removido esse arquivo
// import './index.css'; // Esta linha pode ser apagada se não houver mais necessidade do index.css

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
