'use client';
import { useRef } from 'react';
import { useAnimationGate } from '@/hooks/useAnimationGate';
export function Atmosphere(){const ref=useRef<HTMLDivElement>(null);const {allowed}=useAnimationGate(ref);return <div ref={ref} className="technical-atmosphere" aria-hidden="true" data-running={allowed}><div className="atmosphere-grid"/><div className="atmosphere-orbit orbit-one"/><div className="atmosphere-orbit orbit-two"/><svg className="atmosphere-paths" viewBox="0 0 1440 1000" preserveAspectRatio="xMidYMid slice"><path d="M-50 210 H240 L340 310 H800 L900 410 H1490"/><path d="M-50 680 H390 L500 570 H1080 L1190 460 H1490"/><path d="M250 -20 V210 L360 320 V650 L480 770 V1020"/></svg><div className="atmosphere-pulse"/></div>}
