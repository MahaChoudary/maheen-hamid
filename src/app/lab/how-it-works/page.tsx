import { canonicalFor } from '@/lib/seo';
import type { Metadata } from 'next';
import { LabNav, PageIntro } from '@/components/Page';
import Link from 'next/link';
import { WorkflowDemo } from '@/features/lab/WorkflowDemo';
export const metadata:Metadata={...canonicalFor('/lab/how-it-works'),title:'How My AI Thinks',description:'An illustrative walkthrough of retrieval, generation and evidence validation.'};
export default function HowItWorks(){return <><div className="container"><PageIntro number="03.04" label="LAB / WORKFLOW" title="How My AI" accent="Thinks." description="Follow a portfolio question from context to answer through an interactive walkthrough."/><LabNav current="/lab/how-it-works"/></div><section className="section container lab-primary"><WorkflowDemo/></section><div className="container lab-support"><div><span className="eyebrow">WHAT THIS SHOWS</span><h2>From context<br/>to a useful answer.</h2></div><p>Try the workflow for yourself: ask a question or compare a role. <Link href="/lab/assistant">Ask Mira →</Link> <Link href="/lab/matcher">Compare a role →</Link></p></div></>}
