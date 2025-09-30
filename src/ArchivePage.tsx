import React from "react";
import { Link } from "react-router-dom";
import { Archive, DownloadCloud, Clock, FileText } from "lucide-react";

const withBase = (path: string) => {
  const base = (import.meta as any).env?.BASE_URL || import.meta.env.BASE_URL || "/";
  const normalizedBase = base.endsWith("/") ? base.slice(0, -1) : base;
  const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
  return `${normalizedBase}/${normalizedPath}`;
};

const SNAPSHOTS = [
  {
    id: "2024-09",
    title: "Сентябрь 2024",
    description: "Статическая копия финальной версии сайта перед остановкой разработки.",
    size: "447 KB",
    href: withBase("archive/sky-snapshot-2024-09.zip"),
    notes: "Подойдёт, если нужен полный HTML-архив со стилями и изображениями.",
  },
];

export default function ArchivePage() {
  return (
    <main
      className="min-h-screen text-slate-100"
      style={{
        background:
          "radial-gradient(1200px 700px at 15% -10%, rgba(56,189,248,0.18), transparent 65%), radial-gradient(1000px 720px at 90% -6%, rgba(167,139,250,0.14), transparent 70%), linear-gradient(180deg, #04060d 0%, #090b16 100%)",
      }}
    >
      <div className="mx-auto max-w-4xl px-4 py-10 space-y-8">
        <header className="rounded-3xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur shadow-[0_40px_120px_-70px_rgba(15,23,42,0.85)]">
          <div className="flex flex-wrap items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/20 text-cyan-100 shadow-inner shadow-cyan-500/30">
              <Archive className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1 space-y-2">
              <h1 className="text-3xl font-extrabold tracking-tight text-white">Архив версий</h1>
              <p className="text-sm text-zinc-300/85 md:text-base">
                Здесь собраны статические снимки сайта. Их можно скачать и открыть офлайн — все страницы, стили и иллюстрации сохранены.
              </p>
            </div>
          </div>
        </header>

        <section className="grid gap-4">
          {SNAPSHOTS.map((item) => (
            <article
              key={item.id}
              className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur shadow-[0_30px_90px_-60px_rgba(15,23,42,0.85)]"
            >
              <div className="flex flex-wrap items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-white/80">
                  <Clock className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.32em] text-zinc-300/70">
                    <span>Снимок</span>
                    <span className="rounded-full bg-white/10 px-2 py-0.5">{item.title}</span>
                  </div>
                  <h2 className="text-xl font-semibold text-white">{item.description}</h2>
                  <p className="text-sm text-zinc-300/85">{item.notes}</p>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400/80">
                    <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-0.5">
                      <FileText className="h-3.5 w-3.5" /> {item.size}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-0.5">
                      <Archive className="h-3.5 w-3.5" /> ZIP-архив
                    </span>
                  </div>
                </div>
                <a
                  href={item.href}
                  download
                  className="btn btn-primary"
                >
                  <DownloadCloud className="h-4 w-4" /> Скачать
                </a>
              </div>
            </article>
          ))}
        </section>

        <footer className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-zinc-300/80">
          <span>Нужна актуальная версия? Вернитесь на главную или откройте форум.</span>
          <div className="flex flex-wrap items-center gap-2">
            <Link to="/" className="btn">На главную</Link>
            <Link to="/forum" className="btn">Форум</Link>
          </div>
        </footer>
      </div>
    </main>
  );
}
