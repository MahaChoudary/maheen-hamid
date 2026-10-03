'use client';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { ArrowRight, CornerDownLeft, TerminalSquare, X } from 'lucide-react';
import { useView } from '@/components/Shell';
import { commands, executeCommand, type TerminalResult } from '@/lib/terminal';
import { useMira } from '@/features/assistant/MiraContext';
import { ConsentNotice } from '@/features/ai/consent';
import { friendlyError } from '@/features/ai/messages';

type Entry={id:number,input:string,result:TerminalResult};
export function Terminal({onClose}:{onClose?:()=>void}){
 const {run:ai,send,consent,clear:clearMira,stop:stopMira}=useMira();const [queuedAsk,setQueuedAsk]=useState('');
 const {toggleTheme,theme}=useView();const [input,setInput]=useState('');const [entries,setEntries]=useState<Entry[]>([]);const [history,setHistory]=useState<string[]>([]);const [historyAt,setHistoryAt]=useState(-1);const [notice,setNotice]=useState('');const [showLatest,setShowLatest]=useState(false);const prompt=useRef<HTMLInputElement>(null);const feed=useRef<HTMLDivElement>(null);
 useEffect(()=>{prompt.current?.focus()},[onClose]);
 function latest(){if(feed.current)feed.current.scrollTop=feed.current.scrollHeight;setShowLatest(false)}
 function run(value=input){
  const raw=value.trim();if(!raw)return;
  const atBottom=!feed.current||feed.current.scrollHeight-feed.current.scrollTop-feed.current.clientHeight<45;
  const result=executeCommand(raw,ai.settings.enabled);
  if(result.action==='clear'){
   clearMira();setQueuedAsk('');setEntries([]);setHistory([]);setNotice('Terminal cleared.');setShowLatest(false);
  }else{
   if(result.action==='theme'){toggleTheme();result.lines=[`Appearance: ${theme==='dark'?'Light':'Dark'}.`];}
   if(result.action==='ask'){if(ai.state==='pending')result.lines=['One AI request is running. Stop it before asking another question.'];else{ai.reset();setQueuedAsk(result.question||'');if(consent.accepted)void send(result.question||'');}}
   setEntries(prev=>[...prev,{id:Date.now()+Math.random(),input:raw,result}].slice(-50));
   setNotice(result.lines[0]||'Command complete.');
   setHistory(prev=>[raw,...prev].slice(0,50));
   if(atBottom)requestAnimationFrame(latest);else setShowLatest(true);
  }
  setHistoryAt(-1);setInput('');
 }
 function key(e:React.KeyboardEvent<HTMLInputElement>){if(e.key==='ArrowUp'){e.preventDefault();const next=Math.min(historyAt+1,history.length-1);if(next>=0){setHistoryAt(next);setInput(history[next])}}else if(e.key==='ArrowDown'){e.preventDefault();const next=Math.max(-1,historyAt-1);setHistoryAt(next);setInput(next>=0?history[next]:'')}else if(e.key==='Tab'){const matches=commands.filter(c=>c.startsWith(input.toLowerCase()));if(matches.length===1){e.preventDefault();setInput(matches[0]+' ')}}}
 function submit(e:FormEvent){e.preventDefault();run()}
 return <div className="terminal-app"><div className="terminal-chrome"><div className="terminal-chrome-left"><TerminalSquare size={17}/><strong>MAHEEN / COMMAND CENTER</strong><span>LOCAL / SAFE</span></div>{!onClose&&<Link href="/lab" className="text-button">Exit terminal ↗</Link>}{onClose&&<button className="icon-button" aria-label="Close terminal" onClick={onClose}><X size={18}/></button>}</div>
  <div className="terminal-feed" ref={feed} role="log" aria-live="off" aria-label="Command results"><div className="terminal-intro"><span className="mono dim">MAHEEN HAMID / INTERFACE 01</span><h2 className="terminal-brand" aria-label="MAHEEN"><span aria-hidden="true">M A H E E N</span></h2><pre className="terminal-ascii" aria-hidden="true">{`+----------------------------------+\n|   intelligent systems, real use  |\n+----------------------------------+`}</pre><p>A local portfolio interface. Predefined commands only; nothing runs in a shell.</p></div>
   <div className="terminal-suggestions">{['help','about','skills','lab','projects'].map(c=><button key={c} onClick={()=>run(c)}>{c} <ArrowRight size={13}/></button>)}</div>
   {entries.map(entry=><div className="terminal-entry" key={entry.id}><div className="command-echo"><span>maheen@portfolio ~ %</span> {entry.input}</div><div className="command-output">{entry.result.lines.map((line,i)=><p key={i}>{line}</p>)}{entry.result.links?.map(link=><Link href={link.href} key={link.label} onClick={onClose}>{link.label} <ArrowRight size={14}/></Link>)}</div></div>)}
   {queuedAsk&&<div className="terminal-ai-output"><p><strong>Question:</strong> {queuedAsk}</p><ConsentNotice settings={ai.settings} accepted={consent.accepted} onAccept={consent.accept}/>{ai.state==='pending'?<button className="text-button" onClick={stopMira}>Stop request →</button>:<button className="button button-secondary" disabled={!consent.accepted} onClick={()=>void send(queuedAsk)}>Ask Mira</button>}{ai.state==='stopped'&&<p>Reply stopped.</p>}{ai.error&&<p className="field-error" role="alert">{friendlyError(ai.error)}</p>}{ai.state==='success'&&ai.result&&<div className="ai-result"><p>{ai.result.answer||ai.result.summary}</p></div>}</div>}
  </div>{showLatest&&<button className="terminal-latest" onClick={latest}>Latest output ↓</button>}<form className="terminal-form" onSubmit={submit}><label htmlFor={onClose?'modal-command':'page-command'}>maheen@portfolio ~ %</label><input ref={prompt} id={onClose?'modal-command':'page-command'} value={input} onChange={e=>setInput(e.target.value.slice(0,1024))} onKeyDown={key} autoComplete="off" autoCapitalize="off" spellCheck={false} placeholder="type help to begin" aria-label="Enter a predefined portfolio command"/><button aria-label="Run command" type="submit"><CornerDownLeft size={19}/></button></form><div className="terminal-status"><span>{input.length}/1024</span><span>↑↓ HISTORY · TAB COMPLETE · ENTER RUN</span></div><span className="sr-only" aria-live="polite">{notice}</span>
 </div>;
}
