// src/pages/AboutPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Info, BookOpen, Shield, Users, Quote } from 'lucide-react';
import ContextText from './ContextText';

const Card: React.FC<{ title?: React.ReactNode; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <section className="card">
    {title ? (
      <header className="mb-2 flex items-center gap-2">
        <h3 className="text-base font-semibold leading-tight">{title}</h3>
      </header>
    ) : null}
    <div className="prose prose-zinc max-w-none text-[0.95rem] leading-relaxed dark:prose-invert">
      {children}
    </div>
  </section>
);

export default function AboutPage() {
  return (
    <div className="min-h-screen text-zinc-900 dark:text-zinc-100">
      <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/70">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            <h1 className="text-lg font-bold leading-tight">О нас</h1>
          </div>
          <ContextText />
          <Link to="/?tab=roles" className="btn">На главную</Link>
        </div>
      </header>

      <main className="mx-auto grid max-w-4xl grid-cols-1 gap-4 px-4 py-6">
        {/* Кто мы */}
        <Card title={<span className="flex items-center gap-2"><Info className="h-4 w-4" />Кто мы и зачем это нужно</span>}>
          <p>
            Этот сайт — рабочая справка по SKY. Здесь собраны роли, процедуры, взаимодействия и короткие пояснения к правилам с прямыми ссылками на первоисточники. Задача простая: быстро найти ответ и спокойно действовать — без переписок «а где это написано?» и бесконечного перелистывания форума.
          </p>
          <p>
            Автор — <b>Pavel_Bolshoy</b>. Профиль — <i>кодер читов</i>. Такой опыт заставляет смотреть на систему целиком: где рождаются данные, где узкие места, какие инварианты не должны ломаться и как формулировать правила так, чтобы ими реально пользовались каждый день, а не только в отчётах.
          </p>
          <aside className="not-prose mt-3 rounded-xl border border-zinc-200 bg-zinc-50/80 p-4 text-sm dark:border-zinc-800 dark:bg-zinc-900/60">
            <Quote className="mb-2 h-4 w-4 opacity-60" />
            <p className="italic m-0">
              «все, что мне совесть оставит, я бы заел зубами»
            </p>
            <p className="m-0 opacity-70">
              Коротко про подход: берусь только за то, за что готов отвечать, и довожу до рабочего состояния.
            </p>
          </aside>
        </Card>

        {/* Подход и структура */}
        <Card title={<span className="flex items-center gap-2"><BookOpen className="h-4 w-4" />Как устроено и как этим пользоваться</span>}>
          <p>
            Вся структура построена вокруг понятной схемы карточек: <b>смысл → шаги → оговорки → источник → связанное</b>. Одинаковые задачи оформлены одинаково — это экономит время и снижает количество ошибок. Если для ответа нужно больше двух кликов, значит, карточка требует упрощения.
          </p>
          <ul>
            <li><b>Роли и повышение.</b> Требования, чек-листы, частые ошибки и контрольные вопросы.</li>
            <li><b>Процедуры и взаимодействия.</b> Пошаговое «как делать» для штатных и пограничных ситуаций (спор, выезд, конфликт).</li>
            <li><b>Законы и документы.</b> Короткие пояснения и прямые ссылки на профильные ветки форума.</li>
          </ul>
          <p>
            Как пользоваться: откройте нужный раздел, сверьте чек-лист под свою ситуацию, проверьте оговорки и при необходимости перейдите к первоисточнику. Если карточки нет — значит, её ещё не добавили; сообщите по контакту ниже, и она появится в ближайших обновлениях.
          </p>
        </Card>

        {/* Принципы */}
        <Card title={<span className="flex items-center gap-2"><Shield className="h-4 w-4" />Принципы работы</span>}>
          <ul>
            <li><b>Два клика до ответа.</b> Любая лишняя итерация — сигнал к упрощению текста или интерфейса.</li>
            <li><b>Один источник правды.</b> Приоритет у форума Amazing RP (SKY). При расхождениях — пометка в карточке и ссылка на первоисточник.</li>
            <li><b>Минимум магии.</b> Технологии: React + Vite + TypeScript. Меньше зависимостей — меньше сюрпризов в критический момент.</li>
            <li><b>Итеративные обновления.</b> Небольшие правки регулярно. Существенные изменения помечаются «обновлено» и отражаются в «Что нового».</li>
            <li><b>Без «серых схем».</b> Здесь нет обходов и инструкций по «как выкрутиться». Только рабочие правила и проверяемые ссылки.</li>
          </ul>
          <p className="text-xs opacity-70">
            Материалы носят справочный характер. Перед действием сверяйтесь с актуальными регламентами.
          </p>
        </Card>

        {/* Ориентир во взглядах (встроенная цитата) */}
        <Card>
          <p className="m-0">
            Иногда, чтобы система поехала, нужен «неудобный» взгляд. Этот абзац — не мотивация, а напоминание, почему мы держим структуру и аккуратность:
          </p>
          <blockquote className="not-prose mt-3 rounded-xl border border-zinc-200 bg-zinc-50/80 p-4 text-[0.92rem] leading-relaxed italic dark:border-zinc-800 dark:bg-zinc-900/60">
            «Хвала безумцам. Бунтарям. Белым воронам. Неудачникам. Тем, кто всегда некстати и невпопад. Тем, кто видит мир иначе.
            Они не соблюдают правила. Они смеются над устоями. Их можно цитировать, спорить с ними, прославлять или проклинать их.
            Но только игнорировать их — невозможно. Ведь они несут перемены. Они толкают человечество вперед. И пусть кто-то говорит:
            «безумцы», мы говорим: «гении». Ведь лишь безумец верит, что он в состоянии изменить мир, — и потому меняет его.»
            <footer className="mt-2 text-xs not-italic opacity-70">(с) Стив Джобс</footer>
          </blockquote>
        </Card>

        {/* Для кого и контакт */}
        <Card title={<span className="flex items-center gap-2"><Users className="h-4 w-4" />Для кого и как связаться</span>}>
          <p>
            Справка полезна тем, кто хочет меньше спорить о формулировках и быстрее переходить к делу: новичкам — чтобы не теряться в терминах, старшим — чтобы держать единый стандарт действий.
          </p>
          <p className="m-0">
            По делу — Telegram:&nbsp;
            <a
              href="https://t.me/fatality_boy"
              target="_blank"
              rel="noreferrer"
              className="underline decoration-dotted hover:no-underline"
            >
              fatality_boy
            </a>.
          </p>
        </Card>
      </main>
    </div>
  );
}
