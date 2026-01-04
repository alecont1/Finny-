# Analise da Integracao Stripe - Finny

## Data: 2026-01-04

## Status: INTEGRACAO JA EXISTENTE

---

## Arquivos Encontrados

| Arquivo | Proposito |
|---------|-----------|
| `supabase/functions/create-checkout/index.ts` | Cria sessao de checkout |
| `supabase/functions/stripe-webhook/index.ts` | Processa eventos do Stripe |
| `src/pages/Checkout.tsx` | Pagina de pagamento |
| `.env.example` | Template de variaveis |
| `supabase/schema.sql` | Campos de subscription |

---

## Edge Functions

### create-checkout

Funcionalidades:
- Cria/reutiliza customer no Stripe
- Cria sessao de checkout com trial de 7 dias
- Suporta cupons promocionais
- Retorna URL de pagamento
- Locale pt-BR

### stripe-webhook

Eventos tratados:
- `checkout.session.completed` - Ativa subscription
- `customer.subscription.updated` - Atualiza status
- `customer.subscription.deleted` - Cancela subscription
- `invoice.payment_failed` - Marca como past_due

---

## Schema do Banco

Campos de subscription na tabela `profiles`:
```sql
stripe_customer_id TEXT
stripe_subscription_id TEXT
subscription_status TEXT ('none', 'trialing', 'active', 'canceled', 'past_due')
plan TEXT ('free', 'premium', 'trial')
plan_expires_at TIMESTAMPTZ
trial_ends_at TIMESTAMPTZ
```

---

## Pagina de Checkout

`src/pages/Checkout.tsx`:
- Layout moderno com trial de 7 dias
- Preco R$ 12,90/mes apos trial
- Lista de beneficios premium
- Integracao com Edge Function
- Tratamento de erros

---

## Variaveis Necessarias

### Frontend (Vercel)
- Nao precisa de variavel Stripe (nao usa SDK cliente)

### Edge Functions (Supabase Secrets)
```
STRIPE_SECRET_KEY=sk_test_xxx ou sk_live_xxx
STRIPE_PRICE_ID=price_1SlfIGRoGwTts6CYTOkrDBMS
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

---

## O Que Falta Configurar

1. **Secrets no Supabase** (Edge Functions):
   - STRIPE_SECRET_KEY
   - STRIPE_PRICE_ID
   - STRIPE_WEBHOOK_SECRET

2. **Webhook no Stripe Dashboard**:
   - Endpoint: https://rchcsqgkpnmriyavnkjw.supabase.co/functions/v1/stripe-webhook
   - Eventos necessarios

3. **Deploy das Functions** (se ainda nao foram deployadas)

---

## Fluxo de Assinatura

```
Usuario -> Checkout.tsx
         -> Edge Function create-checkout
         -> Stripe Checkout (hosted)
         -> Sucesso -> Webhook stripe-webhook
         -> Atualiza profiles no Supabase
         -> Usuario vira premium
```

---

## Credenciais do Stripe

- **Account ID**: acct_1Slf2zRoGwTts6CY
- **Produto**: fine premium (prod_Tj7XBzMS4nlsmt)
- **Preco**: R$ 12,90/mes (price_1SlfIGRoGwTts6CYTOkrDBMS)
