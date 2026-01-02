import type { CategoryInfo, Category } from '../types';

export const CATEGORIES: Record<Category, CategoryInfo> = {
  lazer: { id: 'lazer', name: 'Lazer', icon: '🎉', color: '#f472b6' },
  alimentacao: { id: 'alimentacao', name: 'Alimentação', icon: '🍔', color: '#fb923c' },
  transporte: { id: 'transporte', name: 'Transporte', icon: '🚗', color: '#60a5fa' },
  compras: { id: 'compras', name: 'Compras', icon: '🛍️', color: '#a78bfa' },
  saude: { id: 'saude', name: 'Saúde', icon: '💪', color: '#34d399' },
  educacao: { id: 'educacao', name: 'Educação', icon: '📚', color: '#fbbf24' },
  moradia: { id: 'moradia', name: 'Moradia', icon: '🏠', color: '#8b5cf6' },
  veiculo: { id: 'veiculo', name: 'Veículo', icon: '🚙', color: '#ec4899' },
  outros: { id: 'outros', name: 'Outros', icon: '📦', color: '#94a3b8' },
};

export const MONTHS = [
  '',
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

export const COLORS = {
  primary: '#10b981',
  secondary: '#3b82f6',
  warning: '#f59e0b',
  danger: '#ef4444',
  background: '#0f0f1a',
  surface: '#1a1a2e',
  surfaceHover: 'rgba(255,255,255,0.08)',
  border: 'rgba(255,255,255,0.1)',
  text: '#ffffff',
  textMuted: '#94a3b8',
};

export const STORAGE_KEY = 'finny-data';

export const DEFAULT_FIXED_EXPENSES = [
  { name: 'Aluguel', category: 'moradia' as Category, suggested: 1500 },
  { name: 'Condomínio', category: 'moradia' as Category, suggested: 500 },
  { name: 'Energia', category: 'moradia' as Category, suggested: 150 },
  { name: 'Água', category: 'moradia' as Category, suggested: 80 },
  { name: 'Internet', category: 'moradia' as Category, suggested: 100 },
  { name: 'Celular', category: 'outros' as Category, suggested: 50 },
  { name: 'Academia', category: 'saude' as Category, suggested: 100 },
  { name: 'Streaming', category: 'lazer' as Category, suggested: 50 },
  { name: 'Transporte', category: 'transporte' as Category, suggested: 300 },
  { name: 'Alimentação', category: 'alimentacao' as Category, suggested: 800 },
];
