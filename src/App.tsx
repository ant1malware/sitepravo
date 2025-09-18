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

// Tracks page views on route change
function RouteTracker() {
  const loc = useLocation();
  useEffect(() => {
    track('page_view');
    try { pushRecent(location.pathname + location.search + location.hash, document.title || undefined); } catch {}
  }, [loc.pathname, loc.search, loc.hash]);
  return null;
}

export default function App() {
  return (
  <div className="min-h-dvh w-full bg-[#0b1020] text-white">
    {/* background layers */}
    <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden>
      <div className="absolute inset-0" style={{
        background:
          'radial-gradient(800px 540px at 8% 0%, rgba(128,160,255,.20), transparent 60%),' +
          'radial-gradient(900px 560px at 85% 10%, rgba(220,130,255,.18), transparent 65%),' +
          'linear-gradient(180deg, rgba(255,255,255,.02), rgba(0,0,0,.35))'
      }} />
      <div className="absolute inset-0 opacity-[0.07]" style={{
        backgroundSize: '32px 32px',
        backgroundImage: 'linear-gradient(to right, rgba(255,255,255,.7) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.7) 1px, transparent 1px)'
      }} />
    </div>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <CommandPalette />
      <Sidebar />
      <GlobalTopbar />
      <MobileMenu />
      {/* Offset notifications button below topbar on small screens */}
      <div className="fixed right-2 top-14 z-[90] sm:top-2"><NotificationsBell /></div>
      <RouteTracker />
      <React.Suspense fallback={<div className="p-4 text-sm text-zinc-300">Загрузка…</div>}>
        <Routes>
          <Route path="/" element={<GovCheatsheetSky />} />
          <Route path="/whats-new" element={<WhatsNew />} />
          <Route path="/diff/:id" element={<DiffPage />} />
          <Route path="/print" element={<PrintSheet />} />
          <Route path="/roles/:id" element={<RolePage />} />
          <Route path="/laws/:slug" element={<LawPage />} />
          <Route path="/vu/:id" element={<VuPage />} />
          <Route path="/recorders/:id" element={<RecorderPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/style/liquid" element={<LiquidGlassShowcase />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
        </Routes>
      </React.Suspense>
    </BrowserRouter>
  </div>
);
}




