import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { company, user } from '../data/mock';
import { useApp } from '../state/AppContext';
import { Icon, type IconName } from './Icon';

const NAV: [string, string, IconName][] = [
  ['/', 'Overview', 'overview'],
  ['/sales', 'Sales', 'sales'],
  ['/finance', 'Finance', 'finance'],
  ['/operations', 'Operations', 'operations'],
  ['/customers', 'Customers', 'customers'],
  ['/analyst', 'AI Analyst', 'analyst'],
  ['/decisions', 'Decision Center', 'decisions'],
  ['/reports', 'Reports', 'reports'],
  ['/data', 'Data', 'data'],
];

const navCls = ({ isActive }: { isActive: boolean }) => 'nav' + (isActive ? ' nav-on' : '');

export function Sidebar({ open, onNavigate }: { open: boolean; onNavigate: () => void }) {
  const { decisions, toast } = useApp();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(false);
  const openCount = Object.values(decisions).filter(s => s === 'open').length;

  const go = (to: string) => { setProfile(false); onNavigate(); navigate(to); };

  return (
    <aside className={'side scroll' + (open ? ' open' : '')} aria-label="Sidebar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '2px 8px 24px' }}>
        <div style={{ width: 34, height: 34, borderRadius: 9, background: '#2B59C3', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon name="logo" size={20} stroke="#FFFFFF" width={2.6} />
        </div>
        <div>
          <div style={{ color: '#FFFFFF', fontWeight: 700, fontSize: 16.5, letterSpacing: '-0.01em' }}>ExecutiveIQ</div>
          <div style={{ color: '#8A8F99', fontSize: 11.5, marginTop: 1 }}>{company.name}</div>
        </div>
      </div>
      <div style={{ fontSize: 10.5, color: '#8A8F99', letterSpacing: '0.09em', textTransform: 'uppercase', fontWeight: 600, padding: '0 12px 8px' }}>Command Center</div>
      <nav aria-label="Main" style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV.map(([to, label, icon]) => (
          <NavLink key={to} to={to} end={to === '/'} className={navCls} onClick={onNavigate}>
            <Icon name={icon} />
            <span style={{ flexGrow: 1 }}>{label}</span>
            {to === '/decisions' && openCount > 0 && <span className="nbadge">{openCount}</span>}
          </NavLink>
        ))}
      </nav>
      <div style={{ flexGrow: 1, minHeight: 24 }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, borderTop: '1px solid #23262D', paddingTop: 12, position: 'relative' }}>
        <NavLink to="/settings" className={navCls} onClick={onNavigate}>
          <Icon name="settings" />
          <span>Settings</span>
        </NavLink>
        <button className="nav" style={{ height: 56, marginTop: 4 }} onClick={() => setProfile(p => !p)} aria-expanded={profile} aria-haspopup="menu">
          <span style={{ width: 34, height: 34, borderRadius: '50%', background: '#C9A66B', color: '#121418', fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{user.initials}</span>
          <span style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, minWidth: 0 }}>
            <span style={{ color: '#F2F2F0', fontSize: 13.5, fontWeight: 600 }}>{user.name}</span>
            <span style={{ color: '#8A8F99', fontSize: 12 }}>{user.title}</span>
          </span>
          <Icon name="chevUp" size={16} width={2} />
        </button>
        {profile && (
          <>
            <div className="scrim" onClick={() => setProfile(false)} />
            <div className="menu fade" role="menu" style={{ left: 8, bottom: 70, width: 260, padding: 8 }}>
              <div style={{ padding: '12px 12px 14px', borderBottom: '1px solid #F0EEE8', marginBottom: 6 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{user.name}</div>
                <div style={{ fontSize: 12.5, color: '#6B6E76', marginTop: 2 }}>{user.email}</div>
                <div style={{ marginTop: 10 }}><span className="chip info">{user.access}</span></div>
              </div>
              <button className="mitem" role="menuitem" onClick={() => go('/settings')}>Account &amp; preferences</button>
              <button className="mitem" role="menuitem" onClick={() => go('/data')}>Data connections</button>
              <button className="mitem" role="menuitem" onClick={() => { setProfile(false); toast('Help center opens in the full product'); }}>Help &amp; shortcuts</button>
              <div style={{ height: 1, background: '#F0EEE8', margin: '6px 0' }} />
              <button className="mitem" role="menuitem" style={{ color: '#A8321F' }} onClick={() => { setProfile(false); toast('Sign-out is disabled in this demo'); }}>Sign out</button>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
