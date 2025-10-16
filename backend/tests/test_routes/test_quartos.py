import pytest
from app.models import Quarto, Administrador
from app.auth import criar_acesso_token

@pytest.fixture
def quarto_data():
    return {
        "NomeQuarto": "Quarto Teste",
        "descricaoQuarto": "Descrição teste",
        "CapacidadeQuarto": 2,
        "ValorQuarto": 100.0
    }

def test_obter_tudo_quartos(client, db, quarto_data):
    # Cria um quarto
    quarto = Quarto(**quarto_data)
    db.add(quarto)
    db.commit()
    
    # Testa listagem
    response = client.get("/quartos/")
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["NomeQuarto"] == quarto_data["NomeQuarto"]

def test_get_quarto_by_id(client, db, quarto_data):
    # Cria e busca por ID
    quarto = Quarto(**quarto_data)
    db.add(quarto)
    db.commit()
    
    response = client.get(f"/quartos/{quarto.IdQuarto}")
    assert response.status_code == 200
    assert response.json()["NomeQuarto"] == quarto_data["NomeQuarto"]

def test_create_quarto(client, db, admin_data, quarto_data):
    # Cria admin e gera token
    admin = Administrador(**admin_data)
    db.add(admin)
    db.commit()
    token = criar_acesso_token({"sub": admin_data["username"]})
    
    # Testa criação com autenticação usando Form data
    response = client.post(
        "/quartos/",
        headers={"Authorization": f"Bearer {token}"},
        data={
            "nomequarto": quarto_data["NomeQuarto"],
            "descricaoquarto": quarto_data["descricaoQuarto"],
            "capacidadequarto": str(quarto_data["CapacidadeQuarto"]),
            "valorquarto": str(quarto_data["ValorQuarto"])
        }
    )
    assert response.status_code == 200
    assert response.json()["NomeQuarto"] == quarto_data["NomeQuarto"]

def test_update_quarto(client, db, admin_data, quarto_data):
    # Cria admin, quarto e gera token
    admin = Administrador(**admin_data)
    db.add(admin)
    quarto = Quarto(**quarto_data)
    db.add(quarto)
    db.commit()
    token = criar_acesso_token({"sub": admin_data["username"]})
    
    # Dados para atualização
    update_data = {"NomeQuarto": "Quarto Atualizado", "ValorQuarto": 150.0}
    
    # Testa atualização
    response = client.put(
        f"/quartos/{quarto.IdQuarto}",
        headers={"Authorization": f"Bearer {token}"},
        json=update_data
    )
    assert response.status_code == 200
    assert response.json()["NomeQuarto"] == "Quarto Atualizado"
    assert response.json()["ValorQuarto"] == 150.0