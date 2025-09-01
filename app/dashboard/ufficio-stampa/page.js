'use client';
import { useEffect, useState } from 'react';
import Dropzone from 'react-dropzone';

export default function UfficioStampa(){
  const [user,setUser]=useState(null);
  const [profile,setProfile]=useState(null);
  const [prompt,setPrompt]=useState('Scrivimi un testo su …');
  const [type,setType]=useState('giornale');
  const [files,setFiles]=useState([]);
  const [busy,setBusy]=useState(false);
  const [output,setOutput]=useState('');

  useEffect(()=>{(async()=>{
    const { getSupabase } = await import('@/lib/supabaseClient');
    const supabase = getSupabase();
    const { data:{ user } } = await supabase.auth.getUser();
    if(!user){ window.location.href='/'; return; }
    setUser(user);
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
    setProfile(data);
  })();},[]);

  const addFiles = (incoming=[])=>{
    const limited = incoming.slice(0,5);
    setFiles(prev=>[...prev, ...limited.map(f=>Object.assign(f,{preview:URL.createObjectURL(f)}))]);
  };

  const onDrop = (accepted) => addFiles(accepted);

  const onPick = (e) => addFiles(Array.from(e.target.files || []));

  const generate = async()=>{
    setBusy(true); setOutput('');
    try{
      const fd = new FormData();
      fd.append('prompt', prompt);
      fd.append('type', type);
      fd.append('profile', JSON.stringify(profile||{}));
      files.forEach(f=> fd.append('files', f));
      const res = await fetch('/api/generate', { method:'POST', body: fd });
      if(!res.ok) throw new Error('Errore generazione');
      const data = await res.json();
      setOutput(data.text);
    }catch(e){ alert(e.message); }
    finally{ setBusy(false); }
  };

  const saveDraft = async()=>{
    const { getSupabase } = await import('@/lib/supabaseClient');
    const supabase = getSupabase();
    const title = prompt.slice(0,80);
    const { error } = await supabase.from('drafts').insert({ user_id:user.id, type, title, content: output });
    if(error) alert(error.message); else alert('Salvato nelle bozze');
  };

  return (
    <div className="container-narrow py-8 space-y-6">
      <div className="card p-6">
        <h2 className="text-2xl font-black mb-4">Ufficio stampa</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="label">Cosa vuoi scrivere?</label>
            <textarea className="input w-full h-36" value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder="Scrivimi un testo su…"/>
          </div>
          <div>
            <label className="label">Formato</label>
            <select className="input w-full" value={type} onChange={e=>setType(e.target.value)}>
              <option value="giornale">Giornale (con dichiarazione)</option>
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
              <option value="whatsapp">WhatsApp</option>
            </select>

            <div className="mt-4">
              <label className="label">Carica file</label>
              {/* Pulsante Upload (mobile-friendly) */}
              <input type="file" multiple accept=".pdf,.txt" onChange={onPick} className="input w-full" />
              {/* Drag & Drop */}
              <Dropzone onDrop={onDrop} multiple>
                {({getRootProps, getInputProps, isDragActive}) => (
                  <div {...getRootProps()} className={`border-2 border-dashed rounded-xl p-6 text-center mt-2 ${isDragActive? 'bg-orange-50':'bg-white'}`}>
                    <input {...getInputProps()} />
                    Trascina file o clicca per selezionare (PDF/TXT). Verranno usati come base informativa.
                  </div>
                )}
              </Dropzone>
              <ul className="mt-3 text-sm space-y-1">
                {files.map((f,i)=> <li key={i}>• {f.name}</li>)}
              </ul>
            </div>

            <button className="btn w-full mt-4" onClick={generate} disabled={busy}>{busy?'Elaboro…':'Genera testo'}</button>
          </div>
        </div>
      </div>

      {output && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-bold">Testo generato</h3>
            <div className="flex gap-2">
              <button className="btn" onClick={()=>navigator.clipboard.writeText(output)}>Copia</button>
              <button className="btn" onClick={saveDraft}>Salva in bozze</button>
            </div>
          </div>
          <pre className="whitespace-pre-wrap leading-relaxed">{output}</pre>
        </div>
      )}
    </div>
  );
}
