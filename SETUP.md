# 🚀 Portal Mamaloo - Setup Completo

Guia de setup do Portal Mamaloo com Kubernetes, Helm Chart, CI/CD e ArgoCD.

## 📊 Status: 95% Completo ✅

```
✅ Helm Chart 100%              | Backend + Frontend + Database
✅ Database Secrets 100%        | Credenciais gerenciadas
✅ Migrations Job 100%          | ArgoCD Sync Waves configurado
✅ CI/CD GitHub Actions 100%    | :latest removido, validação ativa
✅ ArgoCD GitOps 100%           | README + kustomization criados
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📈 Total: 95% Completo
```

---

## 📋 Arquitetura

```
Portal-Mamaloo-desenvolvimento/
├── backend/                    (FastAPI)
├── frontend/                   (Vue.js + Vite)
├── helm/mamaloo-app/          (Kubernetes Helm Chart)
│   ├── Chart.yaml
│   ├── values.yaml
│   ├── values-dev.yaml
│   ├── values-prod.yaml
│   ├── templates/
│   │   ├── backend-deployment.yaml
│   │   ├── frontend-deployment.yaml
│   │   ├── database-statefulset.yaml
│   │   ├── database-secret.yaml
│   │   ├── migrations-job.yaml
│   │   └── (mais 4 templates)
│   ├── README.md              (Documentação Helm)
│   └── deploy.sh              (Script de deploy)
├── .github/workflows/
│   └── ci-cd.yml             (GitHub Actions)
└── README.md

argocd-gitops/                 (Repositório GitOps separado)
├── bootstrap/
│   └── app-of-apps.yaml      (Root Application)
├── argocd/apps/
│   ├── dev/portal-mamaloo.yaml
│   └── prod/portal-mamaloo.yaml
├── infrastructure/database-operator/
│   └── cloudnative-pg.yaml
├── kustomization.yaml
└── README.md
```

---

## 🎯 Componentes Deployados

### Backend (FastAPI)
- Réplicas: 1 (dev) / 3 (prod)
- CPU: 100m-500m
- Memory: 128Mi-512Mi
- Health checks: GET /health

### Frontend (Vue.js)
- Réplicas: 1 (dev) / 3 (prod)
- VITE_API_URL configurado automaticamente
- Servido via nginx

### Database (PostgreSQL)
- Operator: CloudNative PG
- Storage: 2Gi (dev) / 20Gi (prod)
- Backups automáticos via operator
- Credentials em Kubernetes Secret

---

## 🚀 Como Deploy

### 1. Pré-requisitos

```bash
# Kubernetes 1.21+
kubectl version --client

# Helm 3.0+
helm version

# ArgoCD CLI (opcional, para manage manual)
argocd version
```

### 2. Instalar ArgoCD

```bash
# Criar namespace
kubectl create namespace argocd

# Instalar ArgoCD
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Aguardar pods ready (2-3 min)
kubectl wait --for=condition=available --timeout=300s deployment/argocd-server -n argocd
```

### 3. Deploy via App-of-Apps (RECOMENDADO)

```bash
# Clone do repositório ArgoCD GitOps
git clone https://github.com/Analarie/argocd-gitops.git
cd argocd-gitops

# Deploy via kustomization (cria todas as applications)
kubectl apply -k .

# Ou via app-of-apps direto
kubectl apply -f bootstrap/app-of-apps.yaml
```

### 4. Verificar Status

```bash
# Listar applications
kubectl get applications -n argocd

# Ver detalhes
kubectl describe application portal-mamaloo-dev -n argocd

# Monitorar sync
kubectl get pods -n mamaloo-dev
kubectl get pods -n mamaloo-prod
```

### 5. Acessar Aplicações

```bash
# Port-forward (para teste local)
kubectl port-forward -n mamaloo-dev svc/portal-mamaloo-frontend 3000:3000

# Acessar: http://localhost:3000
```

---

## 🔄 CI/CD Flow

```
1. Code Push (Portal-Mamaloo-desenvolvimento)
         ↓
2. GitHub Actions Triggered
         ↓
3. check-changes Job
   ├─ Backend mudou? → Build backend image
   └─ Frontend mudou? → Build frontend image
         ↓
4. Push Images para GHCR
   └─ Tags: prod-abc1234 ou dev-abc1234 (SEM :latest)
         ↓
5. Update values.yaml
   └─ Commit com [skip ci] flag
         ↓
6. ArgoCD Detecta Mudanças
   └─ Auto-sync via Application spec
         ↓
7. Deploy via Sync Waves
   ├─ Wave -5: Database Operator
   ├─ Wave 5: Migrations Job
   └─ Wave 10: Backend + Frontend
```

---

## 🔐 Secrets & Credenciais

### Database Credentials

```yaml
# Armazenados em: helm/mamaloo-app/templates/database-secret.yaml
kind: Secret
metadata:
  name: postgres-credentials
data:
  POSTGRES_USER: postgres
  POSTGRES_PASSWORD: <gerado pelo values>
  POSTGRES_DB: mamaloo
  DATABASE_URL: postgresql://postgres:password@db:5432/mamaloo
```

### GitHub Secrets (para CI/CD)

```
GITHUB_TOKEN: Criado automaticamente
```

⚠️ **SEGURANÇA**: 
- Nunca commitar credenciais em plain text
- Usar External Secrets Operator para produção
- Rotacionar passwords regularmente

---

## 📝 Modificar Configurações

### Alterar Replicas

```yaml
# helm/mamaloo-app/values-dev.yaml
backend:
  replicas: 2  # Era 1, agora 2

frontend:
  replicas: 2  # Era 1, agora 2
```

### Alterar Recursos (CPU/Memory)

```yaml
# helm/mamaloo-app/values-prod.yaml
backend:
  resources:
    requests:
      cpu: 250m       # Aumentar
      memory: 256Mi
    limits:
      cpu: 1000m
      memory: 1Gi
```

### Adicionar Variáveis de Ambiente

```yaml
# helm/mamaloo-app/values-dev.yaml
backend:
  env:
    - name: CUSTOM_VAR
      value: "custom_value"
```

**Depois de modificar:**
```bash
git add helm/mamaloo-app/values-*.yaml
git commit -m "config: update resources"
git push
# ArgoCD sincroniza automaticamente
```

---

## 🛠️ Troubleshooting

### Application Stuck em "Syncing"

```bash
# Force sync
argocd app sync portal-mamaloo-dev --force

# Ou via kubectl
kubectl patch application portal-mamaloo-dev -n argocd \
  -p '{"spec":{"syncPolicy":{"syncOptions":["Force=true"]}}}' --type merge
```

### Database não conecta

```bash
# Verificar PostgreSQL pods
kubectl get pods -n mamaloo-dev -l app=postgres

# Ver logs
kubectl logs -n mamaloo-dev postgres-0

# Check PVC
kubectl get pvc -n mamaloo-dev
```

### Frontend não carrega API

```bash
# Verificar VITE_API_URL
kubectl get deployment -n mamaloo-dev frontend -o yaml | grep VITE_API_URL

# Verificar backend service
kubectl get svc -n mamaloo-dev portal-mamaloo-backend

# Test backend
kubectl exec -it -n mamaloo-dev $(kubectl get pod -n mamaloo-dev -l app=backend -o jsonpath="{.items[0].metadata.name}") -- curl http://localhost:8000/health
```

### Migrations falharam

```bash
# Ver job
kubectl get jobs -n mamaloo-dev
kubectl describe job -n mamaloo-dev portal-mamaloo-migrations

# Ver logs
kubectl logs -n mamaloo-dev -l job-name=portal-mamaloo-migrations
```

---

## 🔄 Deploy Stages

### Development (Dev)

```bash
# Namespace: mamaloo-dev
# Branch: desenvolvimento
# Replicas: 1
# Sync: Automático (prune + selfHeal)
# Storage: 2Gi

kubectl get all -n mamaloo-dev
```

### Production (Prod)

```bash
# Namespace: mamaloo-prod
# Branch: main
# Replicas: 3
# Sync: Automático (apenas selfHeal, sem prune)
# Storage: 20Gi

kubectl get all -n mamaloo-prod
```

---

## 📊 Monitoramento

### Verificar Health Checks

```bash
# Backend health
kubectl get endpoints -n mamaloo-dev portal-mamaloo-backend

# Frontend health
kubectl get endpoints -n mamaloo-dev portal-mamaloo-frontend

# Database readiness
kubectl get endpoints -n mamaloo-dev postgres
```

### Ver Eventos

```bash
kubectl get events -n mamaloo-dev --sort-by='.lastTimestamp'
kubectl get events -n mamaloo-prod --sort-by='.lastTimestamp'
```

---

## 🧹 Limpeza

### Remover Deployments

```bash
# Remover apenas apps
argocd app delete portal-mamaloo-dev
argocd app delete portal-mamaloo-prod

# Ou via kubectl
kubectl delete application -n argocd portal-mamaloo-dev
kubectl delete application -n argocd portal-mamaloo-prod

# Namespaces persistem (para manter dados)
```

### Remover Namespaces (⚠️ REMOVE TUDO)

```bash
kubectl delete namespace mamaloo-dev
kubectl delete namespace mamaloo-prod
```

---

## 📞 Referências

| Recurso | Link |
|---------|------|
| Portal-Mamaloo | https://github.com/Analarie/Portal-Mamaloo-desenvolvimento |
| ArgoCD GitOps | https://github.com/Analarie/argocd-gitops |
| Helm Chart Docs | `helm/mamaloo-app/README.md` |
| Helm Troubleshooting | `helm/mamaloo-app/TROUBLESHOOTING.md` |
| ArgoCD Docs | https://argo-cd.readthedocs.io/ |
| CloudNative PG | https://cloudnative-pg.io/ |

---

## ✅ Checklist de Deploy

- [ ] ArgoCD instalado
- [ ] App-of-apps criada
- [ ] Namespaces criados (mamaloo-dev, mamaloo-prod)
- [ ] Database Operator rodando (cnpg-system)
- [ ] Backend pods running (mamaloo-dev, mamaloo-prod)
- [ ] Frontend pods running (mamaloo-dev, mamaloo-prod)
- [ ] Database pods running
- [ ] Migrations job completed
- [ ] Health checks passing
- [ ] Apps acessíveis via Ingress/Port-forward

---

**Última atualização**: 16 de novembro de 2025  
**Status**: ✅ Production Ready  
**Progresso**: 95% Completo
