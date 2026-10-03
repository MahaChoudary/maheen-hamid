import 'server-only';
import { createHash } from 'node:crypto';
import { ServiceError } from './errors';
import type { PublicAiSettings } from '@/features/ai/contracts';
const flag=(value:string|undefined)=>value==='true';
const limit=(name:string, fallback:number)=>{const n=Number(process.env[name]||fallback);if(!Number.isInteger(n)||n<1||n>1000000000)throw new ServiceError(503,'CONFIGURATION','AI limits must be positive integers within the supported range.');return n};
const local=(url:URL)=>['localhost','127.0.0.1','[::1]'].includes(url.hostname);
export function publicAiSettings():PublicAiSettings {
 const provider=process.env.AI_PROVIDER==='openai-compatible'?(process.env.AI_PROVIDER_NAME?.trim()||'Configured AI provider'):'Groq';
 const privacyVerified=flag(process.env.AI_PRIVACY_VERIFIED);
 return {provider,privacyVerified,enabled:flag(process.env.AI_ENABLED),disclosureVersion:createHash('sha256').update(`${provider}:v3:conversation-explanation-session-six-turns:ephemeral:${privacyVerified}`).digest('hex').slice(0,24)};
}
export function aiConfig(){
 const pub=publicAiSettings();
 const provider=process.env.AI_PROVIDER||'groq';
 if(!['groq','openai-compatible'].includes(provider))throw new ServiceError(503,'CONFIGURATION','AI provider configuration is unavailable.');
 const siteUrl=process.env.SITE_URL;
 const origins=(process.env.ALLOWED_ORIGINS||siteUrl||'http://localhost:3000').split(',').map(x=>x.trim()).filter(Boolean);
 for(const origin of origins){const u=new URL(origin);if(u.origin!==origin||!['https:','http:'].includes(u.protocol))throw new ServiceError(503,'CONFIGURATION','Allowed origins must be exact HTTP(S) origins.');}
 const baseUrl=new URL(provider==='groq'?'https://api.groq.com/openai/v1':process.env.AI_BASE_URL||'https://api.openai.com/v1');
 if(baseUrl.username||baseUrl.password||baseUrl.search||baseUrl.hash||(!['https:'].includes(baseUrl.protocol)&&!(baseUrl.protocol==='http:'&&local(baseUrl)&&origins.every(o=>local(new URL(o))))))throw new ServiceError(503,'CONFIGURATION','AI endpoint must use HTTPS; loopback endpoints are only for local verification.');
 const requestedModel=process.env.AI_MODEL||process.env.GROQ_MODEL||'openai/gpt-oss-20b';
 // Groq structured output is pinned to its two supported GPT-OSS production models.
 const model=provider==='groq'&&!['openai/gpt-oss-20b','openai/gpt-oss-120b'].includes(requestedModel)?'openai/gpt-oss-20b':requestedModel;
 const tokenizer=process.env.AI_TOKENIZER||'o200k_base';
 const knownHarmony=provider==='groq'&&['openai/gpt-oss-20b','openai/gpt-oss-120b'].includes(model)&&tokenizer==='o200k_base';
 return {...pub,providerId:provider,baseUrl:baseUrl.href.replace(/\/$/,''),model,key:provider==='groq'?process.env.GROQ_API_KEY:process.env.AI_API_KEY,tokenizer,tokenizerVerified:knownHarmony||flag(process.env.AI_TOKENIZER_VERIFIED),origins,redisUrl:process.env.UPSTASH_REDIS_REST_URL,redisToken:process.env.UPSTASH_REDIS_REST_TOKEN,hmac:process.env.RATE_LIMIT_HMAC_SECRET,ipSource:process.env.AI_IP_SOURCE||'local',development:process.env.NODE_ENV==='development'&&origins.every(o=>local(new URL(o)))&&process.env.AI_ENFORCE_PRODUCTION_LIMITS!=='true',dailyRequests:limit('AI_DAILY_REQUEST_LIMIT',2000),dailyTokens:limit('AI_DAILY_TOKEN_LIMIT',2000000),deadlineMs:25000};
}
export type AiConfig=ReturnType<typeof aiConfig>;
export function requireLive(config:AiConfig){
 if(!config.enabled)throw new ServiceError(503,'AI_DISABLED','Live AI is disabled. Approved source lookup remains available.');
 if(process.env.VERCEL_ENV==='preview')throw new ServiceError(503,'AI_DISABLED','AI is disabled on preview deployments.');
 if(!config.privacyVerified)throw new ServiceError(503,'PRIVACY_NOT_VERIFIED','Live AI is unavailable until the configured provider privacy settings are verified.');
 if(!config.key)throw new ServiceError(503,'PROVIDER_NOT_CONFIGURED','Live AI is unavailable: the server provider key has not been configured.');
 if(!config.tokenizerVerified)throw new ServiceError(503,'TOKENIZER_NOT_VERIFIED','Live AI is unavailable until model/tokenizer compatibility has been verified.');
 if(!config.redisUrl||!config.redisToken||!config.hmac||config.hmac.length<32)throw new ServiceError(503,'QUOTA_NOT_CONFIGURED','Live AI is unavailable: the shared quota store or HMAC secret is not configured.');
 if(config.ipSource!=='vercel'&&config.ipSource!=='local')throw new ServiceError(503,'CONFIGURATION','A trusted client-IP strategy is required.');
 if(config.ipSource==='local'&&!config.origins.every(o=>local(new URL(o))))throw new ServiceError(503,'CONFIGURATION','The local shared identity may only be used on loopback origins.');
}
