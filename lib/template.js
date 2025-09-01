// lib/template.js
export function renderTemplate(body, profile) {
  // Mappa campi supportati
  const map = {
    ente: profile?.ente || '',
    ente_nome: profile?.ente_nome || '',
    ruolo: profile?.ruolo || '',
    tono: profile?.tono || '',
    nome: (profile?.full_name || '').split(' ')[0] || '',
    cognome: (profile?.full_name || '').split(' ').slice(1).join(' ') || '',
  };

  // Trova tutti i placeholder {{...}}
  const placeholders = new Set();
  const re = /{{\s*([a-zA-Z0-9_]+)\s*}}/g;
  let m;
  while ((m = re.exec(body)) !== null) placeholders.add(m[1]);

  // Controllo: tutti valorizzati?
  const missing = [...placeholders].filter((k) => !(map[k] && String(map[k]).trim().length));
  if (missing.length) {
    return { ok: false, error: `Mancano questi dati profilo: ${missing.join(', ')}.` };
  }

  // Sostituzione
  let out = body;
  for (const k of placeholders) {
    const val = String(map[k]);
    out = out.replace(new RegExp(`{{\\s*${k}\\s*}}`, 'g'), val);
  }
  return { ok: true, text: out };
}
