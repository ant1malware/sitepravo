import React from 'react';
import { Bell } from 'lucide-react';
import LiquidGlass from './components/LiquidGlass';

type Notif = {
  id: string;
  title?: string;
  text: string;
  date?: string; // ISO
  url?: string;
};

const FEED_URL: string =
  // поддержка обоих вариантов доступа к env
  ((import.meta as any).env?.VITE_NOTIF_URL as string) ??
  (import.meta as any).env?.VITE_NOTIF_URL ??
  '/api/notifications';

const SEEN_KEY = 'notif:lastSeen';
const PANEL_ID = 'notifications-panel';

export default function NotificationsBell() {
  const [open, setOpen] = React.useState(false);
  const [items, setItems] = React.useState<Notif[]>([]);
  const [unread, setUnread] = React.useState<number>(0);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const rootRef = React.useRef<HTMLDivElement | null>(null);

  const load = React.useCallback(async () => {
    const ctrl = new AbortController();
    setLoading(true);
    setError(null);
    try {
      const r = await fetch(FEED_URL, { cache: 'no-store', signal: ctrl.signal });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data = (await r.json()) as { items?: Notif[] } | Notif[];
      const list: Notif[] = Array.isArray(data) ? data : data.items || [];

      // сортировка по дате (пустые — в конец)
      const ts = (d?: string) => (d ? new Date(d).getTime() : 0);
      list.sort((a, b) => ts(b.date) - ts(a.date));

      setItems(list);

      // расчёт непрочитанных
      const lastSeen = (typeof localStorage !== 'undefined' && localStorage.getItem(SEEN_KEY)) || '';
      const idx = lastSeen ? list.findIndex((x) => x.id === lastSeen) : -1;
      const count = idx === -1 ? list.length : idx;
      setUnread(Math.max(0, count));
    } catch (e: any) {
      if (e?.name !== 'AbortError') {
        console.error('[Notifications] load error:', e);
        setError('Не удалось загрузить уведомления');
      }
    } finally {
      setLoading(false);
    }
    return () => ctrl.abort();
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  // помечаем как прочитанные при открытии
  React.useEffect(() => {
    if (open && items.length) {
      try {
        localStorage.setItem(SEEN_KEY, items[0].id);
        setUnread(0);
      } catch {}
    }
  }, [open, items]);

  // закрытие по клику вне и по ESC
  React.useEffect(() => {
    if (!open) return;

    const onDocClick = (e: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const toggleOpen = () => setOpen((o) => !o);

  const formatDate = (iso?: string) =>
    iso ? new Date(iso).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' }) : '';

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        className="btn btn-secondary relative"
        onClick={toggleOpen}
        aria-label="Уведомления"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={PANEL_ID}
      >
        <Bell className="h-4 w-4" />
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-semibold text-white">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <LiquidGlass
          id={PANEL_ID}
          className="absolute right-0 mt-2 w-80 p-2 text-sm z-[80]"
          blur={22}
          tint="16 18 36"
          opacity={0.22}
          gloss={0.7}
          elevation={1.1}
          interactive={false}
          animate
          role="dialog"
          aria-label="Список уведомлений"
        >
          <div className="mb-1 px-1 text-xs text-zinc-500">Уведомления</div>

          {loading ? (
            <div className="px-2 py-3 text-xs text-zinc-500">Загрузка…</div>
          ) : error ? (
            <div className="px-2 py-3 text-xs text-red-500">{error}</div>
          ) : !items.length ? (
            <div className="px-2 py-3 text-xs text-zinc-500">Пока нет уведомлений</div>
          ) : (
            <ul className="max-h-80 space-y-1 overflow-y-auto">
              {items.map((n) => (
                <li
                  key={n.id}
                  className="rounded-lg px-2 py-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                >
                  <a
                    className="block focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-md"
                    href={n.url || '#'}
                    target={n.url ? '_blank' : undefined}
                    rel={n.url ? 'noreferrer' : undefined}
                    onClick={() => {
                      // если пользователь кликнул по ссылке — считаем просмотренным
                      try {
                        if (items[0]?.id) localStorage.setItem(SEEN_KEY, items[0].id);
                        setUnread(0);
                      } catch {}
                    }}
                  >
                    {n.title && (
                      <div className="font-semibold leading-snug text-zinc-900 dark:text-zinc-100">
                        {n.title}
                      </div>
                    )}
                    <div className="mt-1 whitespace-pre-line text-[13px] leading-relaxed text-zinc-700 dark:text-zinc-300">
                      {n.text}
                    </div>
                    {n.date && (
                      <div className="mt-1 text-[10px] text-zinc-500">{formatDate(n.date)}</div>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </LiquidGlass>
      )}
    </div>
  );
}
