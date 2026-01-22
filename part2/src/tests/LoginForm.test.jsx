import { screen, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginForm from '../components/LoginForm'

describe('<LoginForm />', () => {
  test('update parent states and calls onSubmit', async () => {
    const user = userEvent.setup()
    const mockHandler = vi.fn()

    render(<LoginForm userLogin={mockHandler} />)

    const usernameInput = screen.getByLabelText('username')
    const passwordInput = screen.getByLabelText('password')
    const loginButton = screen.getByRole('button', { name: 'login' })

    await user.type(usernameInput, 'Godzilla')
    await user.type(passwordInput, 'r123456')
    await user.click(loginButton)

    expect(mockHandler.mock.calls).toHaveLength(1)
    expect(mockHandler.mock.calls[0][0]).toBe('Godzilla')
    expect(mockHandler.mock.calls[0][1]).toBe('r123456')
  })
})