import React, { useEffect, useState } from 'react';
import '../styles/AvaliacoesAdm.css';
import HeaderAdm from './HeaderAdm';
import { URL_API } from '../Api'; 

function AvaliacoesAdm() {
  const [comentarios, setComentarios] = useState([]);
  const [respostaAbertaId, setRespostaAbertaId] = useState(null); 
  const [respostaTexto, setRespostaTexto] = useState('');

  
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (token) {
      return {
        'Authorization': `Bearer ${token}` 
      };
    }
    return {}; 
  };

 
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
      const response = await fetch(`${URL_API}/avaliacoes`, { headers: getAuthHeaders() }); 
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      const formattedComentarios = data.map(item => ({
        id: item.idavaliacao, 
        nome: item.nomeavaliacao,
        texto: item.comentarioavaliacao,
        data: item.dataavaliacao, 
        resposta: item.respostaavaliacao || null, 
      }));
      
      const sortedComentarios = formattedComentarios.sort((a, b) => {
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

  const handleToggleResposta = (id) => {
    if (respostaAbertaId === id) { 
      setRespostaAbertaId(null);
      setRespostaTexto(''); 
    } else { 
      setRespostaAbertaId(id);
      const comentarioAtual = comentarios.find(c => c.id === id);
      if (comentarioAtual) {
        setRespostaTexto(comentarioAtual.resposta || ''); 
      }
    }
  };

  const deletarComentario = async (idToDelete) => {
    if (!window.confirm("Tem certeza que deseja deletar esta avaliação?")) return;

    try {
      const response = await fetch(`${URL_API}/avaliacoes/${idToDelete}`, { 
        method: 'DELETE',
        headers: getAuthHeaders(), 
      });
      if (!response.ok && response.status !== 204) { 
        let errorBody = await response.text();
        try { errorBody = JSON.parse(errorBody).detail || errorBody; } catch (e) {}
        throw new Error(`HTTP error! status: ${response.status}. Detalhes: ${errorBody}`);
      }

      alert("Avaliação deletada com sucesso!");
      fetchComentarios(); 
    } catch (error) {
      console.error('Erro ao deletar avaliação:', error);
      alert('Erro ao deletar avaliação. Verifique o console.');
    }
  };

  const responderComentario = async (idToRespond) => {
    const novaResposta = respostaTexto.trim();
    if (!novaResposta && !comentarios.find(c => c.id === idToRespond)?.resposta) {
        alert("A resposta não pode ser vazia.");
        return; 
    }

    try {
      const comentarioOriginal = comentarios.find(c => c.id === idToRespond);
      if (!comentarioOriginal) {
        alert("Erro: Comentário não encontrado.");
        return;
      }

      const payload = {
        idavaliacao: comentarioOriginal.id,
        nomeavaliacao: comentarioOriginal.nome,
        comentarioavaliacao: comentarioOriginal.comentarioavaliacao || comentarioOriginal.texto,
        dataavaliacao: comentarioOriginal.data, // Envia a data original no formato da API
        respostaavaliacao: novaResposta === '' ? null : novaResposta, 
      };

      const response = await fetch(`${URL_API}/avaliacoes/${idToRespond}`, { 
        method: 'PUT', 
        headers: {
          ...getAuthHeaders(), 
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify(payload), 
      });

      if (!response.ok) {
        let errorBody = await response.text();
        try { errorBody = JSON.parse(errorBody).detail || errorBody; } catch (e) {}
        throw new Error(`HTTP error! status: ${response.status}. Detalhes: ${errorBody}`);
      }

      const updatedData = await response.json(); 
      
      const updatedComentario = {
        id: updatedData.idavaliacao,
        nome: updatedData.nomeavaliacao,
        texto: updatedData.comentarioavaliacao,
        data: updatedData.dataavaliacao,
        resposta: updatedData.respostaavaliacao,
      };

      fetchComentarios(); 

      setRespostaAbertaId(null); 
      setRespostaTexto(''); 
      alert("Resposta atualizada com sucesso!"); 

    } catch (error) {
      console.error('Erro ao responder avaliação:', error);
      alert('Erro ao responder avaliação. Verifique o console.');
    }
  };

  return (
    <div className="avaliacoes-admin-container">
      <HeaderAdm />
      <h2>Avaliações de hóspedes</h2>
      <div className="comentarios-admin-lista">
        {comentarios.map((c) => ( 
          <div key={c.id} className="comentario-admin-box"> 
            <div className="comentario-topo">
              <img
                src="/assets/icones/mamaloo-icone-perfil.png"
                alt="avatar"
              />
              <div>
                <strong>{c.nome}</strong>
                
                <span className="data-comentario">{formatarData(c.data)}</span>
              </div>
              <div className="comentario-botoes">
                {(!c.resposta || respostaAbertaId === c.id) && (
                  <button
                    onClick={() => handleToggleResposta(c.id)}
                    title={respostaAbertaId === c.id ? "Fechar" : "Responder"}
                    className="btn-responder"
                  >
                    {respostaAbertaId === c.id ? '✕' : '↩'} 
                  </button>
                )}
                {c.resposta && respostaAbertaId !== c.id && (
                  <button
                    className="btn-editar-resposta"
                    onClick={() => handleToggleResposta(c.id)}
                    title="Editar resposta"
                  >✎</button>
                )}
                <button
                  onClick={() => deletarComentario(c.id)}
                  title="Deletar"
                  className="btn-deletar"
                >🗑</button>
              </div>
            </div>
            <p>{c.texto}</p>

            {c.resposta && respostaAbertaId !== c.id && (
              <div className="resposta-admin">
                <div className="resposta-admin-topo">
                  <div className="resposta-nome-wrapper">
                    <img
                      src="/assets/icones/mamaloo-icone-perfil.png"
                      alt="Logo"
                      className="resposta-logo"
                    />
                    <strong className="resposta-nome">Mamaloo Pousada</strong>
                  </div>
                </div>
                <p>{c.resposta}</p>
              </div>
            )}

            {respostaAbertaId === c.id && ( 
              <div className="resposta-formulario">
                <textarea
                  placeholder={c.resposta ? "Edite sua resposta..." : "Digite sua resposta..."}
                  value={respostaTexto} 
                  onChange={(e) => setRespostaTexto(e.target.value)}
                ></textarea>
                <button onClick={() => responderComentario(c.id)}>
                  {c.resposta ? "Atualizar resposta" : "Enviar resposta"} 
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AvaliacoesAdm;