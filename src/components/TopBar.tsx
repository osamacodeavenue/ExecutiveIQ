import { useState, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { company, notifications } from '../data/mock';
import type { Filters } from '../data/types';
import { useApp } from '../state/AppContext';
import { Icon, type IconName } from './Icon';

function FilterSelect<K extends keyof Filters>({ k, icon, label, options }: { k: K; icon: IconName; label: string; options: [Filters[K], string][] }) {
  const { filters, setFilter } = useApp();
  return (
    <div className="selw">
      <Icon name={icon} size={16} className="ic" />
      <select className="sel" aria-label={label} value={filters[k]} onChange={(e: ChangeEvent<HTMLSelectElement>) => setFilter(k, e.target.value as Filters[K])}>
        {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
      <Icon name="chevDown" size={14} width={2} className="chev" />
    </div>
  );
}

export function TopBar({ title, onMenu }: { title: string; onMenu: () => void }) {
  const { unread, markRead } = useApp();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <header className="topbar">
      <button className="icon-btn menu-btn" aria-label="Open navigation" onClick={onMenu}><Icon name="menu" /></button>
      <div style={{ flexGrow: 1, minWidth: 0 }}>
        <div className="hide-sm" style={{ fontSize: 12, color: '#6B6E76' }}>{company.name} · {company.industry} · {company.country}</div>
        <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.01em', marginTop: 2 }}>{title}</div>
      </div>
      <div className="filters" style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <FilterSelect k="range" icon="calendar" label="Date range" options={[['h1', 'Jan 2026 – Jun 2026'], ['q2', 'Apr 2026 – Jun 2026']]} />
        <FilterSelect k="unit" icon="layers" label="Business unit" options={[['all', 'All Business'], ['retail', 'Retail'], ['wholesale', 'Wholesale'], ['ecom', 'E-commerce']]} />
        <FilterSelect k="region" icon="pin" label="Region" options={[['all', 'All Regions'], ['khi', 'Karachi'], ['lhe', 'Lahore'], ['isb', 'Islamabad']]} />
      </div>
      <div className="hide-sm" style={{ width: 1, height: 28, background: '#E6E3DC', margin: '0 4px' }} />
      <div style={{ position: 'relative' }}>
        <button className="icon-btn" aria-label="Notifications" aria-expanded={open} onClick={() => setOpen(o => !o)}>
          <Icon name="bell" />
          {unread > 0 && (
            <span style={{ position: 'absolute', top: -5, right: -5, minWidth: 19, height: 19, borderRadius: 999, background: '#C0392B', color: '#FFFFFF', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #FAF9F6', padding: '0 4px' }}>{unread}</span>
          )}
        </button>
        {open && (
          <>
            <div className="scrim" onClick={() => setOpen(false)} />
            <div className="menu fade" style={{ right: 0, top: 50, width: 'min(380px, calc(100vw - 32px))', padding: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px 10px' }}>
                <div style={{ fontWeight: 600, fontSize: 14.5 }}>Notifications</div>
                <button className="btn btn-ghost" style={{ height: 30, fontSize: 12.5 }} onClick={markRead}>Mark all as read</button>
              </div>
              {notifications.map((nt, k) => (
                <button key={nt.t} className="nrow" onClick={() => { setOpen(false); navigate(nt.to); }}>
                  <span className="dot" style={{ background: nt.dot, marginTop: 6 }} />
                  <span style={{ display: 'flex', flexDirection: 'column', gap: 3, flexGrow: 1 }}>
                    <span style={{ fontSize: 13.5, fontWeight: k < unread ? 600 : 500 }}>{nt.t}</span>
                    <span style={{ fontSize: 12.5, color: '#4A4D55', lineHeight: 1.4 }}>{nt.d}</span>
                  </span>
                  <span style={{ fontSize: 11.5, color: '#6B6E76', whiteSpace: 'nowrap' }}>{nt.time}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </header>
  );
}
