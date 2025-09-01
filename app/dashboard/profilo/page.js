'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const TONI = [
  'Istituzionale e sobrio',
  'Deciso e propositivo',
  'Empatico e inclusivo',
  'Pragmatico e concreto',
  'Battagliero e riformista'
];

export default function Profilo(){
  const search = useSearchParams();
  const first = search.get('first');
  const [user,setUser]=useState(null);
  const [form,setForm]=useState({full_name:'', ruolo:'', ente:'', tono:TONI[0], tono_altro:'', samples:''});
  const [busy,setBusy]=useState(false);

  useEffect(()=>{(async()=>{
    const { getSupabase } = await import('@/lib/supabaseClient');
    const supabase = getSupabase();
    const { data:{ user } } = await supabase.auth.getUser();
    if(!user){ window.location.href='/'; return; }
    setUser(user);
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
    if(data) setForm({
      full_name:data.full_name||'', ruolo:data.ruolo||'', ente:data.ente||'', tono:data.tono||TONI[0], tono_altro:data.tono_altro||'', samples:data.samples||''
    });
  })();},[]);

  const save = async()=>{
    setBusy(true);
    try{
      const { getSupabase } = await import('@/lib/supabaseClient');
      const supabase = getSupabase();
      const payload = { id:user.id, ...form };
      const { error } = await supabase.from('profiles').upsert(payload).eq('id', user.id);
      if(error) throw error;
      if(first) window.location.href='/dashboard/ufficio-stampa';
      else alert('Profilo salvato');
    }catch(e){ alert(e.message); }
    finally{ setBusy(false); }
  }

  return (
    <div className="container-narrow py-8">
      <div className="card p-8">
        <h2 className="text-2xl font-black mb-6">Profilo</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="label">Nome e Cognome</label>
            <input className="input w-full" value={form.full_name} onChange={e=>setForm({...form,full_name:e.target.value})}/>
          </div>
          <div>
            <label className="label">Ruolo</label>
            <input className="input w-full" value={form.ruolo} onChange={e=>setForm({...form,ruolo:e.target.value})}/>
          </div>
          <div>
            <label className="label">Ente</label>
            <input className="input w-full" value={form.ente} onChange={e=>setForm({...form,ente:e.target.value})}/>
          <label className="block mt-4">
          <span className="text-sm font-medium">Nome ente</span>
          <input
            type="text"
            name="ente_nome"
            className="mt-1 block w-full border rounded p-2"
            placeholder="Es. Comune di Firenze"
            />
          </label>
          </div>
          <div>
            <label className="label">Tono delle comunicazioni</label>
            <select className="input w-full" value={form.tono} onChange={e=>setForm({...form,tono:e.target.value})}>
              {TONI.map(t=> <option key={t} value={t}>{t}</option>)}
            </select>
            <input className="input w-full mt-2" placeholder="Altro (facoltativo)" value={form.tono_altro} onChange={e=>setForm({...form,tono_altro:e.target.value})}/>
          </div>
          <div className="md:col-span-2">
            <label className="label">Vecchi comunicati (facoltativo)</label>
            <textarea className="input w-full h-40" value={form.samples} onChange={e=>setForm({...form,samples:e.target.value})} placeholder="Incolla qui qualche tuo comunicato"/>
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          <button className="btn" disabled={busy} onClick={save}>{first? 'SALVA E AVANTI' : 'Salva'}</button>
        </div>
      </div>
    </div>
  );
}
