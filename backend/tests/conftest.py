import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.database import Base, get_db

# Use SQLite in-memory database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Dependency override
def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

@pytest.fixture
def admin_data():
    return {
        "nomeadministrador": "Admin Test",
        "username": "admintest", 
        "senha": "testpassword123"
    }

@pytest.fixture
def admin_create_data():
    return {
        "nomeadministrador": "Admin Create",
        "username": "createadmin",
        "senha": "createpass123"
    }

@pytest.fixture(scope="module")
def client():
    # Override the database dependency
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    # Clear overrides after tests
    app.dependency_overrides.clear()

@pytest.fixture(scope="function")
def db():
    # Create all tables
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    yield db
    # Clean up after test
    db.close()
    Base.metadata.drop_all(bind=engine)