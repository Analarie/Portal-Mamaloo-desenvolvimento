# ❓ FAQ e Troubleshooting - Helm Chart Portal Mamaloo

## 🔧 Troubleshooting Geral

### ❌ "helm command not found"
**Solução:**
```bash
# macOS
brew install helm

# Linux
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

# Windows
choco install kubernetes-helm
```

### ❌ "kubectl connection refused"
**Solução:**
```bash
# Verificar contexto
kubectl config get-contexts

# Trocar contexto
kubectl config use-context <context-name>

# Testar conexão
kubectl cluster-info
```

---

## 🚀 Deployment Issues

### ❌ "Error: INSTALLATION FAILED: create namespace: ... already exists"
**Causa:** Namespace já existe
**Solução:**
```bash
# Remover namespace antigo
kubectl delete namespace mamaloo-dev

# Ou usar --force
helm install mamaloo ./helm/mamaloo-app \
  -n mamaloo-dev --create-namespace \
  -f helm/mamaloo-app/values-dev.yaml
```

### ❌ "CrashLoopBackOff" nos pods
**Cause:** Aplicação travando ao iniciar
**Solução:**
```bash
# Ver logs detalhados
kubectl logs -n mamaloo-dev <pod-name> --previous

# Descrever pod para mais info
kubectl describe pod -n mamaloo-dev <pod-name>

# Aumentar initialDelaySeconds
# Editar valores e fazer upgrade
```

### ❌ "ImagePullBackOff"
**Causa:** Imagem Docker não encontrada
**Solução:**
```bash
# Verificar imagem
docker image ls | grep portal-mamaloo

# Build local se necessário
docker build -t portal-mamaloo_backend:dev -f backend/Dockerfile backend/

# Verificar repositório remoto
docker push ghcr.io/analarie/portal-mamaloo-backend:latest
```

### ❌ "Pending" (Pod não inicia)
**Causa:** Recurso indisponível
**Solução:**
```bash
# Ver eventos
kubectl describe pod -n mamaloo-dev <pod-name>

# Verificar recursos do node
kubectl top nodes

# Aumentar tamanho do cluster ou reduzir requests
```

---

## 💾 Database Issues

### ❌ "database connection refused"
**Causa:** Database não está pronto
**Solução:**
```bash
# Verificar se database pod está rodando
kubectl get pods -n mamaloo-dev -l app.kubernetes.io/component=database

# Verificar logs do database
kubectl logs -n mamaloo-dev -l app.kubernetes.io/component=database

# Verificar PVC
kubectl get pvc -n mamaloo-dev
kubectl describe pvc -n mamaloo-dev postgres-storage-0

# Aguardar initialDelaySeconds aumentado
helm upgrade mamaloo ./helm/mamaloo-app \
  -n mamaloo-dev \
  -f helm/mamaloo-app/values-dev.yaml \
  --set database.healthcheck.initialDelaySeconds=60
```

### ❌ "No space left on device"
**Causa:** PVC cheio
**Solução:**
```bash
# Ver tamanho do PVC
kubectl exec -n mamaloo-dev postgres-0 -- du -sh /var/lib/postgresql/data

# Aumentar tamanho (edit pvc não funciona, precisa recrear)
kubectl delete pvc postgres-storage-0 -n mamaloo-dev
# Fazer backup antes!

# Após deletar, reaplicar o chart
helm upgrade mamaloo ./helm/mamaloo-app \
  -n mamaloo-dev \
  -f helm/mamaloo-app/values-dev.yaml \
  --set database.persistence.size=10Gi
```

### ❌ Migrations travadas
**Causa:** Job de migrations falhando
**Solução:**
```bash
# Ver status do job
kubectl get jobs -n mamaloo-dev -l app.kubernetes.io/component=migrations

# Ver logs do job
kubectl logs -n mamaloo-dev -l app.kubernetes.io/component=migrations

# Deletar job para reexecutar
kubectl delete job mamaloo-migrations-1 -n mamaloo-dev

# Fazer upgrade (reexecuta migrations)
helm upgrade mamaloo ./helm/mamaloo-app \
  -n mamaloo-dev \
  -f helm/mamaloo-app/values-dev.yaml
```

---

## 🌐 Ingress Issues

### ❌ "404 Not Found" no ingress
**Causa:** Backend não responde em /
**Solução:**
```bash
# Testar backend diretamente
kubectl port-forward -n mamaloo-dev svc/mamaloo-backend 8025:8025
curl http://localhost:8025/

# Verificar ingress
kubectl get ingress -n mamaloo-dev

# Ver configuração do ingress
kubectl get ingress -n mamaloo-dev mamaloo-app -o yaml

# Verificar se backend está pronto
kubectl get ep -n mamaloo-dev mamaloo-backend
```

### ❌ "Connection refused" no ingress
**Causa:** Ingress controller não está pronto
**Solução:**
```bash
# Verificar ingress controller
kubectl get pods -n ingress-nginx

# Ver logs
kubectl logs -n ingress-nginx -l app.kubernetes.io/component=controller

# Se não existir, instalar:
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm install ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx --create-namespace
```

### ❌ "SSL_ERROR_UNRECOGNIZED_NAME" (HTTPS)
**Causa:** Certificado TLS incorreto
**Solução:**
```bash
# Verificar secret TLS
kubectl get secret -n mamaloo-prod mamaloo-tls-prod -o yaml

# Se não existir, criar:
kubectl create secret tls mamaloo-tls-prod \
  --cert=path/to/cert.pem \
  --key=path/to/key.pem \
  -n mamaloo-prod

# Ou usar cert-manager:
# https://cert-manager.io/docs/
```

---

## 📊 Performance Issues

### ❌ Pods com muito CPU/Memory
**Solução:**
```bash
# Ver uso atual
kubectl top pods -n mamaloo-dev

# Aumentar limits
helm upgrade mamaloo ./helm/mamaloo-app \
  -n mamaloo-dev \
  -f helm/mamaloo-app/values-dev.yaml \
  --set backend.resources.limits.cpu=1000m \
  --set backend.resources.limits.memory=1Gi

# Ou editar values.yaml diretamente
```

### ❌ Autoscaling não funciona
**Causa:** HPA não configurado ou metrics indisponíveis
**Solução:**
```bash
# Verificar se HPA está criado
kubectl get hpa -n mamaloo-prod

# Verificar metrics disponíveis
kubectl get metrics pods -n mamaloo-prod

# Se não houver, instalar metrics-server:
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
```

---

## 🔄 Upgrade/Rollback Issues

### ❌ "Error: UPGRADE FAILED"
**Solução:**
```bash
# Ver histórico
helm history mamaloo -n mamaloo-dev

# Reverter para versão anterior
helm rollback mamaloo 1 -n mamaloo-dev

# Ou fazer upgrade novamente
helm upgrade mamaloo ./helm/mamaloo-app \
  -n mamaloo-dev \
  -f helm/mamaloo-app/values-dev.yaml \
  --force
```

### ❌ Dados perdidos após rollback
**Prevenção:**
```bash
# SEMPRE fazer backup antes de upgrade
kubectl exec -n mamaloo-dev postgres-0 -- pg_dump -U postgres mamaloo_dev > backup.sql

# Depois fazer upgrade com segurança
helm upgrade mamaloo ./helm/mamaloo-app \
  -n mamaloo-dev \
  -f helm/mamaloo-app/values-dev.yaml \
  --atomic  # Rollback automático se falhar
```

---

## 🔐 Secret Issues

### ❌ "secret not found"
**Solução:**
```bash
# Verificar secrets
kubectl get secrets -n mamaloo-dev

# Ver conteúdo (encoded)
kubectl get secret mamaloo-db-secret -n mamaloo-dev -o yaml

# Decodificar password
kubectl get secret mamaloo-db-secret -n mamaloo-dev \
  -o jsonpath='{.data.POSTGRES_PASSWORD}' | base64 -d
```

### ❌ Senha errada
**Solução:**
```bash
# Deletar secret antigo
kubectl delete secret mamaloo-db-secret -n mamaloo-dev

# Fazer upgrade (recria o secret)
helm upgrade mamaloo ./helm/mamaloo-app \
  -n mamaloo-dev \
  -f helm/mamaloo-app/values-dev.yaml \
  --set database.password=new-password-here
```

---

## ✅ Verificações Rápidas

### Health Check Rápido
```bash
# Status geral
helm status mamaloo -n mamaloo-dev

# Ver pods
kubectl get pods -n mamaloo-dev

# Ver services
kubectl get svc -n mamaloo-dev

# Ver ingress
kubectl get ingress -n mamaloo-dev

# Ver PVCs
kubectl get pvc -n mamaloo-dev

# Ver jobs
kubectl get jobs -n mamaloo-dev
```

### Debug rápido
```bash
# Entrar em um pod
kubectl exec -n mamaloo-dev -it <pod-name> -- /bin/sh

# Testar conectividade
kubectl run -n mamaloo-dev -it --rm debug --image=alpine -- sh
# Dentro do container:
# wget -q -O- http://mamaloo-backend:8025/
# wget -q -O- http://mamaloo-database:5432/
```

---

## 📞 Quando Nada Funcionar

### Resetar tudo e começar do zero
```bash
# CUIDADO: Isso deleta TUDO, incluindo dados!
helm uninstall mamaloo -n mamaloo-dev
kubectl delete namespace mamaloo-dev
kubectl delete pvc -n mamaloo-dev --all

# Depois instalar novamente
./deploy.sh dev
```

### Coletar informações para debugging
```bash
# Criar bundle de debug
kubectl cluster-info dump --output-directory=./cluster-dump

# Ver eventos
kubectl get events -n mamaloo-dev

# Ver logs de todos os pods
for pod in $(kubectl get pods -n mamaloo-dev -o name); do
  echo "=== Logs de $pod ==="
  kubectl logs $pod -n mamaloo-dev
done
```

---

## 📚 Recursos Úteis

- **Helm Docs**: https://helm.sh/docs/
- **Kubernetes Docs**: https://kubernetes.io/docs/
- **Troubleshoot Guide**: https://kubernetes.io/docs/tasks/debug-application-cluster/
- **Helm Hub**: https://artifacthub.io/

---

## ✨ Pro Tips

1. **Usar `--dry-run` antes de mudanças:**
   ```bash
   helm upgrade mamaloo ./helm/mamaloo-app \
     -n mamaloo-dev \
     -f helm/mamaloo-app/values-dev.yaml \
     --dry-run --debug
   ```

2. **Usar `--atomic` para safety:**
   ```bash
   helm upgrade mamaloo ./helm/mamaloo-app \
     -n mamaloo-dev \
     -f helm/mamaloo-app/values-dev.yaml \
     --atomic --timeout 5m
   ```

3. **Ver o que vai mudar:**
   ```bash
   helm diff upgrade mamaloo ./helm/mamaloo-app \
     -n mamaloo-dev \
     -f helm/mamaloo-app/values-dev.yaml
   ```

4. **Usar namespaces para isolamento:**
   ```bash
   # Dev, staging, prod completamente separados
   kubectl create namespace mamaloo-staging
   helm install mamaloo-staging ./helm/mamaloo-app \
     -n mamaloo-staging \
     -f helm/mamaloo-app/values-dev.yaml
   ```

---

**Última atualização**: 16 de novembro de 2025
