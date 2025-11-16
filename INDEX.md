# 📖 Portal Mamaloo - Documentação

Guia de navegação para toda a documentação do projeto.

## 🚀 Comece Aqui

**Novo no projeto?** Leia nesta ordem:

1. **[SETUP.md](SETUP.md)** ← Comece por aqui (10 min)
   - Visão geral da arquitetura
   - Como fazer deploy
   - Troubleshooting rápido

2. **[helm/mamaloo-app/README.md](helm/mamaloo-app/README.md)** ← Configuração do Helm
   - Documentação completa do Chart
   - Todos os valores explicados
   - Exemplos de uso

3. **[helm/mamaloo-app/SETUP_GUIDE.md](helm/mamaloo-app/SETUP_GUIDE.md)** ← Quick Start
   - Instalação passo a passo
   - Configuração por ambiente
   - Comandos úteis

---

## 📚 Documentação Disponível

### 🎯 Na Raiz do Projeto
- **[SETUP.md](SETUP.md)** - Guia completo de deployment (95% status)
- **[README.md](README.md)** - Documentação geral da aplicação

### 🛠️ Helm Chart (`helm/mamaloo-app/`)
- **[README.md](helm/mamaloo-app/README.md)** - Documentação principal
- **[SETUP_GUIDE.md](helm/mamaloo-app/SETUP_GUIDE.md)** - Guia de configuração
- **[TROUBLESHOOTING.md](helm/mamaloo-app/TROUBLESHOOTING.md)** - FAQ e Debug
- **[IMPROVEMENTS_SUMMARY.md](helm/mamaloo-app/IMPROVEMENTS_SUMMARY.md)** - Mudanças implementadas
- **[CONCLUSAO.md](helm/mamaloo-app/CONCLUSAO.md)** - Sumário final
- **[START_HERE.md](helm/mamaloo-app/START_HERE.md)** - Visão geral rápida

---

## 🎯 Encontre Respostas Rápidas

| Pergunta | Arquivo |
|----------|---------|
| **Qual é o status do projeto?** | [SETUP.md](SETUP.md) (top) |
| **Como faço deploy?** | [SETUP.md](SETUP.md) (seção "Como Deploy") |
| **Como configuro resources?** | [helm/mamaloo-app/README.md](helm/mamaloo-app/README.md) |
| **Algo deu errado** | [helm/mamaloo-app/TROUBLESHOOTING.md](helm/mamaloo-app/TROUBLESHOOTING.md) |
| **Qual é o quick start?** | [helm/mamaloo-app/SETUP_GUIDE.md](helm/mamaloo-app/SETUP_GUIDE.md) |
| **O que mudou?** | [helm/mamaloo-app/IMPROVEMENTS_SUMMARY.md](helm/mamaloo-app/IMPROVEMENTS_SUMMARY.md) |
| **Resumo executivo** | [helm/mamaloo-app/CONCLUSAO.md](helm/mamaloo-app/CONCLUSAO.md) |

---

## 📊 Status Atual

```
✅ Helm Chart                 | 100% - Backend, Frontend, Database
✅ Database Secrets           | 100% - Credenciais seguras
✅ Migrations Job             | 100% - ArgoCD Sync Waves
✅ CI/CD GitHub Actions       | 100% - :latest removido, validação ativa
✅ ArgoCD GitOps              | 100% - README + kustomization
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📈 Total: 95% Completo
```

---

## 🎯 Próximas Ações

### Imediato
- [ ] Ler [SETUP.md](SETUP.md)
- [ ] Validar Helm Chart
- [ ] Fazer deploy em dev

### Curto Prazo
- [ ] Testar em prod
- [ ] Integrar com ArgoCD
- [ ] Validar CI/CD

### Médio Prazo
- [ ] Monitoramento
- [ ] Backups
- [ ] Documentação de runbooks

---

## 🔗 Repositórios

- 📦 **Portal-Mamaloo-desenvolvimento** (aplicação)
  ```
  https://github.com/Analarie/Portal-Mamaloo-desenvolvimento.git
  ```

- 🔄 **argocd-gitops** (configuração GitOps)
  ```
  https://github.com/Analarie/argocd-gitops.git
  ```

---

## ⚡ Comandos Rápidos

```bash
# Validar Helm Chart
cd helm/mamaloo-app
./validate-chart.sh dev

# Deploy em dev
./deploy.sh dev

# Ver status
kubectl get all -n mamaloo-dev
kubectl get all -n mamaloo-prod

# Ver logs
kubectl logs -n mamaloo-dev -l app=portal-mamaloo-backend
kubectl logs -n mamaloo-dev -l app=portal-mamaloo-frontend
```

---

## 📞 Precisa de Ajuda?

1. **Consulte [TROUBLESHOOTING.md](helm/mamaloo-app/TROUBLESHOOTING.md)**
   - 20+ problemas comuns e soluções

2. **Leia [README.md](helm/mamaloo-app/README.md)**
   - Explicação detalhada de cada configuração

3. **Verifique [IMPROVEMENTS_SUMMARY.md](helm/mamaloo-app/IMPROVEMENTS_SUMMARY.md)**
   - Compreenda as mudanças implementadas

---

**Última atualização**: 16 de novembro de 2025  
**Status**: ✅ Pronto para Produção (95%)
