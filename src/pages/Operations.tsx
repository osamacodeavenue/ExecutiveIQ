import { useRef } from 'react';
import { Icon, type IconName } from '../components/Icon';
import { PageHead, SectionHead, Track } from '../components/ui';
import { lowStock, months, otdByRegion, series as D } from '../data/mock';
import { M } from '../lib/format';
import { useScope } from '../lib/scope';
import { C } from '../lib/theme';
import { useApp } from '../state/AppContext';

export default function Operations() {
  const s = useScope();
  const { openModal, poDone, draftPo, toast } = useApp();
  const stockRef = useRef<HTMLElement>(null);

  const kpis: [string, string, string][] = [
    ['Inventory value', M(64.8 * s.f), '↑ 4.1% vs May'],
    ['Inventory turnover', '5.4×', '↓ 0.2× vs May'],
    ['Order fulfillment', '96.1%', '↓ 1.2 pts'],
    ['Procurement cost', M(26.4 * s.f), '↑ 7.2% supplier prices'],
    ['On-time delivery', '88%', '↓ 6 pts vs May'],
    ['Operational efficiency', '76 / 100', '↓ 3 pts'],
  ];

  const alerts: { title: string; sev: string; tone: 'bad' | 'warn'; icon: IconName; body: string; detail: string; cta: string; go: () => void }[] = [
    { title: 'Delivery Delays', sev: 'High', tone: 'bad', icon: 'truck', body: 'On-time delivery dropped from 94% to 88%.', detail: 'Lahore and Islamabad routes account for most late orders; re-deliveries added PKR 0.15M in logistics cost.', cta: 'View cost analysis', go: () => openModal('logistics') },
    { title: 'Low Inventory', sev: 'Medium', tone: 'warn', icon: 'box', body: '12 products approaching reorder threshold.', detail: '4 are fast-moving Premium Beverage SKUs, the highest-margin category.', cta: 'Review products', go: () => stockRef.current?.scrollIntoView({ behavior: 'smooth' }) },
    { title: 'Procurement Cost', sev: 'Medium', tone: 'warn', icon: 'tag', body: 'Supplier costs increased 7.2%.', detail: 'Wheat flour, PET resin and packaging film drove the rise. Product B margin is most exposed.', cta: 'View supplier costs', go: () => openModal('procure') },
  ];
  const tone = { bad: ['#FBEAE7', C.badInk], warn: ['#FDF1D8', C.warnInk] };

  return (
    <div className="fade stack" style={{ gap: 22 }}>
      <PageHead title="Operations Overview" sub={<>June 2026 · {s.scope} · Can we deliver what we sell, at the right cost?</>} />

      <div className="g g-6" style={{ gap: 12 }}>
        {kpis.map(([label, val, d]) => (
          <div key={label} className="card hov" style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 7 }}>
            <span style={{ fontSize: 12.5, color: '#4A4D55', fontWeight: 500 }}>{label}</span>
            <span className="num" style={{ fontSize: 23, fontWeight: 600, letterSpacing: '-0.02em' }}>{val}</span>
            <span className="chip bad" style={{ alignSelf: 'flex-start' }}>{d}</span>
          </div>
        ))}
      </div>

      <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <h2 className="h2">Operational Alerts</h2>
        <div className="g g-3" style={{ gap: 16 }}>
          {alerts.map(a => (
            <article key={a.title} className="card hov" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 34, height: 34, borderRadius: 9, background: tone[a.tone][0], color: tone[a.tone][1], display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name={a.icon} width={1.9} />
                </span>
                <span style={{ fontSize: 15, fontWeight: 600, flexGrow: 1 }}>{a.title}</span>
                <span className={'chip ' + a.tone}>{a.sev}</span>
              </div>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 500, lineHeight: 1.5 }}>{a.body}</p>
              <p style={{ margin: 0, fontSize: 13, color: '#4A4D55', lineHeight: 1.5, flexGrow: 1 }}>{a.detail}</p>
              <div><button className="btn btn-sec" onClick={a.go}>{a.cta}</button></div>
            </article>
          ))}
        </div>
      </section>

      <div className="g g-wide-3" style={{ gap: 18 }}>
        <section className="card" style={{ padding: '22px 24px' }}>
          <SectionHead
            title="On-Time Delivery"
            sub="Share of orders delivered on the promised date"
            right={<span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#4A4D55' }}><span style={{ width: 14, borderTop: '2px dashed #C0392B' }} />92% service target</span>}
            style={{ alignItems: 'flex-start', marginBottom: 16 }}
          />
          <div style={{ position: 'relative', height: 200, display: 'flex', gap: 18, alignItems: 'flex-end', borderBottom: '1px solid #D6D2C8' }}>
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: '73.3%', borderTop: '2px dashed #C0392B', opacity: 0.6 }} />
            {s.idx.map(i => {
              const v = D.otd[i];
              return (
                <div key={i} style={{ flex: '1 1 0', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', gap: 6 }}>
                  <span className="num" style={{ fontSize: 12.5, fontWeight: 700, color: v < 92 ? C.badInk : C.ink }}>{v}%</span>
                  <div className="bar" style={{ width: '52%', height: ((v - 70) / 30 * 100).toFixed(1) + '%', background: v < 92 ? C.bad : C.brand, borderRadius: '5px 5px 0 0' }} />
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: 18, marginTop: 8 }}>
            {s.idx.map(i => <span key={i} style={{ flex: '1 1 0', textAlign: 'center', fontSize: 12, color: '#6B6E76' }}>{months[i]}</span>)}
          </div>
          <p style={{ margin: '10px 0 0', fontSize: 11.5, color: '#6B6E76' }}>Axis starts at 70%.</p>
        </section>
        <section className="card" style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div><h2 className="h2">Delivery by Region</h2><p className="sub">June on-time rate</p></div>
          {otdByRegion.map(([id, l, v, note]) => {
            const bg = s.region === 'all' || s.region === id ? (v >= 90 ? C.brand : v >= 85 ? C.warn : C.bad) : C.paleLine;
            return (
              <div key={id} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13.5, fontWeight: 500 }}>{l}</span>
                  <span className="num" style={{ fontSize: 13.5, fontWeight: 700, color: v >= 90 ? C.ink : v >= 85 ? C.warnInk : C.badInk }}>{v}%</span>
                </div>
                <Track w={v + '%'} c={bg} h={10} />
                <span style={{ fontSize: 12, color: '#6B6E76' }}>{note}</span>
              </div>
            );
          })}
        </section>
      </div>

      <section ref={stockRef} className="card" style={{ overflow: 'hidden', scrollMarginTop: 16 }}>
        <SectionHead
          title="Products Approaching Reorder Threshold"
          sub="6 most urgent of 12 SKUs · days of stock left at June sales rate"
          right={<button className="btn btn-sec" onClick={() => toast('12 purchase orders drafted and sent to Procurement for approval')}>Create purchase orders for all 12</button>}
          style={{ padding: '20px 24px 16px' }}
        />
        <div className="tbl-wrap">
          <table className="tbl">
            <thead><tr><th>Product</th><th>Category</th><th>Stock cover</th><th className="r">Reorder at</th><th>Supplier</th><th className="r">Action</th></tr></thead>
            <tbody>
              {lowStock.map(([n, cat, days, re, sup], k) => (
                <tr key={n}>
                  <td style={{ fontWeight: 600 }}>{n}</td>
                  <td style={{ color: '#4A4D55' }}>{cat}</td>
                  <td><span className={'chip ' + (days <= 4 ? 'bad' : 'warn')}>{days} days</span></td>
                  <td className="r num" style={{ color: '#4A4D55' }}>{re} days</td>
                  <td style={{ color: '#4A4D55' }}>{sup}</td>
                  <td className="r">
                    <button className="btn btn-ghost" style={{ height: 32 }} disabled={!!poDone[k]} onClick={() => draftPo(k, n)}>{poDone[k] ? 'PO drafted' : 'Create PO'}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
