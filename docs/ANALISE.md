# Analise do Projeto Finny

## Data: 2026-01-03

## Visao Geral

**Finny** e um aplicativo SaaS de controle financeiro pessoal desenvolvido com tecnologias modernas.

## Stack Tecnologica

### Frontend
- **Framework**: React 19.2.0
- **Bundler**: Vite 7.2.4
- **Linguagem**: TypeScript 5.9.3
- **Roteamento**: React Router DOM 7.11.0
- **Estado Global**: Zustand 5.0.9
- **Estilizacao**: TailwindCSS 4.1.18

### Backend/Banco de Dados
- **BaaS**: Supabase
  - Autenticacao (Email/Senha, Google OAuth)
  - Banco PostgreSQL com RLS
  - Edge Functions (Deno)
- **Pagamentos**: Stripe (checkout e webhooks)

### Deploy
- **Frontend**: Vercel
- **Backend**: Supabase Cloud

## Estrutura de Pastas

```
finny/
├── docs/                    # Documentacao
├── public/                  # Arquivos estaticos
├── src/
│   ├── components/
│   │   ├── auth/           # ProtectedRoute
│   │   ├── dashboard/      # Cards, graficos, seletores
│   │   ├── expenses/       # Modal, lista, item de despesa
│   │   ├── onboarding/     # Steps do onboarding
│   │   ├── premium/        # Banners e modais premium
│   │   ├── settings/       # Configuracoes do usuario
│   │   └── ui/             # Componentes reutilizaveis
│   ├── hooks/              # Custom hooks
│   ├── lib/                # Configuracao Supabase
│   ├── pages/              # Paginas da aplicacao
│   ├── store/              # Zustand store
│   ├── styles/             # CSS global
│   ├── types/              # TypeScript types
│   └── utils/              # Funcoes utilitarias
├── supabase/
│   ├── functions/          # Edge Functions
│   │   ├── create-checkout/
│   │   └── stripe-webhook/
│   └── schema.sql          # Schema do banco
└── arquivos de config
```

## Variaveis de Ambiente Necessarias

### Frontend (.env.local)
```
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx
VITE_APP_URL=http://localhost:3000
```

### Edge Functions (Supabase Secrets)
```
STRIPE_SECRET_KEY=sk_xxx
STRIPE_PRICE_ID=price_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

## Scripts Disponiveis

```bash
npm run dev      # Servidor de desenvolvimento (porta 3000)
npm run build    # Build de producao (tsc + vite)
npm run lint     # Verificacao ESLint
npm run preview  # Preview do build
```

## Modelo de Dados

### Tabelas no Supabase

1. **profiles** - Perfil do usuario
   - Configuracoes financeiras (salario, renda extra, dia do pagamento)
   - Metas (poupanca, orcamento lazer)
   - Plano (free, premium, trial)
   - Stripe IDs

2. **fixed_expenses** - Despesas fixas mensais
   - Nome, valor, categoria
   - Status ativo/inativo

3. **temporary_expenses** - Despesas temporarias/parceladas
   - Nome, valor, categoria
   - Periodo (mes/ano inicio e fim)

4. **transactions** - Gastos variaveis diarios
   - Descricao, valor, categoria, data
   - Limite de 30/mes para plano free

## Fluxo da Aplicacao

1. **Landing** -> Login/Signup
2. **Autenticacao** -> Supabase Auth
3. **Onboarding** -> Configurar perfil inicial
4. **Dashboard** -> Visualizar financas
5. **Expenses** -> Adicionar/gerenciar gastos
6. **Settings** -> Configuracoes e despesas fixas
7. **Checkout** -> Upgrade para Premium (Stripe)

## Funcionalidades Principais

- Cadastro/Login com email ou Google
- Onboarding guiado em etapas
- Dashboard com resumo financeiro
- Adicao de gastos variaveis por categoria
- Gerenciamento de despesas fixas
- Despesas temporarias/parceladas
- Visao anual
- Plano Free (30 transacoes/mes) e Premium (ilimitado)
- Trial de 7 dias

## Categorias de Despesas

- Lazer
- Alimentacao
- Transporte
- Compras
- Saude
- Educacao
- Moradia
- Veiculo
- Outros

## Observacoes

- O projeto usa placeholder para Supabase quando nao configurado
- RLS (Row Level Security) habilitado em todas as tabelas
- Trigger automatico para criar profile ao registrar usuario
- Trigger para verificar limite de transacoes no plano free
