import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'IdeaNoter',
  description: 'Une application simple pour prendre des notes',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'IdeaNoter',
  },
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className="font-sans bg-gray-100">{children}</body>
    </html>
  )
}
