import React, { useEffect, useState } from 'react'; 
import ComentarioCard from './cardComentario';
import '../styles/paginaPrincipal.css'; 
import logo from '../assets/mamaloo-recepcao.jpg';
import { URL_API } from '../Api'; 
import { useNavigate } from 'react-router-dom'; 

const PaginaPrincipal = () => {
  const [quartos, setQuartos] = useState([]);
  const navigate = useNavigate(); 

  useEffect(() => {
    async function fetchQuartos() {
      try {
        const response = await fetch(`${URL_API}/quartos/`); 
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        const defaultLocalImages = [
          "/assets/quartos/mamaloo-quarto-quadruplo.jpg",
          "/assets/quartos/mamaloo-quarto-triplo.jpg",
          "/assets/quartos/mamaloo-quarto-deluxe.jpg",
        ];

        const formattedQuartos = data.map((item, index) => { 
          const imagemPrincipal = (item.imagemQuartos && item.imagemQuartos.length > 0) 
                                ? item.imagemQuartos[0] 
                                : defaultLocalImages[index % defaultLocalImages.length];

          return {
            id: item.IdQuarto,         
            nome: item.NomeQuarto,     
            imagemPrincipal: imagemPrincipal, 
          };
        });
        setQuartos(formattedQuartos);
      } catch (err) {
        console.error("Erro ao carregar quartos para a página principal:", err);
        setQuartos([]); 
      }
    }

    fetchQuartos();
  }, []); 

  
  const handleVerQuartoClick = () => {
    navigate('/quartos'); 
  };

  return (
    <div className="pagina-principal">
      {/* Primeira seção */}
      <section className="background-section"></section>
      
      {/* Segunda seção  */}
      <section className="content-section">
        <div className="inner-content">
          <div className="text">
            <h2>Por que escolher a Mamaloo Pousada?</h2>
            <p>
              Um espaço acolhedor, criado com carinho para quem valoriza conforto, hospitalidade e boas experiências. Localizada em Maceió, a Mamaloo nasceu da paixão por receber bem. O nome é a união de “mãe” com “Lu”, homenagem à esposa do fundador. Inspirada nas vivências internacionais do Volney, nosso café da manhã é servido à mesa, trazendo um toque especial à sua estadia. Descubra uma pousada onde cada detalhe foi pensado para que você se sinta em casa.
            </p>
            <p>
             Além do ambiente familiar e acolhedor, a Mamaloo está situada próxima às belas praias de Cruz das Almas e Jatiúca, com fácil acesso a pontos turísticos, restaurantes e serviços locais. Os quartos são espaçosos, confortáveis e pensados para oferecer praticidade, com Wi-Fi gratuito, ar-condicionado e estacionamento privativo — tudo para tornar sua experiência ainda mais completa.
            </p>
            <p>
              Seja a lazer ou negócios, hospede-se na Mamaloo Pousada e aproveite o melhor de Maceió!
            </p>
          </div>
          <div className="image">
            <img src={logo} alt="Imagem da Pousada" />
          </div>
        </div>
      </section>

      {/* Terceira seção - Quartos*/}
      <section className="rooms-section">
        <div className="rooms-cards">
          {quartos.length > 0 ? (
            quartos.map((quarto) => (
              <div key={quarto.id} className="room-card">
                <img src={quarto.imagemPrincipal} alt={quarto.nome} /> 
                <div className="room-info">
                  <h3>{quarto.nome}</h3> 
                  {/* --- MUDANÇA AQUI: Botão com onClick para redirecionar --- */}
                  <button onClick={handleVerQuartoClick}>Ver quarto</button>
                </div>
              </div>
            ))
          ) : (
            <p className="loading-message">Carregando quartos...</p>
          )}
        </div>
      </section>
      
      {/* Quarta seção - Google Maps  */}
      <section className="map-section">
        <div className="location-container">
          <div className="location-info">
            <div className="location-icon">
            <img src="/assets/icones/mamaloo-icone-loc.png" alt="Ícone de Localização" />
            </div>
            <div className="location-text">
              <h3>Venha viver Maceió com a Mamaloo Pousada!</h3>
              <p>
                Maceió é um verdadeiro paraíso tropical, com mar azul-turquesa, coqueirais,
                culinária irresistível e um povo acolhedor que conquista corações. Aqui, cada dia
                é uma oportunidade de descobrir praias deslumbrantes, como Pajuçara, Jatiúca e Cruz
                das Almas, e vivenciar passeios únicos pelas piscinas naturais, falésias coloridas
                e lagoas encantadoras.
              </p>
              <p>
                Venha descobrir o melhor de Maceió. Estamos te esperando na Mamaloo Pousada!
              </p>
              <button onClick={() => window.open("https://www.google.com/maps?q=Mamaloo+Pousada,Maceió,Alagoas")}>
                Abrir Google Maps
              </button>
            </div>
          </div>
          <div className="map-container">
            <iframe
              title="Mapa Mamaloo Pousada"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3933.4349238195255!2d-35.70833602422409!3d-9.64382820182776!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x70145033f4722a7%3A0x899a273c4d978552!2sMamaloo%20Pousada!5e0!3m2!1spt-BR!2sbr!4v1746052635987!5m2!1spt-BR!2sbr"
              width="100%"
              height="450"
              style={{ border: '0' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>
      
      {/* Quinta seção - Café da manhã */}
      <section className="sessao-cafe">
        <h2 className="titulo-cafe">
          Comece o dia com o sabor de Maceió na Mamaloo Pousada
        </h2>

        <div className="imagens-cafe">
          <img src="/assets/cafe/mamaloo-cafe-mesas.jpg" alt="Mesa com cadeiras" />
          <img src="/assets/cafe/mamaloo-cafe01.jpg" alt="Balcão de sucos e bebidas" />
          <div className="empilhadas">
          <img src="/assets/cafe/mamaloo-cafe02.jpg" alt="Mesa com itens do café" />
          <img src="/assets/cafe/mamaloo-cafe03.jpg" alt="Mesa com frutas e cereais" />
          </div>
        </div>

        <p className="texto-cafe">
          Na Mamaloo Pousada, o café da manhã é mais do que uma refeição — é um
          convite para começar o dia com energia e sabor. Servido diariamente em um ambiente
          acolhedor, nosso café oferece diversas opções para agradar todos os paladares.
        </p>
      </section>
      
      {/* Sexta seção - Comentários */}
      <section className="secao-comentarios">
        <h2 className="titulo-comentarios">O que dizem nossos hóspedes</h2>
        <div className="comentarios-cards">
          <ComentarioCard />
        </div>
      </section>

      {/* Sétima seção - Área de Convivência */}
      <section className="secao-convivencia">
        <h2 className="titulo-convivencia">Área de Convivência</h2>
        <div className="convivencia-container">
          <div className="texto-convivencia">
            <p>
              Nossa área de convivência é um espaço pensado para acolher todos os tipos de hóspedes.
              Aqui, você pode relaxar após um dia de passeios, socializar com outros visitantes ou
              simplesmente apreciar um bom livro com uma xícara de café. Um ambiente que une conforto,
              praticidade e boas conversas.
            </p>

            <ul className="lista-convivencia">
              <li>
                <img src="/assets/icones/mamaloo-icone-livro.png" alt="Ícone livro" className="icone-lista" />
                Leitura e troca de livros;
              </li>
              <li>
                <img src="/assets/icones/mamaloo-icone-cafe.png" alt="Ícone café" className="icone-lista" />
                Cantinho do café sempre disponível;
              </li>
              <li>
                <img src="/assets/icones/mamaloo-icone-criancas.png" alt="Ícone crianças" className="icone-lista" />
                Espaço para crianças;
              </li>
              <li>
                <img src="/assets/icones/mamaloo-icone-socializacao.png" alt="Ícone socialização" className="icone-lista" />
                Ambiente ideal para socialização;
              </li>
            </ul>

          </div>

          <div className="grid-convivencia">
            <img src="/assets/convivencia/mamaloo-conv01.jpg" alt="Espaço leitura" />
            <img src="/assets/convivencia/mamaloo-conv05.jpg" alt="Sala com poltronas" />
            <img src="/assets/convivencia/mamaloo-conv02.jpg" alt="Corredor com brinquedos" />
            <img src="/assets/convivencia/mamaloo-conv03.jpg" alt="Cantinho do café" />
          </div>
        </div>
      </section>

      {/* Oitava seção - Galeria Maceió */}
      <section className="secao-galeria">
        <h2 className="titulo-galeria">Conheça as belezas de Maceió</h2>
        <div className="galeria-imagens">
          <img src="/assets/maceio/mamaloo-maceio01.jpg" alt="" />
          <img src="/assets/maceio/mamaloo-maceio02.jpg" alt="" />
          <img src="/assets/maceio/mamaloo-maceio03.jpg" alt="" />
          <img src="/assets/maceio/mamaloo-maceio04.jpg" alt="" />
          <img src="/assets/maceio/mamaloo-maceio05.png" alt="" />
          <img src="/assets/maceio/mamaloo-maceio06.jpg" alt="" />
          <img src="/assets/maceio/mamaloo-maceio07.jpg" alt="" />
          <img src="/assets/maceio/mamaloo-maceio08.jpg" alt="" />
          <img src="/assets/maceio/mamaloo-maceio09.jpg" alt="" />
        </div>
      </section>

    </div>
  );
};

export default PaginaPrincipal;