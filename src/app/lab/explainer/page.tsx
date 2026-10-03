import type { Metadata } from 'next';
import { PageIntro,LabNav } from '@/components/Page';
import { TechExplainer } from '@/features/explainer/TechExplainer';
import { canonicalFor } from '@/lib/seo';
export const metadata:Metadata={...canonicalFor('/lab/explainer'),title:'Tech Explainer',description:'Understand AI and product engineering concepts through concise explanations and runtime explanations and diagrams.'};
export default function Explainer(){return <><div className="container"><PageIntro number="PLAYGROUND" label="TECH EXPLAINER" title="Make the complex" accent="click." description="Explore the concepts behind intelligent products: a simple explanation, a small diagram and an example that makes it concrete."/><LabNav current="/lab/explainer"/></div><section className="section container"><TechExplainer/></section></>}
