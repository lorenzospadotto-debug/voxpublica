export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Google News RSS (Italia, IT)
    const rssUrl = 'https://news.google.com/rss?hl=it&gl=IT&ceid=IT:it';
    const res = await fetch(rssUrl, { next: { revalidate: 300 } }); // 5 minuti
    const xml = await res.text();

    // parsing leggero dell'XML per title/link/source
    const items = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let m;
    while ((m = itemRegex.exec(xml)) && items.length < 25) {
      const block = m[1];

      const titleMatch = block.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/);
      const linkMatch  = block.match(/<link>(.*?)<\/link>/);
      const sourceMatch = block.match(/<source.*?>(.*?)<\/source>/);

      const rawTitle = titleMatch ? (titleMatch[1] || titleMatch[2] || '').trim() : '';
      const cleanTitle = rawTitle.replace(/ - .+?$/, ''); // rimuove " - Testata" se incluso nel title
      const url = linkMatch ? linkMatch[1].trim() : '';
      const source = sourceMatch ? sourceMatch[1].trim() : '';

      if (cleanTitle) items.push({ title: cleanTitle, url, source });
    }

    return new Response(JSON.stringify({ items }), {
      headers: { 'content-type': 'application/json; charset=utf-8' },
      status: 200,
    });
  } catch (e) {
    return new Response(JSON.stringify({ items: [] }), {
      headers: { 'content-type': 'application/json; charset=utf-8' },
      status: 200,
    });
  }
}
