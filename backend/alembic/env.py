from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context
import os
import sys

# Adiciona o diretório "app" ao path para importar modules corretamente
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'app'))

# Importa a base e os models
from app.database import Base  # app.database
import app.models  # app.models

# Configuração do Alembic
config = context.config
fileConfig(config.config_file_name)

# Define os metadados que o Alembic vai usar para gerar migrations
target_metadata = Base.metadata

# Atualiza a URL com a variável de ambiente DATABASE_URL (vinda do docker-compose)
db_url = os.getenv("DATABASE_URL")
if db_url:
    config.set_main_option("sqlalchemy.url", db_url)

def run_migrations_offline():
    """Executa as migrations no modo offline (sem conexão real com o banco)."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        compare_type=True,
    )

    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online():
    """Executa as migrations no modo online (conectado ao banco)."""
    connectable = engine_from_config(
        config.get_section(config.config_ini_section),
        prefix='sqlalchemy.',
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True
        )

        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
