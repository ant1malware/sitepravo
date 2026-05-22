import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { initTheme } from './theme';
import { initUi } from './uiSettings';

declare const __APP_VERSION__: string;

(function hardRefreshOnNewBuild() {
  try {
    const k = 'app:version';
    const prev = localStorage.getItem(k);
    const next = __APP_VERSION__;
    if (prev && prev !== next) {
      if ('caches' in window) {
        caches.keys().then(keys => Promise.all(keys.map(c => caches.delete(c)))).finally(() => {
          localStorage.setItem(k, next);
          location.reload();
        });
      } else {
        localStorage.setItem(k, next);
        location.reload();
      }
      return;
    }
    localStorage.setItem(k, next);
  } catch {}
})();

// Инициализация темы/UI до первого рендера
initTheme();
initUi();

// Фикс 100vh на мобильных (iOS/Android)
function applyVh() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}
applyVh();
window.addEventListener('resize', applyVh, { passive: true });

// Рендер приложения
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
