import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { Toaster } from 'sonner';

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Eclerx Picnics',
  description: 'Eclerx Picnic Register yourself be the part and enjoy .',
  icons: {
    icon: [
      {
        url: '/eclerx.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/eclerx.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/eclerx.png',
        type: 'image/svg+xml',
      },
    ],
    apple: '/eclerx.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
         <Toaster richColors closeButton />
        <Analytics />
      </body>
    </html>
  )
}
