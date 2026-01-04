# Deploy Supabase - Finny

## Passo a Passo para Configurar Supabase em Producao

### 1. Criar Projeto no Supabase

1. Acesse https://supabase.com/dashboard
2. Clique em **New Project**
3. Preencha:
   - **Name**: Finny
   - **Database Password**: (guarde em local seguro)
   - **Region**: South America (Sao Paulo) ou mais proximo
4. Clique em **Create new project**
5. Aguarde a criacao (~2 minutos)

### 2. Aplicar o Schema

1. No dashboard do projeto, va em **SQL Editor**
2. Clique em **New query**
3. Copie todo o conteudo do arquivo `supabase/schema.sql`
4. Cole no editor
5. Clique em **Run**
6. Verifique se nao houve erros

### 3. Obter Credenciais

1. Va em **Settings > API**
2. Copie e salve em local seguro:

```
Project URL: https://xxxxxxxx.supabase.co
anon (public) key: eyJhbGci...
service_role key: eyJhbGci... (NUNCA exponha esta chave!)
```

### 4. Configurar Authentication

1. Va em **Authentication > Providers**
2. Verifique que **Email** esta habilitado
3. (Opcional) Para testes, va em **Authentication > Settings**:
   - Desabilite "Enable email confirmations" temporariamente

### 5. Verificar Tabelas Criadas

Va em **Table Editor** e confirme que existem:
- [ ] profiles
- [ ] fixed_expenses
- [ ] temporary_expenses
- [ ] transactions

### 6. Verificar RLS Policies

Va em **Authentication > Policies** e confirme que existem policies para:
- [ ] profiles (SELECT, UPDATE)
- [ ] fixed_expenses (SELECT, INSERT, UPDATE, DELETE)
- [ ] temporary_expenses (SELECT, INSERT, UPDATE, DELETE)
- [ ] transactions (SELECT, INSERT, UPDATE, DELETE)

### 7. Testar a API

```bash
# Substitua pelas suas credenciais
SUPABASE_URL="https://xxxxxxxx.supabase.co"
ANON_KEY="eyJhbGci..."

# Health check
curl "${SUPABASE_URL}/rest/v1/" -H "apikey: ${ANON_KEY}"

# Criar usuario de teste
curl -X POST "${SUPABASE_URL}/auth/v1/signup" \
  -H "apikey: ${ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"email": "teste@teste.com", "password": "senha123"}'
```

---

## Checklist Final

- [ ] Projeto criado no Supabase
- [ ] Schema aplicado (4 tabelas)
- [ ] RLS policies configuradas
- [ ] Triggers funcionando
- [ ] Credenciais salvas em local seguro
- [ ] API testada

---

## Credenciais (PREENCHER)

**IMPORTANTE**: Nao commite este arquivo com credenciais reais!

```
Project URL: _______________________________
Anon Key: _________________________________
Service Role Key: __________________________ (guardar separado)
Database Password: _________________________ (guardar separado)
```

---

## Proximos Passos

Apos configurar o Supabase:
1. Configure as variaveis de ambiente no Vercel
2. Faca o deploy
3. Teste em producao
