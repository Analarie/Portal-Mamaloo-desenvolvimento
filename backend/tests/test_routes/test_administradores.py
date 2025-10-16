def test_criar_administrador(client, db, admin_data):
    response = client.post("/administradores/", json=admin_data)
    assert response.status_code == 200
    data = response.json()
    assert data["nomeadministrador"] == admin_data["nomeadministrador"]
    assert data["username"] == admin_data["username"]
    assert "senha" not in data 

def test_create_duplicate_username(client, db, admin_data):
    response = client.post("/administradores/", json=admin_data)
    assert response.status_code == 200
    
    response = client.post("/administradores/", json=admin_data)
    assert response.status_code == 400
    assert response.json()["detail"] == "Username já existe"

def test_create_admin_missing_fields(client, db):
    incomplete_data = {
        "username": "incomplete",
        "senha": "password123"
    }
    response = client.post("/administradores/", json=incomplete_data)
    assert response.status_code == 422  # Unprocessable Entity

