import React from 'react';
import { Sparkles, Droplets, ShieldHalf, Sun, Moon } from 'lucide-react';
import LiquidGlass from './components/LiquidGlass';
import { useStyleMode } from './useStyleMode';
import { Link } from 'react-router-dom';

function DemoNavbar({ enable }: { enable: () => void }) {
  return (
    <LiquidGlass className="flex items-center justify-between rounded-3xl p-4 pr-6 text-sm text-white" gloss={0.6} elevation={1.1}>
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white/10 text-white"><Sparkles className="h-4 w-4" /></div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-white/70">Navigation</p>
          <p className="text-sm font-semibold">Glass Control Center</p>
        </div>
      </div>
      <div className="hidden items-center gap-2 md:flex">
        <LiquidGlass.Button className="px-4 py-2" gloss={0.5} tint="20 24 42" opacity={0.24} onClick={enable}>
          Enable Liquid Mode
        </LiquidGlass.Button>
        <LiquidGlass.Button className="px-3 py-2" gloss={0.4} tint="255 255 255" opacity={0.22} interactive={false}>
          Sign in
        </LiquidGlass.Button>
      </div>
    </LiquidGlass>
  );
}

function DemoModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <LiquidGlass className="w-[min(480px,90vw)] space-y-5 p-8 text-white" blur={28} gloss={0.85} elevation={1.4}>
        <div className="flex items-center gap-3">
          <Droplets className="h-6 w-6 opacity-80" />
          <h2 className="text-lg font-semibold">Interactive sheen preset</h2>
        </div>
        <p className="text-sm text-white/80">
          This modal demonstrates LiquidGlass inside an overlay. Motion reacts to your cursor while the conic sheen keeps spinning unless reduced motion is requested.
        </p>
        <div className="flex flex-wrap gap-2">
          <LiquidGlass.Button className="px-4 py-2" gloss={1} onClick={onClose}>
            Close preview
          </LiquidGlass.Button>
          <LiquidGlass.Button className="px-4 py-2" tint="210 236 255" opacity={0.22} gloss={0.6}>
            Keep settings
          </LiquidGlass.Button>
        </div>
      </LiquidGlass>
    </div>
  );
}

const CARD_PRESETS = [
  {
    title: 'Night Protocol',
    copy: 'Default Rick Owens inspired palette — deep navy tint, high gloss and subtle neon glow.',
    features: ['Blur 24px', 'Opacity 0.14', 'Gloss 0.8'],
    tint: '8 8 12',
    opacity: 0.14,
    gloss: 0.8,
    className: 'text-white',
  },
  {
    title: 'Luminous Mist',
    copy: 'Light surface preset with silvery refraction. Works great over dark photography.',
    features: ['Blur 30px', 'Opacity 0.32', 'Gloss 0.55'],
    tint: '230 238 255',
    opacity: 0.32,
    gloss: 0.55,
    className: 'text-slate-900',
  },
  {
    title: 'Cyber Bloom',
    copy: 'Violet tint with higher elevation to emphasise the glow on dashboards.',
    features: ['Blur 26px', 'Opacity 0.2', 'Gloss 0.9'],
    tint: '78 56 140',
    opacity: 0.2,
    gloss: 0.9,
    className: 'text-white',
  },
];

export default function LiquidGlassShowcase() {
  const [styleMode, setStyleMode] = useStyleMode();
  const [showModal, setShowModal] = React.useState(false);

  const enableLiquid = React.useCallback(() => {
    if (styleMode !== 'liquid') setStyleMode('liquid');
  }, [styleMode, setStyleMode]);

  React.useEffect(() => {
    if (styleMode === 'classic') return;
    const body = document.body;
    const prevOverflow = body.style.overflow;
    body.style.overflowX = 'hidden';
    return () => {
      body.style.overflowX = prevOverflow;
    };
  }, [styleMode]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050509] text-white">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(800px_520px_at_15%_-10%,rgba(132,168,255,0.24),transparent),radial-gradient(900px_640px_at_85%_0%,rgba(64,82,220,0.22),transparent)]" />
        <div className="absolute inset-x-0 top-[35%] h-[520px] bg-[radial-gradient(650px_520px_at_50%_0%,rgba(120,40,255,0.18),transparent)] opacity-60" />
      </div>

      <div className="mx-auto flex max-w-6xl flex-col gap-16 px-4 pb-20 pt-16">
        <div className="flex flex-col gap-4 text-xs text-white/60">
          <Link to="/settings" className="w-fit rounded-full border border-white/10 px-3 py-1 text-white/70 transition hover:border-white/30 hover:text-white">
            Settings → Liquid Glass
          </Link>
          <div className="flex items-center gap-2 text-white/80">
            <Sparkles className="h-4 w-4" />
            <span>Liquid Glass design system</span>
          </div>
        </div>

        <section className="space-y-6">
          <LiquidGlass className="overflow-hidden p-10 md:p-16 text-white" gloss={0.85} elevation={1.4}>
            <div className="flex flex-wrap items-center gap-3 text-sm text-white/80">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                <ShieldHalf className="h-3.5 w-3.5" /> Frosted reactive panels
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                {styleMode === 'liquid' ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />} {styleMode === 'liquid' ? 'Enabled' : 'Classic' }
              </span>
            </div>
            <h1 className="display-hero mt-6 text-balance">Liquid Glass interface kit</h1>
            <p className="mt-4 max-w-2xl text-lg text-white/75">
              Drop-in TSX component for frosted, animated surfaces. Backdrop blur, tint layer, conic sheen, cursor driven highlight and micro texture — all controlled through CSS variables.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <LiquidGlass.Button
                className="px-6 py-3 text-base font-semibold"
                gloss={1}
                onClick={() => {
                  enableLiquid();
                  setShowModal(true);
                }}
              >
                Open interactive modal
              </LiquidGlass.Button>
              <LiquidGlass.Button
                className="px-6 py-3 text-base font-semibold"
                tint="220 236 255"
                opacity={0.22}
                gloss={0.6}
                onClick={enableLiquid}
                disabled={styleMode === 'liquid'}
              >
                {styleMode === 'liquid' ? 'Liquid mode active' : 'Switch to Liquid mode'}
              </LiquidGlass.Button>
            </div>
          </LiquidGlass>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          {CARD_PRESETS.map((card, idx) => (
            <LiquidGlass
              key={card.title}
              className={`flex h-full flex-col justify-between space-y-4 p-6 ${card.className}`}
              tint={card.tint}
              opacity={card.opacity}
              gloss={card.gloss}
              blur={idx === 1 ? 30 : 24}
              elevation={idx === 2 ? 1.5 : 1.1}
            >
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">{card.title}</h3>
                <p className={`text-sm ${card.className.includes('text-white') ? 'text-white/80' : 'text-slate-600'}`}>{card.copy}</p>
              </div>
              <ul className={`space-y-1 text-xs ${card.className.includes('text-white') ? 'text-white/70' : 'text-slate-500'}`}>
                {card.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-current/60" />
                    {feature}
                  </li>
                ))}
              </ul>
            </LiquidGlass>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <DemoNavbar enable={enableLiquid} />
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Component palette</h2>
            <p className="text-sm text-white/70">
              Combine <code>LiquidGlass</code> with Tailwind utilities. Every property is exposed through variables: blur, tint, opacity, gloss, elevation and interactive droplet.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <LiquidGlass className="p-4 text-white" tint="32 42 76" opacity={0.22} gloss={0.7}>
                <p className="text-xs uppercase tracking-[0.25em] text-white/60">Call to action</p>
                <h3 className="mt-2 text-base font-semibold">Curated hero block</h3>
                <p className="mt-2 text-sm text-white/70">Try stacking multiple layers with different blur values to simulate depth.</p>
              </LiquidGlass>
              <LiquidGlass className="p-4 text-slate-900" tint="244 246 255" opacity={0.38} gloss={0.45} interactive={false}>
                <h3 className="text-base font-semibold">Minimal tooltip</h3>
                <p className="mt-2 text-sm text-slate-600">Disable interactivity to keep the droplet static while retaining the conic sheen.</p>
              </LiquidGlass>
            </div>
          </div>
        </section>
      </div>

      {showModal && <DemoModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
