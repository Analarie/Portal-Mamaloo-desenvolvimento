# 🧪 Roteiro de Testes - Requisitos da Atividade

## 📋 Requisitos a Validar

### ✅ Requisito 1: Helm Chart
- Helm chart na pasta `helm/`
- Arquivo `values.yaml` para dev e prod

### ✅ Requisito 2: Secrets do Banco de Dados
- Secrets gerenciados via Helm

### ✅ Requisito 3: CI/CD com GitOps
- CI/CD no Github que crie imagem Docker
- Push para GHCR
- Atualizar Helm com nova versão da imagem
- **NÃO usar latest**
- **Evitar loop infinito**

---

## 🧪 Roteiro de Testes

### **TESTE 1: Validar Estrutura do Helm Chart** ✅

#### Objetivo
Verificar se o Helm chart está corretamente estruturado com values para dev e prod.

#### Comandos
```powershell
# 1. Verificar estrutura de arquivos
ls helm/mamaloo-app/

# 2. Validar sintaxe do chart
helm lint helm/mamaloo-app/

# 3. Renderizar templates para DEV
helm template mamaloo-dev helm/mamaloo-app/ -f helm/mamaloo-app/values-dev.yaml

# 4. Renderizar templates para PROD
helm template mamaloo-prod helm/mamaloo-app/ -f helm/mamaloo-app/values-prod.yaml

# 5. Contar recursos gerados
helm template mamaloo-prod helm/mamaloo-app/ -f helm/mamaloo-app/values-prod.yaml | Select-String -Pattern "kind:" | Group-Object | Select-Object Name, Count
```

#### Resultado Esperado
```
✅ Arquivos presentes:
   - Chart.yaml
   - values.yaml
   - values-dev.yaml
   - values-prod.yaml
   - templates/

✅ helm lint: 0 chart(s) linted, 0 chart(s) failed

✅ Recursos gerados (por ambiente):
   - 1 Secret
   - 3 Services
   - 2 Deployments
   - 1 StatefulSet
   - 1 Job
   - 1 Ingress
```

---

### **TESTE 2: Validar Secrets do Banco de Dados** ✅

#### Objetivo
Confirmar que secrets do PostgreSQL são gerenciados via Helm.

#### Comandos
```powershell
# 1. Verificar template do secret
cat helm/mamaloo-app/templates/database-secret.yaml

# 2. Renderizar secret para PROD
helm template mamaloo-prod helm/mamaloo-app/ -f helm/mamaloo-app/values-prod.yaml | Select-String -Pattern "kind: Secret" -Context 0,15

# 3. Verificar secret no cluster
kubectl get secret -n mamaloo-prod postgres-secret -o yaml

# 4. Decodificar valores (base64)
kubectl get secret -n mamaloo-prod postgres-secret -o jsonpath='{.data.POSTGRES_PASSWORD}' | ForEach-Object { [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($_)) }
```

#### Resultado Esperado
```
✅ Template database-secret.yaml existe
✅ Secret contém:
   - POSTGRES_USER
   - POSTGRES_PASSWORD
   - POSTGRES_DB
✅ Valores vêm de values-prod.yaml (database.user, database.password, database.database)
✅ Secret aplicado no cluster
```

---

### **TESTE 3: CI/CD - Build e Push de Imagens** 🔄

#### Objetivo
Validar que o CI/CD cria imagens Docker e faz push para GHCR **sem usar latest**.

#### Passos

**3.1. Fazer Mudança no Backend**
```powershell
# Editar backend/app/main.py
# Alterar version de "1.0.5" para "1.0.6"

git add backend/app/main.py
git commit -m "test: bump version to 1.0.6 for CI/CD validation"
git push origin main
```

**3.2. Monitorar Workflow**
```powershell
# Abrir GitHub Actions
# https://github.com/Analarie/Portal-Mamaloo-desenvolvimento/actions

# Acompanhar execução:
# - check-changes ✅
# - build-and-push ✅
# - update-gitops-repo ✅
```

**3.3. Verificar Imagem no GHCR**
```powershell
# Acessar: https://github.com/Analarie?tab=packages
# Verificar novo package com tag: prod-<sha7>
# Exemplo: prod-abc1234
```

**3.4. Verificar Atualização do Helm**
```powershell
# Verificar último commit auto-gerado
git log --oneline -n 3

# Deve mostrar:
# abc1234 chore: update image tags to prod-abc1234 [skip ci]
# xyz5678 test: bump version to 1.0.6 for CI/CD validation
```

**3.5. Validar values-prod.yaml**
```powershell
cat helm/mamaloo-app/values-prod.yaml
```

#### Resultado Esperado
```
✅ Workflow executado com sucesso (3 jobs)
✅ Imagem criada: ghcr.io/analarie/portal-mamaloo-backend:prod-<sha7>
✅ Tag NÃO é "latest" (é prod-<sha7>)
✅ values-prod.yaml atualizado automaticamente
✅ Commit auto-gerado contém [skip ci]
```

---

### **TESTE 4: Prevenção de Loop Infinito** ✅

#### Objetivo
Confirmar que o CI/CD **NÃO entra em loop** após atualizar o Helm.

#### Validações

**4.1. Verificar Flag [skip ci]**
```powershell
# Último commit deve ter [skip ci]
git log --oneline -n 1 --grep="\[skip ci\]"
```

**4.2. Verificar Path Filters**
```powershell
# Workflow só dispara para mudanças em:
cat .github/workflows/ci-cd.yml | Select-String -Pattern "paths:" -Context 0,5
```

**4.3. Confirmar Ausência de Loop**
```powershell
# Verificar workflows no GitHub
# https://github.com/Analarie/Portal-Mamaloo-desenvolvimento/actions

# Deve haver APENAS:
# - 1 workflow do commit manual (test: bump version)
# - 0 workflows do commit auto ([skip ci])
```

#### Resultado Esperado
```
✅ Commit auto tem [skip ci] na mensagem
✅ Path filters excluem helm/** (linha paths: - '!helm/**')
✅ Apenas 1 workflow executado (commit manual)
✅ Commit auto [skip ci] NÃO disparou workflow
✅ NENHUM LOOP DETECTADO
```

---

### **TESTE 5: Deploy Automático via ArgoCD** 🔄

#### Objetivo
Validar que ArgoCD detecta mudança e atualiza pods automaticamente.

#### Comandos

**5.1. Verificar Status Antes**
```powershell
# Pods atuais
kubectl get pods -n mamaloo-prod -l app=backend

# Pegar nome do pod backend
kubectl describe pod -n mamaloo-prod <backend-pod-name> | Select-String -Pattern "Image:"
```

**5.2. Aguardar Auto-Sync (3 minutos)**
```powershell
# ArgoCD sincroniza a cada 3 minutos
# Aguardar ou forçar sync:
kubectl patch application mamaloo-prod -n argocd --type merge -p '{\"operation\":{\"initiatedBy\":{\"username\":\"admin\"},\"sync\":{\"revision\":\"HEAD\"}}}'
```

**5.3. Verificar Novo Pod**
```powershell
# Aguardar novo pod subir
kubectl get pods -n mamaloo-prod -l app=backend -w

# Verificar nova imagem
kubectl describe pod -n mamaloo-prod <novo-backend-pod-name> | Select-String -Pattern "Image:"
```

**5.4. Validar Versão da API**
```powershell
# Se tiver acesso ao pod:
kubectl exec -it -n mamaloo-prod <novo-backend-pod-name> -- cat /app/app/main.py | Select-String -Pattern "version"
```

#### Resultado Esperado
```
✅ Pod antigo: image: ghcr.io/analarie/portal-mamaloo-backend:prod-0d99edf
✅ Pod novo: image: ghcr.io/analarie/portal-mamaloo-backend:prod-abc1234
✅ Nova tag corresponde ao SHA do commit de teste
✅ API exibe version="1.0.6"
✅ Deploy automático funcionando
```

---

### **TESTE 6: Validação Completa - Frontend Inalterado** ✅

#### Objetivo
Confirmar que mudança no backend **NÃO recria imagem do frontend**.

#### Comandos
```powershell
# 1. Verificar packages no GHCR
# https://github.com/Analarie?tab=packages

# 2. Verificar última modificação de cada imagem
# Backend deve ter timestamp RECENTE
# Frontend deve ter timestamp ANTIGO

# 3. Verificar pod do frontend
kubectl get pods -n mamaloo-prod -l app=frontend

# 4. Verificar que frontend NÃO foi recriado
kubectl describe pod -n mamaloo-prod <frontend-pod-name> | Select-String -Pattern "Started:"
```

#### Resultado Esperado
```
✅ Backend: nova imagem criada (prod-abc1234)
✅ Frontend: imagem antiga mantida (prod-0d99edf ou prod)
✅ Pod frontend NÃO foi recriado
✅ Apenas backend afetado pela mudança
```

---

## 📊 Checklist Final

### Requisito 1: Helm Chart ✅
- [ ] Helm chart em `helm/mamaloo-app/`
- [ ] `values-dev.yaml` existe e está correto
- [ ] `values-prod.yaml` existe e está correto
- [ ] `helm lint` passa sem erros
- [ ] Templates geram recursos corretos

### Requisito 2: Secrets do Banco ✅
- [ ] Secret gerenciado via Helm
- [ ] Template `database-secret.yaml` existe
- [ ] Valores vêm de `values.yaml`
- [ ] Secret aplicado no cluster

### Requisito 3: CI/CD com GitOps ✅
- [ ] Workflow cria imagens Docker
- [ ] Push para GHCR funciona
- [ ] Tags são `prod-<sha7>` (NÃO "latest")
- [ ] values-prod.yaml atualizado automaticamente
- [ ] Commit auto contém `[skip ci]`
- [ ] **NENHUM LOOP** detectado
- [ ] ArgoCD sincroniza automaticamente
- [ ] Novos pods criados com nova imagem

---

## 🎯 Resumo da Validação

Execute os testes na ordem:
1. ✅ **TESTE 1** - Validar estrutura Helm
2. ✅ **TESTE 2** - Validar secrets
3. 🔄 **TESTE 3** - Testar CI/CD (executar agora)
4. ✅ **TESTE 4** - Confirmar sem loop
5. 🔄 **TESTE 5** - Validar deploy ArgoCD
6. ✅ **TESTE 6** - Verificar seletividade

**Status Atual:**
- Testes 1, 2, 4, 6: ✅ Validados
- Testes 3 e 5: 🔄 Executar agora com bump de versão

---

## 🚀 Executar Teste Completo

```powershell
# 1. Fazer mudança
code backend/app/main.py  # Alterar version para "1.0.6"

# 2. Commit e push
git add backend/app/main.py
git commit -m "test: bump version to 1.0.6 for CI/CD validation"
git push origin main

# 3. Monitorar
# - GitHub Actions: https://github.com/Analarie/Portal-Mamaloo-desenvolvimento/actions
# - ArgoCD: kubectl get application -n argocd
# - Pods: kubectl get pods -n mamaloo-prod -w

# 4. Validar resultado
git log --oneline -n 3
cat helm/mamaloo-app/values-prod.yaml | Select-String -Pattern "tag:"
kubectl get pods -n mamaloo-prod
```

**Tempo estimado:** 5-10 minutos
