# Configuracao Stripe - Finny

## Data: 2026-01-04

## Status: CONFIGURADO

---

## Credenciais

| Item | Valor |
|------|-------|
| Account ID | acct_1Slf2zRoGwTts6CY |
| Conta | Fineplanner |
| Produto | fine premium |
| Product ID | prod_Tj7XBzMS4nlsmt |
| Price ID | price_1SlfIGRoGwTts6CYTOkrDBMS |
| Preco | R$ 12,90/mes |

---

## Edge Functions Deployadas

| Function | Status | URL |
|----------|--------|-----|
| create-checkout | ACTIVE | https://rchcsqgkpnmriyavnkjw.supabase.co/functions/v1/create-checkout |
| stripe-webhook | ACTIVE | https://rchcsqgkpnmriyavnkjw.supabase.co/functions/v1/stripe-webhook |

---

## Secrets Configurados no Supabase

- [x] STRIPE_SECRET_KEY
- [x] STRIPE_PRICE_ID
- [x] STRIPE_WEBHOOK_SECRET

---

## Webhook Stripe

### Endpoint
```
https://rchcsqgkpnmriyavnkjw.supabase.co/functions/v1/stripe-webhook
```

### Eventos a Configurar no Dashboard

1. `checkout.session.completed`
2. `customer.subscription.updated`
3. `customer.subscription.deleted`
4. `invoice.payment_failed`

### Como Configurar

1. Acesse https://dashboard.stripe.com/webhooks
2. Clique em "Add endpoint"
3. Cole o endpoint acima
4. Selecione os eventos listados
5. Clique em "Add endpoint"
6. Copie o Signing secret (whsec_...)
7. Atualize no Supabase se necessario:
   ```bash
   npx supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_xxx
   ```

---

## Fluxo de Pagamento

```
1. Usuario clica "Comecar Trial" na pagina /checkout
2. Frontend chama Edge Function create-checkout
3. create-checkout cria customer e session no Stripe
4. Usuario e redirecionado para Checkout do Stripe
5. Usuario insere cartao
6. Stripe processa pagamento
7. Stripe envia webhook para stripe-webhook
8. stripe-webhook atualiza profile no Supabase
9. Usuario tem acesso premium
```

---

## Testar com Cartao de Teste

```
Numero: 4242 4242 4242 4242
Validade: qualquer data futura
CVC: qualquer 3 digitos
CEP: qualquer
```

---

## Comandos Uteis

```bash
# Verificar functions deployadas
npx supabase functions list

# Ver logs das functions
npx supabase functions logs create-checkout
npx supabase functions logs stripe-webhook

# Atualizar secret
npx supabase secrets set STRIPE_SECRET_KEY=sk_xxx

# Deploy de uma function
npx supabase functions deploy create-checkout
npx supabase functions deploy stripe-webhook
```

---

## Troubleshooting

### Erro "STRIPE_PRICE_ID not configured"
```bash
npx supabase secrets set STRIPE_PRICE_ID=price_1SlfIGRoGwTts6CYTOkrDBMS
```

### Erro de webhook signature
Verifique se o STRIPE_WEBHOOK_SECRET esta correto:
1. Va no Stripe Dashboard > Webhooks
2. Clique no endpoint
3. Revele o Signing secret
4. Atualize no Supabase

### Erro 401 na Edge Function
Verifique se o usuario esta autenticado antes de chamar a function
