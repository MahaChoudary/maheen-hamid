import { capabilities, destinations, profile, resume, type Destination } from '@/content/site';
import { publishedProjects } from '@/content/projects';
import { searchPortfolio } from '@/lib/search';
export type TerminalLink = { label: string; href: string };
export type TerminalResult = { lines: string[]; links?: TerminalLink[]; action?: 'clear'|'theme'|'ask';question?:string };
export const commands = ['help','about','whoami','skills','projects','lab','experience','education','contact','resume','cv','clear','theme','open','search','ask'] as const;
const bad = (syntax: string):TerminalResult => ({lines:[`Syntax: ${syntax}`]});
const simple = (lines:string[], links?:TerminalLink[]):TerminalResult => ({lines,links});
export function executeCommand(raw: string,aiEnabled=false):TerminalResult {
  const text = raw.trim();
  if (!text || text.length > 1024) return simple(['Enter a command (up to 1,024 characters). Type help for the list.']);
  const [head = '',...parts] = text.split(/\s+/);
  const cmd = head.toLowerCase(), arg = parts.join(' ').trim();
  if (!commands.includes(cmd as typeof commands[number])) return simple(['Command not available. Type help.']);
  if (!['ask','search'].includes(cmd) && /[|;&<>`$]/.test(arg)) return simple(['Shell operators are not supported. Type help.']);
  if (!['open','search','ask'].includes(cmd) && arg) return bad(cmd);
  switch(cmd) {
    case 'help': return simple(['AVAILABLE COMMANDS','help · about · whoami · skills · projects · lab · experience · education · contact · resume · cv · clear · theme','open [destination] · search [query] · ask [question]','No real shell commands are executed.']);
    case 'about': case 'whoami': return simple(['MAHEEN HAMID',profile.headline,profile.location,profile.story],[{label:'Read About',href:'/about'}]);
    case 'skills': return simple(capabilities.map(x => `${x.title}: ${x.text}`),[{label:'Capabilities',href:'/about#capabilities'}]);
    case 'projects': return simple(
      publishedProjects.map(project => `${project.title}: ${project.summary}`),
      [...publishedProjects.map(project => ({label:`Open ${project.title}`,href:`/projects/${project.slug}`})),{label:'Open all Projects',href:'/projects'}],
    );
    case 'lab': return simple(['Systems · Mira · Tech Explainer · Resume–Job Matcher · How My AI Thinks · Portfolio Terminal'],[{label:'Explore Lab',href:'/lab'}]);
    case 'experience': return simple(['Employment history is not currently documented. Explore project work and the resume.']);
    case 'education': return simple([profile.education]);
    case 'contact': return simple([profile.email,profile.phone,profile.location],[{label:'Let’s Talk',href:'/contact'},{label:'Email Maheen',href:`mailto:${profile.email}`}]);
    case 'resume': case 'cv': return simple(['Maheen’s actual resume is available to view and download.'],[{label:'View Resume page',href:'/resume'},{label:'Open original PDF',href:resume.href}]);
    case 'clear': return {lines:[],action:'clear'};
    case 'theme': return {lines:['Appearance toggled between Light and Dark.'],action:'theme'};
    case 'open': {
      if (!arg || arg.length > 240 || !Object.prototype.hasOwnProperty.call(destinations,arg.toLowerCase())) return bad(`open ${Object.keys(destinations).join('|')}`);
      const dest = arg.toLowerCase() as Destination;
      return simple([`Destination ready: ${dest}`],[{label:`Open ${dest}`,href:destinations[dest]}]);
    }
    case 'search': {
      if (!arg || arg.length > 120) return bad('search [query up to 120 characters]');
      const matches = searchPortfolio(arg,5);
      return matches.length ? simple([`${matches.length} portfolio result${matches.length===1?'':'s'} for “${arg}”:`],matches.map(e => ({label:`${e.title} · ${e.type}`,href:e.href}))) : simple(['No matching portfolio content. Try about, systems, or contact.']);
    }
    case 'ask': return !arg || arg.length > 1000 ? bad('ask [question up to 1,000 characters]') : aiEnabled?{lines:['Question ready for Mira.'],action:'ask',question:arg.length>=2&&((arg.startsWith('"')&&arg.endsWith('"'))||(arg.startsWith("'")&&arg.endsWith("'")))?arg.slice(1,-1):arg}:simple(['Mira is currently unavailable. No question was sent.'],[{label:'Open Mira page',href:'/lab/assistant'}]);
    default: return simple(['Command not available. Type help.']);
  }
}
