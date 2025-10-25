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
} from './theme';

import { asset } from './lib/asset';
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
import { getDefaultFeed, setDefaultFeed, type FeedType } from './store/feedPrefs';

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

  const root = document.documentElement;

  React.useEffect(() => {
    if (bgSel === 'none') forceBodyBackground(undefined);
    else forceBodyBackground(PRESET_BG[bgSel], bgFixed, bgOverlay, bgSmart);
  }, [bgSel, bgOverlay, bgFixed, bgSmart]);

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

  const onAnimToggle = (on: boolean) => {
    setAnimationsOn(on);
    try { applyAnimations(on); } catch {}
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
    if (id === 'none') forceBodyBackground(undefined);
    else forceBodyBackground(PRESET_BG[id], bgFixed, bgOverlay, bgSmart);
  };
  const onOverlayChange = (value: number) => {
    const v = Math.max(0, Math.min(0.85, value));
    setBgOverlay(v);
    try { localStorage.setItem('bg_overlay', String(v)); } catch {}
    if (bgSel !== 'none') forceBodyBackground(PRESET_BG[bgSel], bgFixed, v, bgSmart);
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
    ['bg_preset', 'bg_overlay', 'bg_fixed', 'bg_smart', 'accent_custom'].forEach(k => localStorage.removeItem(k));
    try { applyTheme(systemPrefersDark() ? 'dark' : 'light'); } catch {}
    try { applyAccent('indigo'); } catch {}
    setAccent('indigo');
    setAccentCustom('#6366F1');
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
  const HeroShell: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className }) => (
    <section className={`card settings-hero settings-hero--classic ${className ?? ''}`}>{children}</section>
  );

  const Panel: React.FC<React.PropsWithChildren<{ title: string; desc?: string; className?: string }>> = ({ title, desc, className, children }) => {
    const body = (
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold tracking-tight text-[color:var(--text-1)]">{title}</h2>
          {desc && <p className="text-sm text-[color:var(--text-2)]">{desc}</p>}
        </div>
        <div className="flex flex-col gap-4">{children}</div>
      </div>
    );
    return (<section className={`card settings-panel settings-panel--classic ${className ?? ''}`}>{body}</section>);
  };

  // Render
  return (
    <div className="settings-shell">
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
              <p className="settings-hero__subtitle">Управляйте темой, фоном, шрифтами и визуальными эффектами. Все изменения применяются мгновенно.</p>
            </div>
            <div className="settings-hero__stats">
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
          <Panel title="Тема" desc="Переключайтесь между системной, светлой и тёмной темой.">
            <div className="flex flex-col gap-3">
              <span className="settings-label">Тема интерфейса</span>
              <div className="settings-seg">
                <button type="button" className="settings-seg__item" onClick={onThemeSystem}>Системная</button>
                <button type="button" className="settings-seg__item" onClick={onThemeLight}>Светлая</button>
                <button type="button" className="settings-seg__item" onClick={onThemeDark}>Тёмная</button>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <span className="settings-label">Анимации интерфейса</span>
              <div className="settings-seg">
                <button type="button" className={`settings-seg__item ${animationsOn ? 'is-active' : ''}`} onClick={() => onAnimToggle(true)}>Включены</button>
                <button type="button" className={`settings-seg__item ${!animationsOn ? 'is-active' : ''}`} onClick={() => onAnimToggle(false)}>Отключены</button>
              </div>
              <p className="settings-help">Отключает анимации и переходы для более статичного интерфейса.</p>
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
                  <button
                    key={name}
                    className={`accent-swatch ${accent === name ? 'is-active' : ''}`}
                    style={{ ['--sw1' as any]: palette?.[500], ['--sw2' as any]: palette?.[600] }}
                    title={name}
                    onClick={() => onAccentName(name)}
                  />
                );
              })}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <input type="color" value={accentCustom} onChange={(e) => onAccentHex(e.target.value)} className="input w-24" title="Пользовательский акцент" />
              <input type="text" value={accentCustom} onChange={(e) => onAccentHex(e.target.value)} className="input w-40" placeholder="#RRGGBB" />
              <button type="button" className="btn btn-primary" onClick={() => onAccentHex(accentCustom)}>Применить</button>
            </div>
          </Panel>

          <Panel title="Сброс" desc="Сбросить настройки темы и интерфейса к значениям по умолчанию.">
            <button type="button" onClick={onReset} className="btn btn-primary">Сбросить персонализацию</button>
          </Panel>
        </main>
      </div>
    </div>
  );
}

const FEED_CHOICES: Array<{ id: FeedType; label: string; title?: string }> = [
  { id: 'latest', label: 'свежее', title: 'Свежие обсуждения по активности' },
  { id: 'hot', label: 'горячее', title: 'Темы с наибольшим откликом' },
  { id: 'new', label: 'новые темы', title: 'Самые свежие публикации' },
  { id: 'following', label: 'подписки', title: 'Обновления от тех, на кого вы подписаны' },
  { id: 'questions', label: 'вопросы', title: 'При входе будет открываться страница вопросов' },
];

function FeedSelector() {
  const [def, setDef] = React.useState<FeedType>(() => {
    try { return getDefaultFeed(); } catch { return 'latest'; }
  });
  const select = (value: FeedType) => {
    setDef(value);
    setDefaultFeed(value);
  };
  return (
    <div className="flex flex-wrap items-center gap-2">
      {FEED_CHOICES.map(({ id, label, title }) => (
        <button
          key={id}
          type="button"
          className={`tab ${def === id ? 'tab-active' : ''}`}
          onClick={() => select(id)}
          title={title}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
