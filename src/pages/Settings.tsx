import { PageHead } from '../components/ui';
import { company } from '../data/mock';
import { useApp, type Prefs } from '../state/AppContext';

const TOGGLES: [keyof Prefs, string, string][] = [
  ['digest', 'Morning briefing', "Show the day's top changes when you sign in"],
  ['alerts', 'Risk alerts', 'Notify me when a metric moves more than 5% against plan'],
  ['weekly', 'Weekly executive email', 'Send the executive report every Monday at 8:00'],
];

export default function Settings() {
  const { prefs, togglePref, toast } = useApp();
  const rows: [string, string][] = [
    ['Organization', company.name],
    ['Reporting currency', company.currency],
    ['Financial year', company.fiscalYear],
  ];

  return (
    <div className="fade stack" style={{ gap: 22, maxWidth: 760 }}>
      <PageHead title="Settings" sub="Workspace and personal preferences" />
      <section className="card" style={{ padding: '8px 24px 12px' }}>
        {rows.map(([k, v], i) => (
          <div key={k} style={{ display: 'grid', gridTemplateColumns: 'minmax(120px, 200px) minmax(0, 1fr)', gap: 12, padding: '16px 0', borderBottom: i < rows.length - 1 ? '1px solid #F0EEE8' : 0, fontSize: 14 }}>
            <span style={{ color: '#4A4D55' }}>{k}</span>
            <span style={{ fontWeight: 500 }}>{v}</span>
          </div>
        ))}
      </section>
      <section className="card" style={{ padding: '8px 24px 12px' }}>
        {TOGGLES.map(([k, title, desc], i) => (
          <label key={k} className="tog" style={i === TOGGLES.length - 1 ? { borderBottom: 0 } : undefined}>
            <span>
              <span style={{ display: 'block', fontSize: 14, fontWeight: 600 }}>{title}</span>
              <span style={{ display: 'block', fontSize: 13, color: '#4A4D55', marginTop: 2 }}>{desc}</span>
            </span>
            <input type="checkbox" checked={prefs[k]} onChange={() => togglePref(k)} />
          </label>
        ))}
      </section>
      <div><button className="btn btn-pri" onClick={() => toast('Preferences saved')}>Save changes</button></div>
    </div>
  );
}
