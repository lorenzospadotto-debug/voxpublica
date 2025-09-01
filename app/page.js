'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Landing() {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async()=>{
      const { getSupabase } = await import('@/lib/supabaseClient');
      const supabase = getSupabase();
      const { data } = await supabase.auth.getSession();
      if (data.session) window.location.href = '/dashboard';
    })();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const { getSupabase } = await import('@/lib/supabaseClient');
      const supabase = getSupabase();
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('Controlla la casella email per confermare. Poi accedi.');
        setMode('login');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        window.location.href = '/dashboard';
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main>
      <section className="container-narrow grid md:grid-cols-2 gap-8 py-10">
        <div className="card p-8">
          <div className="flex items-center gap-3 mb-6">
            <Image src="/logo.png" width={54} height={54} alt="logo"/>
            <h2 className="text-3xl font-black">VoxPublica</h2>
          </div>
          <p className="text-lg leading-relaxed mb-4">
            L’App che scrive <b>comunicati stampa, dichiarazioni e testi social</b> semplificando la comunicazione tra politico e cittadini…
          </p>
          <ul className="list-disc ml-6 space-y-2">
            <li>Ufficio stampa per <b>Giornali / Instagram / Facebook / WhatsApp</b></li>
            <li><b>Crea la tua dichiarazione</b> nei testi per la stampa</li>
            <li>Crea un testo da un file, da una delibera o altro</li>
            <li>Fatti dare qualche idea per commentare in modo <b>diverso la tua prossima foto</b></li>
            <li><b>News</b> da testate italiane e internazionali</li>
          </ul>
        </div>

        <div className="card p-8">
          <div className="flex gap-3 mb-6">
            <button className={`btn ${mode==='login'?'':'opacity-60'}`} onClick={()=>setMode('login')}>Login</button>
            <button className={`btn ${mode==='signup'?'':'opacity-60'}`} onClick={()=>setMode('signup')}>Iscriviti</button>
          </div>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <input className="input w-full" type="email" value={email} onChange={e=>setEmail(e.target.value)} required/>
            </div>
            <div>
              <label className="label">Password</label>
              <input className="input w-full" type="password" value={password} onChange={e=>setPassword(e.target.value)} required/>
            </div>
            <button disabled={busy} className="btn w-full">
              {busy? 'Attendo…' : (mode==='signup'?'Crea account':'Accedi')}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
