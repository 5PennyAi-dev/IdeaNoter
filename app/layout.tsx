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
      <body className="font-sans bg-gray-100">{children}</body>
    </html>
  )
}
