import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/Quartos.css";
import { URL_API } from '../Api'; 


import IconePessoa from '/assets/icones/mamaloo-icone-pessoa.png'; // Caminho direto da pasta public

export default function PaginaQuartos() {
  const [quartos, setQuartos] = useState([]);

  // --- NOVO: Mapa de imagens locais por nome exato do quarto ---
  // Mapeia o nome do quarto (em caixa baixa e sem acentos para maior robustez)
  // para o array de URLs das imagens locais.
  const roomImagePathsMap = {
    "quarto triplo luxo": [
      "/assets/quartos/t1.jpg",
      "/assets/quartos/t2.jpg",
      "/assets/quartos/t3.jpg",
    ],
    "estudio deluxe": [
      "/assets/quartos/d1.jpg",
      "/assets/quartos/d2.jpg",
      "/assets/quartos/d3.jpg",
    ],
    "quarto quadruplo de luxo": [
      "/assets/quartos/q1.jpg",
      "/assets/quartos/q2.jpg",
      "/assets/quartos/q3.jpg",
    ],
    // Adicione um placeholder genérico caso um nome não seja encontrado
    "default": [
      "/assets/quartos/mamaloo-quarto-deluxe.jpg",
      "/assets/quartos/mamaloo-quarto-quadruplo.jpg",
      "/assets/quartos/mamaloo-quarto-triplo.jpg",
    ]
  };

  // Função auxiliar para normalizar nomes de quarto para a chave do mapa
  const normalizeRoomName = (name) => {
    if (!name) return '';
    return name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Remove acentos e minúsculas
  };


  useEffect(() => {
    async function fetchQuartos() {
      try {
        const response = await fetch(`${URL_API}/quartos/`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        const defaultItens = ["TV de tela plana", "Ar-condicionado", "WiFi gratuito"];
        
        let formattedData = data.map(item => {
          let imagensDoQuarto = [];
          const nomeDoQuartoNormalizado = normalizeRoomName(item.NomeQuarto);

          // Tenta pegar as imagens do mapa local
          imagensDoQuarto = roomImagePathsMap[nomeDoQuartoNormalizado] || roomImagePathsMap["default"];

          // Se a API ainda estiver enviando imagens (e elas estiverem corretas), você pode priorizá-las
          // Se a API enviar URLs válidas e você quiser usá-las:
          // if (Array.isArray(item.imagemQuartos) && item.imagemQuartos.length > 0 && item.imagemQuartos[0].includes('http')) {
          //     imagensDoQuarto = item.imagemQuartos;
          // }

          return {
            id: item.IdQuarto, 
            nome: item.NomeQuarto, 
            imagens: imagensDoQuarto, 
            descricao: item.descricaoQuarto,
            preco: item.ValorQuarto,
            promocao: item.valorPromocaoQuarto || "",
            itens: item.itens && item.itens.length > 0 ? item.itens : defaultItens, 
            capacidade: item.CapacidadeQuarto, 
          };
        });

        setQuartos(formattedData);
      } catch (error) {
        console.error('Erro ao buscar quartos:', error);
        setQuartos([]); 
      }
    }

    fetchQuartos();
  }, []);

  const formatarPreco = (valor) => {
    const numericValue = parseFloat(valor);
    if (isNaN(numericValue)) {
        return "R$ 0,00"; 
    }
    return numericValue.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true
  };

  return (
    <div className="pagina-quartos">
      <main className="conteudo">
        {quartos.length > 0 ? ( 
          quartos.map((quarto) => (
            <div key={quarto.id} className="card-quarto">
              <div className="carousel-wrapper">
                <Slider {...settings}>
                  {quarto.imagens.map((src, i) => (
                    <img 
                      key={i} 
                      src={src} 
                      alt={`${quarto.nome} - Imagem ${i + 1}`} 
                      className="imagem-quarto" 
                    />
                  ))}
                </Slider>
              </div>
              <div className="info-quarto">
                <h3>{quarto.nome}</h3>
                <ul className="icones-itens">
                  {quarto.itens && quarto.itens.length > 0 && quarto.itens.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
                <p className="descricao">{quarto.descricao}</p>
                
                {quarto.capacidade && (
                  <p className="capacidade-quarto">
                    <img 
                        src={IconePessoa} 
                        alt="Capacidade de pessoas" 
                        className="icone-capacidade" 
                    /> 
                    Até {quarto.capacidade} pessoa{quarto.capacidade > 1 ? 's' : ''}
                  </p>
                )}
                <div className="precos">
                  <span className="a-partir-de">Diária a partir de </span>
                  {quarto.promocao ? ( 
                    <>
                      <span className="preco-original">{formatarPreco(quarto.preco)}</span>
                      <span className="preco-promocional">{formatarPreco(quarto.promocao)}</span>
                    </>
                  ) : ( 
                    <span className="preco-unico">{formatarPreco(quarto.preco)}</span>
                  )}
                </div>
                <a
                  className="btn-reservar"
                  href="https://api.whatsapp.com/send?phone=5582981815454"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Reservar
                </a>
              </div>
            </div>
          ))
        ) : (
          <p className="mensagem-carregando-erro">Carregando quartos...</p>
        )}
      </main>
    </div>
  );
}