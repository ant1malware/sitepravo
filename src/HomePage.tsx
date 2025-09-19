import React from 'react';
import { Sparkles, Users, ShieldCheck, Send, CalendarCheck } from 'lucide-react';

type ChatMessage = {
  id: number;
  author: string;
  role: 'player' | 'admin';
  text: string;
  timestamp: string;
};

const initialMessages: ChatMessage[] = [
  { id: 1, author: 'Игрок Лана', role: 'player', text: 'Ребят, кто сегодня идёт на тренировку по штурму?', timestamp: '19:21' },
  { id: 2, author: 'Игрок Март', role: 'player', text: 'Я в деле! Предлагаю собраться у штаба за полчаса.', timestamp: '19:23' },
  { id: 3, author: 'admin', role: 'admin', text: 'Подтверждаю, встречаемся у штаба в 20:30. Не забудьте боеприпасы.', timestamp: '19:24' },
  { id: 4, author: 'Игрок Лана', role: 'player', text: 'Принято, админ! Возьму аптечки и дым.', timestamp: '19:25' },
  { id: 5, author: 'Игрок Рэй', role: 'player', text: 'Я подкину транспорт, подгоню броневик.', timestamp: '19:26' },
];

export default function HomePage() {
  const [messages, setMessages] = React.useState<ChatMessage[]>(initialMessages);
  const [draft, setDraft] = React.useState('');
  const chatRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const node = chatRef.current;
    if (!node) return;
    node.scrollTo({ top: node.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    const timestamp = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), author: 'admin', role: 'admin', text, timestamp },
    ]);
    setDraft('');
  }

  return (
    <main className="relative min-h-dvh w-full bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(129,140,248,0.35),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(56,189,248,0.28),transparent_55%)]" aria-hidden />
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 pb-20 pt-24 sm:px-6 lg:px-8 lg:pt-28">
        <section className="rounded-3xl border border-white/10 bg-white/10 p-8 shadow-[0_40px_120px_-60px_rgba(59,130,246,0.65)] backdrop-blur">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                <Sparkles className="h-4 w-4" /> SKY Community
              </span>
              <h1 className="text-4xl font-bold leading-tight sm:text-5xl sm:leading-[1.1]">
                Добро пожаловать в центр управления <span className="text-sky-300">сообществом</span>
              </h1>
              <p className="text-base leading-relaxed text-white/80 sm:text-lg">
                Следите за важными событиями, собирайте отряд и обсуждайте стратегии прямо здесь. Главная страница создана для того,
                чтобы вся команда была на одной волне.
              </p>
              <div className="flex flex-wrap gap-3 text-sm text-white/70">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
                  <Users className="h-4 w-4" /> Совместные миссии
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
                  <ShieldCheck className="h-4 w-4" /> Поддержка состава
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
                  <CalendarCheck className="h-4 w-4" /> Ежедневные мероприятия
                </div>
              </div>
            </div>
            <div className="grid place-items-center">
              <div className="relative aspect-square w-full max-w-[220px]">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-sky-500 via-indigo-500 to-fuchsia-500 opacity-50 blur-3xl" aria-hidden />
                <div className="relative flex h-full w-full items-center justify-center rounded-3xl border border-white/20 bg-slate-950/60 p-6 backdrop-blur">
                  <Sparkles className="h-16 w-16 text-sky-200" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between gap-3 pb-4">
              <h2 className="text-xl font-semibold text-white">Командный чат</h2>
              <span className="text-sm text-white/60">Онлайн: 12 игроков</span>
            </div>
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950/60 shadow-2xl">
              <div ref={chatRef} className="flex h-[420px] flex-col gap-4 overflow-y-auto px-6 py-6">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.role === 'admin' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[80%] rounded-2xl border px-4 py-3 text-sm leading-relaxed shadow-lg backdrop-blur transition ${message.role === 'admin' ? 'border-sky-400/40 bg-gradient-to-br from-sky-500/90 via-sky-600/90 to-indigo-600/90 text-white' : 'border-white/10 bg-white/10 text-white/85'}`}
                    >
                      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide">
                        <span className={message.role === 'admin' ? 'rounded-full border border-white/20 bg-white/20 px-2 py-0.5 text-white' : 'rounded-full border border-white/15 bg-white/10 px-2 py-0.5 text-white/80'}>
                          {message.author}
                        </span>
                        <span className="text-white/60">{message.timestamp}</span>
                      </div>
                      <p className="mt-2 text-[15px] leading-relaxed text-white/95">{message.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSubmit} className="border-t border-white/10 bg-slate-900/60 p-4 backdrop-blur">
                <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm focus-within:border-sky-400/60 focus-within:bg-slate-900/70">
                  <span className="text-xs uppercase tracking-wide text-white/60">admin</span>
                  <input
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder="Напишите сообщение команде..."
                    className="flex-1 bg-transparent text-white placeholder:text-white/40 focus:outline-none"
                    aria-label="Сообщение чата"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:from-sky-400 hover:to-indigo-400 focus:outline-none focus:ring-2 focus:ring-sky-300/70"
                  >
                    Отправить
                    <Send className="h-4 w-4" />
                  </button>
                </label>
              </form>
            </div>
          </div>

          <div className="flex flex-col gap-4 lg:col-span-2">
            <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">
              <h3 className="text-lg font-semibold text-white">Актуальные цели</h3>
              <ul className="mt-4 space-y-3 text-sm text-white/80">
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-sky-400"></span>
                  Подготовить план обороны административного квартала к вечеру.
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-400"></span>
                  Собрать отчёт по повышению бойцов до завтра 12:00.
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-amber-400"></span>
                  Провести брифинг для новых рекрутов и выдать экипировку.
                </li>
              </ul>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <h3 className="text-lg font-semibold text-white">Скорые события</h3>
              <div className="mt-4 space-y-4 text-sm text-white/80">
                <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                  <div className="flex items-center justify-between text-xs uppercase tracking-wide text-white/60">
                    Сегодня • 21:00
                    <span className="rounded-full border border-emerald-400/40 bg-emerald-500/20 px-2 py-0.5 text-emerald-200">PvP</span>
                  </div>
                  <p className="mt-2 text-white">Совместный рейд против конкурирующей команды</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                  <div className="flex items-center justify-between text-xs uppercase tracking-wide text-white/60">
                    Завтра • 18:30
                    <span className="rounded-full border border-sky-400/40 bg-sky-500/20 px-2 py-0.5 text-sky-200">Учения</span>
                  </div>
                  <p className="mt-2 text-white">Тактическая отработка обороны города</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

