import click
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import SessionLocal, engine, Base
from app.models import User  # Importe seus models
import logging

logger = logging.getLogger("mamaloo")

@click.group()
def cli():
    """Comandos administrativos da Pousada Mamaloo"""
    pass

@cli.command()
@click.option('--email', prompt='Email do admin', help='Email do administrador')
@click.option('--password', prompt=True, hide_input=True, help='Senha do admin')
def create_admin(email, password):
    """Cria um novo administrador"""
    db = SessionLocal()
    try:
        # Verificar se já existe
        existing = db.query(User).filter(User.email == email).first()
        if existing:
            click.echo(f"❌ Admin com email '{email}' já existe!")
            return
        
        # Criar novo admin (ajuste conforme seu modelo)
        admin = User(email=email, is_admin=True)
        admin.set_password(password)  # Se tiver esse método
        
        db.add(admin)
        db.commit()
        click.echo(f"✅ Admin criado com sucesso: {email}")
    except Exception as e:
        logger.error(f"Erro ao criar admin: {e}")
        click.echo(f"❌ Erro: {e}")
    finally:
        db.close()

@cli.command()
def init_database():
    """Inicializa o banco de dados"""
    Base.metadata.create_all(bind=engine)
    click.echo("✅ Banco de dados inicializado!")

@cli.command()
def clean_uploads():
    """Limpa diretório de uploads antigos"""
    import os
    from pathlib import Path
    
    uploads_dir = Path("uploads")
    if not uploads_dir.exists():
        click.echo("ℹ️  Diretório uploads não existe")
        return
    
    removed = 0
    for file in uploads_dir.rglob("*"):
        if file.is_file():
            file.unlink()
            removed += 1
    
    click.echo(f"✅ {removed} arquivos removidos de uploads/")

if __name__ == '__main__':
    cli()