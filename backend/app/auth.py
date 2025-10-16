from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta
from typing import Optional
from . import schemas, models
from .database import SessionLocal, get_db
from sqlalchemy.orm import Session

# Configurações (altere para sua chave secreta em produção)
SECRET_KEY = "sua_chave_secreta_super_segura"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def verificar_senha(senha_simples, senha_hashed):
    return pwd_context.verify(senha_simples, senha_hashed)

def obter_senha_hash(password):
    return pwd_context.hash(password)

def get_administrador(db: Session, username: str):
    return db.query(models.Administrador).filter(models.Administrador.username == username).first()

def autenticar_administrador(db: Session, username: str, password: str):
    administrador = get_administrador(db, username)
    if not administrador:
        return False
    if not verificar_senha(password, administrador.senha):
        return False
    return administrador

def criar_acesso_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def obter_atual_administrador(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = schemas.TokenData(username=username)
    except JWTError:
        raise credentials_exception
    
    administrador = get_administrador(db, username=token_data.username)
    if administrador is None:
        raise credentials_exception
    return administrador