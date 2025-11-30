#!/bin/bash

# Script de deploy do Helm Chart - Portal Mamaloo
# Uso: ./deploy.sh [dev|prod]

set -e

ENVIRONMENT=${1:-dev}
NAMESPACE="mamaloo-${ENVIRONMENT}"
CHART_PATH="./helm/mamaloo-app"
VALUES_FILE="${CHART_PATH}/values-${ENVIRONMENT}.yaml"
RELEASE_NAME="mamaloo"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funções
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Validações
log_info "Iniciando deploy para ambiente: ${ENVIRONMENT}"

if [ ! -d "$CHART_PATH" ]; then
    log_error "Diretório do chart não encontrado: $CHART_PATH"
    exit 1
fi

if [ ! -f "$VALUES_FILE" ]; then
    log_error "Arquivo de valores não encontrado: $VALUES_FILE"
    exit 1
fi

# Verificar kubectl
if ! command -v kubectl &> /dev/null; then
    log_error "kubectl não está instalado"
    exit 1
fi

# Verificar helm
if ! command -v helm &> /dev/null; then
    log_error "helm não está instalado"
    exit 1
fi

# Validar chart
log_info "Validando Helm chart..."
helm lint "$CHART_PATH" || {
    log_error "Falha na validação do chart"
    exit 1
}
log_success "Chart validado com sucesso"

# Criar namespace se não existir
log_info "Criando/verificando namespace..."
kubectl create namespace "$NAMESPACE" --dry-run=client -o yaml | kubectl apply -f - > /dev/null
log_success "Namespace $NAMESPACE pronto"

# Verificar se release já existe
RELEASE_EXISTS=$(helm list -n "$NAMESPACE" -q | grep -c "^${RELEASE_NAME}$" || true)

if [ "$RELEASE_EXISTS" -gt 0 ]; then
    log_info "Release já existe, realizando upgrade..."
    helm upgrade "$RELEASE_NAME" "$CHART_PATH" \
        --namespace "$NAMESPACE" \
        --values "$VALUES_FILE" \
        --wait \
        --timeout 5m \
        --atomic
    log_success "Release atualizado com sucesso"
else
    log_info "Criando novo release..."
    helm install "$RELEASE_NAME" "$CHART_PATH" \
        --namespace "$NAMESPACE" \
        --values "$VALUES_FILE" \
        --wait \
        --timeout 5m
    log_success "Release criado com sucesso"
fi

# Aguardar rollout
log_info "Aguardando pods ficarem prontos..."
kubectl rollout status deployment -n "$NAMESPACE" -l app.kubernetes.io/name=mamaloo-app --timeout=5m || {
    log_warning "Timeout aguardando deployment"
}

# Exibir status
log_info "Status dos recursos:"
kubectl get all -n "$NAMESPACE" -l app.kubernetes.io/instance=mamaloo

# Exibir próximos passos
log_success "Deploy completado!"
echo ""
echo -e "${BLUE}Próximos passos:${NC}"
echo "1. Verificar status: kubectl get all -n $NAMESPACE"
echo "2. Logs do backend: kubectl logs -n $NAMESPACE -l app.kubernetes.io/component=backend"
echo "3. Logs do frontend: kubectl logs -n $NAMESPACE -l app.kubernetes.io/component=frontend"
echo "4. Acessar pods: kubectl exec -n $NAMESPACE -it <pod-name> -- /bin/sh"
