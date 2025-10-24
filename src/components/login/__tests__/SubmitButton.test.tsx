import { render, screen } from '@testing-library/react'
import SubmitButton from '../SubmitButton'

describe('SubmitButton', () => {

  it('renders correctly', () => {
    render(<SubmitButton isSubmitting={false} isDisabled={false} />)
    const button = screen.getByRole('button')

    expect(button).toBeEnabled()
    expect(button).toHaveClass('bg-red-600 text-white hover:bg-red-700')
    expect(screen.getByText('signInButton')).toBeInTheDocument()
  })

  it('works correctly depending on props', () => {
    render(<SubmitButton isSubmitting={true} isDisabled={true} />)
    const button = screen.getByRole('button')

    expect(button).toBeDisabled()
    expect(button).toHaveClass('bg-gray-400 text-white cursor-not-allowed')
    expect(screen.queryByText('signInButton')).not.toBeInTheDocument()
    expect(screen.getByText(/signingIn/i)).toBeInTheDocument()
  })
})
