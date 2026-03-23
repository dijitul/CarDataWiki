import type { Metadata } from 'next'
import './globals.css'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { auth } from '@/lib/auth'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://cardata.wiki'),
  title: {
    template: '%s | cardata.wiki',
    default: 'cardata.wiki — Free Vehicle Specifications Database',
  },
  description:
    'Free, community-edited vehicle specifications database. Technical data for 30,000+ car variants — engine specs, performance, dimensions, fuel economy. Free CSV download. Developer API available.',
  keywords: ['car specifications', 'vehicle specs database', 'car data', 'automotive database', 'car specs API'],
  authors: [{ name: 'cardata.wiki' }],
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://cardata.wiki',
    siteName: 'cardata.wiki',
    title: 'cardata.wiki — Free Vehicle Specifications Database',
    description: 'Technical data for 30,000+ vehicle variants. Free CSV download. Developer API.',
    images: [{ url: '/og-default.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'cardata.wiki — Free Vehicle Specifications Database',
    description: 'Technical data for 30,000+ vehicle variants. Free CSV download. Developer API.',
  },
  robots: { index: true, follow: true },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Nav session={session} />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
