// src/AdminPanel2.tsx
import React from "react";
import { applyMute, applyBan, resetForumEmpty } from "./store/forumStore";
import {
  listSections,
  createSection,
  updateSection,
  listTopics,
  updateTopic,
  moveTopic,
} from "./store/forumRemote";
import {
  listAccounts,
  setRole,
  listInvites,
  generateInvites,
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
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6">
      <div className="mb-4 flex gap-2">
        {(
          ["users", "sections", "topics", "invites", "maintenance"] as const
        ).map((t) => (
          <button
            key={t}
            className={`btn ${tab === t ? "btn-primary" : ""}`}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>
      {tab === "users" && <UsersTab />}
      {tab === "sections" && <SectionsTab />}
      {tab === "topics" && <TopicsTab />}
      {tab === "invites" && <InvitesTab />}
      {tab === "maintenance" && <MaintenanceTab />}
    </div>
  );
}

function UsersTab() {
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

  const changeRole = async (id: string, role: Role) => {
    try {
      await setRole(id, role);
      load();
    } catch (e: any) {
      alert(e?.message || "Failed to set role");
    }
  };

  const mute = (id: string) => {
    const mins = parseInt(prompt("Mute minutes", "60") || "60", 10);
    const until = new Date(
      Date.now() + Math.max(1, mins) * 60000
    ).toISOString();
    applyMute(
      id,
      { until, reason: `Muted ${mins}m` },
      getActorId() // локальный чат-стор
    );
  };

  const unmute = (id: string) => applyMute(id, null as any, getActorId());

  const ban = (id: string) => {
    const days = parseInt(prompt("Ban days", "7") || "7", 10);
    const until = new Date(
      Date.now() + Math.max(1, days) * 86400000
    ).toISOString();
    applyBan(id, { until, reason: `Banned ${days}d` }, getActorId());
  };

  const unban = (id: string) => applyBan(id, null as any, getActorId());

  return (
    <div className="card p-4">
      <div className="mb-3 text-sm opacity-70">
        Пользователи (через Worker API). Мут/бан локальны для чата.
      </div>
      <div className="grid gap-2">
        {rows.map((u) => (
          <div
            key={u.id}
            className="grid grid-cols-1 items-center gap-3 rounded-xl border px-3 py-2 sm:grid-cols-[80px_1fr_1fr_220px_1fr]"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="text-xs opacity-70">#{u.userNumber}</div>
            <div className="font-semibold">{u.username}</div>
            <div className="text-sm opacity-80 truncate">{u.email}</div>
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
            <div className="flex flex-wrap gap-2 text-xs">
              <button className="btn" onClick={() => mute(u.id)}>
                Mute
              </button>
              <button className="btn" onClick={() => unmute(u.id)}>
                Unmute
              </button>
              <button className="btn" onClick={() => ban(u.id)}>
                Ban
              </button>
              <button className="btn" onClick={() => unban(u.id)}>
                Unban
              </button>
            </div>
          </div>
        ))}
        {!rows.length && <div className="text-sm opacity-70">Пусто</div>}
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
      const data = await listSections();
      setRows(data);
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

  // updateSection ожидает 2 аргумента: (id, patch)
  const edit = async (
    id: string,
    field: "title" | "description",
    value: string
  ) => {
    try {
      await updateSection(
        id,
        { [field]: value, actorId: getActorId() } as any
      );
      reload();
    } catch (e: any) {
      alert(e?.message || "Failed to update section");
    }
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
        <div className="mb-2 font-semibold">Разделы</div>
        <div className="grid gap-2">
          {rows.map((s) => (
            <div
              key={s.id}
              className="grid grid-cols-[160px_1fr] items-center gap-2 rounded-xl border px-3 py-2"
              style={{ borderColor: "var(--border)" }}
            >
              <div className="text-xs opacity-70">{s.id.slice(0, 8)}…</div>
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
          {!rows.length && <div className="text-sm opacity-70">Пусто</div>}
        </div>
      </div>
    </div>
  );
}

function TopicsTab() {
  const [rows, setRows] = React.useState<any[]>([]);

  const reload = React.useCallback(async () => {
    try {
      const data = await listTopics();
      setRows(data);
    } catch (e: any) {
      alert(e?.message || "Failed to load topics");
    }
  }, []);

  React.useEffect(() => {
    reload();
  }, [reload]);

  // updateTopic ожидает 2 аргумента: (id, patch)
  const pin = async (id: string, v: boolean) => {
    try {
      await updateTopic(id, { pinned: v, actorId: getActorId() } as any);
      reload();
    } catch (e: any) {
      alert(e?.message || "Failed to update topic");
    }
  };

  const lock = async (id: string, v: boolean) => {
    try {
      await updateTopic(id, { locked: v, actorId: getActorId() } as any);
      reload();
    } catch (e: any) {
      alert(e?.message || "Failed to update topic");
    }
  };

  // moveTopic ожидает 2 аргумента: (topicId, toSectionId)
  const move = async (id: string, to: string) => {
    const toTrim = to.trim();
    if (!toTrim) return;
    try {
      await moveTopic(id, toTrim);
      reload();
    } catch (e: any) {
      alert(e?.message || "Failed to move topic");
    }
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
                    move(t.id, (e.target as HTMLInputElement).value);
                    (e.target as HTMLInputElement).value = "";
                  }
                }}
              />
              <button
                className="btn"
                onClick={(e) => {
                  const input =
                    (e.currentTarget
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
        {!rows.length && <div className="text-sm opacity-70">Пусто</div>}
      </div>
    </div>
  );
}

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

  return (
    <div className="card p-4">
      <div className="mb-3 font-semibold">Генерация инвайтов</div>
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
        <button className="btn btn-primary" onClick={generate}>
          Generate
        </button>
      </div>
      <div className="grid gap-2">
        {rows.map((i) => (
          <div
            key={`${i.code}-${i.createdAt}`}
            className="grid grid-cols-1 items-center gap-2 rounded-xl border px-3 py-2 sm:grid-cols-[160px_1fr_1fr_1fr]"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="font-mono text-sm">{i.code}</div>
            <div className="text-xs opacity-70">
              created: {new Date(i.createdAt).toLocaleString()}
            </div>
            <div className="text-xs">{i.note || ""}</div>
            <div className="text-xs">
              {i.usedBy ? (
                <span className="text-emerald-400">used</span>
              ) : (
                <span className="opacity-70">unused</span>
              )}
            </div>
          </div>
        ))}
        {!rows.length && <div className="text-sm opacity-70">Пусто</div>}
      </div>
    </div>
  );
}

function MaintenanceTab() {
  const reset = () => {
    if (!confirm("Очистить форум (пустой старт)?")) return;
    resetForumEmpty(getActorId());
    alert("Ок. Форум очищен.");
    location.reload();
  };
  return (
    <div className="card p-4">
      <div className="mb-2 font-semibold">Обслуживание</div>
      <p className="text-sm opacity-70 mb-3">
        Очистить локальные разделы/темы/сообщения без демо-данных.
      </p>
      <button className="btn btn-primary" onClick={reset}>
        Reset forum (empty)
      </button>
    </div>
  );
}
