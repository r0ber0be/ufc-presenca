import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from './providers'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'UFC Presenças',
    template: '%s | UFC Presenças'
  },
  description: 'Projeto de cadastro de presenças',
  icons: 'https://www.infoenem.com.br/wp-content/uploads/2012/10/ufc_simbol.png'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-br">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
