import { canonicalFor } from '@/lib/seo';
import type { Metadata } from 'next';
import { LabNav, PageIntro } from '@/components/Page';
import { Terminal } from '@/features/terminal/Terminal';
export const metadata:Metadata={...canonicalFor('/lab/terminal'),title:'Portfolio Terminal',description:'Navigate Maheen Hamid’s portfolio with a safe, functional predefined command interface.'};
export default function TerminalPage(){return <><div className="container"><PageIntro number="03.05" label="LAB / TERMINAL" title="A different way" accent="in." description="A functional command interface for the portfolio. Try help, skills, search RAG or open lab. No shell commands are executed."/><LabNav current="/lab/terminal"/></div><section className="section container terminal-page"><Terminal/></section></>}
