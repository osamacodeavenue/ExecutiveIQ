import { Icon } from '../components/Icon';
import { company, reportList, reports, reportSteps, user } from '../data/mock';
import { useApp } from '../state/AppContext';

export default function Reports() {
  const { report: R, generateReport, pickReport, toast } = useApp();
  const rc = R.sel ? reports[R.sel] : null;

  return (
    <div className="fade g g-reports">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <section className="card" style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 12, background: '#17181C', borderColor: '#17181C', color: '#FFFFFF' }}>
          <span style={{ fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', fontWeight: 600, color: '#A9ADB6' }}>Board-ready in seconds</span>
          <h2 style={{ margin: 0, fontSize: 19, fontWeight: 600 }}>Executive Report · June 2026</h2>
          <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.55, color: '#C9CCD3' }}>One page: performance, profit drivers, risks and the decisions that need you this week.</p>
          <button className="btn btn-pri" style={{ alignSelf: 'flex-start' }} onClick={generateReport} disabled={R.phase === 'gen'}>
            {R.phase === 'gen' ? 'Generating…' : 'Generate executive report'}
          </button>
        </section>
        <section className="card" style={{ padding: 10 }}>
          <div style={{ padding: '10px 12px 6px' }} className="cap">Management reports</div>
          {reportList.map(([id, t, d]) => (
            <button key={id} className={'rep' + (R.sel === id ? ' rep-on' : '')} onClick={() => pickReport(id)} aria-pressed={R.sel === id}>
              <span style={{ width: 36, height: 36, borderRadius: 9, background: '#F0EEE8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4A4D55', flexShrink: 0 }}>
                <Icon name="fileLines" size={17} />
              </span>
              <span style={{ display: 'flex', flexDirection: 'column', gap: 2, flexGrow: 1 }}>
                <span style={{ fontSize: 13.5, fontWeight: 600 }}>{t}</span>
                <span style={{ fontSize: 12, color: '#6B6E76' }}>{d}</span>
              </span>
            </button>
          ))}
        </section>
      </div>

      <section className="card" style={{ minHeight: 760, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {R.phase === 'idle' && (
          <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, textAlign: 'center', padding: 40 }}>
            <span style={{ width: 52, height: 52, borderRadius: 14, background: '#F0EEE8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B6E76' }}>
              <Icon name="file" size={22} />
            </span>
            <span style={{ fontWeight: 600, fontSize: 16 }}>No report selected</span>
            <span style={{ fontSize: 13.5, color: '#4A4D55', maxWidth: 360, lineHeight: 1.5 }}>Generate this month's executive report, or pick a management report on the left to preview it.</span>
          </div>
        )}

        {R.phase === 'gen' && (
          <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22, padding: 40 }}>
            <span style={{ fontWeight: 600, fontSize: 17 }}>Preparing your executive report</span>
            <div className="track" style={{ width: 'min(360px, 100%)', height: 6 }}><div className="bar" style={{ width: (R.step / 4 * 100) + '%', background: '#2B59C3' }} /></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 'min(360px, 100%)' }}>
              {reportSteps.map((t, k) => {
                const done = k < R.step, cur = k === R.step;
                return (
                  <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13.5, color: done || cur ? '#17181C' : '#6B6E76' }}>
                    <span style={{ width: 22, height: 22, borderRadius: '50%', border: '2px solid ' + (done || cur ? '#2B59C3' : '#D6D2C8'), background: done ? '#2B59C3' : '#FFFFFF', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {done && <Icon name="check" size={12} width={3.2} />}
                    </span>
                    <span className={cur ? 'pulse' : ''}>{t}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {R.phase === 'ready' && rc && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderBottom: '1px solid #F0EEE8', background: '#FAF9F6', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><span className="chip good">Ready</span><span style={{ fontSize: 13, color: '#4A4D55' }}>{rc.title} · 1 page · PDF</span></div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-sec" onClick={() => toast('Share link copied · visible to the leadership team')}>Share</button>
                <button className="btn btn-pri" onClick={() => toast(rc.title + '.pdf downloaded')}>
                  <Icon name="download" size={16} width={2} />
                  Download PDF
                </button>
              </div>
            </div>
            <div className="scroll" style={{ background: '#EDEBE5', padding: 28, flexGrow: 1, overflowY: 'auto' }}>
              <div key={R.sel} className="fade" style={{ background: '#FFFFFF', maxWidth: 720, margin: '0 auto', padding: 'clamp(24px, 5vw, 48px) clamp(20px, 5vw, 52px)', boxShadow: '0 2px 10px rgba(23,24,28,.08)', display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #17181C', paddingBottom: 18, gap: 16 }}>
                  <div>
                    <div className="cap">{rc.kicker}</div>
                    <div className="serif" style={{ fontSize: 30, fontWeight: 500, marginTop: 6, letterSpacing: '-0.01em' }}>{rc.title}</div>
                    <div style={{ fontSize: 12.5, color: '#4A4D55', marginTop: 6 }}>{company.name} · Prepared for {user.name}, CEO · 30 Jun 2026</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 13 }}>
                    <span style={{ width: 22, height: 22, borderRadius: 6, background: '#2B59C3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="logo" size={13} stroke="#FFFFFF" width={3} /></span>ExecutiveIQ
                  </div>
                </div>
                <div className="g g-4" style={{ gap: 12 }}>
                  {rc.metrics.map(k => (
                    <div key={k.l} style={{ border: '1px solid #E6E3DC', borderRadius: 10, padding: '12px 14px' }}>
                      <div style={{ fontSize: 11.5, color: '#6B6E76' }}>{k.l}</div>
                      <div className="num" style={{ fontSize: 18, fontWeight: 600, marginTop: 4 }}>{k.v}</div>
                      <div className="num" style={{ fontSize: 11.5, fontWeight: 600, color: k.c, marginTop: 2 }}>{k.d}</div>
                    </div>
                  ))}
                </div>
                {rc.sections.map(sec => (
                  <div key={sec.h} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{sec.h}</div>
                    {sec.p && <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.65 }}>{sec.p}</p>}
                    {sec.items?.map(i => <div key={i} style={{ display: 'flex', gap: 10, fontSize: 13.5, lineHeight: 1.6 }}><span style={{ color: '#6B6E76' }}>•</span><span>{i}</span></div>)}
                  </div>
                ))}
                <div style={{ borderTop: '1px solid #E6E3DC', paddingTop: 12, display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#6B6E76', gap: 12, flexWrap: 'wrap' }}>
                  <span>Confidential · {company.name}</span><span>Source data as of 30 Jun 2026</span>
                </div>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
