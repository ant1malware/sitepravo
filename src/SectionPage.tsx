import React from "react";
import { Link, useParams } from "react-router-dom";
import { listSections, listTopics, createTopic } from "./store/forumRemote";
import { ChevronLeft, ShoppingBag, Plus } from "lucide-react";
import ForumSubnav from "./ForumSubnav";

export default function SectionPage() {
  const { id = "" } = useParams();
  const [section, setSection] = React.useState<any | null>(null);
  const [topics, setTopics] = React.useState<any[]>([]);
  const [newTitle, setNewTitle] = React.useState("");
  const [busy, setBusy] = React.useState(false);

  const reload = React.useCallback(async () => {
    try {
      const [sections, t] = await Promise.all([
        listSections(),
        listTopics(id),
      ]);
      setSection(sections.find((s: any) => s.id === id) || null);
      setTopics(Array.isArray(t) ? t : []);
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

  return (
    <main
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(900px 620px at 18% -12%, rgba(59,130,246,0.18), transparent 65%), radial-gradient(1200px 760px at 92% 0%, rgba(236,72,153,0.16), transparent 68%), #0d0d12",
        color: "#f8fafc",
      }}
    >
      <div className="mx-auto max-w-6xl px-4 py-6">
        <ForumSubnav />
        <div className="mb-5 flex items-center gap-3">
          <Link to="/forum" className="btn flex items-center gap-2">
            <ChevronLeft size={16} /> Back
          </Link>
          <div className="text-sm opacity-70">Section</div>
          <div className="font-semibold">{section?.title || "..."}</div>
        </div>

        {isWorkshop && (
          <div className="card mb-4 p-4">
            <div className="mb-2 flex items-center gap-2 font-semibold">
              <ShoppingBag size={16} /> Workshop: Товары
            </div>
            <div className="text-sm opacity-70">
              Выставляйте свои товары и предложения. Каждая тема — отдельный лот.
            </div>
          </div>
        )}

        {/* New topic (listing) */}
        <form onSubmit={submit} className="card mb-4 grid gap-2 p-4 sm:grid-cols-[1fr_auto]">
          <input
            className="input"
            placeholder={isWorkshop ? "Название товара / лота" : "Topic title"}
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            disabled={busy}
          />
          <button className="btn btn-primary flex items-center gap-2" disabled={busy}>
            <Plus size={16} /> {isWorkshop ? "Добавить товар" : "Создать тему"}
          </button>
        </form>

        {/* Topics */}
        <div className="grid gap-3">
          {topics.map((t) => (
            <Link
              key={t.id}
              to={`/forum/topic/${t.id}`}
              className={`card p-4 ${isWorkshop ? "grid grid-cols-[1fr_auto] items-center" : ""}`}
            >
              <div className="min-w-0">
                <div className="font-semibold truncate">{t.title}</div>
                <div className="mt-1 text-xs opacity-70">
                  replies: {t.replyCount} • views: {t.viewCount}
                </div>
              </div>
              {isWorkshop && (
                <div className="text-xs uppercase tracking-[0.28em] text-emerald-300/80">
                  Товар
                </div>
              )}
            </Link>
          ))}
          {!topics.length && (
            <div className="card p-4 text-sm opacity-70">No topics yet.</div>
          )}
        </div>
      </div>
    </main>
  );
}
