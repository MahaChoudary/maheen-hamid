import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { PageIntro } from '@/components/Page';
import { DiagramView } from '@/features/explainer/DiagramView';
import { publishedProjects } from '@/content/projects';
import { canonicalFor } from '@/lib/seo';
export const metadata={...canonicalFor('/projects'),title:'Projects',description:'AI applications, architecture and implementation decisions by Maheen Hamid.'};
export default function Projects(){return <><div className="container"><PageIntro number="02" label="PROJECTS" title="The work behind" accent="the thinking." description="How retrieval, agent workflows and application engineering come together."/></div><section className="section container" id="project-evidence">{publishedProjects.map(project=><article className="project-feature" key={project.slug}><div><span className="eyebrow">01 / {project.category}</span><h2><Link href={`/projects/${project.slug}`}>{project.title}</Link></h2><p>{project.summary}</p><ul className="tool-list">{project.stack?.map(tool=><li key={tool}>{tool}</li>)}</ul><Link className="button button-primary" href={`/projects/${project.slug}`}>Explore the project <ArrowUpRight size={17}/></Link></div>{project.diagram&&<DiagramView diagram={project.diagram} title={project.title}/>}</article>)}<div className="project-end"><span>MORE AI ENGINEERING WORK WILL JOIN THIS COLLECTION.</span><Link href="/lab">Explore the Lab ↗</Link></div></section></>}
