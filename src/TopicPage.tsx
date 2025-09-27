import React from "react";
import { useParams, Link } from "react-router-dom";
import { getSessionAccount, type RemoteUser } from "./store/authRemote";
import {
  getTopic,
  listPosts,
  createPost,
  updatePost,
  deletePost,
  toggleLikePost,
  type Topic,
  type Post,
} from "./store/forumRemote";
import { ChevronLeft, Lock, Unlock, Pin, Send, Heart } from "lucide-react";
import { formatRelativeDate, formatDateTime } from "./utils/time";

export default function TopicPage() {
  const { id = "" } = useParams();
  const [me, setMe] = React.useState<RemoteUser | null>(null);
  const [topic, setTopic] = React.useState<Topic | null>(null);
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [input, setInput] = React.useState("");

  const canModerate = !!me && (me.role === "developer" || me.role === "admin" || me.role === "moderator");

  React.useEffect(() => {
    (async () => {
      try {
        setMe(await getSessionAccount());
      } catch {}
      try {
        const t = await getTopic(id);
        if (t) setTopic(t);
        const p = await listPosts(id);
        setPosts(Array.isArray(p) ? p : []);
      } catch {}
    })();
  }, [id]);

  async function send() {
    const text = input.trim();
    if (!text || !me || !topic || topic.locked) return;
    try {
      const p = await createPost({ topicId: topic.id, content: text });
      setPosts((prev) => [...prev, p]);
      setInput("");
    } catch {}
  }

  async function togglePinReply(p: Post) {
    if (!canModerate) return;
    try {
      const upd = await updatePost(p.id, { pinned: !p.pinned });
      setPosts((prev) => prev.map((x) => (x.id === p.id ? upd : x)));
    } catch {}
  }

  async function removeReply(p: Post) {
    try {
      await deletePost(p.id);
      setPosts((prev) => prev.filter((x) => x.id !== p.id));
    } catch {}
  }

  const sortedPosts = React.useMemo(
    () =>
      posts
        .slice()
        .sort(
          (a, b) =>
            Number(b.pinned) - Number(a.pinned) ||
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        ),
    [posts]
  );

  return (
    <main className="min-h-screen" style={{ background: "#0d0d12", color: "#f8fafc" }}>
      <div className="mx-auto max-w-5xl space-y-6 px-4 py-6">
        <div className="card overflow-hidden">
          <div className="relative px-5 py-6">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.22),transparent_65%)]" />
            <div className="relative flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300/80">
                <Link to="/forum" className="btn flex items-center gap-2">
                  <ChevronLeft size={16} /> Форум
                </Link>
                <span className="text-xs uppercase tracking-[0.28em] text-slate-400">Тема</span>
                <span className="truncate text-sm font-semibold text-white">{topic?.title || "..."}</span>
                <span className="ml-auto text-xs uppercase tracking-[0.28em] text-slate-400">
                  Ответов {topic?.replyCount ?? 0} • Просмотров {topic?.viewCount ?? 0}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-white sm:text-3xl">{topic?.title || "Обсуждение"}</h1>
              <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.28em] text-slate-400">
                {topic?.pinned && (
                  <span className="flex items-center gap-1 rounded-full bg-amber-400/10 px-3 py-1 text-amber-200">
                    <Pin size={14} /> Закреплено
                  </span>
                )}
                {topic?.locked ? (
                  <span className="flex items-center gap-1 rounded-full bg-rose-400/10 px-3 py-1 text-rose-200">
                    <Lock size={14} /> Закрыта
                  </span>
                ) : (
                  <span className="flex items-center gap-1 rounded-full bg-emerald-400/10 px-3 py-1 text-emerald-200">
                    <Unlock size={14} /> Открыта для ответов
                  </span>
                )}
                {topic?.lastPostAt && (
                  <span className="flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 text-slate-200">
                    Последний ответ: {formatRelativeDate(topic.lastPostAt)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="divide-y divide-white/5">
            {sortedPosts.map((p) => (
              <div key={p.id} className="grid gap-4 px-4 py-5 md:grid-cols-[160px_1fr] md:items-start">
                <div className="flex flex-col gap-2 text-sm text-slate-400">
                  <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.28em] text-slate-300">
                    {p.authorId || "Участник"}
                  </div>
                  <div className="text-[11px] uppercase tracking-[0.26em] text-slate-500">
                    Опубликовано {formatDateTime(p.createdAt)}
                  </div>
                  {p.editedAt && (
                    <div className="text-[11px] uppercase tracking-[0.26em] text-amber-300/80">
                      Изменено {formatRelativeDate(p.editedAt)}
                    </div>
                  )}
                  {p.pinned && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/10 px-2 py-0.5 text-[11px] uppercase tracking-[0.26em] text-amber-200">
                      <Pin size={12} /> Закреплено
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm">
                  <div className="whitespace-pre-wrap leading-relaxed text-slate-100">{p.content}</div>
                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
                    <button
                      className="btn btn-sm flex items-center gap-2"
                      onClick={async () => {
                        try {
                          const upd = await toggleLikePost(p.id);
                          setPosts((prev) => prev.map((x) => (x.id === p.id ? upd : x)));
                        } catch {}
                      }}
                    >
                      <Heart size={14} /> {(p.likes || []).length}
                    </button>
                    {(canModerate || me?.id === p.authorId) && (
                      <div className="flex items-center gap-2">
                        {canModerate && (
                          <button className="btn btn-sm" onClick={() => togglePinReply(p)} type="button">
                            {p.pinned ? "Открепить" : "Закрепить"}
                          </button>
                        )}
                        <button className="btn btn-sm" onClick={() => removeReply(p)} type="button">
                          Удалить
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {!topic?.locked && me ? (
            <div className="border-t border-white/10 px-4 py-4">
              <label className="mb-2 block text-xs uppercase tracking-[0.3em] text-slate-400">
                Быстрый ответ
              </label>
              <div className="flex flex-col gap-3 md:flex-row md:items-start">
                <textarea
                  className="input min-h-[120px] flex-1"
                  placeholder="Поделитесь своим мнением или предложением. Используйте Ctrl + Enter для отправки."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                      e.preventDefault();
                      send();
                    }
                  }}
                />
                <button className="btn btn-primary flex items-center gap-2" onClick={send} type="button">
                  <Send size={16} /> Отправить
                </button>
              </div>
            </div>
          ) : (
            <div className="border-t border-white/10 px-4 py-4 text-xs uppercase tracking-[0.28em] text-rose-200">
              Тема закрыта для новых сообщений.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
