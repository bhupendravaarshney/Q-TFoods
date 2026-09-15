import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { screenRegistry } from '../data/screenRegistry';
import type { ErpSession } from '../types/session';
import { ErpSessionContext } from './ErpSessionContext';
import { pageMap } from './pageMap';
import { AccountSecurityPanel } from '../components/AccountSecurityPanel';
import { useKeyboardScrollableRegions } from './useKeyboardScrollableRegions';

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
  const [securityOpen, setSecurityOpen] = useState(false);
  const [compactNavigation, setCompactNavigation] = useState(() => window.matchMedia('(max-width: 820px)').matches);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const sidebarSearchRef = useRef<HTMLInputElement>(null);
  const securityButtonRef = useRef<HTMLButtonElement>(null);
  const mainContentRef = useRef<HTMLElement>(null);

  useKeyboardScrollableRegions(mainContentRef);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
    window.requestAnimationFrame(() => menuButtonRef.current?.focus());
  }, []);

  const closeSecurity = useCallback(() => {
    setSecurityOpen(false);
    window.requestAnimationFrame(() => securityButtonRef.current?.focus());
  }, []);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 820px)');
    const update = (matches: boolean) => {
      setCompactNavigation(matches);
      if (!matches) setSidebarOpen(false);
    };
    const handleChange = (event: MediaQueryListEvent) => update(event.matches);

    update(media.matches);
    media.addEventListener('change', handleChange);
    return () => media.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (!compactNavigation || !sidebarOpen) return;

    const frame = window.requestAnimationFrame(() => sidebarSearchRef.current?.focus());
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      closeSidebar();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeSidebar, compactNavigation, sidebarOpen]);

  useEffect(() => {
    const syncHash = () => {
      const route = window.location.hash.replace(/^#/, '');
      const requested = route.split('?', 1)[0];
      const permitted = Boolean(requested && requested in pageMap && allowedScreens.has(requested));
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
      <a
        className="skip-link"
        href="#erp-main-content"
        onClick={(event) => {
          event.preventDefault();
          mainContentRef.current?.focus();
        }}
      >
        Skip to main content
      </a>
      <aside
        id="erp-sidebar"
        className={`sidebar ${sidebarOpen ? 'open' : ''}`}
        aria-hidden={compactNavigation && !sidebarOpen ? true : undefined}
        inert={compactNavigation && !sidebarOpen ? true : undefined}
      >
        <div className="side-brand">
          <span className="brand-mark">Q&T</span>
          <div><b>Q & T FOODS LTD</b><small>ERP + CRM</small></div>
        </div>
        <div className="side-search">
          <input ref={sidebarSearchRef} value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search my modules" aria-label="Search authorised modules" />
        </div>
        <nav aria-label="Authorised ERP modules">
          {areaOrder.map((area) => {
            const items = filtered.filter((screen) => screen.area === area);
            if (!items.length) return null;
            return (
              <section key={area} className="nav-group">
                <h4>{area}</h4>
                {items.map((item) => (
                  <button key={item.code} className={item.code === current?.code ? 'active' : ''} aria-current={item.code === current?.code ? 'page' : undefined} onClick={() => go(item.code)}>
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

      {sidebarOpen && <button className="sidebar-scrim" type="button" aria-label="Close navigation" onClick={() => closeSidebar()} />}

      <section className="main">
        <header className="topbar">
          <button
            ref={menuButtonRef}
            className="icon mobile-menu"
            type="button"
            aria-label="Toggle navigation"
            aria-controls="erp-sidebar"
            aria-expanded={sidebarOpen}
            onClick={() => sidebarOpen ? closeSidebar() : setSidebarOpen(true)}
          >☰</button>
          <button className="context-button" type="button" onClick={onChooseContext}>
            <i></i>
            <span><b>{context?.company_name}</b><small>{context?.plant_name ?? 'All plants'} · {primaryRole}</small></span>
            ⌄
          </button>
          <div className="spacer"></div>
          <span className="prototype-pill role-pill">ROLE-SCOPED SESSION</span>
          <button ref={securityButtonRef} className="security-button" type="button" aria-label="Account security" aria-haspopup="dialog" aria-controls="account-security-dialog" aria-expanded={securityOpen} onClick={() => setSecurityOpen(true)}><span>Security</span><b>{session.security?.mfa_enabled ? 'MFA ON' : 'MFA OFF'}</b></button>
          {allowedScreens.has('ADM-HELP') && <button className="icon" aria-label="Open help" onClick={() => go('ADM-HELP')}>?</button>}
        </header>

        <main ref={mainContentRef} id="erp-main-content" className="content" tabIndex={-1}>
          <ErpSessionContext.Provider value={session}>
            {CurrentPage ? <CurrentPage /> : (
              <section className="panel empty-state">No ERP screens are assigned to this role in the selected context.</section>
            )}
          </ErpSessionContext.Provider>
        </main>
      </section>
      {securityOpen && <AccountSecurityPanel session={session} onClose={closeSecurity} />}
    </div>
  );
}

function initials(name: string): string {
  return name.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
}

function roleLabel(role: string): string {
  return role.toLowerCase().split('_').map((word) => word[0].toUpperCase() + word.slice(1)).join(' ');
}
