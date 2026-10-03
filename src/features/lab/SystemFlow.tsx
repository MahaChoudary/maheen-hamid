'use client';
import { useEffect, useRef, useState } from 'react';
import { useAnimationGate } from '@/hooks/useAnimationGate';
import { ArrowRight, Pause, Play, RotateCcw } from 'lucide-react';
const steps=[
 {id:'01',name:'Interface',label:'THE HUMAN SIDE',input:'A person asks a question.',output:'A clear request moves to the service.',detail:'The product starts with a usable interface. Input and intent belong to the person, and the interface should explain what happens next.'},
 {id:'02',name:'API boundary',label:'THE CONTRACT',input:'Validated request and context.',output:'A controlled call to retrieval.',detail:'A service validates input, applies boundaries and coordinates the parts of the system. It keeps secrets and provider choices away from the browser.'},
 {id:'03',name:'Retrieval',label:'THE EVIDENCE',input:'Question plus approved knowledge.',output:'Relevant source passages.',detail:'Retrieval finds the pieces of information most relevant to the request. The quality of these passages sets the ceiling for a grounded answer.'},
 {id:'04',name:'Reasoning',label:'THE COMPOSITION',input:'Question and source passages.',output:'A proposed response.',detail:'A model can compose an answer from the evidence it receives. Source text remains data, and uncertain claims should stay uncertain.'},
 {id:'05',name:'Verification',label:'THE TRUST LAYER',input:'Proposed response and sources.',output:'A supported answer or an honest gap.',detail:'The system checks source references and displays limitations. An answer without sufficient evidence should say so.'},
] as const;
export function SystemFlow({compact=false}:{compact?:boolean}){
 const [active,setActive]=useState(0),[playing,setPlaying]=useState(false);
 const ref=useRef<HTMLDivElement>(null);
 const { allowed, reduced }=useAnimationGate(ref);
 useEffect(()=>{
  if(!playing||!allowed)return;
  const id=window.setTimeout(()=>{
   if(active>=steps.length-1){setPlaying(false);return;}
   setActive(active+1);
   if(active+1===steps.length-1)setPlaying(false);
  },1050);
  return()=>window.clearTimeout(id);
 },[playing,allowed,active]);
 const s=steps[active];
 return <div className={`system-flow ${compact?'flow-compact':''}`} ref={ref}><div className="flow-head"><span className="eyebrow">ILLUSTRATIVE SYSTEM / NOT A LIVE RUN</span><span className="flow-count">0{active+1} / 0{steps.length}</span></div>
 <div className="flow-track" role="group" aria-label="Illustrative intelligent product flow">{steps.map((step,i)=><div className="flow-node-wrap" key={step.id}><button className={`flow-node ${active===i?'selected':''}`} aria-pressed={active===i} onClick={()=>{setPlaying(false);setActive(i)}}><small>{step.id} / {step.label}</small><strong>{step.name}</strong></button>{i<steps.length-1&&<span className={`flow-connector ${active>i?'passed':''}`} aria-hidden="true"><ArrowRight size={18}/></span>}</div>)}</div>
 <div className="flow-detail" key={s.id}><div className="flow-detail-index">{s.id}<span> / SYSTEM LAYER</span></div><div><h3>{s.name}</h3><p>{s.detail}</p><div className="flow-io"><span><small>INPUT</small>{s.input}</span><span><small>OUTPUT</small>{s.output}</span></div></div></div>
 <div className="flow-controls"><button onClick={()=>{setPlaying(false);setActive(Math.max(0,active-1))}} disabled={active===0}>← Previous</button><button className="flow-play" onClick={()=>{if(reduced){setActive(steps.length-1);setPlaying(false);return}if(active===steps.length-1)setActive(0);setPlaying(v=>!v)}}>{playing?<Pause size={15}/>:<Play size={15}/>} {reduced?'Show complete sequence':playing?'Pause sequence':'Play sequence'}</button><button onClick={()=>{setActive(0);setPlaying(false)}}><RotateCcw size={15}/> Reset</button><button onClick={()=>{setPlaying(false);setActive(Math.min(steps.length-1,active+1))}} disabled={active===steps.length-1}>Next →</button></div></div>
}
