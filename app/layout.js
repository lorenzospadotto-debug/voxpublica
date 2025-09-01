import './globals.css';
import Image from 'next/image';

export const metadata = {
  title: 'VoxPublica',
  description: 'AI per comunicati stampa, dichiarazioni e testi social.',
};

function TopHeader(){
  const banners = ['/banners/1.jpg','/banners/2.jpg','/banners/3.jpg'];
  // Scelta random ad ogni render (SSR): se non esiste, verrà nascosto
  const pick = banners[Math.floor(Math.random()*banners.length)];

  return (
    <header className="relative">
      {/* Banner */}
      <div className="h-28 w-full overflow-hidden bg-gradient-to-r from-[#FCE6D9] to-[#F9EFE9]">
        {pick && (
          // Usa img per evitare errore se il file non c'è ancora
          <img src={pick} alt="" className="w-full h-full object-cover opacity-80" onError={(e)=>{ e.currentTarget.style.display='none'; }} />
        )}
      </div>
      {/* Logo in alto a destra */}
      <div className="absolute top-2 right-3">
        <Image src="/logo.png" alt="VoxPublica" width={44} height={44} priority />
      </div>
    </header>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body className="bg-[#FDF9F6] text-[#1F1A17]">
        <TopHeader/>
        {children}
      </body>
    </html>
  );
}
