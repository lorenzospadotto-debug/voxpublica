'use client';
import Image from 'next/image';
import { useMemo, useState } from 'react';

export default function TopHeader(){
  // Sostituisci/aggiungi i file reali che metterai in /public/banners/
  const banners = ['/banners/1.jpg','/banners/2.jpg','/banners/3.jpg'];
  // Scegli 1 banner una volta sola
  const pick = useMemo(() => banners[Math.floor(Math.random() * banners.length)], []);
  const [showImg, setShowImg] = useState(true);

  return (
    <header className="relative">
      {/* Contenitore del banner */}
      <div className="relative h-28 w-full overflow-hidden bg-gradient-to-r from-[#FCE6D9] to-[#F9EFE9]">
        {showImg && pick && (
          <Image
            src={pick}
            alt=""
            fill
            priority
            className="object-cover opacity-80"
            onError={() => setShowImg(false)}  // OK: siamo in un Client Component
          />
        )}
      </div>

      {/* Logo in alto a destra */}
      <div className="absolute top-2 right-3">
        <Image src="/logo.png" alt="VoxPublica" width={44} height={44} priority />
      </div>
    </header>
  );
}
