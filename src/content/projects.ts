
import type { Diagram } from './diagrams';

export type ProjectVisuals = {
  logo: string;
  cover: string;
  desktop: string;
  tablet: string;
  mobile: string;
  placeholders?: boolean;
};

export type ProjectCase = {
  slug: string;
  title: string;
  summary: string;
  category: string;
  reviewed: boolean;
  published: boolean;
  status?: 'published' | 'in-development';
  problem: string;
  role: string;
  decisions: string[];
  outcomes: string;
  limitations: string;
  stack?: string[];
  diagram?: Diagram;
  evidence: { label: string; href: string }[];
  visuals?: ProjectVisuals;
  visualLabel?: string;
};

export const projects: ProjectCase[] = [
  {
    slug: 'ragify',
    title: 'Ragify',
    category: 'RAG EVALUATION PLATFORM',
    visualLabel: 'Evaluation for real-life RAG systems',

    reviewed: true,
    published: true,
    status: 'published',

    summary:
      'A RAG evaluation platform for testing retrieval strategies, assessing answer quality, and analyzing retrieval performance.',

    problem:
      'Building a RAG application is only the first step. Developers also need to understand whether retrieved documents are relevant, generated answers are faithful to their sources, and retrieval configurations deliver reliable results. Ragify focuses on making these evaluations easier to perform and understand.',

    role:
      'I worked on the RAG evaluation architecture, retrieval workflows, vector database integration, backend services, database management, and evaluation functionality. I also worked with containerized infrastructure and database migrations.',

    decisions: [
      'Qdrant serves as the vector database for semantic search and document retrieval. The evaluation workflow is designed to assess retrieval behavior and answer quality.',

      'PostgreSQL supports structured application data, while Alembic manages database schema migrations. Separating relational storage from vector search keeps their responsibilities clear.',

      'Docker provides containerized database services for consistent local development. The architecture separates retrieval, evaluation logic, and persistent storage.',

      'Evaluation focuses on measures such as faithfulness, context precision, and answer relevance to help compare RAG configurations.',
    ],

    outcomes:
      'Ragify combines retrieval evaluation, vector search infrastructure, and evaluation reporting in one project. It provides a foundation for comparing RAG configurations and understanding answer quality. Independently verified benchmark results are not yet published.',

    limitations:
      'The platform remains under active development. Production-scale testing and independently verified performance measurements are not currently available.',

    evidence: [
      {
        label: 'GitHub Repository',
        href: 'https://github.com/maheenhmd/Ragify',
      },
      {
        label: 'View Resume',
        href: '/resume',
      },
    ],

    stack: [
      'Python',
      'PostgreSQL',
      'Qdrant',
      'Docker',
      'Alembic',
      'Vector Search',
      'RAG Evaluation',
      'REST APIs',
    ],

    visuals: {
      logo: '/projects/ragify/logo.png',
      cover: '/projects/ragify/cover.png',
      desktop: '/projects/ragify/desktop.png',
      tablet: '/projects/ragify/tablet.png',
      mobile: '/projects/ragify/mobile.png',
      placeholders: true,
    },

    diagram: {
      nodes: [
        { id: 'ui', label: 'Ragify interface' },
        { id: 'api', label: 'Backend API' },
        { id: 'retrieval', label: 'RAG retrieval pipeline' },
        { id: 'data', label: 'Qdrant + documents' },
        { id: 'evaluation', label: 'Evaluation engine' },
        { id: 'results', label: 'Evaluation results' },
      ],

      edges: [
        { from: 'ui', to: 'api', label: 'request' },
        { from: 'api', to: 'retrieval', label: 'evaluate' },
        { from: 'retrieval', to: 'data', label: 'search' },
        { from: 'data', to: 'evaluation', label: 'context' },
        { from: 'evaluation', to: 'results', label: 'metrics' },
      ],
    },
  },

  {
    slug: 'wukala-gpt',
    title: 'Wukala-GPT',
    category: 'MULTI-AGENT LEGAL AI',
    visualLabel: 'AI-powered legal intelligence',

    reviewed: true,
    published: true,
    status: 'published',

    summary:
      'A full-stack legal AI platform integrating multi-agent workflows, retrieval-augmented generation, document intelligence, and lawyer discovery.',

    problem:
      'Legal document questions need relevant context and a usable path through the application. Wukala-GPT connects document analysis and retrieval with legal assistance and lawyer discovery.',

    role:
      'I built core AI components, designed retrieval pipelines and agent workflows, connected APIs, authentication and the AI service, and tested document-grounded assistance across the architecture.',

    decisions: [
      'Retrieval and vector search provide document context for LLM-assisted responses. The AI capability sits behind an API boundary rather than directly inside the interface.',

      'React, ASP.NET Core and FastAPI cover the interface, application services and AI service. PostgreSQL, Qdrant and Redis support persistent data, vector retrieval and caching.',

      'LangGraph supports multi-agent orchestration, while Docker supports containerized development. Service separation helps maintain modularity across application and AI components.',
    ],

    outcomes:
      'Integrated document-grounded AI assistance, multi-agent orchestration, legal document analysis, and lawyer discovery into a full-stack application. The project also includes client, lawyer, and administrative functionality.',

    limitations:
      'The application has a live website, but independently validated accuracy benchmarks and production-scale performance measurements are not publicly available.',

    evidence: [
      {
        label: 'GitHub Repository',
        href: 'https://github.com/maheenhmd/Wukala_GPT',
      },
      {
        label: 'Live Website',
        href: 'https://www.wukala-gpt.app/',
      },
      {
        label: 'View Resume',
        href: '/resume',
      },
    ],

    stack: [
      'React',
      'TypeScript',
      'ASP.NET Core',
      'FastAPI',
      'PostgreSQL',
      'Qdrant',
      'Redis',
      'LangGraph',
      'Docker',
    ],

    visuals: {
      logo: '/projects/wukala-gpt/logo.png',
      cover: '/projects/wukala-gpt/cover.png',
      desktop: '/projects/wukala-gpt/desktop.png',
      tablet: '/projects/wukala-gpt/tablet.png',
      mobile: '/projects/wukala-gpt/mobile.png',
      placeholders: true,
    },

    diagram: {
      nodes: [
        { id: 'ui', label: 'React interface' },
        { id: 'api', label: 'Application APIs + auth' },
        { id: 'ai', label: 'FastAPI + agent workflows' },
        { id: 'data', label: 'Documents + vector search' },
        { id: 'answer', label: 'Document-grounded response' },
      ],

      edges: [
        { from: 'ui', to: 'api', label: 'request' },
        { from: 'api', to: 'ai', label: 'AI service' },
        { from: 'ai', to: 'data', label: 'retrieve' },
        { from: 'data', to: 'answer', label: 'context' },
      ],
    },
  },

  {
    slug: 'repoiq',
    title: 'RepoIQ',
    category: 'AI-POWERED CODE INTELLIGENCE',
    visualLabel: 'Coming Soon · Under Development',

    reviewed: true,
    published: true,
    status: 'in-development',

    summary:
      'An AI-powered, repository-aware technical interview platform designed to analyze GitHub codebases and generate personalized technical interviews. Currently under development.',

    problem:
      'Developers often build complex projects but struggle to explain their architecture, implementation choices, and underlying engineering concepts during technical interviews. Generic interview preparation rarely reflects the actual code developers have written. RepoIQ aims to bridge this gap through repository-aware technical assessments.',

    role:
      'I am designing and developing the platform architecture, GitHub integration, repository ingestion workflows, source-code filtering, backend APIs, and PostgreSQL persistence. AI-powered retrieval, question generation, and interview evaluation are planned development stages.',

    decisions: [
      'GitHub integration enables repository discovery, metadata retrieval, source-code exploration, and filtering of irrelevant files before further processing.',

      'FastAPI provides a modular Python backend, while Next.js and TypeScript are selected for the frontend. The architecture separates repository ingestion, code processing, and future AI interview services.',

      'PostgreSQL with Neon provides persistent relational storage for repository and ingestion data. Multi-language code chunking supports structured source-code processing.',

      'The planned RAG pipeline will retrieve relevant repository context for AI-generated technical questions. Text-based interviews, answer evaluation, and a voice interviewer are planned for later stages.',
    ],

    outcomes:
      'The current development foundation includes GitHub repository integration, metadata retrieval, smart file filtering, PostgreSQL-backed ingestion, and multi-language code chunking. RAG-powered code understanding and personalized technical interviews are upcoming features.',

    limitations:
      'RepoIQ is actively under development and has not been publicly launched. AI interview generation, answer evaluation, voice interaction, and production-scale testing are not yet complete.',

    evidence: [
      {
        label: 'GitHub Repository',
        href: 'https://github.com/maheenhmd/RepoIQ',
      },
    ],

    stack: [
      'Python',
      'FastAPI',
      'Next.js',
      'TypeScript',
      'PostgreSQL',
      'Neon',
      'GitHub API',
      'Code Chunking',
      'RAG (Planned)',
      'AI Agents (Planned)',
    ],

    visuals: {
      logo: '/projects/repoiq/logo.png',
      cover: '/projects/repoiq/cover.png',
      desktop: '/projects/repoiq/desktop.png',
      tablet: '/projects/repoiq/tablet.png',
      mobile: '/projects/repoiq/mobile.png',
      placeholders: true,
    },

    diagram: {
      nodes: [
        { id: 'github', label: 'GitHub repository' },
        { id: 'api', label: 'FastAPI backend' },
        { id: 'filter', label: 'File discovery + filtering' },
        { id: 'chunk', label: 'Code chunking' },
        { id: 'db', label: 'PostgreSQL + Neon' },
        { id: 'rag', label: 'RAG retrieval (planned)' },
        { id: 'interview', label: 'AI interviewer (planned)' },
        { id: 'feedback', label: 'Feedback (planned)' },
      ],

      edges: [
        { from: 'github', to: 'api', label: 'import' },
        { from: 'api', to: 'filter', label: 'discover' },
        { from: 'filter', to: 'chunk', label: 'process' },
        { from: 'chunk', to: 'db', label: 'persist' },
        { from: 'db', to: 'rag', label: 'retrieve' },
        { from: 'rag', to: 'interview', label: 'context' },
        { from: 'interview', to: 'feedback', label: 'evaluate' },
      ],
    },
  },
];

export const publishedProjects = projects.filter(
  (project) => project.reviewed && project.published
);

export function projectArchitecture(project: ProjectCase): string {
  const diagram = project.diagram;

  if (!diagram) return project.decisions.join(' ');

  const nodes = diagram.nodes
    .map((node) => node.label)
    .join(', ');

  const flows = diagram.edges
    .map((edge) => {
      const from =
        diagram.nodes.find((node) => node.id === edge.from)
          ?.label ?? edge.from;

      const to =
        diagram.nodes.find((node) => node.id === edge.to)
          ?.label ?? edge.to;

      return `${from} to ${to}${
        edge.label ? ` (${edge.label})` : ''
      }`;
    })
    .join('; ');

  return `Architecture components: ${nodes}. Flow: ${flows}.`;
}

export function projectSearchText(project: ProjectCase): string {
  return [
    project.summary,
    project.problem,
    project.role,
    project.status ?? '',
    ...project.decisions,
    projectArchitecture(project),
    project.outcomes,
    project.limitations,
    ...(project.stack ?? []),
  ].join(' ');
}
