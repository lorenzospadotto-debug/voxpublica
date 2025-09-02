'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';

export default function NewsTicker({ speed = 'normal' }) {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState('');
  const wrapRef = useRef(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch('/api/news', { cache: 'no-store' });
        if (!res.ok) throw new Error('news fetch failed');
        const data = await res.json();
        if (alive) setItems(data?.items ?? []);
      } catch (e) {
        setErr('Nessuna notizia disponibile al momento');
      }
    })();
    return () => { alive = false; };
  }, []);

  // durata scorrimento (desktop/mobile)
  const duration = speed === 'slow' ? 40 : speed === 'fast' ? 18 : 26;

  return (
    <div className="w-full overflow-hidden">
      <div
        ref={wrapRef}
        className="flex gap-8 whitespace-nowrap py-3 text-sm sm:text-[15px]"
        style={{
          animation: `ticker ${duration}s linear infinite`,
        }}
      >
        {(items.length ? items : [{ title: err || 'Caricamento notizie…', source: 'VoxPublica', url: '#' }])?.map(
          (n, i) => (
            <span key={i} className="inline-flex items-center gap-2 text-neutral-800">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#FF5A2C]" />
              <Link
                href={n.url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
                title={n.source ? `${n.source}` : undefined}
              >
                {n.title}
                {n.source ? <span className="text-neutral-500"> — {n.source}</span> : null}
              </Link>
            </span>
          )
        )}
      </div>

      {/* CSS animazione */}
      <style jsx global>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
