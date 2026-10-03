import { canonicalFor } from '@/lib/seo';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { PageIntro } from '@/components/Page';
import { Reveal } from '@/components/Reveal';
import { labTools } from '@/content/site';
export const metadata:Metadata={...canonicalFor('/lab'),title:'Lab',description:'Explore Maheen Hamid’s Systems Lab, grounded assistant, matcher, workflow and portfolio terminal.'};
export default function Lab(){return <><div className="container"><PageIntro number="03" label="THE LAB" title="Step inside" accent="the system." description="A place to inspect how intelligent products fit together. Explore interactive systems lessons, useful AI tools and a portfolio terminal."/></div><section className="section container lab-index"><div className="lab-index-head"><span className="eyebrow">SELECT AN EXPERIENCE</span><span>06 EXPERIENCES / ONE POINT OF VIEW</span></div><div className="lab-card-grid">{labTools.map((tool,i)=><Reveal key={tool.href} delay={Math.min(i*65,260)}><Link className={`lab-card lab-card-${i+1}`} href={tool.href}><div className="lab-card-top"><span>{tool.index} / 06</span><ArrowUpRight size={20}/></div><div className="lab-card-art" aria-hidden="true"><span className="art-node">{tool.index}</span><i/><i/><i/></div><div className="lab-card-info"><span className="eyebrow">{tool.type}</span><h2>{tool.title}</h2><p>{tool.description}</p><span className="lab-card-action">EXPLORE <ArrowRight size={16}/></span></div></Link></Reveal>)}</div><p className="lab-index-foot">Pick a concept, ask a question or bring a role to compare.</p></section></>}
