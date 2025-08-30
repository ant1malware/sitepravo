import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { vuDocs } from './vu';
import { ArrowLeft, Shield } from 'lucide-react';

export default function VuPage() {
  const { id } = useParams();
  const doc = vuDocs.find(d => d.id === id);

  if (!doc) {
    return <div className="p-4">Не найдено. <Link to="/" className="text-blue-600 underline">На главную</Link></div>;
  }

  const parsed = useMemo(()=>parseVu(doc.text || ''), [doc?.text]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 text-zinc-900 dark:from-zinc-900 dark:to-zinc-950 dark:text-zinc-100">
      <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/70">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <Link to="/" className="flex items-center gap-1 text-sm hover:underline">
            <ArrowLeft className="h-4 w-4" /> Назад
          </Link>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <h1 className="text-lg font-bold leading-tight">{doc.title}</h1>
          </div>
          <div className="text-xs text-zinc-500">{doc.updated ? `Обновлено: ${doc.updated}` : ''}</div>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl grid-cols-1 gap-5 px-4 py-5 md:grid-cols-[260px,1fr]">
        <aside className="hidden md:block">
          <div className="sticky top-16 rounded-2xl border border-zinc-200 bg-white/70 p-3 text-sm dark:border-zinc-800 dark:bg-zinc-900/50">
            <div className="mb-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400">Оглавление</div>
            {!parsed.toc.length ? (
              <div className="text-xs text-zinc-500">Заголовки не найдены.</div>
            ) : (
              <ul className="space-y-1">
                {parsed.toc.map(h => (
                  <li key={h.id}>
                    <a className="underline decoration-dotted hover:no-underline" href={`#${h.id}`}>{h.text}</a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
        <section>
          <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="vu prose prose-zinc max-w-none text-sm leading-relaxed dark:prose-invert">
              {parsed.nodes}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function slugify(t: string) { return t.toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu,'').trim().replace(/\s+/g,'-').slice(0,80); }

function parseVu(src: string): { nodes: React.ReactNode[]; toc: { id: string; text: string }[] } {
  const lines = src.replace(/\r\n?/g, "\n").split("\n");
  const out: React.ReactNode[] = [];
  const toc: { id: string; text: string }[] = [];
  let key = 0;
  const hRe = /^\s*(Глава|Раздел)\s+(\d+[\.:)]?)\s*(.*)$/i;
  const nRe = /^\s*(\d+(?:\.\d+)+)\.?\s+(.*)$/; // 1.1 / 2.3.4
  const n1Re = /^\s*(\d+)\.\s+(.*)$/; // 1. text

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) { out.push(<div key={key++} className="h-3" />); continue; }
    let m = line.match(hRe);
    if (m) {
      const titleTxt = `${m[1]} ${m[2]}${m[3] ? ' — ' + m[3] : ''}`;
      const id = slugify(titleTxt);
      toc.push({ id, text: titleTxt });
      out.push(<h2 key={key++} id={id}>{titleTxt}</h2>);
      continue;
    }
    m = line.match(nRe) || line.match(n1Re);
    if (m) {
      out.push(
        <p key={key++} className="flex">
          <span className="num">{m[1]}</span>
          <span>{m[2]}</span>
        </p>
      );
      continue;
    }
    out.push(<p key={key++}>{line}</p>);
  }
  return { nodes: out, toc };
}
