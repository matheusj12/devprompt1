# 🚀 Guia de Deploy na Vercel - DevPrompt

## ✅ Configurações Realizadas

### 1. Removido Lovable
- ✅ Removida dependência `lovable-tagger`
- ✅ Removidas referências de imagens do Lovable
- ✅ Atualizado vite.config.ts

### 2. Configuração de Cache
- ✅ Meta tags de cache no HTML
- ✅ Headers de cache na Vercel
- ✅ Assets com cache longo (1 ano)
- ✅ HTML sem cache (sempre atualizado)

### 3. Otimizações
- ✅ Code splitting configurado
- ✅ Chunks otimizados (vendor, ui)
- ✅ Sourcemaps desabilitados em produção
- ✅ SPA routing configurado

## 📦 Deploy na Vercel

### Opção 1: Deploy Automático (Recomendado)

1. **Acesse:** https://vercel.com/new
2. **Faça login** com sua conta
3. **Importe o repositório:**
   - Clique em "Import Git Repository"
   - Selecione: `eusoualessandrolima/devprompt`
4. **Configure o projeto:**
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. **Adicione as variáveis de ambiente:**
   - `VITE_SUPABASE_URL` = sua URL do Supabase
   - `VITE_SUPABASE_ANON_KEY` = sua chave anônima do Supabase
6. **Clique em "Deploy"**

### Opção 2: Deploy via CLI

```bash
# 1. Instale a Vercel CLI globalmente
npm install -g vercel

# 2. Faça login na Vercel
vercel login

# 3. No diretório do projeto, execute
vercel

# 4. Siga as instruções:
# - Set up and deploy? Yes
# - Which scope? Selecione sua conta
# - Link to existing project? No
# - What's your project's name? devprompt
# - In which directory is your code located? ./
# - Want to override the settings? No

# 5. Adicione as variáveis de ambiente
vercel env add VITE_SUPABASE_URL production
# Cole sua URL do Supabase quando solicitado

vercel env add VITE_SUPABASE_ANON_KEY production
# Cole sua chave quando solicitado

# 6. Deploy em produção
vercel --prod
```

## 🔐 Configurar Variáveis de Ambiente

### No Supabase:
1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **Settings** → **API**
4. Copie:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** → `VITE_SUPABASE_ANON_KEY`

### Na Vercel:
1. Acesse seu projeto na Vercel
2. Vá em **Settings** → **Environment Variables**
3. Adicione as variáveis copiadas do Supabase

## 🔄 Atualizações Futuras

Sempre que você fizer alterações:

```bash
git add .
git commit -m "Descrição das alterações"
git push
```

A Vercel vai fazer o deploy automaticamente! 🎉

## 🌐 Domínio Personalizado

Para adicionar um domínio próprio:

1. Na Vercel, vá em **Settings** → **Domains**
2. Clique em **Add Domain**
3. Digite seu domínio
4. Configure os DNS conforme instruções

## 📊 Monitoramento

- **Analytics:** Vercel → seu projeto → Analytics
- **Logs:** Vercel → seu projeto → Deployments → View Function Logs
- **Performance:** Vercel → seu projeto → Speed Insights

## ⚡ Recursos Configurados

- ✅ **Cache otimizado:** Assets com cache de 1 ano
- ✅ **HTML dinâmico:** Sem cache para sempre carregar a versão mais recente
- ✅ **SPA Routing:** Todas as rotas funcionam corretamente
- ✅ **Code Splitting:** Carregamento otimizado
- ✅ **Build otimizado:** Chunks separados para melhor performance

## 🆘 Problemas Comuns

### Build falha:
- Verifique se as variáveis de ambiente estão configuradas
- Execute `npm install` localmente e teste `npm run build`

### Rotas 404:
- Já configurado! O `vercel.json` resolve isso

### Cache não atualiza:
- Já configurado! Headers de cache estão otimizados
- Ctrl+Shift+R para forçar reload no navegador

---

**Projeto configurado e pronto para deploy! 🚀**
