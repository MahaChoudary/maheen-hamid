import { canonicalFor } from '@/lib/seo';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { publishedProjects } from '@/content/projects';
import { CaseStudy } from '@/features/projects/CaseStudy';
export function generateStaticParams(){return publishedProjects.map(project=>({slug:project.slug}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
 const {slug}=await params;
 const project=publishedProjects.find(p=>p.slug===slug);
 return {...(project?canonicalFor(`/projects/${project.slug}`):{}),title:project?.title??'Project not found',description:project?.summary};
}
export default async function ProjectPage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;
 const project=publishedProjects.find(p=>p.slug===slug);
 if(!project)notFound();
 return <CaseStudy project={project}/>;
}
