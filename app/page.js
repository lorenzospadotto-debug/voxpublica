// app/page.js
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* HEADER + BANNER (colore uniforme come il banner) */}
      <header className="w-full bg-[#FFEFE5]"> 
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4 sm:py-6">
          {/* Banner responsive */}
          <div className="relative w-full">
            <Image
              src="/banner.png"
              alt="VoxPublica"
              width={1600}
              height={400}
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
              className="w-full h-auto block"
            />
          </div>
        </div>
      </header>

      {/* HERO */}
      <main className="mx-auto max-w-6xl px-4 sm:px-6 pt-8 sm:pt-12 pb-16">
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#14171A] text-center">
          VoxPublica: aiuta la comunicazione tra politico e cittadino
        </h1>
        <p className="mt-4 sm:mt-6 text-base sm:text-lg text-center text-black/60">
          Uno strumento semplice, moderno e <span className="font-semibold">sociale</span> per creare comunicati,
          dichiarazioni e post chiari ed efficaci.
        </p>

        {/* CTA */}
        <div className="mt-6 sm:mt-8 flex gap-3 justify-center">
          <Link href="/onboarding" className="btn">Accedi</Link>
          <Link href="/onboarding" className="btn btn-outline">Iscriviti</Link>
        </div>

        {/* Feature cards */}
        <section className="mt-8 sm:mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="card p-5 sm:p-6">
            <h3 className="font-bold text-[#14171A]">Ufficio stampa</h3>
            <p className="mt-2 text-sm text-black/60">
              Da un’idea o un file, ottieni un comunicato completo (con dichiarazione).
            </p>
          </div>
          <div className="card p-5 sm:p-6">
            <h3 className="font-bold text-[#14171A]">Social ready</h3>
            <p className="mt-2 text-sm text-black/60">
              Versioni per Instagram, Facebook e WhatsApp in un clic.
            </p>
          </div>
          <div className="card p-5 sm:p-6">
            <h3 className="font-bold text-[#14171A]">Tono &amp; profilo</h3>
            <p className="mt-2 text-sm text-black/60">
              Testi coerenti con ruolo, ente e stile comunicativo.
            </p>
          </div>
        </section>

        {/* CTA (bottom) */}
        <div className="mt-8 sm:mt-10 flex gap-3 justify-center">
          <Link href="/onboarding" className="btn">Accedi</Link>
          <Link href="/onboarding" className="btn btn-outline">Iscriviti</Link>
        </div>
      </main>
    </div>
  );
}
