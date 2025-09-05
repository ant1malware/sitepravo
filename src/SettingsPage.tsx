import React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { ACCENTS, applyAccent, applyTheme, systemPrefersDark, getStoredAccent, type Accent } from './theme';

export default function SettingsPage() {
  const [accent, setAccent] = React.useState<Accent>(() => getStoredAccent() ?? 'indigo');

  function onAccentSelect(a: Accent) {
    setAccent(a);
    try { applyAccent(a); } catch {}
  }

  function onResetDefaults() {
    // Preserve favorites; clear other keys
    try {
      const keep: Record<string, string> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i) || '';
        if (k.startsWith('fav:') || k.startsWith('fav:item:') || k.startsWith('promo:')) {
          const v = localStorage.getItem(k);
          if (v != null) keep[k] = v;
        }
      }
      localStorage.clear();
      for (const k in keep) localStorage.setItem(k, keep[k]);
    } catch {}
    try {
      const theme = systemPrefersDark() ? 'dark' : 'light';
      applyTheme(theme);
      applyAccent('indigo');
    } catch {}
    setAccent('indigo');
  }

  return (
    <div className="min-h-screen text-zinc-900 dark:text-zinc-100">
      <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/70">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
          <Link to="/" className="text-sm underline decoration-dotted hover:no-underline">На главную</Link>
          <h1 className="text-lg font-bold">Настройки</h1>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6">
        <div className="grid gap-4">
          <section className="card">
            <h2 className="mb-2 text-base font-semibold">Тема</h2>
            <div className="text-sm">Светлая/тёмная/системная:</div>
            <div className="w-9"><ThemeToggle /></div>
          </section>

          <section className="card">
            <h2 className="mb-2 text-base font-semibold">Акцентный цвет</h2>
            <div className="flex flex-wrap gap-2">
              {Object.entries(ACCENTS).map(([id, colors]) => (
                <label key={id} className="cursor-pointer" title={id}>
                  <input
                    type="radio"
                    name="accent"
                    className="sr-only"
                    checked={accent === (id as Accent)}
                    onChange={() => onAccentSelect(id as Accent)}
                    aria-label={`Accent ${id}`}
                  />
                  <span
                    className={`block h-6 w-6 rounded-full border ${accent === id ? 'ring-2 ring-offset-2' : ''}`}
                    style={{ background: (colors as any)[500] }}
                  ></span>
                </label>
              ))}
            </div>
          </section>

          <section className="card">
            <h2 className="mb-2 text-base font-semibold">Сброс</h2>
            <button
              type="button"
              onClick={onResetDefaults}
              className="btn btn-primary"
            >
              Сбросить настройки
            </button>
          </section>
        </div>
      </main>
    </div>
  );
}

