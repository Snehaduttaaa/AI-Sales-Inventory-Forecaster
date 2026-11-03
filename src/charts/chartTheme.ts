export const chartTheme = {
  ink: '#26352D',
  muted: '#78847B',
  grid: '#E7E9E2',
  green: '#477A58',
  lime: '#C5D86D',
  ochre: '#D4A34F',
  red: '#C56D5D',
  paper: '#FBFAF6',
};

export function chartNumber(value: number): string {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 1,
  }).format(value);
}
