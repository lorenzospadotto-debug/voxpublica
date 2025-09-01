const submit = async (e) => {
  e.preventDefault();
  setBusy(true);
  try {
    const { getSupabase } = await import('@/lib/supabaseClient');
    const supabase = getSupabase();

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      alert('Controlla la mail per confermare. Poi accedi.');
      setMode('login');
      setBusy(false);
      return;
    }

    // LOGIN
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    // Promozione admin se email combacia
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    const uid = data.user.id;

    // recupera profilo
    const { data: prof } = await supabase.from('profiles').select('role').eq('id', uid).maybeSingle();

    if (adminEmail && data.user.email === adminEmail) {
      // se non è già admin, promuovi
      if (!prof || prof.role !== 'admin') {
        await supabase.from('profiles').upsert({ id: uid, role: 'admin' }).eq('id', uid);
      }
    } else {
      // utente normale: assicurati che abbia almeno 'user'
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
