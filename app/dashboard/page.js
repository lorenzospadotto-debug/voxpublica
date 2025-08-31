'use client';
import { useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default function DashboardIndex(){
useEffect(()=>{
(async()=>{
const { data: { user } } = await supabase.auth.getUser();
if(!user){ window.location.href='/'; return; }
const { data } = await supabase.from('profiles').select('id').eq('id', user.id).maybeSingle();
if(!data){ window.location.href='/dashboard/profilo?first=1'; }
else { window.location.href='/dashboard/ufficio-stampa'; }
})();
},[]);
return null;
}
