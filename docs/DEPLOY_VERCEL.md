# Deploy Vercel - Finny

## Opcao 1: Deploy via Dashboard (Recomendado)

### 1. Importar Projeto

1. Acesse https://vercel.com/dashboard
2. Clique em **Add New... > Project**
3. Conecte sua conta GitHub (se ainda nao conectou)
4. Selecione o repositorio **Finny-**
5. Selecione a branch: `claude/create-finny-app-0Xt97` (ou main)

### 2. Configurar Build

O Vercel deve detectar automaticamente:
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 3. Configurar Variaveis de Ambiente

Antes de fazer deploy, adicione as variaveis:

| Variavel | Valor | Ambiente |
|----------|-------|----------|
| VITE_SUPABASE_URL | https://xxx.supabase.co | Production |
| VITE_SUPABASE_ANON_KEY | eyJhbGci... | Production |
| VITE_APP_URL | (deixe vazio, sera preenchido apos deploy) | Production |

### 4. Deploy

1. Clique em **Deploy**
2. Aguarde o build (~1-2 minutos)
3. Acesse a URL gerada

### 5. Atualizar VITE_APP_URL

1. Apos o deploy, copie a URL (ex: https://finny-xxx.vercel.app)
2. Va em **Settings > Environment Variables**
3. Adicione/atualize `VITE_APP_URL` com a URL
4. Faca um novo deploy para aplicar

---

## Opcao 2: Deploy via CLI

### 1. Instalar Vercel CLI

```bash
npm install -g vercel
```

### 2. Login

```bash
vercel login
```

### 3. Linkar Projeto

```bash
cd finny
vercel link
```

Responda as perguntas:
- Set up: Yes
- Scope: (sua conta)
- Link to existing project: No (ou Yes se ja existe)
- Project Name: finny
- Directory: ./

### 4. Configurar Variaveis

```bash
# Adicionar variaveis de producao
vercel env add VITE_SUPABASE_URL production
# (digite o valor quando solicitado)

vercel env add VITE_SUPABASE_ANON_KEY production
# (digite o valor quando solicitado)
```

### 5. Deploy

```bash
# Preview deploy (para testar)
vercel

# Production deploy
vercel --prod
```

---

## Configuracoes do Projeto

Crie ou edite `vercel.json` na raiz do projeto:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

O rewrite e necessario para o React Router funcionar em producao.

---

## Checklist

- [ ] Projeto importado no Vercel
- [ ] Variaveis de ambiente configuradas
- [ ] Build passando
- [ ] Deploy em producao funcionando
- [ ] URL salva

---

## URLs do Projeto (PREENCHER)

```
Production: ________________________________
Preview: __________________________________
Dashboard: https://vercel.com/xxx/finny
```

---

## Troubleshooting

### Build falha

1. Verifique se as variaveis de ambiente estao corretas
2. Verifique os logs do build
3. Tente rodar `npm run build` localmente

### 404 em rotas

Adicione o `vercel.json` com rewrites (veja acima)

### Erros de CORS

1. Verifique se a URL do Supabase esta correta
2. No Supabase, va em **Authentication > URL Configuration**
3. Adicione a URL do Vercel em "Redirect URLs"

### Variaveis nao funcionam

1. Lembre que variaveis Vite precisam comecar com `VITE_`
2. Faca redeploy apos alterar variaveis
