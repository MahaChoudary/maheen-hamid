
import type { Diagram } from './diagrams';

// All project images and information are editable here.

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
    'The evaluation workflow and infrastructure are under development. Public benchmark results, production-scale testing, and independently verified performance measurements are not currently available.',

  evidence: [
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

    summary:
      'Document-grounded legal assistance powered by retrieval and agent workflows.',

    problem:
      'Legal document questions need relevant context and a usable path through the application. Wukala-GPT connects document analysis and retrieval with legal assistance and lawyer discovery.',

    role:
      'I built core AI components, designed retrieval pipelines and agent workflows, connected APIs, authentication and the AI service, and tested document-grounded assistance across the architecture.',

    decisions: [
      'Retrieval and vector search provide document context for LLM-assisted responses. The AI capability sits behind an API boundary rather than directly inside the interface.',

      'React, ASP.NET Core and FastAPI cover the interface, application services and AI service. PostgreSQL, Qdrant and Redis are part of the listed stack.',

      'LangGraph supports the agent workflow layer; Docker is part of the development stack. Document context and application permissions need aligned boundaries.',
    ],

    outcomes:
      'The project brings RAG, vector search, document analysis and LLM integration into one application. Public benchmark measurements are not yet available.',

    limitations:
      'A public demo, original product screenshots and independent performance measurements are not currently published.',

    evidence: [
      {
        label: 'View Resume',
        href: '/resume',
      },
    ],

    stack: [
      'React',
      'ASP.NET Core',
      'FastAPI',
      'PostgreSQL',
      'Qdrant',
      'Redis',
      'LangGraph',
      'Docker',
    ],

    // CHANGE IMAGES HERE
    visuals: {
      logo: '/projects/wukala-gpt/logo.png',
      cover: '/projects/wukala-gpt/cover.png',
      desktop: '/projects/wukala-gpt/desktop.png',
      tablet: '/projects/wukala-gpt/tablet.png',
      mobile: '/projects/wukala-gpt/mobile.png',

      // Change to false after adding real screenshots
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
];

export const publishedProjects = projects.filter(
  (project) => project.reviewed && project.published
);

export function projectArchitecture(project: ProjectCase): string {
  const diagram = project.diagram;
  if (!diagram) return project.decisions.join(' ');
  const nodes = diagram.nodes.map((node) => node.label).join(', ');
  const flows = diagram.edges.map((edge) => {
    const from = diagram.nodes.find((node) => node.id === edge.from)?.label ?? edge.from;
    const to = diagram.nodes.find((node) => node.id === edge.to)?.label ?? edge.to;
    return `${from} to ${to}${edge.label ? ` (${edge.label})` : ''}`;
  }).join('; ');
  return `Architecture components: ${nodes}. Flow: ${flows}.`;
}

export function projectSearchText(project: ProjectCase): string {
  return [project.summary, project.problem, project.role, ...project.decisions,
    projectArchitecture(project), project.outcomes, project.limitations,
    ...(project.stack ?? [])].join(' ');
}
