// src/components/SimpleChat.tsx
// WebSocket‑чат с тремя скинами: 'classic' | 'forum' | 'shoutbox'.
// 'shoutbox' повторяет стилистику из скрина: компактные однострочные реплики,
// роль в скобках перед ником, таймстемпы "N minutes ago", нижняя строка ввода.
// Ник выбирается при первом входе, фиксируется через epoch (массовый сброс).
// Исправлено: модалка не закрывается, пока сервер не подтвердит выбранный ник.

import React from 'react';
import { Link } from 'react-router-dom';
import { getSessionAccount as getRemoteSession, getProfileByUsername, type RemoteUser, type RemoteProfile } from '../store/authRemote';
import { getSessionAccount as getLocalSession } from '../store/forumStore';

// ===== Types =====
export type ChatMessage = { id: string; author: string; text: string; ts: number };
export type ServerEvent =
  | { type: 'history'; messages: ChatMessage[] }
  | { type: 'message'; message: ChatMessage; cid?: string }
  | { type: 'delete'; id: string }
  | { type: 'edit'; id: string; text: string }
  | { type: 'system'; text: string; name?: string; count?: number; names?: string[] };

export type Props = {
  room?: string;
  className?: string;
  allowAdminEdit?: boolean; // не используется, оставлено для совместимости
  variant?: 'classic' | 'forum' | 'shoutbox';
  onRosterChange?: (names: string[], count: number) => void;
  resolveRole?: (author: string) => { label: string; color: string; textColor?: string } | null;
};

const MAX_LEN = 800;

// ===== Nickname pool =====
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
    // @ts-ignore
    if (typeof Blob !== 'undefined' && data instanceof Blob) return null;
    return null;
  } catch { return null; }
}

function hhmmss(ts: number) {
  const d = new Date(ts);
  return d.toLocaleTimeString(undefined, { hour12: false });
}

function agoEN(ts: number) {
  const diff = Math.max(0, Date.now() - ts);
  const m = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m} minute${m === 1 ? '' : 's'} ago`;
  if (h < 24) return `${h} hour${h === 1 ? '' : 's'} ago`;
  const d = Math.floor(h / 24);
  return `${d} day${d === 1 ? '' : 's'} ago`;
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
  try { return new RegExp(pattern, 'iu').test(text); } catch { return false; }
}

function highlightMentions(text: string, pattern: string | null): React.ReactNode {
  if (!pattern) return text;
  try {
    const re = new RegExp(pattern, 'giu');
    const out: React.ReactNode[] = [];
    let last = 0; let idx = 0; let match: RegExpExecArray | null;
    while ((match = re.exec(text)) !== null) {
      if (match.index > last) out.push(<React.Fragment key={`t-${idx++}`}>{text.slice(last, match.index)}</React.Fragment>);
      out.push(<span key={`m-${idx++}`} className="rc-ping">{match[0]}</span>);
      last = re.lastIndex;
    }
    if (last < text.length) out.push(<React.Fragment key={`t-${idx++}`}>{text.slice(last)}</React.Fragment>);
    return out.length ? out : text;
  } catch { return text; }
}

// ===== Emoji =====
const EMOJI_PICKER = [
  '😀','😁','😂','🤣','😅','😎','😍','😘','😇','🤝','👌','👍','🔥','💯','✨','⚡','🎯','🚀','🛡️','🏆','💬','📝','📌','📣','🗂️','🧠','📈',
  '🕒','🛠️','🔒','✅','❗','⚠️','❓','🎉','🥳','🙌','🤘','🤖','👀','💡','🧭','📦','🛎️','📡','🛰️','🧪','📕','🧷','🪪','🧰','🧱','🛰','🗃️'
] as const;

// ===== CSS =====
const CHAT_CSS = String.raw`
:root{
  --accent:#8b5cf6; --accent-600:#7c3aed;
  --text-1:#e8ecf3; --text-2:#98a2b3; --text-3:#667085;
  --surface:#0f1117; --surface-2:#0b0d14; --bg-2:#0b0d14; --border:rgba(255,255,255,.08);
  --card-shadow:0 20px 50px -35px rgba(0,0,0,.6);
  --radius-lg:12px; --radius-xl:14px; --radius-2xl:18px;
}
/* === Общие стили (classic/forum) — как в предыдущей версии === */
.rc-wrap{border:1px solid var(--border);background:var(--surface);border-radius:12px;overflow:hidden;font:13px/1.4 Inter, -apple-system, BlinkMacSystemFont,'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans','Helvetica Neue', sans-serif;box-shadow:var(--card-shadow);color:var(--text-1);} 
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
.rc-form{display:flex;gap:8px;padding:10px 12px;background:var(--bg-2);position:relative;align-items:center;} 
.rc-input{flex:1;background:var(--surface);border:1px solid var(--border);color:var(--text-1);border-radius:var(--radius-lg);padding:8px 10px;} 
.rc-input:focus-visible{outline:none;border-color:var(--accent);box-shadow:0 0 0 2px rgba(59,130,246,.25);} 
.rc-emoji-btn{width:38px;height:38px;border-radius:var(--radius-lg);border:1px solid var(--border);background:var(--surface);color:var(--text-1);display:grid;place-items:center;font-size:18px;cursor:pointer;transition:background .2s ease,border-color .2s ease,transform .2s ease,color .2s ease;} 
.rc-emoji-btn:hover{background:var(--surface-2);} 
.rc-emoji-btn:disabled{opacity:.6;cursor:not-allowed;} 
.rc-emoji-btn.open{border-color:var(--accent);color:var(--accent);box-shadow:0 0 0 2px rgba(59,130,246,.2);} 
.rc-btn{background:var(--accent);border:none;color:#fff;border-radius:var(--radius-lg);padding:0 18px;font-weight:600;cursor:pointer;transition:opacity .2s ease,transform .2s ease;} 
.rc-btn:hover{opacity:.92;} 
.rc-btn:active{transform:scale(.98);} 
.rc-btn:disabled{opacity:.6;cursor:not-allowed;} 
.rc-emoji-panel{position:absolute;bottom:56px;right:12px;width:min(320px,90vw);background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-xl);box-shadow:var(--card-shadow);padding:12px;display:flex;flex-direction:column;gap:10px;z-index:60;} 
.rc-emoji-title{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--text-2);font-weight:600;} 
.rc-emoji-grid{display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:6px;} 
.rc-emoji-item{height:36px;border-radius:10px;border:1px solid transparent;background:var(--surface-2);display:flex;align-items:center;justify-content:center;font-size:18px;cursor:pointer;transition:background .2s ease,border-color .2s ease,transform .15s ease;} 
.rc-emoji-item:hover{background:var(--surface);border-color:var(--accent);transform:translateY(-1px);} 
.rc-emoji-item:focus-visible{outline:none;border-color:var(--accent);box-shadow:0 0 0 2px rgba(59,130,246,.2);} 
.rc-emoji-empty{font-size:12px;color:var(--text-2);text-align:center;padding:10px 0;} 
.nick-back{position:fixed;inset:0;background:rgba(15,15,18,.55);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;z-index:1000;padding:16px;} 
.nick-card{width:min(92vw,520px);background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-2xl);padding:18px;color:var(--text-1);box-shadow:var(--card-shadow);} 
.nick-row{display:flex;gap:8px;margin-top:12px;} 
.nick-input{flex:1;background:var(--surface);border:1px solid var(--border);color:var(--text-1);border-radius:var(--radius-lg);padding:8px 10px;} 
.nick-btn{background:var(--accent);border:1px solid var(--accent-600,var(--accent));color:#fff;border-radius:var(--radius-lg);padding:8px 12px;cursor:pointer;font-weight:600;} 
.nick-btn:hover{background:var(--accent-600,var(--accent));} 
.nick-pill{display:inline-flex;align-items:center;gap:6px;margin-top:10px;margin-right:8px;background:var(--surface-2);border:1px solid var(--border);border-radius:999px;padding:4px 10px;cursor:pointer;font-size:12px;color:var(--text-2);} 
.nick-pill:hover{color:var(--accent);border-color:var(--accent);} 
.nick-warn{font-size:12px;color:var(--text-2);margin-top:6px;} 
/* === Forum skin (оставляем без изменений) === */
.forum-chat{border:1px solid rgba(255,255,255,.08);background:rgba(15,16,22,.95);border-radius:12px;padding:16px;box-shadow:0 20px 50px -35px rgba(0,0,0,.6);backdrop-filter:blur(10px);color:var(--text-1);} 
.forum-chat-grid{display:grid;grid-template-columns:minmax(0,240px) minmax(0,1fr);gap:28px;align-items:start;} 
.forum-chat-roster{display:flex;flex-direction:column;gap:16px;} 
.forum-chat-roster h3{font-size:13px;letter-spacing:.24em;text-transform:uppercase;color:rgba(204,208,255,.7);margin:0;} 
.fc-roster-list{display:flex;flex-direction:column;gap:12px;} 
.fc-roster-item{display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:18px;background:rgba(18,20,32,.75);border:1px solid rgba(139,92,246,.25);box-shadow:0 12px 30px -24px rgba(83,42,166,.5);} 
.fc-avatar{width:44px;height:44px;border-radius:14px;display:grid;place-items:center;font-weight:700;letter-spacing:.08em;background:rgba(139,92,246,.25);color:#ede9fe;text-transform:uppercase;} 
.fc-roster-body{display:flex;flex-direction:column;gap:4px;} 
.fc-roster-name{font-size:14px;font-weight:600;color:#f4f5ff;} 
.fc-roster-role{font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:rgba(204,208,255,.65);} 
.fc-status{margin-left:auto;display:flex;flex-direction:column;align-items:flex-end;gap:4px;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:rgba(204,208,255,.6);} 
.fc-status-dot{width:10px;height:10px;border-radius:999px;background:#22c55e;box-shadow:0 0 10px rgba(34,197,94,.35);} 
.fc-roster-empty{padding:16px;border-radius:16px;border:1px dashed rgba(139,92,246,.35);text-align:center;font-size:12px;color:rgba(204,208,255,.55);} 
.fc-skeleton{position:relative;overflow:hidden;border-radius:18px;background:rgba(18,20,32,.65);height:64px;} 
.fc-skeleton::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(139,92,246,.28),transparent);animation:fcShine 1.25s infinite;} 
@keyframes fcShine{0%{transform:translateX(-100%);}100%{transform:translateX(100%);}} 
.forum-chat-main{display:flex;flex-direction:column;gap:18px;min-width:0;} 
.forum-chat-head{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:16px;} 
.forum-chat-head-title{font-size:13px;letter-spacing:.32em;text-transform:uppercase;color:rgba(204,208,255,.7);} 
.forum-chat-presence{display:flex;align-items:center;gap:12px;font-size:12px;color:rgba(204,208,255,.7);} 
.forum-chat-presence strong{font-size:22px;letter-spacing:.12em;font-weight:700;color:#fdfcff;display:block;} 
.forum-chat-presence span{display:block;font-size:11px;letter-spacing:.18em;text-transform:uppercase;} 
.forum-chat-presence-dot{width:12px;height:12px;border-radius:999px;background:#ef4444;box-shadow:0 0 10px rgba(239,68,68,.35);transition:all .25s ease;} 
.forum-chat-presence-dot.on{background:#22c55e;box-shadow:0 0 10px rgba(34,197,94,.45);} 
.forum-chat-list{max-height:420px;overflow-y:auto;border-radius:10px;border:1px solid rgba(255,255,255,.08);background:rgba(12,13,18,.9);padding:14px;display:flex;flex-direction:column;gap:14px;} 
.fc-item{display:flex;align-items:flex-start;gap:12px;} 
.fc-item.self .fc-avatar{background:rgba(34,197,94,.25);color:#f4fdf8;} 
.fc-body{flex:1;display:flex;flex-direction:column;gap:6px;min-width:0;} 
.fc-meta{display:flex;flex-wrap:wrap;align-items:center;gap:10px;} 
.fc-name{font-weight:600;font-size:14px;color:#f4f5ff;display:flex;align-items:center;gap:8px;} 
.fc-role{display:inline-flex;align-items:center;gap:6px;padding:2px 8px;border-radius:999px;font-size:10px;letter-spacing:.18em;text-transform:uppercase;background:rgba(139,92,246,.18);color:#ede9fe;border:1px solid rgba(139,92,246,.35);} 
.fc-time{font-size:12px;letter-spacing:.08em;color:rgba(204,208,255,.55);} 
.fc-bubble{position:relative;border-radius:10px;padding:10px 12px;background:rgba(20,22,28,.9);border:1px solid rgba(255,255,255,.08);color:#e9e9ff;line-height:1.55;} 
.fc-item.self .fc-bubble{background:rgba(17,32,24,.9);border-color:rgba(34,197,94,.45);} 
.fc-item.mention .fc-bubble{box-shadow:0 0 0 2px rgba(139,92,246,.45);} 
.fc-actions{display:flex;gap:8px;margin-left:auto;} 
.fc-action-btn{font-size:11px;padding:4px 10px;border-radius:12px;border:1px solid rgba(139,92,246,.25);background:rgba(17,19,30,.8);color:rgba(204,208,255,.75);cursor:pointer;transition:background .18s ease,border-color .18s ease,color .18s ease;} 
.fc-action-btn:hover{background:rgba(28,31,46,.85);border-color:rgba(139,92,246,.5);color:#fefeff;} 
.fc-empty{padding:18px;border-radius:18px;background:rgba(17,19,28,.65);color:rgba(204,208,255,.65);text-align:center;font-size:13px;} 
.forum-chat-form{display:grid;grid-template-columns:auto 1fr auto auto;gap:12px;align-items:flex-end;padding:12px 14px;border-radius:10px;border:1px solid rgba(255,255,255,.08);background:rgba(12,13,18,.85);} 
.forum-chat-form textarea{background:rgba(17,19,28,.85);border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:10px 12px;color:#f4f5ff;resize:none;min-height:48px;max-height:220px;line-height:1.55;} 
.forum-chat-textarea{position:relative;display:flex;flex-direction:column;} 
.forum-chat-form textarea:focus-visible{outline:none;border-color:rgba(139,92,246,.55);box-shadow:0 0 0 2px rgba(139,92,246,.25);} 
.forum-chat-btn{width:44px;height:44px;border-radius:10px;border:1px solid rgba(255,255,255,.10);background:rgba(16,18,28,.9);color:#f4f5ff;font-size:18px;display:grid;place-items:center;cursor:pointer;transition:transform .18s ease,border-color .18s ease,background-color .18s ease;} 
.forum-chat-btn:hover{transform:translateY(-1px);border-color:rgba(255,255,255,.18);background:rgba(23,25,36,.95);} 
.forum-chat-btn:disabled{opacity:.55;cursor:not-allowed;transform:none;} 
.forum-chat-send{background:#ff2d87;color:#0b0618;font-weight:700;letter-spacing:.12em;border:none;} 
.forum-chat-send:hover{background:#ff4a98;} 
.forum-chat-attachments{font-size:18px;color:#ff2d87;} 
.forum-chat-emoji{font-size:18px;color:#ff2d87;} 
.forum-chat-skeleton{display:grid;gap:18px;} 
.forum-chat-list-placeholder{height:320px;border-radius:10px;background:rgba(15,17,28,.65);position:relative;overflow:hidden;} 
.forum-chat-list-placeholder::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(139,92,246,.28),transparent);animation:fcShine 1.25s infinite;} 
.forum-chat-form .forum-chat-btn{height:44px;} 
.forum-chat-roster .fc-skeleton{height:60px;} 
@media (max-width:1024px){.forum-chat-grid{grid-template-columns:minmax(0,1fr);gap:22px;}} 
@media (max-width:768px){.forum-chat-form{grid-template-columns:repeat(2,minmax(0,1fr));}.forum-chat-btn{width:100%;}.forum-chat-textarea{grid-column:span 2;}} 

/* === SHOUTBOX skin (как на скрине) === */
.sb-box{border:1px solid rgba(255,255,255,.08);background:#0c0e15;border-radius:12px;box-shadow:0 16px 36px -28px rgba(0,0,0,.6);color:#e6e9f2;overflow:hidden;font:14px/1.5 Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;}
.sb-head{display:flex;align-items:center;justify-content:space-between;padding:10px 12px;background:#0a0c12;border-bottom:1px solid rgba(255,255,255,.08);} 
.sb-title{font-weight:800;letter-spacing:.1em;text-transform:uppercase;opacity:.92;} 
.sb-head-icons{display:flex;gap:10px;opacity:.8;} 
.sb-icon{width:18px;height:18px;filter:drop-shadow(0 0 6px rgba(255,255,255,.02));}

.sb-list{height:360px;overflow-y:auto;background:#0c0e15;}
.sb-ul{list-style:none;margin:0;padding:0 0 0 0;}
.sb-li{display:flex;align-items:flex-start;gap:8px;padding:8px 12px;border-top:1px solid rgba(255,255,255,.06);} 
.sb-li:first-child{border-top:none;}
.sb-bullet{width:10px;height:10px;border-radius:999px;background:#ff2d87;box-shadow:0 0 10px rgba(255,45,135,.45);margin-top:6px;flex:0 0 auto;}
.sb-row{display:flex;gap:6px;flex-wrap:wrap;align-items:baseline;min-width:0;}
.sb-name{font-weight:700;color:#f5f7ff;white-space:nowrap;}
.sb-role{color:#a7b0c3;opacity:.9;}
.sb-text{color:#d5dbef;word-break:break-word;}
.sb-time{margin-left:auto;color:#8a93a8;font-size:12px;white-space:nowrap;}
.sb-system .sb-name{color:#a78bfa;}
.sb-mention{background:rgba(139,92,246,.2);box-shadow:inset 0 0 0 1px rgba(139,92,246,.55);border-left:3px solid rgba(139,92,246,.8);} 

.sb-form{display:flex;align-items:center;gap:10px;padding:12px;border-top:1px solid rgba(255,255,255,.08);background:#0a0c12;}
.sb-input{flex:1;border:1px solid rgba(255,255,255,.1);background:#101320;border-radius:10px;color:#eef1ff;padding:10px 12px;}
.sb-input::placeholder{color:#8a93a8;letter-spacing:.02em;}
.sb-input:focus-visible{outline:none;border-color:#ff2d87;box-shadow:0 0 0 2px rgba(255,45,135,.25);} 
.sb-btn{width:40px;height:40px;border-radius:10px;border:1px solid rgba(255,255,255,.1);background:#121625;color:#f4f5ff;font-size:18px;display:grid;place-items:center;cursor:pointer;transition:transform .15s ease,border-color .15s ease,background-color .15s ease;} 
.sb-btn:hover{transform:translateY(-1px);border-color:rgba(255,255,255,.18);background:#171a2b;} 
.sb-btn.send{background:#ff2d87;color:#0b0618;border:none;font-weight:800;letter-spacing:.08em;} 
.sb-btn.send:hover{background:#ff3f93;} 
.sb-btn:disabled{opacity:.55;cursor:not-allowed;transform:none;}
/* add-on: avatar + name link styling to match beautiful shoutbox */
.sb-name a{color:#a7c5ff;text-decoration:none;}
.sb-name a:hover{color:#c2d7ff;text-decoration:underline;}
.sb-avatar{width:28px;height:28px;border-radius:999px;display:grid;place-items:center;font-weight:800;font-size:12px;text-transform:uppercase;color:#0b0d14;background:linear-gradient(135deg,#ffd166,#ff2d87);border:1px solid rgba(255,255,255,.12);box-shadow:0 6px 16px -10px rgba(0,0,0,.5), inset 0 0 0 2px rgba(0,0,0,.15);} 
.sb-li.sb-has-avatar .sb-bullet{display:none;} 
.sb-li .rc-ax{border-radius:10px;padding:0 8px;} 
.sb-actions{display:none;gap:6px;margin-left:8px;}
.sb-li:hover .sb-actions{display:inline-flex;}

`;

function computeWorkerBase(wsFull: string | undefined): string {
  if (!wsFull) return '';
  try {
    const u = new URL(wsFull);
    u.protocol = u.protocol === 'wss:' ? 'https:' : (u.protocol === 'ws:' ? 'http:' : u.protocol);
    u.pathname = '/'; u.search = ''; u.hash = '';
    return u.toString().replace(/\/+$/,'');
  } catch { return ''; }
}

function makeKeys(epoch: number) {
  const suf = `@e${epoch}`;
  return { NAME_KEY: `chat:nick${suf}`, NAME_LOCK: `chat:nick:lock${suf}` };
}

export default function SimpleChat({
  room = 'global', className, variant = 'shoutbox', onRosterChange, resolveRole,
}: Props) {
  const wsUrl = (import.meta as any).env?.VITE_CHAT_WS || import.meta.env?.VITE_CHAT_WS;

  // === epoch ===
  const workerBase = React.useMemo(() => computeWorkerBase(wsUrl), [wsUrl]);
  const [epoch, setEpoch] = React.useState<number>(1);
  const [epochReady, setEpochReady] = React.useState<boolean>(false);
  const keys = React.useMemo(() => makeKeys(epoch), [epoch]);

  // === chat state ===
  const [connected, setConnected] = React.useState(false);
  const [onlineCount, setOnlineCount] = React.useState<number>(0);
  const [onlineNames, setOnlineNames] = React.useState<string[]>([]);
  const [presenceOpen, setPresenceOpen] = React.useState(false);
  const [isAdmin, setIsAdmin] = React.useState(false);
  // Admin может писать без финализации ника, но имя не подменяем на "Admin"
  React.useEffect(() => { if (isAdmin) { try { setNeedNick(false as any);} catch {} } }, [isAdmin]);

  const [input, setInput] = React.useState('');
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const wsRef = React.useRef<WebSocket | null>(null);
  const listRef = React.useRef<HTMLDivElement | null>(null);
  const headRef = React.useRef<HTMLDivElement | null>(null);
  const formRef = React.useRef<HTMLFormElement | null>(null);
  const inputRef = React.useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const [emojiOpen, setEmojiOpen] = React.useState(false);
  const pendingRef = React.useRef<Record<string, string>>({});

  // === name state ===
  const [nick, setNick] = React.useState<string | null>(null);
  const [needNick, setNeedNick] = React.useState<boolean>(true);
  const [nickDraft, setNickDraft] = React.useState<string>('');
  const [metaMap, setMetaMap] = React.useState<Record<string, { role?: string; avatar?: string }>>({});

  const latestStateRef = React.useRef<{ epochReady: boolean; needNick: boolean; nick: string | null }>({
    epochReady, needNick, nick,
  });
  const keysRef = React.useRef(keys);
  const helloSentRef = React.useRef<string | null>(null);
  const selfName = React.useMemo(() => (nick ?? ''), [nick]);
  const trimmedSelfName = React.useMemo(() => selfName.trim(), [selfName]);
  const mentionPattern = React.useMemo(() => makeMentionPattern(trimmedSelfName || null), [trimmedSelfName]);
  // Align with profile role palette
  const ROLE_COLORS: Record<string, { label: string; color: string; textColor?: string }> = {
    developer: { label: 'Developer', color: '#22d3ee' },
    admin: { label: 'Admin', color: '#e5e7eb', textColor: '#0a0a0a' },
    moderator: { label: 'Moderator', color: '#ef4444', textColor: '#fee2e2' },
    vip: { label: 'VIP', color: '#eab308' },
    user: { label: 'User', color: '#94a3b8' },
    newbie: { label: 'Newbie', color: '#22d3ee' },
  };
  const getRoleMeta = React.useCallback((name: string) => {
    const base = resolveRole?.(name); if (base) return base;
    const cached = metaMap[name]?.role as keyof typeof ROLE_COLORS | undefined;
    if (cached && ROLE_COLORS[cached]) return ROLE_COLORS[cached];
    if (isAdmin && name.trim() === trimmedSelfName) return ROLE_COLORS.admin;
    return null;
  }, [resolveRole, metaMap, isAdmin, trimmedSelfName]);
  const avatarStyle = React.useCallback((name: string) => {
    const trimmed = name.trim(); if (!trimmed) return { background: 'linear-gradient(135deg,#312e81,#7c3aed)', color: '#ede9fe' };
    let hash = 0; for (let i=0;i<trimmed.length;i+=1) hash = (hash + trimmed.charCodeAt(i) * 17) % 360;
    const hue1 = hash; const hue2 = (hash + 42) % 360;
    return { background: `linear-gradient(135deg, hsla(${hue1},80%,56%,0.85), hsla(${hue2},78%,48%,0.85))`, color: '#fdfcff' };
  }, []);
  const avatarFromMeta = React.useCallback((name: string) => {
    const mm = metaMap[name];
    const url = mm?.avatar;
    if (url) {
      return { backgroundImage: `url(${url})`, backgroundSize: 'cover', backgroundPosition: 'center', color: 'transparent' } as React.CSSProperties;
    }
    return avatarStyle(name) as React.CSSProperties;
  }, [metaMap, avatarStyle]);

  // Цвет ника: по роли, иначе по хешу имени
  const nameColor = React.useCallback((name: string) => {
    const s = name.trim(); if (!s) return '#cbd5e1';
    let h = 0; for (let i=0;i<s.length;i+=1) h = (h * 31 + s.charCodeAt(i)) % 360;
    return `hsl(${h}, 80%, 70%)`;
  }, []);
  const nameStyle = React.useCallback((name: string, role: { color: string } | null) => {
    if (role?.color) return { color: role.color } as React.CSSProperties;
    return { color: nameColor(name) } as React.CSSProperties;
  }, [nameColor]);

  // === epoch -> read storage ===
  React.useEffect(() => {
    if (!epochReady) return;
    try {
      const storedName = localStorage.getItem(keys.NAME_KEY);
      const locked = localStorage.getItem(keys.NAME_LOCK) === '1';
      if (storedName && locked) { setNick(storedName); setNeedNick(false); setNickDraft(storedName); }
      else if (storedName && !locked) { setNick(storedName); setNickDraft(storedName); setNeedNick(true); }
      else { setNick(null); setNickDraft(''); setNeedNick(true); }
    } catch { setNick(null); setNickDraft(''); setNeedNick(true); }
  }, [epochReady, keys.NAME_KEY, keys.NAME_LOCK]);

  React.useEffect(() => { latestStateRef.current = { epochReady, needNick, nick }; }, [epochReady, needNick, nick]);

  // Prefer forum/remote username
  React.useEffect(() => {
    if (!epochReady) return; (async () => {
      let uname: string | null = null; try { const meLocal = getLocalSession(); if (meLocal?.username) uname = meLocal.username; } catch {}
      try { const me = await getRemoteSession(); if (me?.username) uname = me.username; } catch {}
      if (!uname) { try { const raw = localStorage.getItem('forum:session') || sessionStorage.getItem('forum:session'); const ss = raw ? JSON.parse(raw) : null; if (ss?.username) uname = ss.username; } catch {} }
      if (uname) { setNick(uname); setNickDraft(uname); setNeedNick(false); try { localStorage.setItem(keys.NAME_KEY, uname); localStorage.setItem(keys.NAME_LOCK, '1'); } catch {}
        const ws = wsRef.current; if (ws && ws.readyState === WebSocket.OPEN && helloSentRef.current !== uname) { try { ws.send(JSON.stringify({ type:'hello', name: uname })); helloSentRef.current = uname; } catch {} }
      }
    })();
  }, [epochReady, keys.NAME_KEY, keys.NAME_LOCK]);

  React.useEffect(() => { keysRef.current = keys; }, [keys]);
  React.useEffect(() => { if (!isAdmin) setPresenceOpen(false); }, [isAdmin]);
  React.useEffect(() => { if (typeof onRosterChange === 'function') onRosterChange(onlineNames, onlineCount); }, [onRosterChange, onlineNames, onlineCount]);
  React.useEffect(() => { if (typeof window === 'undefined') return; (window as any).__simplechatAdminState = isAdmin; try { window.dispatchEvent(new CustomEvent('simplechat:admin-state', { detail: { isAdmin } })); } catch {} }, [isAdmin]);
  React.useEffect(() => { if (!connected) { setPresenceOpen(false); setOnlineNames([]); } }, [connected]);
  React.useEffect(() => {
    if (!presenceOpen) return; const onM = (e: MouseEvent) => { const head = headRef.current; if (head && !head.contains(e.target as Node)) setPresenceOpen(false); }; const onK = (e: KeyboardEvent) => { if (e.key === 'Escape') setPresenceOpen(false); }; window.addEventListener('mousedown', onM); window.addEventListener('keydown', onK); return () => { window.removeEventListener('mousedown', onM); window.removeEventListener('keydown', onK); };
  }, [presenceOpen]);
  React.useEffect(() => { if (!emojiOpen) return; const onM = (e: MouseEvent) => { const form = formRef.current; if (form && !form.contains(e.target as Node)) setEmojiOpen(false); }; const onK = (e: KeyboardEvent) => { if (e.key === 'Escape') setEmojiOpen(false); }; window.addEventListener('mousedown', onM); window.addEventListener('keydown', onK); return () => { window.removeEventListener('mousedown', onM); window.removeEventListener('keydown', onK); };
  }, [emojiOpen]);
  React.useEffect(() => { if (needNick) helloSentRef.current = null; }, [needNick]);

  // Fetch avatar + role for seen authors
  React.useEffect(() => {
    const names = new Set<string>();
    for (const m of messages) if (m?.author) names.add(m.author);
    for (const n of onlineNames) if (n) names.add(n);
    const missing = Array.from(names).filter((n) => !metaMap[n]);
    if (!missing.length) return;
    let stop = false;
    (async () => {
      for (const name of missing.slice(0, 40)) {
        if (stop) break;
        try {
          const pack = await getProfileByUsername(name);
          if (pack && (pack as any).user) {
            const role = (pack as any).user?.role as string | undefined;
            const raw: any = (pack as any).profile || {};
            const avatar = raw.avatarData || raw.avatar || raw.avatarUrl || undefined;
            setMetaMap((prev) => (prev[name] ? prev : { ...prev, [name]: { role, avatar } }));
          }
        } catch {}
      }
    })();
    return () => { stop = true; };
  }, [messages, onlineNames, metaMap]);

  // fetch epoch once
  React.useEffect(() => {
    let aborted = false; let timer: ReturnType<typeof setTimeout> | null = null; const started = Date.now();
    const finish = (v: number) => { if (aborted) return; setEpoch(v); const elapsed = Date.now() - started; const minDelay = 520; const delay = Math.max(0, Math.min(900, minDelay - elapsed)); const mark = () => { if (!aborted) setEpochReady(true); }; delay <= 0 ? mark() : (timer = setTimeout(mark, delay)); };
    if (!workerBase) { finish(1); return () => { aborted = true; if (timer) clearTimeout(timer); }; }
    (async () => { try { const r = await fetch(`${workerBase}/nick-epoch`, { credentials: 'include' }); const json = r.ok ? await r.json().catch(() => ({})) : {}; const e = Number((json as any).epoch) || 1; finish(e); } catch { finish(1); } })();
    return () => { aborted = true; if (timer) clearTimeout(timer); };
  }, [workerBase]);

  // autoscroll
  React.useEffect(() => { const el = listRef.current; if (el) el.scrollTop = el.scrollHeight; }, [messages.length]);

  // WebSocket
  React.useEffect(() => {
    if (!wsUrl) return; let stop = false; let retry = 0; let ws: WebSocket | null = null;
    const connect = () => {
      if (stop) return; setConnected(false); const url = new URL(wsUrl); url.searchParams.set('room', room); ws = new WebSocket(url); wsRef.current = ws;
      ws.addEventListener('open', () => { setConnected(true); pendingRef.current = {}; retry = 0; setOnlineCount(0); const { epochReady: ready, needNick: need, nick: currentNick } = latestStateRef.current; if (ready && currentNick && !need) { try { ws!.send(JSON.stringify({ type:'hello', name: currentNick })); helloSentRef.current = currentNick; } catch {} } });
      ws.addEventListener('message', async (ev) => {
        try {
          let parsed = parseWsData(ev.data); // @ts-ignore
          if (!parsed && typeof Blob !== 'undefined' && ev.data instanceof Blob) { // @ts-ignore
            parsed = JSON.parse(await ev.data.text()); }
          if (!parsed) return;
          if (parsed.type === 'history') { setMessages(parsed.messages); }
          else if (parsed.type === 'message') {
            const cid = (parsed as any).cid as string | undefined; if (cid && pendingRef.current[cid]) { const tempId = pendingRef.current[cid]; delete pendingRef.current[cid]; setMessages((arr) => { const withoutTemp = arr.filter((m) => m.id !== tempId); return withoutTemp.some((m) => m.id === parsed!.message.id) ? withoutTemp : [...withoutTemp, parsed!.message]; }); } else { setMessages((arr) => arr.some((m) => m.id === parsed!.message.id) ? arr : [...arr, parsed!.message]); }
          } else if (parsed.type === 'delete') { setMessages((arr) => arr.filter((m) => m.id !== parsed!.id)); }
          else if (parsed.type === 'edit') { setMessages((arr) => arr.map((m) => (m.id === parsed!.id ? { ...m, text: parsed!.text } : m))); }
          else if (parsed.type === 'system') {
            if (parsed.text === 'admin-ok') setIsAdmin(true); else if (parsed.text === 'hello-ok' && !parsed.name) setIsAdmin(false);
            if (parsed.text === 'presence') { const next = Number(parsed.count); setOnlineCount(Number.isFinite(next) && next > 0 ? Math.round(next) : 0); if (Array.isArray(parsed.names)) { const list = parsed.names.map((n) => (typeof n === 'string' ? n.trim() : '')).filter((n) => n.length > 0); setOnlineNames(list); } else { setOnlineNames([]); } }
            if (parsed.name && (parsed.text === 'hello-ok' || parsed.text === 'admin-ok')) { setNick(parsed.name); setNickDraft(parsed.name); helloSentRef.current = parsed.name; try { const { NAME_KEY, NAME_LOCK } = keysRef.current; localStorage.setItem(NAME_KEY, parsed.name); localStorage.setItem(NAME_LOCK, '1'); } catch {} setNeedNick(false); }
          }
        } catch {}
      });
      const onClose = () => { if (stop) return; setConnected(false); setOnlineCount(0); setOnlineNames([]); setPresenceOpen(false); retry = Math.min(retry + 1, 6); setTimeout(connect, 400 * retry); };
      ws.addEventListener('close', onClose); ws.addEventListener('error', () => ws?.close());
    };
    connect();
    return () => { stop = true; try { ws?.close(); } catch {} wsRef.current = null; helloSentRef.current = null; };
  }, [wsUrl, room]);

  React.useEffect(() => { const ws = wsRef.current; if (!ws || ws.readyState !== WebSocket.OPEN) return; if (!epochReady || needNick || !nick) return; if (helloSentRef.current === nick) return; try { ws.send(JSON.stringify({ type:'hello', name: nick })); helloSentRef.current = nick; } catch {} }, [epochReady, needNick, nick]);

  // ===== Actions =====
  function confirmNick() {
    const clean = (nickDraft || '').trim().slice(0, 80);
    const finalName = clean.replace(/[^\p{L}\p{N}_ -]+/gu, '');
    setNick(finalName || null); setNickDraft(finalName);
    try { localStorage.setItem(keys.NAME_KEY, finalName); } catch {}
    const ws = wsRef.current; if (ws && ws.readyState === WebSocket.OPEN) { try { ws.send(JSON.stringify({ type:'hello', name: finalName })); helloSentRef.current = finalName; } catch {} }
    // модалка не закрывается — ждём подтверждение сервера
  }

  const [meRemote, setMeRemote] = React.useState<any|null>(null);
  React.useEffect(() => { (async () => { try { setMeRemote(await getRemoteSession()); } catch { setMeRemote(null); } })(); }, []);
  const muted = React.useMemo(() => {
    const until = meRemote?.mutedUntil ? Date.parse(meRemote.mutedUntil as any) : 0;
    const isPrivileged = ['developer','admin','moderator'].includes(String(meRemote?.role || ''));
    return !isPrivileged && !!until && until > Date.now();
  }, [meRemote]);

  function send() {
    const raw = input.replace(/\r/g, '');
    const text = raw.trim();
    const ws = wsRef.current;
    if (!epochReady || !nick || needNick || !text || !ws || ws.readyState !== WebSocket.OPEN || muted) return;
    const cid = `${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const tempId = `loc_${cid}`; pendingRef.current[cid] = tempId;
    setMessages((arr) => [...arr, { id: tempId, author: isAdmin ? 'Admin' : nick, text, ts: Date.now() }]);
    ws.send(JSON.stringify({ type: 'message', text: text.slice(0, MAX_LEN), cid }));
    setInput(''); adjustTextareaHeight();
  }

  const canUseInput = epochReady && connected && (!!nick || isAdmin) && !needNick && !muted;

  const handleTextareaKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) { event.preventDefault(); send(); }
  };

  React.useEffect(() => { if (!canUseInput) setEmojiOpen(false); }, [canUseInput]);

  function mentionUser(name: string) {
    const at = `@${name} `; setInput((prev) => (prev ? prev.replace(/\s+$/, ' ') + at : at));
    const node = inputRef.current as HTMLInputElement | HTMLTextAreaElement | null;
    setTimeout(() => { try { if (node) { node.focus(); const len = (node as any).value.length; (node as any).selectionStart = (node as any).selectionEnd = len; } } catch {} }, 0);
  }

  const toggleEmoji = () => { if (!canUseInput) return; setEmojiOpen((prev) => !prev); };

  const adjustTextareaHeight = React.useCallback(() => {
    if (variant !== 'forum') return; const node = inputRef.current; if (!node || node.tagName !== 'TEXTAREA') return; const area = node as HTMLTextAreaElement; area.style.height = 'auto'; const next = Math.min(area.scrollHeight, 220); area.style.height = `${next}px`;
  }, [variant]);
  React.useEffect(() => { adjustTextareaHeight(); }, [input, adjustTextareaHeight]);

  const insertEmoji = (emoji: string) => {
    setInput((prev) => `${prev}${emoji}`); setEmojiOpen(false);
    const focusBack = () => { const node = inputRef.current; if (node) { const end = (node as any).value.length; (node as any).focus(); try { (node as any).setSelectionRange(end, end); } catch {} adjustTextareaHeight(); } };
    if (typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function') { window.requestAnimationFrame(focusBack); } else { setTimeout(focusBack, 0); }
  };

  const del = (id: string) => { const ws = wsRef.current; if (!isAdmin || !ws || ws.readyState !== WebSocket.OPEN) return; ws.send(JSON.stringify({ type: 'delete', id })); };
  const edit = (id: string, now: string) => { const ws = wsRef.current; if (!isAdmin || !ws || ws.readyState !== WebSocket.OPEN) return; const next = prompt('Изменить сообщение:', now)?.trim(); if (!next) return; ws.send(JSON.stringify({ type: 'edit', id, text: next.slice(0, MAX_LEN) })); };

  const nickClass = (author: string) => author === 'Admin' ? 'rc-admin' : (author === nick ? 'rc-me' : 'rc-other');

  // ====== Renders ======
  const renderClassic = () => (
    <div className="rc-wrap" aria-busy={!epochReady}>
      <div ref={headRef} className="rc-head">
        <div className="rc-head-title">Командный чат</div>
        <div className="rc-head-meta">
          {isAdmin ? (
            <button type="button" className={`rc-presence rc-presence-btn${presenceOpen ? ' open' : ''}`} onClick={() => setPresenceOpen((p) => !p)} aria-expanded={presenceOpen} aria-controls="rc-presence-panel" aria-label="Кто сейчас в сети">
              <span className={`rc-presence-dot ${connected ? 'on' : ''}`} aria-hidden />
              <span className="rc-presence-count">{connected ? Math.max(onlineCount, 0) : 0}<span>в сети</span></span>
            </button>
          ) : (
            <div className="rc-presence" role="status" aria-live="polite">
              <span className={`rc-presence-dot ${connected ? 'on' : ''}`} aria-hidden />
              <span className="rc-presence-count">{connected ? Math.max(onlineCount, 0) : 0}<span>в сети</span></span>
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
            ) : (<div className="rc-presence-empty">Никого нет</div>)}
          </div>
        )}
      </div>
      <div ref={listRef} className="rc-list">
        {!epochReady ? (<div className="rc-empty">Загрузка…</div>) : messages.length === 0 ? (<div className="rc-empty">…</div>) : (
          <ul>
            {messages.map((m) => {
              const isSelfAuthor = trimmedSelfName ? m.author.trim() === trimmedSelfName : false;
              const mentionForMe = Boolean(mentionPattern && trimmedSelfName && !isSelfAuthor && hasMention(m.text, mentionPattern));
              const body = mentionForMe ? highlightMentions(m.text, mentionPattern) : m.text;
              return (
                <li key={m.id} className={mentionForMe ? 'rc-mention' : undefined}>
                  <span className="rc-ts">[{hhmmss(m.ts)}]</span>
                  <Link to={`/forum/profile/${encodeURIComponent(m.author)}`} className={nickClass(m.author)}>{m.author}</Link>
                  <button className="rc-ax" type="button" onClick={() => mentionUser(m.author)} title={`@${m.author}`}>@</button>
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
      <form ref={formRef} className="rc-form" onSubmit={(e) => { e.preventDefault(); send(); }}>
        <button type="button" className={`rc-emoji-btn${emojiOpen ? ' open' : ''}`} onClick={toggleEmoji} disabled={!canUseInput} aria-label="Вставить смайлик">😊</button>
        <input ref={inputRef as React.RefObject<HTMLInputElement>} className="rc-input" placeholder="напишите сообщение…" value={input} onChange={(e) => setInput(e.target.value)} maxLength={MAX_LEN} disabled={!canUseInput} />
        <button type="submit" className="rc-btn" disabled={!canUseInput}>▶</button>
        {emojiOpen && (
          <div className="rc-emoji-panel" role="menu" aria-label="Палитра смайликов">
            <div className="rc-emoji-title">Смайлики</div>
            {EMOJI_PICKER.length ? (
              <div className="rc-emoji-grid">{EMOJI_PICKER.map((emoji) => (<button key={emoji} type="button" className="rc-emoji-item" onClick={() => insertEmoji(emoji)} aria-label={`Вставить ${emoji}`}>{emoji}</button>))}</div>
            ) : (<div className="rc-emoji-empty">Ничего нет</div>)}
          </div>
        )}
      </form>
    </div>
  );

  const renderForum = () => {
    const roster = onlineNames; const rosterCount = connected ? Math.max(onlineCount, roster.length) : 0;
    return (
      <div className="forum-chat" aria-busy={!epochReady}>
        <div className="forum-chat-grid">
          <aside className="forum-chat-roster">
            <h3>Онлайн</h3>
            {!epochReady ? (
              <div className="fc-roster-list">{Array.from({ length: 4 }).map((_, idx) => (<div key={idx} className="fc-skeleton" aria-hidden />))}</div>
            ) : (
              <div className="fc-roster-list">{roster.length ? (
                roster.map((name) => { const role = getRoleMeta(name); const trimmed = name.trim(); const initials = trimmed ? trimmed.slice(0, 2).toUpperCase() : '??'; const avatar = avatarStyle(name); return (
                  <div key={name} className="fc-roster-item">
                    <div className="fc-avatar" style={avatar}>{initials}</div>
                    <div className="fc-roster-body">
                      <div className="fc-roster-name">{name}</div>
                      <div className="fc-roster-role" style={role ? { color: role.textColor ?? '#ede9fe' } : undefined}>{role ? role.label : 'Участник'}</div>
                    </div>
                    <div className="fc-status"><span className="fc-status-dot" aria-hidden /><span>online</span></div>
                  </div>
                ); })
              ) : (<div className="fc-roster-empty">Пока никого</div>)}</div>
            )}
          </aside>
          <div className="forum-chat-main">
            <div className="forum-chat-head">
              <div className="forum-chat-head-title">Командный чат</div>
              <div className="forum-chat-presence"><span className={`forum-chat-presence-dot ${connected ? 'on' : ''}`} aria-hidden /><div><strong>{rosterCount}</strong><span>в сети</span></div></div>
            </div>
            {!epochReady ? (
              <div className="forum-chat-skeleton"><div className="forum-chat-list-placeholder" /></div>
            ) : (
              <>
                <div ref={listRef} className="forum-chat-list">
                  {messages.length === 0 ? (<div className="fc-empty">Сообщений пока нет</div>) : (
                    messages.map((m) => {
                      const isSelfAuthor = trimmedSelfName ? m.author.trim() === trimmedSelfName : false;
                      const mentionForMe = Boolean(mentionPattern && trimmedSelfName && !isSelfAuthor && hasMention(m.text, mentionPattern));
                      const body = mentionForMe ? highlightMentions(m.text, mentionPattern) : m.text;
                      const role = getRoleMeta(m.author); const trimmed = m.author.trim(); const initials = trimmed ? trimmed.slice(0, 2).toUpperCase() : '??'; const avatar = avatarStyle(m.author);
                      return (
                        <div key={m.id} className={`fc-item${isSelfAuthor ? ' self' : ''}${mentionForMe ? ' mention' : ''}`}>
                          <div className="fc-avatar" style={avatar}>{initials}</div>
                          <div className="fc-body">
                            <div className="fc-meta">
                              <div className="fc-name">
                                <Link to={`/forum/profile/${encodeURIComponent(m.author)}`}>{m.author}</Link>
                                <button type="button" className="fc-action-btn" onClick={() => mentionUser(m.author)} title={`@${m.author}`}>@</button>
                                {role && (
                                  <span className="fc-role" style={{ background: `${role.color}33`, color: role.textColor ?? '#ede9fe', borderColor: `${role.color}55` }}>{role.label}</span>
                                )}
                              </div>
                              <span className="fc-time">{hhmmss(m.ts)}</span>
                            </div>
                            <div className="fc-bubble">{body}</div>
                            {isAdmin && (
                              <div className="fc-actions"><button type="button" className="fc-action-btn" onClick={() => edit(m.id, m.text)}>Ред.</button><button type="button" className="fc-action-btn" onClick={() => del(m.id)}>Удал.</button></div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
                <form ref={formRef} className="forum-chat-form" onSubmit={(e) => { e.preventDefault(); send(); }}>
                  <button type="button" className="forum-chat-btn forum-chat-attachments" onClick={() => alert('Прикрепление пока недоступно в демо.')} disabled={!canUseInput} aria-label="Прикрепить файл">📎</button>
                  <div className="forum-chat-textarea">
                    <textarea ref={(node) => { inputRef.current = node; if (node) adjustTextareaHeight(); }} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleTextareaKeyDown} placeholder="Напишите сообщение…" disabled={!canUseInput} maxLength={MAX_LEN} />
                    {emojiOpen && (
                      <div className="rc-emoji-panel" role="menu" aria-label="Палитра смайликов">
                        <div className="rc-emoji-title">Смайлики</div>
                        {EMOJI_PICKER.length ? (
                          <div className="rc-emoji-grid">{EMOJI_PICKER.map((emoji) => (<button key={emoji} type="button" className="rc-emoji-item" onClick={() => insertEmoji(emoji)} aria-label={`Вставить ${emoji}`}>{emoji}</button>))}</div>
                        ) : (<div className="rc-emoji-empty">Ничего нет</div>)}
                      </div>
                    )}
                  </div>
                  <button type="button" className={`forum-chat-btn forum-chat-emoji${emojiOpen ? ' open' : ''}`} onClick={toggleEmoji} disabled={!canUseInput} aria-label="Вставить смайлик">🙂</button>
                  <button type="submit" className="forum-chat-btn forum-chat-send" disabled={!canUseInput} aria-label="Отправить">➤</button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderShoutbox = () => {
    const baseName = (trimmedSelfName || 'SB');
    const baseInit = baseName ? baseName.slice(0,2).toUpperCase() : 'SB';
    const baseAvatar = avatarStyle(baseName);
    return (
    <div className="sb-box" aria-busy={!epochReady}>
      <div className="sb-head">
        <div className="sb-title" style={{display:'flex',alignItems:'center',gap:8}}>
          <svg className="sb-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M3 11h3l4-7v18l-4-7H3V11zm13 9c2.76 0 5-3.13 5-7s-2.24-7-5-7v14z"/></svg>
          SHOUTBOX
        </div>
        <div className="sb-head-icons" aria-hidden>
          <svg className="sb-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3l7 5v8l-7 5-7-5V8l7-5zm0 2.2L7 8v8l5 3.6L17 16V8l-5-2.8z"/></svg>
        </div>
      </div>
      <div ref={listRef} className="sb-list">
        {!epochReady ? (
          <ul className="sb-ul"><li className="sb-li"><div className="sb-avatar" style={baseAvatar}>{baseInit}</div><div className="sb-row"><span className="sb-name">System</span><span className="sb-text">Loading…</span></div><span className="sb-time">just now</span></li></ul>
        ) : messages.length === 0 ? (
          <ul className="sb-ul"><li className="sb-li"><div className="sb-avatar" style={baseAvatar}>{baseInit}</div><div className="sb-row"><span className="sb-name sb-system">shoutbox</span><span className="sb-text">No messages yet</span></div><span className="sb-time">just now</span></li></ul>
        ) : (
          <ul className="sb-ul">
            {messages.map((m) => {
              const isSelfAuthor = trimmedSelfName ? m.author.trim() === trimmedSelfName : false;
              const mentionForMe = Boolean(mentionPattern && trimmedSelfName && !isSelfAuthor && hasMention(m.text, mentionPattern));
              const body = mentionForMe ? highlightMentions(m.text, mentionPattern) : m.text;
              const role = getRoleMeta(m.author);
                      const trimmed = m.author.trim();
                      const initials = trimmed ? trimmed.slice(0, 2).toUpperCase() : '??';
                      const avatar = avatarFromMeta(m.author);
                      const isSystem = m.author.toLowerCase() === 'shoutbox' || m.author.toLowerCase() === 'system';
              return (
                <li key={m.id} className={`sb-li sb-has-avatar${mentionForMe ? ' sb-mention' : ''}${isSystem ? ' sb-system' : ''}`}>
                  <div className="sb-avatar" style={avatar}>{initials}</div>
                  <div className="sb-row">
                    <span className={`sb-name ${nickClass(m.author)}`}>
                      <Link to={`/forum/profile/${encodeURIComponent(m.author)}`} style={nameStyle(m.author, role)}>{m.author}</Link>
                      {role ? (<span className="sb-role"> ({role.label})</span>) : null}
                    </span>
                    <button type="button" className="rc-ax" style={{padding:'0 6px'}} onClick={() => mentionUser(m.author)} title={`@${m.author}`}>@</button>
                    <span className="sb-text">{typeof body === 'string' ? body : <span>{body}</span>}</span>
                  </div>
                  <span className="sb-time">{agoEN(m.ts)}</span>
                  {isAdmin && (
                    <span className="sb-actions">
                      <button type="button" className="rc-ax" onClick={() => edit(m.id, m.text)} title="Редактировать">✎</button>
                      <button type="button" className="rc-ax" onClick={() => del(m.id)} title="Удалить">🗑</button>
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <form ref={formRef} className="sb-form" onSubmit={(e) => { e.preventDefault(); send(); }}>
        <input ref={inputRef as React.RefObject<HTMLInputElement>} className="sb-input" placeholder="What's on your mind?" value={input} onChange={(e) => setInput(e.target.value)} maxLength={MAX_LEN} disabled={!canUseInput} />
        <button type="button" className="sb-btn" onClick={toggleEmoji} disabled={!canUseInput} aria-label="Emoji">🙂</button>
        <button type="submit" className="sb-btn send" disabled={!canUseInput}>📣</button>
        {emojiOpen && (
          <div className="rc-emoji-panel" role="menu" aria-label="Emoji picker" style={{ right: 12, bottom: 60 }}>
            <div className="rc-emoji-title">Emoji</div>
            <div className="rc-emoji-grid">{EMOJI_PICKER.map((e) => (<button key={e} type="button" className="rc-emoji-item" onClick={() => insertEmoji(e)} aria-label={`Insert ${e}`}>{e}</button>))}</div>
          </div>
        )}
      </form>
    </div>
    );
  };

  return (
    <div className={className ?? ''}>
      <style dangerouslySetInnerHTML={{ __html: CHAT_CSS }} />
      {variant === 'forum' ? renderForum() : variant === 'classic' ? renderClassic() : renderShoutbox()}

      {epochReady && needNick && nick && (
        <div className="nick-back" role="dialog" aria-modal="true">
          <div className="nick-card">
            <div style={{ fontWeight: 700, fontSize: 16 }}>Выберите ник</div>
            <div className="nick-warn">Ник задаётся один раз. Сменить его потом нельзя.</div>
            <div className="nick-row">
              <input className="nick-input" value={nickDraft} onChange={(e) => setNickDraft(e.target.value)} maxLength={80} placeholder="Ваш ник…" autoFocus />
              <button type="button" className="nick-btn" onClick={() => setNickDraft(suggestNick())}>🎲</button>
              <button type="button" className="nick-btn" onClick={confirmNick}>Ок</button>
            </div>
            <div>
              {Array.from({ length: 5 }).map((_, i) => (<span key={i} className="nick-pill" onClick={() => setNickDraft(suggestNick())}>🎲 Случайный</span>))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
