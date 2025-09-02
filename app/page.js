'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import NewsTicker from '@/components/NewsTicker';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <main className="min-h-screen bg-[#FFF6EF]">
      {/* Hero */}
      <header className="w-full">
        <div
          className="w-full"
          style={{
            background:
              'radial-gradient(1200px 400px at 50% 0%, rgba(254,235,221,.7), rgba(255,246,239,1) 60%)',
          }}
        >
          <div className="container mx-auto px-4 pt-10 pb-8">
            {/* Banner adattivo */}
            <div className="mx-auto mb-6 flex justify-center">
              <Image
                src="/banner.png"
                alt="VoxPublica"
                priority
                width={680}
                height={260}
                className="h-auto w-[60vw] max-w-[420px] sm:max-w-[520px] md:max-w-[640px] rounded-xl shadow-sm"
                sizes="(max-width: 640px) 90vw, (max-width: 1024px) 70vw, 640px"
              />
            </div>

            {/* Titolo + sottotitolo */}
            <h1 className="text-center font-black leading-tight text-neutral-900"
                style={{ fontSize: 'clamp(26px, 3.8vw, 44px)' }}>
              VoxPublica: <span className="text-[#FF5A2C]">aiuta la comunicazione</span> tra politico e cittadino
            </h1>
            <p className="mt-3 text-center text-neutral-700"
               style={{ fontSize: 'clamp(15px, 2.2vw, 18px)' }}>
              Uno strumento semplice, moderno e <b>sociale</b> per creare comunicati, dichiarazioni e post chiari ed efficaci.
            </p>

            {/* CTA */}
            <div className="mt-6 flex items-center justify-center gap-4">
              <Link
                href="/onboarding"
                className="rounded-xl bg-neutral-900 px-5 py-3 text-[15px] font-bold text-white hover:bg-neutral-800 active:scale-[.99] transition"
              >
                Iscriviti
              </Link>

              {/* Accedi sistemato (link visibile e cliccabile) */}
              <Link
                href="/dashboard"
                className="text-[15px] font-medium text-neutral-700 underline-offset-4 hover:underline"
              >
                Accedi
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Feature cards */}
      <section className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
            <div className="text-lg font-extrabold text-neutral-900">Ufficio stampa</div>
            <p className="mt-2 text-neutral-700">
              Da un’idea o un file, ottieni un comunicato completo (con dichiarazione).
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
            <div className="text-lg font-extrabold text-neutral-900">Social ready</div>
            <p className="mt-2 text-neutral-700">
              Versioni ottimizzate per Instagram, Facebook e WhatsApp in un clic.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
            <div className="text-lg font-extrabold text-neutral-900">Tono &amp; profilo</div>
            <p className="mt-2 text-neutral-700">
              Testi coerenti con ruolo, ente e stile comunicativo.
            </p>
          </div>
        </div>
      </section>

      {/* News ticker (non sovrapposto a sidebar) */}
      <section className="border-t border-black/5 bg-white">
        {mounted && <NewsTicker speed="normal" />}
      </section>
    </main>
  );
}
