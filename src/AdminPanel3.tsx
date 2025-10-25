import React from "react";
import { Link } from "react-router-dom";
import {
  listSections,
  createSection,
  updateSection,
  listTopics,
  updateTopic,
  moveTopic,
  deleteSection,
  deleteTopic,
  listLatestPosts,
} from "./store/forumRemote";
import {
  listAccounts,
  setRole,
  banUser,
  unbanUser,
  muteUser,
  unmuteUser,
  listInvites,
  generateInvites,
  deleteInvite,
  getServerSettings,
  updateServerSettings,
  getSessionAccount,
  setVip,
  unsetVip,
  setCustomLabels,
  getProfileById,
  type Role,
} from "./store/authRemote";

const CHEB_LABELS: readonly string[] = ["cheb", "cheb-access", "chebzik"];

function getActorId(): string {
  try {
    const raw =
      localStorage.getItem("forum:session") ??
      sessionStorage.getItem("forum:session");
    const s = raw ? JSON.parse(raw) : null;
    return s?.userId || "unknown";
  } catch {
    return "unknown";
  }
}

export default function AdminPanel3() {
  const [tab, setTab] = React.useState<
    "insights" | "users" | "sections" | "topics" | "invites" | "maintenance"
  >("users");
  const [me, setMe] = React.useState<any | null>(null);

  React.useEffect(() => {
    (async () => {
      try {
        setMe(await getSessionAccount());
      } catch {
        setMe(null);
      }
    })();
  }, []);

  const role = me?.role as string | undefined;
  const isOwner = !!me?.owner;
  const tabs: Array<typeof tab> = (() => {
    if (isOwner || role === "developer") {
      return ["insights", "users", "sections", "topics", "invites", "maintenance"];
    }
    if (role === "admin") {
      return ["users", "topics", "invites"];
    }
    if (role === "moderator") {
      return ["users", "invites"];
    }
    return ["topics"];
  })();

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6">
      <div className="mb-4 flex gap-2">
        {tabs.map((t) => (
          <button
            key={t}
            className={`btn ${tab === t ? "btn-primary" : ""}`}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>
      {tab === "insights" && <InsightsTab />}
      {tab === "users" && <UsersTab meRole={role} meId={me?.id} meOwner={isOwner} />}
      {tab === "sections" && <SectionsTab />}
      {tab === "topics" && <TopicsTab meRole={role} />}
      {tab === "invites" && <InvitesTab meRole={role} meId={me?.id || ""} />}
      {tab === "maintenance" && <MaintenanceTab />}
    </div>
  );
}

function InsightsTab() {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [stats, setStats] = React.useState({
    members: 0,
    sections: 0,
    topics: 0,
    replies: 0,
    views: 0,
  });
  const [latestTopics, setLatestTopics] = React.useState<any[]>([]);
  const [recentInvites, setRecentInvites] = React.useState<any[]>([]);
  const [latestPosts, setLatestPosts] = React.useState<any[]>([]);

  React.useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const [accounts, sections, topics, invites, posts] = await Promise.all([
          listAccounts(),
          listSections(),
          listTopics(),
          listInvites().catch(() => []),
          listLatestPosts(5).catch(() => []),
        ]);
        if (!alive) return;
        const replies = topics.reduce((sum: number, t: any) => sum + (t.replyCount ?? 0), 0);
        const views = topics.reduce((sum: number, t: any) => sum + (t.viewCount ?? 0), 0);
        const sortedTopics = [...topics]
          .sort(
            (a, b) =>
              new Date(b.updatedAt || b.createdAt || 0).getTime() -
              new Date(a.updatedAt || a.createdAt || 0).getTime()
          )
          .slice(0, 5);
        const sortedInvites = Array.isArray(invites)
          ? [...invites].sort(
              (a, b) =>
                new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
            )
          : [];
        setStats({
          members: accounts.length,
          sections: sections.length,
          topics: topics.length,
          replies,
          views,
        });
        setLatestTopics(sortedTopics);
        setRecentInvites(sortedInvites.slice(0, 5));
        setLatestPosts(Array.isArray(posts) ? posts : []);
      } catch (err: any) {
        if (!alive) return;
        setError(err?.message || "Failed to load insights");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const formatDate = (value?: string | null) => {
    if (!value) return "—";
    try {
      return new Date(value).toLocaleString();
    } catch {
      return value;
    }
  };

  return (
    <div className="grid gap-4">
      {error && (
        <div className="card border border-rose-500/40 bg-rose-500/10 p-4 text-sm text-rose-200">
          {error}
        </div>
      )}

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Участники", value: stats.members },
          { label: "Разделы", value: stats.sections },
          { label: "Темы", value: stats.topics },
          { label: "Ответы", value: stats.replies },
        ].map((card) => (
          <div key={card.label} className="card p-4">
            <div className="text-xs uppercase tracking-[0.28em] text-zinc-400/80">
              {card.label}
            </div>
            <div className="mt-2 text-2xl font-bold text-white">
              {loading ? "…" : card.value}
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="font-semibold">Активные темы</div>
            {loading && <span className="text-xs text-zinc-400/80">Обновление…</span>}
          </div>
          <div className="grid gap-2">
            {!loading && latestTopics.length === 0 && (
              <div className="text-sm text-zinc-400/80">Тем пока нет.</div>
            )}
            {latestTopics.map((topic: any) => (
              <div
                key={topic.id}
                className="rounded-xl border border-white/10 bg-white/[0.04] p-3 text-sm"
              >
                <div className="font-semibold text-white">{topic.title}</div>
                <div className="mt-1 text-xs text-zinc-400/80">
                  Обновлено: {formatDate(topic.updatedAt || topic.createdAt)} · Ответов{" "}
                  {topic.replyCount ?? 0}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="font-semibold">Свежие приглашения</div>
            <span className="text-xs text-zinc-400/80">{recentInvites.length}</span>
          </div>
          <div className="grid gap-2">
            {!loading && recentInvites.length === 0 && (
              <div className="text-sm text-zinc-400/80">
                Пока не создано ни одного приглашения.
              </div>
            )}
            {recentInvites.slice(0, 5).map((invite) => (
              <div
                key={`${invite.code}-${invite.createdAt}`}
                className="rounded-xl border border-white/10 bg-white/[0.04] p-3 text-sm"
              >
                <div className="font-mono text-xs text-cyan-300">{invite.code}</div>
                <div className="mt-1 text-xs text-zinc-400/80">
                  {formatDate(invite.createdAt)} {invite.note ? `· ${invite.note}` : ""}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="font-semibold">Последние ответы</div>
          <Link to="/forum?feed=latest" className="text-xs text-cyan-300 hover:underline">
            Перейти в ленту
          </Link>
        </div>
        <div className="grid gap-2">
          {!loading && latestPosts.length === 0 && (
            <div className="text-sm text-zinc-400/80">Свежих ответов нет.</div>
          )}
          {latestPosts.map((post: any) => (
            <div
              key={post.id}
              className="rounded-xl border border-white/10 bg-white/[0.04] p-3 text-sm"
            >
              <div className="font-semibold text-white truncate">
                {post.topicTitle || post.title || "Пост"}
              </div>
              <div className="mt-1 text-xs text-zinc-400/80">
                {formatDate(post.createdAt || post.updatedAt)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function UsersTab({
  meRole,
  meId,
  meOwner,
}: {
  meRole?: string;
  meId?: string;
  meOwner?: boolean;
}) {
  const [rows, setRows] = React.useState<any[]>([]);
  const [query, setQuery] = React.useState("");
  const [chebAccess, setChebAccess] = React.useState<Record<string, boolean>>({});
  const [chebBusy, setChebBusy] = React.useState<Record<string, boolean>>({});

  const load = React.useCallback(async () => {
    try {
      const accounts = await listAccounts();
      setRows(accounts);
      const pairs = await Promise.allSettled(
        accounts.map(async (u) => {
          try {
            const profile = await getProfileById(u.id);
            const labels = (profile?.labels || [])
              .map((label) => label.trim().toLowerCase())
              .filter(Boolean);
            const allowed = labels.some((label) => CHEB_LABELS.includes(label));
            return [u.id, allowed] as const;
          } catch {
            return [u.id, false] as const;
          }
        })
      );
      const map: Record<string, boolean> = {};
      for (const pair of pairs) {
        if (pair.status === "fulfilled") {
          const [id, allowed] = pair.value;
          map[id] = allowed;
        }
      }
      setChebAccess(map);
    } catch (e: any) {
      alert(e?.message || "Failed to load users");
    }
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const filteredRows = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((u) => {
      const username = String(u.username || "").toLowerCase();
      const email = String(u.email || "").toLowerCase();
      const number = String(u.userNumber || "");
      const invitedBy = String(u.invitedByName || "").toLowerCase();
      return (
        username.includes(q) ||
        email.includes(q) ||
        number.includes(q) ||
        invitedBy.includes(q)
      );
    });
  }, [rows, query]);

  const canManageRoles = meRole === "developer";
  const canBan = meRole === "developer" || meRole === "admin";
  const canMute = meRole === "developer" || meRole === "admin" || meRole === "moderator";
  const canGrantCheb = !!meOwner || meRole === "developer";

  const changeRole = async (id: string, role: Role) => {
    if (!canManageRoles) return;
    try {
      await setRole(id, role);
      load();
    } catch (e: any) {
      alert(e?.message || "Failed to set role");
    }
  };

  const mute = async (id: string) => {
    if (!canMute) return;
    const mins = parseInt(prompt("Mute minutes", "60") || "60", 10);
    const until = new Date(Date.now() + Math.max(1, mins) * 60000).toISOString();
    try {
      await muteUser(id, until);
      await load();
    } catch (e: any) {
      alert(e?.message || "Failed to mute");
    }
  };
  const unmute = async (id: string) => {
    if (!canMute) return;
    try {
      await unmuteUser(id);
      await load();
    } catch (e: any) {
      alert(e?.message || "Failed to unmute");
    }
  };

  const ban = async (id: string) => {
    if (!canBan) return;
    const days = parseInt(prompt("Ban days", "7") || "7", 10);
    const until = new Date(Date.now() + Math.max(1, days) * 86400000).toISOString();
    try {
      await banUser(id, until);
      await load();
    } catch (e: any) {
      alert(e?.message || "Failed to ban");
    }
  };
  const unban = async (id: string) => {
    if (!canBan) return;
    try {
      await unbanUser(id);
      await load();
    } catch (e: any) {
      alert(e?.message || "Failed to unban");
    }
  };

  const toggleCheb = async (id: string, next: boolean) => {
    if (!canGrantCheb) return;
    setChebBusy((prev) => ({ ...prev, [id]: true }));
    try {
      const profile = await getProfileById(id);
      const existing = new Set(
        (profile?.labels || []).map((label) => label.trim()).filter(Boolean)
      );
      for (const label of CHEB_LABELS) existing.delete(label);
      if (next) existing.add("cheb-access");
      await setCustomLabels(id, Array.from(existing).slice(0, 7));
      setChebAccess((prev) => ({ ...prev, [id]: next }));
    } catch (e: any) {
      alert(e?.message || "Failed to update Cheb access");
    } finally {
      setChebBusy((prev) => ({ ...prev, [id]: false }));
    }
  };

  return (
    <div className="card p-4">
      <div className="mb-3 text-sm opacity-70">
        Remote accounts fetched from the Worker API. Use this panel to adjust roles and moderation privileges.
      </div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <input
          className="input w-full sm:w-72"
          placeholder="Поиск по нику, e-mail или номеру"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="btn" onClick={load}>
          Обновить
        </button>
        {query && (
          <button className="btn" onClick={() => setQuery("")}>
            Сбросить
          </button>
        )}
      </div>
      <div className="grid gap-2">
        {filteredRows.map((u) => {
          const isOwner = Number(u.userNumber || 0) === 1;
          const roleLabel = String(u.role || "user");
          const actions: React.ReactNode[] = [];
          if (canMute && !isOwner) {
            actions.push(
              <button key="mute" className="btn" onClick={() => mute(u.id)}>
                Mute
              </button>
            );
            actions.push(
              <button key="unmute" className="btn" onClick={() => unmute(u.id)}>
                Unmute
              </button>
            );
          }
          if (canBan && !isOwner) {
            actions.push(
              <button key="ban" className="btn" onClick={() => ban(u.id)}>
                Ban
              </button>
            );
            actions.push(
              <button key="unban" className="btn" onClick={() => unban(u.id)}>
                Unban
              </button>
            );
          }

          const now = Date.now();
          const vipActive = !!u.vipUntil && new Date(u.vipUntil).getTime() > now;
          const isMuted = !!u.mutedUntil && new Date(u.mutedUntil).getTime() > now;
          const isBanned = !!u.bannedUntil && new Date(u.bannedUntil).getTime() > now;

          const manageLabels = async () => {
            try {
              const prof = await getProfileById(u.id);
              const current = (prof?.labels || []).join(", ");
              const input = prompt("Custom labels (comma-separated, up to 7)", current || "");
              if (input === null) return;
              const labels = input
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
                .slice(0, 7);
              await setCustomLabels(u.id, labels);
              alert("Labels updated");
            } catch (e: any) {
              alert(e?.message || "Failed to update labels");
            }
          };

          const giveVip = async () => {
            const days = parseInt(prompt("VIP days", "30") || "30", 10);
            try {
              await setVip(u.id, isNaN(days) ? 30 : Math.max(1, days));
              await load();
            } catch (e: any) {
              alert(e?.message || "Failed to set VIP");
            }
          };
          const removeVip = async () => {
            try {
              await unsetVip(u.id);
              await load();
            } catch (e: any) {
              alert(e?.message || "Failed to remove VIP");
            }
          };

          const invitedSnippet = (() => {
            if (isOwner) return "OWNER";
            if (meRole === "developer") {
              return u.invitedByName ? `invited by: ${u.invitedByName}` : "";
            }
            if (meId && u.invitedById && u.invitedById === meId) {
              return "invited by: you";
            }
            return "";
          })();

          const statusChips: React.ReactNode[] = [];
          if (invitedSnippet) {
            statusChips.push(
              <span
                key="invited"
                className="rounded-full bg-white/5 px-2 py-0.5 text-[11px] uppercase tracking-[0.26em] text-zinc-300"
              >
                {invitedSnippet}
              </span>
            );
          }
          if (vipActive) {
            statusChips.push(
              <span
                key="vip"
                className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] uppercase tracking-wider text-amber-300"
                title={`VIP until ${new Date(u.vipUntil).toLocaleString()}`}
              >
                VIP
              </span>
            );
          }
          if (isBanned) {
            statusChips.push(
              <span
                key="banned"
                className="rounded-full bg-rose-500/10 px-2 py-0.5 text-[11px] uppercase tracking-[0.26em] text-rose-300"
                title={`Banned until ${u.bannedUntil ? new Date(u.bannedUntil).toLocaleString() : ""}`}
              >
                Banned
              </span>
            );
          }
          if (isMuted) {
            statusChips.push(
              <span
                key="muted"
                className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] uppercase tracking-[0.26em] text-amber-300"
                title={`Muted until ${u.mutedUntil ? new Date(u.mutedUntil).toLocaleString() : ""}`}
              >
                Muted
              </span>
            );
          }
          if (chebAccess[u.id]) {
            statusChips.push(
              <span
                key="cheb"
                className="rounded-full bg-emerald-400/10 px-2 py-0.5 text-[11px] uppercase tracking-[0.26em] text-emerald-300"
              >
                CHEB
              </span>
            );
          }

          return (
            <div
              key={u.id}
              className="grid grid-cols-1 items-center gap-3 rounded-xl border px-3 py-2 sm:grid-cols-[80px_1fr_1fr_220px_auto]"
              style={{ borderColor: "var(--border)" }}
            >
              <div className="text-xs opacity-70">#{u.userNumber}</div>
              <div className="font-semibold">{u.username}</div>
              <div className="text-sm opacity-80 truncate">
                {meOwner || meRole === "developer" ? u.email : ""}
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs opacity-70">
                {statusChips.length ? statusChips : null}
              </div>
              <div className="flex flex-wrap items-center justify-end gap-2">
                {(canManageRoles && !isOwner) || (isOwner && meId === u.id) ? (
                  <select
                    className="input"
                    value={u.role}
                    onChange={(e) => changeRole(u.id, e.target.value as Role)}
                  >
                    <option value="developer">developer</option>
                    <option value="admin">admin</option>
                    <option value="moderator">moderator</option>
                    <option value="vip">vip</option>
                    <option value="user">user</option>
                    <option value="newbie">newbie</option>
                  </select>
                ) : (
                  <span
                    className="rounded-full border px-2 py-1 text-xs uppercase tracking-wider"
                    style={{ borderColor: "var(--border)" }}
                  >
                    {isOwner ? "OWNER" : roleLabel}
                  </span>
                )}
                {canGrantCheb && !isOwner && (
                  <button
                    className="btn"
                    onClick={() => toggleCheb(u.id, !chebAccess[u.id])}
                    disabled={!!chebBusy[u.id]}
                    title={
                      chebAccess[u.id] ? "Убрать доступ к Чебзику" : "Выдать доступ к Чебзику"
                    }
                  >
                    {chebAccess[u.id] ? "Убрать Чебзика" : "Дать Чебзика"}
                  </button>
                )}
                <button className="btn" onClick={manageLabels} title="Custom labels">
                  Labels
                </button>
                <button className="btn" onClick={giveVip} title="Give VIP">
                  Give VIP
                </button>
                {u.vipUntil && (
                  <button className="btn" onClick={removeVip} title="Remove VIP">
                    UnVIP
                  </button>
                )}
                {actions.length ? actions : null}
              </div>
            </div>
          );
        })}
        {!filteredRows.length && <div className="text-sm opacity-70">No users found.</div>}
      </div>
    </div>
  );
}

function SectionsTab() {
  const [rows, setRows] = React.useState<any[]>([]);
  const [title, setTitle] = React.useState("");
  const [desc, setDesc] = React.useState("");

  const reload = React.useCallback(async () => {
    try {
      setRows(await listSections());
    } catch (e: any) {
      alert(e?.message || "Failed to load sections");
    }
  }, []);

  React.useEffect(() => {
    reload();
  }, [reload]);

  const add = async () => {
    if (!title.trim()) return;
    try {
      await createSection({
        title: title.trim(),
        description: desc.trim(),
        actorId: getActorId(),
      } as any);
      setTitle("");
      setDesc("");
      reload();
    } catch (e: any) {
      alert(e?.message || "Failed to create section");
    }
  };

  const edit = async (id: string, field: "title" | "description", value: string) => {
    try {
      await updateSection(id, { [field]: value, actorId: getActorId() } as any);
      reload();
    } catch (e: any) {
      alert(e?.message || "Failed to update section");
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this section?")) return;
    try {
      await deleteSection(id);
      reload();
    } catch (e: any) {
      alert(e?.message || "Failed");
    }
  };

  return (
    <div className="grid gap-4">
      <div className="card p-4">
        <div className="mb-2 font-semibold">Create section</div>
        <div className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
          <input
            className="input"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className="input"
            placeholder="Description"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
          <button className="btn btn-primary" onClick={add}>
            Add
          </button>
        </div>
      </div>

      <div className="card p-4">
        <div className="mb-2 font-semibold">Sections</div>
        <div className="grid gap-2">
          {rows.map((s) => (
            <div
              key={s.id}
              className="grid grid-cols-1 items-center gap-2 rounded-xl border px-3 py-2 sm:grid-cols-[160px_1fr_1fr_auto]"
              style={{ borderColor: "var(--border)" }}
            >
              <div className="text-xs opacity-70">{s.id.slice(0, 8)}:</div>
              <input
                className="input"
                value={s.title}
                onChange={(e) => edit(s.id, "title", e.target.value)}
              />
              <input
                className="input"
                value={s.description || ""}
                onChange={(e) => edit(s.id, "description", e.target.value)}
              />
              <div className="text-right">
                <button className="btn" onClick={() => remove(s.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
          {!rows.length && <div className="text-sm opacity-70">No sections yet.</div>}
        </div>
      </div>
    </div>
  );
}

function TopicsTab({ meRole }: { meRole?: string }) {
  const [rows, setRows] = React.useState<any[]>([]);

  const reload = React.useCallback(async () => {
    try {
      setRows(await listTopics());
    } catch (e: any) {
      alert(e?.message || "Failed to load topics");
    }
  }, []);

  React.useEffect(() => {
    reload();
  }, [reload]);

  const canPin = meRole === "developer";
  const canLock = meRole === "developer";
  const canMove = meRole === "developer";
  const canDelete = meRole === "developer" || meRole === "admin";

  const pin = async (id: string, v: boolean) => {
    if (!canPin) return;
    try {
      await updateTopic(id, { pinned: v, actorId: getActorId() } as any);
      reload();
    } catch (e: any) {
      alert(e?.message || "Failed to update topic");
    }
  };

  const lock = async (id: string, v: boolean) => {
    if (!canLock) return;
    try {
      await updateTopic(id, { locked: v, actorId: getActorId() } as any);
      reload();
    } catch (e: any) {
      alert(e?.message || "Failed to update topic");
    }
  };

  const move = async (id: string) => {
    if (!canMove) return;
    const to = prompt("Move to section ID", "");
    const toTrim = (to || "").trim();
    if (!toTrim) return;
    try {
      await moveTopic(id, toTrim);
      reload();
    } catch (e: any) {
      alert(e?.message || "Failed to move topic");
    }
  };

  const remove = async (id: string) => {
    if (!canDelete) return;
    if (!confirm("Delete this topic?")) return;
    try {
      await deleteTopic(id);
      reload();
    } catch (e: any) {
      alert(e?.message || "Failed to delete");
    }
  };

  return (
    <div className="card p-4">
      <div className="mb-2 font-semibold">Topics</div>
      <div className="grid gap-2">
        {rows.map((t) => {
          const controls: React.ReactNode[] = [];
          if (canPin) {
            controls.push(
              <label key="pin" className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={!!t.pinned}
                  onChange={(e) => pin(t.id, e.target.checked)}
                />
                pinned
              </label>
            );
          }
          if (canLock) {
            controls.push(
              <label key="lock" className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={!!t.locked}
                  onChange={(e) => lock(t.id, e.target.checked)}
                />
                locked
              </label>
            );
          }
          if (canMove) {
            controls.push(
              <button key="move" className="btn" onClick={() => move(t.id)}>
                Move
              </button>
            );
          }
          if (canDelete) {
            controls.push(
              <button key="delete" className="btn" onClick={() => remove(t.id)}>
                Delete
              </button>
            );
          }

          return (
            <div
              key={t.id}
              className="grid grid-cols-1 items-start gap-3 rounded-xl border px-3 py-3 sm:grid-cols-[1fr_auto]"
              style={{ borderColor: "var(--border)" }}
            >
              <div>
                <div className="font-semibold">{t.title}</div>
                <div className="text-xs opacity-70">
                  id: {t.id.slice(0, 8)}: section: {t.sectionId.slice(0, 8)}:
                </div>
                {(t.pinned || t.locked) && (
                  <div className="mt-1 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.2em] opacity-70">
                    {t.pinned && <span>pinned</span>}
                    {t.locked && <span>locked</span>}
                  </div>
                )}
              </div>
              {controls.length ? (
                <div className="flex flex-wrap items-center justify-end gap-2">
                  {controls}
                </div>
              ) : null}
            </div>
          );
        })}
        {!rows.length && <div className="text-sm opacity-70">No topics yet.</div>}
      </div>
    </div>
  );
}

function InvitesTab({ meRole, meId }: { meRole?: string; meId: string }) {
  const [rows, setRows] = React.useState<any[]>([]);
  const [count, setCount] = React.useState(5);
  const [note, setNote] = React.useState("");
  const isDev = meRole === "developer";

  const reload = React.useCallback(async () => {
    try {
      const all = await listInvites();
      const visible = isDev ? all : all.filter((i) => (i.createdBy || "") === (meId || ""));
      setRows(visible);
    } catch (e: any) {
      alert(e?.message || "Failed");
    }
  }, [isDev, meId]);

  React.useEffect(() => {
    reload();
  }, [reload]);

  const now = Date.now();
  const windowMs =
    meRole === "admin" ? 48 * 3600 * 1000 : meRole === "moderator" ? 72 * 3600 * 1000 : 0;
  const windowStart = windowMs ? now - windowMs : 0;
  const recentMine = rows.filter((i) => {
    const ts = new Date(i.createdAt).getTime();
    return !isNaN(ts) && ts >= windowStart;
  });
  const maxPerWindow = meRole === "admin" ? 2 : meRole === "moderator" ? 1 : Infinity;
  const remaining = Math.max(0, maxPerWindow - recentMine.length);

  const generate = async () => {
    try {
      const desired = Math.max(1, Math.min(20, count));
      const toCreate = isFinite(remaining) ? Math.min(remaining, desired) : desired;
      if (!isDev && toCreate <= 0) {
        alert("Invite quota reached. Try again later.");
        return;
      }
      await generateInvites(toCreate, note || undefined);
      setNote("");
      reload();
    } catch (e: any) {
      alert(e?.message || "Failed to generate");
    }
  };

  const remove = async (code: string) => {
    if (!confirm("Delete this invite?")) return;
    try {
      await deleteInvite(code);
      reload();
    } catch (e: any) {
      alert(e?.message || "Failed");
    }
  };

  return (
    <div className="card p-4">
      <div className="mb-3 font-semibold">Invite codes</div>
      <div className="mb-4 grid gap-2 sm:grid-cols-[120px_1fr_auto]">
        <input
          className="input"
          type="number"
          min={1}
          max={Math.min(20, isFinite(remaining) ? Math.max(remaining, 0) : 20)}
          value={count}
          onChange={(e) => setCount(parseInt(e.target.value || "1", 10))}
        />
        <input
          className="input"
          placeholder="note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <button
          className="btn btn-primary"
          onClick={generate}
          disabled={!isDev && remaining <= 0}
          title={!isDev && remaining <= 0 ? "Quota reached" : undefined}
        >
          Generate
        </button>
      </div>
      {!isDev && (
        <div className="mb-4 text-xs opacity-70">
          {meRole === "admin" && (
            <span>
              Remaining in 48h window: <b>{remaining}</b> of 2
            </span>
          )}
          {meRole === "moderator" && (
            <span>
              Remaining in 72h window: <b>{remaining}</b> of 1
            </span>
          )}
        </div>
      )}

      <div className="grid gap-2">
        {rows.map((i) => (
          <div
            key={`${i.code}-${i.createdAt}`}
            className="grid grid-cols-1 items-center gap-2 rounded-xl border px-3 py-2 sm:grid-cols-[160px_1fr_1fr_1fr_auto]"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="font-mono text-sm">{i.code}</div>
            <div className="text-xs opacity-70">
              created: {new Date(i.createdAt).toLocaleString()}
            </div>
            <div className="text-xs opacity-80">
              {isDev ? `by: ${i.createdByName || i.createdBy?.slice(0, 8)}` : "by: you"}
            </div>
            <div className="text-xs">{i.note || ""}</div>
            <div className="text-xs">
              {i.usedBy ? <span className="text-emerald-400">used</span> : <span className="opacity-70">unused</span>}
            </div>
            <div className="text-right">
              <button className="btn" onClick={() => remove(i.code)}>
                Delete
              </button>
            </div>
          </div>
        ))}
        {!rows.length && <div className="text-sm opacity-70">No invite codes yet.</div>}
      </div>
    </div>
  );
}

function MaintenanceTab() {
  const [mode, setMode] = React.useState<"invite" | "open">("invite");

  React.useEffect(() => {
    (async () => {
      try {
        const s = await getServerSettings();
        setMode(((s as any)?.registrationMode as any) || "invite");
      } catch {}
    })();
  }, []);

  return (
    <div className="card p-4">
      <div className="mb-2 font-semibold">Registration settings</div>

      <div className="mb-3 flex items-center gap-2">
        <span className="text-sm opacity-70">Registration:</span>
        <select
          className="input"
          value={mode}
          onChange={async (e) => {
            const v = e.target.value as "invite" | "open";
            setMode(v);
            try {
              await updateServerSettings({ registrationMode: v } as any);
            } catch (err: any) {
              alert(err?.message || "Failed");
            }
          }}
        >
          <option value="invite">Invite only</option>
          <option value="open">Open</option>
        </select>
      </div>

      <div className="mb-2 font-semibold">Maintenance</div>
      <p className="mb-0 text-sm opacity-70">
        All maintenance is server-driven. Contact the owner/developer to perform administrative maintenance tasks.
      </p>
    </div>
  );
}
