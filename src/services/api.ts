import { API_BASE_URL, USE_DEMO_DATA } from './config';
import type {
  DashboardSummary,
  DatasetInfo,
  ForecastResponse,
  ModelMetrics,
  Product,
  Store,
} from '../types';
import {
  DEMO_PRODUCTS,
  FORECAST_HORIZON_DAYS,
  PRODUCT_COUNT,
  SERIES_COUNT,
  STORES,
  STORE_COUNT,
} from '../data/reference';
import { LIGHTGBM, MODEL_METRICS, STRONGEST_BASELINE, WINDOW_LABEL } from '../data/modelResults';
import { RISK_INSIGHTS, TREND_INSIGHTS } from '../data/insights';
import { DATASET_INFO } from '../data/datasetFacts';
import { buildDemoForecast, buildDemoNetworkTrend } from '../data/demo';

type Query = Record<string, string | number>;

async function request<T>(path: string, query: Query = {}): Promise<T> {
  const url = new URL(path, API_BASE_URL);
  Object.entries(query).forEach(([key, value]) => url.searchParams.set(key, String(value)));
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request to ${path} failed (${response.status})`);
  }
  return (await response.json()) as T;
}

const pause = (ms = 150): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

export async function getDashboardSummary(): Promise<DashboardSummary> {
  if (!USE_DEMO_DATA) return request<DashboardSummary>('/api/dashboard/summary');
  await pause();
  return {
    totalProducts: PRODUCT_COUNT,
    totalStores: STORE_COUNT,
    totalSeries: SERIES_COUNT,
    forecastHorizonDays: FORECAST_HORIZON_DAYS,
    model: {
      name: MODEL_METRICS.modelName,
      mae: LIGHTGBM.mae,
      rmse: LIGHTGBM.rmse,
      maeImprovementPct: MODEL_METRICS.maeImprovementPct,
      rmseImprovementPct: MODEL_METRICS.rmseImprovementPct,
      baselineLabel: STRONGEST_BASELINE.label,
      windowLabel: WINDOW_LABEL,
      source: 'actual',
    },
    networkTrend: { source: 'demo', points: buildDemoNetworkTrend() },
    trends: TREND_INSIGHTS,
    risks: RISK_INSIGHTS,
  };
}

export async function getStores(): Promise<Store[]> {
  if (!USE_DEMO_DATA) return request<Store[]>('/api/stores');
  await pause(60);
  return STORES;
}

export async function getProducts(): Promise<Product[]> {
  if (!USE_DEMO_DATA) return request<Product[]>('/api/products');
  await pause(60);
  return DEMO_PRODUCTS;
}

export async function getForecast(storeId: string, productId: string, horizonDays: number): Promise<ForecastResponse> {
  if (!USE_DEMO_DATA) {
    return request<ForecastResponse>('/api/forecast', { store_id: storeId, product_id: productId, horizon_days: horizonDays });
  }
  await pause(120);
  return buildDemoForecast(storeId, productId, horizonDays);
}

export async function getModelMetrics(): Promise<ModelMetrics> {
  if (!USE_DEMO_DATA) return request<ModelMetrics>('/api/model/metrics');
  await pause();
  return MODEL_METRICS;
}

export async function getDatasetInfo(): Promise<DatasetInfo> {
  if (!USE_DEMO_DATA) return request<DatasetInfo>('/api/dataset/info');
  await pause();
  return DATASET_INFO;
}
