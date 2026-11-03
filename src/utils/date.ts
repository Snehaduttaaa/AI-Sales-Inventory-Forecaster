const MS_PER_DAY = 86_400_000;

export function parseIso(iso: string): Date {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

export function toIso(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function addDays(iso: string, days: number): string {
  return toIso(new Date(parseIso(iso).getTime() + days * MS_PER_DAY));
}

/** 0 = Monday ... 6 = Sunday */
export function weekday(iso: string): number {
  return (parseIso(iso).getUTCDay() + 6) % 7;
}

export function formatShortDate(iso: string): string {
  return parseIso(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' });
}

export function formatLongDate(iso: string): string {
  return parseIso(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
