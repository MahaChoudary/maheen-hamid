'use client';
import { useEffect,useRef,useState } from 'react';
import type { AiResult,ApiError,ConversationTurn,Kind,PublicAiSettings,TraceEvent } from './contracts';
import { submitAi,ClientApiError } from './transport';
import { useAiSettings } from './context';
export function useAiRun(kind:Kind){
 const initial=useAiSettings();const [settings,setSettings]=useState<PublicAiSettings>(initial);const [state,setState]=useState<'idle'|'pending'|'success'|'error'|'stopped'>('idle');
 const [result,setResult]=useState<AiResult|null>(null),[error,setError]=useState<ApiError|null>(null),[events,setEvents]=useState<TraceEvent[]>([]);
 const active=useRef<{id:string;runId?:string;sequence:number;controller:AbortController}|null>(null);
 useEffect(()=>()=>{active.current?.controller.abort();active.current=null},[]);
 function stop(){active.current?.controller.abort();active.current=null;setState('stopped');setError(null)}
 function reset(){active.current?.controller.abort();active.current=null;setState('idle');setResult(null);setError(null);setEvents([])}
 async function submit(text:string,consent:boolean,acknowledgement=false,history:ConversationTurn[]=[]):Promise<{result:AiResult|null;error:ApiError|null;events:TraceEvent[]}|undefined>{
  if(!text.trim()){setError({code:'INVALID_INPUT',message:kind==='assistant'?'Enter a message.':kind==='match'?'Paste a job description.':'Enter a technical topic.'});setState('error');return;}
  if(!consent||(kind==='match'&&!acknowledgement)){setError({code:'CONSENT_REQUIRED',message:'Choose Continue before submitting.'});setState('error');return;}
  active.current?.controller.abort();const current={id:crypto.randomUUID(),sequence:0,runId:undefined as string|undefined,controller:new AbortController()};active.current=current;setState('pending');setResult(null);setError(null);setEvents([]);
  const payload={requestId:current.id,consent:true,disclosureVersion:settings.disclosureVersion,...(kind==='assistant'?{question:text,history:history.slice(-6)}:kind==='match'?{jobDescription:text,acknowledgement:true}:{topic:text})};
  let outcome:AiResult|null=null;let failure:ApiError|null=null;const trace:TraceEvent[]=[];
  let clientTimeout=false;const deadline=window.setTimeout(()=>{clientTimeout=true;current.controller.abort()},30000);
  try{await submitAi(kind,payload,current.controller.signal,message=>{
   if(active.current!==current)return;
   const id=message.type==='event'?message.event.requestId:message.requestId;const run=message.type==='event'?message.event.runId:message.runId;
   if(id!==current.id||(current.runId&&current.runId!==run))return;current.runId=run;
   if(message.type==='event'){if(message.event.sequence<=current.sequence)return;current.sequence=message.event.sequence;trace.push(message.event);setEvents(prev=>[...prev,message.event]);}
   else if(message.type==='result'){outcome=message.result;setResult(message.result);setState('success');}
   else {failure=message.error;setError(message.error);setResult(null);setState('error');}
  })}catch(cause){if(active.current!==current)return;const detail=clientTimeout?{code:'TIMEOUT',message:'The response did not complete in time. Processing was stopped locally; retry deliberately.'}:cause instanceof ClientApiError?cause.detail:{code:'NETWORK_ERROR',message:'The backend connection failed. Your text remains available for a deliberate retry.'};failure=detail;outcome=null;setError(detail);setResult(null);if(detail.disclosure)setSettings(detail.disclosure);setState('error');}
  finally{clearTimeout(deadline);if(active.current===current)active.current=null;}
  return {result:outcome,error:failure,events:trace};
 }
 return {settings,state,result,error,events,submit,stop,reset};
}
