'use client';
import { createContext,useContext,useRef,useState,type ReactNode } from 'react';
import { useAiRun } from '@/features/ai/useAiRun';
import type { AiResult,TraceEvent } from '@/features/ai/contracts';
import { friendlyError } from '@/features/ai/messages';
import { useConsent } from '@/features/ai/consent';
export type ChatMessage={id:string;role:'user'|'assistant';text:string;result?:AiResult;events?:TraceEvent[];error?:boolean};
function useSession(){
 const run=useAiRun('assistant');const consent=useConsent(run.settings);const [messages,setMessages]=useState<ChatMessage[]>([]);const generation=useRef(0);
 async function send(text:string){if(!text.trim()||run.state==='pending'||!consent.accepted)return;const current=++generation.current;const history=messages.filter(m=>!m.error).slice(-6).map(m=>({role:m.role,content:m.text.slice(0,1400)}));
  setMessages(prev=>[...prev,{id:crypto.randomUUID(),role:'user' as const,text:text.trim()}].slice(-20));
  const output=await run.submit(text,true,false,history);if(current!==generation.current)return;
  if(output){const result=output.result;setMessages(prev=>[...prev,{id:crypto.randomUUID(),role:'assistant' as const,text:(output.error?friendlyError(output.error):undefined)||result?.answer||result?.summary||'The request did not finish. Please try again.',result:result||undefined,events:output.events,error:!!output.error}].slice(-20));}
 }
 function clear(){generation.current++;run.reset();setMessages([])}
 function stop(){generation.current++;run.stop();setMessages(prev=>[...prev,{id:crypto.randomUUID(),role:'assistant' as const,text:'Reply stopped. You can send another message.',error:true}])}
 return {messages,send,clear,stop,run,consent};
}
const Context=createContext<ReturnType<typeof useSession>|null>(null);
export function MiraProvider({children}:{children:ReactNode}){const value=useSession();return <Context.Provider value={value}>{children}</Context.Provider>}
export function useMira(){const value=useContext(Context);if(!value)throw new Error('Mira session unavailable');return value}
