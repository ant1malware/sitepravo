import React from "react";
import { Link } from "react-router-dom";
import SimpleChat from "./components/SimpleChat";
import {
  registerAccount,
  authenticateAccount,
  clearSession,
  getSessionAccount,
  Role,
  type RemoteUser,
} from "./store/authRemote";
// forum settings now controlled on server via authRemote
import {
  listSections,
  listLatestPosts,
  listTopics,
  type Section,
  type Topic,
  type Post,
} from "./store/forumRemote";
import {
  Shield,
  ChevronRight,
  Lock,
  LogOut,
  Search,
  MessageCircle,
  Users,
  BarChart3,
  Clock,
} from "lucide-react";
import RecaptchaGate from "./components/RecaptchaGate";
import { requestEmailCode, verifyEmailCode } from "./store/emailVerifyLocal";
import ForumSubnav from "./ForumSubnav";
import { formatRelativeDate } from "./utils/time";

function Badge({ role }: { role: Role }) {
  const map: Record<Role, { color: string; text: string }> = {
    developer: { color: "#22d3ee", text: "Developer" },
    admin: { color: "#ef4444", text: "Admin" },
    moderator: { color: "#8b5cf6", text: "Moderator" },
    vip: { color: "#eab308", text: "VIP" },
    user: { color: "#94a3b8", text: "User" },
    newbie: { color: "#22d3ee", text: "Newbie" },
  };
  return (
    <span
      style={{
        border: "1px solid rgba(255,255,255,.1)",
        background: "rgba(255,255,255,.05)",
        color: map[role].color,
        padding: "2px 8px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 700,
      }}
    >
      {map[role].text}
    </span>
  );
}

function AuthGate({ onDone }: { onDone: () => void }) {
  const [mode, setMode] = React.useState<"login" | "signup">("login");
  const [nick, setNick] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [pass, setPass] = React.useState("");
  const [invite, setInvite] = React.useState("");
  const [remember, setRemember] = React.useState(true);
  const [err, setErr] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [captchaToken, setCaptchaToken] = React.useState<string | null>(null);
  const [otp, setOtp] = React.useState("");

  const ascii = /^[A-Za-z0-9_]{3,16}$/;
  const needInvite = true;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      if (mode === "login") {
        await authenticateAccount({
          usernameOrEmail: nick.trim() || email.trim(),
          password: pass,
          remember,
          otp: otp.trim() || undefined,
          captchaToken,
        });
      } else {
        if (!ascii.test(nick.trim()))
          throw new Error(
            "Никнейм: 3–16 символов латиницы/цифр/подчёркивания (A–Z a–z 0–9 _)."
          );
        await registerAccount({
          username: nick.trim(),
          email: email.trim(),
          password: pass || undefined,
          inviteCode: needInvite ? invite.trim() : "",
          remember,
          captchaToken,
        } as any);
      }
      onDone();
    } catch (e: any) {
      setErr(e?.message || "Что-то пошло не так");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[90] grid place-items-center bg-black/70 p-4">
      <form onSubmit={submit} className="w-[min(560px,92vw)] card p-5">
        <div className="flex items-center gap-2">
          <Lock size={18} />
          <b>{mode === "login" ? "Вход" : "Регистрация"}</b>
        </div>
        <div className="grid gap-3 mt-3">
          <input
            className="input"
            placeholder={
              mode === "login" ? "Логин или e-mail" : "Логин (латиница/цифры/_)"
            }
            value={nick}
            onChange={(e) => setNick(e.target.value)}
            disabled={busy}
            required
          />
          {mode === "signup" && (
            <input
              className="input"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={busy}
              required
            />
          )}
          {mode === "signup" && needInvite && (
            <input
              className="input"
              placeholder="Invite code"
              value={invite}
              onChange={(e) => setInvite(e.target.value)}
              disabled={busy}
              required
            />
          )}
          <input
            className="input"
            type="password"
            placeholder="Пароль"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            disabled={busy}
            required
          />
          {mode === "login" && (
            <input
              className="input"
              placeholder="2FA код (если включено)"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              disabled={busy}
            />
          )}
          <RecaptchaGate onToken={setCaptchaToken} />
          {err && <div style={{ color: "#ef4444", fontSize: 13 }}>{err}</div>}
          <div className="flex items-center gap-2 text-xs opacity-80">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                disabled={busy}
              />
              Запомнить меня
            </label>
          </div>
          <div className="flex gap-2">
            <button className="btn btn-primary" type="submit" disabled={busy}>
              {mode === "login" ? "Войти" : "Создать аккаунт"}
            </button>
            <button
              className="btn"
              type="button"
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              disabled={busy}
            >
              {mode === "login"
                ? "У меня нет аккаунта"
                : "У меня уже есть аккаунт"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

// Extended auth gate with captcha, email verify and 2FA input
function AuthGateX({ onDone }: { onDone: () => void }) {
  const [mode, setMode] = React.useState<"login" | "signup">("login");
  const [nick, setNick] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [pass, setPass] = React.useState("");
  const [invite, setInvite] = React.useState("");
  const [remember, setRemember] = React.useState(true);
  const [err, setErr] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [captchaToken, setCaptchaToken] = React.useState<string | null>(null);
  const [otp, setOtp] = React.useState("");
  const [verifyMode, setVerifyMode] = React.useState<false | 'email'>(false);
  const [verifyCode, setVerifyCode] = React.useState("");

  const ascii = /^[A-Za-z0-9_]{3,16}$/;
  const needInvite = true;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      if (mode === "login") {
        await authenticateAccount({ usernameOrEmail: nick.trim() || email.trim(), password: pass, remember, otp: otp.trim() || undefined, captchaToken });
        onDone();
      } else {
        if (!ascii.test(nick.trim())) throw new Error("Username: 3-16 chars (A-Z a-z 0-9 _)");
        await registerAccount({ username: nick.trim(), email: email.trim(), password: pass || undefined, inviteCode: needInvite ? invite.trim() : "", remember, captchaToken } as any);
        try { requestEmailCode(email.trim()); } catch {}
        setVerifyMode('email');
      }
    } catch (e: any) {
      setErr(e?.message || "Что-то пошло не так");
    } finally { setBusy(false); }
  };

  return (
    <div className="fixed inset-0 z-[90] grid place-items-center bg-black/70 p-4">
      <form onSubmit={submit} className="w-[min(560px,92vw)] card p-5">
        <div className="flex items-center gap-2"><Lock size={18} /><b>{mode === 'login' ? 'Вход' : 'Регистрация'}</b></div>
        {!verifyMode && (
          <div className="grid gap-3 mt-3">
            <input className="input" placeholder={mode === 'login' ? 'Логин или e-mail' : 'Логин (латиница/цифры/_ )'} value={nick} onChange={(e)=>setNick(e.target.value)} disabled={busy} required />
            {mode === 'signup' && (<input className="input" placeholder="E-mail" value={email} onChange={(e)=>setEmail(e.target.value)} disabled={busy} required />)}
            {mode === 'signup' && needInvite && (<input className="input" placeholder="Invite code" value={invite} onChange={(e)=>setInvite(e.target.value)} disabled={busy} required />)}
            <input className="input" type="password" placeholder="Пароль" value={pass} onChange={(e)=>setPass(e.target.value)} disabled={busy} required />
            {mode === 'login' && (<input className="input" placeholder="2FA код (если включено)" value={otp} onChange={(e)=>setOtp(e.target.value)} disabled={busy} />)}
            <RecaptchaGate onToken={setCaptchaToken} />
            {err && <div style={{ color: '#ef4444', fontSize: 13 }}>{err}</div>}
            <div className="flex items-center gap-2 text-xs opacity-80">
              <label className="flex items-center gap-2"><input type="checkbox" checked={remember} onChange={(e)=>setRemember(e.target.checked)} disabled={busy} />Запомнить меня</label>
            </div>
            <div className="flex gap-2">
              <button className="btn btn-primary" type="submit" disabled={busy}>{mode === 'login' ? 'Войти' : 'Зарегистрироваться'}</button>
              <button className="btn" type="button" onClick={()=>setMode(mode==='login'?'signup':'login')} disabled={busy}>{mode === 'login' ? 'Нет аккаунта? Регистрация' : 'Уже есть? Войти'}</button>
            </div>
          </div>
        )}
        {verifyMode === 'email' && (
          <div className="grid gap-3 mt-3">
            <div className="text-sm text-zinc-300">Мы отправили код подтверждения на {email}. Введите код ниже.</div>
            <input className="input" placeholder="Код подтверждения" value={verifyCode} onChange={(e)=>setVerifyCode(e.target.value)} />
            {!!err && <div style={{ color: '#ef4444', fontSize: 13 }}>{err}</div>}
            <div className="flex gap-2">
              <button type="button" className="btn btn-primary" onClick={() => { if (verifyEmailCode(email, verifyCode)) { setVerifyMode(false); onDone(); } else { setErr('Неверный код'); } }}>Подтвердить</button>
              <button type="button" className="btn" onClick={() => { requestEmailCode(email); }}>Отправить код ещё раз</button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

function Header({ me, onLogout }: { me: RemoteUser; onLogout: () => void }) {
  return (
    <header
      className="sticky top-0 z-50 border-b backdrop-blur"
      style={{ background: "rgba(10,10,14,.7)", borderColor: "var(--border)" }}
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
        <Link to="/forum" className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[color:var(--accent)]/20 text-[color:var(--accent)] shadow">
            <Shield size={18} />
          </div>
          <div>
            <div
              className="text-[11px] uppercase tracking-[0.32em]"
              style={{ color: "var(--text-2)" }}
            >
              Forum // FORUM
            </div>
            <div className="text-sm font-semibold">Правительство</div>
          </div>
        </Link>
        {(me.role === "admin" || me.role === "developer" || me.role === "moderator") && (
          <Link to="/forum/admin" className="btn ml-2">
            Панель
          </Link>
        )}
        <div className="ml-auto flex flex-wrap items-center gap-3">
          <Link
            to={`/forum/profile/${me.username}`}
            className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2 shadow-sm transition hover:border-[color:var(--accent)]/60"
          >
            <div className="hidden text-right text-xs uppercase tracking-[0.24em] text-[color:var(--text-2)] sm:block">
              Ваш профиль
            </div>
            <div className="flex items-center gap-2">
              <Badge role={me.role} />
              <div className="text-sm font-semibold">{me.username}</div>
            </div>
            <div className="hidden border-l pl-2 text-xs opacity-70 sm:block">#{me.userNumber}</div>
          </Link>
          <button
            className="btn flex items-center gap-2"
            onClick={onLogout}
            type="button"
          >
            <LogOut size={16} /> Выйти
          </button>
        </div>
      </div>
    </header>
  );
}

export default function ForumPage() {
  const [, force] = React.useReducer((x) => x + 1, 0);
  const [me, setMe] = React.useState<RemoteUser | null | undefined>(undefined);
  const [sectionsState, setSectionsState] = React.useState<Section[]>([]);
  const [topicsState, setTopicsState] = React.useState<Topic[]>([]);
  const [latestPosts, setLatestPosts] = React.useState<Post[]>([]);
  const [search, setSearch] = React.useState("");

  // session
  React.useEffect(() => {
    let alive = true;
    const read = async () => {
      try {
        const u = await getSessionAccount();
        if (alive) setMe(u);
      } catch {
        if (alive) setMe(null);
      }
    };
    read();
    const h = () => read();
    window.addEventListener("forum:session", h as any);
    window.addEventListener("storage", h as any);
    return () => {
      alive = false;
      window.removeEventListener("forum:session", h as any);
      window.removeEventListener("storage", h as any);
    };
  }, []);

  // data
  React.useEffect(() => {
    if (!me) return;
    let alive = true;
    (async () => {
      try {
        const [sections, posts, topics] = await Promise.all([
          listSections(),
          listLatestPosts(12),
          listTopics(),
        ]);
        if (alive) {
          setSectionsState(Array.isArray(sections) ? sections : []);
          setLatestPosts(Array.isArray(posts) ? posts : []);
          setTopicsState(Array.isArray(topics) ? topics : []);
        }
      } catch {
        if (alive) {
          setSectionsState([]);
          setLatestPosts([]);
          setTopicsState([]);
        }
      }
    })();
    return () => {
      alive = false;
    };
  }, [me]);

  const topicsById = React.useMemo(() => {
    const map = new Map<string, Topic>();
    for (const topic of topicsState || []) {
      if (topic?.id) map.set(topic.id, topic);
    }
    return map;
  }, [topicsState]);

  const lastActivityBySection = React.useMemo(() => {
    const map = new Map<string, { topicId: string; topicTitle: string; when: string | null; by: string | null; replies: number }>();
    for (const topic of topicsState || []) {
      if (!topic?.sectionId) continue;
      const when = topic.lastPostAt || topic.updatedAt || topic.createdAt || null;
      const prev = map.get(topic.sectionId);
      const whenTs = when ? new Date(when).getTime() : 0;
      const prevTs = prev?.when ? new Date(prev.when).getTime() : 0;
      if (!prev || whenTs >= prevTs) {
        map.set(topic.sectionId, {
          topicId: topic.id,
          topicTitle: topic.title,
          when,
          by: topic.lastPostBy || topic.authorId || null,
          replies: topic.replyCount ?? 0,
        });
      }
    }
    return map;
  }, [topicsState]);

  const sectionTotals = React.useMemo(
    () =>
      (sectionsState || []).reduce(
        (acc, section) => {
          acc.sections += 1;
          acc.topics += section.topicCount ?? 0;
          acc.posts += section.postCount ?? 0;
          return acc;
        },
        { sections: 0, topics: 0, posts: 0 }
      ),
    [sectionsState]
  );

  const filteredSections = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    const list = Array.isArray(sectionsState) ? [...sectionsState] : [];
    const result = query
      ? list.filter((section) => {
          const title = section.title?.toLowerCase?.() ?? "";
          const desc = section.description?.toLowerCase?.() ?? "";
          return title.includes(query) || desc.includes(query);
        })
      : list;
    return result.sort((a, b) => {
      const orderDiff = (a.order ?? 0) - (b.order ?? 0);
      if (orderDiff !== 0) return orderDiff;
      return a.title.localeCompare(b.title);
    });
  }, [sectionsState, search]);

  const enrichedLatestPosts = React.useMemo(
    () =>
      (latestPosts || []).map((post) => ({
        post,
        topic: post?.topicId ? topicsById.get(post.topicId) || null : null,
      })),
    [latestPosts, topicsById]
  );

  if (me === undefined)
    return <div style={{ minHeight: "100vh", background: "#0c0d12" }} />;
  if (!me)
    return (
      <>
        <AuthGateX onDone={() => force()} />
        <div style={{ minHeight: "100vh", background: "#0c0d12" }} />
      </>
    );

  // server settings available via getServerSettings() if needed

  return (
    <main
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(900px 600px at 15% -8%, rgba(99,102,241,.18), transparent 65%), radial-gradient(1100px 700px at 88% 10%, rgba(168,85,247,.16), transparent 65%), #0d0d12",
      }}
    >
      <Header
        me={me}
        onLogout={() => {
          clearSession();
          force();
        }}
      />

      <div className="mx-auto w-full max-w-6xl space-y-8 px-4 py-6">
        <ForumSubnav />

        <section className="grid gap-6 lg:grid-cols-[1.65fr_1fr]">
          <div className="card overflow-hidden">
            <div className="relative overflow-hidden rounded-[18px] bg-gradient-to-br from-white/10 via-white/5 to-transparent">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.25),transparent_55%)]" />
              <div className="relative flex flex-col gap-4 px-6 py-8">
                <div className="text-[11px] uppercase tracking-[0.32em] text-[color:var(--text-2)]">
                  Добро пожаловать
                </div>
                <h1 className="text-3xl font-black leading-tight sm:text-4xl">
                  Форум Правительства
                </h1>
                <p className="max-w-2xl text-sm text-slate-300/80">
                  Обсуждайте реформы, делитесь инициативами и находите союзников. Разделы ниже помогут быстро перейти к нужной теме.
                </p>
                <div className="mt-2 grid gap-3 sm:grid-cols-2">
                  <Link
                    to={`/forum/profile/${me.username}`}
                    className="btn btn-primary flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={16} /> Мои обсуждения
                  </Link>
                  <Link
                    to="/forum/questions"
                    className="btn flex items-center justify-center gap-2"
                  >
                    <BarChart3 size={16} /> Вопросы и ответы
                  </Link>
                  <Link
                    to="/forum/members"
                    className="btn flex items-center justify-center gap-2"
                  >
                    <Users size={16} /> Участники форума
                  </Link>
                  <Link to="/settings" className="btn flex items-center justify-center gap-2">
                    <Shield size={16} /> Настройки профиля
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="card p-5">
              <div className="text-[11px] uppercase tracking-[0.32em] text-[color:var(--text-2)]">
                Поиск по форуму
              </div>
              <label className="relative mt-3 block">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input w-full pl-10"
                  placeholder="Найдите раздел или обсуждение"
                />
              </label>
              <div className="mt-3 text-xs text-slate-400">
                Поиск выполняется моментально по заголовкам и описаниям разделов.
              </div>
            </div>

            <div className="card p-5">
              <div className="text-[11px] uppercase tracking-[0.32em] text-[color:var(--text-2)]">
                Статистика сообщества
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                  <div className="text-[11px] uppercase tracking-[0.3em] text-slate-400">
                    Разделы
                  </div>
                  <div className="mt-2 text-2xl font-semibold">{sectionTotals.sections}</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                  <div className="text-[11px] uppercase tracking-[0.3em] text-slate-400">
                    Темы
                  </div>
                  <div className="mt-2 text-2xl font-semibold">{sectionTotals.topics}</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                  <div className="text-[11px] uppercase tracking-[0.3em] text-slate-400">
                    Сообщения
                  </div>
                  <div className="mt-2 text-2xl font-semibold">{sectionTotals.posts}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="forum-sections" className="card overflow-hidden">
          <header className="flex flex-col gap-2 border-b border-white/10 px-5 py-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-[0.32em] text-[color:var(--text-2)]">
                Разделы
              </div>
              <div className="text-sm text-slate-300/80">
                Организованы по направлениям — выбирайте, чтобы перейти к темам.
              </div>
            </div>
            <div className="hidden text-[11px] uppercase tracking-[0.28em] text-slate-400 md:flex md:gap-12">
              <span>Темы</span>
              <span>Сообщения</span>
              <span>Последняя активность</span>
            </div>
          </header>
          <div className="divide-y divide-white/5">
            {filteredSections.map((section) => {
              const activity = lastActivityBySection.get(section.id);
              return (
                <div
                  key={section.id}
                  className="flex flex-col gap-3 px-5 py-4 transition hover:bg-white/5 md:flex-row md:items-center"
                >
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/forum/section/${section.id}`}
                      className="flex items-start gap-3"
                    >
                      <div className="mt-1 hidden rounded-full bg-cyan-400/20 p-1 text-cyan-300 md:block">
                        <ChevronRight size={16} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-lg font-semibold leading-tight">{section.title}</div>
                        {section.description && (
                          <div className="mt-1 text-sm text-slate-300/80 line-clamp-2">
                            {section.description}
                          </div>
                        )}
                      </div>
                    </Link>
                  </div>
                  <div className="grid gap-2 text-sm text-slate-300/90 md:grid-cols-[100px_120px_minmax(0,220px)] md:items-center md:text-right">
                    <div className="md:justify-self-end">
                      <div className="text-xs uppercase tracking-[0.26em] text-slate-500">Темы</div>
                      <div className="font-semibold">{section.topicCount ?? 0}</div>
                    </div>
                    <div className="md:justify-self-end">
                      <div className="text-xs uppercase tracking-[0.26em] text-slate-500">Сообщения</div>
                      <div className="font-semibold">{section.postCount ?? 0}</div>
                    </div>
                    <div className="md:justify-self-end">
                      {activity ? (
                        <div className="text-left text-xs leading-relaxed text-slate-400 md:text-right">
                          <div className="font-semibold text-slate-200">
                            <Link to={`/forum/topic/${activity.topicId}`} className="hover:underline">
                              {activity.topicTitle}
                            </Link>
                          </div>
                          <div>
                            {activity.by ? `от ${activity.by}` : "Новый участник"}
                          </div>
                          <div className="flex items-center gap-1 text-[11px] uppercase tracking-[0.3em] text-slate-500 md:justify-end">
                            <Clock size={12} /> {formatRelativeDate(activity.when)}
                          </div>
                        </div>
                      ) : (
                        <div className="text-xs text-slate-500">Пока нет активности</div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            {!filteredSections.length && (
              <div className="px-5 py-6 text-sm text-slate-400">
                Подходящих разделов не найдено. Попробуйте изменить запрос.
              </div>
            )}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.4fr_.9fr]">
          <div className="card overflow-hidden">
            <div className="border-b border-white/10 px-5 py-3 text-[11px] uppercase tracking-[0.32em] text-[color:var(--text-2)]">
              Последние сообщения
            </div>
            <div className="divide-y divide-white/5">
              {enrichedLatestPosts.length ? (
                enrichedLatestPosts.map(({ post, topic }) => (
                  <Link
                    key={post.id}
                    to={topic ? `/forum/topic/${topic.id}` : "/forum"}
                    className="flex flex-col gap-2 px-5 py-4 transition hover:bg-white/5"
                  >
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-cyan-300">
                      <span>#{post.id.slice(0, 6)}</span>
                      <span>•</span>
                      <span>{formatRelativeDate(post.createdAt)}</span>
                    </div>
                    <div className="text-sm font-semibold leading-snug text-slate-100">
                      {topic?.title ?? "Обсуждение"}
                    </div>
                    {post.content && (
                      <div className="line-clamp-2 text-sm text-slate-400">
                        {post.content}
                      </div>
                    )}
                  </Link>
                ))
              ) : (
                <div className="px-5 py-6 text-sm text-slate-400">
                  Сообщений пока нет — будьте первым, кто начнет обсуждение.
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <div className="border-b border-white/10 px-5 py-3 text-[11px] uppercase tracking-[0.32em] text-[color:var(--text-2)]">
              Лента активности
            </div>
            <div className="p-5 text-sm text-slate-300/80">
              Просматривайте, что происходит прямо сейчас: популярные темы находятся в верхних строках разделов. Используйте быстрые ссылки выше, чтобы подключиться к сообществу.
            </div>
          </div>
        </section>

        <div className="card">
          <div className="border-b px-4 py-2 text-xs uppercase tracking-[0.3em]" style={{ borderColor: "var(--border)", color: "var(--text-2)" }}>
            Retro chat
          </div>
          <div className="p-4">
            <SimpleChat />
          </div>
        </div>
      </div>
    </main>
  );
}
