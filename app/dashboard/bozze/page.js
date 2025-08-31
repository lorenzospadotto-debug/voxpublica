'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default function Bozze(){
const [items,setItems]=useState([]);
const [loading,setLoading]=useState(true);

useEffect(()=>{(async()=>{
const { data:{ user } } = await supabase.auth.getUser();
const { data } = await supabase.from('drafts').select('*').order('created_at',{ascending:false});
setItems(data||[]); setLoading(false);
})();},[]);

const copy=(t)=>navigator.clipboard.writeText(t);

if(loading) return <div className="container-narrow p-8">Carico…</div>;
return (
<div className="container-narrow py-8">
<div className="card p-6">
<h2 className="text-2xl font-black mb-4">Bozze & Archivio</h2>
<div className="space-y-5">
{items.map(it=> (
<div key={it.id} className="p-4 border rounded-xl">
<div className="text-xs opacity-70">{new Date(it.created_at).toLocaleString()}</div>
<div className="font-bold">{it.title||'(senza titolo)'} — <span className="uppercase">{it.type}</span></div>
<pre className="whitespace-pre-wrap mt-2 text-sm">{it.content}</pre>
<div className="mt-2"><button className="btn" onClick={()=>copy(it.content)}>Copia</button></div>
</div>
))}
{!items.length && <div>Nessuna bozza salvata.</div>}
</div>
</div>
</div>
);
}
