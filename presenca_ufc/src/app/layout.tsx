import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from './providers'
import './globals.css'
import { cookies } from 'next/headers'
import Header from '@/components/header'

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
  const isAuthenticated = cookies().get('token-ufc')?.value
  return (
    <html lang="pt-br">
      <body className={`container-content ${inter.className}`}>
        <Providers>
          { isAuthenticated && <Header /> }
          {children}
        </Providers>
      </body>
    </html>
  )
}
