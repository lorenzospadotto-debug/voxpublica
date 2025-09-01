'use client';
import { useEffect, useState } from 'react';

const RUOLI = ['Sindaco', 'Vicesindaco', 'Assessore', 'Consigliere', 'Onorevole', 'Senatore', 'Presidente', 'Portavoce', 'Altro'];
const ENTI  = ['Comune', 'Città Metropolitana', 'Provincia', 'Regione', 'Ministero', 'Parlamento', 'Partito', 'Altro'];
const TONI  = [
  'Istituzionale e sobrio',
  'Deciso e propositivo',
  'Empatico e inclusivo',
  'Pragmatico e concreto',
  'Battagliero e riformista'
];

export default function Onboarding(){
  const [supabase, setSupabase] = useState(null);
  const [user, setUser] = useState(null);
  const [busy, setBusy] = useState(true);
  const [form, setForm] = useState({
    full_name: '',
    ruolo: RUOLI[0],
    ente: ENTI[0],
    institutional_email: '',
    use_profile_email: true,
    address: '',
    phone: '',
    attach_contacts: true,
    tono: TONI[0],
    tono_altro: '',
    samples: ''
  });

  useEffect(()=>{
    (async()=>{
      const { getSupabase } = await import('@/lib/supabaseClient');
      const s = getSupabase();
      setSupabase(s);
      const { data: { user } } = await s.auth.getUser();
      if(!user){ window.location.href = '/'; return; }
      setUser(user);

      // Se profilo già completato → vai in dashboard
      const { data } = await s.from('profiles').select('*').eq('id', user.id).maybeSingle();
      if (data && data.full_name) {
        window.location.href = '/dashboard/ufficio-stampa';
        return;
      }
      // Precompila email se vuoi usare quella del profilo
      setForm(prev => ({ ...prev, institutional_email: user.email || '', use_profile_email: true }));
      setBusy(false);
    })();
  },[]);

  const submit = async (e)=>{
    e.preventDefault();
    if(!supabase || !user) return;
    setBusy(true);
    try{
      const payload = {
        id: user.id,
        full_name: form.full_name.trim(),
        ruolo: form.ruolo,
        ente: form.ente,
        institutional_email: form.use_profile_email ? (user.email || '') : form.institutional_email.trim(),
        address: form.address.trim(),
        phone: form.phone.trim(),
        attach_contacts: !!form.attach_contacts,
        tono: form.tono,
        tono_altro: form.tono_altro.trim(),
        samples: form.samples
      };

      // Validazioni minime
      if (!payload.full_name) throw new Error('Inserisci Nome e Cognome.');
      if (!payload.institutional_email) throw new Error('Inserisci una email istituzionale (o usa quella del profilo).');

      const { error } = await supabase.from('profiles').upsert(payload).eq('id', user.id);
      if (error) throw error;

      window.location.href = '/dashboard/ufficio-stampa';
    }catch(err){
      alert(err.message);
      setBusy(false);
    }
  };

  if (busy) return <div className="container-narrow p-8">Carico…</div>;

  return (
    <div className="container-narrow py-8">
      <div className="card p-8">
        <h1 className="text-2xl font-black mb-4">Benvenuto in VoxPublica</h1>
        <p className="mb-6">Completa il tuo profilo per generare testi perfettamente coerenti con ruolo, ente e tono.</p>

        <form onSubmit={submit} className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="label">Nome e Cognome *</label>
            <input className="input w-full" value={form.full_name} onChange={e=>setForm({...form, full_name:e.target.value})} required/>
          </div>

          <div>
            <label className="label">Ruolo</label>
            <select className="input w-full" value={form.ruolo} onChange={e=>setForm({...form, ruolo:e.target.value})}>
              {RUOLI.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div>
            <label className="label">Ente</label>
            <select className="input w-full" value={form.ente} onChange={e=>setForm({...form, ente:e.target.value})}>
              {ENTI.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="label">Nome ente</label>
            <input className="input w-full" value={form.ente_nome} onChange={e=>setForm({...form, ente_nome:e.target.value})} placeholder="Es. Comune di Firenze" />
          </div>

          

          <div>
            <label className="label">Email istituzionale *</label>
            <div className="flex items-center gap-2 mb-2">
              <input id="use_profile_email" type="checkbox" checked={form.use_profile_email} onChange={e=>setForm({...form, use_profile_email: e.target.checked})}/>
              <label htmlFor="use_profile_email">Usa la stessa email del profilo</label>
            </div>
            <input
              className="input w-full"
              type="email"
              value={form.institutional_email}
              onChange={e=>setForm({...form, institutional_email:e.target.value})}
              disabled={form.use_profile_email}
              required
            />
          </div>

          <div>
            <label className="label">Indirizzo di corrispondenza</label>
            <input className="input w-full" value={form.address} onChange={e=>setForm({...form, address:e.target.value})}/>
          </div>

          <div>
            <label className="label">Numero di telefono</label>
            <input className="input w-full" value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})}/>
          </div>

          <div>
            <label className="label">Tono delle comunicazioni</label>
            <select className="input w-full" value={form.tono} onChange={e=>setForm({...form, tono:e.target.value})}>
              {TONI.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <input className="input w-full mt-2" placeholder="Altro (facoltativo)" value={form.tono_altro} onChange={e=>setForm({...form, tono_altro:e.target.value})}/>
          </div>

          <div className="md:col-span-2">
            <label className="label">Vecchi comunicati (facoltativo)</label>
            <textarea className="input w-full h-32" value={form.samples} onChange={e=>setForm({...form, samples:e.target.value})} placeholder="Incolla qui qualche tuo comunicato"/>
          </div>

          <div className="md:col-span-2">
            <label className="label">Contatti nelle comunicazioni</label>
            <div className="flex items-center gap-2">
              <input id="attach_contacts" type="checkbox" checked={form.attach_contacts} onChange={e=>setForm({...form, attach_contacts:e.target.checked})}/>
              <label htmlFor="attach_contacts">Vuoi allegare i contatti alle comunicazioni?</label>
            </div>
          </div>

          <div className="md:col-span-2">
            <button className="btn" type="submit">SALVA E INIZIA</button>
          </div>
        </form>
      </div>
    </div>
  );
}
