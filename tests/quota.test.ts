import { beforeAll,afterAll,beforeEach,it,expect,vi } from 'vitest';
import { spawn,type ChildProcess } from 'node:child_process';
import { createClient } from 'redis';
import { createServer } from 'node:net';
import { QuotaStore } from '@/server/security/quota';
import { aiConfig } from '@/server/config';
let daemon:ChildProcess;let client:ReturnType<typeof createClient>;let store:QuotaStore;
const identity={day:new Date().toISOString().slice(0,10),hash:'test-hmac-identity'};
beforeAll(async()=>{
 const port=await new Promise<number>(resolve=>{const listener=createServer().listen(0,'127.0.0.1',()=>{const address=listener.address();const port=typeof address==='object'&&address?address.port:0;listener.close(()=>resolve(port))})});
 daemon=spawn(process.env.REDIS_SERVER_PATH||'redis-server',['--port',String(port),'--bind','127.0.0.1','--save','','--appendonly','no'],{stdio:'ignore'});
 let failure:Error|undefined;daemon.on('error',error=>{failure=error});
 client=createClient({url:`redis://127.0.0.1:${port}`,socket:{reconnectStrategy:false}});client.on('error',()=>{});
 let connected=false;for(let attempt=0;attempt<40;attempt++){if(failure)throw Error('Redis 7+ is required for real Lua tests. Set REDIS_SERVER_PATH or install redis-server.');try{await client.connect();connected=true;break}catch{await new Promise(r=>setTimeout(r,100))}}if(!connected)throw Error('Test Redis did not start');
 vi.stubEnv('UPSTASH_REDIS_REST_URL','https://quota.test');vi.stubEnv('UPSTASH_REDIS_REST_TOKEN','test');vi.stubEnv('RATE_LIMIT_HMAC_SECRET','test-only-hmac-secret-at-least-32-characters');vi.stubEnv('ALLOWED_ORIGINS','http://localhost:3000');
 const fetcher=async(_url:unknown,options:RequestInit|undefined)=>{const command=JSON.parse(String(options?.body)).map(String);return Response.json({result:await client.sendCommand(command)})};
 store=new QuotaStore(aiConfig(),fetcher as typeof fetch);
},15000);
beforeEach(async()=>{await client.flushDb()});
afterAll(async()=>{await client?.quit().catch(()=>{});daemon?.kill();vi.unstubAllEnvs()});
it('atomically allows one inference per session and feature while endpoints remain independent',async()=>{const attempts=await Promise.allSettled(Array.from({length:8},(_,i)=>store.reserve(identity,'race-'+i,1500,i%2===0?'match':'assistant')));expect(attempts.filter(r=>r.status==='fulfilled')).toHaveLength(2);expect(await client.get('portfolio:ai:day:'+identity.day+':requests')).toBe('2');expect(await client.ttl('portfolio:ai:session:test-hmac-identity:assistant:lease')).toBeLessThanOrEqual(30)});
it('reconciles confirmed usage, retains unknown usage and does not unlock another run',async()=>{const first=await store.reserve(identity,'first',4500,'assistant');await first.finish(1000);expect(await client.get('portfolio:ai:day:'+identity.day+':tokens')).toBe('1000');const second=await store.reserve(identity,'second',3000,'assistant');await first.finish(undefined);expect(await client.get('portfolio:ai:session:test-hmac-identity:assistant:lease')).toBe('second');await second.finish(undefined);expect(await client.get('portfolio:ai:day:'+identity.day+':tokens')).toBe('4000');});
it('allows exactly 30 Mira messages and 10 analyses per tool in separate rolling windows',async()=>{
 for(const [kind,count] of [['assistant',30],['explain',10],['match',10]] as const){for(let i=0;i<count;i++){const run=await store.reserve(identity,kind+i,100,kind);await run.finish(1)}await expect(store.reserve(identity,kind+'exhausted',100,kind)).rejects.toMatchObject({status:429,code:'SESSION_WINDOW'});}
 const other=await store.reserve({...identity,session:'different-session'},'other-session',100,'assistant');await other.finish(1);
});
it('grants effectively unrestricted loopback development limits without changing production policy',async()=>{
 const fetcher=async(_url:unknown,options:RequestInit|undefined)=>Response.json({result:await client.sendCommand(JSON.parse(String(options?.body)).map(String))});
 const development=new QuotaStore({...aiConfig(),development:true},fetcher as typeof fetch);
 for(let i=0;i<45;i++){const run=await development.reserve(identity,'dev'+i,100,'explain');await run.finish(1)}
 expect(await client.zCard('portfolio:ai:session:test-hmac-identity:explain:recent')).toBe(45);
});
it('enforces daily global requests, token ceilings and provider cooldown',async()=>{await client.set('portfolio:ai:day:'+identity.day+':requests','2000');await expect(store.reserve(identity,'cap',1500,'assistant')).rejects.toMatchObject({code:'GLOBAL_DAY'});await client.flushDb();await client.set('portfolio:ai:day:'+identity.day+':tokens','1999999');await expect(store.reserve(identity,'tokens',1500,'assistant')).rejects.toMatchObject({code:'TOKEN_DAY'});await client.flushDb();const run=await store.reserve(identity,'tokens-minute',99000,'assistant');await run.finish(undefined);await expect(store.reserve({...identity,hash:'second-ip'},'other',1500,'assistant')).rejects.toMatchObject({code:'TOKEN_WINDOW'});await store.cooldown(10);await expect(store.reserve(identity,'cooldown',100,'assistant')).rejects.toMatchObject({code:'COOLDOWN'})});
it('keeps quota metadata below 48-hour TTL and stores no raw input or IP',async()=>{const run=await store.reserve(identity,'retention',1500,'assistant');await run.finish(100);const keys=await client.keys('*');for(const key of keys){expect(await client.ttl(key)).toBeLessThanOrEqual(172800);expect(key).not.toMatch(/127\.0\.0\.1|prompt|question|jobDescription/)}expect(keys.some(key=>key.includes('test-hmac-identity'))).toBe(true)});
it('fails closed on REST errors before a reservation is granted',async()=>{const broken=new QuotaStore(aiConfig(),vi.fn(async()=>new Response('',{status:500})) as typeof fetch);await expect(broken.reserve(identity,'failure',1500,'assistant')).rejects.toMatchObject({code:'QUOTA_UNAVAILABLE'});expect(await client.keys('*')).toEqual([])});
