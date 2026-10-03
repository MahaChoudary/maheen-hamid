'use client';
import { useSyncExternalStore } from 'react';
import Link from 'next/link';
import type { PublicAiSettings } from './contracts';
const key='maheen.ai-consent';let transient='';
const snapshot=()=>{try{return localStorage.getItem(key)||transient}catch{return transient}};
const serverSnapshot=()=>'';
const subscribe=(listener:()=>void)=>{window.addEventListener('storage',listener);window.addEventListener('maheen-consent',listener);return()=>{window.removeEventListener('storage',listener);window.removeEventListener('maheen-consent',listener)}};
export function useConsent(settings:PublicAiSettings){const version=useSyncExternalStore(subscribe,snapshot,serverSnapshot);return {accepted:version===settings.disclosureVersion,accept:()=>{transient=settings.disclosureVersion;try{localStorage.setItem(key,transient)}catch{}window.dispatchEvent(new Event('maheen-consent'))}};}
export function ConsentNotice({accepted,onAccept}:{settings:PublicAiSettings;accepted:boolean;onAccept:()=>void}){const ready=useSyncExternalStore(()=>()=>{},()=>true,()=>false);if(!ready||accepted)return null;return <div className="consent-notice"><span className="eyebrow">Before we start</span><h3>A little clarity.</h3><p>AI tools send submitted text to an external AI service. Please leave out personal or confidential information. Chat follow-ups include short session context.</p><p className="microcopy">Conversations stay in this session. Details about processing and providers are on the Privacy page.</p><div><button className="button button-primary" onClick={onAccept} type="button">Continue</button><Link className="button button-secondary" href="/privacy">Privacy</Link></div></div>}
