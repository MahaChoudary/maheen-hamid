'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowUpRight, Search, X } from 'lucide-react';
import { nav, type SearchEntry } from '@/content/site';
import { excerptFor, searchPortfolio } from '@/lib/search';

function HighlightedExcerpt({text,query}:{text:string;query:string}) {
  const words=[...new Set(query.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu,' ').split(/\s+/).filter(Boolean))].slice(0,8);
  if(!words.length)return <>{text}</>;
  return <>{text.split(new RegExp(`(${words.join('|')})`,'gi')).map((part,i)=>words.includes(part.toLowerCase())?<mark key={i}>{part}</mark>:part)}</>;
}

export function SearchDialog({onClose}:{onClose:()=>void}) {
  const router=useRouter();
  const [query,setQuery]=useState(''),[debounced,setDebounced]=useState('');
  const [active,setActive]=useState(0),[index,setIndex]=useState<SearchEntry[]>([]);
  const [status,setStatus]=useState<'loading'|'ready'|'error'>('loading');
  const [attempt,setAttempt]=useState(0);
  const input=useRef<HTMLInputElement>(null);
  useEffect(()=>{input.current?.focus()},[]);
  useEffect(()=>{
    const id=window.setTimeout(()=>setDebounced(query),100);
    return()=>window.clearTimeout(id);
  },[query]);
  useEffect(()=>{
    const controller=new AbortController();let disposed=false;
    const timeout=window.setTimeout(()=>controller.abort(),5000);
    fetch('/search-index.json',{signal:controller.signal}).then(async response=>{
      if(!response.ok)throw new Error('Index unavailable');
      const data:unknown=await response.json();
      if(!Array.isArray(data)||!data.every(item=>item&&['title','type','href','body','tags'].every(k=>typeof item[k]==='string')&&item.href.startsWith('/')&&!item.href.startsWith('//')))throw new Error('Invalid index');
      if(!disposed){setIndex(data as SearchEntry[]);setStatus('ready');}
    }).catch(()=>{if(!disposed)setStatus('error')}).finally(()=>window.clearTimeout(timeout));
    return()=>{disposed=true;controller.abort();window.clearTimeout(timeout)};
  },[attempt]);
  const results=status==='ready'?searchPortfolio(debounced,10,index):[];
  const selected=Math.min(active,Math.max(0,results.length-1));
  function retry(){setStatus('loading');setAttempt(n=>n+1)}
  return <div className="overlay" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}>
    <section className="search-panel" role="dialog" aria-modal="true" aria-labelledby="search-title">
      <header className="panel-heading"><div><span className="eyebrow">PORTFOLIO INDEX / 01</span><h2 id="search-title">Find in Maheen’s portfolio</h2></div><button className="icon-button" onClick={onClose} aria-label="Close search"><X size={19}/></button></header>
      <label className="search-field-label" htmlFor="portfolio-query">Search published portfolio content</label>
      <div className="search-input-wrap"><Search size={22}/><input id="portfolio-query" ref={input} value={query} onChange={e=>{setQuery(e.target.value.slice(0,120));setActive(0)}} placeholder="Search systems, skills, projects..." role="combobox" aria-autocomplete="list" aria-expanded={results.length>0} aria-controls="search-results" aria-activedescendant={results.length?`search-option-${selected}`:undefined} onKeyDown={e=>{
        if(e.key==='ArrowDown'){e.preventDefault();setActive((selected+1)%Math.max(results.length,1))}
        if(e.key==='ArrowUp'){e.preventDefault();setActive((selected-1+results.length)%Math.max(results.length,1))}
        if(e.key==='Enter'&&results[selected]){e.preventDefault();router.push(results[selected].href);onClose()}
      }}/><kbd>ESC</kbd></div>
      <div className="search-result-meta" aria-live="polite">{status==='loading'?'LOADING LOCAL INDEX':status==='error'?'INDEX UNAVAILABLE':query?`${results.length} result${results.length===1?'':'s'}`:'QUICK DESTINATIONS'}<span>LOCAL INDEX · NO AI CALL</span></div>
      {status==='ready'?<div className="search-results" id="search-results" role="listbox" aria-label="Portfolio results">
        {results.length?results.map((entry,i)=><Link role="option" aria-selected={i===selected} id={`search-option-${i}`} key={`${entry.href}-${entry.title}`} className={`search-result ${i===selected?'selected':''}`} href={entry.href} onMouseEnter={()=>setActive(i)} onClick={onClose}><span className="result-icon">{String(i+1).padStart(2,'0')}</span><span className="result-content"><strong>{entry.title}</strong><small><HighlightedExcerpt text={excerptFor(entry,debounced)} query={debounced}/></small></span><span className="result-type">{entry.type}</span><ArrowUpRight size={16}/></Link>):<div className="search-empty"><strong>No matching portfolio content.</strong><p>Try “RAG”, “skills” or “contact”.</p><button className="text-button" onClick={()=>{setQuery('');setActive(0);input.current?.focus()}}>Clear search ↗</button></div>}
      </div>:<div className="search-empty" id="search-results"><strong>{status==='loading'?'Loading portfolio search…':'Search index unavailable.'}</strong><p>Every page is still available through these destinations.</p><div className="search-directory">{nav.map(item=><Link key={item.href} href={item.href} onClick={onClose}>{item.label} ↗</Link>)}</div>{status==='error'&&<button className="text-button" onClick={retry}>Retry search ↗</button>}</div>}
      <footer className="panel-footnote"><span>↑ ↓ Navigate &nbsp; ↵ Open</span><span>Published content only</span></footer>
    </section>
  </div>;
}
