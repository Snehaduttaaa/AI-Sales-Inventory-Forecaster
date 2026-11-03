import { useEffect, useState } from 'react';
import { getForecast, getStores, getProducts } from '../services/api';
import type { ForecastResponse, Store, Product } from '../types';
import { PageHeader } from '../components/PageHeader';
import { Section } from '../components/Section';
import { Field } from '../components/Field';
import { Segmented } from '../components/Segmented';
import { Notice } from '../components/Notice';
import { DataState } from '../components/DataState';
import { SourceTag } from '../components/SourceTag';
import ForecastChart from '../charts/ForecastChart';

const HORIZONS = [
  { label: '7 days', value: '7' },
  { label: '14 days', value: '14' },
  { label: '28 days', value: '28' },
];

export default function DemandForecastPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [storeId, setStoreId] = useState('');
  const [productId, setProductId] = useState('');
  const [horizon, setHorizon] = useState('28');
  const [forecast, setForecast] = useState<ForecastResponse | null>(null);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [loadingForecast, setLoadingForecast] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadOptions() {
      try {
        const [storeResults, productResults] = await Promise.all([
          getStores(),
          getProducts(),
        ]);

        if (!active) return;

        setStores(storeResults);
        setProducts(productResults);

        if (storeResults.length) setStoreId(storeResults[0].id);
        if (productResults.length) setProductId(productResults[0].id);
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : 'Unable to load stores and products.');
        }
      } finally {
        if (active) setLoadingOptions(false);
      }
    }

    loadOptions();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!storeId || !productId) return;

    let active = true;

    async function loadForecast() {
      try {
        setLoadingForecast(true);
        setError(null);

        const result = await getForecast(storeId, productId, Number(horizon));

        if (active) setForecast(result);
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : 'Unable to generate forecast.');
          setForecast(null);
        }
      } finally {
        if (active) setLoadingForecast(false);
      }
    }

    loadForecast();
    return () => { active = false; };
  }, [storeId, productId, horizon]);

  const selectedStore = stores.find((store) => store.id === storeId);
  const selectedProduct = products.find((product) => product.id === productId);

  if (loadingOptions) {
    return <DataState title="Preparing demand forecasting" message="Loading available stores and products..." />;
  }

  return (
    <div className="page page--forecast">
      <PageHeader
        eyebrow="DEMAND FORECASTING"
        title="See what demand might look like next."
        description="Explore estimated product demand over the next one to four weeks."
        action={<SourceTag source="demo" />}
      />

      <Notice tone="warning" title="Historical research prototype">
        This demonstration uses the Walmart M5 dataset, which ends in April 2016.
        Forecasts displayed here are demonstration outputs, not live predictions.
      </Notice>

      <div className="forecast-layout">
        <Section title="Configure your forecast" description="Choose a store, product, and forecasting horizon.">
          <div className="forecast-controls">
            <Field label="Store">
              <select value={storeId} onChange={(event) => setStoreId(event.target.value)} disabled={!stores.length}>
                {stores.map((store) => (
                  <option key={store.id} value={store.id}>{store.label}</option>
                ))}
              </select>
            </Field>

            <Field label="Product">
              <select value={productId} onChange={(event) => setProductId(event.target.value)} disabled={!products.length}>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>{product.label}</option>
                ))}
              </select>
            </Field>

            <Field label="Forecast horizon">
              <Segmented options={HORIZONS} value={horizon} onChange={setHorizon} />
            </Field>
          </div>
        </Section>

        <Section
          title="Demand forecast"
          description={`${selectedProduct?.label ?? 'Selected product'} at ${selectedStore?.label ?? 'selected store'} — next ${horizon} days.`}
        >
          {error ? (
            <Notice tone="warning" title="Something went wrong">{error}</Notice>
          ) : loadingForecast ? (
            <DataState title="Building your forecast" message="Preparing the selected demand series..." />
          ) : forecast ? (
            <ForecastChart
              key={`${forecast.storeId}-${forecast.productId}-${forecast.horizonDays}`}
              points={forecast.points}
            />
          ) : (
            <DataState title="Choose a product to begin" message="Select an available store and product to view its demand forecast." />
          )}
        </Section>
      </div>

      <p className="page-footnote">
        Forecast values are estimates, not guaranteed sales. Actual demand may differ
        because of promotions, stockouts, price changes, and other external factors.
      </p>
    </div>
  );
}
