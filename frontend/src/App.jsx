import React from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Rotas from './Rotas';

function AppWrapper() {
  const location = useLocation();

  // Verifica se a rota atual começa com /adm
  const isAdminRoute = location.pathname.startsWith('/adm');

  return (
    <div className="App">
      {/* Renderiza Header e Footer apenas se NÃO for rota admin */}
      {!isAdminRoute && <Header />}
      
      <Rotas />
      
      {!isAdminRoute && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
