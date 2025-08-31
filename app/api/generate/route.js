import OpenAI from 'openai';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// importiamo pdf-parse solo a runtime (così Next non lo carica nel build)
let pdfParse = null;
async function getPdfParse() {
  if (!pdfParse) {
    pdfParse = (await import('pdf-parse')).default;
  }
  return pdfParse;
}

export async function POST(req) {
  try {
    const form = await req.formData();
    const userPrompt = form.get('prompt') || '';
    const type = form.get('type') || 'giornale';
    const profile = JSON.parse(form.get('profile') || '{}');
    const files = form.getAll('files');

    // Estrai testo dai file (PDF o TXT)
    let attachmentsText = '';
    for (const f of files) {
      const buf = Buffer.from(await f.arrayBuffer());
      if ((f.type || '').includes('pdf') || f.name.endsWith('.pdf')) {
        try {
          const parse = await getPdfParse();
          const data = await parse(buf);
          attachmentsText += `\n\n[FILE: ${f.name}]\n${data.text}`;
        } catch {
          /* ignora */
        }
      } else {
        // assume UTF-8 txt
        attachmentsText += `\n\n[FILE: ${f.name}]\n${buf.toString('utf8')}`;
      }
    }

    const toneExtra = profile?.tono_altro ? `; aggiungi sfumature: ${profile.tono_altro}` : '';

    const system = `Sei l'ufficio stampa digitale "VoxPublica". Scrivi SEMPRE in italiano corretto, chiaro e professionale. Rispetta il canale richiesto. No
