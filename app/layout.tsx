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

export const metadata: Metadata = {
  title: 'Anushka Purwar — Product Manager',
  description:
    'Anushka Purwar — PM, builder, founder’s-office operator. BITS Pilani ’27.',
  keywords: ['Anushka Purwar', 'Product Manager', 'AI PM', 'Founder’s Office', 'BITS Pilani'],
  openGraph: {
    title: 'Anushka Purwar — Product Manager',
    description: 'Welcome to AnushkaLand. This Barbie loves building products.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable} ${deva.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  )
}
