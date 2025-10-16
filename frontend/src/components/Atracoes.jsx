import React, { useEffect, useState } from 'react';
import '../styles/Atracoes.css';
import { URL_API } from '../Api'; 

function Atracoes() {
  const [atracoes, setAtracoes] = useState([]);

  
  const localImageMap = {
    "Praia de Ponta Verde": "/assets/atracoes/mamaloo-atracoes-pv.jpg",
    "Marco dos Corais": "/assets/atracoes/mamaloo-atracoes-marco.jpeg",
    "Pavilhão do Artesanato": "/assets/atracoes/mamaloo-atracoes-pavilhao.jpg",
    "Piscinas Naturais de Pajuçara": "/assets/atracoes/mamaloo-atracoes-pajucara.jpg",
    
  };

  useEffect(() => {
    async function fetchAtracoes() {
      try {
        const response = await fetch(`${URL_API}/pontos-turisticos/`); 
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        const formattedData = data.map((item) => {
          
          const imagemParaExibir = localImageMap[item.nomepontoturistico] || "/assets/placeholder-atracao.jpg"; // Substitua por um placeholder genérico se quiser

          return {
            id: item.idpontoturistico, 
            titulo: item.nomepontoturistico, 
            descricao: item.descricaopontoturistico, 
            imagem: imagemParaExibir, 
            mapa: item.mapa || `https://www.google.com/maps?q=${encodeURIComponent(item.nomepontoturistico || '')}`, 
          };
        });

        setAtracoes(formattedData); 
      } catch (error) {
        console.error('Erro ao buscar atrações:', error);
        setAtracoes([]); 
      }
    }

    fetchAtracoes(); 
  }, []);

  return (
    <div className="atracoes-container">
      <main className="atracoes-main">
        {atracoes.length > 0 ? ( 
          atracoes.map((item) => (
            <section key={item.id} className="atracao-card">
              <div className="atracao-content">
                <img
                  src={item.imagem} 
                  alt={item.titulo}
                  className="atracao-imagem"
                />
                <div className="atracao-texto-container">
                  <h2 className="atracao-titulo">{item.titulo}</h2>
                  <p className="atracao-descricao">{item.descricao}</p>
                  <button
                    className="btn-mapa"
                    onClick={() => item.mapa && window.open(item.mapa, '_blank')}
                  >
                    Abrir Google Maps
                  </button>
                </div>
              </div>
            </section>
          ))
        ) : (
          <p className="loading-message">Carregando atrações... ou nenhuma atração encontrada.</p>
        )}
      </main>
    </div>
  );
}

export default Atracoes;