import { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useApp } from '../state/AppContext';
import { AnalysisModal } from './AnalysisModal';
import { Icon } from './Icon';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

const TITLES: Record<string, string> = {
  '/': 'Executive Overview',
  '/sales': 'Sales',
  '/finance': 'Finance',
  '/operations': 'Operations',
  '/customers': 'Customers',
  '/analyst': 'AI Analyst',
  '/decisions': 'Decision Center',
  '/reports': 'Reports',
  '/data': 'Data Center',
  '/settings': 'Settings',
};

export function Layout() {
  const { pathname } = useLocation();
  const { toastMsg } = useApp();
  const [menu, setMenu] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const title = TITLES[pathname] ?? 'ExecutiveIQ';

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 });
    document.title = title + ' · ExecutiveIQ';
  }, [pathname, title]);

  return (
    <div className="app">
      <Sidebar open={menu} onNavigate={() => setMenu(false)} />
      {menu && <div className="side-scrim" onClick={() => setMenu(false)} />}
      <div className="shell-main">
        <TopBar title={title} onMenu={() => setMenu(true)} />
        <main ref={mainRef} className="content scroll">
          <div className="content-inner">
            <Outlet />
          </div>
        </main>
      </div>
      <AnalysisModal />
      {toastMsg && (
        <div className="fade" role="status" style={{ position: 'fixed', right: 28, bottom: 28, left: 'auto', zIndex: 80, background: '#17181C', color: '#FFFFFF', padding: '14px 18px', borderRadius: 12, fontSize: 13.5, display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 14px 40px rgba(0,0,0,.25)', maxWidth: 'min(420px, calc(100vw - 32px))' }}>
          <Icon name="check" size={16} stroke="#7FD1A3" width={2.6} />
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
}
