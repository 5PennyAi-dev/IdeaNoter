import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'IdeaNoter',
  description: 'Une application simple pour prendre des notes',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="font-sans bg-gray-100">{children}</body>
    </html>
  )
}
