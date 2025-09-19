import React from 'react';

// A tiny, friendly ghost-like buddy that wanders around the viewport.
// Non-intrusive: small, semi-transparent, respects reduced motion and the global anim-off switch.

// Always visible buddy (no persistent off switch)
const PHRASES = [
  'Я здесь! 👻',
  'Как дела? ✨',
  'Нажми Ctrl K — откроется поиск!',
  'Люблю стекло и печеньки 🍪',
  'Сегодня отличный день!',
  'Хочешь поиграть? → вкладка Чебзик',
  'Сияю и не мешаю ✨',
  'Кликни ещё!'
];

function usePrefersReducedMotion(): boolean {
  const [prefers, setPrefers] = React.useState(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });
  React.useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const q = window.matchMedia('(prefers-reduced-motion: reduce)');
    const h = (e: MediaQueryListEvent) => setPrefers(e.matches);
    setPrefers(q.matches);
    if (typeof q.addEventListener === 'function') q.addEventListener('change', h);
    else if ((q as any).addListener) (q as any).addListener(h);
    return () => {
      if (typeof q.removeEventListener === 'function') q.removeEventListener('change', h);
      else if ((q as any).removeListener) (q as any).removeListener(h);
    };
  }, []);
  return prefers;
}

export default function Buddy() {
  const [bubble, setBubble] = React.useState<string | null>(null);
  const phraseIdx = React.useRef<number>(Math.floor(Math.random() * PHRASES.length));

  // avoid in print
  if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('print').matches) return null;

  const prefersReduced = usePrefersReducedMotion();
  const animOff = typeof document !== 'undefined' && document.documentElement.classList.contains('anim-off');
  const movingAllowed = !prefersReduced && !animOff;

  const ref = React.useRef<HTMLDivElement | null>(null);
  const pressTimer = React.useRef<number | null>(null);

  React.useEffect(() => {
    const el = ref.current; if (!el) return;
    let raf = 0;
    let tPrev = performance.now();
    let x = Math.random() * (window.innerWidth - 64) + 16;
    let y = Math.random() * (window.innerHeight - 120) + 60; // keep away from topbar
    let vx = (Math.random() * 60 + 30) * (Math.random() > 0.5 ? 1 : -1); // px/s
    let vy = (Math.random() * 40 + 20) * (Math.random() > 0.5 ? 1 : -1);

    const step = (t: number) => {
      const dt = Math.min(0.05, (t - tPrev) / 1000);
      tPrev = t;
      if (movingAllowed) {
        x += vx * dt;
        y += vy * dt;
        const margin = 16;
        const W = window.innerWidth;
        const H = window.innerHeight;
        const w = 48, h = 48;
        if (x < margin) { x = margin; vx = Math.abs(vx); }
        if (x > W - w - margin) { x = W - w - margin; vx = -Math.abs(vx); }
        if (y < 60) { y = 60; vy = Math.abs(vy); }
        if (y > H - h - margin) { y = H - h - margin; vy = -Math.abs(vy); }
        // gentle drift change
        vx += (Math.random() - 0.5) * 4;
        vy += (Math.random() - 0.5) * 4;
      }
      el.style.transform = `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`;
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    const onResize = () => { tPrev = performance.now(); };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); };
  }, [movingAllowed]);

  function speak(custom?: string) {
    const text = custom ?? PHRASES[(phraseIdx.current++) % PHRASES.length];
    setBubble(text);
    window.clearTimeout((speak as any)._t);
    (speak as any)._t = window.setTimeout(() => setBubble(null), 3000);
  }

  function onClick(e: React.MouseEvent) {
    speak();
  }

  function onPointerDown() {
    if (pressTimer.current) window.clearTimeout(pressTimer.current);
    pressTimer.current = window.setTimeout(() => speak('Просто нажми, чтобы я говорил!'), 600) as unknown as number;
  }
  function onPointerUp() {
    if (pressTimer.current) { window.clearTimeout(pressTimer.current); pressTimer.current = null; }
  }

  return (
    <div ref={ref} className="buddy" aria-hidden>
      <button
        className="buddy__hit"
        title="Чебзик (клик — сказать, Alt+клик или удержание — скрыть)"
        onClick={onClick}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <svg width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="g" cx="50%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#bcd3ff" stopOpacity="0.95"/>
              <stop offset="100%" stopColor="#6a79ff" stopOpacity="0.85"/>
            </radialGradient>
          </defs>
          <g>
            <path d="M18 2c6.2 0 11 4.8 11 11v8.5c0 2-1.7 3.7-3.7 3.7-1.3 0-2.6-.7-3.3-1.8-.6 1.1-1.8 1.8-3 1.8s-2.4-.7-3-1.8c-.7 1.1-2 1.8-3.3 1.8-2 0-3.7-1.7-3.7-3.7V13C5 6.8 10 2 16.2 2H18z" fill="url(#g)" />
            <circle cx="13.5" cy="13.5" r="2.2" fill="#0b1020"/>
            <circle cx="22.5" cy="13.5" r="2.2" fill="#0b1020"/>
            <circle cx="13" cy="13.2" r=".7" fill="#fff"/>
            <circle cx="22" cy="13.2" r=".7" fill="#fff"/>
            <path d="M12 19c1.8 2.2 6.2 2.2 8 0" stroke="#0b1020" strokeWidth="1.3" strokeLinecap="round" fill="none"/>
          </g>
        </svg>
        {bubble && (
          <div className="buddy__bubble" role="status">{bubble}</div>
        )}
      </button>
    </div>
  );
}
