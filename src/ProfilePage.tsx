import React from "react";
import { useParams } from "react-router-dom";
import {
  findAccountByUsername,
  getSessionAccount as getLocalSession,
  updateAccountProfile as updateLocalProfile,
  type Account,
  findAccountById,
} from "./store/forumStore";
import {
  getSessionAccount as getRemoteSession,
  getProfileByUsername,
  updateMyProfile,
  type RemoteProfile,
} from "./store/authRemote";
import {
  isFollowing,
  follow,
  unfollow,
  listFollowers,
  listProfileComments,
  addProfileComment,
  addReply,
  removeProfileComment,
  type ProfileComment,
} from "./store/socialStore";
import {
  Camera, Pencil, Globe, Link as LinkIcon, BadgeCheck, UserPlus, UserMinus,
  MessageSquare, Trash2, Shield, Code2, Gavel, Crown
} from "lucide-react";

// ====== ROLE META (для красивого бейджа и подсветки) ======
const ROLE_STYLES: Record<string, { label: string; color: string; glow: string }> = {
  developer: { label: "Developer", color: "#22d3ee", glow: "from-cyan-400/35" },
  admin:     { label: "Admin",     color: "#ef4444", glow: "from-rose-400/35" },
  moderator: { label: "Moderator", color: "#8b5cf6", glow: "from-violet-400/35" },
  vip:       { label: "VIP",       color: "#eab308", glow: "from-amber-400/35" },
  user:      { label: "User",      color: "#94a3b8", glow: "from-slate-300/30" },
  newbie:    { label: "Newbie",    color: "#22d3ee", glow: "from-cyan-400/35" },
};

const ROLE_META: Record<string, {
  label: string;
  grad: string; // градиент чипа
  Icon: any;
}> = {
  developer: { label: "Developer", grad: "from-cyan-400 via-fuchsia-400 to-cyan-400", Icon: Code2 },
  admin:     { label: "Admin",     grad: "from-rose-400 via-amber-400 to-rose-400",  Icon: Shield },
  moderator: { label: "Moderator", grad: "from-violet-400 via-sky-400 to-violet-400", Icon: Gavel },
  vip:       { label: "VIP",       grad: "from-amber-400 via-rose-400 to-amber-400",  Icon: Crown },
  user:      { label: "User",      grad: "from-slate-300 via-slate-400 to-slate-300", Icon: Shield },
  newbie:    { label: "Newbie",    grad: "from-cyan-400 via-fuchsia-400 to-cyan-400", Icon: Code2 },
};

// ====== SMALL UI ======

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="card p-4 text-center">
      <div className="text-3xl font-extrabold text-white">{value}</div>
      <div className="mt-1 text-xs uppercase tracking-[0.3em] text-zinc-400/80">{label}</div>
    </div>
  );
}

function InfoRow({ title, children, right }: { title: string; children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div className="card p-4">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-xs uppercase tracking-[0.28em] text-zinc-400/70">{title}</div>
        {right}
      </div>
      {children}
    </div>
  );
}

// Крупный красивый бейдж роли — под именем
function RoleBadgePro({ role }: { role: string }) {
  const meta = ROLE_META[role] ?? ROLE_META.user;
  const Icon = meta.Icon;
  return (
    <span className="relative inline-flex">
      <span className={`absolute -inset-[2px] rounded-full blur-md bg-gradient-to-r ${meta.grad} opacity-50`} />
      <span
        className="relative inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.22em] text-white shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset]"
      >
        <Icon size={14} className="opacity-90" />
        {meta.label}
      </span>
    </span>
  );
}

// Маленькая плашка роли на аватаре
function RoleMini({ role }: { role: string }) {
  const meta = ROLE_META[role] ?? ROLE_META.user;
  return (
    <span
      className="rounded-full border border-white/15 bg-black/50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur"
      style={{ boxShadow: "0 0 16px rgba(255,255,255,0.08), inset 0 0 0 1px rgba(255,255,255,0.05)" }}
    >
      {meta.label}
    </span>
  );
}

// ====== BADGES (display) ======
const BADGE_PALETTE: Record<string, string> = {
  Founder: "from-rose-500/25 to-rose-400/10 text-rose-200",
  Early: "from-sky-500/25 to-sky-400/10 text-sky-200",
  Contributor: "from-emerald-500/25 to-emerald-400/10 text-emerald-200",
  VIP: "from-amber-500/25 to-amber-400/10 text-amber-200",
  Designer: "from-violet-500/25 to-violet-400/10 text-violet-200",
};

function BadgesRow({ badges }: { badges?: string[] }) {
  if (!badges || badges.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-2">
      {badges.slice(0, 3).map((b) => {
        const cls = BADGE_PALETTE[b] || "from-white/20 to-white/5 text-zinc-200";
        return (
          <span
            key={b}
            className={`inline-flex items-center gap-1 rounded-full border border-white/10 bg-gradient-to-br ${cls} px-2.5 py-1 text-xs`}
            title={`Badge: ${b}`}
          >
            <BadgeCheck size={14} className="opacity-90" /> {b}
          </span>
        );
      })}
    </div>
  );
}

export default function ProfilePage() {
  const { username = "" } = useParams();
  const [user, setUser] = React.useState<Account | null>(null);
  const [session, setSession] = React.useState<{ id: string; username: string } | null>(null);
  const [remote, setRemote] = React.useState<boolean>(false);

  // load
  React.useEffect(() => {
    (async () => {
      try {
        const me = await getRemoteSession();
        if (me) {
          setRemote(true);
          setSession({ id: me.id, username: me.username });
          const pack = await getProfileByUsername(username);
          if (pack) {
            const acc: Account = {
              id: pack.user.id,
              username: pack.user.username,
              email: pack.user.email,
              createdAt: pack.user.createdAt,
              role: pack.user.role,
              userNumber: pack.user.userNumber,
              posts: 0,
              likes: 0,
              topics: 0,
              profile: (pack.profile as any) || {
                bio: "", signature: "", links: {},
                accentFrom: "#8b5cf6", accentTo: "#0ea5e9",
                badges: [], privacy: { showEmail: false, showStats: true, showLinks: true, allowComments: true, showFollowers: true }
              },
              bans: null, mutes: null,
            };
            setUser(acc);
            return;
          }
        }
      } catch {}
      setRemote(false);
      setUser(findAccountByUsername(username) || null);
      const meLocal = getLocalSession();
      setSession(meLocal ? { id: meLocal.id, username: meLocal.username } : null);
    })();
  }, [username]);

  // session sync
  React.useEffect(() => {
    const sync = async () => {
      try { const me = await getRemoteSession(); if (me) { setSession({ id: me.id, username: me.username }); return; } } catch {}
      const meLocal = getLocalSession();
      setSession(meLocal ? { id: meLocal.id, username: meLocal.username } : null);
    };
    window.addEventListener("forum:session", sync as any);
    window.addEventListener("storage", sync as any);
    return () => {
      window.removeEventListener("forum:session", sync as any);
      window.removeEventListener("storage", sync as any);
    };
  }, []);

  // socials
  const targetId = user?.id || "";
  const [followers, setFollowers] = React.useState<string[]>(() => (targetId ? listFollowers(targetId) : []));
  const [comments, setComments] = React.useState<ProfileComment[]>(() => (targetId ? listProfileComments(targetId) : []));
  const iFollow = React.useMemo(() => isFollowing(session?.id || null, targetId), [session?.id, targetId, followers.length]);

  React.useEffect(() => {
    if (!targetId) { setFollowers([]); setComments([]); return; }
    setFollowers(listFollowers(targetId));
    setComments(listProfileComments(targetId));
  }, [targetId]);

  // live sync from socialStore (cross-tab)
  React.useEffect(() => {
    const onSocial = () => {
      if (!targetId) return;
      setFollowers(listFollowers(targetId));
      setComments(listProfileComments(targetId));
    };
    window.addEventListener("forum:social-change", onSocial as any);
    return () => window.removeEventListener("forum:social-change", onSocial as any);
  }, [targetId]);

  if (!user) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-200">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <div className="card p-6 text-center text-sm text-zinc-300">Profile not found.</div>
        </div>
      </main>
    );
  }

  const canEdit = session?.id === user.id;
  const accentFrom = user.profile.accentFrom || "#22d3ee";
  const accentTo = user.profile.accentTo || "#8b5cf6";
  const roleStyle = ROLE_STYLES[user.role] || ROLE_STYLES.user;

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
        {/* ===== HERO ===== */}
        <div className="card overflow-hidden">
          <div className="relative">
            <div
              className="h-[200px] w-full"
              style={{
                background: user.profile.bannerData
                  ? `url(${user.profile.bannerData}) center/cover`
                  : `linear-gradient(135deg, ${accentFrom}, ${accentTo})`,
              }}
            />
            {/* soft overlays */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/50" />
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute right-8 top-6 h-24 w-24 rounded-full bg-gradient-to-br from-white/15 to-transparent blur-2xl" />
            </div>
          </div>

          <div className="flex flex-wrap items-end gap-4 px-4 pb-5 -mt-16">
            <div className="relative">
              <div
                className="h-24 w-24 rounded-full ring-4 ring-[rgba(13,19,33,0.85)] shadow-2xl"
                style={{
                  background: user.profile.avatarData
                    ? `url(${user.profile.avatarData}) center/cover`
                    : `linear-gradient(135deg, ${accentFrom}, ${accentTo})`,
                }}
              />
              {/* мягкое свечение аватара по роли */}
              <div className={`absolute -inset-1 -z-10 rounded-full bg-gradient-to-br ${roleStyle.glow} to-transparent blur-lg`} />
              {/* мини-плашка роли на аватаре */}
              <div className="absolute -bottom-2 left-1">
                <RoleMini role={user.role} />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              {/* имя и номер */}
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-extrabold text-white">{user.username}</h1>
                <span className="text-xs text-zinc-400/80">#{user.userNumber}</span>
              </div>
              {/* крупный бейдж роли под именем */}
              <div className="mt-2">
                <RoleBadgePro role={user.role} />
              </div>
              {/* дата/почта */}
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-zinc-400/90">
                <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                {user.profile.privacy?.showEmail && user.email ? (
                  <span className="rounded-full bg-white/[0.04] px-2 py-1">{user.email}</span>
                ) : null}
              </div>
              {/* пользовательские бейджи */}
              <div className="mt-2">
                <BadgesRow badges={user.profile.badges} />
              </div>
            </div>

            {canEdit ? (
              <CustomizeButton
                user={user}
                onUpdated={async () => {
                  if (remote) {
                    const pack = await getProfileByUsername(username);
                    if (pack) setUser({
                      id: pack.user.id,
                      username: pack.user.username,
                      email: pack.user.email,
                      createdAt: pack.user.createdAt,
                      role: pack.user.role,
                      userNumber: pack.user.userNumber,
                      posts: 0, likes: 0, topics: 0,
                      profile: (pack.profile as any), bans: null, mutes: null,
                    });
                  } else {
                    setUser(findAccountByUsername(username) || null);
                  }
                }}
                saveProfile={async (profile) => {
                  if (remote) { await updateMyProfile(profile as any as RemoteProfile); }
                  else { updateLocalProfile(user!.id, profile); }
                }}
              />
            ) : (
              <div className="flex gap-2">
                <button
                  className={`btn ${iFollow ? "" : "btn-primary"}`}
                  onClick={() => {
                    if (!session?.id) return;
                    if (iFollow) { unfollow(session.id, user.id); }
                    else { follow(session.id, user.id); }
                    setFollowers(listFollowers(user.id));
                  }}
                >
                  {iFollow ? (<><UserMinus size={16} /> Unfollow</>) : (<><UserPlus size={16} /> Follow</>)}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ===== STATS ===== */}
        {user.profile?.privacy?.showStats !== false && (
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.02] p-4 text-center">
              <Stat value={user.posts} label="Posts" />
            </div>
            <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.02] p-4 text-center">
              <Stat value={user.topics} label="Topics" />
            </div>
            <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.02] p-4 text-center">
              <Stat value={user.likes} label="Likes" />
            </div>
          </div>
        )}

        {/* ===== ABOUT + LINKS ===== */}
        <div className="mt-6 grid gap-4 lg:grid-cols-[1.35fr_.85fr]">
          <InfoRow title="About">
            <p className="whitespace-pre-wrap text-sm text-zinc-200/85">
              {user.profile.bio || "No bio yet."}
            </p>
          </InfoRow>

          {user.profile?.privacy?.showLinks !== false && (
            <InfoRow title="Links">
              <div className="flex flex-wrap gap-2 text-sm text-zinc-200/90">
                {user.profile.links?.website && (
                  <a className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 hover:bg-white/[0.08]"
                     href={user.profile.links.website} target="_blank" rel="noreferrer">
                    <Globe size={14} /> Website
                  </a>
                )}
                {user.profile.links?.discord && (
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1">
                    <LinkIcon size={14} /> {user.profile.links.discord}
                  </span>
                )}
                {user.profile.links?.telegram && (
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1">
                    <LinkIcon size={14} /> {user.profile.links.telegram}
                  </span>
                )}
                {!user.profile.links?.website && !user.profile.links?.discord && !user.profile.links?.telegram && (
                  <span className="opacity-70">No links added.</span>
                )}
              </div>
            </InfoRow>
          )}
        </div>

        {/* ===== SIGNATURE ===== */}
        <InfoRow title="Signature">
          <div className="whitespace-pre-wrap text-sm text-zinc-200/85">
            {user.profile.signature || "No signature."}
          </div>
        </InfoRow>

        {/* ===== FOLLOWERS ===== */}
        {user.profile?.privacy?.showFollowers !== false && (
          <InfoRow title={`Followers (${followers.length})`}>
            <div className="flex flex-wrap gap-2 text-sm text-zinc-200/90">
              {followers.length === 0 ? <span className="opacity-70">No followers yet.</span> : (
                followers.slice(0, 18).map(fid => {
                  const acc = findAccountById(fid);
                  return (
                    <span key={fid} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1">
                      {acc?.username || `User`}
                    </span>
                  );
                })
              )}
            </div>
          </InfoRow>
        )}

        {/* ===== COMMENTS ===== */}
        {user.profile?.privacy?.allowComments !== false && (
          <InfoRow title="Profile comments">
            <div className="grid gap-3">
              {session?.id && (
                <CommentComposer
                  onPost={(text) => {
                    if (!session?.id) return;
                    addProfileComment(user.id, session.id, text, { authorName: session.username });
                    setComments(listProfileComments(user.id));
                  }}
                />
              )}
              <div className="grid gap-2">
                {comments.length === 0 && <div className="text-sm text-zinc-400/80">No comments yet.</div>}
                {buildTree(comments).map(node => (
                  <CommentItem
                    key={node.comment.id}
                    node={node}
                    currentUserId={session?.id || ""}
                    ownerId={user.id}
                    onReply={(pid, text) => {
                      if (!session?.id) return;
                      addReply(user.id, session.id, pid, text, session.username);
                      setComments(listProfileComments(user.id));
                    }}
                    onDelete={(cid) => {
                      if (!session?.id) return;
                      removeProfileComment(user.id, cid, session.id);
                      setComments(listProfileComments(user.id));
                    }}
                  />
                ))}
              </div>
            </div>
          </InfoRow>
        )}
      </div>
    </main>
  );
}

// ====== Customize Modal ======
function CustomizeButton({ user, onUpdated, saveProfile }: { user: Account; onUpdated: () => void; saveProfile: (p: any) => Promise<void> }) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <button className="btn" onClick={() => setOpen(true)}>
        <Pencil size={16} /> Settings
      </button>
      {open && (
        <CustomizeModal
          user={user}
          onClose={() => setOpen(false)}
          onSaved={() => { onUpdated(); setOpen(false); }}
          saveProfile={saveProfile}
        />
      )}
    </>
  );
}

const BADGE_OPTIONS = ["Founder", "Early", "Contributor", "VIP", "Designer"];

function CustomizeModal({
  user, onClose, onSaved, saveProfile,
}: {
  user: Account; onClose: () => void; onSaved: () => void; saveProfile: (p: any) => Promise<void>;
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
  const [showEmail, setShowEmail] = React.useState<boolean>(user.profile.privacy?.showEmail ?? false);
  const [showStats, setShowStats] = React.useState<boolean>(user.profile.privacy?.showStats ?? true);
  const [showLinks, setShowLinks] = React.useState<boolean>(user.profile.privacy?.showLinks ?? true);
  const [allowComments, setAllowComments] = React.useState<boolean>(user.profile.privacy?.allowComments ?? true);
  const [showFollowers, setShowFollowers] = React.useState<boolean>(user.profile.privacy?.showFollowers ?? true);

  const toggleBadge = (badge: string) => {
    setBadges((prev) => {
      if (prev.includes(badge)) return prev.filter((b) => b !== badge);
      if (prev.length >= 3) return prev; // max 3
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

  const save = async () => {
    await saveProfile({
      avatarData: avatar || undefined,
      bannerData: banner || undefined,
      accentFrom: from, accentTo: to,
      bio: bio.trim() || undefined,
      signature: signature.trim() || undefined,
      links: { website: website.trim() || undefined, discord: discord.trim() || undefined, telegram: telegram.trim() || undefined },
      badges,
      privacy: { showEmail, showStats, showLinks, allowComments, showFollowers },
    });
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-[120] grid place-items-center bg-black/70 px-4 py-6">
      <div className="card w-[min(780px,96vw)] max-h-[90vh] overflow-y-auto p-5">
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold text-white">Customize profile</div>
          <button className="btn" onClick={onClose}>Close</button>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="card p-4">
            <div className="text-xs uppercase tracking-[0.28em] text-zinc-400/80">Avatar</div>
            <div className="mt-3 flex items-center gap-3">
              <div
                className="h-20 w-20 rounded-full"
                style={{
                  background: avatar ? `url(${avatar}) center/cover` : `linear-gradient(135deg, ${from}, ${to})`,
                }}
              />
              <div className="flex flex-col gap-2">
                <label className="btn flex items-center gap-2">
                  <Camera size={16} /> Upload
                  <input type="file" accept="image/*" hidden onChange={pick(setAvatar)} />
                </label>
                {avatar && <button className="btn" onClick={() => setAvatar("")}>Remove</button>}
              </div>
            </div>
          </div>

          <div className="card p-4">
            <div className="text-xs uppercase tracking-[0.28em] text-zinc-400/80">Banner</div>
            <div className="mt-3 h-20 w-full rounded-xl"
                 style={{ background: banner ? `url(${banner}) center/cover` : `linear-gradient(135deg, ${from}, ${to})` }} />
            <div className="mt-3 flex gap-2">
              <label className="btn flex items-center gap-2">
                <Camera size={16} /> Upload
                <input type="file" accept="image/*" hidden onChange={pick(setBanner)} />
              </label>
              {banner && <button className="btn" onClick={() => setBanner("")}>Remove</button>}
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
                    title={active ? "Click to remove" : "Click to add"}
                  >
                    <BadgeCheck size={16} /> {badge}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="card p-4 sm:col-span-2">
            <div className="text-xs uppercase tracking-[0.28em] text-zinc-400/80">Bio</div>
            <textarea className="input mt-2 min-h-[120px]" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell the community a bit about yourself" />
          </div>

          <div className="card p-4 sm:col-span-2">
            <div className="text-xs uppercase tracking-[0.28em] text-zinc-400/80">Signature</div>
            <textarea className="input mt-2 min-h-[90px]" value={signature} onChange={(e) => setSignature(e.target.value)} placeholder="Signature displayed under your posts" />
          </div>

          <div className="card p-4 sm:col-span-2">
            <div className="text-xs uppercase tracking-[0.28em] text-zinc-400/80">Links</div>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              <input className="input" placeholder="https://website" value={website} onChange={(e) => setWebsite(e.target.value)} />
              <input className="input" placeholder="discord username" value={discord} onChange={(e) => setDiscord(e.target.value)} />
              <input className="input" placeholder="@telegram" value={telegram} onChange={(e) => setTelegram(e.target.value)} />
            </div>
          </div>

          <div className="card p-4 sm:col-span-2">
            <div className="text-xs uppercase tracking-[0.28em] text-zinc-400/80">Privacy</div>
            <div className="mt-3 grid gap-2 text-sm">
              <label className="flex items-center gap-2"><input type="checkbox" checked={showEmail} onChange={(e) => setShowEmail(e.target.checked)} /> Show email</label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={showStats} onChange={(e) => setShowStats(e.target.checked)} /> Show stats</label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={showLinks} onChange={(e) => setShowLinks(e.target.checked)} /> Show links</label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={showFollowers} onChange={(e) => setShowFollowers(e.target.checked)} /> Show followers</label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={allowComments} onChange={(e) => setAllowComments(e.target.checked)} /> Allow comments</label>
            </div>
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={save}>Save changes</button>
        </div>
      </div>
    </div>
  );
}

// ====== Comments UI ======

function CommentComposer({ onPost }: { onPost: (text: string) => void }) {
  const [text, setText] = React.useState("");
  return (
    <div className="card p-3">
      <div className="flex items-start gap-2">
        <MessageSquare size={16} className="mt-1 shrink-0" />
        <textarea
          className="input min-h-[80px] flex-1"
          placeholder="Write a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
      <div className="mt-2 flex justify-end">
        <button
          className="btn btn-primary"
          onClick={() => { const t = text.trim(); if (!t) return; onPost(t); setText(""); }}
        >
          Post comment
        </button>
      </div>
    </div>
  );
}

type CommentNode = { comment: ProfileComment; replies: CommentNode[] };
function buildTree(all: ProfileComment[]): CommentNode[] {
  const map: Record<string, CommentNode> = {};
  all.forEach(c => { map[c.id] = { comment: c, replies: [] }; });
  const roots: CommentNode[] = [];
  all.forEach(c => {
    const pid = c.parentId || "";
    if (pid && map[pid]) map[pid].replies.push(map[c.id]);
    else roots.push(map[c.id]);
  });
  roots.sort((a,b) => (a.comment.createdAt < b.comment.createdAt ? 1 : -1));
  const sortRec = (n: CommentNode) => n.replies.sort((a,b)=> (a.comment.createdAt > b.comment.createdAt ? 1 : -1)).forEach(sortRec);
  roots.forEach(sortRec);
  return roots;
}

function CommentItem({
  node, currentUserId, ownerId, onReply, onDelete
}: {
  node: CommentNode; currentUserId: string; ownerId: string;
  onReply: (parentId: string, text: string) => void; onDelete: (commentId: string) => void;
}) {
  const [openReply, setOpenReply] = React.useState(false);
  const acc = findAccountById(node.comment.authorId);
  const name = node.comment.authorName || acc?.username || (node.comment.authorId === ownerId ? "Owner" : (node.comment.authorId === currentUserId ? "You" : "User"));
  return (
    <div className="rounded-xl border border-white/5 bg-white/3 p-3">
      <div className="flex items-start gap-3">
        <div className="h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-sky-500/60 to-violet-500/60" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <div className="text-xs text-zinc-300/90">
              {acc?.username ? (
                <a href={`/forum/profile/${acc.username}`} className="font-semibold text-white hover:underline">{name}</a>
              ) : (
                <span className="font-semibold text-white">{name}</span>
              )}
              <span className="opacity-70"> · {new Date(node.comment.createdAt).toLocaleString()}</span>
            </div>
            {(currentUserId === node.comment.authorId || currentUserId === ownerId) && (
              <button className="btn" title="Delete" onClick={() => onDelete(node.comment.id)}>
                <Trash2 size={14} />
              </button>
            )}
          </div>
          <div className="mt-1 whitespace-pre-wrap text-sm text-zinc-100/90">{node.comment.content}</div>
          <div className="mt-2 flex items-center gap-2">
            <button className="btn" onClick={() => setOpenReply(v => !v)}>Reply</button>
          </div>
          {openReply && (
            <div className="mt-2">
              <InlineReply onSend={(t) => { onReply(node.comment.id, t); setOpenReply(false); }} />
            </div>
          )}
          {node.replies.length > 0 && (
            <div className="mt-3 space-y-2 border-l border-white/10 pl-3">
              {node.replies.map(child => (
                <CommentItem key={child.comment.id} node={child} currentUserId={currentUserId} ownerId={ownerId} onReply={onReply} onDelete={onDelete} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InlineReply({ onSend }: { onSend: (text: string) => void }) {
  const [text, setText] = React.useState("");
  return (
    <div className="flex items-start gap-2">
      <textarea className="input min-h-[60px] flex-1" placeholder="Write a reply..." value={text} onChange={(e) => setText(e.target.value)} />
      <button className="btn btn-primary" onClick={() => { const t = text.trim(); if (!t) return; onSend(t); setText(""); }}>Send</button>
    </div>
  );
}
