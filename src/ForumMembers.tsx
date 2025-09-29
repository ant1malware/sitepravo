import React from "react";
import { Link } from "react-router-dom";
import { Search, ChevronRight, Sparkles } from "lucide-react";
import ForumSubnav from "./ForumSubnav";
import Badge, { computePoints } from "./components/Badge";
import { listAccounts as listLocalAccounts, getSessionAccount as getLocalSession, type Account } from "./store/forumStore";
import { listPublicMembers, getSessionAccount as getRemoteSession, type PublicMember } from "./store/authRemote";

const ROLE_STYLES: Record<string, { label: string; color: string }> = {
  developer: { label: "Разработчик", color: "#22d3ee" },
  admin: { label: "Админ", color: "#ef4444" },
  moderator: { label: "Модератор", color: "#8b5cf6" },
  vip: { label: "VIP", color: "#eab308" },
  user: { label: "Участник", color: "#94a3b8" },
  newbie: { label: "Новичок", color: "#22d3ee" },
};

const dateFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

function RoleBadge({ role }: { role: string }) {
  const style = ROLE_STYLES[role] || { label: role, color: "#94a3b8" };
  return (
    <span
      className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.26em]"
      style={{ color: style.color }}
    >
      {style.label}
    </span>
  );
}

function MemberAvatar({ member }: { member: Account }) {
  const accentFrom = member.profile.accentFrom || "#22d3ee";
  const accentTo = member.profile.accentTo || "#8b5cf6";
  const initials = member.username.slice(0, 2).toUpperCase();
  return (
    <div className="relative">
      <div
        className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-white/10 shadow-[0_20px_45px_-25px_rgba(15,23,42,0.9)]"
        style={{
          background: member.profile.avatarData
            ? `url(${member.profile.avatarData}) center/cover`
            : `linear-gradient(135deg, ${accentFrom}, ${accentTo})`,
        }}
      >
        {!member.profile.avatarData && (
          <span className="text-lg font-semibold uppercase tracking-wide text-white/90">
            {initials}
          </span>
        )}
      </div>
    </div>
  );
}

function memberScore(member: Account): number {
  if (typeof (member as any).score === "number") return (member as any).score;
  const stats = ((member as any).stats || {}) as { posts?: number; likes?: number; topics?: number };
  const posts = typeof stats.posts === "number" ? stats.posts : member.posts;
  const likes = typeof stats.likes === "number" ? stats.likes : member.likes;
  const topics = typeof stats.topics === "number" ? stats.topics : member.topics;
  return computePoints({ posts, likes, topics });
}

function MemberCard({ member, highlight }: { member: Account; highlight: boolean }) {
  const remoteStats = ((member as any).stats || {}) as {
    posts?: number;
    topics?: number;
    likes?: number;
  };
  const posts = typeof remoteStats.posts === "number" ? remoteStats.posts : member.posts;
  const topics = typeof remoteStats.topics === "number" ? remoteStats.topics : member.topics;
  const likes = typeof remoteStats.likes === "number" ? remoteStats.likes : member.likes;
  const pts = memberScore(member);
  const accentFrom = member.profile.accentFrom || "#22d3ee";
  const accentTo = member.profile.accentTo || "#8b5cf6";
  const joined = member.createdAt ? dateFormatter.format(new Date(member.createdAt)) : "";

  return (
    <Link
      to={`/forum/profile/${member.username}`}
      className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-400/60 hover:bg-white/[0.06] ${
        highlight ? "border-cyan-400/70 ring-2 ring-cyan-400/30" : ""
      }`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-80 transition duration-300 group-hover:opacity-100"
        style={{ background: `linear-gradient(130deg, ${accentFrom}22, transparent 55%)` }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-40"
        style={{ background: "radial-gradient(160% 120% at 0% 0%, rgba(34,211,238,0.18), transparent 60%)" }}
      />
      <div className="relative flex flex-col gap-4">
        <div className="flex items-start gap-4">
          <MemberAvatar member={member} />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="truncate text-lg font-semibold text-white">{member.username}</span>
              <RoleBadge role={member.role} />
              <Badge points={pts} />
              {highlight && (
                <span className="rounded-full bg-cyan-500/20 px-2 py-0.5 text-[11px] uppercase tracking-[0.3em] text-cyan-200">
                  Это вы
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-300/80">
              <span>#{member.userNumber}</span>
              <span className="hidden sm:inline">•</span>
              <span>С нами с {joined}</span>
            </div>
            {member.profile.bio && (
              <p className="line-clamp-2 text-sm text-zinc-200/85">{member.profile.bio}</p>
            )}
          </div>
          <ChevronRight
            size={16}
            className="mt-1 opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100"
          />
        </div>

        <div className="grid gap-2 sm:grid-cols-3">
          {[{ label: "Темы", value: topics }, { label: "Посты", value: posts }, { label: "Лайки", value: likes }].map(
            (item) => (
              <div
                key={item.label}
                className="rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2 text-center backdrop-blur-sm"
              >
                <div className="text-sm font-semibold text-white">{item.value}</div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.28em] text-zinc-300/75">{item.label}</div>
              </div>
            ),
          )}
        </div>
      </div>
    </Link>
  );
}

export default function ForumMembers() {
  const [members, setMembers] = React.useState<Account[]>(() => listLocalAccounts());
  const [query, setQuery] = React.useState("");
  const [session, setSession] = React.useState<{ id: string; username: string } | null>(null);

  React.useEffect(() => {
    const refresh = async () => {
      // Try remote API first; fallback to local demo store
      try {
        const meRemote = await getRemoteSession();
        const rows = await listPublicMembers();
        if (meRemote || rows?.length) {
          const adapted: Account[] = rows.map((u: PublicMember) => {
            const profile = u.profile || null;
            const stats = u.stats || null;
            const accentFrom = profile?.accentFrom || "#22d3ee";
            const accentTo = profile?.accentTo || "#8b5cf6";
            const avatar =
              profile?.avatarData || (profile as any)?.avatar || (profile as any)?.avatarUrl || undefined;
            const banner =
              profile?.bannerData || (profile as any)?.banner || (profile as any)?.bannerUrl || undefined;
            const posts = typeof stats?.posts === "number" ? stats.posts : 0;
            const likes = typeof stats?.likes === "number" ? stats.likes : 0;
            const topics = typeof stats?.topics === "number" ? stats.topics : 0;
            const account: Account = {
              id: u.id,
              username: u.username,
              email: `${u.username}@hidden.local`,
              createdAt: u.createdAt,
              role: u.role,
              userNumber: u.userNumber,
              posts,
              likes,
              topics,
              profile: {
                bio: profile?.bio || "",
                signature: profile?.signature || "",
                links: profile?.links || {},
                accentFrom,
                accentTo,
                avatarData: avatar,
                bannerData: banner,
                badges: profile?.badges || [],
                privacy: { showEmail: false, showStats: true, ...(profile?.privacy || {}) },
              },
              bans: null,
              mutes: null,
            };
            if (profile?.labels) {
              (account as any).profile.labels = profile.labels;
            }
            if (stats) {
              (account as any).stats = stats;
              if (typeof stats.score === "number") {
                (account as any).score = stats.score;
              }
            }
            return account;
          });
          setMembers(adapted);
          if (meRemote) setSession({ id: meRemote.id, username: meRemote.username }); else setSession(null);
          return;
        }
      } catch {}
      // Local fallback
      setMembers(listLocalAccounts());
      const meLocal = getLocalSession();
      setSession(meLocal ? { id: meLocal.id, username: meLocal.username } : null);
    };
    refresh();
    const h = () => refresh();
    window.addEventListener("forum:session", h as any);
    window.addEventListener("storage", h as any);
    return () => {
      window.removeEventListener("forum:session", h as any);
      window.removeEventListener("storage", h as any);
    };
  }, []);

  const normalized = query.trim().toLowerCase();
  const filtered = members
    .filter((member) => {
      if (!normalized) return true;
      return (
        member.username.toLowerCase().includes(normalized) ||
        member.email.toLowerCase().includes(normalized) ||
        member.role.toLowerCase().includes(normalized)
      );
    })
    .sort((a, b) => {
      const scoreDiff = memberScore(b) - memberScore(a);
      if (scoreDiff !== 0) return scoreDiff;
      return a.username.localeCompare(b.username);
    });

  // Quick featured groups
  const devs = members.filter((m) => m.role === "developer");
  const admins = members.filter((m) => m.role === "admin");
  const mods = members.filter((m) => m.role === "moderator");

  return (
    <main
      className="min-h-screen text-slate-100"
      style={{
        background:
          "radial-gradient(1200px 680px at 15% -10%, rgba(56,189,248,0.18), transparent 65%), radial-gradient(1100px 720px at 90% -6%, rgba(167,139,250,0.14), transparent 70%), linear-gradient(180deg, #04060d 0%, #090b16 100%)",
      }}
    >
      <div className="mx-auto max-w-6xl px-4 py-8">
        <ForumSubnav />
        <section className="relative mb-6 overflow-hidden rounded-3xl border border-white/10 bg-[#101527]/85 p-6 shadow-[0_50px_120px_-60px_rgba(15,23,42,0.9)] backdrop-blur">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-sky-500/20 via-transparent to-fuchsia-500/10" />
          <div className="pointer-events-none absolute -right-12 top-10 h-44 w-44 rounded-full bg-sky-400/20 blur-3xl" />
          <div className="relative flex flex-wrap items-center gap-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/20 text-cyan-200 shadow-inner shadow-cyan-500/20">
              <Sparkles size={22} />
            </div>
            <div className="flex-1 min-w-0 space-y-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.36em] text-zinc-200/80">
                Сообщество SKY
              </span>
              <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Участники форума</h1>
              <p className="max-w-2xl text-sm text-zinc-300/85 sm:text-base">
                Найдите любого участника, изучите профиль и узнайте, чем живёт команда. Здесь собираются будущие напарники и эксперты, готовые к совместной работе.
              </p>
            </div>
            <div className="grid gap-3 text-right text-xs uppercase tracking-[0.32em] text-zinc-300/70 sm:text-sm">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 shadow-inner shadow-black/40">
                <div className="text-2xl font-bold tracking-tight text-white">{members.length}</div>
                <div>участников</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 shadow-inner shadow-black/40">
                <div className="text-2xl font-bold tracking-tight text-white">{filtered.length}</div>
                <div>в подборке</div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-6 grid gap-4 lg:grid-cols-3">
          {[{
            title: "Разработчики",
            color: "text-cyan-200/80",
            entries: devs,
            empty: "Пока нет разработчиков",
          }, {
            title: "Администраторы",
            color: "text-rose-200/80",
            entries: admins,
            empty: "Пока нет администраторов",
          }, {
            title: "Модераторы",
            color: "text-violet-200/80",
            entries: mods,
            empty: "Пока нет модераторов",
          }].map((group) => (
            <div
              key={group.title}
              className="rounded-3xl border border-white/10 bg-white/[0.05] p-4 backdrop-blur shadow-[0_30px_90px_-60px_rgba(15,23,42,0.9)]"
            >
              <div className={`mb-3 text-xs uppercase tracking-[0.32em] ${group.color}`}>{group.title}</div>
              <div className="grid gap-2 text-sm text-zinc-200/85">
                {group.entries.slice(0, 8).map((m) => {
                  const from = m.profile.accentFrom || "#22d3ee";
                  const to = m.profile.accentTo || "#8b5cf6";
                  return (
                    <Link
                      key={m.id}
                      to={`/forum/profile/${m.username}`}
                      className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 transition hover:border-cyan-400/50"
                    >
                      <div
                        className="h-8 w-8 rounded-xl border border-white/10"
                        style={{
                          background: m.profile.avatarData
                            ? `url(${m.profile.avatarData}) center/cover`
                            : `linear-gradient(135deg, ${from}, ${to})`,
                        }}
                      />
                      <span className="font-semibold text-white">{m.username}</span>
                    </Link>
                  );
                })}
                {!group.entries.length && (
                  <div className="text-xs text-zinc-400/70">{group.empty}</div>
                )}
              </div>
            </div>
          ))}
        </section>

        <div className="mb-6 flex flex-wrap items-center gap-3">
          <div className="relative min-w-[220px] flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              className="input w-full rounded-2xl border-white/10 bg-white/[0.03] pl-11 text-sm text-white placeholder:text-zinc-400"
              placeholder="Поиск по нику, почте или роли"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="text-xs uppercase tracking-[0.32em] text-zinc-400">
            Показано {filtered.length} / {members.length}
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((member) => (
            <MemberCard
              key={member.id}
              member={member}
              highlight={session?.id === member.id}
            />
          ))}
        </div>

        {!filtered.length && (
          <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.05] p-5 text-sm text-zinc-300/80">
            Нет участников по этому запросу.
          </div>
        )}
      </div>
    </main>
  );
}



