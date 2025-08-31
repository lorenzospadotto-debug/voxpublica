'use client';
}catch(e){ alert(e.message); }
finally{ setBusy(false); }
};

const saveDraft = async()=>{
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
<label className="label">Carica file (trascina qui)</label>
<Dropzone onDrop={onDrop} multiple>
{({getRootProps, getInputProps, isDragActive}) => (
<div {...getRootProps()} className={`border-2 border-dashed rounded-xl p-6 text-center ${isDragActive? 'bg-orange-50':'bg-white'}`}>
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
