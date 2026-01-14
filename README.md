# DEV PROMPTS 🚀

Sistema completo de geração de prompts estruturados para WhatsApp e atendimento automatizado. Crie assistentes de IA profissionais em minutos.

## 📋 Sobre o Projeto

DEV PROMPTS é uma plataforma intuitiva que permite criar prompts profissionais e estruturados para assistentes de IA, especialmente focado em atendimento via WhatsApp. Com um wizard guiado, você pode configurar identidade, contexto, regras, ferramentas e fluxos de conversação.

## 🛠️ Tecnologias Utilizadas

- **Vite** - Build tool e dev server
- **React 18** - Framework JavaScript
- **TypeScript** - Tipagem estática
- **React Router DOM** - Roteamento
- **Tailwind CSS** - Estilização
- **shadcn/ui** - Componentes UI
- **Supabase** - Backend e autenticação
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas
- **@dnd-kit** - Drag and drop
- **Lucide React** - Ícones

## 🚀 Instalação Local

### Pré-requisitos

- Node.js 18+ e npm instalados
- Conta no Supabase (para backend)

### Passos

```bash
# 1. Clone o repositório
git clone https://github.com/eusoualessandrolima/devprompt.git

# 2. Entre no diretório
cd devprompt

# 3. Instale as dependências
npm install

# 4. Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas credenciais do Supabase

# 5. Inicie o servidor de desenvolvimento
npm run dev
```

O projeto estará disponível em `http://localhost:8080`

## 📦 Deploy na Vercel

### Deploy Automático (Recomendado)

1. **Acesse:** https://vercel.com/new
2. **Importe o repositório:** `eusoualessandrolima/devprompt`
3. **Configure as variáveis de ambiente:**
   - `VITE_SUPABASE_URL` - URL do seu projeto Supabase
   - `VITE_SUPABASE_ANON_KEY` - Chave anônima do Supabase
4. **Clique em "Deploy"**

### Deploy via CLI

```bash
# 1. Instale a Vercel CLI
npm i -g vercel

# 2. Faça login na Vercel
vercel login

# 3. Deploy do projeto
vercel

# 4. Configure as variáveis de ambiente
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY

# 5. Deploy em produção
vercel --prod
```

## 🔐 Configuração do Supabase

1. Crie um projeto em https://supabase.com
2. Execute as migrations em `supabase/migrations/`
3. Copie a URL e a chave anônima do projeto
4. Configure as variáveis de ambiente

## 📝 Scripts Disponíveis

```bash
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build de produção
npm run build:dev    # Build de desenvolvimento
npm run preview      # Preview do build
npm run lint         # Executa o linter
```

## 🌐 Estrutura do Projeto

```
devprompt/
├── src/
│   ├── components/      # Componentes React
│   ├── contexts/        # Context API
│   ├── hooks/          # Custom hooks
│   ├── integrations/   # Integrações (Supabase)
│   ├── lib/            # Utilitários
│   ├── pages/          # Páginas da aplicação
│   └── types/          # Tipos TypeScript
├── public/             # Arquivos estáticos
├── supabase/          # Configuração e migrations
└── vercel.json        # Configuração Vercel
```

## 🔧 Configuração Vercel

O projeto já está otimizado para Vercel com:

- ✅ Rewrites configurados para SPA
- ✅ Cache otimizado para assets
- ✅ Variáveis de ambiente configuradas
- ✅ Build command otimizado

## 📄 Licença

Este projeto é privado e de uso exclusivo.

## 👨‍💻 Autor

**Alessandro Lima**
- GitHub: [@eusoualessandrolima](https://github.com/eusoualessandrolima)
- Email: alessandro.tecnologia@gmail.com

---

Desenvolvido com ❤️ por Alessandro Lima
