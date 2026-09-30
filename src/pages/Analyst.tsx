import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { Track } from '../components/ui';
import { answers, suggestedQuestions, user } from '../data/mock';
import type { AnswerKey } from '../data/types';
import { summarizeDomains } from '../lib/domains';
import { useScope } from '../lib/scope';
import { inkFor } from '../lib/theme';
import { useApp } from '../state/AppContext';

export default function Analyst() {
  const { chat, thinking, ask, clearChat, files } = useApp();
  const s = useScope();
  const [draft, setDraft] = useState('');

  const send = (e: FormEvent) => {
    e.preventDefault();
    const t = draft.trim();
    if (t && !thinking) { ask(t); setDraft(''); }
  };
  const empty = chat.length === 0 && !thinking;

  return (
    <div className="fade g g-analyst">
      <section className="card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 22px', borderBottom: '1px solid #F0EEE8' }}>
          <span style={{ width: 36, height: 36, borderRadius: 10, background: '#17181C', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon name="analyst" />
          </span>
          <div style={{ flexGrow: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: 15 }}>ExecutiveIQ Analyst</div>
            <div style={{ fontSize: 12.5, color: '#6B6E76' }}>Answers from your Jan–Jun 2026 sales, finance, customer and operations data</div>
          </div>
          {chat.length > 0 && <button className="btn btn-sec" style={{ height: 34 }} onClick={clearChat} disabled={thinking}>New conversation</button>}
        </div>

        <div className="scroll" style={{ flexGrow: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column-reverse', padding: '22px 26px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            {empty && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 10, padding: '40px 0 8px' }}>
                <h2 className="serif" style={{ margin: 0, fontSize: 32, fontWeight: 500, letterSpacing: '-0.01em' }}>What would you like to understand?</h2>
                <p style={{ margin: 0, fontSize: 14.5, color: '#4A4D55', maxWidth: 520, lineHeight: 1.55 }}>Ask in plain language. The Analyst explains what changed, why, and what to look at next, using the same numbers you see on every screen.</p>
                <div className="g g-2" style={{ gap: 10, width: '100%', maxWidth: 680, marginTop: 20 }}>
                  {suggestedQuestions.map(([q, k]) => (
                    <button key={k} className="sugg" onClick={() => ask(q, k)}>
                      <Icon name="arrowRight" size={16} stroke="#2B59C3" width={2} />
                      <span>{q}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {chat.map((m, i) => m.role === 'user'
              ? (
                <div key={i} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', gap: 10 }}>
                  <div style={{ maxWidth: '70%', background: '#17181C', color: '#FFFFFF', padding: '12px 16px', borderRadius: '16px 16px 4px 16px', fontSize: 14, lineHeight: 1.5 }}>{m.text}</div>
                  <span style={{ width: 30, height: 30, borderRadius: '50%', background: '#C9A66B', color: '#121418', fontWeight: 700, fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{user.initials}</span>
                </div>
              )
              : <BotAnswer key={i} k={m.key!} />)}
            {thinking && (
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }} aria-live="polite">
                <span style={{ width: 30, height: 30, borderRadius: 8, background: '#17181C', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span className="dot pulse" style={{ background: '#FFFFFF' }} /></span>
                <span className="pulse" style={{ fontSize: 13.5, color: '#4A4D55' }}>Analyzing sales, finance and cost data…</span>
              </div>
            )}
          </div>
        </div>

        <form onSubmit={send} style={{ display: 'flex', gap: 10, padding: '16px 22px 18px', borderTop: '1px solid #F0EEE8', background: '#FAF9F6' }}>
          <label htmlFor="askbox" className="sr-only">Ask the Analyst</label>
          <input id="askbox" className="inp" placeholder="Ask about revenue, costs, customers, targets…" value={draft} onChange={e => setDraft(e.target.value)} autoComplete="off" />
          <button type="submit" className="btn btn-pri" style={{ height: 48, padding: '0 18px' }} disabled={!draft.trim() || thinking}>
            <Icon name="send" size={16} width={2} />
            Ask
          </button>
        </form>
      </section>

      <aside style={{ display: 'flex', flexDirection: 'column', gap: 16, minHeight: 0 }}>
        <section className="card" style={{ padding: 18 }}>
          <h2 className="h2" style={{ fontSize: 15, marginBottom: 8 }}>Suggested questions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', margin: '0 -6px' }}>
            {suggestedQuestions.map(([q, k]) => <button key={k} className="qlink" onClick={() => ask(q, k)}>{q}</button>)}
          </div>
        </section>
        <section className="card" style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <h2 className="h2" style={{ fontSize: 15 }}>Data in scope</h2>
          {summarizeDomains(files).map(d => (
            <div key={d.l} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
              <span className="dot" style={{ background: d.dot }} />
              <span style={{ flexGrow: 1 }}>{d.l}</span>
              <span className="num" style={{ color: '#6B6E76' }}>{d.rec} rows</span>
            </div>
          ))}
          <span style={{ fontSize: 12, color: '#6B6E76', lineHeight: 1.5 }}>Filters apply: {s.scope}. Answers cite their sources.</span>
        </section>
      </aside>
    </div>
  );
}

function BotAnswer({ k }: { k: AnswerKey }) {
  const navigate = useNavigate();
  const a = answers[k];
  const bmax = a.bars ? Math.max(...a.bars.map(b => Math.abs(b[1]))) : 1;
  return (
    <div className="fade" style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
      <span style={{ width: 30, height: 30, borderRadius: 8, background: '#17181C', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon name="sparkle" size={15} width={2} />
      </span>
      <div style={{ flexGrow: 1, minWidth: 0, maxWidth: 640, border: '1px solid #E6E3DC', borderRadius: '4px 16px 16px 16px', padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 14, background: '#FFFFFF' }}>
        <div style={{ fontSize: 14.5, lineHeight: 1.6, fontWeight: 500 }}>{a.lead}</div>
        {a.drivers && a.drivers.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span className="cap">{a.driversTitle ?? 'The main drivers were'}</span>
            {a.drivers.map((d, n) => (
              <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', background: '#FAF9F6', borderRadius: 10 }}>
                <span className="num" style={{ width: 22, height: 22, borderRadius: 6, background: '#17181C', color: '#FFFFFF', fontSize: 11.5, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{n + 1}</span>
                <span style={{ flexGrow: 1, fontSize: 13.5, fontWeight: 600 }}>{d.label}</span>
                <span className={d.cls}>{d.val}</span>
              </div>
            ))}
          </div>
        )}
        {a.bars && a.bars.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, border: '1px solid #F0EEE8', borderRadius: 12, padding: 14 }}>
            <span style={{ fontSize: 12.5, fontWeight: 600, color: '#4A4D55' }}>{a.barsTitle}</span>
            {a.bars.map(([label, v, val, c]) => (
              <div key={label} style={{ display: 'grid', gridTemplateColumns: 'minmax(100px, 180px) minmax(0, 1fr) 64px', gap: 10, alignItems: 'center' }}>
                <span style={{ fontSize: 12.5, color: '#4A4D55' }}>{label}</span>
                <Track w={(Math.abs(v) / bmax * 100).toFixed(1) + '%'} c={c} h={8} />
                <span className="num" style={{ fontSize: 12.5, fontWeight: 700, textAlign: 'right', color: inkFor(c) }}>{val}</span>
              </div>
            ))}
          </div>
        )}
        {a.note && <div style={{ fontSize: 14, lineHeight: 1.6 }}>{a.note}</div>}
        {a.steps && a.steps.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, background: '#F7F9FE', border: '1px solid #DCE4F6', borderRadius: 12, padding: '14px 16px' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#1F4499' }}>Suggested next steps</span>
            {a.steps.map(st => (
              <div key={st} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 13.5, lineHeight: 1.5 }}><span style={{ color: '#2B59C3', fontWeight: 700 }}>→</span><span>{st}</span></div>
            ))}
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11.5, color: '#6B6E76' }}>{a.sources}</span>
          {a.linkLabel && a.linkTo && <button className="btn btn-sec" style={{ height: 32, fontSize: 12.5 }} onClick={() => navigate(a.linkTo!)}>{a.linkLabel}</button>}
        </div>
      </div>
    </div>
  );
}
