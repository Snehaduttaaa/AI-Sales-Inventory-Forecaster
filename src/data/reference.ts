import type { Product, StateCode, Store } from '../types';

/** Real structural facts about the Walmart M5 dataset used in this project. */
export const PRODUCT_COUNT = 3049;
export const STORE_COUNT = 10;
export const SERIES_COUNT = 30490;
export const FORECAST_HORIZON_DAYS = 28;

/** Last day with recorded sales in the M5 training file (d_1913). */
export const DATA_END_DATE = '2016-04-24';

export const STATE_NAMES: Record<StateCode, string> = {
  CA: 'California',
  TX: 'Texas',
  WI: 'Wisconsin',
};

export const STORES: Store[] = [
  { id: 'CA_1', label: 'CA_1', state: 'CA' },
  { id: 'CA_2', label: 'CA_2', state: 'CA' },
  { id: 'CA_3', label: 'CA_3', state: 'CA' },
  { id: 'CA_4', label: 'CA_4', state: 'CA' },
  { id: 'TX_1', label: 'TX_1', state: 'TX' },
  { id: 'TX_2', label: 'TX_2', state: 'TX' },
  { id: 'TX_3', label: 'TX_3', state: 'TX' },
  { id: 'WI_1', label: 'WI_1', state: 'WI' },
  { id: 'WI_2', label: 'WI_2', state: 'WI' },
  { id: 'WI_3', label: 'WI_3', state: 'WI' },
];

/**
 * DEMONSTRATION SUBSET: nine M5-style product IDs used only to drive the demo selectors.
 * The values shown for them in the forecast and inventory screens are synthetic.
 */
export const DEMO_PRODUCTS: Product[] = [
  { id: 'HOBBIES_1_004', label: 'HOBBIES_1_004', category: 'HOBBIES', department: 'HOBBIES_1' },
  { id: 'HOBBIES_2_031', label: 'HOBBIES_2_031', category: 'HOBBIES', department: 'HOBBIES_2' },
  { id: 'HOUSEHOLD_1_040', label: 'HOUSEHOLD_1_040', category: 'HOUSEHOLD', department: 'HOUSEHOLD_1' },
  { id: 'HOUSEHOLD_1_118', label: 'HOUSEHOLD_1_118', category: 'HOUSEHOLD', department: 'HOUSEHOLD_1' },
  { id: 'HOUSEHOLD_2_017', label: 'HOUSEHOLD_2_017', category: 'HOUSEHOLD', department: 'HOUSEHOLD_2' },
  { id: 'FOODS_1_058', label: 'FOODS_1_058', category: 'FOODS', department: 'FOODS_1' },
  { id: 'FOODS_2_197', label: 'FOODS_2_197', category: 'FOODS', department: 'FOODS_2' },
  { id: 'FOODS_3_090', label: 'FOODS_3_090', category: 'FOODS', department: 'FOODS_3' },
  { id: 'FOODS_3_586', label: 'FOODS_3_586', category: 'FOODS', department: 'FOODS_3' },
];
