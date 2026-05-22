const fs = require('fs');
function patchFile(file, fallback) {
  let s = fs.readFileSync(file, 'utf8');
  if (s.includes('function getApiBase()')) { console.log(file+': already patched'); return; }
  s = s.replace(/const BASE: string =([\s\S]*?);\n/, (
    _m
  ) => `const BASE: string = getApiBase();\n`);
  const helper = `
function getApiBase(): string {
  try {
    const url = new URL(window.location.href);
    const fromQuery = url.searchParams.get('api');
    if (fromQuery) {
      localStorage.setItem('forum:api_base', fromQuery);
      // clean query param to avoid leaking
      try { url.searchParams.delete('api'); history.replaceState({}, '', url.toString()); } catch {}
    }
    const stored = localStorage.getItem('forum:api_base');
    if (stored) return stored;
  } catch {}
  const env = (import.meta as any).env?.VITE_API_BASE;
  if (env) return env;
  return '${fallback}';
}
`;
  // insert helper after initial comment block or at top
  s = s.replace(/(\r?\n\r?\n)/, `$1${helper}`);
  fs.writeFileSync(file, s, 'utf8');
  console.log(file+': base patched');
}
patchFile('src/store/authRemote.ts', '');
patchFile('src/store/forumRemote.ts', '');
