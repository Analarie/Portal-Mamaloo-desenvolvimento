# Script PowerShell para atualizar tags de imagens Docker nos arquivos Helm values
# Este script deve ser executado manualmente ou por um processo separado do CI/CD

param(
    [Parameter(Mandatory=$true)]
    [string]$Tag,
    
    [Parameter(Mandatory=$true)]
    [ValidateSet("dev", "prod")]
    [string]$Environment,
    
    [switch]$Backend,
    [switch]$Frontend,
    [string]$ValuesFile
)

function Update-ImageTag {
    param(
        [string]$FilePath,
        [string]$Tag,
        [bool]$UpdateBackend,
        [bool]$UpdateFrontend
    )
    
    if (-not (Test-Path $FilePath)) {
        Write-Error "Arquivo não encontrado: $FilePath"
        return $false
    }
    
    $content = Get-Content $FilePath -Raw
    $originalContent = $content
    
    if ($UpdateBackend) {
        $pattern = '(backend:\s+image:\s+repository:[^\n]+\s+tag:\s+)"[^"]+"'
        $content = $content -replace $pattern, "`$1`"$Tag`""
        Write-Host "Atualizando tag do backend para: $Tag" -ForegroundColor Green
    }
    
    if ($UpdateFrontend) {
        $pattern = '(frontend:\s+image:\s+repository:[^\n]+\s+tag:\s+)"[^"]+"'
        $content = $content -replace $pattern, "`$1`"$Tag`""
        Write-Host "Atualizando tag do frontend para: $Tag" -ForegroundColor Green
    }
    
    if ($content -ne $originalContent) {
        Set-Content -Path $FilePath -Value $content -NoNewline
        Write-Host "✓ Arquivo $FilePath atualizado com sucesso" -ForegroundColor Green
        return $true
    }
    else {
        Write-Host "⚠ Nenhuma alteração necessária em $FilePath" -ForegroundColor Yellow
        return $false
    }
}

# Validação
if (-not $Backend -and -not $Frontend) {
    Write-Error "Especifique pelo menos -Backend ou -Frontend"
    exit 1
}

# Define o arquivo values baseado no ambiente
if ([string]::IsNullOrEmpty($ValuesFile)) {
    $ValuesFile = "helm\mamaloo-app\values-$Environment.yaml"
}

# Caminho completo
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptPath
$fullPath = Join-Path $projectRoot $ValuesFile

Write-Host "`nAtualizando tags de imagem..." -ForegroundColor Cyan
Write-Host "Arquivo: $fullPath" -ForegroundColor Cyan
Write-Host "Tag: $Tag" -ForegroundColor Cyan
Write-Host ""

# Atualiza as tags
$updated = Update-ImageTag -FilePath $fullPath -Tag $Tag -UpdateBackend $Backend -UpdateFrontend $Frontend

if ($updated) {
    Write-Host "`n✓ Tags atualizadas com sucesso!" -ForegroundColor Green
    Write-Host "`nPróximos passos:" -ForegroundColor Cyan
    Write-Host "1. Revisar as mudanças: git diff $ValuesFile"
    Write-Host "2. Fazer commit: git add $ValuesFile; git commit -m 'chore: update image tags to $Tag'"
    Write-Host "3. Fazer push: git push"
    exit 0
}
else {
    exit 1
}
