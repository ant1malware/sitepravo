export type SchemaObject = Record<string, any>;

export function setPageMeta(title?: string, description?: string, schema?: SchemaObject) {
  try {
    if (title) document.title = title;
  } catch {}
  try {
    if (description !== undefined) {
      let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'description';
        document.head.appendChild(meta);
      }
      meta.content = description || '';
    }
  } catch {}
  try {
    const id = 'app-schema-jsonld';
    let script = document.getElementById(id) as HTMLScriptElement | null;
    if (schema) {
      if (!script) {
        script = document.createElement('script');
        script.type = 'application/ld+json';
        script.id = id;
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(schema);
    } else if (script) {
      script.remove();
    }
  } catch {}
}

export function setOgTags(opts: { title?: string; description?: string; url?: string; image?: string; canonical?: string }) {
  try {
    const set = (name: string, content: string) => {
      let m = document.querySelector(`meta[property="${name}"]`) as HTMLMetaElement | null;
      if (!m) { m = document.createElement('meta'); m.setAttribute('property', name); document.head.appendChild(m); }
      m.setAttribute('content', content);
    };
    if (opts.title) set('og:title', opts.title);
    if (opts.description !== undefined) set('og:description', opts.description || '');
    if (opts.url) set('og:url', opts.url);
    if (opts.image) set('og:image', opts.image);
    if (opts.canonical) {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
      link.href = opts.canonical;
    }
  } catch {}
}
