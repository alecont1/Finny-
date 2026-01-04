import { useState, useCallback, useSyncExternalStore } from 'react';

/**
 * Hook para persistir um valor no localStorage
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  // Estado para armazenar o valor
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Erro ao ler localStorage:', error);
      return initialValue;
    }
  });

  // Funcao para atualizar o valor
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error('Erro ao salvar no localStorage:', error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue];
}

// Store simples para detectar client-side
const clientStore = {
  subscribe: () => () => {},
  getSnapshot: () => true,
  getServerSnapshot: () => false,
};

/**
 * Hook para detectar se o codigo esta rodando no lado do cliente
 * Usa useSyncExternalStore para evitar o pattern de setState em useEffect
 */
export function useIsClient(): boolean {
  return useSyncExternalStore(
    clientStore.subscribe,
    clientStore.getSnapshot,
    clientStore.getServerSnapshot
  );
}
