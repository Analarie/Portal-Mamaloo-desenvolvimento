# Script de Deploy Local - Portal Mamaloo
# Builda imagens e faz deploy no cluster Kubernetes local

param(
    [string]$Environment = "dev",
    [switch]$SkipBuild = $false,
    [switch]$UseMinikube = $true
)

$ErrorActionPreference = "Stop"

Write-Host "🚀 Deploy Local - Portal Mamaloo" -ForegroundColor Cyan
Write-Host "Environment: $Environment" -ForegroundColor Yellow

$ProjectRoot = Split-Path -Parent $PSScriptRoot
$HelmChart = "$ProjectRoot\helm\mamaloo-app"

# Configurar Docker para usar minikube
if ($UseMinikube -and !$SkipBuild) {
    Write-Host "`n🐳 Configurando Docker para Minikube..." -ForegroundColor Cyan
    try {
        minikube docker-env | Invoke-Expression
        Write-Host "✓ Docker configurado para Minikube" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  Minikube não encontrado. Usando Docker local." -ForegroundColor Yellow
        $UseMinikube = $false
    }
}

# Buildar imagens
if (!$SkipBuild) {
    Write-Host "`n🔨 Buildando imagens..." -ForegroundColor Cyan
    
    # Backend
    Write-Host "  📦 Backend..." -ForegroundColor Yellow
    docker build -f "$ProjectRoot\backend\Dockerfile" `
        -t "ghcr.io/analarie/portal-mamaloo-backend:$Environment" `
        "$ProjectRoot\backend"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✓ Backend buildado" -ForegroundColor Green
    } else {
        Write-Host "  ❌ Erro ao buildar backend" -ForegroundColor Red
        exit 1
    }
    
    # Frontend
    Write-Host "  📦 Frontend..." -ForegroundColor Yellow
    docker build -f "$ProjectRoot\frontend\Dockerfile" `
        -t "ghcr.io/analarie/portal-mamaloo-frontend:$Environment" `
        "$ProjectRoot\frontend"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✓ Frontend buildado" -ForegroundColor Green
    } else {
        Write-Host "  ❌ Erro ao buildar frontend" -ForegroundColor Red
        exit 1
    }
}

# Criar namespace
$Namespace = "mamaloo-$Environment"
Write-Host "`n📦 Criando namespace $Namespace..." -ForegroundColor Cyan
kubectl create namespace $Namespace --dry-run=client -o yaml | kubectl apply -f -

# Deploy com Helm
Write-Host "`n⚙️  Instalando Helm chart..." -ForegroundColor Cyan
helm upgrade --install mamaloo $HelmChart `
    -f "$HelmChart\values-$Environment.yaml" `
    -n $Namespace `
    --set backend.image.pullPolicy=IfNotPresent `
    --set frontend.image.pullPolicy=IfNotPresent `
    --wait `
    --timeout 5m

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Deploy concluído com sucesso!" -ForegroundColor Green
    
    # Status
    Write-Host "`n📊 Status dos pods:" -ForegroundColor Cyan
    kubectl get pods -n $Namespace
    
    Write-Host "`n🔗 Para acessar a aplicação:" -ForegroundColor Yellow
    Write-Host "Backend:  kubectl port-forward -n $Namespace svc/mamaloo-mamaloo-app-backend 8025:8025"
    Write-Host "Frontend: kubectl port-forward -n $Namespace svc/mamaloo-mamaloo-app-frontend 3000:80"
    Write-Host "Database: kubectl port-forward -n $Namespace svc/mamaloo-mamaloo-app-database 5432:5432"
    
    Write-Host "`n📝 Logs:" -ForegroundColor Yellow
    Write-Host "kubectl logs -n $Namespace -l app.kubernetes.io/component=backend --tail=50 -f"
    Write-Host "kubectl logs -n $Namespace -l app.kubernetes.io/component=frontend --tail=50 -f"
} else {
    Write-Host "`n❌ Erro no deploy!" -ForegroundColor Red
    Write-Host "`n🔍 Debug:" -ForegroundColor Yellow
    Write-Host "kubectl get events -n $Namespace --sort-by='.lastTimestamp'"
    exit 1
}
