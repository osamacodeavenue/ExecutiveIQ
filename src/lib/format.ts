/** Format a value in PKR millions: two decimals below 10M, one above. */
export const M = (v: number) => 'PKR ' + (Math.abs(v) >= 10 ? v.toFixed(1) : v.toFixed(2)) + 'M';

/** Signed percentage with a true minus sign, e.g. "+12.4%" / "−3.2%". */
export const signedPct = (v: number, digits = 1) => (v >= 0 ? '+' : '−') + Math.abs(v).toFixed(digits) + '%';

export const arrow = (v: number) => (v >= 0 ? '↑' : '↓');

export const int = (v: number) => Math.round(v).toLocaleString('en-US');

export const pctOf = (v: number, max: number) => (v / max * 100).toFixed(1) + '%';

/** Round an axis maximum up to a "nice" value and return 5 evenly spaced ticks. */
export function niceScale(v: number) {
  const raw = v / 4;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  let step = mag * 10;
  for (const m of [1, 2, 2.5, 5, 10]) {
    if (m * mag >= raw) { step = m * mag; break; }
  }
  const fmt = (x: number) => (x === 0 ? '0' : x >= 1 ? (Number.isInteger(x) ? String(x) : x.toFixed(1)) : x.toFixed(2));
  return {
    max: step * 4,
    ticks: [4, 3, 2, 1, 0].map(k => ({ label: fmt(step * k), top: ((4 - k) / 4 * 100) + '%' })),
  };
}
