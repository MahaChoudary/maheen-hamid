import 'server-only';
import type { ApiError } from '@/features/ai/contracts';
export class ServiceError extends Error {
 constructor(public status:number, public code:string, message:string, public retryAfter?:number){super(message);this.name='ServiceError'}
}
export function safeError(error:unknown):{status:number;error:ApiError}{
 if(error instanceof ServiceError)return {status:error.status,error:{code:error.code,message:error.message,...(error.retryAfter?{retryAfter:error.retryAfter}:{})}};
 if(error instanceof DOMException&&error.name==='AbortError')return {status:499,error:{code:'CANCELLED',message:'This run stopped locally. Provider processing may already have started.'}};
 return {status:503,error:{code:'SERVICE_UNAVAILABLE',message:'Live AI is temporarily unavailable. Your text remains available to edit; local search and source pages still work.'}};
}
