# Portal Mamaloo - Helm Chart Setup Guide

## 📋 Visão Geral

Este diretório contém o Helm Chart completo para orquestração do Portal Mamaloo em Kubernetes. O chart está pronto para produção e segue as melhores práticas do Helm.

## 📂 Estrutura de Arquivos

```
helm/mamaloo-app/
├── Chart.yaml                      # Metadados do Helm Chart
├── values.yaml                     # Valores padrão (desenvolvimento)
├── values-dev.yaml                 # Overrides para ambiente DEV
├── values-prod.yaml                # Overrides para ambiente PROD
├── values-custom.yaml.example      # Exemplo de customização
├── .helmignore                     # Arquivos ignorados no empacotamento
├── deploy.sh                       # Script de deployment automático
├── validate-chart.sh               # Script de validação
├── README.md                       # Documentação completa
├── SETUP_GUIDE.md                 # Este arquivo
└── templates/
    ├── _helpers.tpl               # Funções auxiliares Helm
    ├── backend-deployment.yaml    # Deployment da API
    ├── backend-service.yaml       # Service do Backend
    ├── frontend-deployment.yaml   # Deployment da UI
    ├── frontend-service.yaml      # Service do Frontend
    ├── database-statefulset.yaml  # StatefulSet do PostgreSQL
    ├── database-service.yaml      # Service do Database
    ├── database-secret.yaml       # Secrets (credenciais)
    ├── migrations-job.yaml        # Job de Migrations
    └── ingress.yaml               # Ingress (HTTP/HTTPS)
```

## 🚀 Quick Start

### 1. Validar Chart (Recomendado)

```bash
cd helm/mamaloo-app
chmod +x validate-chart.sh
./validate-chart.sh dev
```

### 2. Deploy em Desenvolvimento

```bash
chmod +x deploy.sh
./deploy.sh dev
```

### 3. Deploy em Produção

```bash
./deploy.sh prod
```

### 4. Verificar Status

```bash
# Status geral
kubectl get all -n mamaloo-dev

# Logs do backend
kubectl logs -n mamaloo-dev -l app.kubernetes.io/component=backend -f

# Logs do frontend
kubectl logs -n mamaloo-dev -l app.kubernetes.io/component=frontend -f

# Status dos pods
kubectl get pods -n mamaloo-dev -o wide
```

## 🔧 Configurações por Ambiente

### Desenvolvimento (`values-dev.yaml`)

| Configuração | Valor |
|---|---|
| Replicas | 1 |
| CPU (request/limit) | 100m / 200m |
| Memory (request/limit) | 64Mi / 128Mi |
| Database | 2Gi |
| Autoscaling | ❌ Desativado |
| TLS | ❌ Desativado |

**Comandos:**
```bash
helm install mamaloo ./helm/mamaloo-app \
  -n mamaloo-dev \
  -f helm/mamaloo-app/values-dev.yaml
```

### Produção (`values-prod.yaml`)

| Configuração | Valor |
|---|---|
| Replicas | 3 |
| CPU (request/limit) | 500m / 1000m |
| Memory (request/limit) | 512Mi / 1Gi |
| Database | 20Gi |
| Autoscaling | ✅ Habilitado (3-10) |
| TLS | ✅ Habilitado |

**Comandos:**
```bash
helm install mamaloo ./helm/mamaloo-app \
  -n mamaloo-prod \
  -f helm/mamaloo-app/values-prod.yaml
```

## 🔐 Segurança - Senhas e Secrets

### ⚠️ IMPORTANTE: Nunca commitar senhas em valores-prod.yaml

**Método 1: Arquivo separado não versionado**
```bash
# Criar arquivo local (não commitar)
cat > values-prod-secrets.yaml <<EOF
database:
  password: "sua-senha-super-secreta-aqui"
EOF

# Instalar
helm install mamaloo ./helm/mamaloo-app \
  -n mamaloo-prod \
  -f helm/mamaloo-app/values-prod.yaml \
  -f values-prod-secrets.yaml

# Adicionar ao .gitignore
echo "values-prod-secrets.yaml" >> .gitignore
```

**Método 2: Variáveis de ambiente**
```bash
export DB_PASSWORD="sua-senha-aqui"

helm install mamaloo ./helm/mamaloo-app \
  -n mamaloo-prod \
  -f helm/mamaloo-app/values-prod.yaml \
  --set database.password=$DB_PASSWORD
```

**Método 3: Secret Externo Kubernetes**
```bash
# Criar secret
kubectl create secret generic mamaloo-db-creds \
  --from-literal=password=sua-senha-aqui \
  -n mamaloo-prod

# Modificar template para usar o secret (avançado)
```

## 📊 Recursos Kubernetes

### Backend (FastAPI)
- **Imagem**: `ghcr.io/analarie/portal-mamaloo-backend:latest`
- **Porto**: 8025
- **Probes**: Liveness e Readiness configurados

### Frontend (Vue.js/Vite)
- **Imagem**: `ghcr.io/analarie/portal-mamaloo-frontend:latest`
- **Porto**: 80 → 5185 (interno)
- **Probes**: Liveness e Readiness configurados

### Database (PostgreSQL)
- **Imagem**: `postgres:15-alpine`
- **Tipo**: StatefulSet (persistência)
- **Volume**: Persistent Volume Claim

## 📝 Operações Comuns

### Atualizar Release (Upgrade)

```bash
# Dev
helm upgrade mamaloo ./helm/mamaloo-app \
  -n mamaloo-dev \
  -f helm/mamaloo-app/values-dev.yaml

# Prod
helm upgrade mamaloo ./helm/mamaloo-app \
  -n mamaloo-prod \
  -f helm/mamaloo-app/values-prod.yaml
```

### Rollback para Versão Anterior

```bash
# Ver histórico
helm history mamaloo -n mamaloo-dev

# Reverter
helm rollback mamaloo 1 -n mamaloo-dev
```

### Listar Todos os Releases

```bash
helm list -A
```

### Desinstalar Release

```bash
helm uninstall mamaloo -n mamaloo-dev
```

### Testar Template (Dry-run)

```bash
helm template mamaloo ./helm/mamaloo-app \
  -f helm/mamaloo-app/values-dev.yaml > /tmp/manifests.yaml

# Visualizar
cat /tmp/manifests.yaml

# Validar com kubectl
kubectl apply -f /tmp/manifests.yaml --dry-run=client -o yaml
```

## 🔍 Troubleshooting

### Pods não iniciam

```bash
# Verificar status
kubectl get pods -n mamaloo-dev

# Ver logs de erro
kubectl logs -n mamaloo-dev <pod-name>

# Descrever pod
kubectl describe pod -n mamaloo-dev <pod-name>
```

### Verificar configuração renderizada

```bash
# Ver valores efetivos
helm get values mamaloo -n mamaloo-dev

# Ver manifests renderizados
helm get manifest mamaloo -n mamaloo-dev
```

### Problema de imagem

```bash
# Ver se as imagens existem
kubectl get pods -n mamaloo-dev -o jsonpath='{.items[*].spec.containers[*].image}'

# Verificar pull secrets (se necessário)
kubectl get secrets -n mamaloo-dev
```

### Database não inicializa

```bash
# Logs do database
kubectl logs -n mamaloo-dev -l app.kubernetes.io/component=database

# Verificar PVC
kubectl get pvc -n mamaloo-dev

# Descrever PVC
kubectl describe pvc -n mamaloo-dev <pvc-name>
```

## 🔄 Integração com CI/CD

### GitHub Actions

```yaml
- name: Validate Chart
  run: helm lint ./helm/mamaloo-app

- name: Deploy
  run: |
    helm upgrade --install mamaloo ./helm/mamaloo-app \
      --namespace mamaloo-prod \
      --values helm/mamaloo-app/values-prod.yaml
```

### ArgoCD

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: mamaloo-app
spec:
  project: default
  source:
    repoURL: https://github.com/Analarie/Portal-Mamaloo-desenvolvimento
    targetRevision: main
    path: helm/mamaloo-app
    helm:
      releaseName: mamaloo
  destination:
    server: https://kubernetes.default.svc
    namespace: mamaloo-prod
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
```

## 📚 Recursos Adicionais

- [Documentação Helm](https://helm.sh/docs/)
- [Kubernetes Best Practices](https://kubernetes.io/docs/concepts/configuration/overview/)
- [Helm Best Practices](https://helm.sh/docs/chart_best_practices/)

## ✅ Checklist Pré-Deploy

- [ ] Validou o chart: `./validate-chart.sh prod`
- [ ] Alterou a senha do database
- [ ] Configurou o domínio do ingress
- [ ] Verificou as imagens Docker
- [ ] Testou o template: `helm template`
- [ ] Backup do banco de dados (se upgrade)
- [ ] Notificou a equipe

## 🆘 Suporte

Para issues ou dúvidas, abra uma issue no repositório:
https://github.com/Analarie/Portal-Mamaloo-desenvolvimento/issues
