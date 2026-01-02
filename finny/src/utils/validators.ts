/**
 * Valida se um valor é um número positivo
 */
export function isPositiveNumber(value: number): boolean {
  return typeof value === 'number' && value > 0 && !isNaN(value);
}

/**
 * Valida se um valor é um número não negativo
 */
export function isNonNegativeNumber(value: number): boolean {
  return typeof value === 'number' && value >= 0 && !isNaN(value);
}

/**
 * Valida se uma string não está vazia
 */
export function isNotEmpty(value: string): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Valida se um dia do mês é válido (1-31)
 */
export function isValidDayOfMonth(day: number): boolean {
  return Number.isInteger(day) && day >= 1 && day <= 31;
}

/**
 * Valida se um mês é válido (1-12)
 */
export function isValidMonth(month: number): boolean {
  return Number.isInteger(month) && month >= 1 && month <= 12;
}

/**
 * Valida se um ano é válido (2020-2100)
 */
export function isValidYear(year: number): boolean {
  return Number.isInteger(year) && year >= 2020 && year <= 2100;
}

/**
 * Valida dados do perfil do usuário
 */
export function validateProfile(profile: {
  salary?: number;
  payDay?: number;
}): string[] {
  const errors: string[] = [];

  if (profile.salary !== undefined && !isPositiveNumber(profile.salary)) {
    errors.push('Salário deve ser um valor positivo');
  }

  if (profile.payDay !== undefined && !isValidDayOfMonth(profile.payDay)) {
    errors.push('Dia do pagamento deve ser entre 1 e 31');
  }

  return errors;
}

/**
 * Valida dados de uma despesa
 */
export function validateExpense(expense: {
  amount?: number;
  description?: string;
}): string[] {
  const errors: string[] = [];

  if (expense.amount !== undefined && !isPositiveNumber(expense.amount)) {
    errors.push('Valor deve ser maior que zero');
  }

  if (expense.description !== undefined && !isNotEmpty(expense.description)) {
    errors.push('Descrição é obrigatória');
  }

  return errors;
}
