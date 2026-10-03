import 'server-only';
import { z } from 'zod';
import type { AiConfig } from '../config';
import { requireLive } from '../config';
import { ServiceError } from '../errors';
import type { AiResult,ConversationTurn,Kind,TraceEvent } from '@/features/ai/contracts';
import { sources,contentVersion,retrieve,recruiterIntent,evidenceFor } from './retrieval';
import { taskPolicy,assistantOutput,matcherOutput,explanationOutput } from './payloads';
import { inputEnvelope,tokenCount } from './tokenizer';
import { CompatibleProvider, type AiProvider } from './provider';
import { validateAssistant,validateMatcher,validateExplanation,AssistantValidationError } from './validation';
import { assistantIntent,type AssistantIntent } from './intent';
import { diagnostic } from './diagnostics';
import { QuotaStore } from '../security/quota';
export type Prepared={kind:Kind;intent:AssistantIntent;text:string;selected:typeof sources;deterministic?:AiResult;system:string;user:string;schema:typeof assistantOutput|typeof matcherOutput|typeof explanationOutput;inputTokens:number;completion:number};
export function prepare(kind:Kind,text:string,config:AiConfig,history:ConversationTurn[]=[]):Prepared{
 const context=history.length&&text.length<180?history.filter(t=>t.role==='user').slice(-2).map(t=>t.content).join(' '):'';
 const intent=kind==='assistant'?assistantIntent(text,history):'technical';
 const selected=kind==='explain'||(kind==='assistant'&&['conversation','technical'].includes(intent))?[]:retrieve(text,kind==='match',context);let deterministic:AiResult|undefined;
 if(kind==='assistant'&&(intent==='portfolio'||intent==='mixed')){
  let fixed:string|undefined;
  if(recruiterIntent(text)==='identity'){const bio='Maheen Hamid is an AI Engineer focused on full-stack AI systems, based in Sialkot, Pakistan. She is a Computer Science graduate from the University of Sialkot. Her direction is to connect AI reasoning, RAG and agents with complete products people can use, and she prefers remote and international opportunities.';deterministic={kind,status:'supported',mode:'source_lookup',answer:bio,summary:bio,evidence:evidenceFor(selected),limitations:[],scope:'Reviewed CV + public portfolio',contentVersion};}
  if(/(?:ignore\s+(?:previous|all|your)|system\s+prompt|api\s+key|reveal\s+(?:instructions|secrets)|act\s+as|change\s+(?:your|maheen))/i.test(text))deterministic={kind,status:'out_of_scope',mode:'source_lookup',summary:'This guide uses Maheen’s approved public portfolio only. It cannot change records or reveal private instructions.',evidence:[],limitations:[],scope:'Approved public portfolio',contentVersion};
  else if(/^(?:(?:can|may) i (?:view|download|see|read)|where (?:is|can i (?:find|download))|(?:view|download|show|open))(?:\s+(?:maheen(?:’s|'s)?|her|the|a|original))*\s+(?:cv|resume)\??$/i.test(text.trim()))fixed='profile-cv';
  else if(/^(?:how (?:can|do) i (?:contact|reach)(?: maheen| her)?|what(?:’s|'s| is) (?:her|maheen(?:’s|'s)?) (?:email|phone|linkedin|github)|(?:contact|email|phone|linkedin|github))\??$/i.test(text.trim()))fixed='profile-contact';
  else if(/^(?:where (?:is|does) (?:maheen|she) (?:based|live)|what(?:’s|'s| is) (?:her|maheen(?:’s|'s)?) location)\??$/i.test(text.trim()))fixed='profile-identity';
  else if(/^(?:what(?:’s|'s| is) (?:her|maheen(?:’s|'s)?) (?:degree|education)|where did (?:she|maheen) (?:study|graduate)|which university did (?:she|maheen) attend)\??$/i.test(text.trim()))fixed='profile-education';
  else if(/^(?:is (?:she|maheen) (?:available|open)(?: for| to)?(?: (?:remote|international|work|jobs?|internships?|freelance|opportunities))+|what(?:’s|'s| is) (?:her|maheen(?:’s|'s)?) availability)\??$/i.test(text.trim()))fixed='profile-availability';
  if(intent==='portfolio'&&recruiterIntent(text)==='unknown'){deterministic={kind,status:'insufficient_evidence',mode:'source_lookup',summary:'That is not documented in this portfolio. I can’t confirm Maheen’s employers, professional tenure or relocation status.',evidence:[],limitations:[],scope:'Approved public portfolio',contentVersion};fixed=undefined;}
  if(fixed){const source=sources.find(s=>s.id===fixed)!;deterministic={kind,status:'supported',mode:'source_lookup',summary:fixed==='profile-availability'?'Maheen is open to AI Engineer jobs, internships and selected freelance opportunities. Remote and international opportunities are preferred.':fixed==='profile-education'?'Maheen is a Computer Science graduate from the University of Sialkot, Department of Computer Science.':fixed==='profile-cv'?'Yes — Maheen’s original resume PDF is available to view and download on the Resume page.':fixed==='profile-contact'?'You can contact Maheen at maheen.hamid30@gmail.com or through LinkedIn. All her public contact links are on the Contact page.':'Maheen is based in Sialkot, Pakistan.',evidence:evidenceFor([source]),limitations:[],scope:'Approved public portfolio',contentVersion};}
 }
 if(kind==='assistant'&&/(?:system\s+prompt|api\s+key|reveal\s+(?:instructions|secrets))/i.test(text))deterministic={kind,status:'out_of_scope',mode:'source_lookup',summary:'I can’t reveal private instructions or secrets. I can help with portfolio and software questions.',evidence:[],limitations:[],scope:'Public conversation',contentVersion};
 const schema=kind==='assistant'?assistantOutput:kind==='match'?matcherOutput:explanationOutput;const system=taskPolicy(kind,intent);const user=JSON.stringify(kind==='explain'?{task:kind,topic:text}:{task:kind,request:text,sessionHistory:history,evidence:selected.map(s=>({id:s.id,type:s.type,text:s.text}))});
 let inputTokens=0;const completion=kind==='assistant'?1200:kind==='match'?3000:2600;
 if(!deterministic){requireLive(config);const evidenceTokens=selected.reduce((n,s)=>n+tokenCount(s.text,config),0);if(evidenceTokens>1500)throw new ServiceError(413,'TOKEN_LIMIT','Approved evidence exceeds the request envelope. Narrow the question.');inputTokens=inputEnvelope(system,user,z.toJSONSchema(schema),config);if(inputTokens>(kind==='assistant'?3500:4500))throw new ServiceError(413,'TOKEN_LIMIT','This input exceeds the model token envelope. Shorten it without removing essential requirements.');}
 return {kind,intent,text,selected:deterministic?deterministic.evidence.map(e=>e.source):selected,deterministic,system,user,schema,inputTokens,completion};
}
export async function execute(prepared:Prepared,config:AiConfig,signal:AbortSignal,emit:(stage:TraceEvent['stage'],detail:string,sourceIds?:string[])=>void,provider:AiProvider=new CompatibleProvider(config),quota?:QuotaStore):Promise<AiResult>{
 emit(prepared.kind==='explain'||['conversation','technical'].includes(prepared.intent)&&prepared.kind==='assistant'?'retrieval.skipped':'retrieval.completed',`${prepared.selected.length} public source sections selected.`,prepared.selected.map(s=>s.id));
 diagnostic('retrieval.completed',{kind:prepared.kind,sourceIds:prepared.selected.map(s=>s.id)});
 if(prepared.deterministic){emit('generation.skipped','Deterministic approved-source response; no model was called.');emit('validation.completed','Public source records and references checked; no model was used.');return {...prepared.deterministic,answer:prepared.deterministic.summary};}
 emit('generation.started','One bounded provider request started.');
 diagnostic('generation.started',{kind:prepared.kind});
 const response=await provider.generate(prepared.system,prepared.user,prepared.schema,prepared.completion,signal,()=>{});
 emit('generation.completed','Provider returned a final payload; private reasoning is not displayed.');
 diagnostic('generation.completed',{kind:prepared.kind});
 let result:AiResult;try{result=prepared.kind==='assistant'?validateAssistant(response.payload,prepared.selected,prepared.intent):prepared.kind==='match'?validateMatcher(response.payload,prepared.selected,prepared.text):validateExplanation(response.payload,prepared.text)}catch(error){
  diagnostic('validation.failed',{kind:prepared.kind,code:error instanceof AssistantValidationError?error.code:prepared.kind==='match'?'INVALID_MATCHER_OUTPUT':'EXPLANATION_INVALID',...(error instanceof z.ZodError?{issues:error.issues.slice(0,8).map(issue=>issue.path.join('.')+':'+issue.code)}:{})});
  throw new ServiceError(502,prepared.kind==='assistant'?'ANSWER_NOT_VERIFIED':prepared.kind==='match'?'COMPARISON_NOT_VERIFIED':'EXPLANATION_INVALID','This result could not be checked safely. Please retry.');
 }
 if(response.usage&&(response.usage.promptTokens>prepared.inputTokens||response.usage.completionTokens>prepared.completion)){await quota?.cooldown(86400);diagnostic('validation.failed',{kind:prepared.kind,code:'TOKEN_ACCOUNTING'});throw new ServiceError(502,'TOKEN_ACCOUNTING','Live AI is paused because provider usage exceeded the reviewed envelope.');}
 if(result.mode==='ai')diagnostic('validation.completed',{kind:prepared.kind});
 emit('validation.completed',result.mode==='ai'?(prepared.kind==='assistant'?'Answer schema, trusted source IDs and factual safety guards checked.':prepared.kind==='match'?'Schema, original requirement quotes and approved evidence spans checked.':'Explanation schema and diagram safety checked.'):'Result checked against approved public records.');
 return {...result,provider:config.provider,model:response.model||config.model,...(response.usage?{usage:response.usage}:{})};
}
