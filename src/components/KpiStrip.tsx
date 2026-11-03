import type { DashboardSummary } from '../types';

const statWavePath = `M 0,57
  C 5,48 8,35 14,42
  C 19,49 21,63 27,54
  C 32,45 34,13 41,9
  C 47,5 49,33 55,36
  C 61,40 64,54 69,39
  C 74,25 76,29 81,32
  C 86,35 87,8 92,5
  C 96,2 98,11 100,0`;

interface KpiStripProps {
  summary: DashboardSummary;
}

export function KpiStrip({ summary }: KpiStripProps) {
  const items = [
    {
      label: 'Products',
      value: summary.totalProducts.toLocaleString(),
      stroke: '#4E8B44',
      gradientStart: 'rgba(78, 139, 68, 0.30)',
      gradientEnd: 'rgba(78, 139, 68, 0.0)',
    },
    {
      label: 'Stores',
      value: summary.totalStores.toLocaleString(),
      stroke: '#333333',
      gradientStart: 'rgba(50, 50, 50, 0.22)',
      gradientEnd: 'rgba(50, 50, 50, 0.0)',
    },
    {
      label: 'Product-store series',
      value: summary.totalSeries.toLocaleString(),
      stroke: '#4E8B44',
      gradientStart: 'rgba(78, 139, 68, 0.30)',
      gradientEnd: 'rgba(78, 139, 68, 0.0)',
    },
    {
      label: 'Forecast horizon',
      value: `${summary.forecastHorizonDays} days`,
      stroke: '#333333',
      gradientStart: 'rgba(50, 50, 50, 0.22)',
      gradientEnd: 'rgba(50, 50, 50, 0.0)',
    },
  ];

  return (
    <div className="kpi-strip">
      {items.map((item, index) => (
        <article className="kpi-card stat-card" key={item.label}>
          <svg
            className="stat-wave"
            viewBox="0 0 100 75"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id={`stat-wave-gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={item.gradientStart} />
                <stop offset="100%" stopColor={item.gradientEnd} />
              </linearGradient>
            </defs>
            <path
              d={`${statWavePath} L 100,75 L 0,75 Z`}
              fill={`url(#stat-wave-gradient-${index})`}
              stroke="none"
            />
            <path
              d={statWavePath}
              fill="none"
              stroke={item.stroke}
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="stat-card-content">
            <span className="kpi-card__label">{item.label}</span>
            <strong className="kpi-card__value">{item.value}</strong>
          </div>
        </article>
      ))}
    </div>
  );
}
