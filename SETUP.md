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

### Google OAuth (Opcional)
1. Vá em **Authentication > Providers > Google**
2. Habilite o Google
3. Crie credenciais OAuth no [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
4. Cole o Client ID e Client Secret

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

### Vercel (Recomendado)

1. Push para o GitHub
2. Importe o repositório no Vercel
3. Configure as variáveis de ambiente
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

### "RLS policy violation"
- Execute o schema SQL novamente
- Verifique se as policies foram criadas corretamente

### Usuários não conseguem se cadastrar
- Verifique as configurações de URL no Supabase Auth
- Adicione os domínios às Redirect URLs

## Próximos Passos

1. Configure um domínio personalizado
2. Ative o Google Analytics
3. Configure emails transacionais no Supabase
4. Adicione monitoramento de erros (Sentry)
