import {
  baseRevenueGrowth, months, regionGrowthAdj, regionNames, regionShare, unitGrowthAdj, unitNames, unitShare,
} from '../data/mock';
import { useApp } from '../state/AppContext';

/**
 * Derives the numbers every page needs from the current filters:
 * a scale factor `f` for the selected unit × region, the revenue growth `g`,
 * and the month indices in the selected date range.
 */
export function useScope() {
  const { filters, loading } = useApp();
  const { range, unit, region } = filters;
  const f = unitShare[unit] * regionShare[region];
  const g = baseRevenueGrowth + unitGrowthAdj[unit] + regionGrowthAdj[region];
  const idx = range === 'h1' ? [0, 1, 2, 3, 4, 5] : [3, 4, 5];
  const n = idx.length;
  const unitName = unitNames[unit];
  const regName = regionNames[region];
  return {
    ...filters,
    loading,
    f,
    g,
    idx,
    n,
    unitName,
    regName,
    scope: unitName + ' · ' + regName,
    rangeName: range === 'h1' ? 'Jan – Jun 2026' : 'Apr – Jun 2026',
    rangeShort: range === 'h1' ? 'Jan–Jun' : 'Apr–Jun',
    filtered: unit !== 'all' || region !== 'all',
    monthLabels: idx.map(i => months[i]),
    /** Scale a company-wide series to the current unit/region. */
    sc: (a: number[]) => a.map(v => v * f),
    /** Sum a (scaled) series across the selected months. */
    sum: (a: number[]) => idx.reduce((s, i) => s + a[i], 0),
    /** Horizontal centre (0–100) of column k in an n-column chart. */
    X: (k: number) => (k + 0.5) / n * 100,
    /** Tooltip horizontal anchor so edge columns don't overflow. */
    tipX: (k: number) => (n === 1 ? '-50%' : k === 0 ? '-12%' : k === n - 1 ? '-88%' : '-50%'),
  };
}

export type Scope = ReturnType<typeof useScope>;
