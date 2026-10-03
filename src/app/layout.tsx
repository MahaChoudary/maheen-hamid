import { AiSettingsProvider } from '@/features/ai/context';
import { publicAiSettings } from '@/server/config';
import type { Metadata } from 'next';
import { MiraProvider } from '@/features/assistant/MiraContext';
import { themeBootstrap } from '@/lib/theme-bootstrap';
import { Shell } from '@/components/Shell';
import { siteOrigin } from '@/lib/seo';
import { profile } from '@/content/site';
import './globals.css';
const origin=siteOrigin();
export const metadata:Metadata={...(origin?{metadataBase:origin}:{}),title:{default:'Maheen Hamid — AI Engineer',template:'%s — Maheen Hamid'},description:'Maheen Hamid is an AI Engineer focused on full-stack AI systems, RAG, agents and usable intelligent products. Explore her story, systems and Lab.',robots:{index:true,follow:true},openGraph:{title:'Maheen Hamid | AI Engineer',description:'Full-stack AI systems, built with purpose.',type:'website'}};
export default function RootLayout({children}:{children:React.ReactNode}){const person={'@context':'https://schema.org','@type':'Person',name:'Maheen Hamid',jobTitle:'AI Engineer',sameAs:[profile.linkedin,profile.github],address:{'@type':'PostalAddress',addressLocality:'Sialkot',addressCountry:'PK'}};return <html lang="en" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{__html:themeBootstrap}}/></head><body><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(person).replace(/</g,'\\u003c')}}/><AiSettingsProvider settings={publicAiSettings()}><MiraProvider><Shell>{children}</Shell></MiraProvider></AiSettingsProvider></body></html>}
