import { assertAsciiUsername } from "../lib/validators";
import {
  FORUM_SESSION_STORAGE_KEY,
  ForumSession,
  dispatchForumSessionEvent,
  readForumSession,
} from "../forumSession";

type StorageKey =
  | "forum:accounts"
  | "forum:sections"
  | "forum:topics"
  | "forum:posts"
  | "forum:settings"
  | "forum:logs"
  | "forum:counters"
  | "forum:initialized";

export type Role = "admin" | "moderator" | "vip" | "user" | "newbie";

export type AccountProfile = {
  avatarData?: string;
  bannerData?: string;
  bio?: string;
  signature?: string;
  links?: { website?: string; discord?: string; telegram?: string };
  accentFrom?: string;
  accentTo?: string;
  badges?: string[];
  privacy?: { showEmail: boolean; showStats: boolean };
};

export type Account = {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  role: Role;
  userNumber: number;
  posts: number;
  likes: number;
  topics: number;
  profile: AccountProfile;
  bans?: { until?: string; reason?: string } | null;
  mutes?: { until?: string; reason?: string } | null;
};

export type Section = {
  id: string;
  title: string;
  description: string;
  icon?: string;
  createdAt: string;
  order: number;
  moderatorIds: string[];
  topicCount: number;
  postCount: number;
};

export type Topic = {
  id: string;
  sectionId: string;
  title: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  pinned: boolean;
  locked: boolean;
  movedTo?: string | null;
  viewCount: number;
  replyCount: number;
  lastPostAt: string;
  lastPostBy: string;
};

export type Post = {
  id: string;
  topicId: string;
  authorId: string;
  content: string;
  createdAt: string;
  editedAt?: string | null;
  deleted?: boolean;
  deletedBy?: string | null;
  likes: string[];
};

export type ForumSettings = {
  heroTitle: string;
  heroSubtitle: string;
  heroMessage: string;
  registrationOpen: boolean;
  requireEnglishNick: boolean;
  allowGuestRead: boolean;
};

export type ModerationLogEntry = {
  id: string;
  createdAt: string;
  actorId: string;
  action: string;
  targetType: "account" | "section" | "topic" | "post" | "settings";
  targetId?: string;
  notes?: string;
};

type ForumCounters = {
  nextUserNumber: number;
};

type MaybeWindow = typeof window | undefined;

type StorageTarget = "local" | "session";

function getWindow(): MaybeWindow {
  if (typeof window === "undefined") return undefined;
  return window;
}

function readStorage<T>(key: StorageKey, fallback: T): T {
  const w = getWindow();
  if (!w) return fallback;
  try {
    const raw = w.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: StorageKey, value: T) {
  const w = getWindow();
  if (!w) return;
  try {
    w.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

function removeStorage(key: StorageKey) {
  const w = getWindow();
  if (!w) return;
  try {
    w.localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

function writeSession(session: ForumSession | null, target: StorageTarget) {
  const w = getWindow();
  if (!w) return;
  try {
    const storage = target === "local" ? w.localStorage : w.sessionStorage;
    if (session) {
      storage.setItem(FORUM_SESSION_STORAGE_KEY, JSON.stringify(session));
    } else {
      storage.removeItem(FORUM_SESSION_STORAGE_KEY);
    }
  } catch {
    // ignore
  }
}

function clearSessionFrom(storage: StorageTarget) {
  const w = getWindow();
  if (!w) return;
  try {
    const target = storage === "local" ? w.localStorage : w.sessionStorage;
    target.removeItem(FORUM_SESSION_STORAGE_KEY);
  } catch {
    // ignore
  }
}

function nowIso() {
  return new Date().toISOString();
}

function isRestrictionActive(restriction?: { until?: string | null }): boolean {
  if (!restriction) return false;
  if (!restriction.until) return true;
  return new Date(restriction.until).getTime() > Date.now();
}

let initialized = false;

function ensureInitialized() {
  if (initialized) return;
  initialized = true;
  const flag = readStorage<boolean>("forum:initialized", false);
  if (!flag) {
    seedDemoData();
    writeStorage("forum:initialized", true);
  }
}

function seedDemoData() {
  const createdAt = nowIso();
  const admin: Account = {
    id: crypto.randomUUID(),
    username: "skyadmin",
    email: "sky@forum.local",
    createdAt,
    role: "admin",
    userNumber: 1,
    posts: 3,
    likes: 6,
    topics: 2,
    profile: {
      bio: "Создатель SKY форума. Слежу за порядком и вдохновляю команду.",
      links: { website: "https://sky.local" },
      accentFrom: "#a855f7",
      accentTo: "#22d3ee",
      badges: ["Founder", "Core"],
      privacy: { showEmail: true, showStats: true },
    },
    bans: null,
    mutes: null,
  };
  const mod: Account = {
    id: crypto.randomUUID(),
    username: "elysia",
    email: "elysia@forum.local",
    createdAt,
    role: "moderator",
    userNumber: 2,
    posts: 5,
    likes: 8,
    topics: 1,
    profile: {
      bio: "Фанат ретро-интерфейсов, модерирую раздел дизайна.",
      signature: "Stay liquid",
      links: { discord: "elysia#2048" },
      accentFrom: "#f472b6",
      accentTo: "#c084fc",
      badges: ["Moderator"],
      privacy: { showEmail: false, showStats: true },
    },
    bans: null,
    mutes: null,
  };
  const vip: Account = {
    id: crypto.randomUUID(),
    username: "raptor",
    email: "raptor@forum.local",
    createdAt,
    role: "vip",
    userNumber: 3,
    posts: 2,
    likes: 3,
    topics: 1,
    profile: {
      bio: "Тестирую новые версии SKY. Люблю длинные треды.",
      links: { telegram: "@raptor" },
      accentFrom: "#38bdf8",
      accentTo: "#a855f7",
      badges: ["Early"],
      privacy: { showEmail: false, showStats: true },
    },
    bans: null,
    mutes: null,
  };
  writeStorage("forum:accounts", [admin, mod, vip]);

  const sections: Section[] = [
    {
      id: crypto.randomUUID(),
      title: "SKY Update Log",
      description: "Анонсы обновлений, бета-релизы, планы.",
      icon: "🛠",
      createdAt,
      order: 1,
      moderatorIds: [admin.id],
      topicCount: 1,
      postCount: 4,
    },
    {
      id: crypto.randomUUID(),
      title: "Design Lab",
      description: "UI/UX, экспериментальные концепты, ретрофутуризм.",
      icon: "🎨",
      createdAt,
      order: 2,
      moderatorIds: [mod.id],
      topicCount: 1,
      postCount: 3,
    },
    {
      id: crypto.randomUUID(),
      title: "Community Lounge",
      description: "Знакомства, свободные разговоры, сбор фидбэка.",
      icon: "🪐",
      createdAt,
      order: 3,
      moderatorIds: [mod.id, vip.id],
      topicCount: 1,
      postCount: 3,
    },
  ];
  writeStorage("forum:sections", sections);

  const topics: Topic[] = [
    {
      id: crypto.randomUUID(),
      sectionId: sections[0].id,
      title: "SKY 0.9 Roadmap",
      authorId: admin.id,
      createdAt,
      updatedAt: createdAt,
      pinned: true,
      locked: false,
      movedTo: null,
      viewCount: 124,
      replyCount: 2,
      lastPostAt: createdAt,
      lastPostBy: mod.id,
    },
    {
      id: crypto.randomUUID(),
      sectionId: sections[1].id,
      title: "Liquid glass паттерны",
      authorId: mod.id,
      createdAt,
      updatedAt: createdAt,
      pinned: false,
      locked: false,
      movedTo: null,
      viewCount: 86,
      replyCount: 1,
      lastPostAt: createdAt,
      lastPostBy: admin.id,
    },
    {
      id: crypto.randomUUID(),
      sectionId: sections[2].id,
      title: "Добро пожаловать в форум SKY",
      authorId: vip.id,
      createdAt,
      updatedAt: createdAt,
      pinned: true,
      locked: false,
      movedTo: null,
      viewCount: 96,
      replyCount: 2,
      lastPostAt: createdAt,
      lastPostBy: admin.id,
    },
  ];
  writeStorage("forum:topics", topics);

  const posts: Post[] = [
    {
      id: crypto.randomUUID(),
      topicId: topics[0].id,
      authorId: admin.id,
      content: "Друзья, собираем планы на 0.9: новый редактор, режим SKY Home, система достижений.",
      createdAt,
      likes: [mod.id, vip.id],
    },
    {
      id: crypto.randomUUID(),
      topicId: topics[0].id,
      authorId: mod.id,
      content: "Прототипы готовы. Нужны тестеры для редизайна панели модерации.",
      createdAt,
      likes: [admin.id],
    },
    {
      id: crypto.randomUUID(),
      topicId: topics[1].id,
      authorId: mod.id,
      content: "Собираю коллекцию эффектов для стекла. Делитесь скринами и CSS.",
      createdAt,
      likes: [vip.id],
    },
    {
      id: crypto.randomUUID(),
      topicId: topics[1].id,
      authorId: admin.id,
      content: "Добавил токены для акцентных градиентов. Проверяйте в index.css.",
      createdAt,
      likes: [mod.id],
    },
    {
      id: crypto.randomUUID(),
      topicId: topics[2].id,
      authorId: vip.id,
      content: "Расскажите о себе! Я занимаюсь QA и люблю тёмные темы.",
      createdAt,
      likes: [mod.id],
    },
    {
      id: crypto.randomUUID(),
      topicId: topics[2].id,
      authorId: mod.id,
      content: "Привет всем! Готов помогать с оформлением и модерировать Lounge.",
      createdAt,
      likes: [vip.id],
    },
    {
      id: crypto.randomUUID(),
      topicId: topics[2].id,
      authorId: admin.id,
      content: "Будем держать космический вайб и уважение друг к другу.",
      createdAt,
      likes: [vip.id, mod.id],
    },
  ];
  writeStorage("forum:posts", posts);

  const settings: ForumSettings = {
    heroTitle: "SKY Forum",
    heroSubtitle: "Эксклюзивное сообщество для разработчиков и исследователей SKY.",
    heroMessage: "Обсуждаем обновления, делимся концептами и тестируем будущее интерфейсов.",
    registrationOpen: true,
    requireEnglishNick: true,
    allowGuestRead: false,
  };
  writeStorage("forum:settings", settings);

  const counters: ForumCounters = { nextUserNumber: 4 };
  writeStorage("forum:counters", counters);

  const logEntry: ModerationLogEntry = {
    id: crypto.randomUUID(),
    createdAt,
    actorId: admin.id,
    action: "seed",
    targetType: "settings",
    notes: "Инициализация демо-данных форума",
  };
  writeStorage("forum:logs", [logEntry]);
}

function readAccounts(): Account[] {
  ensureInitialized();
  return readStorage<Account[]>("forum:accounts", []);
}

function saveAccounts(accounts: Account[]) {
  writeStorage("forum:accounts", accounts);
}

function readSections(): Section[] {
  ensureInitialized();
  return readStorage<Section[]>("forum:sections", []);
}

function saveSections(sections: Section[]) {
  writeStorage("forum:sections", sections);
}

function readTopics(): Topic[] {
  ensureInitialized();
  return readStorage<Topic[]>("forum:topics", []);
}

function saveTopics(topics: Topic[]) {
  writeStorage("forum:topics", topics);
}

function readPosts(): Post[] {
  ensureInitialized();
  return readStorage<Post[]>("forum:posts", []);
}

function savePosts(posts: Post[]) {
  writeStorage("forum:posts", posts);
}

function readSettings(): ForumSettings {
  ensureInitialized();
  return readStorage<ForumSettings>("forum:settings", {
    heroTitle: "SKY Forum",
    heroSubtitle: "",
    heroMessage: "",
    registrationOpen: false,
    requireEnglishNick: true,
    allowGuestRead: false,
  });
}

function saveSettings(settings: ForumSettings) {
  writeStorage("forum:settings", settings);
}

function readCounters(): ForumCounters {
  ensureInitialized();
  return readStorage<ForumCounters>("forum:counters", { nextUserNumber: 1 });
}

function saveCounters(counters: ForumCounters) {
  writeStorage("forum:counters", counters);
}

function readLogs(): ModerationLogEntry[] {
  ensureInitialized();
  return readStorage<ModerationLogEntry[]>("forum:logs", []);
}

function saveLogs(logs: ModerationLogEntry[]) {
  writeStorage("forum:logs", logs);
}

function recordLog(entry: Omit<ModerationLogEntry, "id" | "createdAt">) {
  const logs = readLogs();
  const newEntry: ModerationLogEntry = {
    id: crypto.randomUUID(),
    createdAt: nowIso(),
    ...entry,
  };
  logs.unshift(newEntry);
  saveLogs(logs.slice(0, 200));
}

function setSession(accountId: string, remember: boolean) {
  const session: ForumSession = {
    userId: accountId,
    remember,
    lastLogin: nowIso(),
  };
  if (remember) {
    writeSession(session, "local");
    clearSessionFrom("session");
  } else {
    writeSession(session, "session");
    clearSessionFrom("local");
  }
  dispatchForumSessionEvent(session);
}

export function clearSession() {
  clearSessionFrom("local");
  clearSessionFrom("session");
  dispatchForumSessionEvent(null);
}

export function getSessionAccount(): Account | null {
  const session = readForumSession();
  if (!session) return null;
  return findAccountById(session.userId);
}

export function listAccounts(): Account[] {
  return readAccounts();
}

export function findAccountById(id: string): Account | null {
  return readAccounts().find((a) => a.id === id) || null;
}

export function findAccountByUsername(username: string): Account | null {
  return readAccounts().find((a) => a.username.toLowerCase() === username.toLowerCase()) || null;
}

export function registerAccount({
  username,
  email,
  remember,
}: {
  username: string;
  email: string;
  remember: boolean;
}): { account: Account } {
  const settings = readSettings();
  if (!settings.registrationOpen) {
    throw new Error("Регистрация закрыта администратором.");
  }
  if (settings.requireEnglishNick) {
    assertAsciiUsername(username);
  }
  if (!email.includes("@")) {
    throw new Error("Введите корректный e-mail.");
  }
  const existing = findAccountByUsername(username);
  if (existing) {
    throw new Error("Такой ник уже занят.");
  }
  const accounts = readAccounts();
  const counters = readCounters();
  const account: Account = {
    id: crypto.randomUUID(),
    username,
    email,
    createdAt: nowIso(),
    role: "newbie",
    userNumber: counters.nextUserNumber,
    posts: 0,
    likes: 0,
    topics: 0,
    profile: {
      bio: "",
      signature: "",
      links: {},
      accentFrom: "#8b5cf6",
      accentTo: "#0ea5e9",
      badges: [],
      privacy: { showEmail: false, showStats: true },
    },
    bans: null,
    mutes: null,
  };
  accounts.push(account);
  saveAccounts(accounts);
  counters.nextUserNumber += 1;
  saveCounters(counters);
  recordLog({
    actorId: account.id,
    action: "register",
    targetType: "account",
    targetId: account.id,
    notes: `Новый пользователь ${username}`,
  });
  setSession(account.id, remember);
  return { account };
}

export function authenticateAccount({
  usernameOrEmail,
  remember,
}: {
  usernameOrEmail: string;
  remember: boolean;
}): { account: Account } {
  const value = usernameOrEmail.trim().toLowerCase();
  const account = readAccounts().find(
    (a) => a.username.toLowerCase() === value || a.email.toLowerCase() === value,
  );
  if (!account) {
    throw new Error("Пользователь не найден.");
  }
  if (isRestrictionActive(account.bans || undefined)) {
    throw new Error(account.bans?.reason || "Аккаунт заблокирован.");
  }
  setSession(account.id, remember);
  recordLog({
    actorId: account.id,
    action: "login",
    targetType: "account",
    targetId: account.id,
    notes: "Вход в форум",
  });
  return { account };
}

export function updateAccount(id: string, patch: Partial<Account>) {
  const accounts = readAccounts();
  const idx = accounts.findIndex((a) => a.id === id);
  if (idx === -1) return;
  accounts[idx] = { ...accounts[idx], ...patch };
  saveAccounts(accounts);
}

export function updateAccountProfile(id: string, profile: AccountProfile) {
  const accounts = readAccounts();
  const idx = accounts.findIndex((a) => a.id === id);
  if (idx === -1) return;
  const limitedBadges = profile.badges ? profile.badges.slice(0, 3) : undefined;
  accounts[idx] = {
    ...accounts[idx],
    profile: {
      ...accounts[idx].profile,
      ...profile,
      badges: limitedBadges,
      privacy: {
        showEmail: profile.privacy?.showEmail ?? accounts[idx].profile.privacy?.showEmail ?? false,
        showStats: profile.privacy?.showStats ?? accounts[idx].profile.privacy?.showStats ?? true,
      },
    },
  };
  saveAccounts(accounts);
  recordLog({
    actorId: id,
    action: "profile_update",
    targetType: "account",
    targetId: id,
    notes: "Обновление профиля",
  });
}

export function setRole(id: string, role: Role, actorId?: string) {
  const account = findAccountById(id);
  if (!account) return;
  updateAccount(id, { role });
  if (actorId) {
    recordLog({
      actorId,
      action: `role:${role}`,
      targetType: "account",
      targetId: id,
      notes: `Назначена роль ${role}`,
    });
  }
}

export function applyBan(id: string, ban: Account["bans"], actorId: string) {
  updateAccount(id, { bans: ban });
  recordLog({
    actorId,
    action: ban ? "ban" : "ban_remove",
    targetType: "account",
    targetId: id,
    notes: ban?.reason,
  });
}

export function applyMute(id: string, mute: Account["mutes"], actorId: string) {
  updateAccount(id, { mutes: mute });
  recordLog({
    actorId,
    action: mute ? "mute" : "mute_remove",
    targetType: "account",
    targetId: id,
    notes: mute?.reason,
  });
}

export function listSections(): Section[] {
  return readSections().slice().sort((a, b) => a.order - b.order);
}

export function createSection(data: {
  title: string;
  description: string;
  icon?: string;
  moderatorIds?: string[];
  actorId: string;
}): Section {
  const sections = readSections();
  const section: Section = {
    id: crypto.randomUUID(),
    title: data.title,
    description: data.description,
    icon: data.icon,
    createdAt: nowIso(),
    order: sections.length + 1,
    moderatorIds: data.moderatorIds ?? [],
    topicCount: 0,
    postCount: 0,
  };
  sections.push(section);
  saveSections(sections);
  recordLog({
    actorId: data.actorId,
    action: "section_create",
    targetType: "section",
    targetId: section.id,
    notes: section.title,
  });
  return section;
}

export function updateSection(id: string, patch: Partial<Section>, actorId: string) {
  const sections = readSections();
  const idx = sections.findIndex((s) => s.id === id);
  if (idx === -1) return;
  sections[idx] = { ...sections[idx], ...patch };
  saveSections(sections);
  recordLog({
    actorId,
    action: "section_update",
    targetType: "section",
    targetId: id,
    notes: patch.title || patch.description,
  });
}

export function deleteSection(id: string, actorId: string) {
  const sections = readSections();
  const section = sections.find((s) => s.id === id);
  if (!section) return;
  const topics = readTopics();
  const topicIdsToRemove = new Set(topics.filter((t) => t.sectionId === id).map((t) => t.id));
  const remainingTopics = topics.filter((t) => !topicIdsToRemove.has(t.id));
  const posts = readPosts();
  const remainingPosts = posts.filter((p) => !topicIdsToRemove.has(p.topicId));
  saveSections(sections.filter((s) => s.id !== id));
  saveTopics(remainingTopics);
  savePosts(remainingPosts);
  recordLog({
    actorId,
    action: "section_delete",
    targetType: "section",
    targetId: id,
    notes: section.title,
  });
}

export function listTopics(sectionId?: string): Topic[] {
  const topics = readTopics();
  const filtered = sectionId ? topics.filter((t) => t.sectionId === sectionId) : topics;
  return filtered
    .slice()
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.lastPostAt).getTime() - new Date(a.lastPostAt).getTime();
    });
}

export function findTopicById(id: string): Topic | null {
  return readTopics().find((t) => t.id === id) || null;
}

export function createTopic({
  sectionId,
  title,
  authorId,
  content,
}: {
  sectionId: string;
  title: string;
  authorId: string;
  content: string;
}): { topic: Topic; post: Post } {
  const sections = readSections();
  const section = sections.find((s) => s.id === sectionId);
  if (!section) {
    throw new Error("Раздел не найден");
  }
  const account = findAccountById(authorId);
  if (!account) {
    throw new Error("Автор не найден");
  }
  if (isRestrictionActive(account.bans || undefined)) {
    throw new Error("Аккаунт заблокирован");
  }
  if (isRestrictionActive(account.mutes || undefined)) {
    throw new Error("Вы не можете создавать темы во время мута");
  }
  const createdAt = nowIso();
  const topic: Topic = {
    id: crypto.randomUUID(),
    sectionId,
    title,
    authorId,
    createdAt,
    updatedAt: createdAt,
    pinned: false,
    locked: false,
    movedTo: null,
    viewCount: 0,
    replyCount: 0,
    lastPostAt: createdAt,
    lastPostBy: authorId,
  };
  const post: Post = {
    id: crypto.randomUUID(),
    topicId: topic.id,
    authorId,
    content,
    createdAt,
    likes: [],
  };
  const topics = readTopics();
  topics.unshift(topic);
  saveTopics(topics);
  const posts = readPosts();
  posts.push(post);
  savePosts(posts);

  section.topicCount += 1;
  section.postCount += 1;
  saveSections(sections.map((s) => (s.id === section.id ? section : s)));

  updateAccount(authorId, {
    topics: account.topics + 1,
    posts: account.posts + 1,
  });

  recordLog({
    actorId: authorId,
    action: "topic_create",
    targetType: "topic",
    targetId: topic.id,
    notes: title,
  });
  return { topic, post };
}

export function updateTopic(
  id: string,
  patch: Partial<Topic>,
  actorId: string,
  options?: { skipLog?: boolean; note?: string },
) {
  const topics = readTopics();
  const idx = topics.findIndex((t) => t.id === id);
  if (idx === -1) return;
  topics[idx] = { ...topics[idx], ...patch, updatedAt: nowIso() };
  saveTopics(topics);
  if (!options?.skipLog) {
    recordLog({
      actorId,
      action: "topic_update",
      targetType: "topic",
      targetId: id,
      notes: options?.note ?? patch.title ?? undefined,
    });
  }
}

export function moveTopic(id: string, targetSectionId: string, actorId: string) {
  const topics = readTopics();
  const idx = topics.findIndex((t) => t.id === id);
  if (idx === -1) return;
  const topic = topics[idx];
  const sections = readSections();
  const oldSection = sections.find((s) => s.id === topic.sectionId);
  const newSection = sections.find((s) => s.id === targetSectionId);
  if (!newSection) return;
  topics[idx] = {
    ...topic,
    sectionId: targetSectionId,
    movedTo: targetSectionId,
    updatedAt: nowIso(),
  };
  saveTopics(topics);
  if (oldSection && oldSection.id !== newSection.id) {
    const posts = readPosts();
    const topicPostCount = posts.filter((p) => p.topicId === topic.id).length;
    const updatedSections = sections.map((section) => {
      if (section.id === oldSection.id) {
        return {
          ...section,
          topicCount: Math.max(0, section.topicCount - 1),
          postCount: Math.max(0, section.postCount - topicPostCount),
        };
      }
      if (section.id === newSection.id) {
        return {
          ...section,
          topicCount: section.topicCount + 1,
          postCount: section.postCount + topicPostCount,
        };
      }
      return section;
    });
    saveSections(updatedSections);
  }
  recordLog({
    actorId,
    action: "topic_move",
    targetType: "topic",
    targetId: id,
    notes: `в раздел ${targetSectionId}`,
  });
}

export function listPosts(topicId: string): Post[] {
  return readPosts()
    .filter((p) => p.topicId === topicId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

export function findPostById(id: string): Post | null {
  return readPosts().find((p) => p.id === id) || null;
}

function mutatePost(postId: string, updater: (post: Post) => Post) {
  const posts = readPosts();
  const idx = posts.findIndex((p) => p.id === postId);
  if (idx === -1) return null;
  posts[idx] = updater(posts[idx]);
  savePosts(posts);
  return posts[idx];
}

export function createPost({
  topicId,
  authorId,
  content,
}: {
  topicId: string;
  authorId: string;
  content: string;
}): Post {
  const topic = findTopicById(topicId);
  if (!topic) {
    throw new Error("Тема не найдена");
  }
  if (topic.locked) {
    throw new Error("Тема закрыта");
  }
  const account = findAccountById(authorId);
  if (!account) {
    throw new Error("Автор не найден");
  }
  if (isRestrictionActive(account.bans || undefined)) {
    throw new Error("Аккаунт заблокирован");
  }
  if (isRestrictionActive(account.mutes || undefined)) {
    throw new Error("Вы не можете отправлять сообщения во время мута");
  }
  const post: Post = {
    id: crypto.randomUUID(),
    topicId,
    authorId,
    content,
    createdAt: nowIso(),
    likes: [],
  };
  const posts = readPosts();
  posts.push(post);
  savePosts(posts);

  const sections = readSections();
  const section = sections.find((s) => s.id === topic.sectionId);
  if (section) {
    section.postCount += 1;
    saveSections(sections.map((s) => (s.id === section.id ? section : s)));
  }

  updateTopic(
    topicId,
    {
      replyCount: topic.replyCount + 1,
      lastPostAt: post.createdAt,
      lastPostBy: authorId,
    },
    authorId,
    { skipLog: true },
  );

  updateAccount(authorId, {
    posts: account.posts + 1,
  });

  recordLog({
    actorId: authorId,
    action: "post_create",
    targetType: "post",
    targetId: post.id,
    notes: topicId,
  });
  return post;
}

export function editPost(id: string, content: string, actorId: string) {
  mutatePost(id, (post) => ({
    ...post,
    content,
    editedAt: nowIso(),
  }));
  recordLog({
    actorId,
    action: "post_edit",
    targetType: "post",
    targetId: id,
  });
}

export function modDeletePost(id: string, actorId: string, reason?: string) {
  const post = mutatePost(id, (p) => ({
    ...p,
    deleted: true,
    deletedBy: actorId,
    content: reason ? `Удалено: ${reason}` : p.content,
  }));
  if (!post) return;
  recordLog({
    actorId,
    action: "post_delete",
    targetType: "post",
    targetId: id,
    notes: reason,
  });
}

export function restorePost(id: string, actorId: string) {
  const post = mutatePost(id, (p) => ({
    ...p,
    deleted: false,
    deletedBy: null,
  }));
  if (!post) return;
  recordLog({
    actorId,
    action: "post_restore",
    targetType: "post",
    targetId: id,
  });
}

export function togglePostLike(id: string, byAccountId: string) {
  mutatePost(id, (post) => {
    const set = new Set(post.likes);
    if (set.has(byAccountId)) {
      set.delete(byAccountId);
    } else {
      set.add(byAccountId);
    }
    const updated = { ...post, likes: Array.from(set) };
    const author = findAccountById(post.authorId);
    if (author) {
      const likes = readPosts()
        .filter((p) => p.authorId === author.id)
        .reduce((acc, p) => acc + (p.likes?.length || 0), 0);
      updateAccount(author.id, { likes });
    }
    return updated;
  });
}

export function listLatestPosts(limit = 8): Array<{ post: Post; topic: Topic | null; author: Account | null }> {
  const posts = readPosts()
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
  return posts.map((post) => ({
    post,
    topic: findTopicById(post.topicId),
    author: findAccountById(post.authorId),
  }));
}

export function listModerationLog(limit = 100) {
  return readLogs().slice(0, limit);
}

export function updateForumSettings(settings: Partial<ForumSettings>, actorId: string) {
  const current = readSettings();
  const updated = { ...current, ...settings };
  saveSettings(updated);
  recordLog({
    actorId,
    action: "settings_update",
    targetType: "settings",
    notes: JSON.stringify(settings),
  });
}

export function getForumSettings(): ForumSettings {
  return readSettings();
}

export function resetForumData() {
  removeStorage("forum:accounts");
  removeStorage("forum:sections");
  removeStorage("forum:topics");
  removeStorage("forum:posts");
  removeStorage("forum:settings");
  removeStorage("forum:counters");
  removeStorage("forum:logs");
  writeStorage("forum:initialized", false);
  initialized = false;
  ensureInitialized();
}

export function isMuted(account: Account | null): boolean {
  if (!account) return false;
  return isRestrictionActive(account.mutes || undefined);
}

export function isBanned(account: Account | null): boolean {
  if (!account) return false;
  return isRestrictionActive(account.bans || undefined);
}

