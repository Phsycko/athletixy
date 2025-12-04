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
    <html lang="es">
      <body className="bg-white text-black antialiased">
        {children}
      </body>
    </html>
  )
}

