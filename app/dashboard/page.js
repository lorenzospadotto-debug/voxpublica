'use client';
import { useEffect, useState } from 'react';

export default function Home() {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    // se l'utente è già loggato → vai in dashboard
    (async () => {
      const { getSupabase } = await import('@/lib/supabaseClient');
      const supabase = getSupabase();
      const { data } = await supabase.auth.getUser();
      if (data?.user) window.location.href = '/dashboard';
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
        alert('Controlla la mail per confermare. Poi torna qui per accedere.');
        setMode('login');
        setBusy(false);
        return;
      }

      // LOGIN
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      // Promozione admin (se email combacia con la env var)
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
      const uid = data.user.id;
      const { data: prof } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', uid)
        .maybeSingle();

      if (adminEmail && data.user.email === adminEmail) {
        if (!prof || prof.role !== 'admin') {
          await supabase.from('profiles').upsert({ id: uid, role: 'admin' }).eq('id', uid);
        }
      } else {
        if (!prof || !prof.role) {
          await supabase.from('profiles').upsert({ id: uid, role: 'user' }).eq('id', uid);
        }
      }

      window.location.href = '/dashboard';
    } catch (err) {
      alert(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="container-narrow py-10">
      {/* HERO */}
      <section className="text-center py-10">
        <h1 className="text-4xl md:text-5xl font-black leading-tight">
          VoxPublica: <span className="block md:inline">aiuta la comunicazione</span>{' '}
          <span className="block md:inline">tra politico e cittadino</span>
        </h1>
        <p className="mt-4 text-lg opacity-80">
          Uno strumento semplice, moderno e <b>sociale</b> per creare comunicati, dichiarazioni e post chiari ed efficaci.
        </p>
      </section>

      {/* CARD AUTH */}
      <section className="card p-6 max-w-xl mx-auto">
        <div className="flex gap-2 mb-4">
          <button
            className={`btn ${mode === 'login' ? '' : 'opacity-60'}`}
            onClick={() => setMode('login')}
            type="button"
          >
            Accedi
          </button>
          <button
            className={`btn ${mode === 'signup' ? '' : 'opacity-60'}`}
            onClick={() => setMode('signup')}
            type="button"
          >
            Iscriviti
          </button>
        </div>

        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="label">Email</label>
            <input
              type="email"
              className="input w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nome@ente.it"
              required
            />
          </div>
          <div>
            <label className="label">Password</label>
            <input
              type="password"
              className="input w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button className="btn w-full" disabled={busy}>
            {busy ? 'Attendere…' : mode === 'signup' ? 'Crea account' : 'Accedi'}
          </button>
        </form>

        <p className="text-sm opacity-70 mt-3">
          Con la prima iscrizione verrai guidato al setup del profilo (ruolo, ente, <b>nome ente</b>, contatti, tono).
        </p>
      </section>

      {/* SEZIONE INFO BREVE */}
      <section className="grid md:grid-cols-3 gap-4 mt-10">
        <div className="card p-5">
          <h3 className="font-bold">Ufficio stampa</h3>
          <p className="text-sm mt-1 opacity-80">Da un’idea o un file, ottieni un comunicato completo (con la tua dichiarazione).</p>
        </div>
        <div className="card p-5">
          <h3 className="font-bold">Social ready</h3>
          <p className="text-sm mt-1 opacity-80">Genera versioni per i Giornali, Instagram, Facebook e WhatsApp in un clic.</p>
        </div>
        <div className="card p-5">
          <h3 className="font-bold">Tono & dati profilo</h3>
          <p className="text-sm mt-1 opacity-80">Testi coerenti con ruolo, ente e stile comunicativo, che puoi personalizzare come vuoi.</p>
        </div>
      </section>
    </main>
  );
}
