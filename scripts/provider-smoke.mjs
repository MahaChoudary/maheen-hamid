// Deliberate live-provider verification: requires real credentials and a running app.
import nextEnv from '@next/env';
import { createHash,randomUUID } from 'node:crypto';
nextEnv.loadEnvConfig(process.cwd());
const compatible=process.env.AI_PROVIDER==='openai-compatible';
const provider=compatible?(process.env.AI_PROVIDER_NAME?.trim()||'Configured AI provider'):'Groq';
const key=(compatible?process.env.AI_API_KEY:process.env.GROQ_API_KEY)?.trim();
if(!key||process.env.AI_ENABLED!=='true'||process.env.AI_PRIVACY_VERIFIED!=='true'){console.error('Live-provider verification NOT RUN: configure the server key, AI_ENABLED and verified privacy settings first. No mock substitution is made.');process.exit(1)}
if(!compatible){const response=await fetch('https://api.groq.com/openai/v1/models',{headers:{Authorization:`Bearer ${key}`},signal:AbortSignal.timeout(10000)});if(!response.ok)throw Error('Groq active-model verification failed; check account credentials and permissions.');const models=(await response.json()).data?.map(m=>m.id)||[];if(!models.includes('openai/gpt-oss-20b')&&!models.includes('openai/gpt-oss-120b'))throw Error('Neither supported structured-output model is available to this account.');console.log('Verified authenticated Groq active-model listing.');}
const origin=process.env.SITE_URL||'http://localhost:3000';const disclosureVersion=createHash('sha256').update(`${provider}:v3:conversation-explanation-session-six-turns:ephemeral:true`).digest('hex').slice(0,24);let cookie='';
const cases=[
 ['/api/assistant',{question:'hello'},'casual'],
 ['/api/assistant',{question:'thanks, that helps'},'casual'],
 ['/api/assistant',{question:'How do Maheen’s full-stack capabilities connect with RAG and agents?'},'grounded'],
 ...['API gateway routing','Database transaction isolation','OAuth PKCE','WebSocket backpressure'].map(topic=>['/api/explain',{topic},'explanation']),
 ...['Python and FastAPI required\nRAG applications preferred\nThree years production experience required','React and TypeScript required\nREST API integration preferred\nSenior AWS infrastructure experience required'].map(jobDescription=>['/api/match',{jobDescription,acknowledgement:true},'comparison'])
];
for(const [path,data,flow] of cases){
 const response=await fetch(origin+path,{method:'POST',headers:{Origin:origin,'Content-Type':'application/json',Accept:'application/json',...(cookie?{Cookie:cookie}:{})},body:JSON.stringify({requestId:randomUUID(),consent:true,disclosureVersion,...data}),signal:AbortSignal.timeout(30000)});
 if(response.headers.get('set-cookie'))cookie=response.headers.get('set-cookie').split(';')[0];
 const payload=await response.json();const result=payload.messages?.find(m=>m.type==='result')?.result;const stages=payload.messages?.filter(m=>m.type==='event').map(m=>m.event.stage)||[];
 const checked=flow==='casual'?result?.evidence?.length===0:flow==='grounded'?result?.evidence?.length>0:flow==='explanation'?!!result?.explanation?.overview&&!!result?.explanation?.mermaid:result?.rows?.length>0;
 if(!response.ok||!result||result.mode!=='ai'||!['supported','partial'].includes(result.status)||!checked||!['generation.started','generation.completed','validation.completed','completed'].every(stage=>stages.includes(stage))||stages.includes('failed')){console.error('Live-provider verification failed:',path,flow,payload.code||'No accepted AI result with completed generation/validation');process.exit(1)}
 console.log('Verified real provider:',path,flow,result.provider,result.model,'usage',result.usage?.totalTokens??'not reported');
}
