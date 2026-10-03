'use client';
import { useRef } from 'react';
import { useAnimationGate } from '@/hooks/useAnimationGate';
export function AmbientBand(){
  const ref = useRef<HTMLDivElement>(null);
  const { allowed } = useAnimationGate(ref);
  return <div ref={ref} className="marquee-band" aria-label="AI reasoning, full-stack engineering, intelligent systems"><div style={{animationPlayState:allowed?'running':'paused'}}>REASON <span>✦</span> RETRIEVE <span>✦</span> BUILD <span>✦</span> EVALUATE <span>✦</span> REASON <span>✦</span> RETRIEVE <span>✦</span> BUILD <span>✦</span> EVALUATE</div></div>;
}
