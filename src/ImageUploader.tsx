import React from 'react';
import { Copy, ImagePlus, Loader2 } from 'lucide-react';

interface Props {
  label?: string;
  className?: string;
}

export default function ImageUploader({ label, className }: Props) {
  const [open, setOpen] = React.useState(false);
  const [file, setFile] = React.useState<File | null>(null);
  const [preview, setPreview] = React.useState<string | null>(null);
  const [link, setLink] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const upload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('https://telegra.ph/upload', {
        method: 'POST',
        body: formData,
      });
      const json = (await res.json()) as { src: string }[];
      if (!res.ok || !json[0]?.src) throw new Error('Upload failed');
      setLink(`https://telegra.ph${json[0].src}`);
    } catch (e) {
      setError('Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
  };

  return (
    <div className="relative">
      <button
        type="button"
        className={label ? `btn ${className ?? ''}` : `text-zinc-500 hover:text-zinc-700 ${className ?? ''}`}
        onClick={() => setOpen(o => !o)}
        aria-label="Загрузить изображение"
      >
        {label ? label : <ImagePlus className="h-4 w-4" />}
      </button>
      {open && (
        <div className="absolute right-0 z-10 mt-1 w-60 rounded-lg border bg-white p-3 text-xs shadow-xl dark:border-zinc-700 dark:bg-zinc-800">
          <div
            className="mb-2 flex h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-zinc-300 p-2 text-center transition-colors hover:border-zinc-400 dark:border-zinc-600 dark:hover:border-zinc-500"
            onDragOver={e => e.preventDefault()}
            onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
          >
            {preview ? (
              <img src={preview} alt="preview" className="max-h-full rounded" />
            ) : (
              <>
                <ImagePlus className="h-5 w-5 text-zinc-500" />
                <span className="text-zinc-500">Перетащите или выберите</span>
              </>
            )}
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => setFile(e.target.files?.[0] || null)}
            />
          </div>
          {link && (
            <div className="mb-2 flex items-center gap-1">
              <a href={link} target="_blank" rel="noreferrer" className="truncate text-blue-600 underline">
                {link}
              </a>
              <button
                className="text-zinc-500 hover:text-zinc-700"
                onClick={() => navigator.clipboard.writeText(link)}
                title="Копировать"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
          {error && <div className="mb-2 text-red-600">{error}</div>}
          <div className="mt-2 flex justify-end gap-2">
            <button
              className="btn px-2 py-1 text-xs"
              onClick={() => {
                setOpen(false);
                setFile(null);
                setLink(null);
                setError(null);
              }}
            >
              Закрыть
            </button>
            <button className="btn px-2 py-1 text-xs" disabled={!file || loading} onClick={upload}>
              {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Подтвердить'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
