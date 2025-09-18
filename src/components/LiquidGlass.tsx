import React from 'react';

/* =====================
   Types & Config
===================== */

type BaseConfig = {
  blur?: number;
  tint?: string;
  opacity?: number;
  gloss?: number;
  border?: number;     // 0..1 border intensity
  glints?: boolean;    // small static glints on surface
  interactive?: boolean;
  animate?: boolean;   // kept for API compat (не используем для фона)
  elevation?: number;
};

export type LiquidGlassProps = BaseConfig & React.HTMLAttributes<HTMLDivElement>;
export type LiquidGlassButtonProps = BaseConfig & React.ButtonHTMLAttributes<HTMLButtonElement>;

const DEFAULTS: Required<BaseConfig> = {
  blur: 24,
  tint: '10 12 24',   // глубокий тёмно-синий (под скрин)
  opacity: 0.14,
  gloss: 0.85,
  border: 0.55,
  glints: true,
  interactive: true,
  animate: false,
  elevation: 1,
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
   Style helpers
===================== */

function buildStyle(
  style: React.CSSProperties | undefined,
  config: Required<Pick<BaseConfig, 'blur' | 'tint' | 'opacity' | 'gloss' | 'border' | 'elevation' | 'glints'>>
): React.CSSProperties {
  const next: React.CSSProperties = { ...(style ?? {}) };
  (next as any)['--lg-blur'] = `${config.blur}px`;
  (next as any)['--lg-tint'] = config.tint;
  (next as any)['--lg-opacity'] = `${config.opacity}`;
  (next as any)['--lg-gloss'] = `${config.gloss}`;
  (next as any)['--lg-border'] = `${config.border}`;
  (next as any)['--lg-elev'] = `${config.elevation}`;
  (next as any)['--lg-glints'] = config.glints ? '1' : '0';
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
    animate = DEFAULTS.animate, // оставим как data-attr (фон не анимируем)
    elevation = DEFAULTS.elevation,
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
    () => buildStyle(style, { blur, tint, opacity, gloss, border, elevation, glints }),
    [style, blur, tint, opacity, gloss, border, elevation, glints]
  );

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 22,
    backgroundColor: 'rgba(var(--lg-tint), var(--lg-opacity))',
    backdropFilter: 'blur(var(--lg-blur))',
    WebkitBackdropFilter: 'blur(var(--lg-blur))',
    border: '1px solid rgba(255,255,255,0.15)',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.35), 0 18px 50px rgba(0,0,0,0.35)',
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
      {/* 1) Периметральное свечение (статичное) */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: -1,
          borderRadius: 26,
          filter: 'blur(18px)',
          opacity: 0.45,
          background:
            'radial-gradient(1200px 320px at 50% -10%, rgba(255,255,255,0.14), transparent 70%),' +
            'radial-gradient(900px 220px at -10% 10%, rgba(255,255,255,0.08), transparent 65%),' +
            'radial-gradient(1100px 240px at 110% 0%, rgba(255,255,255,0.08), transparent 65%)',
          maskImage: 'linear-gradient(#000,#000)',
          WebkitMaskImage: 'linear-gradient(#000,#000)',
          pointerEvents: 'none',
        }}
      />

      {/* 2) Статичный верхний sheen + лёгкая conic-подсветка */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 22,
          mixBlendMode: 'overlay',
          opacity: `var(--lg-gloss)`,
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.20), rgba(255,255,255,0.00) 40%),' +
            'conic-gradient(from 250deg at 28% -10%, rgba(255,255,255,0.10), rgba(255,255,255,0.00) 140deg, rgba(255,255,255,0.10) 350deg)',
          pointerEvents: 'none',
        }}
      />

      {/* 3) Маленькие статичные glints (опционально) */}
      {glints && (
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 22,
            mixBlendMode: 'screen',
            opacity: 0.7,
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
              right: '34%', top: '52%',
              width: 160, height: 90,
              background: 'radial-gradient(closest-side, rgba(255,255,255,0.40), rgba(255,255,255,0.0) 70%)',
              filter: 'blur(12px)',
            }}
          />
        </div>
      )}

      {/* 4) Деликатная «капля» блика за курсором */}
      {interactionEnabled && (
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 22,
            background: 'radial-gradient(180px 180px at var(--lg-x) var(--lg-y), rgba(255,255,255,0.22), transparent 60%)',
            opacity: 'calc(var(--lg-gloss) * 0.9)',
            maskImage: 'radial-gradient(220px 220px at var(--lg-x) var(--lg-y), #000, transparent 60%)',
            WebkitMaskImage: 'radial-gradient(220px 220px at var(--lg-x) var(--lg-y), #000, transparent 60%)',
            mixBlendMode: 'soft-light',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* 5) Микротекстура: мелкая сетка + диагональная подсветка */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 22,
          opacity: 0.35,
          backgroundImage:
            'radial-gradient(rgba(255,255,255,0.07) 0.8px, transparent 1px),' +
            'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.00) 45%)',
          backgroundSize: '3px 3px, 100% 100%',
          mixBlendMode: 'overlay',
          pointerEvents: 'none',
        }}
      />

      {/* Контент */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        {children}
      </div>

      {/* 6) Внутренняя окантовка */}
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
    ...rest
  } = props;

  const resolvedBlur = blur ?? DEFAULTS.blur;
  const resolvedTint = tint ?? DEFAULTS.tint;
  const resolvedOpacity = opacity ?? DEFAULTS.opacity;
  const resolvedGloss = gloss ?? DEFAULTS.gloss;
  const resolvedBorder = border ?? DEFAULTS.border;
  const resolvedGlints = glints ?? DEFAULTS.glints;
  const resolvedInteractive = interactive ?? DEFAULTS.interactive;
  const resolvedElevation = elevation ?? DEFAULTS.elevation;

  const prefersReducedMotion = usePrefersReducedMotion();
  const interactionEnabled = resolvedInteractive && !prefersReducedMotion;

  const localRef = React.useRef<HTMLButtonElement | null>(null);
  const setRef = React.useCallback((node: HTMLButtonElement | null) => {
    localRef.current = node;
    if (typeof forwardedRef === 'function') forwardedRef(node);
    else if (forwardedRef) (forwardedRef as React.MutableRefObject<HTMLButtonElement | null>).current = node;
    if (node) { node.style.setProperty('--lg-x', '72%'); node.style.setProperty('--lg-y', '18%'); }
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
    }),
    [style, resolvedBlur, resolvedTint, resolvedOpacity, resolvedGloss, resolvedBorder, resolvedGlints, resolvedElevation]
  );

  const baseStyle: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 16,
    backgroundColor: 'rgba(var(--lg-tint), calc(var(--lg-opacity) * 0.9))',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.15)',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.35), 0 6px 16px rgba(0,0,0,0.35)',
    color: '#fff',
    padding: '8px 16px',
    transition: 'box-shadow 200ms ease, transform 120ms ease',
  };

  return (
    <button
      ref={setRef}
      type={type ?? 'button'}
      className={classNames('liquid-glass liquid-glass__button', className)}
      style={{ ...baseStyle, ...inlineStyle }}
      {...rest}
      onMouseDown={(e) => { (e.currentTarget.style.transform = 'scale(0.99)'); }}
      onMouseUp={(e) => { (e.currentTarget.style.transform = ''); }}
      onMouseLeave={(e) => { (e.currentTarget.style.transform = ''); }}
    >
      {/* hover-sheen */}
      <span style={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 16, pointerEvents: 'none' }}>
        <span
          className="__btnSheen"
          style={{
            position: 'absolute',
            inset: -1,
            opacity: 0,
            background: 'linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.45) 50%, transparent 70%)',
            transition: 'opacity 300ms ease',
          }}
        />
      </span>
      <span style={{ position: 'relative', zIndex: 1 }}>{children}</span>
      <style>{`
        .liquid-glass__button:hover .__btnSheen {
          opacity: 1;
          animation: btnSheen 900ms ease forwards;
        }
        @keyframes btnSheen {
          0% { transform: translateX(-60%); }
          100% { transform: translateX(60%); }
        }
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
      opacity={0.18}
      gloss={0.8}
      blur={18}
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
