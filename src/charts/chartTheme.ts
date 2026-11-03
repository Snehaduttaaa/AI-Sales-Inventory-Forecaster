export const chartTheme = {
  ink: '#39352E',
  muted: '#777064',
  grid: '#C8BCA7',
  green: '#477A58',
  lime: '#C5D86D',
  ochre: '#D4A34F',
  red: '#C56D5D',
  paper: '#FAF0DC',
};

export function chartNumber(value: number): string {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 1,
  }).format(value);
}
