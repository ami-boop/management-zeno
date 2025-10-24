import { screen, render } from '@testing-library/react'
import PasswordField from '../PasswordField'
import userEvent from '@testing-library/user-event'

describe('PasswordField', () => {

  const onChange = jest.fn()

  it('show/hide password works correctly', async () => {
    const user = userEvent.setup()
    render(<PasswordField value='test' onChange={onChange} />)
    const button = screen.getByRole('button')
    const input = screen.getByPlaceholderText('passwordPlaceholder')

    expect(input).toHaveAttribute('type', 'password')
    expect(screen.getByTestId('eye-closed-icon')).toBeInTheDocument()
    await user.click(button)

    expect(input).toHaveAttribute('type', 'text')
    expect(screen.queryByTestId('eye-closed-icon')).not.toBeInTheDocument()
    expect(screen.getByTestId('eye-icon')).toBeInTheDocument()
  })

  it('input works correctly', async () => {
    const user = userEvent.setup()
    render(<PasswordField value='test' onChange={onChange} />)
    const input = screen.getByPlaceholderText('passwordPlaceholder')

    expect(input).toHaveValue('test')
    await user.type(input, 't')

    expect(onChange).toHaveBeenCalled()
  })
})
