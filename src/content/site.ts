
import { publishedProjects } from './projects';
import { ecosystem } from './ecosystem';
import { writingPosts } from './writing';

export { writingPosts } from './writing';
export type { WritingPost } from './writing';

export const profile = {
  name: 'MAHEEN HAMID',
  headline: 'AI Engineer | Full-Stack AI Systems',
  location: 'Sialkot, Pakistan',
  education: 'BS Computer Science graduate, University of Sialkot, Department of Computer Science',
  story: 'I chose AI engineering because I want to build intelligent systems that solve real problems instead of creating isolated demos. I enjoy combining AI reasoning, RAG and agents with complete full-stack products that people can actually use.',
  availability: 'Open to AI Engineer jobs, internships and selected freelance opportunities. Remote and international opportunities preferred.',
  email: 'maheen.hamid30@gmail.com',
  phone: '+92 331 1432480',
  linkedin: 'https://www.linkedin.com/in/maheenhamidd/',
  github: 'https://github.com/maheenhmd',
} as const;

// Replace the file in public/documents and update this filename to publish a new CV.
const resumeFileName = 'maheen-hamid-resume.pdf';

export const resume = {
  fileName: resumeFileName,
  href: `/documents/${resumeFileName}`,
  viewHref: '/resume/view',
  title: 'Maheen Hamid — Resume',
  pages: 1,
  sizeBytes: 98770,
  summary: 'Computer Science graduate focused on AI Engineering and Generative AI, with hands-on exposure to LLM-based applications, Retrieval-Augmented Generation, agentic workflows, vector search and backend API integration.',
  knowledgeStatus: 'Maheen’s actual resume PDF is available to view and download on the Resume page. Reviewed public CV sections are available to Mira; the original PDF remains available.',
  comparisonScope: 'Reviewed CV + public portfolio comparison',
} as const;

export const workLinks = [
  {
    label: 'Projects',
    href: '/projects',
    description: 'AI products and architecture',
  },
  {
    label: 'Live Demos',
    href: '/lab',
    description: 'Explore interactive portfolio experiences',
  },
  {
    label: 'Hire Me',
    href: '/hire-me',
    description: 'Roles, collaboration and availability',
  },
  {
    label: 'Resume',
    href: '/resume',
    description: 'View or download the actual PDF',
  },
] as const;

export const navigationGroups = [
  {
    label: 'Work',
    links: workLinks,
  },
  {
    label: 'Writing',
    links: [
      {
        label: 'Blog',
        href: '/writing',
        description: 'Practical AI and engineering articles',
      },
    ],
  },
  {
    label: 'Playground',
    links: [
      {
        label: 'Mira',
        href: '/lab/assistant',
        description: 'Maheen’s AI portfolio assistant',
      },
      {
        label: 'Tech Explainer',
        href: '/lab/explainer',
        description: 'Understand the pieces, visually',
      },
      {
        label: 'Terminal',
        href: '/lab/terminal',
        description: 'A safe portfolio command center',
      },
    ],
  },
  {
    label: 'About',
    links: [
      {
        label: 'About Me',
        href: '/about',
        description: 'The person and approach',
      },
      {
        label: 'Certifications',
        href: '/certifications',
        description: 'Credentials and verification',
      },
      {
        label: 'Uses',
        href: '/uses',
        description: 'Stack, learning and tools to explore',
      },
      {
        label: 'GitHub',
        href: profile.github,
        description: 'Explore the public profile',
      },
    ],
  },
] as const;

export const nav = [
  { label: 'Home', href: '/' },
  ...navigationGroups.map((g) => ({
    label: g.label,
    href: g.links[0].href,
  })),
  { label: 'Contact', href: '/contact' },
];

export const miraPrompts = [
  'Who is Maheen?',
  'How does she combine RAG and full-stack apps?',
  'What is Wukala-GPT?',
  'Is she available for remote work?',
] as const;

export const engineeringDirection = {
  approach: 'I want retrieval, agents, backend APIs and frontend interfaces to work as a complete product. Reliable answers need evidence, clear boundaries and an experience people can use.',
  focus: 'My direction is full-stack AI engineering: RAG applications, agent workflows and the services and interfaces around them.',
  learning: 'My coursework includes in AI, Machine Learning, NLP, Data Structures & Algorithms, Databases and Parallel & Distributed Computing.',
};

export type Certification = {
  title: string;
  issuer: string;
  date: string;
  credentialURL: string;
  verificationURL?: string;
  image?: string;
};

export const certifications: Certification[] = [];

export const usesGroups = ecosystem.map((group) => ({
  title: group.title,
  items: group.tools.map((tool) => tool.name),
}));

export const destinations = {
  home: '/',
  about: '/about',
  projects: '/projects',
  lab: '/lab',
  systems: '/lab/systems',
  assistant: '/lab/assistant',
  workflow: '/lab/how-it-works',
  terminal: '/lab/terminal',
  mira: '/lab/assistant',
  explainer: '/lab/explainer',
  writing: '/writing',
  uses: '/uses',
  certifications: '/certifications',
  contact: '/contact',
  privacy: '/privacy',
  resume: '/resume',
  hire: '/hire-me',
} as const;

export type Destination = keyof typeof destinations;

export const capabilities = [
  {
    number: '01',
    title: 'AI reasoning & retrieval',
    text: 'RAG, embeddings, semantic search, reranking concepts, LLM integration, evaluation and hallucination awareness.',
  },
  {
    number: '02',
    title: 'Agentic workflows',
    text: 'LangGraph, multi-agent workflows and prompt engineering.',
  },
  {
    number: '03',
    title: 'Full-stack product engineering',
    text: 'React, Next.js, TypeScript, Python, FastAPI, ASP.NET Core Web API and REST APIs.',
  },
  {
    number: '04',
    title: 'Systems & infrastructure',
    text: 'Docker, Git, Linux / WSL, API boundaries, PostgreSQL, Qdrant and Redis familiarity.',
  },
] as const;

export const labTools = [
  {
    index: '01',
    title: 'Systems',
    href: '/lab/systems',
    type: 'INTERACTIVE EXPLANATION',
    description: 'Trace how an intelligent product connects its interface, services, retrieval and evidence.',
  },
  {
    index: '02',
    title: 'Mira',
    href: '/lab/assistant',
    type: 'AI EXPERIENCE',
    description: 'Portfolio conversations, technical ideas and useful follow-ups.',
  },
  {
    index: '03',
    title: 'How My AI Thinks',
    href: '/lab/how-it-works',
    type: 'ILLUSTRATIVE WALKTHROUGH',
    description: 'Explore how requests, context and response checks fit together.',
  },
  {
    index: '04',
    title: 'Tech Explainer',
    href: '/lab/explainer',
    type: 'INTERACTIVE EXPLANATION',
    description: 'Explore AI and engineering concepts with runtime explanations and diagrams.',
  },
  {
    index: '05',
    title: 'Portfolio Terminal',
    href: '/lab/terminal',
    type: 'LOCAL COMMAND INTERFACE',
    description: 'Explore this portfolio with safe, predefined commands.',
  },
] as const;

export type SearchEntry = {
  title: string;
  type: string;
  href: string;
  body: string;
  tags: string;
};

export const searchEntries: SearchEntry[] = [
  {
    title: 'Writing',
    type: 'PAGE',
    href: '/writing',
    body: 'Practical perspectives on AI, RAG, backend, frontend and software development.',
    tags: 'blog writing AI backend frontend',
  },
  {
    title: 'Uses',
    type: 'PAGE',
    href: '/uses',
    body: usesGroups.map((g) => g.items.join(' ')).join(' '),
    tags: 'tools hardware editor development',
  },
  {
    title: 'Certifications',
    type: 'PAGE',
    href: '/certifications',
    body: 'Credentials will be listed when publishable verification details are available.',
    tags: 'certificates credentials certifications',
  },
  {
    title: 'Tech Explainer',
    type: 'LAB',
    href: '/lab/explainer',
    body: 'Runtime AI explanations and diagrams of RAG, embeddings, semantic search, reranking, vector databases, LangGraph, agents, Docker, Redis, FastAPI, REST APIs, Next.js and CI/CD.',
    tags: 'explain technology concepts diagram',
  },
  ...publishedProjects.map((p) => ({
    title: p.title,
    type: 'PROJECT',
    href: `/projects/${p.slug}`,
    body: [p.summary, p.problem, ...p.decisions].join(' '),
    tags: p.category,
  })),
  ...writingPosts.map((p) => ({
    title: p.title,
    type: 'ARTICLE',
    href: `/writing/${p.slug}`,
    body: [p.description, ...p.body.map((b) => b.text)].join(' '),
    tags: p.tags.join(' '),
  })),
  {
    title: 'Home',
    type: 'PAGE',
    href: '/',
    body: `${profile.headline}. ${profile.story} ${profile.availability} ${profile.location}`,
    tags: 'maheen introduction AI engineer full stack story',
  },
  {
    title: 'About Maheen',
    type: 'PAGE',
    href: '/about',
    body: `${profile.story} ${profile.education} ${profile.availability}`,
    tags: 'profile background education CV resume experience',
  },
  {
    title: 'Capabilities',
    type: 'SECTION',
    href: '/about#capabilities',
    body: capabilities.map((x) => `${x.title} ${x.text}`).join(' '),
    tags: 'skills stack RAG agents docker git linux react python nextjs',
  },
  {
    title: 'Projects',
    type: 'PAGE',
    href: '/projects',
    body: 'Wukala-GPT: multi-agent legal AI, document-grounded retrieval, backend APIs and React.',
    tags: 'work case studies portfolio Wukala GPT',
  },
  {
    title: 'Lab',
    type: 'PAGE',
    href: '/lab',
    body: labTools.map((x) => `${x.title} ${x.description}`).join(' '),
    tags: 'systems AI assistant explainer workflow terminal',
  },
  {
    title: 'Systems',
    type: 'LAB',
    href: '/lab/systems',
    body: 'Illustrative product flow: interface, API, retrieval, reasoning, evidence. Inspect each component and its input and output. Educational example, not a project execution trace.',
    tags: 'architecture RAG agents docker git linux system design',
  },
  {
    title: 'Mira',
    type: 'LAB',
    href: '/lab/assistant',
    body: 'Mira, Maheen’s AI portfolio assistant: natural conversation, grounded portfolio facts and technical explanations.',
    tags: 'mira assistant ask question chat citations evidence',
  },
  {
    title: 'How My AI Thinks',
    type: 'LAB',
    href: '/lab/how-it-works',
    body: 'Illustrative walkthrough of request, retrieval, generation, validation and evidence links. Observable workflow, not private model reasoning.',
    tags: 'RAG retrieval explanation workflow',
  },
  {
    title: 'Portfolio Terminal',
    type: 'LAB',
    href: '/lab/terminal',
    body: 'Predefined local commands help about whoami skills projects lab experience education contact resume cv clear theme open search ask.',
    tags: 'cli command line terminal',
  },
  {
    title: 'Let’s Talk',
    type: 'PAGE',
    href: '/contact',
    body: `${profile.availability} Email ${profile.email}. Phone ${profile.phone}. LinkedIn ${profile.linkedin}. GitHub ${profile.github}. Location ${profile.location}.`,
    tags: 'contact hire internship freelance remote international',
  },
  {
    title: 'Privacy',
    type: 'PAGE',
    href: '/privacy',
    body: 'Search and ordinary terminal commands run locally. Explicit Mira and Tech Explainer submissions use server APIs. Provider processing requires disclosure, configuration and shared quotas.',
    tags: 'data handling privacy AI prompts',
  },
  {
    title: 'Resume',
    type: 'PAGE',
    href: '/resume',
    body: `${resume.title}. ${resume.summary} View Resume. Download PDF.`,
    tags: 'cv resume download pdf education recruiter',
  },
  {
    title: 'Hire Me',
    type: 'PAGE',
    href: '/hire-me',
    body: `${profile.headline}. ${profile.availability}. ${capabilities.map((item) => item.text).join(' ')}`,
    tags: 'hire work roles opportunities freelance remote contact',
  },
];
