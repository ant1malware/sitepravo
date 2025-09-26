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
  type Role,
} from "./store/authRemote";

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

export default function AdminPanel2() {
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
  const tabs: Array<typeof tab> = (() => {
    if (role === "developer") {
      return ["users", "sections", "topics", "invites", "maintenance"];
    }
    if (role === "admin") {
      return ["users", "topics"];
    }
    if (role === "moderator") {
      return ["users"];
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
      {tab === "users" && <UsersTab meRole={role} />}
      {tab === "sections" && <SectionsTab />}
      {tab === "topics" && <TopicsTab meRole={role} />}
      {tab === "invites" && <InvitesTab />}
      {tab === "maintenance" && <MaintenanceTab />}
    </div>
  );
}

/* ===== Users ===== */
function UsersTab({ meRole }: { meRole?: string }) {
  const [rows, setRows] = React.useState<any[]>([]);

  const load = React.useCallback(async () => {
    try {
      setRows(await listAccounts());
    } catch (e: any) {
      alert(e?.message || "Failed to load users");
    }
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const canManageRoles = meRole === "developer";
  const canBan = meRole === "developer" || meRole === "admin";
  const canMute =
    meRole === "developer" || meRole === "admin" || meRole === "moderator";

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
          const roleLabel = String(u.role || "user");
          const actions: React.ReactNode[] = [];
          if (canMute) {
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
          if (canBan) {
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

          return (
            <div
              key={u.id}
              className="grid grid-cols-1 items-center gap-3 rounded-xl border px-3 py-2 sm:grid-cols-[80px_1fr_1fr_220px_auto]"
              style={{ borderColor: "var(--border)" }}
            >
              <div className="text-xs opacity-70">#{u.userNumber}</div>
              <div className="font-semibold">{u.username}</div>
              <div className="text-sm opacity-80 truncate">{u.email}</div>
              <div className="text-xs opacity-70">
                {u.invitedByName ? `invited by: ${u.invitedByName}` : ""}
              </div>
              <div className="flex flex-wrap items-center justify-end gap-2">
                {canManageRoles ? (
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
                    {roleLabel}
                  </span>
                )}
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
              <div className="text-xs opacity-70">{s.id.slice(0, 8)}…</div>
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
                  id: {t.id.slice(0, 8)}… section: {t.sectionId.slice(0, 8)}…
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
function InvitesTab() {
  const [rows, setRows] = React.useState<any[]>([]);
  const [count, setCount] = React.useState(5);
  const [note, setNote] = React.useState("");

  const reload = React.useCallback(async () => {
    try {
      setRows(await listInvites());
    } catch (e: any) {
      alert(e?.message || "Failed");
    }
  }, []);

  React.useEffect(() => {
    reload();
  }, [reload]);

  const generate = async () => {
    try {
      await generateInvites(
        Math.max(1, Math.min(20, count)),
        note || undefined
      );
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
          max={20}
          value={count}
          onChange={(e) => setCount(parseInt(e.target.value || "1", 10))}
        />
        <input
          className="input"
          placeholder="note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <button className="btn btn-primary" onClick={generate}>Generate</button>
      </div>

      <div className="grid gap-2">
        {rows.map((i) => (
          <div
            key={`${i.code}-${i.createdAt}`}
            className="grid grid-cols-1 items-center gap-2 rounded-xl border px-3 py-2 sm:grid-cols-[160px_1fr_1fr_1fr_auto]"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="font-mono text-sm">{i.code}</div>
            <div className="text-xs opacity-70">created: {new Date(i.createdAt).toLocaleString()}</div>
            <div className="text-xs opacity-80">by: {i.createdByName || i.createdBy?.slice(0, 8)}</div>
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
