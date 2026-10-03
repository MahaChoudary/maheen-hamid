'use client';
import { useAnimationGate } from '@/hooks/useAnimationGate';
import Image from 'next/image';
import { useEffect, useRef, useState, type PointerEvent } from 'react';
export function AvatarFrame({compact=false}:{compact?:boolean}){
 const ref=useRef<HTMLDivElement>(null); const [xy,setXY]=useState({x:50,y:50});
 const { allowed } = useAnimationGate(ref);
 useEffect(()=>{if(!allowed||compact||!matchMedia('(min-width: 900px) and (pointer: fine)').matches)return;const node=ref.current;let frame=0;const update=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>node?.style.setProperty('--scroll-depth',`${Math.min(36,window.scrollY*.045)}px`))};window.addEventListener('scroll',update,{passive:true});update();return()=>{window.removeEventListener('scroll',update);cancelAnimationFrame(frame);node?.style.removeProperty('--scroll-depth')}},[allowed,compact]);
 function move(event:PointerEvent<HTMLDivElement>){ if(!allowed||event.pointerType!=='mouse'||!ref.current) return; const r=ref.current.getBoundingClientRect();setXY({x:Math.round((event.clientX-r.left)/r.width*100),y:Math.round((event.clientY-r.top)/r.height*100)}); }
 return <div ref={ref} className={`avatar-shell ${compact?'avatar-compact':''}`} onPointerMove={move} onPointerLeave={()=>setXY({x:50,y:50})} style={{'--pointer-x':`${xy.x}%`,'--pointer-y':`${xy.y}%`,'--frame-rotate-x':`${allowed?(50-xy.y)*.04:0}deg`,'--frame-rotate-y':`${allowed?(xy.x-50)*.04:0}deg`} as React.CSSProperties}>
  <div className="avatar-topline"><span className="signal-dot"/> THE ENGINEER / 001 <span>PORTRAIT</span></div>
  <div className="avatar-image-wrap" data-moving={allowed}><Image src="/images/maheen-avatar.webp" alt="Illustrated portrait of Maheen Hamid in an AI workspace" fill priority={!compact} sizes={compact?'(max-width: 700px) 90vw, 440px':'(max-width: 700px) 95vw, 650px'} className="avatar-image"/></div>
  <div className="avatar-bottomline"><span>DESIGN / REASON / BUILD</span><span>PAKISTAN ↗ WORLD</span></div>
 </div>;
}
