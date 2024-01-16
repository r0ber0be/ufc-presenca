import { fireEvent, render, screen } from '@testing-library/react'
import PressButton from '@/components/button'

describe('Button', () => {
  it('Deveria renderizar o botão', () => {
		render(<PressButton/>)
		const button = screen.getByRole('button', {
			name: /Clique aqui/i
		})
		expect(button).toBeInTheDocument()
	})

	it('Deveria clicar no botão', () => {
		window.alert = () => {}
		const alertMock = jest.spyOn(window, 'alert')
		render(<PressButton/>)
		const button = screen.getByRole('button', {
			name: /Clique aqui/
		})

		fireEvent.click(button)
		expect(alertMock).toHaveBeenCalledTimes(1)
		expect(alertMock).toHaveBeenCalledWith('Botão clicado com sucesso!')
		alertMock.mockRestore()
	})
})