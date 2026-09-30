/**
 * Mock data for ExecutiveIQ.
 *
 * Everything the dashboards show comes from this module. Monetary values are PKR millions
 * for the whole company; the filter layer (src/lib/scope.ts) scales them by business unit
 * and region share. Replace these exports with API calls to connect real data.
 */
import { C } from '../lib/theme';
import type {
  Analysis, AnalysisKey, Answer, AnswerKey, Customer, DataFile, DataType, Decision,
  Notification, Region, Rep, Report, ReportId, Unit,
} from './types';

export const company = {
  name: 'ABC Consumer Products',
  industry: 'FMCG / Retail',
  country: 'Pakistan',
  asOf: '30 Jun 2026, 08:00',
  currency: 'Pakistani Rupee (PKR), shown in millions',
  fiscalYear: 'July – June',
};

export const user = {
  name: 'Ahmed Raza',
  first: 'Ahmed',
  initials: 'AR',
  title: 'Chief Executive Officer',
  email: 'ahmed.raza@abc-consumer.pk',
  access: 'Owner · All business units',
};

// ---------- Monthly series, Jan–Jun 2026 ----------
export const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
export const series = {
  rev: [38.2, 39.5, 41.8, 42.1, 43.24, 48.6],
  tgt: [40, 40, 42, 44, 45, 47],
  prev: [34.1, 35.0, 36.9, 37.5, 38.8, 41.2],
  gp: [15.32, 15.80, 16.64, 16.71, 17.12, 19.12],
  opex: [10.1, 10.3, 10.6, 10.7, 10.98, 12.6],
  ebitda: [5.22, 5.50, 6.04, 6.01, 6.14, 6.52],
  np: [3.05, 3.22, 3.55, 3.61, 3.74, 3.62],
  pipe: [98, 104, 110, 115, 121, 132.5],
  cash: [26.8, 25.9, 25.2, 24.6, 24.1, 22.4],
  otd: [95, 94, 95, 94, 94, 88],
};

// ---------- Filter dimensions ----------
export const unitNames: Record<Unit, string> = { all: 'All Business', retail: 'Retail', wholesale: 'Wholesale', ecom: 'E-commerce' };
export const regionNames: Record<Region, string> = { all: 'All Regions', khi: 'Karachi', lhe: 'Lahore', isb: 'Islamabad' };
/** Share of company revenue by business unit / region. */
export const unitShare: Record<Unit, number> = { all: 1, retail: 0.46, wholesale: 0.38, ecom: 0.16 };
export const regionShare: Record<Region, number> = { all: 1, khi: 0.45, lhe: 0.35, isb: 0.20 };
/** Revenue-growth offset (pts) vs the company-wide 12.4%. */
export const unitGrowthAdj: Record<Unit, number> = { all: 0, retail: -2.6, wholesale: -0.8, ecom: 9.6 };
export const regionGrowthAdj: Record<Region, number> = { all: 0, khi: 0.7, lhe: -0.4, isb: -0.8 };
export const baseRevenueGrowth = 12.4;

// ---------- Health score ----------
export const healthBase: Record<Unit, number> = { all: 82, retail: 79, wholesale: 80, ecom: 88 };
export const healthRegionAdj: Record<Region, number> = { all: 0, khi: 1, lhe: 0, isb: -3 };
export const healthParts: [string, number, string][] = [
  ['Financial Health', 78, 'Margins under cost pressure'],
  ['Sales Health', 88, 'Ahead of June target'],
  ['Operational Health', 76, 'Delivery delays in June'],
  ['Customer Health', 84, 'Receivables concentrating'],
];

// ---------- Sales ----------
export const reps: Rep[] = [
  { name: 'Bilal Qureshi', ini: 'BQ', reg: 'lhe', rn: 'Lahore', seg: 'Wholesale', r: 7.9, t: 7.0 },
  { name: 'Fatima Raza', ini: 'FR', reg: 'khi', rn: 'Karachi', seg: 'Key accounts', r: 9.2, t: 8.5 },
  { name: 'Ayesha Siddiqui', ini: 'AS', reg: 'khi', rn: 'Karachi', seg: 'Modern trade', r: 9.1, t: 8.5 },
  { name: 'Ali Khan', ini: 'AK', reg: 'khi', rn: 'Karachi', seg: 'Retail', r: 8.4, t: 8.0 },
  { name: 'Hamza Malik', ini: 'HM', reg: 'isb', rn: 'Islamabad', seg: 'Retail', r: 6.8, t: 7.0 },
  { name: 'Sara Ahmed', ini: 'SA', reg: 'lhe', rn: 'Lahore', seg: 'E-commerce', r: 7.2, t: 8.0 },
];

export const funnelStages = ['Leads', 'Qualified', 'Proposal', 'Negotiation', 'Won'];
export const funnelCounts = { h1: [1240, 612, 298, 176, 138], q2: [652, 322, 157, 93, 74] };
/** Open pipeline value by stage (PKR M); null where not applicable. */
export const funnelValues: (number | null)[] = [null, 58.2, 41.6, 32.7, null];
export const funnelColors = ['#C7D3EE', '#A5B8E5', '#7F99DA', '#5479CF', '#2B59C3'];

export const unitBreakdown: [Exclude<Unit, 'all'>, string, number, number][] = [
  ['retail', 'Retail', 0.46, 9.8], ['wholesale', 'Wholesale', 0.38, 11.6], ['ecom', 'E-commerce', 0.16, 22.0],
];
export const regionBreakdown: [Exclude<Region, 'all'>, string, number, number][] = [
  ['khi', 'Karachi', 0.45, 13.1], ['lhe', 'Lahore', 0.35, 12.0], ['isb', 'Islamabad', 0.20, 11.6],
];

// ---------- Finance (June vs May, company-wide) ----------
export const finance = {
  revenuePrevGrowthBase: baseRevenueGrowth,
  cogs: [29.48, 26.12],
  gp: [19.12, 17.12],
  opex: [12.6, 10.98],
  ebitda: [6.52, 6.14],
  np: [3.62, 3.74],
  ocf: [1.9, 3.1],
};

/** Profit bridge May → June: [label, value, isTotal, sublabel]. */
export const waterfall: [string, number, boolean, string][] = [
  ['May net profit', 3.74, true, ''],
  ['Revenue growth', 2.12, false, 'sales'],
  ['Premium Beverage margin', 0.60, false, 'better mix'],
  ['Product B margin', -0.72, false, '−4.6 pts'],
  ['Logistics costs', -0.52, false, '+11.2%'],
  ['Marketing spend', -0.38, false, '+21%'],
  ['Salaries & other opex', -0.72, false, '+15%'],
  ['Finance cost & tax', -0.50, false, 'working capital'],
  ['June net profit', 3.62, true, ''],
];

/** Operating expenses, June: [line, PKR M, growth %, colour]. */
export const expenses: [string, number, number, string][] = [
  ['Logistics', 5.16, 11.2, '#2B59C3'],
  ['Salaries & admin', 3.92, 15.3, '#5479CF'],
  ['Marketing', 2.18, 21.1, '#7F99DA'],
  ['Utilities & rent', 0.84, 13.5, '#A5B8E5'],
  ['Other', 0.50, 25.0, '#C7D3EE'],
];

/** Budget vs actual, June: [line, budget, actual, higherIsBetter]. */
export const budgetVsActual: [string, number, number, boolean][] = [
  ['Revenue', 47.0, 48.6, true],
  ['Cost of goods sold', 28.4, 29.48, false],
  ['Operating expenses', 11.6, 12.6, false],
  ['EBITDA', 7.0, 6.52, true],
  ['Net profit', 3.95, 3.62, true],
];

// ---------- Operations ----------
export const otdByRegion: [Exclude<Region, 'all'>, string, number, string][] = [
  ['khi', 'Karachi', 91, 'Close to target; port congestion on two days'],
  ['lhe', 'Lahore', 87, 'Carrier capacity short on GT Road routes'],
  ['isb', 'Islamabad', 83, 'Longest delays; single warehouse serving the region'],
];

/** [product, category, days of cover, reorder at (days), supplier] */
export const lowStock: [string, string, number, number, string][] = [
  ['Golden Crust Biscuits 12-pack', 'Product B · Biscuits', 3, 10, 'Indus Flour Mills'],
  ['Zesta Mango Nectar 1L', 'Premium Beverages', 4, 10, 'Valley Fruit Co.'],
  ['PureLeaf Green Tea 25s', 'Premium Beverages', 5, 12, 'Highland Tea Traders'],
  ['Crunchies Salted 45g', 'Snacks', 6, 9, 'Crescent Foods'],
  ['Sparkle Dishwash 500ml', 'Home Care', 6, 10, 'Clearwater Chemicals'],
  ['Fresh Valley UHT Milk 1L', 'Dairy', 7, 10, 'Fresh Valley Dairies'],
];

// ---------- Customers ----------
export const customers: Customer[] = [
  { name: 'Meridian Superstores', seg: 'Retail', unit: 'retail', reg: 'khi', rn: 'Karachi', r: 6.8, g: 14, o: 7.1, days: 45 },
  { name: 'Al-Noor Distributors', seg: 'Wholesale', unit: 'wholesale', reg: 'lhe', rn: 'Lahore', r: 5.4, g: 6, o: 5.3, days: 38 },
  { name: 'Punjab Retail Group', seg: 'Retail', unit: 'retail', reg: 'lhe', rn: 'Lahore', r: 4.9, g: -8, o: 3.8, days: 52 },
  { name: 'Karachi Wholesale Traders', seg: 'Wholesale', unit: 'wholesale', reg: 'khi', rn: 'Karachi', r: 3.7, g: 3, o: 2.4, days: 31 },
  { name: 'QuickCart Online', seg: 'E-commerce', unit: 'ecom', reg: 'khi', rn: 'Karachi', r: 2.9, g: 31, o: 0.9, days: 12 },
  { name: 'Capital Cash & Carry', seg: 'Wholesale', unit: 'wholesale', reg: 'isb', rn: 'Islamabad', r: 2.6, g: -12, o: 2.1, days: 68 },
  { name: 'Margalla Mart', seg: 'Retail', unit: 'retail', reg: 'isb', rn: 'Islamabad', r: 2.1, g: 5, o: 1.2, days: 27 },
];

export const receivablesTotal = 38.5;
export const concentration: [string, number, string][] = [
  ['Meridian Superstores', 7.1, '#2B59C3'],
  ['Al-Noor Distributors', 5.3, '#5479CF'],
  ['Punjab Retail Group', 3.8, '#8FA6DF'],
  ['All other customers', 22.3, '#E3E0D8'],
];
export const ageing: [string, number, string][] = [
  ['Current', 21.6, '#2B59C3'],
  ['31–60 days', 9.8, '#8FA6DF'],
  ['61–90 days', 5.2, '#C98A1B'],
  ['Over 90 days', 1.9, C.bad],
];

// ---------- Decision Center ----------
export const decisions: Decision[] = [
  { id: 'logistics', no: '01', title: 'Logistics Cost Increase', impact: 'PKR 1.6M', impactNote: 'extra cost next quarter at June run-rate', reason: 'Logistics costs increased 11.2% in the current period, from PKR 4.64M in May to PKR 5.16M in June.', owner: 'Omar Farooq, COO', due: 'Decide by 7 Jul', priority: 'High', a1: 'Investigate', a2: 'View Analysis', analysis: 'logistics', to: '/finance' },
  { id: 'productB', no: '02', title: 'Product B Margin Decline', impact: 'PKR 0.72M', impactNote: 'gross profit lost in June', reason: 'Margin decreased by 4.6 points, from 34.8% to 30.2%, as flour and packaging costs rose with no price change since January.', owner: 'Kamran Sheikh, Category Head', due: 'Decide by 10 Jul', priority: 'High', a1: 'Analyze', a2: 'View Product', analysis: 'productB', to: '/finance' },
  { id: 'receivables', no: '03', title: 'Receivables Concentration', impact: 'PKR 16.2M', impactNote: 'owed by three customers', reason: 'Three customers represent 42% of outstanding receivables, up from 37% in May. Two of them are paying slower.', owner: 'Zainab Ali, CFO', due: 'Decide by 5 Jul', priority: 'Medium', a1: 'Review Customers', a2: 'View Receivables', analysis: 'receivables', to: '/customers' },
];

// ---------- Drill-down analyses (modal) ----------
const G = C.good, B = C.bad, N = C.brand;
export const analyses: Record<AnalysisKey, Analysis> = {
  opex: {
    tag: 'Risk', tagCls: 'chip bad', title: 'Operating expenses are outpacing revenue',
    lead: 'Operating expenses rose 14.8% in June while revenue rose 12.4%. Most of the gap comes from logistics and salaries & admin; marketing grew 21% ahead of the Q3 launches.',
    metrics: [['Opex growth', '+14.8%'], ['Revenue growth', '+12.4%'], ['Opex, June', 'PKR 12.6M']],
    barsTitle: 'Increase by expense line (PKR M)',
    bars: [['Logistics', 0.52, '+0.52', B], ['Salaries & admin', 0.52, '+0.52', B], ['Marketing', 0.38, '+0.38', B], ['Utilities & rent', 0.10, '+0.10', B], ['Other', 0.10, '+0.10', B]],
    recs: ['Review logistics contracts (see Decision 01)', 'Hold discretionary spend until the July close', 'Set monthly opex growth at or below revenue growth'],
    primary: 'Open profit bridge', onPrimary: { type: 'nav', to: '/finance' },
  },
  premium: {
    tag: 'Opportunity', tagCls: 'chip good', title: 'Premium Beverages is outperforming',
    lead: 'The category earned a 51.5% gross margin in June, 31% above the company average, on PKR 7.9M of sales (+18% vs May). Demand is strongest in Karachi and Lahore modern trade.',
    metrics: [['Gross margin', '51.5%'], ['June revenue', 'PKR 7.9M'], ['Growth vs May', '+18%']],
    barsTitle: 'Gross margin by category, June',
    bars: [['Premium Beverages', 51.5, '51.5%', G], ['Personal Care', 44.2, '44.2%', N], ['Dairy', 38.6, '38.6%', N], ['Snacks', 36.1, '36.1%', N], ['Product B · Biscuits', 30.2, '30.2%', B]],
    recs: ['Add shelf space in the top 40 modern-trade stores', 'Raise safety stock on the 4 SKUs near reorder', 'Test a premium bundle on QuickCart Online'],
    primary: 'Share with Sales team', onPrimary: { type: 'toast', msg: 'Opportunity shared with Sales leadership' },
  },
  logistics: {
    dec: 'logistics', tag: 'Decision 01', tagCls: 'chip bad', title: 'Logistics Cost Increase',
    lead: 'Logistics spend rose PKR 0.52M (+11.2%) in June. Fuel surcharges and re-deliveries on delayed Lahore and Islamabad routes explain three quarters of the increase. At this run-rate the extra cost reaches about PKR 1.6M next quarter.',
    metrics: [['Logistics cost, June', 'PKR 5.16M'], ['Change vs May', '+11.2%'], ['Share of revenue', '10.6%']],
    barsTitle: 'Where the increase came from (PKR M)',
    bars: [['Fuel surcharge', 0.24, '+0.24', B], ['Re-deliveries after delays', 0.15, '+0.15', B], ['Third-party carriers', 0.09, '+0.09', B], ['Warehouse handling', 0.04, '+0.04', B]],
    recs: ['Renegotiate the fuel-surcharge clause with the two largest carriers', 'Fix Lahore and Islamabad route delays to cut re-deliveries', 'Set a logistics ceiling of 10% of revenue'],
    primary: 'Assign to COO & start review', secondary: 'View full analysis', onSecondary: { type: 'nav', to: '/finance' },
  },
  productB: {
    dec: 'productB', tag: 'Decision 02', tagCls: 'chip bad', title: 'Product B Margin Decline',
    lead: 'Product B · Biscuits gross margin fell from 34.8% to 30.2%. Wheat flour and packaging costs rose about 9% in May, but list prices have not changed since January. On PKR 15.6M of June sales, that cost PKR 0.72M of gross profit.',
    metrics: [['Gross margin', '30.2% (−4.6 pts)'], ['June revenue', 'PKR 15.6M'], ['Gross profit lost', 'PKR 0.72M']],
    barsTitle: 'Gross margin by product group, June',
    bars: [['Choco Bites', 33.0, '33.0%', N], ['Tea Time Rusks', 31.4, '31.4%', N], ['Category average', 30.2, '30.2%', C.stone], ['Golden Crust 12-pack', 27.9, '27.9%', B]],
    recs: ['Model a 4–6% price increase on the 12-pack range', 'Review the flour contract with the main mill before August', 'Shift trade promotions toward higher-margin SKUs'],
    primary: 'Assign to Category Head', secondary: 'View finance', onSecondary: { type: 'nav', to: '/finance' },
  },
  receivables: {
    dec: 'receivables', tag: 'Decision 03', tagCls: 'chip warn', title: 'Receivables Concentration',
    lead: 'Meridian Superstores, Al-Noor Distributors and Punjab Retail Group owe PKR 16.2M, 42% of the PKR 38.5M outstanding and up from 37% in May. PKR 7.1M across all customers is more than 60 days old.',
    metrics: [['Outstanding receivables', 'PKR 38.5M'], ['Top-3 share', '42% (+5 pts)'], ['Over 60 days', 'PKR 7.1M']],
    barsTitle: 'Largest balances (PKR M)',
    bars: [['Meridian Superstores', 7.1, '7.1', C.warn], ['Al-Noor Distributors', 5.3, '5.3', C.warn], ['Punjab Retail Group', 3.8, '3.8', C.warn], ['Karachi Wholesale Traders', 2.4, '2.4', N], ['Capital Cash & Carry', 2.1, '2.1', B]],
    recs: ['Tighten credit terms on accounts past 45 days', 'Schedule collection calls with Capital Cash & Carry and Punjab Retail Group', 'Cap any single customer at 15% of receivables'],
    primary: 'Assign to CFO & start review', secondary: 'View customers', onSecondary: { type: 'nav', to: '/customers' },
  },
  procure: {
    tag: 'Operations', tagCls: 'chip warn', title: 'Supplier costs rose 7.2%',
    lead: 'Procurement spend reached PKR 26.4M in June. Price increases on three inputs drove most of the rise, and they feed directly into Product B margins.',
    metrics: [['Procurement cost', 'PKR 26.4M'], ['Price change', '+7.2%'], ['Suppliers affected', '9 of 42']],
    barsTitle: 'Price change by input',
    bars: [['Wheat flour', 9.0, '+9.0%', B], ['PET resin', 8.1, '+8.1%', B], ['Packaging film', 6.4, '+6.4%', B], ['Sugar', 3.2, '+3.2%', C.warn]],
    recs: ['Run a competitive tender for packaging film', 'Lock a 6-month flour price with the main mill', 'Pass part of the increase into Product B pricing'],
    primary: 'Request supplier review', onPrimary: { type: 'toast', msg: 'Supplier review requested from Procurement' },
  },
};

// ---------- AI Analyst ----------
export const suggestedQuestions: [string, AnswerKey][] = [
  ['Why did profit decline this month?', 'profit'],
  ['What is causing our cost increase?', 'cost'],
  ['Which products have the highest margins?', 'margins'],
  ['Which customers need attention?', 'customers'],
  ['Are we on track to hit our revenue target?', 'target'],
  ['What are the biggest business risks?', 'risks'],
];

/** Keyword router that stands in for a language model in this mock build. */
export function matchQuestion(text: string): AnswerKey {
  const t = text.toLowerCase();
  if (/profit|net income|declin|earning/.test(t)) return 'profit';
  if (/cost|expense|opex|logistic|spend/.test(t)) return 'cost';
  if (/margin|product|categor|sku/.test(t)) return 'margins';
  if (/customer|receivable|client|collect|debtor/.test(t)) return 'customers';
  if (/target|track|forecast|goal|plan/.test(t)) return 'target';
  if (/risk|worry|concern|threat|biggest/.test(t)) return 'risks';
  return 'general';
}

export const answers: Record<AnswerKey, Answer> = {
  profit: {
    lead: 'Net profit decreased by 3.2% compared with last month, from PKR 3.74M in May to PKR 3.62M in June.',
    drivers: [{ label: 'Operating expenses', val: '↑ 14.8%', cls: 'chip bad' }, { label: 'Logistics costs', val: '↑ 11.2%', cls: 'chip bad' }, { label: 'Product B margin', val: '↓ 4.6 pts', cls: 'chip bad' }],
    barsTitle: 'Profit bridge, May to June (PKR M)',
    bars: [['Gross profit on higher sales', 2.12, '+2.12', G], ['Premium Beverage margin', 0.60, '+0.60', G], ['Product B margin', -0.72, '−0.72', B], ['Logistics costs', -0.52, '−0.52', B], ['Marketing spend', -0.38, '−0.38', B], ['Salaries & other opex', -0.72, '−0.72', B], ['Finance cost & tax', -0.50, '−0.50', B]],
    note: 'Revenue still increased by 12.4%, so the primary issue is cost growth rather than declining sales.',
    steps: ['Review logistics spending', 'Analyze Product B pricing', 'Investigate high-cost customer segments'],
    sources: 'Sources: General ledger · Sales transactions · Cost centre report (Jun 2026)', linkLabel: 'Open profit bridge', linkTo: '/finance',
  },
  cost: {
    lead: 'Operating costs rose PKR 1.62M (+14.8%) to PKR 12.6M in June, faster than the 12.4% growth in revenue.',
    barsTitle: 'Increase in operating costs by line (PKR M)',
    bars: [['Logistics', 0.52, '+0.52', B], ['Salaries & admin', 0.52, '+0.52', B], ['Marketing', 0.38, '+0.38', B], ['Utilities & rent', 0.10, '+0.10', B], ['Other', 0.10, '+0.10', B]],
    note: 'Logistics is the most actionable line: fuel surcharges and re-deliveries on delayed Lahore and Islamabad routes explain three quarters of its increase. Marketing grew 21% ahead of the Q3 launch calendar.',
    steps: ['Renegotiate the fuel-surcharge clause with the two largest carriers', 'Confirm the Q3 marketing plan still fits the budget', 'Freeze non-critical hiring until the July close'],
    sources: 'Sources: General ledger · Logistics invoices · Payroll (Jun 2026)', linkLabel: 'View expense breakdown', linkTo: '/finance',
  },
  margins: {
    lead: 'Premium Beverages is your highest-margin category at 51.5%, about 31% above the 39.3% company average. Product B · Biscuits is the lowest at 30.2%.',
    barsTitle: 'Gross margin by category, June',
    bars: [['Premium Beverages', 51.5, '51.5%', G], ['Personal Care', 44.2, '44.2%', N], ['Dairy', 38.6, '38.6%', N], ['Snacks', 36.1, '36.1%', N], ['Product B · Biscuits', 30.2, '30.2%', B]],
    note: 'Shifting 5% of the sales mix from Product B to Premium Beverages would add roughly PKR 0.5M of gross profit a month at current volumes.',
    steps: ['Protect stock of the top Premium Beverage SKUs (4 are near reorder)', 'Model a 4–6% price increase on the Product B 12-pack range', 'Point trade promotions toward higher-margin SKUs'],
    sources: 'Sources: Sales transactions · Standard cost file (Jun 2026)', linkLabel: 'View operations', linkTo: '/operations',
  },
  customers: {
    lead: 'Three accounts need attention this week. Together they owe PKR 13.0M and two of them are buying less.',
    drivers: [{ label: 'Capital Cash & Carry', val: '68 days to pay', cls: 'chip bad' }, { label: 'Punjab Retail Group', val: 'Purchases ↓ 8%', cls: 'chip bad' }, { label: 'Meridian Superstores', val: 'PKR 7.1M owed', cls: 'chip warn' }],
    driversTitle: 'Accounts to review',
    note: 'Your top three customers now hold 42% of all receivables, up from 37% in May. Meridian is growing fast (+14%), so the balance reflects volume, but credit terms should keep pace.',
    steps: ['Schedule collection calls with Capital Cash & Carry and Punjab Retail Group', "Review Meridian's credit limit against its new volume", 'Set a 45-day alert for all key accounts'],
    sources: 'Sources: AR ageing · Customer master · Sales transactions (Jun 2026)', linkLabel: 'Open customers', linkTo: '/customers',
  },
  target: {
    lead: 'Mostly yes. January to June revenue is PKR 253.4M, 98.2% of the PKR 258.0M target, and June beat its target by 3.4%.',
    barsTitle: 'Revenue vs target by month (PKR M)',
    bars: [['January', 38.2, '96%', C.warn], ['February', 39.5, '99%', C.warn], ['March', 41.8, '100%', G], ['April', 42.1, '96%', C.warn], ['May', 43.24, '96%', C.warn], ['June', 48.6, '103%', G]],
    note: "At June's run-rate the business finishes the year near PKR 545M, about 97% of a PKR 560M annual plan. Closing the gap needs roughly 5% more monthly revenue in the second half.",
    steps: ['Convert the PKR 32.7M in negotiation-stage deals', 'Scale E-commerce, the fastest-growing unit (+22%)', 'Coach the two representatives below target'],
    sources: 'Sources: Sales transactions · Budget file FY26 · CRM pipeline', linkLabel: 'Open sales', linkTo: '/sales',
  },
  risks: {
    lead: 'Four risks stand out. None is critical yet, but the first two are growing month on month.',
    drivers: [{ label: 'Costs growing faster than sales', val: 'Opex ↑ 14.8%', cls: 'chip bad' }, { label: 'Receivables concentration', val: '42% in top 3', cls: 'chip bad' }, { label: 'Delivery reliability', val: 'On-time 88%', cls: 'chip warn' }, { label: 'Cash position', val: '↓ 7.1%', cls: 'chip warn' }],
    driversTitle: 'Biggest business risks',
    note: 'These are linked: slower deliveries raise logistics cost, and slower collections from large customers drain cash and raise finance cost.',
    steps: ['Assign owners in the Decision Center', 'Review logistics and receivables together with the COO and CFO', 'Track the health score weekly until margins recover'],
    sources: 'Sources: All connected data (Jun 2026)', linkLabel: 'Open Decision Center', linkTo: '/decisions',
  },
  general: {
    lead: 'Here is where the business stands. June revenue reached PKR 48.6M (+12.4%), but net profit fell 3.2% to PKR 3.62M because costs grew faster than sales.',
    drivers: [{ label: 'Business health score', val: '82 / 100', cls: 'chip good' }, { label: 'Revenue vs June target', val: '103.4%', cls: 'chip good' }, { label: 'Operating costs', val: '↑ 14.8%', cls: 'chip bad' }],
    driversTitle: 'Snapshot',
    note: 'Try asking about profit, costs, margins, customers, targets or risks for a detailed explanation.',
    sources: 'Sources: All connected data (Jun 2026)', linkLabel: 'Open overview', linkTo: '/',
  },
};

// ---------- Reports ----------
export const reportList: [ReportId, string, string][] = [
  ['exec', 'Executive Report', 'June 2026 · one page'],
  ['monthly', 'Monthly Report', 'June 2026 · all functions'],
  ['fin', 'Financial Summary', 'P&L, cash and budget'],
  ['sales', 'Sales Summary', 'Targets, pipeline, team'],
  ['ops', 'Operational Summary', 'Delivery, stock, suppliers'],
];
export const reportSteps = ['Collecting June data from 6 sources', 'Explaining profit drivers', 'Writing the executive summary', 'Formatting for print'];

const m = (l: string, v: string, d: string, c: string) => ({ l, v, d, c });
const RG = C.goodInk, RB = C.badInk, RN = C.ink2;
export const reports: Record<ReportId, Report> = {
  exec: {
    kicker: 'Executive Report', title: 'June 2026 at a Glance',
    metrics: [m('Revenue', 'PKR 48.6M', '↑ 12.4% vs May', RG), m('Net profit', 'PKR 3.62M', '↓ 3.2% vs May', RB), m('Health score', '82 / 100', '↑ 2 pts', RG), m('Cash position', 'PKR 22.4M', '↓ 7.1%', RB)],
    sections: [
      { h: 'Summary', p: 'June was the strongest sales month of the half. Revenue reached PKR 48.6M, 3.4% ahead of target, and January to June closed at 98.2% of plan. Profit did not follow: net profit fell 3.2% because operating costs grew 14.8%.' },
      { h: 'What went well', items: ['E-commerce grew 22% and Premium Beverages earned a 51.5% gross margin.', 'Four of six field representatives beat their June targets.', 'Pipeline value rose 9.5% to PKR 132.5M.'] },
      { h: 'What needs attention', items: ['Logistics costs up 11.2%; on-time delivery down from 94% to 88%.', 'Product B margin down 4.6 points after input-cost increases.', 'Top three customers hold 42% of receivables; cash down PKR 1.7M.'] },
      { h: 'Decisions for this week', items: ['01 · Logistics cost increase · owner: COO', '02 · Product B pricing · owner: Category Head', '03 · Receivables concentration · owner: CFO'] },
    ],
  },
  monthly: {
    kicker: 'Monthly Report', title: 'Business Review, June 2026',
    metrics: [m('Revenue', 'PKR 48.6M', '103.4% of target', RG), m('Gross margin', '39.3%', '↓ 0.3 pts', RB), m('On-time delivery', '88%', '↓ 6 pts', RB), m('New customers', '86', '↑ 12', RG)],
    sections: [
      { h: 'Sales', p: 'Revenue grew 12.4% on strong modern-trade and E-commerce demand. Conversion from qualified lead to won deal held at 22.5%.' },
      { h: 'Finance', p: 'Gross profit rose 11.7% to PKR 19.1M. EBITDA rose 6.2% but net profit fell 3.2% on higher opex and finance cost.' },
      { h: 'Operations', p: 'Delivery performance slipped on Lahore and Islamabad routes. 12 SKUs are near reorder threshold.' },
      { h: 'Customers', p: 'Receivables grew 9.4% to PKR 38.5M, with concentration rising to 42% in the top three accounts.' },
    ],
  },
  fin: {
    kicker: 'Financial Summary', title: 'Profit & Loss, June 2026',
    metrics: [m('Gross profit', 'PKR 19.1M', '↑ 11.7%', RG), m('Opex', 'PKR 12.6M', '↑ 14.8%', RB), m('EBITDA', 'PKR 6.52M', '↑ 6.2%', RG), m('Operating cash flow', 'PKR 1.9M', '↓ 38.7%', RB)],
    sections: [
      { h: 'Profit bridge', p: 'Net profit moved from PKR 3.74M to PKR 3.62M. Higher sales and better Premium Beverage mix added PKR 2.72M; Product B margin, logistics, marketing, overheads, finance cost and tax took back PKR 2.84M.' },
      { h: 'Budget vs actual', items: ['Revenue +3.4% vs budget', 'Operating expenses 8.6% over budget', 'Net profit 8.4% below budget'] },
      { h: 'Cash', p: 'Cash fell PKR 1.7M to PKR 22.4M: PKR 1.9M operating inflow less PKR 1.2M capex and PKR 2.4M loan repayment.' },
    ],
  },
  sales: {
    kicker: 'Sales Summary', title: 'Sales Performance, June 2026',
    metrics: [m('Total sales', 'PKR 48.6M', '↑ 12.4%', RG), m('Pipeline', 'PKR 132.5M', '↑ 9.5%', RG), m('Conversion', '22.5%', 'Qualified to won', RN), m('Avg deal size', 'PKR 1.84M', 'Jan–Jun', RN)],
    sections: [
      { h: 'By business unit', items: ['Retail PKR 22.4M (+9.8%)', 'Wholesale PKR 18.5M (+11.6%)', 'E-commerce PKR 7.8M (+22.0%)'] },
      { h: 'Team', p: 'Bilal Qureshi (113%), Fatima Raza (108%), Ayesha Siddiqui (107%) and Ali Khan (105%) beat target. Hamza Malik (97%) and Sara Ahmed (90%) fell short.' },
    ],
  },
  ops: {
    kicker: 'Operational Summary', title: 'Operations, June 2026',
    metrics: [m('On-time delivery', '88%', '↓ 6 pts', RB), m('Fulfillment', '96.1%', '↓ 1.2 pts', RB), m('Inventory', 'PKR 64.8M', '5.4× turnover', RN), m('Procurement', 'PKR 26.4M', '↑ 7.2%', RB)],
    sections: [
      { h: 'Delivery', p: 'Karachi 91%, Lahore 87%, Islamabad 83%. Carrier capacity on GT Road routes and a single Islamabad warehouse are the main constraints.' },
      { h: 'Inventory', p: '12 SKUs are approaching reorder threshold, including 4 Premium Beverage lines.' },
      { h: 'Suppliers', p: 'Wheat flour (+9.0%), PET resin (+8.1%) and packaging film (+6.4%) drove the procurement increase.' },
    ],
  },
};

// ---------- Data Center ----------
export const dataTypes: DataType[] = ['Sales data', 'Financial data', 'Customer data', 'Operations data'];
export const dataTypeDots = ['#2B59C3', '#1B7F4C', '#C98A1B', '#6B6E76'];
export const initialFiles: DataFile[] = [
  { id: 1, name: 'sales_transactions_jun2026.xlsx', type: 'Sales data', rec: 18402, updated: '30 Jun 2026, 08:00', status: 'Synced' },
  { id: 2, name: 'gl_trial_balance_jun2026.xlsx', type: 'Financial data', rec: 2145, updated: '30 Jun 2026, 07:45', status: 'Synced' },
  { id: 3, name: 'ar_aging_jun2026.csv', type: 'Customer data', rec: 3960, updated: '30 Jun 2026, 07:30', status: 'Needs review' },
  { id: 4, name: 'customer_master.csv', type: 'Customer data', rec: 1284, updated: '29 Jun 2026, 18:20', status: 'Synced' },
  { id: 5, name: 'inventory_snapshot_jun2026.csv', type: 'Operations data', rec: 842, updated: '30 Jun 2026, 06:00', status: 'Synced' },
  { id: 6, name: 'deliveries_jun2026.xlsx', type: 'Operations data', rec: 6318, updated: '29 Jun 2026, 22:10', status: 'Synced' },
];

// ---------- Notifications ----------
export const notifications: Notification[] = [
  { t: 'Net profit fell 3.2% in June', d: 'Cost growth outpaced revenue. See the profit bridge.', time: '2h ago', dot: C.bad, to: '/finance' },
  { t: 'On-time delivery dropped to 88%', d: 'Lahore and Islamabad routes are most affected.', time: '5h ago', dot: C.amber, to: '/operations' },
  { t: 'June revenue beat target by 3.4%', d: 'PKR 48.6M against a PKR 47.0M target.', time: 'Yesterday', dot: C.good, to: '/sales' },
  { t: 'ar_aging_jun2026.csv needs review', d: '4 rows are missing due dates.', time: 'Yesterday', dot: C.brand, to: '/data' },
];
