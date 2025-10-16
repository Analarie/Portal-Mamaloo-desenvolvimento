import React, { useState, useEffect } from 'react';
import '../../styles/StyleModais/modalAtracao.css';

export default function ModalAtracao({ modo, dadosIniciais = {}, onClose, onConfirmar }) {
  
  const [titulo, setTitulo] = useState(dadosIniciais.titulo || '');
  
  const [descricao, setDescricao] = useState(dadosIniciais.descricao || '');
  
  const [imagem, setImagem] = useState(null);
  
  const [imagemUrlExistente, setImagemUrlExistente] = useState(dadosIniciais.imagem || '');

  useEffect(() => {
    if (modo === 'editar' && dadosIniciais) {
      setTitulo(dadosIniciais.titulo || '');
      setDescricao(dadosIniciais.descricao || '');
      setImagem(null);
      setImagemUrlExistente(dadosIniciais.imagem || '');
    } else if (modo === 'adicionar') {
      setTitulo('');
      setDescricao('');
      setImagem(null);
      setImagemUrlExistente('');
    }
  }, [dadosIniciais, modo]);

  const handleConfirmar = () => {
    
    onConfirmar({
      id: dadosIniciais.id,
      titulo,
      descricao, 
      imagem 
    });
  };

  return (
    <div className="modal-atracao-overlay">
      <div className="modal-atracao">
        <h2>{modo === 'editar' ? 'Editar Atração' : 'Adicionar Atração'}</h2>

        
        <label htmlFor="tituloAtracao">Título (Nome da Atração)</label>
        <input
          type="text"
          id="tituloAtracao"
          placeholder="Digite o título (nome da atração)"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />

        
        <label htmlFor="descricaoAtracao">Descrição da Atração</label>
        <textarea
          id="descricaoAtracao"
          placeholder="Digite a descrição da atração"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />

        
        {modo === 'editar' && imagemUrlExistente && (
            <div className="imagem-preview">
                <p>Imagem atual:</p>
                <img src={imagemUrlExistente} alt="Imagem atual da atração" style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'cover', borderRadius: '6px' }} />
            </div>
        )}

        
        <label htmlFor="imagemUploadAtracao">Realize o upload da nova imagem:</label>
        <input
          type="file"
          id="imagemUploadAtracao"
          onChange={(e) => setImagem(e.target.files[0])}
        />

        <div className="botoes">
          <button onClick={onClose}>Cancelar</button>
          <button onClick={handleConfirmar}>
            {modo === 'editar' ? 'Concluir edição' : 'Concluir adição'}
          </button>
        </div>
      </div>
    </div>
  );
}