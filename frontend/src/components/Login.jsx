import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

const Login = () => {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
  
    try {
      // Formate os dados corretamente para OAuth2
      const formData = new FormData();
      formData.append('username', usuario);
      formData.append('password', senha);
  
      const response = await fetch('http://localhost:8025/auth/token', {
        method: 'POST',
        body: formData,
        // Não use headers Content-Type com FormData, o browser define automaticamente
        // com o boundary correto
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Credenciais inválidas');
      }
  
      const data = await response.json();
      
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('token_type', data.token_type);
      
      navigate('/adm/administrador');
    } catch (err) {
      setError(err.message || 'Erro ao conectar com o servidor');
      console.error('Detalhes do erro:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='loginPage'>
      <form className="login-card" onSubmit={handleLogin}>
        <img src="/assets/mamaloo-logo.png" alt="Logo" className="login-logo" />
        <h2>Login Administrativo</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <input
          type="text"
          placeholder="Usuário"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          required
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Carregando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
};

export default Login;