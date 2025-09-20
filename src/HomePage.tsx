import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Crown, LogOut, MessageSquare, Pin, Settings, Shield, Users } from 'lucide-react';
import SimpleChat from './components/SimpleChat';

type Announcement = {
  id: string;
  title: string;
  body: string;
  author: string;
  timestamp: string;
  pinned?: boolean;
};

type ForumSettings = {
  bannerTitle: string;
  bannerSubtitle: string;
  announcements: Announcement[];
};

type ForumBoard = {
  id: string;
  title: string;
  description: string;
  topics: number;
  posts: number;
  href: string;
  pinned?: boolean;
  last: {
    subject: string;
    author: string;
    time: string;
  };
};

type ForumGroup = {
  id: string;
  title: string;
  description: string;
  boards: ForumBoard[];
};

type StatTile = {
  label: string;
  value: string;
  hint: string;
};

type OnlineEntry = {
  name: string;
  role: string;
  online: boolean;
  color: string;
};

type QuickResource = {
  label: string;
  description: string;
  to: string;
};

const STORAGE_KEY = 'forum:home-settings';

const NAV_LINKS = [
  { label: 'Главная', to: '/' },
  { label: 'Новости', to: '/news' },
  { label: 'Правила', to: '/rules' },
  { label: 'FAQ', to: '/faq' },
];

const DEFAULT_SETTINGS: ForumSettings = {
  bannerTitle: 'SKY Control Forum',
  bannerSubtitle:
    'Все приказы, отчёты и служебные заметки собраны в одном месте. Следите за каналом объявлений и фиксируйте важные события в чат.',
  announcements: [
    {
      id: 'ann-1',
      title: 'Скрипт уведомлений завершён',
      body: 'До конца смены команда тестирует авторассылку. Если заметите дубли — отпишитесь здесь или в служебную ветку.',
      author: 'Admin',
      timestamp: 'Сегодня, 19:10',
      pinned: true,
    },
    {
      id: 'ann-2',
      title: 'Обновлены правила допуска',
      body: 'В разделе «Правила» добавлены свежие поправки по доступам. Ознакомьтесь, прежде чем подтверждать заявки.',
      author: 'Mod Alpha',
      timestamp: 'Сегодня, 17:55',
      pinned: false,
    },
    {
      id: 'ann-3',
      title: 'Сбор обратной связи',
      body: 'До пятницы собираем идеи по улучшению панели администратора. Пишите коротко и по делу.',
      author: 'Admin',
      timestamp: 'Сегодня, 16:40',
      pinned: false,
    },
  ],
};

const FORUM_GROUPS: ForumGroup[] = [
  {
    id: 'general',
    title: 'General',
    description: 'Оперативные дискуссии и системные объявления.',
    boards: [
      {
        id: 'announcements',
        title: 'Announcements & Alerts',
        description: 'Официальные приказы, обновления, а также критические уведомления.',
        topics: 26,
        posts: 192,
        href: '/news',
        pinned: true,
        last: {
          subject: 'Чеклист на ночную смену',
          author: 'Admin',
          time: 'Сегодня, 19:24',
        },
      },
      {
        id: 'briefings',
        title: 'Briefing Room',
        description: 'Краткие планы на смену, дежурства и отчётность по задачам.',
        topics: 18,
        posts: 143,
        href: '/briefings',
        pinned: false,
        last: {
          subject: 'Отчёт по постам 3-5',
          author: 'Куратор N13',
          time: 'Сегодня, 18:41',
        },
      },
      {
        id: 'incidents',
        title: 'Incident Desk',
        description: 'Фиксация нештатных ситуаций и их отработка. Фото/видео приветствуются.',
        topics: 42,
        posts: 387,
        href: '/incidents',
        pinned: false,
        last: {
          subject: 'Фикс по выезду 24/08',
          author: 'Stark',
          time: 'Сегодня, 18:05',
        },
      },
    ],
  },
  {
    id: 'knowledge',
    title: 'Knowledge Base',
    description: 'Справочники, инструкции и шаблоны документов.',
    boards: [
      {
        id: 'playbook',
        title: 'Playbook & SOP',
        description: 'Стандарты действий для ключевых ролей и ситуаций.',
        topics: 35,
        posts: 278,
        href: '/guides',
        pinned: false,
        last: {
          subject: 'v3.2 Обновление',
          author: 'Doc-Beta',
          time: 'Сегодня, 15:32',
        },
      },
      {
        id: 'law',
        title: 'Legal & Compliance',
        description: 'Юридическая база, шаблоны протоколов и ссылки на нормативку.',
        topics: 22,
        posts: 154,
        href: '/laws',
        pinned: false,
        last: {
          subject: 'Новый формат рапортов',
          author: 'Mod Vega',
          time: 'Вчера, 23:18',
        },
      },
      {
        id: 'archive',
        title: 'Archive & Logs',
        description: 'История изменений, списки отработанных кейсов и архив отчётов.',
        topics: 64,
        posts: 698,
        href: '/archive',
        pinned: false,
        last: {
          subject: 'Релиз telemetry-42',
          author: 'Archivist',
          time: 'Вчера, 21:04',
        },
      },
    ],
  },
  {
    id: 'community',
    title: 'Community',
    description: 'Общение, внеплановые темы и поддержка.',
    boards: [
      {
        id: 'lounge',
        title: 'Respite Lounge',
        description: 'Беседы вне служебной темы, планы на вечер и небольшие голосования.',
        topics: 58,
        posts: 612,
        href: '/lounge',
        pinned: false,
        last: {
          subject: 'Плейлист недели',
          author: 'Pulse',
          time: 'Сегодня, 14:27',
        },
      },
      {
        id: 'helpdesk',
        title: 'Helpdesk & Support',
        description: 'Решение технических проблем, заявки на доступ и помощь с аккаунтами.',
        topics: 31,
        posts: 203,
        href: '/support',
        pinned: false,
        last: {
          subject: 'Смена токена DO',
          author: 'Admin',
          time: 'Сегодня, 13:50',
        },
      },
      {
        id: 'feedback',
        title: 'Feedback Vault',
        description: 'Предложения по улучшению портала, голосования и обратная связь.',
        topics: 44,
        posts: 256,
        href: '/feedback',
        pinned: false,
        last: {
          subject: 'UI для формы заявок',
          author: 'NeonFox',
          time: 'Сегодня, 12:10',
        },
      },
    ],
  },
];

const STAT_BLOCKS: StatTile[] = [
  { label: 'Темы', value: '268', hint: 'активные обсуждения' },
  { label: 'Сообщений', value: '2 764', hint: 'за последние 30 дней' },
  { label: 'Ротации', value: '12', hint: 'ежедневных брифингов' },
  { label: 'Документов', value: '86', hint: 'актуальных файлов' },
];

const ONLINE_NOW: OnlineEntry[] = [
  { name: 'Admin', role: 'root', online: true, color: 'var(--accent)' },
  { name: 'Mod Alpha', role: 'moderator', online: true, color: '#7dd3fc' },
  { name: 'Doc-Beta', role: 'documentation', online: true, color: '#a78bfa' },
  { name: 'Pulse', role: 'observer', online: false, color: '#f97316' },
];

const RESOURCES: QuickResource[] = [
  { label: 'Панель задач', description: 'Отслеживайте выполнение дежурств и приоритетов по ролям.', to: '/tasks' },
  { label: 'Журнал инцидентов', description: 'Ведите единый лог происшествий и действий команды.', to: '/incidents' },
  { label: 'Справка по API', description: 'Документация по интеграции и автоматизации процессов.', to: '/api' },
];

function sanitizeAnnouncements(raw: any, current: Announcement[]): Announcement[] {
  if (!Array.isArray(raw) || raw.length === 0) return current;
  return raw
    .map((item: any, index: number) => {
      const fallback = current[index] || DEFAULT_SETTINGS.announcements[index] || DEFAULT_SETTINGS.announcements[0];
      const id = typeof item?.id === 'string' && item.id.trim() ? item.id.trim() : `ann-${index}-${Date.now()}`;
      const title = typeof item?.title === 'string' && item.title.trim() ? item.title.trim() : fallback.title;
      const body = typeof item?.body === 'string' && item.body.trim() ? item.body.trim() : fallback.body;
      const author = typeof item?.author === 'string' && item.author.trim() ? item.author.trim() : fallback.author;
      const timestamp = typeof item?.timestamp === 'string' && item.timestamp.trim() ? item.timestamp.trim() : fallback.timestamp;
      const pinned = Boolean(item?.pinned);
      return { id, title, body, author, timestamp, pinned } satisfies Announcement;
    })
    .filter((item: Announcement) => item.title.trim().length > 0);
}

export default function HomePage() {
  const [settings, setSettings] = React.useState<ForumSettings>(DEFAULT_SETTINGS);
  const [adminMode, setAdminMode] = React.useState(false);
  const [panelOpen, setPanelOpen] = React.useState(false);

  React.useEffect(() => {
    document.title = 'SKY // Control Forum';
  }, []);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') return;
      setSettings((prev) => ({
        bannerTitle: typeof parsed.bannerTitle === 'string' && parsed.bannerTitle.trim()
          ? parsed.bannerTitle.trim()
          : prev.bannerTitle,
        bannerSubtitle: typeof parsed.bannerSubtitle === 'string' && parsed.bannerSubtitle.trim()
          ? parsed.bannerSubtitle.trim()
          : prev.bannerSubtitle,
        announcements: sanitizeAnnouncements(parsed.announcements, prev.announcements),
      }));
    } catch {}
  }, []);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {}
  }, [settings]);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    setAdminMode(Boolean((window as any).__simplechatAdminState));
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<{ isAdmin?: boolean }>).detail;
      if (detail && typeof detail.isAdmin === 'boolean') {
        setAdminMode(detail.isAdmin);
      }
    };
    window.addEventListener('simplechat:admin-state', handler as EventListener);
    return () => {
      window.removeEventListener('simplechat:admin-state', handler as EventListener);
    };
  }, []);

  React.useEffect(() => {
    if (!adminMode) setPanelOpen(false);
  }, [adminMode]);

  const sortedAnnouncements = React.useMemo(() => {
    return [...settings.announcements].sort((a, b) => Number(b.pinned) - Number(a.pinned));
  }, [settings.announcements]);

  const updateAnnouncement = React.useCallback((id: string, patch: Partial<Announcement>) => {
    setSettings((prev) => ({
      ...prev,
      announcements: prev.announcements.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    }));
  }, []);

  const moveAnnouncement = React.useCallback((id: string, dir: -1 | 1) => {
    setSettings((prev) => {
      const index = prev.announcements.findIndex((item) => item.id === id);
      if (index === -1) return prev;
      const target = index + dir;
      if (target < 0 || target >= prev.announcements.length) return prev;
      const next = [...prev.announcements];
      const [entry] = next.splice(index, 1);
      next.splice(target, 0, entry);
      return { ...prev, announcements: next };
    });
  }, []);

  const addAnnouncement = React.useCallback(() => {
    const now = new Date();
    const newAnnouncement: Announcement = {
      id: `ann-${now.getTime()}`,
      title: 'Новый апдейт',
      body: 'Опишите изменения, чтобы команда знала, что делать.',
      author: 'Admin',
      timestamp: now.toLocaleString('ru-RU', { hour12: false }),
      pinned: true,
    };
    setSettings((prev) => ({ ...prev, announcements: [newAnnouncement, ...prev.announcements] }));
  }, []);

  const removeAnnouncement = React.useCallback((id: string) => {
    setSettings((prev) => ({
      ...prev,
      announcements: prev.announcements.filter((item) => item.id !== id),
    }));
  }, []);

  return (
    <main className="min-h-screen pb-16" style={{ background: 'var(--bg-1)', color: 'var(--text-1)' }}>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8">
        <header className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[color:var(--border)] px-6 py-4" style={{ background: 'var(--bg-2)' }}>
            <div className="flex items-center gap-3 text-sm uppercase tracking-[0.4em]" style={{ color: 'var(--accent)' }}>
              <Shield className="h-5 w-5" aria-hidden />
              <span>SKY // CONTROL</span>
            </div>
            <nav className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.22em]" style={{ color: 'var(--text-2)' }}>
              {NAV_LINKS.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  className="rounded-md border border-transparent px-3 py-1 transition-colors duration-150 hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.22em]" style={{ color: 'var(--text-2)' }}>
              <div className="flex items-center gap-2 rounded-full border border-[color:var(--border)] px-3 py-1.5" style={{ background: 'var(--surface)' }}>
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]" aria-hidden />
                <span>Online</span>
              </div>
              {adminMode && (
                <button
                  type="button"
                  onClick={() => setPanelOpen(true)}
                  className="flex items-center gap-1 rounded-md border border-[color:var(--accent)] px-3 py-1 text-[color:var(--accent)] transition hover:bg-[color:var(--accent)]/10"
                >
                  <Crown className="h-4 w-4" aria-hidden />
                  Панель
                </button>
              )}
              <button
                type="button"
                className="flex items-center gap-1 rounded-md border border-[color:var(--border)] px-3 py-1 transition hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
              >
                <LogOut className="h-4 w-4" aria-hidden />
                Выход
              </button>
            </div>
          </div>
          <div className="grid gap-6 px-6 py-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <div className="space-y-4">
              <h1 className="text-3xl font-semibold tracking-tight">{settings.bannerTitle}</h1>
              <p className="max-w-3xl text-sm leading-relaxed" style={{ color: 'var(--text-2)' }}>
                {settings.bannerSubtitle}
              </p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {STAT_BLOCKS.map((tile) => (
                  <div
                    key={tile.label}
                    className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 shadow-sm"
                  >
                    <div className="text-xs uppercase tracking-[0.2em]" style={{ color: 'var(--text-2)' }}>
                      {tile.label}
                    </div>
                    <div className="mt-2 text-2xl font-semibold">{tile.value}</div>
                    <div className="text-xs" style={{ color: 'var(--text-2)' }}>
                      {tile.hint}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-4 shadow-sm">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em]" style={{ color: 'var(--text-2)' }}>
                <span>Служебный контур</span>
                <Settings className="h-4 w-4" aria-hidden />
              </div>
              <ul className="mt-4 space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <Users className="mt-0.5 h-4 w-4 text-[color:var(--accent)]" aria-hidden />
                  <div>
                    <div className="font-semibold">Распределение смены</div>
                    <div style={{ color: 'var(--text-2)' }}>
                      Проследите, чтобы все посты были закрыты, и отметьте смены в брифинге.
                    </div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <MessageSquare className="mt-0.5 h-4 w-4 text-[color:var(--accent)]" aria-hidden />
                  <div>
                    <div className="font-semibold">Линия связи</div>
                    <div style={{ color: 'var(--text-2)' }}>
                      Ведите отчёты в чате, отмечайте ответственных через @ и отслеживайте статусы онлайн.
                    </div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Shield className="mt-0.5 h-4 w-4 text-[color:var(--accent)]" aria-hidden />
                  <div>
                    <div className="font-semibold">Контроль доступа</div>
                    <div style={{ color: 'var(--text-2)' }}>
                      Используйте форму допуска из раздела «Правила», чтобы фиксировать допуски и блокировки.
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)]">
          <div className="flex flex-col gap-6">
            <section className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] shadow-lg">
              <div className="flex items-center justify-between border-b border-[color:var(--border)] px-5 py-3" style={{ background: 'var(--bg-2)' }}>
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em]" style={{ color: 'var(--text-2)' }}>
                  <Pin className="h-4 w-4" aria-hidden />
                  <span>Announcements</span>
                </div>
                <span className="text-xs uppercase tracking-[0.2em]" style={{ color: 'var(--text-2)' }}>
                  {sortedAnnouncements.length} записи
                </span>
              </div>
              <ul className="divide-y divide-[color:var(--border)]">
                {sortedAnnouncements.map((item) => (
                  <li key={item.id} className="grid gap-3 px-5 py-4 md:grid-cols-[minmax(0,1fr)_200px]">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-semibold">{item.title}</h3>
                        {item.pinned && (
                          <span className="rounded-full border border-[color:var(--accent)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--accent)]">
                            PINNED
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm leading-relaxed" style={{ color: 'var(--text-2)' }}>
                        {item.body}
                      </p>
                    </div>
                    <div className="text-xs uppercase tracking-[0.2em]" style={{ color: 'var(--text-2)' }}>
                      <div className="font-semibold text-[color:var(--accent)]">{item.author}</div>
                      <div>{item.timestamp}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            {FORUM_GROUPS.map((group) => (
              <section key={group.id} className="overflow-hidden rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] shadow-lg">
                <div className="flex flex-col gap-1 border-b border-[color:var(--border)] px-5 py-4" style={{ background: 'var(--bg-2)' }}>
                  <div className="text-xs uppercase tracking-[0.3em]" style={{ color: 'var(--text-2)' }}>
                    {group.title}
                  </div>
                  <div className="text-sm" style={{ color: 'var(--text-2)' }}>
                    {group.description}
                  </div>
                </div>
                <div className="divide-y divide-[color:var(--border)]">
                  {group.boards.map((board) => (
                    <div key={board.id} className="grid gap-4 px-5 py-4 md:grid-cols-[minmax(0,1.4fr)_120px_160px]">
                      <div className="space-y-1">
                        <Link to={board.href} className="flex items-center gap-2 text-base font-semibold text-[color:var(--accent)] hover:underline">
                          {board.title}
                          <ChevronRight className="h-4 w-4" aria-hidden />
                        </Link>
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-2)' }}>
                          {board.description}
                        </p>
                      </div>
                      <div className="flex flex-col items-start justify-center gap-1 text-xs uppercase tracking-[0.2em]" style={{ color: 'var(--text-2)' }}>
                        <span><strong className="text-base text-[color:var(--text-1)]">{board.topics}</strong> темы</span>
                        <span><strong className="text-base text-[color:var(--text-1)]">{board.posts}</strong> сообщений</span>
                        {board.pinned && (
                          <span className="rounded-full border border-[color:var(--accent)] px-2 py-0.5 text-[10px] font-semibold text-[color:var(--accent)]">
                            HOT
                          </span>
                        )}
                      </div>
                      <div className="space-y-1 text-xs uppercase tracking-[0.18em]" style={{ color: 'var(--text-2)' }}>
                        <div className="font-semibold text-[color:var(--accent)]">{board.last.author}</div>
                        <div>{board.last.time}</div>
                        <div className="text-[color:var(--text-2)]">{board.last.subject}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <aside className="flex flex-col gap-6">
            <section className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] shadow-lg">
              <div className="border-b border-[color:var(--border)] px-4 py-3 text-xs uppercase tracking-[0.3em]" style={{ background: 'var(--bg-2)', color: 'var(--text-2)' }}>
                Live Chat
              </div>
              <div className="p-4">
                <SimpleChat className="" />
              </div>
            </section>

            <section className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] shadow-lg">
              <div className="border-b border-[color:var(--border)] px-4 py-3 text-xs uppercase tracking-[0.3em]" style={{ background: 'var(--bg-2)', color: 'var(--text-2)' }}>
                В сети
              </div>
              <ul className="divide-y divide-[color:var(--border)]">
                {ONLINE_NOW.map((entry) => (
                  <li key={entry.name} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
                    <div>
                      <div className="font-semibold" style={{ color: entry.color }}>
                        {entry.name}
                      </div>
                      <div className="text-xs uppercase tracking-[0.2em]" style={{ color: 'var(--text-2)' }}>
                        {entry.role}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em]" style={{ color: 'var(--text-2)' }}>
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${entry.online ? 'bg-emerald-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.45)]'}`}
                        aria-hidden
                      />
                      {entry.online ? 'online' : 'offline'}
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] shadow-lg">
              <div className="border-b border-[color:var(--border)] px-4 py-3 text-xs uppercase tracking-[0.3em]" style={{ background: 'var(--bg-2)', color: 'var(--text-2)' }}>
                Ресурсы
              </div>
              <ul className="divide-y divide-[color:var(--border)]">
                {RESOURCES.map((resource) => (
                  <li key={resource.label} className="px-4 py-3">
                    <Link to={resource.to} className="flex flex-col gap-1 text-sm text-[color:var(--accent)] hover:underline">
                      <span className="font-semibold">{resource.label}</span>
                      <span className="text-xs uppercase tracking-[0.18em]" style={{ color: 'var(--text-2)' }}>
                        {resource.description}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </aside>
        </div>
      </div>

      {adminMode && (
        <div className="pointer-events-none fixed inset-0 z-40 flex items-end justify-end p-6">
          {!panelOpen && (
            <button
              type="button"
              className="pointer-events-auto flex items-center gap-2 rounded-full border border-[color:var(--accent)] bg-[color:var(--surface)]/90 px-4 py-2 text-sm font-semibold text-[color:var(--accent)] shadow-lg backdrop-blur transition hover:bg-[color:var(--accent)]/15"
              onClick={() => setPanelOpen(true)}
            >
              <Crown className="h-4 w-4" aria-hidden />
              Управлять главной
            </button>
          )}
        </div>
      )}

      {adminMode && panelOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="hidden flex-1 bg-black/60 backdrop-blur-sm sm:block" onClick={() => setPanelOpen(false)} />
          <div className="h-full w-full max-w-md border-l border-[color:var(--border)] bg-[color:var(--surface)] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[color:var(--border)] px-5 py-4" style={{ background: 'var(--bg-2)' }}>
              <div className="text-xs uppercase tracking-[0.3em]" style={{ color: 'var(--text-2)' }}>
                Админ-панель
              </div>
              <button
                type="button"
                className="rounded-md border border-[color:var(--border)] px-2 py-1 text-xs uppercase tracking-[0.2em] transition hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
                onClick={() => setPanelOpen(false)}
              >
                Закрыть
              </button>
            </div>
            <div className="h-full overflow-y-auto px-5 py-6">
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-[0.2em]" style={{ color: 'var(--text-2)' }}>
                    Заголовок баннера
                  </label>
                  <input
                    value={settings.bannerTitle}
                    onChange={(event) => setSettings((prev) => ({ ...prev, bannerTitle: event.target.value }))}
                    className="w-full rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-[0.2em]" style={{ color: 'var(--text-2)' }}>
                    Подзаголовок
                  </label>
                  <textarea
                    value={settings.bannerSubtitle}
                    onChange={(event) => setSettings((prev) => ({ ...prev, bannerSubtitle: event.target.value }))}
                    rows={4}
                    className="w-full rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2 text-sm"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-xs uppercase tracking-[0.2em]" style={{ color: 'var(--text-2)' }}>
                    Объявления
                  </div>
                  <button
                    type="button"
                    className="rounded-md border border-[color:var(--accent)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--accent)] transition hover:bg-[color:var(--accent)]/15"
                    onClick={addAnnouncement}
                  >
                    Добавить
                  </button>
                </div>
                <div className="space-y-4">
                  {settings.announcements.map((item, index) => (
                    <div key={item.id} className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-4 shadow-sm">
                      <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em]" style={{ color: 'var(--text-2)' }}>
                        <span>#{index + 1}</span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            className="rounded border border-[color:var(--border)] px-2 py-0.5"
                            onClick={() => moveAnnouncement(item.id, -1)}
                            disabled={index === 0}
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            className="rounded border border-[color:var(--border)] px-2 py-0.5"
                            onClick={() => moveAnnouncement(item.id, 1)}
                            disabled={index === settings.announcements.length - 1}
                          >
                            ↓
                          </button>
                          <button
                            type="button"
                            className="rounded border border-[color:var(--border)] px-2 py-0.5 text-[color:#f87171]"
                            onClick={() => removeAnnouncement(item.id)}
                          >
                            Удалить
                          </button>
                        </div>
                      </div>
                      <div className="mt-3 space-y-2">
                        <input
                          value={item.title}
                          onChange={(event) => updateAnnouncement(item.id, { title: event.target.value })}
                          className="w-full rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2 text-sm font-semibold"
                        />
                        <textarea
                          value={item.body}
                          onChange={(event) => updateAnnouncement(item.id, { body: event.target.value })}
                          rows={3}
                          className="w-full rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2 text-sm"
                        />
                        <div className="grid gap-3 sm:grid-cols-2">
                          <input
                            value={item.author}
                            onChange={(event) => updateAnnouncement(item.id, { author: event.target.value })}
                            className="w-full rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2 text-sm"
                            placeholder="Автор"
                          />
                          <input
                            value={item.timestamp}
                            onChange={(event) => updateAnnouncement(item.id, { timestamp: event.target.value })}
                            className="w-full rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2 text-sm"
                            placeholder="Время"
                          />
                        </div>
                        <label className="flex items-center gap-2 text-xs uppercase tracking-[0.2em]" style={{ color: 'var(--text-2)' }}>
                          <input
                            type="checkbox"
                            checked={Boolean(item.pinned)}
                            onChange={(event) => updateAnnouncement(item.id, { pinned: event.target.checked })}
                          />
                          Закрепить вверху
                        </label>
                      </div>
                    </div>
                  ))}
                  {settings.announcements.length === 0 && (
                    <div className="rounded-lg border border-dashed border-[color:var(--border)] p-4 text-sm" style={{ color: 'var(--text-2)' }}>
                      Пока нет объявлений. Добавьте новое, чтобы оно появилось в списке.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
