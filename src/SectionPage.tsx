import React from "react";
import { Link, useParams } from "react-router-dom";
import { listSections, listTopics, createTopic, type Topic, type Section } from "./store/forumRemote";
import { ChevronLeft, ShoppingBag, Plus, Search, Clock, MessageSquare, Lock } from "lucide-react";
import ForumSubnav from "./ForumSubnav";
import { formatRelativeDate, formatDateTime } from "./utils/time";

export default function SectionPage() {
  const { id = "" } = useParams();
  const [section, setSection] = React.useState<Section | null>(null);
  const [topics, setTopics] = React.useState<Topic[]>([]);
  const [newTitle, setNewTitle] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [sort, setSort] = React.useState<"latest" | "popular">("latest");

  const reload = React.useCallback(async () => {
    try {
      const [sections, t] = await Promise.all([
        listSections(),
        listTopics(id),
      ]);
      setSection((sections as Section[]).find((s) => s.id === id) || null);
      setTopics(Array.isArray(t) ? (t as Topic[]) : []);
    } catch {
      setSection(null);
      setTopics([]);
    }
  }, [id]);

  React.useEffect(() => {
    reload();
  }, [reload]);

  const isWorkshop = (section?.title || "").toLowerCase() === "workshop";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const title = newTitle.trim();
    if (!title) return;
    setBusy(true);
    try {
      await createTopic({ sectionId: id, title });
      setNewTitle("");
      reload();
    } catch (err: any) {
      alert(err?.message || "Failed to create topic");
    } finally {
      setBusy(false);
    }
  };

  const filteredTopics = React.useMemo(() => {
    const list = Array.isArray(topics) ? [...topics] : [];
    const normalized = query.trim().toLowerCase();
    const filtered = normalized
      ? list.filter((topic) => {
          const title = topic.title?.toLowerCase?.() ?? "";
          return title.includes(normalized);
        })
      : list;
    const sorted = filtered.sort((a, b) => {
      const pinDiff = Number(b.pinned) - Number(a.pinned);
      if (pinDiff !== 0) return pinDiff;
      if (sort === "popular") {
        const repliesDiff = (b.replyCount ?? 0) - (a.replyCount ?? 0);
        if (repliesDiff !== 0) return repliesDiff;
        return (b.viewCount ?? 0) - (a.viewCount ?? 0);
      }
      const aTime = new Date(a.lastPostAt || a.updatedAt || a.createdAt).getTime();
      const bTime = new Date(b.lastPostAt || b.updatedAt || b.createdAt).getTime();
      return bTime - aTime;
    });
    return sorted;
  }, [topics, query, sort]);

  return (
    <main
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(900px 620px at 18% -12%, rgba(59,130,246,0.18), transparent 65%), radial-gradient(1200px 760px at 92% 0%, rgba(236,72,153,0.16), transparent 68%), #0d0d12",
        color: "#f8fafc",
      }}
    >
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-6">
        <ForumSubnav />

        <div className="card overflow-hidden">
          <div className="relative px-6 py-7">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.18),transparent_60%)]" />
            <div className="relative flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300/80">
                <Link to="/forum" className="btn flex items-center gap-2">
                  <ChevronLeft size={16} /> Назад
                </Link>
                <span className="text-xs uppercase tracking-[0.28em] text-slate-400">Раздел</span>
                <span className="text-sm font-semibold text-white">{section?.title || "..."}</span>
              </div>
              <h1 className="text-3xl font-bold text-white sm:text-4xl">
                {section?.title || "Раздел"}
              </h1>
              {section?.description && (
                <p className="max-w-3xl text-sm text-slate-300/80">
                  {section.description}
                </p>
              )}
              {isWorkshop && (
                <div className="flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-200">
                  <ShoppingBag size={16} />
                  Workshop: размещайте товары и предложения. Каждая тема — отдельный лот.
                </div>
              )}
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                  <div className="text-[11px] uppercase tracking-[0.3em] text-slate-400">Темы</div>
                  <div className="mt-2 text-2xl font-semibold">{section?.topicCount ?? topics.length}</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                  <div className="text-[11px] uppercase tracking-[0.3em] text-slate-400">Сообщения</div>
                  <div className="mt-2 text-2xl font-semibold">{section?.postCount ?? 0}</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                  <div className="text-[11px] uppercase tracking-[0.3em] text-slate-400">Последний пост</div>
                  <div className="mt-2 text-sm font-semibold text-slate-200">
                    {topics[0]?.lastPostAt ? formatRelativeDate(topics[0].lastPostAt) : "—"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <form
          onSubmit={submit}
          className="card grid gap-3 px-5 py-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
        >
          <div>
            <label className="text-xs uppercase tracking-[0.28em] text-slate-400">
              Новая тема
            </label>
            <input
              className="input mt-2"
              placeholder={isWorkshop ? "Название товара / лота" : "Заголовок обсуждения"}
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              disabled={busy}
            />
          </div>
          <button className="btn btn-primary flex items-center gap-2 justify-center" disabled={busy}>
            <Plus size={16} /> {isWorkshop ? "Добавить товар" : "Создать тему"}
          </button>
        </form>

        <div className="card overflow-hidden">
          <div className="flex flex-col gap-4 border-b border-white/10 px-5 py-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-[0.32em] text-[color:var(--text-2)]">
                Темы раздела
              </div>
              <div className="text-xs text-slate-400">
                Всего обсуждений: {filteredTopics.length} • выберите интересующую тему, чтобы перейти к сообщениям.
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <label className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  className="input w-[220px] pl-9"
                  placeholder="Поиск по темам"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </label>
              <div className="flex overflow-hidden rounded-xl border border-white/10">
                <button
                  type="button"
                  onClick={() => setSort("latest")}
                  className={`px-3 py-2 text-xs font-semibold uppercase tracking-[0.28em] transition ${
                    sort === "latest" ? "bg-white/10 text-white" : "text-slate-400"
                  }`}
                >
                  Новые
                </button>
                <button
                  type="button"
                  onClick={() => setSort("popular")}
                  className={`px-3 py-2 text-xs font-semibold uppercase tracking-[0.28em] transition ${
                    sort === "popular" ? "bg-white/10 text-white" : "text-slate-400"
                  }`}
                >
                  Популярные
                </button>
              </div>
            </div>
          </div>
          <div className="hidden border-b border-white/10 px-5 py-3 text-[11px] uppercase tracking-[0.28em] text-slate-400 md:grid md:grid-cols-[minmax(0,1fr)_120px_120px_220px]">
            <span>Тема</span>
            <span className="text-right">Ответы</span>
            <span className="text-right">Просмотры</span>
            <span className="text-right">Последний ответ</span>
          </div>
          {filteredTopics.length ? (
            filteredTopics.map((topic) => (
              <Link
                key={topic.id}
                to={`/forum/topic/${topic.id}`}
                className="flex flex-col gap-3 border-b border-white/5 px-5 py-4 transition hover:bg-white/5 last:border-none md:grid md:grid-cols-[minmax(0,1fr)_120px_120px_220px] md:items-center"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-white">
                    {topic.pinned && (
                      <span className="flex items-center gap-1 rounded-full bg-amber-400/10 px-2 py-0.5 text-[11px] uppercase tracking-[0.26em] text-amber-200">
                        <MessageSquare size={12} /> Закреплено
                      </span>
                    )}
                    {topic.locked && (
                      <span className="flex items-center gap-1 rounded-full bg-rose-400/10 px-2 py-0.5 text-[11px] uppercase tracking-[0.26em] text-rose-200">
                        <Lock size={12} /> Закрыто
                      </span>
                    )}
                    <span className="text-base font-semibold leading-tight text-white">
                      {topic.title}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-slate-400">
                    Обновлено {formatRelativeDate(topic.lastPostAt || topic.updatedAt || topic.createdAt)} • Просмотров {topic.viewCount ?? 0}
                  </div>
                </div>
                <div className="text-sm font-semibold text-slate-200 md:text-right">{topic.replyCount ?? 0}</div>
                <div className="text-sm font-semibold text-slate-200 md:text-right">{topic.viewCount ?? 0}</div>
                <div className="text-left text-xs text-slate-400 md:text-right">
                  <div className="font-semibold text-slate-200">{topic.lastPostBy || "—"}</div>
                  <div className="flex items-center gap-1 md:justify-end">
                    <Clock size={12} /> {formatRelativeDate(topic.lastPostAt || topic.updatedAt || topic.createdAt)}
                  </div>
                  <div className="text-[11px] uppercase tracking-[0.26em] text-slate-500">
                    {formatDateTime(topic.lastPostAt || topic.updatedAt || topic.createdAt)}
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="px-5 py-6 text-sm text-slate-400">
              Темы не найдены. Попробуйте изменить фильтр или создайте первую тему.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
