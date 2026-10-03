// Synthetic upstream contract tests only. The production app never imports this fixture.
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { createServer as tcpServer } from 'node:net';
import { mkdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { createClient } from 'redis';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const freePort=()=>new Promise(resolve=>{const server=tcpServer().listen(0,'127.0.0.1',()=>{const port=server.address().port;server.close(()=>resolve(port))})});
const redisPort=await freePort(),proxyPort=await freePort(),appPort=await freePort();const origin=`http://127.0.0.1:${appPort}`;
let daemon,server,browser,debugPage;const apiDiagnostics=[],fallbackErrors=[];let mode='valid';let providerCalls=0;let quotaFails=false;let lastProviderBody;
const redis=createClient({url:`redis://127.0.0.1:${redisPort}`,socket:{reconnectStrategy:false}});redis.on('error',()=>{});
const proxy=createServer(async(req,res)=>{
 try{let raw='';for await(const chunk of req)raw+=chunk;
  if(req.url==='/redis'){
   if(quotaFails){res.writeHead(503).end();return}
   const result=await redis.sendCommand(JSON.parse(raw).map(String));res.writeHead(200,{'Content-Type':'application/json'}).end(JSON.stringify({result}));return;
  }
  if(req.url!=='/v1/chat/completions'){res.writeHead(404).end();return}
  providerCalls++;lastProviderBody=JSON.parse(raw);
  if(mode==='quota'){res.writeHead(429,{'Retry-After':'2'}).end();return}
  if(mode==='failure'){res.writeHead(500).end();return}
  assert.equal(req.headers.authorization,'Bearer synthetic-test-key-not-real');
  if(mode==='malformed'){res.writeHead(200,{'Content-Type':'application/json'}).end(JSON.stringify({choices:[{message:{content:'not JSON'}}]}));return}
  if(mode==='empty'){res.writeHead(200,{'Content-Type':'application/json'}).end(JSON.stringify({choices:[{message:{content:null}}]}));return}
  if(mode==='slow'||mode==='timeout')await sleep(mode==='timeout'?27000:1800);
  const data=JSON.parse(lastProviderBody.messages[1].content);const source=data.evidence?.find(e=>e.id==='capability-03')||data.evidence?.[0];
  const evidence=source?[{sourceId:source.id,quote:source.text}]:[];
  const project=data.evidence?.find(e=>e.id==='cv-project-wukala')||data.evidence?.find(e=>e.id==='project-wukala-gpt');
  const answer=project?'Maheen connects RAG and document analysis to backend APIs and a React interface through Wukala-GPT.':source?'Maheen lists React, TypeScript, Python and backend APIs among her capability areas.':'Hello! I can help with portfolio questions or explain a technical idea.';
  const grounded=project||source;
  let payload=data.task==='assistant'?{status:'supported',answer,claims:grounded?[{text:answer,sourceIds:[grounded.id]}]:[],limitations:[]}:data.task==='match'?{roleSnapshot:'The role centers on React and TypeScript application engineering.',actions:['Prepare a concrete project architecture walkthrough.','Clarify the requested production experience.'],requirements:[{quote:data.request.split('\n')[0],priority:'required',category:'supported',explanation:'The documented API and interface work provides a relevant application example.',evidence},{quote:data.request.split('\n')[1]||data.request,priority:'required',category:'not_evidenced',explanation:'The portfolio has project work but does not document the requested duration in a production role.',evidence:[]},{quote:data.request.split('\n')[2]||data.request,priority:'required',category:'not_assessed',explanation:'This requirement is excluded from the technical comparison.',evidence:[]}],incomplete:false,unassessed:[]}:{title:data.topic,overview:'An API gateway routes requests to services and centralizes shared request handling.',steps:[{title:'Receive',detail:'A client sends a request to the gateway.'},{title:'Route',detail:'The gateway selects an upstream service.'}],example:'A client requests an order through one API entry point.',pitfalls:['A gateway does not replace service-level authorization.'],takeaway:'Keep routing and business logic boundaries clear.',mermaid:mode==='diagram-bad'?'flowchart TD\n A["Unclosed':mode==='diagram-unsafe'?'flowchart TD\n A --> B\n click A "https://evil.test"':'flowchart TD\n A["Client"] --> B["API gateway"]\n B --> C["Service"]',diagramDescription:'The client sends a request to the API gateway, which forwards it to a service.'};
  if(mode==='invalid')payload={status:'supported',answer:'Twenty years at NASA',claims:[{text:'Twenty years at NASA',sourceIds:['fake-credential']}],limitations:[]};
  const body={choices:[{message:{content:mode==='fenced'?'```json\n'+JSON.stringify(payload)+'\n```':JSON.stringify(payload),reasoning:'DO NOT DISPLAY PRIVATE REASONING'},finish_reason:'stop'}],usage:{prompt_tokens:50,completion_tokens:50,total_tokens:100}};
  res.writeHead(200,{'Content-Type':'application/json'}).end(JSON.stringify(body));
 }catch{res.writeHead(500).end()}
});
let output='',pipelineOutput='';
try{
 daemon=spawn(process.env.REDIS_SERVER_PATH||'redis-server',['--port',String(redisPort),'--bind','127.0.0.1','--save','','--appendonly','no'],{stdio:'ignore'});let error;daemon.on('error',e=>error=e);
 for(let i=0;i<40;i++){if(error)throw Error('Redis 7+ is required; install redis-server or set REDIS_SERVER_PATH.');try{await redis.connect();break}catch{await sleep(100)}}assert.ok(redis.isReady,'Redis ready');
 await new Promise(resolve=>proxy.listen(proxyPort,'127.0.0.1',resolve));
 const env={...process.env,AI_ENABLED:'true',AI_PRIVACY_VERIFIED:'true',AI_PROVIDER:'openai-compatible',AI_PROVIDER_NAME:'Synthetic contract test provider',AI_API_KEY:'synthetic-test-key-not-real',AI_BASE_URL:`http://127.0.0.1:${proxyPort}/v1`,AI_MODEL:'contract-fixture',AI_TOKENIZER:'o200k_base',AI_TOKENIZER_VERIFIED:'true',RATE_LIMIT_HMAC_SECRET:'synthetic-hmac-for-tests-at-least-32-characters',UPSTASH_REDIS_REST_URL:`http://127.0.0.1:${proxyPort}/redis`,UPSTASH_REDIS_REST_TOKEN:'synthetic-quota-token',ALLOWED_ORIGINS:origin,SITE_URL:origin,AI_IP_SOURCE:'local',AI_ENFORCE_PRODUCTION_LIMITS:'true'};
 server=spawn(process.execPath,['node_modules/next/dist/bin/next','dev','-p',String(appPort),'-H','127.0.0.1'],{env,stdio:'pipe'});server.stdout.on('data',d=>output+=d);server.stderr.on('data',d=>output+=d);
 console.log('Starting isolated Next/browser contract verification');let ready=false;for(let i=0;i<60;i++){try{if((await fetch(origin+'/',{signal:AbortSignal.timeout(2000)})).ok){ready=true;break}}catch{}await sleep(300)}assert.ok(ready,output.slice(-3000));
 const launch={headless:true,args:['--no-sandbox']};if(process.env.CHROMIUM_MODULE_PATH){const binary=(await import(process.env.CHROMIUM_MODULE_PATH)).default;launch.executablePath=await binary.executablePath();launch.args.push(...(binary.args||[]));launch.args.push('--disable-dev-shm-usage','--use-gl=angle','--use-angle=swiftshader')}
 browser=await chromium.launch(launch);const context=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'});const page=await context.newPage();debugPage=page;page.setDefaultTimeout(15000);page.on('response',async response=>{if(!response.url().includes('/api/'))return;try{const body=await response.text();for(const line of body.split('\n')){if(!line.trim())continue;const message=JSON.parse(line);if(message.type==='error'&&message.error.fallback)fallbackErrors.push(message.error.code);apiDiagnostics.push(message.type==='event'?message.event.stage:message.type==='error'?message.error.code:message.type==='result'?message.result.mode:message.code)}}catch{}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const audit=async(label)=>{const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();assert.deepEqual(result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[],label)};
 async function assistant(question='How do Maheen’s full-stack skills connect to RAG?'){
  await page.goto(origin+'/lab/assistant');await page.waitForFunction(()=>document.querySelector('.chat-composer textarea')||[...document.querySelectorAll('button')].some(b=>b.textContent==='Continue'));const accept=page.getByRole('button',{name:'Continue',exact:true});if(await accept.count())await accept.click();await page.getByRole('textbox',{name:'Message Mira'}).fill(question);await page.getByRole('button',{name:'Send message',exact:true}).click();
 }
 await assistant();await page.locator('.chat-message.assistant').getByText(/Maheen connects RAG/).waitFor();assert.equal(providerCalls,1);assert.equal(lastProviderBody.model,'contract-fixture');assert.equal(await page.getByText('Why this answer?',{exact:true}).count(),0);assert.equal(await page.locator('.compact-sources').count(),0);assert.equal(await page.getByText('DO NOT DISPLAY PRIVATE REASONING').count(),0);await audit('Mira success');await mkdir('preview',{recursive:true});await page.screenshot({path:'preview/assistant-api-contract.png',fullPage:true});
 await redis.flushDb();await page.getByRole('textbox',{name:'Message Mira'}).fill('How does she connect the backend?');await page.getByRole('button',{name:'Send message'}).click();await page.waitForFunction(()=>document.querySelectorAll('.chat-message.assistant').length===2);assert.equal(providerCalls,2);const followUp=JSON.parse(lastProviderBody.messages[1].content);assert.equal(followUp.sessionHistory.length,2);assert.ok(followUp.sessionHistory[0].content.includes('full-stack'));console.log('OK real Mira API, natural synthesis, actual events, clean chat and bounded follow-up context');
 await redis.flushDb();await page.goto(origin+'/lab/matcher');await page.getByRole('textbox',{name:'Role, job description or requirements'}).fill('React and TypeScript required\n3 years of production experience\nFemale applicants only');await page.getByRole('button',{name:'Analyze fit'}).click();await page.getByRole('heading',{name:'Strong Matches'}).waitFor();await page.getByRole('heading',{name:'Gaps'}).waitFor();await page.getByRole('heading',{name:'Improve Before Applying'}).waitFor();await audit('Matcher success');await page.screenshot({path:'preview/matcher-api-contract.png',fullPage:true});console.log('OK Matcher grouped result, literal requirements and protected-trait exclusion');
 for(const jd of ['Python and FastAPI required\nDocker deployment experience\nFemale applicants only','Build RAG applications\nSenior AWS production operations\nFemale applicants only']){await page.getByRole('textbox',{name:'Role, job description or requirements'}).fill(jd);await page.getByRole('button',{name:'Analyze fit'}).click();await page.getByRole('heading',{name:'Strong Matches'}).waitFor();await page.getByRole('heading',{name:'Best Evidence'}).waitFor();}
 console.log('OK three distinct JDs via actual Matcher UI/API');
 await redis.flushDb();await page.goto(origin+'/lab/terminal');const terminal=page.getByRole('textbox',{name:'Enter a predefined portfolio command'});await terminal.fill('ask "How do RAG and React connect in her approach?"');await page.getByRole('button',{name:'Run command'}).click();await page.locator('.terminal-ai-output .ai-result').waitFor();await audit('CLI ask result');await terminal.fill('clear');await page.getByRole('button',{name:'Run command'}).click();assert.equal(await page.locator('.terminal-ai-output').count(),0);console.log('OK CLI ask shares Mira consent/API/quotas');
 // Casual/general/mixed routing through the actual provider transport.
 for(const question of ['hello','hey','how are you?','thanks','what can you do?','Thanks for explaining her work','How are you, Maheen?','Explain JWT','Explain RAG in general and how Maheen uses it']){
  await redis.flushDb();mode='valid';const before=providerCalls;await assistant(question);await page.locator('.chat-message.assistant:not(.chat-error) > p').waitFor();assert.equal(providerCalls,before+1);
  const request=JSON.parse(lastProviderBody.messages[1].content);if(!question.includes('Maheen'))assert.equal(request.evidence.length,0);assert.equal(await page.locator('.actual-trace,.compact-sources').count(),0);
 }
 console.log('OK casual chat, technical and mixed intents; no portfolio gate for greetings');
 await redis.flushDb();await page.goto(origin+'/lab/explainer');await page.getByRole('textbox',{name:'What would you like to understand?'}).fill('API gateways');await page.getByRole('button',{name:'Explain',exact:true}).click();await page.getByRole('heading',{name:'API gateways',exact:true}).waitFor();await page.locator('.runtime-diagram svg').waitFor();assert.ok(await page.locator('.runtime-diagram > div > svg').evaluate(svg=>{const b=svg.getBBox(),v=svg.viewBox.baseVal;return b.x>=v.x&&b.y>=v.y&&b.x+b.width<=v.x+v.width&&b.y+b.height<=v.y+v.height}),'The complete rendered flow fits its viewBox');assert.equal(JSON.parse(lastProviderBody.messages[1].content).evidence,undefined);await page.locator('.runtime-diagram summary').click();await audit('Dynamic Mermaid explanation');await page.screenshot({path:'preview/runtime-explainer.png',fullPage:true});
 await page.getByRole('button',{name:/Switch to (light|dark) theme/}).click();await page.locator('.runtime-diagram svg').waitFor();
 for(const failure of ['diagram-bad','diagram-unsafe']){await redis.flushDb();mode=failure;await page.getByRole('button',{name:'Explain',exact:true}).click();await page.getByRole('heading',{name:'API gateways',exact:true}).waitFor();await page.locator('.runtime-diagram svg').waitFor();assert.equal(await page.getByRole('heading',{name:'Explanation unavailable'}).count(),0);}
 mode='valid';console.log('OK runtime Mermaid SVG/theme/text alternative and malformed/unsafe diagram handling');
 for(const topic of ['Kubernetes service discovery','Database transaction isolation','WebSocket backpressure','OAuth PKCE']){mode='valid';await page.getByRole('textbox',{name:'What would you like to understand?'}).fill(topic);await page.getByRole('button',{name:'Explain',exact:true}).click();await page.getByRole('heading',{name:topic,exact:true}).waitFor();await page.locator('.runtime-diagram svg').waitFor();}
 console.log('OK four additional arbitrary topics in one session without tiny shared limit');
 // Six acceptance questions through the real UI/API; synthesis uses a synthetic
 // provider only. This test deliberately does not certify external Groq inference.
 for(const [question,expected] of [
  ['Who is Maheen?','supported'],
  ['How does Maheen combine RAG and full-stack apps?','supported'],
  ['How do her backend skills support her AI work?','supported'],
  ['What is Wukala-GPT?','supported'],
  ['Is she available for remote work?','supported'],
  ['How many years did Maheen work at Google?','insufficient_evidence'],
 ]){
  await redis.flushDb();const callsBefore=providerCalls;mode='fenced';
  await assistant(question);
  const reply=page.locator('.chat-message.assistant');
  await reply.locator('> p').filter({hasText:/Maheen|not documented/}).waitFor();
  let resultMode='source_lookup';
  if(/combine|backend|Wukala/.test(question)){assert.equal(providerCalls,callsBefore+1);resultMode='ai';assert.equal(await page.locator('.chat-error').count(),0);}
  else assert.equal(providerCalls,callsBefore);
  assert.equal(await reply.locator('.actual-trace').count(),0);assert.equal(await reply.locator('.compact-sources').count(),0);
  if(expected==='insufficient_evidence'){await reply.locator('> p').filter({hasText:/not documented/}).waitFor();assert.equal(await reply.locator('> p').filter({hasText:/worked at Google/}).count(),0);}
  console.log('OK acceptance question:',question,'→',expected,resultMode);
 }
 mode='valid';
 await redis.flushDb();mode='invalid';await assistant();await page.locator('.chat-message.chat-error > p').filter({hasText:/interrupted/}).waitFor();assert.equal(await page.getByText('Twenty years at NASA',{exact:true}).count(),0);console.log('OK unsupported generated output withheld');
 await redis.flushDb();mode='valid';await page.getByRole('button',{name:'Retry question',exact:false}).click();await page.locator('.chat-message.assistant').last().locator('> p').filter({hasText:/Maheen/}).waitFor();assert.equal(await page.locator('.chat-message.assistant').last().getAttribute('role'),null);console.log('OK deliberate retry returns a normal answer');
 for(const failure of ['failure','quota','malformed','empty']){await redis.flushDb();mode=failure;await assistant();await page.locator('.chat-message.chat-error').waitFor();console.log('OK model',failure,'safe chat failure');}
 await redis.flushDb();mode='slow';await assistant();await page.getByRole('button',{name:'Stop',exact:true}).click();await page.getByText(/Reply stopped/).waitFor();await sleep(2100);assert.equal(await page.locator('.chat-message.assistant:not(.chat-error)').count(),0);console.log('OK stop rejects stale result');
 await redis.flushDb();mode='valid';quotaFails=true;const before=providerCalls;await assistant();await page.locator('.chat-message.chat-error').waitFor();assert.equal(providerCalls,before);quotaFails=false;console.log('OK quota outage fails closed');
 await redis.flushDb();mode='timeout';await assistant();await page.locator('.chat-message.chat-error > p').filter({hasText:/interrupted/}).waitFor({timeout:35000});console.log('OK backend deadline and chat failure');mode='valid';
 // Derive the same public disclosure version for direct HTTP contract checks.
 const {createHash}=await import('node:crypto');const version=createHash('sha256').update('Synthetic contract test provider:v3:conversation-explanation-session-six-turns:ephemeral:true').digest('hex').slice(0,24);const base={requestId:crypto.randomUUID(),consent:true,disclosureVersion:version};
 const post=(path,body,headers={})=>fetch(origin+path,{method:'POST',headers:{Origin:origin,'Content-Type':'application/json',Accept:'application/json',...headers},body:JSON.stringify(body)});
 assert.equal((await post('/api/assistant',{...base,question:''})).status,400);assert.equal((await post('/api/assistant',{...base,question:'x'.repeat(40000)})).status,413);assert.equal((await post('/api/assistant',{...base,question:'RAG'},{'Content-Type':'text/plain'})).status,415);assert.equal((await post('/api/assistant',{...base,question:'RAG'},{Origin:'https://attacker.test'})).status,403);assert.equal((await post('/api/match',{...base,jobDescription:'React required',acknowledgement:false})).status,400);assert.equal((await fetch(origin+'/api/assistant')).status,405);assert.equal((await fetch(origin+'/api/match',{method:'OPTIONS',headers:{Origin:origin}})).status,204);
 for(const failure of ['failure','quota','malformed','empty']){await redis.flushDb();mode=failure;const rejected=await post('/api/explain',{...base,topic:'Distributed tracing'},{Accept:'application/x-ndjson'});assert.equal(rejected.status,failure==='quota'?429:502);assert.ok((await rejected.json()).code);}mode='valid';
 await redis.flushDb();const fixed=await post('/api/assistant',{...base,question:'Where is Maheen based?'});assert.equal(fixed.status,200);assert.equal((await fixed.json()).messages.find(m=>m.type==='result').result.mode,'source_lookup');console.log('OK every endpoint/method, CORS, invalid input/body/type and deterministic source chain');
 // Verify production windows through the actual endpoints with one signed session.
 await redis.flushDb();mode='valid';let sessionCookie='';
 const sessionPost=async(path,data)=>{const response=await post(path,{...base,...data},sessionCookie?{Cookie:sessionCookie}:{});const cookie=response.headers.get('set-cookie');if(cookie)sessionCookie=cookie.split(';')[0];await response.text();return response};
 for(let i=0;i<30;i++)assert.equal((await sessionPost('/api/assistant',{question:'hello'})).status,200);
 assert.equal((await sessionPost('/api/assistant',{question:'hello'})).status,429);
 for(const [path,data] of [['/api/explain',{topic:'Transaction isolation'}],['/api/match',{jobDescription:'React and TypeScript required\n3 years of production experience\nFemale applicants only',acknowledgement:true}]]){for(let i=0;i<10;i++)assert.equal((await sessionPost(path,data)).status,200);const limited=await sessionPost(path,data);assert.equal(limited.status,429);assert.ok(Number(limited.headers.get('retry-after'))>0);}
 console.log('OK real HTTP signed-session budgets: Mira 30, Explainer 10, Matcher 10 independently; proper 429 + Retry-After');
 for(const width of [320,390]){await page.setViewportSize({width,height:844});for(const path of ['/lab/assistant','/lab/matcher','/lab/terminal']){await page.goto(origin+path);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)<=2);await audit(`mobile ${path}`)}}
 // Restart the actual app without a provider key; verify the real UI failure path, not a fixture response.
 await new Promise(resolve=>{server.once('exit',resolve);server.kill('SIGTERM')});pipelineOutput=output;output='';
 server=spawn(process.execPath,['node_modules/next/dist/bin/next','dev','-p',String(appPort),'-H','127.0.0.1'],{env:{...env,AI_API_KEY:'',GROQ_API_KEY:''},stdio:'pipe'});server.stdout.on('data',d=>output+=d);server.stderr.on('data',d=>output+=d);
 let restarted=false;for(let i=0;i<60;i++){try{if((await fetch(origin+'/',{signal:AbortSignal.timeout(2000)})).ok){restarted=true;break}}catch{}await sleep(300)}assert.ok(restarted,output.slice(-3000));
 const callsBeforeMissing=providerCalls;await assistant();await page.locator('.chat-message.chat-error').getByText(/AI is temporarily unavailable/).waitFor();await audit('Missing provider key without fallback');assert.equal(providerCalls,callsBeforeMissing);
 const missing=await post('/api/assistant',{...base,question:'Explain Maheen’s RAG and full-stack approach'});assert.equal(missing.status,503);const missingBody=await missing.json();assert.equal(missingBody.code,'PROVIDER_NOT_CONFIGURED');assert.equal(missingBody.fallback,undefined);
 console.log('OK missing provider key: actual UI/API 503, visible question and no upstream call');
 for(const stage of ['retrieval.completed','generation.started','provider.request','provider.response','generation.completed','validation.completed','parse.failed','validation.failed'])assert.ok(pipelineOutput.includes('[Mira] '+stage),stage);
 assert.equal((pipelineOutput+output).includes('synthetic-test-key-not-real'),false);assert.equal((pipelineOutput+output).includes('DO NOT DISPLAY PRIVATE REASONING'),false);
 assert.deepEqual(fallbackErrors,[],'API errors must not include fallback comparisons');assert.deepEqual(errors,[]);console.log('PASS: synthetic provider contract + real Redis Lua + actual Next API/browser chains. Real Groq inference is not certified by this script.');
}catch(error){await debugPage?.screenshot({path:'preview/ai-verification-failure.png',fullPage:true}).catch(()=>{});console.error('Recent API stages/codes:',apiDiagnostics.slice(-20));console.error('Safe server stages:',output.split('\n').filter(line=>line.includes('[Mira]')).slice(-15).join('\n'));throw error;}finally{await browser?.close();server?.kill();await redis.quit().catch(()=>{});daemon?.kill();await new Promise(resolve=>proxy.close(resolve));}
