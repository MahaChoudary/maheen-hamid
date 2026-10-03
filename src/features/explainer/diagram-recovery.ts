// Build a safe diagram from the already generated explanation when its artwork
// is missing or malformed. Text survives independently of diagram rendering.
function label(text:string){return text.replace(/[<>\[\]{}|`\"\\\n\r]/g,' ').replace(/\s+/g,' ').trim().slice(0,80)||'Concept'}
export function fallbackDiagram(steps:{title:string}[],title:string){
 const items=steps.length?steps.slice(0,6).map(s=>s.title):[title,'Understand the idea','Apply it thoughtfully'];
 return 'flowchart TD\n'+items.map((s,i)=>` N${i}["${label(s)}"]`).join('\n')+'\n'+items.slice(1).map((_,i)=>` N${i} --> N${i+1}`).join('\n');
}
export function repairDiagram(input:string){
 const text=input.trim().replace(/^```(?:mermaid)?\s*\n?/i,'').replace(/\n?```$/,'').replace(/^graph (TD|TB|LR)/,'flowchart $1');
 // Unbalanced labels are not sent to Mermaid. Runtime parsing handles the rest.
 if((text.match(/\[/g)||[]).length!==(text.match(/\]/g)||[]).length||(text.match(/"/g)||[]).length%2)return '';
 return text;
}
