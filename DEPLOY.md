# Deploy do Finny

## Pre-requisitos
- Node.js 18+
- Conta no [Supabase](https://supabase.com)
- Conta no [Vercel](https://vercel.com)
- Repositorio no GitHub

## Variaveis de Ambiente Necessarias

| Variavel | Onde Conseguir |
|----------|----------------|
| VITE_SUPABASE_URL | Supabase > Settings > API > Project URL |
| VITE_SUPABASE_ANON_KEY | Supabase > Settings > API > anon public |
| VITE_APP_URL | URL do seu deploy (ex: https://finny.vercel.app) |

## Deploy Passo a Passo

### 1. Configurar Supabase

1. Crie um novo projeto em https://supabase.com
2. Va em **SQL Editor**
3. Execute o conteudo de `supabase/schema.sql`
4. Va em **Settings > API** e copie:
   - Project URL
   - anon public key

### 2. Deploy no Vercel

1. Importe o repositorio no Vercel
2. Configure as variaveis de ambiente:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_APP_URL`
3. Deploy!

### 3. Configurar Stripe (Opcional)

Para funcionalidade premium:

1. Crie conta no [Stripe](https://stripe.com)
2. Copie as chaves em Dashboard > Developers > API Keys
3. Configure no Supabase:
   - Va em **Edge Functions > Secrets**
   - Adicione `STRIPE_SECRET_KEY` e `STRIPE_WEBHOOK_SECRET`

## Deploy Manual via CLI

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Linkar projeto
vercel link

# Configurar variaveis
vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_ANON_KEY production

# Deploy
vercel --prod
```

## Estrutura do Projeto

```
finny/
  src/              # Codigo fonte React
  supabase/
    schema.sql      # Schema do banco de dados
    functions/      # Edge Functions (Stripe)
  docs/             # Documentacao
  dist/             # Build de producao
```

## Troubleshooting

### Build falha no Vercel
- Verifique se todas as variaveis de ambiente estao configuradas
- Verifique se o Node.js version esta correto (18+)

### Erro de autenticacao
- Verifique se a URL do Supabase esta correta
- Verifique se a anon key esta correta
- Verifique se o schema foi aplicado no Supabase

### Transacoes nao salvam
- Verifique se as RLS policies foram criadas
- Verifique os logs no Supabase Dashboard

## Links Uteis

- [Supabase Docs](https://supabase.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [Vite Docs](https://vite.dev)
