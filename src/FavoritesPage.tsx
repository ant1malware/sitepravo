// src/FavoritesPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import FavStar from './FavStar';
import {
  listFavorites,
  removeFavorite,
  type FavKind,
  type FavListItem,
} from './favorites';
import { rolesData } from './roles';
import { lawsData } from './laws';

export default function FavoritesPage() {
  // явный тип, чтобы не словить TS7006 в map()
  const [favs, setFavs] = React.useState<FavListItem[]>(() => listFavorites());

  // строим ряды на основе favs (и данных из roles/laws)
  const rows = React.useMemo(() => {
    return favs
      .map((f): { title: string; url: string; kindLabel: string } | null => {
        if (f.kind === 'role') {
          const r = rolesData.find(x => x.id === f.id);
          if (!r) return null;
          return {
            title: f.title ?? r.role,
            url: f.url ?? `/roles/${r.id}`,
            kindLabel: 'Роль',
          };
        }
        if (f.kind === 'law') {
          const l = lawsData.find(x => x.slug === f.id);
          if (!l) return null;
          return {
            title: f.title ?? l.title,
            url: f.url ?? `/laws/${l.slug}`,
            kindLabel: 'Закон',
          };
        }
        if (f.kind === 'lawsec') {
          return {
            title: f.title ?? f.id,
            url: f.url ?? '#',
            kindLabel: 'Раздел закона',
          };
        }
        if (f.kind === 'vu') {
          return {
            title: f.title ?? f.id,
            url: f.url ?? `/vu/${f.id}`,
            kindLabel: 'Документ ВУ',
          };
        }
        return null;
      })
      .filter(Boolean) as { title: string; url: string; kindLabel: string }[];
  }, [favs]);

  // корректное удаление без reload()
  function onRemove(kind: FavKind, id: string) {
    removeFavorite(kind, id);
    setFavs(prev => prev.filter(x => !(x.kind === kind && x.id === id)));
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 text-zinc-900 dark:from-zinc-900 dark:to-zinc-950 dark:text-zinc-100">
      <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/70">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
          <Link to="/" className="text-sm underline decoration-dotted hover:no-underline">На главную</Link>
          <h1 className="text-lg font-bold">Избранное</h1>
          <span />
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6">
        {!rows.length ? (
          <div className="card text-sm text-zinc-600 dark:text-zinc-300">
            Пока пусто. Добавляйте роли и законы в закладки.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {rows.map((r, i) => {
              const f = favs[i]; // индексы синхронизированы с map() выше
              if (!f) return null;
              return (
                <div
                  key={`${f.kind}:${f.id}`}
                  className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-700 dark:bg-zinc-900"
                >
                  <Link to={r.url} className="min-w-0 flex flex-col space-y-0.5">
                    <div className="truncate text-sm font-semibold">{r.title}</div>
                    <div className="text-xs text-zinc-500">{r.kindLabel}</div>
                  </Link>

                  <div className="ml-3 flex items-center space-x-2">
                    <FavStar
                      kind={f.kind}
                      id={f.id}
                      title={r.title}
                      url={r.url}
                      size="sm"
                    />
                    <button
                      className="btn"
                      onClick={() => onRemove(f.kind, f.id)}
                      title="Удалить"
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
