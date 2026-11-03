import { useEffect, useRef, useState } from 'react';
import type { DailyPoint } from '../types';
import { chartTheme, chartNumber } from './chartTheme';
import { formatShortDate } from '../utils/date';

interface ForecastChartProps {
  points: DailyPoint[];
  height?: number;
}

export default function ForecastChart({
  points,
  height = 280,
}: ForecastChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<{ index: number; x: number; y: number } | null>(null);
  const [chartWidth, setChartWidth] = useState(760);

  useEffect(() => {
    const element = chartRef.current;
    if (!element) return;

    const resize = () => setChartWidth(Math.max(240, Math.round(element.clientWidth)));
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    return () => observer.disconnect();
  }, [points.length]);

  if (!points.length) {
    return <div className="chart-empty">No forecast data available.</div>;
  }

  const width = chartWidth;
  const chartHeight = Math.max(height, 340);
  const padding = { top: 24, right: 24, bottom: 58, left: 60 };
  const values = points.flatMap((point) => [point.actual, point.forecast])
    .filter((value): value is number => value !== null);
  const maxValue = Math.max(1, ...values) * 1.15;
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = chartHeight - padding.top - padding.bottom;

  const x = (index: number) =>
    padding.left + (points.length === 1 ? plotWidth / 2 : (index / (points.length - 1)) * plotWidth);

  const y = (value: number) =>
    padding.top + plotHeight - (value / maxValue) * plotHeight;

  const makeLine = (key: 'actual' | 'forecast') => {
    let active = false;
    return points.map((point, index) => {
      const value = point[key];
      if (value === null) {
        active = false;
        return '';
      }
      const command = `${active ? 'L' : 'M'} ${x(index)} ${y(value)}`;
      active = true;
      return command;
    }).filter(Boolean).join(' ');
  };

  const actualLine = makeLine('actual');
  const forecastLine = makeLine('forecast');

  const tickValues = [0, 0.25, 0.5, 0.75, 1].map((fraction) => maxValue * fraction);
  const labelCount = Math.min(width < 480 ? 3 : 5, points.length);
  const labelIndexes = labelCount === 1
    ? [0]
    : Array.from({ length: labelCount }, (_, index) =>
      Math.round((index * (points.length - 1)) / (labelCount - 1)),
    ).filter((value, index, array) => array.indexOf(value) === index);
  const firstForecastIndex = points.findIndex((point) => point.forecast !== null);

  const showTooltip = (index: number, clientX: number, clientY: number) => {
    const bounds = chartRef.current?.getBoundingClientRect();
    if (!bounds) return;
    setTooltip({
      index,
      x: Math.max(8, Math.min(clientX - bounds.left + 12, bounds.width - 188)),
      y: Math.max(8, clientY - bounds.top - 18),
    });
  };

  const showFocusedTooltip = (index: number, value: number) => {
    const bounds = chartRef.current?.getBoundingClientRect();
    if (!bounds) return;
    showTooltip(
      index,
      bounds.left + (x(index) / width) * bounds.width,
      bounds.top + (y(value) / chartHeight) * bounds.height,
    );
  };

  return (
    <div className="forecast-chart">
      <div className="chart-wrap" ref={chartRef}>
        <svg
          className="chart-svg"
          viewBox={`0 0 ${width} ${chartHeight}`}
          role="img"
          aria-label="Daily actual sales and forecast units chart"
        >
          {tickValues.map((value, index) => (
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
                x={padding.left - 10}
                y={y(value) + 4}
                textAnchor="end"
                className="chart-axis-label"
              >
                {chartNumber(value)}
              </text>
            </g>
          ))}

          <path
            d={actualLine}
            fill="none"
            stroke={chartTheme.green}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={forecastLine}
            fill="none"
            stroke={chartTheme.ochre}
            strokeWidth="3"
            strokeDasharray="7 5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {firstForecastIndex >= 0 && (
            <g>
              <line
                x1={x(firstForecastIndex)}
                x2={x(firstForecastIndex)}
                y1={padding.top}
                y2={padding.top + plotHeight}
                stroke={chartTheme.muted}
                strokeDasharray="4 5"
              />
              <text
                x={Math.min(x(firstForecastIndex) + 8, width - padding.right - 92)}
                y={padding.top + 13}
                className="chart-boundary-label"
              >
                Forecast starts
              </text>
            </g>
          )}

          {points.map((point, index) => (
            <g key={`${point.date}-${index}`}>
              {point.actual !== null && (
                <circle
                  className="forecast-chart__point"
                  cx={x(index)}
                  cy={y(point.actual)}
                  r="4"
                  fill={chartTheme.green}
                  tabIndex={0}
                  aria-label={`${formatShortDate(point.date)}: actual sales ${chartNumber(point.actual)} units`}
                  onMouseEnter={(event) => showTooltip(index, event.clientX, event.clientY)}
                  onMouseMove={(event) => showTooltip(index, event.clientX, event.clientY)}
                  onMouseLeave={() => setTooltip(null)}
                  onFocus={() => showFocusedTooltip(index, point.actual ?? 0)}
                  onBlur={() => setTooltip(null)}
                />
              )}
              {point.forecast !== null && (
                <circle
                  className="forecast-chart__point"
                  cx={x(index)}
                  cy={y(point.forecast)}
                  r="4"
                  fill={chartTheme.ochre}
                  tabIndex={0}
                  aria-label={`${formatShortDate(point.date)}: forecast sales ${chartNumber(point.forecast)} units`}
                  onMouseEnter={(event) => showTooltip(index, event.clientX, event.clientY)}
                  onMouseMove={(event) => showTooltip(index, event.clientX, event.clientY)}
                  onMouseLeave={() => setTooltip(null)}
                  onFocus={() => showFocusedTooltip(index, point.forecast ?? 0)}
                  onBlur={() => setTooltip(null)}
                />
              )}
            </g>
          ))}

          {labelIndexes.map(index => (
            <text
              key={index}
              x={x(index)}
              y={chartHeight - 22}
              textAnchor="middle"
              className="chart-axis-label"
            >
              {points[index] ? formatShortDate(points[index].date) : ''}
            </text>
          ))}
          <text
            x={padding.left + plotWidth / 2}
            y={chartHeight - 4}
            textAnchor="middle"
            className="chart-axis-title"
          >
            Date
          </text>
          <text
            x="16"
            y={padding.top + plotHeight / 2}
            textAnchor="middle"
            className="chart-axis-title"
            transform={`rotate(-90 16 ${padding.top + plotHeight / 2})`}
          >
            Units sold
          </text>
        </svg>
        {tooltip && (
          <div
            className="chart-tooltip forecast-chart__tooltip"
            role="status"
            style={{ left: tooltip.x, top: tooltip.y }}
          >
            <div className="chart-tooltip__title">{formatShortDate(points[tooltip.index].date)}</div>
            {points[tooltip.index].actual !== null && (
              <div className="chart-tooltip__row">
                <span>Actual sales</span>
                <strong>{chartNumber(points[tooltip.index].actual ?? 0)} units</strong>
              </div>
            )}
            {points[tooltip.index].forecast !== null && (
              <div className="chart-tooltip__row">
                <span>Forecast sales</span>
                <strong>{chartNumber(points[tooltip.index].forecast ?? 0)} units</strong>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="forecast-chart__legend" aria-label="Chart legend">
        <span className="forecast-chart__legend-item">
          <span className="forecast-chart__legend-line" />
          Actual sales
        </span>
        <span className="forecast-chart__legend-item">
          <span className="forecast-chart__legend-line forecast-chart__legend-line--forecast" />
          Forecast sales
        </span>
      </div>
    </div>
  );
}
