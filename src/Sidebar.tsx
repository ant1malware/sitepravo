import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Users, LayoutList, ClipboardList, FileText, MessageSquare, Shield, ListChecks, Info, Lock } from 'lucide-react';
import { useForumSessionWatcher } from './forumSession';

type BaseNavItem = { key: string; label: string; icon: React.ReactNode };
type TabNavItem = BaseNavItem & { type: 'tab'; id: string };
type RouteNavItem = BaseNavItem & { type: 'route'; to: string };

export type NavItem = TabNavItem | RouteNavItem;

export const NAV: NavItem[] = [
  { key: 'forum',         type: 'route', label: 'Форум',         icon: <MessageSquare className="h-4 w-4" />, to: '/forum' },
  { key: 'roles',         type: 'tab',   label: 'Повышения',     icon: <Users className="h-4 w-4" />,       id: 'roles' },
  { key: 'templates',     type: 'tab',   label: 'Шаблоны',       icon: <FileText className="h-4 w-4" />,   id: 'templates' },
  { key: 'posts',         type: 'tab',   label: 'Посты',         icon: <LayoutList className="h-4 w-4" />, id: 'posts' },
  { key: 'procedures',    type: 'tab',   label: 'Процедуры',     icon: <ClipboardList className="h-4 w-4" />, id: 'procedures' },
  { key: 'interactions',  type: 'tab',   label: 'Взаимодействия', icon: <MessageSquare className="h-4 w-4" />, id: 'interactions' },
  { key: 'checks',        type: 'tab',   label: 'Проверки',      icon: <ListChecks className="h-4 w-4" />, id: 'checks' },
  { key: 'lectures',      type: 'tab',   label: 'Лекции',        icon: <BookOpen className="h-4 w-4" />,   id: 'lectures' },
  { key: 'vu',            type: 'tab',   label: 'ВУ',            icon: <Shield className="h-4 w-4" />,     id: 'vu' },
  { key: 'laws',          type: 'tab',   label: 'Законы',        icon: <BookOpen className="h-4 w-4" />,   id: 'laws' },
];

export default function Sidebar() {
  const [open, setOpen] = React.useState<boolean>(() => (typeof window !== 'undefined' ? window.innerWidth >= 1024 : true));
  const loc = useLocation();
  const forumSession = useForumSessionWatcher();
  const forumLocked = !forumSession;

  const isHashRouter = React.useMemo(() => typeof window !== 'undefined' && window.location.hash.startsWith('#/'), []);

  const currentTab = React.useMemo(() => {
    const params = new URLSearchParams(loc.search || '');
    const fromQuery = (params.get('tab') || '').toLowerCase();
    const fromHash = (loc.hash || '').replace(/^#/, '').toLowerCase();
    return fromQuery || fromHash || '';
  }, [loc.search, loc.hash]);

  const isActive = React.useCallback((id: string) => currentTab === id, [currentTab]);

  React.useEffect(() => {
    const isNarrow = typeof window !== 'undefined' && window.innerWidth < 1024;
    if (isNarrow && open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [open]);

  React.useEffect(() => {
    function onResize() {
      if (typeof window === 'undefined') return;
      setOpen(window.innerWidth >= 1024);
    }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  React.useEffect(() => {
    const root = document.documentElement;
    if (open) root.classList.add('has-sidebar'); else root.classList.remove('has-sidebar');
  }, [open]);

  const isMac = React.useMemo(() => (typeof navigator !== 'undefined' ? /Mac|iPhone|iPad|iPod/i.test(navigator.platform) : false), []);
  const shortcutLabel = isMac ? '⌘ K' : 'Ctrl K';

  const linkBaseClass = 'flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800';
  const linkActiveClass = 'bg-zinc-100 dark:bg-zinc-800';
  const hintClass = 'mt-4 rounded-xl border border-zinc-200 bg-white/70 p-2 text-xs text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-300';
  const asideClass = 'app-sidebar hidden lg:block fixed inset-y-0 left-0 z-[60] w-[240px] border-r border-zinc-200 bg-white/85 backdrop-blur text-sm shadow-sm overscroll-contain dark:border-zinc-800 dark:bg-zinc-900/80';

  const buildTo = (id: string) => {
    const search = `?tab=${encodeURIComponent(id)}`;
    if (isHashRouter) return { pathname: '/', search };
    return { pathname: '/', search, hash: `#${id}` };
  };

  const sidebarContent = (
    <>
      <div className="mb-4 flex items-center justify-start">
        <Link to="/forum" className="text-sm font-semibold tracking-tight text-[color:var(--text-1)] no-underline focus:outline-none focus:ring-2 focus:ring-[color:var(--accent-600)]/60 hover:opacity-90" aria-label="Справочник SKY">
          Справочник SKY
        </Link>
      </div>

      <nav role="navigation" className="grid max-h-[calc(100vh-160px)] gap-1 overflow-y-auto pr-1">
        <ul className="flex flex-col gap-1">
          {NAV.filter((n) => n.key !== 'interactions').map((n) => {
            const active = n.type === 'route' ? loc.pathname === n.to : isActive(n.id);
            const to = n.type === 'route' ? n.to : buildTo(n.id);
            return (
              <li key={n.key}>
                <Link
                  to={to}
                  className={[linkBaseClass, active ? linkActiveClass : ''].filter(Boolean).join(' ')}
                  aria-current={active ? 'page' : undefined}
                  aria-label={n.label}
                  onClick={() => { if (typeof window !== 'undefined' && window.innerWidth < 1024) setOpen(false); }}
                >
                  {n.icon}
                  <span className="truncate">{n.label}</span>
                  {n.key === 'forum' && forumLocked && (
                    <Lock className="h-3.5 w-3.5 text-amber-400" aria-hidden />
                  )}
                </Link>
              </li>
            );
          })}
          <li>
            <Link to="/about" className={linkBaseClass} aria-label="О нас" onClick={() => { if (typeof window !== 'undefined' && window.innerWidth < 1024) setOpen(false); }}>
              <Info className="h-4 w-4" />
              <span className="truncate">О нас</span>
            </Link>
          </li>
          {/* Чебзик отключён для всех */}
        </ul>
      </nav>

      <div className={hintClass}>
        Подсказка: нажмите <kbd className={isMac ? 'inline-block rounded border border-white/30 bg-white/10 px-1' : 'inline-block rounded border border-white/30 bg-white/10 px-1'}>{shortcutLabel}</kbd>, чтобы открыть быстрый поиск
      </div>
    </>
  );

  return (
    <>
      <button
        hidden
        className="fixed left-3 top-3 z-50 rounded-lg border border-zinc-300 bg-white/90 px-2 py-1 text-xs shadow-sm backdrop-blur hover:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900/80 lg:hidden"
        onClick={() => setOpen((v) => !v)}
        aria-label="Меню"
        aria-expanded={open}
        aria-controls="app-sidebar"
      >
        Меню
      </button>
      <aside id="app-sidebar" aria-label="Боковая панель" className={asideClass}>
        {sidebarContent}
      </aside>
    </>
  );
}
