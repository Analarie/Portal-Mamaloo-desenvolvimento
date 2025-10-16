import React, { useEffect, useState } from 'react';
import '../styles/cardComentario.css';

const ComentarioCard = () => {
  const [comentarios, setComentarios] = useState([]);
  const [paginaAtual, setPaginaAtual] = useState(0);
  const [animando, setAnimando] = useState(false);
  const comentariosPorPagina = 4;

  useEffect(() => {
    
    const mockData = [
      {
        nome: 'Carlos',
        texto: 'Ambiente aconchegante, funcionários atenciosos e prestativos.',
        data: '2025-03-24',
        origem: 'Booking',
        linkOrigem: 'https://www.booking.com/hotel/br/mamaloo-pousada.pt-br.html?aid=1726433&label=mamaloo-pousada-vvgr3PHO_G2uD_nWNWNRbQS520386729577%3Apl%3Ata%3Ap1%3Ap2%3Aac%3Aap%3Aneg%3Afi%3Atikwd-646375645657%3Alp20086%3Ali%3Adec%3Adm%3Appccp%3DUmFuZG9tSVYkc2RlIyh9YbC4OlOULAnvcrFmvh1xnqM&sid=425297d08b7b784263a7b1f1562e2dd2&dest_id=-652627&dest_type=city&dist=0&group_adults=2&group_children=0&hapos=1&hpos=1&no_rooms=1&req_adults=2&req_children=0&room1=A%2CA&sb_price_type=total&sr_order=popularity&srepoch=1751405754&srpvid=ad81f28e4d15555e9fa27cfe916dd487&type=total&ucfs=1&',
      },
      {
        nome: 'Enedino',
        texto: 'Carinho, dedicação e amor ao que faz, resumem a hospitalidade da pousada.',
        data: '2025-05-02',
        origem: 'Booking',
        linkOrigem: 'https://www.booking.com/hotel/br/mamaloo-pousada.pt-br.html?aid=1726433&label=mamaloo-pousada-vvgr3PHO_G2uD_nWNWNRbQS520386729577%3Apl%3Ata%3Ap1%3Ap2%3Aac%3Aap%3Aneg%3Afi%3Atikwd-646375645657%3Alp20086%3Ali%3Adec%3Adm%3Appccp%3DUmFuZG9tSVYkc2RlIyh9YbC4OlOULAnvcrFmvh1xnqM&sid=425297d08b7b784263a7b1f1562e2dd2&dest_id=-652627&dest_type=city&dist=0&group_adults=2&group_children=0&hapos=1&hpos=1&no_rooms=1&req_adults=2&req_children=0&room1=A%2CA&sb_price_type=total&sr_order=popularity&srepoch=1751405754&srpvid=ad81f28e4d15555e9fa27cfe916dd487&type=total&ucfs=1&',
      },
      {
        nome: 'Cláudia',
        texto: 'Um lugar acolhedor, tranquilo, seguro e limpo. Próximo da praia. Melhor custo-benefício.',
        data: '2025-03-24',
        origem: 'Booking',
        linkOrigem: 'https://www.booking.com/hotel/br/mamaloo-pousada.pt-br.html?aid=1726433&label=mamaloo-pousada-vvgr3PHO_G2uD_nWNWNRbQS520386729577%3Apl%3Ata%3Ap1%3Ap2%3Aac%3Aap%3Aneg%3Afi%3Atikwd-646375645657%3Alp20086%3Ali%3Adec%3Adm%3Appccp%3DUmFuZG9tSVYkc2RlIyh9YbC4OlOULAnvcrFmvh1xnqM&sid=425297d08b7b784263a7b1f1562e2dd2&dest_id=-652627&dest_type=city&dist=0&group_adults=2&group_children=0&hapos=1&hpos=1&no_rooms=1&req_adults=2&req_children=0&room1=A%2CA&sb_price_type=total&sr_order=popularity&srepoch=1751405754&srpvid=ad81f28e4d15555e9fa27cfe916dd487&type=total&ucfs=1&',
      },
      {
        nome: 'Renan',
        texto: 'É um ambiente muito familiar e confortável! O café da manhã é incrível, tudo muito bem preparado e fresco!',
        data: '2025-03-05',
        origem: 'Booking',
        linkOrigem: 'https://www.booking.com/hotel/br/mamaloo-pousada.pt-br.html?aid=1726433&label=mamaloo-pousada-vvgr3PHO_G2uD_nWNWNRbQS520386729577%3Apl%3Ata%3Ap1%3Ap2%3Aac%3Aap%3Aneg%3Afi%3Atikwd-646375645657%3Alp20086%3Ali%3Adec%3Adm%3Appccp%3DUmFuZG9tSVYkc2RlIyh9YbC4OlOULAnvcrFmvh1xnqM&sid=425297d08b7b784263a7b1f1562e2dd2&dest_id=-652627&dest_type=city&dist=0&group_adults=2&group_children=0&hapos=1&hpos=1&no_rooms=1&req_adults=2&req_children=0&room1=A%2CA&sb_price_type=total&sr_order=popularity&srepoch=1751405754&srpvid=ad81f28e4d15555e9fa27cfe916dd487&type=total&ucfs=1&',
      },
      {
        nome: 'Ligia',
        texto: 'Gostamos de tudo. A atenção dada pelos funcionários foi impecável. Um acolhimento ímpar. Recomendo e volto.',
        data: '2025-01-29',
        origem: 'Booking',
        linkOrigem: 'https://www.booking.com/hotel/br/mamaloo-pousada.pt-br.html?aid=1726433&label=mamaloo-pousada-vvgr3PHO_G2uD_nWNWNRbQS520386729577%3Apl%3Ata%3Ap1%3Ap2%3Aac%3Aap%3Aneg%3Afi%3Atikwd-646375645657%3Alp20086%3Ali%3Adec%3Adm%3Appccp%3DUmFuZG9tSVYkc2RlIyh9YbC4OlOULAnvcrFmvh1xnqM&sid=425297d08b7b784263a7b1f1562e2dd2&dest_id=-652627&dest_type=city&dist=0&group_adults=2&group_children=0&hapos=1&hpos=1&no_rooms=1&req_adults=2&req_children=0&room1=A%2CA&sb_price_type=total&sr_order=popularity&srepoch=1751405754&srpvid=ad81f28e4d15555e9fa27cfe916dd487&type=total&ucfs=1&',
      },
      {
        nome: 'Júlio César A',
        texto: 'Muito atenciosos, gentis, o café é de uma fartura e qualidade ímpares, quarto confortável, localização excelente e preços bons. Recomedadíssima! Voltarei tão logo seja possível.',
        data: '2024-01-04', 
        origem: 'TripAdvisor',
        linkOrigem: 'https://www.tripadvisor.com.br/Profile/j_lioc_sara2024?fid=ae88a9ec-431b-4a02-a0cf-68e889c848ac',
      },
      {
        nome: 'Nalvabt',
        texto: 'Ser recebido por amigos é o sentimento. Os donos moram na pousada e cuidam do estabelecimento como extensão do lar. O contato é sempre muito próximo inclusive no café onde somos servidos a mesa, de acordo com nossa necessidade.',
        data: '2024-01', 
        origem: 'TripAdvisor',
        linkOrigem: 'https://www.tripadvisor.com.br/Profile/nalvabt?fid=0ef0d7eb-0a37-4a2d-b66d-7f7265deb139',
      },
      {
        nome: 'Rubem Stefano',
        texto: 'Local impecável, atendimento fantástico, ambiente familiar!',
        data: '2025-02',
        origem: 'Google Reviews',
        linkOrigem: 'https://maps.app.goo.gl/nU9zLfz8umbRdJnR6', 
      },
      {
        nome: 'Leandro Jose',
        texto: 'Dentre todos os estados do Nordeste que tive a oportunidade de visitar, esta foi, sem dúvida, a melhor pousada em que me hospedei. Atendimento impecável e qualidade excepcional em cada detalhe. Uma experiência realmente memorável!',
        data: '2025-06',
        origem: 'Google Reviews',
        linkOrigem: 'https://maps.app.goo.gl/N6uydKKrhAUbHdRx8', 
      },
      {
        nome: 'Marcela Reis',
        texto: 'A Mamaloo Pousada é muito familiar e aconchegante. Os donos e funcionários fazem-nos sentir em casa. Sempre que vou à Maceió fico lá porque o atendimento é espetacular. Agradeço demais pelo carinho! Vocês fazem nossa estadia muito especial!',
        data: '2025-06',
        origem: 'Google Reviews',
        linkOrigem: 'https://maps.app.goo.gl/Jm2pcYegkNTZaHGg9', 
      },
      {
        nome: 'Adalberto Ikegami',
        texto: 'Pousada bem localizada para quem busca acessar as praias do norte, fora do centro mas não muito distante, vários ótimos restaurantes próximos a menos de 1km de distância…',
        data: '2024-07',
        origem: 'Google Reviews',
        linkOrigem: 'https://maps.app.goo.gl/8fCu42MCY9mM3hxd6', 
      },
    ];

    setComentarios(mockData);
  }, []);

  const totalPaginas = Math.ceil(comentarios.length / comentariosPorPagina);

  const proximaPagina = () => {
    setAnimando(true);
    setTimeout(() => {
      setPaginaAtual((prev) => (prev + 1) % totalPaginas);
      setAnimando(false);
    }, 300);
  };

  const paginaAnterior = () => {
    setAnimando(true);
    setTimeout(() => {
      setPaginaAtual((prev) => (prev - 1 + totalPaginas) % totalPaginas);
      setAnimando(false);
    }, 300);
  };

  const inicio = paginaAtual * comentariosPorPagina;
  const comentariosExibidos = comentarios.slice(inicio, inicio + comentariosPorPagina);

  return (
    <div className="comentarios-slider">
      <button className="seta seta-esquerda" onClick={paginaAnterior}>‹</button>

      <div className={`comentarios-grade ${!animando ? 'mostrar' : ''}`}>
        {comentariosExibidos.map((comentario, index) => (
          <div key={index} className="comentario-card">
            <h4>{comentario.nome}</h4>
            <p className="comentario-texto">"{comentario.texto}"</p>
           
            {/* Exibir origem e link se existirem */}
            {comentario.origem && (
              <p className="comentario-origem">
                
                {comentario.linkOrigem ? (
                  <a href={comentario.linkOrigem} target="_blank" rel="noopener noreferrer">
                    {comentario.origem}
                  </a>
                ) : (
                  <span>{comentario.origem}</span>
                )}
              </p>
            )}
          </div>
        ))}
      </div>

      <button className="seta seta-direita" onClick={proximaPagina}>›</button>
    </div>
  );
};

export default ComentarioCard;