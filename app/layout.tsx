import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Athletixy - Gestión de Atletas',
  description: 'Plataforma completa para la gestión de atletas',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="bg-white dark:bg-zinc-900 text-black dark:text-zinc-100 antialiased transition-colors duration-200">
        {children}
      </body>
    </html>
  )
}

