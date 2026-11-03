export type DataSource = 'actual' | 'demo';
export type StateCode = 'CA' | 'TX' | 'WI';
export type CategoryId = 'HOBBIES' | 'HOUSEHOLD' | 'FOODS';
export type TrendDirection = 'up' | 'down' | 'flat';

export interface Store {
  id: string;
  label: string;
  state: StateCode;
}

export interface Product {
  id: string;
  label: string;
  category: CategoryId;
  department: string;
}

export interface DailyPoint {
  date: string; // ISO yyyy-mm-dd
  actual: number | null;
  forecast: number | null;
}

export interface ForecastResponse {
  storeId: string;
  productId: string;
  historyEnd: string;
  horizonDays: number;
  points: DailyPoint[];
  source: DataSource;
}

export interface ForecastSummary {
  totalUnits: number;
  averageDaily: number;
  peakDate: string;
  peakUnits: number;
  previousAverage: number;
  changePct: number;
  direction: TrendDirection;
}

export interface TrendPoint {
  weekStart: string;
  index: number;
}

export interface Insight {
  id: string;
  figure: string;
  title: string;
  detail: string;
  source: DataSource;
}

export interface ModelMetricRow {
  id: string;
  label: string;
  mae: number;
  rmse: number;
  isModel: boolean;
}

export interface GroupResult {
  id: string;
  label: string;
  series: number;
  maeBaseline: number;
  maeModel: number;
  maeImprovementPct: number;
  rmseBaseline: number;
  rmseModel: number;
  rmseImprovementPct: number;
}

export interface FeatureImportance {
  feature: string;
  label: string;
  gainPct: number;
}

export interface ValidationWindow {
  start: string;
  end: string;
  days: number;
  series: number;
  rows: number;
  label: string;
}

export interface ModelMetrics {
  modelName: string;
  window: ValidationWindow;
  rows: ModelMetricRow[];
  strongestBaselineId: string;
  maeImprovementPct: number;
  rmseImprovementPct: number;
  byStore: GroupResult[];
  byState: GroupResult[];
  byCategory: GroupResult[];
  featureImportance: FeatureImportance[];
  source: DataSource;
}

export interface DashboardSummary {
  totalProducts: number;
  totalStores: number;
  totalSeries: number;
  forecastHorizonDays: number;
  model: {
    name: string;
    mae: number;
    rmse: number;
    maeImprovementPct: number;
    rmseImprovementPct: number;
    baselineLabel: string;
    windowLabel: string;
    source: DataSource;
  };
  networkTrend: { source: DataSource; points: TrendPoint[] };
  trends: Insight[];
  risks: Insight[];
}

export interface DatasetFile {
  name: string;
  rows: number;
  columns: number;
  sizeMb: number;
  description: string;
}

export interface QualityCheck {
  label: string;
  result: string;
  passed: boolean | null; // null = informational
}

export interface CountBreakdown {
  id: string;
  label: string;
  series: number;
  stores?: number;
}

export interface DatasetInfo {
  name: string;
  files: DatasetFile[];
  coverage: { start: string; end: string; days: number; calendarEnd: string };
  counts: { products: number; stores: number; series: number; departments: number };
  seriesByState: CountBreakdown[];
  seriesByCategory: CountBreakdown[];
  split: { trainStart: string; trainEnd: string; trainRows: number; validationStart: string; validationEnd: string };
  quality: QualityCheck[];
  observations: Insight[];
}
