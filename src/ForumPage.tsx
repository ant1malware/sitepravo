// src/ForumPage.tsx
import React from "react";
import { Link } from "react-router-dom";
import SimpleChat from "./components/SimpleChat";

import {
  registerAccount,
  authenticateAccount,
  clearSession,
  getSessionAccount,
  type Role,
  type RemoteUser,
} from "./store/authRemote";

import { listSections, listLatestPosts, listTopics } from "./store/forumRemote";

import { Shield, ChevronRight, Lock } from "lucide-react";
import RecaptchaGate from "./components/RecaptchaGate";
import { requestEmailCode, verifyEmailCode } from "./store/emailVerifyLocal";
import ForumSubnav from "./ForumSubnav";
import ForumSearch from "./components/ForumSearch";

/* ====== UI helpers ====== */
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

function projectStatus(title: string): "wip" | "review" | "done" | "none" {
  const lower = String(title || "").toLowerCase();
  if (lower.startsWith("[wip]")) return "wip";
  if (lower.startsWith("[review]")) return "review";
  if (lower.startsWith("[done]")) return "done";
  return "none";
}

/* ====== Auth (extended) ====== */
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
  const [verifyMode, setVerifyMode] = React.useState<false | "email">(false);
  const [verifyCode, setVerifyCode] = React.useState("");

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
        onDone();
      } else {
        if (!ascii.test(nick.trim())) {
          throw new Error("Username: 3–16 chars (A–Z a–z 0–9 _)");
        }
        await registerAccount({
          username: nick.trim(),
          email: email.trim(),
          password: pass || undefined,
          inviteCode: needInvite ? invite.trim() : "",
          remember,
          captchaToken,
        } as any);
        try {
          requestEmailCode(email.trim());
        } catch {
          /* ignore */
        }
        setVerifyMode("email");
      }
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

        {!verifyMode && (
          <div className="grid gap-3 mt-3">
            <input
              className="input"
              placeholder={mode === "login" ? "Логин или e-mail" : "Логин (латиница/цифры/_ )"}
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
                {mode === "login" ? "Войти" : "Зарегистрироваться"}
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => setMode(mode === "login" ? "signup" : "login")}
                disabled={busy}
              >
                {mode === "login" ? "Нет аккаунта? Регистрация" : "Уже есть? Войти"}
              </button>
            </div>
          </div>
        )}

        {verifyMode === "email" && (
          <div className="grid gap-3 mt-3">
            <div className="text-sm text-zinc-300">
              Мы отправили код подтверждения на {email}. Введите код ниже.
            </div>
            <input
              className="input"
              placeholder="Код подтверждения"
              value={verifyCode}
              onChange={(e) => setVerifyCode(e.target.value)}
            />
            {!!err && <div style={{ color: "#ef4444", fontSize: 13 }}>{err}</div>}
            <div className="flex gap-2">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  if (verifyEmailCode(email, verifyCode)) {
                    setVerifyMode(false);
                    onDone();
                  } else {
                    setErr("Неверный код");
                  }
                }}
              >
                Подтвердить
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => {
                  requestEmailCode(email);
                }}
              >
                Отправить код ещё раз
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

/* ====== Header ====== */
function Header({ me, onLogout }: { me: RemoteUser; onLogout: () => void }) {
  return (
    <header
      className="sticky top-0 z-50 border-b backdrop-blur"
      style={{ background: "rgba(10,10,14,.6)", borderColor: "var(--border)" }}
    >
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
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

        {(me && (me.role === "admin" || me.role === "developer" || me.role === "moderator")) && (
          <Link to="/forum/admin" className="ml-2 btn">
            Admin
          </Link>
        )}

        <Link
          to={`/forum/profile/${me.username}`}
          className="ml-2 flex items-center gap-2 rounded-xl border px-3 py-2 card"
        >
          <Badge role={me.role} />
          <div className="text-sm font-semibold">{me.username}</div>
          <div className="border-l pl-2 text-xs opacity-70">#{me.userNumber}</div>
        </Link>

        <div className="flex-1" />
        <button type="button" className="btn" onClick={onLogout}>
          Выйти
        </button>
      </div>
    </header>
  );
}

/* ====== Page ====== */
export default function ForumPage() {
  const [, force] = React.useReducer((x) => x + 1, 0);
  const [me, setMe] = React.useState<RemoteUser | null | undefined>(undefined);
  const [authOpen, setAuthOpen] = React.useState(false);

  const [sectionsState, setSectionsState] = React.useState<any[]>([]);
  const [latestPosts, setLatestPosts] = React.useState<any[]>([]);

  const [workshopSection, setWorkshopSection] = React.useState<any | null>(null);
  const [workshopProjects, setWorkshopProjects] = React.useState<any[]>([]);
  const [workshopSummary, setWorkshopSummary] = React.useState({
    total: 0,
    wip: 0,
    review: 0,
    done: 0,
  });

  const rtf = React.useMemo(() => {
    try {
      return new Intl.RelativeTimeFormat("ru", { numeric: "auto" });
    } catch {
      try {
        return new Intl.RelativeTimeFormat("en", { numeric: "auto" });
      } catch {
        return null;
      }
    }
  }, []);

  const formatRelative = React.useCallback(
    (value: string | number | Date | null | undefined) => {
      if (!value) return "";
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return "";
      if (!rtf) return date.toLocaleString();
      const diff = date.getTime() - Date.now();
      const minute = 60 * 1000;
      const hour = 60 * minute;
      const day = 24 * hour;
      const month = 30 * day;
      const year = 365 * day;
      if (Math.abs(diff) < minute) return rtf.format(Math.round(diff / 1000), "second");
      if (Math.abs(diff) < hour) return rtf.format(Math.round(diff / minute), "minute");
      if (Math.abs(diff) < day) return rtf.format(Math.round(diff / hour), "hour");
      if (Math.abs(diff) < month) return rtf.format(Math.round(diff / day), "day");
      if (Math.abs(diff) < year) return rtf.format(Math.round(diff / month), "month");
      return rtf.format(Math.round(diff / year), "year");
    },
    [rtf]
  );

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
    let alive = true;
    (async () => {
      try {
        const sections = await listSections();
        const normalizedSections = Array.isArray(sections)
          ? [...sections].sort((a, b) => {
              const order = (a.order ?? 0) - (b.order ?? 0);
              if (order !== 0) return order;
              return (
                new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
              );
            })
          : [];

        const workshop =
          normalizedSections.find(
            (s: any) => String(s.title || "").toLowerCase() === "workshop"
          ) || null;

        const [posts, workshopTopics] = await Promise.all([
          listLatestPosts(8).catch(() => []),
          workshop?.id ? listTopics(workshop.id).catch(() => []) : Promise.resolve([]),
        ]);

        if (!alive) return;

        setSectionsState(normalizedSections);
        setLatestPosts(Array.isArray(posts) ? posts : []);
        setWorkshopSection(workshop);

        const summary = Array.isArray(workshopTopics)
          ? workshopTopics.reduce(
              (acc: any, topic: any) => {
                const status = projectStatus(topic.title);
                if (status === "wip") acc.wip += 1;
                else if (status === "review") acc.review += 1;
                else if (status === "done") acc.done += 1;
                acc.total += 1;
                return acc;
              },
              { total: 0, wip: 0, review: 0, done: 0 }
            )
          : { total: 0, wip: 0, review: 0, done: 0 };

        const curated = Array.isArray(workshopTopics)
          ? [...workshopTopics]
              .sort(
                (a, b) =>
                  new Date(b.updatedAt || b.createdAt || 0).getTime() -
                  new Date(a.updatedAt || a.createdAt || 0).getTime()
              )
              .slice(0, 4)
          : [];

        setWorkshopProjects(curated);
        setWorkshopSummary(summary);
      } catch (err) {
        if (!alive) return;
        console.warn("Failed to load forum data", err);
        setSectionsState([]);
        setLatestPosts([]);
        setWorkshopSection(null);
        setWorkshopProjects([]);
        setWorkshopSummary({ total: 0, wip: 0, review: 0, done: 0 });
      }
    })();
    return () => {
      alive = false;
    };
  }, [me]);

  // hotkeys
  React.useEffect(() => {
    let gPressed = false;
    function onKey(e: KeyboardEvent) {
      if (e.key === "/") {
        const el = document.getElementById("forum-search-input") as HTMLInputElement | null;
        if (el) {
          e.preventDefault();
          el.focus();
        }
        return;
      }
      if (e.key.toLowerCase() === "g") {
        gPressed = true;
        setTimeout(() => {
          gPressed = false;
        }, 800);
        return;
      }
      if (!gPressed) return;
      if (e.key.toLowerCase() === "h") {
        e.preventDefault();
        try {
          window.location.href = "/forum";
        } catch {
          location.assign("/forum");
        }
      }
      if (e.key.toLowerCase() === "q") {
        e.preventDefault();
        try {
          window.location.href = "/forum/questions";
        } catch {
          location.assign("/forum/questions");
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (me === undefined) return <div style={{ minHeight: "100vh", background: "#0c0d12" }} />;

  // Block forum for guests
  if (!me) {
    return (
      <main className="min-h-screen" style={{ background: '#0d0d12', color: '#f8fafc' }}>
        <header
          className="sticky top-0 z-50 border-b backdrop-blur"
          style={{ background: "rgba(10,10,14,.6)", borderColor: "var(--border)" }}
        >
          <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
            <Link to="/forum" className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[color:var(--accent)]/20 text-[color:var(--accent)] shadow">
                <Shield size={18} />
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-[0.32em]" style={{ color: "var(--text-2)" }}>
                  Forum // FORUM
                </div>
                <div className="text-sm font-semibold">Sky Forum</div>
              </div>
            </Link>
          </div>
        </header>
        <AuthGateX onDone={() => force()} />
      </main>
    );
  }

  const sectionsList = Array.isArray(sectionsState) ? sectionsState : [];
  const latestList = Array.isArray(latestPosts) ? latestPosts : [];

  const workshopBadges: Record<
    "wip" | "review" | "done" | "none",
    { label: string; className: string }
  > = {
    wip: { label: "WIP", className: "bg-amber-400/10 text-amber-300" },
    review: { label: "Review", className: "bg-sky-400/10 text-sky-300" },
    done: { label: "Done", className: "bg-emerald-400/10 text-emerald-300" },
    none: { label: "Idea", className: "bg-zinc-200/10 text-zinc-200" },
  };

  // No implicit guest account; show explicit login instead
  return (
    <main
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(900px 600px at 15% -8%, rgba(99,102,241,.18), transparent 65%), radial-gradient(1100px 700px at 88% 10%, rgba(168,85,247,.16), transparent 65%), #0d0d12",
      }}
    >
      {me ? (
        <Header
          me={me}
          onLogout={() => {
            clearSession();
            force();
          }}
        />
      ) : (
        <header
          className="sticky top-0 z-50 border-b backdrop-blur"
          style={{ background: "rgba(10,10,14,.6)", borderColor: "var(--border)" }}
        >
          <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
            <Link to="/forum" className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[color:var(--accent)]/20 text-[color:var(--accent)] shadow">
                <Shield size={18} />
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-[0.32em]" style={{ color: "var(--text-2)" }}>
                  Forum // FORUM
                </div>
                <div className="text-sm font-semibold">Sky Forum</div>
              </div>
            </Link>
            <div className="flex-1" />
            <button type="button" className="btn" onClick={() => setAuthOpen(true)}>Login</button>
          </div>
        </header>
      )}

      <div className="mx-auto w-full max-w-6xl px-4 py-6">
        <ForumSubnav />
        <ForumSearch />

        {/* Hero */}
        <div className="relative mb-6 overflow-hidden card">
          <Link to="/forum" className="block focus:outline-none focus:ring-2 focus:ring-cyan-400/60 rounded-md">
            <h1
              className="select-none py-10 text-center font-black tracking-[0.16em] text-transparent bg-clip-text shimmer-text"
              style={{ fontSize: "clamp(64px,12vw,140px)", lineHeight: 1 }}
              title="Go to forum home"
            >
              SKY
            </h1>
          </Link>
        </div>

        {/* Announcements removed by request */}

        {/* ======= SECTIONS + LATEST POSTS ======= */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.45fr_.85fr]">
          {/* SECTIONS (left) */}
          <div className="grid gap-4">
            {/* Shoutbox */}
            <div className="card p-0">
              <div className="p-3">
                <SimpleChat variant="shoutbox" />
              </div>
            </div>

            <div
              className="text-[11px] uppercase tracking-[0.32em]"
              style={{ color: "var(--text-2)" }}
            >
              Разделы
            </div>

            {sectionsList.map((s: any) => {
              const isWorkshop =
                s.id === workshopSection?.id ||
                String(s.title || "").toLowerCase() === "workshop";
              return (
                <Link key={s.id} to={`/forum/section/${s.id}`} className="card p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-lg font-semibold">
                        {s.icon ? <span className="text-xl">{s.icon}</span> : <ChevronRight size={16} />}
                        <span className="truncate">{s.title}</span>
                        {isWorkshop && (
                          <span className="rounded-full bg-emerald-400/10 px-2 py-0.5 text-[11px] uppercase tracking-[0.3em] text-emerald-300">
                            Workshop
                          </span>
                        )}
                      </div>
                      {s.description && (
                        <p className="mt-1 text-sm text-zinc-300/80">{s.description}</p>
                      )}
                    </div>
                    <div className="text-right text-xs uppercase tracking-[0.28em] text-zinc-500">
                      <div>Topics {s.topicCount ?? 0}</div>
                      <div>Posts {s.postCount ?? 0}</div>
                    </div>
                  </div>
                </Link>
              );
            })}

            {!sectionsList.length && (
              <div className="card p-4 text-sm opacity-70">
                Разделов пока нет. Используйте админ-панель, чтобы создать первый раздел.
              </div>
            )}
          </div>

          {/* ASIDE (right) */}
          <aside className="grid gap-4">
            <div className="flex items-center justify-between">
              <div className="text-[11px] uppercase tracking-[0.28em] text-zinc-400">
                Latest activity
              </div>
              <Link to="/forum?feed=latest" className="text-xs text-cyan-300 hover:underline">
                Feed
              </Link>
            </div>

            {latestList.map((p: any) => (
              <Link
                key={p.id}
                to={`/forum/topic/${p.topicId || p.id}`}
                className="block card px-3 py-3 transition hover:border-cyan-400/40"
              >
                <div className="relative pl-4">
                  <span
                    className="absolute left-0 top-1.5 h-2 w-2 rounded-full"
                    style={{ background: "#22d3ee" }}
                  />
                  <div className="truncate font-semibold">{p.title || p.topicTitle || "Пост"}</div>
                  <div className="mt-1 text-xs" style={{ color: "var(--text-2)" }}>
                    {formatRelative(p.createdAt || p.updatedAt) ||
                      (p.createdAt ? new Date(p.createdAt).toLocaleString() : "")}
                  </div>
                </div>
              </Link>
            ))}

            {!latestList.length && (
              <div className="card p-3 text-sm opacity-70">Постов пока нет</div>
            )}

            {workshopSection ? (
              <div className="mt-4 card p-5">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="text-xs uppercase tracking-[0.3em] text-emerald-300/80">
                      Workshop
                    </div>
                    <h2 className="text-2xl font-semibold text-white">
                      {workshopSection.title || "Workshop"}
                    </h2>
                    <p className="mt-1 text-sm text-zinc-300/80">
                      Мастерская для проектных тем: статус, стек, прогресс и ревью сообщества.
                    </p>
                  </div>
                  <Link to={`/forum/section/${workshopSection.id}`} className="btn btn-primary">
                    Открыть мастерскую
                  </Link>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.32em] text-zinc-400/80">
                  <span>Проектов {workshopSummary.total}</span>
                  <span>[WIP] {workshopSummary.wip}</span>
                  <span>[Review] {workshopSummary.review}</span>
                  <span>[Done] {workshopSummary.done}</span>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {workshopProjects.map((topic: any) => {
                    const status = projectStatus(topic.title);
                    const badge = workshopBadges[status];
                    return (
                      <Link
                        key={topic.id}
                        to={`/forum/topic/${topic.id}`}
                        className="card p-4 transition hover:border-emerald-400/40"
                      >
                        <div className="flex items-start gap-3">
                          <span
                            className={`rounded-full px-2 py-0.5 text-[11px] uppercase tracking-[0.3em] ${badge.className}`}
                          >
                            {badge.label}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="truncate font-semibold text-white">{topic.title}</div>
                            <div className="mt-1 text-xs text-zinc-400/80">
                              {formatRelative(topic.updatedAt || topic.createdAt) ||
                                (topic.updatedAt
                                  ? new Date(topic.updatedAt).toLocaleString()
                                  : "")}
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-4 text-[11px] uppercase tracking-[0.3em] text-zinc-500">
                          <span>Replies {topic.replyCount ?? 0}</span>
                          <span>Views {topic.viewCount ?? 0}</span>
                        </div>
                      </Link>
                    );
                  })}

                  {!workshopProjects.length && (
                    <div className="card p-4 text-sm text-zinc-300/80">
                      В мастерской пока нет проектов. Добавьте первый, чтобы получить ревью.
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="mt-4 card border border-dashed border-white/10 p-5 text-sm text-zinc-300/70">
                Workshop-раздел ещё не создан. Создайте его в панели администратора, чтобы делиться
                проектами.
              </div>
            )}
          </aside>
        </div>
        {/* ======= /SECTIONS + LATEST POSTS ======= */}

        {/* Bottom chat panel was replaced by Shoutbox above */}
      </div>
      {authOpen && (
        <AuthGateX onDone={() => { setAuthOpen(false); force(); }} />
      )}
    </main>
  );
}
