// Model output is data, never executable configuration or a navigation action.
export function safeDiagram(source:string):boolean {
 const value=source.trim();
 // Reserved action words inside a quoted text label are harmless (for example
 // "Click handler" or "Configuration"). Check syntax outside those labels.
 const syntax=value.replace(/"(?:\\.|[^"\\])*"/g,'""');
 return value.length<=6000 && value.split('\n').length<=45 && /^(?:flowchart (?:TD|TB|LR)|sequenceDiagram)\s*(?:\r?\n|$)/.test(value)
  && !/(?:%%|---\s*\n|<\/?[a-z]|javascript:|data:|https?:|@\{|`)/i.test(value)
  && !/\b(?:click|href|callback|classDef|style|linkStyle|init|config|accDescr)\b/i.test(syntax);
}
