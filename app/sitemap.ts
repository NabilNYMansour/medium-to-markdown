import { MetadataRoute } from 'next'
import { fetchArticlesSlugs, fetchProjectsLinks } from '@/lib/data'

const MAIN_URL = process.env.MAIN_URL;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articlesSlugs, projectLinks] = await Promise.all([
    fetchArticlesSlugs(),
    fetchProjectsLinks()
  ]);

  const articlesUrls = articlesSlugs.map((slug: string) => {
    return {
      url: `${MAIN_URL}/articles/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    }
  });

  const projectUrls = projectLinks.map((link: string) => {
    return {
      url: link,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    }
  });

  return [
    {
      url: `${MAIN_URL}`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: `${MAIN_URL}/NNYM_Resume.pdf`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${MAIN_URL}/articles`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    ...articlesUrls,
    {
      url: `${MAIN_URL}/projects`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    ...projectUrls
  ]
}