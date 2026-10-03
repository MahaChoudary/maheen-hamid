import type { Metadata } from 'next';

// A production origin is optional during frontend review. Never invent a domain.
export function siteOrigin(): URL | undefined {
  const value = process.env.SITE_URL?.trim();
  if (!value) return undefined;
  const url = new URL(value);
  if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password || url.pathname !== '/' || url.search || url.hash) {
    throw new Error('SITE_URL must be an HTTP(S) origin without credentials, path, query or fragment.');
  }
  return url;
}
export function canonicalFor(path: string): Metadata {
  const origin = siteOrigin();
  return origin ? { alternates: { canonical: new URL(path, origin) } } : {};
}
