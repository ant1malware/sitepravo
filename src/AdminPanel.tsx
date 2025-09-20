import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Account,
  Section,
  Topic,
  applyBan,
  applyMute,
  createSection,
  findAccountById,
  getForumSettings,
  listAccounts,
  listModerationLog,
  listSections,
  listTopics,
  moveTopic,
  resetForumData,
  setRole,
  updateForumSettings,
  updateSection,
  deleteSection,
  updateTopic,
} from "./store/forumStore";
import { useForumSessionWatcher } from "./forumSession";
import {
  AlertTriangle,
  ClipboardList,
  Crown,
  FolderKanban,
  Lock,
  LockOpen,
  Pin,
  PinOff,
  Plus,
  RefreshCcw,
  Settings,
  Shield,
  ShieldCheck,
  Trash2,
  UserX,
  Users,
} from "lucide-react";

const tabs = [
  { id: "users", label: "Пользователи", icon: Users },
  { id: "sections", label: "Разделы", icon: FolderKanban },
  { id: "topics", label: "Темы", icon: ClipboardList },
  { id: "settings", label: "Настройки", icon: Settings },
  { id: "logs", label: "Логи", icon: RefreshCcw },
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function AdminPanel() {
  const session = useForumSessionWatcher();
  const navigate = useNavigate();
  const [me, setMe] = React.useState<Account | null>(null);
  const [active, setActive] = React.useState<TabId>("users");
  const [tick, setTick] = React.useState(0);

  React.useEffect(() => {
    if (session?.userId) {
      setMe(findAccountById(session.userId));
    } else {
      setMe(null);
    }
  }, [session]);

  React.useEffect(() => {
    if (!me) return;
    if (me.role !== "admin" && me.role !== "moderator") {
      navigate("/forum");
    }
  }, [me, navigate]);

  const refresh = React.useCallback(() => setTick((t) => t + 1), []);

  const settings = React.useMemo(() => getForumSettings(), [tick]);
  const accounts = React.useMemo(() => listAccounts(), [tick]);
  const sections = React.useMemo(() => listSections(), [tick]);
  const topics = React.useMemo(() => listTopics(), [tick]);
  const logs = React.useMemo(() => listModerationLog(50), [tick]);

  if (!me) {
    return null;
  }

  const isAdmin = me.role === "admin";
  const canModerate = me.role === "admin" || me.role === "moderator";

  return (
    <div className="forum-theme min-h-dvh bg-[var(--bg-1)] text-[var(--text-1)]">
      <main className="mx-auto max-w-6xl px-4 pb-16 pt-10">
        <header className="mb-6 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3 rounded-3xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3">
            <Shield className="h-6 w-6 text-[var(--accent)]" />
            <div>
              <h1 className="text-2xl font-bold">Админ-панель SKY</h1>
              <p className="text-sm text-[var(--text-2)]">Контроль пользователей, разделов и модерации.</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--text-2)]">
            <span className="rounded-full bg-[var(--surface)] px-3 py-1">{me.username}</span>
            <span className="rounded-full bg-[var(--surface)] px-3 py-1">{me.role}</span>
          </div>
        </header>

        <div className="mb-6 flex flex-wrap gap-2">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition ${
                active === id ? "bg-[var(--accent)] text-white" : "bg-[var(--surface)] text-[var(--text-2)] hover:bg-[var(--surface-2)]"
              }`}
              onClick={() => setActive(id)}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          {active === "users" && (
            <UsersTab
              accounts={accounts}
              me={me}
              refresh={refresh}
              isAdmin={isAdmin}
              canModerate={canModerate}
            />
          )}
          {active === "sections" && (
            <SectionsTab
              me={me}
              sections={sections}
              accounts={accounts}
              refresh={refresh}
              canEdit={isAdmin}
            />
          )}
          {active === "topics" && (
            <TopicsTab topics={topics} sections={sections} refresh={refresh} canModerate={canModerate} me={me} />
          )}
          {active === "settings" && (
            <SettingsTab
              settings={settings}
              onSave={(patch) => {
                updateForumSettings(patch, me.id);
                refresh();
              }}
              canEdit={isAdmin}
              onReset={() => {
                if (isAdmin && window.confirm("Сбросить форум к демо-данным?")) {
                  resetForumData();
                  refresh();
                }
              }}
            />
          )}
          {active === "logs" && <LogsTab logs={logs} />}
        </div>
      </main>
    </div>
  );
}

type UsersTabProps = {
  accounts: Account[];
  me: Account;
  refresh: () => void;
  isAdmin: boolean;
  canModerate: boolean;
};

function UsersTab({ accounts, me, refresh, isAdmin, canModerate }: UsersTabProps) {
  return (
    <section className="card space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Управление пользователями</h2>
          <p className="text-sm text-[var(--text-2)]">Назначение ролей, баны и мюты.</p>
        </div>
        <Users className="h-5 w-5 text-[var(--accent)]" />
      </header>
      <div className="space-y-3">
        {accounts.map((account) => (
          <UserCard
            key={account.id}
            account={account}
            me={me}
            isAdmin={isAdmin}
            canModerate={canModerate}
            refresh={refresh}
          />
        ))}
      </div>
    </section>
  );
}

type UserCardProps = {
  account: Account;
  me: Account;
  isAdmin: boolean;
  canModerate: boolean;
  refresh: () => void;
};

function UserCard({ account, me, isAdmin, canModerate, refresh }: UserCardProps) {
  const [banUntil, setBanUntil] = React.useState(account.bans?.until || "");
  const [banReason, setBanReason] = React.useState(account.bans?.reason || "");
  const [muteUntil, setMuteUntil] = React.useState(account.mutes?.until || "");
  const [muteReason, setMuteReason] = React.useState(account.mutes?.reason || "");

  React.useEffect(() => {
    setBanUntil(account.bans?.until || "");
    setBanReason(account.bans?.reason || "");
    setMuteUntil(account.mutes?.until || "");
    setMuteReason(account.mutes?.reason || "");
  }, [account]);

  const applyRole = (role: Account["role"]) => {
    if (!isAdmin) return;
    setRole(account.id, role, me.id);
    refresh();
  };

  const applyBanAction = () => {
    if (!isAdmin) return;
    if (!banUntil && !banReason) {
      applyBan(account.id, null, me.id);
    } else {
      applyBan(account.id, { until: banUntil || undefined, reason: banReason || undefined }, me.id);
    }
    refresh();
  };

  const applyMuteAction = () => {
    if (!canModerate) return;
    if (!muteUntil && !muteReason) {
      applyMute(account.id, null, me.id);
    } else {
      applyMute(account.id, { until: muteUntil || undefined, reason: muteReason || undefined }, me.id);
    }
    refresh();
  };

  return (
    <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold">
            {account.username}
            {account.role === "admin" && <Crown className="h-4 w-4 text-yellow-400" />}
            {account.role === "moderator" && <ShieldCheck className="h-4 w-4 text-[var(--accent)]" />}
          </div>
          <div className="mt-1 text-xs text-[var(--text-2)]">
            #{account.userNumber} • {new Date(account.createdAt).toLocaleDateString("ru-RU")} • {account.posts} постов • {account.likes} лайков
          </div>
        </div>
        {isAdmin ? (
          <select
            className="input w-auto text-xs"
            value={account.role}
            onChange={(e) => applyRole(e.target.value as Account["role"])}
          >
            <option value="admin">admin</option>
            <option value="moderator">moderator</option>
            <option value="vip">vip</option>
            <option value="user">user</option>
            <option value="newbie">newbie</option>
          </select>
        ) : null}
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <h3 className="mb-2 text-sm font-semibold">Бан</h3>
          <input
            className="input mb-2"
            placeholder="До (ISO или пусто)"
            value={banUntil}
            onChange={(e) => setBanUntil(e.target.value)}
            disabled={!isAdmin}
          />
          <input
            className="input mb-2"
            placeholder="Причина"
            value={banReason}
            onChange={(e) => setBanReason(e.target.value)}
            disabled={!isAdmin}
          />
          <button className="btn btn-secondary w-full text-xs" onClick={applyBanAction} disabled={!isAdmin}>
            <UserX className="h-4 w-4" /> {banUntil || banReason ? "Применить" : "Снять бан"}
          </button>
        </div>
        <div>
          <h3 className="mb-2 text-sm font-semibold">Мут</h3>
          <input
            className="input mb-2"
            placeholder="До (ISO или пусто)"
            value={muteUntil}
            onChange={(e) => setMuteUntil(e.target.value)}
            disabled={!canModerate}
          />
          <input
            className="input mb-2"
            placeholder="Причина"
            value={muteReason}
            onChange={(e) => setMuteReason(e.target.value)}
            disabled={!canModerate}
          />
          <button className="btn btn-secondary w-full text-xs" onClick={applyMuteAction} disabled={!canModerate}>
            <AlertTriangle className="h-4 w-4" /> {muteUntil || muteReason ? "Применить" : "Снять мут"}
          </button>
        </div>
      </div>
    </div>
  );
}

type SectionsTabProps = {
  sections: Section[];
  accounts: Account[];
  me: Account;
  refresh: () => void;
  canEdit: boolean;
};

function SectionsTab({ sections, accounts, me, refresh, canEdit }: SectionsTabProps) {
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [icon, setIcon] = React.useState("🪐");
  const [mods, setMods] = React.useState<string[]>([]);

  const toggleModerator = (id: string) => {
    setMods((prev) => (prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]));
  };

  const create = () => {
    if (!canEdit) return;
    if (!title.trim()) return;
    createSection({
      title: title.trim(),
      description: description.trim(),
      icon: icon || undefined,
      moderatorIds: mods,
      actorId: me.id,
    });
    setTitle("");
    setDescription("");
    setIcon("🪐");
    setMods([]);
    refresh();
  };

  const update = (section: Section, patch: Partial<Section>) => {
    if (!canEdit) return;
    updateSection(section.id, patch, me.id);
    refresh();
  };

  const remove = (section: Section) => {
    if (!canEdit) return;
    if (window.confirm(`Удалить раздел «${section.title}»?`)) {
      deleteSection(section.id, me.id);
      refresh();
    }
  };

  return (
    <section className="space-y-6">
      <div className="card space-y-3">
        <header className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Создать раздел</h2>
          <Plus className="h-5 w-5 text-[var(--accent)]" />
        </header>
        <div className="grid gap-3 md:grid-cols-2">
          <input className="input" placeholder="Название" value={title} onChange={(e) => setTitle(e.target.value)} disabled={!canEdit} />
          <input className="input" placeholder="Описание" value={description} onChange={(e) => setDescription(e.target.value)} disabled={!canEdit} />
          <input className="input" placeholder="Иконка" value={icon} onChange={(e) => setIcon(e.target.value)} disabled={!canEdit} />
        </div>
        <div className="flex flex-wrap gap-2">
          {accounts.map((acc) => (
            <button
              key={acc.id}
              className={`btn text-xs ${mods.includes(acc.id) ? "btn-primary" : "btn-secondary"}`}
              onClick={() => toggleModerator(acc.id)}
              disabled={!canEdit}
            >
              {acc.username}
            </button>
          ))}
        </div>
        <button className="btn btn-primary" onClick={create} disabled={!canEdit}>
          Создать раздел
        </button>
      </div>
      <div className="space-y-4">
        {sections.map((section) => (
          <div key={section.id} className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-lg font-semibold">{section.icon} {section.title}</div>
              <div className="text-xs text-[var(--text-2)]">
                Тем: {section.topicCount} • Постов: {section.postCount}
              </div>
            </div>
            <div className="mt-2 text-sm text-[var(--text-2)]">{section.description}</div>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-[var(--text-2)]">
              Модераторы:
              {section.moderatorIds.length
                ? section.moderatorIds.map((id) => findAccountById(id)?.username || "—").join(", ")
                : "не назначены"}
            </div>
            {canEdit ? (
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <input
                  className="input"
                  value={section.title}
                  onChange={(e) => update(section, { title: e.target.value })}
                />
                <input
                  className="input"
                  value={section.description}
                  onChange={(e) => update(section, { description: e.target.value })}
                />
                <input
                  className="input"
                  value={section.icon || ""}
                  onChange={(e) => update(section, { icon: e.target.value })}
                />
                <button className="btn btn-ghost text-xs" onClick={() => remove(section)}>
                  <Trash2 className="h-4 w-4" /> Удалить
                </button>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

type TopicsTabProps = {
  topics: Topic[];
  sections: Section[];
  refresh: () => void;
  canModerate: boolean;
  me: Account;
};

function TopicsTab({ topics, sections, refresh, canModerate, me }: TopicsTabProps) {
  return (
    <section className="card space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Темы и модерация</h2>
          <p className="text-sm text-[var(--text-2)]">Переключение статусов, перенос между разделами.</p>
        </div>
        <ClipboardList className="h-5 w-5 text-[var(--accent)]" />
      </header>
      <div className="space-y-3">
        {topics.map((topic) => (
          <div key={topic.id} className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="text-sm text-[var(--text-2)]">{sections.find((s) => s.id === topic.sectionId)?.title || "?"}</div>
                <div className="text-lg font-semibold">{topic.title}</div>
              </div>
              <div className="text-xs text-[var(--text-2)]">Ответов: {topic.replyCount} • Просмотров: {topic.viewCount}</div>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-[var(--text-2)]">
              {topic.pinned ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-[var(--surface-2)] px-2 py-0.5 text-[var(--accent)]">
                  <Pin className="h-3 w-3" /> Закреплено
                </span>
              ) : null}
              {topic.locked ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-red-500/20 px-2 py-0.5 text-red-300">
                  <Lock className="h-3 w-3" /> Закрыто
                </span>
              ) : null}
            </div>
            {canModerate ? (
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                <button className="btn btn-secondary" onClick={() => { updateTopic(topic.id, { pinned: !topic.pinned }, me.id, { note: topic.pinned ? "unpin" : "pin" }); refresh(); }}>
                  {topic.pinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
                  {topic.pinned ? "Открепить" : "Закрепить"}
                </button>
                <button className="btn btn-secondary" onClick={() => { updateTopic(topic.id, { locked: !topic.locked }, me.id, { note: topic.locked ? "unlock" : "lock" }); refresh(); }}>
                  {topic.locked ? <LockOpen className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                  {topic.locked ? "Открыть" : "Закрыть"}
                </button>
                <select
                  className="input w-auto text-xs"
                  value={topic.sectionId}
                  onChange={(e) => {
                    moveTopic(topic.id, e.target.value, me.id);
                    refresh();
                  }}
                >
                  {sections.map((section) => (
                    <option key={section.id} value={section.id}>
                      {section.title}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

type SettingsTabProps = {
  settings: ReturnType<typeof getForumSettings>;
  onSave: (patch: Partial<ReturnType<typeof getForumSettings>>) => void;
  onReset: () => void;
  canEdit: boolean;
};

function SettingsTab({ settings, onSave, onReset, canEdit }: SettingsTabProps) {
  const [heroTitle, setHeroTitle] = React.useState(settings.heroTitle);
  const [heroSubtitle, setHeroSubtitle] = React.useState(settings.heroSubtitle);
  const [heroMessage, setHeroMessage] = React.useState(settings.heroMessage);
  const [registrationOpen, setRegistrationOpen] = React.useState(settings.registrationOpen);
  const [requireEnglish, setRequireEnglish] = React.useState(settings.requireEnglishNick);
  const [allowGuestRead, setAllowGuestRead] = React.useState(settings.allowGuestRead);

  React.useEffect(() => {
    setHeroTitle(settings.heroTitle);
    setHeroSubtitle(settings.heroSubtitle);
    setHeroMessage(settings.heroMessage);
    setRegistrationOpen(settings.registrationOpen);
    setRequireEnglish(settings.requireEnglishNick);
    setAllowGuestRead(settings.allowGuestRead);
  }, [settings]);

  const submit = () => {
    if (!canEdit) return;
    onSave({
      heroTitle,
      heroSubtitle,
      heroMessage,
      registrationOpen,
      requireEnglishNick: requireEnglish,
      allowGuestRead,
    });
  };

  return (
    <section className="card space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Настройки форума</h2>
          <p className="text-sm text-[var(--text-2)]">Герой, доступ и политика регистрации.</p>
        </div>
        <Settings className="h-5 w-5 text-[var(--accent)]" />
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm">
          <span>Заголовок героя</span>
          <input className="input" value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} disabled={!canEdit} />
        </label>
        <label className="space-y-2 text-sm">
          <span>Подзаголовок</span>
          <input className="input" value={heroSubtitle} onChange={(e) => setHeroSubtitle(e.target.value)} disabled={!canEdit} />
        </label>
        <label className="space-y-2 text-sm">
          <span>Сообщение</span>
          <textarea className="input" value={heroMessage} onChange={(e) => setHeroMessage(e.target.value)} disabled={!canEdit} />
        </label>
        <div className="space-y-2 text-sm">
          <span>Доступ</span>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={registrationOpen} onChange={(e) => setRegistrationOpen(e.target.checked)} disabled={!canEdit} />
            Регистрация открыта
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={requireEnglish} onChange={(e) => setRequireEnglish(e.target.checked)} disabled={!canEdit} />
            Требовать английский ник
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={allowGuestRead} onChange={(e) => setAllowGuestRead(e.target.checked)} disabled={!canEdit} />
            Разрешить чтение гостям
          </label>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button className="btn btn-primary" onClick={submit} disabled={!canEdit}>
          Сохранить
        </button>
        <button className="btn btn-ghost text-xs" onClick={onReset} disabled={!canEdit}>
          <RefreshCcw className="h-4 w-4" /> Сбросить форум
        </button>
      </div>
    </section>
  );
}

type LogsTabProps = {
  logs: ReturnType<typeof listModerationLog>;
};

function LogsTab({ logs }: LogsTabProps) {
  return (
    <section className="card space-y-3">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">История действий</h2>
          <p className="text-sm text-[var(--text-2)]">Последние 50 записей модерации.</p>
        </div>
        <RefreshCcw className="h-5 w-5 text-[var(--accent)]" />
      </header>
      <div className="space-y-2 text-sm">
        {logs.map((log) => (
          <div key={log.id} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2">
            <div className="flex items-center justify-between text-xs text-[var(--text-2)]">
              <span>{new Date(log.createdAt).toLocaleString("ru-RU")}</span>
              <span>{log.action}</span>
            </div>
            <div className="text-sm text-[var(--text-1)]">{log.targetType} • {log.targetId || "—"}</div>
            {log.notes ? <div className="text-xs text-[var(--text-2)]">{log.notes}</div> : null}
          </div>
        ))}
      </div>
    </section>
  );
}

