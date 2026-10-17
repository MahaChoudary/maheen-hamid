import type { ConversationTurn } from '@/features/ai/contracts';
import { publishedProjects } from '@/content/projects';
export type AssistantIntent='conversation'|'technical'|'portfolio'|'mixed';
const person=/\b(?:maheen|her|she|hers|portfolio|projects?|resume|cv)\b/i;
const technical=/\b(?:rag|agent[si]?|embeddings?|vectors?|docker|kubernetes|jwt|redis|postgres(?:ql)?|fastapi|python|typescript|api[si]?|backend|frontend|full[ -]?stack|cloud|ci\/?cd|http|llm[si]?|databases?|load balanc\w*|authentication|network\w*|deployment|code|coding|programming)\b/i;
const normalizeProjectName=(value:string)=>value.toLowerCase().normalize('NFKC').replace(/[^\p{L}\p{N}]+/gu,' ').trim();
const mentionsPublishedProject=(text:string)=>{
 const normalized=` ${normalizeProjectName(text)} `;
 return publishedProjects.some(project=>[project.title,project.slug].some(name=>normalized.includes(` ${normalizeProjectName(name)} `)));
};
export function assistantIntent(text:string,history:ConversationTurn[]=[]):AssistantIntent {
 if(/^(?:hi|hello|hey|thanks|thank you|good morning|good evening)(?:[ ,.!]*(?:Mira|Maheen))?[.! ]*$/i.test(text.trim()))return 'conversation';
 if(/^(?:how are you|how(?:'s| is) your day|nice to meet you)\b/i.test(text.trim()))return 'conversation';
 if(/^(?:thanks?|thank you|appreciate|got it|sounds good|that(?:'s| is) helpful|awesome|great)\b/i.test(text.trim())&&!/\?|\b(?:who|what|where|when|why|how|can you|tell me|show me|does|is she|is maheen)\b/i.test(text))return 'conversation';
 const portfolio=person.test(text)||mentionsPublishedProject(text)||/\b(?:your creator|who built you|who made you)\b/i.test(text);
 if(portfolio)return technical.test(text)&&/\b(?:also|in general|generally|then explain|and explain|what is)\b/i.test(text)?'mixed':'portfolio';
 const followUp=/^(?:and\b|what about\b|why\b|how so\b|tell me more\b|go on\b|continue\b|explain (?:that|it)\b|how (?:do|does) (?:these|those|that|this)\b)/i.test(text.trim());
 if(followUp){const previous=history.filter(t=>t.role==='user').at(-1)?.content||'';if(person.test(previous)||mentionsPublishedProject(previous))return 'portfolio';if(technical.test(previous))return 'technical';}
 if(technical.test(text))return 'technical';
 return 'conversation';
}
