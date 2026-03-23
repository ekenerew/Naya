import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import { DiasporaProvider, DiasporaBanner } from '@/components/features/DiasporaMode'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: { default: 'Naya — Find Property in Port Harcourt, Nigeria', template: '%s | Naya' },
  description: "Find verified properties for rent, sale, and shortlet in Port Harcourt. RSSPC-verified agents and AI valuations.",
  keywords: ['property', 'Port Harcourt', 'real estate', 'rent', 'buy', 'Nigeria'],
  metadataBase: new URL('https://naya-fawn.vercel.app'),
  openGraph: { siteName: 'Naya Real Estate', locale: 'en_NG', type: 'website' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&family=Outfit:wght@200;300;400;500;600;700&family=DM+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen flex flex-col">
        <DiasporaProvider>
        <DiasporaBanner />
        <Navbar />
        <main className="flex-1 pt-16 md:pt-[68px]">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
