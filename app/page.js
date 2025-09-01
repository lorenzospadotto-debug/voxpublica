// app/page.js  (SERVER)
import Link from 'next/link';
export const revalidate = 0;

export default function Home() {
  return (
    <main className="container-narrow py-10">
      <section className="text-center py-10">
        <h1 className="text-4xl md:text-5xl font-black leading-tight">
          VoxPublica: <span className="block md:inline">aiuta la comunicazione</span>{' '}
          <span className="block md:inline">tra politico e cittadino</span>
        </h1>
        <p className="mt-4 text-lg opacity-80">
          Uno strumento semplice, moderno e <b>sociale</b> per creare comunicati, dichiarazioni e post chiari ed efficaci.
        </p>
        <div className="mt-6 flex gap-3 justify-center">
          <Link href="/login" className="btn">Accedi</Link>
          <Link href="/signup" className="btn btn-outline">Iscriviti</Link>
        </div>
      </section>
      <section className="grid md:grid-cols-3 gap-4 mt-10">
        <div className="card p-5">
          <h3 className="font-bold">Ufficio stampa</h3>
          <p className="text-sm mt-1 opacity-80">Da un’idea o un file, ottieni un comunicato completo (con dichiarazione).</p>
        </div>
        <div className="card p-5">
          <h3 className="font-bold">Social ready</h3>
          <p className="text-sm mt-1 opacity-80">Versioni per Instagram, Facebook e WhatsApp in un clic.</p>
        </div>
        <div className="card p-5">
          <h3 className="font-bold">Tono & profilo</h3>
          <p className="text-sm mt-1 opacity-80">Testi coerenti con ruolo, ente e stile comunicativo.</p>
        </div>
    // dentro app/page.js
        <div className="mt-6 flex gap-3 justify-center">
        <Link href="/onboarding" className="btn">Accedi</Link>
        <Link href="/onboarding" className="btn btn-outline">Iscriviti</Link>
        </div>
      </section>
    </main>
  );
}
