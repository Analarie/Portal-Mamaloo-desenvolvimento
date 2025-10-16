import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Administrador from './Administrador'; // componente principal do admin
import AvaliacoesAdm from './AvaliacoesAdm';

const AdminRotas = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="administrador" replace />} />
      <Route path="administrador" element={<Administrador />} />
      <Route path="avaliacoesadm" element={<AvaliacoesAdm />} />

    </Routes>
  );
};

export default AdminRotas;
