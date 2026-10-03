import 'server-only';
import { Matrix, SingularValueDecomposition } from 'ml-matrix';
// Small-corpus latent semantic analysis. No remote embeddings or visitor storage.
// Dense vectors capture corpus co-occurrence; this is not a pretrained encoder.
export function semanticIndex(documents:string[][]){
 const vocabulary=[...new Set(documents.flat())].sort();
 const idf=vocabulary.map(word=>Math.log(1+documents.length/(1+documents.filter(d=>d.includes(word)).length)));
 const vector=(words:string[])=>{const counts=new Map<string,number>();for(const word of words)counts.set(word,(counts.get(word)||0)+1);return vocabulary.map((word,i)=>(counts.has(word)?1+Math.log(counts.get(word)!):0)*idf[i])};
 const matrix=new Matrix(documents.map(vector));
 const svd=new SingularValueDecomposition(matrix,{autoTranspose:true});
 const k=Math.min(12,Math.max(1,documents.length-2),svd.diagonal.filter(s=>s>1e-8).length);
 const basis=svd.rightSingularVectors;
 const project=(row:number[])=>Array.from({length:k},(_,c)=>row.reduce((n,x,i)=>n+x*basis.get(i,c),0));
 const vectors=documents.map(d=>project(vector(d)));
 const cosine=(a:number[],b:number[])=>{const denominator=Math.hypot(...a)*Math.hypot(...b);return denominator?Math.max(0,a.reduce((s,x,i)=>s+x*b[i],0)/denominator):0};
 return (query:string[])=>{const q=project(vector(query));return vectors.map(v=>cosine(q,v))};
}
