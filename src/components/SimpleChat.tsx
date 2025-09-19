// src/components/SimpleChat.tsx
// WebSocket-чат с выбором ника при первом входе и блокировкой смены.
// Ник уникализируется на сервере; поддерживается epoch для массового сброса.
// Исправлено: модалка появляется/не пропадает до подтверждения сервером.

import React from 'react';

type ChatMessage = { id: string; author: string; text: string; ts: number };
type ServerEvent =
  | { type: 'history'; messages: ChatMessage[] }
  | { type: 'message'; message: ChatMessage; cid?: string }
  | { type: 'delete'; id: string }
  | { type: 'edit'; id: string; text: string }
  | { type: 'system'; text: string; name?: string };

type Props = {
  room?: string;
  className?: string;
  allowAdminEdit?: boolean; // не используется
};

const MAX_LEN = 800;

/** Пул ников */
const NICKS = [
  'Скай-Страж','Право-Самурай','Пульс-Рейдер','Кибер-Медик','Неон-Тактик',
  'Астрал-Офицер','Фантом-Лечащий','Шифр-Инспектор','Квант-Боец','Пиксель-Волк',
  'Туман-Командор','Искра-Наблюдатель','Нуль-Гравитация','Полярный Пилот',
  'Городской Хирург','Сыворотка-Vibe','Стерильный Ниндзя','Скальпель-Облако',
  'Рентген-Панк','Ватка-Supreme'
] as const;

function suggestNick(): string {
  const base = NICKS[Math.floor(Math.random() * NICKS.length)];
  const suffix = Math.floor(Math.random() * 900 + 100);
  return `${base} ${suffix}`;
}

function parseWsData(data: any): ServerEvent | null {
  try {
    if (typeof data === 'string') return JSON.parse(data);
    if (data instanceof ArrayBuffer) return JSON.parse(new TextDecoder().decode(data));
    // @ts-ignore
    if (typeof Blob !== 'undefined' && data instanceof Blob) return null;
    return null;
  } catch { return null; }
}

function hhmmss(ts: number) {
  const d = new Date(ts);
  return d.toLocaleTimeString(undefined, { hour12: false });
}

const CHAT_CSS = `
.rc-wrap{border:1px solid #111;background:#111;border-radius:4px;overflow:hidden;font:13px/1.35 system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,'Helvetica Neue',Arial}
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
.nick-back{position:fixed;inset:0;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;z-index:1000}
.nick-card{width:min(92vw,520px);background:#121316;border:1px solid #2a2a2b;border-radius:10px;padding:14px;color:#e5e7eb}
.nick-row{display:flex;gap:8px;margin-top:10px}
.nick-input{flex:1;background:#0f0f10;border:1px solid #2a2a2b;color:#e5e7eb;border-radius:6px;padding:8px}
.nick-btn{background:#243040;border:1px solid #375a7a;color:#d6e8ff;border-radius:6px;padding:8px 12px;cursor:pointer}
.nick-pill{display:inline-block;margin-top:8px;margin-right:6px;background:#222427;border:1px solid #303236;border-radius:999px;padding:4px 10px;cursor:pointer}
.nick-warn{font-size:12px;color:#b3b7bf;opacity:.9;margin-top:6px}
`;

function computeWorkerBase(wsFull: string | undefined): string {
  if (!wsFull) return '';
  try {
    const u = new URL(wsFull);
    u.protocol = u.protocol === 'wss:' ? 'https:' : (u.protocol === 'ws:' ? 'http:' : u.protocol);
    u.pathname = '/';
    u.search = '';
    u.hash = '';
    return u.toString().replace(/\/+$/,'');
  } catch { return ''; }
}

function makeKeys(epoch: number) {
  const suf = `@e${epoch}`;
  return {
    NAME_KEY:  `chat:nick${suf}`,
    NAME_LOCK: `chat:nick:lock${suf}`,
  };
}

export default function SimpleChat({ room = 'global', className }: Props) {
  const wsUrl = (import.meta as any).env?.VITE_CHAT_WS || import.meta.env?.VITE_CHAT_WS;

  // === 1) epoch ===
  const workerBase = React.useMemo(() => computeWorkerBase(wsUrl), [wsUrl]);
  const [epoch, setEpoch] = React.useState<number>(1);
  const [epochReady, setEpochReady] = React.useState<boolean>(false);
  const keys = React.useMemo(() => makeKeys(epoch), [epoch]);

  // === 2) chat state ===
  const [connected, setConnected] = React.useState(false);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [input, setInput] = React.useState('');
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const wsRef = React.useRef<WebSocket | null>(null);
  const listRef = React.useRef<HTMLDivElement | null>(null);
  const pendingRef = React.useRef<Record<string, string>>({});

  // === 3) name state – НЕ читаем из storage до epochReady ===
  const [nick, setNick] = React.useState<string | null>(null);
  const [needNick, setNeedNick] = React.useState<boolean>(true);
  const [nickDraft, setNickDraft] = React.useState<string>(suggestNick());

  const latestStateRef = React.useRef<{ epochReady: boolean; needNick: boolean; nick: string | null }>({
    epochReady,
    needNick,
    nick,
  });
  const keysRef = React.useRef(keys);
  const helloSentRef = React.useRef<string | null>(null);

  // Подтянули epoch — теперь читаем текущие ключи и решаем, нужна ли модалка
  React.useEffect(() => {
    if (!epochReady) return;
    try {
      const storedName = localStorage.getItem(keys.NAME_KEY);
      const locked = localStorage.getItem(keys.NAME_LOCK) === '1';
      if (storedName && locked) {
        setNick(storedName);
        setNeedNick(false);
        setNickDraft(storedName);
      } else if (storedName && !locked) {
        setNick(storedName);
        setNickDraft(storedName);
        setNeedNick(true);
      } else {
        setNick(null);
        setNickDraft(suggestNick());
        setNeedNick(true);
      }
    } catch {
      setNick(null);
      setNickDraft(suggestNick());
      setNeedNick(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [epochReady, keys.NAME_KEY, keys.NAME_LOCK]);

  React.useEffect(() => {
    latestStateRef.current = { epochReady, needNick, nick };
  }, [epochReady, needNick, nick]);

  React.useEffect(() => {
    keysRef.current = keys;
  }, [keys]);

  React.useEffect(() => {
    if (needNick) helloSentRef.current = null;
  }, [needNick]);

  // тянем epoch с воркера один раз
  React.useEffect(() => {
    let aborted = false;
    if (!workerBase) { setEpoch(1); setEpochReady(true); return; }
    (async () => {
      try {
        const r = await fetch(`${workerBase}/nick-epoch`, { credentials: 'include' });
        const e = r.ok ? Number((await r.json().catch(()=>({}))).epoch) || 1 : 1;
        if (!aborted) { setEpoch(e); setEpochReady(true); }
      } catch { if (!aborted) { setEpoch(1); setEpochReady(true); } }
    })();
    return () => { aborted = true; };
  }, [workerBase]);

  // автоскролл вниз при добавлении сообщений
  React.useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length]);

  // WebSocket подключение
  React.useEffect(() => {
    if (!wsUrl) return;
    let stop = false;
    let retry = 0;
    let ws: WebSocket | null = null;

    const connect = () => {
      if (stop) return;
      setConnected(false);
      const url = new URL(wsUrl);
      url.searchParams.set('room', room);
      ws = new WebSocket(url);
      wsRef.current = ws;

      ws.addEventListener('open', () => {
        setConnected(true);
        pendingRef.current = {};
        retry = 0;
        const { epochReady: ready, needNick: need, nick: currentNick } = latestStateRef.current;
        if (ready && currentNick && !need) {
          try {
            ws!.send(JSON.stringify({ type: 'hello', name: currentNick }));
            helloSentRef.current = currentNick;
          } catch {}
        }
      });

      ws.addEventListener('message', async (ev) => {
        try {
          let parsed = parseWsData(ev.data);
          // @ts-ignore
          if (!parsed && typeof Blob !== 'undefined' && ev.data instanceof Blob) {
            // @ts-ignore
            parsed = JSON.parse(await ev.data.text());
          }
          if (!parsed) return;

          if (parsed.type === 'history') {
            setMessages(parsed.messages);
          } else if (parsed.type === 'message') {
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
            else if (parsed.text === 'hello-ok' && !parsed.name) setIsAdmin(false);
            if (parsed.name && (parsed.text === 'hello-ok' || parsed.text === 'admin-ok')) {
              // сервер сообщил окончательное имя
              setNick(parsed.name);
              setNickDraft(parsed.name);
              helloSentRef.current = parsed.name;
              try {
                const { NAME_KEY, NAME_LOCK } = keysRef.current;
                localStorage.setItem(NAME_KEY, parsed.name);
                localStorage.setItem(NAME_LOCK, '1');
              } catch {}
              setNeedNick(false); // закрываем модалку ТОЛЬКО здесь
            }
          }
        } catch { /* ignore */ }
      });

      const onClose = () => {
        if (stop) return;
        setConnected(false);
        retry = Math.min(retry + 1, 6);
        setTimeout(connect, 400 * retry);
      };
      ws.addEventListener('close', onClose);
      ws.addEventListener('error', () => ws?.close());
    };

    connect();
    return () => {
      stop = true;
      try { ws?.close(); } catch {}
      wsRef.current = null;
      helloSentRef.current = null;
    };
  }, [wsUrl, room]);

  React.useEffect(() => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    if (!epochReady || needNick || !nick) return;
    if (helloSentRef.current === nick) return;
    try {
      ws.send(JSON.stringify({ type: 'hello', name: nick }));
      helloSentRef.current = nick;
    } catch {}
  }, [epochReady, needNick, nick]);

  // действия
  function confirmNick() {
    const clean = (nickDraft || '').trim().slice(0, 80);
    const finalName = (clean || suggestNick()).replace(/[^\p{L}\p{N}_ -]+/gu, '');
    setNick(finalName);
    setNickDraft(finalName);
    try { localStorage.setItem(keys.NAME_KEY, finalName); } catch {}

    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      try {
        ws.send(JSON.stringify({ type: 'hello', name: finalName }));
        helloSentRef.current = finalName;
      } catch {}
    }
    // модалку НЕ закрываем — дождёмся system.name от сервера
  }

  function send() {
    const text = input.replace(/\s+/g, ' ').trim();
    const ws = wsRef.current;
    if (!epochReady || !nick || needNick || !text || !ws || ws.readyState !== WebSocket.OPEN) return;

    const cid = `${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const tempId = `loc_${cid}`;
    pendingRef.current[cid] = tempId;

    setMessages((arr) => [...arr, { id: tempId, author: isAdmin ? 'Admin' : nick, text, ts: Date.now() }]);
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

  const nickClass = (author: string) =>
    author === 'Admin' ? 'rc-admin' : (author === nick ? 'rc-me' : 'rc-other');

  // рендер
  return (
    <div className={className ?? ''}>
      <style dangerouslySetInnerHTML={{ __html: CHAT_CSS }} />

      <div className="rc-wrap" aria-busy={!epochReady}>
        <div className="rc-head">
          <div>Chat</div>
          <div>
            <span className={`pill ${connected ? 'rc-pill-online' : ''}`}>
              {connected ? 'online' : (epochReady ? 'offline' : '…')}
            </span>
            {isAdmin && <span className="pill rc-pill-admin" style={{ marginLeft: 6 }}>Admin</span>}
          </div>
        </div>

        <div ref={listRef} className="rc-list">
          {!epochReady ? (
            <div className="rc-empty">Загрузка…</div>
          ) : messages.length === 0 ? (
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
            disabled={!epochReady || !connected || !nick || needNick}
          />
          <button type="submit" className="rc-btn" disabled={!epochReady || !connected || !nick || needNick}>▶</button>
        </form>
      </div>

      {/* Диалог выбора ника при первом входе */}
      {epochReady && needNick && (
        <div className="nick-back" role="dialog" aria-modal="true">
          <div className="nick-card">
            <div style={{fontWeight:700,fontSize:16}}>Выберите ник</div>
            <div className="nick-warn">Ник задаётся один раз. Сменить его потом нельзя.</div>
            <div className="nick-row">
              <input
                className="nick-input"
                value={nickDraft}
                onChange={(e) => setNickDraft(e.target.value)}
                maxLength={80}
                placeholder="Ваш ник…"
                autoFocus
              />
              <button type="button" className="nick-btn" onClick={() => setNickDraft(suggestNick())}>🎲</button>
              <button type="button" className="nick-btn" onClick={confirmNick}>Ок</button>
            </div>
            <div>
              {Array.from({length: 5}).map((_,i)=>(
                <span key={i} className="nick-pill" onClick={()=>setNickDraft(suggestNick())}>🎲 Случайный</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
