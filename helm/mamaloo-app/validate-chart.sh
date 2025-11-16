#!/bin/bash

# Script de validação do Helm Chart
# Uso: ./validate-chart.sh [dev|prod]

set -e

ENVIRONMENT=${1:-dev}
CHART_PATH="./helm/mamaloo-app"
VALUES_FILE="${CHART_PATH}/values-${ENVIRONMENT}.yaml"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[✓]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[⚠]${NC} $1"; }
log_error() { echo -e "${RED}[✗]${NC} $1"; }

echo -e "${BLUE}=== Validação do Helm Chart ===${NC}\n"

# 1. Verificar estrutura de diretórios
log_info "Verificando estrutura de diretórios..."
for dir in templates; do
    if [ -d "$CHART_PATH/$dir" ]; then
        log_success "Diretório $dir existe"
    else
        log_error "Diretório $dir não encontrado"
        exit 1
    fi
done

# 2. Verificar arquivos obrigatórios
log_info "Verificando arquivos obrigatórios..."
for file in Chart.yaml values.yaml "$VALUES_FILE" templates/_helpers.tpl; do
    if [ -f "$CHART_PATH/$file" ]; then
        log_success "Arquivo $file existe"
    else
        log_error "Arquivo obrigatório não encontrado: $file"
        exit 1
    fi
done

# 3. Helm lint
log_info "Executando helm lint..."
if helm lint "$CHART_PATH" > /tmp/helm-lint.log 2>&1; then
    log_success "Helm lint passou"
else
    log_error "Helm lint falhou"
    cat /tmp/helm-lint.log
    exit 1
fi

# 4. Verificar se helm template funciona
log_info "Testando rendering de templates..."
if helm template test "$CHART_PATH" --values "$VALUES_FILE" > /tmp/manifests.yaml 2>&1; then
    log_success "Templates renderizados com sucesso"
    MANIFEST_COUNT=$(grep -c "^---$" /tmp/manifests.yaml || echo 0)
    log_info "Total de manifestos gerados: $(($MANIFEST_COUNT + 1))"
else
    log_error "Falha ao renderizar templates"
    cat /tmp/manifests.yaml
    exit 1
fi

# 5. Validar YAML
log_info "Validando YAML gerado..."
if command -v kubeval &> /dev/null; then
    if kubeval /tmp/manifests.yaml > /tmp/kubeval.log 2>&1; then
        log_success "YAML válido"
    else
        log_warning "Kubeval reportou avisos"
        tail -10 /tmp/kubeval.log
    fi
else
    log_warning "kubeval não instalado, pulando validação"
fi

# 6. Verificar recursos críticos
log_info "Verificando recursos críticos..."
for resource in "Deployment" "Service" "Secret"; do
    if grep -q "kind: $resource" /tmp/manifests.yaml; then
        COUNT=$(grep -c "kind: $resource" /tmp/manifests.yaml)
        log_success "$resource encontrado ($COUNT instância(s))"
    else
        log_warning "$resource não encontrado"
    fi
done

# 7. Verificar valores críticos
log_info "Verificando valores críticos..."
CRITICAL_KEYS=("backend" "frontend" "database")
for key in "${CRITICAL_KEYS[@]}"; do
    if grep -q "$key:" "$VALUES_FILE"; then
        log_success "Valor crítico '$key' configurado"
    else
        log_error "Valor crítico '$key' não encontrado"
        exit 1
    fi
done

# 8. Avisos de segurança
log_info "Verificando problemas de segurança..."
if grep -q "changeme" "$CHART_PATH/values.yaml"; then
    log_warning "Senha padrão 'changeme' detectada em values.yaml"
fi

if grep -q "pullPolicy.*Always" "$CHART_PATH/values.yaml"; then
    log_success "ImagePullPolicy configurado como 'Always'"
fi

# Resultado final
echo ""
echo -e "${GREEN}=== Validação Completa ===${NC}"
log_success "Helm chart está pronto para deployment"
log_info "Próximo passo: ./deploy.sh $ENVIRONMENT"
