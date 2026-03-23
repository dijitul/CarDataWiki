import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { Providers } from '@/components/providers/Providers'

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-C5LM030895"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-C5LM030895');
        `}</Script>
      </head>
      <body className="min-h-screen flex flex-col">
        <Providers>
          <Nav />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
