// Simple local email verification helper (client-side only)

const NS = 'forum:email_verify:';

export function requestEmailCode(email: string): string {
  const code = String(Math.floor(100000 + Math.random() * 900000));
  const payload = { code, issuedAt: Date.now() };
  try { localStorage.setItem(NS + email.toLowerCase(), JSON.stringify(payload)); } catch {}
  // In a real implementation, the backend would send this code by email.
  console.info('[email-verify] code for', email, '=>', code);
  return code;
}

export function verifyEmailCode(email: string, input: string, ttlMs = 15 * 60 * 1000): boolean {
  try {
    const raw = localStorage.getItem(NS + email.toLowerCase());
    if (!raw) return false;
    const data = JSON.parse(raw);
    if (Date.now() - (data.issuedAt || 0) > ttlMs) return false;
    const ok = String(data.code) === String(input).trim();
    if (ok) try { localStorage.setItem('forum:email_verified:' + email.toLowerCase(), '1'); } catch {}
    return ok;
  } catch { return false; }
}

export function isEmailVerified(email: string): boolean {
  try { return localStorage.getItem('forum:email_verified:' + email.toLowerCase()) === '1'; } catch { return false; }
}

