import { defineConfig, splitVendorChunkPlugin } from 'vite';
import react from '@vitejs/plugin-react';
import { writeFileSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// кладём docs/.nojekyll (чтобы Pages не включал Jekyll)
function noJekyllPlugin(enable: boolean) {
  return {
    name: 'nojekyll',
    apply: 'build',
    closeBundle() {
      if (!enable) return;
      const p = resolve(process.cwd(), 'docs/.nojekyll');
      try { writeFileSync(p, ''); } catch {}
    }
  }
}

// копируем index.html -> 404.html (SPA-fallback для любых путей)
function copy404Plugin(outDir: string | null) {
  return {
    name: 'copy-404',
    apply: 'build',
    closeBundle() {
      if (!outDir) return;
      try {
        const base = resolve(process.cwd(), outDir);
        const index = resolve(base, 'index.html');
        const fallback = resolve(base, '404.html');
        const html = readFileSync(index);
        writeFileSync(fallback, html);
      } catch {}
    }
  }
}

export default defineConfig(({ mode }) => {
  const isGh = mode === 'gh';
  const version = process.env.GITHUB_SHA || String(Date.now());
  const outDir = isGh ? 'docs' : 'dist';

  return {
    plugins: [
      react(),
      splitVendorChunkPlugin(),
      noJekyllPlugin(isGh),
      copy404Plugin(outDir),
    ],
    // имя репозитория на GitHub Pages:
    base: isGh ? '/betatestik/' : '/',
    define: { __APP_VERSION__: JSON.stringify(version) },
    build: {
      outDir,
      emptyOutDir: true,
      cssCodeSplit: true,
      reportCompressedSize: true,
      chunkSizeWarningLimit: 900,
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            icons: ['lucide-react'],
          },
        },
      },
    },
    esbuild: { drop: ['console', 'debugger'] },
    server: { host: true },
  };
});
