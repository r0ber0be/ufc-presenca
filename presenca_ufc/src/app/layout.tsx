import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Provider } from './provider'

const inter = Inter({ subsets: ['latin'], weight: '400' })

export const metadata: Metadata = {
  applicationName: 'UFC Presenças',
  title: {
    default: 'UFC Presenças',
    template: '%s | UFC Presenças'
  },
  description: 'Projeto de cadastro automatizado de presenças no SIGAA.',
  authors: [{ name:'Robson Lopes Cavalcante', url: 'https://github.com/r0ber0be' }],
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: true,
      follow: false,
      noimageindex: true
    }
  }
}

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode }>) {
  const preconnectApiUrl = process.env.NEXT_PUBLIC_API_URL

  return (
    <html lang="pt-br" suppressHydrationWarning>
      <head content-type='utf-8'>
        <meta name="theme-color" content="#ffffff" />
        {/* Preload de recursos críticos */}
        {preconnectApiUrl ? <link rel="preconnect" href={preconnectApiUrl} /> : null}
        <link rel="dns-prefetch" href="https://lh3.googleusercontent.com" />
        <meta name="apple-mobile-web-app-title" content="Presença" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icon.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="shortcut icon" href="icon.png" />
      </head>
      <body className={`${inter.className}`}>
        <Provider>{children}</Provider>
      </body>
    </html>
  )
}
