import os
from fastapi import HTTPException, UploadFile
from datetime import datetime

UPLOAD_DIR_QUARTOS = "uploads/quartos"
UPLOAD_DIR_PONTOS = "uploads/pontos_turisticos"

ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"]

def save_uploaded_file(file: UploadFile, tipo: str) -> str:
    # Verifica o tipo do arquivo
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(status_code=400, detail="Tipo de arquivo não suportado")
    
    if tipo == "quarto":
        upload_dir = UPLOAD_DIR_QUARTOS
    elif tipo == "ponto_turistico":
        upload_dir = UPLOAD_DIR_PONTOS
    else:
        raise ValueError("Tipo de upload inválido")
    
    os.makedirs(upload_dir, exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    # Mantém a extensão original do arquivo
    filename = f"{timestamp}_{file.filename}"
    file_path = os.path.join(upload_dir, filename)
    
    with open(file_path, "wb") as buffer:
        buffer.write(file.file.read())
    
    return f"/{file_path}"