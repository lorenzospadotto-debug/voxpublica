'use client';
import { useEffect, useMemo, useState } from 'react';

export default function Bozze(){
  const [items,setItems]=useState([]);
  const [loading,setLoading]=useState(true);
  const [profiles, setProfiles] = useState([]);
  const [me, setMe] = useState(null);

  // Carica bozze dell'utente + elenco profili per i picker
  useEffect(()=>{(async()=>{
    const { getSupabase } = await import('@/lib/supabaseClient');
    const supabase = getSupabase();

    const { data:{ user } } = await supabase.auth.getUser();
    if(!user){ window.location.href='/'; return; }
    setMe(user);

    const [{ data: drafts }, { data: profs }] = await Promise.all([
      supabase.from('drafts').select('*').order('created_at',{ascending:false}),
      supabase.from('profiles').select('id, full_name, ruolo, ente')
    ]);

    setItems(drafts || []);
    setProfiles((profs || []).sort((a,b)=> (a.full_name||'').localeCompare(b.full_name||'')));
    setLoading(false);
  })();},[]);

  const copy=(t)=>navigator.clipboard.writeText(t);

  const profileLabel = (p)=>{
    const name = p.full_name || '(senza nome)';
    const extra = [p.ruolo, p.ente].filter(Boolean).join(' · ');
    return extra ? `${name} — ${extra}` : name;
  };

  const onAssignChange = async (draftId, field, value) => {
    // field: 'assigned_to' | 'reviewer_id'
    const { getSupabase } = await import('@/lib/supabaseClient');
    const supabase = getSupabase();

    // Aggiorna bozza
    const { error } = await supabase.from('drafts').update({ [field]: value || null }).eq('id', draftId);
    if (error) { alert(error.message); return; }

    // Aggiorna UI locale
    setItems(prev => prev.map(d => d.id === draftId ? { ...d, [field]: value || null } : d));

    // Log timeline
    const who = profiles.find(p => p.id === value);
    const label = field === 'assigned_to' ? 'assigned_to' : 'reviewer_id';
    const action = value
      ? `set ${label} -> ${who?.full_name || value}`
      : `unset ${label}`;

    await supabase.from('draft_logs').insert({
      draft_id: draftId,
      user_id: me?.id || null,
      action
    });
  };

  const personName = (id)=>{
    if(!id) return '—';
    const p = profiles.find(p=>p.id===id);
    return p ? p.full_name || p.id : id;
  };

  if(loading) return <div className="container-narrow p-8">Carico…</div>;

  return (
    <div className="container-narrow py-8">
      <div className="card p-6">
        <h2 className="text-2xl font-black mb-4">Bozze & Archivio</h2>

        <div className="space-y-5">
          {items.map(it=> (
            <div key={it.id} className="p-4 border rounded-xl">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="text-xs opacity-70">{new Date(it.created_at).toLocaleString()}</div>
                  <div className="font-bold">{it.title||'(senza titolo)'} — <span className="uppercase">{it.type}</span></div>
                </div>
                <div className="text-xs">
                  {it.published ? <span className="px-2 py-1 rounded bg-green-100 text-green-900">PUBBLICATA</span>
                                 : <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-900">BOZZA</span>}
                </div>
              </div>

              {/* Testo */}
              <pre className="whitespace-pre-wrap mt-3 text-sm">{it.content}</pre>

              {/* Picker Assegnazione/Reviewer */}
              <div className="grid md:grid-cols-2 gap-3 mt-4">
                <div>
                  <label className="label">Assegna a</label>
                  <select
                    className="input w-full"
                    value={it.assigned_to || ''}
                    onChange={(e)=> onAssignChange(it.id, 'assigned_to', e.target.value || null)}
                  >
                    <option value="">— Nessuno</option>
                    {profiles.map(p=> (
                      <option key={p.id} value={p.id}>{profileLabel(p)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Reviewer</label>
                  <select
                    className="input w-full"
                    value={it.reviewer_id || ''}
                    onChange={(e)=> onAssignChange(it.id, 'reviewer_id', e.target.value || null)}
                  >
                    <option value="">— Nessuno</option>
                    {profiles.map(p=> (
                      <option key={p.id} value={p.id}>{profileLabel(p)}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Info rapida */}
              <div className="text-sm opacity-80 mt-2">
                <span>Assegnato: <b>{personName(it.assigned_to)}</b></span> ·{' '}
                <span>Reviewer: <b>{personName(it.reviewer_id)}</b></span>
              </div>

              {/* Azioni */}
              <div className="mt-3 flex gap-2">
                <button className="btn" onClick={()=>copy(it.content)}>Copia</button>
              </div>
            </div>
          ))}
          {!items.length && <div>Nessuna bozza salvata.</div>}
        </div>
      </div>
    </div>
  );
}
