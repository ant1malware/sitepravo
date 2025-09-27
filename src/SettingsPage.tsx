import React from 'react';
import { Link } from 'react-router-dom';
import {
  ACCENTS,
  applyAccent,
  applyTheme,
  systemPrefersDark,
  getStoredAccent,
  type Accent,
  setCustomAccent,
  BACKGROUNDS,
  applyStyleMode,
  getStoredStyleMode,
  type StyleMode,
  type LiquidTone,
  applyLiquidTone,
  getStoredLiquidTone,
} from './theme';

import { asset } from './lib/asset';
import LiquidGlass from './components/LiquidGlass';
import { randomBase32, verifyTotp } from './lib/totp';

import {
  applyDensity,
  getDensity,
  type Density,
  applyFontScale,
  getFontScale,
  applyShadow,
  getShadow,
  type Shadow,
  applyRadius,
  getRadius,
  type Radius,
  applyGlass,
  getGlass,
  applyAnimations,
  getAnimationsOn,
} from './uiSettings';
// Buddy (Chebzik) controls
import { getBuddyEnabled, setBuddyEnabled, getBuddySkin, setBuddySkin } from './uiSettings';

// Classic background previews
type BgKey = keyof typeof BACKGROUNDS;
const BG_KEYS: readonly BgKey[] = Object.keys(BACKGROUNDS) as BgKey[];
const PRESET_BG: Record<BgKey, string> = {
  bg1: asset('img/bg1.png'),
  bg2: asset('img/bg2.png'),
  bg3: asset('img/bg3.png'),
  bg4: asset('img/bg4.png'),
  bg5: asset('img/bg5.png'),
};

export default function SettingsPage() {
  const [accent, setAccent] = React.useState<Accent>(() => getStoredAccent() ?? 'indigo');
  const [accentCustom, setAccentCustom] = React.useState<string>(() => localStorage.getItem('accent_custom') || '#6366F1');
  const [styleMode, setStyleMode] = React.useState<StyleMode>(() => getStoredStyleMode() ?? 'classic');

  const [density, setDensity] = React.useState<Density>(() => getDensity());
  const [fontScale, setFontScale] = React.useState<number>(() => getFontScale());
  const [shadow, setShadow] = React.useState<Shadow>(() => getShadow());
  const [radius, setRadius] = React.useState<Radius>(() => getRadius());
  const [glass, setGlass] = React.useState<number>(() => getGlass());
  const [animationsOn, setAnimationsOn] = React.useState<boolean>(() => getAnimationsOn());
  // Security (local)
  const [twoFAEnabled, setTwoFAEnabled] = React.useState<boolean>(() => (localStorage.getItem('forum:2fa_enabled') === '1'));
  const [twoFASecret, setTwoFASecret] = React.useState<string>(() => localStorage.getItem('forum:2fa_secret') || '');
  const [twoFATestCode, setTwoFATestCode] = React.useState('');

  type BgSel = 'none' | BgKey;
  const [bgSel, setBgSel] = React.useState<BgSel>(() => ((localStorage.getItem('bg_preset') as BgSel) || 'none'));
  const [bgOverlay, setBgOverlay] = React.useState<number>(() => Number(localStorage.getItem('bg_overlay') || 0.35));
  const [bgFixed, setBgFixed] = React.useState<boolean>(() => localStorage.getItem('bg_fixed') !== '0');
  const [bgSmart, setBgSmart] = React.useState<boolean>(() => localStorage.getItem('bg_smart') !== '0');

  const isLiquid = styleMode === 'liquid';
  const [liquidTone, setLiquidTone] = React.useState<LiquidTone>(() => getStoredLiquidTone());
  const root = document.documentElement;

  // Classic: apply selected background
  React.useEffect(() => {
    if (isLiquid) return;
    if (bgSel === 'none') forceBodyBackground(undefined);
    else forceBodyBackground(PRESET_BG[bgSel], bgFixed, bgOverlay, bgSmart);
  }, [bgSel, bgOverlay, bgFixed, bgSmart, isLiquid]);

  // In Liquid we do not force body background
  React.useEffect(() => {
    if (isLiquid) forceBodyBackground(undefined);
  }, [isLiquid]);

  // Fallback helper classes/tokens
  const setShadowFallback = (s: Shadow) => {
    root.classList.remove('ui-shadow-none', 'ui-shadow-soft', 'ui-shadow-strong');
    root.classList.add(`ui-shadow-${s}`);
  };
  const setRadiusFallback = (r: Radius) => {
    root.classList.remove('ui-radius-subtle', 'ui-radius-standard', 'ui-radius-rounded');
    root.classList.add(`ui-radius-${r}`);
  };
  const setGlassFallback = (v: number) => {
    root.classList.add('has-glass');
    root.style.setProperty('--glass-blur', `${v}px`);
  };
  const setAccentFallback = (a: Accent) => {
    const palette = (ACCENTS as any)[a];
    if (palette?.[500] && palette?.[600]) {
      root.style.setProperty('--accent-500', palette[500]);
      root.style.setProperty('--accent-600', palette[600]);
    }
  };
  React.useEffect(() => {
    setShadowFallback(shadow);
    setRadiusFallback(radius);
    setGlassFallback(glass);
    setAccentFallback(accent);
  }, []);

  // 2FA helpers
  const onEnable2FA = () => {
    const secret = randomBase32(20);
    setTwoFASecret(secret);
    try { localStorage.setItem('forum:2fa_secret', secret); } catch {}
  };
  const onConfirm2FA = async () => {
    try {
      const ok = await verifyTotp(twoFASecret, twoFATestCode.trim());
      if (!ok) { alert('Неверный код'); return; }
      setTwoFAEnabled(true); localStorage.setItem('forum:2fa_enabled', '1'); alert('2FA включена');
    } catch { alert('Ошибка проверки 2FA'); }
  };
  const onDisable2FA = () => {
    setTwoFAEnabled(false);
    try { localStorage.removeItem('forum:2fa_enabled'); } catch {}
  };

  // Theme / style / background handlers
  const onThemeSystem = () => {
    try { localStorage.removeItem('theme'); applyTheme(systemPrefersDark() ? 'dark' : 'light'); } catch {}
  };
  const onThemeLight = () => { try { applyTheme('light'); } catch {} };
  const onThemeDark = () => { try { applyTheme('dark'); } catch {} };

  const onStyleMode = (mode: StyleMode) => {
    setStyleMode(mode);
    try { applyStyleMode(mode); } catch {}
  };
  const onAnimToggle = (on: boolean) => {
    setAnimationsOn(on);
    try { applyAnimations(on); } catch {}
  };
  const onLiquidTone = (tone: LiquidTone) => {
    setLiquidTone(tone);
    try { applyLiquidTone(tone); } catch {}
  };

  const onAccentName = (a: Accent) => {
    setAccent(a);
    try { applyAccent(a); } catch {}
    setAccentFallback(a);
  };
  const onAccentHex = (hex: string) => {
    setAccentCustom(hex);
    try { setCustomAccent(hex); applyAccent(accent); } catch {}
    root.style.setProperty('--accent-500', hex);
    root.style.setProperty('--accent-600', hex);
  };

  const onBgPreset = (id: BgSel) => {
    setBgSel(id);
    try { localStorage.setItem('bg_preset', id); } catch {}
    if (isLiquid) return;
    if (id === 'none') forceBodyBackground(undefined);
    else forceBodyBackground(PRESET_BG[id], bgFixed, bgOverlay, bgSmart);
  };
  const onOverlayChange = (value: number) => {
    const v = Math.max(0, Math.min(0.85, value));
    setBgOverlay(v);
    try { localStorage.setItem('bg_overlay', String(v)); } catch {}
    if (!isLiquid && bgSel !== 'none') forceBodyBackground(PRESET_BG[bgSel], bgFixed, v, bgSmart);
  };
  const onFixedToggle = (v: boolean) => {
    setBgFixed(v);
    try { localStorage.setItem('bg_fixed', v ? '1' : '0'); } catch {}
    if (!isLiquid && bgSel !== 'none') forceBodyBackground(PRESET_BG[bgSel], v, bgOverlay, bgSmart);
  };
  const onSmartToggle = (v: boolean) => {
    setBgSmart(v);
    try { localStorage.setItem('bg_smart', v ? '1' : '0'); } catch {}
    if (!isLiquid && bgSel !== 'none') forceBodyBackground(PRESET_BG[bgSel], bgFixed, bgOverlay, v);
  };

  const setDensityUI = (d: Density) => { setDensity(d); try { applyDensity(d); } catch {} };
  const setFontScaleUI = (v: number) => { setFontScale(v); try { applyFontScale(v); } catch {} };
  const setShadowUI = (s: Shadow) => { setShadow(s); try { applyShadow(s); } catch {}; setShadowFallback(s); };
  const setRadiusUI = (r: Radius) => { setRadius(r); try { applyRadius(r); } catch {}; setRadiusFallback(r); };
  const setGlassUI = (v: number) => { setGlass(v); try { applyGlass(v); } catch {}; setGlassFallback(v); };

  const onReset = () => {
    ['bg_preset', 'bg_overlay', 'bg_fixed', 'bg_smart', 'accent_custom'].forEach(k => localStorage.removeItem(k));
    try { applyTheme(systemPrefersDark() ? 'dark' : 'light'); } catch {}
    try { applyAccent('indigo'); } catch {}
    setAccent('indigo');
    setAccentCustom('#6366F1');
    setStyleMode('classic');
    try { applyStyleMode('classic'); } catch {}
    setBgSel('none'); setBgOverlay(0.35); setBgFixed(true); setBgSmart(true);
    setDensityUI('standard'); setFontScaleUI(1); setShadowUI('soft'); setRadiusUI('standard'); setGlassUI(8);
  };

  const ACCENT_KEYS = React.useMemo(() => Object.keys(ACCENTS) as Accent[], []);

  // Helpers
  function ensureBaseTransparency() {
    document.documentElement.style.setProperty('background-color', 'transparent', 'important');
    document.body.style.setProperty('background-color', 'transparent', 'important');
  }
  const isMobile = () => typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
  function makeScrim(alpha: number, smart: boolean) {
    const a = Math.max(0, Math.min(0.85, alpha));
    if (!smart) return `linear-gradient(rgba(0,0,0,${a}), rgba(0,0,0,${a}))`;
    const mid = Math.max(0, a - 0.15);
    const edge = Math.min(0.95, a + 0.15);
    return `radial-gradient(1200px 900px at 50% -10%, rgba(0,0,0,${mid}) 0%, rgba(0,0,0,${a}) 55%, rgba(0,0,0,${edge}) 100%)`;
  }
  function forceBodyBackground(url?: string, fixed = true, alpha = 0.35, smart = true) {
    ensureBaseTransparency();
    const body = document.body;
    if (!url) {
      body.style.setProperty('background', 'transparent', 'important');
      body.style.removeProperty('background-size');
      body.style.removeProperty('background-repeat');
      body.style.removeProperty('background-attachment');
      body.style.removeProperty('background-position');
      return;
    }
    const scrim = makeScrim(alpha, smart);
    const attach = fixed && !isMobile() ? 'fixed' : 'scroll';
    body.style.setProperty('background', `${scrim}, url("${url}") center / cover no-repeat ${attach}`, 'important');
  }

  // Shell components
  const HeroShell: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className }) => {
    if (isLiquid) {
      return (
        <LiquidGlass blur={30} gloss={0.88} opacity={0.20} tint="16 18 34" elevation={1.3} interactive={false} animate className={`settings-hero ${className ?? ''}`}>
          {children}
        </LiquidGlass>
      );
    }
    return (<section className={`card settings-hero settings-hero--classic ${className ?? ''}`}>{children}</section>);
  };

  const Panel: React.FC<React.PropsWithChildren<{ title: string; desc?: string; tone?: 'light' | 'accent'; className?: string }>> = ({ title, desc, tone = 'light', className, children }) => {
    const body = (
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold tracking-tight text-[color:var(--text-1)]">{title}</h2>
          {desc && <p className="text-sm text-[color:var(--text-2)]">{desc}</p>}
        </div>
        <div className="flex flex-col gap-4">{children}</div>
      </div>
    );
    if (isLiquid) {
      const palette = tone === 'accent' ? { tint: '32 48 98', opacity: 0.28, gloss: 0.86 } : { tint: '16 18 36', opacity: 0.18, gloss: 0.78 };
      return (
        <LiquidGlass blur={26} gloss={palette.gloss} tint={palette.tint} opacity={palette.opacity} elevation={1.2} animate className={`settings-panel ${className ?? ''}`}>
          {body}
        </LiquidGlass>
      );
    }
    return (<section className={`card settings-panel settings-panel--classic ${className ?? ''}`}>{body}</section>);
  };

  // Render
  return (
    <div className={`settings-shell ${isLiquid ? 'settings-shell--liquid' : ''}`}>
      <div className="settings-shell__inner">
        <header className="settings-breadcrumb">
          <Link to="/" className="settings-breadcrumb__link">Главная</Link>
          <span className="settings-breadcrumb__separator">/</span>
          <span>Настройки</span>
        </header>

        <HeroShell>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="flex flex-col gap-3">
              <span className="settings-hero__badge">Центр персонализации</span>
              <h1 className="settings-hero__title">Подберите настроение интерфейса</h1>
              <p className="settings-hero__subtitle">Управляйте темой, жидким стеклом, шрифтами и визуальными эффектами. Все изменения применяются мгновенно.</p>
            </div>
            <div className="settings-hero__stats">
              <div>
                <span className="settings-hero__stats-label">Жидкое стекло</span>
                <span className="settings-hero__stats-value">{isLiquid ? 'Активно' : 'Выключено'}</span>
              </div>
              <div>
                <span className="settings-hero__stats-label">Плотность</span>
                <span className="settings-hero__stats-value">{density === 'compact' ? 'Компактная' : 'Стандартная'}</span>
              </div>
              <div>
                <span className="settings-hero__stats-label">Тема</span>
                <span className="settings-hero__stats-value">{document.documentElement.classList.contains('dark') ? 'Тёмная' : 'Светлая'}</span>
              </div>
            </div>
          </div>
        </HeroShell>

        <main className="settings-grid">
          <Panel title="Тема и стиль" desc="Переключайтесь между системной, светлой и тёмной темой, а также выбирайте стиль оформления и тон Liquid." tone="accent">
            <div className="flex flex-col gap-3">
              <span className="settings-label">Тема интерфейса</span>
              <div className="settings-seg">
                <button type="button" className="settings-seg__item" onClick={onThemeSystem}>Системная</button>
                <button type="button" className="settings-seg__item" onClick={onThemeLight}>Светлая</button>
                <button type="button" className="settings-seg__item" onClick={onThemeDark}>Тёмная</button>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <span className="settings-label">Стиль оформления</span>
              <div className="settings-seg">
                <button type="button" className={`settings-seg__item ${styleMode === 'classic' ? 'is-active' : ''}`} onClick={() => onStyleMode('classic')}>Classic</button>
                <button type="button" className={`settings-seg__item ${styleMode === 'liquid' ? 'is-active' : ''}`} onClick={() => onStyleMode('liquid')}>Liquid Glass</button>
                <button type="button" className={`settings-seg__item ${styleMode === 'beta' ? 'is-active' : ''}`} onClick={() => onStyleMode('beta')}>Beta</button>
              </div>
              <p className="settings-help">Liquid Glass — глубина и мягкий свет. Beta — экспериментальные неоновые акценты.</p>

              {isLiquid && (
                <div className="mt-3 flex flex-col gap-2">
                  <span className="settings-label">Тон Liquid</span>
                  <div className="settings-seg">
                    <button type="button" className={`settings-seg__item ${liquidTone === 'dark' ? 'is-active' : ''}`} onClick={() => onLiquidTone('dark')}>Тёмный</button>
                    <button type="button" className={`settings-seg__item ${liquidTone === 'light' ? 'is-active' : ''}`} onClick={() => onLiquidTone('light')}>Светлый</button>
                  </div>
                </div>
              )}

              <div className="mt-3 flex flex-col gap-2">
                <span className="settings-label">Анимации Liquid</span>
                <div className="settings-seg">
                  <button type="button" className={`settings-seg__item ${animationsOn ? 'is-active' : ''}`} onClick={() => onAnimToggle(true)}>Включены</button>
                  <button type="button" className={`settings-seg__item ${!animationsOn ? 'is-active' : ''}`} onClick={() => onAnimToggle(false)}>Выключены</button>
                </div>
                <p className="settings-help">Отключает плавучесть и блики стекла.</p>
              </div>
            </div>
          </Panel>

          <Panel title="Безопасность" desc="Антиспам и двухфакторная защита (клиентская)">
            <div className="settings-field">
              <span className="settings-label">Двухфакторная аутентификация</span>
              {!twoFAEnabled ? (
                <div className="grid gap-2">
                  <button type="button" className="btn" onClick={onEnable2FA}>Сгенерировать секрет</button>
                  {twoFASecret && (
                    <>
                      <div className="text-xs opacity-80">Секрет (введите в приложение-аутентификатор):</div>
                      <div className="rounded-xl bg-white/5 p-2 text-sm select-all">{twoFASecret}</div>
                      <div className="flex items-center gap-2">
                        <input className="input w-40" placeholder="Код из приложения" value={twoFATestCode} onChange={(e)=>setTwoFATestCode(e.target.value)} />
                        <button type="button" className="btn btn-primary" onClick={onConfirm2FA}>Подтвердить</button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-sm">2FA включена</span>
                  <button type="button" className="btn" onClick={onDisable2FA}>Выключить</button>
                </div>
              )}
            </div>

            <div className="settings-field">
              <span className="settings-label">Отключить трекинг</span>
              <div className="settings-seg">
                <button type="button" className="settings-seg__item" onClick={() => { try { localStorage.setItem('telemetry_disabled', '1'); alert('Трекинг отключен'); } catch {} }}>Отключить</button>
                <button type="button" className="settings-seg__item" onClick={() => { try { localStorage.removeItem('telemetry_disabled'); alert('Трекинг включен'); } catch {} }}>Включить</button>
              </div>
            </div>
          </Panel>

          <Panel title="Чебзик" desc="Летает по сайту и подсказывает. Можно отключить при желании.">
            <div className="flex flex-wrap items-center gap-2">
              <Link to="/buddy" className="btn btn-primary">Показать сцену</Link>
              <label className="settings-checkbox">
                <input type="checkbox" checked={(() => { try { return getBuddyEnabled(); } catch { return true; } })()} onChange={(e) => { try { setBuddyEnabled(e.target.checked); } catch {} }} />
                Показать Чебзика
              </label>
              <span className="text-sm text-[color:var(--text-2)]">Можно отключить. Синхронизируйте цвета со скином из игры.</span>
            </div>
            <div className="mt-3 grid items-center gap-3 sm:grid-cols-[auto_auto_1fr]">
              <div className="flex items-center gap-2">
                <span className="text-xs opacity-70">Цвет A</span>
                <input type="color" defaultValue={(getBuddySkin() as any).a} onChange={(e) => { try { const s = getBuddySkin(); setBuddySkin(e.target.value, s.b); } catch {} }} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs opacity-70">Цвет B</span>
                <input type="color" defaultValue={(getBuddySkin() as any).b} onChange={(e) => { try { const s = getBuddySkin(); setBuddySkin(s.a, e.target.value); } catch {} }} />
              </div>
              <div className="justify-self-start rounded-xl p-2" style={{ background: `linear-gradient(135deg, ${(getBuddySkin() as any).a}, ${(getBuddySkin() as any).b})` }}>
                <svg width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <radialGradient id="g2" cx="50%" cy="30%" r="70%">
                      <stop offset="0%" stopColor={(getBuddySkin() as any).a} stopOpacity="0.95"/>
                      <stop offset="100%" stopColor={(getBuddySkin() as any).b} stopOpacity="0.85"/>
                    </radialGradient>
                  </defs>
                  <path d="M18 2c6.2 0 11 4.8 11 11v8.5c0 2-1.7 3.7-3.7 3.7-1.3 0-2.6-.7-3.3-1.8-.6 1.1-1.8 1.8-3 1.8s-2.4-.7-3-1.8c-.7 1.1-2 1.8-3.3 1.8-2 0-3.7-1.7-3.7-3.7V13C5 6.8 10 2 16.2 2H18z" fill="url(#g2)" />
                </svg>
              </div>
            </div>
          </Panel>

          <Panel title="Геометрия и эффекты" desc="Настройте плотность интерфейса, радиусы элементов и глубину стекла.">
            <div className="settings-field">
              <span className="settings-label">Плотность элементов</span>
              <div className="settings-seg">
                <button type="button" className={`settings-seg__item ${density === 'standard' ? 'is-active' : ''}`} onClick={() => setDensityUI('standard')}>Стандартная</button>
                <button type="button" className={`settings-seg__item ${density === 'compact' ? 'is-active' : ''}`} onClick={() => setDensityUI('compact')}>Компактная</button>
              </div>
            </div>

            <div className="settings-field">
              <span className="settings-label">Силуэт и тени</span>
              <div className="settings-seg">
                <button type="button" className={`settings-seg__item ${shadow === 'none' ? 'is-active' : ''}`} onClick={() => setShadowUI('none')}>Без тени</button>
                <button type="button" className={`settings-seg__item ${shadow === 'soft' ? 'is-active' : ''}`} onClick={() => setShadowUI('soft')}>Мягкие</button>
                <button type="button" className={`settings-seg__item ${shadow === 'strong' ? 'is-active' : ''}`} onClick={() => setShadowUI('strong')}>Выразительные</button>
              </div>
            </div>

            <div className="settings-field">
              <span className="settings-label">Скругление</span>
              <div className="settings-seg">
                <button type="button" className={`settings-seg__item ${radius === 'subtle' ? 'is-active' : ''}`} onClick={() => setRadiusUI('subtle')}>Сдержанное</button>
                <button type="button" className={`settings-seg__item ${radius === 'standard' ? 'is-active' : ''}`} onClick={() => setRadiusUI('standard')}>Стандартное</button>
                <button type="button" className={`settings-seg__item ${radius === 'rounded' ? 'is-active' : ''}`} onClick={() => setRadiusUI('rounded')}>Закруглённое</button>
              </div>
            </div>
          </Panel>

          <Panel title="Цвет акцента" desc="Выберите основной цвет акцента для кнопок и ссылок.">
            <div className="accent-grid">
              {ACCENT_KEYS.map((name) => {
                const palette: any = (ACCENTS as any)[name];
                return (
                  <button key={name} className={`accent-swatch ${accent === name ? 'is-active' : ''}`} style={{ ['--sw1' as any]: palette?.[500], ['--sw2' as any]: palette?.[600] }} title={name} onClick={() => onAccentName(name)} />
                );
              })}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <input type="color" value={accentCustom} onChange={(e) => onAccentHex(e.target.value)} className="input w-24" title="Пользовательский акцент" />
              <input type="text" value={accentCustom} onChange={(e) => onAccentHex(e.target.value)} className="input w-40" placeholder="#RRGGBB" />
              <button type="button" className="btn btn-primary" onClick={() => onAccentHex(accentCustom)}>Применить</button>
            </div>
          </Panel>

          <Panel title="Фон и обои" desc="Настройте фон для классического стиля. В режиме Liquid фон не изменяется.">
            {isLiquid && (<p className="settings-help">В режиме Liquid Glass фон берётся из темы/настроек пользователя.</p>)}

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <button type="button" onClick={() => onBgPreset('none')} className={`settings-bg-tile ${bgSel === 'none' ? 'is-active' : ''}`}>
                <span>Без фона</span>
              </button>
              {BG_KEYS.map((id) => (
                <button key={id} type="button" title={id.toUpperCase()} onClick={() => onBgPreset(id)} className={`settings-bg-tile ${bgSel === id ? 'is-active' : ''}`} style={{ backgroundImage: `url("${PRESET_BG[id]}")` }} />
              ))}
            </div>

            {!isLiquid && (
              <div className="settings-bg-controls">
                <div>
                  <span className="settings-label">Интенсивность затемнения</span>
                  <input type="range" min={0} max={0.85} step={0.05} value={bgOverlay} onChange={(e) => onOverlayChange(parseFloat(e.target.value))} className="slider" />
                </div>
                <label className="settings-checkbox"><input type="checkbox" checked={bgFixed} onChange={(e) => onFixedToggle(e.target.checked)} /> Фиксированный фон</label>
                <label className="settings-checkbox"><input type="checkbox" checked={bgSmart} onChange={(e) => onSmartToggle(e.target.checked)} /> Умное затемнение</label>
              </div>
            )}
          </Panel>

          <Panel title="Сброс" desc="Сбросить настройки темы и интерфейса к значениям по умолчанию.">
            <button type="button" onClick={onReset} className="btn btn-primary">Сбросить персонализацию</button>
          </Panel>

          <Panel title="Чебзик" desc="Мини-игра с нашим мультяшным другом. Кормите его и общайтесь!">
            <div className="flex flex-wrap items-center gap-2">
              <Link to="/buddy" className="btn btn-primary">Открыть игру</Link>
              <span className="text-sm text-[color:var(--text-2)]">Игра открывается на отдельной странице.</span>
            </div>
          </Panel>
        </main>
      </div>
    </div>
  );
}
