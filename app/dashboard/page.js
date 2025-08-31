'use client';
import { useEffect } from 'react';

export default function DashboardIndex(){
  useEffect(()=>{
    (async()=>{
      const { getSupabase } = await import('@/lib/supabaseClient');
      const supabase = getSupabase();
      const { data: { user } } = await supabase.auth.getUser();
      if(!user){ window.location.href='/'; return; }
      const { data } = await supabase.from('profiles').select('id').eq('id', user.id).maybeSingle();
      if(!data){ window.location.href='/dashboard/profilo?first=1'; }
      else { window.location.href='/dashboard/ufficio-stampa'; }
    })();
  },[]);
  return null;
}
