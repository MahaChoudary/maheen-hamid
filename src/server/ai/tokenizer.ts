import 'server-only';
import { getEncoding } from 'js-tiktoken';
import { ServiceError } from '../errors';
import type { AiConfig } from '../config';
const encodings = new Map<string,ReturnType<typeof getEncoding>>();
export function tokenCount(text:string,config:AiConfig){
 if(!config.tokenizerVerified||!['o200k_base','cl100k_base'].includes(config.tokenizer))throw new ServiceError(503,'TOKENIZER_NOT_VERIFIED','The selected model tokenizer is not verified.');
 let encoding=encodings.get(config.tokenizer);if(!encoding){encoding=getEncoding(config.tokenizer as 'o200k_base'|'cl100k_base');encodings.set(config.tokenizer,encoding)}
 return encoding.encode(text,[],[]).length;
}
export function inputEnvelope(system:string,user:string,schema:unknown,config:AiConfig){
 // GPT-OSS ordinary text uses o200k_base ranks. Conservative extra allowance
 // covers provider chat framing/special Harmony tokens and schema serialization.
 return tokenCount(system,config)+tokenCount(user,config)+tokenCount(JSON.stringify(schema),config)+256;
}
