import { MONTHS } from './constants';

/**
 * Formata um valor numérico para moeda brasileira (R$)
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/**
 * Formata uma data ISO para formato brasileiro
 */
export function formatDate(date: string): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d);
}

/**
 * Formata uma data ISO para formato curto (dia/mês)
 */
export function formatDateShort(date: string): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
  }).format(d);
}

/**
 * Retorna o nome do mês baseado no número (1-12)
 */
export function formatMonth(month: number): string {
  return MONTHS[month] || '';
}

/**
 * Formata mês e ano para exibição
 */
export function formatMonthYear(month: number, year: number): string {
  return `${MONTHS[month]} ${year}`;
}

/**
 * Converte string de input para número (remove formatação)
 */
export function parseInputToNumber(value: string): number {
  const cleaned = value.replace(/[^\d,.-]/g, '').replace(',', '.');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Formata número para input (com vírgula decimal)
 */
export function formatNumberForInput(value: number): string {
  if (value === 0) return '';
  return value.toFixed(2).replace('.', ',');
}

/**
 * Gera um ID único
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Retorna a data atual no formato ISO (YYYY-MM-DD)
 */
export function getCurrentDateISO(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Retorna o mês atual (1-12)
 */
export function getCurrentMonth(): number {
  return new Date().getMonth() + 1;
}

/**
 * Retorna o ano atual
 */
export function getCurrentYear(): number {
  return new Date().getFullYear();
}
