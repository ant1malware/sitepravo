import React from 'react';

type Props = {
  onToken: (token: string | null) => void;
  className?: string;
};

// Minimal wrapper: tries reCAPTCHA v3 (if VITE_RECAPTCHA_SITE_KEY set),
// otherwise falls back to a simple math challenge.
export default function RecaptchaGate({ onToken, className }: Props) {
  const siteKey = (import.meta as any).env?.VITE_RECAPTCHA_SITE_KEY || '';
  const [ready, setReady] = React.useState(false);
  const [math, setMath] = React.useState<{ a: number; b: number; answer?: string } | null>(null);

  React.useEffect(() => {
    if (!siteKey) {
      // fallback math captcha
      const a = 1 + Math.floor(Math.random() * 9);
      const b = 1 + Math.floor(Math.random() * 9);
      setMath({ a, b, answer: '' });
      setReady(true);
      return;
    }
    // load recaptcha v3 script
    const id = 'recaptcha-v3';
    if (document.getElementById(id)) { setReady(true); return; }
    const s = document.createElement('script');
    s.id = id;
    s.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`;
    s.async = true; s.defer = true;
    s.onload = () => setReady(true);
    s.onerror = () => { setReady(true); };
    document.head.appendChild(s);
  }, [siteKey]);

  async function runRecaptcha() {
    try {
      // @ts-ignore
      const grecaptcha = (window as any).grecaptcha;
      if (!grecaptcha || !siteKey) return onToken(null);
      const token = await grecaptcha.execute(siteKey, { action: 'submit' });
      onToken(token || null);
    } catch { onToken(null); }
  }

  if (!ready) return <div className={className || ''} />;

  if (math) {
    const ok = String(Number(math.answer)) === String(math.a + math.b);
    return (
      <div className={className || ''}>
        <label className="flex items-center gap-2 text-xs">
          <span>Антиспам:</span>
          <span className="rounded bg-white/10 px-2 py-1">{math.a} + {math.b} =</span>
          <input className="input w-16" value={math.answer || ''} onChange={(e) => setMath({ ...math, answer: e.target.value })} />
          <button type="button" className="btn" onClick={() => onToken(ok ? 'math_ok' : null)}>Проверить</button>
        </label>
      </div>
    );
  }

  return (
    <div className={className || ''}>
      <button type="button" className="btn" onClick={runRecaptcha}>Проверка reCAPTCHA</button>
    </div>
  );
}

