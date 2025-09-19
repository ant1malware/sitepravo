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
  Command
} from 'lucide-react';
import SimpleChat from './components/SimpleChat';

const FEATURES = [
  {
    icon: <ShieldCheck className="h-5 w-5 text-sky-300" />,
    title: 'Открытый доступ',
    text: 'Все материалы идут через защищённый HTTPS. Админский вход — только по секрету.',
  },
  {
    icon: <Users className="h-5 w-5 text-emerald-300" />,
    title: 'Живой брифинг',
    text: 'Чат для команды без регистрации: случайные ники, быстрый вход и модерация.',
  },
  {
    icon: <CalendarCheck className="h-5 w-5 text-indigo-300" />,
    title: 'Всегда в курсе',
    text: 'Лента уведомлений синхронизируется с Telegram и хранит последние 100 событий.',
  },
  {
    icon: <MessageSquare className="h-5 w-5 text-rose-300" />,
    title: 'Инструменты админа',
    text: 'Правки и удаление сообщений доступны напрямую из интерфейса.',
  },
];

const QUICK_LINKS = [
  { to: '/faq', label: 'FAQ', icon: <Star className="h-4 w-4" />, hint: 'короткие ответы на частые вопросы' },
  { to: '/rules', label: 'Правила', icon: <BadgeCheck className="h-4 w-4" />, hint: 'единый набор ограничений и допусков' },
  { to: '/news', label: 'Новости', icon: <Newspaper className="h-4 w-4" />, hint: 'хронология изменений и апдейтов' },
];

const HIGHLIGHTS = [
  {
    icon: <Compass className="h-4 w-4 text-sky-300" />,
    title: 'Навигация в один клик',
    text: 'Структура ролей, законов и гайдов собрана в единое дерево.'
  },
  {
    icon: <Zap className="h-4 w-4 text-amber-300" />,
    title: 'Быстрые действия',
    text: 'Командная палитра и избранное ускоряют переход к нужным материалам.'
  },
  {
    icon: <ScrollText className="h-4 w-4 text-emerald-300" />,
    title: 'Чистая база знаний',
    text: 'Обновления версий и диффы фиксируются прямо на портале.'
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
  // Хуки — только на верхнем уровне
  const heroRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    document.title = 'Правительство — Памятка (SKY)';
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute inset-0 bg-[radial-gradient(900px_400px_at_20%_10%,rgba(56,189,248,0.18),transparent_70%),radial-gradient(800px_500px_at_80%_0%,rgba(236,72,153,0.16),transparent_70%),linear-gradient(180deg,rgba(15,23,42,0.9),rgba(2,6,23,0.92))]" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:42px_42px] opacity-[0.08]" />
      </div>

      {/* HERO */}
      <section ref={heroRef} className="relative mx-auto max-w-6xl px-4 pb-12 pt-12 sm:pt-16">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_minmax(240px,0.9fr)]">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_30px_70px_rgba(14,23,42,0.55)] backdrop-blur">
            <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-sky-200/80">
              <Sparkles className="h-4 w-4" />
              <span>SKY PORTAL</span>
            </div>
            <h1 className="mt-6 text-3xl font-semibold leading-tight text-slate-50 sm:text-4xl">
              Главная точка входа в рабочую экосистему SKY
            </h1>
            <p className="mt-4 max-w-2xl text-base text-slate-300/90 sm:text-lg">
              Быстрые ссылки, база знаний и живой чат в едином пространстве. Всё синхронизировано и доступно из любого устройства.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {QUICK_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="group relative flex flex-col gap-2 rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-white/0 p-4 text-sm transition hover:border-sky-300/60 hover:from-white/20"
                >
                  <span className="flex items-center gap-2 font-semibold text-slate-100">
                    {link.icon}
                    {link.label}
                    <ArrowRight className="h-3.5 w-3.5 text-sky-200 opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100" />
                  </span>
                  <span className="text-xs text-slate-300/80">{link.hint}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="relative flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.4em] text-slate-400">Сводка</div>
                <div className="mt-2 text-2xl font-semibold text-slate-50">Рабочий режим</div>
              </div>
              <Command className="h-5 w-5 text-slate-300/70" />
            </div>
            <ul className="space-y-4 text-sm text-slate-300/90">
              {HIGHLIGHTS.map((item) => (
                <li key={item.title} className="flex gap-3 rounded-2xl border border-white/10 bg-white/10 p-3">
                  <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-xl bg-black/40 shadow-inner">
                    {item.icon}
                  </span>
                  <div>
                    <div className="font-semibold text-slate-100">{item.title}</div>
                    <p className="text-xs text-slate-300/80">{item.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="relative mx-auto max-w-6xl px-4 pb-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_20px_50px_rgba(15,23,42,0.35)] transition hover:border-sky-300/50 hover:shadow-[0_25px_60px_rgba(37,99,235,0.35)]"
            >
              <div className="mb-4 inline-flex items-center gap-3 rounded-2xl bg-black/30 px-3 py-2 text-sm font-semibold text-slate-100">
                {feature.icon}
                {feature.title}
              </div>
              <p className="text-sm text-slate-300/90">{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WORKFLOW */}
      <section className="relative mx-auto max-w-6xl px-4 pb-12">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_minmax(260px,1fr)]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_45px_rgba(8,47,73,0.35)] backdrop-blur">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-sky-200/70">
              <Compass className="h-4 w-4" />
              <span>Рабочий ритм</span>
            </div>
            <h2 className="mt-4 text-2xl font-semibold text-slate-50 sm:text-3xl">Как использовать портал максимально эффективно</h2>
            <ol className="mt-6 space-y-5 text-sm text-slate-300/90">
              {WORKFLOW.map((step, index) => (
                <li key={step.title} className="relative rounded-2xl border border-white/10 bg-black/30 p-4">
                  <span className="absolute -left-3 -top-3 flex h-9 w-9 items-center justify-center rounded-2xl border border-sky-300/60 bg-sky-500/20 text-base font-semibold text-sky-100 shadow-[0_10px_25px_rgba(14,165,233,0.35)]">
                    {index + 1}
                  </span>
                  <div className="pl-6">
                    <div className="font-semibold text-slate-100">{step.title}</div>
                    <p className="mt-1 text-xs text-slate-300/80">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="flex flex-col gap-4">
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-sky-500/15 via-transparent to-emerald-500/20 p-6 text-sm text-slate-200 shadow-[0_20px_45px_rgba(30,64,175,0.45)]">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.4em] text-slate-200/80">
                <Sparkles className="h-4 w-4" />
                <span>Совет</span>
              </div>
              <p className="mt-4 text-sm text-slate-100">
                Закрепляйте ключевые материалы в избранном и используйте командную палитру (⌘K) — так вы экономите время на поиск.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-slate-200 shadow-[0_18px_40px_rgba(14,23,42,0.45)]">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
                <CalendarCheck className="h-4 w-4" />
                <span>Регламент</span>
              </div>
              <p className="mt-3 text-sm text-slate-300/90">
                Протоколы и роли всегда доступны в актуальных версиях. Смотрите вкладку «Новости», чтобы отслеживать свежие обновления и изменения политик.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CHAT */}
      <section className="relative mx-auto max-w-6xl px-4 pb-16">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_24px_60px_rgba(12,74,110,0.4)]">
          <div className="mb-4 flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.3em] text-sky-200/70">
            <MessageSquare className="h-5 w-5" />
            <span>Команда онлайн</span>
          </div>
          <SimpleChat room="global" className="bg-transparent" />
        </div>
      </section>
    </main>
  );
}
