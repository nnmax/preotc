import './globals.css'
import '@rainbow-me/rainbowkit/styles.css'
import localFont from 'next/font/local'
import { Bounce, ToastContainer } from 'react-toastify'
import AppBar from '@/components/AppBar'
import { Providers } from '@/components/providers'
import Footer from '@/components/Footer'
import type { Metadata, Viewport } from 'next'

const localPixelify = localFont({ src: '../fonts/pixelmix.ttf' })

export const metadata: Metadata = {
  title: 'PreOTC: A Better Market For Advance Trading',
  description: 'A Better Market For Advance Trading',
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
          <main
            className={
              'flex min-h-[calc(100vh-64px-64px)] justify-center px-14 pb-6'
            }
          >
            <div className={'flex w-full max-w-[1684px] flex-col'}>
              {children}
            </div>
          </main>
          <Footer />
          <ToastContainer draggable transition={Bounce} />
        </Providers>
      </body>
    </html>
  )
}
