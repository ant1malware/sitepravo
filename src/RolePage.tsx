import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Printer } from 'lucide-react';
import { iconForRoleName } from './roleIcons';
import { rolesData } from './roles';
import RelatedBlock from './RelatedBlock';
import VoteWidget from './VoteWidget';
import { isRecentlyUpdated } from './versioning';
import { isFavorite, toggleFavorite } from './favorites';

const Card: React.FC<{ title: React.ReactNode; children: React.ReactNode; footer?: React.ReactNode }> = ({ title, children, footer }) => (
  <div className="card shadow-softLg glass">
    <div className="mb-2 flex items-center justify-between">
      <h3 className="text-base font-semibold leading-tight">{title}</h3>
    </div>
    <div className="prose prose-zinc max-w-none text-sm leading-relaxed dark:prose-invert">{children}</div>
    {footer && <div className="mt-3 border-t border-zinc-200 pt-3 text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">{footer}</div>}
  </div>
);

const Source = ({ href, label }: { href: string; label?: string }) => (
  <a href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 underline decoration-dotted hover:no-underline">
    {label || href} <ExternalLink className="h-3.5 w-3.5" />
  </a>
);

const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] font-medium leading-none align-middle">{children}</span>
);

export default function RolePage() {
  const { id } = useParams();
  const role = rolesData.find(r => r.id === id);
  const [fav, setFav] = React.useState<boolean>(() => role ? isFavorite('role', role.id) : false);

  if (!role) {
    return (
      <div className="p-4">
        Роль не найдена.{' '}
        <Link to="/" className="text-blue-600 underline">
          На главную
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 text-zinc-900 dark:from-zinc-900 dark:to-zinc-950 dark:text-zinc-100">
      <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/70">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
          <Link to="/" className="flex items-center gap-1 text-sm hover:underline">
            <ArrowLeft className="h-4 w-4" /> Назад
          </Link>
          <div className="flex items-center gap-2">
            {iconForRoleName(role.role)}
            <h1 className="text-lg font-bold leading-tight">{role.role}</h1>
            <Badge><span className="opacity-70">Зарплата:</span> {role.salary}</Badge>
            {(() => { const v = isRecentlyUpdated(`role:${role.id}`); return v.recent ? <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-[10px] text-yellow-800" title={`Обновлено ${v.date}`}>обновлено</span> : null; })()}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-6">
        <div className="mb-3 flex items-center gap-2">
          <a className="btn" href={`/print?role=${role.id}`}><Printer className="h-4 w-4" /> Export: PDF</a>
          <button
            className="btn"
            onClick={() => { const nowFav = toggleFavorite('role', role.id); setFav(nowFav); try{ (document.activeElement as HTMLElement)?.blur?.(); }catch{}; }}
            aria-label={fav ? 'Удалить из избранного' : 'Добавить в избранное'}
            title={fav ? 'В избранном' : 'В закладки'}
          >
            {fav ? 'В избранном' : 'В закладки'}
          </button>
        </div>
        <Card title="Обязанности" footer={<div>Источник: <Source href={role.source} /></div>}>
          <ul className="ml-4 list-disc">
            {role.duties.map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
          <RelatedBlock itemId={`role:${role.id}`} itemType="role" />
          <VoteWidget cardId={`role:${role.id}`} />
        </Card>
      </main>
    </div>
  );
}
