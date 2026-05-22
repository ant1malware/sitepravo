// src/lib/asset.ts
// Стабильно формирует URL с учетом BASE_URL (например '/pravo/' на GitHub Pages).
export const asset = (p: string) => {
  const base = (import.meta as any).env?.BASE_URL || import.meta.env.BASE_URL || '/';
  const clean = String(p || '').replace(/^\/+/, '');
  return `${base}${clean}`;
};

