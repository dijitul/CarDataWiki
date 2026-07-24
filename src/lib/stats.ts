import { unstable_cache } from 'next/cache'
import { prisma } from './prisma'

/**
 * Site-wide row counts, cached for an hour so we don't hit the DB on every
 * page render (the footer uses these on every page).
 */
export const getSiteCounts = unstable_cache(
  async () => {
    const [makes, models, variants] = await Promise.all([
      prisma.make.count(),
      prisma.model.count(),
      prisma.modelVariant.count(),
    ])
    return { makes, models, variants }
  },
  ['site-counts'],
  { revalidate: 3600 },
)
