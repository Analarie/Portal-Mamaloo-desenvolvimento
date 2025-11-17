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

## Pré-requisitos

- Kubernetes 1.21+
- Helm 3.0+
- Kubectl configurado

## Instalação

### 1. Desenvolvimento

Instalar o chart com valores de desenvolvimento:

```bash
# Criar namespace
kubectl create namespace mamaloo-dev

# Instalar chart
helm install mamaloo ./helm/mamaloo-app \
  --namespace mamaloo-dev \
  --values helm/mamaloo-app/values-dev.yaml
```

### 2. Produção

Instalar o chart com valores de produção:

```bash
# Criar namespace
kubectl create namespace mamaloo-prod

# Instalar chart
helm install mamaloo ./helm/mamaloo-app \
  --namespace mamaloo-prod \
  --values helm/mamaloo-app/values-prod.yaml
```

### 3. Dry-run (simulação)

Testar a instalação sem aplicar as mudanças:

```bash
helm install mamaloo ./helm/mamaloo-app \
  --namespace mamaloo-dev \
  --values helm/mamaloo-app/values-dev.yaml \
  --dry-run --debug
```

## Atualização

Para atualizar um release existente:

```bash
# Desenvolvimento
helm upgrade mamaloo ./helm/mamaloo-app \
  --namespace mamaloo-dev \
  --values helm/mamaloo-app/values-dev.yaml

# Produção
helm upgrade mamaloo ./helm/mamaloo-app \
  --namespace mamaloo-prod \
  --values helm/mamaloo-app/values-prod.yaml
```

## Desinstalação

```bash
# Remover release
helm uninstall mamaloo --namespace mamaloo-dev

# Remover namespace (opcional)
kubectl delete namespace mamaloo-dev
```

## Configurações por Ambiente

### Desenvolvimento (`values-dev.yaml`)

- **Replicas**: 1
- **CPU**: 100m (req) / 200m (limit)
- **Memory**: 64Mi (req) / 128Mi (limit)
- **Database**: Pequeno (2Gi)
- **Autoscaling**: Desativado
- **Host**: `mamaloo-dev.local`

### Produção (`values-prod.yaml`)

- **Replicas**: 3 (backend) / 2 (frontend)
- **CPU**: 500m (req) / 1000m (limit)
- **Memory**: 512Mi (req) / 1Gi (limit)
- **Database**: Grande (20Gi)
- **Autoscaling**: Ativado (3-10 replicas)
- **Host**: `mamaloo.com.br`
- **TLS**: Habilitado

## Variáveis de Configuração Importantes

### Backend

```yaml
backend:
  image:
    repository: ghcr.io/analarie/portal-mamaloo-backend
    tag: "latest"
    pullPolicy: Always
  service:
    port: 8025
  resources:
    limits:
      cpu: 500m
      memory: 512Mi
```

### Database

```yaml
database:
  password: "changeme"      # MUDE EM PRODUÇÃO
  database: mamaloo_db
  persistence:
    enabled: true
    size: 5Gi
```

### Ingress

```yaml
ingress:
  enabled: true
  className: nginx
  hosts:
    - host: mamaloo.local
      paths:
        - path: /api
          service: backend
        - path: /
          service: frontend
```

## Segredos e Variáveis Sensíveis

### Para Produção

Nunca commitar senhas em `values-prod.yaml`. Usar um dos métodos:

#### Método 1: Arquivo separado não versionado

```bash
# Criar arquivo local
cat > values-prod-secrets.yaml <<EOF
database:
  password: "seu-super-secreto"
EOF

# Instalar
helm install mamaloo ./helm/mamaloo-app \
  --namespace mamaloo-prod \
  --values helm/mamaloo-app/values-prod.yaml \
  --values values-prod-secrets.yaml
```

#### Método 2: Variáveis de ambiente

```bash
helm install mamaloo ./helm/mamaloo-app \
  --namespace mamaloo-prod \
  --values helm/mamaloo-app/values-prod.yaml \
  --set database.password=$DB_PASSWORD
```

#### Método 3: Secret Externo

```bash
# Criar secret
kubectl create secret generic db-credentials \
  --from-literal=password=seu-super-secreto \
  --namespace mamaloo-prod

# Modificar templates para usar o secret
```

## Troubleshooting

### Verificar status do release

```bash
helm status mamaloo --namespace mamaloo-dev
```

### Ver valores atuais

```bash
helm get values mamaloo --namespace mamaloo-dev
```

### Ver manifests renderizados

```bash
helm get manifest mamaloo --namespace mamaloo-dev
```

### Logs dos pods

```bash
kubectl logs -n mamaloo-dev -l app.kubernetes.io/component=backend
kubectl logs -n mamaloo-dev -l app.kubernetes.io/component=frontend
```

### Verificar status dos pods

```bash
kubectl get pods -n mamaloo-dev
kubectl describe pod <pod-name> -n mamaloo-dev
```

## Linting e Validação

### Validar chart

```bash
helm lint ./helm/mamaloo-app
```

### Template debugging

```bash
helm template mamaloo ./helm/mamaloo-app \
  --values helm/mamaloo-app/values-dev.yaml
```

## CI/CD Integration

### GitHub Actions

```yaml
- name: Helm Lint
  run: helm lint ./helm/mamaloo-app

- name: Helm Deploy (Dev)
  run: |
    helm upgrade --install mamaloo ./helm/mamaloo-app \
      --namespace mamaloo-dev \
      --values helm/mamaloo-app/values-dev.yaml
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
    path: helm/mamaloo-app
    helm:
      releaseName: mamaloo
      values: |
        replicaCount: 3
  destination:
    server: https://kubernetes.default.svc
    namespace: mamaloo-prod
```

## Migração de Dados

As migrations são executadas automaticamente como um Job de pré-sync do ArgoCD:

- **Sync Wave**: 5 (executado antes dos deployments)
- **Hook**: PreSync (antes da sincronização)
- **Backoff Limit**: 3 tentativas

Para executar manualmente:

```bash
# Verificar status
kubectl get jobs -n mamaloo-dev -l app.kubernetes.io/component=migrations

# Logs
kubectl logs -n mamaloo-dev -l app.kubernetes.io/component=migrations
```

## Performance e Recursos

### Limites recomendados por ambiente

**Desenvolvimento:**
- Backend: 100m CPU / 128Mi Memory
- Frontend: 50m CPU / 64Mi Memory
- Database: 250m CPU / 256Mi Memory

**Produção:**
- Backend: 500m CPU / 512Mi Memory
- Frontend: 250m CPU / 256Mi Memory
- Database: 250m CPU / 256Mi Memory

## Autoscaling

### Habilitado apenas em produção

```yaml
autoscaling:
  enabled: true
  minReplicas: 3
  maxReplicas: 10
  targetCPUUtilizationPercentage: 70
```

Requer Horizontal Pod Autoscaler (HPA) no cluster.

## Observabilidade

### Health Checks

- **Liveness Probe**: Verifica se o pod está vivo
- **Readiness Probe**: Verifica se o pod está pronto para receber tráfego

### Métricas

Para integrar com Prometheus/Grafana, adicionar ServiceMonitor:

```yaml
serviceMonitor:
  enabled: true
  interval: 30s
```

## Suporte

Para reportar issues ou sugestões, abrir issue no repositório GitHub:
https://github.com/Analarie/Portal-Mamaloo-desenvolvimento/issues

## Licença

Veja LICENSE no repositório principal.
