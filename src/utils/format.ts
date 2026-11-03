const integerFormat = new Intl.NumberFormat('en-US');

export function formatInt(value: number): string {
  return integerFormat.format(Math.round(value));
}

export function formatDecimal(value: number, digits = 2): string {
  return value.toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

export function formatPct(value: number, digits = 1, signed = false): string {
  const sign = signed && value > 0 ? '+' : '';
  return `${sign}${value.toFixed(digits)}%`;
}
