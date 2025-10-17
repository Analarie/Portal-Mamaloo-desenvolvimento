import click
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import SessionLocal, engine, Base
from app.models import Administrador
from app.logging_config import LOGGER

@click.group()
def cli():
    """Comandos administrativos da Pousada Mamaloo"""
    pass

@cli.command()
@click.option('--username', prompt='Username do admin', help='Username do administrador')
@click.option('--senha', prompt=True, hide_input=True, help='Senha do admin')
def create_admin(username, senha):
    """Cria um novo administrador"""
    db = SessionLocal()
    try:
        existing = db.query(Administrador).filter(Administrador.username == username).first()
        if existing:
            LOGGER.warning(f"Admin com username '{username}' já existe!")
            click.echo(f"❌ Admin com username '{username}' já existe!")
            return
        
        admin = Administrador(
            username=username,
            nomeadministrador=username,
            senha=senha
        )
        
        db.add(admin)
        db.commit()
        LOGGER.info(f"Admin criado: {username}")
        click.echo(f"✅ Admin criado com sucesso: {username}")
    except Exception as e:
        LOGGER.error(f"Erro ao criar admin: {e}", exc_info=True)
        click.echo(f"❌ Erro: {e}")
        db.rollback()
    finally:
        db.close()

@cli.command()
def init_database():
    """Inicializa o banco de dados"""
    try:
        Base.metadata.create_all(bind=engine)
        LOGGER.info("Banco de dados inicializado")
        click.echo("✅ Banco de dados inicializado!")
    except Exception as e:
        LOGGER.error(f"Erro ao inicializar BD: {e}", exc_info=True)
        click.echo(f"❌ Erro: {e}")

@cli.command()
def clean_uploads():
    """Limpa diretório de uploads"""
    from pathlib import Path
    
    uploads_dir = Path("uploads")
    if not uploads_dir.exists():
        click.echo("ℹ️  Diretório uploads não existe")
        return
    
    removed = 0
    try:
        for file in uploads_dir.rglob("*"):
            if file.is_file():
                file.unlink()
                removed += 1
        LOGGER.info(f"Limpeza de uploads: {removed} arquivos removidos")
        click.echo(f"✅ {removed} arquivos removidos de uploads/")
    except Exception as e:
        LOGGER.error(f"Erro ao limpar uploads: {e}", exc_info=True)
        click.echo(f"❌ Erro: {e}")

if __name__ == '__main__':
    cli()
