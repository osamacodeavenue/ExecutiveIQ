import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { decisions as DEC } from '../data/mock';
import type { DecisionStatus } from '../data/types';
import { C } from '../lib/theme';
import { useApp } from '../state/AppContext';

const ST: Record<DecisionStatus, [string, string]> = {
  open: ['Needs decision', 'chip bad'],
  review: ['In review', 'chip info'],
  done: ['Resolved', 'chip good'],
};

export default function Decisions() {
  const { decisions, setDecision, openModal } = useApp();
  const navigate = useNavigate();
  const vals = Object.values(decisions);
  const open = vals.filter(s => s === 'open').length;
  const headline = open === 0 ? 'No decisions waiting on you' : open + (open === 1 ? ' Decision Requires' : ' Decisions Require') + ' Your Attention';
  const stat = (label: string, v: number) => (
    <div className="card" style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 2, minWidth: 84 }}>
      <span style={{ fontSize: 12, color: '#6B6E76' }}>{label}</span>
      <span className="num" style={{ fontSize: 20, fontWeight: 600 }}>{v}</span>
    </div>
  );

  return (
    <div className="fade stack" style={{ gap: 22 }}>
      <div className="head-row" style={{ gap: 20 }}>
        <div>
          <span className="cap">Decision Center</span>
          <h1 className="serif" style={{ margin: '6px 0 0', fontSize: 38, fontWeight: 500, letterSpacing: '-0.015em', lineHeight: 1.15 }}>{headline}</h1>
          <p className="sub" style={{ fontSize: 14 }}>Findings that need an owner and a decision this week. Each one links to the analysis behind it.</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {stat('Open', open)}
          {stat('In review', vals.filter(s => s === 'review').length)}
          {stat('Resolved', vals.filter(s => s === 'done').length)}
        </div>
      </div>

      {open === 0 && (
        <div className="card fade" style={{ padding: 28, display: 'flex', alignItems: 'center', gap: 16, background: '#F3FAF6', borderColor: '#CFE8D9' }}>
          <span style={{ width: 44, height: 44, borderRadius: '50%', background: C.good, color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon name="check" size={20} width={2.4} /></span>
          <div>
            <div style={{ fontWeight: 600, fontSize: 15 }}>You're all caught up</div>
            <div style={{ fontSize: 13.5, color: '#4A4D55', marginTop: 2 }}>Every decision has an owner. New findings will appear here after the July data refresh.</div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {DEC.map(d => {
          const st = decisions[d.id];
          return (
            <article key={d.id} className="card hov g g-decision" style={{ padding: '24px 26px', opacity: st === 'done' ? 0.6 : 1 }}>
              <div className="serif num dec-no" style={{ fontSize: 36, fontWeight: 500, color: C.stone, lineHeight: 1 }}>{d.no}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <h2 style={{ margin: 0, fontSize: 19, fontWeight: 600, letterSpacing: '-0.01em' }}>{d.title}</h2>
                  <span className={d.priority === 'High' ? 'chip bad' : 'chip warn'}>{d.priority} priority</span>
                  <span className={ST[st][1]}>{ST[st][0]}</span>
                </div>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: '#4A4D55', maxWidth: 680 }}><strong style={{ color: '#17181C' }}>Reason:</strong> {d.reason}</p>
                <div style={{ display: 'flex', gap: 18, fontSize: 12.5, color: '#6B6E76', flexWrap: 'wrap' }}>
                  <span>Suggested owner: <strong style={{ color: '#17181C', fontWeight: 600 }}>{d.owner}</strong></span>
                  <span>{d.due}</span>
                </div>
                <div style={{ display: 'flex', gap: 8, paddingTop: 6, flexWrap: 'wrap' }}>
                  <button className="btn btn-pri" onClick={() => openModal(d.analysis)}>{d.a1}</button>
                  <button className="btn btn-sec" onClick={() => navigate(d.to)}>{d.a2}</button>
                  {st === 'review' && <button className="btn btn-ghost" onClick={() => setDecision(d.id, 'done', d.title + ' marked as resolved')}>Mark resolved</button>}
                  {st === 'done' && <button className="btn btn-ghost" onClick={() => setDecision(d.id, 'open')}>Reopen</button>}
                </div>
              </div>
              <div className="dec-impact" style={{ borderLeft: '1px solid #F0EEE8', paddingLeft: 24, display: 'flex', flexDirection: 'column', gap: 6, justifyContent: 'center' }}>
                <span style={{ fontSize: 12.5, color: '#6B6E76' }}>Estimated impact</span>
                <span className="num" style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em', color: st === 'done' ? C.muted : d.priority === 'High' ? C.badInk : C.warnInk }}>{d.impact}</span>
                <span style={{ fontSize: 12.5, color: '#4A4D55' }}>{d.impactNote}</span>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
