# Finny SaaS - Guia de Configuração

## 1. Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com) e crie uma conta
2. Clique em "New Project"
3. Escolha um nome (ex: "finny") e uma senha forte
4. Selecione a região mais próxima (São Paulo)
5. Aguarde a criação do projeto

## 2. Executar o Schema SQL

1. No dashboard do Supabase, vá em **SQL Editor**
2. Clique em "New Query"
3. Cole todo o conteúdo do arquivo `supabase/schema.sql`
4. Clique em "Run" (ou Ctrl+Enter)
5. Verifique se não houve erros

## 3. Configurar Autenticação

### Email/Senha
1. Vá em **Authentication > Providers**
2. Email deve estar habilitado por padrão
3. Em **Authentication > URL Configuration**, configure:
   - Site URL: `https://seu-dominio.vercel.app`
   - Redirect URLs:
     - `https://seu-dominio.vercel.app/dashboard`
     - `http://localhost:5173/dashboard` (para desenvolvimento)

### ⚠️ Desabilitar Confirmação de Email (Recomendado para testes)
Por padrão, o Supabase requer confirmação de email. Se você não configurou SMTP, os emails **NÃO serão enviados**.

**Para desabilitar a confirmação de email:**
1. Vá em **Authentication > Providers > Email**
2. Desabilite "Confirm email" (toggle off)
3. Salve as alterações

**Ou para configurar SMTP (produção):**
1. Vá em **Project Settings > Authentication > SMTP Settings**
2. Habilite "Custom SMTP"
3. Configure com seu provedor (SendGrid, Mailgun, etc.)

### Google OAuth (Opcional)
1. Vá em **Authentication > Providers > Google**
2. Habilite o Google
3. Crie credenciais OAuth no [Google Cloud Console](https://console.cloud.google.com/apis/credentials):
   - Clique em "Create Credentials" > "OAuth 2.0 Client IDs"
   - Tipo: Web application
   - **Authorized JavaScript origins**:
     - `https://seu-dominio.vercel.app` (produção)
     - `http://localhost:5173` (desenvolvimento)
   - **Authorized redirect URIs**:
     - `https://[SEU-PROJECT-ID].supabase.co/auth/v1/callback` ⚠️ OBRIGATÓRIO
4. Cole o Client ID e Client Secret no Supabase
5. **IMPORTANTE**: Configure também no Supabase:
   - Vá em **Authentication > URL Configuration**
   - Adicione às Redirect URLs:
     - `https://seu-dominio.vercel.app/dashboard`
     - `http://localhost:5173/dashboard` (desenvolvimento)

## 4. Obter Credenciais

1. Vá em **Settings > API**
2. Copie:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** → `VITE_SUPABASE_ANON_KEY`

## 5. Configurar Variáveis de Ambiente

### Desenvolvimento Local

Crie o arquivo `.env.local` na raiz do projeto:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxxxxx
VITE_APP_URL=http://localhost:5173
```

### Produção (Vercel)

1. Vá no dashboard do Vercel
2. Selecione o projeto Finny
3. Vá em **Settings > Environment Variables**
4. Adicione as mesmas variáveis:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_APP_URL` (seu domínio Vercel)

## 6. Configurar Stripe (Opcional para Pagamentos)

### Dashboard Stripe

1. Crie conta em [stripe.com](https://stripe.com)
2. Vá em **Developers > API Keys**
3. Copie a **Publishable key** → `VITE_STRIPE_PUBLISHABLE_KEY`

### Supabase Edge Function para Checkout

1. Instale a CLI do Supabase: `npm install -g supabase`
2. Faça login: `supabase login`
3. Crie a função:

```bash
supabase functions new create-checkout
```

4. Adicione o código em `supabase/functions/create-checkout/index.ts`:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from "https://esm.sh/stripe@12.0.0?target=deno"

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2022-11-15',
})

serve(async (req) => {
  const { userId, email, returnUrl } = await req.json()

  const session = await stripe.checkout.sessions.create({
    customer_email: email,
    line_items: [{
      price: 'price_xxx', // ID do preço no Stripe
      quantity: 1,
    }],
    mode: 'subscription',
    success_url: `${returnUrl}?success=true`,
    cancel_url: `${returnUrl}?canceled=true`,
    metadata: { userId },
  })

  return new Response(
    JSON.stringify({ url: session.url }),
    { headers: { 'Content-Type': 'application/json' } }
  )
})
```

5. Configure os secrets:

```bash
supabase secrets set STRIPE_SECRET_KEY=sk_xxx
```

6. Deploy:

```bash
supabase functions deploy create-checkout
```

## 7. Deploy

### Railway

1. Push para o GitHub
2. Importe o repositório no Railway
3. Configure as variáveis de ambiente:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_APP_URL` = `https://seu-projeto.up.railway.app` ⚠️ **OBRIGATÓRIO para OAuth**
4. Deploy automático!

### Vercel

1. Push para o GitHub
2. Importe o repositório no Vercel
3. Configure as variáveis de ambiente:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_APP_URL` = `https://seu-projeto.vercel.app` ⚠️ **OBRIGATÓRIO para OAuth**
4. Deploy automático!

### Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Preview do build
npm run preview
```

## Troubleshooting

### "Invalid API key"
- Verifique se as variáveis de ambiente estão corretas
- O Supabase URL deve incluir `https://`

### Email de confirmação não chega
- O Supabase não envia emails se SMTP não estiver configurado
- **Solução rápida**: Desabilite "Confirm email" em Authentication > Providers > Email
- **Solução produção**: Configure SMTP em Project Settings > Authentication > SMTP Settings

### "Email ou senha incorretos" após cadastro
- Provavelmente o email não foi confirmado
- Vá no Supabase Dashboard > Authentication > Users
- Encontre o usuário e confirme manualmente clicando em "Confirm email"
- Ou desabilite a confirmação de email (ver seção acima)

### "RLS policy violation"
- Execute o schema SQL novamente
- Verifique se as policies foram criadas corretamente

### Usuários não conseguem se cadastrar
- Verifique as configurações de URL no Supabase Auth
- Adicione os domínios às Redirect URLs

### Google Login não funciona
- **Erro "redirect_uri_mismatch"**: A URL de callback não está registrada no Google Cloud Console
  - Adicione `https://[SEU-PROJECT-ID].supabase.co/auth/v1/callback` às Authorized redirect URIs
- **OAuth popup fecha sem login**: Verifique se o Client ID e Secret estão corretos no Supabase
- **VITE_APP_URL não configurada**:
  - Esta variável é OBRIGATÓRIA para o OAuth funcionar em produção
  - Configure no Railway/Vercel: `VITE_APP_URL=https://sua-url-de-producao.app`
- **Erro no console "Auth error"**:
  - Verifique se o Google Provider está habilitado no Supabase
  - Confirme que as Redirect URLs incluem sua URL de produção + `/dashboard`

## Próximos Passos

1. Configure um domínio personalizado
2. Ative o Google Analytics
3. Configure emails transacionais no Supabase
4. Adicione monitoramento de erros (Sentry)
