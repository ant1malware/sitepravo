import React from 'react';
import { Link } from 'react-router-dom';
import { getWhatsNew } from './versioning';
import {
  History,
  ArrowRight,
  CalendarDays,
  Tag,
  PartyPopper,
  Bug,
  Users,
  Rocket,
  Gamepad2,
  Palette,
  Sparkles,
  MessageSquare,
  Lock,
  KeyRound,
  Clock,
  Power,
  BellOff,
  Archive,
  AlertTriangle,
} from 'lucide-react';

/* =========================
   helpers: theme switch
========================= */

type ThemeName = 'liquid' | 'gradient';

function setTheme(name: ThemeName) {
  try {
    const root = document.documentElement;
    root.classList.remove('theme-liquid', 'theme-gradient');
    if (name === 'liquid') root.classList.add('theme-liquid');
    if (name === 'gradient') root.classList.add('theme-gradient');
    localStorage.setItem('site:theme', name);
  } catch {}
}

function getSavedTheme(): ThemeName | null {
  try {
    const s = localStorage.getItem('site:theme') as ThemeName | null;
    return s ?? null;
  } catch {
    return null;
  }
}

/* =========================
   Presentational bits
========================= */

const ThemeTile: React.FC<{
  name: ThemeName;
  title: string;
  desc: string;
  active: boolean;
  onPick: (n: ThemeName) => void;
}> = ({ name, title, desc, active, onPick }) => {
  const isLiquid = name === 'liquid';
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border transition
                  ${active ? 'border-violet-400/50 ring-2 ring-violet-300/30' : 'border-white/10'}
                  bg-white/70 dark:bg-zinc-900/50`}
    >
      {/* demo preview */}
      <div
        className="h-28 md:h-32 w-full"
        style={
          isLiquid
            ? {
                backdropFilter: 'saturate(140%) blur(10px)',
                background:
                  'radial-gradient(120% 120% at 10% 0%, rgba(138,113,255,.35), transparent 60%), radial-gradient(120% 120% at 90% 30%, rgba(70,200,255,.28), transparent 60%), linear-gradient(180deg, rgba(255,255,255,.35), rgba(255,255,255,.05))',
              }
            : {
                background:
                  'linear-gradient(135deg, #c2bbff 0%, #8ec5ff 34%, #7bd3f7 58%, #ffa9d1 100%)',
              }
        }
      />
      <div className="p-4">
        <div className="mb-1 flex items-center gap-2 font-semibold">
          <Palette className="h-4 w-4" />
          {title}
          {active && <span className="badge !ml-2">Выбрано</span>}
        </div>
        <p className="text-sm opacity-80">{desc}</p>
        <div className="mt-3">
          <button
            className={`btn ${active ? 'btn-primary' : ''}`}
            onClick={() => onPick(name)}
          >
            Применить тему
          </button>
        </div>
      </div>

      <Sparkles
        aria-hidden
        className="absolute right-3 top-3 h-5 w-5 opacity-80"
      />
    </div>
  );
};

export default function WhatsNew() {
  const IS_CLOSED = true;
  const CLOSED_AT = '30.09.2025';

  const baseItems = getWhatsNew();
  const shutdownItem = {
    id: 'project',
    version: 'final',
    date: CLOSED_AT,
    summary:
      'Проект закрыт и переведён в режим чтения. Регистрация, форум и новые публикации отключены. Архив изменений остаётся доступен.',
    details: [
      'Форум и инвайты выключены.',
      'Новые релизы/апдейты публиковаться не будут.',
      'Если нужен экспорт данных или вопросы по архиву — оставьте сообщение в разделе «Обратная связь» на форуме.',
    ],
  };

  // Override text to reflect closure details clearly
  const shutdownOverride = {
    id: 'project',
    version: 'final',
    date: CLOSED_AT,
    summary:
      'Проект закрыт и больше не поддерживается. Форум остаётся открытым для всех желающих. Если вы готовы дорабатывать форум — напишите Екатерине. Автор больше не имеет отношения к проекту; на сайте остаётся только одно упоминание его ника.',
    details: [
      'Форум открыт: можно читать и участвовать в обсуждениях.',
      'Разработка и выпуск новых функций остановлены (read‑only для кода).',
      'Если есть желающие продолжить — напишите Екатерине.',
      'Автор проекта вышел из участия; остаётся лишь упоминание ника на сайте.',
    ],
  } as const;

  const items = React.useMemo(
    () => (IS_CLOSED ? [shutdownOverride as any, ...baseItems] : baseItems),
    [IS_CLOSED, baseItems]
  );

  const [currentTheme, setCurrentTheme] = React.useState<ThemeName | null>(
    getSavedTheme()
  );

  React.useEffect(() => {
    if (currentTheme) setTheme(currentTheme);
  }, [currentTheme]);

  function pickTheme(n: ThemeName) {
    setTheme(n);
    setCurrentTheme(n);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 text-zinc-900 dark:text-zinc-100">
      {/* Заголовок страницы */}
      <div className="mb-7 flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-3xl md:text-4xl font-extrabold tracking-tight">
          <History className="h-8 w-8" />
          Что нового
        </h1>
        <Link to="/" className="btn">На главную</Link>
      </div>

      {/* === HERO: PROJECT CLOSED === */}
      {IS_CLOSED && (
        <section className="relative mb-8 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-rose-500/15 via-fuchsia-500/10 to-indigo-500/15 dark:border-zinc-800/60">
          {/* decor glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-24 blur-3xl opacity-70"
            style={{
              background:
                'radial-gradient(40% 40% at 15% 10%, rgba(255,58,88,.25), transparent 60%), radial-gradient(35% 35% at 85% 25%, rgba(138,113,255,.20), transparent 60%), radial-gradient(45% 45% at 60% 80%, rgba(70,210,255,.18), transparent 60%)',
            }}
          />
          {/* ribbon */}
          <div className="absolute right-[-48px] top-6 z-10 rotate-45 bg-black/70 px-10 py-2 text-[10px] tracking-widest text-white shadow-xl backdrop-blur">
            ARCHIVE
          </div>

          <div className="relative z-10 p-6 md:p-8">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="badge">
                <AlertTriangle className="h-4 w-4" />
                Объявление
              </span>
              <span className="badge">
                <Lock className="h-4 w-4" />
                Проект закрыт
              </span>
              <span className="badge">
                <CalendarDays className="h-4 w-4" />
                {CLOSED_AT}
              </span>
              <span className="badge">
                <BellOff className="h-4 w-4" />
                Read-only
              </span>
            </div>

            <h2 className="display-hero font-black leading-tight mb-3">
              Проект <span className="accent-text">закрыт</span>
            </h2>

            <p className="text-base md:text-xl leading-relaxed opacity-90">
              Спасибо всем, кто был с нами. Начиная с этой даты сервис переведён в режим чтения:
              новые публикации, регистрация и форум недоступны. История изменений остаётся открытой в архиве.
            </p>

            <ul className="mt-4 ml-4 list-disc space-y-1 text-sm md:text-base opacity-90">
              <li className="inline-flex items-start gap-2">
                <Power className="mt-0.5 h-4 w-4 shrink-0 opacity-80" />
                Выключены интерактивные разделы (форум, инвайты, новая контент-лента).
              </li>
              <li className="inline-flex items-start gap-2">
                <Archive className="mt-0.5 h-4 w-4 shrink-0 opacity-80" />
                Весь контент сохранён в архиве «История изменений» ниже.
              </li>
              <li className="inline-flex items-start gap-2">
                <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 opacity-80" />
                Связь по вопросам архива и экспорта: раздел «Обратная связь» на форуме.
              </li>
            </ul>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                to="/forum?tab=ideas"
                className="btn btn-primary btn-lg"
              >
                Открыть тему на форуме
              </Link>
              <Link to="/" className="btn btn-lg">
                Открыть архив ниже
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* HERO – новинка: игра + темы (СКРЫТО, когда закрыт) */}
      {!IS_CLOSED && (
        <section className="card hero-card p-6 md:p-8 mb-8 overflow-hidden relative">
          <div
            aria-hidden
            className="hero-spotlight absolute -inset-10 opacity-70 blur-3xl pointer-events-none"
            style={{
              background:
                'radial-gradient(40% 40% at 20% 0%, rgba(130,120,255,.22), transparent 60%), radial-gradient(35% 35% at 80% 20%, rgba(70,210,255,.18), transparent 60%)',
            }}
          />

          <div className="mb-5 flex flex-wrap items-center gap-2">
            <span className="badge">
              <PartyPopper className="h-4 w-4" />
              Игровое обновление
            </span>
            <span className="badge">
              v1.1 <CalendarDays className="h-4 w-4" /> 26.09.2025
            </span>
            <span className="badge">
              <Users className="h-4 w-4" />
              Для всех разделов
            </span>
          </div>

          <h2 className="display-hero font-black leading-tight mb-4">
            На сайте появилась <span className="accent-text">мини-игра «Чебзик»</span>
            <br className="hidden sm:block" />
            и две новые темы: <span className="accent-text">Жидкое стекло</span> и{' '}
            <span className="accent-text">Градиент</span>
          </h2>

          <div className="text-base md:text-xl leading-relaxed space-y-3">
            <p className="inline-flex items-start gap-2">
              <Gamepad2 className="mt-1 h-5 w-5 shrink-0 opacity-80" />
              <span>
                Быстрый «Блик», классическая «Змейка», уровни, монеты, гардероб и уютная комната — прямо в браузере. Всё работает на тёмной теме, со звуками и эффектами.
              </span>
            </p>
            <p className="inline-flex items-start gap-2">
              <Palette className="mt-1 h-5 w-5 shrink-0 opacity-80" />
              <span>
                Оформление теперь на выбор: кристальный эффект <strong>«Жидкое стекло»</strong> или
                сочный <strong>«Градиент»</strong>. Переключается в один клик ниже.
              </span>
            </p>
            <p className="inline-flex items-start gap-2">
              <Bug className="mt-1 h-5 w-5 shrink-0 opacity-80" />
              <span>
                Если что-то ведёт себя странно — напишите. Исправляю постепенно, без гонки.
              </span>
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link to="/buddy" className="btn btn-primary btn-lg">
              Играть <Gamepad2 className="h-5 w-5" />
            </Link>
            <Link
              to="/forum?tab=ideas"
              className="btn btn-lg"
            >
              Сообщить о баге
            </Link>
          </div>

          {/* Превью и переключатель тем */}
          <div className="mt-7 grid gap-3 md:grid-cols-2">
            <ThemeTile
              name="liquid"
              title="Жидкое стекло"
              desc="Полупрозрачные карточки, мягкие блики и стеклянный объём. Визуально лёгкая и современная тема."
              active={currentTheme === 'liquid'}
              onPick={pickTheme}
            />
            <ThemeTile
              name="gradient"
              title="Градиент"
              desc="Живые переливы и яркие переходы. Отлично подчёркивает акценты и разделы."
              active={currentTheme === 'gradient'}
              onPick={pickTheme}
            />
          </div>

          <div
            className="mt-7 rounded-xl border border-zinc-200/70 bg-white/65 p-4 text-sm md:text-base text-zinc-800
                        dark:border-zinc-800/70 dark:bg-zinc-900/55 dark:text-zinc-200"
          >
            <div className="mb-2 flex items-center gap-2 font-semibold">
              <Rocket className="h-4 w-4" />
              Что дальше
            </div>
            <ul className="ml-4 list-disc space-y-1">
              <li>Ещё мини-игры и маленькие сезонные ивенты.</li>
              <li>Расширенный гардероб, палитры и коллекции предметов.</li>
              <li>Больше фоновых тем и тонкая настройка интерфейса.</li>
              <li>Небольшие анимации и улучшения производительности.</li>
            </ul>
          </div>
        </section>
      )}

      {/* Форум — объяснение и инвайты (СКРЫТО, когда закрыт) */}
      {!IS_CLOSED && (
        <section className="card p-6 md:p-8 mb-8">
          <header className="mb-4 flex flex-wrap items-center gap-2">
            <span className="badge">
              <MessageSquare className="h-4 w-4" />
              Форум
            </span>
            <span className="badge">
              <Lock className="h-4 w-4" />
              Закрытый бета-тест
            </span>
            <span className="badge">
              <KeyRound className="h-4 w-4" />
              По инвайтам
            </span>
            <span className="badge">
              <Clock className="h-4 w-4" />
              Открытие скоро
            </span>
          </header>

          <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
            «Что за кнопка <span className="accent-text">Форум</span>?»
          </h3>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3 text-base leading-relaxed">
              <p>
                В шапке сайта вы уже видите кнопку <strong>«Форум»</strong>. Мы часто получаем вопрос —
                куда она ведёт и почему пока серенькая. Отвечаем красиво и честно:
              </p>
              <ul className="ml-4 list-disc">
                <li>
                  <strong>Что это будет:</strong> раздел обсуждений, гайды, баг-репорты, заявки,
                  идеи по развитию и прозрачная дорожная карта.
                </li>
                <li>
                  <strong>Зачем бета:</strong> хотим стартовать без мусора и флуда, с хорошим модераторским
                  опытом и удобными шаблонами тем.
                </li>
                <li>
                  <strong>Статус:</strong> сейчас Форум проходит <em>закрытый бета-тест по инвайтам</em>.
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/60 p-4 text-zinc-800
                            dark:bg-zinc-900/60 dark:text-зinc-200">
              <div className="mb-2 font-semibold">Как попасть сейчас</div>
              <ol className="ml-4 list-decimal space-y-1 text-sm md:text-base">
                <li>Помогаете тестировать сайт или игру — получаете приоритетный инвайт.</li>
                <li>
                  Оставьте заявку на форуме: раздел «Форум» → «Инвайты». Это заметно ускорит приглашение.
                </li>
                <li>После открытого релиза все смогут войти без приглашения.</li>
              </ol>

              <div className="mt-4 flex flex-wrap gap-2">
                <Link to="/forum?tab=ideas" className="btn btn-primary">
                  Запросить инвайт
                </Link>
                {/* декоративная «неактивная» кнопка */}
                <span
                  className="btn opacity-60 pointer-events-none cursor-not-allowed"
                  aria-disabled="true"
                  title="Скоро"
                >
                  Форум (скоро)
                </span>
              </div>

              <p className="mt-3 text-xs opacity-70">
                Примечание: доступ расширяем волнами. Если не ответил сразу — не теряйтесь, очередь живая.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* История изменений (из versioning) */}
      <div className="grid gap-4">
        {items.map((it: any) => (
          <article key={`${it.id}-${it.version}`} className="card transition hover:shadow-softLg">
            <header className="mb-2 flex items-center justify-between">
              <span className="badge">
                <Tag className="h-3.5 w-3.5" />
                {it.id}
              </span>
              <Link to={`/diff/${encodeURIComponent(it.id)}`} className="btn">
                Сравнить версии <ArrowRight className="h-4 w-4" />
              </Link>
            </header>

            <p className="text-sm leading-relaxed text-zinc-800 dark:text-zinc-200">{it.summary}</p>
            {Array.isArray(it.details) && it.details.length > 0 && (
              <ul className="mt-2 ml-4 list-disc text-sm text-zinc-700 dark:text-zinc-300">
                {it.details.map((d: string, i: number) => <li key={i}>{d}</li>)}
              </ul>
            )}

            <footer className="mt-3 flex flex-wrap items-center gap-3 text-xs text-zinc-600 dark:text-zinc-400">
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
          <div className="card text-sm text-zinc-700 dark:text-зinc-300">
            Пока нет записей истории. Но работа идёт.
          </div>
        )}
      </div>

      <footer className="mt-10 text-xs text-zinc-600 dark:text-zinc-400">
        Разработчик: <strong>Павел</strong>. Спасибо всем, кто был частью проекта.
      </footer>
    </div>
  );
}
