'use client';
import { useEffect, useState } from 'react';

export default function AdminPage(){
  const [items,setItems]=useState([]);
  const [meRole,setMeRole]=useState('user');

  useEffect(()=>{(async()=>{
    const { getSupabase } = await import('@/lib/supabaseClient');
    const supabase = getSupabase();
    const { data:{ user } } = await supabase.auth.getUser();
    if(!user){ window.location.href='/'; return; }
    const { data: me } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
    setMeRole(me?.role || 'user');
    if(me?.role !== 'admin'){ window.location.href='/dashboard'; return; }

    const { data } = await supabase.from('profiles').select('id, full_name, ruolo, ente, ente_nome, role').order('full_name');
    setItems(data||[]);
  })();},[]);

  return (
    <div className="container-narrow py-8">
      <div className="card p-6">
        <h2 className="text-2xl font-black mb-4">Utenti</h2>
        <div className="space-y-2">
          {items.map(u=>(
            <div key={u.id} className="p-3 border rounded-xl flex justify-between">
              <div>
                <div className="font-bold">{u.full_name || '(senza nome)'} <span className="text-xs opacity-70">({u.role})</span></div>
                <div className="text-sm opacity-80">{[u.ruolo, u.ente, u.ente_nome].filter(Boolean).join(' · ')}</div>
              </div>
            </div>
          ))}
          {!items.length && <div>Nessun utente.</div>}
        </div>
      </div>
    </div>
  );
}
