'use client';
import { useEffect, useState, useSyncExternalStore, type RefObject } from 'react';
import { useView } from '@/components/Shell';
const subscribeMotion = (notify:()=>void) => {
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  media.addEventListener('change', notify);
  return () => media.removeEventListener('change', notify);
};
const subscribeVisibility = (notify:()=>void) => {
  document.addEventListener('visibilitychange', notify);
  return () => document.removeEventListener('visibilitychange', notify);
};
export function useAnimationGate(ref: RefObject<HTMLElement|null>) {
  const { motionPaused } = useView();
  const reduced = useSyncExternalStore(subscribeMotion, () => window.matchMedia('(prefers-reduced-motion: reduce)').matches, () => true);
  const hidden = useSyncExternalStore(subscribeVisibility, () => document.hidden, () => false);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref]);
  return { reduced, allowed: visible && !hidden && !motionPaused && !reduced };
}
