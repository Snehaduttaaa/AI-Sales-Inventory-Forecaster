import type { DashboardSummary } from '../types';

interface KpiStripProps {
  summary: DashboardSummary;
}

export function KpiStrip({ summary }: KpiStripProps) {
  const items = [
    {
      label: 'Products',
      value: summary.totalProducts.toLocaleString(),
      detail: 'Across the dataset',
    },
    {
      label: 'Stores',
      value: summary.totalStores.toLocaleString(),
      detail: 'Retail locations',
    },
    {
      label: 'Product-store series',
      value: summary.totalSeries.toLocaleString(),
      detail: 'Demand histories',
    },
    {
      label: 'Forecast horizon',
      value: `${summary.forecastHorizonDays} days`,
      detail: 'Prediction window',
    },
  ];

  return (
    <div className="kpi-strip">
      {items.map((item) => (
        <article className="kpi-card" key={item.label}>
          <span className="kpi-card__source">Demo data</span>
          <span className="kpi-card__label">{item.label}</span>
          <strong className="kpi-card__value">{item.value}</strong>
          <span className="kpi-card__detail">{item.detail}</span>
        </article>
      ))}
    </div>
  );
}
