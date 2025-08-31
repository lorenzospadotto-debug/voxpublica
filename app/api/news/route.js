import Parser from 'rss-parser';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const parser = new Parser();

// Testate italiane + internazionali (puoi aggiungerne altre)
const FEEDS = [
  'https://www.ansa.it/sito/ansait_rss.xml',
  'https://www.repubblica.it/rss/homepage/rss2.0.xml',
  'https://feeds.bbci.co.uk/news/world/rss.xml',
  'https://rss.cnn.com/rss/edition_world.rss',
  'https://www.ilsole24ore.com/rss/italia.xml',
  'https://www.reuters.com/rss/world'
];

export async function GET() {
  try {
    // leggiamo più feed in parallelo ma ignoriamo quelli che falliscono
    const results = await Promise.allSettled(FEEDS.map((u) => parser.parseURL(u)));

    const items = results.flatMap((r) => {
      if (r.status !== 'fulfilled') return [];
      const srcTitle = r.value.title || 'news';
      // prendiamo poche notizie da ciascun feed per non affollare la barra
      return (r.value.items || []).slice(0, 5).map((it) => ({
        source: srcTitle,
        title: it.title,
        link: it.link
      }));
    });

    // limitiamo a 40 voci totali
    return Response.json(items.slice(0, 40));
  } catch {
    // in caso di errore, restituiamo lista vuota (la UI gestisce silenziosamente)
    return Response.json([]);
  }
}
