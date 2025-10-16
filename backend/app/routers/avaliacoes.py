from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import Avaliacao, AvaliacaoCreate, AvaliacaoUpdate, Administrador
from app.models import Avaliacao as AvaliacaoModel
from app.auth import obter_atual_administrador

router = APIRouter(prefix="/avaliacoes", tags=["Avaliações"])

@router.get("/", response_model=list[Avaliacao])
def obter_tudo(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(AvaliacaoModel).offset(skip).limit(limit).all()

@router.get("/{avaliacao_id}", response_model=Avaliacao)
def obter_pelo_id(avaliacao_id: int, db: Session = Depends(get_db)):
    avaliacao = db.query(AvaliacaoModel).filter_by(idavaliacao=avaliacao_id).first()
    if not avaliacao:
        raise HTTPException(status_code=404, detail="Avaliação não encontrada")
    return avaliacao

@router.post("/", response_model=Avaliacao)
def criar(avaliacao: AvaliacaoCreate, db: Session = Depends(get_db)):
    db_avaliacao = AvaliacaoModel(**avaliacao.model_dump())
    db.add(db_avaliacao)
    db.commit()
    db.refresh(db_avaliacao)
    return db_avaliacao

@router.put("/{avaliacao_id}", response_model=Avaliacao)
def update(avaliacao_id: int, avaliacao_update: AvaliacaoUpdate, db: Session = Depends(get_db), current_admin: Administrador = Depends(obter_atual_administrador)):
    db_avaliacao = db.query(AvaliacaoModel).filter_by(idavaliacao=avaliacao_id).first()
    if not db_avaliacao:
        raise HTTPException(status_code=404, detail="Avaliação não encontrada")
    db_avaliacao.respostaavaliacao = avaliacao_update.respostaavaliacao
    db.commit()
    db.refresh(db_avaliacao)
    return db_avaliacao