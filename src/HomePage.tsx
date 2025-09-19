import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Users,
  ShieldCheck,
  CalendarCheck,
  ArrowRight,
  MessageSquare,
  Newspaper,
  Star,
  BadgeCheck,
  Compass,
  Zap,
  ScrollText,
  Command,
} from 'lucide-react';
import SimpleChat from './components/SimpleChat';

type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>;

type Feature = { icon: IconType; title: string; text: string };
const FEATURES: Feature[] = [
  {
    icon: ShieldCheck,
    title: 'Открытый доступ',
    text: 'Все материалы идут через защищённый HTTPS. Админский вход — только по секрету.',
  },
  {
    icon: Users,
    title: 'Живой брифинг',
    text: 'Чат для команды без регистрации: случайные ники, быстрый вход и модерация.',
  },
  {
    icon: CalendarCheck,
    title: 'Всегда в курсе',
    text: 'Лента уведомлений синхронизируется с Telegram и хранит последние 100 событий.',
  },
  {
    icon: MessageSquare,
    title: 'Инструменты админа',
    text: 'Правки и удаление сообщений доступны напрямую из интерфейса.',
  },
];

type QuickLink = { to: string; label: string; icon: IconType; hint?: string };
const QUICK_LINKS: QuickLink[] = [
  { to: '/faq', label: 'FAQ', icon: Star, hint: 'короткие ответы на частые вопросы' },
  { to: '/rules', label: 'Правила', icon: BadgeCheck, hint: 'единый набор ограничений и допусков' },
  { to: '/news', label: 'Новости', icon: Newspaper, hint: 'хронология изменений и апдейтов' },
];

type Highlight = { icon: IconType; title: string; text: string };
const HIGHLIGHTS: Highlight[] = [
  {
    icon: Compass,
    title: 'Навигация в один клик',
    text: 'Структура ролей, законов и гайдов собрана в единое дерево.',
  },
  {
    icon: Zap,
    title: 'Быстрые действия',
    text: 'Командная палитра и избранное ускоряют переход к нужным материалам.',
  },
  {
    icon: ScrollText,
    title: 'Чистая база знаний',
    text: 'Обновления версий и диффы фиксируются прямо на портале.',
  },
];

const WORKFLOW = [
  {
    title: 'Старт дня',
    text: 'Откройте «Новости», чтобы увидеть последние апдейты из Telegram и KV.',
  },
  {
    title: 'Рабочий процесс',
    text: 'Используйте поиск и избранное, чтобы быстро прыгать по ролям и законам.',
  },
  {
    title: 'Синхронизация',
    text: 'Отмечайте важное в чате — команда сразу увидит подсветку и сможет отреагировать.',
  },
];

export default function HomePage() {
  React.useEffect(() => {
    document.title = 'Правительство — Памятка (SKY)';
  }, []);

  const mutedText = React.useMemo<React.CSSProperties>(() => ({ color: 'var(--text-2)' }), []);
  const accentText = React.useMemo<React.CSSProperties>(() => ({ color: 'var(--accent)' }), []);
  const linkSurface = React.useMemo<React.CSSProperties>(
    () => ({ background: 'var(--surface-2)', borderColor: 'var(--border)' }),
    []
  );
  const chipSurface = React.useMemo<React.CSSProperties>(
    () => ({ background: 'var(--surface)', borderColor: 'var(--border)' }),
    []
  );

  return (
    <main
      className="relative min-h-screen pb-16"
      style={{ background: 'var(--bg-1)', color: 'var(--text-1)' }}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, var(--accent) 0%, transparent 65%)', opacity: 0.08 }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(520px 320px at 12% 6%, var(--accent) 0%, transparent 70%)', opacity: 0.16 }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(460px 280px at 82% 0%, var(--accent-600, var(--accent)) 0%, transparent 75%)',
            opacity: 0.12,
          }}
        />
      </div>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 pt-12">
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(240px,0.85fr)]">
          <div className="card relative overflow-hidden !p-8 lg:!p-10" style={{ background: 'var(--bg-2)' }}>
            <div
              className="absolute inset-0 -z-10"
              style={{ background: 'linear-gradient(135deg, var(--accent) 0%, transparent 72%)', opacity: 0.18 }}
            />
            <div
              className="absolute inset-0 -z-20"
              style={{ background: 'radial-gradient(140% 90% at 50% 0%, var(--bg-1) 0%, transparent 70%)', opacity: 0.25 }}
            />
            <div
              className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.4em]"
              style={accentText}
            >
              <Sparkles className="h-4 w-4" aria-hidden />
              <span>SKY PORTAL</span>
            </div>
            <h1 className="mt-6 text-3xl font-semibold leading-tight sm:text-4xl">
              Главная точка входа в рабочую экосистему SKY
            </h1>
            <p className="mt-4 max-w-2xl text-base sm:text-lg" style={mutedText}>
              Быстрые ссылки, база знаний и живой чат в едином пространстве. Всё синхронизировано и доступно из
              любого устройства.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {QUICK_LINKS.map(({ to, label, icon: Icon, hint }) => (
                <Link
                  key={to}
                  to={to}
                  className="group relative flex flex-col gap-1.5 rounded-2xl border px-4 py-3 text-sm no-underline transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                  style={{ ...linkSurface, boxShadow: 'var(--card-shadow)' }}
                >
                  <span className="flex items-center gap-2 font-semibold">
                    <span
                      className="grid h-8 w-8 place-items-center rounded-xl border"
                      style={{ ...chipSurface, color: 'var(--accent)' }}
                    >
                      <Icon className="h-4 w-4" aria-hidden />
                    </span>
                    {label}
                    <ArrowRight
                      className="h-3.5 w-3.5 opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100"
                      aria-hidden
                    />
                  </span>
                  {hint && (
                    <span className="text-xs" style={mutedText}>
                      {hint}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="card !p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.35em]" style={mutedText}>
                    Сводка
                  </div>
                  <div className="mt-2 text-2xl font-semibold">Рабочий режим</div>
                </div>
                <Command className="h-5 w-5 opacity-60" aria-hidden />
              </div>
              <ul className="mt-5 space-y-4 text-sm">
                {HIGHLIGHTS.map(({ icon: Icon, title, text }) => (
                  <li key={title} className="flex gap-3 rounded-2xl border px-3 py-2" style={linkSurface}>
                    <span
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border"
                      style={{ ...chipSurface, borderColor: 'transparent', color: 'var(--accent)' }}
                    >
                      <Icon className="h-4 w-4" aria-hidden />
                    </span>
                    <div>
                      <div className="font-semibold">{title}</div>
                      <p className="text-xs" style={mutedText}>
                        {text}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card !p-6">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.35em]" style={mutedText}>
                <Sparkles className="h-4 w-4" aria-hidden />
                <span>Совет</span>
              </div>
              <p className="mt-3 text-sm" style={mutedText}>
                Закрепляйте ключевые материалы в избранном и используйте командную палитру (⌘K) — так вы экономите время на
                поиск.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Возможности</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <div key={title} className="card !p-5 transition-transform hover:-translate-y-0.5">
                <div
                  className="mb-3 inline-flex items-center gap-3 rounded-xl border px-3 py-2 text-sm font-semibold"
                  style={linkSurface}
                >
                  <span
                    className="grid h-9 w-9 place-items-center rounded-xl border"
                    style={{ ...chipSurface, borderColor: 'transparent', color: 'var(--accent)' }}
                  >
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  {title}
                </div>
                <p className="text-sm" style={mutedText}>
                  {text}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(240px,0.8fr)]">
          <div className="card !p-6">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.35em]" style={mutedText}>
              <Compass className="h-4 w-4" aria-hidden />
              <span>Рабочий ритм</span>
            </div>
            <h2 className="mt-4 text-2xl font-semibold sm:text-3xl">
              Как использовать портал максимально эффективно
            </h2>
            <ol className="mt-6 space-y-4 text-sm">
              {WORKFLOW.map((step, index) => (
                <li key={step.title} className="relative rounded-2xl border p-4" style={linkSurface}>
                  <span
                    className="absolute -left-3 -top-3 flex h-9 w-9 items-center justify-center rounded-2xl border text-sm font-semibold"
                    style={{ ...chipSurface, borderColor: 'var(--accent)', color: 'var(--accent)' }}
                  >
                    {index + 1}
                  </span>
                  <div className="pl-6">
                    <div className="font-semibold">{step.title}</div>
                    <p className="mt-1 text-xs" style={mutedText}>
                      {step.text}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="flex flex-col gap-4">
            <div className="card !p-6">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.35em]" style={mutedText}>
                <Sparkles className="h-4 w-4" aria-hidden />
                <span>Фокус</span>
              </div>
              <p className="mt-3 text-sm" style={mutedText}>
                Сохраняйте заметки о задачах прямо в чат — команда увидит отметку в реальном времени и сможет подключиться.
              </p>
            </div>
            <div className="card !p-6">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.35em]" style={mutedText}>
                <CalendarCheck className="h-4 w-4" aria-hidden />
                <span>Регламент</span>
              </div>
              <p className="mt-3 text-sm" style={mutedText}>
                Протоколы и роли всегда доступны в актуальных версиях. Смотрите вкладку «Новости», чтобы отслеживать свежие
                обновления и изменения политик.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4 pb-4">
          <div className="card !p-6">
            <div className="mb-4 flex items-center gap-2">
              <MessageSquare className="h-5 w-5" style={accentText} aria-hidden />
              <h2 className="text-lg font-semibold">Команда онлайн</h2>
            </div>
            <SimpleChat room="global" className="bg-transparent" />
          </div>
        </section>
      </div>
    </main>
  );
}

