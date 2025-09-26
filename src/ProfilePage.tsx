import React from "react";
import { useParams } from "react-router-dom";
import {
  findAccountByUsername,
  getSessionAccount,
  updateAccountProfile,
  type Account,
} from "./store/forumStore";
import { Camera, Pencil, Globe, Link as LinkIcon, BadgeCheck } from "lucide-react";

const ROLE_STYLES: Record<string, { label: string; color: string }> = {
  developer: { label: "Developer", color: "#22d3ee" },
  admin: { label: "Admin", color: "#ef4444" },
  moderator: { label: "Moderator", color: "#8b5cf6" },
  vip: { label: "VIP", color: "#eab308" },
  user: { label: "User", color: "#94a3b8" },
  newbie: { label: "Newbie", color: "#22d3ee" },
};

const BADGE_OPTIONS = ["Founder", "Early", "Contributor", "VIP", "Designer"];

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

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="card p-4 text-center">
      <div className="text-3xl font-extrabold text-white">{value}</div>
      <div className="mt-1 text-xs uppercase tracking-[0.3em] text-zinc-400/80">
        {label}
      </div>
    </div>
  );
}

function InfoRow({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card p-4">
      <div className="mb-2 text-xs uppercase tracking-[0.28em] text-zinc-400/70">
        {title}
      </div>
      {children}
    </div>
  );
}

export default function ProfilePage() {
  const { username = "" } = useParams();
  const [user, setUser] = React.useState<Account | null>(() => findAccountByUsername(username) || null);
  const [session, setSession] = React.useState<Account | null>(() => getSessionAccount());

  React.useEffect(() => {
    setUser(findAccountByUsername(username) || null);
  }, [username]);

  React.useEffect(() => {
    const sync = () => setSession(getSessionAccount());
    window.addEventListener("forum:session", sync as any);
    window.addEventListener("storage", sync as any);
    return () => {
      window.removeEventListener("forum:session", sync as any);
      window.removeEventListener("storage", sync as any);
    };
  }, []);

  if (!user) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-200">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <div className="card p-6 text-center text-sm text-zinc-300">
            Profile not found.
          </div>
        </div>
      </main>
    );
  }

  const canEdit = session?.id === user.id;
  const accentFrom = user.profile.accentFrom || "#22d3ee";
  const accentTo = user.profile.accentTo || "#8b5cf6";

  return (
    <main
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(900px 600px at 20% -10%, rgba(59,130,246,0.18), transparent 65%), radial-gradient(1100px 760px at 95% 8%, rgba(236,72,153,0.16), transparent 68%), #0d0d12",
        color: "#f8fafc",
      }}
    >
      <div className="mx-auto max-w-5xl px-4 py-6">
        <div className="card overflow-hidden">
          <div
            style={{
              height: 180,
              background: user.profile.bannerData
                ? `url(${user.profile.bannerData}) center/cover`
                : `linear-gradient(135deg, ${accentFrom}, ${accentTo})`,
            }}
          />
          <div className="flex flex-wrap items-end gap-4 px-4 pb-4 -mt-16">
            <div
              className="h-24 w-24 rounded-full ring-4 ring-[rgba(13,19,33,0.85)]"
              style={{
                background: user.profile.avatarData
                  ? `url(${user.profile.avatarData}) center/cover`
                  : `linear-gradient(135deg, ${accentFrom}, ${accentTo})`,
              }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-extrabold text-white">{user.username}</h1>
                <RoleBadge role={user.role} />
                <span className="text-xs text-zinc-400/80">#{user.userNumber}</span>
              </div>
              <div className="mt-1 text-xs text-zinc-500">
                Joined {new Date(user.createdAt).toLocaleDateString()}
              </div>
            </div>
            {canEdit && (
              <CustomizeButton
                user={user}
                onUpdated={() => setUser(findAccountByUsername(username) || null)}
              />
            )}
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Stat value={user.posts} label="Posts" />
          <Stat value={user.topics} label="Topics" />
          <Stat value={user.likes} label="Likes" />
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.35fr_.85fr]">
          <InfoRow title="About">
            <p className="whitespace-pre-wrap text-sm text-zinc-200/80">
              {user.profile.bio || "No bio yet."}
            </p>
          </InfoRow>
          <InfoRow title="Links">
            <div className="grid gap-2 text-sm text-zinc-200/80">
              {user.profile.links?.website ? (
                <a
                  className="flex items-center gap-2 text-sky-300 hover:text-sky-200"
                  href={user.profile.links.website}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Globe size={14} />
                  {user.profile.links.website}
                </a>
              ) : null}
              {user.profile.links?.discord ? (
                <div className="flex items-center gap-2">
                  <LinkIcon size={14} /> Discord: {user.profile.links.discord}
                </div>
              ) : null}
              {user.profile.links?.telegram ? (
                <div className="flex items-center gap-2">
                  <LinkIcon size={14} /> Telegram: {user.profile.links.telegram}
                </div>
              ) : null}
              {!user.profile.links?.website &&
                !user.profile.links?.discord &&
                !user.profile.links?.telegram && <span>No links added.</span>}
            </div>
          </InfoRow>
        </div>

        <InfoRow title="Signature">
          <div className="whitespace-pre-wrap text-sm text-zinc-200/80">
            {user.profile.signature || "No signature."}
          </div>
        </InfoRow>
      </div>
    </main>
  );
}

function CustomizeButton({ user, onUpdated }: { user: Account; onUpdated: () => void }) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <button className="btn" onClick={() => setOpen(true)}>
        <Pencil size={16} /> Customize
      </button>
      {open && (
        <CustomizeModal
          user={user}
          onClose={() => setOpen(false)}
          onSaved={() => {
            onUpdated();
            setOpen(false);
          }}
        />
      )}
    </>
  );
}

function CustomizeModal({
  user,
  onClose,
  onSaved,
}: {
  user: Account;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [avatar, setAvatar] = React.useState<string>(user.profile.avatarData || "");
  const [banner, setBanner] = React.useState<string>(user.profile.bannerData || "");
  const [from, setFrom] = React.useState(user.profile.accentFrom || "#22d3ee");
  const [to, setTo] = React.useState(user.profile.accentTo || "#8b5cf6");
  const [bio, setBio] = React.useState(user.profile.bio || "");
  const [signature, setSignature] = React.useState(user.profile.signature || "");
  const [website, setWebsite] = React.useState(user.profile.links?.website || "");
  const [discord, setDiscord] = React.useState(user.profile.links?.discord || "");
  const [telegram, setTelegram] = React.useState(user.profile.links?.telegram || "");
  const [badges, setBadges] = React.useState<string[]>(user.profile.badges || []);

  const toggleBadge = (badge: string) => {
    setBadges((prev) => {
      if (prev.includes(badge)) {
        return prev.filter((b) => b !== badge);
      }
      if (prev.length >= 3) return prev;
      return [...prev, badge];
    });
  };

  const pick = (setter: (value: string) => void) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setter(String(reader.result || ""));
    reader.readAsDataURL(file);
  };

  const save = () => {
    updateAccountProfile(user.id, {
      avatarData: avatar || undefined,
      bannerData: banner || undefined,
      accentFrom: from,
      accentTo: to,
      bio: bio.trim() || undefined,
      signature: signature.trim() || undefined,
      links: {
        website: website.trim() || undefined,
        discord: discord.trim() || undefined,
        telegram: telegram.trim() || undefined,
      },
      badges,
    });
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-[120] grid place-items-center bg-black/70 px-4 py-6">
      <div className="card w-[min(780px,96vw)] max-h-[90vh] overflow-y-auto p-5">
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold text-white">Customize profile</div>
          <button className="btn" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="card p-4">
            <div className="text-xs uppercase tracking-[0.28em] text-zinc-400/80">Avatar</div>
            <div className="mt-3 flex items-center gap-3">
              <div
                className="h-20 w-20 rounded-full"
                style={{
                  background: avatar
                    ? `url(${avatar}) center/cover`
                    : `linear-gradient(135deg, ${from}, ${to})`,
                }}
              />
              <div className="flex flex-col gap-2">
                <label className="btn flex items-center gap-2">
                  <Camera size={16} />
                  Upload
                  <input type="file" accept="image/*" hidden onChange={pick(setAvatar)} />
                </label>
                {avatar && (
                  <button className="btn" onClick={() => setAvatar("")}>Remove</button>
                )}
              </div>
            </div>
          </div>

          <div className="card p-4">
            <div className="text-xs uppercase tracking-[0.28em] text-zinc-400/80">Banner</div>
            <div
              className="mt-3 h-20 w-full rounded-xl"
              style={{
                background: banner
                  ? `url(${banner}) center/cover`
                  : `linear-gradient(135deg, ${from}, ${to})`,
              }}
            />
            <div className="mt-3 flex gap-2">
              <label className="btn flex items-center gap-2">
                <Camera size={16} />
                Upload
                <input type="file" accept="image/*" hidden onChange={pick(setBanner)} />
              </label>
              {banner && (
                <button className="btn" onClick={() => setBanner("")}>Remove</button>
              )}
            </div>
          </div>

          <div className="card p-4">
            <div className="text-xs uppercase tracking-[0.28em] text-zinc-400/80">Accent</div>
            <div className="mt-3 flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400/80">From</span>
                <input type="color" value={from} onChange={(e) => setFrom(e.target.value)} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400/80">To</span>
                <input type="color" value={to} onChange={(e) => setTo(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="card p-4">
            <div className="text-xs uppercase tracking-[0.28em] text-zinc-400/80">Badges (max 3)</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {BADGE_OPTIONS.map((badge) => {
                const active = badges.includes(badge);
                return (
                  <button
                    key={badge}
                    className={`btn flex items-center gap-2 ${active ? "btn-primary" : ""}`}
                    onClick={() => toggleBadge(badge)}
                    type="button"
                  >
                    <BadgeCheck size={16} /> {badge}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="card p-4 sm:col-span-2">
            <div className="text-xs uppercase tracking-[0.28em] text-zinc-400/80">Bio</div>
            <textarea
              className="input mt-2 min-h-[120px]"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell the community a bit about yourself"
            />
          </div>

          <div className="card p-4 sm:col-span-2">
            <div className="text-xs uppercase tracking-[0.28em] text-zinc-400/80">Signature</div>
            <textarea
              className="input mt-2 min-h-[90px]"
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              placeholder="Signature displayed under your posts"
            />
          </div>

          <div className="card p-4 sm:col-span-2">
            <div className="text-xs uppercase tracking-[0.28em] text-zinc-400/80">Links</div>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              <input
                className="input"
                placeholder="https://website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
              <input
                className="input"
                placeholder="discord username"
                value={discord}
                onChange={(e) => setDiscord(e.target.value)}
              />
              <input
                className="input"
                placeholder="@telegram"
                value={telegram}
                onChange={(e) => setTelegram(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button className="btn" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={save}>
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}
