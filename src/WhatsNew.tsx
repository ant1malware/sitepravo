import React from 'react';
import { Link } from 'react-router-dom';
import { getWhatsNew } from './versioning';
import { History, ArrowRight, CalendarDays, Tag } from 'lucide-react';

export default function WhatsNew() {
  const items = getWhatsNew();
  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-xl font-bold">
          <History className="h-5 w-5" /> Что нового
        </h1>
        <Link to="/" className="btn">На главную</Link>
      </div>

  <div className="grid gap-4">
        {items.map((it) => (
          <article
            key={`${it.id}-${it.version}`}
            className="card transition hover:shadow-softLg"
          >
            <header className="mb-1 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium">
                  <Tag className="h-3.5 w-3.5" /> {it.id}
                </span>
              </div>
              <Link to={`/diff/${encodeURIComponent(it.id)}`} className="btn">
                Сравнить версии <ArrowRight className="h-4 w-4" />
              </Link>
            </header>

            <p className="text-sm leading-relaxed text-zinc-800 dark:text-zinc-200">
              {it.summary}
            </p>
            {Array.isArray(it.details) && it.details.length > 0 && (
              <ul className="mt-2 ml-4 list-disc text-sm text-zinc-700 dark:text-zinc-300">
                {it.details.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            )}

            <footer className="mt-3 flex items-center gap-3 text-xs text-zinc-500">
              <span className="inline-flex items-center gap-1">
                <Tag className="h-3.5 w-3.5" /> Версия {it.version}
              </span>
              <span className="inline-flex items-center gap-1">
                <CalendarDays className="h-3.5 w-3.5" /> {it.date}
              </span>
            </footer>
          </article>
        ))}

        {!items.length && (
          <div className="card text-sm text-zinc-600 dark:text-zinc-300">
            Пока нет обновлений.
          </div>
        )}
      </div>
    </div>
  );
}
