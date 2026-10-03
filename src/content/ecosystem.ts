export type ToolGroup={title:string;description:string;tools:{name:string}[]};
export const ecosystem:ToolGroup[]=[
  {
    "title": "AI, retrieval & orchestration",
    "description": "Find the right context, coordinate useful actions and evaluate the answer.",
    "tools": [
      {
        "name": "RAG"
      },
      {
        "name": "AI agents"
      },
      {
        "name": "LLM APIs"
      },
      {
        "name": "Groq"
      },
      {
        "name": "LangGraph"
      },
      {
        "name": "LangChain"
      },
      {
        "name": "Embeddings"
      },
      {
        "name": "Hybrid search"
      },
      {
        "name": "Reranking"
      },
      {
        "name": "Evaluation"
      }
    ]
  },
  {
    "title": "Languages & product frameworks",
    "description": "Connect an interface to dependable application and AI services.",
    "tools": [
      {
        "name": "Python"
      },
      {
        "name": "TypeScript"
      },
      {
        "name": "JavaScript"
      },
      {
        "name": "SQL"
      },
      {
        "name": "React"
      },
      {
        "name": "Next.js"
      },
      {
        "name": "FastAPI"
      },
      {
        "name": "ASP.NET Core"
      }
    ]
  },
  {
    "title": "Data & persistence",
    "description": "Choose storage around the shape, lifetime and access needs of the data.",
    "tools": [
      {
        "name": "PostgreSQL"
      },
      {
        "name": "Redis"
      },
      {
        "name": "Qdrant"
      },
      {
        "name": "Supabase"
      },
      {
        "name": "pgvector"
      }
    ]
  },
  {
    "title": "Delivery & environments",
    "description": "Make development reproducible and changes easier to review.",
    "tools": [
      {
        "name": "Docker"
      },
      {
        "name": "Docker Compose"
      },
      {
        "name": "Git"
      },
      {
        "name": "GitHub"
      },
      {
        "name": "Linux / WSL"
      },
      {
        "name": "CI/CD"
      },
      {
        "name": "GitHub Actions"
      }
    ]
  },
  {
    "title": "Cloud & deployment",
    "description": "A landscape of platforms for delivering and operating web applications.",
    "tools": [
      {
        "name": "AWS"
      },
      {
        "name": "Microsoft Azure"
      },
      {
        "name": "Vercel"
      },
      {
        "name": "Render"
      },
      {
        "name": "Heroku"
      },
      {
        "name": "Appwrite"
      }
    ]
  },
  {
    "title": "Developer workspace",
    "description": "Editors and hosted environments that support the daily development loop.",
    "tools": [
      {
        "name": "VS Code"
      },
      {
        "name": "Cursor"
      },
      {
        "name": "JetBrains IDEs"
      },
      {
        "name": "GitHub Codespaces"
      }
    ]
  },
  {
    "title": "AI coding & collaboration",
    "description": "Use assistants for exploration, implementation and review with human judgment.",
    "tools": [
      {
        "name": "GitHub Copilot"
      },
      {
        "name": "ChatGPT"
      },
      {
        "name": "Codex"
      },
      {
        "name": "Claude Code"
      }
    ]
  },
  {
    "title": "Observability & quality",
    "description": "Understand system behavior, trace failures and inspect the user experience.",
    "tools": [
      {
        "name": "Datadog"
      },
      {
        "name": "OpenTelemetry"
      },
      {
        "name": "Structured logging"
      },
      {
        "name": "Request tracing"
      },
      {
        "name": "Playwright"
      },
      {
        "name": "Accessibility checks"
      }
    ]
  }
];
