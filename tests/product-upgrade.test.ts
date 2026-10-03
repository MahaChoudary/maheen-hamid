import { beforeEach,afterEach,describe,it,expect,vi } from 'vitest';
import { aiConfig } from '@/server/config';
import { prepare,execute } from '@/server/ai/service';
import { assistantIntent } from '@/server/ai/intent';
import { validateAssistant,validateMatcher,validateExplanation } from '@/server/ai/validation';
import { sources } from '@/server/ai/retrieval';
import { safeDiagram } from '@/features/explainer/diagram-safety';
import { explainRequestSchema } from '@/features/ai/contracts';
import { writingPosts,profile } from '@/content/site';
import { publishedProjects } from '@/content/projects';
const explanation={title:'JWT authentication',overview:'A signed token carries claims that the server verifies.',steps:[{title:'Receive token',detail:'Read the token from the request.'},{title:'Verify',detail:'Check the configured signature, audience and expiry.'}],example:'An API validates a token before checking access to a resource.',pitfalls:['Decoding is not verification.'],takeaway:'Verify the token, then authorize the action.',mermaid:'flowchart TD\n A["Receive token"] --> B["Verify"]\n B --> C["Authorize"]',diagramDescription:'The server receives the token, verifies it and then authorizes access.'};
beforeEach(()=>{for(const [key,value] of Object.entries({AI_ENABLED:'true',AI_PRIVACY_VERIFIED:'true',GROQ_API_KEY:'test-only-key',UPSTASH_REDIS_REST_URL:'https://quota.test',UPSTASH_REDIS_REST_TOKEN:'test',RATE_LIMIT_HMAC_SECRET:'test-only-hmac-more-than-thirty-two-characters',ALLOWED_ORIGINS:'http://localhost:3000',AI_IP_SOURCE:'local'}))vi.stubEnv(key,value)});
afterEach(()=>vi.unstubAllEnvs());
describe('intent-aware Mira',()=>{
 for(const question of ['hello','Hello, Mira!','Thanks Maheen','Thanks for explaining her work','How are you, Maheen?','That is helpful, thanks','hey','how are you?','thanks','what can you do?','Tell me a harmless joke','Explain JWT authentication','What is Kubernetes?'])it(`no portfolio retrieval gate: ${question}`,async()=>{
  const p=prepare('assistant',question,aiConfig());expect(p.deterministic).toBeUndefined();expect(p.selected).toEqual([]);const stages:string[]=[];const answer='Hello! I can help with portfolio questions or explain a technical idea.';
  const result=await execute(p,aiConfig(),new AbortController().signal,s=>stages.push(s),{generate:async()=>({payload:{answer,claims:[],status:'supported',limitations:[]}})});
  expect(result.mode).toBe('ai');expect(result.evidence).toEqual([]);expect(stages).toContain('retrieval.skipped');expect(stages).toContain('generation.started');expect(stages).toContain('validation.completed');
 });
 it('accepts generic technical numeric statements without credential validation',()=>{expect(validateAssistant({answer:'HTTP 401 indicates authentication is required. A JWT commonly has three parts.',claims:[],status:'supported',limitations:[]},[],'technical').mode).toBe('ai')});
 it('still blocks personal invented hard facts in conversation',()=>{expect(()=>validateAssistant({answer:'Maheen worked at Google for 10 years.',claims:[],status:'supported',limitations:[]},[],'conversation')).toThrow()});
 it('grounds factual follow-ups but keeps a new technical topic independent',()=>{const history=[{role:'user' as const,content:'How does Maheen use RAG?'}];expect(assistantIntent('Tell me more',history)).toBe('portfolio');expect(assistantIntent('What about Docker?',history)).toBe('portfolio');expect(assistantIntent('How do these layers connect?',history)).toBe('portfolio');expect(assistantIntent('Explain JWT',history)).toBe('technical');expect(assistantIntent('Explain RAG in general and how Maheen uses it')).toBe('mixed')});
 it('keeps unknown employer facts honest without model fabrication',()=>{const p=prepare('assistant','How many years did Maheen work at Google?',aiConfig());expect(p.deterministic?.status).toBe('insufficient_evidence');expect(p.deterministic?.summary).toMatch(/not documented/)});
 it('lets an empty retrieval reach the provider for a natural boundary',async()=>{
  const p=prepare('assistant','Maheen zzyxqvwx',aiConfig());expect(p.selected).toEqual([]);expect(p.deterministic).toBeUndefined();
  const result=await execute(p,aiConfig(),new AbortController().signal,()=>{},{generate:async()=>({payload:{answer:'That detail is not documented.',claims:[],status:'not_documented',limitations:[]}})});
  expect(result.mode).toBe('ai');expect(result.status).toBe('insufficient_evidence');
 });
 it('keeps the technical part of mixed unknown-employment questions available',()=>{
  const p=prepare('assistant','Did Maheen work at Google? Also explain RAG in general.',aiConfig());expect(p.intent).toBe('mixed');expect(p.deterministic).toBeUndefined();
 });
});
describe('runtime technical explanation',()=>{
 for(const topic of ['Kubernetes','JWT','API gateways','Load balancing'])it(`accepts arbitrary topic: ${topic}`,()=>{const p=prepare('explain',topic,aiConfig());expect(p.selected).toEqual([]);expect(p.deterministic).toBeUndefined();expect(p.user).not.toContain('Maheen');expect(p.user).not.toContain('evidence');expect(p.system).not.toContain('Maheen');expect(validateExplanation(explanation).explanation?.mermaid).toContain('flowchart')});
 for(const bad of ['flowchart TD\n A --> B\n click A "https://evil.test"','%%{init: {"securityLevel":"loose"}}%%\nflowchart TD\n A --> B','flowchart TD\n A["<img src=x>"] --> B','flowchart TD\n style A fill:red','---\nconfig: unsafe\n---\nflowchart TD\n A --> B'])it('rejects unsafe diagram configuration or active content',()=>{expect(safeDiagram(bad)).toBe(false);expect(validateExplanation({...explanation,mermaid:bad}).explanation?.mermaid).toContain('Receive token')});
 it('rejects malformed explanation schema and oversized input',()=>{expect(validateExplanation({...explanation,steps:[]}).explanation?.overview).toBe(explanation.overview);expect(explainRequestSchema.safeParse({requestId:crypto.randomUUID(),consent:true,disclosureVersion:'x',topic:'x'.repeat(501)}).success).toBe(false)});
});
describe('semantic comparison and content integrity',()=>{
 it('accepts semantic support without shared literal words',()=>{const source=sources.find(s=>s.id==='cv-backend')!;const job='Build asynchronous web services';const result=validateMatcher({roleSnapshot:'The role focuses on asynchronous web services.',actions:['Discuss a concrete backend API example.'],requirements:[{quote:job,priority:'required',category:'supported',explanation:'The documented API and interface work provides a relevant application example.',evidence:[{sourceId:source.id,quote:source.text}]}],incomplete:false,unassessed:[]},[source],job);expect(result.rows?.[0].category).toBe('supported')});
 it('does not let matcher overview/actions invent personal credentials',()=>{const source=sources.find(s=>s.id==='cv-backend')!;const job='Build asynchronous web services';const base={roleSnapshot:'The role requires 3 years of production experience.',actions:['Prepare a concrete API example.'],requirements:[{quote:job,priority:'required',category:'supported',explanation:'The documented API and interface work provides a relevant application example.',evidence:[{sourceId:source.id,quote:source.text}]}],incomplete:false,unassessed:[]};expect(()=>validateMatcher(base,[source],job)).not.toThrow();expect(()=>validateMatcher({...base,roleSnapshot:'Maheen worked at Google for 10 years.'},[source],job)).toThrow();expect(()=>validateMatcher({...base,actions:['She has professional experience at Google.']},[source],job)).toThrow()});
 it('rejects matcher malformed generation rather than succeeding with keyword fallback',async()=>{const p=prepare('match','React required',aiConfig());await expect(execute(p,aiConfig(),new AbortController().signal,()=>{},{generate:async()=>({payload:{garbage:true}})})).rejects.toMatchObject({code:'COMPARISON_NOT_VERIFIED'})});
 it('preserves useful requirement-specific explanations and blocks invented credentials in them',()=>{
  const source=sources.find(s=>s.id==='cv-backend')!;const job='Build asynchronous web services';
  const explanation='FastAPI and async Python provide a concrete starting point for implementing nonblocking API requests.';
  const payload={roleSnapshot:'Build asynchronous web services.',actions:['Prepare an API walkthrough.'],requirements:[{quote:job,priority:'required',category:'supported',explanation,evidence:[{sourceId:source.id,quote:source.text}]}],incomplete:false,unassessed:[]};
  expect(validateMatcher(payload,[source],job).rows?.[0].explanation).toBe(explanation);
  expect(()=>validateMatcher({...payload,requirements:[{...payload.requirements[0],explanation:'Maheen worked at Google for 10 years.'}]},[source],job)).toThrow();
 });
 it('preserves conservative provider token accounting',async()=>{const p=prepare('explain','JWT',aiConfig());await expect(execute(p,aiConfig(),new AbortController().signal,()=>{},{generate:async()=>({payload:explanation,usage:{promptTokens:p.inputTokens+1,completionTokens:10,totalTokens:p.inputTokens+11}})})).rejects.toMatchObject({code:'TOKEN_ACCOUNTING'})});
 it('publishes exactly six illustrated researched articles and a documented project',()=>{expect(writingPosts).toHaveLength(6);expect(writingPosts.every(p=>p.cover.endsWith('.webp'))).toBe(true);expect(writingPosts.every(p=>p.body.length>=3&&p.references.every(r=>r.href.startsWith('https://')))).toBe(true);expect(publishedProjects[0].slug).toBe('wukala-gpt');expect(profile.github).toBe('https://github.com/22101356-Maheen')});
});
