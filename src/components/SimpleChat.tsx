// WebSocket-чат с рандомными никами и Admin через HttpOnly-cookie.
// Ретро-вид как на скрине: тёмный список, полосы, строка "[hh:mm:ss] ник: текст".
// Без внешних правок проекта.

import React from 'react';

type ChatMessage = { id: string; author: string; text: string; ts: number };
type ServerEvent =
  | { type: 'history'; messages: ChatMessage[] }
  | { type: 'message'; message: ChatMessage; cid?: string }
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
    // Blob — прочитаем отдельно
    // @ts-ignore
    if (typeof Blob !== 'undefined' && data instanceof Blob) return null;
    return null;
  } catch {
    return null;
  }
}

function hhmmss(ts: number) {
  const d = new Date(ts);
  return d.toLocaleTimeString(undefined, { hour12: false });
}

// локальные стили «как на скрине»
const CHAT_CSS = `
.rc-wrap{border:1px solid #111;background:#111;border-radius:4px;overflow:hidden;font:13px/1.35 system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, 'Helvetica Neue', Arial, "Apple Color Emoji","Segoe UI Emoji";}
.rc-head{padding:6px 8px;color:#c9d1d9;background:#0e0e0f;border-bottom:1px solid #0b0b0b;display:flex;justify-content:space-between;align-items:center}
.rc-head .pill{display:inline-flex;align-items:center;gap:6px;border-radius:10px;padding:2px 8px;font-size:12px}
.rc-pill-online{background:#193a2b;color:#7ee787;border:1px solid #2ea04344}
.rc-pill-admin{background:#1a2438;color:#79c0ff;border:1px solid #79c0ff33}
.rc-list{height:280px;overflow:auto;background:#1a1a1b}
.rc-list ul{list-style:none;margin:0;padding:0}
.rc-list li{padding:3px 8px;white-space:pre-wrap;word-break:break-word}
.rc-list li:nth-child(odd){background:#232324}
.rc-list li:nth-child(even){background:#1e1e1f}
.rc-ts{color:#9da1a6;margin-right:6px}
.rc-me{color:#a3d977;font-weight:600}
.rc-other{color:#e06c75;font-weight:600}
.rc-admin{color:#facc15;font-weight:700}
.rc-form{display:flex;gap:6px;padding:6px;background:#0f0f10;border-top:1px solid #0b0b0b}
.rc-input{flex:1;background:#0f0f10;border:1px solid #2a2a2b;color:#e5e7eb;border-radius:4px;padding:6px 8px}
.rc-btn{background:#2b2b2c;border:1px solid #3a3a3c;color:#e5e7eb;border-radius:4px;padding:6px 10px;cursor:pointer}
.rc-btn:disabled{opacity:.6;cursor:not-allowed}
.rc-actions{display:flex;gap:4px;margin-left:8px}
.rc-ax{font-size:12px;background:#2b2b2c;border:1px solid #3a3a3c;color:#ccc;border-radius:4px;padding:2px 6px;cursor:pointer}
.rc-empty{opacity:.7;padding:6px 8px}
`;

export default function SimpleChat({ room = 'global', className }: Props) {
  const wsUrl = (import.meta as any).env?.VITE_CHAT_WS || import.meta.env?.VITE_CHAT_WS;

  // Хуки — все внутри компонента
  const [connected, setConnected] = React.useState(false);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [input, setInput] = React.useState('');
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const wsRef = React.useRef<WebSocket | null>(null);
  const listRef = React.useRef<HTMLDivElement | null>(null);
  const pendingRef = React.useRef<Record<string, string>>({}); // ← ПРАВИЛЬНО: внутри компонента

  // ник
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

  // автоскролл
  React.useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length]);

  // WS
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

      ws.addEventListener('message', async (ev) => {
        try {
          let parsed = parseWsData(ev.data);
          // Blob?
          // @ts-ignore
          if (!parsed && typeof Blob !== 'undefined' && ev.data instanceof Blob) {
            // @ts-ignore
            parsed = JSON.parse(await ev.data.text());
          }
          if (!parsed) return;

          if (parsed.type === 'history') {
            setMessages(parsed.messages);
          } else if (parsed.type === 'message') {
            // поддержка cid: заменяем локальную «оптимистичную» запись настоящей
            const cid = (parsed as any).cid as string | undefined;
            if (cid && pendingRef.current[cid]) {
              const tempId = pendingRef.current[cid];
              delete pendingRef.current[cid];
              setMessages((arr) => {
                const withoutTemp = arr.filter((m) => m.id !== tempId);
                return withoutTemp.some((m) => m.id === parsed!.message.id)
                  ? withoutTemp
                  : [...withoutTemp, parsed!.message];
              });
            } else {
              setMessages((arr) =>
                arr.some((m) => m.id === parsed!.message.id) ? arr : [...arr, parsed!.message]
              );
            }
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

    const cid = `${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const tempId = `loc_${cid}`;
    pendingRef.current[cid] = tempId;

    // оптимистично добавляем 1 строку, потом заменим на серверную
    setMessages((arr) => [
      ...arr,
      { id: tempId, author: isAdmin ? 'Admin' : nick, text, ts: Date.now() },
    ]);

    ws.send(JSON.stringify({ type: 'message', text: text.slice(0, MAX_LEN), cid }));
    setInput('');
  }

  const del = (id: string) => {
    const ws = wsRef.current;
    if (!isAdmin || !ws || ws.readyState !== WebSocket.OPEN) return;
    ws.send(JSON.stringify({ type: 'delete', id }));
  };

  const edit = (id: string, now: string) => {
    const ws = wsRef.current;
    if (!isAdmin || !ws || ws.readyState !== WebSocket.OPEN) return;
    const next = prompt('Изменить сообщение:', now)?.trim();
    if (!next) return;
    ws.send(JSON.stringify({ type: 'edit', id, text: next.slice(0, MAX_LEN) }));
  };

  // цвета для ника
  const nickClass = (author: string) =>
    author === 'Admin' ? 'rc-admin' : (author === nick ? 'rc-me' : 'rc-other');

  return (
    <div className={className ?? ''}>
      {/* локальные стили компонента */}
      <style dangerouslySetInnerHTML={{ __html: CHAT_CSS }} />

      <div className="rc-wrap">
        <div className="rc-head">
          <div>Chat</div>
          <div>
            <span className={`pill ${connected ? 'rc-pill-online' : ''}`}>
              {connected ? 'online' : 'offline'}
            </span>
            {isAdmin && <span className="pill rc-pill-admin" style={{ marginLeft: 6 }}>Admin</span>}
          </div>
        </div>

        <div ref={listRef} className="rc-list">
          {messages.length === 0 ? (
            <div className="rc-empty">…</div>
          ) : (
            <ul>
              {messages.map((m) => (
                <li key={m.id}>
                  <span className="rc-ts">[{hhmmss(m.ts)}]</span>
                  <span className={nickClass(m.author)}>{m.author}</span>
                  <span>: </span>
                  <span>{m.text}</span>
                  {isAdmin && (
                    <span className="rc-actions">
                      <button className="rc-ax" onClick={() => edit(m.id, m.text)}>Ред.</button>
                      <button className="rc-ax" onClick={() => del(m.id)}>Удал.</button>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        <form className="rc-form" onSubmit={(e) => { e.preventDefault(); send(); }}>
          <input
            className="rc-input"
            placeholder="напишите сообщение…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            maxLength={MAX_LEN}
            disabled={!connected}
          />
          <button type="submit" className="rc-btn" disabled={!connected}>▶</button>
        </form>
      </div>
    </div>
  );
}
