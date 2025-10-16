import React from 'react';
import { Navigate } from 'react-router-dom';

const useAuth = () => {
  return !!localStorage.getItem('token');
};

const ProtecaoRotas = ({ children }) => {
  const isAuthenticated = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/adm/login" replace />;
  }

  return children;
};

export default ProtecaoRotas;
