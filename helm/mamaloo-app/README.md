# Portal Mamaloo - Helm Chart

Helm Chart para orquestração e implantação da aplicação Portal Mamaloo em clusters Kubernetes.

## Visão Geral

Este Helm Chart automatiza o deployment da aplicação Portal Mamaloo em ambientes Kubernetes, empacotando todos os manifestos necessários para:

- **Backend**: API FastAPI
- **Frontend**: Aplicação Vue.js/Vite
- **Database**: PostgreSQL 15
- **Migrations**: Jobs de migração de banco de dados
- **Ingress**: Roteamento HTTP/HTTPS

## Estrutura

```
helm/mamaloo-app/
├── Chart.yaml                    # Metadados do chart
├── values.yaml                   # Valores padrão
├── values-dev.yaml               # Overrides para desenvolvimento
├── values-prod.yaml              # Overrides para produção
├── .helmignore                   # Arquivos ignorados no empacotamento
├── templates/
│   ├── _helpers.tpl             # Funções auxiliares de template
│   ├── backend-deployment.yaml   # Deployment do backend
│   ├── backend-service.yaml      # Service do backend
│   ├── frontend-deployment.yaml  # Deployment do frontend
│   ├── frontend-service.yaml     # Service do frontend
│   ├── database-statefulset.yaml # StatefulSet do PostgreSQL
│   ├── database-service.yaml     # Service do database
│   ├── database-secret.yaml      # Secrets do database
│   ├── migrations-job.yaml       # Job de migrations
│   └── ingress.yaml              # Ingress para roteamento
└── README.md                     # Este arquivo
```