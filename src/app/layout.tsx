import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Radico Field Data Collection',
  description: 'Mobile-first PWA for Radico Khaitan field sales data collection',
  manifest: '/radico-field-pwa/manifest.json',
  themeColor: '#3b82f6',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Radico Field'
  },
  icons: {
    icon: '/radico-field-pwa/icons/icon-192x192.png',
    apple: '/radico-field-pwa/icons/icon-192x192.png'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Radico Field" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="manifest" href="/radico-field-pwa/manifest.json" />
      </head>
      <body className="min-h-screen bg-gray-50">
        <div id="app-container" className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}
