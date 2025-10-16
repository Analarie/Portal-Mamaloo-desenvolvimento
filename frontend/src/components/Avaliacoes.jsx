import React, { useEffect, useState } from 'react';
import { URL_API } from '../Api'; 
import '../styles/Avaliacoes.css';

function Avaliacoes() {
  const [comentarios, setComentarios] = useState([]);
  const [novoComentarioTexto, setNovoComentarioTexto] = useState(''); 
  const [nomeUsuario, setNomeUsuario] = useState(''); 
  const [dataComentario, setDataComentario] = useState(() => { 
    const hoje = new Date();
    return hoje.toISOString().slice(0, 10);
  });

  
  const formatarData = (dataString) => {
    if (!dataString) return '';
    const date = new Date(dataString);
    
    if (isNaN(date.getTime())) {
      return dataString; 
    }
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0'); 
    const ano = date.getFullYear();
    return `${dia}/${mes}/${ano}`;
  };

  async function fetchComentarios() {
    try {
      const response = await fetch(`${URL_API}/avaliacoes`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      const formattedData = data.map(item => ({
        idavaliacao: item.idavaliacao,
        nome: item.nomeavaliacao,
        texto: item.comentarioavaliacao,
        data: item.dataavaliacao,
        resposta: item.respostaavaliacao,
      }));
      
      
      const sortedComentarios = formattedData.sort((a, b) => {
        const dateA = new Date(a.data);
        const dateB = new Date(b.data);
        return dateB.getTime() - dateA.getTime();
      });
      
      setComentarios(sortedComentarios);
    } catch (error) {
      console.error('Erro ao buscar avaliações:', error);
      setComentarios([]); 
    }
  }

  useEffect(() => {
    fetchComentarios();
  }, []);

  const enviarComentario = async () => {
    if (!novoComentarioTexto.trim()) return;
    
    const payload = {
      nomeavaliacao: nomeUsuario.trim() || 'Anônimo',
      comentarioavaliacao: novoComentarioTexto.trim(),
      dataavaliacao: dataComentario, 
      respostaavaliacao: null, 
    };

    try {
      const response = await fetch(`${URL_API}/avaliacoes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify(payload), 
      });

      if (!response.ok) {
        let errorBody = await response.text();
        try { errorBody = JSON.parse(errorBody).detail || errorBody; } catch (e) {}
        throw new Error(`HTTP error! status: ${response.status}. Detalhes: ${errorBody}`);
      }

      const responseData = await response.json();
      
      const newComment = {
        idavaliacao: responseData.idavaliacao,
        nome: responseData.nomeavaliacao,
        texto: responseData.comentarioavaliacao,
        data: responseData.dataavaliacao,
        resposta: responseData.respostaavaliacao,
      };
      
      setComentarios(prev => [newComment, ...prev]); 
      
      setNovoComentarioTexto('');
      setNomeUsuario('');
      setDataComentario(new Date().toISOString().slice(0, 10)); 
    } catch (error) {
      console.error('Erro ao enviar avaliação:', error);
      alert(`Erro ao enviar avaliação: ${error.message || 'Ocorreu um erro.'}`);
    }
  };

  return (
    <>
      <div className="avaliacoes-container">
        <h2>Avaliações de hóspedes</h2>

        <div className="formulario-avaliacao">
          <div className="inputs-superiores">
            <input
              type="text"
              placeholder="Seu nome"
              value={nomeUsuario}
              onChange={e => setNomeUsuario(e.target.value)}
              className="input-nome"
            />
            <input
              type="date"
              value={dataComentario}
              onChange={e => setDataComentario(e.target.value)}
              className="input-data"
            />
          </div>

          <div className="input-comentario-container">
            <input
              type="text"
              placeholder="Escreva uma avaliação"
              value={novoComentarioTexto}
              onChange={e => setNovoComentarioTexto(e.target.value)}
              className="input-comentario"
            />
            <button onClick={enviarComentario}>➤</button>
          </div>
        </div>

        <div className="comentarios-lista">
          {comentarios.length > 0 ? ( 
            comentarios.map((c) => (
              <div key={c.idavaliacao} className="comentario-box"> 
                <div className="comentario-topo">
                  <img
                    src="/assets/icones/mamaloo-icone-perfil.png"
                    alt="avatar"
                  />
                  <strong>{c.nome}</strong>
                  <span className="data-comentario">{formatarData(c.data)}</span> 
                </div>
                <p>{c.texto}</p>
                {typeof c.resposta === 'string' && c.resposta.trim() !== '' && (
                  <div className="resposta-box">
                    <div className="resposta-header">
                      <img
                        src="/assets/icones/mamaloo-icone-perfil.png"
                        alt="Logo Mamaloo"
                        className="resposta-logo"
                      />
                      <strong className="resposta-nome">Mamaloo Pousada</strong>
                    </div>
                    <p className="resposta-texto">{c.resposta}</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="mensagem-sem-comentarios">Nenhum comentário disponível.</p>
          )}
        </div>
      </div>
    </>
  );
}

export default Avaliacoes;