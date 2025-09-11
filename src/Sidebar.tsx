import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  BookOpen,
  Users,
  LayoutList,
  ClipboardList,
  FileText,
  MessageSquare,
  Shield,
  ListChecks,
} from 'lucide-react';

type NavItem = { label: string; icon: React.ReactNode; id: string };

const NAV: NavItem[] = [
  { label: 'Роли',           icon: <Users className="h-4 w-4" />,        id: 'roles' },
  { label: 'Шаблоны',        icon: <FileText className="h-4 w-4" />,      id: 'templates' },
  { label: 'Посты',          icon: <LayoutList className="h-4 w-4" />,    id: 'posts' },
  { label: 'Процедуры',      icon: <ClipboardList className="h-4 w-4" />, id: 'procedures' },
  { label: 'Взаимодействия', icon: <MessageSquare className="h-4 w-4" />, id: 'interactions' },
  { label: 'Проверки',       icon: <ListChecks className="h-4 w-4" />,    id: 'checks' },      // новая вкладка
  { label: 'Лекции',         icon: <BookOpen className="h-4 w-4" />,      id: 'lectures' },
  { label: 'ВУ',             icon: <Shield className="h-4 w-4" />,        id: 'vu' },
  { label: 'Законы',         icon: <BookOpen className="h-4 w-4" />,      id: 'laws' },
];

export default function Sidebar() {
  const [open, setOpen] = React.useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
  );
  const loc = useLocation();

  // Определяем режим роутера (HashRouter или BrowserRouter)
  const isHashRouter = React.useMemo(
    () => typeof window !== 'undefined' && window.location.hash.startsWith('#/'),
    []
  );

  // Текущая вкладка: сначала ?tab=..., если нет — берём #anchor для обратной совместимости
  const currentTab = React.useMemo(() => {
    const params = new URLSearchParams(loc.search || '');
    const fromQuery = (params.get('tab') || '').toLowerCase();
    const fromHash = (loc.hash || '').replace(/^#/, '').toLowerCase();
    return fromQuery || fromHash || '';
  }, [loc.search, loc.hash]);

  const isActive = (id: string) => currentTab === id;

  React.useEffect(() => {
  const isNarrow = typeof window !== 'undefined' && window.innerWidth < 1024;
  if (isNarrow && open) {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }
}, [open]);

  React.useEffect(() => {
    function onResize() { if (typeof window !== 'undefined') setOpen(window.innerWidth >= 1024); }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  React.useEffect(() => {
    const root = document.documentElement;
    if (open) root.classList.add('has-sidebar'); else root.classList.remove('has-sidebar');
  }, [open]);

  const isMac = React.useMemo(
    () => (typeof navigator !== 'undefined' ? /Mac|iPhone|iPad|iPod/i.test(navigator.platform) : false),
    []
  );
  const shortcutLabel = isMac ? '⌘ K' : 'Ctrl K';

  const kbdClass =
    'inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-medium shadow-sm ' +
    'border-zinc-300 bg-white/90 text-zinc-800 ' +
    'dark:border-zinc-700 dark:bg-zinc-800/90 dark:text-zinc-100 dark:shadow-none';

  // Собираем `to` так, чтобы не ломать HashRouter:
  // - Всегда используем search-парам ?tab=ID
  // - Hash добавляем ТОЛЬКО когда не HashRouter (для старых ссылок/скролла по якорю)
  const buildTo = (id: string) => {
    const search = `?tab=${encodeURIComponent(id)}`;
    if (isHashRouter) return { pathname: '/', search };
    return { pathname: '/', search, hash: `#${id}` };
  };

  return (
    <>
      <button
        className="fixed left-3 top-3 z-50 rounded-lg border border-zinc-300 bg-white/90 px-2 py-1 text-xs shadow-sm backdrop-blur hover:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900/80 lg:hidden"
        onClick={() => setOpen(v => !v)}
        aria-label="Открыть меню"
        aria-expanded={open}
        aria-controls="app-sidebar"
      >
        Меню
      </button>
    {/* overlay под мобильное меню */}
    {open && (
      <div
        className="fixed inset-0 z-30 bg-black/40 lg:hidden"
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
    )}
      <aside
        id="app-sidebar"
        aria-label="Навигация"
        className={`app-sidebar fixed inset-y-0 left-0 z-40 w-[240px] transform border-r border-zinc-200
              bg-white/85 backdrop-blur text-sm shadow-sm transition-transform duration-200 ease-out
              dark:border-zinc-800 dark:bg-zinc-900/80
              ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        
      >
        {/* Шапка: только "Главная", без правой подписи */}
        <div className="mb-3 flex items-center justify-start">
          <Link
            to="/"
            className="rounded font-semibold no-underline focus:outline-none focus:ring-2 focus:ring-zinc-400
                       text-zinc-900 hover:underline hover:text-zinc-900
                       dark:text-zinc-100 dark:hover:text-white"
            aria-label="Главная"
          >
            Главная
          </Link>
        </div>

        <nav role="navigation" className="grid max-h[calc(100vh-140px)] gap-1 overflow-y-auto pr-1">
          <ul className="flex flex-col gap-1">
            {NAV.map((n) => {
              const active = isActive(n.id);
              return (
                <li key={n.id}>
                  <Link
                    to={buildTo(n.id)}
                    className={[
                      'flex items-center gap-2 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-zinc-400',
                      'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800',
                      active ? 'bg-zinc-100 dark:bg-zinc-800' : '',
                    ].join(' ')}
                    aria-current={active ? 'page' : undefined}
                    aria-label={n.label}
                    onClick={() => {
                      if (typeof window !== 'undefined' && window.innerWidth < 1024) setOpen(false);
                    }}
                  >
                    {n.icon}
                    <span className="truncate">{n.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-4 rounded-xl border border-zinc-200 bg-white/70 p-2 text-xs text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-300">
          Подсказка: нажмите <kbd className={kbdClass}>{shortcutLabel}</kbd> для быстрого поиска
        </div>
      </aside>
    </>
  );
}
