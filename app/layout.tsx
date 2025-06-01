import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Authenticated App',
  description: 'Created By Md Kamruzzaman',
  generator: 'Md Kamruzzaman',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
