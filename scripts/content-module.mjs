// Load typed central content for build and browser checks without changing runtime imports.
import ts from 'typescript';
import { readFile } from 'node:fs/promises';
const cache=new Map();
export async function contentModule(name){
 if(!/^[a-z-]+$/.test(name))throw Error('Invalid content module');
 if(cache.has(name))return cache.get(name);
 const source=await readFile(new URL(`../src/content/${name}.ts`,import.meta.url),'utf8');
 let output=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext}}).outputText;
 const imports=[...output.matchAll(/(?:from\s*|import\s*)["']\.\/([a-z-]+)["']/g)];
 for(const match of imports){const uri=await contentModule(match[1]);output=output.replaceAll(`'./${match[1]}'`,JSON.stringify(uri)).replaceAll(`"./${match[1]}"`,JSON.stringify(uri));}
 const uri=`data:text/javascript;base64,${Buffer.from(output).toString('base64')}`;cache.set(name,uri);return uri;
}
