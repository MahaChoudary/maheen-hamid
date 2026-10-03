import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, Download, FileText, Mail } from 'lucide-react';
import { PageIntro } from '@/components/Page';
import { profile, resume } from '@/content/site';
import { canonicalFor } from '@/lib/seo';
import { PdfPreview } from '@/components/PdfPreview';

export const metadata:Metadata={...canonicalFor('/resume'),title:'Resume',description:'View and download Maheen Hamid’s actual resume: AI Engineering, Generative AI, RAG and full-stack systems.'};
export default function ResumePage(){
 return <>
  <div className="container"><PageIntro number="WORK / CV" label="RESUME" title="The profile." accent="In one page." description="A concise introduction to my AI engineering direction, technical skills, project work and education."/></div>
  <section className="container resume-layout section" aria-labelledby="resume-title">
   <aside className="resume-details">
    <span className="eyebrow">MAHEEN HAMID / RESUME</span><h2 id="resume-title">Ready to review.</h2>
    <p>{resume.summary}</p>
    <dl className="resume-facts"><div><dt>Focus</dt><dd>{profile.headline}</dd></div><div><dt>Based in</dt><dd>{profile.location}</dd></div><div><dt>Education</dt><dd>{profile.education}</dd></div><div><dt>Document</dt><dd>{resume.pages} page · PDF · {Math.round(resume.sizeBytes/1024)} KB</dd></div></dl>
    <div className="resume-actions">
     <a className="button button-primary" href={resume.viewHref} target="_blank" rel="noopener noreferrer">View Resume <ArrowUpRight size={18} aria-hidden="true"/><span className="sr-only"> (PDF viewer, opens in a new tab)</span></a>
     <a className="button button-secondary" href={resume.href} download={resume.fileName}>Download PDF <Download size={18} aria-hidden="true"/></a>
    </div>
    <p className="microcopy">The original PDF, available directly in your browser. For the most comfortable mobile reading, choose View Resume.</p>
    <Link className="link-arrow" href="/hire-me">Discuss an opportunity <ArrowUpRight size={17} aria-hidden="true"/></Link>
   </aside>
   <div className="resume-preview" id="pdf-preview">
    <div className="resume-preview-header"><span><FileText size={17} aria-hidden="true"/> RESUME / PDF PREVIEW</span><a href={resume.href} target="_blank" rel="noopener noreferrer">Open PDF <ArrowUpRight size={15} aria-hidden="true"/><span className="sr-only"> in a new tab</span></a></div>
    <div className="resume-inline-preview"><PdfPreview/></div>
    <div className="resume-preview-fallback"><FileText size={26} aria-hidden="true"/><h3>Take the resume with you.</h3><p>View the full PDF or download a copy using the actions above.</p></div>
    <p className="resume-preview-note">Preview unavailable in your browser? <a href={resume.href} target="_blank" rel="noopener noreferrer">Open the PDF directly<span className="sr-only"> in a new tab</span></a>.</p>
   </div>
  </section>
  <section className="section container resume-contact"><div><span className="eyebrow">NEXT / A CONVERSATION</span><h2>A role worth building for?</h2><p>{profile.availability}</p></div><a className="button button-secondary" href={`mailto:${profile.email}`}>Email Maheen <Mail size={18} aria-hidden="true"/></a></section>
 </>;
}
