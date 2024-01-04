import { Tinos } from 'next/font/google'
import PressButton from './components/button'

const tinos = Tinos({ subsets: ['latin'], weight: "400" })

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className={tinos.className}>UFC - UNIVERSIDADE FEDERAL DO CEARÁ</h1>
      <p>Lista de turmas</p>
      <PressButton />
    </main>
  )
}
