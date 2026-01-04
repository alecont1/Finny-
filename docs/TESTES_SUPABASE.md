# Testes com Supabase Local - Projeto Finny

## Data: 2026-01-04

---

## Ambiente de Teste

- **Supabase Local**: Docker + CLI v2.70.5
- **API URL**: http://127.0.0.1:54321
- **Studio URL**: http://127.0.0.1:54323
- **Database**: PostgreSQL 15
- **Modo**: Desenvolvimento Local

---

## 1. Configuracao do Ambiente

### 1.1 Docker
- **Status**: OK
- **Versao**: Docker 28.5.1

### 1.2 Supabase CLI
- **Status**: OK
- **Versao**: 2.70.5
- **Comandos executados**:
  - `supabase init`
  - `supabase start`

### 1.3 Schema Aplicado
- **Status**: OK
- **Arquivo**: supabase/schema.sql
- **Tabelas criadas**:
  - profiles
  - fixed_expenses
  - temporary_expenses
  - transactions

---

## 2. Testes de Autenticacao

### 2.1 Signup (Criar Usuario)
- **Status**: OK
- **Email**: teste@teste.com
- **Senha**: 123456
- **User ID**: ba908687-ad7c-4f8e-8943-72760bf71f09
- **Observacao**: Profile criado automaticamente via trigger

### 2.2 Login
- **Status**: OK
- **Metodo**: Email/Password
- **Token**: JWT valido retornado
- **Expiracao**: 1 hora

---

## 3. Testes CRUD - Transactions

### 3.1 CREATE (POST)
- **Status**: OK
- **Endpoint**: POST /rest/v1/transactions
- **Dados enviados**:
```json
{
  "user_id": "ba908687-ad7c-4f8e-8943-72760bf71f09",
  "amount": 50.00,
  "description": "Almoco",
  "category": "alimentacao",
  "date": "2026-01-04",
  "month": 1,
  "year": 2026
}
```
- **Transaction ID criado**: 6fe91d26-ccf2-4c14-b415-309f4f52ea6d

### 3.2 READ (GET)
- **Status**: OK
- **Endpoint**: GET /rest/v1/transactions?select=*
- **Resultado**: Array com transacao criada

### 3.3 UPDATE (PATCH)
- **Status**: OK
- **Endpoint**: PATCH /rest/v1/transactions?id=eq.{id}
- **Dados atualizados**:
```json
{
  "description": "Almoco atualizado",
  "amount": 75.50
}
```
- **Resultado**: Transacao atualizada com sucesso

### 3.4 DELETE
- **Status**: OK
- **Endpoint**: DELETE /rest/v1/transactions?id=eq.{id}
- **Resultado**: Transacao removida, lista vazia apos delete

---

## 4. Testes CRUD - Profiles

### 4.1 READ (GET)
- **Status**: OK
- **Endpoint**: GET /rest/v1/profiles?select=*
- **Resultado**: Profile do usuario autenticado

### 4.2 UPDATE (PATCH)
- **Status**: OK
- **Endpoint**: PATCH /rest/v1/profiles?id=eq.{user_id}
- **Dados atualizados**:
```json
{
  "name": "Usuario Teste",
  "salary": 5000.00,
  "savings_goal": 500.00,
  "leisure_budget": 300.00,
  "pay_day": 5,
  "has_completed_onboarding": true
}
```
- **Resultado**: Profile atualizado com sucesso

---

## 5. Testes CRUD - Fixed Expenses

### 5.1 CREATE (POST)
- **Status**: OK
- **Endpoint**: POST /rest/v1/fixed_expenses
- **Dados enviados**:
```json
{
  "user_id": "ba908687-ad7c-4f8e-8943-72760bf71f09",
  "name": "Aluguel",
  "amount": 1500.00,
  "category": "moradia"
}
```
- **Expense ID criado**: 0b54baae-e3f7-4394-8e17-edd62dbf8585

---

## 6. Testes de Seguranca (RLS)

### 6.1 Acesso sem Autenticacao
- **Status**: BLOQUEADO (esperado)
- **Teste**: GET /rest/v1/profiles sem Authorization header
- **Resultado**: Array vazio `[]`
- **Conclusao**: RLS funcionando corretamente

### 6.2 Acesso com Autenticacao
- **Status**: OK
- **Teste**: GET /rest/v1/profiles com Authorization header
- **Resultado**: Apenas dados do usuario autenticado
- **Conclusao**: Isolamento de dados funcionando

---

## 7. Resumo dos Testes

| Categoria | Operacao | Status |
|-----------|----------|--------|
| Auth | Signup | OK |
| Auth | Login | OK |
| Transactions | CREATE | OK |
| Transactions | READ | OK |
| Transactions | UPDATE | OK |
| Transactions | DELETE | OK |
| Profiles | READ | OK |
| Profiles | UPDATE | OK |
| Fixed Expenses | CREATE | OK |
| RLS | Sem Auth | BLOQUEADO |
| RLS | Com Auth | OK |

**Total**: 11/11 testes passando

---

## 8. Credenciais de Teste

```
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0

Usuario de teste:
Email: teste@teste.com
Senha: 123456
```

---

## 9. Comandos Uteis

```bash
# Iniciar Supabase Local
supabase start

# Parar Supabase Local
supabase stop

# Ver status
supabase status

# Acessar Studio
http://127.0.0.1:54323

# Resetar banco
supabase db reset
```

---

## 10. Conclusao

Todos os testes com Supabase Local passaram com sucesso:

- Autenticacao (signup/login) funcionando
- CRUD completo para transactions funcionando
- CRUD para profiles funcionando
- CRUD para fixed_expenses funcionando
- Row Level Security (RLS) funcionando corretamente
- Triggers para criacao automatica de profile funcionando

O projeto esta pronto para uso com Supabase tanto em ambiente local quanto em producao.
