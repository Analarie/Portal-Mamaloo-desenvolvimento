from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import AdministradorCreate, Administrador
from app.models import Administrador as AdministradorModel
from app.auth import obter_senha_hash, obter_atual_administrador
from fastapi import status

router = APIRouter(
    prefix="/administradores",
    tags=["Administradores"]
)  # Removido o Depends(obter_atual_administrador) aqui

@router.post("/", response_model=Administrador, status_code=201)
async def criar_administrador(
    administrador: AdministradorCreate,  # Use o schema correto
    db: Session = Depends(get_db)
):
    """Cria um novo administrador (SEM autenticação)"""
    if db.query(AdministradorModel).filter_by(username=administrador.username).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username já existe"
        )

    db_admin = AdministradorModel(
        nomeadministrador=administrador.nomeadministrador,
        username=administrador.username,
        senha=obter_senha_hash(administrador.senha)
    )
    
    db.add(db_admin)
    db.commit()
    db.refresh(db_admin)
    return db_admin

@router.get("/", response_model=list[Administrador])
def listar_administradores(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_admin: Administrador = Depends(obter_atual_administrador) 
):
    return db.query(AdministradorModel).offset(skip).limit(limit).all()