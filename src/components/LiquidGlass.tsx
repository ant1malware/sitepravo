import React from 'react';

/* =====================
   Types & Config
===================== */

type DarkTone = 'midnight' | 'graphite' | 'ink' | 'obsidian';

type BaseConfig = {
  blur?: number;
  tint?: string;      // "r g b" — базовый тон стекла (перекрывается tone-пресетом, если он задан)
  opacity?: number;   // 0..1 прозрачность заливки
  gloss?: number;     // 0..1 сила глянца
  border?: number;    // 0..1 внутренняя окантовка
  glints?: boolean;   // статичные мягкие блики
  interactive?: boolean;
  animate?: boolean;  // для data-attr, сам фон не анимируем
  elevation?: number; // мультипликатор внешней тени

  // Новое
  tone?: DarkTone;    // тёмный пресет
  accent?: string;    // "r g b" — акцент для кромки/блума
};

export type LiquidGlassProps = BaseConfig & React.HTMLAttributes<HTMLDivElement>;
export type LiquidGlassButtonProps = BaseConfig & React.ButtonHTMLAttributes<HTMLButtonElement>;

const TONE_MAP: Record<DarkTone, string> = {
  midnight: '10 12 24',  // холодный глубокий
  graphite: '18 20 26',  // чуть светлее, нейтральнее
  ink:      '16 20 38',  // синие нотки
  obsidian: '6 8 16',    // максимально «глубокий»
};

const DEFAULTS: Required<Omit<BaseConfig,
  'tone' | 'accent'
>> & Pick<BaseConfig, 'tone' | 'accent'> = {
  blur: 24,
  tint: '10 12 24',
  opacity: 0.13,
  gloss: 0.88,
  border: 0.55,
  glints: true,
  interactive: true,
  animate: false,
  elevation: 1,
  tone: undefined,
  accent: '88 140 255', // iOS-синий по умолчанию
};

function classNames(...values: Array<string | undefined | false | null>) {
  return values.filter(Boolean).join(' ');
}

/* =====================
   Hooks
===================== */

function usePrefersReducedMotion(): boolean {
  const [prefers, setPrefers] = React.useState(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });
  React.useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (event: MediaQueryListEvent) => setPrefers(event.matches);
    setPrefers(query.matches);
    if (typeof query.addEventListener === 'function') {
      query.addEventListener('change', handler);
      return () => query.removeEventListener('change', handler);
    }
    if (typeof (query as any).addListener === 'function') {
      (query as any).addListener(handler);
      return () => (query as any).removeListener(handler);
    }
    return () => {};
  }, []);
  return prefers;
}

function useLiquidGlassPointer<T extends HTMLElement>(ref: React.RefObject<T>, enabled: boolean) {
  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (!enabled) {
      node.style.setProperty('--lg-x', '72%');
      node.style.setProperty('--lg-y', '18%');
      return;
    }
    let frame = 0;
    let targetX = 72;
    let targetY = 18;
    const apply = () => {
      frame = 0;
      const current = ref.current;
      if (!current) return;
      current.style.setProperty('--lg-x', `${targetX}%`);
      current.style.setProperty('--lg-y', `${targetY}%`);
    };
    const updateFromPointer = (event: PointerEvent) => {
      const current = ref.current; if (!current) return;
      const rect = current.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      targetX = Math.max(0, Math.min(100, x));
      targetY = Math.max(0, Math.min(100, y));
      if (!frame) frame = window.requestAnimationFrame(apply);
    };
    const reset = () => { targetX = 72; targetY = 18; if (!frame) frame = window.requestAnimationFrame(apply); };
    node.addEventListener('pointermove', updateFromPointer, { passive: true });
    node.addEventListener('pointerdown', updateFromPointer, { passive: true });
    node.addEventListener('pointerenter', updateFromPointer, { passive: true });
    node.addEventListener('pointerleave', reset);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      node.removeEventListener('pointermove', updateFromPointer);
      node.removeEventListener('pointerdown', updateFromPointer);
      node.removeEventListener('pointerenter', updateFromPointer);
      node.removeEventListener('pointerleave', reset);
    };
  }, [ref, enabled]);
}

/* =====================
   Color helpers
===================== */

function rgbStrToArr(rgb?: string): [number, number, number] {
  if (!rgb) return [255, 255, 255];
  const parts = rgb.split(/\s+/).map(n => Math.max(0, Math.min(255, Number(n))));
  return [parts[0] ?? 255, parts[1] ?? 255, parts[2] ?? 255] as any;
}
function toCssRgb(arr: [number, number, number]): string {
  return `${arr[0]} ${arr[1]} ${arr[2]}`;
}
function mix(a: number, b: number, t: number) {
  return Math.round(a + (b - a) * t);
}
function tintScale(rgb: [number, number, number], t: number): [number, number, number] {
  // t>0 → к белому, t<0 → к чёрному
  return [
    mix(rgb[0], t >= 0 ? 255 : 0, Math.abs(t)),
    mix(rgb[1], t >= 0 ? 255 : 0, Math.abs(t)),
    mix(rgb[2], t >= 0 ? 255 : 0, Math.abs(t)),
  ] as any;
}

/* =====================
   Style helpers
===================== */

function resolveColors(tone: DarkTone | undefined, tint: string | undefined, accent: string | undefined) {
  const baseTint = tone ? TONE_MAP[tone] : (tint ?? DEFAULTS.tint);
  const accentTint = accent ?? DEFAULTS.accent!;
  const baseArr = rgbStrToArr(baseTint);
  const accentArr = rgbStrToArr(accentTint);

  const accentSoft = tintScale(accentArr, +0.25); // светлая версия для бликов
  const accentDeep = tintScale(accentArr, -0.55); // для «глубокого» контура

  return {
    tintRgb: toCssRgb(baseArr),
    accentRgb: toCssRgb(accentArr),
    accentSoftRgb: toCssRgb(accentSoft),
    accentDeepRgb: toCssRgb(accentDeep),
  };
}

function buildStyle(
  style: React.CSSProperties | undefined,
  config: Required<Pick<BaseConfig,
    'blur' | 'tint' | 'opacity' | 'gloss' | 'border' | 'elevation' | 'glints'
  >> & { tone?: DarkTone; accent?: string }
): React.CSSProperties {
  const next: React.CSSProperties = { ...(style ?? {}) };
  const { tintRgb, accentRgb, accentSoftRgb, accentDeepRgb } =
    resolveColors(config.tone, config.tint, config.accent);

  (next as any)['--lg-blur'] = `${config.blur}px`;
  (next as any)['--lg-tint'] = tintRgb;
  (next as any)['--lg-opacity'] = `${config.opacity}`;
  (next as any)['--lg-gloss'] = `${config.gloss}`;
  (next as any)['--lg-border'] = `${config.border}`;
  (next as any)['--lg-elev'] = `${config.elevation}`;
  (next as any)['--lg-glints'] = config.glints ? '1' : '0';
  (next as any)['--lg-accent'] = accentRgb;
  (next as any)['--lg-accent-soft'] = accentSoftRgb;
  (next as any)['--lg-accent-deep'] = accentDeepRgb;

  return next;
}

/* =====================
   Component: LiquidGlass
===================== */

type LiquidGlassComponent = React.ForwardRefExoticComponent<
  LiquidGlassProps & React.RefAttributes<HTMLDivElement>
> & {
  Button: React.ForwardRefExoticComponent<
    LiquidGlassButtonProps & React.RefAttributes<HTMLButtonElement>
  >;
};

const LiquidGlassBase = React.forwardRef<HTMLDivElement, LiquidGlassProps>((props, forwardedRef) => {
  const {
    blur = DEFAULTS.blur,
    tint = DEFAULTS.tint,
    opacity = DEFAULTS.opacity,
    gloss = DEFAULTS.gloss,
    border = DEFAULTS.border,
    glints = DEFAULTS.glints,
    interactive = DEFAULTS.interactive,
    animate = DEFAULTS.animate,
    elevation = DEFAULTS.elevation,
    tone,
    accent = DEFAULTS.accent,
    className,
    style,
    children,
    ...rest
  } = props;

  const prefersReducedMotion = usePrefersReducedMotion();
  const interactionEnabled = interactive && !prefersReducedMotion;

  const localRef = React.useRef<HTMLDivElement | null>(null);
  const setRef = React.useCallback((node: HTMLDivElement | null) => {
    localRef.current = node;
    if (typeof forwardedRef === 'function') forwardedRef(node);
    else if (forwardedRef) (forwardedRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
    if (node) {
      node.style.setProperty('--lg-x', '72%');
      node.style.setProperty('--lg-y', '18%');
    }
  }, [forwardedRef]);

  useLiquidGlassPointer(localRef, interactionEnabled);

  const inlineStyle = React.useMemo(
    () => buildStyle(style, { blur, tint, opacity, gloss, border, elevation, glints, tone, accent }),
    [style, blur, tint, opacity, gloss, border, elevation, glints, tone, accent]
  );

  // Базовая «карточка-материал»
  const containerStyle: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 22,
    backgroundColor: 'rgba(var(--lg-tint), var(--lg-opacity))',
    backdropFilter: 'blur(var(--lg-blur)) saturate(1.15)',
    WebkitBackdropFilter: 'blur(var(--lg-blur)) saturate(1.15)',
    border: '1px solid rgba(255,255,255,0.12)',
    boxShadow: `inset 0 1px 0 rgba(255,255,255,0.28),
                0 ${18 * elevation}px ${50 * elevation}px rgba(0,0,0,0.45)`,
    color: '#fff',
    willChange: 'transform',
  };

  return (
    <div
      ref={setRef}
      className={classNames('liquid-glass', className)}
      data-animate={animate ? 'true' : 'false'}
      data-interactive={interactionEnabled ? 'true' : 'false'}
      style={{ ...containerStyle, ...inlineStyle }}
      {...rest}
    >
      {/* 1) Периметральный bloom c акцентом (очень деликатно) */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: -2,
          borderRadius: 26,
          filter: 'blur(22px)',
          opacity: 0.45,
          background:
            // мягкий акцент сверху
            'radial-gradient(1200px 320px at 50% -8%, rgba(var(--lg-accent-soft),0.16), transparent 65%),' +
            // боковые хладки
            'radial-gradient(900px 240px at -10% 20%, rgba(255,255,255,0.06), transparent 70%),' +
            'radial-gradient(900px 240px at 110% 15%, rgba(255,255,255,0.06), transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* 2) Верхний статичный sheen + «лента» (свет и чуть акцента) */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 22,
          mixBlendMode: 'overlay',
          opacity: `var(--lg-gloss)`,
          background:
            // холодный мягкий грейд сверху вниз
            'linear-gradient(180deg, rgba(255,255,255,0.22), rgba(255,255,255,0.00) 42%),' +
            // тонкая акцентная лента под углом
            'conic-gradient(from 248deg at 30% -12%, rgba(var(--lg-accent-soft),0.20), rgba(255,255,255,0.00) 130deg, rgba(var(--lg-accent-soft),0.18) 350deg)',
          pointerEvents: 'none',
        }}
      />

      {/* 3) Внутренний виньет — фокус к центру */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 22,
          background:
            'radial-gradient(130% 150% at 50% 8%, rgba(0,0,0,0.00) 38%, rgba(0,0,0,0.18) 92%)',
          mixBlendMode: 'multiply',
          pointerEvents: 'none',
        }}
      />

      {/* 4) Иридесцентная кромка (акцент, полупрозр., цветной обод) */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 22,
          padding: 1,
          WebkitMask:
            'radial-gradient(100% 100% at 50% 50%, transparent 0, #000 1px, #000 calc(100% - 1px), transparent 100%)',
          mask:
            'radial-gradient(100% 100% at 50% 50%, transparent 0, #000 1px, #000 calc(100% - 1px), transparent 100%)',
          background:
            'linear-gradient(180deg, rgba(var(--lg-accent),0.14), rgba(var(--lg-accent-deep),0.10))',
          opacity: 0.65,
          mixBlendMode: 'screen',
          pointerEvents: 'none',
        }}
      />

      {/* 5) Статичные мягкие glints (если включены) */}
      {glints && (
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 22,
            mixBlendMode: 'screen',
            opacity: 0.6,
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: '22%', top: '14%',
              width: 220, height: 120,
              background: 'radial-gradient(closest-side, rgba(255,255,255,0.55), rgba(255,255,255,0.0) 70%)',
              filter: 'blur(10px)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              right: '34%', top: '54%',
              width: 160, height: 90,
              background: 'radial-gradient(closest-side, rgba(255,255,255,0.40), rgba(255,255,255,0.0) 70%)',
              filter: 'blur(12px)',
            }}
          />
        </div>
      )}

      {/* 6) Деликатная «капля» блика за курсором (интерактив) */}
      {interactionEnabled && (
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 22,
            background:
              'radial-gradient(240px 170px at var(--lg-x) var(--lg-y), rgba(255,255,255,0.22), rgba(255,255,255,0.0) 68%),' +
              'radial-gradient(360px 240px at var(--lg-x) calc(var(--lg-y) + 12%), rgba(var(--lg-accent-soft),0.12), transparent 70%)',
            opacity: 'calc(var(--lg-gloss) * 0.92)',
            maskImage: 'radial-gradient(280px 210px at var(--lg-x) var(--lg-y), #000, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(280px 210px at var(--lg-x) var(--lg-y), #000, transparent 70%)',
            mixBlendMode: 'soft-light',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* 7) Микро-текстура: точки + волоски + диагональ (ультра-деликатно) */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 22,
          opacity: 0.34,
          backgroundImage:
            // точки
            'radial-gradient(rgba(255,255,255,0.065) 1px, transparent 1.25px),' +
            // диагональная подсветка
            'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.00) 48%),' +
            // волоски
            'linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)',
          backgroundSize: '3px 3px, 100% 100%, 6px 100%',
          mixBlendMode: 'overlay',
          pointerEvents: 'none',
        }}
      />

      {/* контент */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        {children}
      </div>

      {/* 8) Двойная окантовка + внешний «воздух» */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 22,
          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.20)',
          opacity: border,
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 22,
          boxShadow: '0 1px 0 rgba(255,255,255,0.10) inset',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
});
LiquidGlassBase.displayName = 'LiquidGlass';

/* =====================
   Button (glass)
===================== */

const LiquidGlassButton = React.forwardRef<HTMLButtonElement, LiquidGlassButtonProps>((props, forwardedRef) => {
  const {
    className,
    style,
    children,
    type,
    blur,
    tint,
    opacity,
    gloss,
    border,
    glints,
    interactive,
    animate,
    elevation,
    tone,
    accent = DEFAULTS.accent,
    ...rest
  } = props;

  const resolvedBlur = blur ?? DEFAULTS.blur;
  const resolvedTint = tone ? TONE_MAP[tone] : (tint ?? DEFAULTS.tint);
  const resolvedOpacity = opacity ?? 0.16;
  const resolvedGloss = gloss ?? 0.9;
  const resolvedBorder = border ?? 0.6;
  const resolvedGlints = glints ?? false;
  const resolvedInteractive = interactive ?? true;
  const resolvedElevation = elevation ?? 1;

  const prefersReducedMotion = usePrefersReducedMotion();
  const interactionEnabled = resolvedInteractive && !prefersReducedMotion;

  const localRef = React.useRef<HTMLButtonElement | null>(null);
  const setRef = React.useCallback((node: HTMLButtonElement | null) => {
    localRef.current = node;
    if (typeof forwardedRef === 'function') forwardedRef(node);
    else if (forwardedRef) (forwardedRef as React.MutableRefObject<HTMLButtonElement | null>).current = node;
    if (node) { node.style.setProperty('--lg-x', '70%'); node.style.setProperty('--lg-y', '16%'); }
  }, [forwardedRef]);

  useLiquidGlassPointer(localRef, interactionEnabled);

  const inlineStyle = React.useMemo(
    () => buildStyle(style, {
      blur: resolvedBlur,
      tint: resolvedTint,
      opacity: resolvedOpacity,
      gloss: resolvedGloss,
      border: resolvedBorder,
      glints: resolvedGlints,
      elevation: resolvedElevation,
      tone,
      accent,
    }),
    [style, resolvedBlur, resolvedTint, resolvedOpacity, resolvedGloss, resolvedBorder, resolvedGlints, resolvedElevation, tone, accent]
  );

  const baseStyle: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 16,
    backgroundColor: 'rgba(var(--lg-tint), calc(var(--lg-opacity) * 0.95))',
    backdropFilter: 'blur(10px) saturate(1.15)',
    WebkitBackdropFilter: 'blur(10px) saturate(1.15)',
    border: '1px solid rgba(255,255,255,0.14)',
    boxShadow: `inset 0 1px 0 rgba(255,255,255,0.34),
                0 ${6 * resolvedElevation}px ${18 * resolvedElevation}px rgba(0,0,0,0.45)`,
    color: '#fff',
    padding: '10px 16px',
    transition: 'box-shadow 180ms ease, transform 120ms ease, background-color 180ms ease',
    WebkitTapHighlightColor: 'transparent',
  };

  return (
    <button
      ref={setRef}
      type={type ?? 'button'}
      className={classNames('liquid-glass liquid-glass__button', className)}
      style={{ ...baseStyle, ...inlineStyle }}
      {...rest}
      onMouseDown={(e) => { (e.currentTarget.style.transform = 'scale(0.985)'); }}
      onMouseUp={(e) => { (e.currentTarget.style.transform = ''); }}
      onMouseLeave={(e) => { (e.currentTarget.style.transform = ''); }}
    >
      {/* hover accent rim */}
      <span style={{ position: 'absolute', inset: 0, borderRadius: 16, pointerEvents: 'none' }}>
        <span
          className="__btnRim"
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 16,
            opacity: 0,
            boxShadow: 'inset 0 0 0 1px rgba(var(--lg-accent),0.38)',
            transition: 'opacity 220ms ease',
          }}
        />
        {/* hover-sheen */}
        <span
          className="__btnSheen"
          style={{
            position: 'absolute',
            inset: -1,
            opacity: 0,
            background:
              'linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.45) 50%, transparent 70%)',
            transition: 'opacity 300ms ease',
            borderRadius: 16,
          }}
        />
      </span>
      <span style={{ position: 'relative', zIndex: 1 }}>{children}</span>
      <style>{`
        .liquid-glass__button:hover .__btnSheen { opacity: 1; animation: btnSheen 900ms ease forwards; }
        .liquid-glass__button:hover .__btnRim { opacity: 1; }
        @keyframes btnSheen { 0% { transform: translateX(-60%); } 100% { transform: translateX(60%); } }
      `}</style>
    </button>
  );
});
LiquidGlassButton.displayName = 'LiquidGlass.Button';

const LiquidGlass = LiquidGlassBase as LiquidGlassComponent;
LiquidGlass.Button = LiquidGlassButton;

/* =====================
   Glass.Pill — компактная «пилюля»
===================== */

type PillProps<E extends React.ElementType> = {
  as?: E;
  active?: boolean;
} & Omit<React.ComponentPropsWithoutRef<E>, 'as' | 'children'> & React.PropsWithChildren;

function PillInner<E extends React.ElementType = 'button'>(props: PillProps<E>) {
  const { as, active, children, className, ...rest } = props as any;
  const Component = (as || 'button') as any;
  return (
    <LiquidGlass
      className={classNames(
        'inline-flex items-center rounded-full px-3 py-1.5 text-sm select-none',
        active ? 'ring-1 ring-white/40' : '',
        className
      )}
      interactive={false}
      opacity={0.16}
      gloss={0.82}
      blur={18}
      tone="graphite"
    >
      <Component {...rest} className="no-underline text-inherit">
        {children}
      </Component>
    </LiquidGlass>
  );
}

export const Glass = { Pill: PillInner } as const;

export { LiquidGlassButton };
export default LiquidGlass;
