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
    <html lang={'en'} data-theme={'dark'}>
      <body className={localPixelify.className}>
        <Providers>
          <AppBar />
          <main className={'flex min-h-[calc(100vh-64px)] flex-col px-[60px]'}>
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}
