import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
const GovCheatsheetSky = React.lazy(() => import('./GovCheatsheetSky'));
const WhatsNew = React.lazy(() => import('./WhatsNew'));
const DiffPage = React.lazy(() => import('./DiffPage'));
const LiquidGlassShowcase = React.lazy(() => import('./LiquidGlassShowcase'));
const PrintSheet = React.lazy(() => import('./PrintSheet'));
const RolePage = React.lazy(() => import('./RolePage'));
const LawPage = React.lazy(() => import('./LawPage'));
const VuPage = React.lazy(() => import('./VuPage'));
const BuddyPlayground = React.lazy(() => import('./BuddyPlayground'));
const HomePage = React.lazy(() => import('./HomePage'));
const ForumPage = React.lazy(() => import('./ForumPage'));
import RecorderPage from './RecorderPage';
import AboutPage from './AboutPage';
import CommandPalette from "./CommandPalette";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { track } from "./track";
import { pushRecent } from "./recent";
const SettingsPage = React.lazy(() => import('./SettingsPage'));
const FavoritesPage = React.lazy(() => import('./FavoritesPage'));
import Sidebar from "./Sidebar";
import GlobalTopbar from "./GlobalTopbar";
import NotificationsBell from "./NotificationsBell";
import MobileMenu from "./MobileMenu";
import { useStyleMode } from './useStyleMode';
import Buddy from './components/Buddy';

// Tracks page views on route change
function RouteTracker() {
  const loc = useLocation();
  useEffect(() => {
    track('page_view');
    try { pushRecent(location.pathname + location.search + location.hash, document.title || undefined); } catch {}
  }, [loc.pathname, loc.search, loc.hash]);
  return null;
}

// Renders Buddy on all routes except the playground
function BuddyGate() {
  const loc = useLocation();
  if ((loc.pathname || '').startsWith('/buddy')) return null;
  return <Buddy />;
}

export default function App() {
  const [styleMode] = useStyleMode();
  return (
  <div className={(styleMode === 'liquid' || styleMode === 'beta') ? "min-h-dvh w-full" : "min-h-dvh w-full"}>
    {(styleMode === 'liquid' || styleMode === 'beta') && (
      // background layers only for Liquid/Beta
      <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden>
        <div className="absolute inset-0" style={{
          background: styleMode === 'beta'
            ? 'radial-gradient(900px 600px at 10% -5%, rgba(0,255,240,.16), transparent 60%),'
              + 'radial-gradient(1100px 780px at 92% 8%, rgba(168,85,247,.18), transparent 65%),'
              + 'linear-gradient(180deg, rgba(255,255,255,.03), rgba(0,0,0,.45))'
            : 'radial-gradient(800px 540px at 8% 0%, rgba(90,110,180,.10), transparent 60%),'
              + 'radial-gradient(900px 560px at 85% 10%, rgba(160,110,200,.08), transparent 65%),'
              + 'linear-gradient(180deg, rgba(0,0,0,.60), rgba(0,0,0,.88))'
        }} />
        <div className="absolute inset-0" style={{
          opacity: styleMode === 'beta' ? 0.02 : 0.015,
          backgroundSize: '32px 32px',
          backgroundImage: 'linear-gradient(to right, rgba(255,255,255,.7) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.7) 1px, transparent 1px)'
        }} />
      </div>
    )}
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <CommandPalette />
      <Sidebar />
      <GlobalTopbar />
      <MobileMenu />
      <BuddyGate />
      {/* Offset notifications button below topbar on small screens; keep under full-screen overlays */}
      <div className="fixed right-2 top-14 z-[60] sm:top-2"><NotificationsBell /></div>
      <RouteTracker />
      <React.Suspense fallback={<div className="p-4 text-sm text-zinc-300">Загрузка…</div>}>
        <Routes>
          <Route path="/" element={<GovCheatsheetSky />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/forum" element={<ForumPage />} />
          <Route path="/whats-new" element={<WhatsNew />} />
          <Route path="/diff/:id" element={<DiffPage />} />
          <Route path="/print" element={<PrintSheet />} />
          <Route path="/roles/:id" element={<RolePage />} />
          <Route path="/laws/:slug" element={<LawPage />} />
          <Route path="/vu/:id" element={<VuPage />} />
          <Route path="/recorders/:id" element={<RecorderPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/style/liquid" element={<LiquidGlassShowcase />} />
          <Route path="/buddy" element={<BuddyPlayground />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
        </Routes>
      </React.Suspense>
    </BrowserRouter>
  </div>
);
}




