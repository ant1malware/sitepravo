// src/pages/SettingsPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Users, ShieldCheck, CalendarCheck, ArrowRight, MessageSquare, Newspaper, Star, BadgeCheck } from 'lucide-react';
import SimpleChat from './components/SimpleChat';
import LiquidGlass from './components/LiquidGlass';

export default function SettingsPage() {
  return (
    <main className="relative min-h-dvh w-full overflow-x-hidden text-white">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-slate-950 to-slate-900" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_600px_at_15%_10%,rgba(56,189,248,0.25),transparent_70%),radial-gradient(800px_500px_at_85%_20%,rgba(129,140,248,0.25),transparent_70%),radial-gradient(700px_600px_at_50%_100%,rgba(244,63,94,0.14),transparent_70%)]" />
      </div>

      {/* Top bar */}
      <header className="sticky top-0 z-20 mx-auto w-full max-w-6xl px-4 pt-6 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-[color:var(--card-border,rgba(255,255,255,0.12))] bg-[color:var(--surface,rgba(255,255,255,0.08))] px-4 py-3 backdrop-blur-md">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-sky-500/80 to-indigo-500/80 shadow-lg shadow-sky-500/20">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm uppercase tracking-[0.22em] text-white/70">SKY • PRAVO</div>
                <div className="-mt-0.5 text-lg font-semibold">Центр управления</div>
              </div>
            </div>
            <nav className="hidden items-center gap-2 sm:flex">
              <a className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/80 hover:bg-white/10" href="#news">Новости</a>
              <a className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/80 hover:bg-white/10" href="#chat">Чат</a>
              <a className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/80 hover:bg-white/10" href="#links">Ссылки</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto mt-8 w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/10 p-8 shadow-[0_40px_120px_-60px_rgba(56,189,248,0.45)] backdrop-blur">
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 opacity-40 blur-3xl" aria-hidden />
          <div className="absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-gradient-to-br from-fuchsia-500 to-rose-500 opacity-30 blur-3xl" aria-hidden />
          <LiquidGlass />

          <div className="relative grid gap-8 lg:grid-cols-2 lg:items-center">
            <div className="space-y-5">
              <h1 className="text-4xl font-bold leading-tight sm:text-5xl sm:leading-[1.1]">
                Главная панель <span className="text-sky-300">сообщества</span>
              </h1>
              <p className="max-w-2xl text-white/80 sm:text-lg">
                Новости, цели и чат команды — в одном месте. Неоновый ночной стиль + жидкое стекло под твой сайт.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="#chat" className="group inline-flex items-center gap-2 rounded-2xl border border-sky-400/40 bg-sky-500/20 px-4 py-2 text-sky-100 hover:bg-sky-500/30">
                  {/* MessageSquare from lucide has name MessageSquare, not MessageSquareSquare; keep icon minimal */}
                  Открыть чат
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </a>
                <a href="#links" className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-white/80 hover:bg-white/10">
                  Полезные ссылки
                </a>
              </div>
              <div className="flex flex-wrap gap-3 text-sm text-white/70">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5"><Users className="h-4 w-4"/> Команда</span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5"><ShieldCheck className="h-4 w-4"/> Поддержка</span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5"><CalendarCheck className="h-4 w-4"/> События</span>
              </div>
            </div>
            {/* KPIs */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Участники', value: '142', Icon: Users },
                { label: 'Повышений за нед.', value: '18', Icon: BadgeCheck },
                { label: 'Активные задачи', value: '7', Icon: Star },
                { label: 'События на неделе', value: '5', Icon: CalendarCheck },
              ].map((k) => (
                <div key={k.label} className="rounded-2xl border border-white/10 bg-slate-950/60 p-5 backdrop-blur">
                  <div className="flex items-center justify-between text-white/70">
                    <span className="text-sm">{k.label}</span>
                    <k.Icon className="h-4 w-4" />
                  </div>
                  <div className="mt-2 text-2xl font-semibold">{k.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* News + Chat */}
      <section id="news" className="mx-auto mt-10 w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-5">
          {/* News */}
          <div className="space-y-4 lg:col-span-2">
            <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Новости</h2>
                <Newspaper className="h-5 w-5 text-white/60" />
              </div>
              <ul className="mt-4 space-y-3 text-sm text-white/85">
                <li className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-4">
                  <div className="flex items-center justify-between text-xs uppercase tracking-wide text-white/70">Сегодня • 18:00 <span className="rounded-full border border-emerald-400/50 bg-emerald-400/20 px-2 py-0.5 text-emerald-100">Обновление</span></div>
                  <p className="mt-1">Обновлён регламент по повышению медперсонала. Проверь раздел «Документы».</p>
                </li>
                <li className="rounded-2xl border border-sky-400/30 bg-sky-500/10 p-4">
                  <div className="flex items-center justify-between text-xs uppercase tracking-wide text-white/70">Вчера • 22:15 <span className="rounded-full border border-sky-400/50 bg-sky-400/20 px-2 py-0.5 text-sky-100">Событие</span></div>
                  <p className="mt-1">Совместный рейд завершён успешно. Отдельное спасибо кураторам.</p>
                </li>
                <li className="rounded-2xl border border-amber-400/30 bg-amber-500/10 p-4">
                  <div className="flex items-center justify-between text-xs uppercase tracking-wide text-white/70">На этой неделе <span className="rounded-full border border-amber-400/50 bg-amber-400/20 px-2 py-0.5 text-amber-100">Важно</span></div>
                  <p className="mt-1">Собрать отчёты по отделам до пятницы 20:00.</p>
                </li>
              </ul>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <h3 className="text-lg font-semibold">Ближайшие дела</h3>
              <ul className="mt-3 space-y-2 text-sm text-white/80">
                <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-400"/> Проверить заявки на повышение (до 12:00 завтра)</li>
                <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-sky-400"/> Подготовить план мероприятия на выходные</li>
                <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-rose-400"/> Отправить сводку по отделам</li>
              </ul>
            </div>
          </div>

          {/* Chat */}
          <div id="chat" className="lg:col-span-3">
            <div className="flex items-center justify-between pb-3">
              <h2 className="text-xl font-semibold">Командный чат</h2>
              <span className="text-sm text-white/60">Онлайн: ~</span>
            </div>
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950/60 p-4 shadow-2xl backdrop-blur">
              <SimpleChat room="global" allowAdminEdit className="bg-transparent border-0 p-0" />
              <p className="mt-2 text-xs text-white/60">Чтобы писать как <b>Admin</b>, владелец вводит секретный ключ <code>VITE_CHAT_ADMIN_CODE</code> через кнопку «🔑 Admin».</p>
            </div>
          </div>
        </div>
      </section>

      {/* Links */}
      <section id="links" className="mx-auto mt-10 w-full max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Быстрые ссылки</h2>
            <ArrowRight className="h-5 w-5 text-white/60" />
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: 'Документы', desc: 'Регламенты, уставы, шаблоны', href: '/pravo/docs' },
              { title: 'Повышения', desc: 'Критерии и заявки', href: '/pravo/promotions' },
              { title: 'Состав', desc: 'Роли, отделы, контакты', href: '/pravo/teams' },
              { title: 'Отчёты', desc: 'Еженедельные сводки', href: '/pravo/reports' },
            ].map((x) => (
              <a key={x.title} href={x.href} className="group rounded-2xl border border-white/10 bg-slate-950/60 p-4 backdrop-blur transition hover:border-white/20 hover:bg-slate-900/60">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-base font-medium">{x.title}</div>
                    <div className="text-xs text-white/70">{x.desc}</div>
                  </div>
                  <ArrowRight className="h-4 w-4 translate-x-0 transition-transform group-hover:translate-x-1" />
                </div>
              </a>
            ))}
          </div>
        </div>

        <footer className="mt-8 flex items-center justify-between text-xs text-white/60">
          <div>© {new Date().getFullYear()} SKY • PRAVO</div>
          <a href="#top" className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 hover:bg-white/10">Наверх</a>
        </footer>
      </section>
    </main>
  );
}
