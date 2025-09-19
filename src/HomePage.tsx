import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles, Users, ShieldCheck, CalendarCheck,
  ArrowRight, MessageSquare, Newspaper, Star, BadgeCheck
} from 'lucide-react';
import SimpleChat from './components/SimpleChat';

const FEATURES = [
  { icon: <ShieldCheck className="w-5 h-5" />, title: 'Безопасность', text: 'Все данные передаются по HTTPS. Админ — только по секретной ссылке.' },
  { icon: <Users className="w-5 h-5" />, title: 'Комьюнити', text: 'Общий чат с рандомными никами — без регистрации.' },
  { icon: <CalendarCheck className="w-5 h-5" />, title: 'Обновления', text: 'Лента уведомлений из Telegram (KV хранит последние 100).' },
  { icon: <MessageSquare className="w-5 h-5" />, title: 'Модерация', text: 'Админ может редактировать и удалять сообщения.' },
];

const QUICK_LINKS = [
  { to: '/faq', label: 'FAQ', icon: <Star className="w-4 h-4" /> },
  { to: '/rules', label: 'Правила', icon: <BadgeCheck className="w-4 h-4" /> },
  { to: '/news', label: 'Новости', icon: <Newspaper className="w-4 h-4" /> },
];

export default function HomePage() {
  // Хуки — только на верхнем уровне
  const heroRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    document.title = 'Правительство — Памятка (SKY)';
  }, []);

  return (
    <main className="min-h-screen bg-[#0a0b0d] text-white">
      {/* HERO */}
      <section ref={heroRef} className="mx-auto max-w-6xl px-4 pt-10 pb-6">
        <div className="flex items-center gap-3 text-sm text-white/60">
          <Sparkles className="w-4 h-4" />
          <span>beta</span>
        </div>

        <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">
          Портал проекта <span className="text-sky-400">SKY</span>
        </h1>

        <p className="mt-2 text-white/70 max-w-2xl">
          Добро пожаловать! Здесь быстрые ссылки, чат и полезные разделы для команды.
        </p>

        {/* Быстрые ссылки */}
        <div className="mt-5 flex flex-wrap gap-2">
          {QUICK_LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to} // НЕ a href="home"!
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10 transition"
            >
              {l.icon}
              {l.label}
              <ArrowRight className="w-3.5 h-3.5 opacity-70" />
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-6xl px-4 pb-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur hover:border-white/20 transition"
            >
              <div className="mb-2 inline-flex rounded-lg bg-white/10 p-2">{f.icon}</div>
              <div className="font-semibold">{f.title}</div>
              <div className="mt-1 text-sm text-white/70">{f.text}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CHAT */}
      <section className="mx-auto max-w-6xl px-4 pb-10">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="mb-3 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-sky-300" />
            <h2 className="text-lg font-semibold">Командный чат</h2>
          </div>
          <SimpleChat room="global" className="bg-transparent border-0 p-0" />
        </div>
      </section>
    </main>
  );
}
