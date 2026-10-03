import type { ApiError } from './contracts';
export function friendlyError(error:ApiError):string {
 if(['AI_DISABLED','PRIVACY_NOT_VERIFIED','PROVIDER_NOT_CONFIGURED','TOKENIZER_NOT_VERIFIED','QUOTA_NOT_CONFIGURED','CONFIGURATION'].includes(error.code))return 'AI is temporarily unavailable. Please try again later.';
 if(error.code==='INVALID_INPUT'||error.code==='TOKEN_LIMIT')return 'Please shorten your text and keep the key details.';
 if(error.code==='CONSENT_REQUIRED')return 'Choose Continue before sending your message.';
 if(error.code==='DISCLOSURE_CHANGED')return 'The privacy notice changed. Review it and try again.';
 if(error.code==='COMPARISON_NOT_VERIFIED')return 'The AI returned a comparison that could not be safely verified. Please retry with a shorter, clearer job description.';
 if(error.code.includes('LIMIT')||error.code.includes('QUOTA')||error.code==='BUSY'||error.code==='COOLDOWN'||error.code==='SESSION_WINDOW'||error.code==='IP_ABUSE_WINDOW'||error.code==='IP_DAY'||error.code==='GLOBAL_DAY'||error.code==='TOKEN_WINDOW'||error.code==='TOKEN_DAY')return 'The request limit has been reached. Please try again later.';
 if(error.code==='CANCELLED')return 'Request stopped.';
 return 'Something interrupted this response. Please try again.';
}
