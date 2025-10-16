from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi
from app.routers import auth, administradores, quartos, pontos_turisticos, avaliacoes
from app.database import init_db
from fastapi.staticfiles import StaticFiles
import os
from contextlib import asynccontextmanager
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

# ✅ CORS configurado corretamente
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5185,http://127.0.0.1:5185"
).split(",")

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield

app = FastAPI(
    lifespan=lifespan,
    title="API da Pousada Mamaloo",
    description="Sistema para gestão de quartos, pontos turísticos e avaliações.",
    version="1.0.0",
    openapi_tags=[
        {"name": "Autenticação", "description": "Operações de login e geração de token."},
        {"name": "Administradores", "description": "Gerenciamento de administradores."},
        {"name": "Quartos", "description": "Operações de criação, leitura e atualização de quartos."},
        {"name": "Pontos Turísticos", "description": "Listagem e cadastro de pontos turísticos."},
        {"name": "Avaliações", "description": "Envio e resposta de avaliações."},
    ]
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)

def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    
    openapi_schema = get_openapi(
        title=app.title,
        version=app.version,
        description=app.description,
        routes=app.routes,
    )
    
    openapi_schema["info"]["x-logo"] = {
        "url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRWmxw9kQfZj-3Roe7XE6LliSkTFfmRzBd0w&s",
        "altText": "Pousada Mamaloo Logo"
    }
    
    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi

@app.get("/", tags=["Inicial"])
async def health_check():
    return {"status": "Funcionando"}

# ✅ CORRETO - Sem os.makedirs
uploads_path = Path("uploads")
if uploads_path.exists():
    app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(auth.router, prefix="/auth", tags=["Autenticação"])
app.include_router(administradores.router)
app.include_router(quartos.router)
app.include_router(pontos_turisticos.router)
app.include_router(avaliacoes.router)

# Configuração do tema Swagger UI
app.swagger_ui_parameters = {
    "syntaxHighlight.theme": "obsidian",
    "tryItOutEnabled": True,
    "displayRequestDuration": True,
    "filter": True,
    "theme": {
        "css": {
            "swagger-ui": """
                :root {
                    --swagger-ui-theme-color: #E67E22;
                    --swagger-ui-theme-color-hover: #D35400;
                    --swagger-ui-background-color: #F5F5F5;
                    --swagger-ui-text-color: #333;
                    --swagger-ui-border-color: #D5D5D5;
                    --swagger-ui-header-bg-color: #5D4037;
                    --swagger-ui-header-text-color: #FFF;
                    --swagger-ui-tag-bg-color: #8D6E63;
                    --swagger-ui-tag-text-color: #FFF;
                    --swagger-ui-input-bg-color: #FFF;
                    --swagger-ui-input-border-color: #D5D5D5;
                    --swagger-ui-input-text-color: #333;
                    --swagger-ui-success-color: #2E7D32;
                    --swagger-ui-error-color: #C62828;
                }
                .opblock-summary-control:focus {
                    outline: 2px solid var(--swagger-ui-theme-color);
                }
                .opblock-tag {
                    background-color: var(--swagger-ui-tag-bg-color);
                    color: var(--swagger-ui-tag-text-color);
                    border-radius: 4px;
                    padding: 4px 8px;
                }
                .topbar {
                    background-color: var(--swagger-ui-header-bg-color);
                }
                .topbar-wrapper img {
                    content:url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRWmxw9kQfZj-3Roe7XE6LliSkTFfmRzBd0w&s');
                    height: 40px;
                }
                .btn {
                    background: var(--swagger-ui-theme-color);
                }
                .btn:hover {
                    background: var(--swagger-ui-theme-color-hover);
                }
            """
        }
    }
}