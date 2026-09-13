import { MetadataRoute } from 'next';
import { DEPARTMENTS, DOCTORS, BLOG_POSTS } from '../data/hospitalData';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'http://localhost:3001';

  const staticRoutes = [
    '',
    '/about',
    '/departments',
    '/doctors',
    '/appointments',
    '/blog',
    '/contact',
    '/privacy-policy',
    '/terms',
    '/cookie-policy',
    '/refund-policy',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  const departmentRoutes = DEPARTMENTS.map((dept) => ({
    url: `${baseUrl}/departments/${dept.id}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }));

  const doctorRoutes = DOCTORS.map((doc) => ({
    url: `${baseUrl}/doctors/${doc.id}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }));

  const blogRoutes = BLOG_POSTS.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...departmentRoutes, ...doctorRoutes, ...blogRoutes];
}
