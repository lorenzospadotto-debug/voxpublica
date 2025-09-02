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

  // nuova: memorizzo l'email del profilo per auto-compilazione/readonly
  const [profileEmail, setProfileEmail] = useState('');

  useEffect(() => {
    (async () => {
      const { getSupabase } = await import('@/lib/supabaseClient');
      const supabase = getSupabase();
      const { data: auth } = await supabase.auth.getUser();
      if (!auth?.user) { window.location.href = '/onboarding'; return; }

      // salvo l'email del profilo
      setProfileEmail(auth.user.email || '');

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
          // se l'utente ha scelto di usare l'email del profilo, mostriamo quella
          email_istituzionale: prof.usa_email_profilo ? (auth.user.email || '') : (prof.email_istituzionale || ''),
          usa_email_profilo: prof.usa_email_profilo ?? true,
          indirizzo: prof.indirizzo || '',
          telefono: prof.telefono || '',
          allega_contatti: prof.allega_contatti ?? false,
        });
      } else {
        // primo accesso: se usa_email_profilo è true, pre-riempio il campo con l'email del profilo
        setForm(f => ({
          ...f,
          email_istituzionale: f.usa_email_profilo ? (auth.user.email || '') : ''
        }));
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
        // se selezionato, salvo l'email del profilo; altrimenti quella inserita
        email_istituzionale: (form.usa_email_profilo ? profileEmail : form.email_istituzionale)?.trim(),
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
            <input
              className="input w-full"
              type="email"
              // se usa_email_profilo è true, mostro l'email del profilo e rendo il campo in sola lettura
              value={form.usa_email_profilo ? (profileEmail || '') : (form.email_istituzionale || '')}
              readOnly={form.usa_email_profilo}
              onChange={e=>!form.usa_email_profilo && setForm({...form, email_istituzionale:e.target.value})}
            />
            <label className="text-sm mt-2 flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.usa_email_profilo}
                onChange={e=>{
                  const checked = e.target.checked;
                  setForm(f=>({
                    ...f,
                    usa_email_profilo: checked,
                    // quando attivo, sincronizzo subito il valore mostrato
                    email_istituzionale: checked ? (profileEmail || '') : (f.email_istituzionale || '')
                  }));
                }}
              />
              Usa la stessa email del profilo
            </label>
            {form.usa_email_profilo && (
              <p className="text-xs text-gray-500 mt-1">
                Verrà usata <strong>{profileEmail || '—'}</strong> dalle comunicazioni.
              </p>
            )}
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
