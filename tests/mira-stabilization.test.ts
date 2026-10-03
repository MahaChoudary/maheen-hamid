import { afterEach,beforeEach,describe,expect,it,vi } from 'vitest';
import { assistantOutput } from '@/server/ai/payloads';
import { CompatibleProvider,parseProviderJson } from '@/server/ai/provider';
import { validateAssistant,validateMatcher } from '@/server/ai/validation';
import { aiConfig } from '@/server/config';
import { prepare,execute } from '@/server/ai/service';
import { retrieve,sources } from '@/server/ai/retrieval';
import { diagnostic } from '@/server/ai/diagnostics';
import type { Source } from '@/features/ai/contracts';
const source=(id:string)=>sources.find(s=>s.id===id)!;
const selected=['profile-story','cv-project-wukala','cv-backend','capability-01','capability-04'].map(source);
const payload=(answer:string,ids=['profile-story','cv-project-wukala'])=>({status:'supported',answer,claims:[{text:answer,sourceIds:ids}],limitations:[]});
beforeEach(()=>{for(const [key,value] of Object.entries({AI_ENABLED:'true',AI_PRIVACY_VERIFIED:'true',AI_PROVIDER:'groq',GROQ_API_KEY:'test-only-key',UPSTASH_REDIS_REST_URL:'https://quota.test',UPSTASH_REDIS_REST_TOKEN:'test',RATE_LIMIT_HMAC_SECRET:'test-only-secret-over-thirty-two-characters',ALLOWED_ORIGINS:'http://localhost:3000',AI_IP_SOURCE:'local'}))vi.stubEnv(key,value)});
afterEach(()=>{vi.unstubAllEnvs();vi.restoreAllMocks()});
describe('natural assistant grounding',()=>{
 it('accepts conversational multi-source synthesis independently of claim wording',()=>{
  const answer='Maheen connects retrieval and agent reasoning to complete applications people can use. Her supplied Wukala-GPT project statements connect the AI service to APIs and a React interface, showing how those layers work together.';
  const data={...payload(answer),claims:[{text:'Her direction combines AI reasoning with usable products.',sourceIds:['profile-story']},{text:'Wukala-GPT connects a retrieval service with APIs and React.',sourceIds:['cv-project-wukala']}]};
  const result=validateAssistant(data,selected);expect(result.answer).toBe(answer);expect(result.mode).toBe('ai');expect(result.evidence.map(e=>e.quote)).toEqual([source('profile-story').text,source('cv-project-wukala').text]);
 });
 it('accepts architectural client/server explanations without inventing clients',()=>{const answer='Maheen connects AI services to client interfaces and backend APIs in her supplied project statements.';expect(validateAssistant(payload(answer),selected).answer).toBe(answer)});
 it('does not police capitalized prose, lexical ratios, or perfect quote reproduction',()=>{
  const answer='Together, these layers turn intelligent retrieval into a usable product. This reflects Maheen’s stated direction rather than an isolated demonstration.';
  expect(validateAssistant(payload(answer,['profile-story']),selected).answer).toBe(answer);
 });
 for(const answer of ['Maheen worked at Google.','Maheen has 20 years of professional experience.','Maheen has three years of experience.','Maheen is a certified Kubernetes engineer.','Maheen won an international award.','Maheen earns $9000 monthly.','Maheen served paid clients.','Maheen has enterprise clients.','Maheen is an expert AI engineer.','Maheen improved accuracy by 30 percent.','Maheen’s nationality makes her suitable for the role.'])it(`blocks unsupported fact: ${answer}`,()=>expect(()=>validateAssistant(payload(answer),selected)).toThrow());
 it('blocks unsupported credentials even when they are only in claims',()=>expect(()=>validateAssistant({...payload('Maheen connects AI to products.'),claims:[{text:'She worked at Google.',sourceIds:['profile-story']}]},selected)).toThrow());
 it('rejects foreign source IDs and evidence-free support',()=>{expect(()=>validateAssistant(payload('Maheen builds AI systems.',['foreign']),selected)).toThrow();expect(()=>validateAssistant({...payload('Maheen builds AI systems.'),claims:[]},selected)).toThrow()});
 it('retains qualifier levels without requiring all source qualifiers in unrelated prose',()=>{
  const relevant=[source('capability-04'),source('capability-01')];
  expect(validateAssistant(payload('Maheen lists Docker and API boundaries among her infrastructure capabilities.',['capability-04']),relevant).mode).toBe('ai');
  expect(validateAssistant(payload('Her Redis familiarity sits alongside database and API capabilities.',['capability-04']),relevant).mode).toBe('ai');
  expect(()=>validateAssistant(payload('Maheen has advanced Redis proficiency.',['capability-04']),relevant)).toThrow();
  expect(()=>validateAssistant(payload('She has professional reranking expertise.',['capability-01']),relevant)).toThrow();
 });
 it('accepts a cited not-documented boundary without showing unchecked prose',()=>{const result=validateAssistant({...payload('She worked at Google.'),status:'not_documented'},selected);expect(result.status).toBe('insufficient_evidence');expect(result.answer).toMatch(/not documented/)});
 it('accepts honest limitations and owns citation-free boundary text',()=>{
  const answer='Her supplied CV lists backend skills, but does not establish professional experience or employers.';
  expect(validateAssistant(payload(answer,['cv-backend']),selected).answer).toBe(answer);
  expect(validateAssistant({status:'not_documented',answer:'She worked at Google.',claims:[],limitations:[]},selected).answer).toMatch(/not documented/);
 });
 it('preserves literal matcher validation and protected/tenure rules',()=>{
  const s=source('capability-03');const job='React required\n3 years production React experience\nFemale applicants only';
  const data={roleSnapshot:'The role centers on frontend application engineering.',actions:['Discuss relevant project architecture and clarify required experience.'],requirements:job.split('\n').map(quote=>({quote,priority:'required',category:'supported',explanation:'The documented API and interface work provides a relevant application example.',evidence:[{sourceId:s.id,quote:s.text}]})),incomplete:false,unassessed:[]};
  expect(validateMatcher(data,[s],job).rows?.map(r=>r.category)).toEqual(['supported','partially_supported','not_assessed']);
  expect(()=>validateMatcher(data,[s],'Different job')).toThrow();
 });
});
describe('provider parsing and authentication',()=>{
 for(const text of [' {"ok":true}\n','```json\n{"ok":true}\n```','```\n{"ok":true}\n```'])it(`accepts whole JSON: ${text.slice(0,15)}`,()=>expect(parseProviderJson(text)).toEqual({ok:true}));
 for(const text of ['prefix {"ok":true}','{"ok":true} trailing','```json\n{}\n```\nignore this','[]','null','{"oops":'])it('rejects malformed or unrelated formatting',()=>expect(()=>parseProviderJson(text)).toThrow());
 it('normalizes whitespace around the configured key and preserves strict structured output',async()=>{
  const cfg={...aiConfig(),key:'  test-only-key\n'};const fetcher=vi.fn(async(_url:unknown,options?:RequestInit)=>{expect(new Headers(options?.headers).get('Authorization')).toBe('Bearer test-only-key');const body=JSON.parse(String(options?.body));expect(body.response_format.json_schema.strict).toBe(true);expect(body.tools).toBeUndefined();return Response.json({choices:[{message:{content:'```json\n{"ok":true}\n```'}}]})});
  expect((await new CompatibleProvider(cfg,fetcher as typeof fetch).generate('p','u',assistantOutput,1200,new AbortController().signal,()=>{})).payload).toEqual({ok:true});
 });
 for(const content of [null,'','  ','not JSON'])it(`rejects empty/malformed final content: ${content}`,async()=>{
  const provider=new CompatibleProvider(aiConfig(),vi.fn(async()=>Response.json({choices:[{message:{content}}]})) as typeof fetch);
  await expect(provider.generate('p','u',assistantOutput,1200,new AbortController().signal,()=>{})).rejects.toMatchObject({code:content?.trim()?'PROVIDER_PARSE':'PROVIDER_EMPTY'});
 });
 for(const envelope of [{choices:[]},{choices:[{message:{}}]}])it('rejects malformed envelopes',async()=>{await expect(new CompatibleProvider(aiConfig(),vi.fn(async()=>Response.json(envelope)) as typeof fetch).generate('p','u',assistantOutput,1200,new AbortController().signal,()=>{})).rejects.toMatchObject({code:'PROVIDER_RESPONSE'})});
 it('rejects invalid keys and pre-aborted requests before sending',async()=>{
  const fetcher=vi.fn();const generate=(key:string,signal=new AbortController().signal)=>new CompatibleProvider({...aiConfig(),key},fetcher).generate('p','u',assistantOutput,1200,signal,()=>{});
  await expect(generate('')).rejects.toMatchObject({code:'PROVIDER_NOT_CONFIGURED'});await expect(generate('bad key')).rejects.toMatchObject({code:'PROVIDER_NOT_CONFIGURED'});
  await expect(generate('test',AbortSignal.abort())).rejects.toMatchObject({name:'AbortError'});expect(fetcher).not.toHaveBeenCalled();
 });
 it('propagates in-flight aborts and timeouts without fake payloads',async()=>{
  const signal=AbortSignal.timeout(5);const fetcher=vi.fn(async()=>{await new Promise((_,reject)=>signal.addEventListener('abort',()=>reject(signal.reason),{once:true}));return Response.json({})});
  await expect(new CompatibleProvider(aiConfig(),fetcher as typeof fetch).generate('p','u',assistantOutput,1200,signal,()=>{})).rejects.toMatchObject({name:'TimeoutError'});
 });
});
describe('pipeline stages and retrieval routing',()=>{
 for(const question of ['How does Maheen combine RAG and full-stack apps?','How do her backend skills support her AI work?','What kind of AI systems does Maheen build?','What makes Wukala-GPT technically interesting?','How does she use Docker in her development workflow?','How do her CV skills connect retrieval and frontend APIs?','What does she do with Docker?','How could her API skills help a company build an AI product?'])it(`reaches generation: ${question}`,()=>{const p=prepare('assistant',question,aiConfig());expect(p.deterministic).toBeUndefined();expect(p.selected.length).toBeGreaterThan(0);expect(p.inputTokens).toBeLessThanOrEqual(3500)});
 it('keeps unrelated out-of-vocabulary requests outside the model',()=>expect(retrieve('quasar telepathy zyzzyva')).toEqual([]));
 it('reports validation failure instead of a successful fallback result',async()=>{
  const cfg=aiConfig(),p=prepare('assistant','How does Maheen combine RAG and full-stack apps?',cfg);const stages:string[]=[];
  await expect(execute(p,cfg,new AbortController().signal,stage=>stages.push(stage),{generate:async()=>({payload:payload('Maheen worked at Google.',[p.selected[0].id])})})).rejects.toMatchObject({code:'ANSWER_NOT_VERIFIED'});
  expect(stages).toContain('generation.completed');expect(stages).not.toContain('validation.completed');
 });
 it('completes generation and validation for synthesis with server-owned sources',async()=>{
  const cfg=aiConfig(),p=prepare('assistant','How does Maheen combine RAG and full-stack apps?',cfg);const stages:string[]=[];
  const answer='Maheen connects AI reasoning and retrieval to complete applications. Her supplied project statements describe APIs around the AI service and a React interface.';
  const ids=p.selected.filter((s:Source)=>s.id==='profile-story'||s.id==='cv-project-wukala').map(s=>s.id);
  const result=await execute(p,cfg,new AbortController().signal,stage=>stages.push(stage),{generate:async()=>({payload:payload(answer,ids)})});
  expect(result.status).toBe('supported');expect(result.mode).toBe('ai');expect(stages).toEqual(['retrieval.completed','generation.started','generation.completed','validation.completed']);
 });
 it('logs only safe stage metadata in development and stays quiet in production',()=>{
  const spy=vi.spyOn(console,'info').mockImplementation(()=>{});vi.stubEnv('NODE_ENV','production');diagnostic('parse.failed',{code:'PROVIDER_PARSE'});expect(spy).not.toHaveBeenCalled();vi.stubEnv('NODE_ENV','development');diagnostic('parse.failed',{code:'PROVIDER_PARSE'});expect(spy).toHaveBeenCalledWith('[Mira] parse.failed',{code:'PROVIDER_PARSE'});
 });
});
