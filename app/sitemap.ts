import { MetadataRoute } from 'next'

const MAIN_URL = process.env.MAIN_URL;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    {
      url: `${MAIN_URL}`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
  ]
}