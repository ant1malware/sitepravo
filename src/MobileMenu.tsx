import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NAV } from './Sidebar';
import { Search, X, Star, Settings, Lock } from 'lucide-react';
import { useForumSessionWatcher } from './forumSession';

export default function MobileMenu() {
  const [open, setOpen] = React.useState(false);
  const loc = useLocation();
  const forumSession = useForumSessionWatcher();
  const forumLocked = !forumSession;

  // Expose global opener for header button
  React.useEffect(() => {
    (window as any).openMobileMenu = () => setOpen(true);
    return () => { try { delete (window as any).openMobileMenu; } catch {} };
  }, []);

  // Lock body scroll when open
  React.useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  const isHashRouter = React.useMemo(
    () => typeof window !== 'undefined' && window.location.hash.startsWith('#/'),
    []
  );
  const buildTo = (id: string) => {
    const params = new URLSearchParams(loc.search || '');
    params.set('tab', id);
    const search = `?${params.toString()}`;
    if (isHashRouter) return { pathname: '/', search };
    return { pathname: '/', search, hash: `#${id}` };
  };

  function openSearch() {
    const api = (window as any).openCommandPalette;
    if (typeof api === 'function') { try { api(); } catch {} }
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] lg:hidden">
      <div className="absolute inset-0 bg-black/55" onClick={() => setOpen(false)} aria-hidden />
      <div className="mobile-menu-panel absolute inset-0 flex flex-col bg-[color:var(--surface)]/98 backdrop-blur pt-[var(--safe-top)] pb-[var(--safe-bot)] text-zinc-900 dark:text-zinc-100">
        <header className="flex items-center justify-between gap-2 px-4 py-3 border-b border-zinc-200/80 dark:border-zinc-800/80">
          <button className="btn btn-secondary" onClick={openSearch} aria-label="РџРѕРёСЃРє">
            <Search className="h-4 w-4" /> <span>РџРѕРёСЃРє</span>
          </button>
          <div className="text-sm font-medium text-zinc-600 dark:text-zinc-300">РњРµРЅСЋ</div>
          <button className="btn btn-secondary" onClick={() => setOpen(false)} aria-label="Р—Р°РєСЂС‹С‚СЊ"><X className="h-4 w-4" /></button>
        </header>
        <nav className="flex-1 overflow-y-auto px-2 py-2">
          <ul className="grid gap-2">
            {NAV.map((n) => {
              const to = n.type === 'route' ? n.to : buildTo(n.id);
              return (
                <li key={n.key}>
                  <Link
                    to={to}
                    className="flex items-center gap-3 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white/95 dark:bg-zinc-900/90 px-3 py-3 text-base text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100/70 dark:hover:bg-zinc-800/70 transition active:scale-[0.99]"
                    onClick={() => setOpen(false)}
                  >
                    {n.icon}
                    <span className="truncate">{n.label}</span>
                    {n.key === 'forum' && forumLocked && (
                      <Lock className="h-4 w-4 text-amber-400" aria-hidden />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Link to="/favorites" className="btn btn-secondary"><Star className="h-4 w-4" /> РР·Р±СЂР°РЅРЅРѕРµ</Link>
            <Link to="/settings" className="btn btn-secondary"><Settings className="h-4 w-4" /> РќР°СЃС‚СЂРѕР№РєРё</Link>
          </div>
        </nav>
      </div>
    </div>
  );
}
