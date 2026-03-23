import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://cardata.wiki'

  const [makes, models, variants] = await Promise.all([
    prisma.make.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.model.findMany({ select: { slug: true, make: { select: { slug: true } }, updatedAt: true } }),
    prisma.modelVariant.findMany({ select: { slug: true, model: { select: { slug: true, make: { select: { slug: true } } } }, updatedAt: true } }),
  ])

  const static_: MetadataRoute.Sitemap = [
    { url: base,            lastModified: new Date(), changeFrequency: 'daily',   priority: 1.0 },
    { url: `${base}/makes`, lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${base}/api-docs`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
  ]

  const makeUrls: MetadataRoute.Sitemap = makes.map(m => ({
    url: `${base}/${m.slug}`,
    lastModified: m.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.9,
  }))

  const modelUrls: MetadataRoute.Sitemap = models.map(m => ({
    url: `${base}/${m.make.slug}/${m.slug}`,
    lastModified: m.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const variantUrls: MetadataRoute.Sitemap = variants.map(v => ({
    url: `${base}/${v.model.make.slug}/${v.model.slug}/${v.slug}`,
    lastModified: v.updatedAt,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [...static_, ...makeUrls, ...modelUrls, ...variantUrls]
}
