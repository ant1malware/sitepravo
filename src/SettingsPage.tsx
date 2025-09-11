import React from 'react';
import { Link } from 'react-router-dom';
import {
  ACCENTS, applyAccent, applyTheme, systemPrefersDark, getStoredAccent, type Accent,
  setCustomAccent,
} from './theme';
import {
  applyDensity, getDensity, type Density,
  applyFontScale, getFontScale,
  applyShadow, getShadow, type Shadow,
  applyRadius, getRadius, type Radius,
  applyGlass, getGlass,
} from './uiSettings';

/* ====================== ассеты и пресеты фонов ====================== */
// безопасный join BASE_URL + относительный путь (без new URL)
const BASE = (import.meta as any)?.env?.BASE_URL ?? '/';
const asset = (p: string) => {
  const clean = p.replace(/^\//, '');
  return (BASE.endsWith('/') ? BASE : BASE + '/') + clean;
};

// доступные ключи фонов
type BgKey = 'bg1' | 'bg2' | 'bg3' | 'bg4' | 'bg5';
const BG_KEYS: readonly BgKey[] = ['bg1', 'bg2', 'bg3', 'bg4', 'bg5'] as const;

// карты «ключ → путь»
const PRESET_BG: Record<BgKey, string> = {
  bg1: asset('img/bg1.png'),
  bg2: asset('img/bg2.png'),
  bg3: asset('img/bg3.png'),
  bg4: asset('img/bg4.png'),
  bg5: asset('img/bg5.png'),
};

/* ====================== мини-UI хелперы ====================== */
const Card: React.FC<React.PropsWithChildren<{ title: string; desc?: string }>> = ({ title, desc, children }) => (
  <section className="card">
    <h2 className="mb-1 text-base font-semibold">{title}</h2>
    {desc && <p className="mb-3 text-xs text-zinc-500 dark:text-zinc-400">{desc}</p>}
    {children}
  </section>
);
const Seg: React.FC<React.PropsWithChildren<{}>> = ({ children }) => <div className="seg">{children}</div>;
const SegItem: React.FC<React.PropsWithChildren<{ active?: boolean; onClick?: () => void }>> = ({ active, onClick, children }) => (
  <button type="button" className="seg-item" aria-pressed={active} onClick={onClick}>{children}</button>
);

/* ====================== фон страницы ====================== */
function ensureBaseTransparency() {
  document.documentElement.style.setProperty('background-color', 'transparent', 'important');
  document.body.style.setProperty('background-color', 'transparent', 'important');
}
function makeScrim(alpha: number, smart: boolean) {
  const a = Math.max(0, Math.min(0.85, alpha));
  if (!smart) return `linear-gradient(rgba(0,0,0,${a}), rgba(0,0,0,${a}))`;
  const mid = Math.max(0, a - 0.15);
  const edge = Math.min(0.95, a + 0.15);
  return `radial-gradient(1200px 900px at 50% -10%, rgba(0,0,0,${mid}) 0%, rgba(0,0,0,${a}) 55%, rgba(0,0,0,${edge}) 100%)`;
}
const isMobile = () =>
  typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

/** Многослойный background на <body> (скрим + картинка). На мобилках отключаем fixed. */
function forceBodyBackground(url?: string, fixed = true, alpha = 0.35, smart = true) {
  ensureBaseTransparency();
  const b = document.body;
  if (!url) {
    b.style.setProperty('background', 'transparent', 'important');
    return;
  }
  const scrim = makeScrim(alpha, smart);
  const attach = fixed && !isMobile() ? 'fixed' : 'scroll';
  const layers = `${scrim}, url("${url}") center / cover no-repeat ${attach}`;
  b.style.setProperty('background', layers, 'important');
}

/* ====================== страница настроек ====================== */
export default function SettingsPage() {
  // тема/акцент
  const [accent, setAccent] = React.useState<Accent>(() => getStoredAccent() ?? 'indigo');
  const [accentCustom, setAccentCustom] = React.useState<string>(() => localStorage.getItem('accent_custom') || '#6366F1');

  // UI
  const [density, setDensity] = React.useState<Density>(() => getDensity());
  const [fontScale, setFontScale] = React.useState<number>(() => getFontScale());
  const [shadow, setShadow] = React.useState<Shadow>(() => getShadow());
  const [radius, setRadius] = React.useState<Radius>(() => getRadius());
  const [glass, setGlass] = React.useState<number>(() => getGlass());

  // фоны
  type BgSel = 'none' | BgKey;
  const [bgSel, setBgSel] = React.useState<BgSel>(() => ((localStorage.getItem('bg_preset') as BgSel) || 'none'));
  const [bgOverlay, setBgOverlay] = React.useState<number>(() => Number(localStorage.getItem('bg_overlay') || 0.35));
  const [bgFixed, setBgFixed] = React.useState<boolean>(() => localStorage.getItem('bg_fixed') !== '0');
  const [bgSmart, setBgSmart] = React.useState<boolean>(() => localStorage.getItem('bg_smart') !== '0');

  // применяем фон при изменениях
  React.useEffect(() => {
    if (bgSel === 'none') forceBodyBackground(undefined);
    else forceBodyBackground(PRESET_BG[bgSel], bgFixed, bgOverlay, bgSmart);
  }, [bgSel, bgOverlay, bgFixed, bgSmart]);

  // фолбэки переменных (если твои apply* не трогают CSS-переменные)
  const root = document.documentElement;
  const setShadowFallback = (s: Shadow) => {
    root.classList.remove('ui-shadow-none','ui-shadow-soft','ui-shadow-strong');
    root.classList.add(`ui-shadow-${s}`);
  };
  const setRadiusFallback = (r: Radius) => {
    root.classList.remove('ui-radius-subtle','ui-radius-standard','ui-radius-rounded');
    root.classList.add(`ui-radius-${r}`);
  };
  const setGlassFallback = (v: number) => {
    root.classList.add('has-glass');
    root.style.setProperty('--glass-blur', `${v}px`);
  };
  const setAccentFallback = (a: Accent) => {
    const pal = (ACCENTS as any)[a];
    if (pal?.[500] && pal?.[600]) {
      root.style.setProperty('--accent-500', pal[500]);
      root.style.setProperty('--accent-600', pal[600]);
    }
  };
  React.useEffect(() => {
    setShadowFallback(shadow);
    setRadiusFallback(radius);
    setGlassFallback(glass);
    setAccentFallback(accent);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* handlers */
  const onThemeSystem = () => { try { localStorage.removeItem('theme'); applyTheme(systemPrefersDark() ? 'dark' : 'light'); } catch {} };
  const onThemeLight  = () => { try { applyTheme('light'); } catch {} };
  const onThemeDark   = () => { try { applyTheme('dark'); } catch {} };

  const onAccentName = (a: Accent) => { setAccent(a); try { applyAccent(a); } catch {}; setAccentFallback(a); };
  const onAccentHex  = (hex: string) => {
    setAccentCustom(hex);
    try { setCustomAccent(hex); applyAccent(accent); } catch {}
    root.style.setProperty('--accent-500', hex);
    root.style.setProperty('--accent-600', hex);
  };

  const onBgPreset = (id: BgSel) => {
    setBgSel(id);
    try { localStorage.setItem('bg_preset', id); } catch {}
    if (id === 'none') forceBodyBackground(undefined);
    else forceBodyBackground(PRESET_BG[id], bgFixed, bgOverlay, bgSmart);
  };
  const onOverlayChange = (v: number) => {
    const value = Math.max(0, Math.min(0.85, v));
    setBgOverlay(value);
    try { localStorage.setItem('bg_overlay', String(value)); } catch {}
    if (bgSel !== 'none') forceBodyBackground(PRESET_BG[bgSel], bgFixed, value, bgSmart);
  };
  const onFixedToggle = (v: boolean) => {
    setBgFixed(v);
    try { localStorage.setItem('bg_fixed', v ? '1' : '0'); } catch {}
    if (bgSel !== 'none') forceBodyBackground(PRESET_BG[bgSel], v, bgOverlay, bgSmart);
  };
  const onSmartToggle = (v: boolean) => {
    setBgSmart(v);
    try { localStorage.setItem('bg_smart', v ? '1' : '0'); } catch {}
    if (bgSel !== 'none') forceBodyBackground(PRESET_BG[bgSel], bgFixed, bgOverlay, v);
  };

  const setDensityUI = (d: Density) => { setDensity(d); try { applyDensity(d); } catch {} };
  const setFontScaleUI = (v: number) => { setFontScale(v); try { applyFontScale(v); } catch {} };
  const setShadowUI = (s: Shadow) => { setShadow(s); try { applyShadow(s); } catch {}; setShadowFallback(s); };
  const setRadiusUI = (r: Radius) => { setRadius(r); try { applyRadius(r); } catch {}; setRadiusFallback(r); };
  const setGlassUI = (v: number) => { setGlass(v); try { applyGlass(v); } catch {}; setGlassFallback(v); };

  const onReset = () => {
    ['bg_preset','bg_overlay','bg_fixed','bg_smart','accent_custom'].forEach(k => localStorage.removeItem(k));
    try { applyTheme(systemPrefersDark() ? 'dark' : 'light'); } catch {}
    try { applyAccent('indigo'); } catch {}
    forceBodyBackground(undefined, true, 0.35, true);

    setAccent('indigo');
    setAccentCustom('#6366F1');
    setBgSel('none'); setBgOverlay(0.35); setBgFixed(true); setBgSmart(true);
    setDensityUI('standard'); setFontScaleUI(100);
    setShadowUI('soft'); setRadiusUI('standard'); setGlassUI(8);
  };

  const ACCENT_KEYS = Object.keys(ACCENTS) as Accent[];

  return (
    <div className="min-h-screen text-zinc-900 dark:text-zinc-100 relative">
      <div className="relative z-[var(--app-content-z,1)]">

        <header className="sticky top-0 z-20 border-b border-zinc-200 dark:border-zinc-800 glass">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
            <Link to="/" className="text-sm font-medium text-zinc-700 underline decoration-dotted hover:no-underline dark:text-zinc-200">
              На главную
            </Link>
            <h1 className="text-lg font-bold tracking-tight">Настройки</h1>
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-4 py-6">
          <div className="grid gap-4 md:grid-cols-2">

            {/* Тема */}
            <Card title="Тема" desc="Светлая / тёмная / системная.">
              <Seg>
                <SegItem onClick={onThemeSystem}>Системная</SegItem>
                <SegItem onClick={onThemeLight}>Светлая</SegItem>
                <SegItem onClick={onThemeDark}>Тёмная</SegItem>
              </Seg>
            </Card>

            {/* Карточки */}
            <Card title="Карточки" desc="Тени, скругления и «стекло» (размытие под шапкой).">
              <div className="mb-3">
                <div className="mb-1 text-xs text-zinc-500 dark:text-zinc-400">Тени</div>
                <Seg>
                  <SegItem active={shadow==='none'} onClick={()=>setShadowUI('none')}>Нет</SegItem>
                  <SegItem active={shadow==='soft'} onClick={()=>setShadowUI('soft')}>Мягкие</SegItem>
                  <SegItem active={shadow==='strong'} onClick={()=>setShadowUI('strong')}>Сильные</SegItem>
                </Seg>
              </div>
              <div className="mb-3">
                <div className="mb-1 text-xs text-zinc-500 dark:text-zinc-400">Скругления</div>
                <Seg>
                  <SegItem active={radius==='subtle'} onClick={()=>setRadiusUI('subtle')}>Аккуратные</SegItem>
                  <SegItem active={radius==='standard'} onClick={()=>setRadiusUI('standard')}>Стандарт</SegItem>
                  <SegItem active={radius==='rounded'} onClick={()=>setRadiusUI('rounded')}>Круглые</SegItem>
                </Seg>
              </div>
              <div>
                <label className="mb-1 block text-xs text-zinc-500 dark:text-zinc-400">
                  «Стекло» (шапка): <span className="font-medium">{glass}px</span>
                </label>
                <input
                  type="range" min={0} max={24} step={1} value={glass}
                  onChange={(e)=>setGlassUI(parseInt(e.target.value))}
                  className="slider" style={{ color: 'var(--accent-600)' }}
                />
              </div>
            </Card>

            {/* Акцент */}
            <Card title="Акцент" desc="Цвет активных элементов. Выбери из палитры или задай свой.">
              <div className="accent-grid mb-3">
                {ACCENT_KEYS.map((name) => {
                  const pal: any = (ACCENTS as any)[name];
                  return (
                    <button
                      key={name}
                      className={`accent-swatch ${accent===name ? 'is-active' : ''}`}
                      style={{ ['--sw1' as any]: pal?.[500], ['--sw2' as any]: pal?.[600] }}
                      title={name}
                      onClick={()=>onAccentName(name)}
                    />
                  );
                })}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={accentCustom}
                  onChange={(e)=>onAccentHex(e.target.value)}
                  className="input w-24"
                  title="Пользовательский акцент"
                />
                <input
                  type="text"
                  value={accentCustom}
                  onChange={(e)=>onAccentHex(e.target.value)}
                  className="input w-40"
                  placeholder="#RRGGBB"
                />
                <button type="button" className="btn btn-primary" onClick={()=>onAccentHex(accentCustom)}>Применить</button>
              </div>
            </Card>

            {/* Фон */}
            <Card title="Фон" desc="Файлы лежат в /public/img. Работает и в тёмной теме.">
              <div className="grid grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={()=>onBgPreset('none')}
                  className={`h-20 w-full rounded-lg border ${bgSel==='none' ? 'ring-2 ring-[var(--accent-600)]' : ''}`}
                >Нет фона</button>

                {BG_KEYS.map(id => (
                  <button
                    key={id}
                    type="button"
                    title={id.toUpperCase()}
                    onClick={()=>onBgPreset(id)}
                    className={`h-20 w-full rounded-lg border ${bgSel===id ? 'ring-2 ring-[var(--accent-600)]' : ''}`}
                    style={{ backgroundImage: `url("${PRESET_BG[id]}")`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                  />
                ))}
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <div>
                  <div className="mb-1 text-xs text-zinc-500 dark:text-zinc-400">
                    Затемнение: <span className="font-medium">{Math.round(bgOverlay*100)}%</span>
                  </div>
                  <input
                    type="range" min={0} max={0.85} step={0.05} value={bgOverlay}
                    onChange={(e)=>onOverlayChange(parseFloat(e.target.value))}
                    className="slider" style={{ color: 'var(--accent-600)' }}
                  />
                </div>
                <label className="mt-1 inline-flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={bgFixed} onChange={(e)=>onFixedToggle(e.target.checked)} />
                  Фиксировать фон
                </label>
                <label className="mt-1 inline-flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={bgSmart} onChange={(e)=>onSmartToggle(e.target.checked)} />
                  Умное затемнение
                </label>
              </div>
            </Card>

            {/* Сброс */}
            <Card title="Сброс" desc="Вернуть аккуратные дефолты.">
              <button type="button" onClick={onReset} className="btn btn-primary">Сбросить настройки</button>
            </Card>

          </div>
        </main>
      </div>
    </div>
  );
}
