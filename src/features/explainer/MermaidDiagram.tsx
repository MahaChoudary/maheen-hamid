'use client';
import { useEffect,useId,useRef,useState } from 'react';
import { useView } from '@/components/Shell';
import { fallbackDiagram } from './diagram-recovery';
import { safeDiagram } from './diagram-safety';
let queue:Promise<unknown>=Promise.resolve();
const emptySteps:{title:string}[]=[];
export function MermaidDiagram({source,description,steps=emptySteps,title="Concept"}:{source:string;description:string;steps?:{title:string}[];title?:string}){
 const {theme}=useView();const root=useRef<HTMLDivElement>(null);const id='diagram'+useId().replace(/[^a-z0-9]/gi,'');const [error,setError]=useState(false);
 useEffect(()=>{let cancelled=false;const node=root.current;queue=queue.catch(()=>{}).then(async()=>{if(cancelled)return;try{
  if(!safeDiagram(source))throw new Error('Unsafe diagram');
  const {default:mermaid}=await import('mermaid');await document.fonts.ready;if(cancelled)return;
  const css=getComputedStyle(document.documentElement);const color=(name:string)=>css.getPropertyValue(name).trim();
  mermaid.initialize({startOnLoad:false,securityLevel:'strict',theme:'base',suppressErrorRendering:true,maxTextSize:6000,maxEdges:25,htmlLabels:false,fontFamily:'Inter, sans-serif',flowchart:{htmlLabels:false,useMaxWidth:true},themeVariables:{primaryColor:color('--raised'),primaryTextColor:color('--text'),primaryBorderColor:color('--control'),lineColor:color('--cyan'),secondaryColor:color('--surface'),tertiaryColor:color('--canvas'),background:color('--canvas'),textColor:color('--text'),actorTextColor:color('--text'),actorBkg:color('--raised'),actorBorder:color('--control'),signalColor:color('--cyan'),signalTextColor:color('--text'),noteBkgColor:color('--raised'),noteTextColor:color('--text')}});
  let svg:string;try{svg=(await mermaid.render(id,source)).svg}catch{svg=(await mermaid.render(id+"recovered",fallbackDiagram(steps,title))).svg}if(cancelled||!node)return;
  const doc=new DOMParser().parseFromString(svg,'image/svg+xml');if(doc.querySelector('parsererror')||doc.documentElement.tagName!=='svg')throw new Error('Invalid SVG');
  doc.querySelectorAll('script,foreignObject,a,image,iframe').forEach(n=>n.remove());doc.querySelectorAll('*').forEach(n=>{for(const a of [...n.attributes])if(/^on/i.test(a.name)||((a.name==='href'||a.name==='xlink:href')&&!a.value.startsWith('#')))n.removeAttribute(a.name)});
  const drawing=doc.documentElement;drawing.setAttribute('role','img');drawing.setAttribute('aria-label',description);drawing.setAttribute('width','100%');drawing.removeAttribute('height');
  const rendered=document.importNode(drawing,true) as unknown as SVGSVGElement;
  node.replaceChildren(rendered);
  // Mermaid measures in its temporary mount. Re-measure the sanitized SVG in
  // the actual themed host so imported labels/nodes cannot be cropped.
  const bounds=rendered.getBBox();
  if(![bounds.x,bounds.y,bounds.width,bounds.height].every(Number.isFinite)||bounds.width<=0||bounds.height<=0)throw new Error('Empty SVG');
  rendered.setAttribute('viewBox',`${bounds.x-12} ${bounds.y-12} ${bounds.width+24} ${bounds.height+24}`);
  rendered.setAttribute('preserveAspectRatio','xMidYMid meet');rendered.style.maxWidth='100%';
  setError(false);
 }catch{if(!cancelled){node?.replaceChildren();setError(true)}}});return()=>{cancelled=true;node?.replaceChildren()};},[source,description,id,theme,steps,title]);
 return <figure className="tech-diagram runtime-diagram"><div ref={root}/>{error&&<p role="status">The diagram could not render. The flow is described below.</p>}<figcaption>Conceptual diagram</figcaption><details><summary>Read the diagram as text</summary><p>{description}</p></details></figure>;
}
