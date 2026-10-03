import { mkdir, writeFile, copyFile, cp } from 'node:fs/promises';
import ts from 'typescript';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { contentModule } from './content-module.mjs';
const {searchEntries,resume,writingPosts}=await import(await contentModule('site'));
const slugs=new Set();
for(const post of writingPosts){if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.slug)||slugs.has(post.slug)||!Number.isFinite(Date.parse(post.publishDate))||post.readingTime<1||!post.body.length)throw Error('Invalid published writing record');slugs.add(post.slug);}
// Fail the build on a missing/misnamed PDF rather than publishing broken actions.
if(!/^\/documents\/[a-z0-9-]+\.pdf$/.test(resume.href)||!resume.href.endsWith('/'+resume.fileName))throw Error('Invalid public resume filename');
const resumeBytes=await readFile(new URL('../public'+resume.href,import.meta.url));
if(resumeBytes.subarray(0,5).toString()!=='%PDF-')throw Error('Resume asset must be an actual PDF');
// Same-origin PDF.js worker/resources. No CDN and no PDF converted to image assets.
const viewerDir=new URL('../public/pdfjs/',import.meta.url);await mkdir(viewerDir,{recursive:true});
await copyFile(new URL('../node_modules/pdfjs-dist/build/pdf.worker.min.mjs',import.meta.url),new URL('pdf.worker.min.mjs',viewerDir));
for(const folder of ['cmaps','standard_fonts','wasm'])await cp(new URL('../node_modules/pdfjs-dist/'+folder,import.meta.url),new URL(folder,viewerDir),{recursive:true});
await copyFile(new URL('../node_modules/pdfjs-dist/LICENSE',import.meta.url),new URL('LICENSE',viewerDir));
// Read authored public page text without executing page components or indexing
// development project fixtures. Profile interpolations come from the typed entries.
function publishedText(source, name) {
  const file = ts.createSourceFile(name, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const text = [];
  function visit(node) {
    if (ts.isJsxText(node)) text.push(node.text.trim());
    if (ts.isJsxAttribute(node) && ['title','accent','description','label','placeholder'].includes(node.name.getText(file)) && node.initializer && ts.isStringLiteral(node.initializer)) text.push(node.initializer.text);
    if (ts.isPropertyAssignment(node) && ['title','detail','input','output'].includes(node.name.getText(file)) && ts.isStringLiteral(node.initializer)) text.push(node.initializer.text);
    ts.forEachChild(node, visit);
  }
  visit(file);
  return text.filter(Boolean).join(' ').replace(/\s+/g,' ');
}
const explanations = {
  '/lab/systems': 'src/features/lab/SystemFlow.tsx',
  '/lab/how-it-works': 'src/features/lab/WorkflowDemo.tsx',
};
for (const entry of searchEntries) {
  if(['ARTICLE','PROJECT'].includes(entry.type))continue; // Typed published article body is already indexed.
  const route = entry.href.split('#')[0].split('?')[0];
  const path = `src/app${route==='/'?'':route}/page.tsx`;
  const files = [path, explanations[route]].filter(Boolean);
  const body = await Promise.all(files.map(async file => publishedText(await readFile(new URL('../'+file,import.meta.url),'utf8'),file)));
  entry.body = [entry.body, ...body].join(' ');
}
const {knowledgeSources}=await import(await contentModule('knowledge'));
const ids=new Set();
for(const source of knowledgeSources){
 if(ids.has(source.id)||!source.public||!source.text.trim()||!source.href.startsWith('/')||source.href.startsWith('//')||source.id.includes('preview'))throw Error('Invalid public source record');
 ids.add(source.id);
 const [route,anchor]=source.href.split('#');
 if(anchor){const page=await readFile(new URL(`../src/app${route}/page.tsx`,import.meta.url),'utf8');if(!page.includes(`id="${anchor}"`))throw Error(`Missing evidence anchor: ${source.href}`);}
}
const contentVersion=createHash('sha256').update(JSON.stringify({searchEntries,knowledgeSources})).digest('hex').slice(0,16);
for(const entry of searchEntries)entry.contentVersion=contentVersion;
const data = JSON.stringify(searchEntries);
await mkdir(new URL('../src/generated/',import.meta.url),{recursive:true});
await Promise.all([
  writeFile(new URL('../public/search-index.json', import.meta.url), data),
  writeFile(new URL('../src/generated/search-index.json', import.meta.url), data),
  writeFile(new URL('../src/generated/knowledge.json',import.meta.url),JSON.stringify({contentVersion,sources:knowledgeSources.map(source=>({...source,contentVersion}))})),
  writeFile(new URL('../public/content-version.json',import.meta.url),JSON.stringify({contentVersion})),
]);
console.log(`Generated local index: ${searchEntries.length} published entries.`);
