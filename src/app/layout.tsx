import './globals.css'
import '@rainbow-me/rainbowkit/styles.css'
import localFont from 'next/font/local'
import AppBar from '@/components/AppBar'
import { Providers } from '@/components/providers'
import type { Metadata, Viewport } from 'next'

const localPixelify = localFont({ src: '../fonts/pixelmix.ttf' })

export const metadata: Metadata = {
  title: 'Preotc',
  description: 'Preotc',
}

export const viewport: Viewport = {
  themeColor: '#000000',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang={'en'}>
      <body className={localPixelify.className}>
        <Providers>
          <AppBar />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  )
}
