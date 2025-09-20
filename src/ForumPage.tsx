import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  Bell,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CornerUpRight,
  Flame,
  Flag,
  HelpCircle,
  Crown,
  Lock,
  Megaphone,
  MessageSquare,
  Paperclip,
  Pin,
  Plus,
  Quote,
  Settings,
  Rocket,
  Scale,
  Search,
  Shield,
  Sparkles,
  ThumbsUp,
  Unlock,
  UserCircle,
  Users,
  BookOpen,
  ArrowRightLeft,
} from 'lucide-react';
import SimpleChat from './components/SimpleChat';
import { ForumSession, FORUM_SESSION_STORAGE_KEY, dispatchForumSessionEvent } from './forumSession';

type ForumRole = 'admin' | 'moderator' | 'vip' | 'user' | 'newbie';

type RoleMeta = {
  label: string;
  text: string;
  bg: string;
  border: string;
};

const ROLE_META: Record<ForumRole, RoleMeta> = {
  admin: {
    label: 'Admin',
    text: '#fee2e2',
    bg: 'rgba(248, 113, 113, 0.16)',
    border: 'rgba(248, 113, 113, 0.45)',
  },
  moderator: {
    label: 'Moderator',
    text: '#ede9fe',
    bg: 'rgba(168, 85, 247, 0.18)',
    border: 'rgba(168, 85, 247, 0.42)',
  },
  vip: {
    label: 'VIP',
    text: '#fef3c7',
    bg: 'rgba(250, 204, 21, 0.18)',
    border: 'rgba(250, 204, 21, 0.42)',
  },
  user: {
    label: 'User',
    text: '#e2e8f0',
    bg: 'rgba(148, 163, 184, 0.14)',
    border: 'rgba(148, 163, 184, 0.32)',
  },
  newbie: {
    label: 'Newbie',
    text: '#dbeafe',
    bg: 'rgba(56, 189, 248, 0.18)',
    border: 'rgba(56, 189, 248, 0.38)',
  },
};

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
  role: ForumRole;
  online: boolean;
  userNumber: number;
};

type QuickResource = {
  label: string;
  description: string;
  to: string;
};

type SectionTile = {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  topics: number;
  updatedAt: string;
  href: string;
};

type HotTopic = {
  id: string;
  title: string;
  author: string;
  replies: number;
  updatedAt: string;
};

type ForumAccountStats = {
  posts: number;
  likes: number;
  topics: number;
};

type ForumAccount = {
  id: string;
  username: string;
  email: string;
  salt: string;
  passwordHash: string;
  createdAt: string;
  accentFrom: string;
  accentTo: string;
  tagline: string;
  role: ForumRole;
  stats: ForumAccountStats;
};

type TopicTag = 'NEW' | 'PINNED' | 'LOCKED' | 'FREE' | 'PAID' | 'UPDATE';

type TopicMeta = {
  id: string;
  title: string;
  badges: TopicTag[];
  pinned: boolean;
  locked: boolean;
  movedTo: string | null;
  category: string;
};

type TopicPost = {
  id: string;
  author: {
    username: string;
    role: ForumRole;
    userNumber: number;
    registeredAt: string;
    posts: number;
    likes: number;
    avatarColor: string;
    isTopicAuthor?: boolean;
  };
  createdAt: string;
  editedAt?: string | null;
  content: string[];
  likes: number;
  attachments?: string[];
  deleted?: boolean;
  deletedBy?: string;
};

type TopicComposerState = {
  value: string;
  attachments: string[];
};

type PasswordRule = {
  id: string;
  label: string;
  satisfied: boolean;
};

const STORAGE_KEY = 'forum:home-settings';
const AUTH_ACCOUNTS_KEY = 'forum:auth:accounts';

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
  { name: 'Admin', role: 'admin', online: true, userNumber: 1 },
  { name: 'Mod Alpha', role: 'moderator', online: true, userNumber: 7 },
  { name: 'Doc-Beta', role: 'vip', online: true, userNumber: 12 },
  { name: 'Pulse', role: 'user', online: false, userNumber: 19 },
];

const RESOURCES: QuickResource[] = [
  { label: 'Панель задач', description: 'Отслеживайте выполнение дежурств и приоритетов по ролям.', to: '/tasks' },
  { label: 'Журнал инцидентов', description: 'Ведите единый лог происшествий и действий команды.', to: '/incidents' },
  { label: 'Справка по API', description: 'Документация по интеграции и автоматизации процессов.', to: '/api' },
];

const SECTION_TILES: SectionTile[] = [
  {
    id: 'announcements',
    title: 'Объявления',
    description: 'Главные апдейты, приказы и регламент смены.',
    icon: Megaphone,
    topics: 18,
    updatedAt: 'Сегодня 14:20',
    href: '/forum/announcements',
  },
  {
    id: 'releases',
    title: 'Релизы',
    description: 'Релизы систем, патчи и технические обновления.',
    icon: Rocket,
    topics: 12,
    updatedAt: 'Сегодня 13:05',
    href: '/forum/releases',
  },
  {
    id: 'guides',
    title: 'Гайды',
    description: 'Инструкции, чек-листы и обучающие материалы.',
    icon: BookOpen,
    topics: 27,
    updatedAt: 'Сегодня 11:48',
    href: '/forum/guides',
  },
  {
    id: 'support',
    title: 'Вопросы/Помощь',
    description: 'Решаем проблемы, отвечаем на вопросы, даём советы.',
    icon: HelpCircle,
    topics: 34,
    updatedAt: 'Сегодня 10:32',
    href: '/forum/help',
  },
  {
    id: 'rules',
    title: 'Законы/Правила',
    description: 'Полный свод правил, лимитов и требований по доступам.',
    icon: Scale,
    topics: 9,
    updatedAt: 'Сегодня 09:15',
    href: '/forum/rules',
  },
  {
    id: 'offtopic',
    title: 'Оффтоп',
    description: 'Общение вне дежурств: от мемов до плейлистов.',
    icon: Sparkles,
    topics: 41,
    updatedAt: 'Сегодня 08:27',
    href: '/forum/offtopic',
  },
];

const HOT_TOPICS: HotTopic[] = [
  { id: 'ht-1', title: 'План обновления КПП на выходные', author: 'Admin', replies: 42, updatedAt: '20 минут назад' },
  { id: 'ht-2', title: 'FAQ по новым пропускам', author: 'Mod Vega', replies: 31, updatedAt: '45 минут назад' },
  { id: 'ht-3', title: 'Заливка отчётов за неделю', author: 'Doc-Beta', replies: 24, updatedAt: '1 час назад' },
  { id: 'ht-4', title: 'Гайд по быстрому реагированию', author: 'Pulse', replies: 18, updatedAt: '1 час 30 минут назад' },
  { id: 'ht-5', title: 'Кофе-митап на пятницу', author: 'NeonFox', replies: 12, updatedAt: '2 часа назад' },
];

const TOPIC_SAMPLE_META: TopicMeta = {
  id: 'ops-142',
  title: 'Регламент доступа к новой панели мониторинга',
  badges: ['PINNED', 'UPDATE', 'FREE'],
  pinned: true,
  locked: false,
  movedTo: null,
  category: 'Объявления',
};

const INITIAL_TOPIC_POSTS: TopicPost[] = [
  {
    id: 'tp-1',
    author: {
      username: 'Admin',
      role: 'admin',
      userNumber: 1,
      registeredAt: '12.06.2024',
      posts: 482,
      likes: 1430,
      avatarColor: 'linear-gradient(135deg, rgba(248,113,113,0.9), rgba(239,68,68,0.65))',
      isTopicAuthor: true,
    },
    createdAt: 'Сегодня, 09:40',
    editedAt: 'Сегодня, 10:05',
    content: [
      'Коллеги, открыли доступ к новой панели мониторинга. Настройте роли до конца смены, иначе запросы пойдут в общий пул.',
      'По умолчанию права только на чтение. Админы и модераторы могут выдать уровни доступа через «Настройки → Права».',
      'Если заметите некорректные данные, пришлите скрин в тему — поправим в следующем хотфиксе.',
    ],
    likes: 56,
    attachments: ['monitoring-guide.pdf', 'access-matrix.xlsx'],
  },
  {
    id: 'tp-2',
    author: {
      username: 'Mod Vega',
      role: 'moderator',
      userNumber: 7,
      registeredAt: '28.07.2024',
      posts: 214,
      likes: 804,
      avatarColor: 'linear-gradient(135deg, rgba(139,92,246,0.85), rgba(192,132,252,0.6))',
    },
    createdAt: 'Сегодня, 10:18',
    content: [
      'Проверил на тестовом профиле: уведомления о превышении порога идут корректно. Новичкам достаточно прав «viewer».',
      'Тем, кто в ночную смену, заранее выдал доступ — отмечайтесь в чат, если что-то не работает.',
    ],
    likes: 23,
  },
  {
    id: 'tp-3',
    author: {
      username: 'SkyRunner',
      role: 'newbie',
      userNumber: 28,
      registeredAt: '03.09.2024',
      posts: 6,
      likes: 14,
      avatarColor: 'linear-gradient(135deg, rgba(59,130,246,0.85), rgba(45,212,191,0.55))',
    },
    createdAt: 'Сегодня, 11:02',
    content: [
      'Получил доступ, но график обновлений пустой. Это нормально для стартовой конфигурации?',
    ],
    likes: 4,
  },
];

const NEWBIE_COOLDOWN_SECONDS = 30;

const TOPIC_BADGE_LABELS: Record<TopicTag, string> = {
  NEW: 'NEW',
  PINNED: 'Закреплено',
  LOCKED: 'Закрыто',
  FREE: 'FREE',
  PAID: 'PAID',
  UPDATE: 'UPDATE',
};

function getRoleMeta(role: ForumRole): RoleMeta {
  return ROLE_META[role] ?? ROLE_META.user;
}

function RoleBadge({ role }: { role: ForumRole }) {
  const meta = getRoleMeta(role);
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.28em]"
      style={{
        background: meta.bg,
        borderColor: meta.border,
        color: meta.text,
      }}
    >
      {meta.label}
    </span>
  );
}

function hydrateAccount(raw: any, index: number): ForumAccount | null {
  if (!raw || typeof raw !== 'object') return null;
  if (typeof raw.id !== 'string' || typeof raw.username !== 'string') return null;

  const role: ForumRole = ['admin', 'moderator', 'vip', 'user', 'newbie'].includes(raw.role)
    ? raw.role
    : index === 0
      ? 'admin'
      : 'newbie';

  const stats: ForumAccountStats = {
    posts: typeof raw?.stats?.posts === 'number' ? raw.stats.posts : 0,
    likes: typeof raw?.stats?.likes === 'number' ? raw.stats.likes : 0,
    topics: typeof raw?.stats?.topics === 'number' ? raw.stats.topics : 0,
  };

  return {
    id: raw.id,
    username: raw.username,
    email: typeof raw.email === 'string' ? raw.email : '',
    salt: typeof raw.salt === 'string' ? raw.salt : '',
    passwordHash: typeof raw.passwordHash === 'string' ? raw.passwordHash : '',
    createdAt: typeof raw.createdAt === 'string' ? raw.createdAt : new Date().toISOString(),
    accentFrom: typeof raw.accentFrom === 'string' ? raw.accentFrom : '#22d3ee',
    accentTo: typeof raw.accentTo === 'string' ? raw.accentTo : '#6366f1',
    tagline: typeof raw.tagline === 'string' ? raw.tagline : '',
    role,
    stats,
  } satisfies ForumAccount;
}

function formatTopicBadge(tag: TopicTag) {
  const label = TOPIC_BADGE_LABELS[tag] ?? tag;
  const accent =
    tag === 'PINNED'
      ? '#facc15'
      : tag === 'LOCKED'
        ? '#f87171'
        : tag === 'PAID'
          ? '#fbbf24'
          : tag === 'UPDATE'
            ? '#38bdf8'
            : '#a855f7';
  return {
    label,
    accent,
  };
}

const ACCENT_PRESETS = [
  ['#22d3ee', '#6366f1'],
  ['#34d399', '#0ea5e9'],
  ['#f97316', '#f43f5e'],
  ['#a855f7', '#6366f1'],
  ['#facc15', '#f97316'],
  ['#38bdf8', '#a855f7'],
  ['#fb7185', '#f97316'],
  ['#14b8a6', '#8b5cf6'],
  ['#f472b6', '#f59e0b'],
  ['#ef4444', '#f97316'],
] as const;

const TAGLINES = [
  '«Я слежу за чистотой регламента.»',
  '«Привожу хаос в порядок.»',
  '«Мои отчёты всегда вовремя.»',
  '«Проверяю каждый доступ дважды.»',
  '«Никаких неотвеченных pingов.»',
  '«Командую сменой как дирижёр.»',
  '«Контроль — моё второе имя.»',
  '«Неоновые ночи и строгий порядок.»',
  '«Дежурство — как искусство.»',
  '«Знаю SOP наизусть.»',
] as const;

function pickAccent() {
  const palette = ACCENT_PRESETS[Math.floor(Math.random() * ACCENT_PRESETS.length)];
  const tagline = TAGLINES[Math.floor(Math.random() * TAGLINES.length)];
  return { from: palette[0], to: palette[1], tagline };
}

function toHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer))
    .map((value) => value.toString(16).padStart(2, '0'))
    .join('');
}

async function hashPassword(password: string, salt: string): Promise<string> {
  const cryptoApi = typeof globalThis !== 'undefined' ? (globalThis.crypto || (globalThis as any).msCrypto) : undefined;
  try {
    if (cryptoApi?.subtle) {
      const encoded = new TextEncoder().encode(`${password}::${salt}`);
      const digest = await cryptoApi.subtle.digest('SHA-256', encoded);
      return toHex(digest);
    }
  } catch {}
  try {
    return btoa(`${password}::${salt}`);
  } catch {
    return `${password}::${salt}`;
  }
}

function createSalt(): string {
  const cryptoApi = typeof globalThis !== 'undefined' ? (globalThis.crypto || (globalThis as any).msCrypto) : undefined;
  if (cryptoApi?.getRandomValues) {
    const bytes = new Uint8Array(16);
    cryptoApi.getRandomValues(bytes);
    return Array.from(bytes).map((value) => value.toString(16).padStart(2, '0')).join('');
  }
  return `${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`;
}

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

export default function ForumPage() {
  const [hydrated, setHydrated] = React.useState(false);
  const [accounts, setAccounts] = React.useState<ForumAccount[]>([]);
  const [session, setSession] = React.useState<ForumSession | null>(null);
  const [authMode, setAuthMode] = React.useState<'register' | 'login'>('register');
  const [authBusy, setAuthBusy] = React.useState(false);
  const [authError, setAuthError] = React.useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = React.useState<string | null>(null);
  const [registerForm, setRegisterForm] = React.useState({
    username: '',
    email: '',
    password: '',
    confirm: '',
    accept: false,
    remember: true,
    captcha: false,
  });
  const [loginForm, setLoginForm] = React.useState({
    identifier: '',
    password: '',
    remember: true,
    captcha: false,
  });
  const [settings, setSettings] = React.useState<ForumSettings>(DEFAULT_SETTINGS);
  const [adminMode, setAdminMode] = React.useState(false);
  const [panelOpen, setPanelOpen] = React.useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = React.useState(false);
  const [topicPosts, setTopicPosts] = React.useState<TopicPost[]>(INITIAL_TOPIC_POSTS);
  const [topicPinned, setTopicPinned] = React.useState(TOPIC_SAMPLE_META.pinned);
  const [topicLocked, setTopicLocked] = React.useState(TOPIC_SAMPLE_META.locked);
  const [topicMovedTo, setTopicMovedTo] = React.useState<string | null>(TOPIC_SAMPLE_META.movedTo);
  const [composer, setComposer] = React.useState<TopicComposerState>({ value: '', attachments: [] });
  const [composerError, setComposerError] = React.useState<string | null>(null);
  const [cooldown, setCooldown] = React.useState(0);
  const menuRef = React.useRef<HTMLDivElement | null>(null);

  const currentUser = React.useMemo(() => {
    if (!session) return null;
    return accounts.find((item) => item.id === session.userId) ?? null;
  }, [accounts, session]);

  const currentUserRole: ForumRole = currentUser?.role ?? 'user';
  const isModerator = currentUserRole === 'admin' || currentUserRole === 'moderator';

  const isAuthenticated = Boolean(currentUser);
  const memberSince = React.useMemo(() => {
    if (!currentUser) return '';
    try {
      return new Date(currentUser.createdAt).toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return currentUser.createdAt;
    }
  }, [currentUser]);

  const userNumber = React.useMemo(() => {
    if (!currentUser) return null;
    const index = accounts.findIndex((item) => item.id === currentUser.id);
    return index === -1 ? null : index + 1;
  }, [accounts, currentUser]);

  const topicStarter = React.useMemo(() => {
    const starter = topicPosts.find((post) => post.author.isTopicAuthor);
    return starter?.author.username ?? topicPosts[0]?.author.username ?? null;
  }, [topicPosts]);

  const activeTopicBadges = React.useMemo(() => {
    const base = new Set<TopicTag>(TOPIC_SAMPLE_META.badges);
    if (topicPinned) {
      base.add('PINNED');
    } else {
      base.delete('PINNED');
    }
    if (topicLocked) {
      base.add('LOCKED');
    } else {
      base.delete('LOCKED');
    }
    return Array.from(base);
  }, [topicPinned, topicLocked]);

  const allowAttachments = currentUserRole !== 'newbie';
  const allowLinks = currentUserRole !== 'newbie';
  const composerDisabled = !isAuthenticated || topicLocked || (currentUserRole === 'newbie' && cooldown > 0);

  const onlineCount = React.useMemo(() => {
    return ONLINE_NOW.filter((entry) => entry.online).length;
  }, []);

  const passwordRules = React.useMemo<PasswordRule[]>(() => {
    const value = registerForm.password;
    return [
      { id: 'len', label: 'Минимум 8 символов', satisfied: value.length >= 8 },
      { id: 'upper', label: 'Есть заглавная буква', satisfied: /[A-ZА-ЯЁ]/.test(value) },
      { id: 'lower', label: 'Есть строчная буква', satisfied: /[a-zа-яё]/.test(value) },
      { id: 'digit', label: 'Есть цифра', satisfied: /\d/.test(value) },
      { id: 'symbol', label: 'Есть спецсимвол', satisfied: /[^\w\s]/.test(value) },
    ];
  }, [registerForm.password]);

  const passwordStrength = React.useMemo(() => {
    const satisfied = passwordRules.filter((item) => item.satisfied).length;
    return Math.round((satisfied / passwordRules.length) * 100);
  }, [passwordRules]);

  React.useEffect(() => {
    document.title = 'SKY // Control Forum';
  }, []);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const rawAccounts = window.localStorage.getItem(AUTH_ACCOUNTS_KEY);
      if (rawAccounts) {
        const parsed = JSON.parse(rawAccounts);
        if (Array.isArray(parsed)) {
          const normalized = parsed
            .map((item, index) => hydrateAccount(item, index))
            .filter(Boolean) as ForumAccount[];
          setAccounts(normalized);
        }
      }
    } catch {}

    try {
      const storedSession =
        window.sessionStorage.getItem(FORUM_SESSION_STORAGE_KEY) ||
        window.localStorage.getItem(FORUM_SESSION_STORAGE_KEY);
      if (storedSession) {
        const parsed = JSON.parse(storedSession);
        if (parsed && typeof parsed === 'object' && typeof parsed.userId === 'string') {
          setSession({
            userId: parsed.userId,
            remember: Boolean(parsed.remember),
            lastLogin: typeof parsed.lastLogin === 'string' ? parsed.lastLogin : new Date().toISOString(),
          });
        }
      }
    } catch {}

    setHydrated(true);
  }, []);

  React.useEffect(() => {
    if (!hydrated || typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(AUTH_ACCOUNTS_KEY, JSON.stringify(accounts));
    } catch {}
  }, [accounts, hydrated]);

  React.useEffect(() => {
    if (!hydrated || typeof window === 'undefined') return;
    try {
      if (session) {
        const payload = JSON.stringify(session);
        if (session.remember) {
          window.localStorage.setItem(FORUM_SESSION_STORAGE_KEY, payload);
          window.sessionStorage.removeItem(FORUM_SESSION_STORAGE_KEY);
        } else {
          window.sessionStorage.setItem(FORUM_SESSION_STORAGE_KEY, payload);
          window.localStorage.removeItem(FORUM_SESSION_STORAGE_KEY);
        }
      } else {
        window.localStorage.removeItem(FORUM_SESSION_STORAGE_KEY);
        window.sessionStorage.removeItem(FORUM_SESSION_STORAGE_KEY);
      }
    } catch {}
  }, [session, hydrated]);

  React.useEffect(() => {
    if (!hydrated) return;
    dispatchForumSessionEvent(session);
  }, [session, hydrated]);

  React.useEffect(() => {
    if (cooldown <= 0) return;
    if (typeof window === 'undefined') return;
    const timer = window.setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => {
      window.clearInterval(timer);
    };
  }, [cooldown]);

  React.useEffect(() => {
    setAuthError(null);
    setAuthSuccess(null);
  }, [authMode]);

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

  React.useEffect(() => {
    if (!profileMenuOpen) return;
    function onPointerDown(event: PointerEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    }
    window.addEventListener('pointerdown', onPointerDown);
    return () => window.removeEventListener('pointerdown', onPointerDown);
  }, [profileMenuOpen]);

  const normalizeUsername = React.useCallback((value: string) => value.trim().replace(/\s+/g, ' '), []);

  const handleRegister = React.useCallback(async () => {
    if (authBusy) return;
    setAuthError(null);
    setAuthSuccess(null);

    const username = normalizeUsername(registerForm.username);
    if (username.length < 3) {
      setAuthError('Никнейм должен содержать минимум 3 символа.');
      return;
    }
    if (!/[\p{L}\d _-]+/u.test(username)) {
      setAuthError('Используйте только буквы, цифры, пробелы, дефис или подчёркивание.');
      return;
    }

    const email = registerForm.email.trim().toLowerCase();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setAuthError('Введите корректный адрес электронной почты.');
      return;
    }

    if (registerForm.password !== registerForm.confirm) {
      setAuthError('Пароли не совпадают.');
      return;
    }

    if (passwordRules.some((rule) => !rule.satisfied)) {
      setAuthError('Пароль слишком слабый. Выполните все условия ниже.');
      return;
    }

    if (!registerForm.accept) {
      setAuthError('Нужно принять регламент форума.');
      return;
    }

    if (!registerForm.captcha) {
      setAuthError('Подтвердите капчу, чтобы продолжить.');
      return;
    }

    const usernameTaken = accounts.some((account) => account.username.toLowerCase() === username.toLowerCase());
    if (usernameTaken) {
      setAuthError('Такой ник уже занят. Попробуйте добавить уникальный символ.');
      return;
    }

    const emailTaken = accounts.some((account) => account.email === email);
    if (emailTaken) {
      setAuthError('Почта уже используется в другой учётной записи.');
      return;
    }

    setAuthBusy(true);
    try {
      const salt = createSalt();
      const passwordHash = await hashPassword(registerForm.password, salt);
      const accent = pickAccent();
      const assignedRole: ForumRole = accounts.length === 0 ? 'admin' : 'newbie';
      const newAccount: ForumAccount = {
        id: `acc-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        username,
        email,
        salt,
        passwordHash,
        createdAt: new Date().toISOString(),
        accentFrom: accent.from,
        accentTo: accent.to,
        tagline: accent.tagline,
        role: assignedRole,
        stats: {
          posts: 0,
          likes: 0,
          topics: 0,
        },
      };
      setAccounts((prev) => [...prev, newAccount]);
      setSession({ userId: newAccount.id, remember: registerForm.remember, lastLogin: new Date().toISOString() });
      setRegisterForm((prev) => ({
        ...prev,
        username: '',
        email: '',
        password: '',
        confirm: '',
        accept: false,
        captcha: false,
      }));
      setAuthSuccess('Учётная запись создана. Добро пожаловать в форум!');
    } catch (error) {
      console.error(error);
      setAuthError('Не удалось сохранить регистрационные данные. Попробуйте ещё раз.');
    } finally {
      setAuthBusy(false);
    }
  }, [accounts, authBusy, normalizeUsername, passwordRules, registerForm]);

  const handleLogin = React.useCallback(async () => {
    if (authBusy) return;
    setAuthError(null);
    setAuthSuccess(null);

    const identifier = loginForm.identifier.trim().toLowerCase();
    if (!identifier) {
      setAuthError('Введите ник или почту.');
      return;
    }

    const target = accounts.find(
      (account) =>
        account.username.toLowerCase() === identifier || account.email === identifier,
    );

    if (!target) {
      setAuthError('Пользователь не найден.');
      return;
    }

    if (!loginForm.captcha) {
      setAuthError('Подтвердите капчу, чтобы войти.');
      return;
    }

    setAuthBusy(true);
    try {
      const passwordHash = await hashPassword(loginForm.password, target.salt);
      if (passwordHash !== target.passwordHash) {
        setAuthError('Неверный пароль.');
        return;
      }
      setSession({ userId: target.id, remember: loginForm.remember, lastLogin: new Date().toISOString() });
      setLoginForm((prev) => ({ ...prev, password: '', captcha: false }));
      setAuthSuccess(`С возвращением, ${target.username}!`);
    } catch (error) {
      console.error(error);
      setAuthError('Не удалось проверить пароль. Попробуйте ещё раз.');
    } finally {
      setAuthBusy(false);
    }
  }, [accounts, authBusy, loginForm]);

  const handleLogout = React.useCallback(() => {
    setSession(null);
    setProfileMenuOpen(false);
    setAuthSuccess('Вы вышли из форума. Возвращайтесь скорее!');
  }, []);

  const handleTogglePin = React.useCallback(() => {
    setTopicPinned((prev) => !prev);
  }, []);

  const handleToggleLock = React.useCallback(() => {
    setTopicLocked((prev) => !prev);
  }, []);

  const handleMoveTopic = React.useCallback(() => {
    setTopicMovedTo((prev) => (prev ? null : 'Архив / История'));
  }, []);

  const handleComposerChange = React.useCallback(
    (value: string) => {
      setComposer((prev) => ({ ...prev, value }));
      if (composerError) {
        setComposerError(null);
      }
    },
    [composerError],
  );

  const handleAddAttachment = React.useCallback(() => {
    if (!allowAttachments) {
      setComposerError('Новичкам нельзя прикреплять вложения. Дождитесь повышения уровня.');
      return;
    }
    if (typeof window === 'undefined') return;
    const name = window.prompt('Название файла или ссылка на ресурс');
    if (!name) return;
    setComposer((prev) => ({ ...prev, attachments: [...prev.attachments, name.trim()] }));
    setComposerError(null);
  }, [allowAttachments]);

  const handleRemoveAttachment = React.useCallback((name: string) => {
    setComposer((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((item) => item !== name),
    }));
  }, []);

  const handleMention = React.useCallback((name: string) => {
    setComposer((prev) => ({
      ...prev,
      value: prev.value ? `${prev.value}\n@${name} ` : `@${name} `,
    }));
    setComposerError(null);
  }, []);

  const handleDeletePost = React.useCallback(
    (postId: string) => {
      if (!isModerator) return;
      setTopicPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? {
                ...post,
                deleted: true,
                deletedBy: currentUser?.username ?? 'Moderator',
                content: ['Сообщение удалено модератором.'],
                attachments: [],
              }
            : post,
        ),
      );
    },
    [isModerator, currentUser?.username],
  );

  const handleComposerSubmit = React.useCallback(
    (event?: React.FormEvent) => {
      event?.preventDefault();
      if (!currentUser) {
        setComposerError('Авторизуйтесь, чтобы ответить в теме.');
        return;
      }
      if (topicLocked) {
        setComposerError('Тема закрыта для новых сообщений.');
        return;
      }
      const trimmed = composer.value.trim();
      if (!trimmed) {
        setComposerError('Напишите сообщение перед отправкой.');
        return;
      }
      if (!allowLinks && /https?:\/\//i.test(trimmed)) {
        setComposerError('Новичкам нельзя публиковать ссылки. Попросите модератора повысить уровень.');
        return;
      }
      if (currentUserRole === 'newbie' && cooldown > 0) {
        setComposerError(`Подождите ещё ${cooldown} сек. между сообщениями.`);
        return;
      }

      let registrationDate = currentUser.createdAt;
      try {
        registrationDate = new Date(currentUser.createdAt).toLocaleDateString('ru-RU');
      } catch {}

      const nextPostCount = (currentUser.stats?.posts ?? 0) + 1;
      const post: TopicPost = {
        id: `post-${Date.now()}`,
        author: {
          username: currentUser.username,
          role: currentUserRole,
          userNumber: userNumber ?? topicPosts.length + 10,
          registeredAt: registrationDate,
          posts: nextPostCount,
          likes: currentUser.stats?.likes ?? 0,
          avatarColor: `linear-gradient(135deg, ${currentUser.accentFrom}, ${currentUser.accentTo})`,
          isTopicAuthor: currentUser.username === topicStarter,
        },
        createdAt: 'Только что',
        content: trimmed.split(/\n{2,}/).map((block) => block.trim()).filter(Boolean),
        likes: 0,
        attachments: [...composer.attachments],
      };

      setTopicPosts((prev) => [...prev, post]);
      setComposer({ value: '', attachments: [] });
      setComposerError(null);

      if (currentUserRole === 'newbie') {
        setCooldown(NEWBIE_COOLDOWN_SECONDS);
      }

      setAccounts((prev) =>
        prev.map((account) =>
          account.id === currentUser.id
            ? {
                ...account,
                stats: {
                  ...account.stats,
                  posts: account.stats.posts + 1,
                },
              }
            : account,
        ),
      );
    },
    [
      allowLinks,
      composer.attachments,
      composer.value,
      cooldown,
      currentUser,
      currentUserRole,
      setAccounts,
      topicLocked,
      topicPosts.length,
      topicStarter,
      userNumber,
    ],
  );

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

  if (!hydrated) {
    return (
      <main className="min-h-screen" style={{ background: 'var(--bg-1)', color: 'var(--text-1)' }}>
        <div className="flex h-full items-center justify-center px-4 py-24 text-sm" style={{ color: 'var(--text-2)' }}>
          Загрузка форума…
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main
        className="relative min-h-screen overflow-hidden"
        style={{ background: 'var(--bg-1)', color: 'var(--text-1)' }}
      >
        <div
          className="pointer-events-none absolute inset-0 -z-20"
          style={{
            background:
              'radial-gradient(1200px 760px at 48% -18%, rgba(99,102,241,0.22), transparent 65%),' +
              'radial-gradient(900px 640px at 10% 85%, rgba(34,211,238,0.12), transparent 65%)',
          }}
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[color:var(--bg-1)]/96" aria-hidden />
        <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-16 sm:py-20">
          <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)]/95 shadow-2xl backdrop-blur">
            <div className="grid gap-10 p-6 sm:p-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
              <div className="space-y-6">
                <span
                  className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--surface)]/60 px-3 py-1 text-[11px] uppercase tracking-[0.4em]"
                  style={{ color: 'var(--text-2)' }}
                >
                  <Lock className="h-3.5 w-3.5" aria-hidden />
                  Доступ ограничен
                </span>
                <h1 className="text-2xl font-semibold leading-snug sm:text-3xl">Форум доступен только после входа</h1>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-2)' }}>
                  Авторизуйтесь, чтобы получать уведомления, сохранять закладки и скачивать материалы.
                </p>
                <ul className="grid gap-3 text-sm" style={{ color: 'var(--text-2)' }}>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]" />
                    Уведомления о новых ответах
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]" />
                    Личные закладки и подборки
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]" />
                    Загрузки и вложения без ограничений
                  </li>
                </ul>
                {authError && (
                  <div className="flex items-start gap-2 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                    <AlertCircle className="mt-0.5 h-4 w-4" aria-hidden />
                    <span>{authError}</span>
                  </div>
                )}
                {authSuccess && (
                  <div className="flex items-start gap-2 rounded-xl border border-emerald-400/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                    <CheckCircle2 className="mt-0.5 h-4 w-4" aria-hidden />
                    <span>{authSuccess}</span>
                  </div>
                )}
              </div>
              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <form
                    className="space-y-4 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)]/85 p-5 shadow"
                    onSubmit={(event) => {
                      event.preventDefault();
                      handleLogin();
                    }}
                  >
                    <div className="text-sm font-semibold">Войти</div>
                    <label className="block text-xs uppercase tracking-[0.3em]" style={{ color: 'var(--text-2)' }}>
                      Ник или e-mail
                      <input
                        className="mt-1 w-full rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2 text-sm focus:border-[color:var(--accent)] focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]/30"
                        value={loginForm.identifier}
                        onChange={(event) => setLoginForm((prev) => ({ ...prev, identifier: event.target.value }))}
                        placeholder="Shift-Lord"
                        autoComplete="username"
                      />
                    </label>
                    <label className="block text-xs uppercase tracking-[0.3em]" style={{ color: 'var(--text-2)' }}>
                      Пароль
                      <input
                        className="mt-1 w-full rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2 text-sm focus:border-[color:var(--accent)] focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]/30"
                        type="password"
                        value={loginForm.password}
                        onChange={(event) => setLoginForm((prev) => ({ ...prev, password: event.target.value }))}
                        placeholder="••••••••"
                        autoComplete="current-password"
                      />
                    </label>
                    <label className="flex items-center gap-2 text-xs uppercase tracking-[0.3em]" style={{ color: 'var(--text-2)' }}>
                      <input
                        type="checkbox"
                        checked={loginForm.remember}
                        onChange={(event) => setLoginForm((prev) => ({ ...prev, remember: event.target.checked }))}
                      />
                      Запомнить меня
                    </label>
                    <label className="flex items-center gap-2 text-xs uppercase tracking-[0.3em]" style={{ color: 'var(--text-2)' }}>
                      <input
                        type="checkbox"
                        checked={loginForm.captcha}
                        onChange={(event) => setLoginForm((prev) => ({ ...prev, captcha: event.target.checked }))}
                      />
                      Я не робот
                    </label>
                    <button
                      type="submit"
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-[color:var(--accent)] px-4 py-2 text-sm font-semibold text-white shadow transition hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]/40"
                      disabled={authBusy}
                    >
                      Войти
                    </button>
                    <button
                      type="button"
                      className="w-full text-center text-xs uppercase tracking-[0.28em] text-[color:var(--text-2)] hover:text-[color:var(--accent)]"
                      onClick={() => alert('Свяжитесь с администратором для восстановления доступа.')}
                    >
                      Забыли пароль?
                    </button>
                  </form>

                  <form
                    className="space-y-4 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)]/85 p-5 shadow"
                    onSubmit={(event) => {
                      event.preventDefault();
                      handleRegister();
                    }}
                  >
                    <div className="text-sm font-semibold">Создать аккаунт</div>
                    <label className="block text-xs uppercase tracking-[0.3em]" style={{ color: 'var(--text-2)' }}>
                      Ник
                      <input
                        className="mt-1 w-full rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2 text-sm focus:border-[color:var(--accent)] focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]/30"
                        value={registerForm.username}
                        onChange={(event) => setRegisterForm((prev) => ({ ...prev, username: event.target.value }))}
                        placeholder="Shift-Lord"
                        autoComplete="username"
                      />
                    </label>
                    <label className="block text-xs uppercase tracking-[0.3em]" style={{ color: 'var(--text-2)' }}>
                      E-mail
                      <input
                        className="mt-1 w-full rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2 text-sm focus:border-[color:var(--accent)] focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]/30"
                        value={registerForm.email}
                        onChange={(event) => setRegisterForm((prev) => ({ ...prev, email: event.target.value }))}
                        placeholder="name@sky-control.dev"
                        autoComplete="email"
                      />
                    </label>
                    <label className="block text-xs uppercase tracking-[0.3em]" style={{ color: 'var(--text-2)' }}>
                      Пароль
                      <input
                        className="mt-1 w-full rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2 text-sm focus:border-[color:var(--accent)] focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]/30"
                        type="password"
                        value={registerForm.password}
                        onChange={(event) => setRegisterForm((prev) => ({ ...prev, password: event.target.value }))}
                        placeholder="Не короче 8 символов"
                        autoComplete="new-password"
                      />
                    </label>
                    <label className="block text-xs uppercase tracking-[0.3em]" style={{ color: 'var(--text-2)' }}>
                      Повторите пароль
                      <input
                        className="mt-1 w-full rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2 text-sm focus:border-[color:var(--accent)] focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]/30"
                        type="password"
                        value={registerForm.confirm}
                        onChange={(event) => setRegisterForm((prev) => ({ ...prev, confirm: event.target.value }))}
                        placeholder="Повторите пароль"
                        autoComplete="new-password"
                      />
                    </label>
                    <div className="space-y-1">
                      <div className="h-1.5 overflow-hidden rounded-full bg-[color:var(--border)]/40">
                        <div
                          className="h-full rounded-full bg-[color:var(--accent)] transition-all"
                          style={{ width: passwordStrength + '%' }}
                        />
                      </div>
                      <div className="text-[11px] uppercase tracking-[0.28em]" style={{ color: 'var(--text-2)' }}>
                        Сила пароля: {passwordStrength}%
                      </div>
                      <ul className="space-y-1 text-[11px]" style={{ color: 'var(--text-2)' }}>
                        {passwordRules.map((rule) => (
                          <li key={rule.id}>
                            <span className={rule.satisfied ? 'text-emerald-400' : 'text-[color:var(--text-2)]'}>•</span>{' '}
                            {rule.label}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <label className="flex items-center gap-2 text-xs uppercase tracking-[0.3em]" style={{ color: 'var(--text-2)' }}>
                      <input
                        type="checkbox"
                        checked={registerForm.accept}
                        onChange={(event) => setRegisterForm((prev) => ({ ...prev, accept: event.target.checked }))}
                      />
                      С правилами согласен
                    </label>
                    <label className="flex items-center gap-2 text-xs uppercase tracking-[0.3em]" style={{ color: 'var(--text-2)' }}>
                      <input
                        type="checkbox"
                        checked={registerForm.captcha}
                        onChange={(event) => setRegisterForm((prev) => ({ ...prev, captcha: event.target.checked }))}
                      />
                      Я не робот
                    </label>
                    <label className="flex items-center gap-2 text-xs uppercase tracking-[0.3em]" style={{ color: 'var(--text-2)' }}>
                      <input
                        type="checkbox"
                        checked={registerForm.remember}
                        onChange={(event) => setRegisterForm((prev) => ({ ...prev, remember: event.target.checked }))}
                      />
                      Запомнить меня
                    </label>
                    <button
                      type="submit"
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-[color:var(--accent)] px-4 py-2 text-sm font-semibold text-white shadow transition hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]/40"
                      disabled={authBusy}
                    >
                      Создать аккаунт
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <p className="text-center text-xs uppercase tracking-[0.3em]" style={{ color: 'var(--text-2)' }}>
            Соблюдайте правила. Первый зарегистрировавшийся — #1 (разработчик).
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen pb-24" style={{ background: 'var(--bg-1)', color: 'var(--text-1)' }}>
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-80"
        style={{
          background:
            'radial-gradient(1200px 780px at 12% -5%, rgba(99,102,241,0.16), transparent 65%),' +
            'radial-gradient(1000px 720px at 88% 10%, rgba(34,211,238,0.12), transparent 60%)',
        }}
        aria-hidden
      />
      <header className="sticky top-0 z-50 border-b border-[color:var(--border)] bg-[color:var(--surface)]/92 backdrop-blur supports-[backdrop-filter]:bg-[color:var(--surface)]/85">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[color:var(--accent)]/20 text-[color:var(--accent)] shadow">
              <Shield className="h-5 w-5" aria-hidden />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-[0.32em]" style={{ color: 'var(--text-2)' }}>
                SKY // FORUM
              </div>
              <div className="text-sm font-semibold">Контрольная панель</div>
            </div>
          </div>
          <div className="flex flex-1 items-center justify-center sm:max-w-xl">
            <label className="relative flex w-full items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-2 text-sm shadow-sm focus-within:border-[color:var(--accent)] focus-within:ring-2 focus-within:ring-[color:var(--accent)]/30">
              <Search className="h-4 w-4 text-[color:var(--text-2)]" aria-hidden />
              <input
                className="flex-1 bg-transparent text-sm focus:outline-none"
                placeholder="Поиск по темам и постам"
                type="search"
              />
            </label>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="flex items-center gap-2 rounded-full bg-[color:var(--accent)] px-4 py-2 text-sm font-semibold text-white shadow transition hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]/40"
            >
              <Plus className="h-4 w-4" aria-hidden />
              Новая тема
            </button>
            <button
              type="button"
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]/40"
              aria-label="Уведомления"
            >
              <Bell className="h-4 w-4" aria-hidden />
              <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-[1.5rem] items-center justify-center rounded-full bg-[color:var(--accent)] px-1 text-[11px] font-semibold text-white">
                9+
              </span>
            </button>
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                className="flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-1.5 text-sm shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]/30"
                onClick={() => setProfileMenuOpen((prev) => !prev)}
                aria-haspopup="true"
                aria-expanded={profileMenuOpen}
              >
                <UserCircle className="h-6 w-6 text-[color:var(--accent)]" aria-hidden />
                <div className="text-left leading-tight">
                  <div className="text-sm font-semibold">{currentUser?.username}</div>
                  <div className="text-[11px] uppercase tracking-[0.28em]" style={{ color: 'var(--text-2)' }}>
                    #{userNumber ?? '—'}
                  </div>
                </div>
                <ChevronDown className="h-4 w-4 text-[color:var(--text-2)]" aria-hidden />
              </button>
              {profileMenuOpen && (
                <div className="absolute right-0 z-50 mt-2 w-44 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-2 text-sm shadow-xl">
                  <Link
                    to="/profile"
                    className="block rounded-lg px-3 py-2 text-left text-sm hover:bg-[color:var(--accent)]/10"
                    onClick={() => setProfileMenuOpen(false)}
                  >
                    Профиль
                  </Link>
                  <button
                    type="button"
                    className="block w-full rounded-lg px-3 py-2 text-left text-sm text-rose-400 hover:bg-rose-500/10"
                    onClick={handleLogout}
                  >
                    Выйти
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="relative mx-auto w-full max-w-6xl px-4 pb-24 pt-10 sm:pt-14">
        <section className="overflow-hidden rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] shadow-2xl">
          <div className="relative">
            <div
              className="pointer-events-none absolute inset-0 opacity-90"
              style={{
                background: `linear-gradient(135deg, ${currentUser?.accentFrom ?? 'var(--accent)'} 0%, ${currentUser?.accentTo ?? '#6366f1'} 100%)`,
              }}
              aria-hidden
            />
            <div className="relative grid gap-6 px-6 py-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
              <div className="space-y-4 text-white">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-[10px] uppercase tracking-[0.4em]">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden />
                  Форум SKY
                </span>
                <h2 className="text-2xl font-semibold leading-snug sm:text-3xl">
                  {settings.bannerTitle || 'Командный центр SKY'}
                </h2>
                <p className="text-sm leading-relaxed text-white/80">
                  {settings.bannerSubtitle || 'Все приказы, отчёты и служебные заметки собраны в одном месте.'}
                </p>
                <div className="text-sm leading-relaxed text-white/85">
                  {`Командный центр открыт, ${currentUser?.username}!`}
                  {currentUser?.tagline && (
                    <span className="block text-white/70">{currentUser.tagline}</span>
                  )}
                </div>
                <ul className="grid gap-2 text-xs uppercase tracking-[0.3em] text-white/75 sm:grid-cols-2">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    Отчёты и документы
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    Живой чат смены
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    Настраиваемые уведомления
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    Закладки и вложения
                  </li>
                </ul>
                {authSuccess && (
                  <div className="flex items-start gap-2 rounded-xl bg-white/15 px-4 py-3 text-sm text-white">
                    <CheckCircle2 className="mt-0.5 h-4 w-4" aria-hidden />
                    <span>{authSuccess}</span>
                  </div>
                )}
              </div>
              <div className="rounded-xl border border-white/20 bg-[color:var(--surface)]/95 p-5 text-[color:var(--text-1)] shadow-xl">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.28em]" style={{ color: 'var(--text-2)' }}>
                  <span>Участник</span>
                  <span>{session?.remember ? 'Запомнено' : 'Гостевая сессия'}</span>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <div className="text-2xl font-semibold">{currentUser?.username}</div>
                  {currentUser && <RoleBadge role={currentUser.role} />}
                </div>
                <div className="text-sm" style={{ color: 'var(--text-2)' }}>
                  {userNumber ? `Пользователь №${userNumber}` : 'Номер будет назначен при синхронизации.'}
                </div>
                <div className="mt-1 text-sm" style={{ color: 'var(--text-2)' }}>
                  С нами с {memberSince}
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {STAT_BLOCKS.map((tile) => (
                    <div
                      key={tile.label}
                      className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-3 text-center shadow"
                    >
                      <div className="text-xs uppercase tracking-[0.3em]" style={{ color: 'var(--text-2)' }}>
                        {tile.label}
                      </div>
                      <div className="text-xl font-semibold">{tile.value}</div>
                      <div className="text-[11px]" style={{ color: 'var(--text-2)' }}>
                        {tile.hint}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
          <aside className="order-first flex flex-col gap-6 lg:order-none">
            <section className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] shadow-lg">
              <div className="flex items-center justify-between border-b border-[color:var(--border)] px-4 py-3 text-xs uppercase tracking-[0.3em]" style={{ color: 'var(--text-2)' }}>
                <span className="inline-flex items-center gap-2">
                  <Flame className="h-4 w-4" aria-hidden />
                  Горячее
                </span>
                <span>ТОП-5</span>
              </div>
              <ul className="divide-y divide-[color:var(--border)]">
                {HOT_TOPICS.map((topic) => (
                  <li key={topic.id} className="px-4 py-3">
                    <Link to="#" className="flex flex-col gap-1 rounded-lg transition hover:bg-[color:var(--accent)]/10">
                      <span className="text-sm font-semibold text-[color:var(--text-1)]">{topic.title}</span>
                      <div className="flex items-center justify-between text-xs uppercase tracking-[0.24em]" style={{ color: 'var(--text-2)' }}>
                        <span>{topic.author}</span>
                        <span>{topic.replies} ответов</span>
                      </div>
                      <span className="text-[11px] uppercase tracking-[0.3em]" style={{ color: 'var(--text-2)' }}>
                        {topic.updatedAt}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] shadow-lg">
              <div className="flex items-center justify-between border-b border-[color:var(--border)] px-4 py-3 text-xs uppercase tracking-[0.3em]" style={{ color: 'var(--text-2)' }}>
                <span>Чат смены</span>
                <span className="flex items-center gap-2">
                  <span
                    className={onlineCount > 0 ? 'h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(74,222,128,0.55)]' : 'h-2.5 w-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.45)]'}
                    aria-hidden
                  />
                  <span>{onlineCount}</span>
                </span>
              </div>
              <div className="p-4">
                <SimpleChat />
              </div>
            </section>

            <section className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] shadow-lg">
              <div className="border-b border-[color:var(--border)] px-4 py-3 text-xs uppercase tracking-[0.3em]" style={{ color: 'var(--text-2)' }}>
                В сети ({onlineCount})
              </div>
              <ul className="divide-y divide-[color:var(--border)]">
                {ONLINE_NOW.map((entry) => {
                  return (
                    <li key={entry.name} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[color:var(--text-1)]">
                          <span className="font-semibold">{entry.name}</span>
                          <span className="text-xs uppercase tracking-[0.28em]" style={{ color: 'var(--text-2)' }}>
                            №{entry.userNumber}
                          </span>
                        </div>
                        <RoleBadge role={entry.role} />
                      </div>
                      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em]" style={{ color: 'var(--text-2)' }}>
                        <span
                          className={entry.online
                            ? 'h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(74,222,128,0.55)]'
                            : 'h-2.5 w-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.45)]'}
                          aria-hidden
                        />
                        <span>{entry.online ? 'В сети' : 'Не в сети'}</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>

            <section className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] shadow-lg">
              <div className="border-b border-[color:var(--border)] px-4 py-3 text-xs uppercase tracking-[0.3em]" style={{ color: 'var(--text-2)' }}>
                Ресурсы
              </div>
              <ul className="divide-y divide-[color:var(--border)]">
                {RESOURCES.map((resource) => (
                  <li key={resource.label} className="px-4 py-3">
                    <Link to={resource.to} className="flex flex-col gap-1 text-sm text-[color:var(--accent)] hover:underline">
                      <span className="font-semibold">{resource.label}</span>
                      <span className="text-xs uppercase tracking-[0.24em]" style={{ color: 'var(--text-2)' }}>
                        {resource.description}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </aside>

          <div className="flex flex-col gap-6">
            <section className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] shadow-lg">
              <div className="flex items-center justify-between border-b border-[color:var(--border)] px-5 py-4" style={{ background: 'var(--bg-2)' }}>
                <div className="text-xs uppercase tracking-[0.3em]" style={{ color: 'var(--text-2)' }}>
                  Разделы форума
                </div>
                <div className="text-xs uppercase tracking-[0.3em]" style={{ color: 'var(--text-2)' }}>
                  6 основных
                </div>
              </div>
              <div className="grid gap-4 p-5 sm:grid-cols-2 xl:grid-cols-3">
                {SECTION_TILES.map((section) => {
                  const Icon = section.icon;
                  return (
                    <Link
                      key={section.id}
                      to={section.href}
                      className="group flex flex-col gap-3 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)]/90 p-4 shadow transition hover:-translate-y-1 hover:border-[color:var(--accent)] hover:shadow-[0_20px_45px_-35px_rgba(99,102,241,0.8)]"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--accent)]/15 text-[color:var(--accent)]">
                            <Icon className="h-5 w-5" aria-hidden />
                          </span>
                          <div className="text-base font-semibold">{section.title}</div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-[color:var(--text-2)] transition group-hover:translate-x-1" aria-hidden />
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-2)' }}>
                        {section.description}
                      </p>
                      <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em]" style={{ color: 'var(--text-2)' }}>
                        <span>Тем: {section.topics}</span>
                        <span>{section.updatedAt}</span>
                      </div>
                      <div className="flex justify-end">
                        <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--accent)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-[color:var(--accent)] transition group-hover:bg-[color:var(--accent)] group-hover:text-white">
                          Перейти
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>

            <section className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] shadow-lg">
              <div className="flex items-center gap-2 border-b border-[color:var(--border)] px-5 py-4 text-xs uppercase tracking-[0.3em]" style={{ color: 'var(--text-2)' }}>
                <Pin className="h-4 w-4" aria-hidden />
                Объявления
              </div>
              <ul className="divide-y divide-[color:var(--border)]">
                {sortedAnnouncements.map((item) => (
                  <li key={item.id} className="grid gap-4 px-5 py-4 md:grid-cols-[minmax(0,1fr)_220px]">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-semibold">{item.title}</h3>
                        {item.pinned && (
                          <span className="rounded-full border border-[color:var(--accent)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-[color:var(--accent)]">
                            PINNED
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm leading-relaxed" style={{ color: 'var(--text-2)' }}>
                        {item.body}
                      </p>
                    </div>
                    <div className="text-xs uppercase tracking-[0.24em]" style={{ color: 'var(--text-2)' }}>
                      <div className="font-semibold text-[color:var(--accent)]">{item.author}</div>
                      <div>{item.timestamp}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section className="overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] shadow-lg">
              <div className="flex flex-col gap-1 border-b border-[color:var(--border)] px-5 py-4" style={{ background: 'var(--bg-2)' }}>
                <div className="text-xs uppercase tracking-[0.3em]" style={{ color: 'var(--text-2)' }}>
                  Темы по разделам
                </div>
                <div className="text-sm" style={{ color: 'var(--text-2)' }}>
                  Закрепы всегда наверху, свежие ответы — справа.
                </div>
              </div>
              <div className="divide-y divide-[color:var(--border)]">
                {FORUM_GROUPS.map((group) => (
                  <div key={group.id} className="grid gap-4 px-5 py-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
                    <div>
                      <div className="text-xs uppercase tracking-[0.3em]" style={{ color: 'var(--text-2)' }}>
                        {group.title}
                      </div>
                      <div className="text-sm" style={{ color: 'var(--text-2)' }}>
                        {group.description}
                      </div>
                    </div>
                    <div className="space-y-3">
                      {group.boards.map((board) => (
                        <div
                          key={board.id}
                          className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)]/90 p-4 shadow-sm transition hover:border-[color:var(--accent)]"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <Link to={board.href} className="flex items-center gap-2 text-sm font-semibold text-[color:var(--accent)] hover:underline">
                              {board.title}
                              <ChevronRight className="h-4 w-4" aria-hidden />
                            </Link>
                            <div className="text-xs uppercase tracking-[0.3em]" style={{ color: 'var(--text-2)' }}>
                              Тем: {board.topics} • Сообщений: {board.posts}
                            </div>
                          </div>
                          <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-2)' }}>
                            {board.description}
                          </p>
                          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-[0.24em]" style={{ color: 'var(--text-2)' }}>
                            <span className="font-semibold text-[color:var(--accent)]">{board.last.author}</span>
                            <span>{board.last.subject}</span>
                            <span>{board.last.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] shadow-lg">
              <div className="flex flex-col gap-2 border-b border-[color:var(--border)] px-5 py-4" style={{ background: 'var(--bg-2)' }}>
                <div className="text-xs uppercase tracking-[0.3em]" style={{ color: 'var(--text-2)' }}>
                  {TOPIC_SAMPLE_META.category} • #{TOPIC_SAMPLE_META.id}
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-base font-semibold sm:text-lg">{TOPIC_SAMPLE_META.title}</h3>
                  {activeTopicBadges.map((badgeKey) => {
                    const badge = formatTopicBadge(badgeKey);
                    return (
                      <span
                        key={badgeKey}
                        className="rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.32em]"
                        style={{
                          borderColor: `${badge.accent}55`,
                          color: badge.accent,
                          background: `${badge.accent}1a`,
                        }}
                      >
                        {badge.label}
                      </span>
                    );
                  })}
                  {topicMovedTo && (
                    <span className="rounded-full border border-[color:var(--border)] px-2 py-0.5 text-[10px] uppercase tracking-[0.3em] text-[color:var(--text-2)]">
                      Перенесено → {topicMovedTo}
                    </span>
                  )}
                </div>
              </div>

              {isModerator && (
                <div className="flex flex-wrap items-center gap-3 border-b border-[color:var(--border)] bg-[color:var(--surface)]/80 px-5 py-3 text-xs uppercase tracking-[0.28em]" style={{ color: 'var(--text-2)' }}>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-full border border-[color:var(--accent)] px-3 py-1 text-[11px] font-semibold text-[color:var(--accent)] transition hover:bg-[color:var(--accent)]/15"
                    onClick={handleTogglePin}
                  >
                    <Pin className="h-3.5 w-3.5" aria-hidden />
                    {topicPinned ? 'Unpin Topic' : 'Pin Topic'}
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-full border border-[color:var(--accent)] px-3 py-1 text-[11px] font-semibold text-[color:var(--accent)] transition hover:bg-[color:var(--accent)]/15"
                    onClick={handleToggleLock}
                  >
                    {topicLocked ? <Unlock className="h-3.5 w-3.5" aria-hidden /> : <Lock className="h-3.5 w-3.5" aria-hidden />}
                    {topicLocked ? 'Unlock Topic' : 'Lock Topic'}
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-full border border-[color:var(--accent)] px-3 py-1 text-[11px] font-semibold text-[color:var(--accent)] transition hover:bg-[color:var(--accent)]/15"
                    onClick={handleMoveTopic}
                  >
                    <ArrowRightLeft className="h-3.5 w-3.5" aria-hidden />
                    {topicMovedTo ? 'Вернуть на место' : 'Move Topic'}
                  </button>
                  <span className="hidden text-[10px] uppercase tracking-[0.32em] md:inline" style={{ color: 'var(--text-2)' }}>
                    Инструменты модерирования активны только локально
                  </span>
                </div>
              )}

              <div className="divide-y divide-[color:var(--border)]">
                {topicPosts.map((post) => (
                  <article
                    key={post.id}
                    className="grid gap-6 px-5 py-6 md:grid-cols-[minmax(220px,260px)_minmax(0,1fr)]"
                    style={{ background: 'var(--surface)' }}
                  >
                    <aside className="space-y-4 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)]/85 p-4 shadow-sm">
                      <div className="flex items-center gap-3">
                        <span
                          className="flex h-12 w-12 items-center justify-center rounded-2xl text-sm font-semibold text-white shadow"
                          style={{ background: post.author.avatarColor }}
                        >
                          {post.author.username.slice(0, 2).toUpperCase()}
                        </span>
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-[color:var(--text-1)]">
                            {post.author.username}
                            <RoleBadge role={post.author.role} />
                          </div>
                          <div className="text-xs uppercase tracking-[0.32em]" style={{ color: 'var(--text-2)' }}>
                            Пользователь №{post.author.userNumber}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2 text-xs uppercase tracking-[0.28em]" style={{ color: 'var(--text-2)' }}>
                        <div>Регистрация: {post.author.registeredAt}</div>
                        <div>Постов: {post.author.posts}</div>
                        <div>Лайков: {post.author.likes}</div>
                      </div>
                      {post.author.isTopicAuthor && (
                        <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--accent)]/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-[color:var(--accent)]">
                          <Sparkles className="h-3.5 w-3.5" aria-hidden />
                          Автор темы
                        </span>
                      )}
                    </aside>
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-[0.3em]" style={{ color: 'var(--text-2)' }}>
                        <span>{post.createdAt}</span>
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            className="inline-flex items-center gap-1 rounded-full border border-[color:var(--border)] px-2 py-1 transition hover:border-[color:#f97316] hover:text-[#f97316]"
                          >
                            <Flag className="h-3.5 w-3.5" aria-hidden />
                            Пожаловаться
                          </button>
                          {isModerator && !post.deleted && (
                            <button
                              type="button"
                              className="inline-flex items-center gap-1 rounded-full border border-rose-400 px-2 py-1 text-rose-300 transition hover:bg-rose-500/10"
                              onClick={() => handleDeletePost(post.id)}
                            >
                              Delete Post
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="space-y-3 text-sm leading-relaxed">
                        {post.deleted ? (
                          <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                            Сообщение удалено модератором.
                          </div>
                        ) : (
                          post.content.map((paragraph, index) => (
                            <p key={index} style={{ color: 'var(--text-1)' }}>
                              {paragraph}
                            </p>
                          ))
                        )}
                      </div>
                      {post.attachments && post.attachments.length > 0 && !post.deleted && (
                        <div className="space-y-2 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)]/80 px-4 py-3 text-sm">
                          {post.attachments.map((attachment) => (
                            <div key={attachment} className="flex items-center gap-2 text-[color:var(--text-2)]">
                              <Paperclip className="h-4 w-4" aria-hidden />
                              {attachment}
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.28em]" style={{ color: 'var(--text-2)' }}>
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 rounded-full border border-[color:var(--border)] px-2 py-1 transition hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
                        >
                          <ThumbsUp className="h-3.5 w-3.5" aria-hidden />
                          Лайк ({post.likes})
                        </button>
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 rounded-full border border-[color:var(--border)] px-2 py-1 transition hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
                          onClick={() => handleMention(post.author.username)}
                          disabled={composerDisabled}
                        >
                          <CornerUpRight className="h-3.5 w-3.5" aria-hidden />
                          Ответить
                        </button>
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 rounded-full border border-[color:var(--border)] px-2 py-1 transition hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
                          onClick={() => handleComposerChange(`${composer.value ? `${composer.value}\n\n` : ''}> ${post.content.join(' ')}\n`)}
                          disabled={composerDisabled}
                        >
                          <Quote className="h-3.5 w-3.5" aria-hidden />
                          Цитата
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <div className="border-t border-[color:var(--border)] bg-[color:var(--surface)]/75 px-5 py-5">
                {topicLocked ? (
                  <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                    Тема закрыта модератором. Новые ответы недоступны.
                  </div>
                ) : (
                  <form className="space-y-4" onSubmit={handleComposerSubmit}>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="text-sm font-semibold">Ваш ответ</div>
                      {currentUserRole === 'newbie' && (
                        <span className="text-[11px] uppercase tracking-[0.28em] text-sky-300">
                          Newbie: без ссылок и вложений, кулдаун 30 сек.
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.24em]" style={{ color: 'var(--text-2)' }}>
                      {['B', 'I', 'CODE', 'QUOTE', 'LIST', 'LINK', 'SPOILER'].map((control) => (
                        <button
                          key={control}
                          type="button"
                          className="rounded-full border border-[color:var(--border)] px-3 py-1 text-[10px] font-semibold"
                          disabled={composerDisabled}
                        >
                          {control}
                        </button>
                      ))}
                    </div>
                    <textarea
                      value={composer.value}
                      onChange={(event) => handleComposerChange(event.target.value)}
                      className="min-h-[140px] w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-sm leading-relaxed shadow-inner focus:border-[color:var(--accent)] focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]/30"
                      placeholder="Делимся решениями и апдейтами..."
                      disabled={composerDisabled}
                    />
                    <div className="flex flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-[0.28em]" style={{ color: 'var(--text-2)' }}>
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] px-3 py-1 text-[11px] transition hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
                          onClick={handleAddAttachment}
                          disabled={composerDisabled || !allowAttachments}
                        >
                          <Paperclip className="h-3.5 w-3.5" aria-hidden />
                          Вложение
                        </button>
                        {!allowAttachments && (
                          <span className="text-[10px] uppercase tracking-[0.3em] text-[color:var(--text-2)]">
                            Доступно после повышения роли
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {currentUserRole === 'newbie' && cooldown > 0 && (
                          <span className="text-[10px] uppercase tracking-[0.3em] text-sky-300">
                            Ожидание: {cooldown} сек.
                          </span>
                        )}
                        <button
                          type="submit"
                          className="inline-flex items-center gap-2 rounded-full bg-[color:var(--accent)] px-4 py-2 text-sm font-semibold text-white shadow transition hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]/40"
                          disabled={composerDisabled}
                        >
                          Отправить
                        </button>
                      </div>
                    </div>
                    {composer.attachments.length > 0 && (
                      <div className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)]/80 px-4 py-3 text-sm">
                        <div className="text-[11px] uppercase tracking-[0.3em]" style={{ color: 'var(--text-2)' }}>
                          Вложения
                        </div>
                        <ul className="mt-2 space-y-2">
                          {composer.attachments.map((item) => (
                            <li key={item} className="flex items-center justify-between gap-3">
                              <span className="flex items-center gap-2 text-[color:var(--text-2)]">
                                <Paperclip className="h-4 w-4" aria-hidden />
                                {item}
                              </span>
                              <button
                                type="button"
                                className="text-[10px] uppercase tracking-[0.3em] text-rose-300 hover:text-rose-200"
                                onClick={() => handleRemoveAttachment(item)}
                              >
                                Удалить
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {composerError && (
                      <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                        {composerError}
                      </div>
                    )}
                  </form>
                )}
              </div>
            </section>
          </div>
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
