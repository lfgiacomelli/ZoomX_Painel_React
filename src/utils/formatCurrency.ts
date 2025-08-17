/**
 * Formats a number as Brazilian Real (BRL) currency
 * @param value - The numeric value to format
 * @param options - Optional formatting options
 * @returns Formatted currency string or fallback text if invalid
 */
export function formatCurrency(
  value: number | string | null | undefined,
  options: Intl.NumberFormatOptions = {}
): string {
  if (value === null || value === undefined) {
    return 'R$ --';
  }

  const numericValue = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(numericValue)) {
    return 'R$ --';
  }

  const defaultOptions: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  };

  try {
    return new Intl.NumberFormat('pt-BR', {
      ...defaultOptions,
      ...options,
    }).format(numericValue);
  } catch (error) {
    console.error('Currency formatting error:', error);
    return `R$ ${numericValue.toFixed(2).replace('.', ',')}`;
  }
}