import OpenAI from 'openai';
import pdfParse from 'pdf-parse';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';  // 👈 AGGIUNGI QUESTA RIGA

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req){
try{
const form = await req.formData();
const userPrompt = form.get('prompt') || '';
const type = form.get('type') || 'giornale';
const profile = JSON.parse(form.get('profile')||'{}');
const files = form.getAll('files');

// Estrai testo dai file (PDF o TXT)
let attachmentsText = '';
for (const f of files){
const buf = Buffer.from(await f.arrayBuffer());
if((f.type||'').includes('pdf') || f.name.endsWith('.pdf')){
try{ const data = await pdfParse(buf); attachmentsText += `\n\n[FILE: ${f.name}]\n${data.text}`; }catch{ /* ignora */ }
}else{
// assume UTF-8 txt
attachmentsText += `\n\n[FILE: ${f.name}]\n${buf.toString('utf8')}`;
}
}

const toneExtra = profile?.tono_altro ? `; aggiungi sfumature: ${profile.tono_altro}`:'';

const system = `Sei l'ufficio stampa digitale "VoxPublica". Scrivi SEMPRE in italiano corretto, chiaro e professionale. Rispetta il canale richiesto. Non inventare fatti: usa solo le informazioni fornite dall'utente e dai file. Evita emoji per giornali/dichiarazioni; consenti emoji per social. Formatta con paragrafi brevi e titoletti quando utile.`;

const styleGuide = `Profilo: ${profile?.full_name||''} — ${profile?.ruolo||''} ${profile?.ente||''}. Tono preferito: ${profile?.tono||'Istituzionale'}${toneExtra}. Campioni stile: ${profile?.samples||''}`;

const channelRules = {
giornale: `OBBLIGATORIO: inserisci una sezione "Dichiarazione" con citazione diretta attribuita a ${profile?.full_name||'[Nome Cognome]'}, ${profile?.ruolo||''} ${profile?.ente||''}. Niente emoji. Titolo sintetico + occhiello opzionale + corpo con 3-5 paragrafi. Chiudi con contatti/nota ente se opportuno.`,
instagram: `Post Instagram: tono coinvolgente e positivo, 2-3 paragrafi brevi + call to action. Usa emoji con moderazione e 5-8 hashtag mirati in fondo.`,
facebook: `Post Facebook: informativo ma accessibile, 2-4 paragrafi, emoji moderati, nessuna dichiarazione formale obbligatoria.`,
whatsapp: `Messaggio WhatsApp: testo breve, elenco puntato di 3-6 righe, diretto e senza hashtag. Evita frasi troppo lunghe.`
};

const finalPrompt = `Contenuto richiesto: ${userPrompt}\n\nMateriali di riferimento dai file (se presenti): ${attachmentsText || '—'}\n\nCanale: ${type}. Regole canale: ${channelRules[type]}.\n\nAdatta stile/tone al profilo e ai campioni. Restituisci SOLO il testo pronto da copiare.`;

const resp = await openai.chat.completions.create({
model: 'gpt-4o-mini',
messages: [
{ role: 'system', content: system },
{ role: 'user', content: styleGuide },
{ role: 'user', content: finalPrompt }
],
temperature: 0.7,
max_tokens: 900
});

const text = resp.choices?.[0]?.message?.content || 'Nessun testo generato.';
return Response.json({ text });
}catch(e){
return new Response('Errore: '+e.message, { status: 500 });
}
}
