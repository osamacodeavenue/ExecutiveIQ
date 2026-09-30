export type Range = 'h1' | 'q2';
export type Unit = 'all' | 'retail' | 'wholesale' | 'ecom';
export type Region = 'all' | 'khi' | 'lhe' | 'isb';

export interface Filters {
  range: Range;
  unit: Unit;
  region: Region;
}

export type DecisionId = 'logistics' | 'productB' | 'receivables';
export type DecisionStatus = 'open' | 'review' | 'done';

export type AnalysisKey = 'opex' | 'premium' | 'logistics' | 'productB' | 'receivables' | 'procure';
export type AnswerKey = 'profit' | 'cost' | 'margins' | 'customers' | 'target' | 'risks' | 'general';
export type ReportId = 'exec' | 'monthly' | 'fin' | 'sales' | 'ops';
export type DataType = 'Sales data' | 'Financial data' | 'Customer data' | 'Operations data';
export type FileStatus = 'Synced' | 'Processed' | 'Needs review' | 'Validating' | 'Uploading';

/** Page path within the app, used by "go to" actions in mock content. */
export type Route = '/' | '/sales' | '/finance' | '/operations' | '/customers' | '/analyst' | '/decisions' | '/reports' | '/data' | '/settings';

/** [label, value used for bar length, displayed value, bar colour] */
export type BarSpec = [string, number, string, string];

export interface Rep {
  name: string;
  ini: string;
  reg: Exclude<Region, 'all'>;
  rn: string;
  seg: string;
  r: number;
  t: number;
}

export interface Customer {
  name: string;
  seg: string;
  unit: Exclude<Unit, 'all'>;
  reg: Exclude<Region, 'all'>;
  rn: string;
  /** June revenue, PKR M */
  r: number;
  /** growth vs May, % */
  g: number;
  /** outstanding receivables, PKR M */
  o: number;
  /** average days to pay */
  days: number;
}

export type ModalAction =
  | { type: 'nav'; to: Route }
  | { type: 'toast'; msg: string };

export interface Analysis {
  dec?: DecisionId;
  tag: string;
  tagCls: string;
  title: string;
  lead: string;
  metrics: [string, string][];
  barsTitle: string;
  bars: BarSpec[];
  recs: string[];
  primary: string;
  onPrimary?: ModalAction;
  secondary?: string;
  onSecondary?: ModalAction;
}

export interface Driver {
  label: string;
  val: string;
  cls: string;
}

export interface Answer {
  lead: string;
  drivers?: Driver[];
  driversTitle?: string;
  barsTitle?: string;
  bars?: BarSpec[];
  note?: string;
  steps?: string[];
  sources: string;
  linkLabel?: string;
  linkTo?: Route;
}

export interface Decision {
  id: DecisionId;
  no: string;
  title: string;
  impact: string;
  impactNote: string;
  reason: string;
  owner: string;
  due: string;
  priority: 'High' | 'Medium';
  a1: string;
  a2: string;
  analysis: AnalysisKey;
  to: Route;
}

export interface ReportMetric {
  l: string;
  v: string;
  d: string;
  c: string;
}

export interface ReportSection {
  h: string;
  p?: string;
  items?: string[];
}

export interface Report {
  kicker: string;
  title: string;
  metrics: ReportMetric[];
  sections: ReportSection[];
}

export interface DataFile {
  id: number;
  name: string;
  type: DataType;
  rec: number;
  updated: string;
  status: FileStatus;
  pct?: number;
}

export interface Notification {
  t: string;
  d: string;
  time: string;
  dot: string;
  to: Route;
}

export interface ChatMessage {
  role: 'user' | 'bot';
  text?: string;
  key?: AnswerKey;
}
