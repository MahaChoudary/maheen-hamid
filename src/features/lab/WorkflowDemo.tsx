'use client';
import { useState } from 'react';
import { ArrowRight, RotateCcw } from 'lucide-react';
const steps=[
 {title:'A request arrives',detail:'The visitor asks a portfolio question. The interface validates its length and makes the scope visible.'},
 {title:'Find relevant sources',detail:'Portfolio questions retrieve relevant public passages. Casual chat and general technical questions skip this step.'},
 {title:'Compose with boundaries',detail:'The model uses the request and relevant context. Conversation text cannot establish new personal facts.'},
 {title:'Validate and link',detail:'Portfolio references and factual boundaries are checked before the response is displayed.'},
] as const;
export function WorkflowDemo(){const [active,setActive]=useState(0);return <div className="workflow-board"><div className="workflow-heading"><span className="demo-badge">INTERACTIVE WALKTHROUGH</span><span>EXPLORE AT YOUR OWN PACE</span></div><div className="workflow-grid"><div className="workflow-steps">{steps.map((step,i)=><button key={step.title} className={`workflow-step ${active===i?'active':''}`} onClick={()=>setActive(i)} aria-pressed={active===i}><span>{String(i+1).padStart(2,'0')}</span><strong>{step.title}</strong><ArrowRight size={17}/></button>)}</div><div className="workflow-detail" key={active}><span className="huge-index">0{active+1}</span><span className="eyebrow">THE NEXT STEP</span><h3>{steps[active].title}</h3><p>{steps[active].detail}</p><div className="workflow-foot"><button className="button button-secondary" onClick={()=>setActive(active===steps.length-1?0:active+1)}>{active===steps.length-1?'Replay walkthrough':'Next stage'} <ArrowRight size={16}/></button><button className="text-button" onClick={()=>setActive(0)}><RotateCcw size={14}/> Reset</button></div></div></div><p className="workflow-disclaimer">An educational example. Choose a step to see how it contributes to the answer.</p></div>}
