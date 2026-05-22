import React from 'react';

export default function ClosureNotice() {
  const [open, setOpen] = React.useState<boolean>(() => {
    try {
      return localStorage.getItem('site:closure_notice_v1') !== '1';
    } catch {
      return true;
    }
  });

  React.useEffect(() => {
    if (!open) return;
    // prevent body scroll while notice is open
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-start justify-center p-4">
      {/* soft, non-intrusive backdrop */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" aria-hidden />
      <div className="relative z-10 w-[min(720px,96vw)] rounded-2xl border border-white/10 bg-white/80 p-5 text-zinc-900 shadow-xl dark:border-zinc-800 dark:bg-zinc-900/85 dark:text-zinc-100">
        <div className="mb-2 text-xs uppercase tracking-[0.28em] text-zinc-500 dark:text-zinc-400">Важное объявление</div>
        <h2 className="mb-2 text-2xl font-bold">Проект закрыт</h2>
        <p className="mb-3 text-sm opacity-90">
          Разработка и поддержка проекта прекращены. Форум остаётся открытым для всех желающих: можно читать и участвовать в обсуждениях в рамках действующих правил.
        </p>
        <ul className="mb-4 ml-4 list-disc text-sm opacity-90">
          <li>Если вы готовы продолжить и дорабатывать форум — напишите Екатерине.</li>
          <li>Автор больше не имеет отношения к проекту; на сайте остаётся только одно упоминание его ника.</li>
        </ul>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => { try { localStorage.setItem('site:closure_notice_v1','1'); } catch {}; setOpen(false); }}
          >
            Понятно
          </button>
        </div>
      </div>
    </div>
  );
}

