'use client';
import Link from 'next/link';
import { useEffect } from 'react';

function NewsBar(){
  return (
    <aside className="hidden lg:block w-72 border-l border-black/10 p-4 bg-[#FFF8F4]">
      <div className="font-bold mb-3">News</div>
      <div className="text-sm opacity-80 animate-marquee [animation-duration:40s] whitespace-nowrap overflow-hidden">
        ANSA • Reuters • Il Sole 24 Ore • Corriere • La Repubblica • BBC • Politico EU • …
      </div>
      <style jsx>{`
        @keyframes marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        .animate-marquee{ animation-name: marquee; animation-iteration-count: infinite; animation-timing-function: linear; }
      `}</style>
    </aside>
  );
}

export default function DashboardLayout({ children }){
  // protezione base: se non loggato, rimanda alla home/login
  useEffect(()=>{
    (async()=>{
      const { getSupabase } = await import('@/lib/supabaseClient');
      const supabase = getSupabase();
      const { data } = await supabase.auth.getUser();
      if(!data?.user) window.location.href = '/login';
    })();
  },[]);

  const logout = async()=>{
    const { getSupabase } = await import('@/lib/supabaseClient');
    const supabase = getSupabase();
    await supabase.auth.signOut();
    window.location.href='/';
  };

  return (
    <div className="min-h-[calc(100vh-65px)] flex">
      <aside className="w-64 p-6 border-r border-black/10 bg-white flex flex-col">
        <nav className="space-y-3">
          <Link className="block link" href="/dashboard/ufficio-stampa">Ufficio stampa</Link>
          <Link className="block link" href="/dashboard/bozze">Bozze / Archivio</Link>
          <Link className="block link" href="/dashboard/aiuto">Aiuto</Link>
        </nav>
        <div className="mt-auto">
          <Link className="block link opacity-80" href="/dashboard/profilo">Profilo</Link>
          <button onClick={logout} className="mt-3 text-sm underline">Esci</button>
        </div>
      </aside>
      <main className="flex-1 pb-16">{children}</main>
      <NewsBar/>
    </div>
  );
}
