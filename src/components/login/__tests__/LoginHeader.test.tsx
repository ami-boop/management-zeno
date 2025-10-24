import { screen, render } from '@testing-library/react'
import LoginHeader from '../LoginHeader'

describe('LoginHeader', () => {
  it('renders correctly', () => {
    render(<LoginHeader />)
    expect(screen.getByRole('heading')).toHaveTextContent('title')
    expect(screen.getByTestId('svg-icon')).toBeInTheDocument()
  })
})
