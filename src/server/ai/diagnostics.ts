import 'server-only';
// Metadata only: never pass submitted text, raw output, headers or error messages.
type Stage = 'retrieval.completed'|'generation.started'|'generation.completed'|'provider.request'|'provider.response'|'provider.failed'|'parse.failed'|'validation.completed'|'validation.failed'|'request.failed'|'quota.bypassed'|'quota.finish_failed';
export function diagnostic(stage:Stage,details:{kind?:string;code?:string;status?:number;sourceIds?:string[];issues?:string[]}={}){
 if(process.env.NODE_ENV==='development')console.info(`[Mira] ${stage}`,details);
}
