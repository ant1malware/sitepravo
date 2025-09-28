import React from "react";
import { Link } from "react-router-dom";
import { Search, Users, ChevronRight } from "lucide-react";
import ForumSubnav from "./ForumSubnav";
import Badge, { computePoints } from "./components/Badge";
import { type Account } from "./store/forumStore";
import {
  listPublicMembers,
  getSessionAccount as getRemoteSession,
  getProfileById,
  type PublicMember,
  type RemoteProfile,
} from "./store/authRemote";

const ROLE_STYLES: Record<string, { label: string; color: string }> = {
  developer: { label: "Developer", color: "#22d3ee" },
  admin: { label: "Admin", color: "#ef4444" },
  moderator: { label: "Moderator", color: "#8b5cf6" },
  vip: { label: "VIP", color: "#eab308" },
  user: { label: "User", color: "#94a3b8" },
  newbie: { label: "Newbie", color: "#22d3ee" },
};

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

function MemberCard({ member, highlight }: { member: Account; highlight: boolean }) {
  const pts = (member as any).score ?? computePoints({ posts: member.posts, likes: member.likes, topics: member.topics });
  const accentFrom = member.profile.accentFrom || "#22d3ee";
  const accentTo = member.profile.accentTo || "#8b5cf6";
  const avatar = member.profile.avatarData;
  return (
    <Link
      to={"/forum/profile/" + member.username}
      className={`card group flex flex-col gap-3 p-4 transition duration-200 hover:border-cyan-400/50 ${
        highlight ? "border-cyan-500/60" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="relative h-14 w-14 overflow-hidden rounded-2xl border border-white/5">
          {avatar ? (
            <img
              src={avatar}
              alt={`${member.username} avatar`}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div
              className="h-full w-full"
              style={{ background: `linear-gradient(135deg, ${accentFrom}, ${accentTo})` }}
            />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <div className="truncate text-lg font-semibold text-white">
              {member.username}
            </div>
            <RoleBadge role={member.role} />
            <Badge points={pts} />
            {highlight && (
              <span className="rounded-full bg-cyan-500/10 px-2 py-0.5 text-[11px] uppercase tracking-[0.3em] text-cyan-300">
                You
              </span>
            )}
          </div>
          <div className="mt-1 text-xs text-zinc-400/80">
            Joined {new Date(member.createdAt).toLocaleDateString()}
          </div>
        </div>
        <ChevronRight
          size={16}
          className="opacity-0 transition-transform duration-200 group-hover:translate-x-1 group-hover:opacity-100"
        />
      </div>
      {member.profile.bio && (
        <div className="line-clamp-2 text-sm text-zinc-300/80">
          {member.profile.bio}
        </div>
      )}
      <div className="mt-auto flex items-center gap-4 text-[11px] uppercase tracking-[0.28em] text-zinc-400/80">
        <span>Topics {member.topics}</span>
        <span>Posts {member.posts}</span>
        <span>Likes {member.likes}</span>
      </div>
    </Link>
  );
}

export default function ForumMembers() {
  const [members, setMembers] = React.useState<Account[]>([]);
  const [query, setQuery] = React.useState("");
  const [session, setSession] = React.useState<{ id: string; username: string } | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const deriveAccent = React.useCallback((username: string, offset = 0) => {
    const safe = username || "user";
    let hash = 0;
    for (let i = 0; i < safe.length; i++) {
      hash = (hash << 5) - hash + safe.charCodeAt(i);
      hash |= 0;
    }
    const hue = (Math.abs(hash) + offset * 63) % 360;
    const saturation = 62;
    const lightness = offset ? 52 : 58;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }, []);

  const normalizeProfile = React.useCallback(
    (member: PublicMember, profile: RemoteProfile | null | undefined): Account["profile"] => ({
      bio: profile?.bio || "",
      signature: profile?.signature || "",
      links: profile?.links || {},
      avatarData: profile?.avatarData,
      accentFrom: profile?.accentFrom || deriveAccent(member.username, 0),
      accentTo: profile?.accentTo || deriveAccent(member.username, 1),
      badges: profile?.badges || [],
      privacy: {
        showEmail: !!profile?.privacy?.showEmail,
        showStats: profile?.privacy?.showStats !== false,
        showLinks: profile?.privacy?.showLinks,
        allowComments: profile?.privacy?.allowComments,
        showFollowers: profile?.privacy?.showFollowers,
      },
    }),
    [deriveAccent]
  );

  React.useEffect(() => {
    const refresh = async () => {
      setLoading(true);
      try {
        const [meRemote, rows] = await Promise.all([
          getRemoteSession(),
          listPublicMembers(),
        ]);
        if (rows?.length) {
          const profiles = await Promise.all(
            rows.map(async (u) => {
              if (u.profile) return u.profile;
              try {
                return await getProfileById(u.id);
              } catch {
                return null;
              }
            })
          );
          const adapted: Account[] = rows.map((u, idx) => ({
            id: u.id,
            username: u.username,
            email: `${u.username}@hidden.local`,
            createdAt: u.createdAt,
            role: u.role,
            userNumber: u.userNumber,
            posts: (u as any).posts ?? 0,
            likes: (u as any).likes ?? 0,
            topics: (u as any).topics ?? 0,
            profile: normalizeProfile(u, profiles[idx]),
            bans: null,
            mutes: null,
          }));
          setMembers(adapted);
          if (meRemote) {
            setSession({ id: meRemote.id, username: meRemote.username });
          } else {
            setSession(null);
          }
          setError(null);
          setLoading(false);
          return;
        }
        setMembers([]);
        if (meRemote) {
          setSession({ id: meRemote.id, username: meRemote.username });
        } else {
          setSession(null);
        }
        setError(null);
        setLoading(false);
        return;
      } catch (err) {
        console.warn("Failed to load remote members", err);
        setError("Не удалось загрузить участников");
      }

      setLoading(false);
      setMembers([]);
      setSession(null);
    };
    refresh();
    const h = () => refresh();
    window.addEventListener("forum:session", h as any);
    window.addEventListener("storage", h as any);
    return () => {
      window.removeEventListener("forum:session", h as any);
      window.removeEventListener("storage", h as any);
    };
  }, [normalizeProfile]);

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
    .sort((a, b) => a.username.localeCompare(b.username));

  // Quick featured groups
  const devs = members.filter((m) => m.role === "developer");
  const admins = members.filter((m) => m.role === "admin");
  const mods = members.filter((m) => m.role === "moderator");

  return (
    <main
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(900px 620px at 18% -12%, rgba(59,130,246,0.2), transparent 65%), radial-gradient(1200px 760px at 92% 0%, rgba(236,72,153,0.18), transparent 68%), #0d0d12",
        color: "#f8fafc",
      }}
    >
      <div className="mx-auto max-w-6xl px-4 py-6">
        <ForumSubnav />
        <div className="card mb-6 overflow-hidden">
          <div className="flex flex-wrap items-center gap-3 px-5 py-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
              <Users size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm uppercase tracking-[0.38em] text-zinc-400/70">
                Community
              </div>
              <h1 className="text-3xl font-extrabold text-white">Members</h1>
              <p className="mt-1 text-sm text-zinc-300/80">
                Browse every registered profile, discover new collaborators, and jump straight into a member's timeline.
              </p>
            </div>
          </div>
        </div>

        {/* Featured groups: Developers / Admins / Moderators */}
        <div className="mb-5 grid gap-4 lg:grid-cols-3">
          <div className="card p-3">
            <div className="mb-2 text-xs uppercase tracking-[0.28em] text-cyan-300/80">Developers</div>
            <div className="grid gap-2">
              {devs.slice(0, 6).map((m) => (
                <Link key={m.id} to={`/forum/profile/${m.username}`} className="flex items-center gap-2 text-sm">
                  <span className="h-2 w-2 rounded-full bg-cyan-400" />
                  <span className="font-semibold">{m.username}</span>
                </Link>
              ))}
              {!devs.length && <div className="text-xs opacity-60">No developers yet</div>}
            </div>
          </div>
          <div className="card p-3">
            <div className="mb-2 text-xs uppercase tracking-[0.28em] text-rose-300/80">Admins</div>
            <div className="grid gap-2">
              {admins.slice(0, 8).map((m) => (
                <Link key={m.id} to={`/forum/profile/${m.username}`} className="flex items-center gap-2 text-sm">
                  <span className="h-2 w-2 rounded-full bg-rose-400" />
                  <span className="font-semibold">{m.username}</span>
                </Link>
              ))}
              {!admins.length && <div className="text-xs opacity-60">No admins yet</div>}
            </div>
          </div>
          <div className="card p-3">
            <div className="mb-2 text-xs uppercase tracking-[0.28em] text-violet-300/80">Moderators</div>
            <div className="grid gap-2">
              {mods.slice(0, 8).map((m) => (
                <Link key={m.id} to={`/forum/profile/${m.username}`} className="flex items-center gap-2 text-sm">
                  <span className="h-2 w-2 rounded-full bg-violet-400" />
                  <span className="font-semibold">{m.username}</span>
                </Link>
              ))}
              {!mods.length && <div className="text-xs opacity-60">No moderators yet</div>}
            </div>
          </div>
        </div>

        <div className="card mb-5 flex flex-col gap-4 px-4 py-3 sm:flex-row sm:items-center">
          <div className="flex-1 min-w-0">
            <div className="text-xs uppercase tracking-[0.28em] text-zinc-400/70">
              Поиск
            </div>
            <div className="text-lg font-semibold text-white">Find members</div>
          </div>
          <div className="w-full sm:w-auto">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <input
                className="input w-full pl-9"
                placeholder="Search members by name, email, or role"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={loading && !members.length}
              />
            </div>
            <div className="mt-2 text-xs uppercase tracking-[0.26em] text-zinc-500">
              {filtered.length} of {members.length}
            </div>
          </div>
        </div>

        {error && (
          <div className="card mb-5 border border-rose-500/40 bg-rose-500/10 p-4 text-sm text-rose-100">
            {error}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((member) => (
            <MemberCard
              key={member.id}
              member={member}
              highlight={session?.id === member.id}
            />
          ))}
        </div>

        {loading && (
          <div className="card mt-6 p-5 text-sm text-zinc-300/80">
            Загружаем участников...
          </div>
        )}
        {!loading && !filtered.length && (
          <div className="card mt-6 p-5 text-sm text-zinc-300/80">
            No members match that query yet.
          </div>
        )}
      </div>
    </main>
  );
}



