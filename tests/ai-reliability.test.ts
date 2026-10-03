import { afterEach,beforeEach,expect,it,vi } from 'vitest';
import { aiConfig } from '@/server/config';
import { CompatibleProvider } from '@/server/ai/provider';
import { assistantOutput } from '@/server/ai/payloads';
import { validateExplanation,validateAssistant } from '@/server/ai/validation';
import { quotaIdentity } from '@/server/security/request';
import { handle } from '@/server/http/handler';
import { publicAiSettings } from '@/server/config';
const key='test-only-key';
beforeEach(()=>{for(const [name,value] of Object.entries({AI_ENABLED:'true',AI_PRIVACY_VERIFIED:'true',GROQ_API_KEY:key,AI_PROVIDER:'groq',RATE_LIMIT_HMAC_SECRET:'test-secret-at-least-thirty-two-characters',UPSTASH_REDIS_REST_URL:'https://quota.test',UPSTASH_REDIS_REST_TOKEN:'test',ALLOWED_ORIGINS:'http://localhost:3000',AI_IP_SOURCE:'local'}))vi.stubEnv(name,value)});
afterEach(()=>{vi.unstubAllEnvs();vi.restoreAllMocks()});
it('keeps useful text when optional fields or diagrams are absent or malformed',()=>{
 for(const mermaid of [undefined,null,'','```mermaid\nflowchart TD\n A["Unclosed','flowchart TD\n click A "https://bad.test"']){const result=validateExplanation({overview:'A database transaction groups changes into one unit of work.',mermaid,extra:'ignored'},'Transactions');expect(result.explanation?.title).toBe('Transactions');expect(result.explanation?.overview).toContain('database transaction');expect(result.explanation?.mermaid).toContain('flowchart TD');}
 expect(()=>validateExplanation({overview:''})).toThrow();expect(()=>validateExplanation({overview:42})).toThrow();
});
it('allows ordinary numbered architecture explanations without inventing personal metrics',()=>{const result=validateAssistant({answer:'Use 3 layers to separate the interface, API and retrieval service.',claims:[],status:'supported',limitations:[],extra:'ignored'},[],'technical');expect(result.answer).toContain('3 layers')});
it('pins unavailable Groq configuration to a documented structured-output model',()=>{vi.stubEnv('GROQ_MODEL','retired-model');expect(aiConfig().model).toBe('openai/gpt-oss-20b')});
it('uses one valid same-provider fallback for a rejected model and reports the model actually used',async()=>{
 const bodies:Record<string,unknown>[]=[];const fetcher=vi.fn(async(_url:unknown,options?:RequestInit)=>{const body=JSON.parse(String(options?.body));bodies.push(body);return bodies.length===1?Response.json({error:{code:'model_not_found'}},{status:404}):Response.json({choices:[{message:{content:'{"answer":"Hello"}'}}]})});
 const result=await new CompatibleProvider(aiConfig(),fetcher as typeof fetch).generate('Policy','Hello',assistantOutput,1200,new AbortController().signal,()=>{});expect(bodies.map(b=>b.model)).toEqual(['openai/gpt-oss-20b','openai/gpt-oss-120b']);expect(result.model).toBe('openai/gpt-oss-120b');
});
it('can recover a rejected strict format with JSON mode plus an explicit schema',async()=>{
 const bodies:Record<string,unknown>[]=[];const fetcher=vi.fn(async(_url:unknown,options?:RequestInit)=>{const body=JSON.parse(String(options?.body));bodies.push(body);return bodies.length===1?Response.json({error:{message:'json_schema unsupported'}},{status:400}):Response.json({choices:[{message:{content:'{"answer":"Hello"}'}}]})});
 await new CompatibleProvider(aiConfig(),fetcher as typeof fetch).generate('Policy','Hello',assistantOutput,1200,new AbortController().signal,()=>{});expect(bodies).toHaveLength(2);expect(bodies[1].response_format).toEqual({type:'json_object'});expect(JSON.stringify(bodies[1].messages)).toContain('Return a JSON object with this structure');
});
it('signs session cookies, accepts valid signatures and rejects tampering',()=>{
 const cfg=aiConfig();const request=new Request('http://localhost:3000');const first=quotaIdentity(request,cfg);expect(first.cookie).toContain('HttpOnly; SameSite=Strict');const cookie=first.cookie!.split(';')[0];const second=quotaIdentity(new Request(request.url,{headers:{cookie}}),cfg);expect(second.session).toBe(first.session);expect(second.cookie).toBeUndefined();const changed=quotaIdentity(new Request(request.url,{headers:{cookie:cookie.slice(0,-1)+'z'}}),cfg);expect(changed.session).not.toBe(first.session);expect(changed.hash).toBe(first.hash);
});
for(const [status,content,expected] of [[500,'',502],[429,'',429],[200,'not JSON',502]] as const)it(`returns real HTTP failure ${expected} for NDJSON requests (upstream ${status})`,async()=>{
 vi.spyOn(globalThis,'fetch').mockImplementation(async(url)=>String(url).includes('quota.test')?Response.json({result:[1,'RESERVED',0]}):status===200?Response.json({choices:[{message:{content}}]}):new Response(content,{status}));
 const response=await handle(new Request('http://localhost:3000/api/explain',{method:'POST',headers:{origin:'http://localhost:3000','Content-Type':'application/json',Accept:'application/x-ndjson'},body:JSON.stringify({requestId:crypto.randomUUID(),consent:true,disclosureVersion:publicAiSettings().disclosureVersion,topic:'Distributed tracing'})}),'explain');expect(response.status).toBe(expected);expect((await response.json()).code).toBeTruthy();
});
it('keeps harmless reserved words in diagram labels without accepting active Mermaid commands',async()=>{
 const {safeDiagram}=await import('@/features/explainer/diagram-safety');
 expect(safeDiagram('flowchart TD\n A["Click handler"] --> B["Config"]')).toBe(true);
 expect(safeDiagram('flowchart TD\n A["Click handler"] --> B\n click A callback')).toBe(false);
 expect(safeDiagram('flowchart TD\n A["<script>danger</script>"] --> B')).toBe(false);
});
