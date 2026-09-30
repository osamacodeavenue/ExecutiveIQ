import { PageHead, Skeleton, Track } from '../components/ui';
import { budgetVsActual, expenses, finance as F, months, series as D, waterfall } from '../data/mock';
import { M, niceScale } from '../lib/format';
import { useScope, type Scope } from '../lib/scope';
import { C } from '../lib/theme';

export default function Finance() {
  const s = useScope();
  const { f } = s;
  const revPrev = 48.6 * f / (1 + s.g / 100);
  const FK = (label: string, cur: number, prev: number, goodUp: boolean) => {
    const p = (cur / prev - 1) * 100, good = goodUp ? p >= 0 : p <= 0;
    return { label, val: M(cur), prev: M(prev), pct: Math.abs(p).toFixed(1) + '%', arrow: p >= 0 ? '↑' : '↓', chip: 'chip ' + (good ? 'good' : 'bad') };
  };
  const kpis = [
    FK('Revenue', 48.6 * f, revPrev, true),
    FK('COGS', F.cogs[0] * f, F.cogs[1] * f, false),
    FK('Gross Profit', F.gp[0] * f, F.gp[1] * f, true),
    FK('Operating Expenses', F.opex[0] * f, F.opex[1] * f, false),
    FK('EBITDA', F.ebitda[0] * f, F.ebitda[1] * f, true),
    FK('Net Profit', F.np[0] * f, F.np[1] * f, true),
    FK('Operating Cash Flow', F.ocf[0] * f, F.ocf[1] * f, true),
  ];

  return (
    <div className="fade stack" style={{ gap: 22 }}>
      <PageHead title="Financial Performance" sub={'June 2026 vs May 2026 · ' + s.scope} />

      <div className="g g-7" style={{ gap: 12 }}>
        {kpis.map(k => (
          <div key={k.label} className="card hov" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 7 }}>
            <span style={{ fontSize: 12.5, color: '#4A4D55', fontWeight: 500 }}>{k.label}</span>
            {s.loading ? <Skeleton h={26} w="80%" /> : <span className="num" style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.02em' }}>{k.val}</span>}
            <span className={k.chip} style={{ alignSelf: 'flex-start' }}>{k.arrow} {k.pct}</span>
            <span style={{ fontSize: 11.5, color: '#6B6E76' }}>May: {k.prev}</span>
          </div>
        ))}
      </div>

      <ProfitBridge s={s} />

      <div className="g g-2" style={{ gap: 18 }}>
        <RevenueTrend s={s} />
        <MarginTrend s={s} />
        <section className="card" style={{ padding: '22px 24px' }}>
          <h2 className="h2">Expense Breakdown</h2>
          <p className="sub">Operating expenses, June 2026 · {M(12.6 * f)} total</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 18 }}>
            {expenses.map(([l, v, gr, c]) => (
              <div key={l} style={{ display: 'grid', gridTemplateColumns: 'minmax(100px, 140px) minmax(0, 1fr) 84px 76px', gap: 12, alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{l}</span>
                <Track w={(v / 5.16 * 100).toFixed(1) + '%'} c={c} h={10} />
                <span className="num" style={{ fontSize: 13, fontWeight: 600, textAlign: 'right' }}>{M(v * f)}</span>
                <span className="bad chip num" style={{ justifySelf: 'end' }}>↑ {gr.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </section>
        <section className="card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '22px 24px 14px' }}><h2 className="h2">Budget vs Actual</h2><p className="sub">June 2026 · favourable variances in green</p></div>
          <div className="tbl-wrap">
            <table className="tbl">
              <thead><tr><th>Line</th><th className="r">Budget</th><th className="r">Actual</th><th className="r">Variance</th></tr></thead>
              <tbody>
                {budgetVsActual.map(([l, b, a, up]) => {
                  const v = (a / b - 1) * 100, fav = up ? v >= 0 : v <= 0;
                  return (
                    <tr key={l}>
                      <td style={{ fontWeight: 500 }}>{l}</td>
                      <td className="r num" style={{ color: '#4A4D55' }}>{M(b * f)}</td>
                      <td className="r num" style={{ fontWeight: 600 }}>{M(a * f)}</td>
                      <td className="r"><span className={'chip ' + (fav ? 'good' : 'bad')}>{(v >= 0 ? '+' : '−') + Math.abs(v).toFixed(1)}%</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

function ProfitBridge({ s }: { s: Scope }) {
  const { f } = s;
  const wmax = 7;
  let run = 0;
  const wf = waterfall.map(([l, v, total, sub]) => {
    let lo: number, hi: number;
    if (total) { lo = 0; hi = v; run = v; }
    else { const b = run; run += v; lo = Math.min(b, run); hi = Math.max(b, run); }
    return {
      l,
      s: sub === 'sales' ? 'on +' + M(5.36 * f) + ' sales' : sub,
      val: total ? M(v * f) : (v >= 0 ? '+' : '−') + M(Math.abs(v * f)).replace('PKR ', ''),
      bottom: (lo / wmax * 100).toFixed(2) + '%',
      h: ((hi - lo) / wmax * 100).toFixed(2) + '%',
      lab: (hi / wmax * 100).toFixed(2) + '%',
      bg: total ? C.ink : v >= 0 ? C.good : C.bad,
      vc: total ? C.ink : v >= 0 ? C.goodInk : C.badInk,
    };
  });

  return (
    <section className="card" style={{ padding: '26px 28px' }}>
      <div className="g g-bridge">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <span className="cap">Profit bridge · May → June</span>
          <h2 className="serif" style={{ margin: 0, fontSize: 30, fontWeight: 500, lineHeight: 1.15, letterSpacing: '-0.01em' }}>Why Did Profit Change?</h2>
          <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.6 }}>Net profit fell <strong>{M(0.12 * f)}</strong> (−3.2%) even though revenue grew {s.g.toFixed(1)}%. Higher sales added gross profit, but cost growth took more than all of it back.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 4 }}>
            {[
              [C.good, 'Sales did their job.', `Volume and Premium Beverage mix added ${M(2.72 * f)}.`],
              [C.bad, 'Costs outran sales.', `Product B margin, logistics, marketing and overheads took back ${M(2.84 * f)}.`],
              ['#B7791F', 'Watch working capital.', 'Higher receivables pushed finance cost up.'],
            ].map(([c, strong, rest]) => (
              <div key={strong} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span className="dot" style={{ background: c, marginTop: 6 }} />
                <span style={{ fontSize: 13, lineHeight: 1.5, color: '#4A4D55' }}><strong style={{ color: '#17181C' }}>{strong}</strong> {rest}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minWidth: 640, padding: '0 10px' }}>
            <div style={{ position: 'relative', height: 270, marginTop: 20, borderBottom: '1px solid #D6D2C8' }}>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', gap: 10 }}>
                {wf.map(w => (
                  <div key={w.l} style={{ flex: '1 1 0', position: 'relative', height: '100%' }}>
                    <div className="bar" style={{ position: 'absolute', left: '14%', right: '14%', bottom: w.bottom, height: w.h, background: w.bg, borderRadius: 4 }} />
                    <span className="num" style={{ position: 'absolute', left: 0, right: 0, bottom: w.lab, textAlign: 'center', fontSize: 12.5, fontWeight: 700, color: w.vc, paddingBottom: 6, whiteSpace: 'nowrap' }}>{w.val}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              {wf.map(w => (
                <div key={w.l} style={{ flex: '1 1 0', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, lineHeight: 1.3 }}>{w.l}</span>
                  <span style={{ fontSize: 11.5, color: '#6B6E76', lineHeight: 1.3 }}>{w.s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function RevenueTrend({ s }: { s: Scope }) {
  const rev = s.sc(D.rev), gp = s.sc(D.gp);
  const fmax = niceScale(Math.max(...s.idx.map(i => rev[i])) * 1.12).max;
  return (
    <section className="card" style={{ padding: '22px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, gap: 12, flexWrap: 'wrap' }}>
        <div><h2 className="h2">Revenue Trend</h2><p className="sub">Revenue split into cost of goods and gross profit</p></div>
        <div style={{ display: 'flex', gap: 14, fontSize: 12, color: '#4A4D55' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 10, height: 10, borderRadius: 2, background: C.brand }} />Gross profit</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 10, height: 10, borderRadius: 2, background: C.paleBlue }} />COGS</span>
        </div>
      </div>
      <div style={{ position: 'relative', height: 210, display: 'flex', gap: 14, alignItems: 'flex-end', borderBottom: '1px solid #D6D2C8' }}>
        {s.idx.map(i => (
          <div key={i} style={{ flex: '1 1 0', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center' }}>
            <span className="num" style={{ fontSize: 11.5, fontWeight: 600, marginBottom: 5 }}>{rev[i].toFixed(1)}</span>
            <div className="bar" style={{ width: '56%', height: (gp[i] / fmax * 100).toFixed(2) + '%', background: C.brand, borderRadius: '4px 4px 0 0' }} />
            <div className="bar" style={{ width: '56%', height: ((rev[i] - gp[i]) / fmax * 100).toFixed(2) + '%', background: C.paleBlue }} />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 14, marginTop: 8 }}>
        {s.idx.map(i => <span key={i} style={{ flex: '1 1 0', textAlign: 'center', fontSize: 12, color: '#6B6E76' }}>{months[i]}</span>)}
      </div>
    </section>
  );
}

function MarginTrend({ s }: { s: Scope }) {
  const gm = D.gp.map((v, i) => v / D.rev[i] * 100);
  const em = D.ebitda.map((v, i) => v / D.rev[i] * 100);
  const nm = D.np.map((v, i) => v / D.rev[i] * 100);
  const mgPts = (arr: number[]) => s.idx.map((i, k) => s.X(k).toFixed(2) + ',' + (100 - arr[i] / 50 * 100).toFixed(2)).join(' ');
  const ticks = [50, 40, 30, 20, 10, 0].map(v => ({ label: v + '%', top: (100 - v * 2) + '%' }));
  const lines: [number[], string, string][] = [[gm, C.brand, 'Gross'], [em, C.orange, 'EBITDA'], [nm, C.ink, 'Net']];

  return (
    <section className="card" style={{ padding: '22px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, gap: 12, flexWrap: 'wrap' }}>
        <div><h2 className="h2">Profit Margin Trend</h2><p className="sub">Net margin slipped to 7.4% in June</p></div>
        <div style={{ display: 'flex', gap: 14, fontSize: 12, color: '#4A4D55' }}>
          {lines.map(([, c, l]) => <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 12, height: 3, background: c }} />{l}</span>)}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <div style={{ position: 'relative', width: 32, height: 210, flexShrink: 0 }}>
          {ticks.map(tk => <span key={tk.label} className="num" style={{ position: 'absolute', right: 0, top: tk.top, transform: 'translateY(-50%)', fontSize: 11.5, color: '#6B6E76' }}>{tk.label}</span>)}
        </div>
        <div style={{ flexGrow: 1, position: 'relative', height: 210 }}>
          {ticks.map(tk => <div key={tk.label} style={{ position: 'absolute', left: 0, right: 0, top: tk.top, borderTop: '1px solid #F0EEE8' }} />)}
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}>
            {lines.map(([arr, c, l]) => <polyline key={l} points={mgPts(arr)} fill="none" style={{ stroke: c, strokeWidth: 2.5, vectorEffect: 'non-scaling-stroke' }} />)}
          </svg>
          {lines.map(([arr, c, l]) => (
            <span key={l} className="num" style={{ position: 'absolute', right: -4, top: (100 - arr[5] * 2).toFixed(2) + '%', transform: 'translate(100%, -50%)', fontSize: 11.5, fontWeight: 700, color: c, background: '#FFFFFF', paddingLeft: 4 }}>{arr[5].toFixed(1)}%</span>
          ))}
        </div>
        <div style={{ width: 36, flexShrink: 0 }} />
      </div>
      <div style={{ display: 'flex', margin: '8px 46px 0 42px' }}>
        {s.idx.map(i => <span key={i} style={{ flex: '1 1 0', textAlign: 'center', fontSize: 12, color: '#6B6E76' }}>{months[i]}</span>)}
      </div>
    </section>
  );
}
