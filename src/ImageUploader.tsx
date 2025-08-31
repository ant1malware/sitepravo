import React from 'react';
import { ImagePlus } from 'lucide-react';

export default function ImageUploader() {
  const [open, setOpen] = React.useState(false);
  const [file, setFile] = React.useState<File | null>(null);
  const [link, setLink] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const upload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch('https://api.imgur.com/3/image', {
        method: 'POST',
        headers: { Authorization: `Client-ID ${import.meta.env.VITE_IMGUR_CLIENT_ID}` },
        body: formData,
      });
      const json = await res.json();
      if (!json.success) throw new Error('Upload failed');
      setLink(json.data.link as string);
    } catch (e) {
      setError('Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]);
  };

  return (
    <div className="relative">
      <button type="button" className="text-zinc-500 hover:text-zinc-700" onClick={() => setOpen(o => !o)} aria-label="Загрузить изображение">
        <ImagePlus className="h-4 w-4" />
      </button>
      {open && (
        <div className="absolute right-0 z-10 mt-1 w-52 rounded border bg-white p-2 text-xs shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
          <div
            className="mb-2 flex h-24 cursor-pointer items-center justify-center rounded border border-dashed"
            onDragOver={e => e.preventDefault()}
            onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
          >
            {file ? file.name : 'Перетащите файл'}
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => setFile(e.target.files?.[0] || null)}
            />
          </div>
          {link && (
            <a href={link} target="_blank" rel="noreferrer" className="block truncate text-blue-600 underline">
              {link}
            </a>
          )}
          {error && <div className="text-red-600">{error}</div>}
          <div className="mt-2 flex justify-end gap-1">
            <button className="btn px-2 py-1 text-xs" onClick={() => { setOpen(false); setFile(null); setLink(null); setError(null); }}>
              Закрыть
            </button>
            <button className="btn px-2 py-1 text-xs" disabled={!file || loading} onClick={upload}>
              {loading ? '...' : 'Подтвердить'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
