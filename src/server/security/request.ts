import 'server-only';
import { isIP } from 'node:net';
import { createHmac,randomUUID,timingSafeEqual } from 'node:crypto';
import type { z } from 'zod';
import type { AiConfig } from '../config';
import { ServiceError } from '../errors';
export function checkOrigin(request:Request,config:AiConfig){
 const origin=request.headers.get('origin');
 if(!origin||!config.origins.includes(origin)||request.headers.get('sec-fetch-site')==='cross-site')throw new ServiceError(403,'ORIGIN_REJECTED','This API accepts submissions from approved portfolio origins only.');
 return origin;
}
export function responseHeaders(origin?:string){return {'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Vary':'Origin',...(origin?{'Access-Control-Allow-Origin':origin}:{} )};}
export async function readValidated<T>(request:Request,schema:z.ZodType<T>):Promise<T>{
 if(request.headers.get('content-type')?.split(';')[0].trim().toLowerCase()!=='application/json')throw new ServiceError(415,'CONTENT_TYPE','Submit application/json.');
 const length=request.headers.get('content-length');
 if(length&&(!/^\d+$/.test(length)||Number(length)>32768))throw new ServiceError(413,'BODY_TOO_LARGE','Request bodies must be no larger than 32 KB.');
 if(!request.body)throw new ServiceError(400,'INVALID_INPUT','A JSON request body is required.');
 const reader=request.body.getReader();const chunks:Uint8Array[]=[];let bytes=0;
 let timeout:ReturnType<typeof setTimeout>|undefined;
 try{
  const read=async()=>{for(;;){const {done,value}=await reader.read();if(done)break;bytes+=value.byteLength;if(bytes>32768)throw new ServiceError(413,'BODY_TOO_LARGE','Request bodies must be no larger than 32 KB.');chunks.push(value)}};
  await Promise.race([read(),new Promise((_,reject)=>{timeout=setTimeout(()=>reject(new ServiceError(408,'INPUT_TIMEOUT','The request body did not finish in time.')),5000)})]);
  const body=new Uint8Array(bytes);let at=0;for(const chunk of chunks){body.set(chunk,at);at+=chunk.length}
  let parsed:unknown;try{parsed=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(body))}catch{throw new ServiceError(400,'INVALID_JSON','Submit valid UTF-8 JSON.');}
  const result=schema.safeParse(parsed);
  if(!result.success)throw new ServiceError(400,'INVALID_INPUT','Check input length, acknowledgement and allowed request fields.');
  const submitted=JSON.stringify(result.data);
  if(/(?:gsk_|sk-proj-|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY)/.test(submitted))throw new ServiceError(400,'SENSITIVE_INPUT','Remove API keys, credentials and confidential information before submitting.');
  return result.data;
 }finally{clearTimeout(timeout);await reader.cancel().catch(()=>{});reader.releaseLock();}
}
export function quotaIdentity(request:Request,config:AiConfig,now=new Date()){
 let ip='127.0.0.1';
 if(config.ipSource==='vercel'){
  if(process.env.VERCEL!=='1')throw new ServiceError(503,'IP_NOT_VERIFIED','The trusted deployment client-IP strategy is unavailable.');
  ip=request.headers.get('x-vercel-forwarded-for')?.trim()||'';
  if(!isIP(ip))throw new ServiceError(503,'IP_NOT_VERIFIED','A trusted client IP could not be established.');
 }
 if(isIP(ip)===6)ip=new URL(`http://[${ip}]`).hostname.replace(/^\[|\]$/g,'').toLowerCase();
 const day=now.toISOString().slice(0,10);
 const sign=(value:string)=>createHmac('sha256',config.hmac!).update(value).digest('hex');
 const cookie=request.headers.get('cookie')?.split(';').map(s=>s.trim()).find(s=>s.startsWith('maheen_session='))?.slice(15)||'';
 const [id,signature]=cookie.split('.');const expected=id?sign(id):'';
 const valid=/^[0-9a-f-]{36}$/.test(id||'')&&/^[0-9a-f]{64}$/.test(signature||'')&&timingSafeEqual(Buffer.from(signature),Buffer.from(expected));
 const session=valid?id:randomUUID();
 return {day,hash:sign(`${day}:${ip}`),session:sign(`${day}:${session}`),...(!valid?{cookie:`maheen_session=${session}.${sign(session)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400${new URL(request.url).protocol==='https:'?'; Secure':''}`}:{})};
}
