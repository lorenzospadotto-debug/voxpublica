'use client';
import { useEffect } from 'react';
import { getSupabase } from '@/lib/supabaseClient';

export default function DashboardIndex(){
  const supabase = typeof window !== 'undefined' ? getSupabase() : null;
  useEffect(()=>{
    if (!supabase) return;
    (async()=>{
      const { data: { user } } = await supabase.auth.getUser();
      if(!user){ window.location.href='/'; return; }
      const { data } = await supabase.from('profiles').select('id').eq('id', user.id).maybeSingle();
      if(!data){ window.location.href='/dashboard/profilo?first=1'; }
      else { window.location.href='/dashboard/ufficio-stampa'; }
    })();
  },[supabase]);
  return null;
}
