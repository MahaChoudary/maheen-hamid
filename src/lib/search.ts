import type { SearchEntry } from '@/content/site';
import searchEntries from '@/generated/search-index.json';

const aliases: Record<string,string[]> = {
  cv: ['resume'], resume: ['cv'], contact: ['talk','email'], talk: ['contact'], work: ['projects'], ai: ['assistant','lab'], rag: ['retrieval'], job: ['matcher'], cli: ['terminal'], git: ['systems'], docker: ['systems'], linux: ['systems'],
};
const normalize = (s: string) => s.toLocaleLowerCase('en').normalize('NFKC').replace(/[^\p{L}\p{N}\s-]/gu,' ').replace(/\s+/g,' ').trim();
export function searchPortfolio(raw: string, limit = 10, entries: SearchEntry[] = searchEntries): SearchEntry[] {
  const input = normalize(raw.slice(0,120));
  if (!input) return entries.filter(e => ['PAGE'].includes(e.type)).slice(0,5);
  const words = input.split(' ');
  const expanded = [...new Set(words.flatMap(w => [w,...(aliases[w] ?? [])]))];
  return entries.map(entry => {
    const title = normalize(entry.title), tags = normalize(entry.tags), body = normalize(entry.body);
    let score = title === input ? 40 : title.includes(input) ? 20 : body.includes(input) ? 6 : 0;
    for (const word of expanded) {
      if (title.split(' ').some(t => t === word)) score += 5;
      else if (title.split(' ').some(t => t.startsWith(word))) score += 3;
      if (tags.split(' ').some(t => t === word)) score += 2;
      if (body.includes(word)) score += 1;
    }
    return { entry, score };
  }).filter(x => x.score > 0).sort((a,b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title)).slice(0,limit).map(x => x.entry);
}
export function excerptFor(entry: SearchEntry, query: string): string {
  const body = entry.body;
  const word = normalize(query).split(' ')[0];
  const at = normalize(body).indexOf(word);
  const start = at > 45 ? Math.max(0,at - 38) : 0;
  return `${start ? '…' : ''}${body.slice(start,start+145)}${body.length > start+145 ? '…' : ''}`;
}
