'use client';
import { useSyncExternalStore } from 'react';
export type Theme='light'|'dark';
const read=():Theme=>document.documentElement.dataset.theme==='light'?'light':'dark';
function apply(theme:Theme){document.documentElement.dataset.theme=theme;window.dispatchEvent(new Event('maheen-theme'))}
function subscribe(listener:()=>void){const media=matchMedia('(prefers-color-scheme: light)');const system=()=>{try{if(!localStorage.getItem('maheen.theme'))apply(media.matches?'light':'dark')}catch{apply(media.matches?'light':'dark')}};const storage=(e:StorageEvent)=>{if(e.key==='maheen.theme')apply(e.newValue==='light'?'light':e.newValue==='dark'?'dark':media.matches?'light':'dark')};window.addEventListener('maheen-theme',listener);window.addEventListener('storage',storage);media.addEventListener('change',system);system();return()=>{window.removeEventListener('maheen-theme',listener);window.removeEventListener('storage',storage);media.removeEventListener('change',system)}}
let transition:ViewTransition|undefined;let fallbackTimer:ReturnType<typeof setTimeout>|undefined;
function changeTheme(next:Theme){
 transition?.skipTransition();clearTimeout(fallbackTimer);const root=document.documentElement;
 const noMotion=matchMedia('(prefers-reduced-motion: reduce)').matches||document.body.classList.contains('motion-paused');
 if(noMotion){root.classList.remove('theme-fallback');apply(next);return;}
 if(document.startViewTransition){try{transition=document.startViewTransition(()=>apply(next));void transition.ready.catch(()=>{});void transition.finished.catch(()=>{});return}catch{}}
 root.classList.add('theme-fallback');requestAnimationFrame(()=>{apply(next);fallbackTimer=setTimeout(()=>root.classList.remove('theme-fallback'),800)});
}
export function useTheme(){const theme=useSyncExternalStore(subscribe,read,()=> 'dark' as Theme);return {theme,toggleTheme:()=>{const next=read()==='dark'?'light':'dark';try{localStorage.setItem('maheen.theme',next)}catch{}changeTheme(next)}}}
