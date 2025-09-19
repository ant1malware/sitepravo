// src/components/SimpleChat.tsx
// WebSocket чат с рандомными никами и Admin через HttpOnly-cookie.
// Надёжный парсинг WS, оптимистическое добавление сообщений.

import React from 'react';

type ChatMessage = { id: string; author: string; text: string; ts: number };
type ServerEvent =
  | { type: 'history'; messages: ChatMessage[] }
  | { type: 'message'; message: ChatMessage }
  | { type: 'delete'; id: string }
  | { type: 'edit'; id: string; text: string }
  | { type: 'system'; text: string };

type Props = {
  room?: string;
  className?: string;
  /** для совместимости со старой разметкой — НЕ используется */
  allowAdminEdit?: boolean;
};

const MAX_LEN = 800;
const NAME_KEY = 'chat:nick';

const pendingRef = React.useRef<Record<string, string>>({});

/** Пул ников */
const NICKS = [
  'Скай-Страж','Право-Самурай','Пульс-Рейдер','Кибер-Медик','Неон-Тактик',
  'Астрал-Офицер','Фантом-Лечащий','Шифр-Инспектор','Квант-Боец','Пиксель-Волк',
  'Туман-Командор','Искра-Наблюдатель','Нуль-Гравитация','Полярный Пилот',
  'Городской Хирург','Сыворотка-Vibe','Стерильный Ниндзя','Скальпель-Облако',
  'Рентген-Панк','Ватка-Supreme'
] as const;

function pickNick(): string {
  const base = NICKS[Math.floor(Math.random() * NICKS.length)];
  const suffix = Math.floor(Math.random() * 900 + 100);
  return `${base} #${suffix}`;
}

function parseWsData(data: any): ServerEvent | null {
  try {
    if (typeof data === 'string') return JSON.parse(data);
    if (data instanceof ArrayBuffer) return JSON.parse(new TextDecoder().decode(data));
    // Blob (в некоторых браузерах)
    // @ts-ignore
    if (typeof Blob !== 'undefined' && data instanceof Blob) {
      // @ts-ignore
      return null; // мы подпишем отдельный обработчик ниже
    }
    return null;
  } catch {
    return null;
  }
}

export default function SimpleChat({ room = 'global', className }: Props) {
  const wsUrl = (import.meta as any).env?.VITE_CHAT_WS || import.meta.env?.VITE_CHAT_WS;

  const [connected, setConnected] = React.useState(false);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [input, setInput] = React.useState('');
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const wsRef = React.useRef<WebSocket | null>(null);
  const listRef = React.useRef<HTMLDivElement | null>(null);

  // фиксируем ник
  const [nick] = React.useState<string>(() => {
    try {
      const saved = localStorage.getItem(NAME_KEY);
      if (saved) return saved;
      const n = pickNick();
      localStorage.setItem(NAME_KEY, n);
      return n;
    } catch {
      return pickNick();
    }
  });

  // автоскролл вниз
  React.useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length]);

  // подключение WebSocket
  React.useEffect(() => {
    if (!wsUrl) return;
    let stop = false;
    let retry = 0;

    const connect = () => {
      if (stop) return;
      const url = new URL(wsUrl);
      url.searchParams.set('room', room);
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.addEventListener('open', () => {
        setConnected(true);
        retry = 0;
        ws.send(JSON.stringify({ type: 'hello', name: nick }));
      });

      // универсальный onmessage с поддержкой Blob
      ws.addEventListener('message', async (ev) => {
        try {
          let parsed = parseWsData(ev.data);
          if (!parsed) {
            // возможно Blob — попробуем прочитать
            // @ts-ignore
            if (typeof Blob !== 'undefined' && ev.data instanceof Blob) {
              // @ts-ignore
              const txt = await ev.data.text();
              parsed = JSON.parse(txt);
            }
          }
          if (!parsed) return;

          // отладочный трейс — можно выключить
          // console.debug('[chat:event]', parsed);

          if (parsed.type === 'history') {
            setMessages(parsed.messages);
          } else if (parsed.type === 'message') {
            setMessages((arr) =>
              arr.some((m) => m.id === parsed!.message.id) ? arr : [...arr, parsed!.message]
            );
          } else if (parsed.type === 'delete') {
            setMessages((arr) => arr.filter((m) => m.id !== parsed!.id));
          } else if (parsed.type === 'edit') {
            setMessages((arr) => arr.map((m) => (m.id === parsed!.id ? { ...m, text: parsed!.text } : m)));
          } else if (parsed.type === 'system') {
            if (parsed.text === 'admin-ok') setIsAdmin(true);
            if (parsed.text === 'hello-ok') setIsAdmin(false);
          }
        } catch {
          // ignore
        }
      });

      const onClose = () => {
        setConnected(false);
        if (stop) return;
        retry = Math.min(retry + 1, 6);
        setTimeout(connect, 400 * retry);
      };
      ws.addEventListener('close', onClose);
      ws.addEventListener('error', () => ws.close());
    };

    connect();
    return () => {
      stop = true;
      try { wsRef.current?.close(); } catch {}
    };
  }, [wsUrl, room, nick]);

  function send() {
    const text = input.replace(/\s+/g, ' ').trim();
    const ws = wsRef.current;
    if (!text || !ws || ws.readyState !== WebSocket.OPEN) return;

    const cid = `${Date.now()}_${Math.random().toString(36).slice(2)}`; // корреляция
    const tempId = `loc_${cid}`;
    pendingRef.current[cid] = tempId;

    // оптимистично показываем
    setMessages(arr => [...arr, {
      id: tempId,
      author: isAdmin ? 'Admin' : nick,
      text,
      ts: Date.now(),
    }]);

    // отправляем с cid
    ws.send(JSON.stringify({ type: 'message', text: text.slice(0, MAX_LEN), cid }));
    setInput('');
  }

  function del(id: string) {
    const ws = wsRef.current;
    if (!isAdmin || !ws || ws.readyState !== WebSocket.OPEN) return;
    ws.send(JSON.stringify({ type: 'delete', id }));
  }

  function edit(id: string, now: string) {
    const ws = wsRef.current;
    if (!isAdmin || !ws || ws.readyState !== WebSocket.OPEN) return;
    const next = prompt('Изменить сообщение:', now)?.trim();
    if (!next) return;
    ws.send(JSON.stringify({ type: 'edit', id, text: next.slice(0, MAX_LEN) }));
  }

  return (
    <div className={`rounded-2xl border border-[color:var(--card-border,rgba(255,255,255,0.12))] bg-[color:var(--surface,rgba(255,255,255,0.06))] p-3 text-sm backdrop-blur ${className ?? ''}`}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-medium">Общий чат</span>
          <span className={`ml-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] ${connected ? 'bg-emerald-500/15 text-emerald-200 border border-emerald-400/30' : 'bg-rose-500/15 text-rose-200 border border-rose-400/30'}`}>
            {connected ? 'online' : 'offline'}
          </span>
          {isAdmin && <span className="ml-2 rounded-full border border-sky-400/40 bg-sky-500/20 px-2 py-0.5 text-[11px] text-sky-100">Admin</span>}
        </div>
        <div className="text-xs opacity-75">Ваш ник: <b>{nick}</b></div>
      </div>

      {!wsUrl && (
        <div className="mb-2 rounded-md border border-amber-400/30 bg-amber-500/10 p-2 text-xs text-amber-100">
          Не настроен WebSocket (<code>VITE_CHAT_WS</code>).
        </div>
      )}

      <div ref={listRef} className="max-h-80 overflow-auto rounded-lg border border-[color:var(--card-border,rgba(255,255,255,0.12))] bg-white/5 p-2 dark:bg-black/20">
        {messages.length === 0 && <div className="opacity-70">Пока сообщений нет. Напишите первым!</div>}
        <ul className="space-y-1">
          {messages.map((m) => (
            <li key={m.id} className="flex items-start justify-between gap-2">
              <div>
                <div className="text-xs opacity-70">{new Date(m.ts).toLocaleString()} · <b>{m.author}</b></div>
                <div>{m.text}</div>
              </div>
              {isAdmin && (
                <div className="shrink-0 space-x-1">
                  <button className="btn !px-2 !py-0.5" onClick={() => edit(m.id, m.text)}>Ред.</button>
                  <button className="btn !px-2 !py-0.5" onClick={() => del(m.id)}>Удал.</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      <form className="mt-2 flex items-center gap-2" onSubmit={(e) => { e.preventDefault(); send(); }}>
        <input
          className="flex-1 rounded-md border border-[color:var(--card-border,rgba(255,255,255,0.12))] bg-transparent px-2 py-1"
          placeholder="Напишите сообщение…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={MAX_LEN}
          disabled={!connected}
        />
        <button type="submit" className="btn btn-primary disabled:opacity-50" disabled={!connected}>Отправить</button>
      </form>

      {/* убери/замени старую подсказку про ключ и кнопку Admin — теперь админ через скрытый логин */}
      {/* <p className="mt-2 text-xs opacity-60">Админ назначается автоматически после скрытого логина.</p> */}
    </div>
  );
}
