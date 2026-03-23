import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard', '/admin', '/api/v1/', '/api/auth/', '/api/stripe/'],
      },
    ],
    sitemap: 'https://cardata.wiki/sitemap.xml',
  }
}
