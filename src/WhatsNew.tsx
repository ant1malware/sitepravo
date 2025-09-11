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
} from 'lucide-react';

export default function WhatsNew() {
  const items = getWhatsNew();

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

      {/* HERO */}
      <section className="card hero-card p-6 md:p-8 mb-8 overflow-hidden relative">
        <div aria-hidden className="hero-spotlight" />
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <span className="badge">
            <PartyPopper className="h-4 w-4" />
            Официальный релиз — вышли из беты
          </span>
          <span className="badge">
            v1.0 <CalendarDays className="h-4 w-4" /> 11.09.2025
          </span>
          <span className="badge">
            <Users className="h-4 w-4" />
            Для всего Правительства
          </span>
        </div>

        <h2 className="display-hero font-black leading-tight mb-4">
          Правительство — <span className="accent-text">Памятка (SKY)</span>
          <br className="hidden sm:block" />
          теперь в проде
        </h2>

        <div className="text-base md:text-xl leading-relaxed space-y-3">
          <p>
            Сайт собран мной с нуля — роли, посты, процедуры, законы, интерфейс.
            Темп был бешеный, и честно: <strong>я выгорел</strong>. Поэтому дальше двигаемся без гонки и ночных заливок —
            в устойчивом ритме, где качество и стабильность важнее скорости.
          </p>
          <p className="inline-flex items-start gap-2">
            <Bug className="mt-1 h-5 w-5 shrink-0 opacity-80" />
            <span>
              <strong>Я здесь один — и разработчик, и тестировщик.</strong> Могу что-то пропустить.
              Если видите баг или шероховатость — напишите, чиню и улучшаю постепенно.
            </span>
          </p>
          <p>
            За эстетику благодарность: <strong>дизайн фонового изображения — Katalia Rose</strong>.
          </p>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <span className="badge">Ключевые фичи релиза: поиск по законам</span>
          <span className="badge">законы</span>
          <span className="badge">новый дизайн</span>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a
            href="https://t.me/pasha_bolshoi"
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary btn-lg"
          >
            Сообщить о баге
          </a>
        </div>

        {/* Что дальше */}
        <div className="mt-7 rounded-xl border border-zinc-200/70 bg-white/65 p-4 text-sm md:text-base text-zinc-800
                        dark:border-zinc-800/70 dark:bg-zinc-900/55 dark:text-zinc-200">
          <div className="mb-2 flex items-center gap-2 font-semibold">
            <Rocket className="h-4 w-4" />
            Что дальше
          </div>
          <ul className="ml-4 list-disc space-y-1">
            <li>Добавить ИИ для разбора РП-ситуаций по законам.</li>
            <li>Полный набор законов и всех внутренних уставов.</li>
            <li>Больше фоновых тем.</li>
            <li>Список руководителей/заместителей департаментов, губернатора и вице-губернаторов.</li>
            <li>Автоподача заявлений в нужные темы на форуме (со скриншотами пользователя).</li>
          </ul>
        </div>
      </section>

      {/* История изменений */}
      <div className="grid gap-4">
        {items.map((it) => (
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
                {it.details.map((d, i) => <li key={i}>{d}</li>)}
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
          <div className="card text-sm text-zinc-700 dark:text-zinc-300">
            Пока нет записей истории. Но работа идёт.
          </div>
        )}
      </div>

      <footer className="mt-10 text-xs text-zinc-600 dark:text-zinc-400">
        Разработчик: <strong>Павел</strong>. Поддержка — в устойчивом ритме; качество важнее скорости.
      </footer>
    </div>
  );
}
