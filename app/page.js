'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-orange-50 to-white">
      {/* HERO SECTION */}
      <header className="container mx-auto px-6 py-12 text-center">
        <div className="flex justify-center mb-6">
          <Image
            src="/logo.png"
            alt="VoxPublica"
            // dimensioni di riferimento alte (per qualità retina)
            width={800}
            height={320}
            priority
            // 🔥 adattivo: larghezze diverse per viewport; h-auto mantiene le proporzioni
            sizes="(max-width: 480px) 160px,
                   (max-width: 768px) 220px,
                   (max-width: 1024px) 260px,
                   300px"
            className="mx-auto h-auto w-40 sm:w-56 md:w-64 lg:w-72 xl:w-80"
          />
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
          VoxPublica: <span className="text-orange-600">aiuta la comunicazione</span> tra politico e cittadino
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Uno strumento semplice, moderno e <b>sociale</b> per creare comunicati, dichiarazioni e post chiari ed efficaci.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/onboarding" className="btn">Iscriviti</Link>
          <Link href="/login" className="btn-secondary">Accedi</Link>
        </div>
      </header>

      {/* FEATURES SECTION */}
      <main className="container mx-auto px-6 pb-16">
        <div className="grid md:grid-cols-3 gap-6 mt-10">
          <div className="card p-6 text-center shadow-md rounded-xl hover:shadow-lg transition">
            <h3 className="text-xl font-bold mb-2">📰 Ufficio stampa</h3>
            <p className="text-gray-600 mb-4">
              Da un’idea o un file, ottieni un comunicato completo (con dichiarazione).
            </p>
            <Link href="/dashboard/ufficio" className="btn-small">Vai</Link>
          </div>

          <div className="card p-6 text-center shadow-md rounded-xl hover:shadow-lg transition">
            <h3 className="text-xl font-bold mb-2">📱 Social ready</h3>
            <p className="text-gray-600 mb-4">
              Versioni ottimizzate per Instagram, Facebook e WhatsApp in un clic.
            </p>
            <Link href="/dashboard/social" className="btn-small">Vai</Link>
          </div>

          <div className="card p-6 text-center shadow-md rounded-xl hover:shadow-lg transition">
            <h3 className="text-xl font-bold mb-2">🎙️ Tono & profilo</h3>
            <p className="text-gray-600 mb-4">
              Testi coerenti con ruolo, ente e stile comunicativo.
            </p>
            <Link href="/dashboard/profilo" className="btn-small">Vai</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
