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
import { getForumSettings } from "./store/forumStore";
import { listSections, listLatestPosts } from "./store/forumRemote";
import { Shield, Search, Bell, ChevronRight, Lock } from "lucide-react";
import ForumSubnav from "./ForumSubnav";

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
        <div className="mx-4 hidden flex-1 items-center justify-center sm:flex">
          <label
            className="relative flex w-full max-w-xl items-center gap-2 rounded-full border px-4 py-2 text-sm shadow-sm"
            style={{ borderColor: "var(--border)" }}
          >
            <Search size={16} />
            <input
              placeholder="Поиск"
              className="w-full bg-transparent outline-none"
              style={{ color: "var(--text-1)" }}
            />
          </label>
        </div>
        <button
          className="relative grid h-10 w-10 place-items-center rounded-xl border card"
          title="Уведомления"
        >
          <Bell size={16} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500" />
        </button>
        {(me.role === "admin" || me.role === "developer" || me.role === "moderator") && (
          <Link to="/forum/admin" className="ml-2 btn">
            Admin
          </Link>
        )}
        <Link to="/forum/members" className="ml-2 btn">Members</Link>
        <Link
          to={`/forum/profile/${me.username}`}
          className="ml-2 flex items-center gap-2 rounded-xl border px-3 py-2 card"
        >
          <Badge role={me.role} />
          <div className="text-sm font-semibold">{me.username}</div>
          <div className="border-l pl-2 text-xs opacity-70">#{me.userNumber}</div>
        </Link>
        <button onClick={onLogout} className="ml-2 text-xs btn">
          Выйти
        </button>
      </div>
    </header>
  );
}

export default function ForumPage() {
  const [, force] = React.useReducer((x) => x + 1, 0);
  const [me, setMe] = React.useState<RemoteUser | null | undefined>(undefined);
  const [sectionsState, setSectionsState] = React.useState<any[]>([]);
  const [latestPosts, setLatestPosts] = React.useState<any[]>([]);

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
        const [sections, posts] = await Promise.all([
          listSections(),
          listLatestPosts(8),
        ]);
        if (alive) {
          setSectionsState(Array.isArray(sections) ? sections : []);
          setLatestPosts(Array.isArray(posts) ? posts : []);
        }
      } catch {
        if (alive) {
          setSectionsState([]);
          setLatestPosts([]);
        }
      }
    })();
    return () => {
      alive = false;
    };
  }, [me]);

  if (me === undefined)
    return <div style={{ minHeight: "100vh", background: "#0c0d12" }} />;
  if (!me)
    return (
      <>
        <AuthGate onDone={() => force()} />
        <div style={{ minHeight: "100vh", background: "#0c0d12" }} />
      </>
    );

  // settings (если нужен сайд-эффект/инициализация)
  const settings = getForumSettings();
  void settings;

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

      <div className="mx-auto w-full max-w-6xl px-4 py-6">
        <ForumSubnav />
        <div className="relative mb-6 overflow-hidden card">
          <h1
            className="select-none py-10 text-center font-black tracking-[0.16em]"
            style={{
              fontSize: "clamp(64px,12vw,140px)",
              lineHeight: 1,
              background:
                "linear-gradient(180deg,#fff,#d1c3ff 38%,#8b5cf6 60%,rgba(255,255,255,.7))",
              WebkitBackgroundClip: "text",
              color: "transparent",
              textShadow: "0 18px 80px rgba(139,92,246,.35)",
            }}
          >
            Forum
          </h1>
        </div>

        <div className="grid gap-3">
          <div className="card px-4 py-3">
            Включите 2FA и безопасные методы входа — это важно.
          </div>
          <div className="card px-4 py-3">
            Правила: соблюдайте уважение. Бан без предупреждений за спам/флуд.
          </div>
        </div>

        {/* ======= SECTIONS + LATEST POSTS ======= */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.45fr_.85fr]">
          {/* SECTIONS */}
          <div className="grid gap-4">
            <div
              className="text-[11px] uppercase tracking-[0.32em]"
              style={{ color: "var(--text-2)" }}
            >
              SECTIONS
            </div>

            {(Array.isArray(sectionsState) ? sectionsState : []).map(
              (s: any) => (
                <Link
                  key={s.id}
                  to={`/forum/section/${s.id}`}
                  className="card p-4"
                >
                  <div className="font-semibold flex items-center gap-2">
                    <ChevronRight size={16} />
                    {s.title}
                  </div>
                  {s.description && (
                    <div className="text-sm opacity-70 mt-1">
                      {s.description}
                    </div>
                  )}
                </Link>
              )
            )}

            {!Array.isArray(sectionsState) || sectionsState.length === 0 ? (
              <div className="card p-4 text-sm opacity-70">Нет разделов</div>
            ) : null}
          </div>

          {/* LATEST POSTS */}
          <aside className="grid content-start gap-4">
            <div className="card flex items-center justify-between px-3 py-2">
              <div className="text-xs uppercase tracking-[0.28em]">
                LATEST POSTS
              </div>
            </div>

            {(Array.isArray(latestPosts) ? latestPosts : []).map((p: any) => (
              <div key={p.id} className="block card px-3 py-3">
                <div className="relative pl-4">
                  <span
                    className="absolute left-0 top-1.5 h-2 w-2 rounded-full"
                    style={{ background: "#22d3ee" }}
                  />
                  <div className="font-semibold">
                    {p.title || "Пост"}
                  </div>
                  <div className="text-xs" style={{ color: "var(--text-2)" }}>
                    {p.createdAt
                      ? new Date(p.createdAt).toLocaleString()
                      : ""}
                  </div>
                </div>
              </div>
            ))}

            {!Array.isArray(latestPosts) || latestPosts.length === 0 ? (
              <div className="card p-3 text-sm opacity-70">
                Постов пока нет
              </div>
            ) : null}
          </aside>
        </div>
        {/* ======= /SECTIONS + LATEST POSTS ======= */}

        <div className="mt-8 card">
          <div
            className="border-b px-4 py-2 text-xs uppercase tracking-[0.3em]"
            style={{ borderColor: "var(--border)", color: "var(--text-2)" }}
          >
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
