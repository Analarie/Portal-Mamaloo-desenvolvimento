import React, { useEffect, useState } from "react";
import '../styles/Administrador.css';
import ModalAtracao from './Modais/ModalAtracao';
import ModalQuarto from './Modais/ModalQuarto';
import AvaliacoesAdmin from "./AvaliacoesAdm";
import { Link } from 'react-router-dom';
import HeaderAdm from './HeaderAdm';
import { URL_API } from '../Api'; 

export default function Administrador() {
  const [quartos, setQuartos] = useState([]);
  const [atracoes, setAtracoes] = useState([]);

  const [modalAberto, setModalAberto] = useState(false);
  const [dadosEdicao, setDadosEdicao] = useState({});
  const [idEditando, setIdEditando] = useState(null);
  const [tipoModal, setTipoModal] = useState(null); 
  const [modoSubModal, setModoSubModal] = useState("adicionar"); 

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (token) {
      return {
        'Authorization': `Bearer ${token}` 
      };
    }
    return {}; 
  };

  const fetchAllQuartos = async () => {
    try {
      const response = await fetch(`${URL_API}/quartos/`, { headers: getAuthHeaders() });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      
      const formattedQuartos = data.map(item => ({
        id: item.IdQuarto, 
        nome: item.NomeQuarto, 
        descricao: item.descricaoQuarto || "", 
        capacidade: item.CapacidadeQuarto, 
        valor: item.ValorQuarto,
        promocao: item.valorPromocaoQuarto || "", 
        itens: item.itens || [],       
        imagens: Array.isArray(item.imagemQuartos) ? item.imagemQuartos.map(img => ({
            id_imagem: img.id_imagem || Math.random(), 
            url_imagem: img.url_imagem || img 
        })) : [],
      }));
      setQuartos(formattedQuartos);
    } catch (err) {
      console.error("Erro ao carregar quartos:", err);
      setQuartos([]);
    }
  };

  const fetchAllAtracoes = async () => {
    try {
      const response = await fetch(`${URL_API}/pontos-turisticos/`, { headers: getAuthHeaders() }); 
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      
      const formattedAtracoes = data.map(item => ({
        id: item.idpontoturistico,
        nome: item.nomepontoturistico,
        descricao: item.descricaopontoturistico || "",
        imagem: item.imagem_url || "",
        mapa: item.mapa || "", 
      }));
      setAtracoes(formattedAtracoes);
    } catch (err) {
      console.error("Erro ao carregar atrações:", err);
      setAtracoes([]); 
    }
  };

  useEffect(() => {
    fetchAllQuartos();
    fetchAllAtracoes();
  }, []);

  const handleEdit = async (id, tipo) => {
    setModoSubModal("editar");
    setIdEditando(id); 
    setTipoModal(tipo);
    setModalAberto(true); 

    try {
      let url = "";
      if (tipo === "atracoes") {
        url = `${URL_API}/pontos-turisticos/${id}`; 
      } else if (tipo === "quartos") {
        url = `${URL_API}/quartos/${id}`; 
      } else {
        console.error("Tipo de item desconhecido para edição:", tipo);
        setModalAberto(false);
        return;
      }

      const response = await fetch(url, { headers: getAuthHeaders() });
      if (!response.ok) throw new Error(`Erro ao buscar ${tipo} com ID ${id}: status ${response.status}`);
      
      const data = await response.json();

      if (tipo === "atracoes") {
        setDadosEdicao({ 
          id: data.idpontoturistico, 
          titulo: data.nomepontoturistico || '', 
          descricao: data.descricaopontoturistico || '',
          imagem: data.imagem_url || '',
          mapa: data.mapa || '' 
        });
      } else if (tipo === "quartos") {
        const mappedImages = Array.isArray(data.imagemQuartos) ? data.imagemQuartos.map(img => ({
            id: img.id_imagem || img.id || Math.random(), 
            url: img.url_imagem || img.url || img 
        })) : [];

        setDadosEdicao({
          id: data.IdQuarto, 
          titulo: data.NomeQuarto || '', 
          descricao: data.descricaoQuarto || '',
          capacidade: data.CapacidadeQuarto || '', 
          valor: data.ValorQuarto || '',          
          promocao: data.valorPromocaoQuarto || '', 
          itens: data.itens || '',          
          imagens: mappedImages, 
        });
      }
    } catch (error) {
      console.error('Erro ao buscar dados para edição:', error);
      alert(`Erro ao carregar dados para edição. Verifique o console.`);
      setModalAberto(false); 
    }
  };

  
  const handleDelete = async (id, tipo) => {
    if (!window.confirm(`Tem certeza que deseja excluir este ${tipo === 'quartos' ? 'quarto' : 'atração'}?`)) {
        return; 
    }

    try {
        let url = "";
        if (tipo === "atracoes") {
            url = `${URL_API}/pontos-turisticos/${id}`;
        } else if (tipo === "quartos") {
            url = `${URL_API}/quartos/${id}`; 
        } else {
            console.error("Tipo de item desconhecido para exclusão:", tipo);
            return;
        }

        const response = await fetch(url, {
            method: 'DELETE',
            headers: getAuthHeaders(), 
        });

        if (!response.ok) {
            let errorBody = await response.text();
            try {
                errorBody = JSON.parse(errorBody).detail || errorBody;
            } catch (e) { /* ignore if not JSON */ }
            throw new Error(`Erro ao excluir ${tipo} com ID ${id}: status ${response.status}. Detalhes: ${errorBody}`);
        }
        
        alert(`${tipo === 'quartos' ? 'Quarto' : 'Atração'} excluído(a) com sucesso!`);
        if (tipo === "quartos") {
            fetchAllQuartos(); 
        } else if (tipo === "atracoes") {
            fetchAllAtracoes(); 
        }

    } catch (error) {
        console.error('Erro ao excluir item:', error);
        alert('Erro ao excluir item. Verifique o console para mais detalhes.');
    }
  };

  const handleDeleteExistingImage = async (quartoId, imageId) => {
    if (!window.confirm(`Tem certeza que deseja excluir a imagem (ID: ${imageId}) do quarto (ID: ${quartoId})?`)) {
        return;
    }
    try {
        const response = await fetch(`${URL_API}/quartos/imagens/${imageId}`, { 
            method: 'DELETE',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            let errorBody = await response.text();
            try { 
                const errorJson = JSON.parse(errorBody);
                throw new Error(`Erro ao excluir imagem ${imageId} do quarto ${quartoId}: status ${response.status}. Detalhes: ${errorJson.detail || errorBody}`);
            } catch (e) {
                throw new Error(`Erro ao excluir imagem ${imageId} do quarto ${quartoId}: status ${response.status}. Detalhes: ${errorBody}`);
            }
        }
        
        alert(`Imagem excluída do quarto com sucesso!`);
        await fetchAllQuartos(); 

    } catch (error) {
        console.error('Erro ao excluir imagem:', error);
        alert('Erro ao excluir imagem. Verifique o console para mais detalhes.');
    }
  };

  const adicionarItem = (tipo) => {
    setTipoModal(tipo);
    setModoSubModal("adicionar");
    setDadosEdicao({}); 
    setIdEditando(null); 
    setModalAberto(true);
  };

  const handleConfirmarModal = async (dadosDoModal) => {
    setModalAberto(false); 
    
    const formData = new FormData();
    formData.append('nomepontoturistico', dadosDoModal.titulo);
    formData.append('descricaopontoturistico', dadosDoModal.descricao);
    if (dadosDoModal.imagem) { 
      formData.append('imagem', dadosDoModal.imagem); 
    }
    formData.append('mapa', dadosDoModal.mapa || ''); 

    try {
      let response;
      const headers = getAuthHeaders(); 

      if (modoSubModal === "editar") {
        
        response = await fetch(`${URL_API}/pontos-turisticos/${dadosDoModal.id}`, {
          method: 'PUT',
          headers: headers, 
          body: formData, 
        });
      } else {
        
        response = await fetch(`${URL_API}/pontos-turisticos/`, {
          method: 'POST',
          headers: headers, 
          body: formData,
        });
      }

      if (!response.ok) {
        let errorBody = await response.text();
        try {
          errorBody = JSON.parse(errorBody).detail || errorBody;
        } catch (e) { /* ignore if not JSON */ }
        throw new Error(`Erro ao salvar atração: status ${response.status}. Detalhes: ${errorBody}`);
      }

      const result = await response.json();
      console.log('Atração salva com sucesso:', result);
      alert('Atração salva com sucesso!');
      fetchAllAtracoes(); 
    } catch (error) {
      console.error('Erro ao salvar atração:', error);
      alert('Erro ao salvar atração. Verifique o console para mais detalhes.');
    }
  };

  const handleConfirmarModalQuarto = async (dadosDoModal) => {
    setModalAberto(false); 
    
    let response;
    const headers = getAuthHeaders(); 

    if (modoSubModal === "adicionar") {
        
        const formData = new FormData();
        formData.append('nomequarto', dadosDoModal.titulo);
        formData.append('descricaoquarto', dadosDoModal.descricao);
        formData.append('capacidadequarto', Number(dadosDoModal.capacidade));
        formData.append('valorquarto', Number(dadosDoModal.valor));           
        formData.append('valorpromocaoquarto', Number(dadosDoModal.promocao) || 0);

        if (dadosDoModal.novasImagens && dadosDoModal.novasImagens.length > 0) { 
            dadosDoModal.novasImagens.forEach((file) => {
                formData.append('imagens', file); 
            });
        }

        response = await fetch(`${URL_API}/quartos/`, {
            method: 'POST',
            headers: headers, 
            body: formData,
        });

        if (!response.ok) {
            let errorBody = await response.text();
            try {
                errorBody = JSON.parse(errorBody).detail || errorBody;
            } catch (e) { /* ignore if not JSON */ }
            throw new Error(`Erro ao adicionar quarto: status ${response.status}. Detalhes: ${errorBody}`);
        }
        const result = await response.json();
        console.log('Quarto adicionado com sucesso:', result);
        alert('Quarto adicionado com sucesso!');
        
        fetchAllQuartos(); 
        
    } else if (modoSubModal === "editar") {
        
        const jsonBody = {
            nomequarto: dadosDoModal.titulo,
            descricaoquarto: dadosDoModal.descricao,
            capacidadequarto: Number(dadosDoModal.capacidade), 
            valorquarto: Number(dadosDoModal.valor),           
            valorpromocaoquarto: Number(dadosDoModal.promocao) || 0, 
        };

        response = await fetch(`${URL_API}/quartos/${dadosDoModal.id}`, {
            method: 'PUT',
            headers: {
                ...headers, 
                'Content-Type': 'application/json', 
            },
            body: JSON.stringify(jsonBody), 
        });

        if (!response.ok) {
            let errorBody = await response.text();
            try {
                errorBody = JSON.parse(errorBody).detail || errorBody;
            } catch (e) { /* ignore if not JSON */ }
            throw new Error(`Erro ao atualizar quarto: status ${response.status}. Detalhes: ${errorBody}`);
        }
        const result = await response.json();
        console.log('Quarto atualizado com sucesso:', result);
        alert('Quarto atualizado com sucesso!');

        
        if (dadosDoModal.novasImagens && dadosDoModal.novasImagens.length > 0) { 
            dadosDoModal.novasImagens.forEach(async (file) => { 
                const imageFormData = new FormData();
                imageFormData.append('imagem', file); 

                try {
                    const imageResponse = await fetch(`${URL_API}/quartos/${dadosDoModal.id}/imagens`, {
                        method: 'POST',
                        headers: headers, 
                        body: imageFormData,
                    });

                    if (!imageResponse.ok) {
                        console.error(`Erro ao adicionar nova imagem ${file.name} ao quarto:`, imageResponse.status);
                        alert(`Quarto atualizado, mas falha ao enviar imagem ${file.name}.`);
                    } else {
                        console.log(`Nova imagem ${file.name} adicionada ao quarto com sucesso!`);
                    }
                } catch (imageError) {
                    console.error(`Erro ao enviar nova imagem ${file.name} do quarto:`, imageError);
                    alert(`Quarto atualizado, mas falha ao enviar nova imagem.`);
                }
            });
        }
        fetchAllQuartos(); 
    }
  };

  const CardItem = ({ id, nome, onEdit, onDelete }) => (
    <div className="card-item">
      <span>{nome}</span>
      <div className="card-icons">
       <button aria-label="Editar" title="Editar" className="btn-icon btn-editar" onClick={onEdit}>
         <img src="/assets/icones/mamaloo-icone-editar.png" alt="Editar" className="icon" />
       </button>
       <button aria-label="Deletar" title="Deletar" className="btn-icon btn-delete" onClick={onDelete}>
         <img src="/assets/icones/mamaloo-icone-lixeira.png" alt="Deletar" className="icon" />
       </button>
      </div>
    </div>
  );

  return (
    <>
   <div className="admin-page">
        <HeaderAdm />

      <main className="container">
        <section id="quartos" className="section">
          <h2>Quartos</h2>
          <div className="cards-container">
            {quartos.map((item) => (
              <CardItem
                key={item.id}
                id={item.id}
                nome={item.nome}
                onEdit={() => handleEdit(item.id, "quartos")}
                onDelete={() => handleDelete(item.id, "quartos")}
              />
            ))}
          </div>
          <button
            className="btn-adicionar"
            onClick={() => adicionarItem("quartos")}
          >
            Adicionar
          </button>
        </section>

        <section id="atracoes" className="section">
          <h2>Atrações</h2>
          <div className="cards-container">
            {atracoes.map((item) => (
              <CardItem
                key={item.id}
                id={item.id}
                nome={item.nome}
                onEdit={() => handleEdit(item.id, "atracoes")}
                onDelete={() => handleDelete(item.id, "atracoes")}
              />
            ))}
          </div>
          <button
            className="btn-adicionar"
            onClick={() => adicionarItem("atracoes")}
          >
            Adicionar
          </button>
        </section>
      </main>
    </div>

    {modalAberto && tipoModal === 'atracoes' && (
      <ModalAtracao
        modo={modoSubModal}
        dadosIniciais={dadosEdicao} 
        onClose={() => setModalAberto(false)}
        onConfirmar={handleConfirmarModal}
      />
    )}

    {modalAberto && tipoModal === 'quartos' && (
      <ModalQuarto
        modo={modoSubModal}
        dadosIniciais={dadosEdicao} 
        onClose={() => setModalAberto(false)}
        onConfirmar={handleConfirmarModalQuarto}
        onDeleteExistingImage={handleDeleteExistingImage} 
      />
    )}
    </>
  );
}