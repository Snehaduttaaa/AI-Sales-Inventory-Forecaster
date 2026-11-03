import type { DailyPoint } from '../types';

export function movingAverage(values: number[], windowSize: number): number[] {
  return values.map((_, index) => {
    const start = Math.max(0, index - windowSize + 1);
    const window = values.slice(start, index + 1);
    return window.reduce((sum, value) => sum + value, 0) / window.length;
  });
}

export function calculateChange(current: number, previous: number): number {
  if (previous === 0) return current === 0 ? 0 : 100;
  return ((current - previous) / Math.abs(previous)) * 100;
}

export function getTotalSales(points: DailyPoint[]): number {
  return points.reduce((total, point) => total + (point.actual ?? point.forecast ?? 0), 0);
}

export function getAverageSales(points: DailyPoint[]): number {
  return points.length ? getTotalSales(points) / points.length : 0;
}

export function getPeakDay(points: DailyPoint[]): DailyPoint | null {
  if (!points.length) return null;
  return points.reduce((peak, point) =>
    (point.actual ?? point.forecast ?? 0) > (peak.actual ?? peak.forecast ?? 0) ? point : peak,
  );
}

export function getForecastRange(values: number[], percentage = 0.15) {
  return values.map(value => ({
    lower: Math.max(0, value * (1 - percentage)),
    upper: value * (1 + percentage),
  }));
}
