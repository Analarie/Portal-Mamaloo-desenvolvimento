import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="rodape">
      <div className="rodape-conteudo">

        
        <div className="rodape-coluna">
          <h3 className="titulo-secao">Informações</h3>
          <p className="info-item">R. Dr. Waldemiro Alencar Jr, 126 - Jatiúca</p>
          <p className="info-item">Maceió - AL, 57035-860</p>
          <p className="info-item">
            Email: <a href="mailto:mamaloo@gmail.com">mamaloo@gmail.com</a>
          </p>
        </div>

        
        <div className="rodape-coluna">
          <h3 className="titulo-secao">Mídias sociais</h3>
          <div className="redes-sociais">
            
            <a href="https://pt-br.facebook.com/mamaloopousada/" target="_blank" rel="noopener noreferrer" className="icone-social-wrapper">
              <img src="/assets/icones/mamaloo-icone-facebook.png" alt="Facebook" className="icone-social" />
            </a>
            
            <a href="https://www.instagram.com/mamaloopousada/" target="_blank" rel="noopener noreferrer" className="icone-social-wrapper">
              <img src="/assets/icones/mamaloo-icone-instagram.png" alt="Instagram" className="icone-social" />
            </a>
            
            <a href="mailto:mamaloo@gmail.com" className="icone-social-wrapper">
              <img src="/assets/icones/mamaloo-icone-email.png" alt="Email" className="icone-social" />
            </a>
           
            <a href="https://api.whatsapp.com/send?phone=558232971407" target="_blank" rel="noopener noreferrer" className="icone-social-wrapper">
              <img src="/assets/icones/mamaloo-icone-whats.png" alt="WhatsApp" className="icone-social" />
            </a>
          </div>
        </div>

        
        <div className="rodape-coluna">
          <h3 className="titulo-secao">Parceiros</h3>
          <div className="logos-parceiros">
            <img src="/assets/cinfo.png" alt="CINFO" />
            <img src="/assets/ifal.png" alt="IFAL" />
          </div>
        </div>

      </div>
      <div className="linha-separadora"></div>
      
      <p className="rodape-footer-final">
        2025 © Todos os direitos reservados. <br />Desenvolvido por: Alunos IFAL
      </p>

    </footer>
  );
};

export default Footer;