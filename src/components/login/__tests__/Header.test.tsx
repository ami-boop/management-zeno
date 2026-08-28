import { screen, render } from '@testing-library/react'
import Header from '../Header'

describe('LoginHeader', () => {
  it('renders correctly', () => {
    render(<Header />)
    expect(screen.getByRole('heading')).toHaveTextContent('title')
    expect(screen.getByTestId('login-logo')).toBeInTheDocument()
  })
})
