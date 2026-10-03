export type WritingPost={title:string;slug:string;description:string;publishDate:string;tags:string[];category:'AI'|'RAG'|'Backend'|'Frontend'|'Technology';readingTime:number;cover:string;coverAlt:string;body:{heading:string;text:string;mermaid?:string;diagramDescription?:string;reference?:string}[];references:{title:string;href:string}[]};
export const writingPosts:WritingPost[]=[
  {
    "title": "Will AI Replace Humans — or Change How We Work?",
    "slug": "will-ai-replace-humans",
    "description": "The useful question is which tasks change, who checks the result and what becomes more valuable.",
    "publishDate": "2026-10-03",
    "tags": [
      "Future of work",
      "AI",
      "Human judgment"
    ],
    "category": "AI",
    "readingTime": 3,
    "cover": "/images/blog/human-ai.webp",
    "coverAlt": "The useful question is which tasks change, who checks the result and what becomes more valuable.",
    "body": [
      {
        "heading": "A job is more than its easiest task",
        "text": "An AI tool can draft an email in seconds. That does not mean it understands why the email matters, which promise the business can keep, or whether sending it is a good idea. A job usually combines routine production with context, relationships and responsibility. Treating one impressive demo as a prediction about the whole job skips most of that work.\n\nThe ILO’s 2025 task-based exposure study makes this distinction useful: exposure to generative AI is not the same as observed job loss, and the report describes transformation as the more likely effect for most occupations. That is a measured assessment of tasks, not a guarantee that every worker will benefit. The transition can still be difficult and uneven.",
        "reference": "https://www.ilo.org/publications/generative-ai-and-jobs-refined-global-index-occupational-exposure"
      },
      {
        "heading": "Look at the handoff, not just the output",
        "text": "Consider a small product team preparing a release. AI might summarize issues, suggest code, draft documentation and organize feedback. Someone still needs to decide which problem matters, check the code against real requirements, investigate a failed deployment and explain a tradeoff to a customer.\n\nMy practical way to think about this is a task map: identify what can be drafted, what needs verification and what requires an accountable decision. Keep the handoff visible. A draft that reaches the wrong person without context can create more work than it saves. A useful workflow should make the reviewer’s job easier, not simply produce more material.",
        "mermaid": "flowchart TD\n A[\"Work task\"] --> B[\"AI assisted draft\"]\n B --> C[\"Human review and context\"]\n C --> D[\"Decision and delivery\"]\n C --> E[\"Revise or reject\"]",
        "diagramDescription": "Look at the handoff, not just the output — Consider a small product team preparing a release. AI might summarize issues, suggest code, draft documentation and organize feedback. Someone still needs to decide which problem matters, check the code against real requirements, investigate a failed deployment and explain a tradeoff to a customer."
      },
      {
        "heading": "Speed changes the bottleneck",
        "text": "When creating a first draft becomes cheap, choosing the right draft becomes more important. A developer may spend less time typing a component and more time deciding its state model, checking accessibility and reviewing the dependency it introduces. This is a shift in the work, not a reason to abandon fundamentals.\n\nI would judge an AI-assisted workflow by accepted, useful outcomes: fewer avoidable errors, clearer handoffs and less time spent recovering from mistakes. Counting generated words or lines of code tells us very little. A faster draft with a longer review queue may not improve the team’s delivery at all."
      },
      {
        "heading": "A sensible way to prepare",
        "text": "Choose one real task and try AI with a clear review boundary. Compare the result with your usual approach. Write down what it missed, what context helped and which checks you had to perform. Repeat with a less tidy case before making the tool part of a larger workflow.\n\nFor engineers, strengthen the abilities that let you inspect and own a system: debugging, data modeling, security, testing and communication. Learn to explain why a result is acceptable, not just how to ask for it. Tools will change; those habits travel well.\n\nMy view is that “replacement” is too broad to guide everyday decisions. Ask what work becomes easier, where responsibility stays and how people can share in the gains. That gives a team something concrete to design around."
      }
    ],
    "references": [
      {
        "title": "ILO: Generative AI and Jobs, 2025",
        "href": "https://www.ilo.org/publications/generative-ai-and-jobs-refined-global-index-occupational-exposure"
      },
      {
        "title": "GitHub: Copilot cloud agent capabilities",
        "href": "https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent"
      }
    ]
  },
  {
    "title": "AI Agents vs Traditional Chatbots",
    "slug": "ai-agents-vs-traditional-chatbots",
    "description": "A conversation is an interface. An agent adds decisions, tools and a much larger responsibility boundary.",
    "publishDate": "2026-10-03",
    "tags": [
      "Agents",
      "Architecture",
      "Tool use"
    ],
    "category": "AI",
    "readingTime": 3,
    "cover": "/images/blog/agents-chatbots.webp",
    "coverAlt": "A conversation is an interface. An agent adds decisions, tools and a much larger responsibility boundary.",
    "body": [
      {
        "heading": "The chat window tells you very little",
        "text": "Two products can look like the same chat box while doing completely different work. One answers a question using a prompt and context. The other chooses a tool, inspects its result, decides what to do next and continues until a task is complete or a limit is reached.\n\nThe distinction I find useful is control flow. Anthropic’s engineering guide separates workflows with predefined paths from agents that let the model direct steps and tool usage. A chatbot can contain either architecture; an agent can run without a chat interface. The labels matter less than what the application is allowed to do.",
        "reference": "https://www.anthropic.com/engineering/building-effective-agents"
      },
      {
        "heading": "A concrete support example",
        "text": "A customer asks, “Where is my order?” A basic assistant might explain the shipping policy. A retrieval-backed chatbot can find the correct policy clause. A tool-enabled workflow can authenticate the customer, look up that order and report its status. An agent becomes useful if the next step genuinely depends on what it discovers.\n\nNow change the request to “Cancel it if it has not shipped.” Reading an order and changing it are different permissions. The application must verify access, enforce the cancellation policy and distinguish a proposed action from an action that actually completed. Fluent text cannot substitute for a transaction result.",
        "mermaid": "flowchart TD\n A[\"Customer request\"] --> B[\"Choose allowed tool\"]\n B --> C[\"Validate identity and arguments\"]\n C --> D[\"Tool result\"]\n D --> E[\"Answer or next step\"]\n E --> B",
        "diagramDescription": "A concrete support example — A customer asks, “Where is my order?” A basic assistant might explain the shipping policy. A retrieval-backed chatbot can find the correct policy clause. A tool-enabled workflow can authenticate the customer, look up that order and report its status. An agent becomes useful if the next step genuinely depends on what it discovers."
      },
      {
        "heading": "Autonomy has an operating cost",
        "text": "Every additional loop adds latency, tokens and another place for a failure to happen. A model can select the wrong tool, repeat a successful action after a timeout or interpret untrusted tool output as an instruction. These are application design problems as much as model problems.\n\nUse narrow tool contracts and explicit limits. A read-only search tool with bounded results is easier to reason about than a tool that can run arbitrary queries. A write operation needs authorization and protection against duplicate execution. Keep an observable record of tool outcomes without turning logs into a store of sensitive user text."
      },
      {
        "heading": "Start with the simplest control flow",
        "text": "If the sequence is known, write a workflow. If the system only needs to answer from a fixed body of documents, a retrieval pipeline may be enough. Reach for an agent when choosing the next step is the actual source of value, and when you can define what success and stopping look like.\n\nBefore shipping, test a missing record, permission denial, invalid tool arguments and a timeout after a write. Ask whether the final response accurately says what happened. “I tried to cancel the order” and “the order was cancelled” must remain distinct.\n\nA good agent feels dependable because its authority is carefully designed. More tools and more loops do not automatically make it more useful."
      }
    ],
    "references": [
      {
        "title": "Anthropic: Building effective agents",
        "href": "https://www.anthropic.com/engineering/building-effective-agents"
      },
      {
        "title": "GitHub: Responsible use of agents",
        "href": "https://docs.github.com/en/copilot/responsible-use/agents"
      }
    ]
  },
  {
    "title": "Is RAG Still Relevant in 2026?",
    "slug": "is-rag-still-relevant-in-2026",
    "description": "Larger context windows change the design choices. They do not remove the need to find the right evidence.",
    "publishDate": "2026-10-03",
    "tags": [
      "RAG",
      "Retrieval",
      "Evaluation"
    ],
    "category": "RAG",
    "readingTime": 3,
    "cover": "/images/blog/rag-2026.webp",
    "coverAlt": "Larger context windows change the design choices. They do not remove the need to find the right evidence.",
    "body": [
      {
        "heading": "Start with what the model needs to know",
        "text": "A model can be very capable and still lack your latest policy, internal documentation or a project detail that was never part of its training. RAG supplies selected external information when the question arrives. The goal is useful context, not a vector database for its own sake.\n\nIn 2026 I would still choose retrieval for a changing document collection with source tracking and access boundaries. For a small, stable set of documents, placing the relevant material directly in the prompt may be simpler. The right choice depends on the information problem and the measured user experience."
      },
      {
        "heading": "Long context and retrieval solve overlapping problems",
        "text": "A larger context window lets you include more material. Retrieval helps decide which material belongs in this request. Neither approach guarantees that an answer is grounded, current or permitted for the user.\n\nSuppose a company has different refund rules by plan, region and policy version. Sending every rule leaves the model to resolve conflicting context. Retrieving the rule with the right metadata gives the answer a cleaner starting point. For a short document with no access distinctions, that extra pipeline may not earn its complexity.",
        "mermaid": "flowchart TD\n A[\"Question and access scope\"] --> B[\"Find candidate passages\"]\n B --> C[\"Select relevant evidence\"]\n C --> D[\"Compose answer\"]\n D --> E[\"Check support and uncertainty\"]",
        "diagramDescription": "Long context and retrieval solve overlapping problems — A larger context window lets you include more material. Retrieval helps decide which material belongs in this request. Neither approach guarantees that an answer is grounded, current or permitted for the user."
      },
      {
        "heading": "What makes retrieval worth building",
        "text": "Preserve document identity, version and meaningful passage boundaries. A clause separated from its exception can be misleading even when similarity search returns it. Apply access rules before the model receives context, not after the answer is generated.\n\nAnthropic’s Contextual Retrieval work illustrates two useful ideas: precise lexical matching can complement embeddings, and a passage may need surrounding context to remain interpretable. Reranking can refine candidates, but it adds cost and latency. Treat these as options to test against observed failures rather than a mandatory stack.",
        "reference": "https://www.anthropic.com/engineering/contextual-retrieval"
      },
      {
        "heading": "Evaluate the evidence before polishing the answer",
        "text": "Make a small evaluation set with questions you can answer by inspecting the documents. Include a paraphrase, an exact identifier, a contradictory old version and a question whose answer is absent. Inspect whether the necessary passage appears, then judge whether the response uses it correctly.\n\nIf retrieval misses the clause, a more persuasive prompt is unlikely to repair the knowledge gap. If retrieval succeeds but the answer ignores a condition, work on the answer stage. Keep these failures separate so you know what to improve. A grounded refusal is a useful outcome for an unanswerable question."
      },
      {
        "heading": "The boundary matters as much as the pipeline",
        "text": "Casual chat does not need retrieval from a personal portfolio. A greeting should not fail because no document contains “hello.” A factual question about a project does need the relevant records. Routing is part of the experience, not just an optimization.\n\nMy answer to the title is yes, when external evidence is the reason the application exists. Build the smallest retrieval system that can reliably find that evidence, measure it and keep uncertainty visible. RAG remains an engineering choice, not a universal badge of sophistication."
      }
    ],
    "references": [
      {
        "title": "Anthropic: Contextual Retrieval",
        "href": "https://www.anthropic.com/engineering/contextual-retrieval"
      },
      {
        "title": "LangChain: Retrieval architecture",
        "href": "https://docs.langchain.com/oss/python/deepagents/retrieval"
      }
    ]
  },
  {
    "title": "Modern Backend Engineering for AI Applications",
    "slug": "modern-backend-engineering-for-ai-applications",
    "description": "Model calls are only one dependency. The backend still owns contracts, budgets, permissions and failure behavior.",
    "publishDate": "2026-10-03",
    "tags": [
      "Backend",
      "APIs",
      "Observability"
    ],
    "category": "Backend",
    "readingTime": 3,
    "cover": "/images/blog/backend-ai.webp",
    "coverAlt": "Model calls are only one dependency. The backend still owns contracts, budgets, permissions and failure behavior.",
    "body": [
      {
        "heading": "A prompt is not a service boundary",
        "text": "An AI demo can be a short script. A useful application must cope with concurrent users, slow dependencies, invalid input and output that does not match expectations. The backend is where those conditions become an explicit contract.\n\nFor a document assistant, separate request validation, retrieval, model generation and result checking. Keep provider secrets on the server. The frontend should receive a result it can display or a clear error it can recover from. It should never need to interpret a provider’s raw internal response."
      },
      {
        "heading": "Waiting and computing are different work",
        "text": "FastAPI’s async guidance explains the distinction between waiting on I/O and performing CPU-heavy computation. An async endpoint can yield while a network request is pending; it does not make expensive parsing or embedding work free. Blocking work still needs an appropriate execution strategy.\n\nGive every dependency a deadline. A request waiting forever for a model can occupy resources and leave the interface stuck. Propagate cancellation where possible, while remembering that a provider may already have begun processing. A stopped browser request is not proof that upstream work was never billed.",
        "reference": "https://fastapi.tiangolo.com/async/"
      },
      {
        "heading": "Budgets should match the product",
        "text": "A chat assistant, an explanation tool and a long comparison do not have the same interaction pattern. Give them distinct request allowances so trying one feature does not exhaust another. Pair those user-facing budgets with broader abuse and cost controls.\n\nReserve budgets before inference using an atomic store operation. Simultaneous requests should not each read the same remaining allowance and all pass. Track request metadata and token amounts, not the visitor’s entire prompt. In local development, generous limits help test realistic flows without weakening the production policy."
      },
      {
        "heading": "Return a result the interface can trust",
        "text": "Validate output structure without demanding incidental formatting that adds no safety. For an explanation, a missing diagram should not erase valid educational text. For a job comparison, a requirement invented by the model should never be accepted as a real line from the job description. Different fields need different checks.\n\nAn upstream failure should have an appropriate HTTP status and a clear retry state. Do not turn a failed AI analysis into a keyword-only “success.” The user needs to know whether a real comparison happened.",
        "mermaid": "flowchart TD\n A[\"Validated request\"] --> B[\"Independent quota reservation\"]\n B --> C[\"Retrieval and model call\"]\n C --> D[\"Validate useful result\"]\n D --> E[\"HTTP result or clear error\"]",
        "diagramDescription": "Return a result the interface can trust — Validate output structure without demanding incidental formatting that adds no safety. For an explanation, a missing diagram should not erase valid educational text. For a job comparison, a requirement invented by the model should never be accepted as a real line from the job description. Different fields need different checks."
      },
      {
        "heading": "Observe the path without exposing the payload",
        "text": "OpenTelemetry describes traces as a way to follow a request through connected operations. For AI services, useful spans might cover retrieval, provider latency and validation. The trace should explain where time or failure occurred without collecting confidential prompt content by default.\n\nI would start with a few operational questions: where did the request stop, how long did each dependency take, was the allowance reserved, and did output validation reject the result? A polished response is helpful, but dependable failure behavior is what makes the application maintainable.",
        "reference": "https://opentelemetry.io/docs/concepts/signals/traces/"
      }
    ],
    "references": [
      {
        "title": "FastAPI: Concurrency and async / await",
        "href": "https://fastapi.tiangolo.com/async/"
      },
      {
        "title": "OpenTelemetry: Traces",
        "href": "https://opentelemetry.io/docs/concepts/signals/traces/"
      }
    ]
  },
  {
    "title": "How Frontend Development Is Changing With AI",
    "slug": "how-frontend-development-is-changing-with-ai",
    "description": "Generating a component is easier. Designing a coherent, accessible experience still takes deliberate engineering.",
    "publishDate": "2026-10-03",
    "tags": [
      "Frontend",
      "React",
      "Accessibility"
    ],
    "category": "Frontend",
    "readingTime": 3,
    "cover": "/images/blog/frontend-ai.webp",
    "coverAlt": "Generating a component is easier. Designing a coherent, accessible experience still takes deliberate engineering.",
    "body": [
      {
        "heading": "The first draft is no longer the hardest part",
        "text": "AI can help produce component scaffolding, explore a layout and explain unfamiliar code. The difficult part often arrives after that draft: connecting it to real data, choosing a state model and making every transition understandable.\n\nA page that looks convincing in a screenshot may fail when the text is longer, a request times out or the visitor uses a keyboard. I think the useful shift is from producing isolated screens to specifying the behavior around them. The prompt should describe the experience, and the review should test that experience."
      },
      {
        "heading": "State is still the foundation",
        "text": "React’s “Thinking in React” guide starts from component boundaries and identifying the minimal state needed for the interface. That remains a useful discipline with generated code. If loading, error and success flags can contradict each other, the visual polish will not rescue the flow.\n\nTake an AI result panel. It needs an idle introduction, a pending state, a stopped state, a usable result and a retryable failure. A new request should clear the old result deliberately. A late response from a cancelled request should not replace the current screen. These details need a model of the interaction, not just more JSX.",
        "reference": "https://react.dev/learn/thinking-in-react"
      },
      {
        "heading": "Design the failure before the glow",
        "text": "A good interface tells someone what happened and what they can do next. Keep their input available after a failure. Use meaningful labels and avoid hiding the only retry action in a tooltip. Distinguish a backend outage from invalid input where that distinction helps the user.\n\nFor long-running AI work, present a calm pending state. Do not fabricate progress percentages or imply access to private model reasoning. When the result arrives, motion can guide attention to it. It should not make the answer harder to read or force the user to wait for a decorative sequence.",
        "mermaid": "flowchart TD\n A[\"User submits\"] --> B[\"Pending with stop action\"]\n B --> C[\"Usable result\"]\n B --> D[\"Recoverable error\"]\n D --> A\n B --> E[\"Stopped; input kept\"]",
        "diagramDescription": "Design the failure before the glow — A good interface tells someone what happened and what they can do next. Keep their input available after a failure. Use meaningful labels and avoid hiding the only retry action in a tooltip. Distinguish a backend outage from invalid input where that distinction helps the user."
      },
      {
        "heading": "Accessibility belongs in the definition of done",
        "text": "The W3C’s WCAG guidance gives concrete criteria for keyboard access, contrast, text alternatives and other aspects of usable interfaces. AI-generated markup still needs these checks. A button drawn as a styled div does not become accessible because it looks good.\n\nTest focus order, dropdown keyboard behavior, readable error messages and small-screen overflow. Respect reduced-motion preferences and give visitors a way to pause ambient motion. Diagram text alternatives should explain the actual flow, not simply say “diagram.” Automated tools help identify problems, but interacting with the page remains essential.",
        "reference": "https://www.w3.org/WAI/WCAG22/quickref/"
      },
      {
        "heading": "Use the saved time to inspect the product",
        "text": "Ask an assistant to propose alternatives or explain a component, then verify the result in context. Review what dependencies it added and whether it introduced duplicated state or unnecessary client-side work. Prefer a small understandable implementation over a clever one you cannot maintain.\n\nFrontend work is changing because drafts arrive faster. That makes product judgment, interaction design and verification more valuable in the daily loop. The best outcome is not a larger pile of generated components; it is an interface that behaves well for the person using it."
      }
    ],
    "references": [
      {
        "title": "React: Thinking in React",
        "href": "https://react.dev/learn/thinking-in-react"
      },
      {
        "title": "W3C: How to meet WCAG",
        "href": "https://www.w3.org/WAI/WCAG22/quickref/"
      }
    ]
  },
  {
    "title": "Vibe Coding, Coding Agents & the Future of Software Development",
    "slug": "vibe-coding-and-coding-agents",
    "description": "Fast experimentation is useful. Shipping software adds requirements, review and responsibility that a good prompt cannot erase.",
    "publishDate": "2026-10-03",
    "tags": [
      "Coding agents",
      "Developer tools",
      "Software craft"
    ],
    "category": "Technology",
    "readingTime": 3,
    "cover": "/images/blog/coding-agents.webp",
    "coverAlt": "Fast experimentation is useful. Shipping software adds requirements, review and responsibility that a good prompt cannot erase.",
    "body": [
      {
        "heading": "There are several kinds of AI-assisted coding",
        "text": "People use “vibe coding” to describe everything from playful prototyping to handing a large change to an agent. Those activities need different review standards. An experiment used once by its author has a different responsibility boundary from an application handling other people’s data.\n\nI prefer to name the workflow precisely: chat-based advice, IDE completion, an agent editing local files, or a cloud agent working on a branch. That tells a team where changes happen, which tools can run and what evidence is available for review."
      },
      {
        "heading": "Coding agents make the development loop explicit",
        "text": "GitHub’s cloud agent documentation describes repository research, planning and code changes on a branch, with opportunities to inspect the diff and iterate. This is broader than getting a snippet in a chat window. The agent can work through part of the development process, but the repository still needs clear instructions and an acceptance boundary.\n\nA useful assignment describes the concrete problem, desired behavior and checks that demonstrate it. “Make this premium” leaves a lot to guess. “Keep the existing routes, improve the mobile hero, preserve reduced motion and verify the build” gives the work a reviewable shape.",
        "reference": "https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent"
      },
      {
        "heading": "The fastest safe loop has a small scope",
        "text": "Start with a narrow change. Read the diff, run the relevant checks and interact with the result. Expand after the first outcome is understood. Avoid asking for unrelated refactors while fixing a bug; a large diff can make the original regression harder to identify.\n\nTests should establish behavior, not repeat the implementation in another file. For an AI comparison, check that the job’s requirements remain literal and that invalid inference produces an error. For a theme toggle, inspect startup, persistence and reduced motion in the browser. Passing compilation does not establish these behaviors.",
        "mermaid": "flowchart TD\n A[\"Concrete requirement\"] --> B[\"Agent proposes change\"]\n B --> C[\"Inspect diff and verify\"]\n C --> D[\"Accept and deliver\"]\n C --> E[\"Clarify and revise\"]\n E --> B",
        "diagramDescription": "The fastest safe loop has a small scope — Start with a narrow change. Read the diff, run the relevant checks and interact with the result. Expand after the first outcome is understood. Avoid asking for unrelated refactors while fixing a bug; a large diff can make the original regression harder to identify."
      },
      {
        "heading": "Permissions and context are part of the tool",
        "text": "An agent with repository access can see more than the file you are thinking about. Keep secrets out of committed files, define which operations are allowed and inspect dependencies before accepting them. Review an agent’s claims about tests against the actual command output.\n\nGitHub’s responsible-use guidance discusses limitations and the need to review agent-generated work. I would extend that habit to every coding tool: treat the output as a contribution that must meet your project’s standards. A confident explanation is useful only when the changed code supports it.",
        "reference": "https://docs.github.com/en/copilot/responsible-use/agents"
      },
      {
        "heading": "What I want from the future",
        "text": "I want tools that make it easier to understand a codebase, preserve completed work and turn a clear requirement into a small verified change. Fast generation is part of that, but continuity and honest failure handling matter just as much.\n\nLearn enough of the underlying stack to diagnose what the agent missed. Ask it to explain tradeoffs, then check those explanations against the code and primary documentation. Keep a recoverable version before a broad edit.\n\nAI-assisted development can lower the cost of trying an idea. Software engineering is still the work of deciding what should exist, proving that it behaves correctly and taking responsibility when it does not."
      }
    ],
    "references": [
      {
        "title": "GitHub: About Copilot cloud agent",
        "href": "https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent"
      },
      {
        "title": "GitHub: Responsible use of agents",
        "href": "https://docs.github.com/en/copilot/responsible-use/agents"
      }
    ]
  }
];
