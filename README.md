# 🌐 Portal Mamaloo - GitOps com ArgoCD

Aplicação full-stack da pousada **Mamaloo** implementada com GitOps usando ArgoCD, Kubernetes e Helm.

## 🛠️ Tecnologias

- **Backend:** FastAPI (Python)
- **Frontend:** React.js + Vite
- **Database:** PostgreSQL
- **Orquestração:** Kubernetes + ArgoCD
- **IaC:** Helm Charts
- **CI/CD:** GitHub Actions (GHCR)
- **Operador:** CloudNative PG  

## 📁 Estrutura

```
Portal-Mamaloo-desenvolvimento/
├── backend/                    # API FastAPI
├── frontend/                   # React + Vite
├── helm/mamaloo-app/          # Helm Chart
│   ├── values-dev.yaml        # Config dev
│   ├── values-prod.yaml       # Config prod
│   └── templates/             # Manifests K8s
├── .github/workflows/         # CI/CD
└── docker-compose.yml         # Dev local
```  

## 🚀 Deploy GitOps

### Repositórios
- **Aplicação:** [Portal-Mamaloo-desenvolvimento](https://github.com/Analarie/Portal-Mamaloo-desenvolvimento)
- **GitOps:** [argocdportal](https://github.com/hivisson1002/argocdportal)

### Ambientes
- **DEV:** `mamaloo-dev` namespace
- **PROD:** `mamaloo-prod` namespace (3 réplicas backend, 2 frontend)

### Features
- ✅ Helm Chart com values dev/prod
- ✅ Secrets do banco via Helm
- ✅ Job de migrations (sync-wave: 5)
- ✅ CI/CD automatizado (tags: `<env>-<sha7>`)
- ✅ Operador CloudNative PG
- ✅ Auto-sync ArgoCD
 
## 👥 Equipe

- **Hebert Ivisson** - [@hivisson1002](https://github.com/hivisson1002)
- **Ana Larissa** - [@Analarie](https://github.com/Analarie)
- **Luis Gustavo** - [@gustavoaidez](https://github.com/gustavoaidez)



