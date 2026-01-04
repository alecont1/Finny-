# Erros Encontrados - Projeto Finny

## Data: 2026-01-03

---

## ERRO 1: setState em useEffect - AddExpenseModal.tsx

**Arquivo:** `src/components/expenses/AddExpenseModal.tsx:33`

**Erro:**
```
Error: Calling setState synchronously within an effect can trigger cascading renders
```

**Codigo problematico:**
```typescript
useEffect(() => {
  if (!isOpen) {
    setAmount('');
    setDescription('');
    setCategory(null);
    setDate(getCurrentDateISO());
  }
}, [isOpen]);
```

**Analise:** O ESLint (react-hooks/set-state-in-effect) esta alertando que chamar setState dentro de useEffect pode causar renderizacoes em cascata. O correto seria resetar o estado usando uma funcao de callback ou um pattern diferente.

**Status:** A CORRIGIR

---

## ERRO 2: setState em useEffect - ProfileSettings.tsx

**Arquivo:** `src/components/settings/ProfileSettings.tsx:21`

**Erro:**
```
Error: Calling setState synchronously within an effect can trigger cascading renders
```

**Codigo problematico:**
```typescript
useEffect(() => {
  if (profile) {
    setSalary(formatNumberForInput(profile.salary));
    setOtherIncome(formatNumberForInput(profile.otherIncome));
    setPayDay(profile.payDay.toString());
    setHasAdvance(profile.hasAdvance);
    // ...
  }
}, [profile]);
```

**Analise:** Mesmo problema - sincronizando estado derivado dentro de useEffect. Pode ser resolvido usando valores iniciais derivados ou memoizacao.

**Status:** A CORRIGIR

---

## ERRO 3: setState em useEffect - useLocalStorage.ts

**Arquivo:** `src/hooks/useLocalStorage.ts:45`

**Erro:**
```
Error: Calling setState synchronously within an effect can trigger cascading renders
```

**Codigo problematico:**
```typescript
useEffect(() => {
  setIsClient(true);
}, []);
```

**Analise:** Hook de deteccao de client-side. Pode ser refatorado usando um pattern diferente.

**Status:** A CORRIGIR

---

## WARNING 1: Missing dependency - useSubscription.ts

**Arquivo:** `src/hooks/useSubscription.ts:27`

**Warning:**
```
React Hook useEffect has a missing dependency: 'fetchSubscription'. Either include it or remove the dependency array
```

**Analise:** A funcao fetchSubscription deveria estar no array de dependencias do useEffect, ou ser envolta em useCallback.

**Status:** A CORRIGIR

---

## Resumo

| # | Tipo | Arquivo | Linha | Status |
|---|------|---------|-------|--------|
| 1 | Error | AddExpenseModal.tsx | 33 | Pendente |
| 2 | Error | ProfileSettings.tsx | 21 | Pendente |
| 3 | Error | useLocalStorage.ts | 45 | Pendente |
| 4 | Warning | useSubscription.ts | 27 | Pendente |

**Total:** 3 erros, 1 warning
