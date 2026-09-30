import { Icon } from '../components/Icon';
import { PageHead, Track } from '../components/ui';
import { ageing, concentration, customers, receivablesTotal } from '../data/mock';
import { M, int } from '../lib/format';
import { useScope } from '../lib/scope';
import { C } from '../lib/theme';
import { useApp } from '../state/AppContext';

export default function Customers() {
  const s = useScope();
  const { resetFilters, openModal } = useApp();
  const { f, g } = s;

  const cf = customers.filter(c => (s.unit === 'all' || c.unit === s.unit) && (s.region === 'all' || c.reg === s.region));

  const kpis: [string, string, string, string][] = [
    ['Total customers', int(1284 * f), 'Active accounts', C.muted],
    ['New customers', String(Math.max(1, Math.round(86 * f))), '↑ 12 vs May', C.goodInk],
    ['Returning customers', int(1198 * f), '93.3% repeat rate', C.muted],
    ['Customer revenue', M(48.6 * f), '↑ ' + g.toFixed(1) + '% vs May', C.goodInk],
    ['Outstanding receivables', M(38.5 * f), '↑ 9.4% vs May', C.badInk],
    ['Customer concentration', '42%', 'Top 3 share · ↑ 5 pts', C.badInk],
  ];

  const risks = cf
    .map(c => {
      const fl: string[] = [];
      if (c.o >= 5) fl.push('High balance · ' + M(c.o));
      if (c.g < 0) fl.push('Purchases ↓ ' + Math.abs(c.g) + '%');
      if (c.days > 45) fl.push('Pays in ' + c.days + ' days');
      return { c, fl };
    })
    .filter(x => x.fl.length)
    .sort((a, b) => b.fl.length - a.fl.length);

  return (
    <div className="fade stack" style={{ gap: 22 }}>
      <PageHead title="Customer Intelligence" sub={<>June 2026 · {s.scope} · Who drives revenue, and who puts cash at risk?</>} />

      <div className="g g-6" style={{ gap: 12 }}>
        {kpis.map(([label, val, d, c]) => (
          <div key={label} className="card hov" style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 7 }}>
            <span style={{ fontSize: 12.5, color: '#4A4D55', fontWeight: 500 }}>{label}</span>
            <span className="num" style={{ fontSize: 23, fontWeight: 600, letterSpacing: '-0.02em' }}>{val}</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: c }}>{d}</span>
          </div>
        ))}
      </div>

      <div className="g g-wide-4" style={{ gap: 18, alignItems: 'start' }}>
        <section className="card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px 16px' }}><h2 className="h2">Top Customers</h2><p className="sub">Key accounts by June revenue</p></div>
          {cf.length === 0 ? (
            <div style={{ padding: '48px 24px 56px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, textAlign: 'center', borderTop: '1px solid #F0EEE8' }}>
              <span style={{ width: 44, height: 44, borderRadius: 12, background: '#F0EEE8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B6E76' }}>
                <Icon name="user" size={20} />
              </span>
              <span style={{ fontWeight: 600 }}>No key accounts match these filters</span>
              <span style={{ fontSize: 13, color: '#4A4D55', maxWidth: 340 }}>{s.scope} has no customer above PKR 2M in June. Try another region or business unit.</span>
              <button className="btn btn-sec" onClick={resetFilters}>Reset filters</button>
            </div>
          ) : (
            <div className="tbl-wrap">
              <table className="tbl">
                <thead><tr><th>Customer</th><th>Channel · Region</th><th className="r">Revenue</th><th className="r">Growth</th><th className="r">Outstanding</th><th className="r">Days to pay</th></tr></thead>
                <tbody>
                  {cf.map(c => (
                    <tr key={c.name}>
                      <td style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{c.name}</td>
                      <td style={{ color: '#4A4D55', whiteSpace: 'nowrap' }}>{c.seg} · {c.rn}</td>
                      <td className="r num" style={{ fontWeight: 600 }}>{M(c.r)}</td>
                      <td className="r num" style={{ fontWeight: 600, color: c.g >= 0 ? C.goodInk : C.badInk }}>{(c.g >= 0 ? '+' : '−') + Math.abs(c.g)}%</td>
                      <td className="r num">{M(c.o)}</td>
                      <td className="r num" style={{ color: c.days > 45 ? C.badInk : c.days > 35 ? C.warnInk : C.ink, fontWeight: 600 }}>{c.days} days</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="card" style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div><h2 className="h2">Receivables Concentration</h2><p className="sub">{M(receivablesTotal)} outstanding · company-wide</p></div>
          <div style={{ display: 'flex', height: 14, borderRadius: 999, overflow: 'hidden', gap: 2 }}>
            {concentration.map(([l, v, bg]) => <div key={l} style={{ width: (v / receivablesTotal * 100).toFixed(2) + '%', background: bg }} />)}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {concentration.map(([l, v, bg]) => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
                <span style={{ width: 10, height: 10, borderRadius: 3, background: bg, flexShrink: 0 }} />
                <span style={{ flexGrow: 1 }}>{l}</span>
                <span className="num" style={{ fontWeight: 600 }}>{M(v)}</span>
                <span className="num" style={{ color: '#6B6E76', width: 46, textAlign: 'right' }}>{(v / receivablesTotal * 100).toFixed(1)}%</span>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid #F0EEE8', paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span className="cap">Ageing</span>
            {ageing.map(([l, v, c]) => (
              <div key={l} style={{ display: 'grid', gridTemplateColumns: '92px minmax(0, 1fr) 70px', gap: 10, alignItems: 'center' }}>
                <span style={{ fontSize: 12.5, color: '#4A4D55' }}>{l}</span>
                <Track w={(v / 21.6 * 100).toFixed(1) + '%'} c={c} h={8} />
                <span className="num" style={{ fontSize: 12.5, fontWeight: 600, textAlign: 'right' }}>{M(v)}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="card" style={{ padding: '22px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, gap: 12, flexWrap: 'wrap' }}>
          <div><h2 className="h2">Customer Risk</h2><p className="sub">Accounts with high balances, falling purchases or late payments</p></div>
          <button className="btn btn-sec" onClick={() => openModal('receivables')}>Review receivables plan</button>
        </div>
        {risks.length === 0 && <p style={{ margin: 0, padding: '18px 0', fontSize: 13.5, color: '#4A4D55' }}>No at-risk accounts in {s.scope}.</p>}
        <div className="g g-2" style={{ gap: 12 }}>
          {risks.map(({ c, fl }) => {
            const high = fl.length >= 2;
            return (
              <div key={c.name} style={{ border: '1px solid #E6E3DC', borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 14.5, fontWeight: 600 }}>{c.name}</span>
                  <span className={high ? 'chip bad' : 'chip warn'}>{high ? 'High' : 'Medium'} risk</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{fl.map(x => <span key={x} className="chip neutral">{x}</span>)}</div>
                <div style={{ display: 'flex', gap: 20, fontSize: 12.5, color: '#4A4D55', flexWrap: 'wrap' }}>
                  <span>Outstanding <strong className="num" style={{ color: '#17181C' }}>{M(c.o)}</strong></span>
                  <span>June revenue <strong className="num" style={{ color: '#17181C' }}>{M(c.r)}</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
