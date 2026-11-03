import type { FeatureImportance, GroupResult, ModelMetricRow, ModelMetrics } from '../types';

/**
 * ACTUAL validation results from the project's LightGBM run on the full Walmart M5 data.
 * Direct 28-day-ahead forecast, evaluated on 30,490 series x 28 days = 853,720 rows.
 * These are historical validation metrics (2016), not live results.
 */
const pct = (baseline: number, model: number): number => ((baseline - model) / baseline) * 100;

export const LIGHTGBM: ModelMetricRow = {
  id: 'lightgbm',
  label: 'LightGBM (28-day direct)',
  mae: 1.0389,
  rmse: 2.1091,
  isModel: true,
};

const BASELINES: ModelMetricRow[] = [
  { id: 'mean4wk', label: 'Four-week same-weekday mean', mae: 1.0986, rmse: 2.3472, isModel: false },
  { id: 'lag7', label: 'Seasonal naive (lag 7)', mae: 1.2054, rmse: 2.6601, isModel: false },
  { id: 'lag28', label: 'Seasonal naive (lag 28)', mae: 1.258, rmse: 2.8365, isModel: false },
];

const STRONGEST = BASELINES.reduce((best, row) => (row.mae < best.mae ? row : best));

function group(
  id: string,
  label: string,
  series: number,
  maeBaseline: number,
  maeModel: number,
  rmseBaseline: number,
  rmseModel: number,
): GroupResult {
  return {
    id,
    label,
    series,
    maeBaseline,
    maeModel,
    maeImprovementPct: pct(maeBaseline, maeModel),
    rmseBaseline,
    rmseModel,
    rmseImprovementPct: pct(rmseBaseline, rmseModel),
  };
}

/** Baseline in every group table = four-week same-weekday mean (the strongest baseline). */
const BY_STORE: GroupResult[] = [
  group('CA_1', 'CA_1', 3049, 1.1681, 1.1086, 2.3596, 2.1579),
  group('CA_2', 'CA_2', 3049, 1.1687, 1.107, 2.2305, 2.0394),
  group('CA_3', 'CA_3', 3049, 1.501, 1.3853, 3.1282, 2.7293),
  group('CA_4', 'CA_4', 3049, 0.8143, 0.7891, 1.5303, 1.4018),
  group('TX_1', 'TX_1', 3049, 0.8999, 0.8729, 1.9279, 1.7697),
  group('TX_2', 'TX_2', 3049, 1.0402, 0.9919, 2.0947, 1.889),
  group('TX_3', 'TX_3', 3049, 1.0149, 0.9721, 2.0837, 1.8988),
  group('WI_1', 'WI_1', 3049, 1.0144, 0.9593, 1.8539, 1.6857),
  group('WI_2', 'WI_2', 3049, 1.3418, 1.2312, 3.3914, 2.9949),
  group('WI_3', 'WI_3', 3049, 1.0228, 0.9713, 2.2443, 2.0342),
];

const BY_STATE: GroupResult[] = [
  group('CA', 'California', 12196, 1.163, 1.0975, 2.3807, 2.1348),
  group('TX', 'Texas', 9147, 0.985, 0.9456, 2.0368, 1.8534),
  group('WI', 'Wisconsin', 9147, 1.1264, 1.0539, 2.5804, 2.3057),
];

const BY_CATEGORY: GroupResult[] = [
  group('FOODS', 'Foods', 14370, 1.4225, 1.337, 2.9104, 2.6052),
  group('HOUSEHOLD', 'Household', 10470, 0.8378, 0.7959, 1.6195, 1.4702),
  group('HOBBIES', 'Hobbies', 5650, 0.7582, 0.7309, 1.8238, 1.6549),
];

/** Share of total split gain in the final model (gain importance, percent). */
const FEATURE_IMPORTANCE: FeatureImportance[] = [
  { feature: 'rolling_mean_56', label: '56-day average sales', gainPct: 36.358 },
  { feature: 'rolling_mean_91', label: '91-day average sales', gainPct: 35.611 },
  { feature: 'rolling_mean_28', label: '28-day average sales', gainPct: 8.632 },
  { feature: 'same_wd_mean_8w', label: 'Same-weekday average (8 weeks)', gainPct: 5.746 },
  { feature: 'rolling_mean_14', label: '14-day average sales', gainPct: 3.042 },
  { feature: 'lag_364', label: 'Sales one year earlier', gainPct: 1.375 },
  { feature: 'rolling_mean_7', label: '7-day average sales', gainPct: 1.197 },
  { feature: 'sell_price', label: 'Selling price', gainPct: 1.136 },
  { feature: 'days_since_sale', label: 'Days since last sale', gainPct: 0.875 },
  { feature: 'dept_id', label: 'Department', gainPct: 0.792 },
  { feature: 'price_chg_4w', label: 'Price change vs 4 weeks earlier', gainPct: 0.743 },
  { feature: 'weekofyear', label: 'Week of year', gainPct: 0.531 },
];

export const WINDOW_LABEL = '28 March to 24 April 2016 (d_1886 to d_1913)';

export const MODEL_METRICS: ModelMetrics = {
  modelName: 'LightGBM',
  window: {
    start: '2016-03-28',
    end: '2016-04-24',
    days: 28,
    series: 30490,
    rows: 853720,
    label: WINDOW_LABEL,
  },
  rows: [LIGHTGBM, ...BASELINES],
  strongestBaselineId: STRONGEST.id,
  maeImprovementPct: pct(STRONGEST.mae, LIGHTGBM.mae),
  rmseImprovementPct: pct(STRONGEST.rmse, LIGHTGBM.rmse),
  byStore: BY_STORE,
  byState: BY_STATE,
  byCategory: BY_CATEGORY,
  featureImportance: FEATURE_IMPORTANCE,
  source: 'actual',
};

export const STRONGEST_BASELINE: ModelMetricRow = STRONGEST;
