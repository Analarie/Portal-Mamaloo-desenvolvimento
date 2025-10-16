import React from "react";
import { Link, useNavigate } from "react-router-dom";
import '../styles/HeaderAdm.css'; 

function HeaderAdm() {
  const navigate = useNavigate();

  const realizarLogout = () => {
    localStorage.removeItem('token');
    navigate('/adm/login');
  };

  return (
    <header className="header-adm">
      <img
        src="/assets/mamaloo-logo.png"
        alt="Logo Mamaloo Pousada"
        className="logo-adm"
      />
      <nav className="nav-adm">
        <Link  className="nav-link-adm" to="/adm/administrador">Editar</Link>
        <Link  className="nav-link-adm" to="/adm/avaliacoesadm">Avaliações</Link>
        <a href="#" className="nav-link-adm" onClick={realizarLogout}>
          Sair
        </a>
      </nav>
    </header>
  );
}

export default HeaderAdm;
