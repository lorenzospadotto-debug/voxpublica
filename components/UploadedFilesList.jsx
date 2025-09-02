'use client';

export default function UploadedFilesList({ files = [], onChange }) {
  const removeAt = (idx) => {
    if (!onChange) return;
    onChange(files.filter((_, i) => i !== idx));
  };

  if (!files.length) return null;

  return (
    <ul className="mt-3 space-y-2">
      {files.map((f, idx) => {
        const name = typeof f === 'string' ? f.split('/').pop() : (f.name || 'file');
        const size = typeof f?.size === 'number' ? ` • ${(f.size/1024).toFixed(0)} KB` : '';
        return (
          <li
            key={idx}
            className="flex items-center justify-between rounded-lg border border-black/10 bg-white px-3 py-2 text-sm"
          >
            <span className="truncate">{name}{size}</span>
            <button
              type="button"
              aria-label="Rimuovi file"
              className="ml-3 inline-flex h-7 w-7 items-center justify-center rounded-md bg-red-50 text-red-600 hover:bg-red-100"
              onClick={() => removeAt(idx)}
              title="Rimuovi"
            >
              ×
            </button>
          </li>
        );
      })}
    </ul>
  );
}
