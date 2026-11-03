import type { DatasetInfo } from '../types';
import { TREND_INSIGHTS, RISK_INSIGHTS } from './insights';

/** Facts measured on the real M5 files during the project's data-quality checks. */
export const DATASET_INFO: DatasetInfo = {
  name: 'Walmart M5 Forecasting dataset',
  files: [
    {
      name: 'sales_train_validation.csv',
      rows: 30490,
      columns: 1919,
      sizeMb: 114.4,
      description: 'Daily unit sales per product-store series, days d_1 to d_1913.',
    },
    {
      name: 'calendar.csv',
      rows: 1969,
      columns: 14,
      sizeMb: 0.1,
      description: 'Dates, weekdays, events and SNAP (food assistance) flags per state.',
    },
    {
      name: 'sell_prices.csv',
      rows: 6841121,
      columns: 4,
      sizeMb: 194.0,
      description: 'Weekly selling price per store and item.',
    },
  ],
  coverage: { start: '2011-01-29', end: '2016-04-24', days: 1913, calendarEnd: '2016-06-19' },
  counts: { products: 3049, stores: 10, series: 30490, departments: 7 },
  seriesByState: [
    { id: 'CA', label: 'California', series: 12196, stores: 4 },
    { id: 'TX', label: 'Texas', series: 9147, stores: 3 },
    { id: 'WI', label: 'Wisconsin', series: 9147, stores: 3 },
  ],
  seriesByCategory: [
    { id: 'FOODS', label: 'Foods', series: 14370 },
    { id: 'HOUSEHOLD', label: 'Household', series: 10470 },
    { id: 'HOBBIES', label: 'Hobbies', series: 5650 },
  ],
  split: {
    trainStart: '2015-03-29',
    trainEnd: '2016-03-27',
    trainRows: 11084307,
    validationStart: '2016-03-28',
    validationEnd: '2016-04-24',
  },
  quality: [
    { label: 'Missing values in sales', result: '0', passed: true },
    { label: 'Duplicate series IDs', result: '0', passed: true },
    { label: 'Negative or non-integer sales', result: '0', passed: true },
    { label: 'Missing values in prices', result: '0', passed: true },
    { label: 'Duplicate store-item-week price rows', result: '0', passed: true },
    { label: 'Non-positive prices', result: '0 (range 0.01 to 107.32)', passed: true },
    { label: 'Calendar gaps (daily, contiguous)', result: 'None', passed: true },
    { label: 'Sales recorded on days without a posted price', result: '0', passed: true },
    { label: 'Share of item-days with zero sales', result: '68.2%', passed: null },
    { label: 'Highest single-day sales for one series', result: '763 units', passed: null },
  ],
  observations: [...TREND_INSIGHTS, ...RISK_INSIGHTS],
};
