# 🌐 Portal Mamaloo

Este repositório contém uma aplicação full-stack da pousada **Mamaloo**, combinando tecnologias modernas no backend e frontend para fornecer uma interface eficiente e escalável.

---

## ✅ Tecnologias Utilizadas

- **Backend:** FastAPI (Python)  
- **Frontend:** React.js com Vite  
- **Banco de Dados:** PostgreSQL  
- **Docker:** Gerenciamento de containers e ambiente isolado  
- **CI/CD:** GitHub Actions para automação de testes, build e deploy  

---

## 🗂️ Estrutura do Projeto

```
PORTAL-MAMALOO/
│
├── backend/                        # Código do backend em FastAPI
├── frontend/                       # Código do frontend em React + Vite
├── .github/                        # Configurações de CI/CD com GitHub Actions
│   └── workflows/
│       └── ci-cd.yml               # Pipeline de deploy automático
├── .env                            # Variáveis de ambiente
├── .gitignore                      # Arquivos e pastas ignorados pelo Git
└── docker-compose.yml              # Orquestração dos containers (frontend, backend, banco)
```

### 📄 Descrição das Pastas e Arquivos

- `backend/`: Backend em **FastAPI** com rotas de API e lógica de negócio.  
- `frontend/`: Frontend com **React.js + Vite** para construção da interface.  
- `docker-compose.yml`: Orquestra os serviços da aplicação com **Docker**, incluindo redes, volumes e portas.  
- `.github/workflows/ci-cd.yml`: Define o pipeline de **CI/CD** automatizado com GitHub Actions.  
- `.env`: Contém **variáveis sensíveis** como senhas, URLs e credenciais dos containers.  
- `.gitignore`: Lista arquivos e pastas que **não devem ser versionados**.  

---

## ⚙️ Requisitos

Antes de executar o projeto, certifique-se de ter instalado:

- [Docker](https://www.docker.com/)  
- [Git](https://git-scm.com/)  
- [Python 3.9](https://www.python.org/downloads/release/python-390/)  
- [Node.js 16.x](https://nodejs.org/en)  

---

## 🚀 Como Executar o Projeto

### 1. Clonar o Repositório

```bash
git clone https://github.com/PousadaMamalooPortal/Portal-Mamaloo
```

### 2. Construir e Executar os Containers

```bash
docker-compose up -d --build
```

#### O que esse comando faz

- Constrói e inicia os containers definidos no `docker-compose.yml`  
- Executa em segundo plano (`-d`)  
- Força a reconstrução das imagens (`--build`)  
- Orquestra o backend, frontend e banco de dados  

---

### 3. Links de Acesso

- **Frontend:** [http://localhost:5173](http://localhost:5173)  
- **Backend:** [http://localhost:8000](http://localhost:8000)  
- **Banco de Dados:** disponível na porta `5432`  
  - Use ferramentas como **pgAdmin** ou **DBeaver** para se conectar
 
---
## Autores

<table align="center">
  <tr>
    <td align="center">
      <a href="https://github.com/farias-alan" target="_blank">
        <img src="https://avatars.githubusercontent.com/u/131487024?v=4" alt="Antonio Alan" width="100"><br>
        <strong>Antonio Alan</strong>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/Adenilson666" target="_blank">
        <img src="https://avatars.githubusercontent.com/u/113057115?v=4" alt="Adenilson Silva" width="100"><br>
        <strong>Adenilson Silva</strong>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/caymiferreira" target="_blank">
        <img src="https://avatars.githubusercontent.com/u/118706075?v=4" alt="Caymi Ferreira" width="100"><br>
        <strong>Caymi Ferreira</strong>
      </a>
    </td>
  </tr>
  <tr>
    <td align="center">
      <a href="https://github.com/gustavoataidez" target="_blank">
        <img src="https://avatars.githubusercontent.com/u/119441489?v=4" alt="Gustavo Ataide" width="100"><br>
        <strong>Gustavo Ataide</strong>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/account" target="_blank">
        <img src="https://avatars.githubusercontent.com/u/119441082?v=4" alt="Hebert Ivison" width="100"><br>
        <strong>Hebert Ivison</strong>
      </a>
    </td>
  </tr>
</table>
<hr/>



