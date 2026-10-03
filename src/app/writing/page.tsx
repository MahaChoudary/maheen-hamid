import type { Metadata } from 'next';
import Link from 'next/link';
import { PageIntro } from '@/components/Page';
import { BlogCard } from '@/components/BlogCard';
import { Reveal } from '@/components/Reveal';
import { writingPosts } from '@/content/writing';
import { canonicalFor } from '@/lib/seo';
export const metadata:Metadata={...canonicalFor('/writing'),title:'Blog',description:'Practical perspectives on AI, RAG, backend, frontend and the future of software development.'};
export default async function Writing({searchParams}:{searchParams:Promise<{category?:string}>}){const {category}=await searchParams;const categories=['All','AI','RAG','Backend','Frontend','Technology'];const active=category&&categories.includes(category)?category:'All';const posts=writingPosts.filter(p=>active==='All'||p.category===active);return <><div className="container"><PageIntro number="WRITING / PERSPECTIVES" label="THE BLOG" title="Ideas worth" accent="thinking through." description="AI, software and the decisions behind useful products. Practical perspectives, grounded in primary research and engineering documentation."/><nav className="blog-categories" aria-label="Blog categories">{categories.map(c=><Link key={c} href={c==='All'?'/writing':`/writing?category=${c}`} aria-current={c===active?'page':undefined}>{c}</Link>)}</nav></div><section className="section container blog-grid" aria-label="Articles">{posts.map((post,i)=><Reveal key={post.slug} delay={i%3*70}><BlogCard post={post}/></Reveal>)}</section></>}
