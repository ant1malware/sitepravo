import React from "react";
import {
  Routes,
  Route,
  Link,
  NavLink,
  useParams,
  useLocation,
} from "react-router-dom";
import {
  Account,
  Section,
  Topic,
  Post,
  authenticateAccount,
  registerAccount,
  clearSession,
  getSessionAccount,
  listSections,
  listTopics,
  listLatestPosts,
  listPosts,
  findAccountById,
  findTopicById,
  updateTopic,
  moveTopic,
  createTopic,
  createPost,
  togglePostLike,
  modDeletePost,
  restorePost,
  getForumSettings,
  isMuted,
  isBanned,
} from "./store/forumStore";
import { useForumSessionWatcher } from "./forumSession";
import RetroChat from "./components/RetroChat";
import {
  ArrowLeft,
  ArrowUpRight,
  Crown,
  Lock,
  LockOpen,
  LogOut,
  MessageCircle,
  Pin,
  PinOff,
  Plus,
  RefreshCcw,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  Trash2,
} from "lucide-react";

const ForumDataContext = React.createContext<{
  me: Account;
  refresh: () => void;
  tick: number;
} | null>(null);

function useForumData() {
  const ctx = React.useContext(ForumDataContext);
  if (!ctx) {
    throw new Error("ForumDataContext not found");
  }
  return ctx;
}

export default function ForumPage() {
  const session = useForumSessionWatcher();
  const [tick, setTick] = React.useState(0);
  const [me, setMe] = React.useState<Account | null>(() => getSessionAccount());
  const refresh = React.useCallback(() => {
    setTick((t) => t + 1);
    setMe(getSessionAccount());
  }, []);

  React.useEffect(() => {
    if (session?.userId) {
      const acc = findAccountById(session.userId);
      setMe(acc ?? null);
    } else {
      setMe(null);
    }
  }, [session, tick]);

  const settings = React.useMemo(() => getForumSettings(), [tick]);

  if (!me) {
    return <ForumGate onSuccess={refresh} settings={settings} />;
  }

  if (isBanned(me)) {
    return (
      <div className="forum-theme min-h-dvh bg-[var(--bg-1)] text-[var(--text-1)]">
        <main className="mx-auto flex min-h-dvh max-w-xl flex-col items-center justify-center gap-4 px-6 text-center">
          <ShieldCheck className="h-12 w-12 text-[var(--accent)]" />
          <h1 className="text-3xl font-bold">Доступ ограничен</h1>
          <p className="text-sm text-[var(--text-2)]">
            Ваш аккаунт временно заблокирован. {me.bans?.reason && <><br />Причина: {me.bans.reason}</>}
          </p>
          <button
            className="btn btn-primary"
            onClick={() => {
              clearSession();
              setMe(null);
            }}
          >
            Выйти
          </button>
        </main>
      </div>
    );
  }

  return (
    <ForumDataContext.Provider value={{ me, refresh, tick }}>
      <div className="forum-theme min-h-dvh bg-[var(--bg-1)] text-[var(--text-1)]">
          <main className="mx-auto max-w-6xl px-4 pb-16 pt-10">
            <ForumHero
              account={me}
              settings={settings}
              onLogout={() => {
                clearSession();
                setMe(null);
              }}
            />
            <div className="mt-6">
              <RetroChat />
            </div>
            <div className="mt-8 grid gap-6 lg:grid-cols-[260px_1fr]">
              <ForumSidebar />
              <div className="space-y-6">
                <Routes>
                <Route index element={<ForumHome />} />
                <Route path="section/:sectionId" element={<SectionView />} />
                <Route path="topic/:topicId" element={<TopicView />} />
                <Route path="latest" element={<LatestFeed />} />
              </Routes>
            </div>
          </div>
        </main>
      </div>
    </ForumDataContext.Provider>
  );
}

function ForumHero({
  account,
  settings,
  onLogout,
}: {
  account: Account;
  settings: ReturnType<typeof getForumSettings>;
  onLogout: () => void;
}) {
  const heroTitle = (settings.heroTitle || "SKY").toUpperCase();
  const heroSubtitle =
    settings.heroSubtitle || "Минимальный тёмный форум SKY. Только своё.";
  const heroMessage =
    settings.heroMessage ||
    "Создаём темы, модерируем пространство и держим связь 24/7.";

  return (
    <section className="relative overflow-hidden rounded-[32px] border border-[var(--border)] bg-[var(--surface)] px-8 py-12 text-center">
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-70"
        style={{
          background:
            "radial-gradient(60% 80% at 10% 20%, rgba(139,92,246,0.45), transparent 70%)," +
            "radial-gradient(70% 90% at 90% 30%, rgba(34,211,238,0.35), transparent 70%)",
        }}
      />
      <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-4 text-center">
        <span className="text-[11px] uppercase tracking-[0.6em] text-[var(--text-2)]/80">
          sky forum access
        </span>
        <h1
          className="text-5xl font-black uppercase tracking-[0.4em] text-transparent drop-shadow-[0_28px_80px_rgba(0,0,0,0.55)] md:text-6xl"
          style={{
            backgroundImage: "linear-gradient(90deg, #f4f5ff 0%, #a855f7 100%)",
            WebkitBackgroundClip: "text",
          }}
        >
          {heroTitle}
        </h1>
        <p className="max-w-2xl text-sm text-[var(--text-2)]">{heroSubtitle}</p>
        <div className="flex flex-wrap justify-center gap-2 text-[10px] uppercase tracking-[0.35em] text-[var(--text-2)]/80">
          <span className="rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-4 py-1">
            user #{account.userNumber}
          </span>
          <span className="rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-4 py-1">
            role {account.role}
          </span>
          <span className="rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-4 py-1">
            topics {account.topics}
          </span>
          <span className="rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-4 py-1">
            posts {account.posts}
          </span>
        </div>
      </div>
      <div className="relative mt-8 grid gap-3 text-left md:grid-cols-2">
        <div className="rounded-2xl border border-[#1f3624] bg-[#0f1914] px-5 py-4 text-emerald-100 shadow-[0_24px_50px_-32px_rgba(16,185,129,0.65)]">
          <p className="text-[10px] uppercase tracking-[0.45em] text-emerald-300/70">
            important rate
          </p>
          <p className="mt-3 text-sm leading-relaxed">{heroMessage}</p>
        </div>
        <div className="rounded-2xl border border-[#3a1c1c] bg-[#190f14] px-5 py-4 text-rose-100 shadow-[0_24px_50px_-32px_rgba(244,63,94,0.55)]">
          <p className="text-[10px] uppercase tracking-[0.45em] text-rose-300/70">
            connection alert
          </p>
          <p className="mt-3 text-sm leading-relaxed">
            Если вы заходите из регионов с Connection Failed, включите VPN или
            прокси и обновите вкладку. Мы следим за статусом узлов и дадим апдейт
            в Latest.
          </p>
        </div>
      </div>
      <div className="relative mt-8 flex flex-wrap justify-center gap-3 text-[11px] uppercase tracking-[0.35em] text-[var(--text-2)]">
        <Link
          to={`/forum/profile/${account.username}`}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-4 py-2 text-[var(--text-1)] transition hover:bg-[var(--surface-2)]"
        >
          профиль
        </Link>
        {(account.role === "admin" || account.role === "moderator") && (
          <Link
            to="/forum/admin"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)] bg-[var(--accent)]/10 px-4 py-2 text-[var(--accent)] transition hover:bg-[var(--accent)]/20"
          >
            панель модерации
          </Link>
        )}
        <button
          className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-4 py-2 text-[var(--text-1)] transition hover:bg-[var(--surface-2)]"
          onClick={onLogout}
        >
          <LogOut className="h-4 w-4" /> выйти
        </button>
      </div>
    </section>
  );
}

function ForumSidebar() {
  const { tick } = useForumData();
  const sections = React.useMemo(() => listSections(), [tick]);
  const location = useLocation();

  return (
    <aside className="space-y-4">
      <nav className="card space-y-1 text-sm">
        <SidebarLink to="/forum" label="Обзор" icon={<Sparkles className="h-4 w-4" />} exact />
        {sections.map((section) => (
          <SidebarLink
            key={section.id}
            to={`/forum/section/${section.id}`}
            label={section.title}
            icon={<span className="text-lg">{section.icon || "★"}</span>}
            badge={`${section.topicCount}`}
          />
        ))}
        <SidebarLink to="/forum/latest" label="Latest" icon={<ArrowUpRight className="h-4 w-4" />} />
      </nav>
      <div className="card text-sm text-[var(--text-2)]">
        <p>Следи за порядком и поддерживай уважительную атмосферу. Нарушения караются банами без предупреждения.</p>
      </div>
      <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface-2)] p-4 text-xs text-[var(--text-2)]">
        Токены темы доступны в <code>src/index.css</code>. Используйте <span className="font-semibold text-[var(--accent)]">accent gradient</span> для своих карточек.
      </div>
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 text-xs text-[var(--text-2)]">
        Текущий путь: {location.pathname}
      </div>
    </aside>
  );
}

function SidebarLink({
  to,
  label,
  icon,
  badge,
  exact,
}: {
  to: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  exact?: boolean;
}) {
  return (
    <NavLink
      to={to}
      end={exact}
      className={({ isActive }) =>
        `flex items-center justify-between rounded-xl px-3 py-2 transition ${isActive ? "bg-[var(--surface-2)] text-[var(--accent)]" : "hover:bg-[var(--surface-2)]"}`
      }
    >
      <span className="flex items-center gap-2">
        {icon}
        <span>{label}</span>
      </span>
      {badge ? <span className="rounded-full bg-[var(--surface)] px-2 py-0.5 text-xs text-[var(--text-2)]">{badge}</span> : null}
    </NavLink>
  );
}

function ForumHome() {
  const { tick } = useForumData();
  const sections = React.useMemo(() => listSections(), [tick]);
  const latest = React.useMemo(() => listLatestPosts(6), [tick]);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
      <div className="card space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Разделы</h2>
            <p className="text-sm text-[var(--text-2)]">Выбирай пространство для обсуждений.</p>
          </div>
          <Star className="h-5 w-5 text-[var(--accent)]" />
        </header>
        <div className="space-y-3">
          {sections.map((section) => (
            <Link
              key={section.id}
              to={`/forum/section/${section.id}`}
              className="group block rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-4 transition hover:border-[var(--accent)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-sm text-[var(--text-2)]">
                    <span className="text-2xl leading-none">{section.icon || "☄"}</span>
                    <span>{new Date(section.createdAt).toLocaleDateString("ru-RU")}</span>
                  </div>
                  <h3 className="mt-1 text-lg font-semibold text-[var(--text-1)]">{section.title}</h3>
                  <p className="text-sm text-[var(--text-2)]">{section.description}</p>
                </div>
                <div className="text-right text-xs text-[var(--text-2)]">
                  <div><strong className="text-[var(--text-1)]">{section.topicCount}</strong> тем</div>
                  <div><strong className="text-[var(--text-1)]">{section.postCount}</strong> постов</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="card space-y-4">
        <header className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Latest</h2>
            <p className="text-sm text-[var(--text-2)]">Свежие сообщения с форума.</p>
          </div>
          <Link to="/forum/latest" className="btn btn-ghost text-xs">
            Смотреть все
          </Link>
        </header>
        <div className="space-y-3">
          {latest.map(({ post, topic, author }) => (
            <Link
              key={post.id}
              to={topic ? `/forum/topic/${topic.id}` : "/forum"}
              className="block rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-4 transition hover:border-[var(--accent)]"
            >
              <div className="flex items-center justify-between text-xs text-[var(--text-2)]">
                <span>{author?.username || "Удалён"}</span>
                <span>{new Date(post.createdAt).toLocaleString("ru-RU")}</span>
              </div>
              <div className="mt-2 line-clamp-2 text-sm text-[var(--text-1)]">{post.content}</div>
              <div className="mt-3 flex items-center gap-2 text-xs text-[var(--text-2)]">
                <MessageCircle className="h-3.5 w-3.5" /> {topic?.title || "Тема удалена"}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function SectionView() {
  const { sectionId = "" } = useParams();
  const { me, refresh, tick } = useForumData();
  const sections = React.useMemo(() => listSections(), [tick]);
  const section = sections.find((s) => s.id === sectionId);
  const topics = React.useMemo(() => listTopics(sectionId), [tick, sectionId]);
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  if (!section) {
    return (
      <div className="card">
        <h2 className="text-xl font-semibold">Раздел не найден</h2>
        <p className="text-sm text-[var(--text-2)]">Вернитесь к <Link to="/forum">списку разделов</Link>.</p>
      </div>
    );
  }

  const canModerate = me.role === "admin" || me.role === "moderator" || section.moderatorIds.includes(me.id);
  const muted = isMuted(me);

  const submit = () => {
    try {
      if (!title.trim() || !content.trim()) {
        setError("Заполните заголовок и сообщение");
        return;
      }
      createTopic({ sectionId, title: title.trim(), authorId: me.id, content: content.trim() });
      setTitle("");
      setContent("");
      setError(null);
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось создать тему");
    }
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Link to="/forum" className="inline-flex items-center gap-1 text-xs text-[var(--text-2)]">
              <ArrowLeft className="h-3.5 w-3.5" /> Все разделы
            </Link>
            <h2 className="mt-1 text-2xl font-semibold">{section.title}</h2>
            <p className="text-sm text-[var(--text-2)]">{section.description}</p>
          </div>
          {canModerate ? (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-xs text-[var(--text-2)]">
              Модераторы: {section.moderatorIds.length ? section.moderatorIds.map((id) => findAccountById(id)?.username || "—").join(", ") : "нет"}
            </div>
          ) : null}
        </div>
      </div>

      <div className="card space-y-4">
        <header className="flex items-center justify-between">
          <h3 className="font-semibold">Создать тему</h3>
          {muted && <span className="text-xs text-red-400">Вы в муте</span>}
        </header>
        <input
          className="input"
          placeholder="Заголовок темы"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={muted}
        />
        <textarea
          className="input min-h-[140px]"
          placeholder="Первое сообщение"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={muted}
        />
        {error ? <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">{error}</div> : null}
        <button className="btn btn-primary" onClick={submit} disabled={muted}>
          <Plus className="h-4 w-4" /> Создать тему
        </button>
      </div>

      <div className="space-y-3">
        {topics.map((topic) => (
          <TopicRow key={topic.id} topic={topic} section={section} canModerate={canModerate} />
        ))}
      </div>
    </div>
  );
}

function TopicRow({ topic, section, canModerate }: { topic: Topic; section: Section; canModerate: boolean }) {
  const { refresh, me } = useForumData();
  const [busy, setBusy] = React.useState(false);

  const togglePin = async () => {
    setBusy(true);
    updateTopic(topic.id, { pinned: !topic.pinned }, me.id, { note: topic.pinned ? "unpin" : "pin" });
    refresh();
    setBusy(false);
  };

  const toggleLock = async () => {
    setBusy(true);
    updateTopic(topic.id, { locked: !topic.locked }, me.id, { note: topic.locked ? "unlock" : "lock" });
    refresh();
    setBusy(false);
  };

  const handleMove = (target: string) => {
    if (!target) return;
    setBusy(true);
    moveTopic(topic.id, target, me.id);
    refresh();
    setBusy(false);
  };

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link to={`/forum/topic/${topic.id}`} className="text-lg font-semibold text-[var(--text-1)]">
            {topic.title}
          </Link>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-[var(--text-2)]">
            <span>Создано: {new Date(topic.createdAt).toLocaleString("ru-RU")}</span>
            <span>Ответов: {topic.replyCount}</span>
            <span>Просмотров: {topic.viewCount}</span>
            {topic.pinned ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-[var(--surface-2)] px-2 py-0.5 text-[var(--accent)]">
                <Pin className="h-3 w-3" /> Закреплено
              </span>
            ) : null}
            {topic.locked ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-red-500/20 px-2 py-0.5 text-red-300">
                <Lock className="h-3 w-3" /> Закрыто
              </span>
            ) : null}
          </div>
        </div>
        {canModerate ? (
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <button className="btn btn-ghost" onClick={togglePin} disabled={busy}>
              {topic.pinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
              {topic.pinned ? "Открепить" : "Закрепить"}
            </button>
            <button className="btn btn-ghost" onClick={toggleLock} disabled={busy}>
              {topic.locked ? <LockOpen className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
              {topic.locked ? "Открыть" : "Закрыть"}
            </button>
            <select
              className="input w-auto text-xs"
              defaultValue=""
              onChange={(e) => handleMove(e.target.value)}
              disabled={busy}
            >
              <option value="">Переместить…</option>
              {listSections()
                .filter((s) => s.id !== section.id)
                .map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
            </select>
          </div>
        ) : null}
      </div>
      <div className="mt-3 text-xs text-[var(--text-2)]">
        Последний ответ: {new Date(topic.lastPostAt).toLocaleString("ru-RU")} • {findAccountById(topic.lastPostBy)?.username || "—"}
      </div>
    </div>
  );
}

function TopicView() {
  const { topicId = "" } = useParams();
  const { me, refresh, tick } = useForumData();
  const topic = React.useMemo(() => findTopicById(topicId), [tick, topicId]);
  const posts = React.useMemo(() => listPosts(topicId), [tick, topicId]);
  const sections = React.useMemo(() => listSections(), [tick]);
  const section = sections.find((s) => s.id === topic?.sectionId) || null;
  const [content, setContent] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const muted = isMuted(me);

  React.useEffect(() => {
    setContent("");
  }, [topicId]);

  React.useEffect(() => {
    if (topic) {
      updateTopic(
        topic.id,
        { viewCount: topic.viewCount + 1 },
        me.id,
        { skipLog: true },
      );
      refresh();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicId]);

  if (!topic) {
    return (
      <div className="card">
        <h2 className="text-xl font-semibold">Тема не найдена</h2>
        <Link to="/forum" className="text-sm text-[var(--text-2)]">Вернуться к разделам</Link>
      </div>
    );
  }

  const canModerate = section ? me.role === "admin" || me.role === "moderator" || section.moderatorIds.includes(me.id) : false;

  const submit = () => {
    try {
      if (!content.trim()) {
        setError("Введите сообщение");
        return;
      }
      createPost({ topicId, authorId: me.id, content: content.trim() });
      setContent("");
      setError(null);
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось отправить сообщение");
    }
  };

  return (
    <div className="space-y-6">
      <div className="card space-y-2">
        <Link to={`/forum/section/${topic.sectionId}`} className="inline-flex items-center gap-1 text-xs text-[var(--text-2)]">
          <ArrowLeft className="h-3.5 w-3.5" /> Назад к разделу
        </Link>
        <h2 className="text-2xl font-semibold">{topic.title}</h2>
        <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--text-2)]">
          <span>Создал: {findAccountById(topic.authorId)?.username}</span>
          <span>Ответов: {topic.replyCount}</span>
          <span>Просмотров: {topic.viewCount}</span>
          {topic.pinned ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--surface-2)] px-2 py-0.5 text-[var(--accent)]">
              <Pin className="h-3 w-3" /> Закреплено
            </span>
          ) : null}
          {topic.locked ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-red-500/20 px-2 py-0.5 text-red-300">
              <Lock className="h-3 w-3" /> Закрыто
            </span>
          ) : null}
        </div>
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <PostBlock key={post.id} post={post} canModerate={canModerate} />
        ))}
      </div>

      <div className="card space-y-3">
        <header className="flex items-center justify-between">
          <h3 className="font-semibold">Ответить</h3>
          {muted && <span className="text-xs text-red-400">Вы в муте</span>}
        </header>
        <textarea
          className="input min-h-[160px]"
          placeholder="Введите ответ"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={topic.locked || muted}
        />
        {error ? <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">{error}</div> : null}
        <button className="btn btn-primary" onClick={submit} disabled={topic.locked || muted}>
          <Send className="h-4 w-4" /> Отправить
        </button>
      </div>
    </div>
  );
}

function PostBlock({ post, canModerate }: { post: Post; canModerate: boolean }) {
  const { me, refresh } = useForumData();
  const author = findAccountById(post.authorId);
  const liked = post.likes.includes(me.id);

  const toggleLike = () => {
    togglePostLike(post.id, me.id);
    refresh();
  };

  const moderate = (type: "delete" | "restore") => {
    if (type === "delete") {
      modDeletePost(post.id, me.id, "Модераторское удаление");
    } else {
      restorePost(post.id, me.id);
    }
    refresh();
  };

  return (
    <article className={`rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 ${post.deleted ? "opacity-70" : ""}`}>
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 overflow-hidden rounded-full border border-[var(--border)] bg-[var(--surface-2)]">
          {author?.profile.avatarData ? (
            <img src={author.profile.avatarData} alt={author.username} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-lg">{author?.username.charAt(0).toUpperCase()}</div>
          )}
        </div>
        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--text-2)]">
            <div className="flex items-center gap-2">
              <Link to={`/forum/profile/${author?.username || "unknown"}`} className="font-semibold text-[var(--text-1)]">
                {author?.username || "Удалён"}
              </Link>
              {author?.role === "admin" && <Crown className="h-3.5 w-3.5 text-yellow-400" />}
              {author?.role === "moderator" && <ShieldCheck className="h-3.5 w-3.5 text-[var(--accent)]" />}
            </div>
            <span>{new Date(post.createdAt).toLocaleString("ru-RU")}</span>
          </div>
          <div className={`whitespace-pre-wrap text-sm leading-relaxed ${post.deleted ? "italic" : ""}`}>
            {post.content}
          </div>
          {author?.profile.signature && !post.deleted ? (
            <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-xs text-[var(--text-2)]">
              {author.profile.signature}
            </div>
          ) : null}
          <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--text-2)]">
            <button className={`inline-flex items-center gap-1 rounded-full px-3 py-1 transition ${liked ? "bg-[var(--accent)] text-white" : "bg-[var(--surface-2)]"}`} onClick={toggleLike}>
              <Star className="h-3.5 w-3.5" /> {post.likes.length}
            </button>
            {canModerate && (
              <div className="flex items-center gap-2">
                <button className="btn btn-ghost text-xs" onClick={() => moderate(post.deleted ? "restore" : "delete")}>
                  {post.deleted ? <RefreshCcw className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
                  {post.deleted ? "Восстановить" : "Удалить"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

function LatestFeed() {
  const { tick } = useForumData();
  const latest = React.useMemo(() => listLatestPosts(20), [tick]);
  return (
    <div className="card space-y-4">
      <header className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Последние сообщения</h2>
        <ArrowUpRight className="h-5 w-5 text-[var(--accent)]" />
      </header>
      <div className="space-y-3">
        {latest.map(({ post, topic, author }) => (
          <Link
            key={post.id}
            to={topic ? `/forum/topic/${topic.id}` : "/forum"}
            className="block rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-4 transition hover:border-[var(--accent)]"
          >
            <div className="flex items-center justify-between text-xs text-[var(--text-2)]">
              <span>{author?.username || "Удалён"}</span>
              <span>{new Date(post.createdAt).toLocaleString("ru-RU")}</span>
            </div>
            <div className="mt-2 line-clamp-3 text-sm text-[var(--text-1)]">{post.content}</div>
            <div className="mt-3 flex items-center gap-2 text-xs text-[var(--text-2)]">
              <MessageCircle className="h-3.5 w-3.5" /> {topic?.title || "Тема удалена"}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function ForumGate({ onSuccess, settings }: { onSuccess: () => void; settings: ReturnType<typeof getForumSettings> }) {
  const [mode, setMode] = React.useState<"login" | "register">("login");
  const [remember, setRemember] = React.useState(true);
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [invite, setInvite] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);

  const submit = async () => {
    try {
      setBusy(true);
      setError(null);
      if (mode === "login") {
        const { account } = authenticateAccount({ usernameOrEmail: username, remember });
        if (account) {
          onSuccess();
        }
      } else {
        const { account } = registerAccount({ username, email, remember, inviteCode: invite });
        if (account) {
          onSuccess();
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка авторизации");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="forum-theme min-h-dvh bg-[var(--bg-1)] text-[var(--text-1)]">
      <main className="mx-auto flex min-h-dvh max-w-4xl flex-col items-center justify-center gap-8 px-6">
        <div className="w-full rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-1 text-xs uppercase tracking-[0.3em] text-[var(--text-2)]">
            <Sparkles className="h-3 w-3" /> SKY FORUM
          </div>
          <h1 className="mt-4 text-4xl font-black uppercase">{settings.heroTitle || "SKY Forum"}</h1>
          <p className="mt-2 text-[var(--text-2)]">
            {settings.heroSubtitle || "Доступ только для зарегистрированных пользователей."}
          </p>
          <p className="mt-6 text-sm text-[var(--text-2)]">
            Форум закрыт для гостей. Вход доступен по логину или e-mail. Регистрация только с английским ником и активным инвайт-кодом.
          </p>
        </div>
        <div className="w-full max-w-lg rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <div className="mb-4 flex items-center gap-2 text-sm">
            <button
              className={`flex-1 rounded-xl px-4 py-2 text-sm font-semibold transition ${mode === "login" ? "bg-[var(--surface-2)]" : "hover:bg-[var(--surface-2)]"}`}
              onClick={() => setMode("login")}
            >
              Войти
            </button>
            <button
              className={`flex-1 rounded-xl px-4 py-2 text-sm font-semibold transition ${mode === "register" ? "bg-[var(--surface-2)]" : "hover:bg-[var(--surface-2)]"}`}
              onClick={() => setMode("register")}
            >
              Регистрация
            </button>
          </div>
          <div className="space-y-3">
            <input
              className="input"
              placeholder={mode === "login" ? "Ник или e-mail" : "Ник (латиница)"}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {mode === "register" ? (
              <input
                className="input"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
              />
            ) : null}
            {mode === "register" ? (
              <input
                className="input"
                placeholder="Инвайт-код (16 символов)"
                value={invite}
                onChange={(e) =>
                  setInvite(
                    e.target.value
                      .toUpperCase()
                      .replace(/[^A-Z0-9]/g, "")
                      .slice(0, 16),
                  )
                }
              />
            ) : null}
            <label className="flex items-center gap-2 text-xs text-[var(--text-2)]">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
              Запомнить устройство
            </label>
            {error ? (
              <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">{error}</div>
            ) : null}
            <button className="btn btn-primary w-full" onClick={submit} disabled={busy}>
              <ShieldCheck className="h-4 w-4" /> {mode === "login" ? "Войти" : "Создать аккаунт"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

