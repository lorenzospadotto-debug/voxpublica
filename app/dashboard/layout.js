'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

function NewsBar(){
const [items,setItems]=useState([]);
useEffect(()=>{ fetch('/api/news').then(r=>r.json()).then(setItems).catch(()=>{}); },[]);
return (
<div className="fixed bottom-0 left-0 right-0 bg-white border-t border-black/10">
<div className="container-narrow marquee text-sm py-2">
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
const [user, setUser] = useState(null);
useEffect(()=>{
supabase.auth.getUser().then(({ data }) => {
if(!data.user){ window.location.href = '/'; } else { setUser(data.user); setReady(true);}
});
},[]);
const logout=async()=>{ await supabase.auth.signOut(); window.location.href='/'; };

if(!ready) return null;
return (
<div className="min-h-[calc(100vh-65px)] flex">
<aside className="w-64 p-6 border-r border-black/10 bg-white">
<nav className="space-y-3">
<Link className="block link" href="/dashboard/ufficio-stampa">Ufficio stampa</Link>
<Link className="block link" href="/dashboard/bozze">Bozze / Archivio</Link>
<Link className="block link" href="/dashboard/profilo">Profilo</Link>
<button onClick={logout} className="mt-6 text-sm underline">Esci</button>
</nav>
</aside>
<main className="flex-1 pb-16">{children}</main>
<NewsBar/>
</div>
);
}
