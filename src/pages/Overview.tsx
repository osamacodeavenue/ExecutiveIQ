import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { SectionHead, Skeleton, Track } from '../components/ui';
import { healthBase, healthParts, healthRegionAdj, months, series as D, user, company } from '../data/mock';
import type { AnalysisKey } from '../data/types';
import { M, niceScale } from '../lib/format';
import { useScope, type Scope } from '../lib/scope';
import { C } from '../lib/theme';
import { useApp } from '../state/AppContext';

type Hover = { c: 'rev' | 'pro'; k: number } | null;

export default function Overview() {
  const s = useScope();
  const { resetFilters } = useApp();
  const navigate = useNavigate();
  const [hover, setHover] = useState<Hover>(null);

  return (
    <div className="fade stack" style={{ gap: 26 }}>
      <div className="head-row">
        <div>
          <h1 className="serif" style={{ margin: 0, fontSize: 40, fontWeight: 500, letterSpacing: '-0.015em', lineHeight: 1.1 }}>{greeting()}, {user.first}</h1>
          <p style={{ margin: '8px 0 0', fontSize: 15.5, color: '#4A4D55' }}>Here's what needs your attention today.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          {s.filtered && (
            <>
              <span className="chip info">Viewing {s.scope}</span>
              <button className="btn btn-ghost" style={{ height: 30 }} onClick={resetFilters}>Reset filters</button>
            </>
          )}
          <span style={{ fontSize: 12.5, color: '#6B6E76' }}>Data as of {company.asOf}</span>
          <button className="btn btn-dark" onClick={() => navigate('/analyst')}>
            <Icon name="sparkle" size={16} />
            Ask the Analyst
          </button>
        </div>
      </div>

      <div className="g g-health">
        <HealthCard s={s} />
        <KpiGrid s={s} />
      </div>

      <Attention s={s} />

      <div className="g g-wide" style={{ gap: 18 }}>
        <RevenueChart s={s} hover={hover} setHover={setHover} />
        <ProfitChart s={s} hover={hover} setHover={setHover} />
      </div>

      <MonthlyTable s={s} />
    </div>
  );
}

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Good Morning' : h < 17 ? 'Good Afternoon' : 'Good Evening';
}

function HealthCard({ s }: { s: Scope }) {
  const hs = healthBase[s.unit] + healthRegionAdj[s.region];
  const dlt = hs - 82;
  const color = hs >= 80 ? C.good : C.warn;
  return (
    <section className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="h2">Business Health Score</h2>
        <span className={hs >= 80 ? 'chip good' : 'chip warn'}>{hs >= 80 ? 'Healthy' : 'Stable'}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
        <div style={{ position: 'relative', width: 132, height: 132, flexShrink: 0 }}>
          <svg width="132" height="132" viewBox="0 0 120 120" aria-hidden="true">
            <circle cx="60" cy="60" r="50" fill="none" style={{ stroke: '#EFEDE7', strokeWidth: 11 }} />
            <circle cx="60" cy="60" r="50" fill="none" transform="rotate(-90 60 60)" style={{ stroke: color, strokeWidth: 11, strokeLinecap: 'round', strokeDasharray: (hs / 100 * 314.16).toFixed(1) + ' 314.16', transition: 'stroke-dasharray .6s ease' }} />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div className="num" style={{ fontSize: 38, fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1 }}>{hs}</div>
            <div style={{ fontSize: 12, color: '#6B6E76', marginTop: 4 }}>out of 100</div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: C.goodInk }}>↑ 2 pts vs May</span>
          <p style={{ margin: 0, fontSize: 13.5, color: '#4A4D55', lineHeight: 1.5 }}>Sales are strong. Cost growth and slower deliveries are pulling the score down.</p>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {healthParts.map(([label, v, note]) => {
          const x = v + dlt;
          return (
            <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{label}</span>
                <span className="num" style={{ fontSize: 13, fontWeight: 600 }}>{x}</span>
              </div>
              <Track w={x + '%'} c={x >= 80 ? C.good : C.warn} />
              <span style={{ fontSize: 12, color: '#6B6E76' }}>{note}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function sparkPoints(s: Scope, a: number[]) {
  const v = s.idx.map(i => a[i]);
  const lo = Math.min(...v), hi = Math.max(...v), r = (hi - lo) || 1;
  return v.map((x, k) => (k / (v.length - 1) * 100).toFixed(1) + ',' + (28 - (x - lo) / r * 24).toFixed(1)).join(' ');
}

function KpiGrid({ s }: { s: Scope }) {
  const rev = s.sc(D.rev), gp = s.sc(D.gp), np = s.sc(D.np);
  const revPrev = rev[5] / (1 + s.g / 100);
  const kp = (label: string, cur: number, prev: number, ser: number[], goodUp: boolean) => {
    const p = (cur / prev - 1) * 100, good = goodUp ? p >= 0 : p <= 0;
    return { label, val: M(cur), prev: M(prev), pct: Math.abs(p).toFixed(1) + '%', arrow: p >= 0 ? '↑' : '↓', chip: 'chip ' + (good ? 'good' : 'bad'), spark: sparkPoints(s, ser), sc: good ? C.good : C.bad };
  };
  const kpis = [
    kp('Revenue', rev[5], revPrev, rev, true),
    kp('Gross Profit', gp[5], gp[4], gp, true),
    kp('Net Profit', np[5], np[4], np, true),
    kp('Sales Pipeline', 132.5 * s.f, 121 * s.f, s.sc(D.pipe), true),
    kp('Operating Costs', 12.6 * s.f, 10.98 * s.f, s.sc(D.opex), false),
    kp('Cash Position', 22.4 * s.f, 24.1 * s.f, s.sc(D.cash), true),
  ];
  return (
    <div className="g g-3" style={{ gap: 16 }}>
      {kpis.map(k => (
        <div key={k.label} className="card hov" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12, justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
            <span className="lbl">{k.label}</span>
            <span className={k.chip}>{k.arrow} {k.pct}</span>
          </div>
          {s.loading ? <Skeleton h={36} w="72%" /> : <div className="num fade" style={{ fontSize: 30, fontWeight: 600, letterSpacing: '-0.025em', lineHeight: 1.15 }}>{k.val}</div>}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 12 }}>
            <span style={{ fontSize: 12.5, color: '#6B6E76', lineHeight: 1.4 }}>vs {k.prev}<br />last month</span>
            <svg width="104" height="34" viewBox="0 0 100 32" preserveAspectRatio="none" aria-hidden="true" style={{ flexShrink: 0 }}>
              <polyline points={k.spark} fill="none" style={{ stroke: k.sc, strokeWidth: 2, vectorEffect: 'non-scaling-stroke', strokeLinejoin: 'round', strokeLinecap: 'round' }} />
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
}

interface Insight {
  id: string;
  tag: string;
  tagCls: string;
  dot: string;
  title: string;
  body: string;
  impactLabel: string;
  impact: string;
  impactColor: string;
  ctaLabel: string;
  cta: () => void;
  steps: [string, string][];
  bars: [string, string, string, string][];
}

function Attention({ s }: { s: Scope }) {
  const { openModal } = useApp();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState<string | null>('risk');
  const { f, g } = s;
  const open = (k: AnalysisKey) => () => openModal(k);
  const insights: Insight[] = [
    {
      id: 'risk', tag: 'Risk', tagCls: 'chip bad', dot: C.bad, title: 'Operating expenses increased faster than revenue',
      body: 'Operating expenses increased by 14.8% while revenue increased by ' + g.toFixed(1) + '%.',
      impactLabel: 'Estimated margin pressure, next quarter', impact: M(1.2 * f), impactColor: C.badInk, ctaLabel: 'Investigate', cta: open('opex'),
      steps: [['Issue', 'Opex rose ' + M(1.62 * f) + ' in June, led by logistics and salaries & admin.'], ['Impact', 'If the gap persists, margin pressure of about ' + M(1.2 * f) + ' builds over the next quarter.'], ['Action', 'Review logistics contracts and hold discretionary spend until the July close.']],
      bars: [['Opex growth', '92%', C.bad, '14.8%'], ['Revenue growth', (g / 16 * 100).toFixed(0) + '%', C.brand, g.toFixed(1) + '%']],
    },
    {
      id: 'opp', tag: 'Opportunity', tagCls: 'chip good', dot: C.good, title: 'Premium Beverage category is outperforming',
      body: 'The category generated 31% higher margins than the company average.',
      impactLabel: 'June gross profit from category', impact: M(4.07 * f), impactColor: C.goodInk, ctaLabel: 'Explore Opportunity', cta: open('premium'),
      steps: [['Issue', 'Premium Beverages earned a 51.5% gross margin against a 39.3% company average.'], ['Impact', 'Every extra PKR 1M of category sales adds about PKR 0.12M more gross profit than an average sale.'], ['Action', 'Expand shelf space in Karachi and Lahore modern trade and protect stock of the top SKUs.']],
      bars: [['Category margin', '100%', C.good, '51.5%'], ['Company average', '76%', C.stone, '39.3%']],
    },
    {
      id: 'warn', tag: 'Warning', tagCls: 'chip warn', dot: C.amber, title: 'Customer concentration is increasing',
      body: 'Three major customers represent 42% of outstanding receivables.',
      impactLabel: 'Owed by the top three customers', impact: M(16.2 * f), impactColor: C.warnInk, ctaLabel: 'View Customers', cta: () => navigate('/customers'),
      steps: [['Issue', 'Meridian Superstores, Al-Noor Distributors and Punjab Retail Group owe PKR 16.2M of PKR 38.5M.'], ['Impact', 'A payment delay from the largest one alone would tie up about a third of current cash.'], ['Action', 'Tighten credit terms on accounts past 45 days and schedule collection calls this week.']],
      bars: [['Top-3 share, June', '84%', C.warn, '42%'], ['Top-3 share, May', '74%', C.stone, '37%']],
    },
  ];

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <h2 className="h2" style={{ fontSize: 20 }}>What Needs Your Attention?</h2>
          <p className="sub">Three findings from June data, ranked by business impact</p>
        </div>
        <button className="btn btn-ghost" onClick={() => navigate('/decisions')}>Open Decision Center <Icon name="arrowRight" size={16} width={2} /></button>
      </div>
      <div className="g g-3" style={{ gap: 16, alignItems: 'start' }}>
        {insights.map(it => {
          const ex = expanded === it.id;
          const toggle = () => setExpanded(ex ? null : it.id);
          return (
            <article key={it.id} className="card hov" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className={it.tagCls}><span className="dot" style={{ background: it.dot }} />{it.tag}</span>
                <button className="icon-sm" aria-label={ex ? 'Collapse details' : 'Expand details'} aria-expanded={ex} onClick={toggle}>
                  <Icon name="chevDown" size={16} width={2} style={{ transform: `rotate(${ex ? 180 : 0}deg)`, transition: 'transform .2s' }} />
                </button>
              </div>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, lineHeight: 1.35, letterSpacing: '-0.01em' }}>{it.title}</h3>
              <p style={{ margin: 0, fontSize: 13.5, color: '#4A4D55', lineHeight: 1.55 }}>{it.body}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, padding: '11px 13px', background: '#FAF9F6', borderRadius: 10, border: '1px solid #EFEDE7' }}>
                <span style={{ fontSize: 12.5, color: '#4A4D55' }}>{it.impactLabel}</span>
                <span className="num" style={{ fontSize: 15, fontWeight: 700, color: it.impactColor, whiteSpace: 'nowrap' }}>{it.impact}</span>
              </div>
              {ex && (
                <div className="fade" style={{ display: 'flex', flexDirection: 'column', gap: 12, borderTop: '1px solid #EFEDE7', paddingTop: 14 }}>
                  {it.steps.map(([k, v]) => (
                    <div key={k} style={{ display: 'grid', gridTemplateColumns: '82px minmax(0, 1fr)', gap: 10 }}>
                      <span className="cap" style={{ paddingTop: 2 }}>{k}</span>
                      <span style={{ fontSize: 13, lineHeight: 1.5 }}>{v}</span>
                    </div>
                  ))}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 4 }}>
                    {it.bars.map(([l, w, c, v]) => (
                      <div key={l} style={{ display: 'grid', gridTemplateColumns: '110px minmax(0, 1fr) 52px', gap: 10, alignItems: 'center' }}>
                        <span style={{ fontSize: 12, color: '#4A4D55' }}>{l}</span>
                        <Track w={w} c={c} h={8} />
                        <span className="num" style={{ fontSize: 12.5, fontWeight: 600, textAlign: 'right' }}>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div style={{ display: 'flex', gap: 8, paddingTop: 2, flexWrap: 'wrap' }}>
                <button className="btn btn-pri" onClick={it.cta}>{it.ctaLabel}</button>
                <button className="btn btn-sec" onClick={toggle}>{ex ? 'Hide details' : 'Details'}</button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

const pts = (s: Scope, a: number[], mx: number) => s.idx.map((i, k) => s.X(k).toFixed(2) + ',' + (100 - a[i] / mx * 100).toFixed(2)).join(' ');

function RevenueChart({ s, hover, setHover }: { s: Scope; hover: Hover; setHover: (h: Hover) => void }) {
  const [vis, setVis] = useState({ a: true, t: true, p: true });
  const rev = s.sc(D.rev), tgt = s.sc(D.tgt), prv = s.sc(D.prev);
  const rmax = Math.max(...s.idx.map(i => Math.max(rev[i], tgt[i], prv[i])));
  const rsc = niceScale(rmax * 1.06);
  const summary = s.rangeShort + ' revenue is ' + (s.sum(rev) / s.sum(tgt) * 100).toFixed(1) + '% of target. June beat target by ' + ((rev[5] / tgt[5] - 1) * 100).toFixed(1) + '%.';
  const legend: ['a' | 't' | 'p', string, string, string][] = [['a', 'Actual', C.brand, '10px'], ['t', 'Target', C.ink, '3px'], ['p', 'Same period 2025', C.stone, '3px']];
  const tipK = hover && hover.c === 'rev' && hover.k < s.n ? hover.k : null;

  return (
    <section className="card" style={{ padding: '22px 24px', minWidth: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 18, flexWrap: 'wrap' }}>
        <div>
          <h2 className="h2">Revenue vs Target</h2>
          <p className="sub">{summary}</p>
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {legend.map(([k, l, c, h]) => (
            <button key={k} className={'leg' + (vis[k] ? '' : ' leg-off')} aria-pressed={vis[k]} onClick={() => setVis(v => ({ ...v, [k]: !v[k] }))}>
              <span style={{ width: 14, height: h, background: c, borderRadius: 2 }} />{l}
            </button>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <div style={{ position: 'relative', width: 36, height: 240, flexShrink: 0 }}>
          {rsc.ticks.map(tk => <span key={tk.label} className="num" style={{ position: 'absolute', right: 0, top: tk.top, transform: 'translateY(-50%)', fontSize: 11.5, color: '#6B6E76' }}>{tk.label}</span>)}
        </div>
        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 }}>
          <div style={{ position: 'relative', height: 240 }} onMouseLeave={() => setHover(null)}>
            {rsc.ticks.map(tk => <div key={tk.label} style={{ position: 'absolute', left: 0, right: 0, top: tk.top, borderTop: '1px solid #F0EEE8' }} />)}
            <div style={{ position: 'absolute', inset: 0, display: 'flex' }}>
              {s.idx.map((i, k) => {
                const on = tipK === k;
                return (
                  <div key={i} className="col-hit" style={{ flex: '1 1 0', height: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', background: on ? 'rgba(43,89,195,.07)' : 'transparent', borderRadius: 6 }} onMouseEnter={() => setHover({ c: 'rev', k })}>
                    {vis.a && <div className="bar" style={{ width: '42%', maxWidth: 44, height: (rev[i] / rsc.max * 100).toFixed(2) + '%', background: on ? C.brandDark : C.brand, borderRadius: '5px 5px 0 0' }} />}
                  </div>
                );
              })}
            </div>
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'visible' }}>
              {vis.p && <polyline points={pts(s, prv, rsc.max)} fill="none" style={{ stroke: C.stone, strokeWidth: 2, strokeDasharray: '5 5', vectorEffect: 'non-scaling-stroke' }} />}
              {vis.t && <polyline points={pts(s, tgt, rsc.max)} fill="none" style={{ stroke: C.ink, strokeWidth: 2, vectorEffect: 'non-scaling-stroke', strokeLinejoin: 'round' }} />}
            </svg>
            {vis.t && s.idx.map((i, k) => (
              <span key={i} style={{ position: 'absolute', left: s.X(k).toFixed(2) + '%', bottom: (tgt[i] / rsc.max * 100).toFixed(2) + '%', width: 9, height: 9, borderRadius: '50%', background: '#FFFFFF', border: '2px solid #17181C', transform: 'translate(-50%, 50%)', pointerEvents: 'none' }} />
            ))}
            {tipK !== null && (() => {
              const i = s.idx[tipK], a = rev[i] / tgt[i] * 100;
              return (
                <div className="tip" style={{ top: 4, left: s.X(tipK).toFixed(2) + '%', transform: `translateX(${s.tipX(tipK)})`, padding: '12px 14px', fontSize: 12.5, minWidth: 190, gap: 6 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 2 }}>{months[i]} 2026</div>
                  <div className="tip-row"><span>Actual</span><span className="num" style={{ fontWeight: 600 }}>{M(rev[i])}</span></div>
                  <div className="tip-row"><span>Target</span><span className="num">{M(tgt[i])}</span></div>
                  <div className="tip-row"><span>Same month 2025</span><span className="num">{M(prv[i])}</span></div>
                  <div style={{ borderTop: '1px solid #34363C', paddingTop: 7, marginTop: 2, color: a >= 100 ? '#7FD1A3' : '#F2C26B', fontWeight: 600 }}>{a.toFixed(1)}% of target</div>
                </div>
              );
            })()}
          </div>
          <div style={{ display: 'flex' }}>
            {s.monthLabels.map(m => <span key={m} style={{ flex: '1 1 0', textAlign: 'center', fontSize: 12, color: '#6B6E76' }}>{m}</span>)}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProfitChart({ s, hover, setHover }: { s: Scope; hover: Hover; setHover: (h: Hover) => void }) {
  const gp = s.sc(D.gp), eb = s.sc(D.ebitda), np = s.sc(D.np);
  const psc = niceScale(Math.max(...s.idx.map(i => gp[i])) * 1.1);
  const legend: [string, string, number, number][] = [['Gross profit', C.brand, gp[5], 11.7], ['EBITDA', C.orange, eb[5], 6.2], ['Net profit', C.ink, np[5], -3.2]];
  const tipK = hover && hover.c === 'pro' && hover.k < s.n ? hover.k : null;

  return (
    <section className="card" style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
      <h2 className="h2">Profitability Trend</h2>
      <p className="sub">Profit is growing slower than sales</p>
      <div className="g g-3" style={{ gap: 10, margin: '16px 0 14px' }}>
        {legend.map(([l, c, v, d]) => (
          <div key={l} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#4A4D55' }}><span style={{ width: 12, height: 3, borderRadius: 2, background: c }} />{l}</span>
            <span className="num" style={{ fontSize: 15, fontWeight: 600 }}>{M(v)}</span>
            <span className="num" style={{ fontSize: 12, fontWeight: 600, color: d >= 0 ? C.goodInk : C.badInk }}>{(d >= 0 ? '↑ ' : '↓ ') + Math.abs(d).toFixed(1)}% vs May</span>
          </div>
        ))}
      </div>
      <div style={{ position: 'relative', flexGrow: 1, minHeight: 150 }} onMouseLeave={() => setHover(null)}>
        {psc.ticks.map(tk => <div key={tk.label} style={{ position: 'absolute', left: 0, right: 0, top: tk.top, borderTop: '1px solid #F0EEE8' }} />)}
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}>
          <polyline points={pts(s, gp, psc.max)} fill="none" style={{ stroke: C.brand, strokeWidth: 2.5, vectorEffect: 'non-scaling-stroke', strokeLinejoin: 'round' }} />
          <polyline points={pts(s, eb, psc.max)} fill="none" style={{ stroke: C.orange, strokeWidth: 2.5, vectorEffect: 'non-scaling-stroke', strokeLinejoin: 'round' }} />
          <polyline points={pts(s, np, psc.max)} fill="none" style={{ stroke: C.ink, strokeWidth: 2.5, vectorEffect: 'non-scaling-stroke', strokeLinejoin: 'round' }} />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex' }}>
          {s.idx.map((i, k) => (
            <div key={i} className="col-hit" style={{ flex: '1 1 0', height: '100%', background: tipK === k ? 'rgba(23,24,28,.05)' : 'transparent', borderRadius: 6 }} onMouseEnter={() => setHover({ c: 'pro', k })} />
          ))}
        </div>
        {tipK !== null && (() => {
          const i = s.idx[tipK];
          return (
            <div className="tip" style={{ top: 0, left: s.X(tipK).toFixed(2) + '%', transform: `translateX(${s.tipX(tipK)})`, padding: '10px 12px', fontSize: 12, minWidth: 170, gap: 5, boxShadow: 'none' }}>
              <div style={{ fontWeight: 600 }}>{months[i]} 2026</div>
              <div className="tip-row" style={{ gap: 12 }}><span>Gross profit</span><span className="num">{M(gp[i])}</span></div>
              <div className="tip-row" style={{ gap: 12 }}><span>EBITDA</span><span className="num">{M(eb[i])}</span></div>
              <div className="tip-row" style={{ gap: 12 }}><span>Net profit</span><span className="num">{M(np[i])}</span></div>
            </div>
          );
        })()}
      </div>
      <div style={{ display: 'flex', marginTop: 8 }}>
        {s.monthLabels.map(m => <span key={m} style={{ flex: '1 1 0', textAlign: 'center', fontSize: 12, color: '#6B6E76' }}>{m}</span>)}
      </div>
    </section>
  );
}

function MonthlyTable({ s }: { s: Scope }) {
  const navigate = useNavigate();
  const rev = s.sc(D.rev), tgt = s.sc(D.tgt), np = s.sc(D.np);
  return (
    <section className="card" style={{ overflow: 'hidden' }}>
      <SectionHead title="Monthly Performance" sub={s.rangeName + ' · ' + s.scope} style={{ padding: '20px 24px 16px' }} right={<button className="btn btn-sec" onClick={() => navigate('/finance')}>Open Finance</button>} />
      <div className="tbl-wrap">
        <table className="tbl">
          <thead><tr><th>Month</th><th className="r">Revenue</th><th className="r">Target</th><th>Achievement</th><th className="r">Gross margin</th><th className="r">Net profit</th><th className="r">Month on month</th></tr></thead>
          <tbody>
            {s.idx.map(i => {
              const a = rev[i] / tgt[i] * 100;
              const mom = i > 0 ? (rev[i] / rev[i - 1] - 1) * 100 : null;
              return (
                <tr key={i}>
                  <td style={{ fontWeight: 500 }}>{months[i]} 2026</td>
                  <td className="r num" style={{ fontWeight: 600 }}>{M(rev[i])}</td>
                  <td className="r num" style={{ color: '#4A4D55' }}>{M(tgt[i])}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Track w={(Math.min(a, 110) / 110 * 100).toFixed(1) + '%'} c={a >= 100 ? C.good : C.warn} width={120} radius={999} />
                      <span className="num" style={{ fontSize: 13, fontWeight: 600 }}>{a.toFixed(1)}%</span>
                    </div>
                  </td>
                  <td className="r num">{(D.gp[i] / D.rev[i] * 100).toFixed(1)}%</td>
                  <td className="r num">{M(np[i])}</td>
                  <td className="r num" style={{ fontWeight: 600, color: mom === null ? '#6B6E76' : mom >= 0 ? C.goodInk : C.badInk }}>{mom === null ? '—' : (mom >= 0 ? '+' : '−') + Math.abs(mom).toFixed(1) + '%'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
