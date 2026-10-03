import 'server-only';
import { z } from 'zod';
import type { AiConfig } from '../config';
import { ServiceError } from '../errors';
import { diagnostic } from './diagnostics';
export function parseProviderJson(content:string):unknown{
 let json=content.trim();
 // Accept only a whole JSON document or one whole fenced JSON document.
 if(json.startsWith('```')){
  const lines=json.split(/\r?\n/);
  if(!['```json','```'].includes(lines[0].toLowerCase())||lines.at(-1)!=='```')throw new ServiceError(502,'PROVIDER_PARSE','The AI response could not be read. Please retry.');
  json=lines.slice(1,-1).join('\n').trim();
 }
 try{const payload:unknown=JSON.parse(json);if(!payload||typeof payload!=='object'||Array.isArray(payload))throw new Error();return payload}
 catch{throw new ServiceError(502,'PROVIDER_PARSE','The AI response could not be read. Please retry.');}
}
export type ModelResponse={payload:unknown;model?:string;usage?:{promptTokens:number;completionTokens:number;totalTokens:number}};
export interface AiProvider {generate(system:string,user:string,schema:z.ZodType,completion:number,signal:AbortSignal,onSent:()=>void):Promise<ModelResponse>}
export class CompatibleProvider implements AiProvider {
 constructor(private config:AiConfig,private fetcher:typeof fetch=fetch){}
 async generate(system:string,user:string,schema:z.ZodType,completion:number,signal:AbortSignal,onSent:()=>void):Promise<ModelResponse>{
  const key=this.config.key?.trim();
  if(!key||/\s/.test(key))throw new ServiceError(503,'PROVIDER_NOT_CONFIGURED','The server provider key is missing or invalid.');
  signal.throwIfAborted();
  const responseFormat=process.env.AI_RESPONSE_FORMAT||'json_schema';
  if(!['json_schema','json_object'].includes(responseFormat))throw new ServiceError(503,'CONFIGURATION','Unsupported structured-output configuration.');
  const jsonSchema=z.toJSONSchema(schema);let model=this.config.model;let format=responseFormat;
  const body=()=>({model,messages:[{role:'system',content:system+(format==='json_object'?`\nReturn a JSON object with this structure: ${JSON.stringify(jsonSchema)}`:'')},{role:'user',content:user}],temperature:0,max_completion_tokens:completion,stream:false,
   ...(this.config.providerId==='groq'&&model.startsWith('openai/gpt-oss-')?{reasoning_effort:'low',include_reasoning:false}:{}),
   response_format:format==='json_schema'?{type:'json_schema',json_schema:{name:'portfolio_response',strict:true,schema:jsonSchema}}:{type:'json_object'}
  });
  const send=async()=>{
   signal.throwIfAborted();onSent();diagnostic('provider.request');
   try{return await this.fetcher(`${this.config.baseUrl}/chat/completions`,{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify(body()),cache:'no-store',redirect:'error',signal});}
   catch(error){diagnostic('provider.failed',{code:signal.aborted?'ABORTED':'NETWORK'});if(signal.aborted)throw signal.reason||error;throw new ServiceError(502,'MODEL_UNAVAILABLE','The AI provider could not be reached. Please try again.');}
  };
  let response=await send();
  // Only rejected, non-generation configuration requests get one bounded retry.
  // No account/provider cycling, retry on 429, or duplicate billable inference.
  if(this.config.providerId==='groq'&&[400,404].includes(response.status)){
   const detail=(await response.clone().text()).slice(0,8000);
   if(/model[_ -]?(?:not[_ -]?found|decommissioned)|model.*(?:does not exist|not available|not supported|decommissioned)/i.test(detail)){
    model=model==='openai/gpt-oss-20b'?'openai/gpt-oss-120b':'openai/gpt-oss-20b';response=await send();
   }else if(response.status===400&&format==='json_schema'&&/json_schema|response_format|schema.*(?:unsupported|not supported|invalid)/i.test(detail)){
    format='json_object';response=await send();
   }
  }
  diagnostic('provider.response',{status:response.status});
  if(response.status===429){diagnostic('provider.failed',{code:'PROVIDER_QUOTA',status:429});const raw=response.headers.get('retry-after');const seconds=raw&&/^\d+$/.test(raw)?Number(raw):60;throw new ServiceError(429,'PROVIDER_QUOTA','The AI provider is temporarily rate-limited.',Math.max(1,Math.min(seconds,86400)));}
  if(!response.ok){diagnostic('provider.failed',{code:'MODEL_UNAVAILABLE',status:response.status});throw new ServiceError(502,'MODEL_UNAVAILABLE','The AI provider rejected or failed this request. Please retry deliberately.');}
  let data:unknown;try{data=await response.json()}catch(error){if(signal.aborted)throw signal.reason||error;diagnostic('parse.failed',{code:'PROVIDER_ENVELOPE'});throw new ServiceError(502,'PROVIDER_RESPONSE','The AI provider returned an unreadable response. Please retry.');}
  const envelope=z.object({choices:z.array(z.object({message:z.object({content:z.string().nullable()}).passthrough()})).min(1),usage:z.object({prompt_tokens:z.number().int().nonnegative(),completion_tokens:z.number().int().nonnegative(),total_tokens:z.number().int().nonnegative()}).optional()}).passthrough().safeParse(data);
  if(!envelope.success){diagnostic('parse.failed',{code:'PROVIDER_ENVELOPE'});throw new ServiceError(502,'PROVIDER_RESPONSE','The AI provider response could not be read safely. Please retry.');}
  const used=envelope.data.usage;const usage=used&&used.total_tokens===used.prompt_tokens+used.completion_tokens?{promptTokens:used.prompt_tokens,completionTokens:used.completion_tokens,totalTokens:used.total_tokens}:undefined;
  const content=envelope.data.choices[0].message.content;
  if(!content?.trim()){diagnostic('provider.failed',{code:'PROVIDER_EMPTY'});throw new ServiceError(502,'PROVIDER_EMPTY','The AI provider returned no answer. Please retry.');}
  let payload:unknown;try{payload=parseProviderJson(content)}catch(error){diagnostic('parse.failed',{code:'PROVIDER_PARSE'});throw error;}
  // Only final JSON is read. Reasoning, tool calls and raw output are never returned.
  return {payload,usage,model};
 }
}
