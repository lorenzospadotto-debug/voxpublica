'use client';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

// Evita prerender SSG su pagina con dati utente
export const dynamic = 'force-dynamic';

function ProfiloInner() {
  const search = useSearchParams(); // ora siamo in un componente separato
  const [form, setForm] = useState({
    full_name: '',
    ruolo: '',
    ente: '',
    ente_nome: '',
    tono: '',
    tono_altro: '',
    email_istituzionale: '',
    usa_email_profilo: true,
    indirizzo: '',
    telefono: '',
    allega_contatti: false
  });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      const { getSupabase } = await import('@/lib/supabaseClient');
      const supabase = getSupabase();
      const { data: auth } = await supabase.auth.getUser();
      if (!auth?.user) { window.location.href = '/onboarding'; return; }

      const { data: prof } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', auth.user.id)
        .maybeSingle();

      if (prof) {
        setForm({
          full_name: prof.full_name || '',
          ruolo: prof.ruolo || '',
          ente: prof.ente || '',
          ente_nome: prof.ente_nome || '',
          tono: prof.tono || '',
          tono_altro: prof.tono_altro || '',
          email_istituzionale: prof.email_istituzionale || '',
          usa_email_profilo: prof.usa_email_profilo ?? true,
          indirizzo: prof.indirizzo || '',
          telefono: prof.telefono || '',
          allega_contatti: prof.allega_contatti ?? false,
        });
      }
    })();
  }, []);

  const save = async () => {
    setBusy(true);
    try {
      const { getSupabase } = await import('@/lib/supabaseClient');
      const supabase = getSupabase();
      const { data: auth } = await supabase.auth.getUser();
      if (!auth?.user) throw new Error('Non autenticato');

      const payload = {
        id: auth.user.id,
        full_name: form.full_name.trim(),
        ruolo: form.ruolo,
        ente: form.ente,
        ente_nome: form.ente_nome?.trim(),
        tono: form.tono,
        tono_altro: form.tono_altro?.trim(),
        email_istituzionale: form.email_istituzionale?.trim(),
        usa_email_profilo: !!form.usa_email_profilo,
        indirizzo: form.indirizzo?.trim(),
        telefono: form.telefono?.trim(),
        allega_contatti: !!form.allega_contatti,
      };

      const { error } = await supabase.from('profiles').upsert(payload).eq('id', auth.user.id);
      if (error) throw error;
      alert('Profilo salvato');
      window.location.href = '/dashboard';
    } catch (e) {
      alert(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container-narrow py-8 space-y-6">
      <div className="card p-6">
        <h2 className="text-2xl font-black mb-4">Profilo</h2>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="label">Nome e cognome</label>
            <input className="input w-full" value={form.full_name} onChange={e=>setForm({...form, full_name:e.target.value})}/>
          </div>

          <div>
            <label className="label">Ruolo</label>
            <select className="input w-full" value={form.ruolo} onChange={e=>setForm({...form, ruolo:e.target.value})}>
              <option value="">Seleziona</option>
              <option>Sindaco</option>
              <option>Assessore</option>
              <option>Consigliere</option>
              <option>Onorevole</option>
              <option>Senatore</option>
              <option>Presidente</option>
              <option>Portavoce</option>
              <option>Altro</option>
            </select>
          </div>

          <div>
            <label className="label">Ente</label>
            <select className="input w-full" value={form.ente} onChange={e=>setForm({...form, ente:e.target.value})}>
              <option value="">Seleziona</option>
              <option>Comune</option>
              <option>Città Metropolitana</option>
              <option>Provincia</option>
              <option>Regione</option>
              <option>Governo</option>
              <option>Parlamento</option>
              <option>Altro</option>
            </select>
          </div>

          <div>
            <label className="label">Nome ente</label>
            <input className="input w-full" placeholder="Es. Comune di Firenze"
              value={form.ente_nome} onChange={e=>setForm({...form, ente_nome:e.target.value})}/>
          </div>

          <div className="md:col-span-2">
            <label className="label">Tono delle comunicazioni</label>
            <select className="input w-full" value={form.tono} onChange={e=>setForm({...form, tono:e.target.value})}>
              <option value="">Seleziona</option>
              <option>Empatico e inclusivo</option>
              <option>Pragmatico e concreto</option>
              <option>Battagliero e riformista</option>
              <option>Istituzionale e formale</option>
              <option>Popolare e diretto</option>
              <option>Altro</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="label">Altro (tono)</label>
            <input className="input w-full" value={form.tono_altro} onChange={e=>setForm({...form, tono_altro:e.target.value})}/>
          </div>

          <div>
            <label className="label">Email istituzionale</label>
            <input className="input w-full" type="email" value={form.email_istituzionale}
              onChange={e=>setForm({...form, email_istituzionale:e.target.value})}/>
            <label className="text-sm mt-2 flex items-center gap-2">
              <input type="checkbox" checked={form.usa_email_profilo}
                onChange={e=>setForm({...form, usa_email_profilo:e.target.checked})}/>
              Usa la stessa email del profilo
            </label>
          </div>

          <div>
            <label className="label">Indirizzo di corrispondenza</label>
            <input className="input w-full" value={form.indirizzo} onChange={e=>setForm({...form, indirizzo:e.target.value})}/>
            <label className="text-sm mt-2 flex items-center gap-2">
              <input type="checkbox" checked={form.allega_contatti}
                onChange={e=>setForm({...form, allega_contatti:e.target.checked})}/>
              Allegare contatti alle comunicazioni?
            </label>
          </div>

          <div>
            <label className="label">Telefono</label>
            <input className="input w-full" value={form.telefono} onChange={e=>setForm({...form, telefono:e.target.value})}/>
          </div>
        </div>

        <button className="btn mt-5" onClick={save} disabled={busy}>
          {busy ? 'Salvataggio…' : 'Salva e avanti'}
        </button>
      </div>
    </div>
  );
}

export default function ProfiloPage() {
  return (
    <Suspense fallback={<div className="container-narrow py-8">Caricamento…</div>}>
      <ProfiloInner />
    </Suspense>
  );
}
