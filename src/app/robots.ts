import type { MetadataRoute } from 'next';
import { siteOrigin } from '@/lib/seo';
export default function robots(): MetadataRoute.Robots {
  const origin = siteOrigin();
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/projects/preview'] },
    ...(origin ? { sitemap: new URL('/sitemap.xml', origin).href } : {}),
  };
}
