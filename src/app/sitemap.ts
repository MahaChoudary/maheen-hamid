import type { MetadataRoute } from 'next';
import { destinations,writingPosts } from '@/content/site';
import { publishedProjects } from '@/content/projects';
import { siteOrigin } from '@/lib/seo';
export default function sitemap(): MetadataRoute.Sitemap {
  const origin = siteOrigin();
  if (!origin) return []; // Canonical URLs require a configured public origin.
  const routes = [...new Set(Object.values(destinations)), ...writingPosts.map(p=>`/writing/${p.slug}`), ...publishedProjects.map(project => `/projects/${project.slug}`)];
  return routes.map(path => ({ url: new URL(path, origin).href }));
}
