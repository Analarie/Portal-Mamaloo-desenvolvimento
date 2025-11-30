# Script de Instalação do Minikube no Windows
# Execute este script no PowerShell como Administrador

$ErrorActionPreference = "Stop"

Write-Host "🚀 Instalando Minikube para Windows..." -ForegroundColor Cyan

# Criar diretório de instalação
$InstallPath = "C:\Program Files\minikube"
if (!(Test-Path $InstallPath)) {
    New-Item -ItemType Directory -Path $InstallPath -Force | Out-Null
    Write-Host "✓ Diretório criado: $InstallPath" -ForegroundColor Green
}

# Baixar minikube
$MinikubeUrl = "https://github.com/kubernetes/minikube/releases/latest/download/minikube-windows-amd64.exe"
$MinikubePath = "$InstallPath\minikube.exe"

Write-Host "📥 Baixando minikube..." -ForegroundColor Yellow
try {
    Invoke-WebRequest -Uri $MinikubeUrl -OutFile $MinikubePath -UseBasicParsing
    Write-Host "✓ Minikube baixado com sucesso" -ForegroundColor Green
} catch {
    Write-Host "❌ Erro ao baixar minikube: $_" -ForegroundColor Red
    exit 1
}

# Adicionar ao PATH
$CurrentPath = [Environment]::GetEnvironmentVariable("Path", "Machine")
if ($CurrentPath -notlike "*$InstallPath*") {
    Write-Host "📝 Adicionando ao PATH do sistema..." -ForegroundColor Yellow
    [Environment]::SetEnvironmentVariable("Path", "$CurrentPath;$InstallPath", "Machine")
    $env:Path += ";$InstallPath"
    Write-Host "✓ PATH atualizado" -ForegroundColor Green
}

# Verificar instalação
Write-Host "`n🔍 Verificando instalação..." -ForegroundColor Cyan
& "$MinikubePath" version

Write-Host "`n✅ Minikube instalado com sucesso!" -ForegroundColor Green
Write-Host "`nPróximos passos:" -ForegroundColor Cyan
Write-Host "1. Feche e reabra o PowerShell"
Write-Host "2. Execute: minikube start --driver=docker"
Write-Host "3. Execute: minikube status"
Write-Host "`n💡 Para buildar imagens no minikube:" -ForegroundColor Yellow
Write-Host "   minikube docker-env | Invoke-Expression"
Write-Host "   docker build -t nome:tag ."
