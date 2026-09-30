import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyses } from '../data/mock';
import type { ModalAction } from '../data/types';
import { inkFor } from '../lib/theme';
import { useApp } from '../state/AppContext';
import { Icon } from './Icon';
import { Track } from './ui';

export function AnalysisModal() {
  const { modal, closeModal, decisions, setDecision, toast } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (!modal) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeModal(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [modal, closeModal]);

  if (!modal) return null;
  const an = analyses[modal];
  const run = (a: ModalAction) => {
    closeModal();
    if (a.type === 'nav') navigate(a.to);
    else toast(a.msg);
  };

  const decId = an.dec;
  const st = decId ? decisions[decId] : null;
  let primary = an.primary;
  let onPrimary = () => {
    if (an.onPrimary) run(an.onPrimary);
    else if (decId) setDecision(decId, 'review', an.title + ' assigned · review started');
  };
  if (decId && st === 'review') { primary = 'Mark as resolved'; onPrimary = () => setDecision(decId, 'done', an.title + ' marked as resolved'); }
  if (decId && st === 'done') { primary = 'Reopen decision'; onPrimary = () => setDecision(decId, 'open', an.title + ' reopened'); }
  const onSecondary = () => (an.onSecondary ? run(an.onSecondary) : closeModal());
  const bmax = Math.max(...an.bars.map(b => Math.abs(b[1])));

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(18,20,24,.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60, padding: 16 }} onClick={closeModal}>
      <div className="fade" role="dialog" aria-modal="true" aria-label={an.title} style={{ width: 720, maxWidth: '100%', maxHeight: 'min(820px, calc(100vh - 32px))', overflowY: 'auto', background: '#FFFFFF', borderRadius: 18, boxShadow: '0 30px 80px rgba(0,0,0,.25)', display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: '26px 28px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span className={an.tagCls} style={{ alignSelf: 'flex-start' }}>{an.tag}</span>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 600, letterSpacing: '-0.015em' }}>{an.title}</h2>
          </div>
          <button className="icon-sm" aria-label="Close" onClick={closeModal} autoFocus><Icon name="close" width={2} /></button>
        </div>
        <div style={{ padding: '16px 28px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.6 }}>{an.lead}</p>
          <div className="g g-3" style={{ gap: 12 }}>
            {an.metrics.map(([l, v]) => (
              <div key={l} style={{ background: '#FAF9F6', border: '1px solid #EFEDE7', borderRadius: 12, padding: '14px 16px' }}>
                <div style={{ fontSize: 12, color: '#6B6E76' }}>{l}</div>
                <div className="num" style={{ fontSize: 19, fontWeight: 600, marginTop: 4 }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#4A4D55' }}>{an.barsTitle}</span>
            {an.bars.map(([l, v, lab, c]) => (
              <div key={l} style={{ display: 'grid', gridTemplateColumns: 'minmax(110px, 190px) minmax(0, 1fr) 70px', gap: 12, alignItems: 'center' }}>
                <span style={{ fontSize: 13 }}>{l}</span>
                <Track w={(Math.abs(v) / bmax * 100).toFixed(1) + '%'} c={c} h={10} />
                <span className="num" style={{ fontSize: 13, fontWeight: 700, textAlign: 'right', color: inkFor(c) }}>{lab}</span>
              </div>
            ))}
          </div>
          <div style={{ background: '#F7F9FE', border: '1px solid #DCE4F6', borderRadius: 12, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#1F4499' }}>Recommended actions</span>
            {an.recs.map(r => (
              <div key={r} style={{ display: 'flex', gap: 8, fontSize: 13.5, lineHeight: 1.5 }}><span style={{ color: '#2B59C3', fontWeight: 700 }}>→</span><span>{r}</span></div>
            ))}
          </div>
        </div>
        <div style={{ padding: '16px 28px', borderTop: '1px solid #F0EEE8', display: 'flex', justifyContent: 'flex-end', gap: 8, background: '#FAF9F6', borderRadius: '0 0 18px 18px', flexWrap: 'wrap' }}>
          <button className="btn btn-sec" onClick={onSecondary}>{an.secondary ?? 'Close'}</button>
          <button className="btn btn-pri" onClick={onPrimary}>{primary}</button>
        </div>
      </div>
    </div>
  );
}
