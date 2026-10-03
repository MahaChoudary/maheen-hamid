import 'server-only';
import { sourceSchema, type Source } from '@/features/ai/contracts';
import { semanticIndex } from './semantic';
import corpus from '@/generated/knowledge.json';
export const contentVersion=corpus.contentVersion;
export const sources:Source[]=corpus.sources.map(source=>sourceSchema.parse(source));
const stop=new Set('a an the and or but of to for in on at by with is are was were be been being do does did how what which why when where who can could would should have has had i me my you your her she maheen hamid about tell explain describe please looking seeking we our us as from this that it its not any know like some'.split(' '));
const aliases:Record<string,string[]>={ specialize:['skills','rag'], specializes:['skills','rag'], strongest:['skills','rag'], technologies:['skills','capability'], built:['projects','wukala'], background:['education','story'], llm:['ai','reasoning'], agent:['agents','agentic','langgraph'], agents:['agentic','langgraph'], rag:['retrieval','embeddings'], retriever:['retrieval'], fullstack:['full','stack','frontend','backend'], 'full-stack':['frontend','backend','apis','react'], apps:['applications','products','react','apis'], backend:['apis','fastapi','python','database'], frontend:['react','typescript'], databases:['postgresql','qdrant','redis'], remote:['opportunities','availability'], job:['opportunities','availability'], graduate:['education','university'], resume:['cv'], typescript:['react','frontend'], docker:['infrastructure'], skill:['skills','capability'], skills:['capability'], motivation:['story'], experience:['capability'] };
export function terms(text:string){return text.toLowerCase().normalize('NFKC').replace(/[^\p{L}\p{N}+#.-]/gu,' ').split(/\s+/).filter(x=>x.length>1&&!stop.has(x));}
const expand=(query:string)=>[...new Set(terms(query).flatMap(w=>[w,...(aliases[w]||[])]))];
let semantic:ReturnType<typeof semanticIndex>|undefined;
export function recruiterIntent(query:string):'identity'|'unknown'|'topic'{
 if(/(?:how many years?|years? of (?:professional |work )?experience|professional experience|worked (?:at|for)|\b(?:her|maheen(?:[’']s)?) (?:employers?|salary|visa|relocation|work authorization)\b|\b(?:salary|visa|relocation|work authorization)\b)/i.test(query))return 'unknown';
 if(/^(?:who (?:is|s) (?:maheen(?: hamid)?|she)|tell me about (?:maheen(?: hamid)?|her)|introduce (?:maheen(?: hamid)?|her)|what does (?:maheen(?: hamid)?|she) do|what is (?:her|maheen(?: hamid)?[’']s) background)[?.!]?$/i.test(query.trim()))return 'identity';
 return 'topic';
}
export function retrievalScores(query:string,matcher=false){
 const words=expand(query);if(!words.length)return [];
 const docs=sources.map(s=>({s,tokens:terms(`${s.title} ${s.tags} ${s.text}`)}));
 const avg=docs.reduce((n,d)=>n+d.tokens.length,0)/docs.length;
 let similarities:number[]=[];
 try{semantic??=semanticIndex(docs.map(d=>d.tokens));similarities=semantic(words)}catch{/* Fail safely to lexical; no substitute vectors. */}
 const ranked=docs.map(({s,tokens},i)=>{
  let lexical=0;for(const w of words){const frequency=tokens.filter(t=>t===w).length;if(!frequency)continue;
   const df=docs.filter(d=>d.tokens.includes(w)).length;lexical+=Math.log(1+(docs.length-df+.5)/(df+.5))*(frequency*2.2)/(frequency+1.2*(.25+.75*tokens.length/avg));
   if(terms(s.title).includes(w))lexical+=3;if(terms(s.tags).includes(w))lexical+=2;
  }
  return {source:s,lexical,semantic:similarities[i]||0,score:0};
 }).filter(x=>x.source.public&&(!matcher||x.source.type!=='instructional example'));
 const lexicalRank=[...ranked].filter(x=>x.lexical>0).sort((a,b)=>b.lexical-a.lexical);
 const semanticRank=[...ranked].filter(x=>x.semantic>=.18).sort((a,b)=>b.semantic-a.semantic);
 for(const x of ranked){const l=lexicalRank.indexOf(x),v=semanticRank.indexOf(x);x.score=(l>=0?1/(20+l):0)+(v>=0?.8/(20+v):0);
  if(/wukala|built|build with|rag experience/i.test(query)&&x.source.id==='cv-project-wukala')x.score+=.06;
  if(/skills|specializ|technologies/i.test(query)&&/^(capability|cv-ai)/.test(x.source.id))x.score+=.018;
 }
 // Use the same semantic candidates for selection as fusion; weak wording is
 // not a second, stricter veto after relevant corpus co-occurrence was found.
 return ranked.filter(x=>x.lexical>0||semanticRank.includes(x)).sort((a,b)=>b.score-a.score||a.source.id.localeCompare(b.source.id));
}
export function retrieve(query:string,matcher=false,context=''):Source[]{
 if(!matcher&&recruiterIntent(query)==='unknown')return [];
 if(!matcher&&recruiterIntent(query)==='identity')return ['profile-identity','profile-education','cv-summary','profile-story','profile-availability'].map(id=>sources.find(s=>s.id===id)!);
 return retrievalScores(context?`${query} ${context}`:query,matcher).slice(0,5).map(x=>x.source);
}
export function evidenceFor(selected:Source[]){return selected.map(source=>({source,quote:source.text}));}
