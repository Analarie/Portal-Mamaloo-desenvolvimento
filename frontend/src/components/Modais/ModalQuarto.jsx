import React, { useState, useEffect } from 'react';
import '../../styles/StyleModais/ModalQuarto.css';

export default function ModalQuarto({ modo, dadosIniciais = {}, onClose, onConfirmar, onDeleteExistingImage }) {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [capacidade, setCapacidade] = useState('');
  const [valor, setValor] = useState('');
  const [promocao, setPromocao] = useState('');
  
  const [novasImagens, setNovasImagens] = useState([]); 
  const [imagensExistentes, setImagensExistentes] = useState([]); 

  useEffect(() => {
    if (modo === 'editar' && dadosIniciais) {
      setTitulo(dadosIniciais.titulo || '');
      setDescricao(dadosIniciais.descricao || '');
      setCapacidade(dadosIniciais.capacidade || '');
      setValor(dadosIniciais.valor || '');
      setPromocao(dadosIniciais.promocao || '');
      
      const formattedExistingImages = Array.isArray(dadosIniciais.imagens) 
        ? dadosIniciais.imagens.map(img => ({ 
            id: img.id_imagem || img.id || Math.random(), 
            url: img.url_imagem || img.url || img 
          }))
        : [];
      setImagensExistentes(formattedExistingImages);
      setNovasImagens([]); 
    } else if (modo === 'adicionar') {
      setTitulo('');
      setDescricao('');
      setCapacidade('');
      setValor('');
      setPromocao('');
      setNovasImagens([]); 
      setImagensExistentes([]); 
    }
  }, [dadosIniciais, modo]);

  const handleFileChange = (e) => {
    setNovasImagens(Array.from(e.target.files)); 
  };

  const handleConfirmar = () => {
    onConfirmar({
      id: dadosIniciais.id, 
      titulo,
      descricao,
      capacidade,
      valor,
      promocao,
      novasImagens, 
    });
  };

  return (
    <div className="modal-quarto-overlay">
      <div className="modal-quarto">
        <h2>{modo === 'editar' ? 'Editar Quarto' : 'Adicionar Quarto'}</h2>

        
        <label htmlFor="titulo">Título (Nome do Quarto)</label>
        <input
          type="text"
          id="titulo"
          placeholder="Digite o título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />

        
        <label htmlFor="descricao">Descrição do Quarto</label>
        <textarea
          id="descricao"
          placeholder="Digite a descrição do quarto"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />

        
        <label htmlFor="capacidade">Capacidade do Quarto</label>
        <input
          type="number"
          id="capacidade"
          placeholder="Digite a Capacidade"
          value={capacidade}
          onChange={(e) => setCapacidade(e.target.value)}
        />

        
        <label htmlFor="valor">Valor do Quarto (R$)</label>
        <input
          type="number"
          id="valor"
          placeholder="Digite o Valor do Quarto"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
        />
        
        
        <label htmlFor="promocao">Promoção (Valor Promocional)</label>
        <input
          type="number"
          id="promocao"
          placeholder="Digite o Valor Promocional"
          value={promocao}
          onChange={(e) => setPromocao(e.target.value)}
        />

        
        {modo === 'editar' && imagensExistentes.length > 0 && (
          <div className="imagens-existentes">
            <p>Imagens atuais:</p>
            <div className="lista-imagens-existentes">
              {imagensExistentes.map((img) => (
                <div key={img.id} className="imagem-existente-item">
                  <img 
                    src={img.url} 
                    alt="Imagem atual" 
                    style={{ maxWidth: '80px', maxHeight: '80px', objectFit: 'cover', borderRadius: '4px' }} 
                  />
                  <button 
                    onClick={() => onDeleteExistingImage(dadosIniciais.id, img.id)}
                    className="btn-delete-imagem"
                    title="Remover imagem"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        
        <label htmlFor="imagemUpload">Realize o upload das novas imagens:</label>
        <input
          type="file"
          id="imagemUpload"
          multiple 
          onChange={handleFileChange}
        />
        {novasImagens.length > 0 && (
          <p>Selecionado: {novasImagens.length} arquivo(s)</p>
        )}

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