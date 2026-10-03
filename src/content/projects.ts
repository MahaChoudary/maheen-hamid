import type { Diagram } from './diagrams';
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
  stack?:string[];
  diagram?:Diagram;
  evidence: {label:string;href:string}[];
};
// Add only owner-reviewed content; draft records never become public cases.
export const projects: ProjectCase[] = [{
 slug:'wukala-gpt',title:'Wukala-GPT',category:'MULTI-AGENT LEGAL AI',reviewed:true,published:true,
 summary:'Document-grounded legal assistance: retrieval, agent workflows and an AI service connected to a full-stack application.',
 problem:'Legal document questions need relevant context and a usable path through the application. Wukala-GPT connects document analysis and retrieval with legal assistance and lawyer discovery.',
 role:'I built core AI components, designed retrieval pipelines and agent workflows, connected APIs, authentication and the AI service, and tested document-grounded assistance across the architecture.',
 decisions:['Retrieval and vector search provide document context for LLM-assisted responses. The AI capability sits behind an API boundary rather than directly inside the interface.','React, ASP.NET Core and FastAPI cover the interface, application services and AI service. PostgreSQL, Qdrant and Redis are part of the listed stack.','LangGraph supports the agent workflow layer; Docker is part of the development stack. Keep document context and application permissions aligned when designing this kind of system.'],
 outcomes:'The project brings RAG, vector search, document analysis and LLM integration into one application. The available project record describes implementation and testing; it does not include public benchmark results.',
 limitations:'A public demo, product screenshots and independent performance measurements are not currently published.',
 evidence:[{label:'View Resume',href:'/resume'}],stack:['React','ASP.NET Core','FastAPI','PostgreSQL','Qdrant','Redis','LangGraph','Docker'],
 diagram:{nodes:[{id:'ui',label:'React interface'},{id:'api',label:'Application APIs + auth'},{id:'ai',label:'FastAPI + agent workflows'},{id:'data',label:'Documents + vector search'},{id:'answer',label:'Document-grounded response'}],edges:[{from:'ui',to:'api',label:'request'},{from:'api',to:'ai',label:'AI service'},{from:'ai',to:'data',label:'retrieve'},{from:'data',to:'answer',label:'context'}]}
}];
export const publishedProjects = projects.filter(project => project.reviewed && project.published);
