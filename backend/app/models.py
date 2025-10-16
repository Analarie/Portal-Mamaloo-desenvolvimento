from sqlalchemy import Column, Integer, String, Text, Numeric, ForeignKey
from .database import Base
from sqlalchemy.orm import relationship

class PontoTuristico(Base):
    __tablename__ = "tab_ponto_turistico"
    
    idpontoturistico = Column(Integer, primary_key=True, index=True)
    nomepontoturistico = Column(String(100), nullable=False)
    descricaopontoturistico = Column(Text, nullable=False)
    imagem_url = Column(String(255), nullable=True)

class Administrador(Base):
    __tablename__ = "tab_administrador"
    
    idadministrador = Column(Integer, primary_key=True, index=True)
    nomeadministrador = Column(String(100), nullable=False)
    username = Column(String(50), unique=True, nullable=False)  
    senha = Column(String(255), nullable=False)


class Quarto(Base):
    __tablename__ = "tab_quartos"

    IdQuarto = Column(Integer, primary_key=True, index=True)
    NomeQuarto = Column(String(50), nullable=False)
    descricaoQuarto = Column(String(250), nullable=False)
    CapacidadeQuarto = Column(Integer, nullable=False)
    ValorQuarto = Column(Numeric(10, 2), nullable=False)
    valorPromocaoQuarto = Column(Numeric(10, 2), nullable=True)
    imagens = relationship("QuartoImagem", back_populates="quarto", cascade="all, delete-orphan")

class QuartoImagem(Base):
    __tablename__ = "tab_quarto_imagens"
    
    IdImagem = Column(Integer, primary_key=True, index=True)
    IdQuarto = Column(Integer, ForeignKey("tab_quartos.IdQuarto"))
    caminhoImagem = Column(String(255), nullable=False)
    quarto = relationship("Quarto", back_populates="imagens")

class Avaliacao(Base):
    __tablename__ = "tab_avaliacao"
    
    idavaliacao = Column(Integer, primary_key=True, index=True)
    nomeavaliacao = Column(String(100), nullable=False)
    comentarioavaliacao = Column(Text, nullable=False)
    respostaavaliacao = Column(Text, nullable=True)
    dataavaliacao = Column(String(50), nullable=False)