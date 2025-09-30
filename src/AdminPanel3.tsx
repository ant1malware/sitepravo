import React from "react";
import { resetForumEmpty } from "./store/forumStore";
import {
  listSections,
  createSection,
  updateSection,
  listTopics,
  updateTopic,
  moveTopic,
  deleteSection,
  deleteTopic,
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
import { canViewerSee } from "./forumHidden";

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
    "users" | "sections" | "topics" | "invites" | "maintenance"
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
      return ["users", "sections", "topics", "invites", "maintenance"];
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
      {tab === "users" && <UsersTab meRole={role} meId={me?.id} meOwner={isOwner} />}
      {tab === "sections" && <SectionsTab />}
      {tab === "topics" && <TopicsTab meRole={role} />}
      {tab === "invites" && (
        <InvitesTab meRole={role} meId={me?.id || ""} />
      )}
      {tab === "maintenance" && <MaintenanceTab />}
    </div>
  );
}

/* ===== Users ===== */
function UsersTab({ meRole, meId, meOwner }: { meRole?: string; meId?: string; meOwner?: boolean }) {
  const [rows, setRows] = React.useState<any[]>([]);

  const load = React.useCallback(async () => {
    try {
      const data = await listAccounts();
      const viewerId = meId || null;
      setRows(data.filter((u) => canViewerSee({ id: u.id, userNumber: u.userNumber, owner: u.owner }, viewerId)));
    } catch (e: any) {
      alert(e?.message || "Failed to load users");
    }
  }, [meId]);

  React.useEffect(() => {
    load();
  }, [load]);

  const canManageRoles = meOwner || meRole === "developer";
  const canBan = meOwner || meRole === "developer" || meRole === "admin";
  const canMute = meOwner || meRole === "developer" || meRole === "admin" || meRole === "moderator";

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

  return (
    <div className="card p-4">
      <div className="mb-3 text-sm opacity-70">
        Remote accounts fetched from the Worker API. Use this panel to adjust roles and moderation privileges.
      </div>
      <div className="grid gap-2">
        {rows.map((u) => {
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

          const vipBadge = u.vipUntil ? (
            <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] uppercase tracking-wider text-amber-300" title={`VIP until ${new Date(u.vipUntil).toLocaleString()}`}>VIP</span>
          ) : null;

          const manageLabels = async () => {
            try {
              const prof = await getProfileById(u.id);
              const current = (prof?.labels || []).join(', ');
              const input = prompt('Custom labels (comma-separated, up to 7)', current || '');
              if (input === null) return;
              const labels = input.split(',').map(s => s.trim()).filter(Boolean).slice(0,7);
              await setCustomLabels(u.id, labels);
              alert('Labels updated');
            } catch (e: any) { alert(e?.message || 'Failed to update labels'); }
          };

          const giveVip = async () => {
            const days = parseInt(prompt('VIP days', '30') || '30', 10);
            try { await setVip(u.id, isNaN(days) ? 30 : Math.max(1, days)); await load(); } catch (e:any) { alert(e?.message || 'Failed to set VIP'); }
          };
          const removeVip = async () => { try { await unsetVip(u.id); await load(); } catch (e:any) { alert(e?.message || 'Failed to remove VIP'); } };

          // invitedBy visibility rules:
          // - developer sees who invited anyone
          // - admin/moderator only see "invited by: you" for accounts they invited
          const invitedSnippet = (() => {
            if (isOwner) return 'OWNER';
            if (meRole === "developer") {
              return u.invitedByName ? `invited by: ${u.invitedByName}` : "";
            }
            if (meId && u.invitedById && u.invitedById === meId) {
              return "invited by: you";
            }
            return "";
          })();

          return (
            <div
              key={u.id}
              className="grid grid-cols-1 items-center gap-3 rounded-xl border px-3 py-2 sm:grid-cols-[80px_1fr_1fr_220px_auto]"
              style={{ borderColor: "var(--border)" }}
            >
              <div className="text-xs opacity-70">#{u.userNumber}</div>
              <div className="font-semibold">{u.username}</div>
              <div className="text-sm opacity-80 truncate">{(meOwner || meRole === 'developer') ? u.email : ''}</div>
              <div className="flex items-center gap-2 text-xs opacity-70">{invitedSnippet} {vipBadge}</div>
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
                    {isOwner ? 'OWNER' : roleLabel}
                  </span>
                )}
                <button className="btn" onClick={manageLabels} title="Custom labels">Labels</button>
                <button className="btn" onClick={giveVip} title="Give VIP">Give VIP</button>
                {u.vipUntil && (<button className="btn" onClick={removeVip} title="Remove VIP">UnVIP</button>)}
                {actions.length ? actions : null}
              </div>
            </div>
          );
        })}
        {!rows.length && <div className="text-sm opacity-70">No users yet.</div>}
      </div>
    </div>
  );
}

/* ===== Sections ===== */
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
          <button className="btn btn-primary" onClick={add}>Add</button>
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
                <button className="btn" onClick={() => remove(s.id)}>Delete</button>
              </div>
            </div>
          ))}
          {!rows.length && <div className="text-sm opacity-70">No sections yet.</div>}
        </div>
      </div>
    </div>
  );
}

/* ===== Topics ===== */
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

/* ===== Invites ===== */
function InvitesTab({ meRole, meId }: { meRole?: string; meId: string }) {
  const [rows, setRows] = React.useState<any[]>([]);
  const [count, setCount] = React.useState(5);
  const [note, setNote] = React.useState("");
  const isDev = meRole === "developer";

  const reload = React.useCallback(async () => {
    try {
      const all = await listInvites();
      // Visibility: dev sees all; others see only their own invites
      const visible = isDev
        ? all
        : all.filter((i) => (i.createdBy || "") === (meId || ""));
      setRows(visible);
    } catch (e: any) {
      alert(e?.message || "Failed");
    }
  }, [isDev, meId]);

  React.useEffect(() => {
    reload();
  }, [reload]);

  // Quotas:
  // - admin: max 2 codes per rolling 48h
  // - moderator: max 1 code per rolling 72h
  const now = Date.now();
  const windowMs = meRole === "admin" ? 48 * 3600 * 1000 : meRole === "moderator" ? 72 * 3600 * 1000 : 0;
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
      {/* Generator */}
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
            <div className="text-xs opacity-70">created: {new Date(i.createdAt).toLocaleString()}</div>
            <div className="text-xs opacity-80">
              {isDev
                ? `by: ${i.createdByName || i.createdBy?.slice(0, 8)}`
                : "by: you"}
            </div>
            <div className="text-xs">{i.note || ""}</div>
            <div className="text-xs">
              {i.usedBy ? (
                <span className="text-emerald-400">used</span>
              ) : (
                <span className="opacity-70">unused</span>
              )}
            </div>
            <div className="text-right">
              <button className="btn" onClick={() => remove(i.code)}>Delete</button>
            </div>
          </div>
        ))}
        {!rows.length && <div className="text-sm opacity-70">No invite codes yet.</div>}
      </div>
    </div>
  );
}

/* ===== Maintenance ===== */
function MaintenanceTab() {
  const [mode, setMode] = React.useState<"invite" | "open">("invite");

  React.useEffect(() => {
    (async () => {
      try {
        const s = await getServerSettings();
        setMode(((s as any)?.registrationMode as any) || "invite");
      } catch {
        /* ignore */
      }
    })();
  }, []);

  const reset = () => {
    if (!confirm("Reset the forum (keep it empty)?")) return;
    resetForumEmpty(getActorId());
    alert("Done. Forum was cleared.");
    location.reload();
  };

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
      <p className="mb-3 text-sm opacity-70">
        Reset the forum when you need a clean slate before inviting the community.
      </p>
      <button className="btn btn-primary" onClick={reset}>
        Reset forum (empty)
      </button>
    </div>
  );
}
