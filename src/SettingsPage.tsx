import React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import ContextText from './ContextText';

export default function SettingsPage() {
  const [telemetryDisabled, setTelemetryDisabled] = React.useState<boolean>(() => {
    try { return localStorage.getItem('telemetry_disabled') === '1'; } catch { return false; }
  });

  const [contextText, setContextText] = React.useState<string>(() => {
    try { return localStorage.getItem('context_text') || ''; } catch { return ''; }
  });

  function onTelemetryToggle() {
    const next = !telemetryDisabled;
    setTelemetryDisabled(next);
    try {
      if (next) localStorage.setItem('telemetry_disabled', '1');
      else localStorage.removeItem('telemetry_disabled');
    } catch {}
  }

  function onContextTextChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setContextText(val);
    try {
      if (val) localStorage.setItem('context_text', val);
      else localStorage.removeItem('context_text');
    } catch {}
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 via-zinc-100 to-zinc-200 text-zinc-900 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-950 dark:text-zinc-100">
      <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/70">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
          <Link to="/" className="text-sm underline decoration-dotted hover:no-underline">На главную</Link>
          <div className="flex flex-col items-center">
            <h1 className="text-lg font-bold">Настройки</h1>
            <ContextText />
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6">
        <div className="grid gap-4">
          <section className="card">
            <h2 className="mb-2 text-base font-semibold">Приватность</h2>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" className="h-4 w-4" checked={telemetryDisabled} onChange={onTelemetryToggle} />
              <span>Отключить телеметрию (анонимальные события и голоса)</span>
            </label>
            <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">
              Учитываем Do-Not-Track браузера. Данные не содержат PII и отправляются на ваш бекенд.
            </p>
          </section>

          <section className="card">
            <h2 className="mb-2 text-base font-semibold">Тема</h2>
            <div className="text-sm">Переключите тему интерфейса:</div>
            <div className="mt-2"><ThemeToggle /></div>
          </section>

          <section className="card">
            <h2 className="mb-2 text-base font-semibold">Контекстный текст</h2>
            <input
              type="text"
              value={contextText}
              onChange={onContextTextChange}
              className="input"
              placeholder="Введите текст подписи"
            />
            <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">
              Отображается рядом с названием сайта.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}

