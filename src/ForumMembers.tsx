import React from "react";
import { Link } from "react-router-dom";
import { Search, Users, ChevronRight } from "lucide-react";
import {
  listAccounts,
  getSessionAccount,
  type Account,
} from "./store/forumStore";

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
  const accentFrom = member.profile.accentFrom || "#22d3ee";
  const accentTo = member.profile.accentTo || "#8b5cf6";
  return (
    <Link
      to={"/forum/profile/" + member.username}
      className={`card group flex flex-col gap-3 p-4 transition duration-200 hover:border-cyan-400/50 ${
        highlight ? "border-cyan-500/60" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className="h-14 w-14 rounded-2xl"
          style={{
            background: member.profile.avatarData
              ? `url(${member.profile.avatarData}) center/cover`
              : `linear-gradient(135deg, ${accentFrom}, ${accentTo})`,
          }}
        />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <div className="truncate text-lg font-semibold text-white">
              {member.username}
            </div>
            <RoleBadge role={member.role} />
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
  const [members, setMembers] = React.useState<Account[]>(() => listAccounts());
  const [query, setQuery] = React.useState("");
  const [session, setSession] = React.useState<Account | null>(() => getSessionAccount());

  React.useEffect(() => {
    const refresh = () => {
      setMembers(listAccounts());
      setSession(getSessionAccount());
    };
    refresh();
    window.addEventListener("forum:session", refresh as any);
    window.addEventListener("storage", refresh as any);
    return () => {
      window.removeEventListener("forum:session", refresh as any);
      window.removeEventListener("storage", refresh as any);
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
    .sort((a, b) => a.username.localeCompare(b.username));

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

        <div className="mb-5 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              className="input w-full pl-9"
              placeholder="Search members by name, email, or role"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">
            {filtered.length} of {members.length}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((member) => (
            <MemberCard
              key={member.id}
              member={member}
              highlight={session?.id === member.id}
            />
          ))}
        </div>

        {!filtered.length && (
          <div className="card mt-6 p-5 text-sm text-zinc-300/80">
            No members match that query yet.
          </div>
        )}
      </div>
    </main>
  );
}
