import { useEffect, useMemo, useState } from 'react';
import { screenRegistry } from '../data/screenRegistry';
import type { ErpSession } from '../types/session';
import { ErpSessionContext } from './ErpSessionContext';
import { pageMap } from './pageMap';

const areaOrder = [
  'Foundation / Admin',
  'Master / Procurement / Stock',
  'Manufacturing / Quality',
  'Sales / Dispatch',
  'Finance / Support',
  'Scale',
  'Finance Supplement',
];

type AppShellProps = {
  session: ErpSession;
  onChooseContext: () => void;
  onLogout: () => Promise<void> | void;
};

export default function AppShell({ session, onChooseContext, onLogout }: AppShellProps) {
  const allowedKey = session.allowed_screens.join('|');
  const allowedScreens = useMemo(() => new Set(session.allowed_screens), [allowedKey]);
  const navigation = useMemo(
    () => screenRegistry.filter((screen) => allowedScreens.has(screen.code) && !screen.code.startsWith('ACC-')),
    [allowedScreens]
  );
  const defaultCode = allowedScreens.has('WRK-HOME') ? 'WRK-HOME' : navigation[0]?.code;
  const [screenCode, setScreenCode] = useState(defaultCode ?? '');
  const [search, setSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const syncHash = () => {
      const requested = window.location.hash.replace(/^#/, '');
      const permitted = requested && requested in pageMap && allowedScreens.has(requested);
      const resolved = permitted ? requested : defaultCode;

      setScreenCode(resolved ?? '');
      setSidebarOpen(false);

      if (!permitted && resolved) {
        window.history.replaceState(null, '', `#${resolved}`);
      }
    };

    syncHash();
    window.addEventListener('hashchange', syncHash);
    return () => window.removeEventListener('hashchange', syncHash);
  }, [allowedScreens, defaultCode]);

  const current = navigation.find((screen) => screen.code === screenCode);
  const CurrentPage = current ? pageMap[current.code as keyof typeof pageMap] : null;

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return navigation.filter((screen) =>
      !query || `${screen.code} ${screen.title} ${screen.description}`.toLowerCase().includes(query)
    );
  }, [navigation, search]);

  function go(code: string) {
    if (!allowedScreens.has(code)) return;
    window.location.hash = code;
    setSidebarOpen(false);
  }

  const context = session.selected_context;
  const primaryRole = session.roles[0] ? roleLabel(session.roles[0]) : 'Assigned user';

  return (
    <div className="app-shell">
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="side-brand">
          <span className="brand-mark">Q&T</span>
          <div><b>Q & T FOODS LTD</b><small>ERP + CRM</small></div>
        </div>
        <div className="side-search">
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search my modules" aria-label="Search authorised modules" />
        </div>
        <nav aria-label="Authorised ERP modules">
          {areaOrder.map((area) => {
            const items = filtered.filter((screen) => screen.area === area);
            if (!items.length) return null;
            return (
              <section key={area} className="nav-group">
                <h4>{area}</h4>
                {items.map((item) => (
                  <button key={item.code} className={item.code === current?.code ? 'active' : ''} onClick={() => go(item.code)}>
                    <small>{item.code}</small><span>{item.title}</span>
                  </button>
                ))}
              </section>
            );
          })}
          {!filtered.length && <div className="nav-empty">No authorised module matches your search.</div>}
        </nav>
        <div className="side-user">
          <span className="avatar">{initials(session.user.name)}</span>
          <div className="side-user-copy"><b>{session.user.name}</b><small>{primaryRole}</small></div>
          <button className="side-logout" type="button" aria-label="Sign out" title="Sign out" onClick={() => void onLogout()}>↪</button>
        </div>
      </aside>

      {sidebarOpen && <button className="sidebar-scrim" type="button" aria-label="Close navigation" onClick={() => setSidebarOpen(false)} />}

      <section className="main">
        <header className="topbar">
          <button className="icon mobile-menu" aria-label="Toggle navigation" onClick={() => setSidebarOpen((open) => !open)}>☰</button>
          <button className="context-button" onClick={onChooseContext}>
            <i></i>
            <span><b>{context?.company_name}</b><small>{context?.plant_name ?? 'All plants'} · {primaryRole}</small></span>
            ⌄
          </button>
          <div className="spacer"></div>
          <span className="prototype-pill role-pill">ROLE-SCOPED SESSION</span>
          {allowedScreens.has('ADM-HELP') && <button className="icon" aria-label="Open help" onClick={() => go('ADM-HELP')}>?</button>}
        </header>

        <main className="content">
          <ErpSessionContext.Provider value={session}>
            {CurrentPage ? <CurrentPage /> : (
              <section className="panel empty-state">No ERP screens are assigned to this role in the selected context.</section>
            )}
          </ErpSessionContext.Provider>
        </main>
      </section>
    </div>
  );
}

function initials(name: string): string {
  return name.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
}

function roleLabel(role: string): string {
  return role.toLowerCase().split('_').map((word) => word[0].toUpperCase() + word.slice(1)).join(' ');
}
