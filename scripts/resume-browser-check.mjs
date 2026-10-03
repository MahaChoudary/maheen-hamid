// Production checks for the actual supplied PDF and recruiter entry points.
import { spawn } from 'node:child_process';
import { readFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { contentModule } from './content-module.mjs';
const port=3334,origin=`http://127.0.0.1:${port}`;
const {resume}=await import(await contentModule('site'));
const pdfPath=resume.href;
const original=await readFile(process.env.RESUME_SOURCE_PATH||'public'+pdfPath);
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const expected=hash(original);
assert.ok(original.subarray(0,5).toString()==='%PDF-');
let log='',browser;
const server=spawn(process.execPath,['node_modules/next/dist/bin/next','start','-p',String(port),'-H','127.0.0.1'],{env:{...process.env,AI_ENABLED:'false',AI_PRIVACY_VERIFIED:'false',ALLOWED_ORIGINS:origin},stdio:'pipe'});
server.stdout.on('data',d=>log+=d);server.stderr.on('data',d=>log+=d);
try{
 let ready=false;for(let i=0;i<100;i++){try{if((await fetch(origin)).ok){ready=true;break}}catch{}await new Promise(r=>setTimeout(r,300))}assert.ok(ready,log);
 const asset=await fetch(origin+pdfPath);assert.equal(asset.status,200);assert.match(asset.headers.get('content-type'),/application\/pdf/);assert.equal(asset.headers.get('content-disposition'),'inline');assert.equal(asset.headers.get('x-frame-options'),'SAMEORIGIN');assert.match(asset.headers.get('content-security-policy'),/frame-ancestors 'self'/);assert.equal(hash(Buffer.from(await asset.arrayBuffer())),expected);
 assert.equal(hash(await readFile('public'+pdfPath)),expected);console.log('OK public asset = supplied original, PDF MIME/inline/same-origin headers, exact SHA256:',expected);
 const launch={headless:true,args:['--no-sandbox']};if(process.env.CHROMIUM_MODULE_PATH){const binary=(await import(process.env.CHROMIUM_MODULE_PATH)).default;launch.executablePath=await binary.executablePath();launch.args.push(...(binary.args||[]));launch.args.push('--disable-dev-shm-usage','--use-gl=angle','--use-angle=swiftshader')}
 browser=await chromium.launch(launch);const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce',acceptDownloads:true});const page=await context.newPage();page.setDefaultTimeout(15000);const errors=[];page.on('console',message=>{if(message.type()==='error')console.log('Browser diagnostic:',message.text())});page.on('pageerror',e=>errors.push(e.message));
 const audit=async(label)=>{const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();assert.deepEqual(result.violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)})),[],label)};
 await mkdir('preview',{recursive:true});
 assert.equal((await page.goto(origin+'/resume')).status(),200);await page.locator('h1').waitFor();
 const view=page.getByRole('link',{name:/^View Resume/}).first();assert.equal(await view.getAttribute('href'),'/resume/view');assert.equal(await view.getAttribute('target'),'_blank');
 await page.locator('.resume-inline-preview').scrollIntoViewIfNeeded();await page.locator('.pdf-canvas-host canvas').waitFor();await page.getByRole('status').getByText('Page 1 of 1 · Original PDF',{exact:true}).waitFor();
 const pixels=await page.locator('canvas').evaluate(canvas=>{const context=canvas.getContext('2d');const data=context.getImageData(0,0,canvas.width,canvas.height).data;let dark=0;for(let i=0;i<data.length;i+=4)if(data[i]<100&&data[i+1]<100&&data[i+2]<100&&data[i+3]>0)dark++;return dark});assert.ok(pixels>1000,'Actual document text is painted, not a blank preview');
 await page.getByText('Read page 1 as text',{exact:true}).click();await page.locator('.pdf-text-alternative p').getByText(/Maheen Hamid/).waitFor();await page.getByText('Read page 1 as text',{exact:true}).click();
 const popupEvent=page.waitForEvent('popup');await view.click();const popup=await popupEvent;await popup.waitForURL('**/resume/view');await popup.locator('canvas').waitFor();await popup.getByRole('status').getByText('1 of 1 page · Original PDF',{exact:true}).waitFor();assert.equal(await popup.getByRole('link',{name:'Download PDF',exact:true}).getAttribute('href'),pdfPath);await popup.close();
 const downloadEvent=page.waitForEvent('download');await page.getByRole('link',{name:'Download PDF',exact:true}).click();const download=await downloadEvent;assert.equal(download.suggestedFilename(),resume.fileName);assert.equal(hash(await readFile(await download.path())),expected);console.log('OK /resume, actual PDF canvas/text preview and new-tab viewer and byte-identical browser Download');
 await audit('Resume desktop');await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:'preview/resume-desktop.png',fullPage:true});
 const nav=page.getByRole('navigation',{name:'Primary',exact:true}),work=nav.getByRole('button',{name:'Work',exact:true});
 await work.click();await nav.getByRole('link',{name:/^Resume/}).waitFor();await page.keyboard.press('Escape');assert.equal(await work.getAttribute('aria-expanded'),'false');assert.equal(await work.evaluate(el=>el===document.activeElement),true);
 await work.focus();await page.keyboard.press('ArrowDown');await page.waitForFunction(()=>document.activeElement?.getAttribute('href')==='/projects');assert.equal(await nav.getByRole('link',{name:/^Projects/}).evaluate(el=>el===document.activeElement),true);await page.keyboard.press('Escape');
 await page.locator('h1').hover();await work.hover();await nav.getByRole('link',{name:/^Resume/}).waitFor();await page.locator('h1').click();assert.equal(await work.getAttribute('aria-expanded'),'false');
 await work.click();await nav.getByRole('link',{name:/^Resume/}).click();assert.ok(page.url().endsWith('/resume'));await audit('Work navigation closed');
 assert.equal(await page.locator('footer').getByRole('link',{name:'Resume',exact:true}).getAttribute('href'),'/resume');
 await page.goto(origin+'/hire-me');assert.equal(await page.getByRole('link',{name:/^View Resume(?:\s*↗)?$/}).getAttribute('href'),'/resume');await audit('Hire Me desktop');
 await page.goto(origin+'/');assert.equal(await page.locator('.hero').getByRole('link',{name:'View Resume',exact:true}).getAttribute('href'),'/resume');
 await page.getByRole('button',{name:'Open portfolio search'}).click();await page.getByRole('combobox').fill('resume');await page.getByRole('option').filter({has:page.locator('strong',{hasText:/^Resume$/})}).first().waitFor();await page.keyboard.press('Escape');
 await page.goto(origin+'/lab/terminal');await page.getByRole('textbox',{name:'Enter a predefined portfolio command'}).fill('resume');await page.getByRole('button',{name:'Run command'}).click();await page.getByRole('log',{name:'Command results'}).getByRole('link',{name:'View Resume page'}).waitFor();console.log('OK Work hover/click/keyboard/ESC/outside click, footer, Hire Me, Home, search and CLI');
 for(const width of [320,390,768]){
  await page.setViewportSize({width,height:844});for(const path of ['/resume','/resume/view','/hire-me']){assert.equal((await page.goto(origin+path)).status(),200);if(path==='/resume/view'){await page.locator('canvas').waitFor();await page.getByRole('status').getByText('1 of 1 page · Original PDF',{exact:true}).waitFor()}assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)<=2,`${path} ${width}px overflow`);await audit(path+' '+width);}
  if(width===390){await page.goto(origin+'/resume');assert.equal(await page.locator('.resume-inline-preview').isVisible(),false);assert.equal(await page.locator('.resume-preview-fallback').isVisible(),true);await page.getByRole('button',{name:'Open menu'}).click();const mobile=page.getByRole('navigation',{name:'Mobile primary',exact:true});await mobile.getByRole('button',{name:'Work',exact:true}).click();await mobile.getByRole('link',{name:/^Resume/}).click();assert.equal(await page.getByRole('dialog',{name:'Navigation menu'}).count(),0);await page.screenshot({path:'preview/resume-mobile.png',fullPage:true});const d=page.waitForEvent('download');await page.getByRole('link',{name:'Download PDF',exact:true}).click();assert.equal(hash(await readFile(await (await d).path())),expected);}
 }
 const noJs=await browser.newPage({javaScriptEnabled:false,viewport:{width:390,height:844}});await noJs.goto(origin+'/resume');assert.equal(await noJs.getByRole('link',{name:'Download PDF',exact:true}).getAttribute('href'),pdfPath);await noJs.close();
 assert.deepEqual(errors,[]);console.log('PASS resume production asset/view/download, mobile, no-JS actions, entry points and axe checks');
}finally{await browser?.close();server.kill('SIGTERM')}
