'use client';
import { useEffect, useState } from 'react';

export default function OnboardingAuth() {
  // tab corrente
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  // form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  // se già loggato → porta a dashboard
  useEffect(() => {
    (async () => {
      const { getSupabase } = await import('@/lib/supabaseClient');
      const supabase = getSupabase();
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        // se già dentro, facciamo anche il check profilo
        await postLoginRedirect(supabase, data.user.id);
      }
    })();
  }, []);

  const postLoginRedirect = async (supabase, uid) => {
    try {
      const { data: prof } = await supabase
        .from('profiles')
        .select('full_name, ruolo, ente, ente_nome, tono')
        .eq('id', uid)
        .maybeSingle();

      const missing =
        !prof ||
        !prof.full_name ||
        !prof.ruolo ||
        !prof.ente ||
        !prof.ente_nome ||
        !prof.tono;

      window.location.href = missing ? '/dashboard/profilo' : '/dashboard';
    } catch {
      window.location.href = '/dashboard'; // fallback
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const { getSupabase } = await import('@/lib/supabaseClient');
      const supabase = getSupabase();

      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('Controlla la mail per confermare la registrazione, poi torna qui per accedere.');
        setMode('login');
        setBusy(false);
        return;
      }

      // LOGIN
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      // niente logica admin qui
      await postLoginRedirect(supabase, data.user.id);
    } catch (err) {
      setError(err.message || 'Errore');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="container-narrow py-10">
      <div className="card max-w-xl mx-auto p-6">
        <h1 className="text-3xl font-black text-center">VoxPublica</h1>
        <p className="text-center opacity-80 mt-1">
          Aiuta la comunicazione tra politico e cittadino
        </p>

        <div className="mt-6 grid grid-cols-2 gap-2">
          <button
            type="button"
            className={`btn ${mode === 'login' ? '' : 'btn-outline opacity-80'}`}
            onClick={() => setMode('login')}
          >
            Accedi
          </button>
          <button
            type="button"
            className={`btn ${mode === 'signup' ? '' : 'btn-outline opacity-80'}`}
            onClick={() => setMode('signup')}
          >
            Iscriviti
          </button>
        </div>

        <form onSubmit={onSubmit} className="mt-4 space-y-3">
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

          {error && <div className="text-sm text-red-700 bg-red-50 p-2 rounded">{error}</div>}

          <button className="btn w-full" disabled={busy}>
            {busy ? 'Attendere…' : mode === 'signup' ? 'Crea account' : 'Accedi'}
          </button>
        </form>

        <div className="mt-6 p-3 rounded bg-[#FFF8F4] text-sm">
          <div className="font-bold mb-1">Cosa succede dopo</div>
          <ul className="list-disc ml-5 space-y-1">
            <li>Alla prima iscrizione ricevi una mail di conferma.</li>
            <li>Al primo accesso compili il tuo profilo (nome, ruolo, ente, <b>nome ente</b>, tono).</li>
            <li>Potrai generare comunicati e post coerenti con il tuo profilo.</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
