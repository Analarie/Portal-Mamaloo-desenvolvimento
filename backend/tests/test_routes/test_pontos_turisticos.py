import pytest
from app.models import PontoTuristico, Administrador
from app.auth import criar_acesso_token

@pytest.fixture
def ponto_data():
    return {
        "nomepontoturistico": "Ponto Teste",
        "descricaopontoturistico": "Descrição teste"
    }

def test_obter_tudo_pontos(client, db, ponto_data):
    # Cria um ponto turístico
    ponto = PontoTuristico(**ponto_data)
    db.add(ponto)
    db.commit()
    
    # Testa listagem
    response = client.get("/pontos-turisticos/")
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["nomepontoturistico"] == ponto_data["nomepontoturistico"]

def test_get_ponto_by_id(client, db, ponto_data):
    # Cria e busca por ID
    ponto = PontoTuristico(**ponto_data)
    db.add(ponto)
    db.commit()
    
    response = client.get(f"/pontos-turisticos/{ponto.idpontoturistico}")
    assert response.status_code == 200
    assert response.json()["nomepontoturistico"] == ponto_data["nomepontoturistico"]

def test_create_ponto_turistico(client, db, admin_data, ponto_data):
    # Cria admin e gera token
    admin = Administrador(**admin_data)
    db.add(admin)
    db.commit()
    token = criar_acesso_token({"sub": admin_data["username"]})
    
    # Testa criação com autenticação usando Form data
    response = client.post(
        "/pontos-turisticos/",
        headers={"Authorization": f"Bearer {token}"},
        data={
            "nomepontoturistico": ponto_data["nomepontoturistico"],
            "descricaopontoturistico": ponto_data["descricaopontoturistico"]
        }
    )
    assert response.status_code == 200
    assert response.json()["nomepontoturistico"] == ponto_data["nomepontoturistico"]