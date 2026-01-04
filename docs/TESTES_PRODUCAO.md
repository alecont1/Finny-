# Testes em Producao - Finny

## URL de Producao

**URL**: _________________________________ (preencher apos deploy)

---

## Checklist de Testes

### 1. Landing Page
- [ ] Pagina inicial carrega
- [ ] Botao "Comecar" funciona
- [ ] Botao "Login" funciona
- [ ] Layout responsivo OK

### 2. Autenticacao

#### Signup
- [ ] Pagina /signup carrega
- [ ] Formulario valida campos vazios
- [ ] Formulario valida email invalido
- [ ] Formulario valida senha curta
- [ ] Criar conta funciona
- [ ] Redireciona para onboarding

#### Login
- [ ] Pagina /login carrega
- [ ] Login com credenciais corretas funciona
- [ ] Login com credenciais erradas mostra erro
- [ ] Link "Esqueci a senha" funciona
- [ ] Redireciona para dashboard

#### Logout
- [ ] Botao de logout funciona
- [ ] Redireciona para login
- [ ] Sessao encerrada

### 3. Onboarding
- [ ] Step 1: Welcome carrega
- [ ] Step 2: Income funciona
- [ ] Step 3: Fixed Expenses funciona
- [ ] Step 4: Leisure Budget funciona
- [ ] Step 5: Savings Goal funciona
- [ ] Step 6: Complete funciona
- [ ] Redireciona para dashboard

### 4. Dashboard
- [ ] Dashboard carrega
- [ ] Mostra saldo disponivel
- [ ] Mostra resumo do mes
- [ ] Mostra gastos por categoria
- [ ] Mostra orcamento de lazer
- [ ] Seletor de mes funciona
- [ ] Botao "+" abre modal

### 5. Adicionar Transacao
- [ ] Modal abre
- [ ] Campo de valor funciona
- [ ] Campo de descricao funciona
- [ ] Seletor de categoria funciona
- [ ] Seletor de data funciona
- [ ] Validacao funciona
- [ ] Salvar cria transacao
- [ ] Modal fecha
- [ ] Dashboard atualiza

### 6. Historico de Despesas
- [ ] Pagina /history carrega
- [ ] Lista transacoes
- [ ] Ordenacao por data funciona
- [ ] Filtro por categoria funciona
- [ ] Editar transacao funciona
- [ ] Excluir transacao funciona

### 7. Configuracoes
- [ ] Pagina /settings carrega
- [ ] Tab Perfil funciona
- [ ] Editar salario funciona
- [ ] Editar metas funciona
- [ ] Tab Despesas Fixas funciona
- [ ] Adicionar despesa fixa funciona
- [ ] Editar despesa fixa funciona
- [ ] Excluir despesa fixa funciona
- [ ] Tab Dados funciona
- [ ] Exportar dados funciona

### 8. Visao Anual
- [ ] Pagina /annual carrega
- [ ] Mostra resumo anual
- [ ] Grafico carrega

### 9. Responsividade

#### Mobile (375x667)
- [ ] Landing OK
- [ ] Login OK
- [ ] Dashboard OK
- [ ] Menu funciona
- [ ] Modal de adicionar OK

#### Tablet (768x1024)
- [ ] Landing OK
- [ ] Dashboard OK
- [ ] Tabelas legiveis

#### Desktop (1920x1080)
- [ ] Layout completo OK
- [ ] Sem scroll horizontal

### 10. Performance
- [ ] Primeira carga < 3s
- [ ] Navegacao fluida
- [ ] Sem erros no console
- [ ] Sem memory leaks

---

## Erros Encontrados

| # | Erro | Severidade | Pagina | Status |
|---|------|------------|--------|--------|
| 1 | ... | Alta/Media/Baixa | ... | Pendente/Resolvido |

---

## Notas de Teste

**Testador**: _________________
**Data**: _________________
**Browser**: _________________
**Dispositivo**: _________________

### Observacoes:
- ...

---

## Resumo

| Categoria | Total | Passou | Falhou |
|-----------|-------|--------|--------|
| Landing | 4 | | |
| Auth | 12 | | |
| Onboarding | 7 | | |
| Dashboard | 7 | | |
| Transacoes | 8 | | |
| Historico | 6 | | |
| Config | 10 | | |
| Anual | 2 | | |
| Responsivo | 9 | | |
| Performance | 4 | | |
| **TOTAL** | **69** | | |
