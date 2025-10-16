from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import Quarto, QuartoCreate, QuartoUpdate, Administrador, QuartoImagem as QuartoImagemModel
from app.models import Quarto as QuartoModel
from app.auth import obter_atual_administrador
from app.file_uploads import save_uploaded_file
import os 

router = APIRouter(prefix="/quartos", tags=["Quartos"])
from typing import List
from app.models import QuartoImagem


@router.get("/", response_model=List[Quarto])
def ler_quartos(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(QuartoModel).offset(skip).limit(limit).all()


from app.schemas import QuartoImagem  # Certifique-se de importar o schema Pydantic

@router.get("/{quarto_id}/imagens", response_model=List[QuartoImagem])
def listar_imagens_quarto(
    quarto_id: int,
    db: Session = Depends(get_db)
):
    quarto = db.query(QuartoModel).filter_by(IdQuarto=quarto_id).first()
    if not quarto:
        raise HTTPException(status_code=404, detail="Quarto não encontrado")
    
    # Converta os modelos SQLAlchemy para os schemas Pydantic
    imagens = db.query(QuartoImagemModel).filter_by(IdQuarto=quarto_id).all()
    return [QuartoImagem.from_orm(imagem) for imagem in imagens]


@router.post("/", response_model=Quarto)
async def criar_quarto(
    nomequarto: str = Form(...),
    descricaoquarto: str = Form(...),
    capacidadequarto: int = Form(...),
    valorquarto: float = Form(...),
    valorpromocaoquarto: Optional[float] = Form(None),
    imagens: Optional[List[UploadFile]] = File(None),  # Corrigido aqui
    db: Session = Depends(get_db),
    current_admin: Administrador = Depends(obter_atual_administrador)
):
    db_quarto = QuartoModel(
        NomeQuarto=nomequarto,
        descricaoQuarto=descricaoquarto,
        CapacidadeQuarto=capacidadequarto,
        ValorQuarto=valorquarto,
        valorPromocaoQuarto=valorpromocaoquarto
    )
    
    db.add(db_quarto)
    db.commit()
    db.refresh(db_quarto)
    
    # Salva as imagens se existirem
    if imagens:
        for imagem in imagens:
            caminho_imagem = save_uploaded_file(imagem, "quarto")
            db_imagem = QuartoImagem(
                IdQuarto=db_quarto.IdQuarto,
                caminhoImagem=caminho_imagem
            )
            db.add(db_imagem)
    
    db.commit()
    db.refresh(db_quarto)
    return db_quarto


# Adicione um endpoint para adicionar mais imagens a um quarto existente
@router.post("/{quarto_id}/imagens", response_model=QuartoImagem)
async def adicionar_imagem_quarto(
    quarto_id: int,
    imagem: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_admin: Administrador = Depends(obter_atual_administrador)
):
    quarto = db.query(QuartoModel).filter_by(IdQuarto=quarto_id).first()
    if not quarto:
        raise HTTPException(status_code=404, detail="Quarto não encontrado")
    
    caminho_imagem = save_uploaded_file(imagem, "quarto")
    db_imagem = QuartoImagem(
        IdQuarto=quarto_id,
        caminhoImagem=caminho_imagem
    )
    
    db.add(db_imagem)
    db.commit()
    db.refresh(db_imagem)
    return db_imagem

@router.get("/{quarto_id}", response_model=Quarto)
def ler_quarto(quarto_id: int, db: Session = Depends(get_db)):
    quarto = db.query(QuartoModel).filter_by(IdQuarto=quarto_id).first()
    if not quarto:
        raise HTTPException(status_code=404, detail="Quarto não encontrado")
    return quarto


@router.put("/{quarto_id}", response_model=Quarto)
def atualizar_quarto(
    quarto_id: int, 
    quarto_update: QuartoUpdate, 
    db: Session = Depends(get_db), 
    current_admin: Administrador = Depends(obter_atual_administrador)
):
    db_quarto = db.query(QuartoModel).filter_by(IdQuarto=quarto_id).first()
    if not db_quarto:
        raise HTTPException(status_code=404, detail="Quarto não encontrado")
    
    update_data = quarto_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_quarto, key, value)
    
    db.commit()
    db.refresh(db_quarto)
    return db_quarto


@router.delete("/imagens/{imagem_id}")
def deletar_imagem(
    imagem_id: int,
    db: Session = Depends(get_db),
    current_admin: Administrador = Depends(obter_atual_administrador)
):
    imagem = db.query(QuartoImagem).filter_by(IdImagem=imagem_id).first()
    if not imagem:
        raise HTTPException(status_code=404, detail="Imagem não encontrada")
    
    # Remove o arquivo físico
    try:
        if os.path.exists(imagem.caminhoImagem.lstrip('/')):
            os.remove(imagem.caminhoImagem.lstrip('/'))
    except Exception as e:
        print(f"Erro ao remover arquivo: {e}")
    
    db.delete(imagem)
    db.commit()
    return {"message": "Imagem removida com sucesso"}