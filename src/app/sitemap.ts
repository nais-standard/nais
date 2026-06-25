import type { MetadataRoute } from 'next';

const BASE = 'https://nais.id';

// Static export: emitted as /sitemap.xml at build time.
export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
    { path: '/', priority: 1.0, changeFrequency: 'weekly' },
    { path: '/spec', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/quickstart', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/sdks', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/validate', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/validator', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/examples', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/demo', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/faq', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/governance', priority: 0.5, changeFrequency: 'monthly' },
  ];

  // trailingSlash: true in next.config — match canonical URLs (e.g. /sdks/).
  return routes.map(({ path, priority, changeFrequency }) => ({
    url: path === '/' ? `${BASE}/` : `${BASE}${path}/`,
    changeFrequency,
    priority,
  }));
}
