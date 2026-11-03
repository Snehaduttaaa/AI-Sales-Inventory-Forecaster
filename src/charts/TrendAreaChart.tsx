import type { TrendPoint } from '../types';
import { chartTheme, chartNumber } from './chartTheme';

interface TrendAreaChartProps {
  points: TrendPoint[];
  height?: number;
}

export default function TrendAreaChart({
  points,
  height = 220,
}: TrendAreaChartProps) {
  if (!points.length) {
    return <div className="chart-empty">No trend data available.</div>;
  }

  const width = 700;
  const padding = { top: 16, right: 18, bottom: 34, left: 44 };
  const values = points.map(point => point.index);
  const maxValue = Math.max(1, ...values) * 1.15;
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  const x = (index: number) =>
    padding.left + (points.length === 1 ? plotWidth / 2 : (index / (points.length - 1)) * plotWidth);

  const y = (value: number) =>
    padding.top + plotHeight - (value / maxValue) * plotHeight;

  const line = points.map((point, index) =>
    `${index === 0 ? 'M' : 'L'} ${x(index)} ${y(point.index)}`
  ).join(' ');

  const area = `${line} L ${x(points.length - 1)} ${padding.top + plotHeight} L ${x(0)} ${padding.top + plotHeight} Z`;

  return (
    <div className="chart-wrap">
      <svg
        className="chart-svg"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Sales trend area chart"
      >
        {[0, 0.5, 1].map((fraction, index) => {
          const value = maxValue * fraction;
          return (
            <g key={index}>
              <line
                x1={padding.left}
                x2={width - padding.right}
                y1={y(value)}
                y2={y(value)}
                stroke={chartTheme.grid}
                strokeDasharray="3 5"
              />
              <text
                x={padding.left - 9}
                y={y(value) + 4}
                textAnchor="end"
                className="chart-axis-label"
              >
                {chartNumber(value)}
              </text>
            </g>
          );
        })}

        <path d={area} fill={chartTheme.lime} opacity="0.22" />
        <path
          d={line}
          fill="none"
          stroke={chartTheme.green}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {[0, Math.floor((points.length - 1) / 2), points.length - 1]
          .filter((value, index, array) => array.indexOf(value) === index)
          .map(index => (
            <text
              key={index}
              x={x(index)}
              y={height - 10}
              textAnchor="middle"
              className="chart-axis-label"
            >
              {points[index]?.weekStart}
            </text>
          ))}
      </svg>
    </div>
  );
}
