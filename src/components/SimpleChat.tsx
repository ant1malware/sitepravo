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
  | { type: 'system'; text: string; name?: string; count?: number; names?: string[] };

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

function escapeRegex(input: string) {
  return input.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
}

function makeMentionPattern(name: string | null | undefined): string | null {
  if (!name) return null;
  const trimmed = name.trim();
  if (!trimmed) return null;
  const escaped = escapeRegex(trimmed);
  const flexible = escaped.replace(/\s+/g, '\\s+');
  return `@${flexible}(?=\\b|$)`;
}

function hasMention(text: string, pattern: string | null): boolean {
  if (!pattern) return false;
  try {
    return new RegExp(pattern, 'iu').test(text);
  } catch {
    return false;
  }
}

function highlightMentions(text: string, pattern: string | null): React.ReactNode {
  if (!pattern) return text;
  try {
    const re = new RegExp(pattern, 'giu');
    const out: React.ReactNode[] = [];
    let last = 0;
    let idx = 0;
    let match: RegExpExecArray | null;
    while ((match = re.exec(text)) !== null) {
      if (match.index > last) {
        out.push(<React.Fragment key={`text-${idx++}`}>{text.slice(last, match.index)}</React.Fragment>);
      }
      out.push(
        <span key={`mention-${idx++}`} className="rc-ping">
          {match[0]}
        </span>
      );
      last = re.lastIndex;
    }
    if (last < text.length) {
      out.push(<React.Fragment key={`text-${idx++}`}>{text.slice(last)}</React.Fragment>);
    }
    return out.length ? out : text;
  } catch {
    return text;
  }
}

const CHAT_CSS = String.raw`
.rc-wrap{border:1px solid var(--border);background:var(--surface);border-radius:var(--radius-2xl);overflow:hidden;font:13px/1.4 Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;box-shadow:var(--card-shadow);color:var(--text-1);}
.rc-head{padding:12px 16px;background:var(--bg-2);border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;gap:16px;position:relative;}
.rc-head-title{font-weight:600;font-size:14px;letter-spacing:.08em;text-transform:uppercase;}
.rc-head-meta{display:flex;align-items:center;gap:12px;}
.rc-presence,.rc-presence-btn{display:flex;align-items:center;gap:8px;font-size:12px;letter-spacing:.04em;}
.rc-presence{color:var(--text-2);}
.rc-presence-dot{width:10px;height:10px;border-radius:999px;background:#ef4444;box-shadow:0 0 8px rgba(239,68,68,.3);transition:all .25s ease;}
.rc-presence-dot.on{background:#22c55e;box-shadow:0 0 8px rgba(34,197,94,.35);}
.rc-presence-count{display:flex;align-items:baseline;gap:4px;font-weight:600;color:var(--text-1);}
.rc-presence-count span{font-size:11px;font-weight:500;color:var(--text-2);text-transform:uppercase;}
.rc-presence-btn{border:1px solid var(--border);border-radius:999px;padding:6px 12px;background:var(--surface-2);color:var(--text-1);cursor:pointer;transition:background .2s ease,border-color .2s ease,box-shadow .2s ease,color .2s ease;}
.rc-presence-btn:hover,.rc-presence-btn:focus-visible{background:var(--surface);border-color:var(--accent);color:var(--accent);box-shadow:0 0 0 2px rgba(59,130,246,.2);outline:none;}
.rc-presence-btn.open{background:var(--surface);border-color:var(--accent);color:var(--accent);box-shadow:0 0 0 2px rgba(59,130,246,.2);}
.rc-role-pill{display:inline-flex;align-items:center;gap:6px;padding:4px 10px;border-radius:999px;font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;background:var(--surface-2);color:var(--accent);border:1px solid var(--accent);}
.rc-presence-panel{position:absolute;top:calc(100% + 12px);right:0;width:min(260px,80vw);background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-2xl);padding:14px 16px;box-shadow:var(--card-shadow);z-index:40;}
.rc-presence-title{font-size:12px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--text-2);}
.rc-presence-panel ul{margin:10px 0 0 0;padding:0;list-style:none;max-height:220px;overflow:auto;}
.rc-presence-panel li{display:flex;align-items:center;gap:8px;padding:6px 0;font-size:12px;border-top:1px solid var(--border);}
.rc-presence-panel li:first-child{border-top:none;padding-top:0;}
.rc-presence-panel li:last-child{padding-bottom:0;}
.rc-presence-panel li.self{color:var(--accent);font-weight:600;}
.rc-presence-dot-sm{width:7px;height:7px;border-radius:999px;background:#22c55e;box-shadow:0 0 6px rgba(34,197,94,.35);}
.rc-presence-you{margin-left:auto;font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:var(--text-2);}
.rc-presence-empty{font-size:12px;color:var(--text-2);margin-top:8px;}
.rc-list{height:280px;overflow:auto;background:var(--surface);border-top:1px solid var(--border);border-bottom:1px solid var(--border);}
.rc-list ul{list-style:none;margin:0;padding:0;}
.rc-list li{padding:6px 12px;white-space:pre-wrap;word-break:break-word;display:flex;flex-wrap:wrap;align-items:flex-start;gap:4px;}
.rc-list li+li{border-top:1px solid var(--border);}
.rc-list li.rc-mention{background:var(--surface-2);box-shadow:inset 0 0 0 1px var(--accent);border-left:3px solid var(--accent);}
.rc-ping{display:inline-block;background:var(--accent);color:#fff;border-radius:6px;padding:0 4px;margin:0 1px;font-weight:700;letter-spacing:.02em;}
.rc-ts{color:var(--text-2);margin-right:6px;}
.rc-me{color:#16a34a;font-weight:600;}
.rc-other{color:var(--text-1);font-weight:600;}
.rc-admin{color:var(--accent);font-weight:700;}
.rc-actions{display:flex;gap:4px;margin-left:auto;}
.rc-ax{font-size:11px;background:var(--surface-2);border:1px solid var(--border);color:var(--text-1);border-radius:6px;padding:2px 6px;cursor:pointer;}
.rc-ax:hover{background:var(--surface);}
.rc-empty{opacity:.7;padding:12px;color:var(--text-2);}
.rc-form{display:flex;gap:8px;padding:10px 12px;background:var(--bg-2);}
.rc-input{flex:1;background:var(--surface);border:1px solid var(--border);color:var(--text-1);border-radius:var(--radius-lg);padding:8px 10px;}
.rc-input:focus-visible{outline:none;border-color:var(--accent);box-shadow:0 0 0 2px rgba(59,130,246,.25);}
.rc-btn{background:var(--accent);border:none;color:#fff;border-radius:var(--radius-lg);padding:0 18px;font-weight:600;cursor:pointer;transition:opacity .2s ease,transform .2s ease;}
.rc-btn:hover{opacity:.92;}
.rc-btn:active{transform:scale(.98);}
.rc-btn:disabled{opacity:.6;cursor:not-allowed;}
.nick-back{position:fixed;inset:0;background:rgba(15,15,18,.55);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;z-index:1000;padding:16px;}
.nick-card{width:min(92vw,520px);background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-2xl);padding:18px;color:var(--text-1);box-shadow:var(--card-shadow);}
.nick-row{display:flex;gap:8px;margin-top:12px;}
.nick-input{flex:1;background:var(--surface);border:1px solid var(--border);color:var(--text-1);border-radius:var(--radius-lg);padding:8px 10px;}
.nick-btn{background:var(--accent);border:1px solid var(--accent-600,var(--accent));color:#fff;border-radius:var(--radius-lg);padding:8px 12px;cursor:pointer;font-weight:600;}
.nick-btn:hover{background:var(--accent-600,var(--accent));}
.nick-pill{display:inline-flex;align-items:center;gap:6px;margin-top:10px;margin-right:8px;background:var(--surface-2);border:1px solid var(--border);border-radius:999px;padding:4px 10px;cursor:pointer;font-size:12px;color:var(--text-2);}
.nick-pill:hover{color:var(--accent);border-color:var(--accent);}
.nick-warn{font-size:12px;color:var(--text-2);margin-top:6px;}

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
  const [onlineCount, setOnlineCount] = React.useState<number>(0);
  const [onlineNames, setOnlineNames] = React.useState<string[]>([]);
  const [presenceOpen, setPresenceOpen] = React.useState(false);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [input, setInput] = React.useState('');
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const wsRef = React.useRef<WebSocket | null>(null);
  const listRef = React.useRef<HTMLDivElement | null>(null);
  const headRef = React.useRef<HTMLDivElement | null>(null);
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
  const selfName = React.useMemo(() => (isAdmin ? 'Admin' : (nick ?? '')), [isAdmin, nick]);
  const trimmedSelfName = React.useMemo(() => selfName.trim(), [selfName]);
  const mentionPattern = React.useMemo(() => makeMentionPattern(trimmedSelfName || null), [trimmedSelfName]);

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
    if (!isAdmin) setPresenceOpen(false);
  }, [isAdmin]);

  React.useEffect(() => {
    if (!connected) {
      setPresenceOpen(false);
      setOnlineNames([]);
    }
  }, [connected]);

  React.useEffect(() => {
    if (!presenceOpen) return;
    const handleClick = (event: MouseEvent) => {
      const head = headRef.current;
      if (head && !head.contains(event.target as Node)) setPresenceOpen(false);
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setPresenceOpen(false);
    };
    window.addEventListener('mousedown', handleClick);
    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('mousedown', handleClick);
      window.removeEventListener('keydown', handleKey);
    };
  }, [presenceOpen]);

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
        setOnlineCount(0);
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

            if (parsed.text === 'presence') {
              const next = Number(parsed.count);
              setOnlineCount(Number.isFinite(next) && next > 0 ? Math.round(next) : 0);
              if (Array.isArray(parsed.names)) {
                const list = parsed.names
                  .map((n) => (typeof n === 'string' ? n.trim() : ''))
                  .filter((n) => n.length > 0);
                setOnlineNames(list);
              } else {
                setOnlineNames([]);
              }
            }

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
        setOnlineCount(0);
        setOnlineNames([]);
        setPresenceOpen(false);
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
        <div ref={headRef} className="rc-head">
          <div className="rc-head-title">Командный чат</div>
          <div className="rc-head-meta">
            {isAdmin ? (
              <button
                type="button"
                className={`rc-presence rc-presence-btn${presenceOpen ? ' open' : ''}`}
                onClick={() => setPresenceOpen((prev) => !prev)}
                aria-expanded={presenceOpen}
                aria-controls="rc-presence-panel"
                aria-label="Кто сейчас в сети"
              >
                <span className={`rc-presence-dot ${connected ? 'on' : ''}`} aria-hidden />
                <span className="rc-presence-count" aria-live="polite">
                  {connected ? Math.max(onlineCount, 0) : 0}
                  <span>в сети</span>
                </span>
              </button>
            ) : (
              <div className="rc-presence" role="status" aria-live="polite">
                <span className={`rc-presence-dot ${connected ? 'on' : ''}`} aria-hidden />
                <span className="rc-presence-count">
                  {connected ? Math.max(onlineCount, 0) : 0}
                  <span>в сети</span>
                </span>
              </div>
            )}
            {isAdmin && <span className="rc-role-pill">ADMIN</span>}
          </div>
          {isAdmin && presenceOpen && (
            <div id="rc-presence-panel" className="rc-presence-panel" role="dialog" aria-label="Список кто в сети">
              <div className="rc-presence-title">Сейчас в сети</div>
              {onlineNames.length ? (
                <ul>
                  {onlineNames.map((name) => (
                    <li key={name} className={name === trimmedSelfName ? 'self' : undefined}>
                      <span className="rc-presence-dot-sm" aria-hidden />
                      <span>{name}</span>
                      {name === trimmedSelfName && <span className="rc-presence-you">вы</span>}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="rc-presence-empty">Никого нет</div>
              )}
            </div>
          )}
        </div>

        <div ref={listRef} className="rc-list">
          {!epochReady ? (
            <div className="rc-empty">Загрузка…</div>
          ) : messages.length === 0 ? (
            <div className="rc-empty">…</div>
          ) : (
            <ul>
              {messages.map((m) => {
                const isSelfAuthor = trimmedSelfName ? m.author.trim() === trimmedSelfName : false;
                const mentionForMe = Boolean(
                  mentionPattern &&
                    trimmedSelfName &&
                    !isSelfAuthor &&
                    hasMention(m.text, mentionPattern)
                );
                const body = mentionForMe ? highlightMentions(m.text, mentionPattern) : m.text;
                return (
                  <li key={m.id} className={mentionForMe ? 'rc-mention' : undefined}>
                    <span className="rc-ts">[{hhmmss(m.ts)}]</span>
                    <span className={nickClass(m.author)}>{m.author}</span>
                    <span>: </span>
                    <span className="rc-msg">{body}</span>
                    {isAdmin && (
                      <span className="rc-actions">
                        <button className="rc-ax" onClick={() => edit(m.id, m.text)}>Ред.</button>
                        <button className="rc-ax" onClick={() => del(m.id)}>Удал.</button>
                      </span>
                    )}
                  </li>
                );
              })}
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
