import type { Metadata } from 'next'
import { Inter, Fraunces, Tiro_Devanagari_Hindi } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces', display: 'swap' })
const deva = Tiro_Devanagari_Hindi({
  weight: '400',
  subsets: ['devanagari'],
  variable: '--font-deva',
  display: 'swap',
})

const SITE_URL = 'https://anushka-portfolio-i7xi.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Anushka Purwar - AI Product Manager',
  description:
    'Anushka Purwar - AI PM at Glance (InMobi), builder, founder’s-office operator. BITS Pilani ’27.',
  keywords: ['Anushka Purwar', 'AI Product Manager', 'AI PM', 'Founder’s Office', 'BITS Pilani'],
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: 'Anushka Purwar - AI Product Manager',
    description: 'Welcome to AnushkaLand. This Barbie builds AI products.',
    url: SITE_URL,
    siteName: 'AnushkaLand',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Anushka Purwar - AI Product Manager · AnushkaLand',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Anushka Purwar - AI Product Manager',
    description: 'Welcome to AnushkaLand. This Barbie builds AI products.',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable} ${deva.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  )
}
