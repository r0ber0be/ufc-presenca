import { render, screen } from '@testing-library/react'
import Home from '@/app/page'

describe('Home', () => {
  it('Deveria renderizar o cabeçalho', () => {
    render(<Home/>)
    const heading = screen.getByRole('heading', { 
      name: /Home page/i,
    })

    expect(heading).toBeInTheDocument()
  })
})