import { screen, render } from '@testing-library/react'
import Header from '../Header'

describe('Header', () => {

  const mockLastUpdate = "2024-10-27 20:53:20"

  it('renders correctly', () => {
    render(<Header lastUpdated={mockLastUpdate} />)

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('title')
    expect(screen.getByText('description')).toBeInTheDocument()
    expect(screen.getByTestId('clock-icon')).toBeInTheDocument()
    expect(screen.getByText(`lastUpdated: ${mockLastUpdate}`)).toBeInTheDocument()
  })
})
