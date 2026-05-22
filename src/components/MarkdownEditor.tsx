import React from 'react';
import { Bold, Italic, Link as LinkIcon, Code, List, Quote, Image, Eye, Video, ListTodo, Eraser } from 'lucide-react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

export default function MarkdownEditor({ value, onChange, onSubmit, placeholder, disabled, submitLabel = 'Send', draftKey, projectTemplate }: {
  value: string;
  onChange: (v: string) => void;
  onSubmit?: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
  submitLabel?: string;
  draftKey?: string;          // autosave key, e.g. forum:draft:<topicId>
  projectTemplate?: boolean;  // show project template button (Workshop only)
}) {
  const [tab, setTab] = React.useState<'write' | 'preview'>('write');
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const [lastAttachment, setLastAttachment] = React.useState<string | null>(null);

  // Load draft on mount
  React.useEffect(() => {
    if (!draftKey) return;
    try {
      const stored = localStorage.getItem(draftKey) || '';
      if (stored && !value) onChange(stored);
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftKey]);

  // Save draft on change
  React.useEffect(() => {
    if (!draftKey) return;
    try { localStorage.setItem(draftKey, value || ''); } catch {}
  }, [value, draftKey]);

  // Warn on unload if draft has unsaved content
  React.useEffect(() => {
    if (!draftKey) return;
    const handler = (e: BeforeUnloadEvent) => {
      const hasContent = (value || '').trim().length > 0;
      if (hasContent) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [draftKey, value]);

  function insert(before: string, after: string = ''): string {
    const el = textareaRef.current; const text = value || '';
    const start = el ? (el.selectionStart || 0) : text.length;
    const end = el ? (el.selectionEnd || 0) : text.length;
    const selected = text.slice(start, end);
    const chunk = before + selected + after;
    const next = text.slice(0, start) + chunk + text.slice(end);
    onChange(next);
    requestAnimationFrame(() => { try { el?.focus(); el!.selectionStart = el!.selectionEnd = start + before.length + selected.length; } catch {} });
    return chunk;
  }

  function onPickImage(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return; const r = new FileReader();
    r.onload = () => { const url = String(r.result || ''); const chunk = `\n\n![image](${url})\n\n`; insert(chunk, ''); setLastAttachment(chunk); };
    r.readAsDataURL(f);
  }

  function onInsertVideo() {
    const url = prompt('Video URL (YouTube/Vimeo/direct)'); if (!url) return;
    if (/youtu\.be\/.+|youtube\.com\/watch\?v=/.test(url)) {
      const idMatch = url.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{6,})/);
      const id = idMatch?.[1];
      if (id) { insert(`\n\n<iframe width=\"560\" height=\"315\" src=\"https://www.youtube.com/embed/${id}\" frameborder=\"0\" allowfullscreen></iframe>\n\n`); return; }
    }
    insert(`\n\n${url}\n\n`);
  }

  function onInsertPoll() { insert(`\n\n> [poll]\n> Question?\n> - Option A\n> - Option B\n> - Option C\n\n`); }
  function onInsertTasks() { insert(`\n\n- [ ] Задача 1\n- [ ] Задача 2\n- [x] Готово\n\n`); }
  function onInsertProject() {
    insert(`\n\n# Проект: Название\n\n## Цели\n- ...\n\n## Технологии\n- ...\n\n## Прогресс\n- [ ] Шаг 1\n- [ ] Шаг 2\n\n`);
  }

  // keyboard shortcuts
  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    const meta = e.metaKey || e.ctrlKey;
    if (!meta) return;
    if (e.key.toLowerCase() === 'b') { e.preventDefault(); insert('**', '**'); }
    else if (e.key.toLowerCase() === 'i') { e.preventDefault(); insert('_', '_'); }
    else if (e.key.toLowerCase() === 'k') { e.preventDefault(); insert('[text](', ')'); }
    else if (e.key === '`') { e.preventDefault(); insert('`', '`'); }
  }

  // drag & drop images
  function onDragOver(e: React.DragEvent) { e.preventDefault(); }
  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    const files = e.dataTransfer?.files; if (!files || files.length === 0) return;
    const f = files[0]; if (!f || !/^image\//.test(f.type)) return;
    const r = new FileReader(); r.onload = () => { const url = String(r.result || ''); const chunk = `\n\n![image](${url})\n\n`; insert(chunk, ''); setLastAttachment(chunk); }; r.readAsDataURL(f);
  }
  function clearAttachment() {
    if (!lastAttachment) return;
    const idx = value.indexOf(lastAttachment);
    if (idx >= 0) { onChange(value.slice(0, idx) + value.slice(idx + lastAttachment.length)); }
    setLastAttachment(null);
  }

  const html = React.useMemo(() => {
    try { return DOMPurify.sanitize(marked.parse(value || '') as string); } catch { return ''; }
  }, [value]);

  return (
    <div className="w-full" onDragOver={onDragOver} onDrop={onDrop}>
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <button type="button" className="btn" onClick={() => insert('**', '**')} title="Bold"><Bold size={14} /></button>
        <button type="button" className="btn" onClick={() => insert('_', '_')} title="Italic"><Italic size={14} /></button>
        <button type="button" className="btn" onClick={() => insert('[text](', ')')} title="Link"><LinkIcon size={14} /></button>
        <button type="button" className="btn" onClick={() => insert('`', '`')} title="Inline code"><Code size={14} /></button>
        <button type="button" className="btn" onClick={() => insert('\n\n````\n', '\n````\n')} title="Code block"><Code size={14} /> <span className="ml-1">{`{}`}</span></button>
        <button type="button" className="btn" onClick={() => insert('\n\n- ')} title="List"><List size={14} /></button>
        <button type="button" className="btn" onClick={() => insert('\n\n> ')} title="Quote"><Quote size={14} /></button>
        <label className="btn" title="Insert image">
          <Image size={14} />
          <input type="file" accept="image/*" hidden onChange={onPickImage} />
        </label>
        <button type="button" className="btn" onClick={onInsertVideo} title="Insert video"><Video size={14} /></button>
        <button type="button" className="btn" onClick={onInsertPoll} title="Insert poll">Poll</button>
        <button type="button" className="btn" onClick={onInsertTasks} title="Task list"><ListTodo size={14} /></button>
        {projectTemplate && (<button type="button" className="btn" onClick={onInsertProject} title="Insert project template">Insert Project Template</button>)}
        {lastAttachment && (
          <button type="button" className="btn" onClick={clearAttachment} title="Удалить вложение"><Eraser size={14} /> Clear</button>
        )}
        <div className="ml-auto flex items-center gap-1">
          <button type="button" className={`tab ${tab==='write'?'tab-active':''}`} onClick={() => setTab('write')}>Write</button>
          <button type="button" className={`tab ${tab==='preview'?'tab-active':''}`} onClick={() => setTab('preview')}><Eye size={14} /> Preview</button>
        </div>
      </div>
      {tab === 'write' ? (
        <textarea ref={textareaRef} className="input min-h-[120px]" placeholder={placeholder || 'Write in Markdown...'} value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled} onKeyDown={onKeyDown} />
      ) : (
        <div className="prose prose-invert max-w-none rounded-lg border p-3" style={{ borderColor: 'var(--border)', background: 'var(--surface-2)' }} dangerouslySetInnerHTML={{ __html: html }} />
      )}
      {onSubmit && (
        <div className="mt-2 flex justify-end">
          <button type="button" className="btn btn-primary" onClick={() => { const t = value.trim(); if (!t) return; onSubmit(t); if (draftKey) try { localStorage.removeItem(draftKey); } catch {} }} disabled={disabled}>{submitLabel}</button>
        </div>
      )}
    </div>
  );
}
