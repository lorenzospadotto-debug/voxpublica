"use client";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center text-center px-4 py-12">
      <h1 className="text-3xl md:text-5xl font-bold mb-4">
        VoxPublica: aiuta la comunicazione tra politico e cittadino
      </h1>
     <p className="text-gray-600 max-w-2xl mb-6">
      Se sei in cerca di una soluione economica e veloce <strong>per avere un tuo ufficio stampa</strong> questo è il posto giusto.
      </p>
      <p className="text-gray-600 max-w-2xl mb-6">
       <strong>VoxPublica</strong> strumento semplice, moderno e <strong>social</strong> per creare comunicati,
        dichiarazioni e post chiari ed efficaci.
      </p>

      {/* Immagine ridotta del 50% */}
      <div className="w-1/2 max-w-md mb-6">
        <Image
          src="/banner.png"
          alt="VoxPublica Banner"
          width={800}
          height={400}
          className="rounded-lg shadow"
        />
      </div>

      <div className="flex gap-4">
        <Link href="/onboarding">
          <button className="px-6 py-2 rounded bg-black text-white">Iscriviti</button>
        </Link>
        <Link href="/login">
          <button className="px-6 py-2 rounded border border-black">Accedi</button>
        </Link>
      </div>
    </main>
  );
}
