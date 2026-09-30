import { PageHead, SectionHead, Skeleton, Track } from '../components/ui';
import {
  funnelColors, funnelCounts, funnelStages, funnelValues, regionBreakdown, regionShare, reps as allReps,
  series as D, unitBreakdown, unitShare,
} from '../data/mock';
import { M } from '../lib/format';
import { useScope } from '../lib/scope';
import { C } from '../lib/theme';

export default function Sales() {
  const s = useScope();
  const rev = s.sc(D.rev), tgt = s.sc(D.tgt);
  const tot = s.sum(rev), tt = s.sum(tgt);
  const fu = funnelCounts[s.range].map(v => Math.max(1, Math.round(v * s.f)));
  const conv = (fu[4] / fu[1] * 100).toFixed(1) + '%';
  const achT = tot / tt * 100;

  const kpis: [string, string, string, string][] = [
    ['Total Sales', M(tot), achT.toFixed(1) + '% of target', achT >= 100 ? C.goodInk : C.warnInk],
    ['Sales Target', M(tt), s.rangeName, C.muted],
    ['Pipeline Value', M(132.5 * s.f), '↑ 9.5% vs May', C.goodInk],
    ['Conversion Rate', conv, 'Qualified to won', C.muted],
    ['Average Deal Size', M(tot / fu[4]), fu[4] + ' deals won', C.muted],
  ];

  const repsF = allReps.filter(r => s.region === 'all' || r.reg === s.region);
  const reps = [...repsF].sort((a, b) => b.r / b.t - a.r / a.t);
  const repsAbove = repsF.filter(r => r.r >= r.t).length;

  const breakdown = (rows: [string, string, number, number][], share: number, selected: string, max: number) =>
    rows.map(([id, l, sh, gr]) => (
      <div key={id} style={{ display: 'grid', gridTemplateColumns: '90px minmax(0, 1fr) 84px 58px', gap: 12, alignItems: 'center' }}>
        <span style={{ fontSize: 13, fontWeight: 500 }}>{l}</span>
        <Track w={(sh / max * 100).toFixed(0) + '%'} c={selected === 'all' || selected === id ? C.brand : C.paleBlue} h={10} />
        <span className="num" style={{ fontSize: 13, fontWeight: 600, textAlign: 'right' }}>{M(48.6 * sh * share)}</span>
        <span className="num" style={{ fontSize: 12.5, fontWeight: 600, color: C.goodInk, textAlign: 'right' }}>+{gr.toFixed(1)}%</span>
      </div>
    ));

  return (
    <div className="fade stack" style={{ gap: 22 }}>
      <PageHead title="Sales Overview" sub={<>{s.rangeName} · {s.scope} · Are we selling enough, and where will next month's revenue come from?</>} />

      <div className="g g-5" style={{ gap: 14 }}>
        {kpis.map(([label, val, sub, subC]) => (
          <div key={label} className="card hov" style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span className="lbl">{label}</span>
            {s.loading ? <Skeleton h={30} w="70%" /> : <span className="num" style={{ fontSize: 25, fontWeight: 600, letterSpacing: '-0.02em' }}>{val}</span>}
            <span style={{ fontSize: 12.5, color: subC, fontWeight: 500 }}>{sub}</span>
          </div>
        ))}
      </div>

      <div className="g g-wide-2" style={{ gap: 18 }}>
        <section className="card" style={{ padding: '22px 24px' }}>
          <SectionHead title="Sales Funnel" sub={'Deals by stage · ' + s.rangeName} right={<span className="chip info">{conv} qualified-to-won</span>} style={{ alignItems: 'flex-start', marginBottom: 20 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {funnelStages.map((st, k) => {
              const v = k === 4 ? M(tot) : funnelValues[k] ? M(funnelValues[k]! * s.f) : '—';
              return (
                <div key={st} style={{ display: 'grid', gridTemplateColumns: '96px minmax(0, 1fr) 118px', gap: 14, alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 600 }}>{st}</div>
                    <div style={{ fontSize: 12, color: '#6B6E76' }}>{k < 4 ? Math.round(fu[k + 1] / fu[k] * 100) + '% move on' : 'Closed'}</div>
                  </div>
                  <div style={{ position: 'relative', height: 40, background: '#F5F4F0', borderRadius: 8, overflow: 'hidden' }}>
                    <div className="bar" style={{ height: '100%', width: Math.max(6, fu[k] / fu[0] * 100).toFixed(1) + '%', background: funnelColors[k], borderRadius: 8 }} />
                    <span className="num" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 13.5, fontWeight: 600, whiteSpace: 'nowrap' }}>{fu[k].toLocaleString('en-US')} deals</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="num" style={{ fontSize: 13.5, fontWeight: 600 }}>{v}</div>
                    <div style={{ fontSize: 12, color: '#6B6E76' }}>{k === 0 ? 'top of funnel' : k === 4 ? 'won revenue' : 'open value'}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="card" style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div>
            <h2 className="h2">Where June Sales Came From</h2>
            <p className="sub">Revenue and growth vs May</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <span className="cap">By business unit</span>
            {breakdown(unitBreakdown, regionShare[s.region], s.unit, 0.46)}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <span className="cap">By region</span>
            {breakdown(regionBreakdown, unitShare[s.unit], s.region, 0.45)}
          </div>
        </section>
      </div>

      <section className="card" style={{ overflow: 'hidden' }}>
        <SectionHead
          title="Sales Performance"
          sub={'June 2026 · field sales team' + (s.region === 'all' ? '' : ' · ' + s.regName)}
          right={<span className="chip good">{repsAbove} of {repsF.length} above target</span>}
          style={{ padding: '20px 24px 16px' }}
        />
        <div className="tbl-wrap">
          <table className="tbl">
            <thead><tr><th style={{ width: 56 }}>#</th><th>Salesperson</th><th>Region · Channel</th><th className="r">Revenue</th><th className="r">Target</th><th>Achievement</th><th>Status</th></tr></thead>
            <tbody>
              {reps.map((r, k) => {
                const a = r.r / r.t * 100;
                const tone = a >= 100 ? 'good' : a >= 95 ? 'info' : 'warn';
                return (
                  <tr key={r.name}>
                    <td className="num" style={{ color: '#6B6E76' }}>{k + 1}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ width: 32, height: 32, borderRadius: '50%', background: '#F0EEE8', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4A4D55', flexShrink: 0 }}>{r.ini}</span>
                        <span style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{r.name}</span>
                      </div>
                    </td>
                    <td style={{ color: '#4A4D55', whiteSpace: 'nowrap' }}>{r.rn} · {r.seg}</td>
                    <td className="r num" style={{ fontWeight: 600 }}>{M(r.r)}</td>
                    <td className="r num" style={{ color: '#4A4D55' }}>{M(r.t)}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Track w={(Math.min(a, 120) / 120 * 100).toFixed(1) + '%'} c={a >= 100 ? C.good : a >= 95 ? C.brand : C.warn} width={130} />
                        <span className="num" style={{ fontWeight: 600 }}>{a.toFixed(0)}%</span>
                      </div>
                    </td>
                    <td><span className={'chip ' + tone}>{a >= 100 ? 'Above target' : a >= 95 ? 'On track' : 'Below target'}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
