import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { PageIntro } from '@/components/Page';
import { certifications } from '@/content/site';
import { canonicalFor } from '@/lib/seo';
export const metadata:Metadata={...canonicalFor('/certifications'),title:'Certifications',description:'Publicly verifiable credentials when their details are supplied.'};
export default function Certifications(){return <><div className="container"><PageIntro number="ABOUT / CREDENTIALS" label="CERTIFICATIONS" title="Proof that can" accent="be checked." description="Credentials belong here when their issuer, date and public verification details are ready to share."/></div><section className="section container content-grid">{certifications.length?certifications.map(c=><article className="content-card" key={c.credentialURL}><span className="eyebrow">{c.issuer}</span><h2>{c.title}</h2>{c.image&&<Image src={c.image} alt={`${c.title} credential`} width={640} height={400}/>}<time dateTime={c.date}>{c.date}</time><p><a className="link-arrow" href={c.verificationURL||c.credentialURL} target="_blank" rel="noopener noreferrer">Verify credential ↗</a></p></article>):<div className="content-empty"><span className="eyebrow">A clear record.</span><h2>No verified credential entries yet.</h2><p>No public credential entries are listed yet. You can review my background on the Resume page.</p><Link className="button button-secondary" href="/resume">View Resume ↗</Link></div>}</section></>}
