import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, Download } from 'lucide-react';
import { PdfPreview } from '@/components/PdfPreview';
import { resume } from '@/content/site';
import { canonicalFor } from '@/lib/seo';
export const metadata:Metadata={...canonicalFor('/resume/view'),title:'View Resume',description:'Read Maheen Hamid’s supplied resume PDF.',robots:{index:false,follow:true}};
export default function ResumeViewer(){return <section className="container section resume-reader"><Link className="text-button" href="/resume"><ArrowLeft size={16} aria-hidden="true"/> Back to Resume</Link><h1>{resume.title}</h1><div className="hire-actions"><a className="button button-primary" href={resume.href} download={resume.fileName}>Download PDF <Download size={17} aria-hidden="true"/></a><a className="button button-secondary" href={resume.href} target="_blank" rel="noopener noreferrer">Open original PDF <ArrowUpRight size={17} aria-hidden="true"/><span className="sr-only"> (opens in a new tab)</span></a></div><PdfPreview full/><noscript><p>JavaScript is needed for the inline viewer. The original PDF and download links above work without JavaScript.</p></noscript></section>}
