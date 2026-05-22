import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { getRecorder } from './recorders';
import { ArrowLeft, ExternalLink } from 'lucide-react';

const Card: React.FC<{ title: React.ReactNode; children: React.ReactNode }>
  = ({ title, children }) => (
  <div className="card">
    <div className="mb-2 flex items-center justify-between">
      <h3 className="text-base font-semibold leading-tight">{title}</h3>
    </div>
    <div className="prose prose-zinc max-w-none text-sm leading-relaxed dark:prose-invert">{children}</div>
  </div>
);

export default function RecorderPage() {
  const { id } = useParams();
  const rec = getRecorder(id || '');

  if (!rec) {
    return (
      <div className="p-4">
        Не найдено.{' '}
        <Link to="/" className="text-blue-600 underline">На главную</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-zinc-900 dark:text-zinc-100">
      <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/70">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
          <Link to="/" className="flex items-center gap-1 text-sm hover:underline">
            <ArrowLeft className="h-4 w-4" /> Назад
          </Link>
          <div className="flex flex-col items-center">
            <h1 className="text-lg font-bold leading-tight">{rec.name}</h1>
            <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{rec.platforms.join(' · ')}</div>
          </div>
          <a className="btn" href={rec.site} target="_blank" rel="noreferrer">
            Открыть сайт <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </header>

      <main className="mx-auto grid max-w-3xl grid-cols-1 gap-4 px-4 py-5">
        {rec.requires && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 shadow-sm dark:border-amber-800/60 dark:bg-amber-900/25 dark:text-amber-200">
            Требования: {rec.requires}
          </div>
        )}

        <Card title="Плюсы">
          <ul className="ml-4 list-disc">
            {rec.pros.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
        </Card>
        <Card title="Минусы">
          <ul className="ml-4 list-disc">
            {rec.cons.map((c, i) => <li key={i}>{c}</li>)}
          </ul>
        </Card>
        {rec.tips && rec.tips.length > 0 && (
          <Card title="Советы по настройке">
            <ul className="ml-4 list-disc">
              {rec.tips.map((t, i) => <li key={i}>{t}</li>)}
            </ul>
          </Card>
        )}
      </main>
    </div>
  );
}

