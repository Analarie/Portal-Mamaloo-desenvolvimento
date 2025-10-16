import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PaginaPrincipal from "./components/paginaPrincipal";
import Avaliacoes from "./components/Avaliacoes";
import Atracoes from "./components/Atracoes";
import Administrador from "./components/Administrador";
import Login from "./components/Login"; 
import ProtecaoRotas from './ProtecaoRotas';
import Quartos from "./components/Quartos";
import AvaliacoesAdm from "./components/AvaliacoesAdm"; 

const Rotas = () => {
  return (
    <Routes>
      <Route path="/" element={<PaginaPrincipal />} />
      <Route path="/quartos" element={<Quartos />} />
      <Route path="/avaliacoes" element={<Avaliacoes />} />
      <Route path="/atracoes" element={<Atracoes />} />

      <Route path="/adm/login" element={<Login />} />
      <Route 
        path="/adm/*" 
        element={
          <ProtecaoRotas>
            <Administrador />
          </ProtecaoRotas>
        } 
      />
      <Route 
        path="/adm/avaliacoesadm" 
        element={
          <ProtecaoRotas>
            <AvaliacoesAdm />
          </ProtecaoRotas>
        } 
      />
    </Routes>
  );
};

export default Rotas;
