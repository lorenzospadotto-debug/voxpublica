'use client';
import { useEffect } from 'react';

export default function DashboardIndex(){
  useEffect(()=>{
    (async()=>{
      const { getSupabase } = await import('@/lib/supabaseClient');
      const supabase = getSupabase();
      const { data: { user } } = await supabase.auth.getUser();
      if(!user){ window.location.href='/'; return; }
      const { data } = await supabase.from('profiles').select('full_name').eq('id', user.id).maybeSingle();
      if(!data || !data.full_name){ window.location.href='/onboarding'; }
      else { window.location.href='/dashboard/ufficio-stampa'; }
    })();
  },[]);
  return null;
}
