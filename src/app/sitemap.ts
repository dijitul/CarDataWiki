import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://cardata.wiki'

  const [makes, models, variants] = await Promise.all([
    prisma.make.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.model.findMany({
      select: { slug: true, groupSlug: true, updatedAt: true, make: { select: { slug: true } } },
    }),
    prisma.modelVariant.findMany({
      select: {
        slug: true, updatedAt: true,
        model: { select: { slug: true, groupSlug: true, make: { select: { slug: true } } } },
      },
    }),
  ])

  const static_: MetadataRoute.Sitemap = [
    { url: base,              lastModified: new Date(), changeFrequency: 'daily',   priority: 1.0 },
    { url: `${base}/makes`,   lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${base}/api-docs`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
  ]

  const makeUrls: MetadataRoute.Sitemap = makes.map(m => ({
    url: `${base}/${m.slug}`,
    lastModified: m.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.9,
  }))

  // Deduplicated group pages (one entry per make+group combo)
  const groupSeen = new Set<string>()
  const groupUrls: MetadataRoute.Sitemap = models
    .filter(m => {
      const key = `${m.make.slug}/${m.groupSlug ?? m.slug}`
      if (groupSeen.has(key)) return false
      groupSeen.add(key)
      return true
    })
    .map(m => ({
      url: `${base}/${m.make.slug}/${m.groupSlug ?? m.slug}`,
      lastModified: m.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    }))

  const modelUrls: MetadataRoute.Sitemap = models.map(m => ({
    url: `${base}/${m.make.slug}/${m.groupSlug ?? m.slug}/${m.slug}`,
    lastModified: m.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const variantUrls: MetadataRoute.Sitemap = variants.map(v => ({
    url: `${base}/${v.model.make.slug}/${v.model.groupSlug ?? v.model.slug}/${v.model.slug}/${v.slug}`,
    lastModified: v.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...static_, ...makeUrls, ...groupUrls, ...modelUrls, ...variantUrls]
}
