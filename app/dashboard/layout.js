'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

function NewsBar(){ /* ...resto uguale... */ }

export default function DashboardLayout({ children }){
  const [ready, setReady] = useState(false);
  const [role, setRole] = useState('user');

  useEffect(()=>{
    (async()=>{
      const { getSupabase } = await import('@/lib/supabaseClient');
      const supabase = getSupabase();
      const { data } = await supabase.auth.getUser();
      if(!data.user){ window.location.href = '/'; return; }
      const { data: prof } = await supabase.from('profiles').select('role').eq('id', data.user.id).maybeSingle();
      setRole(prof?.role || 'user');
      setReady(true);
    })();
  },[]);
  // ...logout e render come prima...

  if(!ready) return null;
  return (
    <div className="min-h-[calc(100vh-65px)] flex">
      <aside className="w-64 p-6 border-r border-black/10 bg-white flex flex-col">
        <nav className="space-y-3">
          <Link className="block link" href="/dashboard/ufficio-stampa">Ufficio stampa</Link>
          <Link className="block link" href="/dashboard/bozze">Bozze / Archivio</Link>
          <Link className="block link" href="/aiuto">Aiuto</Link>
          {role === 'admin' && (
            <Link className="block link text-[#E94E2B]" href="/dashboard/admin">Admin</Link>
          )}
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
