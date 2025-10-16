from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import PontoTuristico, PontoTuristicoCreate, Administrador
from app.models import PontoTuristico as PontoModel
from app.auth import obter_atual_administrador
from app.file_uploads import save_uploaded_file

router = APIRouter(prefix="/pontos-turisticos", tags=["Pontos Turísticos"])

@router.get("/", response_model=list[PontoTuristico])
def obter_tudo(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(PontoModel).offset(skip).limit(limit).all()

@router.get("/{ponto_id}", response_model=PontoTuristico)
def obter_pelo_id(ponto_id: int, db: Session = Depends(get_db)):
    ponto = db.query(PontoModel).filter_by(idpontoturistico=ponto_id).first()
    if not ponto:
        raise HTTPException(status_code=404, detail="Ponto turístico não encontrado")
    return ponto

@router.post("/", response_model=PontoTuristico)
async def criar_ponto(
    nomepontoturistico: str = Form(...),
    descricaopontoturistico: str = Form(...),
    imagem: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_admin: Administrador = Depends(obter_atual_administrador)
):
    imagem_url = None
    if imagem:
        imagem_url = save_uploaded_file(imagem, "ponto_turistico")
    
    db_ponto = PontoModel(
        nomepontoturistico=nomepontoturistico,
        descricaopontoturistico=descricaopontoturistico,
        imagem_url=imagem_url
    )
    
    db.add(db_ponto)
    db.commit()
    db.refresh(db_ponto)
    return db_ponto
