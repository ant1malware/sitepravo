import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { asset as assetPath } from '../lib/asset';
import { recorders } from '../recorders';

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex items-center gap-3">
    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-zinc-300/60 to-transparent dark:via-zinc-600/60" />
    <h2 className="shrink-0 rounded-full border border-zinc-200/60 bg-zinc-100/70 px-3 py-1 text-sm font-semibold tracking-wide shadow-sm backdrop-blur dark:border-zinc-700/60 dark:bg-zinc-800/60">
      {children}
    </h2>
    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-zinc-300/60 to-transparent dark:via-zinc-600/60" />
  </div>
);

const Card: React.FC<{ title: React.ReactNode; children: React.ReactNode; footer?: React.ReactNode }>
  = ({ title, children, footer }) => (
  <div className="card">
    <div className="mb-2 flex items-center justify-between">
      <h3 className="text-base font-semibold leading-tight">{title}</h3>
    </div>
    <div className="prose prose-zinc max-w-none text-sm leading-relaxed dark:prose-invert">{children}</div>
    {footer && (
      <div className="mt-3 border-t border-zinc-200 pt-3 text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
        {footer}
      </div>
    )}
  </div>
);

const SmartVideo: React.FC<{ sources: { src: string; type: string }[]; className?: string }>
  = ({ sources, className }) => {
  const [supported, setSupported] = useState<null | { src: string; type: string }>(null);
  useEffect(() => {
    let aborted = false;
    (async () => {
      try {
        const v = document.createElement('video');
        const ua = (typeof navigator !== 'undefined' ? navigator.userAgent : '').toLowerCase();
        const isSafari = /safari/.test(ua) && !/chrome|chromium|crios|edg\//.test(ua);
        const candidates = sources.filter((s) => {
          if (s.type === 'video/quicktime' && !isSafari) return false;
          return !!v.canPlayType?.(s.type);
        });
        for (const c of candidates) {
          try {
            const res = await fetch(c.src, { method: 'HEAD' });
            if (aborted) return;
            if (res.ok) { setSupported(c); return; }
          } catch {}
        }
      } catch {}
      if (!aborted) setSupported(null);
    })();
    return () => { aborted = true; };
  }, [JSON.stringify(sources)]);

  if (!supported) {
    return (
      <div className="flex flex-col items-start gap-2 p-3 text-sm">
        <div className="text-zinc-700 dark:text-zinc-300">
          Ваш браузер не поддерживает этот формат видео. Скачайте файл:
        </div>
        <div className="flex flex-wrap gap-2">
          {sources.map((s, i) => (
            <a key={i} className="btn" href={s.src} download>
              Скачать {s.src.split('.').pop()?.toUpperCase()}
            </a>
          ))}
        </div>
      </div>
    );
  }

  return (
    <video controls preload="metadata" className={className} playsInline>
      {sources.map((s, i) => (
        <source key={i} src={s.src} type={s.type} />
      ))}
    </video>
  );
};

export default function ImportantRecordingBlock() {
  return (
    <section className="mb-4 grid grid-cols-1 gap-4">
      <SectionTitle>Важно</SectionTitle>
      <Card
        title={
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>Всегда имейте фиксацию на нарушения!</span>
          </div>
        }
      >
        <div className="prose prose-zinc max-w-none text-sm leading-relaxed dark:prose-invert">
          <p>
            Перед задержанием гражданина и передачей его сотрудникам правоохранительных органов у вас должна быть видеозапись, подтверждающая факт нарушения.
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <div className="rounded-xl border border-zinc-200 p-3 dark:border-zinc-800">
              <div className="mb-2 text-xs font-semibold opacity-70">Популярные программы для видеозаписи экрана</div>
              <div className="flex flex-wrap gap-2 text-sm">
                {recorders.map(r => (
                  <Link key={r.id} className="btn" to={`/recorders/${r.id}`}>{r.name}</Link>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-zinc-200 p-3 dark:border-zinc-800">
              <div className="mb-2 text-xs font-semibold opacity-70">Как подавать рапорты (видео)</div>
              <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
              </div>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}
