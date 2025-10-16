from pydantic import BaseModel, ConfigDict
from typing import Optional
from fastapi import UploadFile
from typing import List

class PontoTuristicoBase(BaseModel):
    nomepontoturistico: str
    descricaopontoturistico: str

class PontoTuristicoCreate(PontoTuristicoBase):
    imagem: UploadFile = None

class PontoTuristico(PontoTuristicoBase):
    idpontoturistico: int
    imagem_url: Optional[str] = None
    
class Config:
    model_config = ConfigDict(from_attributes=True)



class AdministradorBase(BaseModel):
    nomeadministrador: str
    username: str

class AdministradorCreate(AdministradorBase):
    senha: str
    model_config = ConfigDict(from_attributes=True) 

class Administrador(AdministradorBase):
    idadministrador: int
    model_config = ConfigDict(from_attributes=True)

class LoginSchema(BaseModel):
    username: str
    senha: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None




class QuartoImagemBase(BaseModel):
    caminhoImagem: str

class QuartoImagemCreate(QuartoImagemBase):
    pass

class QuartoImagem(QuartoImagemBase):
    IdImagem: int
    IdQuarto: int
    
    model_config = ConfigDict(from_attributes=True)

class QuartoBase(BaseModel):
    NomeQuarto: str
    descricaoQuarto: str
    CapacidadeQuarto: int
    ValorQuarto: float
    valorPromocaoQuarto: Optional[float] = None

class QuartoCreate(QuartoBase):
    imagens: List[UploadFile] = []

class Quarto(QuartoBase):
    IdQuarto: int
    imagens: List[QuartoImagem] = []
    
    model_config = ConfigDict(from_attributes=True)

class QuartoUpdate(BaseModel):
    NomeQuarto: Optional[str] = None
    descricaoQuarto: Optional[str] = None
    CapacidadeQuarto: Optional[int] = None
    ValorQuarto: Optional[float] = None
    valorPromocaoQuarto: Optional[float] = None


class AvaliacaoBase(BaseModel):
    nomeavaliacao: str
    comentarioavaliacao: str
    dataavaliacao: str
    # captcha: str  # Adicionando o campo para o CAPTCHA

class AvaliacaoCreate(AvaliacaoBase):
    pass

class Avaliacao(AvaliacaoBase):
    idavaliacao: int
    respostaavaliacao: Optional[str] = None

    model_config = ConfigDict(from_attributes=True) 

class AvaliacaoUpdate(BaseModel):
    respostaavaliacao: str