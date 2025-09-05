import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { lawsData } from "./laws";
import { ArrowLeft, BookOpen, Search, ListTree } from "lucide-react";
import { isFavorite, toggleFavoriteMeta } from "./favorites";
import FavStar from "./FavStar";
import ContextText from "./ContextText";

declare global { interface Window { marked: any; DOMPurify: any; } }

function loadScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src; s.async = true; s.onload = () => resolve(); s.onerror = () => reject();
    document.head.appendChild(s);
  });
}
async function ensureLibs() {
  if (!window.marked) await loadScript("https://cdn.jsdelivr.net/npm/marked@12.0.2/marked.min.js");
  if (!window.DOMPurify) await loadScript("https://cdn.jsdelivr.net/npm/dompurify@3.1.6/dist/purify.min.js");
}

function addAnchorsAndToc(html: string) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const headings = Array.from(doc.querySelectorAll("h2, h3, h4"));
  const toc: { id: string; text: string; level: number }[] = [];
  const slugify = (t: string) => t.toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, "").trim().replace(/\s+/g, "-").slice(0, 80);
  headings.forEach((h, i) => {
    const txt = h.textContent || "";
    const id = slugify(txt) || `h-${i + 1}`;
    h.id = id;
    const level = h.tagName === "H2" ? 2 : h.tagName === "H3" ? 3 : 4;
    toc.push({ id, text: txt, level });
    const fav = doc.createElement('button');
    fav.className = 'anchor-fav';
    fav.setAttribute('data-id', id);
    fav.setAttribute('data-title', txt);
    fav.setAttribute('title', 'Добавить в избранное');
    h.appendChild(fav);
  });
  return { html: doc.body.innerHTML, toc };
}

function fixMdSafe(src: string) {
  let s = src.replace(/\r\n?/g, "\n");
  s = s.replace(/^(#{2,6})([^\s#])/gm, "$1 $2");
  s = s.replace(/^\s*(\d+)\)\s+/gm, "$1. ");
  return s;
}

export default function LawPage() {
  const { slug } = useParams();
  const law = lawsData.find(l => l.slug === slug);

  const [html, setHtml] = useState("");
  const [toc, setToc] = useState<{ id: string; text: string; level: number }[]>([]);
  const [q, setQ] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      if (!law) return;
      await ensureLibs();
      const prepared = fixMdSafe(law.content);
      const raw = window.marked.parse(prepared, { gfm: true, breaks: true }) as string;
      const safe = window.DOMPurify.sanitize(raw, { USE_PROFILES: { html: true } });
      const { html: withAnchors, toc } = addAnchorsAndToc(safe);
      setHtml(withAnchors);
      setToc(toc);
    })();
  }, [slug]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.querySelectorAll('.anchor-fav').forEach((btn) => {
      const id = (btn as HTMLElement).getAttribute('data-id') || '';
      const fullId = `${law?.slug || ''}#${id}`;
      if (isFavorite('lawsec', fullId)) (btn as HTMLElement).classList.add('active');
    });
    function onClick(e: MouseEvent) {
      const t = e.target as HTMLElement | null;
      if (t && t.classList.contains('anchor-fav')) {
        e.preventDefault();
        const secId = t.getAttribute('data-id') || '';
        const title = t.getAttribute('data-title') || '';
        if (!law) return;
        const fullId = `${law.slug}#${secId}`;
        const url = `${location.pathname}#${secId}`;
        const now = toggleFavoriteMeta('lawsec', fullId, { title: `${law.title} — ${title}`, url });
        if (now) t.classList.add('active'); else t.classList.remove('active');
      }
    }
    el.addEventListener('click', onClick);
    return () => el.removeEventListener('click', onClick);
  }, [containerRef, html, law?.slug]);

  if (!law) {
    return <div className="p-4">Закон не найден. <Link to="/" className="text-blue-600 underline">Назад</Link></div>;
  }

  const filteredHtml = useMemo(() => {
    if (!q.trim() || !html) return html;
    const reg = new RegExp(`(${q.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&")})`, "gi");
    return html.replace(reg, `<mark>$1</mark>`);
  }, [q, html]);

  const pad = (lvl: number) => (lvl === 2 ? "pl-0" : lvl === 3 ? "pl-3" : "pl-6");

  return (
    <div className="min-h-screen text-zinc-900 dark:text-zinc-100">
      <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/70">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <Link to="/" className="flex items-center gap-1 text-sm hover:underline">
            <ArrowLeft className="h-4 w-4" /> Назад
          </Link>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              <h1 className="text-lg font-bold leading-tight">{law.title}</h1>
            </div>
            <ContextText />
          </div>
          <div className="flex items-center gap-2">
            <FavStar kind="law" id={law.slug} title={law.title} url={`/laws/${law.slug}`} />
            <div className="text-xs text-zinc-500">{law.updated ? `Обновлено: ${law.updated}` : ""}</div>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl grid-cols-1 gap-5 px-4 py-5 md:grid-cols-[260px,1fr]">
        <aside className="hidden md:block">
          <div className="sticky top-16 rounded-2xl border border-zinc-200 bg-white/70 p-3 text-sm dark:border-zinc-800 dark:bg-zinc-900/50">
            <div className="mb-2 flex items-center gap-2 font-semibold">
              <ListTree className="h-4 w-4" /> Содержание
            </div>
            {!toc.length ? (
              <div className="text-xs text-zinc-500">Добавьте подзаголовки (##/###) в Markdown, чтобы появилось оглавление.</div>
            ) : (
              <ul className="space-y-1">
                {toc.map(h => (
                  <li key={h.id} className={pad(h.level)}>
                    <a className="underline decoration-dotted hover:no-underline" href={`#${h.id}`}>{h.text}</a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>

        <section>
          <div className="mb-4 flex items-center gap-2">
            <Search className="h-4 w-4 text-zinc-500" />
            <input
              className="w-full rounded-xl border px-3 py-1.5 text-sm focus:outline-none focus:ring"
              placeholder="Подсветить совпадения в тексте"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>

          <div
            className="law prose prose-zinc max-w-none rounded-2xl border border-zinc-200 bg-white p-4 list-inside dark:prose-invert dark:border-zinc-800 dark:bg-zinc-900"
            ref={containerRef}
            dangerouslySetInnerHTML={{ __html: filteredHtml }}
          />
        </section>
      </main>
    </div>
  );
}

