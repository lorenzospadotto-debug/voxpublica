'use client';
import Link from 'next/link';
import { useEffect } from 'react';

const TICKER_HEIGHT = 44; // px

function TickerBar(){
  return (
    <>
      {/* Spazio sotto i contenuti per non farli finire sotto il ticker */}
      <div className="h-[44px]" aria-hidden />

      {/* Ticker fisso in basso, MA non sotto la sidebar su desktop */}
      <div
        className="
          fixed bottom-0 left-0 right-0
          lg:left-64  /* lascia spazio alla sidebar desktop (w-64) */
          h-[44px] bg-[#FFF8F4] border-t border-black/10
          flex items-center overflow-hidden
          z-10
        "
        role="region"
        aria-label="News"
      >
        <div className="px-4 font-bold mr-4 shrink-0">News</div>
        <div className="whitespace-nowrap animate-marquee text-sm opacity-80">
          ANSA • Reuters • Il Sole 24 Ore • Corriere • La Repubblica • BBC • Politico EU • Euronews • Financial Times • Agenzia Dire • Adnkronos • Associated Press • …
        </div>

        <style jsx>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            animation: marquee 60s linear infinite; /* più lento */
          }
        `}</style>
      </div>
    </>
  );
}

export default function DashboardLayout({ children }){
  // protezione base: se non loggato → onboarding
  useEffect(()=>{
    (async()=>{
      const { getSupabase } = await import('@/lib/supabaseClient');
      const supabase = getSupabase();
      const { data } = await supabase.auth.getUser();
      if(!data?.user) window.location.href = '/onboarding';
    })();
  },[]);

  const logout = async()=>{
    const { getSupabase } = await import('@/lib/supabaseClient');
    const supabase = getSupabase();
    await supabase.auth.signOut();
    window.location.href='/';
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* SIDEBAR */}
      <aside
        className="
          w-64 shrink-0 border-r border-black/10 bg-white
          flex flex-col
          z-20  /* sopra al ticker */
          pb-[44px]  /* evita che gli ultimi link finiscano sotto al ticker su mobile */
          sticky top-0 h-screen
        "
        aria-label="Barra laterale di navigazione"
      >
        {/* Logo + titolo */}
        <div className="p-6 border-b border-black/10">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="VoxPublica" className="w-8 h-8 object-contain" />
            <span className="font-black text-lg tracking-tight">VoxPublica</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-2">
          <Link className="block link" href="/dashboard">Dashboard</Link>
          <Link className="block link" href="/dashboard/ufficio-stampa">Ufficio stampa</Link>
          <Link className="block link" href="/dashboard/bozze">Bozze / Archivio</Link>
          <Link className="block link" href="/dashboard/profilo">Profilo</Link>
          <Link className="block link" href="/dashboard/aiuto">Aiuto</Link>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-black/10">
          <button onClick={logout} className="text-sm underline">Esci</button>
        </div>
      </aside>

      {/* CONTENUTO */}
      <main className="flex-1 min-w-0 pb-[44px]"> {/* padding per il ticker */}
        {children}
        <TickerBar/>
      </main>
    </div>
  );
}
