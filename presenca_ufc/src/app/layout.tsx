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

export default function RootLayout({ children, }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <head content-type='utf-8'>
        <meta name="theme-color" content="#ffffff" />
        {/* Preload de recursos críticos */}
        <link rel="preconnect" href="http://localhost:3333" />
        <link rel="dns-prefetch" href="https://lh3.googleusercontent.com" />
      </head>
      <body className={`${inter.className}`}>
        <Provider>{children}</Provider>
      </body>
    </html>
  )
}
