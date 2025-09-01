'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

function NewsBar(){
  const [items,setItems]=useState([]);
  useEffect(()=>{ fetch('/api/news').then(r=>r.json()).then(setItems).catch(()=>{}); },[]);
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-black/10">
      <div className="container-narrow marquee-slow text-sm py-2">
        <span>
          {items.map((n,i)=> (
            <a key={i} href={n.link} target="_blank" className="mr-8 hover:underline">[{n.source}] {n.title}</a>
          ))}
        </span>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }){
  const [ready, setReady] = useState(false);

  useEffect(()=>{
    (async()=>{
      const { getSupabase } = await import('@/lib/supabaseClient');
      const supabase = getSupabase();
      const { data } = await supabase.auth.getUser();
      if(!data.user){ window.location.href = '/'; }
      else { setReady(true); }
    })();
  },[]);

  const logout=async()=>{
    const { getSupabase } = await import('@/lib/supabaseClient');
    const supabase = getSupabase();
    await supabase.auth.signOut();
    window.location.href='/';
  };

  if(!ready) return null;
  return (
    <div className="min-h-[calc(100vh-65px)] flex">
      <aside className="w-64 p-6 border-r border-black/10 bg-white flex flex-col">
        <nav className="space-y-3">
          <Link className="block link" href="/dashboard/ufficio-stampa">Ufficio stampa</Link>
          <Link className="block link" href="/dashboard/bozze">Bozze / Archivio</Link>
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
