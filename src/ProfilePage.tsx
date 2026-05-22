import React from "react";
import { useParams } from "react-router-dom";
import {
  findAccountByUsername,
  getSessionAccount as getLocalSession,
  updateAccountProfile as updateLocalProfile,
  type Account,
  findAccountById,
} from "./store/forumStore";
import {
  getSessionAccount as getRemoteSession,
  getProfileByUsername,
  updateMyProfile,
  type RemoteProfile,
  type RemoteProfilePayload,
  type RemoteUser,
  listPublicMembers,
} from "./store/authRemote";
import {
  isFollowing,
  follow,
  unfollow,
  listFollowers,
  listProfileComments,
  addProfileComment,
  addReply,
  removeProfileComment,
  listReactions,
  toggleReaction,
  getUserReaction,
  type ProfileComment,
  type Reaction,
} from "./store/socialStore";
import {
  Camera, Pencil, Globe, Link as LinkIcon, BadgeCheck, UserPlus, UserMinus,
  MessageSquare, Trash2, Shield, Code2, Gavel, Crown, Ellipsis
} from "lucide-react";
import { getLastActive, formatRelative as formatLastActive } from "./utils/lastActive";

/* ===== role meta / colors ===== */
const ROLE_STYLES: Record<string, { label: string; color: string; glow: string }> = {
  developer: { label: "Разработчик", color: "#22d3ee", glow: "from-cyan-400/35" },
  admin: { label: "Администратор", color: "#e5e7eb", glow: "from-white/40" },
  moderator: { label: "Модератор", color: "#ef4444", glow: "from-rose-400/35" },
  vip: { label: "VIP", color: "#eab308", glow: "from-amber-400/35" },
  user: { label: "Участник", color: "#94a3b8", glow: "from-slate-300/30" },
  newbie: { label: "Новичок", color: "#22d3ee", glow: "from-cyan-400/35" },
};

const ROLE_META_EN: Record<string, { label: string; grad: string; Icon: any }> = {
  owner:     { label: "Owner",     grad: "from-amber-400 via-rose-400 to-amber-400",  Icon: Crown },
  developer: { label: "Developer", grad: "from-emerald-400 via-lime-400 to-emerald-400", Icon: Code2 },
  admin:     { label: "Admin",     grad: "from-white via-slate-200 to-white",  Icon: Shield },
  moderator: { label: "Moderator", grad: "from-rose-400 via-red-400 to-rose-400", Icon: Gavel },
  vip:       { label: "Premium",   grad: "from-amber-400 via-yellow-300 to-amber-400",  Icon: Crown },
  user:      { label: "User",      grad: "from-slate-300 via-slate-400 to-slate-300", Icon: Shield },
  newbie:    { label: "Newbie",    grad: "from-cyan-400 via-fuchsia-400 to-cyan-400", Icon: Code2 },
};

/* — цвет ника по роли (градиент) — */
function gradientByRole(role: string): string | null {
  switch (role) {
    case "developer": return "linear-gradient(90deg,#22c55e,#84cc16)";
    case "admin":     return "linear-gradient(90deg,#ffffff,#d1d5db)";
    case "moderator": return "linear-gradient(90deg,#ef4444,#f43f5e)";
    case "vip":       return "linear-gradient(90deg,#eab308,#facc15)";
    case "user":      return "linear-gradient(90deg,#a855f7,#8b5cf6)";      // фиолетовый
    case "newbie":    return "linear-gradient(90deg,#4c1d95,#6d28d9)";      // тёмно-фиолетовый
    default:          return null;
  }
}

function isBanActive(ban?: { until?: string | null } | null): boolean {
  if (!ban) return false;
  if (!ban.until) return true;
  const t = new Date(ban.until).getTime();
  return !Number.isNaN(t) && t > Date.now();
}
function isOnline(acc: Account): boolean {
  const la = (acc as any).lastActiveAt || getLastActive(acc.id);
  if (!la) return false;
  const t = new Date(la).getTime();
  return !Number.isNaN(t) && t > Date.now() - 5 * 60 * 1000;
}

/* ===== small UI ===== */
const PANEL_CLASS =
  "rounded-3xl border border-white/10 bg-[#101321]/85 p-5 shadow-[0_40px_120px_-70px_rgba(15,23,42,0.9)] backdrop-blur";
const SOFT_PANEL =
  "rounded-3xl border border-white/10 bg-white/[0.05] p-4 shadow-[0_30px_90px_-70px_rgba(15,23,42,0.85)] backdrop-blur";
const profileDateFormatter = new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "long", year: "numeric" });

/* — Крупный бейдж роли используем только в About — */
function RoleBadgePro({ role }: { role: string }) {
  const meta = ROLE_META_EN[role] ?? ROLE_META_EN.user;
  const Icon = meta.Icon;
  return (
    <span className="relative inline-flex">
      <span className={`absolute -inset-[2px] rounded-full blur-md bg-gradient-to-r ${meta.grad} opacity-50`} />
      <span className="relative inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.22em] text-white">
        <Icon size={14} className="opacity-90" />
        {meta.label}
      </span>
    </span>
  );
}

/* — маленький цветной кружок роли для шапки — */
function RoleDot({ role }: { role: string }) {
  const g = gradientByRole(role);
  return (
    <span
      title={ROLE_STYLES[role]?.label || role}
      className="inline-block h-3.5 w-3.5 rounded-full border border-white/20 align-middle"
      style={g ? { backgroundImage: g } : { backgroundColor: "#94a3b8" }}
    />
  );
}

function HeroCounter({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center">
      <div className="text-2xl font-extrabold text-white">{value}</div>
      <div className="mt-0.5 text-[11px] uppercase tracking-[0.28em] text-zinc-300/80">{label}</div>
    </div>
  );
}

function BadgesRow({ badges }: { badges?: string[] }) {
  if (!badges?.length) return null;
  const palette: Record<string, string> = {
    Founder: "from-rose-500/25 to-rose-400/10 text-rose-200",
    Early: "from-sky-500/25 to-sky-400/10 text-sky-200",
    Contributor: "from-emerald-500/25 to-emerald-400/10 text-emerald-200",
    VIP: "from-amber-500/25 to-amber-400/10 text-amber-200",
    Designer: "from-violet-500/25 to-violet-400/10 text-violet-200",
  };
  return (
    <div className="flex flex-wrap items-center gap-2">
      {badges.slice(0, 3).map((b) => (
        <span key={b} className={`inline-flex items-center gap-1 rounded-full border border-white/10 bg-gradient-to-br ${palette[b] || "from-white/20 to-white/5 text-zinc-200"} px-2.5 py-1 text-xs`}>
          <BadgeCheck size={14} className="opacity-90" /> {b}
        </span>
      ))}
    </div>
  );
}

/* ===== data adapt ===== */
function adaptRemoteAccount(pack: RemoteProfilePayload): Account {
  const rawProfile: any = pack.profile || {};
  const stats: any = pack.stats || {};
  const lastActiveAt = (pack as any).lastActiveAt || (pack as any).lastSeenAt || (pack as any).lastOnlineAt || null;
  const profile = {
    bio: rawProfile.bio || "",
    signature: rawProfile.signature || "",
    links: rawProfile.links ? { ...rawProfile.links } : {},
    accentFrom: rawProfile.accentFrom || "#8b5cf6",
    accentTo: rawProfile.accentTo || "#0ea5e9",
    avatarData: rawProfile.avatarData || rawProfile.avatar || rawProfile.avatarUrl || undefined,
    bannerData: rawProfile.bannerData || rawProfile.banner || rawProfile.bannerUrl || undefined,
    badges: Array.isArray(rawProfile.badges) ? rawProfile.badges : [],
    privacy: { showEmail: false, showStats: true, showLinks: true, allowComments: true, showFollowers: true, ...(rawProfile.privacy || {}) },
  } as Account["profile"] & { labels?: string[] };
  if (Array.isArray(rawProfile.labels)) (profile as any).labels = rawProfile.labels;

  const acc: Account = {
    id: pack.user.id,
    username: pack.user.username,
    email: pack.user.email,
    createdAt: pack.user.createdAt,
    role: pack.user.role,
    userNumber: pack.user.userNumber,
    posts: typeof stats.posts === "number" ? stats.posts : 0,
    likes: typeof stats.likes === "number" ? stats.likes : 0,
    topics: typeof stats.topics === "number" ? stats.topics : 0,
    profile,
    bans: pack.user.bannedUntil ? { until: pack.user.bannedUntil } : null,
    mutes: null,
  };
  if (typeof stats.score === "number") (acc as any).score = stats.score;
  if (lastActiveAt) (acc as any).lastActiveAt = lastActiveAt;
  return acc;
}

/* ===== main ===== */
export default function ProfilePage() {
  const { username = "" } = useParams();
  const [user, setUser] = React.useState<Account | null>(null);
  const [session, setSession] = React.useState<{ id: string; username: string } | null>(null);
  const [remote, setRemote] = React.useState(false);
  const [isOwnerRemote, setIsOwnerRemote] = React.useState(false);
  const [memberMap, setMemberMap] = React.useState<Record<string, string>>({});
  const [tab, setTab] = React.useState<"posts" | "activity" | "postings" | "about">("posts");
  const [viewerRemote, setViewerRemote] = React.useState<RemoteUser | null>(null);

  React.useEffect(() => {
    (async () => {
      try {
        const me = await getRemoteSession();
        if (me) {
          setRemote(true);
          setSession({ id: me.id, username: me.username });
          setViewerRemote(me);
          try {
            const rows = await listPublicMembers();
            const map: Record<string, string> = {};
            for (const m of rows as any) map[(m as any).id] = (m as any).username;
            setMemberMap(map);
          } catch {}
          const pack = await getProfileByUsername(username);
          if (pack) {
            setUser(adaptRemoteAccount(pack));
            setIsOwnerRemote(!!(pack as any).user?.owner);
            return;
          }
        }
      } catch {}
      setRemote(false);
      setUser(findAccountByUsername(username) || null);
      const meLocal = getLocalSession();
      setSession(meLocal ? { id: meLocal.id, username: meLocal.username } : null);
    })();
  }, [username]);

  React.useEffect(() => {
    const sync = async () => {
      try { const me = await getRemoteSession(); if (me) { setSession({ id: me.id, username: me.username }); setViewerRemote(me); return; } } catch {}
      const meLocal = getLocalSession();
      setSession(meLocal ? { id: meLocal.id, username: meLocal.username } : null);
    };
    window.addEventListener("forum:session", sync as any);
    window.addEventListener("storage", sync as any);
    return () => {
      window.removeEventListener("forum:session", sync as any);
      window.removeEventListener("storage", sync as any);
    };
  }, []);

  if (!user) {
    return (
      <main className="min-h-screen text-slate-200" style={{ background: "linear-gradient(180deg,#04060d 0%,#090b16 100%)" }}>
        <div className="mx-auto max-w-3xl px-4 py-16">
          <div className={`${PANEL_CLASS} text-center text-sm text-zinc-300`}>Требуется вход для просмотра профилей.</div>
        </div>
      </main>
    );
  }

  const canEdit = session?.id === user.id;
  const hidden = !!user.profile?.privacy?.hiddenProfile;
  const viewerPrivileged = (
    (session?.id === user.id) ||
    (!!viewerRemote && (viewerRemote.owner === true || viewerRemote.role === 'developer' || viewerRemote.role === 'admin'))
  );
  const allowHide = canEdit && ((user.role === 'developer' || user.role === 'admin') || (remote && isOwnerRemote));

  if (hidden && !viewerPrivileged) {
    return (
      <main className="min-h-screen text-slate-200" style={{ background: "linear-gradient(180deg,#04060d 0%,#090b16 100%)" }}>
        <div className="mx-auto max-w-3xl px-4 py-16">
          <div className={`${PANEL_CLASS} text-center text-sm text-zinc-300`}>Профиль скрыт. Доступен только администрации.</div>
        </div>
      </main>
    );
  }
  const accentFrom = user.profile.accentFrom || "#22d3ee";
  const accentTo = user.profile.accentTo || "#8b5cf6";
  const isBanned = isBanActive(user.bans);
  const online = isOnline(user);

  return (
    <main
      className="min-h-screen text-slate-100"
      style={{
        background:
          "radial-gradient(1200px 700px at 12% -10%, rgba(56,189,248,0.18), transparent 65%), radial-gradient(1000px 720px at 90% -6%, rgba(167,139,250,0.14), transparent 70%), linear-gradient(180deg, #04060d 0%, #090b16 100%)",
      }}
    >
      <div className="mx-auto max-w-5xl px-4 py-8 space-y-6">
        {/* ===== HERO ===== */}
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#101321]/85 shadow-[0_50px_140px_-80px_rgba(15,23,42,0.9)] backdrop-blur">
          {/* Чистый баннер — без элементов */}
          <div
            className="h-[220px] w-full"
            style={{
              background: user.profile.bannerData
                ? `url(${user.profile.bannerData}) center/cover`
                : `linear-gradient(135deg, ${accentFrom}, ${accentTo})`,
            }}
          />
          {/* Контент ниже баннера */}
          <div className="px-6 pb-6 pt-4">
            <div className="flex flex-wrap items-end gap-5">
              {/* Аватар — исключительно ниже баннера */}
              <div className="relative">
                <div className="rounded-full p-[3px]" style={{ backgroundImage: gradientByRole(user.role) || `linear-gradient(135deg,${accentFrom},${accentTo})` }}>
                  <div
                    className="h-24 w-24 overflow-hidden rounded-full border-4 border-[#101321] shadow-[0_25px_70px_-35px_rgba(15,23,42,0.9)]"
                    style={{
                      background: user.profile.avatarData
                        ? `url(${user.profile.avatarData}) center/cover`
                        : `linear-gradient(135deg, ${accentFrom}, ${accentTo})`,
                    }}
                  />
                </div>
                <span
                  className={`absolute -right-1 bottom-2 h-4 w-4 rounded-full border-2 ${online ? "border-emerald-900/60 bg-emerald-400" : "border-zinc-900/70 bg-zinc-400/70"}`}
                  title={online ? "Online" : "Offline"}
                >
                  {online && <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-emerald-400/50" />}
                </span>
                <div className={`absolute -inset-1 -z-10 rounded-full bg-gradient-to-br ${(ROLE_STYLES[user.role] || ROLE_STYLES.user).glow} to-transparent blur-lg`} />
              </div>

              <div className="min-w-0 flex-1 space-y-3">
                {/* Ник + мини-статус, роль текстом не показываем */}
                <div className="flex flex-wrap items-center gap-2">
                  <h1
                    className={`text-3xl font-extrabold tracking-tight ${isBanned ? "line-through text-black" : "text-white"}`}
                    style={
                      !isBanned
                        ? (() => {
                            const g = gradientByRole(user.role);
                            return g
                              ? { backgroundImage: g, WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }
                              : undefined;
                          })()
                        : undefined
                    }
                  >
                    {user.username}
                  </h1>
                  <RoleDot role={user.role} />
                  <span className={`ml-1 rounded-full px-2 py-0.5 text-[11px] uppercase tracking-[0.26em] ${online ? "bg-emerald-500/15 text-emerald-200" : "bg-white/10 text-zinc-300"}`}>
                    {online ? "Online" : (user as any).lastActiveAt ? formatLastActive((user as any).lastActiveAt) : "Offline"}
                  </span>
                  {isBanned && (
                    <span className="rounded-full bg-black/50 px-2 py-0.5 text-[11px] uppercase tracking-[0.26em] text-zinc-200 ml-1">
                      Banned
                    </span>
                  )}
                </div>

                {/* верхние счётчики */}
                <div className="mt-1 flex items-center gap-8">
                  <HeroCounter value={user.posts} label="messages" />
                  <HeroCounter value={user.likes} label="reaction score" />
                  <HeroCounter value={user.topics} label="topics" />
                </div>

                {/* действия */}
                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                  <button className="rounded-full border border-white/10 bg-white/10 px-3 py-1 hover:border-white/30" onClick={() => alert("Points system coming soon ♥")}>
                    Send points
                  </button>
                  <div className="relative group">
                    <button className="rounded-full border border-white/10 bg-white/10 px-3 py-1 hover:border-white/30 inline-flex items-center gap-2">
                      Find <Ellipsis size={14} />
                    </button>
                    <div className="absolute left-0 top-full hidden w-56 rounded-xl border border-white/10 bg-[#0b0f1b]/95 p-2 text-sm text-zinc-200 shadow-2xl backdrop-blur group-hover:block">
                      <a className="block rounded-lg px-2 py-1 hover:bg-white/10" href={`/forum/search?author=${encodeURIComponent(user.username)}`}>Все сообщения</a>
                      <a className="block rounded-lg px-2 py-1 hover:bg-white/10" href={`/forum/search?starter=${encodeURIComponent(user.username)}`}>Темы пользователя</a>
                    </div>
                  </div>
                </div>
              </div>

              {/* правые экшены */}
              {canEdit ? (
                <CustomizeButton
                  user={user}
                  onUpdated={async () => {
                    if (remote) {
                      const pack = await getProfileByUsername(username);
                      if (pack) setUser(adaptRemoteAccount(pack));
                    } else {
                      setUser(findAccountByUsername(username) || null);
                    }
                  }}
                  saveProfile={async (profile) => {
                    if (remote) { await updateMyProfile(profile as any as RemoteProfile); }
                    else { updateLocalProfile(user!.id, profile); }
                  }}
                  allowHide={allowHide}
                />
              ) : (
                <div className="flex gap-2">
                  <FollowBtn session={session} user={user} />
                </div>
              )}
            </div>

            {/* tabs */}
            <div className="mt-3 flex items-center gap-6 border-t border-white/10 pt-3 text-sm">
              {([
                { k: "posts", label: "Profile posts" },
                { k: "activity", label: "Latest activity" },
                { k: "postings", label: "Postings" },
                { k: "about", label: "About" },
              ] as const).map(({ k, label }) => (
                <button
                  key={k}
                  className={`pb-2 ${tab === k ? "border-b-2 border-cyan-400 text-white" : "text-zinc-400 hover:text-zinc-200"}`}
                  onClick={() => setTab(k)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CONTENT AREAS ===== */}
        {tab === "about" && (
          <section className="grid gap-4 lg:grid-cols-[1.35fr_.85fr]">
            <div className={PANEL_CLASS}>
              {/* РОЛЬ ТЕПЕРЬ ТОЛЬКО ЗДЕСЬ */}
              <div className="mb-2 text-xs uppercase tracking-[0.3em] text-zinc-400/75">Роль</div>
              <RoleBadgePro role={user.role} />

              <div className="mt-5 mb-3 text-xs uppercase tracking-[0.3em] text-zinc-400/75">О себе</div>
              <p className="whitespace-pre-wrap text-sm text-zinc-200/85">{user.profile.bio || "Пока нет описания."}</p>
              <div className="mt-3"><BadgesRow badges={user.profile.badges} /></div>
            </div>
            <div className={PANEL_CLASS}>
              <div className="mb-3 text-xs uppercase tracking-[0.3em] text-zinc-400/75">Ссылки</div>
              <div className="flex flex-wrap gap-2 text-sm text-zinc-200/90">
                {user.profile.links?.website ? (
                  <a className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 hover:border-white/30" href={user.profile.links.website} target="_blank" rel="noreferrer">
                    <Globe size={14} /> Сайт
                  </a>
                ) : null}
                {user.profile.links?.discord && (
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1">
                    <LinkIcon size={14} /> {user.profile.links.discord}
                  </span>
                )}
                {user.profile.links?.telegram && (
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1">
                    <LinkIcon size={14} /> {user.profile.links.telegram}
                  </span>
                )}
                {!user.profile.links?.website && !user.profile.links?.discord && !user.profile.links?.telegram && <span className="opacity-70">Ссылки ещё не добавлены.</span>}
              </div>
            </div>
          </section>
        )}

        {tab !== "about" && (
          <section className="grid gap-4 sm:grid-cols-3">
            <div className={SOFT_PANEL}><div className="text-xs uppercase tracking-[0.3em] text-zinc-400/80">Посты</div><div className="mt-1 text-3xl font-extrabold text-white">{user.posts}</div></div>
            <div className={SOFT_PANEL}><div className="text-xs uppercase tracking-[0.3em] text-zinc-400/80">Темы</div><div className="mt-1 text-3xl font-extrabold text-white">{user.topics}</div></div>
            <div className={SOFT_PANEL}><div className="text-xs uppercase tracking-[0.3em] text-zinc-400/80">Лайки</div><div className="mt-1 text-3xl font-extrabold text-white">{user.likes}</div></div>
          </section>
        )}

        {tab === "posts" && <ProfilePosts user={user} session={session} memberMap={memberMap} />}
        {tab === "activity" && (
          <div className={PANEL_CLASS}>
            <div className="text-sm text-zinc-300/85">Лента активности скоро будет тут (репосты, реакции, подписки).</div>
          </div>
        )}
        {tab === "postings" && (
          <div className={PANEL_CLASS}>
            <div className="text-sm text-zinc-300/85">Список сообщений пользователя появится после подключения реального форума.</div>
          </div>
        )}
      </div>
    </main>
  );
}

/* ===== follow / comments / reactions ===== */
function FollowBtn({ session, user }: { session: { id: string; username: string } | null; user: Account }) {
  const [followers, setFollowers] = React.useState<string[]>(() => (user.id ? listFollowers(user.id) : []));
  const iFollow = React.useMemo(() => isFollowing(session?.id || null, user.id), [session?.id, user.id, followers.length]);
  return (
    <button
      className={`btn ${iFollow ? "" : "btn-primary"}`}
      onClick={() => {
        if (!session?.id) return;
        if (iFollow) unfollow(session.id, user.id);
        else follow(session.id, user.id);
        setFollowers(listFollowers(user.id));
      }}
    >
      {iFollow ? (<><UserMinus size={16} /> Отписаться</>) : (<><UserPlus size={16} /> Подписаться</>)}
    </button>
  );
}

function ProfilePosts({ user, session, memberMap }: { user: Account; session: { id: string; username: string } | null; memberMap: Record<string,string> }) {
  const [comments, setComments] = React.useState<ProfileComment[]>(() => listProfileComments(user.id));
  React.useEffect(() => {
    const onSocial = () => setComments(listProfileComments(user.id));
    window.addEventListener("forum:social-change", onSocial as any);
    return () => window.removeEventListener("forum:social-change", onSocial as any);
  }, [user.id]);

  return (
    <section className="grid gap-3">
      {session?.id && (
        <CommentComposer
          onPost={(text) => {
            addProfileComment(user.id, session.id, text, { authorName: session.username });
            setComments(listProfileComments(user.id));
          }}
        />
      )}
      <div className="grid gap-2">
        {comments.length === 0 && <div className={`${PANEL_CLASS} text-sm text-zinc-300/80`}>Комментариев пока нет.</div>}
        {buildTree(comments).map((node) => (
          <CommentItem
            key={node.comment.id}
            node={node}
            currentUserId={session?.id || ""}
            ownerId={user.id}
            memberMap={memberMap}
            onReply={(pid, text) => {
              if (!session?.id) return;
              addReply(user.id, session.id, pid, text, session.username);
              setComments(listProfileComments(user.id));
            }}
            onDelete={(cid) => {
              if (!session?.id) return;
              removeProfileComment(user.id, cid, session.id);
              setComments(listProfileComments(user.id));
            }}
          />
        ))}
      </div>
    </section>
  );
}

function CommentComposer({ onPost }: { onPost: (text: string) => void }) {
  const [text, setText] = React.useState("");
  return (
    <div className={SOFT_PANEL}>
      <div className="flex items-start gap-2">
        <MessageSquare size={16} className="mt-1 shrink-0" />
        <textarea className="input min-h-[80px] flex-1" placeholder="Напишите комментарий..." value={text} onChange={(e) => setText(e.target.value)} />
      </div>
      <div className="mt-2 flex justify-end">
        <button className="btn btn-primary" onClick={() => { const t = text.trim(); if (!t) return; onPost(t); setText(""); }}>
          Отправить
        </button>
      </div>
    </div>
  );
}

type CommentNode = { comment: ProfileComment; replies: CommentNode[] };
function buildTree(all: ProfileComment[]): CommentNode[] {
  const map: Record<string, CommentNode> = {};
  all.forEach(c => { map[c.id] = { comment: c, replies: [] }; });
  const roots: CommentNode[] = [];
  all.forEach(c => { const pid = c.parentId || ""; if (pid && map[pid]) map[pid].replies.push(map[c.id]); else roots.push(map[c.id]); });
  roots.sort((a,b) => (a.comment.createdAt < b.comment.createdAt ? 1 : -1));
  const sortRec = (n: CommentNode) => n.replies.sort((a,b)=> (a.comment.createdAt > b.comment.createdAt ? 1 : -1)).forEach(sortRec);
  roots.forEach(sortRec);
  return roots;
}

function CommentItem({
  node, currentUserId, ownerId, onReply, onDelete, memberMap
}: {
  node: CommentNode; currentUserId: string; ownerId: string; onReply: (parentId: string, text: string) => void; onDelete: (commentId: string) => void; memberMap: Record<string,string>;
}) {
  const [openReply, setOpenReply] = React.useState(false);
  const acc = findAccountById(node.comment.authorId);
  const name = node.comment.authorName || acc?.username || (node.comment.authorId === ownerId ? "Владелец" : node.comment.authorId === currentUserId ? "Вы" : "Участник");
  const profileUsername = acc?.username || node.comment.authorName;
  return (
    <div className={SOFT_PANEL}>
      <div className="flex items-start gap-3">
        <div className="h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-sky-500/60 to-violet-500/60" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <div className="text-xs text-zinc-300/90">
              {profileUsername ? (
                <a href={`/forum/profile/${profileUsername}`} className="font-semibold text-white hover:underline">{name}</a>
              ) : (<span className="font-semibold text-white">{name}</span>)}
              <span className="opacity-70"> · {new Date(node.comment.createdAt).toLocaleString("ru-RU")}</span>
            </div>
            {(currentUserId === node.comment.authorId || currentUserId === ownerId) && (
              <button className="btn" title="Удалить" onClick={() => onDelete(node.comment.id)}>
                <Trash2 size={14} />
              </button>
            )}
          </div>
          <div className="mt-1 whitespace-pre-wrap text-sm text-zinc-100/90">{node.comment.content}</div>
          <Reactions targetId={ownerId} commentId={node.comment.id} currentUserId={currentUserId} />
          <div className="mt-2 flex items-center gap-2"><button className="btn" onClick={() => setOpenReply(v => !v)}>Ответить</button></div>
          {openReply && <div className="mt-2"><InlineReply onSend={(t) => { onReply(node.comment.id, t); setOpenReply(false); }} /></div>}
          {!!node.replies.length && (
            <div className="mt-3 space-y-2 border-l border-white/10 pl-3">
              {node.replies.map(child => (
                <CommentItem key={child.comment.id} node={child} currentUserId={currentUserId} ownerId={ownerId} onReply={onReply} onDelete={onDelete} memberMap={memberMap} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InlineReply({ onSend }: { onSend: (text: string) => void }) {
  const [text, setText] = React.useState("");
  return (
    <div className="flex items-start gap-2">
      <textarea className="input min-h-[60px] flex-1" placeholder="Ответ..." value={text} onChange={(e) => setText(e.target.value)} />
      <button className="btn btn-primary" onClick={() => { const t = text.trim(); if (!t) return; onSend(t); setText(""); }}>
        Отправить
      </button>
    </div>
  );
}

function Reactions({ targetId, commentId, currentUserId }: { targetId: string; commentId: string; currentUserId: string }) {
  const [, force] = React.useReducer((x)=>x+1,0);
  const state = listReactions(targetId)[commentId] || { counts: { like: 0, smile: 0, useful: 0 }, byUser: {} } as any;
  const mine = currentUserId ? getUserReaction(targetId, commentId, currentUserId) : undefined;
  const Btn = ({ r, label }: { r: Reaction; label: string }) => (
    <button className={`btn text-xs ${mine === r ? "btn-primary" : ""}`} onClick={() => { if (!currentUserId) return; toggleReaction(targetId, commentId, currentUserId, r); force(); }}>
      {label} {state.counts?.[r] ? <span className="opacity-80">{state.counts[r]}</span> : null}
    </button>
  );
  return (
    <div className="mt-2 flex flex-wrap items-center gap-2">
      <Btn r="like" label="👍" />
      <Btn r="smile" label="😊" />
      <Btn r="useful" label="💡" />
    </div>
  );
}

/* ===== customize modal + CROP ===== */
function CustomizeButton({ user, onUpdated, saveProfile, allowHide }: { user: Account; onUpdated: () => void; saveProfile: (p: any) => Promise<void>; allowHide: boolean }) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <button className="btn" onClick={() => setOpen(true)}><Pencil size={16} /> Настроить профиль</button>
      {open && <CustomizeModal user={user} onClose={() => setOpen(false)} onSaved={() => { onUpdated(); setOpen(false); }} saveProfile={saveProfile} allowHide={allowHide} />}
    </>
  );
}

const BADGE_OPTIONS = ["Founder", "Early", "Contributor", "VIP", "Designer"];

/* helpers for cropper */
function clamp(n: number, min: number, max: number) { return Math.max(min, Math.min(max, n)); }
function useImg(src: string | null) {
  const [img, setImg] = React.useState<HTMLImageElement | null>(null);
  React.useEffect(() => {
    if (!src) { setImg(null); return; }
    const i = new Image();
    i.onload = () => setImg(i);
    i.src = src;
    return () => { /* no-op */ };
  }, [src]);
  return img;
}

function ImageCropper({
  src, aspect, round = false, title = "Обрезать изображение", onCancel, onDone,
}: { src: string; aspect: number; round?: boolean; title?: string; onCancel: () => void; onDone: (dataUrl: string) => void; }) {
  const frameW = round ? 360 : 900;
  const frameH = Math.round(frameW / aspect);
  const img = useImg(src);
  const [scale, setScale] = React.useState(1);
  const [pos, setPos] = React.useState({ x: 0, y: 0 });
  const dragRef = React.useRef<{ x: number; y: number; startX: number; startY: number } | null>(null);

  React.useEffect(() => {
    if (!img) return;
    const min = Math.max(frameW / img.naturalWidth, frameH / img.naturalHeight);
    const init = min * 1.05;
    setScale(init);
    const w = img.naturalWidth * init;
    const h = img.naturalHeight * init;
    setPos({ x: (frameW - w) / 2, y: (frameH - h) / 2 });
  }, [img]); // eslint-disable-line

  const clampPos = React.useCallback((p: { x: number; y: number }, s: number) => {
    if (!img) return p;
    const w = img.naturalWidth * s;
    const h = img.naturalHeight * s;
    return { x: clamp(p.x, frameW - w, 0), y: clamp(p.y, frameH - h, 0) };
  }, [img, frameW, frameH]);

  const onPointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    const pt = "touches" in e ? e.touches[0] : (e as React.MouseEvent);
    dragRef.current = { x: pos.x, y: pos.y, startX: pt.clientX, startY: pt.clientY };
  };
  const onPointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!dragRef.current) return;
    const pt = "touches" in e ? e.touches[0] : (e as React.MouseEvent);
    const dx = pt.clientX - dragRef.current.startX;
    const dy = pt.clientY - dragRef.current.startY;
    setPos(prev => clampPos({ x: dragRef.current!.x + dx, y: dragRef.current!.y + dy }, scale));
  };
  const onPointerUp = () => { dragRef.current = null; };
  const onWheel: React.WheelEventHandler<HTMLDivElement> = (e) => {
    if (!img) return;
    e.preventDefault();
    const min = Math.max(frameW / img.naturalWidth, frameH / img.naturalHeight);
    const max = min * 6;
    const next = clamp(scale * (e.deltaY > 0 ? 0.94 : 1.06), min, max);
    setScale(next); setPos(p => clampPos(p, next));
  };

  const doCrop = () => {
    if (!img) return;
    const outW = round ? 800 : 1920;
    const outH = Math.round(outW / aspect);
    const k = outW / frameW;

    const cvs = document.createElement("canvas");
    cvs.width = outW; cvs.height = outH;
    const ctx = cvs.getContext("2d")!;
    if (round) {
      ctx.save();
      ctx.beginPath();
      const r = Math.min(outW, outH) / 2;
      ctx.arc(outW/2, outH/2, r, 0, Math.PI*2);
      ctx.clip();
    }
    const drawW = img.naturalWidth * scale * k;
    const drawH = img.naturalHeight * scale * k;
    ctx.drawImage(img, pos.x * k, pos.y * k, drawW, drawH);
    if (round) ctx.restore();

    onDone(cvs.toDataURL("image/png", 0.95));
  };

  const slider = () => {
    if (!img) return null;
    const min = Math.max(frameW / img.naturalWidth, frameH / img.naturalHeight);
    const max = min * 6;
    return (
      <input
        type="range"
        min={min}
        max={max}
        step={min / 50}
        value={scale}
        onChange={(e) => { const v = Number(e.target.value); setScale(v); setPos(p => clampPos(p, v)); }}
        className="w-full"
      />
    );
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 px-4">
      <div className="w-[min(96vw,1000px)] rounded-3xl border border-white/10 bg-[#0b0f1b]/95 p-5 shadow-2xl backdrop-blur">
        <div className="mb-3 text-lg font-semibold text-white">{title}</div>

        <div className="grid gap-4 lg:grid-cols-[auto_1fr]">
          <div
            className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 select-none touch-none"
            style={{ width: frameW, height: frameH, cursor: "grab" }}
            onMouseDown={onPointerDown as any}
            onMouseMove={onPointerMove as any}
            onMouseUp={onPointerUp}
            onMouseLeave={onPointerUp}
            onTouchStart={onPointerDown as any}
            onTouchMove={onPointerMove as any}
            onTouchEnd={onPointerUp}
            onWheel={onWheel}
          >
            {img && (
              <img
                src={src}
                alt="crop"
                draggable={false}
                style={{
                  position: "absolute", left: 0, top: 0,
                  transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`,
                  transformOrigin: "top left",
                  userSelect: "none", pointerEvents: "none",
                }}
              />
            )}
            {round && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="h-[90%] aspect-square rounded-full ring-2 ring-white/40" />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <div className="text-xs uppercase tracking-[0.28em] text-zinc-400/80">Зум / перетаскивание</div>
            {slider()}
            <div className="flex items-center gap-2">
              <button className="btn" onClick={onCancel}>Отмена</button>
              <div className="grow" />
              <button className="btn btn-primary" onClick={doCrop}>Готово</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* — Модалка настроек с интеграцией кроппера — */
function CustomizeModal({
  user, onClose, onSaved, saveProfile, allowHide,
}: { user: Account; onClose: () => void; onSaved: () => void; saveProfile: (p: any) => Promise<void>; allowHide: boolean }) {
  const [avatar, setAvatar] = React.useState<string>(user.profile.avatarData || "");
  const [banner, setBanner] = React.useState<string>(user.profile.bannerData || "");
  const [from, setFrom] = React.useState(user.profile.accentFrom || "#22d3ee");
  const [to, setTo] = React.useState(user.profile.accentTo || "#8b5cf6");
  const [bio, setBio] = React.useState(user.profile.bio || "");
  const [signature, setSignature] = React.useState(user.profile.signature || "");
  const [website, setWebsite] = React.useState(user.profile.links?.website || "");
  const [discord, setDiscord] = React.useState(user.profile.links?.discord || "");
  const [telegram, setTelegram] = React.useState(user.profile.links?.telegram || "");
  const [badges, setBadges] = React.useState<string[]>(user.profile.badges || []);
  const [showEmail, setShowEmail] = React.useState<boolean>(user.profile.privacy?.showEmail ?? false);
  const [showStats, setShowStats] = React.useState<boolean>(user.profile.privacy?.showStats ?? true);
  const [showLinks, setShowLinks] = React.useState<boolean>(user.profile.privacy?.showLinks ?? true);
  const [allowComments, setAllowComments] = React.useState<boolean>(user.profile.privacy?.allowComments ?? true);
  const [showFollowers, setShowFollowers] = React.useState<boolean>(user.profile.privacy?.showFollowers ?? true);
  const [showSecondaryRole, setShowSecondaryRole] = React.useState<boolean>(user.profile.privacy?.showSecondaryRole !== false);
  const [hiddenProfile, setHiddenProfile] = React.useState<boolean>(user.profile.privacy?.hiddenProfile ?? false);

  const [cropSrc, setCropSrc] = React.useState<string | null>(null);
  const [cropTarget, setCropTarget] = React.useState<null | "avatar" | "banner">(null);

  const toggleBadge = (badge: string) => setBadges((prev) => (prev.includes(badge) ? prev.filter((b) => b !== badge) : prev.length >= 3 ? prev : [...prev, badge]));

  const onSelectFile = (target: "avatar" | "banner") => (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    const r = new FileReader();
    r.onload = () => { setCropSrc(String(r.result || "")); setCropTarget(target); };
    r.readAsDataURL(f);
  };

  const save = async () => {
    const draft = { website: website.trim(), discord: discord.trim(), telegram: telegram.trim() };
    const links = Object.fromEntries(Object.entries(draft).filter(([,v]) => v)) as Record<string,string>;
    const nextPrivacy: any = { ...(user.profile.privacy || {}), showEmail, showStats, showLinks, allowComments, showFollowers, showSecondaryRole };
    if (allowHide) nextPrivacy.hiddenProfile = hiddenProfile; else delete nextPrivacy.hiddenProfile;
    await saveProfile({
      avatarData: avatar || undefined,
      bannerData: banner || undefined,
      accentFrom: from, accentTo: to,
      bio: bio.trim() || undefined,
      signature: signature.trim() || undefined,
      links: Object.keys(links).length ? links : undefined,
      badges, privacy: nextPrivacy
    });
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-start justify-center bg-black/70 px-4 py-8 overflow-y-auto">
      <div className={`${PANEL_CLASS} w-[min(820px,96vw)]`} style={{ position: "relative" }}>
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold text-white">Настройка профиля</div>
          <button className="btn" onClick={onClose}>Закрыть</button>
        </div>

        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className={SOFT_PANEL}>
              <div className="text-xs uppercase tracking-[0.28em] text-zinc-400/80">Аватар</div>
              <div className="mt-3 flex items-center gap-3">
                <div className="h-20 w-20 rounded-full" style={{ background: avatar ? `url(${avatar}) center/cover` : `linear-gradient(135deg, ${from}, ${to})` }} />
                <div className="flex flex-col gap-2">
                  <label className="btn flex items-center gap-2">
                    <Camera size={16} /> Загрузить
                    <input type="file" accept="image/*" hidden onChange={onSelectFile("avatar")} />
                  </label>
                  {avatar && <button className="btn" onClick={() => setAvatar("")}>Удалить</button>}
                  {avatar && <button className="btn" onClick={() => { setCropSrc(avatar); setCropTarget("avatar"); }}>Обрезать заново</button>}
                </div>
              </div>
            </div>

            <div className={SOFT_PANEL}>
              <div className="text-xs uppercase tracking-[0.28em] text-zinc-400/80">Баннер</div>
              <div className="mt-3 h-20 w-full rounded-xl" style={{ background: banner ? `url(${banner}) center/cover` : `linear-gradient(135deg, ${from}, ${to})` }} />
              <div className="mt-3 flex gap-2">
                <label className="btn flex items-center gap-2">
                  <Camera size={16} /> Загрузить
                  <input type="file" accept="image/*" hidden onChange={onSelectFile("banner")} />
                </label>
                {banner && <button className="btn" onClick={() => setBanner("")}>Удалить</button>}
                {banner && <button className="btn" onClick={() => { setCropSrc(banner); setCropTarget("banner"); }}>Обрезать заново</button>}
              </div>
            </div>

            <div className={SOFT_PANEL}>
              <div className="text-xs uppercase tracking-[0.28em] text-zinc-400/80">Градиент</div>
              <div className="mt-3 flex items-center gap-4">
                <label className="flex items-center gap-2 text-xs text-zinc-400/80"><span>От</span><input type="color" value={from} onChange={(e) => setFrom(e.target.value)} /></label>
                <label className="flex items-center gap-2 text-xs text-zinc-400/80"><span>До</span><input type="color" value={to} onChange={(e) => setTo(e.target.value)} /></label>
              </div>
            </div>

            <div className={SOFT_PANEL}>
              <div className="text-xs uppercase tracking-[0.28em] text-zinc-400/80">Бейджи (до 3)</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {BADGE_OPTIONS.map((badge) => {
                  const active = badges.includes(badge);
                  return (
                    <button key={badge} className={`btn flex items-center gap-2 ${active ? "btn-primary" : ""}`} onClick={() => toggleBadge(badge)} type="button">
                      <BadgeCheck size={16} /> {badge}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className={`${SOFT_PANEL} sm:col-span-2`}>
              <div className="text-xs uppercase tracking-[0.28em] text-zinc-400/80">О себе</div>
              <textarea className="input mt-2 min-h-[120px]" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Расскажите о себе" />
            </div>

            <div className={`${SOFT_PANEL} sm:col-span-2`}>
              <div className="text-xs uppercase tracking-[0.28em] text-zinc-400/80">Подпись</div>
              <textarea className="input mt-2 min-h-[90px]" value={signature} onChange={(e) => setSignature(e.target.value)} placeholder="Текст под сообщениями" />
            </div>

            <div className={`${SOFT_PANEL} sm:col-span-2`}>
              <div className="text-xs uppercase tracking-[0.28em] text-zinc-400/80">Ссылки</div>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                <input className="input" placeholder="https://website" value={website} onChange={(e) => setWebsite(e.target.value)} />
                <input className="input" placeholder="discord username" value={discord} onChange={(e) => setDiscord(e.target.value)} />
                <input className="input" placeholder="@telegram" value={telegram} onChange={(e) => setTelegram(e.target.value)} />
              </div>
            </div>

            <div className={`${SOFT_PANEL} sm:col-span-2`}>
              <div className="text-xs uppercase tracking-[0.28em] text-zinc-400/80">Приватность</div>
              <div className="mt-3 grid gap-2 text-sm">
                <label className="flex items-center gap-2"><input type="checkbox" checked={showEmail} onChange={(e) => setShowEmail(e.target.checked)} /> Показывать e-mail</label>
                <label className="flex items-center gap-2"><input type="checkbox" checked={showStats} onChange={(e) => setShowStats(e.target.checked)} /> Показывать статистику</label>
                <label className="flex items-center gap-2"><input type="checkbox" checked={showLinks} onChange={(e) => setShowLinks(e.target.checked)} /> Показывать ссылки</label>
                <label className="flex items-center gap-2"><input type="checkbox" checked={showFollowers} onChange={(e) => setShowFollowers(e.target.checked)} /> Показывать подписчиков</label>
                <label className="flex items-center gap-2"><input type="checkbox" checked={allowComments} onChange={(e) => setAllowComments(e.target.checked)} /> Разрешить комментарии</label>
                <label className="flex items-center gap-2"><input type="checkbox" checked={showSecondaryRole} onChange={(e) => setShowSecondaryRole(e.target.checked)} /> Показывать вторую роль</label>
                {allowHide && (
                  <label className="flex items-center gap-2"><input type="checkbox" checked={hiddenProfile} onChange={(e) => setHiddenProfile(e.target.checked)} /> Скрыть профиль (виден только администрации)</label>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button className="btn" onClick={onClose}>Отмена</button>
            <button className="btn btn-primary" onClick={save}>Сохранить</button>
          </div>
        </div>
      </div>

      {/* Overlay кроппера */}
      {cropSrc && cropTarget && (
        <ImageCropper
          src={cropSrc}
          aspect={cropTarget === "avatar" ? 1 : 21/6}
          round={cropTarget === "avatar"}
          title={cropTarget === "avatar" ? "Обрезать аватар" : "Обрезать баннер"}
          onCancel={() => { setCropSrc(null); setCropTarget(null); }}
          onDone={(data) => { cropTarget === "avatar" ? setAvatar(data) : setBanner(data); setCropSrc(null); setCropTarget(null); }}
        />
      )}
    </div>
  );
}
