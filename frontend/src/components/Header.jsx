import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Header.css'; 

const Header = () => {
  const location = useLocation(); 

  const getNavLinkClass = (path) => {
    if (path === '/') {
      return location.pathname === '/' ? 'active-link' : '';
    }
    return location.pathname.startsWith(path) ? 'active-link' : '';
  };

  return (
    <header className="header">
      <div className="logo-container">
        <img src="/assets/mamaloo-logo.png" alt="Mamaloo Pousada" className="logo" />
      </div>
      <nav className="nav">
        <ul className="nav-list">
         
          <li><Link to="/" className={getNavLinkClass('/')}>Home</Link></li>
          <li><Link to="/quartos" className={getNavLinkClass('/quartos')}>Quartos</Link></li>
          <li><Link to="/atracoes" className={getNavLinkClass('/atracoes')}>Atrações</Link></li>
          <li><Link to="/avaliacoes" className={getNavLinkClass('/avaliacoes')}>Avaliações</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;