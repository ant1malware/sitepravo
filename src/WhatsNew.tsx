import React from "react";
import { Sparkles, Lock, KeyRound, CalendarDays } from "lucide-react";

/**
 * Одно лаконичное объявление без лишних разделов и кнопок.
 * – Убраны все старые версии/архивы/истории.
 * – Нет CTA вроде «написать в тг» или «посмотреть архив».
 * – Сообщаем статус: сайт вышел из беты, добавлен форум, он дорабатывается.
 */
export default function WhatsNew() {
  const ANNOUNCED_AT = "08.10.2025"; // дата объявления

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 text-zinc-900 dark:text-zinc-100">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-fuchsia-500/15 via-violet-500/10 to-cyan-500/15 shadow-2xl dark:border-zinc-800/60">
        {/* декоративное мягкое свечение */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-24 blur-3xl opacity-70"
          style={{
            background:
              "radial-gradient(42% 42% at 12% 10%, rgba(255,100,160,.25), transparent 60%), radial-gradient(38% 38% at 88% 22%, rgba(140,120,255,.22), transparent 60%), radial-gradient(36% 36% at 60% 88%, rgba(70,210,255,.18), transparent 60%)",
          }}
        />

        {/* диагональная лента */}
        <div className="absolute right-[-56px] top-6 z-10 rotate-45 bg-black/70 px-10 py-2 text-[10px] tracking-[0.2em] text-white shadow-xl backdrop-blur">
          FORUM
        </div>

        <div className="relative z-10 p-6 md:p-10">
          {/* бейджи */}
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <span className="badge">
              <Sparkles className="h-4 w-4" /> Обновление
            </span>
            <span className="badge">
              <Lock className="h-4 w-4" /> Доступ по инвайтам
            </span>
            <span className="badge">
              <CalendarDays className="h-4 w-4" /> {ANNOUNCED_AT}
            </span>
          </div>

          {/* заголовок */}
          <h1 className="display-hero font-black leading-tight mb-3">
            Сайт вышел из <span className="accent-text">бета‑теста</span>
          </h1>

          {/* основной текст */}
          <div className="text-base md:text-xl leading-relaxed opacity-95">
            <p>
              Сайт перешёл в стабильный режим, а мы добавили новый раздел — <strong>Форум</strong>. Он уже доступен и постепенно улучшается: добавляем функции, шлифуем UX, наводим порядок в разделах.
            </p>
            <p className="mt-3">
              <strong>Лишние разделы удалены</strong> с сайта. Всё необходимое будет
              появляться постепенно — аккуратными итерациями, без спешки и лишнего
              шума. Эта страница остаётся опорной точкой статуса.
            </p>
          </div>

          {/* краткий список фактов без кнопок */}
          <ul className="mt-6 ml-4 list-disc text-sm md:text-base opacity-90 space-y-1">
            <li>Форум добавлен и уже работает, сейчас мы активно его дорабатываем.</li>
            <li>Старые версии и архивные страницы скрыты — начинаем с чистого листа.</li>
            <li>Нужные разделы и инструменты будем добавлять по мере готовности.</li>
          </ul>

          {/* спокойная нижняя подводка без CTA */}
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/60 p-4 text-sm text-zinc-800 dark:border-zinc-800/60 dark:bg-zinc-900/60 dark:text-zinc-200">
            <div className="flex items-center gap-2 font-medium">
              <KeyRound className="h-4 w-4" />
              Пока форум развивается, часть доступа ограничена приглашениями. О расширении доступа сообщим здесь.
            </div>
            <div className="mt-2 pl-6">
              Один временный инвайт-код для одного человека:
              <div className="mt-1 inline-block rounded bg-black/10 px-2 py-1 font-mono text-[12px] tracking-wide dark:bg-white/10">
                DDFP5AHVYZN92KWJ
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
