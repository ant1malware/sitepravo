import React from "react";
import { Link, useParams } from "react-router-dom";
import {
  Account,
  findAccountById,
  findAccountByUsername,
  updateAccountProfile,
  getSessionAccount,
} from "./store/forumStore";
import { useForumSessionWatcher } from "./forumSession";
import {
  ArrowLeft,
  BadgeCheck,
  Crown,
  Link2,
  Palette,
  Save,
  ShieldCheck,
} from "lucide-react";

export default function ProfilePage() {
  const { username = "" } = useParams();
  const session = useForumSessionWatcher();
  const [account, setAccount] = React.useState<Account | null>(() => findAccountByUsername(username));
  const [viewer, setViewer] = React.useState<Account | null>(() => getSessionAccount());

  React.useEffect(() => {
    setAccount(findAccountByUsername(username));
  }, [username, session]);

  React.useEffect(() => {
    if (session?.userId) {
      setViewer(findAccountById(session.userId));
    } else {
      setViewer(null);
    }
  }, [session]);

  if (!account) {
    return (
      <div className="forum-theme min-h-dvh bg-[var(--bg-1)] text-[var(--text-1)]">
        <main className="mx-auto flex min-h-dvh max-w-xl flex-col items-center justify-center gap-4 px-6 text-center">
          <ShieldCheck className="h-10 w-10 text-[var(--accent)]" />
          <h1 className="text-2xl font-semibold">Профиль не найден</h1>
          <p className="text-sm text-[var(--text-2)]">Пользователь «{username}» отсутствует в базе.</p>
          <Link to="/forum" className="btn btn-primary text-xs uppercase">Вернуться на форум</Link>
        </main>
      </div>
    );
  }

  const canEdit = Boolean(viewer && (viewer.id === account.id || viewer.role === "admin"));
  const accentFrom = account.profile.accentFrom || "#8b5cf6";
  const accentTo = account.profile.accentTo || "#22d3ee";
  const badges = account.profile.badges || [];
  const privacy = account.profile.privacy || { showEmail: false, showStats: true };

  return (
    <div className="forum-theme min-h-dvh bg-[var(--bg-1)] text-[var(--text-1)]">
      <main className="mx-auto max-w-5xl px-4 pb-16 pt-10 space-y-6">
        <Link to="/forum" className="inline-flex items-center gap-2 text-xs text-[var(--text-2)]">
          <ArrowLeft className="h-3.5 w-3.5" /> Вернуться на форум
        </Link>
        <header className="overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)]">
          <div
            className="relative h-48"
            style={{
              background: account.profile.bannerData
                ? undefined
                : `linear-gradient(120deg, ${accentFrom}, ${accentTo})`,
            }}
          >
            {account.profile.bannerData ? (
              <img src={account.profile.bannerData} alt="Баннер" className="h-full w-full object-cover" />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-1)]/60 to-transparent" />
          </div>
          <div className="px-6 pb-6 pt-4">
            <div className="-mt-20 flex flex-wrap items-end gap-6">
              <div className="h-32 w-32 overflow-hidden rounded-3xl border-4 border-[var(--bg-1)] shadow-lg">
                {account.profile.avatarData ? (
                  <img src={account.profile.avatarData} alt={account.username} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[var(--surface-2)] text-3xl font-bold">
                    {account.username.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl font-bold">{account.username}</h1>
                  {account.role === "admin" && <Crown className="h-5 w-5 text-yellow-400" />}
                  {account.role === "moderator" && <ShieldCheck className="h-5 w-5 text-[var(--accent)]" />}
                  {badges.filter(Boolean).map((badge, idx) => (
                    <span key={`${badge}-${idx}`} className="rounded-full bg-[var(--surface-2)] px-3 py-1 text-xs text-[var(--text-2)]">
                      {badge}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--text-2)]">
                  <span>Пользователь №{account.userNumber}</span>
                  <span>Роль: {account.role}</span>
                  <span>Регистрация: {new Date(account.createdAt).toLocaleDateString("ru-RU")}</span>
                  {privacy.showEmail || canEdit ? <span>E-mail: {account.email}</span> : null}
                </div>
              </div>
            </div>
            {account.profile.bio ? (
              <p className="mt-4 max-w-2xl text-sm text-[var(--text-2)]">{account.profile.bio}</p>
            ) : null}
          </div>
        </header>

        {privacy.showStats || canEdit ? (
          <section className="grid gap-4 md:grid-cols-3">
            <ProfileStat label="сообщений" value={account.posts} />
            <ProfileStat label="тем" value={account.topics} />
            <ProfileStat label="лайков" value={account.likes} />
          </section>
        ) : null}

        <section className="grid gap-6 md:grid-cols-[minmax(0,1fr)_300px]">
          <div className="card space-y-4">
            <h2 className="text-lg font-semibold">Подпись</h2>
            <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-sm text-[var(--text-2)]">
              {account.profile.signature || "Нет подписи"}
            </div>
          </div>
          <div className="card space-y-4">
            <h2 className="text-lg font-semibold">Ссылки</h2>
            <ul className="space-y-2 text-sm text-[var(--text-2)]">
              {account.profile.links?.website ? (
                <li>
                  <Link2 className="mr-2 inline h-4 w-4" />
                  <a href={account.profile.links.website} target="_blank" rel="noreferrer" className="text-[var(--accent)]">
                    {account.profile.links.website}
                  </a>
                </li>
              ) : null}
              {account.profile.links?.discord ? (
                <li>
                  <BadgeCheck className="mr-2 inline h-4 w-4" /> {account.profile.links.discord}
                </li>
              ) : null}
              {account.profile.links?.telegram ? (
                <li>
                  <BadgeCheck className="mr-2 inline h-4 w-4" /> {account.profile.links.telegram}
                </li>
              ) : null}
              {!account.profile.links?.website && !account.profile.links?.discord && !account.profile.links?.telegram ? (
                <li className="text-[var(--text-2)]/70">Ссылки не указаны</li>
              ) : null}
            </ul>
          </div>
        </section>

        {account.bans ? (
          <div className="rounded-3xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">
            Аккаунт ограничен до {account.bans.until || "∞"}. Причина: {account.bans.reason || "не указана"}
          </div>
        ) : null}
        {account.mutes ? (
          <div className="rounded-3xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-sm text-yellow-100">
            Мут до {account.mutes.until || "∞"}. Причина: {account.mutes.reason || "не указана"}
          </div>
        ) : null}

        {canEdit ? <ProfileEditor account={account} onChange={setAccount} /> : null}
      </main>
    </div>
  );
}

function ProfileStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 text-center">
      <div className="text-3xl font-bold text-[var(--text-1)]">{value}</div>
      <div className="text-xs uppercase tracking-[0.3em] text-[var(--text-2)]">{label}</div>
    </div>
  );
}

type ProfileEditorProps = {
  account: Account;
  onChange: (account: Account) => void;
};

type EditorState = {
  bio: string;
  signature: string;
  website: string;
  discord: string;
  telegram: string;
  accentFrom: string;
  accentTo: string;
  badges: string[];
  showEmail: boolean;
  showStats: boolean;
  avatarData?: string;
  bannerData?: string;
};

function ProfileEditor({ account, onChange }: ProfileEditorProps) {
  const [state, setState] = React.useState<EditorState>(() => mapToState(account));
  const [status, setStatus] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);

  React.useEffect(() => {
    setState(mapToState(account));
  }, [account]);

  const handleBadgeChange = (index: number, value: string) => {
    setState((prev) => {
      const badges = [...prev.badges];
      badges[index] = value;
      return { ...prev, badges };
    });
  };

  const handleImage = (key: "avatarData" | "bannerData", file?: File) => {
    if (!file) {
      setState((prev) => ({ ...prev, [key]: undefined }));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setState((prev) => ({ ...prev, [key]: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const save = () => {
    try {
      setBusy(true);
      updateAccountProfile(account.id, {
        bio: state.bio,
        signature: state.signature,
        links: {
          website: state.website || undefined,
          discord: state.discord || undefined,
          telegram: state.telegram || undefined,
        },
        accentFrom: state.accentFrom,
        accentTo: state.accentTo,
        badges: state.badges.map((badge) => badge.trim()).filter(Boolean),
        privacy: { showEmail: state.showEmail, showStats: state.showStats },
        avatarData: state.avatarData,
        bannerData: state.bannerData,
      });
      const updated = findAccountById(account.id);
      if (updated) {
        onChange(updated);
        setState(mapToState(updated));
      }
      setStatus("Изменения сохранены");
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Не удалось сохранить");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="card space-y-5">
      <header className="flex items-center gap-2 text-lg font-semibold">
        <Palette className="h-5 w-5 text-[var(--accent)]" />
        Кастомизация профиля
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm">
          <span>Биография</span>
          <textarea
            className="input min-h-[120px]"
            value={state.bio}
            onChange={(e) => setState((prev) => ({ ...prev, bio: e.target.value }))}
          />
        </label>
        <label className="space-y-2 text-sm">
          <span>Подпись</span>
          <textarea
            className="input min-h-[120px]"
            value={state.signature}
            onChange={(e) => setState((prev) => ({ ...prev, signature: e.target.value }))}
          />
        </label>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <label className="space-y-2 text-sm">
          <span>Веб-сайт</span>
          <input
            className="input"
            value={state.website}
            onChange={(e) => setState((prev) => ({ ...prev, website: e.target.value }))}
          />
        </label>
        <label className="space-y-2 text-sm">
          <span>Discord</span>
          <input
            className="input"
            value={state.discord}
            onChange={(e) => setState((prev) => ({ ...prev, discord: e.target.value }))}
          />
        </label>
        <label className="space-y-2 text-sm">
          <span>Telegram</span>
          <input
            className="input"
            value={state.telegram}
            onChange={(e) => setState((prev) => ({ ...prev, telegram: e.target.value }))}
          />
        </label>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {[0, 1, 2].map((idx) => (
          <label key={idx} className="space-y-2 text-sm">
            <span>Бейдж #{idx + 1}</span>
            <input
              className="input"
              value={state.badges[idx] || ""}
              onChange={(e) => handleBadgeChange(idx, e.target.value)}
              placeholder="Например, Core"
            />
          </label>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm">
          <span>Акцент от</span>
          <input
            type="color"
            className="input h-12"
            value={state.accentFrom}
            onChange={(e) => setState((prev) => ({ ...prev, accentFrom: e.target.value }))}
          />
        </label>
        <label className="space-y-2 text-sm">
          <span>Акцент до</span>
          <input
            type="color"
            className="input h-12"
            value={state.accentTo}
            onChange={(e) => setState((prev) => ({ ...prev, accentTo: e.target.value }))}
          />
        </label>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm">
          <span>Аватар</span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImage("avatarData", e.target.files?.[0])}
            className="input"
          />
          {state.avatarData ? (
            <img src={state.avatarData} alt="Avatar preview" className="h-24 w-24 rounded-2xl object-cover" />
          ) : null}
        </label>
        <label className="space-y-2 text-sm">
          <span>Баннер</span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImage("bannerData", e.target.files?.[0])}
            className="input"
          />
          {state.bannerData ? (
            <img src={state.bannerData} alt="Banner preview" className="h-24 w-full rounded-2xl object-cover" />
          ) : null}
        </label>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={state.showEmail}
            onChange={(e) => setState((prev) => ({ ...prev, showEmail: e.target.checked }))}
          />
          Показывать e-mail другим пользователям
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={state.showStats}
            onChange={(e) => setState((prev) => ({ ...prev, showStats: e.target.checked }))}
          />
          Показывать статистику профиля
        </label>
      </div>
      {status ? <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-2 text-xs text-[var(--text-2)]">{status}</div> : null}
      <button className="btn btn-primary" onClick={save} disabled={busy}>
        <Save className="h-4 w-4" /> Сохранить
      </button>
    </section>
  );
}

function mapToState(account: Account): EditorState {
  return {
    bio: account.profile.bio || "",
    signature: account.profile.signature || "",
    website: account.profile.links?.website || "",
    discord: account.profile.links?.discord || "",
    telegram: account.profile.links?.telegram || "",
    accentFrom: account.profile.accentFrom || "#8b5cf6",
    accentTo: account.profile.accentTo || "#22d3ee",
    badges: account.profile.badges ? [...account.profile.badges, "", ""].slice(0, 3) : ["", "", ""],
    showEmail: account.profile.privacy?.showEmail ?? false,
    showStats: account.profile.privacy?.showStats ?? true,
    avatarData: account.profile.avatarData,
    bannerData: account.profile.bannerData,
  };
}

