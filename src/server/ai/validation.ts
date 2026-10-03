import 'server-only';
import { z } from 'zod';
import { safeDiagram } from '@/features/explainer/diagram-safety';
import { fallbackDiagram, repairDiagram } from '@/features/explainer/diagram-recovery';
import { resume } from '@/content/site';
import type { Source, Evidence, AiResult, MatchRow } from '@/features/ai/contracts';
import { assistantOutput } from './payloads';
import { contentVersion, evidenceFor } from './retrieval';

const limits = {
  cv_missing: 'Additional resume details are not documented.',
  projects_missing: 'Further project details are not published.',
  experience_unknown: 'Employment history and years of experience are not documented.',
  relocation_unknown: 'Relocation and work authorization are not confirmed.',
  owner_stated_capabilities: 'Documented skills do not establish professional tenure or project results.',
};

export class AssistantValidationError extends Error {
  constructor(public code: string) { super(code); this.name = 'AssistantValidationError'; }
}
const reject = (code: string): never => { throw new AssistantValidationError(code); };

export function checkedEvidence(records: { sourceId: string; quote: string }[], selected: Source[]): Evidence[] {
  const ids = new Set(records.map(r => r.sourceId));
  return evidenceFor(selected.filter(s => s.public && ids.has(s.id)));
}

function checkAssistantFacts(text: string, evidence: Evidence[]) {
  const support = evidence.map(e => e.source.text).join(' ').toLowerCase();
  const sentences = text.split(/(?<=[!?])\s+|(?<=\.)\s+(?=[A-Z])/);
  const hardFacts = [
    /\b(?:served|consulted for|has|worked with)\s+(?:paying |paid |enterprise |commercial )?clients?\b[^,.;!?]*/gi,
    /\b(?:work(?:ed|s|ing)?|employed|employment|intern(?:ed|ship)?)\s+(?:at|for|with)\s+[^,.;!?]+/gi,
    /\b(?:\d+(?:\.\d+)?|one|two|three|four|five|six|seven|eight|nine|ten|twenty)\s*\+?\s*(?:years?|months?)\b[^,.;!?]*/gi,
    /\b(?:salary|salaried|compensation|earnings?|paid clients?|certif(?:ied|icate|ication)s?|awards?|award-winning|revenue|employers?|senior|expert|professional experience|production experience|production deployment|commercial experience|leadership experience)\b[^,.;!?]*/gi,
    /(?:[$€£]\s*\d[\d,.]*|\b\d[\d,.]*\s*(?:%|percent|users?|clients?|customers?|dollars?|PKR|USD)\b)/gi,
  ];
  const boundary = /\b(?:not documented|not confirmed|not established|not evidenced|not verified|not inferred|not proof|no (?:approved |documented |confirmed )?(?:evidence|information|record|proof)|does not (?:establish|prove|confirm)|unknown|unconfirmed|undocumented)\b/i;

  for (const sentence of sentences) for (const clause of sentence.split(/\b(?:but|however|although|yet)\b|;/i)) {
    for (const pattern of hardFacts) for (const match of clause.matchAll(pattern)) {
      const prefix = clause.slice(0, match.index);
      const negative = boundary.test(clause) && (!/\b(?:has|holds|earned|won|achieved|worked|employed|served|led|is (?:an?|the))\b/i.test(prefix) || /\b(?:not|never)\s+(?:worked|employed|served)\b/i.test(prefix));
      if (!negative && !support.includes(match[0].toLowerCase().trim())) reject('UNSUPPORTED_HARD_FACT');
    }

    if (!boundary.test(clause) && /\b(?:age|gender|female|male|nationality|citizenship|religio\w*|ethnic\w*|race|marital|family|health|pregnan\w*|disabil\w*)\b/i.test(clause)) reject('PROTECTED_TRAIT');

    for (const [tech, qualifier] of [['Redis','familiar'],['reranking','concept'],['hallucination','awareness']]) {
      if (!clause.toLowerCase().includes(tech.toLowerCase())) continue;
      const qualified = evidence.some(e => e.source.text.toLowerCase().includes(tech.toLowerCase()) && /familiarity|concepts|awareness/i.test(e.source.text));
      const upgrade = /\b(?:advanced|expert|proficien\w*|extensive|professional|production|master\w*|specialist)\b/i.test(clause);
      if (qualified && upgrade && !clause.toLowerCase().includes(qualifier) && !boundary.test(clause)) reject('LOST_QUALIFIER');
    }
  }
}

export function validateAssistant(payload: unknown, selected: Source[], intent = 'portfolio'): AiResult {
  const parsed = assistantOutput.safeParse(payload);
  if (!parsed.success) reject('INVALID_SCHEMA');

  const data = parsed.data as z.infer<typeof assistantOutput>;
  const supported = data.status === 'supported' || data.status === 'partial';
  const ids = new Set(data.claims.flatMap(c => c.sourceIds));
  let cited = selected.filter(s => s.public && ids.has(s.id));

  if (supported && intent === 'portfolio' && !cited.length) cited = selected.filter(s => s.public);

  if (supported && intent === 'portfolio' && !cited.length) {
    const answer = 'That information is not documented in this portfolio.';
    return { kind:'assistant', status:'insufficient_evidence', mode:'ai', answer, summary:answer, evidence:[], limitations:[], scope:'Reviewed CV + public portfolio', contentVersion };
  }

  const evidence = evidenceFor(cited);

  if (supported) {
    const personal = intent === 'portfolio' ? data.answer : data.answer.split(/(?<=[.!?])\s+/).filter(s => /\b(?:Maheen|she|her|Wukala)\b/i.test(s)).join(' ');
    checkAssistantFacts(personal, evidence);

    for (const claim of data.claims) {
      const own = cited.filter(s => claim.sourceIds.includes(s.id));
      checkAssistantFacts(claim.text, evidenceFor(own.length ? own : cited));
    }
  }

  const answer = supported ? data.answer : data.status === 'out_of_scope'
    ? 'I can help with portfolio questions and software engineering topics.'
    : 'That information is not documented in this portfolio.';

  return {
    kind:'assistant',
    status:data.status === 'not_documented' ? 'insufficient_evidence' : data.status,
    mode:'ai', answer, summary:answer, evidence,
    limitations:data.limitations.map(k => limits[k]),
    scope:'Reviewed CV + public portfolio', contentVersion
  };
}

const protectedRequirement = /\b(ages?|genders?|females?|males?|nationalit\w*|citizenship|religio\w*|race|ethnic\w*|marital|family|pregnan\w*|disabil\w*|health)\b/i;
const tenure = /\b(\d+\s*\+?\s*(years?|months?)|senior|expert|production|deployed|commercial|professional|experience|employment|leadership|manager|management|certif|salary|visa|relocation|authorization)\b/i;
const matcherRequirement = z.object({
  quote:z.string().trim().min(1).max(1000),
  priority:z.enum(['required','preferred','unspecified']).default('unspecified'),
  category:z.enum(['supported','partially_supported','not_evidenced','needs_clarification','not_assessed']).default('needs_clarification'),
  explanation:z.string().trim().min(1).max(500).default('The portfolio does not currently provide enough evidence for this requirement.'),
  evidence:z.array(z.object({sourceId:z.string().min(1).max(100),quote:z.string().min(1).max(2500)}).strict()).max(3).default([]),
}).passthrough();
const matcherEnvelope = z.record(z.string(),z.unknown());
function safeMatcherText(text:string, fallback:string):string {
  const safe=text.split(/(?<=[.!?])\s+/).map(sentence=>sentence.trim()).filter(Boolean).filter(sentence=>{
    if(!/\b(?:Maheen|she|her|Wukala)\b/i.test(sentence)) return true;
    try { checkAssistantFacts(sentence, evidenceFor([])); return true; }
    catch { return false; }
  });
  return safe.join(' ')||fallback;
}

export function validateMatcher(payload: unknown, selected: Source[], job: string): AiResult {
  const raw = matcherEnvelope.parse(payload);
  const jobRequirements = job.split(/\r?\n|(?<=[.!?])\s+/).map(text=>text.trim()).filter(Boolean).slice(0,12);
  const rawRequirements = Array.isArray(raw.requirements) ? raw.requirements : [];
  const parsedRequirements = rawRequirements.flatMap(item => {
    const parsed = matcherRequirement.safeParse(item);
    return parsed.success ? [parsed.data] : [];
  });
  const normalizedRequirements = parsedRequirements.length ? parsedRequirements : jobRequirements.map(quote=>({
    quote, priority:'unspecified' as const, category:'needs_clarification' as const,
    explanation:'The provider did not return a verifiable comparison for this requirement.',
    evidence:[],
  }));
  if (!normalizedRequirements.length) reject('INVALID_MATCHER_OUTPUT');
  const envelope = {
    roleSnapshot:typeof raw.roleSnapshot==='string'&&raw.roleSnapshot.trim()?raw.roleSnapshot:'This role combines technical skills with practical delivery requirements.',
    actions:Array.isArray(raw.actions)&&raw.actions.every(action=>typeof action==='string')?raw.actions.filter(Boolean).slice(0,4):['Review one documented project example for each requirement.'],
    requirements:normalizedRequirements,
    incomplete:raw.incomplete===true||normalizedRequirements.length<rawRequirements.length||parsedRequirements.length===0,
    unassessed:Array.isArray(raw.unassessed)?raw.unassessed.filter((quote):quote is string=>typeof quote==='string').slice(0,20):[],
  };
  const data = envelope;

  const { requirements, roleSnapshot: rawRoleSnapshot, actions: rawActions } = data;
  const rows: MatchRow[] = requirements.map(item => {
    let category = item.category;

    if (protectedRequirement.test(item.quote) || category === 'not_assessed')
      return { requirement:item.quote, category:'not_assessed', evidence:[], explanation:'This requirement is outside the scope of the portfolio comparison.' };

    const evidence = checkedEvidence(item.evidence, selected);

    if (category === 'supported' || category === 'partially_supported') {
      if (!evidence.length) category = 'not_evidenced';
      else if (tenure.test(item.quote)) category = 'partially_supported';
    }

    if (category === 'not_evidenced' || category === 'needs_clarification')
      return { requirement:item.quote, category, evidence:[], explanation:safeMatcherText(item.explanation,'The portfolio does not currently provide enough evidence for this requirement.') };

    return { requirement:item.quote, category, evidence, explanation:safeMatcherText(item.explanation,'Related documented skills or project evidence may support this requirement.') };
  });

  const unassessed = [...new Set(data.unassessed)];
  const incomplete = data.incomplete || parsedRequirements.length < envelope.requirements.length || unassessed.length > 0 || job.split('\n').filter(l => /^\s*(?:[-*•]|\d+[.)])\s*\S/.test(l)).length > 12;

  if (/[0-9]+\s*%|\b(?:hire her|recommend hiring|perfect candidate)\b/i.test(`${rawRoleSnapshot} ${rawActions.join(' ')}`))
    reject('HIRING_VERDICT');

  const roleSnapshot = safeMatcherText(rawRoleSnapshot,'This role combines technical skills with practical delivery requirements.');
  const actions = rawActions.map(action=>safeMatcherText(action,'Review one documented project example for this requirement.'));

  return {
    kind:'match', status:'partial', mode:'ai',
    roleSnapshot, actions,
    summary:`${rows.filter(r => r.category === 'supported').length} strong matches, ${rows.filter(r => r.category === 'partially_supported').length} partial matches, and ${rows.filter(r => r.category === 'not_evidenced' || r.category === 'needs_clarification').length} areas needing more evidence.`,
    rows, evidence:[],
    limitations:incomplete ? ['Some requirements may need further review.'] : [],
    scope:resume.comparisonScope, contentVersion, incomplete, unassessed
  };
}

const explanationText = z.object({
  title:z.string().trim().min(1).max(240).optional(),
  overview:z.string().trim().min(1).max(6000),
  steps:z.array(z.object({ title:z.string().trim().min(1).max(240), detail:z.string().trim().min(1).max(2000) })).max(12).optional(),
  example:z.string().trim().max(3000).optional(),
  pitfalls:z.array(z.string().trim().min(1).max(1000)).max(10).optional(),
  takeaway:z.string().trim().max(1500).optional(),
  mermaid:z.string().max(12000).nullable().optional(),
  diagramDescription:z.string().trim().max(1500).optional()
});

export function validateExplanation(payload: unknown, topic = 'Technical explanation'): AiResult {
  const text = explanationText.parse(payload), steps = text.steps || [];
  const repaired = repairDiagram(text.mermaid || '');
  const mermaid = safeDiagram(repaired) ? repaired : fallbackDiagram(steps, text.title || topic);
  const data = {
    title:text.title || topic, overview:text.overview, steps,
    example:text.example || '', pitfalls:text.pitfalls || [],
    takeaway:text.takeaway || '', mermaid,
    diagramDescription:text.diagramDescription || steps.map(s => `${s.title}: ${s.detail}`).join(' ') || text.overview
  };

  return { kind:'explain', status:'supported', mode:'ai', summary:data.overview, explanation:data, evidence:[], limitations:[], scope:'Technical education', contentVersion };
}