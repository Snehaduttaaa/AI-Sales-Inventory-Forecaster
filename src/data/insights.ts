import type { Insight } from '../types';

/** Observations taken from the project's actual M5 data checks and validation results. */
export const TREND_INSIGHTS: Insight[] = [
  {
    id: 'intermittent',
    figure: '68.2%',
    title: 'Most item-days record zero sales',
    detail:
      'Demand is highly intermittent across the 30,490 product-store series, so error is measured in units per item per day rather than as a percentage.',
    source: 'actual',
  },
  {
    id: 'foods',
    figure: '6.0%',
    title: 'Foods shows the largest gain over the strongest baseline',
    detail:
      'Foods is 14,370 series (47% of the network) and also has the largest absolute error (MAE 1.337 units), so it benefits most from better forecasts.',
    source: 'actual',
  },
  {
    id: 'states',
    figure: '6.4%',
    title: 'Wisconsin gains most; Texas least',
    detail: 'MAE improvement against the four-week same-weekday mean: Wisconsin 6.4%, California 5.6%, Texas 4.0%.',
    source: 'actual',
  },
];

export const RISK_INSIGHTS: Insight[] = [
  {
    id: 'no-recent-sales',
    figure: '1,587',
    title: 'Series with no recorded sales in the final 28 days',
    detail: '5.2% of all series. Review these for delisting or stock-outs before placing orders.',
    source: 'actual',
  },
  {
    id: 'not-on-sale',
    figure: '21.1%',
    title: 'Series-day cells have no posted price',
    detail:
      'These are days before an item went on sale. Items that have not launched yet fall outside what the model was trained on.',
    source: 'actual',
  },
  {
    id: 'store-error',
    figure: '1.385',
    title: 'Highest store-level error: CA_3 (MAE, units per item-day)',
    detail: 'WI_2 follows at 1.231. Larger absolute errors mean wider safety buffers may be needed at these stores.',
    source: 'actual',
  },
];
