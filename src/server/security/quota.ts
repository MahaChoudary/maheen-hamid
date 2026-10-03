import 'server-only';
import type { AiConfig } from '../config';
import type { Kind } from '@/features/ai/contracts';
import { ServiceError } from '../errors';
// Per-feature session budgets, broad IP abuse guard and deployment cost ceilings
// are reserved atomically. A session's Explainer never consumes Mira's allowance.
export const RESERVE_LUA = `
local now=tonumber(ARGV[1]); local run=ARGV[2]; local tokens=tonumber(ARGV[3])
if redis.call('EXISTS',KEYS[2])==1 then return {0,'COOLDOWN',math.max(1,redis.call('TTL',KEYS[2]))} end
if redis.call('EXISTS',KEYS[1])==1 then return {0,'BUSY',math.max(1,redis.call('TTL',KEYS[1]))} end
for _,i in ipairs({3,4}) do redis.call('ZREMRANGEBYSCORE',KEYS[i],'-inf',now-600000) end
for _,pair in ipairs({{3,4,'SESSION_WINDOW'},{4,5,'IP_ABUSE_WINDOW'}}) do
 if redis.call('ZCARD',KEYS[pair[1]])>=tonumber(ARGV[pair[2]]) then
 local oldest=redis.call('ZRANGE',KEYS[pair[1]],0,0,'WITHSCORES')
 return {0,pair[3],math.max(1,math.ceil((tonumber(oldest[2])+600000-now)/1000))} end end
if tonumber(redis.call('GET',KEYS[5]) or '0')>=tonumber(ARGV[6]) then return {0,'IP_DAY',tonumber(ARGV[9])} end
if tonumber(redis.call('GET',KEYS[6]) or '0')>=tonumber(ARGV[7]) then return {0,'GLOBAL_DAY',tonumber(ARGV[9])} end
if tonumber(redis.call('GET',KEYS[7]) or '0')+tokens>tonumber(ARGV[8]) then return {0,'TOKEN_DAY',tonumber(ARGV[9])} end
local expired=redis.call('ZRANGEBYSCORE',KEYS[8],'-inf',now-60000)
for _,id in ipairs(expired) do redis.call('HDEL',KEYS[9],id) end
redis.call('ZREMRANGEBYSCORE',KEYS[8],'-inf',now-60000)
local minute=0; for _,id in ipairs(redis.call('ZRANGE',KEYS[8],0,-1)) do minute=minute+tonumber(redis.call('HGET',KEYS[9],id) or '0') end
if minute+tokens>tonumber(ARGV[11]) then return {0,'TOKEN_WINDOW',60} end
redis.call('SET',KEYS[1],run,'EX',30)
for _,i in ipairs({3,4}) do redis.call('ZADD',KEYS[i],now,run); redis.call('EXPIRE',KEYS[i],600) end
for _,k in ipairs({5,6}) do redis.call('INCR',KEYS[k]);redis.call('EXPIRE',KEYS[k],tonumber(ARGV[10])) end
redis.call('INCRBY',KEYS[7],tokens);redis.call('EXPIRE',KEYS[7],tonumber(ARGV[10]))
redis.call('ZADD',KEYS[8],now,run);redis.call('EXPIRE',KEYS[8],120)
redis.call('HSET',KEYS[9],run,tokens);redis.call('EXPIRE',KEYS[9],120)
return {1,'RESERVED',0}
`;
export const FINISH_LUA = `
local run=ARGV[1];local reserved=tonumber(ARGV[2]);local actual=tonumber(ARGV[3]);
if redis.call('EXISTS',KEYS[4])==1 then return 1 end
redis.call('SET',KEYS[4],'done','EX',tonumber(ARGV[4]))
if actual>=0 then
 if redis.call('EXISTS',KEYS[2])==1 then redis.call('INCRBY',KEYS[2],actual-reserved) end
 if redis.call('HEXISTS',KEYS[3],run)==1 then redis.call('HSET',KEYS[3],run,actual) end
end
if redis.call('GET',KEYS[1])==run then redis.call('DEL',KEYS[1]) end
return 1
`;
export class QuotaStore {
 constructor(private config:AiConfig,private fetcher:typeof fetch=fetch){}
 async command(command:unknown[]){
  const url=new URL(this.config.redisUrl!);
  if(url.protocol!=='https:'&&!(url.protocol==='http:'&&['localhost','127.0.0.1'].includes(url.hostname)&&this.config.ipSource==='local'))throw new ServiceError(503,'QUOTA_UNAVAILABLE','The shared quota service is unavailable.');
  try{
   const response=await this.fetcher(url,{method:'POST',headers:{Authorization:`Bearer ${this.config.redisToken}`,'Content-Type':'application/json'},body:JSON.stringify(command),signal:AbortSignal.timeout(3000),cache:'no-store',redirect:'error'});
   if(!response.ok)throw new Error();const data=await response.json();if(data.error||!Object.hasOwn(data,'result'))throw new Error();return data.result;
  }catch{throw new ServiceError(503,'QUOTA_UNAVAILABLE','The shared quota service is unavailable. No model call was started.');}
 }
 async reserve(identity:{day:string;hash:string;session?:string},runId:string,tokens:number,kind:Kind,now=Date.now()){
  const prefix='portfolio:ai';const day=`${prefix}:day:${identity.day}`;const session=`${prefix}:session:${identity.session||identity.hash}:${kind}`;
  const keys=[`${session}:lease`,`${prefix}:cooldown`,`${session}:recent`,`${prefix}:ip:${identity.hash}:${kind}:recent`,`${prefix}:ip:${identity.hash}:${kind}:day`,`${day}:requests`,`${day}:tokens`,`${prefix}:tokens:recent`,`${prefix}:tokens:amounts`];
  const nextDay=Date.parse(identity.day+'T00:00:00Z')+86400000;
  const retry=Math.max(1,Math.ceil((nextDay-now)/1000));const ttl=Math.min(172800,retry+86400);const dev=this.config.development;
  const result=await this.command(['EVAL',RESERVE_LUA,keys.length,...keys,now,runId,tokens,dev?1000000:kind==='assistant'?30:10,dev?1000000:200,dev?1000000:1000,dev?1000000000:this.config.dailyRequests,dev?1000000000:this.config.dailyTokens,retry,ttl,dev?1000000000:100000]);
  if(!Array.isArray(result)||result.length!==3)throw new ServiceError(503,'QUOTA_UNAVAILABLE','Quota reservation could not be verified.');
  if(Number(result[0])!==1)throw new ServiceError(429,String(result[1]),String(result[1])==='BUSY'?'This tool is already answering. Wait for it to finish or stop the current request.':'This tool’s request allowance is reached. Please try again after the window resets.',Math.max(1,Number(result[2])||60));
  return {finish:async(actual:number|undefined)=>{await this.command(['EVAL',FINISH_LUA,4,keys[0],keys[6],keys[8],`${prefix}:finished:${runId}`,runId,tokens,actual??-1,ttl]);}};
 }
 async cooldown(seconds:number){await this.command(['SET','portfolio:ai:cooldown','1','EX',Math.max(1,Math.min(86400,Math.ceil(seconds)))]);}
}
