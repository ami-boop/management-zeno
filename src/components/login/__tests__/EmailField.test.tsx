import { screen, render } from '@testing-library/react'
import EmailField from '../EmailField'
import userEvent from '@testing-library/user-event'

const onChange = jest.fn()

describe('UsernameField', () => {

  beforeEach(() => {
    jest.clearAllMocks()
    render(<EmailField value='test' onChange={onChange} />)
  })

  it('renders correctly', () => {
    expect(screen.getByText('emailLabel')).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toHaveValue('test')
  })

  it('input calls onChange', async () => {
    const user = userEvent.setup()
    const input = screen.getByRole('textbox')

    await user.type(input, 'a')

    expect(onChange).toHaveBeenCalled()
  })
})
