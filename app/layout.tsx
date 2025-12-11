import type { Metadata } from 'next'
import './globals.css'
import PWARegister from './pwa-register'
import ChunkErrorHandler from './chunk-error-handler'

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Athletixy - Gestión de Atletas',
  description: 'Plataforma completa para la gestión de atletas',
  manifest: '/manifest.json',
  themeColor: '#000000',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Athletixy',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/icon-192.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="bg-white dark:bg-zinc-900 text-black dark:text-zinc-100 antialiased transition-colors duration-200">
        <ChunkErrorHandler />
        <PWARegister />
        {children}
      </body>
    </html>
  )
}

