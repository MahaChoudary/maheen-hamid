'use client';
import { useEffect, useRef, useState } from 'react';
import { resume } from '@/content/site';

// Render the actual PDF, never a generated resume or stored screenshot.
// PDF.js is imported only when this preview becomes visible; document scripts are disabled.
export function PdfPreview({full=false}:{full?:boolean}){
 const host=useRef<HTMLDivElement>(null);
 const [state,setState]=useState<'loading'|'ready'|'error'>('loading');
 const [count,setCount]=useState(0);
 useEffect(()=>{
  const element=host.current;if(!element)return;
  let stopped=false,started=false,dispose:(()=>void)|undefined;
  const observer=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting)&&!started){started=true;observer.disconnect();void start()}},{rootMargin:'100px'});
  async function start(){
   try{
    const pdfjs=await import('pdfjs-dist');if(stopped)return;
    pdfjs.GlobalWorkerOptions.workerSrc='/pdfjs/pdf.worker.min.mjs';
    const task=pdfjs.getDocument({url:resume.href,standardFontDataUrl:'/pdfjs/standard_fonts/',cMapUrl:'/pdfjs/cmaps/',cMapPacked:true,wasmUrl:'/pdfjs/wasm/'});
    dispose=()=>{void task.destroy()};
    const document=await task.promise;if(stopped){dispose();return;}
    const total=full?Math.min(document.numPages,20):1;setCount(document.numPages);
    for(let number=1;number<=total;number++){
     const page=await document.getPage(number);if(stopped)return;
     const base=page.getViewport({scale:1});const width=Math.max(240,Math.min(element!.clientWidth||600,1100));
     const viewport=page.getViewport({scale:width/base.width});const ratio=Math.min(window.devicePixelRatio||1,2);
     const canvas=window.document.createElement('canvas');canvas.width=Math.round(viewport.width*ratio);canvas.height=Math.round(viewport.height*ratio);canvas.style.width='100%';canvas.style.height='auto';canvas.setAttribute('role','img');canvas.setAttribute('aria-label',`${resume.title}, page ${number} of ${document.numPages}`);
     const context=canvas.getContext('2d');if(!context)throw new Error('Canvas unavailable');
     await page.render({canvas,canvasContext:context,viewport,transform:ratio===1?undefined:[ratio,0,0,ratio,0,0]}).promise;if(stopped)return;
     // A real selectable text alternative for the original document; no paraphrase.
     const text=await page.getTextContent();const details=window.document.createElement('details');details.className='pdf-text-alternative';
     const summary=window.document.createElement('summary');summary.textContent=`Read page ${number} as text`;
     const transcript=window.document.createElement('p');transcript.textContent=text.items.map(item=>'str' in item?item.str+(item.hasEOL?'\n':' '):'').join('');
     details.append(summary,transcript);element!.append(canvas,details);
    }
    if(!stopped)setState('ready');
   }catch{if(!stopped)setState('error');}
  }
  observer.observe(element);
  return()=>{stopped=true;observer.disconnect();dispose?.();element.replaceChildren()};
 },[full]);
 return <div className={`pdf-viewer ${full?'pdf-viewer-full':''}`}>
  <div ref={host} className="pdf-canvas-host" aria-busy={state==='loading'}/>
  {state==='loading'&&<p className="pdf-load-state" role="status">Loading the original PDF…</p>}
  {state==='error'&&<div className="pdf-load-state" role="alert"><p>The inline preview could not load.</p><a href={resume.href} target="_blank" rel="noopener noreferrer">Open the original PDF in a new tab</a></div>}
  {state==='ready'&&<p className="pdf-load-state" role="status">{full?`${Math.min(count,20)} of ${count} page${count===1?'':'s'}`:`Page 1 of ${count}`} · Original PDF{full&&count>20?' · Additional pages are available in the original file.':''}</p>}
 </div>;
}
