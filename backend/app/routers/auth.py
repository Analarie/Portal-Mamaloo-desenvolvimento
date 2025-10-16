from datetime import datetime, timedelta
from typing import Optional
import warnings
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Administrador
from app.schemas import TokenData, Token
from fastapi.responses import JSONResponse


# Ignora o aviso do bcrypt
warnings.filterwarnings("ignore", message=".*error reading bcrypt version.*")

router = APIRouter()

# Configurações de segurança
SECRET_KEY = "sua-chave-secreta-super-segura"  # Em produção, use variável de ambiente
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Configuração do contexto de senha
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Configuração do esquema OAuth2
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")

def verificar_senha(senha_simples: str, senha_hashed: str) -> bool:
    """Verifica se a senha corresponde ao hash armazenado"""
    return pwd_context.verify(senha_simples, senha_hashed)

def obter_senha_hash(password: str) -> str:
    """Gera o hash da senha"""
    return pwd_context.hash(password)

def autenticar_administrador(db: Session, username: str, password: str) -> Optional[Administrador]:
    """Autentica um administrador"""
    administrador = db.query(Administrador).filter(Administrador.username == username).first()
    if not administrador:
        return None
    if not verificar_senha(password, administrador.senha):
        return None
    return administrador

def criar_acesso_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Cria um token JWT"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def obter_atual_administrador(
    token: str = Depends(oauth2_scheme), 
    db: Session = Depends(get_db)
) -> Administrador:
    """Obtém o administrador atual baseado no token"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Não foi possível validar as credenciais",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    
    administrador = db.query(Administrador).filter(Administrador.username == token_data.username).first()
    if administrador is None:
        raise credentials_exception
    return administrador


@router.post("/token", response_model=Token)
async def login_para_acesso_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """Endpoint para login com tratamento CORS"""
    try:
        administrador = autenticar_administrador(db, form_data.username, form_data.password)
        if not administrador:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Usuário ou senha incorretos",
            )
        
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = criar_acesso_token(
            data={"sub": administrador.username},
            expires_delta=access_token_expires
        )
        
        response = JSONResponse({
            "access_token": access_token,
            "token_type": "bearer"
        })
        
        # Configurações CORS para a resposta
        response.headers["Access-Control-Allow-Origin"] = "http://localhost:5185"
        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Access-Control-Allow-Methods"] = "POST, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
        
        return response

    except Exception as e:
        response = JSONResponse(
            {"detail": str(e)},
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
        response.headers["Access-Control-Allow-Origin"] = "http://localhost:5185"
        return response


@router.options("/token")
async def options_token():
    """Endpoint para lidar com requisições OPTIONS (preflight)"""
    response = JSONResponse({"message": "OK"})
    response.headers["Access-Control-Allow-Origin"] = "http://localhost:5185"
    response.headers["Access-Control-Allow-Methods"] = "POST, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    return response

@router.get("/eu")
async def ler_administrador_atual(
    current_administrador: Administrador = Depends(obter_atual_administrador)
):
    """Endpoint para obter informações do administrador logado"""
    return current_administrador