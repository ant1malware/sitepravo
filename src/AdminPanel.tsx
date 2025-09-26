import React from "react";

// ⚠️ из forumStore берём ТОЛЬКО вещи про секции/топики
import {
  listSections,
  createSection,
  updateSection,
  listTopics,
  updateTopic,
  moveTopic,
} from "./store/forumStore";

// ✅ а пользователей/роли — ТОЛЬКО из удалённого API (воркер)
// Remote users from Worker; invites remote too
import { listAccounts, setRole, type Role, listInvites, generateInvites } from "./store/authRemote";
// Forum local moderation helpers (mute/ban affect chat UI locally)
import { applyMute, applyBan } from "./store/forumStore";

// Role is imported from forumStore

function getActorId(): string {
  try {
    const raw =
      localStorage.getItem("forum:session") ??
      sessionStorage.getItem("forum:session");
    if (!raw) return "unknown";
    const s = JSON.parse(raw);
    return s?.userId || "unknown";
  } catch {
    return "unknown";
  }
}

export default function AdminPanel() {
  const [tab, setTab] = React.useState<"users" | "sections" | "topics" | "invites">("users");

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6">
      <div className="mb-4 flex gap-2">
        <button
          className={`btn ${tab === "users" ? "btn-primary" : ""}`}
          onClick={() => setTab("users")}
        >
          Users
        </button>
        <button
          className={`btn ${tab === "sections" ? "btn-primary" : ""}`}
          onClick={() => setTab("sections")}
        >
          Sections
        </button>
        <button
          className={`btn ${tab === "topics" ? "btn-primary" : ""}`}
          onClick={() => setTab("topics")}
        >
          Topics
        </button>
        <button
          className={`btn ${tab === "invites" ? "btn-primary" : ""}`}
          onClick={() => setTab("invites")}
        >
          Invites
        </button>
      </div>

      {tab === "users" && <UsersTab />}
      {tab === "sections" && <SectionsTab />}
      {tab === "topics" && <TopicsTab />}
      {tab === "invites" && <InvitesTab />}
    </div>
  );
}

/* ----------------------- Users ----------------------- */

function UsersTab() {
  const [rows, setRows] = React.useState<
    { id: string; username: string; email: string; userNumber: number; role: Role }[]
  >([]);

  const load = async () => { try { const list = await listAccounts(); setRows(list); } catch (e:any) { alert((e as any)?.message || "Failed to load users"); } };

  React.useEffect(() => {
    load();
  }, []);

  const changeRole = async (id: string, role: Role) => { try { await setRole(id, role); load(); } catch (e:any) { alert((e as any)?.message || "Failed to set role"); } };

  return (
    <div className="card p-4">
      <div className="mb-3 text-sm opacity-70">���������� �������������� (����� Worker API).</div>
      <div className="grid gap-2">
        {rows.map((u) => (
          <div
            key={u.id}
            className="grid grid-cols-[80px_1fr_1fr_180px] items-center gap-3 rounded-xl border px-3 py-2"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="text-xs opacity-70">#{u.userNumber}</div>
            <div className="font-semibold">{u.username}</div>
            <div className="text-sm opacity-80">{u.email}</div>
            <div className="flex items-center gap-2">
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
            </div>
          </div>
        ))}
        {!rows.length && (
          <div className="text-sm opacity-70">Нет пользователей</div>
        )}
      </div>
    </div>
  );
}

/* ----------------------- Sections ----------------------- */

function SectionsTab() {
  const [rows, setRows] = React.useState<
    { id: string; title: string; description?: string; icon?: string }[]
  >([]);
  const [title, setTitle] = React.useState("");
  const [desc, setDesc] = React.useState("");

  const reload = () => setRows(listSections());

  React.useEffect(() => {
    reload();
  }, []);

  const add = () => {
    if (!title.trim()) return;
    // createSection в твоём store принимает 1 аргумент
    createSection({ title: title.trim(), description: desc.trim() } as any);
    setTitle("");
    setDesc("");
    reload();
  };

  const edit = (id: string, field: "title" | "description", value: string) => {
    const actor = getActorId();
    updateSection(id, { [field]: value } as any, actor);
    reload();
  };

  return (
    <div className="grid gap-4">
      <div className="card p-4">
        <div className="mb-2 font-semibold">Создать раздел</div>
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
        <div className="mb-2 font-semibold">Список разделов</div>
        <div className="grid gap-2">
          {rows.map((s) => (
            <div
              key={s.id}
              className="grid grid-cols-[140px_1fr] items-center gap-2 rounded-xl border px-3 py-2"
              style={{ borderColor: "var(--border)" }}
            >
              <div className="text-sm opacity-70">{s.id.slice(0, 8)}…</div>
              <div className="grid gap-2 sm:grid-cols-2">
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
              </div>
            </div>
          ))}
          {!rows.length && (
            <div className="text-sm opacity-70">Пока нет разделов</div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ----------------------- Topics ----------------------- */

function TopicsTab() {
  const [rows, setRows] = React.useState<
    {
      id: string;
      title: string;
      sectionId: string;
      pinned?: boolean;
      locked?: boolean;
    }[]
  >([]);

  const reload = () => setRows(listTopics());

  React.useEffect(() => {
    reload();
  }, []);

  const pin = (id: string, v: boolean) => {
    const actor = getActorId();
    updateTopic(id, { pinned: v } as any, actor);
    reload();
  };

  const lock = (id: string, v: boolean) => {
    const actor = getActorId();
    updateTopic(id, { locked: v } as any, actor);
    reload();
  };

  const move = (id: string, to: string) => {
    const actor = getActorId();
    if (!to.trim()) return;
    moveTopic(id, to.trim(), actor);
    reload();
  };

  return (
    <div className="card p-4">
      <div className="mb-2 font-semibold">Темы</div>
      <div className="grid gap-2">
        {rows.map((t) => (
          <div
            key={t.id}
            className="grid grid-cols-1 items-center gap-3 rounded-xl border px-3 py-3 sm:grid-cols-[1fr_auto_auto_auto]"
            style={{ borderColor: "var(--border)" }}
          >
            <div>
              <div className="font-semibold">{t.title}</div>
              <div className="text-xs opacity-70">
                id: {t.id.slice(0, 8)}… • section: {t.sectionId.slice(0, 8)}…
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={!!t.pinned}
                onChange={(e) => pin(t.id, e.target.checked)}
              />
              pinned
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={!!t.locked}
                onChange={(e) => lock(t.id, e.target.checked)}
              />
              locked
            </label>
            <div className="flex items-center gap-2">
              <input
                className="input"
                placeholder="to sectionId"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const target = (e.target as HTMLInputElement).value;
                    move(t.id, target);
                    (e.target as HTMLInputElement).value = "";
                  }
                }}
              />
              <button
                className="btn"
                onClick={(e) => {
                  const input = (e.currentTarget
                    .previousElementSibling as HTMLInputElement)!;
                  move(t.id, input.value);
                  input.value = "";
                }}
              >
                Move
              </button>
            </div>
          </div>
        ))}
        {!rows.length && (
          <div className="text-sm opacity-70">Пока нет тем</div>
        )}
      </div>
    </div>
  );
}

/* ----------------------- Invites ----------------------- */

function InvitesTab() {
  const [rows, setRows] = React.useState<any[]>([]);
  const [count, setCount] = React.useState(5);
  const [note, setNote] = React.useState("");

  const reload = async () => {
    try { setRows(await listInvites()); } catch (e:any) { alert(e?.message||'Failed'); }
  };

  React.useEffect(() => { reload(); }, []);

  const generate = async () => {
    try { await generateInvites(Math.max(1, Math.min(20, count)), note); setNote(""); reload(); } catch (e:any) { alert(e?.message||'Failed to generate'); }
  };

  return (
    <div className="card p-4">
      <div className="mb-3 font-semibold">Генерация инвайт-кодов</div>
      <div className="mb-4 grid gap-2 sm:grid-cols-[120px_1fr_auto]">
        <input className="input" type="number" min={1} max={20} value={count} onChange={(e) => setCount(parseInt(e.target.value || "1", 10))} />
        <input className="input" placeholder="note (optional)" value={note} onChange={(e) => setNote(e.target.value)} />
        <button className="btn btn-primary" onClick={generate}>Generate</button>
      </div>

      <div className="mb-2 text-sm opacity-70">Последние коды (однократные):</div>
      <div className="grid gap-2">
        {rows.map((i) => (
          <div key={`${i.code}-${i.createdAt}`} className="grid grid-cols-1 items-center gap-2 rounded-xl border px-3 py-2 sm:grid-cols-[160px_1fr_1fr_1fr]" style={{ borderColor: "var(--border)" }}>
            <div className="font-mono text-sm">{i.code}</div>
            <div className="text-xs opacity-70">created: {new Date(i.createdAt).toLocaleString()}</div>
            <div className="text-xs">{i.note || ""}</div>
            <div className="text-xs">
              {i.usedBy ? <span className="text-emerald-400">used</span> : <span className="opacity-70">unused</span>}
            </div>
          </div>
        ))}
        {!rows.length && <div className="text-sm opacity-70">Список пуст</div>}
      </div>
    </div>
  );
}

