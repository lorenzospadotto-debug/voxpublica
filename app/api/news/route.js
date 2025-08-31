export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import Parser from 'rss-parser';

const parser = new Parser();
const FEEDS = [
'https://www.ansa.it/sito/ansait_rss.xml',
'https://www.repubblica.it/rss/homepage/rss2.0.xml',
'https://rss.cnn.com/rss/edition_world.rss',
'https://feeds.bbci.co.uk/news/world/rss.xml',
'https://www.ilsole24ore.com/rss/italia.xml',
'https://www.reuters.com/rss/world'
];

export async function GET(){
try{
const all = await Promise.allSettled(FEEDS.map(u=>parser.parseURL(u)));
const items = all.flatMap((r)=> r.status==='fulfilled' ? (r.value.items||[]).slice(0,5).map(it=>({
source: r.value.title||'news', title: it.title, link: it.link
})) : []);
return Response.json(items.slice(0,40));
}catch(e){ return Response.json([]); }
}
