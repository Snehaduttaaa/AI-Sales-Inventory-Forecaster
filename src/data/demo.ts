import type { DailyPoint, ForecastResponse, TrendPoint } from '../types';
import { addDays, weekday } from '../utils/date';
import { DATA_END_DATE } from './reference';

/**
 * DEMONSTRATION DATA ONLY.
 * Everything generated in this file is synthetic and deterministic. It is NOT M5 data and
 * NOT output of the trained model. It exists so the UI can be shown before the backend exists.
 */
const HISTORY_DAYS = 84;
const MAX_HORIZON = 28;
const WEEKDAY_PROFILE = [0.88, 0.84, 0.9, 0.97, 1.12, 1.32, 1.22]; // Monday to Sunday

interface Profile {
  base: number;
  noise: number;
  trend: number;
}

const PROFILES: Record<string, Profile> = {
  HOBBIES_1_004: { base: 1.6, noise: 0.5, trend: 0.0008 },
  HOBBIES_2_031: { base: 0.9, noise: 0.6, trend: 0 },
  HOUSEHOLD_1_040: { base: 2.2, noise: 0.45, trend: 0.0006 },
  HOUSEHOLD_1_118: { base: 3.1, noise: 0.4, trend: 0.001 },
  HOUSEHOLD_2_017: { base: 1.4, noise: 0.5, trend: 0.0012 },
  FOODS_1_058: { base: 4.2, noise: 0.35, trend: 0.0005 },
  FOODS_2_197: { base: 2.8, noise: 0.4, trend: 0.0014 },
  FOODS_3_090: { base: 18.5, noise: 0.3, trend: 0.0007 },
  FOODS_3_586: { base: 9.4, noise: 0.33, trend: 0.001 },
};
const FALLBACK_PROFILE: Profile = { base: 2, noise: 0.4, trend: 0.001 };

function hashString(text: string): number {
  let hash = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function createRng(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function buildDemoForecast(storeId: string, productId: string, horizonDays: number): ForecastResponse {
  const profile = PROFILES[productId] ?? FALLBACK_PROFILE;
  const rng = createRng(hashString(`${storeId}|${productId}`));
  const storeFactor = 0.75 + (hashString(storeId) % 500) / 1000;

  const expected = (offset: number, date: string): number =>
    profile.base *
    storeFactor *
    WEEKDAY_PROFILE[weekday(date)] *
    (1 + profile.trend * offset) *
    (1 + 0.06 * Math.sin((2 * Math.PI * offset) / 91));

  const points: DailyPoint[] = [];

  for (let offset = -HISTORY_DAYS + 1; offset <= 0; offset += 1) {
    const date = addDays(DATA_END_DATE, offset);
    const mean = expected(offset, date);
    const jitter = (rng() + rng() + rng() - 1.5) * 2 * profile.noise * mean;
    points.push({ date, actual: Math.max(0, Math.round(mean + jitter)), forecast: null });
  }

  const horizon = Math.min(horizonDays, MAX_HORIZON);
  for (let offset = 1; offset <= horizon; offset += 1) {
    const date = addDays(DATA_END_DATE, offset);
    const mean = expected(offset, date) * (1 + 0.03 * Math.sin(offset * 1.7));
    points.push({ date, actual: null, forecast: Math.round(mean * 10) / 10 });
  }

  return { storeId, productId, historyEnd: DATA_END_DATE, horizonDays: horizon, points, source: 'demo' };
}

/** Synthetic weekly demand index (first week = 100). Not real network totals. */
export function buildDemoNetworkTrend(): TrendPoint[] {
  const rng = createRng(hashString('network'));
  const lastWeekStart = addDays(DATA_END_DATE, -6);
  return Array.from({ length: 52 }, (_, i) => {
    const seasonal = 1 + 0.07 * Math.sin((2 * Math.PI * i) / 52 + 1.1);
    const growth = 1 + 0.0016 * i;
    const noise = 1 + (rng() - 0.5) * 0.03;
    return {
      weekStart: addDays(lastWeekStart, -7 * (51 - i)),
      index: Math.round(100 * growth * seasonal * noise * 10) / 10,
    };
  });
}
